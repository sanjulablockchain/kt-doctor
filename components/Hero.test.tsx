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
});
