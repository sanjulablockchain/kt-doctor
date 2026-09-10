import { describe, it, expect } from "vitest";
import { toE164 } from "./phone";

describe("toE164", () => {
  it("converts a US display number into a dialable E.164 number", () => {
    expect(toE164("(818) 361-5437")).toBe("+18183615437");
  });

  it("ignores whatever separators the display number happens to use", () => {
    expect(toE164("626.298.7121")).toBe("+16262987121");
    expect(toE164("626 298 7121")).toBe("+16262987121");
  });
});
