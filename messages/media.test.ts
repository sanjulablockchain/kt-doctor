import { describe, it, expect } from "vitest";
import en from "./en.json";
import es from "./es.json";

function keyPaths(value: unknown, prefix = ""): string[] {
  if (value === null || typeof value !== "object" || Array.isArray(value)) return [prefix];
  return Object.entries(value as Record<string, unknown>).flatMap(([key, child]) =>
    keyPaths(child, prefix ? `${prefix}.${key}` : key)
  );
}

describe("Media messages", () => {
  it("defines the Media namespace in both locales", () => {
    expect(en.Media).toBeDefined();
    expect(es.Media).toBeDefined();
  });

  it("uses an identical key structure in English and Spanish", () => {
    const enPaths = keyPaths(en.Media).sort();
    // Guards against both namespaces being absent, which would otherwise make
    // the comparison below pass on two empty structures.
    expect(enPaths.length).toBeGreaterThan(5);
    expect(keyPaths(es.Media).sort()).toEqual(enPaths);
  });

  it("translates every Media string rather than leaving the English in place", () => {
    for (const key of Object.keys(en.Media as Record<string, string>)) {
      const translated = (es.Media as Record<string, string>)[key];
      expect(translated, `Media.${key} missing in es`).toBeDefined();
      expect(translated.length).toBeGreaterThan(0);
    }
  });

  it("adds the Media nav label to the Header namespace in both locales", () => {
    expect(en.Header.media).toBe("Media");
    expect(es.Header.media.length).toBeGreaterThan(0);
  });

  it("adds Seo metadata for the media hub in both locales", () => {
    for (const messages of [en, es]) {
      expect(messages.Seo.media.title.length).toBeGreaterThan(0);
      expect(messages.Seo.media.description.length).toBeGreaterThan(40);
    }
  });

  it("uses no em dash in any Media or Seo.media copy, per the project style", () => {
    const strings = [
      ...Object.values(en.Media as Record<string, string>),
      ...Object.values(es.Media as Record<string, string>),
      ...Object.values(en.Seo.media),
      ...Object.values(es.Seo.media),
      en.Header.media,
      es.Header.media,
    ];
    expect(strings.join(" ")).not.toContain("—");
  });
});
