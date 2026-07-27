import { describe, it, expect } from "vitest";
import { socialLinks } from "./social";

describe("social link data", () => {
  it("has exactly 4 links: Facebook, Instagram, X, YouTube", () => {
    expect(socialLinks).toHaveLength(4);
    expect(socialLinks.map((s) => s.label)).toEqual(["Facebook", "Instagram", "X", "YouTube"]);
  });

  it("every link has a real https href and a non-empty svg path", () => {
    for (const social of socialLinks) {
      expect(social.href).toMatch(/^https:\/\//);
      expect(social.path.length).toBeGreaterThan(0);
    }
  });

  it("Facebook links to the confirmed page", () => {
    const facebook = socialLinks.find((s) => s.label === "Facebook");
    expect(facebook?.href).toBe("https://www.facebook.com/pediatriciansincalifornia/");
  });

  it("X links to the confirmed handle", () => {
    const x = socialLinks.find((s) => s.label === "X");
    expect(x?.href).toBe("https://x.com/KTDoctorGroup");
  });
});
