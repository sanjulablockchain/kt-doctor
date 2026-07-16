import { describe, it, expect } from "vitest";
import { partners } from "./partners";

describe("partners data", () => {
  it("has exactly 7 real trusted partners", () => {
    expect(partners).toHaveLength(7);
    expect(partners.map((p) => p.id).sort()).toEqual(
      [
        "cedars-sinai",
        "childrens-hospital-la",
        "la-care-health-plan",
        "molina-healthcare",
        "optum",
        "providence",
        "regal-medical-group",
      ].sort()
    );
  });

  it("has the real partner names", () => {
    const names = partners.map((p) => p.name).sort();
    expect(names).toEqual(
      [
        "Cedars-Sinai",
        "Children's Hospital Los Angeles",
        "LA Care Health Plan",
        "Molina Healthcare",
        "Optum",
        "Providence",
        "Regal Medical Group",
      ].sort()
    );
  });

  it("every logo is a locally downloaded file", () => {
    for (const partner of partners) {
      expect(partner.logoSrc).toMatch(/^\/partner-/);
    }
  });
});
