"use client";

import { useTranslations } from "next-intl";
import { reviewsForLocation } from "@/data/yelpReviews";
import { YelpReviewSlideshow } from "@/components/YelpReviewSlideshow";

type LocationYelpReviewsProps = {
  locationId: string;
  locationName: string;
};

// Renders nothing for the clinics with no reviews yet (4 locations not
// collected, plus Santa Monica, whose source rows were a duplicate of San
// Fernando's, see data/yelpReviews.ts) rather than an empty section.
export function LocationYelpReviews({ locationId, locationName }: LocationYelpReviewsProps) {
  const t = useTranslations("LocationYelpReviews");
  const reviews = reviewsForLocation(locationId);

  if (reviews.length === 0) {
    return null;
  }

  return (
    <section id="yelp-reviews" aria-labelledby="yelp-reviews-heading" className="mt-10">
      <h2 id="yelp-reviews-heading" className="font-display text-lg font-bold text-ink">
        {t("heading", { location: locationName })}
      </h2>

      <div className="mt-4">
        <YelpReviewSlideshow reviews={reviews} />
      </div>
    </section>
  );
}
