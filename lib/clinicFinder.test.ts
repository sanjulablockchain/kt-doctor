import { describe, it, expect } from "vitest";
import type { Location } from "./types";
import { distanceMiles, matchesQuery, rankClinics } from "./clinicFinder";

const WED_10AM_LA = new Date("2026-11-04T18:00:00Z");

function clinic(overrides: Partial<Location> & { id: string }): Location {
  return {
    name: overrides.id,
    address: "1 Main St, Somewhere, CA 90000",
    phone: "(818) 361-5437",
    email: "x@ktdoctor.com",
    extension: "",
    description: "",
    hours: { officeHours: "Monday-Friday, 9AM-6PM", telehealthHours: "" },
    photos: [],
    lat: 34.1,
    lng: -118.3,
    ...overrides,
  };
}

describe("distanceMiles", () => {
  it("measures roughly 22 miles as the crow flies from Pasadena to Santa Monica", () => {
    const miles = distanceMiles({ lat: 34.1478, lng: -118.1445 }, { lat: 34.0195, lng: -118.4912 });
    expect(miles).toBeGreaterThan(20);
    expect(miles).toBeLessThan(24);
  });
});

describe("matchesQuery", () => {
  const glendale = clinic({ id: "glendale", name: "Glendale", address: "123 Brand Blvd, Glendale, CA 91203" });

  it("matches the clinic name regardless of case", () => {
    expect(matchesQuery(glendale, "glen")).toBe(true);
  });

  it("matches a ZIP code inside the address", () => {
    expect(matchesQuery(glendale, "91203")).toBe(true);
  });

  it("ignores accents so a Spanish speaker typing Pasadéna still matches", () => {
    const pasadena = clinic({ id: "pasadena", name: "Pasadena" });
    expect(matchesQuery(pasadena, "Pasadéna")).toBe(true);
  });

  it("matches everything on an empty query", () => {
    expect(matchesQuery(glendale, "   ")).toBe(true);
  });

  it("does not match unrelated text", () => {
    expect(matchesQuery(glendale, "Downey")).toBe(false);
  });
});

describe("rankClinics", () => {
  const short = clinic({ id: "short", name: "Short" });
  const long = clinic({ id: "long", name: "Long" });
  const moderate = clinic({ id: "moderate", name: "Moderate" });
  const unknown = clinic({ id: "unknown-wait", name: "Unknown" });
  const telehealth = clinic({ id: "telehealth", name: "Telehealth", lat: undefined, lng: undefined });
  const waits = { short: "short", long: "long", moderate: "moderate" } as const;

  it("lists shorter waits first", () => {
    const ranked = rankClinics({
      clinics: [long, unknown, moderate, short],
      waitLevels: waits,
      query: "",
      now: WED_10AM_LA,
    });
    expect(ranked.map((r) => r.location.id)).toEqual(["short", "moderate", "long", "unknown-wait"]);
  });

  it("leaves out clinics with no coordinates, which are not places to visit", () => {
    const ranked = rankClinics({ clinics: [telehealth, short], waitLevels: waits, query: "", now: WED_10AM_LA });
    expect(ranked.map((r) => r.location.id)).toEqual(["short"]);
  });

  it("filters by the query", () => {
    const ranked = rankClinics({ clinics: [long, short], waitLevels: waits, query: "lon", now: WED_10AM_LA });
    expect(ranked.map((r) => r.location.id)).toEqual(["long"]);
  });

  it("breaks wait ties by distance when the visitor's position is known", () => {
    const near = clinic({ id: "near", lat: 34.1, lng: -118.3 });
    const far = clinic({ id: "far", lat: 34.5, lng: -118.9 });
    const ranked = rankClinics({
      clinics: [far, near],
      waitLevels: { near: "short", far: "short" },
      query: "",
      now: WED_10AM_LA,
      origin: { lat: 34.1, lng: -118.3 },
    });
    expect(ranked.map((r) => r.location.id)).toEqual(["near", "far"]);
    expect(ranked[0].distanceMiles).toBeCloseTo(0, 1);
    expect(ranked[1].distanceMiles).toBeGreaterThan(30);
  });

  it("breaks wait ties by name when there is no position", () => {
    const b = clinic({ id: "b", name: "Burbank" });
    const a = clinic({ id: "a", name: "Arcadia" });
    const ranked = rankClinics({ clinics: [b, a], waitLevels: { a: "short", b: "short" }, query: "", now: WED_10AM_LA });
    expect(ranked.map((r) => r.location.id)).toEqual(["a", "b"]);
  });

  it("reports whether each clinic is open right now", () => {
    const saturdayOnly = clinic({
      id: "sat",
      hours: { officeHours: "Saturday, 8AM-4PM", telehealthHours: "" },
    });
    const ranked = rankClinics({
      clinics: [short, saturdayOnly],
      waitLevels: { short: "short", sat: "short" },
      query: "",
      now: WED_10AM_LA,
    });
    const byId = Object.fromEntries(ranked.map((r) => [r.location.id, r.openNow]));
    expect(byId.short).toBe(true);
    expect(byId.sat).toBe(false);
  });

  it("carries the wait level through, defaulting to unknown", () => {
    const ranked = rankClinics({ clinics: [unknown, short], waitLevels: waits, query: "", now: WED_10AM_LA });
    expect(ranked.find((r) => r.location.id === "short")?.waitLevel).toBe("short");
    expect(ranked.find((r) => r.location.id === "unknown-wait")?.waitLevel).toBe("unknown");
  });
});
