import { describe, it, expect } from "vitest";
import { stories } from "./stories";

describe("stories data", () => {
  it("has exactly 4 real featured stories", () => {
    expect(stories).toHaveLength(4);
  });

  it("includes the real featured stories with a local downloaded image and at least one section", () => {
    const titles = stories.map((s) => s.title);
    expect(titles).toEqual(
      expect.arrayContaining([
        "Supporting Our Young Patients: Celebrating Autism Awareness Month in Pediatric Care",
        "Breathe Easy This Winter: Simple Steps to Protect Your Child from Asthma",
        "Halloween Safety Tips for Parents",
        "The Difference between Pediatric Emergency Room & Urgent Care in California",
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
});
