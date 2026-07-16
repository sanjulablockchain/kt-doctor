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

  it("includes a doctor who practices at multiple locations, matching the live Healow roster", () => {
    const fineberg = doctors.find((d) => d.name === "Martin Fineberg");
    expect(fineberg).toBeDefined();
    expect(fineberg?.locationIds.sort()).toEqual(
      ["beverly-hills", "torrance"].sort()
    );
  });

  it("every doctor with a photoSrc points to a locally downloaded file under /doctors/", () => {
    for (const doc of doctors) {
      if (doc.photoSrc) {
        expect(doc.photoSrc).toMatch(/^\/doctors\//);
      }
    }
  });

  it("gives doctors confirmed in Healow a real per-doctor booking link", () => {
    const fineberg = doctors.find((d) => d.name === "Martin Fineberg");
    expect(fineberg?.healowUrl).toBe("https://healow.com/apps/provider/martin-fineberg-3161325");
  });

  it("does not invent a healowUrl for doctors Healow doesn't confirm", () => {
    const camarillo = doctors.find((d) => d.name === "Jon D'Andrea");
    expect(camarillo?.healowUrl).toBeUndefined();
  });

  it("includes doctors added by the 2026-07-17 Healow refresh", () => {
    const sapinoso = doctors.find((d) => d.name === "Christine Sapinoso");
    expect(sapinoso).toBeDefined();
    expect(sapinoso?.locationIds).toEqual(["northridge"]);
  });

  it("corrects Amrita Dosanjh's locations to match her live Healow roster", () => {
    const dosanjh = doctors.find((d) => d.name === "Amrita Dosanjh");
    expect(dosanjh).toBeDefined();
    expect(dosanjh?.locationIds.sort()).toEqual(
      ["west-hills", "northridge", "agoura-hills"].sort()
    );
  });

  it("re-adds providers previously (incorrectly) dropped, now confirmed active via Healow", () => {
    for (const name of ["Delaram Halavi", "Yeongbu Kim", "Ernestine Njie", "Alea Sohn"]) {
      expect(doctors.find((d) => d.name === name)).toBeDefined();
    }
  });
});
