import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithIntl as render } from "@/lib/test-utils";
import { NetworkPageContent } from "./NetworkPageContent";

describe("NetworkPageContent", () => {
  it("renders the English heading and all 4 real brands", () => {
    render(<NetworkPageContent />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "More ways to care for your family."
    );
    expect(screen.getByText("St. Gianna Medical Group")).toBeInTheDocument();
  });

  it("renders the Spanish heading when locale is es", () => {
    render(<NetworkPageContent />, "es");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Más formas de cuidar a su familia."
    );
  });

  it("groups brands under labeled sections instead of one flat grid", () => {
    render(<NetworkPageContent />);
    expect(screen.getByRole("heading", { name: "Pediatric & Family Care" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Sri Lanka Network" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Business & Support Partners" })).toBeInTheDocument();
  });

  it("orders sections care, then Sri Lanka, then business", () => {
    render(<NetworkPageContent />);
    const headings = screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent);
    expect(headings).toEqual([
      "Pediatric & Family Care",
      "Sri Lanka Network",
      "Business & Support Partners",
    ]);
  });

  it("marks KTMG as the flagship brand", () => {
    render(<NetworkPageContent />);
    expect(screen.getByText("Flagship network")).toBeInTheDocument();
  });
});
