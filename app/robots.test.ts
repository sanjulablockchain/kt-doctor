import { describe, it, expect } from "vitest";
import robots from "./robots";

describe("robots", () => {
  const result = robots();

  it("allows all crawlers", () => {
    const rules = Array.isArray(result.rules) ? result.rules[0] : result.rules;
    expect(rules.userAgent).toBe("*");
    expect(rules.allow).toBe("/");
  });

  it("points to the absolute sitemap URL", () => {
    expect(result.sitemap).toBe("https://www.ktdoctor.com/sitemap.xml");
  });
});
