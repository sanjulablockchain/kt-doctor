import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithIntl as render } from "@/lib/test-utils";
import { NetworkCard } from "./NetworkCard";

const ktmgBrand = {
  id: "ktmg",
  name: "Kids & Teens Medical Group",
  tagline: "The flagship pediatric network.",
  description: "Board-certified pediatric care across 24 clinics.",
  services: ["Primary Care", "Urgent Care"],
  logoSrc: "/clinic-logo.svg",
  internalHref: "/doctors",
};

const sgmBrand = {
  id: "st-gianna",
  name: "St. Gianna Medical Group",
  tagline: "Family practice for all ages.",
  description: "Comprehensive healthcare for adults and children.",
  services: ["Same-Day Appointments", "24/7 Booking"],
  logoSrc: "/sgm-logo.png",
  externalUrl: "https://www.sgmdoctor.com",
};

const sjhBrand = {
  id: "st-joseph-hospital",
  name: "St. Joseph Hospital Negombo",
  tagline: "US-standard care in Negombo, Sri Lanka.",
  description: "A hospital in Negombo, Sri Lanka, managed by KTMG USA.",
  services: ["Emergency Care", "Telemedicine"],
  logoSrc: "/sjh-logo.png",
  externalUrl: "https://www.sjhospital.lk",
  partnerCredit: {
    label: "Insurance coordination via Asiacorp Insurance Brokers",
    url: "https://acig.lk",
  },
};

describe("NetworkCard", () => {
  it("renders an internal link for a brand with internalHref", () => {
    render(<NetworkCard brand={ktmgBrand} />);
    expect(screen.getByText("Kids & Teens Medical Group")).toBeInTheDocument();
    const link = screen.getByRole("link", { name: /browse doctors/i });
    expect(link).toHaveAttribute("href", "/doctors");
  });

  it("renders an external link for a brand with externalUrl, opening in a new tab", () => {
    render(<NetworkCard brand={sgmBrand} />);
    expect(screen.getByText("St. Gianna Medical Group")).toBeInTheDocument();
    const link = screen.getByRole("link", { name: /visit site/i });
    expect(link).toHaveAttribute("href", "https://www.sgmdoctor.com");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renders the full services list by default", () => {
    render(<NetworkCard brand={sgmBrand} />);
    expect(screen.getByText("Same-Day Appointments")).toBeInTheDocument();
    expect(screen.getByText("24/7 Booking")).toBeInTheDocument();
  });

  it("hides the services list and tagline in compact mode", () => {
    render(<NetworkCard brand={sgmBrand} compact />);
    expect(screen.queryByText("Same-Day Appointments")).not.toBeInTheDocument();
    expect(screen.queryByText("Family practice for all ages.")).not.toBeInTheDocument();
    expect(screen.getByText("Comprehensive healthcare for adults and children.")).toBeInTheDocument();
  });

  it("centers the logo instead of left-aligning it", () => {
    render(<NetworkCard brand={ktmgBrand} />);
    const logo = screen.getByAltText("Kids & Teens Medical Group logo");
    expect(logo.parentElement).toHaveClass("justify-center");
  });

  it("anchors the CTA link to the bottom of the card regardless of description length", () => {
    render(<NetworkCard brand={ktmgBrand} />);
    const link = screen.getByRole("link", { name: /browse doctors/i });
    expect(link.parentElement).toHaveClass("mt-auto");
  });

  it("renders a partner credit link when the brand has one", () => {
    render(<NetworkCard brand={sjhBrand} />);
    const creditLink = screen.getByRole("link", {
      name: /insurance coordination via asiacorp insurance brokers/i,
    });
    expect(creditLink).toHaveAttribute("href", "https://acig.lk");
    expect(creditLink).toHaveAttribute("target", "_blank");
    expect(creditLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("does not render a partner credit link when the brand has none", () => {
    render(<NetworkCard brand={ktmgBrand} />);
    expect(screen.queryByText(/insurance coordination/i)).not.toBeInTheDocument();
  });
});
