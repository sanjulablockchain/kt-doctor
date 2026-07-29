import { describe, it, expect } from "vitest";
import { positions, DEPARTMENTS, roleCategories, type Position } from "./careers";

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

describe("careers role categories", () => {
  it("has exactly 8 categories with unique ids", () => {
    expect(roleCategories.length).toBe(8);
    const ids = roleCategories.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every category is well-formed and only references real departments", () => {
    for (const c of roleCategories) {
      expect(c.title.length).toBeGreaterThan(0);
      expect(c.titleEs.length).toBeGreaterThan(0);
      expect(c.description.length).toBeGreaterThan(0);
      expect(c.descriptionEs.length).toBeGreaterThan(0);
      for (const dept of c.departments) {
        expect(DEPARTMENTS).toContain(dept);
      }
    }
  });

  it("covers every department with at least one category", () => {
    const covered = new Set(roleCategories.flatMap((c) => c.departments));
    for (const dept of DEPARTMENTS) {
      expect(covered.has(dept)).toBe(true);
    }
  });

  it("contains no em dash in any string", () => {
    const strings = roleCategories.flatMap((c) => [c.title, c.titleEs, c.description, c.descriptionEs]);
    for (const s of strings) expect(s).not.toContain("—");
  });
});
