import { describe, it, expect } from "vitest";
import { locations } from "./locations";
import {
  yelpReviews,
  reviewsForLocation,
  locationIdsWithReviews,
  groupReviewsByReviewer,
  interleaveByLocation,
  yelpReviewsSlideshowOrder,
  featuredYelpReview,
} from "./yelpReviews";

describe("yelpReviews data", () => {
  it("only contains 5-star reviews", () => {
    for (const review of yelpReviews) {
      expect(review.rating).toBe(5);
    }
  });

  it("every review has a locationId that matches a real clinic", () => {
    const validIds = new Set(locations.map((loc) => loc.id));
    for (const review of yelpReviews) {
      expect(validIds.has(review.locationId)).toBe(true);
    }
  });

  it("has no reviews for Santa Monica (source rows were duplicates of San Fernando)", () => {
    expect(reviewsForLocation("santa-monica")).toHaveLength(0);
  });

  it("every review has a non-empty reviewer, date, and text", () => {
    for (const review of yelpReviews) {
      expect(review.reviewer.trim().length).toBeGreaterThan(0);
      expect(review.text.trim().length).toBeGreaterThan(0);
      expect(review.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it("has no reviewer name made only of '?' characters", () => {
    for (const review of yelpReviews) {
      expect(review.reviewer).not.toMatch(/^[?\s.]+$/);
    }
  });

  it("reviewsForLocation returns only that clinic's reviews", () => {
    const valencia = reviewsForLocation("valencia");
    expect(valencia.length).toBeGreaterThan(0);
    for (const review of valencia) {
      expect(review.locationId).toBe("valencia");
    }
  });

  it("locationIdsWithReviews lists each covered clinic exactly once", () => {
    const ids = locationIdsWithReviews();
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toContain("valencia");
    expect(ids).not.toContain("santa-monica");
    expect(ids).not.toContain("camarillo");
  });

  it("groupReviewsByReviewer stacks a reviewer's multiple reviews chronologically", () => {
    const grouped = groupReviewsByReviewer(reviewsForLocation("valencia"));
    const karmilia = grouped.find((g) => g.reviewer === "Karmilia A.");
    expect(karmilia).toBeDefined();
    expect(karmilia!.entries).toHaveLength(2);
    expect(karmilia!.entries[0].date < karmilia!.entries[1].date).toBe(true);
  });

  it("groupReviewsByReviewer never drops or duplicates a review", () => {
    const source = reviewsForLocation("pasadena");
    const grouped = groupReviewsByReviewer(source);
    const total = grouped.reduce((sum, g) => sum + g.entries.length, 0);
    expect(total).toBe(source.length);
  });

  it("featuredYelpReview is Karmilia A.'s most recent Valencia review", () => {
    expect(featuredYelpReview.locationId).toBe("valencia");
    expect(featuredYelpReview.reviewer).toBe("Karmilia A.");
    expect(featuredYelpReview.date).toBe("2026-09-17");
  });

  it("has reviews for Tarzana", () => {
    expect(reviewsForLocation("tarzana").length).toBeGreaterThan(0);
  });

  it("decoded accented characters correctly (no mojibake left in the source)", () => {
    const chris = yelpReviews.find((r) => r.reviewer === "Chris P." && r.locationId === "la-canada");
    expect(chris?.text).toContain("La Cañada");
    const nancy = yelpReviews.find((r) => r.reviewer === "Nancy P." && r.locationId === "pasadena");
    expect(nancy?.text).toContain("Peña Family");
  });

  describe("interleaveByLocation / yelpReviewsSlideshowOrder", () => {
    it("keeps every review, without dropping or duplicating any", () => {
      const interleaved = interleaveByLocation(yelpReviews);
      expect(interleaved).toHaveLength(yelpReviews.length);
      expect(new Set(interleaved).size).toBe(yelpReviews.length);
    });

    it("spans every clinic within the first N slides, N = number of clinics with reviews", () => {
      const clinicCount = locationIdsWithReviews().length;
      const firstStretch = yelpReviewsSlideshowOrder.slice(0, clinicCount);
      expect(new Set(firstStretch.map((r) => r.locationId)).size).toBe(clinicCount);
    });

    it("only places two same-clinic slides back to back once every other clinic is exhausted", () => {
      for (let i = 0; i < yelpReviewsSlideshowOrder.length - 1; i++) {
        if (yelpReviewsSlideshowOrder[i].locationId === yelpReviewsSlideshowOrder[i + 1].locationId) {
          const remainingLocations = new Set(
            yelpReviewsSlideshowOrder.slice(i).map((r) => r.locationId)
          );
          expect(remainingLocations.size).toBe(1);
        }
      }
    });

    it("includes the featured review", () => {
      expect(yelpReviewsSlideshowOrder).toContainEqual(featuredYelpReview);
    });
  });
});
