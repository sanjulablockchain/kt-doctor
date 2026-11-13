import { describe, it, expect } from "vitest";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { stories } from "./stories";
import { AFTER_HOURS_PHONE } from "@/lib/constants";

const NEW_POST_IDS = ["cold-flu-rsv-season-2026", "holiday-travel-health-checklist"];

function storyText(id: string, lang: "en" | "es"): string {
  const s = stories.find((story) => story.id === id)!;
  return lang === "en"
    ? [s.title, s.excerpt, ...s.sections.flatMap((x) => [x.heading, x.body])].join(" ")
    : [s.titleEs, s.excerptEs, ...s.sections.flatMap((x) => [x.headingEs, x.bodyEs])].join(" ");
}

describe("stories data", () => {
  it("has 6 featured stories", () => {
    expect(stories).toHaveLength(6);
  });

  it("lists the November 2026 posts first, newest-first order", () => {
    expect(stories.slice(0, 2).map((s) => s.id)).toEqual(NEW_POST_IDS);
  });

  it("has unique story ids", () => {
    expect(new Set(stories.map((s) => s.id)).size).toBe(stories.length);
  });

  it("every story image exists in /public", () => {
    for (const story of stories) {
      expect(existsSync(join(process.cwd(), "public", story.imageSrc))).toBe(true);
    }
  });

  describe.each(NEW_POST_IDS)("new post %s", (id) => {
    it("is 500 to 700 words in English", () => {
      const words = storyText(id, "en").split(/\s+/).length;
      expect(words).toBeGreaterThanOrEqual(500);
      expect(words).toBeLessThanOrEqual(700);
    });

    it("ends with the same-day, telehealth and after-hours call to action in both languages", () => {
      const s = stories.find((story) => story.id === id)!;
      const last = s.sections[s.sections.length - 1];
      for (const body of [last.body, last.bodyEs]) {
        expect(body).toContain("25");
        expect(body).toContain("24/7");
        expect(body).toContain("6pm");
        expect(body).toContain("11pm");
        expect(body).toContain(AFTER_HOURS_PHONE);
      }
    });

    it("tells parents to call 911 for emergencies in both languages", () => {
      expect(storyText(id, "en")).toContain("Call 911");
      expect(storyText(id, "es")).toContain("Llame al 911");
    });

    it("contains no medication doses", () => {
      for (const lang of ["en", "es"] as const) {
        expect(storyText(id, lang)).not.toMatch(/\d\s*(mg|ml|mL|milligrams?|teaspoons?|tsp)\b/i);
      }
    });
  });

  it("includes the real featured stories with a local downloaded image and at least one section", () => {
    const titles = stories.map((s) => s.title);
    expect(titles).toEqual(
      expect.arrayContaining([
        "Supporting Our Young Patients: Celebrating Autism Awareness Month in Pediatric Care",
        "Breathe Easy This Winter: Simple Steps to Protect Your Child from Asthma",
        "Halloween Safety Tips for Parents",
        "The Difference between Pediatric Emergency Room & Urgent Care in California",
        "Flu, RSV and COVID Season: When to Bring Your Child In",
        "Traveling With Kids This Holiday Season: A Parent's Health Checklist",
      ])
    );

    for (const story of stories) {
      expect(story.imageSrc).toMatch(/^\/blog-/);
      expect(story.sections.length).toBeGreaterThan(0);
      for (const section of story.sections) {
        expect(section.heading.length).toBeGreaterThan(0);
        expect(section.body.length).toBeGreaterThan(20);
      }
    }
  });

  it("no story text contains an em dash", () => {
    const allText = stories
      .flatMap((s) => [
        s.title,
        s.date,
        s.excerpt,
        ...s.sections.flatMap((sec) => [sec.heading, sec.body]),
      ])
      .join(" ");
    expect(allText).not.toContain("—");
  });

  it("every story has real Spanish translations with no em dash", () => {
    for (const story of stories) {
      expect(story.titleEs.length).toBeGreaterThan(0);
      expect(story.excerptEs.length).toBeGreaterThan(20);
      expect(story.titleEs).not.toContain("—");
      expect(story.excerptEs).not.toContain("—");
      for (const section of story.sections) {
        expect(section.headingEs.length).toBeGreaterThan(0);
        expect(section.bodyEs.length).toBeGreaterThan(20);
        expect(section.headingEs).not.toContain("—");
        expect(section.bodyEs).not.toContain("—");
      }
    }
  });
});
