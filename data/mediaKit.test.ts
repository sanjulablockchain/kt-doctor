import { describe, it, expect } from "vitest";
import { mediaKitSections, mediaDownloads, uscFlyer } from "./mediaKit";
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
    expect(kit!.href).toMatch(/^\/media\/.+\.pdf$/);
  });

  it("titles the kit download with the practice's real name", () => {
    const kit = mediaDownloads.find((d) => d.id === "media-kit")!;
    expect(kit.title).toBe("Kids & Teens Medical Group | Media Kit");
    expect(kit.description).toBe(
      "Inclusive of Press Release, Founder Biography, Services, Network, Foundation, Telehealth"
    );
  });

  // "Kids & Teens Media Group" appeared in the revision document; the practice
  // is Kids & Teens Medical Group, as the same document says elsewhere.
  it("never misspells the practice name as Media Group", () => {
    const allText = [
      ...mediaKitSections.flatMap((s) => [s.title, s.titleEs, s.description, s.descriptionEs]),
      ...mediaDownloads.flatMap((d) => [d.title, d.titleEs, d.description, d.descriptionEs]),
    ].join(" ");
    expect(allText).not.toContain("Teens Media Group");
  });

  // The flyer used to sit here as a switched-off download. It now has its own
  // display section, so Downloads holds only the kit.
  it("no longer lists the flyer, which has its own section", () => {
    expect(mediaDownloads.map((d) => d.id)).toEqual(["media-kit"]);
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

describe("uscFlyer", () => {
  it("points at the self-hosted flyer with its real pixel dimensions", () => {
    expect(uscFlyer.imageSrc).toBe("/media/ktmg-flyer.jpg");
    expect(uscFlyer.imageWidth).toBe(1080);
    expect(uscFlyer.imageHeight).toBe(1526);
  });

  it("carries alt text in both locales that names the practice and the partnership", () => {
    expect(uscFlyer.alt).toMatch(/Kids & Teens Medical Group/);
    expect(uscFlyer.alt).toMatch(/USC/);
    expect(uscFlyer.altEs.length).toBeGreaterThan(40);
  });

  // The flyer is a text-heavy image. Its substance has to exist as real text
  // for screen readers and for search, not only baked into a JPEG.
  it("restates the flyer's key facts as real bilingual text", () => {
    expect(uscFlyer.highlights.length).toBeGreaterThanOrEqual(3);
    for (const highlight of uscFlyer.highlights) {
      expect(highlight.text.length).toBeGreaterThan(10);
      expect(highlight.textEs.length).toBeGreaterThan(10);
    }
    const all = uscFlyer.highlights.map((h) => h.text).join(" ");
    expect(all).toMatch(/USC/);
    expect(all).toMatch(/L\.A\. Care/);
    expect(all).toMatch(/25/);
  });

  // Wording signed off by the client. Pinned exactly so a later tidy-up does
  // not quietly reword copy that was reviewed.
  it("carries the reviewer's approved wording for every highlight", () => {
    expect(uscFlyer.highlights.map((h) => h.text)).toEqual([
      "Proud USC Pediatrics partner of their Health Benefits Plan.",
      "Recipient of the L.A. Care Social Determinants of Health Award, in recognition of outstanding care.",
      "Founded in 2007, Kids & Teens Medical Group is the largest pediatric network in Southern California with 25 clinics, including our Telehealth service.",
      "Janesri De Silva, MD, FAAP, is the esteemed founder of Kids & Teens Medical Group, and a delegate to the California Medical Association.",
    ]);
  });

  it("uses no em dash and never names the misspelled domain", () => {
    const allText = [
      uscFlyer.alt,
      uscFlyer.altEs,
      ...uscFlyer.highlights.flatMap((h) => [h.text, h.textEs]),
    ].join(" ");
    expect(allText).not.toContain("—");
    expect(allText).not.toContain("ktddoctor");
  });
});
