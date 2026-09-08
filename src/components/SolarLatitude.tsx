import { placeWith, setPlace, usePlace } from "@lib/solarState"

/**
 * Latitude, repeated on every figure.
 *
 * It is the control that deforms the figures most, and scrubbing it is the whole
 * point, so it sits with each figure's own sliders rather than only in the
 * location block at the top. Every copy writes the same shared place.
 */
export default function SolarLatitude(props: { label?: string }) {
  const place = usePlace()
  const hemisphere = () => (place().lat >= 0 ? "N" : "S")

  return (
    <label class="flex-1 min-w-[180px]">
      <span class="block text-xs uppercase tracking-wider opacity-70 mb-1">
        {props.label ?? "Latitude"} —{" "}
        <span class="tabular-nums inline-block min-w-[4.5rem]">
          {Math.abs(place().lat).toFixed(1)}° {hemisphere()}
        </span>
      </span>
      <input
        type="range"
        min="-89.5"
        max="89.5"
        step="0.5"
        class="w-full"
        aria-label="Latitude"
        value={place().lat}
        onInput={(e) => setPlace(placeWith(place(), { lat: +e.currentTarget.value }))}
      />
    </label>
  )
}
