import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { act, screen } from "@testing-library/react";
import { renderWithIntl as render } from "@/lib/test-utils";
import { LocationYelpReviews } from "./LocationYelpReviews";
import { reviewsForLocation } from "@/data/yelpReviews";

const originalMatchMedia = window.matchMedia;

function mockMatchMedia(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe("LocationYelpReviews", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockMatchMedia(false);
  });

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("renders nothing for a clinic with no collected reviews", () => {
    const { container } = render(
      <LocationYelpReviews locationId="camarillo" locationName="Camarillo" />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("renders the location heading and opens on that clinic's first review", () => {
    const [first] = reviewsForLocation("agoura-hills");
    render(<LocationYelpReviews locationId="agoura-hills" locationName="Agoura Hills" />);

    expect(
      screen.getByRole("heading", { name: "Yelp Appreciation Reviews in Agoura Hills" })
    ).toBeInTheDocument();
    expect(screen.getByText(first.text)).toBeInTheDocument();
    expect(screen.getByText(`Review 1 of ${reviewsForLocation("agoura-hills").length}`)).toBeInTheDocument();
  });

  it("only cycles through that clinic's own reviews, not other clinics'", () => {
    const agouraHills = reviewsForLocation("agoura-hills");
    render(<LocationYelpReviews locationId="agoura-hills" locationName="Agoura Hills" />);

    const nextButton = screen.getByRole("button", { name: "Next review" });
    for (let i = 1; i < agouraHills.length; i++) {
      act(() => {
        nextButton.click();
      });
      expect(screen.getByText(agouraHills[i].text)).toBeInTheDocument();
    }

    // Wraps back to the first review after the last.
    act(() => {
      nextButton.click();
    });
    expect(screen.getByText(agouraHills[0].text)).toBeInTheDocument();
  });

  it("has no pause control and does not loop a single-review clinic", () => {
    const [only] = reviewsForLocation("canyon-country");
    render(<LocationYelpReviews locationId="canyon-country" locationName="Canyon Country" />);

    expect(screen.getByText(only.text)).toBeInTheDocument();
    expect(screen.getByText("Review 1 of 1")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Pause reviews" })).not.toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(60000);
    });
    expect(screen.getByText(only.text)).toBeInTheDocument();
  });

  it("auto-advances through a clinic's reviews on its own timer", () => {
    const pasadena = reviewsForLocation("pasadena");
    render(<LocationYelpReviews locationId="pasadena" locationName="Pasadena" />);

    const words = pasadena[0].text.trim().split(/\s+/).length;
    const intervalMs = Math.min(14000, Math.max(6000, words * 300));

    act(() => {
      vi.advanceTimersByTime(intervalMs);
    });

    expect(screen.getByText(pasadena[1].text)).toBeInTheDocument();
  });
});
