import { describe, it, expect } from "vitest";
import { insuranceInfo } from "./insurance";

describe("insurance data", () => {
  it("lists only general accepted categories, not specific named insurers", () => {
    expect(insuranceInfo.acceptedCategories).toEqual(["HMO", "PPO", "Medi-Cal"]);
  });

  it("links to the real Serendib Healthways site", () => {
    expect(insuranceInfo.serendibUrl).toBe("https://www.serendibhealthways.com");
  });
});
