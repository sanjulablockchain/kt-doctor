import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithIntl as render } from "@/lib/test-utils";
import { ResourceCard } from "./ResourceCard";

describe("ResourceCard", () => {
  it("renders English name and description by default", () => {
    render(
      <ResourceCard
        resource={{
          id: "our-doctors",
          name: "Our Doctors",
          nameEs: "Nuestros Doctores",
          description: "Meet our board-certified pediatricians and find the right fit for your family.",
          descriptionEs: "Conozca a nuestros pediatras certificados y encuentre el más adecuado para su familia.",
          available: true,
          href: "/doctors",
        }}
      />
    );
    expect(screen.getByText("Our Doctors")).toBeInTheDocument();
    expect(
      screen.getByText("Meet our board-certified pediatricians and find the right fit for your family.")
    ).toBeInTheDocument();
  });

  it("renders Spanish name and description when locale is es", () => {
    render(
      <ResourceCard
        resource={{
          id: "our-doctors",
          name: "Our Doctors",
          nameEs: "Nuestros Doctores",
          description: "Meet our board-certified pediatricians and find the right fit for your family.",
          descriptionEs: "Conozca a nuestros pediatras certificados y encuentre el más adecuado para su familia.",
          available: true,
          href: "/doctors",
        }}
      />,
      "es"
    );
    expect(screen.getByText("Nuestros Doctores")).toBeInTheDocument();
    expect(
      screen.getByText("Conozca a nuestros pediatras certificados y encuentre el más adecuado para su familia.")
    ).toBeInTheDocument();
  });

  it("shows a translated 'contact us for a copy' state when not available", () => {
    render(
      <ResourceCard
        resource={{
          id: "developmental-milestones",
          name: "Developmental Milestone Guides",
          nameEs: "Guías de Hitos del Desarrollo",
          description: "What to expect at each stage of your child's development.",
          descriptionEs: "Qué esperar en cada etapa del desarrollo de su hijo.",
          available: false,
        }}
      />,
      "es"
    );
    expect(screen.getByText("Contáctenos para obtener una copia")).toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
});
