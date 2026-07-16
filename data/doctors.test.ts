import { describe, it, expect } from "vitest";
import { doctors } from "./doctors";
import { locations } from "./locations";

describe("doctors data", () => {
  it("has at least 80 doctors", () => {
    expect(doctors.length).toBeGreaterThanOrEqual(80);
  });

  it("every doctor has at least one location", () => {
    for (const doc of doctors) {
      expect(doc.locationIds.length).toBeGreaterThan(0);
    }
  });

  it("every doctor's locationIds reference a real location id", () => {
    const validIds = new Set(locations.map((l) => l.id));
    for (const doc of doctors) {
      for (const locId of doc.locationIds) {
        expect(validIds.has(locId)).toBe(true);
      }
    }
  });

  it("every doctor id is unique", () => {
    const ids = doctors.map((d) => d.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("includes a doctor who practices at multiple locations, matching the real roster", () => {
    const fineberg = doctors.find((d) => d.name === "Martin Fineberg");
    expect(fineberg).toBeDefined();
    expect(fineberg?.locationIds.sort()).toEqual(
      ["agoura-hills", "beverly-hills", "arcadia", "culver-city", "santa-monica", "pasadena", "torrance"].sort()
    );
  });

  it("every doctor with a photoSrc points to a locally downloaded file under /doctors/", () => {
    for (const doc of doctors) {
      if (doc.photoSrc) {
        expect(doc.photoSrc).toMatch(/^\/doctors\//);
      }
    }
  });
});
