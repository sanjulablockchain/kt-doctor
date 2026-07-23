import { describe, it, expect } from "vitest";
import sitemap from "./sitemap";
import { doctors } from "@/data/doctors";
import { locations } from "@/data/locations";
import { stories } from "@/data/stories";
import { serviceCategories } from "@/data/services";

describe("sitemap", () => {
  const entries = sitemap();
  const serviceCount = serviceCategories.flatMap((c) => c.services).length;
  const staticCount = 14;

  it("includes one entry per static + dynamic route", () => {
    expect(entries).toHaveLength(
      staticCount + doctors.length + locations.length + serviceCount + stories.length
    );
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
});
