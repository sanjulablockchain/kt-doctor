import { describe, it, expect } from "vitest";
import { mediaKitSections, mediaDownloads } from "./mediaKit";
import { pressReleases } from "./pressReleases";
import { pressBios } from "./pressBios";

describe("mediaKitSections", () => {
  it("mirrors all six tabs from the supplied media kit", () => {
    expect(mediaKitSections.map((s) => s.id)).toEqual([
      "press-release",
      "biography",
      "services",
      "network",
      "foundation",
      "telehealth",
    ]);
  });

  // The supplied kit cover is a single page whose tabs are external Box share
  // links. Those leave the site, carry no branding, and break silently if the
  // Box account revokes them. Every tab is re-pointed at this site instead.
  it("points every tab at a route on this site, never at a third-party share link", () => {
    for (const section of mediaKitSections) {
      expect(section.href.startsWith("/")).toBe(true);
      expect(section.href).not.toContain("box.com");
      expect(section.href).not.toContain("http");
    }
  });

  it("routes the two new pieces at the pages built for them", () => {
    const byId = Object.fromEntries(mediaKitSections.map((s) => [s.id, s]));
    expect(byId["press-release"].href).toBe(`/media/press/${pressReleases[0].id}`);
    expect(byId.biography.href).toBe(`/media/leadership/${pressBios[0].id}`);
  });

  // These four tabs restate pages the site already has. Republishing them as
  // separate pages would compete with the originals in search results.
  it("routes the four restated tabs at the existing pages rather than duplicating them", () => {
    const byId = Object.fromEntries(mediaKitSections.map((s) => [s.id, s]));
    expect(byId.services.href).toBe("/services");
    expect(byId.network.href).toBe("/network");
    expect(byId.foundation.href).toBe("/foundation");
    expect(byId.telehealth.href).toBe("/services/telehealth");
  });

  it("offers each tab's original PDF from this site as well", () => {
    for (const section of mediaKitSections) {
      expect(section.pdfHref).toMatch(/^\/media\/.+\.pdf$/);
    }
  });

  it("gives every tab a title and description in both locales", () => {
    for (const section of mediaKitSections) {
      expect(section.title.length).toBeGreaterThan(0);
      expect(section.titleEs.length).toBeGreaterThan(0);
      expect(section.description.length).toBeGreaterThan(20);
      expect(section.descriptionEs.length).toBeGreaterThan(20);
    }
  });
});

describe("mediaDownloads", () => {
  it("offers the complete kit as a download", () => {
    const kit = mediaDownloads.find((d) => d.id === "media-kit");
    expect(kit).toBeDefined();
    expect(kit!.available).toBe(true);
    expect(kit!.href).toMatch(/^\/media\/.+\.pdf$/);
  });

  // The supplied flyer prints www.ktddoctor.com and its QR code encodes the
  // same misspelling, so scanning it sends families to a domain that is not
  // the practice's. It stays switched off until a corrected export arrives.
  it("keeps the flyer switched off while its QR code points at the wrong domain", () => {
    const flyer = mediaDownloads.find((d) => d.id === "flyer");
    expect(flyer).toBeDefined();
    expect(flyer!.available).toBe(false);
    expect(flyer!.unavailableReason).toMatch(/ktddoctor/);
  });

  it("gives every download a title and description in both locales", () => {
    for (const download of mediaDownloads) {
      expect(download.title.length).toBeGreaterThan(0);
      expect(download.titleEs.length).toBeGreaterThan(0);
      expect(download.description.length).toBeGreaterThan(20);
      expect(download.descriptionEs.length).toBeGreaterThan(20);
    }
  });

  it("uses no em dash anywhere, per the project copy style", () => {
    const allText = [
      ...mediaKitSections.flatMap((s) => [s.title, s.titleEs, s.description, s.descriptionEs]),
      ...mediaDownloads.flatMap((d) => [d.title, d.titleEs, d.description, d.descriptionEs]),
    ].join(" ");
    expect(allText).not.toContain("—");
  });
});
