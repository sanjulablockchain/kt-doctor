import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithIntl as render } from "@/lib/test-utils";
import { LocationCard } from "./LocationCard";

describe("LocationCard", () => {
  it("renders name, address, phone, and email, with the name linking to the detail page", () => {
    render(
      <LocationCard
        location={{
          id: "pasadena",
          name: "Pasadena",
          address: "504 S Sierra Madre Blvd, Pasadena, CA 91107",
          phone: "(626) 655-4041",
          email: "pasadena@ktdoctor.com",
          extension: "118",
          lat: 34.1478,
          lng: -118.1445,
          description: "Attentive and comprehensive care for infants, children, and teens.",
          hours: { officeHours: "Monday-Friday, 9AM-6PM", telehealthHours: "Monday-Sunday, 9AM-8PM" },
          photos: [],
        }}
      />
    );

    expect(screen.getByRole("link", { name: "Pasadena" })).toHaveAttribute(
      "href",
      "/locations/pasadena"
    );
    expect(screen.getByText("504 S Sierra Madre Blvd, Pasadena, CA 91107")).toBeInTheDocument();
    expect(screen.getByText("(626) 655-4041")).toBeInTheDocument();
    expect(screen.getByText("pasadena@ktdoctor.com")).toBeInTheDocument();
  });
});
