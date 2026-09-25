import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithIntl as render } from "@/lib/test-utils";
import { YelpAppreciationCard } from "./YelpAppreciationCard";
import { featuredYelpReview } from "@/data/yelpReviews";

describe("YelpAppreciationCard", () => {
  it("renders the featured review's heading, text, and reviewer in English", () => {
    render(<YelpAppreciationCard />);

    expect(screen.getByText("Featured Yelp Review from One of Our Valued Patients")).toBeInTheDocument();
    expect(screen.getByText(featuredYelpReview.text)).toBeInTheDocument();
    expect(screen.getByText(`${featuredYelpReview.reviewer} on Yelp`)).toBeInTheDocument();
  });

  it("shows a 5-star rating with an accessible label", () => {
    render(<YelpAppreciationCard />);

    expect(screen.getByRole("img", { name: "5 out of 5 stars" })).toBeInTheDocument();
  });

  it("renders the translated heading in Spanish, with the review quote left in English", () => {
    render(<YelpAppreciationCard />, "es");

    expect(
      screen.getByText("Reseña Destacada de Yelp de Uno de Nuestros Valiosos Pacientes")
    ).toBeInTheDocument();
    expect(screen.getByText(featuredYelpReview.text)).toBeInTheDocument();
  });
});
