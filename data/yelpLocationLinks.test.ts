import { describe, it, expect } from "vitest";
import { locations } from "./locations";
import { locationIdsWithReviews } from "./yelpReviews";
import { yelpLocationUrls, yelpUrlForLocation } from "./yelpLocationLinks";

describe("yelpLocationLinks data", () => {
  it("every key matches a real clinic id", () => {
    const validIds = new Set(locations.map((loc) => loc.id));
    for (const id of Object.keys(yelpLocationUrls)) {
      expect(validIds.has(id)).toBe(true);
    }
  });

  it("every URL is a real Yelp business page", () => {
    for (const url of Object.values(yelpLocationUrls)) {
      expect(url).toMatch(/^https:\/\/www\.yelp\.com\/biz\//);
    }
  });

  it("has no entry for the 4 clinics the client marked 'nope'", () => {
    for (const id of ["camarillo", "hollywood", "san-pedro", "la-mirada"]) {
      expect(yelpUrlForLocation(id)).toBeUndefined();
    }
  });

  it("has a link for every clinic that has reviews", () => {
    for (const id of locationIdsWithReviews()) {
      expect(yelpUrlForLocation(id)).toBeDefined();
    }
  });

  it("has a link for Santa Monica even though it has no reviews on the site", () => {
    expect(yelpUrlForLocation("santa-monica")).toBeDefined();
  });

  it("returns undefined for an unknown locationId", () => {
    expect(yelpUrlForLocation("not-a-real-clinic")).toBeUndefined();
  });
});
