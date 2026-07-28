import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithIntl as render } from "@/lib/test-utils";
import { HeroNetworkPanel } from "./HeroNetworkPanel";
import { networkBrands } from "@/data/network";
import { serviceCategories } from "@/data/services";
import { locations } from "@/data/locations";

describe("HeroNetworkPanel", () => {
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

  it("renders all 6 rows with correct links", () => {
    render(<HeroNetworkPanel />);
    expect(screen.getByRole("link", { name: /book appointment/i })).toHaveAttribute(
      "href",
      expect.stringContaining("healow.com")
    );
    expect(screen.getByRole("link", { name: /supporting network/i })).toHaveAttribute(
      "href",
      "/network"
    );
    expect(screen.getByRole("link", { name: /services/i })).toHaveAttribute("href", "/services");
    expect(screen.getByRole("link", { name: /telehealth/i })).toHaveAttribute(
      "href",
      "/services/telehealth"
    );
    expect(screen.getByRole("link", { name: /locations/i })).toHaveAttribute(
      "href",
      "/locations"
    );
  });

  it("shows the real partner count on the Supporting Network row", () => {
    render(<HeroNetworkPanel />);
    const expectedCount = networkBrands.length - 1;
    expect(
      screen.getByText(`${expectedCount} partner organizations across the network.`)
    ).toBeInTheDocument();
  });

  it("shows the real service count as the Services row's tag", () => {
    render(<HeroNetworkPanel />);
    const expectedCount = serviceCategories.flatMap((c) => c.services).length;
    expect(screen.getByText(String(expectedCount))).toBeInTheDocument();
  });

  it("shows the real location count as the Locations row's tag", () => {
    render(<HeroNetworkPanel />);
    expect(screen.getByText(String(locations.length))).toBeInTheDocument();
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
