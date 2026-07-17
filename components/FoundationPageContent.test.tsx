import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithIntl as render } from "@/lib/test-utils";
import { FoundationPageContent } from "./FoundationPageContent";

describe("FoundationPageContent", () => {
  it("renders English mission and programs heading by default", () => {
    render(<FoundationPageContent />);
    expect(screen.getByText(/providing critical medical care/i)).toBeInTheDocument();
    expect(screen.getByText("Our programs")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /donate now/i })).toBeInTheDocument();
  });

  it("renders Spanish mission, programs heading, and Sri Lanka section when locale is es", () => {
    render(<FoundationPageContent />, "es");
    expect(screen.getByText(/brindando atención médica esencial/i)).toBeInTheDocument();
    expect(screen.getByText("Nuestros programas")).toBeInTheDocument();
    expect(screen.getByText("Transformando el Bienestar Escolar en Sri Lanka")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /donar ahora/i })).toBeInTheDocument();
  });
});
