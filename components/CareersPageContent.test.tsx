import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithIntl as render } from "@/lib/test-utils";
import { CareersPageContent } from "./CareersPageContent";

describe("CareersPageContent", () => {
  it("renders the English heading and resume link by default", () => {
    render(<CareersPageContent />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Build your career at Kids & Teens."
    );
    expect(screen.getByRole("link", { name: /email us your resume/i })).toBeInTheDocument();
  });

  it("renders the Spanish heading when locale is es", () => {
    render(<CareersPageContent />, "es");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Construya su carrera en Kids & Teens."
    );
    expect(screen.getByRole("link", { name: /envíenos su currículum/i })).toBeInTheDocument();
  });
});
