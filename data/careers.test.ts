import { describe, it, expect } from "vitest";
import { positions, DEPARTMENTS, type Position } from "./careers";

describe("careers positions data", () => {
  it("has at least one position", () => {
    expect(positions.length).toBeGreaterThan(0);
  });

  it("every position is well-formed", () => {
    for (const p of positions) {
      expect(p.id).toMatch(/^[a-z0-9-]+$/);
      expect(p.title.length).toBeGreaterThan(0);
      expect(p.titleEs.length).toBeGreaterThan(0);
      expect(p.summary.length).toBeGreaterThan(0);
      expect(p.summaryEs.length).toBeGreaterThan(0);
      expect(p.locations.length).toBeGreaterThan(0);
      expect(DEPARTMENTS).toContain(p.department);
    }
  });

  it("every position has a full description, responsibilities, and requirements in both locales", () => {
    for (const p of positions) {
      expect(p.description.length).toBeGreaterThan(0);
      expect(p.descriptionEs.length).toBeGreaterThan(0);
      expect(p.responsibilities.length).toBeGreaterThan(0);
      expect(p.responsibilitiesEs.length).toBe(p.responsibilities.length);
      expect(p.requirements.length).toBeGreaterThan(0);
      expect(p.requirementsEs.length).toBe(p.requirements.length);
      for (const item of [...p.responsibilities, ...p.responsibilitiesEs, ...p.requirements, ...p.requirementsEs]) {
        expect(item.length).toBeGreaterThan(0);
      }
    }
  });

  it("has unique ids", () => {
    const ids = positions.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("contains no em dash in any string", () => {
    const strings: string[] = positions.flatMap((p: Position) => [
      p.title, p.titleEs, p.summary, p.summaryEs, p.locations, p.employmentType, p.department,
      p.description, p.descriptionEs,
      ...p.responsibilities, ...p.responsibilitiesEs,
      ...p.requirements, ...p.requirementsEs,
    ]);
    for (const s of strings) expect(s).not.toContain("—");
  });
});
