import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithIntl as render } from "@/lib/test-utils";
import { SriLankaTimeline } from "./SriLankaTimeline";

const sampleSchools = [
  {
    id: "st-peters-college",
    name: "St. Peter's College",
    location: "Negombo",
    studentCount: "1,200+ students",
    studentCountEs: "más de 1,200 estudiantes",
    programs: ["Vision Screening"],
    programsEs: ["Exámenes de Visión"],
  },
];

describe("SriLankaTimeline", () => {
  it("renders English student count and program labels by default", () => {
    render(<SriLankaTimeline schools={sampleSchools} />);
    expect(screen.getByText(/1,200\+ students/)).toBeInTheDocument();
    expect(screen.getByText("Vision Screening")).toBeInTheDocument();
  });

  it("renders Spanish student count and program labels when locale is es", () => {
    render(<SriLankaTimeline schools={sampleSchools} />, "es");
    expect(screen.getByText(/más de 1,200 estudiantes/)).toBeInTheDocument();
    expect(screen.getByText("Exámenes de Visión")).toBeInTheDocument();
  });
});
