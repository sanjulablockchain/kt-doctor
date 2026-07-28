import { describe, it, expect } from "vitest";
import { networkBrands, networkCategoryOrder } from "./network";

describe("network brand data", () => {
  it("has exactly 9 brands", () => {
    expect(networkBrands).toHaveLength(9);
    expect(networkBrands.map((b) => b.id).sort()).toEqual(
      [
        "ktmg",
        "laipt",
        "st-gianna",
        "st-joseph-hospital",
        "serendib-healthways",
        "pediatric-after-hour",
        "human-compass-mso",
        "acig",
        "blockchain-bpo",
      ].sort()
    );
  });

  it("every brand belongs to one of the ordered categories", () => {
    for (const brand of networkBrands) {
      expect(networkCategoryOrder).toContain(brand.category);
    }
  });

  it("only KTMG is flagged as the flagship brand", () => {
    const flagshipIds = networkBrands.filter((b) => b.flagship).map((b) => b.id);
    expect(flagshipIds).toEqual(["ktmg"]);
  });

  it("KTMG links internally to /doctors and has no external URL", () => {
    const ktmg = networkBrands.find((b) => b.id === "ktmg");
    expect(ktmg?.internalHref).toBe("/doctors");
    expect(ktmg?.externalUrl).toBeUndefined();
    expect(ktmg?.logoSrc).toBe("/clinic-logo.svg");
    expect(ktmg?.category).toBe("care");
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
    expect(sjh?.category).toBe("sriLanka");
  });

  it("Serendib Healthways links externally with its real logo", () => {
    const brand = networkBrands.find((b) => b.id === "serendib-healthways");
    expect(brand?.externalUrl).toBe("https://www.serendibhealthways.com/");
    expect(brand?.internalHref).toBeUndefined();
    expect(brand?.logoSrc).toBe("/serendib-healthways-logo.svg");
    expect(brand?.services.length).toBeGreaterThan(0);
  });

  it("After-Hours Pediatric Urgent Care links externally with its real logo", () => {
    const brand = networkBrands.find((b) => b.id === "pediatric-after-hour");
    expect(brand?.externalUrl).toBe("https://pediatricafterhour.com/");
    expect(brand?.internalHref).toBeUndefined();
    expect(brand?.logoSrc).toBe("/pediatric-after-hour-logo.png");
    expect(brand?.services.length).toBeGreaterThan(0);
  });

  it("Human Compass MSO links externally with its real logo", () => {
    const brand = networkBrands.find((b) => b.id === "human-compass-mso");
    expect(brand?.externalUrl).toBe("https://humancompassmso.com/");
    expect(brand?.internalHref).toBeUndefined();
    expect(brand?.logoSrc).toBe("/human-compass-mso-logo.png");
    expect(brand?.services.length).toBeGreaterThan(0);
  });

  it("ACIG links externally with its real logo", () => {
    const brand = networkBrands.find((b) => b.id === "acig");
    expect(brand?.externalUrl).toBe("https://acig.lk/");
    expect(brand?.internalHref).toBeUndefined();
    expect(brand?.logoSrc).toBe("/acig-logo.png");
    expect(brand?.services.length).toBeGreaterThan(0);
    expect(brand?.category).toBe("sriLanka");
  });

  it("Blockchain BPO links externally with its real logo", () => {
    const brand = networkBrands.find((b) => b.id === "blockchain-bpo");
    expect(brand?.externalUrl).toBe("https://www.myblockchainbpo.com/");
    expect(brand?.internalHref).toBeUndefined();
    expect(brand?.logoSrc).toBe("/blockchain-bpo-logo.png");
    expect(brand?.services.length).toBeGreaterThan(0);
    expect(brand?.category).toBe("business");
  });

  it("no brand description or tagline contains an em dash", () => {
    for (const brand of networkBrands) {
      expect(brand.tagline).not.toContain("—");
      expect(brand.description).not.toContain("—");
    }
  });
});
