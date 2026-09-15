import { describe, it, expect } from "vitest";
import { pressReleases } from "./pressReleases";
import { SITE_URL } from "@/lib/constants";

describe("pressReleases data", () => {
  it("includes the L.A. Care and USC recognition release", () => {
    const ids = pressReleases.map((r) => r.id);
    expect(ids).toContain("la-care-usc-recognition");
  });

  it("gives every release an ISO date that parses, plus a display date in both locales", () => {
    for (const release of pressReleases) {
      expect(release.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(Number.isNaN(Date.parse(release.date))).toBe(false);
      expect(release.displayDate.length).toBeGreaterThan(0);
      expect(release.displayDateEs.length).toBeGreaterThan(0);
    }
  });

  it("gives every release a headline, deck, dateline and excerpt in both locales", () => {
    for (const release of pressReleases) {
      for (const field of [
        release.title,
        release.titleEs,
        release.deck,
        release.deckEs,
        release.dateline,
        release.datelineEs,
      ]) {
        expect(field.length).toBeGreaterThan(0);
      }
      expect(release.excerpt.length).toBeGreaterThan(40);
      expect(release.excerptEs.length).toBeGreaterThan(40);
    }
  });

  it("gives every release real body paragraphs in both locales", () => {
    for (const release of pressReleases) {
      expect(release.body.length).toBeGreaterThan(3);
      for (const paragraph of release.body) {
        expect(paragraph.text.length).toBeGreaterThan(40);
        expect(paragraph.textEs.length).toBeGreaterThan(40);
      }
    }
  });

  it("serves the downloadable PDF from this site, not from a third-party share link", () => {
    for (const release of pressReleases) {
      expect(release.pdfHref).toMatch(/^\/media\/.+\.pdf$/);
      expect(release.pdfHref).not.toContain("box.com");
    }
  });

  it("never refers to the misspelled ktddoctor.com domain", () => {
    const allText = pressReleases
      .flatMap((r) => [
        r.title,
        r.titleEs,
        r.deck,
        r.deckEs,
        r.excerpt,
        r.excerptEs,
        ...r.body.flatMap((p) => [p.text, p.textEs]),
      ])
      .join(" ");
    expect(allText).not.toContain("ktddoctor");
    expect(SITE_URL).toBe("https://www.ktdoctor.com");
  });

  it("uses no em dash anywhere, per the project copy style", () => {
    const allText = pressReleases
      .flatMap((r) => [
        r.title,
        r.titleEs,
        r.deck,
        r.deckEs,
        r.excerpt,
        r.excerptEs,
        r.displayDate,
        r.displayDateEs,
        ...r.body.flatMap((p) => [p.text, p.textEs]),
      ])
      .join(" ");
    expect(allText).not.toContain("—");
  });

  it("keeps the quoted statements attributed to Dr. De Silva intact", () => {
    const release = pressReleases.find((r) => r.id === "la-care-usc-recognition");
    const body = release!.body.map((p) => p.text).join(" ");
    expect(body).toContain(
      "every child in every community receives the attention and treatment they deserve"
    );
    expect(body).toContain(
      "every child has the opportunity to thrive regardless of socioeconomic background"
    );
  });
});
