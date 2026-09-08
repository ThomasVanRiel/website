import {
  createEffect,
  createMemo,
  createSignal,
  createUniqueId,
  For,
  onCleanup,
  onMount,
} from "solid-js"
import {
  azimuthAt,
  dayEvents,
  elevationAt,
  hourAngleAt,
  solarTerms,
  zoneOffsetHours,
} from "@lib/solar"
import {
  claimPlayback,
  maxElevation,
  releasePlayback,
  setCursor,
  useCursor,
  usePlace,
  usePlaybackOwner,
} from "@lib/solarState"
import SolarLatitude from "@components/SolarLatitude"

/**
 * The year as one continuous curve.
 *
 * "clock"  angle = time of day, radius = day of year: the daily loop is one
 *          turn, and 365 of them wind outward into a spiral. Colour is elevation.
 * "coil"   the same year drawn in the sky itself (azimuth and elevation), where
 *          each day closes into a loop and the loops migrate between the two
 *          solstices — a ball of string rather than a spiral proper.
 */
type Mode = "clock" | "coil"

const YEAR = 2026
const SIZE = 720
const CX = SIZE / 2
const CY = SIZE / 2

// Spiral (clock) geometry
const R_IN = 78
const R_OUT = 300
// Sky (coil) geometry: the horizon sits at R_SKY, below-horizon runs outside it.
const R_SKY = 190
const EL_FLOOR = -45

const DAYS = 365
const TIME_STEPS = 180 // one sample every 8 minutes
const COIL_DAY_STEP = 5 // loops per year in the coil view; 1 floods into a solid band
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

