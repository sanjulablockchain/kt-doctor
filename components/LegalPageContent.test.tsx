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

  it("renders the SMS privacy policy with its effective date and STOP opt-out", () => {
    render(<LegalPageContent doc="smsPrivacy" />);

    expect(
      screen.getByRole("heading", { level: 1, name: "SMS Privacy Policy" })
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "1. Introduction" })).toBeInTheDocument();
    expect(screen.getByText(/Effective Date: November 12, 2026/)).toBeInTheDocument();
    expect(screen.getByText(/by replying STOP to any SMS message/)).toBeInTheDocument();
  });

  it("renders the SMS terms with a link to the SMS privacy policy", () => {
    render(<LegalPageContent doc="smsTerms" />);

    expect(
      screen.getByRole("heading", { level: 1, name: "SMS Terms and Conditions" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "10. Medical Emergencies" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "www.ktdoctor.com/sms-privacy-policy" })
    ).toHaveAttribute("href", "/sms-privacy-policy");
  });

  it("keeps the Spanish locale on SMS page links", () => {
    render(<LegalPageContent doc="smsTerms" />, "es");

    expect(
      screen.getByRole("heading", { level: 1, name: "Términos y Condiciones de SMS" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "www.ktdoctor.com/sms-privacy-policy" })
    ).toHaveAttribute("href", "/es/sms-privacy-policy");
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
