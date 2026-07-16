import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { locations } from "@/data/locations";
import TestimonialsPage from "./page";

describe("TestimonialsPage", () => {
  it("renders the heading", () => {
    render(<TestimonialsPage />);
    expect(
      screen.getByRole("heading", { name: "Share Your Experience" })
    ).toBeInTheDocument();
  });

  it("renders a review link for every clinic location", () => {
    render(<TestimonialsPage />);
    for (const location of locations) {
      expect(screen.getByRole("link", { name: location.name })).toBeInTheDocument();
    }
  });

  it("links a clinic to a Google Maps search for its reviews", () => {
    render(<TestimonialsPage />);
    const link = screen.getByRole("link", { name: "Agoura Hills" });
    expect(link).toHaveAttribute(
      "href",
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        "Kids & Teens Medical Group Agoura Hills 5115 Clareton Dr UNIT 150, Agoura Hills, CA 91301"
      )}`
    );
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });
});
