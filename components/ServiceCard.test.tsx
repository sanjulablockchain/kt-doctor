import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithIntl } from "@/lib/test-utils";
import { ServiceCard } from "./ServiceCard";

const sampleService = {
  id: "telehealth",
  name: "Telehealth",
  description: "Remote medical consultations from wherever your family is.",
  longDescription:
    "Our telehealth visits let you connect with a board-certified pediatrician remotely through a secure virtual platform, without needing to leave home.",
};

describe("ServiceCard", () => {
  it("renders the service name and description", () => {
    renderWithIntl(<ServiceCard service={sampleService} />);

    expect(screen.getByText("Telehealth")).toBeInTheDocument();
    expect(
      screen.getByText("Remote medical consultations from wherever your family is.")
    ).toBeInTheDocument();
  });

  it("links to the service's detail page", () => {
    renderWithIntl(<ServiceCard service={sampleService} />);

    expect(screen.getByRole("link")).toHaveAttribute("href", "/services/telehealth");
  });
});
