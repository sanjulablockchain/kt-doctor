import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import FoundationPage from "./page";

describe("FoundationPage", () => {
  it("renders the mission and all 6 real programs", () => {
    render(<FoundationPage />);
    expect(screen.getByText("Kids and Teens Foundation")).toBeInTheDocument();
    expect(screen.getByText("Free Clinic Days & Continued Care")).toBeInTheDocument();
    expect(screen.getByText("Medical Missions")).toBeInTheDocument();
    expect(screen.getByText("Internship Opportunities")).toBeInTheDocument();
    expect(screen.getByText("Mentorship")).toBeInTheDocument();
    expect(screen.getByText("Community & Educational Outreach")).toBeInTheDocument();
    expect(screen.getByText("Scholarships")).toBeInTheDocument();
  });

  it("renders a Donate Now link to the real external donate page", () => {
    render(<FoundationPage />);
    const donateLink = screen.getByRole("link", { name: /donate now/i });
    expect(donateLink).toHaveAttribute("href", "https://kidsandteensfoundation.org/donate/");
    expect(donateLink).toHaveAttribute("target", "_blank");
    expect(donateLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renders a link to the real foundation site", () => {
    render(<FoundationPage />);
    const siteLink = screen.getByRole("link", { name: /visit the foundation site/i });
    expect(siteLink).toHaveAttribute("href", "https://kidsandteensfoundation.org");
    expect(siteLink).toHaveAttribute("target", "_blank");
  });

  it("has an h1 naming the Foundation itself, not the programs list", () => {
    render(<FoundationPage />);
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1).toHaveTextContent("Kids and Teens Foundation");
  });

  it("renders the Sri Lanka school wellness section with its heading and schools", () => {
    render(<FoundationPage />);
    expect(screen.getByText("Transforming School Wellness in Sri Lanka")).toBeInTheDocument();
    expect(screen.getByText("St. Peter's College")).toBeInTheDocument();
    expect(screen.getByText("Maristella College")).toBeInTheDocument();
  });

  it("renders a link to the live campaign for current donation progress", () => {
    render(<FoundationPage />);
    const campaignLink = screen.getByRole("link", {
      name: /see live campaign progress/i,
    });
    expect(campaignLink).toHaveAttribute("href", "https://kidsandteensfoundation.org");
    expect(campaignLink).toHaveAttribute("target", "_blank");
  });
});
