import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SriLankaTimeline } from "./SriLankaTimeline";
import type { SriLankaSchool } from "@/data/foundation";

const schools: SriLankaSchool[] = [
  {
    id: "school-a",
    name: "School A",
    location: "Negombo",
    studentCount: "500+ students",
    programs: ["Vision Screening", "Dental Check-ups"],
  },
  {
    id: "school-b",
    name: "School B",
    location: "Negombo",
    studentCount: "300+ students",
    programs: ["Telehealth Access"],
  },
];

describe("SriLankaTimeline", () => {
  it("renders every school's name, location, and student count", () => {
    render(<SriLankaTimeline schools={schools} />);
    expect(screen.getByText("School A")).toBeInTheDocument();
    expect(screen.getByText("Negombo · 500+ students")).toBeInTheDocument();
    expect(screen.getByText("School B")).toBeInTheDocument();
    expect(screen.getByText("Negombo · 300+ students")).toBeInTheDocument();
  });

  it("renders every school's program tags", () => {
    render(<SriLankaTimeline schools={schools} />);
    expect(screen.getByText("Vision Screening")).toBeInTheDocument();
    expect(screen.getByText("Dental Check-ups")).toBeInTheDocument();
    expect(screen.getByText("Telehealth Access")).toBeInTheDocument();
  });

  it("renders the schools as a connected timeline, not a card grid", () => {
    render(<SriLankaTimeline schools={schools} />);
    expect(screen.getByRole("list")).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(schools.length);
    expect(screen.getByTestId("sri-lanka-timeline-line")).toBeInTheDocument();
  });
});
