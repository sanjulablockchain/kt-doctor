import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { act, screen } from "@testing-library/react";
import { renderWithIntl as render } from "@/lib/test-utils";
import { YelpAppreciationSlideshow } from "./YelpAppreciationSlideshow";
import { yelpReviewsSlideshowOrder, featuredYelpReview } from "@/data/yelpReviews";
import { yelpUrlForLocation } from "@/data/yelpLocationLinks";

const originalMatchMedia = window.matchMedia;

function mockMatchMedia(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

const startIndex = yelpReviewsSlideshowOrder.indexOf(featuredYelpReview);
const nextReview = yelpReviewsSlideshowOrder[(startIndex + 1) % yelpReviewsSlideshowOrder.length];
const previousReview =
  yelpReviewsSlideshowOrder[(startIndex - 1 + yelpReviewsSlideshowOrder.length) % yelpReviewsSlideshowOrder.length];

function intervalForFeaturedReview(): number {
  const words = featuredYelpReview.text.trim().split(/\s+/).length;
  return Math.min(14000, Math.max(6000, words * 300));
}

describe("YelpAppreciationSlideshow", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockMatchMedia(false);
  });

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("centers the heading block by default (Homepage usage)", () => {
    render(<YelpAppreciationSlideshow />);

    const heading = screen.getByText("Featured Yelp Review from One of Our Valued Patients");
    expect(heading.parentElement?.className).toContain("text-center");
    expect(heading.parentElement?.className).toContain("mx-auto");
  });

  it("left-aligns the heading block when align='left' (Media page usage)", () => {
    render(<YelpAppreciationSlideshow align="left" />);

    const heading = screen.getByText("Featured Yelp Review from One of Our Valued Patients");
    expect(heading.parentElement?.className).not.toContain("text-center");
    expect(heading.parentElement?.className).not.toContain("mx-auto");
  });

  it("opens on the featured review with the fixed heading and a 5-star rating", () => {
    render(<YelpAppreciationSlideshow />);

    expect(screen.getByText("Featured Yelp Review from One of Our Valued Patients")).toBeInTheDocument();
    expect(screen.getByText(featuredYelpReview.text)).toBeInTheDocument();
    expect(screen.getByText(`${featuredYelpReview.reviewer} on Yelp`)).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "5 out of 5 stars" })).toBeInTheDocument();
  });

  it("links out to the current review's clinic on Yelp", () => {
    render(<YelpAppreciationSlideshow />);

    const link = screen.getByRole("link", { name: "See more reviews on Yelp" });
    expect(link).toHaveAttribute("href", yelpUrlForLocation(featuredYelpReview.locationId));
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", expect.stringContaining("noopener"));
  });

  it(`shows a 1-based counter out of ${yelpReviewsSlideshowOrder.length} total reviews`, () => {
    render(<YelpAppreciationSlideshow />);

    expect(screen.getByText(`Review ${startIndex + 1} of ${yelpReviewsSlideshowOrder.length}`)).toBeInTheDocument();
  });

  it("moves to the next review in the shared order when the next arrow is pressed", () => {
    render(<YelpAppreciationSlideshow />);

    act(() => {
      screen.getByRole("button", { name: "Next review" }).click();
    });

    expect(screen.getByText(nextReview.text)).toBeInTheDocument();
  });

  it("wraps to the previous review in the shared order when the previous arrow is pressed", () => {
    render(<YelpAppreciationSlideshow />);

    act(() => {
      screen.getByRole("button", { name: "Previous review" }).click();
    });

    expect(screen.getByText(previousReview.text)).toBeInTheDocument();
  });

  it("auto-advances to the next review once its reading-time interval elapses", () => {
    render(<YelpAppreciationSlideshow />);

    act(() => {
      vi.advanceTimersByTime(intervalForFeaturedReview());
    });

    expect(screen.getByText(nextReview.text)).toBeInTheDocument();
  });

  it("does not auto-advance once the pause button is pressed, and resumes on a second press", () => {
    render(<YelpAppreciationSlideshow />);

    const pauseButton = screen.getByRole("button", { name: "Pause reviews" });
    act(() => {
      pauseButton.click();
    });
    act(() => {
      vi.advanceTimersByTime(intervalForFeaturedReview() * 2);
    });
    expect(screen.getByText(featuredYelpReview.text)).toBeInTheDocument();

    act(() => {
      screen.getByRole("button", { name: "Play reviews" }).click();
    });
    act(() => {
      vi.advanceTimersByTime(intervalForFeaturedReview());
    });
    expect(screen.getByText(nextReview.text)).toBeInTheDocument();
  });

  it("pauses auto-advance while focused, and resumes on blur", () => {
    render(<YelpAppreciationSlideshow />);

    const nextButton = screen.getByRole("button", { name: "Next review" });
    act(() => {
      nextButton.focus();
    });
    act(() => {
      vi.advanceTimersByTime(intervalForFeaturedReview());
    });
    expect(screen.getByText(featuredYelpReview.text)).toBeInTheDocument();

    act(() => {
      nextButton.blur();
    });
    act(() => {
      vi.advanceTimersByTime(intervalForFeaturedReview());
    });
    expect(screen.getByText(nextReview.text)).toBeInTheDocument();
  });

  it("does not auto-advance, and hides the pause control, when the user prefers reduced motion", () => {
    mockMatchMedia(true);
    render(<YelpAppreciationSlideshow />);

    expect(screen.queryByRole("button", { name: "Pause reviews" })).not.toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(60000);
    });
    expect(screen.getByText(featuredYelpReview.text)).toBeInTheDocument();
  });

  it("renders the translated heading in Spanish, with review text left in English", () => {
    render(<YelpAppreciationSlideshow />, "es");

    expect(
      screen.getByText("Reseña Destacada de Yelp de Uno de Nuestros Valiosos Pacientes")
    ).toBeInTheDocument();
    expect(screen.getByText(featuredYelpReview.text)).toBeInTheDocument();
  });
});
