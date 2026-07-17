import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithIntl as render } from "@/lib/test-utils";
import { DonateTab } from "./DonateTab";
import { foundation } from "@/data/foundation";

describe("DonateTab", () => {
  it("links to the foundation donate URL, opening in a new tab", () => {
    render(<DonateTab />);
    const link = screen.getByRole("link", {
      name: /donate to the kids and teens foundation/i,
    });
    expect(link).toHaveAttribute("href", foundation.donateUrl);
    expect(link).toHaveAttribute("target", "_blank");
    expect(link.getAttribute("rel")).toContain("noopener");
  });

  it("shows the visible Donate label", () => {
    render(<DonateTab />);
    expect(screen.getByText("Donate")).toBeInTheDocument();
  });

  it("renders Spanish label and aria-label when locale is es", () => {
    render(<DonateTab />, "es");
    expect(
      screen.getByRole("link", { name: /donar a la fundación kids and teens/i })
    ).toBeInTheDocument();
    expect(screen.getByText("Donar")).toBeInTheDocument();
  });
});
