import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithIntl as render } from "@/lib/test-utils";
import { NetworkCard } from "./NetworkCard";

const sampleBrand = {
  id: "ktmg",
  name: "Kids & Teens Medical Group",
  tagline: "The flagship pediatric network.",
  taglineEs: "La red pediátrica insignia.",
  description: "Board-certified pediatric care across 25 clinics in Greater LA, for ages 0 to 21.",
  descriptionEs:
    "Atención pediátrica certificada en 25 clínicas del área de Los Ángeles, para edades de 0 a 21 años.",
  services: ["Primary Care", "Urgent Care"],
  servicesEs: ["Atención Primaria", "Atención de Urgencia"],
  logoSrc: "/clinic-logo.svg",
  internalHref: "/doctors",
  category: "care" as const,
};

describe("NetworkCard", () => {
  it("renders English content by default", () => {
    render(<NetworkCard brand={sampleBrand} />);
    expect(screen.getByText("The flagship pediatric network.")).toBeInTheDocument();
    expect(screen.getByText(/board-certified pediatric care/i)).toBeInTheDocument();
    expect(screen.getByText("Primary Care")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /browse doctors/i })).toBeInTheDocument();
  });

  it("renders Spanish content when locale is es", () => {
    render(<NetworkCard brand={sampleBrand} />, "es");
    expect(screen.getByText("La red pediátrica insignia.")).toBeInTheDocument();
    expect(screen.getByText(/atención pediátrica certificada/i)).toBeInTheDocument();
    expect(screen.getByText("Atención Primaria")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /ver doctores/i })).toBeInTheDocument();
  });

  it("does not show the flagship badge for a non-flagship brand", () => {
    render(<NetworkCard brand={sampleBrand} />);
    expect(screen.queryByText("Flagship network")).not.toBeInTheDocument();
  });

  it("shows the flagship badge when brand.flagship is true", () => {
    render(<NetworkCard brand={{ ...sampleBrand, flagship: true }} />);
    expect(screen.getByText("Flagship network")).toBeInTheDocument();
  });

  it("renders a social link for each entry in brand.social", () => {
    const brand = {
      ...sampleBrand,
      social: [
        { platform: "facebook" as const, href: "https://www.facebook.com/example/" },
        { platform: "instagram" as const, href: "https://www.instagram.com/example/" },
      ],
    };
    render(<NetworkCard brand={brand} />);
    const facebookLink = screen.getByRole("link", { name: /kids & teens medical group on facebook/i });
    expect(facebookLink).toHaveAttribute("href", "https://www.facebook.com/example/");
    expect(facebookLink).toHaveAttribute("target", "_blank");
    expect(
      screen.getByRole("link", { name: /kids & teens medical group on instagram/i })
    ).toHaveAttribute("href", "https://www.instagram.com/example/");
  });

  it("does not render social links when brand.social is not set", () => {
    render(<NetworkCard brand={sampleBrand} />);
    expect(screen.queryByRole("link", { name: /on facebook/i })).not.toBeInTheDocument();
  });

  it("does not render social links in compact mode, even when brand.social is set", () => {
    const brand = {
      ...sampleBrand,
      social: [{ platform: "facebook" as const, href: "https://www.facebook.com/example/" }],
    };
    render(<NetworkCard brand={brand} compact />);
    expect(screen.queryByRole("link", { name: /on facebook/i })).not.toBeInTheDocument();
  });
});
