import { describe, it, expect } from "vitest";
import { pressBios } from "./pressBios";
import { doctors } from "./doctors";

describe("pressBios data", () => {
  it("includes the founder's press biography", () => {
    expect(pressBios.map((b) => b.id)).toContain("janesri-de-silva");
  });

  it("cross-links every bio to a doctor who really exists on the site", () => {
    for (const bio of pressBios) {
      const doctor = doctors.find((d) => d.id === bio.doctorId);
      expect(doctor, `no doctor with id ${bio.doctorId}`).toBeDefined();
    }
  });

  it("gives every bio a name, role and summary in both locales", () => {
    for (const bio of pressBios) {
      expect(bio.name.length).toBeGreaterThan(0);
      expect(bio.credentials.length).toBeGreaterThan(0);
      expect(bio.role.length).toBeGreaterThan(0);
      expect(bio.roleEs.length).toBeGreaterThan(0);
      expect(bio.summary.length).toBeGreaterThan(40);
      expect(bio.summaryEs.length).toBeGreaterThan(40);
    }
  });

  it("gives every bio real body paragraphs in both locales", () => {
    for (const bio of pressBios) {
      expect(bio.body.length).toBeGreaterThan(2);
      for (const paragraph of bio.body) {
        expect(paragraph.text.length).toBeGreaterThan(40);
        expect(paragraph.textEs.length).toBeGreaterThan(40);
      }
    }
  });

  it("surfaces the speaking availability as its own field rather than burying it in the body", () => {
    const bio = pressBios.find((b) => b.id === "janesri-de-silva");
    expect(bio!.speaking).not.toBeNull();
    expect(bio!.speaking!.text).toMatch(/keynote/i);
    expect(bio!.speaking!.textEs.length).toBeGreaterThan(40);
  });

  // A biography is evergreen; the source PDF referenced a one-off event on a
  // fixed date, which would read as stale the day after it happened.
  it("carries no perishable event date in the body", () => {
    const allText = pressBios
      .flatMap((b) => b.body.flatMap((p) => [p.text, p.textEs]))
      .join(" ");
    expect(allText).not.toMatch(/October 6|Health Fair|Feria de Beneficios/i);
  });

  it("serves the downloadable PDF from this site, not from a third-party share link", () => {
    for (const bio of pressBios) {
      expect(bio.pdfHref).toMatch(/^\/media\/.+\.pdf$/);
      expect(bio.pdfHref).not.toContain("box.com");
    }
  });

  it("points at a portrait under /doctors so the press page reuses the real headshot", () => {
    for (const bio of pressBios) {
      expect(bio.portraitSrc).toMatch(/^\/doctors\/.+\.(webp|png|jpg)$/);
    }
  });

  it("uses no em dash anywhere, per the project copy style", () => {
    const allText = pressBios
      .flatMap((b) => [
        b.name,
        b.role,
        b.roleEs,
        b.summary,
        b.summaryEs,
        b.speaking?.text ?? "",
        b.speaking?.textEs ?? "",
        ...b.body.flatMap((p) => [p.text, p.textEs]),
      ])
      .join(" ");
    expect(allText).not.toContain("—");
  });
});
