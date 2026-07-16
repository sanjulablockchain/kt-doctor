import { describe, it, expect } from "vitest";
import { locations } from "./locations";

describe("locations data", () => {
  it("has exactly 24 real clinics", () => {
    expect(locations).toHaveLength(24);
  });

  it("every location has a unique id", () => {
    const ids = locations.map((l) => l.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every location has valid lat/lng within the Southern California bounding box", () => {
    for (const loc of locations) {
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
});
