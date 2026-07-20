import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithIntl as render } from "@/lib/test-utils";
import { LegalPageContent } from "./LegalPageContent";

describe("LegalPageContent", () => {
  it("renders the privacy policy title, a section, and a back-to-home link", () => {
    render(<LegalPageContent doc="privacy" />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Privacy Policy" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "1. Information We Collect" })
    ).toBeInTheDocument();
    expect(screen.getByText(/Personal Information:/)).toBeInTheDocument();
    expect(screen.getByText(/Effective Date: July 18, 2026/)).toBeInTheDocument();

    expect(screen.getByRole("link", { name: /Back to Home/ })).toHaveAttribute("href", "/");
  });

  it("renders the terms and conditions title and a section", () => {
    render(<LegalPageContent doc="terms" />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Terms and Conditions" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "8. SMS Text Policy" })
    ).toBeInTheDocument();
  });

  it("renders Spanish content in the es locale", () => {
    render(<LegalPageContent doc="privacy" />, "es");

    expect(
      screen.getByRole("heading", { level: 1, name: "Política de Privacidad" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "1. Información que Recopilamos" })
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Volver al Inicio/ })).toBeInTheDocument();
  });
});
