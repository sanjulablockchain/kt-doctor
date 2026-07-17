import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithIntl as render } from "@/lib/test-utils";
import { ProgramCard } from "./ProgramCard";

const sampleProgram = {
  id: "scholarships",
  name: "Scholarships",
  nameEs: "Becas",
  description: "Home of the Janesri and Sunil De Silva Scholarship.",
  descriptionEs: "Sede de la Beca Janesri y Sunil De Silva.",
};

describe("ProgramCard", () => {
  it("renders English content by default", () => {
    render(<ProgramCard program={sampleProgram} />);
    expect(screen.getByText("Scholarships")).toBeInTheDocument();
    expect(screen.getByText("Home of the Janesri and Sunil De Silva Scholarship.")).toBeInTheDocument();
  });

  it("renders Spanish content when locale is es", () => {
    render(<ProgramCard program={sampleProgram} />, "es");
    expect(screen.getByText("Becas")).toBeInTheDocument();
    expect(screen.getByText("Sede de la Beca Janesri y Sunil De Silva.")).toBeInTheDocument();
  });
});
