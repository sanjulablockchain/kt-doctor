import { describe, it, expect } from "vitest";
import { formatClockTime, formatUtcOffset } from "./clock";

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
