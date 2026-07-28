import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { act, render, screen } from "@testing-library/react";
import { WhyFamiliesSlideshow } from "./WhyFamiliesSlideshow";

const originalMatchMedia = window.matchMedia;

function mockMatchMedia(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

function slideLabel(index: number, total: number) {
  return `View photo ${index} of ${total}`;
}

function getDots() {
  return screen.getAllByRole("button", { name: /^View photo/ });
}

const defaultProps = {
  slideLabel,
  previousSlideLabel: "Previous photo",
  nextSlideLabel: "Next photo",
  wrapperClassName: "h-72 rounded-[2rem] shadow-card sm:h-96",
};

describe("WhyFamiliesSlideshow", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockMatchMedia(false);
  });

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("renders every slide with the given alt text and a dot per slide", () => {
    render(
      <WhyFamiliesSlideshow
        {...defaultProps}
        alt="Interior of one of our pediatric clinic locations"
      />
    );

    const images = screen.getAllByAltText("Interior of one of our pediatric clinic locations");
    const dots = getDots();
    expect(images.length).toBeGreaterThan(1);
    expect(dots).toHaveLength(images.length);
  });

  it("renders previous and next slide buttons", () => {
    render(<WhyFamiliesSlideshow {...defaultProps} alt="test image" />);

    expect(screen.getByRole("button", { name: "Previous photo" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Next photo" })).toBeInTheDocument();
  });

  it("marks only the active slide's dot as current, starting with the first", () => {
    render(<WhyFamiliesSlideshow {...defaultProps} alt="test image" />);

    const dots = getDots();
    expect(dots[0]).toHaveAttribute("aria-current", "true");
    expect(dots[1]).toHaveAttribute("aria-current", "false");
  });

  it("auto-advances to the next slide after the interval elapses", () => {
    render(<WhyFamiliesSlideshow {...defaultProps} alt="test image" intervalMs={5000} />);

    const dots = getDots();
    expect(dots[0]).toHaveAttribute("aria-current", "true");

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(dots[0]).toHaveAttribute("aria-current", "false");
    expect(dots[1]).toHaveAttribute("aria-current", "true");
  });

  it("moves to the clicked slide when a dot is pressed", () => {
    render(<WhyFamiliesSlideshow {...defaultProps} alt="test image" />);

    const dots = getDots();
    act(() => {
      dots[2].click();
    });

    expect(dots[2]).toHaveAttribute("aria-current", "true");
    expect(dots[0]).toHaveAttribute("aria-current", "false");
  });

  it("moves to the next slide when the next arrow is pressed", () => {
    render(<WhyFamiliesSlideshow {...defaultProps} alt="test image" />);

    const dots = getDots();
    act(() => {
      screen.getByRole("button", { name: "Next photo" }).click();
    });

    expect(dots[0]).toHaveAttribute("aria-current", "false");
    expect(dots[1]).toHaveAttribute("aria-current", "true");
  });

  it("wraps to the last slide when the previous arrow is pressed on the first slide", () => {
    render(<WhyFamiliesSlideshow {...defaultProps} alt="test image" />);

    const dots = getDots();
    act(() => {
      screen.getByRole("button", { name: "Previous photo" }).click();
    });

    expect(dots[0]).toHaveAttribute("aria-current", "false");
    expect(dots[dots.length - 1]).toHaveAttribute("aria-current", "true");
  });

  it("does not auto-advance when the user prefers reduced motion", () => {
    mockMatchMedia(true);
    render(<WhyFamiliesSlideshow {...defaultProps} alt="test image" intervalMs={5000} />);

    const dots = getDots();
    act(() => {
      vi.advanceTimersByTime(20000);
    });

    expect(dots[0]).toHaveAttribute("aria-current", "true");
  });

  it("pauses auto-advance while a slide is focused, and resumes on blur", () => {
    render(<WhyFamiliesSlideshow {...defaultProps} alt="test image" intervalMs={5000} />);

    const dots = getDots();
    act(() => {
      dots[0].focus();
    });
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(dots[0]).toHaveAttribute("aria-current", "true");

    act(() => {
      dots[0].blur();
    });
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(dots[0]).toHaveAttribute("aria-current", "false");
  });
});
