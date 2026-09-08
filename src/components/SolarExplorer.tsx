import {
  createEffect,
  createMemo,
  createSignal,
  createUniqueId,
  For,
  onCleanup,
  Show,
} from "solid-js"
import { dayEvents, dayTrack, localToUtc, solarPosition } from "@lib/solar"
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

/** Reference year for every curve in the explorer. Non-leap, so day-of-year is stable. */
const YEAR = 2026

type View = "cartesian" | "polar"

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

function fromDoy(doy: number) {
  const d = new Date(Date.UTC(YEAR, 0, 1 + doy))
  return { month: d.getUTCMonth(), day: d.getUTCDate() }
}

function toDoy(month: number, day: number) {
  return Math.round((Date.UTC(YEAR, month, day) - Date.UTC(YEAR, 0, 1)) / 86400000)
}

function clock(minutes: number | null): string {
  if (minutes === null || !Number.isFinite(minutes)) return "--:--"
  const m = ((Math.round(minutes) % 1440) + 1440) % 1440
  return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`
}

function duration(minutes: number): string {
  const m = Math.round(minutes)
  return `${Math.floor(m / 60)}h ${String(m % 60).padStart(2, "0")}m`
}

const dateLabel = (doy: number) => {
  const { month, day } = fromDoy(doy)
  return `${day} ${MONTHS[month]}`
}

/** Signed degrees, e.g. "-91.1°". */
const deg = (d: number, digits = 1) => `${d >= 0 ? "" : "−"}${Math.abs(d).toFixed(digits)}°`

type Pt = { x: number; y: number }

/**
 * Join points into one path, breaking wherever the predicate rejects a sample —
 * or where `split` says two kept samples are not really neighbours, which is how
 * an arc that runs off one edge of the azimuth scale and back on at the other
 * avoids being drawn as a line straight across the plot.
 */
function segments<T>(
  items: T[],
  keep: (t: T) => boolean,
  project: (t: T) => Pt,
  split?: (prev: T, cur: T) => boolean
): string {
  let d = ""
  let open = false
  let prev: T | undefined
  for (const item of items) {
    if (!keep(item)) {
      open = false
      prev = undefined
      continue
    }
    if (open && prev !== undefined && split?.(prev, item)) open = false
    const p = project(item)
    d += `${open ? "L" : "M"}${p.x.toFixed(1)} ${p.y.toFixed(1)} `
    open = true
    prev = item
  }
  return d.trim()
}

export default function SolarExplorer(props: { lat?: number; lon?: number; place?: string }) {
  // Props pin a figure to one location; otherwise it follows the page control.
  const shared = usePlace()
  const lat = () => props.lat ?? shared().lat
  const lon = () => props.lon ?? shared().lon
  const place = () => props.place ?? shared().label
  const zone = () => shared().zone

  const [view, setView] = createSignal<View>("cartesian")
  const [showTable, setShowTable] = createSignal(false)

  /** Date and time are shared with every other figure: one cursor, many sliders. */
  const cursor = useCursor()
  const doy = () => Math.min(364, Math.floor(cursor()))
  const minutes = () => Math.round((cursor() - Math.floor(cursor())) * 1440)
  const setDoy = (day: number) => setCursor(day + (cursor() - Math.floor(cursor())))
  const setMinutes = (m: number) => setCursor(doy() + Math.max(0, Math.min(1439, m)) / 1440)

  const id = createUniqueId()
  const owner = usePlaybackOwner()
  const playing = () => owner() === id

  /* ---------------------------------------------------------------- state */

  const today = createMemo(() => fromDoy(doy()))
  const track = createMemo(() => {
    const { month, day } = today()
    return dayTrack(YEAR, month, day, 4, lat(), lon(), zone())
  })
  const events = createMemo(() => {
    const { month, day } = today()
    return dayEvents(YEAR, month, day, lat(), lon(), zone())
  })
  const sun = createMemo(() => {
    const { month, day } = today()
    return solarPosition(localToUtc(YEAR, month, day, minutes(), lon(), zone()), lat(), lon())
  })

  /** The three days everyone has a name for, drawn as recessive guides. */
  const REFERENCE = [
    { doy: toDoy(5, 21), label: "21 Jun" },
    { doy: toDoy(2, 20), label: "20 Mar / 22 Sep" },
    { doy: toDoy(11, 21), label: "21 Dec" },
  ]
  const referenceTracks = createMemo(() =>
    REFERENCE.map((r) => {
      const { month, day } = fromDoy(r.doy)
      return { ...r, points: dayTrack(YEAR, month, day, 8, lat(), lon(), zone()) }
    })
  )

  /** The 21st of every month: the mesh of the sun-path diagram. */
  const monthTracks = createMemo(() =>
    MONTHS.map((_, m) => {
      const { month, day } = { month: m, day: 21 }
      return { month: m, points: dayTrack(YEAR, month, day, 6, lat(), lon(), zone()) }
    })
  )

  /** Each whole clock hour, sampled through the year: the analemma strands. */
  const hourLines = createMemo(() => {
    const out: { hour: number; points: { elevation: number; azimuth: number }[] }[] = []
    for (let h = 3; h <= 22; h++) {
      const points = []
      for (let d = 0; d < 365; d += 5) {
        const { month, day } = fromDoy(d)
        points.push(
          solarPosition(localToUtc(YEAR, month, day, h * 60, lon(), zone()), lat(), lon())
        )
      }
      if (points.some((p) => p.elevation > 0)) out.push({ hour: h, points })
    }
    return out
  })

  /* ------------------------------------------------------------ animation */

  // The component renders once on the server, where there is no rAF at all.
  let frame = 0
  let last = 0

  const stopFrame = () => {
    if (typeof cancelAnimationFrame !== "undefined") cancelAnimationFrame(frame)
  }

  /** One day of sun per DAY_MS of wall clock. */
  const DAY_MS = 8000

  const tick = (now: number) => {
    if (!playing()) return
    const dt = last ? Math.min(100, now - last) : 16
    last = now
    setCursor((c) => c + dt / DAY_MS)
    frame = requestAnimationFrame(tick)
  }

  const play = () => {
    stopFrame()
    if (playing()) {
      releasePlayback()
      return
    }
    claimPlayback(id)
    last = 0
    frame = requestAnimationFrame(tick)
  }

  const pause = () => {
    stopFrame()
    if (playing()) releasePlayback()
  }

  // Another figure claimed playback: stop this loop rather than fight over the cursor.
  createEffect(() => {
    if (owner() !== id) stopFrame()
  })

  onCleanup(stopFrame)

  /* ------------------------------------------------------- day plot scales */

  const DW = 680
  const DH = 320
  const dm = { l: 46, r: 18, t: 14, b: 30 }
  const EL_MIN = -14

  /** Top of the elevation axis: the local ceiling, rounded up to a tick. */
  const elMax = () => Math.ceil((maxElevation(lat()) + 4) / 15) * 15
  const elTicks = () => {
    const ticks = []
    for (let e = 0; e <= elMax() - 8; e += 15) ticks.push(e)
    return ticks
  }

  const dx = (m: number) => dm.l + (m / 1440) * (DW - dm.l - dm.r)
  const dy = (e: number) =>
    dm.t + ((elMax() - e) / (elMax() - EL_MIN)) * (DH - dm.t - dm.b)

  let dayPlot: SVGSVGElement | undefined
  const scrub = (ev: PointerEvent) => {
    if (!dayPlot) return
    const box = dayPlot.getBoundingClientRect()
    const u = ((ev.clientX - box.left) / box.width) * DW
    const frac = (u - dm.l) / (DW - dm.l - dm.r)
    setMinutes(Math.max(0, Math.min(1439, Math.round(frac * 1440))))
  }
  const onDown = (ev: PointerEvent) => {
    pause()
    ;(ev.currentTarget as Element).setPointerCapture(ev.pointerId)
    scrub(ev)
  }
  const onMove = (ev: PointerEvent) => {
    if (ev.buttons === 1) scrub(ev)
  }

  /* ------------------------------------------------------ path plot scales */

  const PW = 680
  const PH = 340
  const pm = { l: 46, r: 18, t: 16, b: 32 }

  /**
   * How far along the horizon the sun ever gets. Near the poles the summer sun
   * swings behind the observer, so a fixed +/-140 window would cut the arcs off.
   */
  const azMax = createMemo(() => {
    let widest = 100
    for (const m of monthTracks()) {
      for (const p of m.points) {
        if (p.elevation >= -0.5) widest = Math.max(widest, Math.abs(p.azimuth))
      }
    }
    return Math.min(180, Math.ceil((widest + 6) / 10) * 10)
  })

  const px = (a: number) => pm.l + ((a + azMax()) / (2 * azMax())) * (PW - pm.l - pm.r)
  const py = (e: number) => pm.t + ((elMax() - e) / (elMax() + 2)) * (PH - pm.t - pm.b)

  // Polar: horizon on the rim, zenith at the centre, south at the bottom so the
  // morning (negative) half falls on the left and the afternoon half on the right.
  const CX = PW / 2
  const CY = PH / 2 + 6
  const R = 150
  const rr = (e: number) => R * (1 - Math.max(0, e) / 90)
  const qx = (a: number, e: number) => CX + rr(e) * Math.sin((a * Math.PI) / 180)
  const qy = (a: number, e: number) => CY + rr(e) * Math.cos((a * Math.PI) / 180)

  const project = (p: { azimuth: number; elevation: number }): Pt =>
    view() === "polar"
      ? { x: qx(p.azimuth, p.elevation), y: qy(p.azimuth, p.elevation) }
      : { x: px(p.azimuth), y: py(p.elevation) }

  /**
   * Between the tropics the sun passes north at one solstice and south at the
   * other, so an arc can cross the +/-180 seam mid-day. Flat view only: in the
   * dome the two edges are the same place.
   */
  const wraps = (a: { azimuth: number }, b: { azimuth: number }) =>
    view() === "cartesian" && Math.abs(a.azimuth - b.azimuth) > 180

  const visible = (p: { azimuth: number; elevation: number }) =>
    p.elevation >= 0 && (view() === "polar" || Math.abs(p.azimuth) <= azMax())

  /** Azimuth ticks every 45 degrees out to whatever the sun reaches. */
  const azTicks = () => {
    const ticks = []
    for (let a = -135; a <= 135; a += 45) if (Math.abs(a) <= azMax()) ticks.push(a)
    return ticks
  }

  const tableRows = createMemo(() =>
    track().filter((p) => p.minutes % 60 === 0 && p.elevation > -1)
  )

  /* ------------------------------------------------------------------ view */

  return (
    <div class="solar-viz not-prose my-8 text-sm">
      {/* controls */}
      <div class="flex flex-wrap items-end gap-x-6 gap-y-3 mb-4">
        <label class="flex-1 min-w-[200px]">
          <span class="block text-xs uppercase tracking-wider opacity-70 mb-1">
            Date — <span class="tabular-nums">{dateLabel(doy())}</span>
          </span>
          <input
            type="range"
            min="0"
            max="364"
            step="1"
            class="w-full"
            aria-label="Day of the year"
            value={doy()}
            onInput={(e) => {
              pause()
              setDoy(+e.currentTarget.value)
            }}
          />
        </label>
        <label class="flex-1 min-w-[200px]">
          <span class="block text-xs uppercase tracking-wider opacity-70 mb-1">
            Clock time — <span class="tabular-nums">{clock(minutes())}</span>
          </span>
          <input
            type="range"
            min="0"
            max="1439"
            step="1"
            class="w-full"
            aria-label="Local clock time"
            value={minutes()}
            onInput={(e) => {
              pause()
              setMinutes(+e.currentTarget.value)
            }}
          />
        </label>
        <SolarLatitude />
        <div class="flex gap-2">
          <button
            type="button"
            class="px-2 py-1 rounded border border-black/15 dark:border-white/25 text-xs"
            aria-pressed={playing()}
            onClick={play}
          >
            {playing() ? "Pause" : "Run the day"}
          </button>
        </div>
      </div>

      {/* readout */}
      <dl class="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-2 mb-5 tabular-nums">
        <div>
          <dt class="text-xs uppercase tracking-wider opacity-70">Elevation</dt>
          <dd class="text-lg">{deg(sun().elevation)}</dd>
        </div>
        <div>
          <dt class="text-xs uppercase tracking-wider opacity-70">Azimuth</dt>
          <dd class="text-lg">{deg(sun().azimuth)}</dd>
        </div>
        <div>
          <dt class="text-xs uppercase tracking-wider opacity-70">Sunrise / sunset</dt>
          <dd class="text-lg">
            {clock(events().sunrise)} – {clock(events().sunset)}
          </dd>
        </div>
        <div>
          <dt class="text-xs uppercase tracking-wider opacity-70">Solar noon</dt>
          <dd class="text-lg">{clock(events().solarNoon)}</dd>
        </div>
      </dl>

      {/* ------------------------------------------------------- day plot */}
      <figure class="m-0">
        <svg
          ref={dayPlot}
          viewBox={`0 0 ${DW} ${DH}`}
          class="w-full h-auto touch-none select-none cursor-ew-resize"
          role="img"
          aria-label={`Solar elevation through ${dateLabel(doy())} in ${place()}`}
          onPointerDown={onDown}
          onPointerMove={onMove}
        >
          {/* night + golden-hour bands */}
          <rect
            x={dm.l}
            y={dy(0)}
            width={DW - dm.l - dm.r}
            height={dy(EL_MIN) - dy(0)}
            fill="var(--sv-night)"
          />
          <rect
            x={dm.l}
            y={dy(6)}
            width={DW - dm.l - dm.r}
            height={dy(0) - dy(6)}
            fill="var(--sv-golden)"
          />

          {/* elevation gridlines */}
          <For each={elTicks()}>
            {(e) => (
              <>
                <line
                  x1={dm.l}
                  x2={DW - dm.r}
                  y1={dy(e)}
                  y2={dy(e)}
                  stroke={e === 0 ? "var(--sv-axis)" : "var(--sv-grid)"}
                  stroke-width={e === 0 ? 1.5 : 1}
                />
                <text
                  x={dm.l - 8}
                  y={dy(e) + 4}
                  text-anchor="end"
                  font-size="11"
                  fill="var(--sv-muted)"
                >
                  {e}°
                </text>
              </>
            )}
          </For>

          {/* hour ticks */}
          <For each={[0, 3, 6, 9, 12, 15, 18, 21, 24]}>
            {(h) => (
              <text
                x={dx(h * 60)}
                y={DH - 10}
                text-anchor="middle"
                font-size="11"
                fill="var(--sv-muted)"
              >
                {String(h).padStart(2, "0")}
              </text>
            )}
          </For>

          {/* reference days */}
          <For each={referenceTracks()}>
            {(ref) => (
              <path
                d={segments(
                  ref.points,
                  (p) => p.elevation >= EL_MIN,
                  (p) => ({ x: dx(p.minutes), y: dy(p.elevation) })
                )}
                fill="none"
                stroke="var(--sv-muted)"
                stroke-width="1"
                stroke-dasharray="3 3"
              />
            )}
          </For>

          {/* the selected day */}
          <path
            d={segments(
              track(),
              (p) => p.elevation >= EL_MIN,
              (p) => ({ x: dx(p.minutes), y: dy(p.elevation) })
            )}
            fill="none"
            stroke="var(--sv-accent)"
            stroke-width="2"
            stroke-linecap="round"
          />

          {/* crosshair + sun */}
          <line
            x1={dx(minutes())}
            x2={dx(minutes())}
            y1={dm.t}
            y2={DH - dm.b}
            stroke="var(--sv-axis)"
            stroke-width="1"
          />
          <Show when={sun().elevation >= EL_MIN}>
            <circle
              cx={dx(minutes())}
              cy={dy(sun().elevation)}
              r="6"
              fill="var(--sv-accent)"
              stroke="var(--sv-surface)"
              stroke-width="2"
            />
          </Show>
          <text
            x={Math.min(dx(minutes()) + 6, DW - dm.r - 46)}
            y={dm.t + 12}
            font-size="11"
            fill="var(--sv-ink)"
          >
            {clock(minutes())}
          </text>
        </svg>
        <figcaption class="mt-2 text-xs opacity-70">
          Elevation through the day in {place()}. Dashed guides are the solstices and the
          equinox; the shaded band below 0° is night, the warm band the 0–6° golden hour.
          Drag to scrub.
        </figcaption>
      </figure>

      {/* ------------------------------------------------------ path plot */}
      <figure class="m-0 mt-8">
        <div class="flex justify-end gap-2 mb-2">
          <For each={["cartesian", "polar"] as View[]}>
            {(v) => (
              <button
                type="button"
                class="px-2 py-1 rounded border border-black/15 dark:border-white/25 text-xs capitalize"
                aria-pressed={view() === v}
                style={{ opacity: view() === v ? 1 : 0.55 }}
                onClick={() => setView(v)}
              >
                {v === "polar" ? "Sky dome" : "Flat"}
              </button>
            )}
          </For>
        </div>

        <svg
          viewBox={`0 0 ${PW} ${PH}`}
          class="w-full h-auto select-none"
          role="img"
          aria-label={`Sun path over the year in ${place()}, azimuth against elevation`}
        >
          <Show when={view() === "cartesian"}>
            <For each={azTicks()}>
              {(a) => (
                <>
                  <line
                    x1={px(a)}
                    x2={px(a)}
                    y1={pm.t}
                    y2={py(0)}
                    stroke={a === 0 ? "var(--sv-axis)" : "var(--sv-grid)"}
                  />
                  <text
                    x={px(a)}
                    y={PH - 12}
                    text-anchor="middle"
                    font-size="11"
                    fill="var(--sv-muted)"
                  >
                    {a === 0 ? "0° S" : a === -90 ? "−90° E" : a === 90 ? "+90° W" : deg(a, 0)}
                  </text>
                </>
              )}
            </For>
            <For each={elTicks()}>
              {(e) => (
                <>
                  <line
                    x1={pm.l}
                    x2={PW - pm.r}
                    y1={py(e)}
                    y2={py(e)}
                    stroke={e === 0 ? "var(--sv-axis)" : "var(--sv-grid)"}
                    stroke-width={e === 0 ? 1.5 : 1}
                  />
                  <text
                    x={pm.l - 8}
                    y={py(e) + 4}
                    text-anchor="end"
                    font-size="11"
                    fill="var(--sv-muted)"
                  >
                    {e}°
                  </text>
                </>
              )}
            </For>
          </Show>

          <Show when={view() === "polar"}>
            <For each={[0, 30, 60]}>
              {(e) => (
                <>
                  <circle
                    cx={CX}
                    cy={CY}
                    r={rr(e)}
                    fill="none"
                    stroke={e === 0 ? "var(--sv-axis)" : "var(--sv-grid)"}
                    stroke-width={e === 0 ? 1.5 : 1}
                  />
                  <text
                    x={CX + 4}
                    y={CY - rr(e) - 4}
                    font-size="11"
                    fill="var(--sv-muted)"
                  >
                    {e}°
                  </text>
                </>
              )}
            </For>
            <For each={[0, 45, 90, 135, 180, -135, -90, -45]}>
              {(a) => (
                <>
                  <line
                    x1={CX}
                    y1={CY}
                    x2={qx(a, 0)}
                    y2={qy(a, 0)}
                    stroke="var(--sv-grid)"
                  />
                  <text
                    x={CX + (R + 16) * Math.sin((a * Math.PI) / 180)}
                    y={CY + (R + 16) * Math.cos((a * Math.PI) / 180) + 4}
                    text-anchor="middle"
                    font-size="11"
                    fill="var(--sv-muted)"
                  >
                    {a === 0
                      ? "S 0°"
                      : a === -90
                        ? "E −90°"
                        : a === 90
                          ? "W +90°"
                          : Math.abs(a) === 180
                            ? "N ±180°"
                            : deg(a, 0)}
                  </text>
                </>
              )}
            </For>
          </Show>

          {/* the mesh: monthly arcs crossed by whole-hour strands */}
          <For each={hourLines()}>
            {(h) => (
              <path
                d={segments(h.points, visible, project, wraps)}
                fill="none"
                stroke="var(--sv-grid)"
                stroke-width="1"
              />
            )}
          </For>
          <For each={monthTracks()}>
            {(m) => (
              <path
                d={segments(m.points, visible, project, wraps)}
                fill="none"
                stroke="var(--sv-muted)"
                stroke-width={m.month === 5 || m.month === 11 ? 1.4 : 0.9}
                stroke-opacity={m.month === 5 || m.month === 11 ? 0.9 : 0.45}
              />
            )}
          </For>

          {/* the selected day */}
          <path
            d={segments(track(), visible, project, wraps)}
            fill="none"
            stroke="var(--sv-accent)"
            stroke-width="2"
            stroke-linecap="round"
          />
          <Show when={visible(sun())}>
            {(() => {
              const p = project(sun())
              return (
                <>
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r="6"
                    fill="var(--sv-accent)"
                    stroke="var(--sv-surface)"
                    stroke-width="2"
                  />
                  <text x={p.x + 10} y={p.y - 8} font-size="11" fill="var(--sv-ink)">
                    {deg(sun().azimuth, 0)} / {deg(sun().elevation, 0)}
                  </text>
                </>
              )
            })()}
          </Show>
        </svg>
        <figcaption class="mt-2 text-xs opacity-70">
          Where the sun sits in the sky over {place()}: azimuth against elevation, with the
          21st of each month drawn as an arc and each whole clock hour as a crossing strand.
          The heavy arcs are the two solstices — everything the sun ever does happens between
          them.
        </figcaption>
      </figure>

      {/* table view */}
      <details class="mt-4" onToggle={(e) => setShowTable(e.currentTarget.open)}>
        <summary class="text-xs uppercase tracking-wider opacity-70 cursor-pointer">
          The same day as numbers
        </summary>
        <Show when={showTable()}>
          <table class="mt-2 text-xs tabular-nums w-full max-w-sm">
            <thead>
              <tr class="text-left opacity-70">
                <th class="font-normal pr-4">Time</th>
                <th class="font-normal pr-4">Elevation</th>
                <th class="font-normal">Azimuth</th>
              </tr>
            </thead>
            <tbody>
              <For each={tableRows()}>
                {(r) => (
                  <tr>
                    <td class="pr-4">{clock(r.minutes)}</td>
                    <td class="pr-4">{deg(r.elevation)}</td>
                    <td>{deg(r.azimuth)}</td>
                  </tr>
                )}
              </For>
            </tbody>
          </table>
        </Show>
      </details>

      <p class="mt-3 text-xs opacity-60">
        {place()} · {Math.abs(lat()).toFixed(2)}° {lat() >= 0 ? "N" : "S"},{" "}
        {Math.abs(lon()).toFixed(2)}° {lon() >= 0 ? "E" : "W"} · elevation 0° at the horizon,
        azimuth 0° due south, negative before solar noon and positive after ·
        clock times are local ({YEAR}, CET/CEST) · day length {duration(events().dayLength)}
      </p>
    </div>
  )
}
