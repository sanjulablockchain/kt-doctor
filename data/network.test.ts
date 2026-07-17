import { describe, it, expect } from "vitest";
import { networkBrands } from "./network";

describe("network brand data", () => {
  it("has exactly 4 brands: KTMG, St. Gianna, LAIPT, and St. Joseph Hospital", () => {
    expect(networkBrands).toHaveLength(4);
    expect(networkBrands.map((b) => b.id).sort()).toEqual(
      ["ktmg", "laipt", "st-gianna", "st-joseph-hospital"].sort()
    );
  });

  it("KTMG links internally to /doctors and has no external URL", () => {
    const ktmg = networkBrands.find((b) => b.id === "ktmg");
    expect(ktmg?.internalHref).toBe("/doctors");
    expect(ktmg?.externalUrl).toBeUndefined();
    expect(ktmg?.logoSrc).toBe("/clinic-logo.svg");
  });

  it("St. Gianna links externally to sgmdoctor.com with its real logo", () => {
    const sgm = networkBrands.find((b) => b.id === "st-gianna");
    expect(sgm?.externalUrl).toBe("https://www.sgmdoctor.com");
    expect(sgm?.internalHref).toBeUndefined();
    expect(sgm?.logoSrc).toBe("/sgm-logo.png");
    expect(sgm?.services.length).toBeGreaterThan(0);
  });

  it("LAIPT links externally to laipt.org with its real logo", () => {
    const laipt = networkBrands.find((b) => b.id === "laipt");
    expect(laipt?.externalUrl).toBe("https://www.laipt.org");
    expect(laipt?.internalHref).toBeUndefined();
    expect(laipt?.logoSrc).toBe("/laipt-logo.png");
    expect(laipt?.services.length).toBeGreaterThan(0);
  });

  it("St. Joseph Hospital links externally to sjhospital.lk with its real logo", () => {
    const sjh = networkBrands.find((b) => b.id === "st-joseph-hospital");
    expect(sjh?.externalUrl).toBe("https://www.sjhospital.lk");
    expect(sjh?.internalHref).toBeUndefined();
    expect(sjh?.logoSrc).toBe("/sjh-logo.png");
    expect(sjh?.services.length).toBeGreaterThan(0);
  });

  it("no brand description or tagline contains an em dash", () => {
    for (const brand of networkBrands) {
      expect(brand.tagline).not.toContain("—");
      expect(brand.description).not.toContain("—");
    }
  });
});
