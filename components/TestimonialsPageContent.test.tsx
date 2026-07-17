import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithIntl as render } from "@/lib/test-utils";
import { TestimonialsPageContent } from "./TestimonialsPageContent";

describe("TestimonialsPageContent", () => {
  it("renders the English heading and location review links by default", () => {
    render(<TestimonialsPageContent />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Share Your Experience");
    expect(screen.getAllByRole("link").length).toBeGreaterThan(0);
  });

  it("renders the Spanish heading when locale is es", () => {
    render(<TestimonialsPageContent />, "es");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Comparta su Experiencia"
    );
    expect(screen.getByText("Reseñas de Google")).toBeInTheDocument();
  });
});
