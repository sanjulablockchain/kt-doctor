/**
 * Reads the free-text office hours in data/locations.ts ("Monday-Friday,
 * 9AM-6PM; Saturday, 8AM-4PM") into day/minute ranges, and answers whether a
 * clinic is open at a given instant in Los Angeles time.
 *
 * Only the formats that actually appear in the data are understood. Anything
 * else (such as "By appointment") parses to no ranges, and `isOpenAt` then
 * returns null so the UI can say nothing rather than claim "closed".
 */

export type OpeningRange = {
  /** 0 = Sunday ... 6 = Saturday, matching Date#getDay(). */
  days: number[];
  /** Minutes after midnight. */
  open: number;
  close: number;
};

const DAY_INDEX: Record<string, number> = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
};

function parseDays(spec: string): number[] | null {
  const [from, to] = spec.toLowerCase().split("-").map((s) => s.trim());
  const start = DAY_INDEX[from];
  if (start === undefined) return null;
  if (to === undefined) return [start];
  const end = DAY_INDEX[to];
  if (end === undefined) return null;
  const days: number[] = [];
  for (let d = start; ; d = (d + 1) % 7) {
    days.push(d);
    if (d === end) break;
  }
  return days;
}

function parseTime(spec: string): number | null {
  const match = /^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)$/i.exec(spec.trim());
  if (!match) return null;
  let hours = Number(match[1]) % 12;
  if (match[3].toUpperCase() === "PM") hours += 12;
  return hours * 60 + Number(match[2] ?? 0);
}

export function parseOfficeHours(officeHours: string): OpeningRange[] {
  const ranges: OpeningRange[] = [];
  for (const part of officeHours.split(";")) {
    const [daySpec, timeSpec] = part.split(",").map((s) => s.trim());
    if (!daySpec || !timeSpec) continue;
    const days = parseDays(daySpec);
    const [openSpec, closeSpec] = timeSpec.split("-");
    const open = openSpec ? parseTime(openSpec) : null;
    const close = closeSpec ? parseTime(closeSpec) : null;
    if (!days || open === null || close === null) continue;
    ranges.push({ days, open, close });
  }
  return ranges;
}

const LA_CLOCK = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/Los_Angeles",
  weekday: "long",
  hour: "numeric",
  minute: "numeric",
  hour12: false,
});

/** The Los Angeles weekday and minute-of-day for an instant. */
export function losAngelesClock(instant: Date): { day: number; minutes: number } {
  const parts = Object.fromEntries(
    LA_CLOCK.formatToParts(instant).map((p) => [p.type, p.value])
  );
  // "24" shows up for midnight in some engines with hour12:false.
  const hour = Number(parts.hour) % 24;
  return {
    day: DAY_INDEX[String(parts.weekday).toLowerCase()],
    minutes: hour * 60 + Number(parts.minute),
  };
}

/** True/false when the hours are readable, null when they are not. */
export function isOpenAt(officeHours: string, instant: Date): boolean | null {
  const ranges = parseOfficeHours(officeHours);
  if (ranges.length === 0) return null;
  const { day, minutes } = losAngelesClock(instant);
  return ranges.some(
    (range) => range.days.includes(day) && minutes >= range.open && minutes < range.close
  );
}
