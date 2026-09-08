/**
 * Solar position for a fixed observer, following the NOAA solar calculator.
 *
 * Conventions used across the solar-elevation article:
 *   elevation  degrees above the horizon (horizon 0, zenith +90, negative = below)
 *   azimuth    degrees along the horizon with SOUTH = 0,
 *              negative all morning, 0 at solar noon, positive all afternoon
 *              (-90 = due east, +90 = due west, +/-180 = due north).
 *              Fixed, not hemisphere-relative: south of the equator the sun
 *              passes to the north at noon, so the azimuth there sits near
 *              +/-180 rather than 0.
 */

const RAD = Math.PI / 180
const DEG = 180 / Math.PI

export const LEUVEN = { lat: 50.8798, lon: 4.7005, label: "Leuven" }

const sin = (d: number) => Math.sin(d * RAD)
const cos = (d: number) => Math.cos(d * RAD)
const tan = (d: number) => Math.tan(d * RAD)

/** Wrap to (-180, 180]. */
export function wrap180(deg: number): number {
  const x = ((deg % 360) + 360) % 360
  return x > 180 ? x - 360 : x
}

function julianCentury(utc: Date): number {
  const jd = utc.getTime() / 86400000 + 2440587.5
  return (jd - 2451545) / 36525
}

/** NOAA measures azimuth clockwise from north; this puts it in the article's convention. */
const toLocalAzimuth = (azNorth: number): number => wrap180(azNorth - 180)

export type SolarTerms = {
  /** Solar declination in degrees. */
  declination: number
  /** Equation of time in minutes (apparent minus mean solar time). */
  eqTime: number
}

/** Date-dependent terms; these change slowly, so they can be hoisted out of hourly loops. */
export function solarTerms(utc: Date): SolarTerms {
  const g = julianCentury(utc)
  const meanLong = (280.46646 + g * (36000.76983 + g * 0.0003032)) % 360
  const meanAnom = 357.52911 + g * (35999.05029 - 0.0001537 * g)
  const eccent = 0.016708634 - g * (0.000042037 + 0.0000001267 * g)
  const centre =
    sin(meanAnom) * (1.914602 - g * (0.004817 + 0.000014 * g)) +
    sin(2 * meanAnom) * (0.019993 - 0.000101 * g) +
    sin(3 * meanAnom) * 0.000289
  const trueLong = meanLong + centre
  const appLong = trueLong - 0.00569 - 0.00478 * sin(125.04 - 1934.136 * g)
  const meanObliq = 23 + (26 + (21.448 - g * (46.815 + g * (0.00059 - g * 0.001813))) / 60) / 60
  const obliqCorr = meanObliq + 0.00256 * cos(125.04 - 1934.136 * g)
  const declination = Math.asin(sin(obliqCorr) * sin(appLong)) * DEG

  const varY = tan(obliqCorr / 2) ** 2
  const eqTime =
    4 *
    DEG *
    (varY * sin(2 * meanLong) -
      2 * eccent * sin(meanAnom) +
      4 * eccent * varY * sin(meanAnom) * cos(2 * meanLong) -
      0.5 * varY * varY * sin(4 * meanLong) -
      1.25 * eccent * eccent * sin(2 * meanAnom))

  return { declination, eqTime }
}

/* -------------------------------------------------------------------------- */
/* Fast path                                                                   */
/*                                                                             */
/* solarPosition() recomputes the date-dependent terms on every call, which is  */
/* wasted work when sweeping a whole day (or a whole year) at fixed date. These */
/* take the terms as given, so a caller can hoist solarTerms() out of the loop. */
/* -------------------------------------------------------------------------- */

/** Hour angle in degrees for a local wall-clock time, given the day's equation of time. */
export function hourAngleAt(
  localMinutes: number,
  eqTime: number,
  offsetHours: number,
  lon = LEUVEN.lon
): number {
  const utcMinutes = localMinutes - offsetHours * 60
  const trueSolarTime = (((utcMinutes + eqTime + 4 * lon) % 1440) + 1440) % 1440
  return trueSolarTime / 4 - 180
}

