import { describe, it, expect } from "vitest";
import { faqs } from "./faq";

describe("faq data", () => {
  it("has the 8 questions from the current homepage content", () => {
    expect(faqs.map((f) => f.id).sort()).toEqual(
      [
        "first-visit",
        "walk-ins",
        "insurance-plans",
        "ages-treated",
        "telehealth",
        "switch-doctor",
        "after-hours",
        "transfer-hmo",
      ].sort()
    );
  });

  it("every question and answer is non-empty text", () => {
    for (const faq of faqs) {
      expect(faq.question.length).toBeGreaterThan(0);
      expect(faq.answer.length).toBeGreaterThan(0);
    }
  });

  it("every FAQ has a Spanish question and answer with no em dash", () => {
    for (const faq of faqs) {
      expect(faq.questionEs.length).toBeGreaterThan(0);
      expect(faq.answerEs.length).toBeGreaterThan(20);
      expect(faq.questionEs).not.toContain("—");
      expect(faq.answerEs).not.toContain("—");
    }
  });
});
