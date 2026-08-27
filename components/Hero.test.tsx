import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithIntl as render } from "@/lib/test-utils";
import { Hero } from "./Hero";
import { locations } from "@/data/locations";
import { BOOKING_URL } from "@/lib/constants";

describe("Hero", () => {
  it("renders the badge, headline, and subheading", () => {
    render(<Hero />);
    expect(screen.getByText(`${locations.length} clinics across Greater LA`)).toBeInTheDocument();
    expect(screen.getByText("Compassionate pediatric care,")).toBeInTheDocument();
    expect(screen.getByText("close to home.")).toBeInTheDocument();
  });

  it("renders the 3 CTA buttons with correct hrefs", () => {
    render(<Hero />);
    expect(screen.getByRole("link", { name: /book an appointment/i })).toHaveAttribute(
      "href",
      BOOKING_URL
    );
    expect(screen.getByRole("link", { name: /find a doctor/i })).toHaveAttribute(
      "href",
      "/doctors"
    );
    expect(screen.getByRole("link", { name: /find a clinic/i })).toHaveAttribute(
      "href",
      "/locations"
    );
  });

  it("renders all 4 stat labels", () => {
    render(<Hero />);
    expect(screen.getByText("Clinic locations")).toBeInTheDocument();
    expect(screen.getByText("Board-certified providers")).toBeInTheDocument();
    expect(screen.getByText("Years of pediatric care")).toBeInTheDocument();
    expect(screen.getByText("Ages served")).toBeInTheDocument();
  });

  it("renders the embedded One Network panel with its social row", () => {
    render(<Hero />);
    expect(screen.getByRole("link", { name: /explore the network/i })).toHaveAttribute(
      "href",
      "/network"
    );
    expect(screen.getByRole("link", { name: "Facebook" })).toBeInTheDocument();
  });

  it("sizes the hero to one screenful below the sticky header on large viewports", () => {
    const { container } = render(<Hero />);
    const section = container.querySelector("section");
    expect(section?.className).toContain("lg:min-h-[calc(100svh-var(--header-h,4rem))]");
    expect(section?.className).not.toContain("lg:min-h-[44rem]");
  });

  it("scales hero vertical padding with viewport height instead of a fixed lg:py-20", () => {
    const { container } = render(<Hero />);
    const content = container.querySelector("section > div.relative");
    expect(content?.className).toContain("lg:py-[clamp(1rem,4svh,3.5rem)]");
    expect(content?.className).not.toContain("lg:py-20");
  });
});
