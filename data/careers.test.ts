import { describe, it, expect } from "vitest";
import { CAREERS_APPLY_MAILTO } from "./careers";

describe("careers data", () => {
  it("builds a mailto link to the real general email with a job application subject", () => {
    expect(CAREERS_APPLY_MAILTO).toBe(
      "mailto:customerservice@ktdoctor.com?subject=Job%20Application"
    );
  });
});
