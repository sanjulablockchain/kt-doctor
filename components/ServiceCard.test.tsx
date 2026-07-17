import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithIntl } from "@/lib/test-utils";
import { ServiceCard } from "./ServiceCard";

const sampleService = {
  id: "telehealth",
  name: "Telehealth",
  nameEs: "Telesalud",
  description: "Remote medical consultations from wherever your family is.",
  descriptionEs: "Consultas médicas remotas desde donde se encuentre su familia.",
  longDescription:
    "Our telehealth visits let you connect with a board-certified pediatrician remotely through a secure virtual platform, without needing to leave home.",
  longDescriptionEs:
    "Descripción larga completa en español.",
};

describe("ServiceCard", () => {
  it("renders English name and description by default", () => {
    renderWithIntl(<ServiceCard service={sampleService} />);

    expect(screen.getByText("Telehealth")).toBeInTheDocument();
    expect(
      screen.getByText("Remote medical consultations from wherever your family is.")
    ).toBeInTheDocument();
  });

  it("renders Spanish name and description when locale is es", () => {
    renderWithIntl(<ServiceCard service={sampleService} />, "es");

    expect(screen.getByText("Telesalud")).toBeInTheDocument();
    expect(
      screen.getByText("Consultas médicas remotas desde donde se encuentre su familia.")
    ).toBeInTheDocument();
  });

  it("links to the service's detail page", () => {
    renderWithIntl(<ServiceCard service={sampleService} />);

    expect(screen.getByRole("link")).toHaveAttribute("href", "/services/telehealth");
  });
});