export function elevationAt(lat: number, declination: number, hourAngle: number): number {
  const c = sin(lat) * sin(declination) + cos(lat) * cos(declination) * cos(hourAngle)
  return 90 - Math.acos(Math.min(1, Math.max(-1, c))) * DEG
}

/** Azimuth in the article's convention (south 0, morning negative, afternoon positive). */
export function azimuthAt(
  lat: number,
  declination: number,
  hourAngle: number,
  elevation: number
): number {
  const zenith = 90 - elevation
  const denom = cos(lat) * sin(zenith)
  if (Math.abs(denom) < 1e-9) return hourAngle > 0 ? 0 : 180
  const c = Math.min(1, Math.max(-1, (sin(lat) * cos(zenith) - sin(declination)) / denom))
  const a = Math.acos(c) * DEG
  return toLocalAzimuth(hourAngle > 0 ? (a + 180) % 360 : (540 - a) % 360)
}

export type SolarPosition = {
  /** Geometric elevation, no atmospheric refraction. */
  elevation: number
  /** Elevation as the atmosphere actually presents it. */
  apparentElevation: number
  azimuth: number
  declination: number
  eqTime: number
  hourAngle: number
}

/** Atmospheric refraction in degrees, NOAA's piecewise approximation. */
export function refraction(elevation: number): number {
  if (elevation > 85) return 0
  const te = tan(elevation)
  let r: number
  if (elevation > 5) r = 58.1 / te - 0.07 / te ** 3 + 0.000086 / te ** 5
  else if (elevation > -0.575)
    r = 1735 + elevation * (-518.2 + elevation * (103.4 + elevation * (-12.79 + elevation * 0.711)))
  else r = -20.772 / te
  return r / 3600
}

export function solarPosition(utc: Date, lat = LEUVEN.lat, lon = LEUVEN.lon): SolarPosition {
  const { declination, eqTime } = solarTerms(utc)

  const utcMinutes = (utc.getTime() / 60000) % 1440
  const trueSolarTime = (((utcMinutes + eqTime + 4 * lon) % 1440) + 1440) % 1440
  const hourAngle = trueSolarTime / 4 - 180

  const cosZenith =
    sin(lat) * sin(declination) + cos(lat) * cos(declination) * cos(hourAngle)
  const zenith = Math.acos(Math.min(1, Math.max(-1, cosZenith))) * DEG
  const elevation = 90 - zenith

  const denom = cos(lat) * sin(zenith)
  let azNorth: number
  if (Math.abs(denom) < 1e-9) {
    azNorth = hourAngle > 0 ? 180 : 0
  } else {
    const c = Math.min(1, Math.max(-1, (sin(lat) * cos(zenith) - sin(declination)) / denom))
    const a = Math.acos(c) * DEG
    azNorth = hourAngle > 0 ? (a + 180) % 360 : (540 - a) % 360
  }

  return {
    elevation,
    apparentElevation: elevation + refraction(elevation),
    azimuth: toLocalAzimuth(azNorth),
    declination,
    eqTime,
    hourAngle,
  }
}

/* -------------------------------------------------------------------------- */
/* Clock time                                                                  */
/* -------------------------------------------------------------------------- */

/**
 * Civil offset in hours for an instant.
 *
 * With an IANA zone, the browser's own time-zone database answers exactly —
 * summer time, political shifts, historical changes and all. Without one (a
 * hand-typed coordinate) there is nothing to look up, so the clock falls back to
 * the nearest 15-degree meridian and DST simply does not exist there.
 */
export function zoneOffsetHours(zone: string | undefined, lon: number, utc: Date): number {
  if (!zone) return Math.round(lon / 15)
  return zoneOffsetMinutes(zone, utc) / 60
}

const formatters = new Map<string, Intl.DateTimeFormat>()
const offsets = new Map<string, number>()

