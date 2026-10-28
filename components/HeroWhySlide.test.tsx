import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithIntl as render } from "@/lib/test-utils";
import { HeroWhySlide } from "./HeroWhySlide";

describe("HeroWhySlide", () => {
  it("leads with the USC partnership, logo included", () => {
    render(<HeroWhySlide />);
    expect(screen.getByText("Proud Tier 1 USC Pediatrics Partner")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "University of Southern California" })).toHaveAttribute(
      "src",
      "/partners/usc.png"
    );
  });

  it("renders the slogan as an h2, not a second h1", () => {
    render(<HeroWhySlide />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("Every kid. Every plan.");
    expect(screen.queryByRole("heading", { level: 1 })).not.toBeInTheDocument();
  });

  it("renders the four reasons, each linking to where a parent can act on it", () => {
    render(<HeroWhySlide />);
    const titles = screen.getAllByRole("heading", { level: 3 }).map((h) => h.textContent);
    expect(titles).toEqual([
      "All major insurance accepted",
      "Our own IPA (opens in a new tab)",
      "No kid left out (opens in a new tab)",
      "Telehealth, day or night",
    ]);
    expect(screen.getByRole("link", { name: "All major insurance accepted" })).toHaveAttribute(
      "href",
      "/insurance"
    );
    expect(screen.getByRole("link", { name: "Our own IPA (opens in a new tab)" })).toHaveAttribute(
      "href",
      "https://www.serendibhealthways.com/"
    );
    expect(screen.getByRole("link", { name: "No kid left out (opens in a new tab)" })).toHaveAttribute(
      "href",
      "https://www.laipt.org"
    );
    expect(screen.getByRole("link", { name: "Telehealth, day or night" })).toHaveAttribute(
      "href",
      "/services/telehealth"
    );
  });

  it("opens external reasons in a new tab", () => {
    render(<HeroWhySlide />);
    for (const name of ["Our own IPA (opens in a new tab)", "No kid left out (opens in a new tab)"]) {
      const link = screen.getByRole("link", { name });
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    }
  });

  it("names the IPA and the therapy centre from the network data", () => {
    render(<HeroWhySlide />);
    expect(screen.getByText(/Serendib Healthways gives HMO families our whole network/)).toBeInTheDocument();
    expect(screen.getByText(/special needs at LA Intensive Pediatric Therapy\./)).toBeInTheDocument();
  });

  it("highlights the 24/7 telehealth stat", () => {
    render(<HeroWhySlide />);
    expect(screen.getByText("80%").tagName).toBe("STRONG");
    expect(screen.getByText(/of single-practice pediatric offices don't offer 24\/7 telehealth\. We do\./)).toBeInTheDocument();
  });

  it("opens the booking chooser and links to accepted insurance", async () => {
    render(<HeroWhySlide />);
    await userEvent.click(screen.getByRole("button", { name: /book an appointment/i }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /see accepted insurance/i })).toHaveAttribute("href", "/insurance");
  });

  it("renders the Spanish copy", () => {
    render(<HeroWhySlide />, "es");
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("Cada niño. Cada plan.");
    expect(screen.getByText("Orgulloso socio pediátrico Tier 1 de USC")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Aceptamos todos los seguros principales" })).toBeInTheDocument();
  });
});
