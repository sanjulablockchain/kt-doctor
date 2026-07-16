import { describe, it, expect } from "vitest";
import { foundation, sriLankaProgram, sriLankaSchools } from "./foundation";

describe("foundation data", () => {
  it("has the real name, logo, site URL, and donate URL", () => {
    expect(foundation.name).toBe("Kids and Teens Foundation");
    expect(foundation.logoSrc).toBe("/foundation-logo.png");
    expect(foundation.siteUrl).toBe("https://kidsandteensfoundation.org");
    expect(foundation.donateUrl).toBe("https://kidsandteensfoundation.org/donate/");
  });

  it("has exactly 6 real programs", () => {
    expect(foundation.programs).toHaveLength(6);
    expect(foundation.programs.map((p) => p.id).sort()).toEqual(
      [
        "community-outreach",
        "free-clinic-days",
        "internships",
        "medical-missions",
        "mentorship",
        "scholarships",
      ].sort()
    );
  });

  it("the medical missions program does not imply a scheduled date", () => {
    const missions = foundation.programs.find((p) => p.id === "medical-missions");
    expect(missions?.description.toLowerCase()).toMatch(/planned|to be announced|tba/);
  });

  it("no program description, mission text, or program name contains a dollar amount, percentage, or em dash", () => {
    const allText = [foundation.mission, ...foundation.programs.map((p) => p.description)].join(
      " "
    );
    expect(allText).not.toMatch(/\$[\d,]+/);
    expect(allText).not.toMatch(/\d+%/);
    expect(allText).not.toContain("—");
  });
});

describe("sri lanka program data", () => {
  it("has the 4 real Negombo schools", () => {
    expect(sriLankaSchools.map((s) => s.id).sort()).toEqual(
      [
        "st-peters-college",
        "st-josephs-college",
        "loyola-college",
        "maristella-college",
      ].sort()
    );
  });

  it("every school has a non-empty location, student count, and at least one program", () => {
    for (const school of sriLankaSchools) {
      expect(school.location.length).toBeGreaterThan(0);
      expect(school.studentCount.length).toBeGreaterThan(0);
      expect(school.programs.length).toBeGreaterThan(0);
    }
  });

  it("has a non-empty program heading and mission", () => {
    expect(sriLankaProgram.heading.length).toBeGreaterThan(0);
    expect(sriLankaProgram.mission.length).toBeGreaterThan(0);
  });

  it("no sri lanka text contains a dollar amount, percentage, or em dash", () => {
    const allText = [
      sriLankaProgram.mission,
      ...sriLankaSchools.flatMap((s) => [s.name, s.location, s.studentCount, ...s.programs]),
    ].join(" ");
    expect(allText).not.toMatch(/\$[\d,]+/);
    expect(allText).not.toMatch(/\d+%/);
    expect(allText).not.toContain("—");
  });

  it("the existing medical-missions program is unchanged", () => {
    const missions = foundation.programs.find((p) => p.id === "medical-missions");
    expect(missions?.description).toBe(
      "A planned medical mission to Negombo, Sri Lanka, with partner Saint Joseph Hospital, bringing doctors to communities with limited access to care. Date to be announced."
    );
  });
});
