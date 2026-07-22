import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithIntl as render } from "@/lib/test-utils";
import Home from "./page";

describe("Home page", () => {
  it("renders links to find a doctor, find a clinic, and book an appointment", () => {
    render(<Home />);

    expect(screen.getByRole("link", { name: /find a doctor/i })).toHaveAttribute(
      "href",
      "/doctors"
    );
    expect(screen.getByRole("link", { name: /find a clinic/i })).toHaveAttribute(
      "href",
      "/locations"
    );
    // The home page repeats the "Book an Appointment" CTA (hero and bottom
    // banner) intentionally. Both must point to the real Healow practice URL.
    const bookingLinks = screen.getAllByRole("link", { name: /book/i });
    expect(bookingLinks.length).toBeGreaterThanOrEqual(1);
    for (const link of bookingLinks) {
      expect(link).toHaveAttribute(
        "href",
        "https://healow.com/apps/practice/janesri-de-silva-md-a-prof-corp-dba-kids-and-teens-medical-group-25634?v=2&t=2"
      );
    }
  });

  it("renders a network teaser section linking to /network", () => {
    render(<Home />);
    expect(screen.getByText("St. Gianna Medical Group")).toBeInTheDocument();
    expect(screen.getByText("LA Intensive Pediatric Therapy")).toBeInTheDocument();
    expect(screen.getByText("St. Joseph Hospital Negombo")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /see the full network/i })).toHaveAttribute(
      "href",
      "/network"
    );
  });

  it("renders a foundation teaser section with a Donate Now link", () => {
    render(<Home />);
    expect(screen.getByText("Kids and Teens Foundation")).toBeInTheDocument();
    const donateLink = screen.getByRole("link", { name: /donate now/i });
    expect(donateLink).toHaveAttribute("href", "https://kidsandteensfoundation.org/donate/");
  });

  it("renders a floating Donate tab linking to the foundation donate page", () => {
    render(<Home />);
    const donateTab = screen.getByRole("link", {
      name: /donate to the kids and teens foundation/i,
    });
    expect(donateTab).toHaveAttribute(
      "href",
      "https://kidsandteensfoundation.org/donate/"
    );
    expect(donateTab).toHaveAttribute("target", "_blank");
  });

  it("renders a careers teaser linking to /careers", () => {
    render(<Home />);
    expect(screen.getByRole("link", { name: /join our team/i })).toHaveAttribute(
      "href",
      "/careers"
    );
  });

  it("renders an insurance teaser linking to /insurance", () => {
    render(<Home />);
    expect(screen.getByRole("link", { name: /see accepted insurance/i })).toHaveAttribute(
      "href",
      "/insurance"
    );
  });

  it("renders a standalone Resources section with the real resources and a link to /resources", () => {
    render(<Home />);
    expect(screen.getByText("Our Doctors")).toBeInTheDocument();
    expect(screen.getByText("Vaccine Schedule")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /browse all resources/i })).toHaveAttribute(
      "href",
      "/resources"
    );
  });

  it("renders a services pill cloud section with links to individual service pages", () => {
    render(<Home />);
    expect(screen.getByText("Comprehensive Pediatric Services")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Telehealth" })).toHaveAttribute(
      "href",
      "/services/telehealth"
    );
    expect(screen.getByRole("link", { name: "Well Child Exam" })).toHaveAttribute(
      "href",
      "/services/well-child-exam"
    );
    expect(screen.getByRole("link", { name: /view all services/i })).toHaveAttribute(
      "href",
      "/services"
    );
  });

  it("renders a Featured Stories section linking to the on-site blog post pages", () => {
    render(<Home />);
    expect(screen.getByText("Featured Stories")).toBeInTheDocument();

    const storyLink = screen.getByRole("link", { name: /halloween safety tips for parents/i });
    expect(storyLink).toHaveAttribute("href", "/blog/halloween-safety-tips");
  });

  it("renders a Trusted Partners & Affiliations section with all 7 real partner logos", () => {
    render(<Home />);
    expect(screen.getByText("Trusted Partners & Affiliations")).toBeInTheDocument();
    expect(screen.getByAltText("Children's Hospital Los Angeles")).toBeInTheDocument();
    expect(screen.getByAltText("Cedars-Sinai")).toBeInTheDocument();
    expect(screen.getByAltText("LA Care Health Plan")).toBeInTheDocument();
    expect(screen.getByAltText("Optum")).toBeInTheDocument();
    expect(screen.getByAltText("Molina Healthcare")).toBeInTheDocument();
    expect(screen.getByAltText("Regal Medical Group")).toBeInTheDocument();
    expect(screen.getByAltText("Providence")).toBeInTheDocument();
  });

  it("renders a FAQ section with the section heading and first question", () => {
    render(<Home />);
    expect(screen.getByText("Frequently Asked Questions")).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: /what should i bring to my child's first visit/i,
      })
    ).toBeInTheDocument();
  });

  it("renders the hero heading and CTA copy in Spanish when locale is es", () => {
    render(<Home />, "es");
    expect(screen.getByText("cerca de casa.")).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /reservar una cita/i }).length).toBeGreaterThanOrEqual(
      1
    );
  });

  it("renders the services pill-cloud eyebrow and heading in Spanish when locale is es", () => {
    render(<Home />, "es");
    expect(screen.getByText("Servicios Pediátricos Integrales")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /ver todos los servicios/i })).toHaveAttribute(
      "href",
      "/es/services"
    );
  });

  it("renders the services pill-cloud labels in Spanish when locale is es", () => {
    render(<Home />, "es");
    expect(screen.getByRole("link", { name: "Telesalud" })).toHaveAttribute(
      "href",
      "/es/services/telehealth"
    );
    expect(screen.getByRole("link", { name: "Examen de Niño Sano" })).toHaveAttribute(
      "href",
      "/es/services/well-child-exam"
    );
  });

  it("renders the Featured Stories heading in Spanish when locale is es", () => {
    render(<Home />, "es");
    expect(screen.getByText("Historias Destacadas")).toBeInTheDocument();
  });

  it("renders the Featured Stories card titles in Spanish when locale is es", () => {
    render(<Home />, "es");
    expect(
      screen.getByText("Consejos de Seguridad para Halloween para los Padres")
    ).toBeInTheDocument();
  });

  it("renders the Resources section heading in Spanish when locale is es", () => {
    render(<Home />, "es");
    expect(
      screen.getByText("Todo lo que su familia necesita, en un solo lugar.")
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /ver todos los recursos/i })).toHaveAttribute(
      "href",
      "/es/resources"
    );
  });

  it("renders a telehealth teaser linking to /services/telehealth", () => {
    render(<Home />);
    expect(screen.getByRole("link", { name: /learn about telehealth/i })).toHaveAttribute(
      "href",
      "/services/telehealth"
    );
  });

  it("renders the telehealth teaser CTA in Spanish when locale is es", () => {
    render(<Home />, "es");
    expect(screen.getByRole("link", { name: /conozca la telesalud/i })).toHaveAttribute(
      "href",
      "/es/services/telehealth"
    );
  });
});
