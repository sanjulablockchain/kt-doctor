import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithIntl as render } from "@/lib/test-utils";
import { BOOKING_URL } from "@/lib/constants";
import LocationDetailPage from "./page";

describe("LocationDetailPage", () => {
  it("links each provider card directly to that provider's own Healow booking page", async () => {
    const ui = await LocationDetailPage({ params: Promise.resolve({ slug: "agoura-hills" }) });
    render(ui);

    const amrita = screen.getByRole("link", { name: /amrita dosanjh/i });
    expect(amrita).toHaveAttribute(
      "href",
      "https://healow.com/apps/provider/amrita-dosanjh-3161324"
    );
    expect(amrita).toHaveAttribute("target", "_blank");

    const snyder = screen.getByRole("link", { name: /mark snyder/i });
    expect(snyder).toHaveAttribute(
      "href",
      "https://healow.com/apps/provider/mark-snyder-3161340"
    );
    expect(snyder).toHaveAttribute("target", "_blank");
  });

  it("does not fall back to the shared practice booking URL when the location has bookable providers", async () => {
    const ui = await LocationDetailPage({ params: Promise.resolve({ slug: "agoura-hills" }) });
    render(ui);

    const links = screen.getAllByRole("link");
    expect(links.some((el) => el.getAttribute("href") === BOOKING_URL)).toBe(false);
  });

  it("renders a primary 'Book Appointment Now' CTA linking to the clinic's Healow facility URL", async () => {
    const ui = await LocationDetailPage({ params: Promise.resolve({ slug: "agoura-hills" }) });
    render(ui);

    const cta = screen.getByRole("link", { name: /book appointment now/i });
    expect(cta).toHaveAttribute(
      "href",
      "https://healow.com/apps/practice/janesri-de-silva-md-a-prof-corp-dba-kids-and-teens-medical-group-25634?v=2&t=2&f=8mqPBWAOD8V9GrMn"
    );
    expect(cta).toHaveAttribute("target", "_blank");
  });

  it("falls back to the shared practice booking URL on the telehealth location (no facility link)", async () => {
    const ui = await LocationDetailPage({ params: Promise.resolve({ slug: "telehealth" }) });
    render(ui);

    const cta = screen.getByRole("link", { name: /book appointment now/i });
    expect(cta).toHaveAttribute("href", BOOKING_URL);
  });
});
