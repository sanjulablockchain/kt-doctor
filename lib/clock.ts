/**
 * Formatting helpers for the visitor's local wall clock.
 *
 * Kept free of React and of `new Date()` so both halves stay pure and testable:
 * the caller supplies the instant and the offset.
 */

/** 24-hour `HH:MM:SS`, in whatever timezone the given Date is being read in. */
export function formatClockTime(date: Date): string {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
}

/**
 * `GMT+5.5` style label from a `Date#getTimezoneOffset()` value.
 *
 * That API is inverted relative to how offsets are written: a UTC+5:30 zone
 * reports -330, so the sign is flipped here. Offsets are rendered as decimal
 * hours rather than `+5:30` to match the compact badge in the design, which
 * keeps quarter-hour zones like Nepal (+5.75) honest instead of rounding them.
 */
export function formatUtcOffset(offsetMinutes: number): string {
  const minutesEastOfUtc = -offsetMinutes;
  const sign = minutesEastOfUtc < 0 ? "-" : "+";
  // toFixed then Number drops trailing zeros, so 8.00 reads as 8 and 5.50 as 5.5.
  const hours = Number((Math.abs(minutesEastOfUtc) / 60).toFixed(2));
  return `GMT${sign}${hours}`;
}

/**
 * The clinics are all in the Los Angeles area. Named as an IANA zone rather
 * than a fixed -8, so the switch to daylight saving is handled by the platform
 * instead of needing a yearly edit.
 */
export const CLINIC_TIME_ZONE = "America/Los_Angeles";

const zonedTimeFormatters = new Map<string, Intl.DateTimeFormat>();
const zonedOffsetFormatters = new Map<string, Intl.DateTimeFormat>();

// Intl.DateTimeFormat construction is the expensive part, and these run once a
// second, so keep one formatter per zone.
function timeFormatterFor(timeZone: string): Intl.DateTimeFormat {
  let formatter = zonedTimeFormatters.get(timeZone);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat("en-GB", {
      timeZone,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23",
    });
    zonedTimeFormatters.set(timeZone, formatter);
  }
  return formatter;
}

function offsetFormatterFor(timeZone: string): Intl.DateTimeFormat {
  let formatter = zonedOffsetFormatters.get(timeZone);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat("en-US", { timeZone, timeZoneName: "longOffset" });
    zonedOffsetFormatters.set(timeZone, formatter);
  }
  return formatter;
}

/** 24-hour `HH:MM:SS` for an instant, read in an arbitrary IANA timezone. */
export function formatZonedClockTime(date: Date, timeZone: string): string {
  return timeFormatterFor(timeZone).format(date);
}

/**
 * Offset of `timeZone` at `date`, in the same inverted minutes convention as
 * `Date#getTimezoneOffset` so both clocks can share `formatUtcOffset`.
 *
 * Read via `longOffset`, which reports the offset in effect at that instant and
 * therefore tracks daylight saving. UTC formats as a bare "GMT" with no digits,
 * which falls through to zero.
 */
export function zoneOffsetMinutes(date: Date, timeZone: string): number {
  const parts = offsetFormatterFor(timeZone).formatToParts(date);
  const name = parts.find((part) => part.type === "timeZoneName")?.value ?? "";
  const match = /GMT([+-])(\d{2}):(\d{2})/.exec(name);
  if (!match) return 0;
  const sign = match[1] === "-" ? -1 : 1;
  const minutesEastOfUtc = sign * (Number(match[2]) * 60 + Number(match[3]));
  // Negating zero yields -0, which compares unequal under Object.is and would
  // leak out of here for UTC.
  return minutesEastOfUtc === 0 ? 0 : -minutesEastOfUtc;
}
