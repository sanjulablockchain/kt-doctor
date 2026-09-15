import { describe, it, expect } from "vitest";
import sitemap from "./sitemap";
import { doctors } from "@/data/doctors";
import { locations } from "@/data/locations";
import { stories } from "@/data/stories";
import { serviceCategories } from "@/data/services";
import { pressReleases } from "@/data/pressReleases";
import { pressBios } from "@/data/pressBios";

describe("sitemap", () => {
  const entries = sitemap();
  const serviceCount = serviceCategories.flatMap((c) => c.services).length;
  const staticCount = 16;

  it("includes one entry per static + dynamic route", () => {
    expect(entries).toHaveLength(
      staticCount +
        doctors.length +
        locations.length +
        serviceCount +
        stories.length +
        pressReleases.length +
        pressBios.length
    );
  });

  it("includes the /media hub", () => {
    expect(entries.some((e) => e.url === "https://www.ktdoctor.com/media")).toBe(true);
  });

  // Press releases and press biographies are the two pieces of media content
  // that exist only as HTML pages, so they have to be indexable.
  it("includes every press release and press biography detail page", () => {
    for (const release of pressReleases) {
      expect(
        entries.some((e) => e.url === `https://www.ktdoctor.com/media/press/${release.id}`)
      ).toBe(true);
    }
    for (const bio of pressBios) {
      expect(
        entries.some((e) => e.url === `https://www.ktdoctor.com/media/leadership/${bio.id}`)
      ).toBe(true);
    }
  });

  it("uses absolute URLs under the canonical host", () => {
    for (const entry of entries) {
      expect(entry.url.startsWith("https://www.ktdoctor.com")).toBe(true);
    }
  });

  it("includes es + x-default language alternates on every entry", () => {
    for (const entry of entries) {
      expect(entry.alternates?.languages?.es).toBeDefined();
      expect(entry.alternates?.languages?.["x-default"]).toBeDefined();
    }
  });

  it("maps the Spanish alternate correctly for the home entry", () => {
    const home = entries.find((e) => e.url === "https://www.ktdoctor.com/");
    expect(home?.alternates?.languages?.es).toBe("https://www.ktdoctor.com/es");
  });

  it("includes the /contact route", () => {
    const entries = sitemap();
    expect(entries.some((e) => e.url.endsWith("/contact"))).toBe(true);
  });
});
