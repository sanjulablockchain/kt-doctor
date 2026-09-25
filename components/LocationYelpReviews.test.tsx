import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithIntl as render } from "@/lib/test-utils";
import { LocationYelpReviews } from "./LocationYelpReviews";

describe("LocationYelpReviews", () => {
  it("renders nothing for a clinic with no collected reviews", () => {
    const { container } = render(
      <LocationYelpReviews locationId="camarillo" locationName="Camarillo" />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("renders the location heading and every reviewer for a small clinic", () => {
    render(<LocationYelpReviews locationId="agoura-hills" locationName="Agoura Hills" />);

    expect(
      screen.getByRole("heading", { name: "Yelp Appreciation Reviews in Agoura Hills" })
    ).toBeInTheDocument();
    expect(screen.getByText("Jane A. on Yelp")).toBeInTheDocument();
    expect(screen.getByText("Lisa T. on Yelp")).toBeInTheDocument();
    // No expand control below the threshold of 6 reviewers.
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("stacks a reviewer's multiple reviews under one heading, in chronological order", () => {
    render(<LocationYelpReviews locationId="valencia" locationName="Valencia" />);

    const karmiliaHeading = screen.getByRole("heading", { name: "Karmilia A. on Yelp" });
    const article = karmiliaHeading.parentElement!;
    const dates = article.querySelectorAll("blockquote footer");
    expect(dates).toHaveLength(2);
    expect(dates[0].textContent).toBe("June 22, 2026");
    expect(dates[1].textContent).toBe("September 17, 2026");
  });

  it("collapses a large clinic behind a 'show all' control until clicked", async () => {
    const user = userEvent.setup();
    render(<LocationYelpReviews locationId="pasadena" locationName="Pasadena" />);

    const toggle = screen.getByRole("button", { name: "Show all 40 reviews" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");

    // Only the first 6 reviewer groups render before expanding.
    const headingsBefore = screen.getAllByRole("heading", { level: 3 });
    expect(headingsBefore).toHaveLength(6);

    await user.click(toggle);

    expect(screen.getByRole("button", { name: "Show fewer reviews" })).toHaveAttribute(
      "aria-expanded",
      "true"
    );
    const headingsAfter = screen.getAllByRole("heading", { level: 3 });
    expect(headingsAfter.length).toBeGreaterThan(6);
  });
});
