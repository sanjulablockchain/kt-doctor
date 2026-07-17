import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

const originalMatchMedia = window.matchMedia;

function mockMatchMedia(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

function Probe() {
  const reduced = usePrefersReducedMotion();
  return <span>{reduced ? "reduced" : "full"}</span>;
}

afterEach(() => {
  window.matchMedia = originalMatchMedia;
  vi.restoreAllMocks();
});

describe("usePrefersReducedMotion", () => {
  it("returns false when the user has not requested reduced motion", () => {
    mockMatchMedia(false);
    render(<Probe />);
    expect(screen.getByText("full")).toBeInTheDocument();
  });

  it("returns true when the user prefers reduced motion", () => {
    mockMatchMedia(true);
    render(<Probe />);
    expect(screen.getByText("reduced")).toBeInTheDocument();
  });
});
