import { describe, it, expect } from "vitest";
import {
  emailShell,
  emailRowTable,
  emailBadge,
  emailMessageBlock,
  mailtoLink,
  telLink,
} from "./emailTemplate";

describe("emailShell", () => {
  it("includes the SITE_NAME eyebrow, title, body, and footer", () => {
    const html = emailShell({
      title: "New Website Contact Message",
      bodyHtml: "<p>BODY_MARKER</p>",
      footerText: "FOOTER_MARKER",
    });
    expect(html).toContain("Kids &amp; Teens Medical Group");
    expect(html).toContain("New Website Contact Message");
    expect(html).toContain("BODY_MARKER");
    expect(html).toContain("FOOTER_MARKER");
  });
});

describe("emailRowTable", () => {
  it("renders each row's label and value", () => {
    const html = emailRowTable([
      { label: "Name", valueHtml: "Jane Doe" },
      { label: "Email", valueHtml: "jane@example.com" },
    ]);
    expect(html).toContain("Name");
    expect(html).toContain("Jane Doe");
    expect(html).toContain("Email");
    expect(html).toContain("jane@example.com");
  });

  it("renders an empty table body for an empty row list", () => {
    expect(() => emailRowTable([])).not.toThrow();
  });
});

describe("emailBadge", () => {
  it("renders the label and pill value", () => {
    const html = emailBadge("Applying for", "Pediatrician (MD/DO)");
    expect(html).toContain("Applying for");
    expect(html).toContain("Pediatrician (MD/DO)");
  });
});

describe("emailMessageBlock", () => {
  it("renders the label and message html", () => {
    const html = emailMessageBlock("Message", "Hello<br>world");
    expect(html).toContain("Message");
    expect(html).toContain("Hello<br>world");
  });
});

describe("mailtoLink", () => {
  it("wraps the escaped email in a mailto: link", () => {
    const html = mailtoLink("jane@example.com");
    expect(html).toContain('href="mailto:jane@example.com"');
    expect(html).toContain(">jane@example.com<");
  });
});

describe("telLink", () => {
  it("wraps the escaped phone display text in a tel: link with digits-only href", () => {
    const html = telLink("(555) 123-4567");
    expect(html).toContain('href="tel:5551234567"');
    expect(html).toContain(">(555) 123-4567<");
  });
});
