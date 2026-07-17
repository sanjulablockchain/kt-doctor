import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithIntl as render } from "@/lib/test-utils";
import { InsurancePageContent } from "./InsurancePageContent";

describe("InsurancePageContent", () => {
  it("renders the English heading and accepted categories by default", () => {
    render(<InsurancePageContent />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "We accept all major insurance."
    );
    expect(screen.getByText("HMO")).toBeInTheDocument();
  });

  it("renders the Spanish heading when locale is es", () => {
    render(<InsurancePageContent />, "es");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Aceptamos todos los principales seguros."
    );
    expect(screen.getByRole("link", { name: /llame para verificar su plan/i })).toBeInTheDocument();
  });
});
