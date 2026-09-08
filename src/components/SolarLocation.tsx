import { For } from "solid-js"
import { PRESETS, placeWith, setPlace, usePlace, type Place } from "@lib/solarState"
import SolarLatitude from "@components/SolarLatitude"

/**
 * The page's location control. Every solar figure below it reads the same place,
 * so changing it here re-derives all of them.
 */
export default function SolarLocation() {
  // Subscribed, not local: the latitude sliders on the figures write here too.
  const place = usePlace()
  const apply = (next: Place) => setPlace(next)

  const preset = () =>
    PRESETS.find((p) => p.lat === place().lat && p.lon === place().lon)?.label ?? "custom"

  const edit = (field: "lat" | "lon", raw: string) => {
    const value = Number.parseFloat(raw)
    if (!Number.isFinite(value)) return
    apply(placeWith(place(), { [field]: value }))
  }

  return (
    <div class="solar-location not-prose my-6 p-4 rounded border border-black/15 dark:border-white/20">
      <div class="flex flex-wrap items-end gap-x-5 gap-y-3">
        <label class="min-w-[10rem]">
          <span class="block text-xs uppercase tracking-wider opacity-70 mb-1">Location</span>
          <select
            class="bg-transparent border border-black/15 dark:border-white/25 rounded px-2 py-1 w-full"
            value={preset()}
            onChange={(e) => {
              const found = PRESETS.find((p) => p.label === e.currentTarget.value)
              if (found) apply(found)
            }}
          >
            <For each={PRESETS}>{(p) => <option value={p.label}>{p.label}</option>}</For>
            {preset() === "custom" && <option value="custom">Custom</option>}
          </select>
        </label>

        <label class="w-28">
          <span class="block text-xs uppercase tracking-wider opacity-70 mb-1">Latitude</span>
          <input
            type="number"
            step="0.01"
            min="-89.5"
            max="89.5"
            class="bg-transparent border border-black/15 dark:border-white/25 rounded px-2 py-1 w-full tabular-nums"
            value={place().lat.toFixed(2)}
            onChange={(e) => edit("lat", e.currentTarget.value)}
          />
        </label>

        <label class="w-28">
          <span class="block text-xs uppercase tracking-wider opacity-70 mb-1">Longitude</span>
          <input
            type="number"
            step="0.01"
            min="-180"
            max="180"
            class="bg-transparent border border-black/15 dark:border-white/25 rounded px-2 py-1 w-full tabular-nums"
            value={place().lon.toFixed(2)}
            onChange={(e) => edit("lon", e.currentTarget.value)}
          />
        </label>
      </div>

      <div class="mt-4 flex">
        <SolarLatitude />
      </div>

      <p class="mt-3 text-xs opacity-60">
        Every figure below follows this location.{" "}
        {place().zone ? (
          <>
            Clock times are real civil times for <code>{place().zone}</code>, summer time
            included.
          </>
        ) : (
          <>
            Clock times are mean solar time for the {Math.abs(place().lon).toFixed(1)}°{" "}
            {place().lon >= 0 ? "E" : "W"} meridian — a hand-typed longitude has no time zone
            to look up, so no daylight saving is applied.
          </>
        )}{" "}
        Azimuth is always measured from due south; south of the equator the noon sun passes
        to the north, so it reads near ±180° rather than 0°.
      </p>
    </div>
  )
}
