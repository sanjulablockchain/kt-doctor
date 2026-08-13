import { describe, it, expect, beforeEach, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithIntl as render } from "@/lib/test-utils";
import { HeroNetworkPanel } from "./HeroNetworkPanel";
import { networkBrands } from "@/data/network";

function brand(id: string) {
  const found = networkBrands.find((b) => b.id === id);
  if (!found) throw new Error(`Unknown network brand id: ${id}`);
  return found;
}

describe("HeroNetworkPanel", () => {
  beforeEach(() => {
    // jsdom doesn't implement scrollIntoView; these rows call it on click.
    Element.prototype.scrollIntoView = vi.fn();
  });

  it("renders the eyebrow, partner count badge, heading, and explore-network CTA", () => {
    render(<HeroNetworkPanel />);
    const expectedPartnerCount = networkBrands.length - 1;
    expect(screen.getByText("One Network")).toBeInTheDocument();
    expect(screen.getByText(`${expectedPartnerCount} partners`)).toBeInTheDocument();
    expect(screen.getByText("More ways to care for your family.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /explore the network/i })).toHaveAttribute(
      "href",
      "/network"
    );
  });

  it("renders the Book Appointment row linking externally", () => {
    render(<HeroNetworkPanel />);
    expect(screen.getByRole("link", { name: /book appointment/i })).toHaveAttribute(
      "href",
      expect.stringContaining("healow.com")
    );
  });

  it.each([
    ["st-gianna"],
    ["laipt"],
    ["serendib-healthways"],
    ["pediatric-after-hour"],
  ])("renders the %s row with its real name and tagline, linking to the network teaser", (id) => {
    render(<HeroNetworkPanel />);
    const { name, tagline } = brand(id);
    const link = screen.getByRole("link", { name: new RegExp(name, "i") });
    expect(link).toHaveAttribute("href", "#network-teaser");
    expect(screen.getByText(tagline)).toBeInTheDocument();
  });

  it("scrolls to the network teaser section when a partner row is clicked", async () => {
    const user = userEvent.setup();
    render(<HeroNetworkPanel />);
    document.body.insertAdjacentHTML("beforeend", '<section id="network-teaser"></section>');
    const target = document.getElementById("network-teaser")!;
    target.scrollIntoView = vi.fn();

    await user.click(screen.getByRole("link", { name: new RegExp(brand("laipt").name, "i") }));

    expect(target.scrollIntoView).toHaveBeenCalledWith({ behavior: "smooth", block: "start" });
  });

  it("renders the Sri Lanka row linking to the foundation page", () => {
    render(<HeroNetworkPanel />);
    const link = screen.getByRole("link", { name: /sri lanka/i });
    expect(link).toHaveAttribute("href", "/foundation");
    expect(link).not.toHaveAttribute("target");
  });

  it("renders the social row alongside the explore-network CTA", () => {
    render(<HeroNetworkPanel />);
    expect(screen.getByRole("link", { name: "Facebook" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "YouTube" })).toBeInTheDocument();
  });
});
