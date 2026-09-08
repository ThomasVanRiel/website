import { createSignal, onCleanup, onMount, type Accessor } from "solid-js"
import { LEUVEN } from "@lib/solar"

export type Place = {
  label: string
  lat: number
  lon: number
  /** IANA zone, present only for known locations; without it there is no DST. */
  zone?: string
}

export const DEFAULT_PLACE: Place = {
  label: LEUVEN.label,
  lat: LEUVEN.lat,
  lon: LEUVEN.lon,
  zone: "Europe/Brussels",
}

/** A few latitudes that make the article's point, Leuven first. */
export const PRESETS: Place[] = [
  DEFAULT_PLACE,
  { label: "Reykjavík", lat: 64.15, lon: -21.94, zone: "Atlantic/Reykjavik" },
  { label: "Oslo", lat: 59.91, lon: 10.75, zone: "Europe/Oslo" },
  { label: "Madrid", lat: 40.42, lon: -3.7, zone: "Europe/Madrid" },
  { label: "Cairo", lat: 30.04, lon: 31.24, zone: "Africa/Cairo" },
  { label: "Quito", lat: -0.18, lon: -78.47, zone: "America/Guayaquil" },
  { label: "Cape Town", lat: -33.92, lon: 18.42, zone: "Africa/Johannesburg" },
  // Southern-hemisphere summer time: the DST step lands in September and April,
  // opposite Europe's, which is the whole point of having them here.
  { label: "Santiago", lat: -33.45, lon: -70.67, zone: "America/Santiago" },
  { label: "Melbourne", lat: -37.81, lon: 144.96, zone: "Australia/Melbourne" },
  { label: "Ushuaia", lat: -54.8, lon: -68.3, zone: "America/Argentina/Ushuaia" },
]

/**
 * Shared page state for every solar figure: where we are, and when.
 *
 * Each figure is its own hydration island, so this cannot live in module scope
 * alone — two islands may hold two instances of this module. It lives on
 * `window` instead, with DOM events as the change channel, which also means the
 * sliders in one figure drive the sliders in all the others.
 */
type Holder = {
  __solarPlace?: Place
  __solarCursor?: number
  __solarPlayer?: string
}

const PLACE_EVENT = "solar:place"
const CURSOR_EVENT = "solar:cursor"
const PLAY_EVENT = "solar:play"

export const DAYS_IN_YEAR = 365
/** Where the sun is, in fractional days since 1 January of the reference year. */
const DEFAULT_CURSOR = 171 + 14 / 24

function shared<T>(key: keyof Holder, fallback: T): T {
  if (typeof window === "undefined") return fallback
  const value = (window as Holder)[key]
  return (value ?? fallback) as T
}

function publish<T>(key: keyof Holder, event: string, value: T): void {
  if (typeof window === "undefined") return
  ;(window as Holder)[key] = value as never
  window.dispatchEvent(new CustomEvent<T>(event, { detail: value }))
}

/** Subscribe to a shared value; the listener is what keeps the figures in step. */
function useShared<T>(read: () => T, event: string): Accessor<T> {
  const [value, setLocal] = createSignal<T>(read())

  onMount(() => {
    setLocal(() => read())
    const onChange = (e: Event) => setLocal(() => (e as CustomEvent<T>).detail)
    window.addEventListener(event, onChange)
    onCleanup(() => window.removeEventListener(event, onChange))
  })

  return value
}

export const getPlace = (): Place => shared("__solarPlace", DEFAULT_PLACE)
export const setPlace = (place: Place): void => publish("__solarPlace", PLACE_EVENT, place)
export const usePlace = (): Accessor<Place> => useShared(getPlace, PLACE_EVENT)

export const getCursor = (): number => shared("__solarCursor", DEFAULT_CURSOR)

export function setCursor(next: number | ((current: number) => number)): void {
  const value = typeof next === "function" ? next(getCursor()) : next
  const wrapped = ((value % DAYS_IN_YEAR) + DAYS_IN_YEAR) % DAYS_IN_YEAR
  publish("__solarCursor", CURSOR_EVENT, wrapped)
}

export const useCursor = (): Accessor<number> => useShared(getCursor, CURSOR_EVENT)

/**
 * Only one figure animates at a time: whoever starts playing claims ownership
 * and the others stop, rather than several loops fighting over one cursor.
 */
export const claimPlayback = (owner: string): void => publish("__solarPlayer", PLAY_EVENT, owner)
export const releasePlayback = (): void => publish("__solarPlayer", PLAY_EVENT, "")
export const usePlaybackOwner = (): Accessor<string> =>
  useShared(() => shared<string>("__solarPlayer", ""), PLAY_EVENT)

/**
 * Move a place, keeping the preset label honest: a coordinate that still matches
 * a preset keeps its name, anything else becomes "Custom".
 *
 * The time zone follows the MERIDIAN, not the pair — so scrubbing latitude keeps
 * whatever zone the place already had (a latitude sweep must not put an hour's
 * cliff in the middle of the slider), while a hand-typed longitude drops it and
 * the clock falls back to mean solar time for that meridian, with no DST.
 */
export function placeWith(place: Place, patch: Partial<Pick<Place, "lat" | "lon">>): Place {
  const lat = Math.max(-89.5, Math.min(89.5, patch.lat ?? place.lat))
  const lon = Math.max(-180, Math.min(180, patch.lon ?? place.lon))
  const known = PRESETS.find((p) => p.lat === lat && p.lon === lon)
  if (known) return known
  return {
    label: "Custom",
    lat,
    lon,
    zone: lon === place.lon ? place.zone : undefined,
  }
}

/**
 * Highest the sun ever gets at a latitude: the solstice that brings the sun
 * closest to overhead. Sets the top of the elevation colour scale.
 */
export function maxElevation(lat: number): number {
  return 90 - Math.max(0, Math.abs(lat) - 23.44)
}
