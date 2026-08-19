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
