import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithIntl as render } from "@/lib/test-utils";
import { ResourcesPageContent } from "./ResourcesPageContent";

describe("ResourcesPageContent", () => {
  it("renders the English heading and all 5 real resources by default", () => {
    render(<ResourcesPageContent />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Everything in one place."
    );
    expect(screen.getByText("Our Doctors")).toBeInTheDocument();
  });

  it("renders the Spanish heading and resource names when locale is es", () => {
    render(<ResourcesPageContent />, "es");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Todo en un solo lugar.");
    expect(screen.getByText("Nuestros Doctores")).toBeInTheDocument();
  });
});
