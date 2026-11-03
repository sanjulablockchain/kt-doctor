import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { screen, within, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithIntl } from "@/lib/test-utils";
import { locations } from "@/data/locations";
import { clinicWaitLevels } from "@/data/clinicWaitTimes";
import { BOOKING_URL } from "@/lib/constants";
import { LessWaitingFinder } from "./LessWaitingFinder";

// Wednesday 10AM in Los Angeles, when every clinic with readable hours is open.
const WED_10AM_LA = new Date("2026-11-04T18:00:00Z");

function physicalClinics() {
  return locations.filter((l) => typeof l.lat === "number");
}

describe("LessWaitingFinder", () => {
  beforeEach(() => {
    vi.useFakeTimers({ now: WED_10AM_LA, toFake: ["Date"] });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("lists every physical clinic with a Book here link to its own Healow page", () => {
    renderWithIntl(<LessWaitingFinder onBack={() => {}} onChoose={() => {}} />);

    const list = screen.getByRole("list", { name: /clinics/i });
    const items = within(list).getAllByRole("listitem");
    expect(items).toHaveLength(physicalClinics().length);

    const agoura = physicalClinics().find((l) => l.id === "agoura-hills")!;
    const link = screen.getByRole("link", { name: /book at agoura hills/i });
    expect(link).toHaveAttribute("href", agoura.bookingUrl);
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", expect.stringContaining("noopener"));
  });

  it("falls back to the shared booking link for a clinic with no Healow facility page", () => {
    renderWithIntl(<LessWaitingFinder onBack={() => {}} onChoose={() => {}} />);

    // Camarillo has no per-facility link (see data/locations.ts).
    expect(screen.getByRole("link", { name: /book at camarillo/i })).toHaveAttribute(
      "href",
      BOOKING_URL
    );
  });

  it("puts the shortest waits at the top of the list", () => {
    renderWithIntl(<LessWaitingFinder onBack={() => {}} onChoose={() => {}} />);

    const items = within(screen.getByRole("list", { name: /clinics/i })).getAllByRole("listitem");
    const firstShort = items.findIndex((item) => /short wait/i.test(item.textContent ?? ""));
    const firstLong = items.findIndex((item) => /busier/i.test(item.textContent ?? ""));
    expect(firstShort).toBe(0);
    expect(firstLong).toBeGreaterThan(firstShort);
    expect(Object.values(clinicWaitLevels)).toContain("long");
  });

  it("shows whether each clinic is open right now", () => {
    renderWithIntl(<LessWaitingFinder onBack={() => {}} onChoose={() => {}} />);

    expect(screen.getAllByText(/open now/i).length).toBeGreaterThan(0);
  });

  it("narrows the list as the visitor types a city or ZIP", async () => {
    renderWithIntl(<LessWaitingFinder onBack={() => {}} onChoose={() => {}} />);
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

    await user.type(screen.getByRole("searchbox", { name: /city, zip/i }), "91301");

    const items = within(screen.getByRole("list", { name: /clinics/i })).getAllByRole("listitem");
    expect(items).toHaveLength(1);
    expect(items[0]).toHaveTextContent(/agoura hills/i);
  });

  it("says when nothing matches and still offers the default booking link", async () => {
    renderWithIntl(<LessWaitingFinder onBack={() => {}} onChoose={() => {}} />);
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

    await user.type(screen.getByRole("searchbox", { name: /city, zip/i }), "Bakersfield");

    expect(screen.getByText(/no clinic matches/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /book online at any clinic/i })).toHaveAttribute(
      "href",
      BOOKING_URL
    );
  });

  it("always offers the default Healow link for visitors who cannot find their office", () => {
    renderWithIntl(<LessWaitingFinder onBack={() => {}} onChoose={() => {}} />);

    const fallback = screen.getByRole("link", { name: /book online at any clinic/i });
    expect(fallback).toHaveAttribute("href", BOOKING_URL);
    expect(fallback).toHaveAttribute("target", "_blank");
  });

  it("tells the caller when a booking link is chosen, so the dialog can close", async () => {
    const onChoose = vi.fn();
    renderWithIntl(<LessWaitingFinder onBack={() => {}} onChoose={onChoose} />);
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

    await user.click(screen.getByRole("link", { name: /book at agoura hills/i }));
    expect(onChoose).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole("link", { name: /book online at any clinic/i }));
    expect(onChoose).toHaveBeenCalledTimes(2);
  });

  it("offers a Back button that returns to the three options", async () => {
    const onBack = vi.fn();
    renderWithIntl(<LessWaitingFinder onBack={onBack} onChoose={() => {}} />);
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

    await user.click(screen.getByRole("button", { name: /back/i }));

    expect(onBack).toHaveBeenCalled();
  });

  it("sorts by distance within a wait level after the visitor shares their location", async () => {
    // Stand in Agoura Hills: among the "short" clinics it must come first.
    const getCurrentPosition = vi.fn((success: PositionCallback) =>
      success({
        coords: { latitude: 34.1361, longitude: -118.7615 },
      } as GeolocationPosition)
    );
    Object.defineProperty(navigator, "geolocation", {
      configurable: true,
      value: { getCurrentPosition },
    });

    renderWithIntl(<LessWaitingFinder onBack={() => {}} onChoose={() => {}} />);
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

    await act(async () => {
      await user.click(screen.getByRole("button", { name: /use my location/i }));
    });

    const items = within(screen.getByRole("list", { name: /clinics/i })).getAllByRole("listitem");
    expect(items[0]).toHaveTextContent(/agoura hills/i);
    expect(items[0]).toHaveTextContent(/0 mi away/i);
  });

  it("explains when the location cannot be read instead of failing silently", async () => {
    const getCurrentPosition = vi.fn((_: PositionCallback, error?: PositionErrorCallback) =>
      error?.({ code: 1, message: "denied" } as GeolocationPositionError)
    );
    Object.defineProperty(navigator, "geolocation", {
      configurable: true,
      value: { getCurrentPosition },
    });

    renderWithIntl(<LessWaitingFinder onBack={() => {}} onChoose={() => {}} />);
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

    await act(async () => {
      await user.click(screen.getByRole("button", { name: /use my location/i }));
    });

    expect(screen.getByRole("status")).toHaveTextContent(/couldn't get your location/i);
  });

  it("translates the finder copy", () => {
    renderWithIntl(<LessWaitingFinder onBack={() => {}} onChoose={() => {}} />, "es");

    expect(screen.getByRole("searchbox", { name: /ciudad, código postal/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /usar mi ubicación/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /reservar en línea en cualquier clínica/i })).toBeInTheDocument();
  });
});
