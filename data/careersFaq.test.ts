import { describe, it, expect } from "vitest";
import { careersFaq } from "./careersFaq";

describe("careers FAQ data", () => {
  it("has exactly 7 items with unique ids", () => {
    expect(careersFaq.length).toBe(7);
    const ids = careersFaq.map((f) => f.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every item has a question and answer in both languages", () => {
    for (const item of careersFaq) {
      expect(item.question.length).toBeGreaterThan(0);
      expect(item.questionEs.length).toBeGreaterThan(0);
      expect(item.answer.length).toBeGreaterThan(0);
      expect(item.answerEs.length).toBeGreaterThan(0);
    }
  });

  it("contains no em dash in any string", () => {
    const strings = careersFaq.flatMap((f) => [f.question, f.questionEs, f.answer, f.answerEs]);
    for (const s of strings) expect(s).not.toContain("—");
  });
});
