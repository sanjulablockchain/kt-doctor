import { describe, it, expect } from "vitest";
import { filterDoctors, getAllSpecialties } from "./filters";
import { doctors } from "@/data/doctors";
import { locations } from "@/data/locations";

describe("filterDoctors", () => {
  it("returns all doctors when no filters are given", () => {
    expect(filterDoctors(doctors, {})).toHaveLength(doctors.length);
  });

  it("filters by locationId", () => {
    const result = filterDoctors(doctors, { locationId: "pasadena" });
    expect(result.length).toBeGreaterThan(0);
    for (const doc of result) {
      expect(doc.locationIds).toContain("pasadena");
    }
  });

  it("filters by specialty", () => {
    const result = filterDoctors(doctors, { specialty: "Pediatrics" });
    expect(result).toHaveLength(doctors.length);
  });

  it("filters by search matching name (case-insensitive)", () => {
    const result = filterDoctors(doctors, { search: "fineberg" });
    expect(result.map((d) => d.name)).toContain("Martin Fineberg");
  });

  it("combines locationId and search filters", () => {
    const result = filterDoctors(doctors, { locationId: "pasadena", search: "martin" });
    expect(result.map((d) => d.name)).toEqual(["Martin Fineberg"]);
  });
});

describe("getAllSpecialties", () => {
  it("returns a de-duplicated, sorted list of specialties", () => {
    expect(getAllSpecialties(doctors)).toEqual(["Pediatrics"]);
  });
});

describe("data integrity across doctors and locations", () => {
  it("every doctor locationId references a real location in data/locations.ts", () => {
    const validIds = new Set(locations.map((l) => l.id));
    const unresolvedIds = new Set<string>();
    for (const doc of doctors) {
      for (const locId of doc.locationIds) {
        if (!validIds.has(locId)) unresolvedIds.add(locId);
      }
    }
    expect(unresolvedIds.size).toBe(0);
  });
});
