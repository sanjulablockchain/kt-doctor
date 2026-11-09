import { describe, it, expect } from "vitest";
import { parseOfficeHours, isOpenAt } from "./clinicHours";

// Instants are written in UTC (vitest pins TZ=UTC) and read in Los Angeles
// time by the code under test. 2026-11-04 is a Wednesday; PST (UTC-8) applies
// after the DST change on 2026-11-01.
const WED_10AM_LA = new Date("2026-11-04T18:00:00Z");
const WED_7PM_LA = new Date("2026-11-04T03:00:00Z"); // Tue 7PM LA
const SAT_9AM_LA = new Date("2026-11-07T17:00:00Z");
const SUN_NOON_LA = new Date("2026-11-08T20:00:00Z");

describe("parseOfficeHours", () => {
  it("reads a weekday range with whole-hour times", () => {
    expect(parseOfficeHours("Monday-Friday, 9AM-6PM")).toEqual([
      { days: [1, 2, 3, 4, 5], open: 9 * 60, close: 18 * 60 },
    ]);
  });

  it("reads half-hour opening times", () => {
    expect(parseOfficeHours("Monday-Friday, 8:30AM-5PM")).toEqual([
      { days: [1, 2, 3, 4, 5], open: 8 * 60 + 30, close: 17 * 60 },
    ]);
  });

  it("reads several ranges separated by semicolons", () => {
    expect(parseOfficeHours("Monday-Friday, 9AM-6PM; Saturday, 8AM-4PM")).toEqual([
      { days: [1, 2, 3, 4, 5], open: 9 * 60, close: 18 * 60 },
      { days: [6], open: 8 * 60, close: 16 * 60 },
    ]);
  });

  it("returns no ranges for hours it cannot read, such as By appointment", () => {
    expect(parseOfficeHours("By appointment")).toEqual([]);
  });
});

describe("isOpenAt", () => {
  it("is open on a weekday morning inside the range", () => {
    expect(isOpenAt("Monday-Friday, 9AM-6PM", WED_10AM_LA)).toBe(true);
  });

  it("is closed on a weekday evening after the range", () => {
    expect(isOpenAt("Monday-Friday, 9AM-6PM", WED_7PM_LA)).toBe(false);
  });

  it("is closed on Saturday when only weekdays are listed", () => {
    expect(isOpenAt("Monday-Friday, 9AM-6PM", SAT_9AM_LA)).toBe(false);
  });

  it("is open on Saturday when a Saturday range is listed", () => {
    expect(isOpenAt("Monday-Friday, 9AM-6PM; Saturday, 8AM-4PM", SAT_9AM_LA)).toBe(true);
  });

  it("is closed on Sunday for every clinic schedule", () => {
    expect(isOpenAt("Monday-Friday, 9AM-6PM; Saturday, 8AM-4PM", SUN_NOON_LA)).toBe(false);
  });

  it("reads the clock in Los Angeles time, not UTC", () => {
    // 18:00 UTC is 10AM in LA (open) but would be 6PM, the closing minute, read
    // as UTC. A clinic closing at 6PM is closed at 6PM, so a UTC reading fails.
    expect(isOpenAt("Monday-Friday, 9AM-6PM", WED_10AM_LA)).toBe(true);
    expect(isOpenAt("Monday-Friday, 9AM-6PM", new Date("2026-11-05T02:00:00Z"))).toBe(false);
  });

  it("returns null when the hours cannot be read", () => {
    expect(isOpenAt("By appointment", WED_10AM_LA)).toBeNull();
  });
});