const clock = (minutes: number | null) => {
  if (minutes === null || !Number.isFinite(minutes)) return "--:--"
  const m = ((Math.round(minutes) % 1440) + 1440) % 1440
  return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`
}

function fromDoy(doy: number) {
  const d = new Date(Date.UTC(YEAR, 0, 1 + doy))
  return { month: d.getUTCMonth(), day: d.getUTCDate() }
}

const dateLabel = (doy: number) => {
  const { month, day } = fromDoy(doy)
  return `${day} ${MONTHS[month]}`
}

/** Day-of-year of the 1st of each month, for the radial month scale. */
const MONTH_STARTS = MONTHS.map((_, m) =>
  Math.round((Date.UTC(YEAR, m, 1) - Date.UTC(YEAR, 0, 1)) / 86400000)
)

type Ramp = { stops: [number, [number, number, number]][]; night: [number, number, number] }

/**
 * Sequential single hue (amber), stepped for each surface; night is flat and
 * recessive. Stops are fractions of the local ceiling rather than fixed angles,
 * so the scale spans whatever the sun actually does at the chosen latitude.
 */
const RAMPS: Record<"light" | "dark", Ramp> = {
  light: {
    stops: [
      [0, [253, 240, 214]],
      [0.32, [244, 190, 108]],
      [0.64, [201, 116, 24]],
      [1, [124, 45, 18]],
    ],
    night: [232, 232, 228],
  },
  dark: {
    stops: [
      [0, [58, 36, 16]],
      [0.32, [146, 76, 15]],
      [0.64, [227, 150, 38]],
      [1, [253, 224, 148]],
    ],
    night: [21, 32, 46],
  },
}

/** `fraction` is elevation as a share of the local ceiling; <= 0 is night. */
function sample(ramp: Ramp, fraction: number): [number, number, number] {
  if (fraction <= 0) return ramp.night
  const { stops } = ramp
  for (let i = 1; i < stops.length; i++) {
    const [hi, cHi] = stops[i]
    const [lo, cLo] = stops[i - 1]
    if (fraction <= hi || i === stops.length - 1) {
      const t = Math.min(1, (fraction - lo) / (hi - lo))
      return [
        cLo[0] + (cHi[0] - cLo[0]) * t,
        cLo[1] + (cHi[1] - cLo[1]) * t,
        cLo[2] + (cHi[2] - cLo[2]) * t,
      ]
    }
  }
  return stops[stops.length - 1][1]
}

const rgb = (c: [number, number, number]) =>
  `rgb(${Math.round(c[0])} ${Math.round(c[1])} ${Math.round(c[2])})`

export default function SolarSpiral(props: { lat?: number; lon?: number; place?: string }) {
  // Props pin a figure to one location; otherwise it follows the page control.
  const shared = usePlace()
  const lat = () => props.lat ?? shared().lat
  const lon = () => props.lon ?? shared().lon
  const place = () => props.place ?? shared().label
  const zone = () => shared().zone
  /** Top of the colour scale: the highest the sun ever gets at this latitude. */
  const ceiling = () => maxElevation(lat())

  const [mode, setMode] = createSignal<Mode>("clock")
  const [dark, setDark] = createSignal(false)
  const [speed, setSpeed] = createSignal(1)

  /** Where the sun is: shared with every other figure on the page. */
  const cursor = useCursor()
  const id = createUniqueId()
  const owner = usePlaybackOwner()
  const playing = () => owner() === id

  const doy = () => Math.min(DAYS - 1, Math.floor(cursor()))
  /** Fraction of the day, i.e. where the sun sits on the current turn. */
  const dayFraction = () => cursor() - Math.floor(cursor())

  let base: HTMLCanvasElement | undefined
  let overlay: HTMLCanvasElement | undefined
  /** The painted spiral, cached off-screen so a frame is a clip plus a blit. */
  let sprite: HTMLCanvasElement | undefined

  /* ------------------------------------------------------------ the year */

  /** Per-day terms, hoisted so the sweeps below stay cheap. */
  const year = createMemo(() =>
    Array.from({ length: DAYS }, (_, d) => {
      const { month, day } = fromDoy(d)
      const noon = new Date(Date.UTC(YEAR, month, day, 12))
      const offset = zoneOffsetHours(zone(), lon(), noon)
      const { declination, eqTime } = solarTerms(noon)
      return { declination, eqTime, offset }
    })
  )

  /** elevation[day * TIME_STEPS + step], the grid the spiral is painted from. */
  const grid = createMemo(() => {
    const days = year()
    const out = new Float32Array(DAYS * TIME_STEPS)
    for (let d = 0; d < DAYS; d++) {
      const { declination, eqTime, offset } = days[d]
      for (let s = 0; s < TIME_STEPS; s++) {
        const minutes = (s / TIME_STEPS) * 1440
        out[d * TIME_STEPS + s] = elevationAt(
          lat(),
          declination,
          hourAngleAt(minutes, eqTime, offset, lon())
        )
      }
    }
    return out
  })

  const events = createMemo(() => {
    const { month, day } = fromDoy(doy())
    return dayEvents(YEAR, month, day, lat(), lon(), zone())
  })

  /* ------------------------------------------------------------ geometry */

  // Clock mode: midnight at the top, running clockwise; Jan 1 inside, 31 Dec outside.
  const angleOf = (fraction: number) => -Math.PI / 2 + fraction * 2 * Math.PI
  const radiusOf = (day: number) => R_IN + (day / DAYS) * (R_OUT - R_IN)

  // Coil mode: horizon on the circle of radius R_SKY, south at the bottom.
  const skyRadius = (elevation: number) =>
    R_SKY * (1 - Math.max(EL_FLOOR, Math.min(90, elevation)) / 90)
  const skyX = (az: number, el: number) => CX + skyRadius(el) * Math.sin((az * Math.PI) / 180)
  const skyY = (az: number, el: number) => CY + skyRadius(el) * Math.cos((az * Math.PI) / 180)

  const cssVar = (name: string, fallback: string) => {
    if (typeof window === "undefined" || !base) return fallback
    const v = getComputedStyle(base).getPropertyValue(name).trim()
    return v || fallback
  }

  /* ------------------------------------------------------------- drawing */

  /** The expensive layer: repainted only when the mode or theme changes. */
  const buildSprite = () => {
    const c = document.createElement("canvas")
    c.width = SIZE
    c.height = SIZE
    const ctx = c.getContext("2d")
    if (ctx) paintSpiral(ctx)
    sprite = c
  }

  /** The chart itself: painted once, then blitted. Nothing here animates. */
  const compose = () => {
    if (!base) return
    const ctx = base.getContext("2d")
    if (!ctx) return
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    if (base.width !== SIZE * dpr) {
      base.width = SIZE * dpr
      base.height = SIZE * dpr
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, SIZE, SIZE)

    if (mode() === "coil") {
      strokeCoil(ctx)
      return
    }

    if (!sprite) buildSprite()
    ctx.drawImage(sprite!, 0, 0, SIZE, SIZE)
  }

  /** Per-pixel paint: every point of the disc is one (day, time) pair. */
  const paintSpiral = (ctx: CanvasRenderingContext2D) => {
    const ramp = RAMPS[dark() ? "dark" : "light"]
    const g = grid()
    const img = ctx.createImageData(SIZE, SIZE)
    const data = img.data
    for (let y = 0; y < SIZE; y++) {
      const dy = y - CY
      for (let x = 0; x < SIZE; x++) {
        const dx = x - CX
        const r = Math.sqrt(dx * dx + dy * dy)
        if (r < R_IN || r > R_OUT) continue
        const day = Math.min(DAYS - 1, Math.floor(((r - R_IN) / (R_OUT - R_IN)) * DAYS))
        let f = (Math.atan2(dy, dx) + Math.PI / 2) / (2 * Math.PI)
        f -= Math.floor(f)
        const step = Math.min(TIME_STEPS - 1, Math.floor(f * TIME_STEPS))
        const [cr, cg, cb] = sample(ramp, g[day * TIME_STEPS + step] / ceiling())
        const i = (y * SIZE + x) * 4
        data[i] = cr
        data[i + 1] = cg
        data[i + 2] = cb
        data[i + 3] = 255
      }
    }
    ctx.putImageData(img, 0, 0)

    // The day/night edge, drawn as the two spirals it actually is.
    ctx.lineWidth = 1.5
    ctx.strokeStyle = cssVar("--sp-edge", "#0b0b0b")
    for (const which of ["sunrise", "sunset"] as const) {
      ctx.beginPath()
      for (let d = 0; d < DAYS; d++) {
        const { month, day } = fromDoy(d)
        const e = dayEvents(YEAR, month, day, lat(), lon(), zone())
        const m = e[which]
        if (m === null) continue
        const a = angleOf((m % 1440) / 1440)
        const r = radiusOf(d)
        const x = CX + r * Math.cos(a)
        const y = CY + r * Math.sin(a)
        if (d === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.stroke()
    }
  }

  /**
   * The year in the sky's own coordinates, one closed loop per day.
   *
   * Every fifth day only: at daily spacing consecutive loops are a fraction of a
   * pixel apart and the whole thing floods into a solid band, which shows the
   * envelope but destroys the winding that makes the figure worth drawing.
   */
  const strokeCoil = (ctx: CanvasRenderingContext2D) => {
    const days = year()
    ctx.lineWidth = 0.9
    ctx.strokeStyle = cssVar("--sp-coil", "rgba(120,113,108,0.4)")
    for (let d = 0; d < DAYS; d += COIL_DAY_STEP) {
      const { declination, eqTime, offset } = days[d]
      ctx.beginPath()
      for (let s = 0; s <= TIME_STEPS; s++) {
        const minutes = (s / TIME_STEPS) * 1440
        const h = hourAngleAt(minutes, eqTime, offset, lon())
        const el = elevationAt(lat(), declination, h)
        const az = azimuthAt(lat(), declination, h, el)
        const x = skyX(az, el)
        const y = skyY(az, el)
        if (s === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.stroke()
    }
  }

  /** The cheap layer: the highlighted day, redrawn on every slider move. */
  const drawOverlay = () => {
    if (!overlay) return
    const ctx = overlay.getContext("2d")
    if (!ctx) return
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    overlay.width = SIZE * dpr
    overlay.height = SIZE * dpr
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, SIZE, SIZE)

    const accent = cssVar("--sp-accent", "#c2410c")
    const ink = cssVar("--sp-ink", "#0b0b0b")
    const d = doy()
    const { declination, eqTime, offset } = year()[d]

    if (mode() === "clock") {
      const t = cursor()
      const r = radiusOf(t)
      const a = angleOf(dayFraction())

      // The day the sun is currently in: one full turn of the spiral.
      ctx.strokeStyle = accent
      ctx.globalAlpha = 0.35
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(CX, CY, r, 0, 2 * Math.PI)
      ctx.stroke()
      ctx.globalAlpha = 1

      // A short trail, so the direction of travel reads at a glance.
      ctx.lineWidth = 2.5
      ctx.lineCap = "round"
      ctx.beginPath()
      ctx.arc(CX, CY, r, a - TRAIL, a)
      ctx.stroke()

      ctx.fillStyle = accent
      ctx.strokeStyle = cssVar("--sp-surface", "#fafafa")
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(CX + r * Math.cos(a), CY + r * Math.sin(a), 5.5, 0, 2 * Math.PI)
      ctx.fill()
      ctx.stroke()

      ctx.strokeStyle = ink
      ctx.lineWidth = 1
      for (let m = 0; m < 12; m++) {
        const rm = radiusOf(MONTH_STARTS[m])
        ctx.beginPath()
        ctx.moveTo(CX + rm * Math.cos(angleOf(0)), CY + rm * Math.sin(angleOf(0)))
        ctx.lineTo(CX + (rm + 6) * Math.cos(angleOf(0)), CY + (rm + 6) * Math.sin(angleOf(0)))
        ctx.stroke()
      }
    } else {
      // One closed loop: a single day's circuit through the sky, night included.
      ctx.strokeStyle = accent
      ctx.lineWidth = 2
      ctx.beginPath()
      for (let s = 0; s <= TIME_STEPS; s++) {
        const minutes = (s / TIME_STEPS) * 1440
        const h = hourAngleAt(minutes, eqTime, offset, lon())
        const el = elevationAt(lat(), declination, h)
        const az = azimuthAt(lat(), declination, h, el)
        const x = skyX(az, el)
        const y = skyY(az, el)
        if (s === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.stroke()

      // The sun itself, on its loop.
      const hNow = hourAngleAt(dayFraction() * 1440, eqTime, offset, lon())
      const elNow = elevationAt(lat(), declination, hNow)
      const azNow = azimuthAt(lat(), declination, hNow, elNow)
      ctx.fillStyle = accent
      ctx.strokeStyle = cssVar("--sp-surface", "#fafafa")
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(skyX(azNow, elNow), skyY(azNow, elNow), 5.5, 0, 2 * Math.PI)
      ctx.fill()
      ctx.stroke()

      ctx.strokeStyle = ink
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.arc(CX, CY, R_SKY, 0, 2 * Math.PI)
      ctx.stroke()
      ctx.setLineDash([3, 4])
      ctx.lineWidth = 1
      for (const el of [30, 60]) {
        ctx.beginPath()
        ctx.arc(CX, CY, skyRadius(el), 0, 2 * Math.PI)
        ctx.stroke()
      }
      ctx.setLineDash([])
    }
  }

  /* ------------------------------------------------------------ animation */

  /** Length of the trail behind the sun, in radians of the daily turn. */
  const TRAIL = 0.55
  let frame = 0
  let last = 0

  const stopFrame = () => {
    if (typeof cancelAnimationFrame !== "undefined") cancelAnimationFrame(frame)
  }

  const step = (now: number) => {
    if (!playing()) return
    const dt = last ? Math.min(100, now - last) : 16
    last = now
    setCursor((c) => (c + (dt / 1000) * speed()) % DAYS)
    frame = requestAnimationFrame(step)
  }

  const togglePlay = () => {
    stopFrame()
    if (playing()) {
      releasePlayback()
      return
    }
    claimPlayback(id)
    last = 0
    frame = requestAnimationFrame(step)
  }

  const pause = () => {
    stopFrame()
    if (playing()) releasePlayback()
  }

  // Another figure claimed playback: stop this one's loop rather than fight it.
  createEffect(() => {
    if (owner() !== id) stopFrame()
  })

  onCleanup(stopFrame)

  /* ------------------------------------------------------------ lifecycle */

  onMount(() => {
    const root = document.documentElement
    setDark(root.classList.contains("dark"))
    const observer = new MutationObserver(() => setDark(root.classList.contains("dark")))
    observer.observe(root, { attributes: true, attributeFilter: ["class"] })
    onCleanup(() => observer.disconnect())
  })

  createEffect(() => {
    // Theme or location changes invalidate the painted spiral; mode only the frame.
    dark()
    lat()
    lon()
    zone()
    sprite = undefined
    mode()
    compose()
    drawOverlay()
  })

  createEffect(() => {
    // The per-frame path: the sun moved, so only the overlay is redrawn.
    cursor()
    mode()
    drawOverlay()
  })

  /* ----------------------------------------------------------------- view */

  const hourMarks = [0, 3, 6, 9, 12, 15, 18, 21]

  return (
    <div class="solar-spiral not-prose my-8 text-sm">
      <div class="mb-4 space-y-3">
        <div class="flex flex-wrap items-end gap-x-6 gap-y-3">
          <label class="flex-1 min-w-[220px]">
            <span class="block text-xs uppercase tracking-wider opacity-70 mb-1">
              Day — <span class="tabular-nums inline-block min-w-[4.5rem]">{dateLabel(doy())}</span>
            </span>
            <input
              type="range"
              min="0"
              max={DAYS - 1}
              step="1"
              class="w-full"
              aria-label="Day of the year"
              value={doy()}
              onInput={(e) => {
                pause()
                setCursor(+e.currentTarget.value + dayFraction())
              }}
            />
          </label>
          <label class="flex-1 min-w-[180px]">
            <span class="block text-xs uppercase tracking-wider opacity-70 mb-1">
              Time — <span class="tabular-nums inline-block min-w-[3.5rem]">{clock(dayFraction() * 1440)}</span>
            </span>
            <input
              type="range"
              min="0"
              max="1439"
              step="1"
              class="w-full"
              aria-label="Time of day"
              value={Math.round(dayFraction() * 1440)}
              onInput={(e) => {
                pause()
                setCursor(doy() + +e.currentTarget.value / 1440)
              }}
            />
          </label>
          <SolarLatitude />
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <button
            type="button"
            class="px-2 py-1 rounded border border-black/15 dark:border-white/25 text-xs"
            aria-pressed={playing()}
            onClick={togglePlay}
          >
            {playing() ? "Pause" : "Move the sun"}
          </button>
          <label class="text-xs flex items-center gap-1 opacity-70">
            <span class="sr-only">Speed</span>
            <select
              class="bg-transparent border border-black/15 dark:border-white/25 rounded px-1 py-1"
              value={speed()}
              onChange={(e) => setSpeed(+e.currentTarget.value)}
            >
              <option value="0.25">¼ day/s</option>
              <option value="1">1 day/s</option>
              <option value="5">5 days/s</option>
              <option value="20">20 days/s</option>
            </select>
          </label>
          <For each={["clock", "coil"] as Mode[]}>
            {(m) => (
              <button
                type="button"
                class="px-2 py-1 rounded border border-black/15 dark:border-white/25 text-xs"
                aria-pressed={mode() === m}
                style={{ opacity: mode() === m ? 1 : 0.55 }}
                onClick={() => setMode(m)}
              >
                {m === "clock" ? "Year spiral" : "Sky coil"}
              </button>
            )}
          </For>
        </div>
      </div>

      <figure class="m-0">
        <div class="relative w-full max-w-[560px] mx-auto aspect-square">
          <canvas
            ref={base}
            class="absolute inset-0 w-full h-full"
            aria-hidden="true"
          />
          <canvas
            ref={overlay}
            class="absolute inset-0 w-full h-full"
            role="img"
            aria-label={
              mode() === "clock"
                ? `A year of solar elevation in ${place()} wound into a spiral: one turn per day, ${dateLabel(doy())} highlighted`
                : `A year of the sun's path over ${place()} drawn as one continuous line, ${dateLabel(doy())} highlighted`
            }
          />
          {/* Hour labels ride outside the disc in the clock view. */}
          {mode() === "clock" && (
            <svg viewBox={`0 0 ${SIZE} ${SIZE}`} class="absolute inset-0 w-full h-full pointer-events-none">
              <For each={hourMarks}>
                {(h) => {
                  const a = angleOf(h / 24)
                  return (
                    <text
                      x={CX + (R_OUT + 22) * Math.cos(a)}
                      y={CY + (R_OUT + 22) * Math.sin(a) + 4}
                      text-anchor="middle"
                      font-size="14"
                      fill="var(--sp-muted)"
                    >
                      {String(h).padStart(2, "0")}
                    </text>
                  )
                }}
              </For>
              <text x={CX} y={CY + 5} text-anchor="middle" font-size="13" fill="var(--sp-muted)">
                Jan
              </text>
              <text
                x={CX}
                y={CY - R_OUT - 26}
                text-anchor="middle"
                font-size="13"
                fill="var(--sp-muted)"
              >
                Dec
              </text>
            </svg>
          )}
        </div>

        {/* Colour key. Without it "darker is higher" is guesswork. */}
        <div class="mt-4 flex flex-wrap items-end gap-x-6 gap-y-3">
          <div class="flex-1 min-w-[220px] max-w-[420px]">
            <div class="text-xs uppercase tracking-wider opacity-70 mb-1">
              Solar elevation
            </div>
            <div
              class="h-3 rounded-sm border border-black/10 dark:border-white/15"
              style={{
                background: `linear-gradient(to right, ${RAMPS[dark() ? "dark" : "light"].stops
                  .map(([at, c]) => `${rgb(c)} ${(at * 100).toFixed(0)}%`)
                  .join(", ")})`,
              }}
            />
            <div class="flex justify-between mt-1 text-xs opacity-70 tabular-nums">
              <For each={[0, 0.25, 0.5, 0.75, 1]}>
                {(f) => <span>{(f * ceiling()).toFixed(0)}°</span>}
              </For>
            </div>
          </div>
          <div class="flex items-center gap-2 text-xs opacity-70">
            <span
              class="inline-block w-6 h-3 rounded-sm border border-black/10 dark:border-white/15"
              style={{ background: rgb(RAMPS[dark() ? "dark" : "light"].night) }}
            />
            <span>Below the horizon</span>
          </div>
        </div>

        <figcaption class="mt-3 text-xs opacity-70">
          {mode() === "clock" ? (
            <>
              One year over {place()}, wound into a spiral: each turn is one day, the clock
              runs around the dial from midnight at the top, and the radius carries you from
              1 January at the centre to 31 December at the rim. The two lines running
              through the daylight are sunrise and sunset; the scale tops out at{" "}
              {ceiling().toFixed(1)}°, the highest the sun ever gets at this latitude. On{" "}
              {dateLabel(doy())}: {clock(events().sunrise)} to {clock(events().sunset)}.
            </>
          ) : (
            <>
              The same year drawn in the sky itself, as one unbroken line: azimuth around,
              elevation from the rim inward, with the horizon marked and night outside it.
              Every day closes into a loop, so the year is 365 loops migrating between the
              solstices and back — a wound ball of string rather than a spiral.
            </>
          )}
        </figcaption>
      </figure>
    </div>
  )
}
