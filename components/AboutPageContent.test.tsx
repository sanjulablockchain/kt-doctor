import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithIntl as render } from "@/lib/test-utils";
import { AboutPageContent } from "./AboutPageContent";

describe("AboutPageContent", () => {
  it("renders the English tagline and care areas by default", () => {
    render(<AboutPageContent />);
    expect(
      screen.getByText("Caring for the Future Generations in Greater Los Angeles")
    ).toBeInTheDocument();
    expect(screen.getByText("Routine check-ups")).toBeInTheDocument();
  });

  it("renders the Spanish tagline and care areas when locale is es", () => {
    render(<AboutPageContent />, "es");
    expect(
      screen.getByText("Cuidando a las futuras generaciones del área de Los Ángeles")
    ).toBeInTheDocument();
    expect(screen.getByText("Chequeos de rutina")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /reservar una cita/i })).toBeInTheDocument();
  });
});
