import { describe, it, expect } from "vitest";
import { socialLinks } from "./social";

describe("social link data", () => {
  it("has exactly 5 links: Facebook, Instagram, X, YouTube, LinkedIn", () => {
    expect(socialLinks).toHaveLength(5);
    expect(socialLinks.map((s) => s.label)).toEqual([
      "Facebook",
      "Instagram",
      "X",
      "YouTube",
      "LinkedIn",
    ]);
  });

  it("every link has a real https href and a non-empty svg path", () => {
    for (const social of socialLinks) {
      expect(social.href).toMatch(/^https:\/\//);
      expect(social.path.length).toBeGreaterThan(0);
    }
  });

  it("Facebook links to the confirmed page", () => {
    const facebook = socialLinks.find((s) => s.label === "Facebook");
    expect(facebook?.href).toBe("https://www.facebook.com/kidsandteensmedicalgroup/");
  });

  it("X links to the confirmed handle", () => {
    const x = socialLinks.find((s) => s.label === "X");
    expect(x?.href).toBe("https://x.com/KTDoctorGroup");
  });

  it("LinkedIn links to the confirmed company page", () => {
    const linkedin = socialLinks.find((s) => s.label === "LinkedIn");
    expect(linkedin?.href).toBe("https://se.linkedin.com/company/kidsteensmedicalgroup");
  });
});
