import { describe, it, expect } from "vitest";
import { locations } from "./locations";

describe("locations data", () => {
  it("has 24 physical clinics plus the telehealth pseudo-location", () => {
    expect(locations).toHaveLength(25);
  });

  it("includes Camarillo — re-added 2026-07-22 per client direction", () => {
    const camarillo = locations.find((l) => l.id === "camarillo");
    expect(camarillo).toBeDefined();
    expect(camarillo?.address).toBe("2486 Ponderosa Dr N, Suite D-211, Camarillo, CA 93010");
  });

  it("every location has a unique id", () => {
    const ids = locations.map((l) => l.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every physical location has valid lat/lng within the Southern California bounding box", () => {
    for (const loc of locations) {
      if (loc.lat === undefined && loc.lng === undefined) continue; // telehealth has no address
      expect(loc.lat).toBeGreaterThan(33.0);
      expect(loc.lat).toBeLessThan(35.0);
      expect(loc.lng).toBeGreaterThan(-119.5);
      expect(loc.lng).toBeLessThan(-117.5);
    }
  });

  it("includes Pasadena with its real address and extension", () => {
    const pasadena = locations.find((l) => l.id === "pasadena");
    expect(pasadena).toBeDefined();
    expect(pasadena?.address).toBe("504 S Sierra Madre Blvd, Pasadena, CA 91107");
    expect(pasadena?.email).toBe("pasadena@ktdoctor.com");
    expect(pasadena?.extension).toBe("118");
  });

  it("includes the real Hollywood clinic in place of the old unconfirmed west-la placeholder", () => {
    expect(locations.find((l) => l.id === "west-la")).toBeUndefined();
    const hollywood = locations.find((l) => l.id === "hollywood");
    expect(hollywood).toBeDefined();
    expect(hollywood?.address).toBe("5255 W Sunset Blvd, Los Angeles, CA 90027");
  });

  it("every location has a description and office/telehealth hours", () => {
    for (const loc of locations) {
      expect(loc.description.length).toBeGreaterThan(0);
      expect(loc.hours.officeHours.length).toBeGreaterThan(0);
      expect(loc.hours.telehealthHours.length).toBeGreaterThan(0);
    }
  });

  it("every location photo points to a locally downloaded file under /locations/", () => {
    for (const loc of locations) {
      for (const photo of loc.photos) {
        expect(photo).toMatch(new RegExp(`^/locations/${loc.id}/`));
      }
    }
  });

  it("the telehealth pseudo-location has no lat/lng (not a physical clinic)", () => {
    const telehealth = locations.find((l) => l.id === "telehealth");
    expect(telehealth).toBeDefined();
    expect(telehealth?.lat).toBeUndefined();
    expect(telehealth?.lng).toBeUndefined();
  });

  it("gives every real clinic a Healow per-facility booking URL; telehealth and Camarillo have none", () => {
    for (const loc of locations) {
      // Camarillo is not in Healow (no facility deep link); telehealth has no
      // physical facility page. Both fall back to the shared BOOKING_URL.
      if (loc.id === "telehealth" || loc.id === "camarillo") {
        expect(loc.bookingUrl).toBeUndefined();
        continue;
      }
      expect(loc.bookingUrl).toMatch(
        /^https:\/\/healow\.com\/apps\/practice\/[^?]*-25634\?v=2&t=[12]&f=[A-Za-z0-9]+$/
      );
    }
  });

  it("gives each clinic a distinct facility booking URL", () => {
    const urls = locations
      .map((l) => l.bookingUrl)
      .filter((u): u is string => Boolean(u));
    expect(new Set(urls).size).toBe(urls.length);
  });
});