function formatter(zone: string): Intl.DateTimeFormat {
  let f = formatters.get(zone)
  if (!f) {
    f = new Intl.DateTimeFormat("en-US", {
      timeZone: zone,
      hour12: false,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
    formatters.set(zone, f)
  }
  return f
}

/**
 * Offset in minutes, by asking Intl what the wall clock reads in that zone and
 * differencing. Cached per zone per day: an offset changes at most twice a year,
 * and the sweeps here ask for it thousands of times.
 */
function zoneOffsetMinutes(zone: string, utc: Date): number {
  const key = `${zone}|${Math.floor(utc.getTime() / 86400000)}`
  const hit = offsets.get(key)
  if (hit !== undefined) return hit

  let offset: number
  try {
    const parts: Record<string, number> = {}
    for (const { type, value } of formatter(zone).formatToParts(utc)) {
      if (type !== "literal") parts[type] = Number(value)
    }
    const asUTC = Date.UTC(
      parts.year,
      parts.month - 1,
      parts.day,
      parts.hour % 24,
      parts.minute
    )
    offset = Math.round((asUTC - utc.getTime()) / 60000)
  } catch {
    // An unknown zone id: fall back rather than throwing inside a render.
    offset = 0
  }

  offsets.set(key, offset)
  return offset
}

/**
 * A local wall-clock time, as a UTC instant.
 * The offset is resolved from the date itself, so DST is handled without a tz database.
 */
export function localToUtc(
  year: number,
  month: number,
  day: number,
  minutes: number,
  lon = LEUVEN.lon,
  zone?: string
): Date {
  const naive = Date.UTC(year, month, day, 0, minutes)
  // The offset depends on the instant we are solving for, so guess once from the
  // naive time and correct: two passes settle everything but the hour a DST
  // transition actually skips.
  let utc = naive - zoneOffsetHours(zone, lon, new Date(naive)) * 3600000
  utc = naive - zoneOffsetHours(zone, lon, new Date(utc)) * 3600000
  return new Date(utc)
}

export type DayEvents = {
  /** Local clock minutes, or null when the sun never crosses the horizon. */
  sunrise: number | null
  sunset: number | null
  solarNoon: number
  dayLength: number
  noonElevation: number
}

/** Sunrise, sunset and solar noon for a calendar date, in local clock minutes. */
export function dayEvents(
  year: number,
  month: number,
  day: number,
  lat = LEUVEN.lat,
  lon = LEUVEN.lon,
  zone?: string
): DayEvents {
  const noonGuess = localToUtc(year, month, day, 720, lon, zone)
  const offset = zoneOffsetHours(zone, lon, noonGuess)
  const { declination, eqTime } = solarTerms(noonGuess)

  // Solar noon in UTC minutes, then shifted onto the wall clock.
  const solarNoon = 720 - 4 * lon - eqTime + offset * 60

  // Hour angle at the standard -0.833 deg sunrise altitude (refraction + solar radius).
  const cosHA =
    cos(90.833) / (cos(lat) * cos(declination)) - tan(lat) * tan(declination)
  const polar = cosHA < -1 || cosHA > 1
  const ha = polar ? null : Math.acos(cosHA) * DEG

  const noonElevation = 90 - Math.abs(lat - declination)

  return {
    sunrise: ha === null ? null : solarNoon - ha * 4,
    sunset: ha === null ? null : solarNoon + ha * 4,
    solarNoon,
    dayLength: ha === null ? (cosHA < -1 ? 1440 : 0) : ha * 8,
    noonElevation,
  }
}

/** Sampled elevation/azimuth track for one calendar date, on the local clock. */
export function dayTrack(
  year: number,
  month: number,
  day: number,
  stepMinutes = 10,
  lat = LEUVEN.lat,
  lon = LEUVEN.lon,
  zone?: string
): { minutes: number; elevation: number; azimuth: number }[] {
  const out = []
  for (let m = 0; m <= 1440; m += stepMinutes) {
    const p = solarPosition(localToUtc(year, month, day, m, lon, zone), lat, lon)
    out.push({ minutes: m, elevation: p.elevation, azimuth: p.azimuth })
  }
  return out
}
