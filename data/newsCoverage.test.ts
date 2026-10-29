import { describe, it, expect } from "vitest";
import { newsCoverage } from "./newsCoverage";

describe("newsCoverage", () => {
  it("includes the USC Campus Health coverage of the 2026 benefits fair", () => {
    const item = newsCoverage.find((c) => c.id === "usc-campus-health-benefits-fair-2026");
    expect(item).toBeDefined();
    expect(item!.outlet).toBe("USC Campus Health News");
    expect(item!.url).toBe("https://campushealth.usc.edu/employee-health-benefits-fair-2026");
    expect(item!.date).toBe("2026-10-23");
  });

  // The quote is the one sentence of the article that names the practice. It
  // is reproduced verbatim, so it must keep the outlet's wording.
  it("quotes the article's own sentence about the practice", () => {
    const item = newsCoverage[0];
    expect(item.quote).toContain("Kids & Teens Medical Group");
    expect(item.quote).toContain("25 clinics");
    expect(item.quoteEs).toContain("Kids & Teens Medical Group");
  });

  it("links out to the outlet over https rather than republishing the piece", () => {
    for (const item of newsCoverage) {
      expect(item.url.startsWith("https://")).toBe(true);
    }
  });

  it("is ordered newest first", () => {
    const dates = newsCoverage.map((c) => c.date);
    expect(dates).toEqual([...dates].sort().reverse());
  });

  it("carries both languages for every translated field", () => {
    for (const item of newsCoverage) {
      expect(item.summary.length).toBeGreaterThan(0);
      expect(item.summaryEs.length).toBeGreaterThan(0);
      expect(item.displayDateEs.length).toBeGreaterThan(0);
      expect(item.quoteEs.length).toBeGreaterThan(0);
    }
  });

  it("uses an ISO date that matches the display date", () => {
    const item = newsCoverage[0];
    expect(item.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(item.displayDate).toBe("October 23, 2026");
  });

  it("uses no em dash, per the project style", () => {
    const text = newsCoverage.flatMap((c) => Object.values(c)).join(" ");
    expect(text).not.toContain("—");
  });
});
