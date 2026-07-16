import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithIntl as render } from "@/lib/test-utils";
import { Footer } from "./Footer";

describe("Footer", () => {
  it("renders the phone, text line, and email as clickable links", () => {
    render(<Footer />);

    expect(screen.getByRole("link", { name: "(818) 361-5437" })).toHaveAttribute(
      "href",
      "tel:+18183615437"
    );
    expect(screen.getByRole("link", { name: /626\) 298-7121/ })).toHaveAttribute(
      "href",
      "sms:+16262987121"
    );
    expect(screen.getByRole("link", { name: "customerservice@ktdoctor.com" })).toHaveAttribute(
      "href",
      "mailto:customerservice@ktdoctor.com"
    );
  });

  it("renders links to every page on the site", () => {
    render(<Footer />);
    expect(screen.getByRole("link", { name: "About Us" })).toHaveAttribute("href", "/about");
    expect(screen.getByRole("link", { name: "Doctors" })).toHaveAttribute("href", "/doctors");
    expect(screen.getByRole("link", { name: "Locations" })).toHaveAttribute("href", "/locations");
    expect(screen.getByRole("link", { name: "Insurance" })).toHaveAttribute("href", "/insurance");
    expect(screen.getByRole("link", { name: "Resources" })).toHaveAttribute("href", "/resources");
    expect(screen.getByRole("link", { name: "Testimonials" })).toHaveAttribute(
      "href",
      "/testimonials"
    );
    expect(screen.getByRole("link", { name: "Network" })).toHaveAttribute("href", "/network");
    expect(screen.getByRole("link", { name: "Foundation" })).toHaveAttribute(
      "href",
      "/foundation"
    );
    expect(screen.getByRole("link", { name: "Careers" })).toHaveAttribute("href", "/careers");
  });

  it("uses the Spanish text line when rendered in the es locale", () => {
    render(<Footer />, "es");
    expect(screen.getByRole("link", { name: /818\) 423-5637/ })).toHaveAttribute(
      "href",
      "sms:+18184235637"
    );
  });
});
