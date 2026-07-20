import { describe, it, expect } from "vitest";
import { privacyPolicy, termsAndConditions, type LegalDocument } from "./legal";

const documents: Array<[string, LegalDocument]> = [
  ["privacyPolicy", privacyPolicy],
  ["termsAndConditions", termsAndConditions],
];

// Collect every user-facing string in a document so we can assert style rules
// (e.g. no em dashes) across the whole thing at once.
function allStrings(doc: LegalDocument): string[] {
  const out: string[] = [doc.intro.text, doc.intro.textEs];
  for (const section of doc.sections) {
    out.push(section.heading, section.headingEs);
    for (const block of section.blocks) {
      if (block.type === "paragraph") {
        out.push(block.text, block.textEs);
      } else {
        for (const item of block.items) {
          out.push(item.text, item.textEs);
          if (item.label) out.push(item.label);
          if (item.labelEs) out.push(item.labelEs);
        }
      }
    }
  }
  return out;
}

describe.each(documents)("legal document: %s", (_name, doc) => {
  it("has an intro with English and Spanish text", () => {
    expect(doc.intro.text.length).toBeGreaterThan(20);
    expect(doc.intro.textEs.length).toBeGreaterThan(20);
  });

  it("has a valid ISO effective date", () => {
    expect(doc.effectiveDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(Number.isNaN(new Date(doc.effectiveDate).getTime())).toBe(false);
  });

  it("has sections, each with an English and Spanish heading", () => {
    expect(doc.sections.length).toBeGreaterThan(0);
    for (const section of doc.sections) {
      expect(section.heading.length).toBeGreaterThan(0);
      expect(section.headingEs.length).toBeGreaterThan(0);
      expect(section.blocks.length).toBeGreaterThan(0);
    }
  });

  it("has an English and Spanish string for every paragraph and list item", () => {
    for (const section of doc.sections) {
      for (const block of section.blocks) {
        if (block.type === "paragraph") {
          expect(block.text.length).toBeGreaterThan(0);
          expect(block.textEs.length).toBeGreaterThan(0);
        } else {
          expect(block.items.length).toBeGreaterThan(0);
          for (const item of block.items) {
            expect(item.text.length).toBeGreaterThan(0);
            expect(item.textEs.length).toBeGreaterThan(0);
            // A bold label must be translated too: both present or both absent.
            expect(Boolean(item.label)).toBe(Boolean(item.labelEs));
          }
        }
      }
    }
  });

  it("contains no em dash (site style)", () => {
    expect(allStrings(doc).join(" ")).not.toContain("—");
  });
});
