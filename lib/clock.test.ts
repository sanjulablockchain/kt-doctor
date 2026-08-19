import { describe, it, expect } from "vitest";
import {
  CLINIC_TIME_ZONE,
  formatClockTime,
  formatUtcOffset,
  formatZonedClockTime,
  zoneOffsetMinutes,
} from "./clock";

describe("formatClockTime", () => {
  it("renders a zero-padded 24-hour time with seconds", () => {
    expect(formatClockTime(new Date(2026, 7, 19, 17, 43, 19))).toBe("17:43:19");
  });

  it("pads single-digit hours, minutes, and seconds", () => {
    expect(formatClockTime(new Date(2026, 7, 19, 9, 5, 3))).toBe("09:05:03");
  });

  it("renders midnight as 00, not 24", () => {
    expect(formatClockTime(new Date(2026, 7, 19, 0, 0, 0))).toBe("00:00:00");
  });
});

describe("formatUtcOffset", () => {
  // Date#getTimezoneOffset is inverted: a UTC+5:30 zone reports -330.
  it("renders a half-hour eastern offset as a decimal", () => {
    expect(formatUtcOffset(-330)).toBe("GMT+5.5");
  });

  it("renders a whole-hour western offset without decimals", () => {
    expect(formatUtcOffset(480)).toBe("GMT-8");
  });

  it("renders UTC itself as a zero offset", () => {
    expect(formatUtcOffset(0)).toBe("GMT+0");
  });

  it("renders a quarter-hour offset without rounding it away", () => {
    expect(formatUtcOffset(-345)).toBe("GMT+5.75");
  });
});

describe("formatZonedClockTime", () => {
  it("reads an instant in the clinic's timezone, not the machine's", () => {
    // Noon UTC is 05:00 in Los Angeles during daylight saving.
    expect(formatZonedClockTime(new Date("2026-07-15T12:00:00Z"), CLINIC_TIME_ZONE)).toBe(
      "05:00:00"
    );
  });

  it("stays on a 24-hour cycle past noon", () => {
    expect(formatZonedClockTime(new Date("2026-07-16T00:30:45Z"), CLINIC_TIME_ZONE)).toBe(
      "17:30:45"
    );
  });
});

describe("zoneOffsetMinutes", () => {
  it("reports the clinic's summer offset as GMT-7", () => {
    const offset = zoneOffsetMinutes(new Date("2026-07-15T12:00:00Z"), CLINIC_TIME_ZONE);
    expect(formatUtcOffset(offset)).toBe("GMT-7");
  });

  it("follows the clinic across the daylight saving boundary to GMT-8", () => {
    const offset = zoneOffsetMinutes(new Date("2026-01-15T12:00:00Z"), CLINIC_TIME_ZONE);
    expect(formatUtcOffset(offset)).toBe("GMT-8");
  });

  it("uses the same inverted sign convention as Date#getTimezoneOffset", () => {
    // Los Angeles is behind UTC, which getTimezoneOffset reports as positive.
    expect(zoneOffsetMinutes(new Date("2026-07-15T12:00:00Z"), CLINIC_TIME_ZONE)).toBe(420);
  });

  it("handles UTC, where the offset name carries no sign", () => {
    expect(zoneOffsetMinutes(new Date("2026-07-15T12:00:00Z"), "UTC")).toBe(0);
  });

  it("handles a half-hour zone", () => {
    const offset = zoneOffsetMinutes(new Date("2026-07-15T12:00:00Z"), "Asia/Colombo");
    expect(formatUtcOffset(offset)).toBe("GMT+5.5");
  });
});
