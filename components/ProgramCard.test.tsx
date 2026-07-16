import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProgramCard } from "./ProgramCard";

describe("ProgramCard", () => {
  it("renders the program name and description", () => {
    render(
      <ProgramCard
        program={{
          id: "scholarships",
          name: "Scholarships",
          description: "Home of the Janesri and Sunil De Silva Scholarship.",
        }}
      />
    );

    expect(screen.getByText("Scholarships")).toBeInTheDocument();
    expect(
      screen.getByText("Home of the Janesri and Sunil De Silva Scholarship.")
    ).toBeInTheDocument();
  });
});
