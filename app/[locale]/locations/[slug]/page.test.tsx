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
});
