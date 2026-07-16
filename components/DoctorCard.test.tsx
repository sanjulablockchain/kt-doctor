import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithIntl as render } from "@/lib/test-utils";
import { DoctorCard } from "./DoctorCard";

describe("DoctorCard", () => {
  it("renders the doctor's name, credentials, locations, and a booking link", () => {
    render(
      <DoctorCard
        doctor={{
          id: "martin-fineberg",
          name: "Martin Fineberg",
          credentials: "MD, FAAP",
          specialties: ["Pediatrics"],
          locationIds: ["beverly-hills", "pasadena"],
        }}
        locationNames={["Beverly Hills", "Pasadena"]}
      />
    );

    expect(screen.getByRole("link", { name: "Martin Fineberg" })).toHaveAttribute(
      "href",
      "/doctors/martin-fineberg"
    );
    expect(screen.getByText("MD, FAAP")).toBeInTheDocument();
    expect(screen.getByText("Beverly Hills, Pasadena")).toBeInTheDocument();
    const bookLink = screen.getByRole("link", { name: /book online/i });
    expect(bookLink).toHaveAttribute(
      "href",
      "https://healow.com/apps/practice/janesri-de-silva-md-a-prof-corp-dba-kids-and-teens-medical-group-25634?v=2&t=2"
    );
  });
});
