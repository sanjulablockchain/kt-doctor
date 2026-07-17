import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { act, render, screen } from "@testing-library/react";
import { AnimatedCounter } from "./AnimatedCounter";

describe("AnimatedCounter", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("starts at 0 and counts up to the target number", () => {
    render(<AnimatedCounter value="24" />);
    expect(screen.getByText("0")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1200);
    });
    expect(screen.getByText("24")).toBeInTheDocument();
  });

  it("preserves a trailing suffix like '+' once counting finishes", () => {
    render(<AnimatedCounter value="56+" />);
    act(() => {
      vi.advanceTimersByTime(1200);
    });
    expect(screen.getByText("56+")).toBeInTheDocument();
  });

  it("animates only the last number in a range, keeping the rest as a static prefix", () => {
    render(<AnimatedCounter value="0-21" />);
    act(() => {
      vi.advanceTimersByTime(1200);
    });
    expect(screen.getByText("0-21")).toBeInTheDocument();
  });

  it("renders non-numeric values unchanged with no animation", () => {
    render(<AnimatedCounter value="N/A" />);
    expect(screen.getByText("N/A")).toBeInTheDocument();
  });

  it("shows the final value immediately when the user prefers reduced motion", () => {
    const original = window.matchMedia;
    window.matchMedia = ((query: string) => ({
      matches: query === "(prefers-reduced-motion: reduce)",
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    })) as unknown as typeof window.matchMedia;

    render(<AnimatedCounter value="18+" />);
    expect(screen.getByText("18+")).toBeInTheDocument();

    window.matchMedia = original;
  });
});
