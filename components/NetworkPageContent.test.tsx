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
});
