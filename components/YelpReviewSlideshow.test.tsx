import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { act, fireEvent, screen } from "@testing-library/react";
import { renderWithIntl as render } from "@/lib/test-utils";
import { YelpReviewSlideshow } from "./YelpReviewSlideshow";
import type { YelpReview } from "@/data/yelpReviews";

const originalMatchMedia = window.matchMedia;

function mockMatchMedia(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

const reviews: YelpReview[] = [
  { locationId: "test", reviewer: "Alice A.", rating: 5, date: "2024-01-01", text: "Short review one." },
  { locationId: "test", reviewer: "Bob B.", rating: 5, date: "2024-02-02", text: "Short review two." },
  { locationId: "test", reviewer: "Cara C.", rating: 5, date: "2024-03-03", text: "Short review three." },
];

describe("YelpReviewSlideshow", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockMatchMedia(false);
  });

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("opens on the first review by default", () => {
    render(<YelpReviewSlideshow reviews={reviews} />);

    expect(screen.getByText("Short review one.")).toBeInTheDocument();
    expect(screen.getByText("Alice A. on Yelp")).toBeInTheDocument();
    expect(screen.getByText("Review 1 of 3")).toBeInTheDocument();
  });

  it("opens on the given startIndex", () => {
    render(<YelpReviewSlideshow reviews={reviews} startIndex={2} />);

    expect(screen.getByText("Short review three.")).toBeInTheDocument();
    expect(screen.getByText("Review 3 of 3")).toBeInTheDocument();
  });

  it("clamps an out-of-range startIndex instead of throwing", () => {
    render(<YelpReviewSlideshow reviews={reviews} startIndex={99} />);

    expect(screen.getByText("Short review three.")).toBeInTheDocument();
  });

  it("moves forward and wraps around on next", () => {
    render(<YelpReviewSlideshow reviews={reviews} startIndex={2} />);

    act(() => {
      screen.getByRole("button", { name: "Next review" }).click();
    });

    expect(screen.getByText("Short review one.")).toBeInTheDocument();
  });

  it("moves backward and wraps around on previous", () => {
    render(<YelpReviewSlideshow reviews={reviews} />);

    act(() => {
      screen.getByRole("button", { name: "Previous review" }).click();
    });

    expect(screen.getByText("Short review three.")).toBeInTheDocument();
  });

  it("auto-advances after the reading-time interval (short text uses the 6s floor)", () => {
    render(<YelpReviewSlideshow reviews={reviews} />);

    act(() => {
      vi.advanceTimersByTime(6000);
    });

    expect(screen.getByText("Short review two.")).toBeInTheDocument();
  });

  it("stops auto-advancing once paused, and resumes once played again", () => {
    render(<YelpReviewSlideshow reviews={reviews} />);

    act(() => {
      screen.getByRole("button", { name: "Pause reviews" }).click();
    });
    act(() => {
      vi.advanceTimersByTime(20000);
    });
    expect(screen.getByText("Short review one.")).toBeInTheDocument();

    act(() => {
      screen.getByRole("button", { name: "Play reviews" }).click();
    });
    act(() => {
      vi.advanceTimersByTime(6000);
    });
    expect(screen.getByText("Short review two.")).toBeInTheDocument();
  });

  it("stays paused through a hover after being explicitly paused, and the button icon doesn't flip on hover alone", () => {
    const { container } = render(<YelpReviewSlideshow reviews={reviews} />);
    const root = container.firstChild as HTMLElement;

    // Hovering alone pauses auto-advance but must not look like a click.
    fireEvent.mouseEnter(root);
    expect(screen.getByRole("button", { name: "Pause reviews" })).toBeInTheDocument();
    fireEvent.mouseLeave(root);

    // An explicit pause must survive the mouse moving over and away again.
    act(() => {
      screen.getByRole("button", { name: "Pause reviews" }).click();
    });
    fireEvent.mouseEnter(root);
    fireEvent.mouseLeave(root);
    act(() => {
      vi.advanceTimersByTime(20000);
    });
    expect(screen.getByText("Short review one.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Play reviews" })).toBeInTheDocument();
  });

  it("does not auto-advance and hides the pause control under prefers-reduced-motion", () => {
    mockMatchMedia(true);
    render(<YelpReviewSlideshow reviews={reviews} />);

    expect(screen.queryByRole("button", { name: "Pause reviews" })).not.toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(30000);
    });
    expect(screen.getByText("Short review one.")).toBeInTheDocument();
  });

  it("with a single review, shows no pause control and does not error on auto-advance", () => {
    render(<YelpReviewSlideshow reviews={[reviews[0]]} />);

    expect(screen.getByText("Review 1 of 1")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Pause reviews" })).not.toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(20000);
    });
    expect(screen.getByText("Short review one.")).toBeInTheDocument();
  });
});
