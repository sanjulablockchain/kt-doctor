import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithIntl as render } from "@/lib/test-utils";
import ResourcesPage from "./page";

describe("ResourcesPage", () => {
  it("renders all 5 real resource categories", () => {
    render(<ResourcesPage />);
    expect(screen.getByText("Our Doctors")).toBeInTheDocument();
    expect(screen.getByText("Vaccine Schedule")).toBeInTheDocument();
    expect(screen.getByText("Patient Forms")).toBeInTheDocument();
    expect(screen.getByText("Developmental Milestone Guides")).toBeInTheDocument();
    expect(screen.getByText("Must Watch Videos")).toBeInTheDocument();
  });
});
