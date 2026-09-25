"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { reviewsForLocation, groupReviewsByReviewer } from "@/data/yelpReviews";
import { YelpStarRating } from "@/components/YelpStarRating";

// Clinics range from 1 review (Canyon Country) to 40 (Pasadena). Showing
// every reviewer up front on the smaller ones while collapsing the larger
// ones behind one control keeps the page usable at every size.
const INITIAL_REVIEWER_COUNT = 6;

type LocationYelpReviewsProps = {
  locationId: string;
  locationName: string;
};

// Renders nothing for the clinics with no reviews yet (5 locations not
// collected, plus Santa Monica, whose source rows were a duplicate of San
// Fernando's, see data/yelpReviews.ts) rather than an empty section.
export function LocationYelpReviews({ locationId, locationName }: LocationYelpReviewsProps) {
  const t = useTranslations("LocationYelpReviews");
  const locale = useLocale();
  const [expanded, setExpanded] = useState(false);

  const reviews = reviewsForLocation(locationId);
  if (reviews.length === 0) {
    return null;
  }

  const grouped = groupReviewsByReviewer(reviews);
  const hasMore = grouped.length > INITIAL_REVIEWER_COUNT;
  const visibleGroups = expanded ? grouped : grouped.slice(0, INITIAL_REVIEWER_COUNT);
  const dateFormatter = new Intl.DateTimeFormat(locale, { dateStyle: "long" });

  return (
    <section id="yelp-reviews" aria-labelledby="yelp-reviews-heading" className="mt-10">
      <h2 id="yelp-reviews-heading" className="font-display text-lg font-bold text-ink">
        {t("heading", { location: locationName })}
      </h2>

      <div className="mt-4 flex flex-col gap-4">
        {visibleGroups.map((group) => (
          <div key={group.reviewer} className="rounded-2xl border border-border bg-surface p-4">
            <h3 className="font-display text-sm font-semibold text-ink">
              {t("reviewerAttribution", { name: group.reviewer })}
            </h3>
            <div className="mt-3 flex flex-col gap-4">
              {group.entries.map((entry, index) => (
                <blockquote
                  key={`${entry.date}-${index}`}
                  className="border-l-2 border-teal-tint pl-3"
                >
                  <YelpStarRating
                    rating={entry.rating}
                    label={t("ratingLabel", { rating: entry.rating })}
                  />
                  <p className="mt-2 whitespace-pre-line text-sm text-ink-soft">{entry.text}</p>
                  <footer className="mt-2 text-xs font-semibold text-ink-soft">
                    {dateFormatter.format(new Date(`${entry.date}T00:00:00`))}
                  </footer>
                </blockquote>
              ))}
            </div>
          </div>
        ))}
      </div>

      {hasMore && (
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          aria-expanded={expanded}
          className="mt-4 font-display text-sm font-semibold text-teal-dark hover:text-teal focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal"
        >
          {expanded ? t("showFewer") : t("showAll", { count: reviews.length })}
        </button>
      )}
    </section>
  );
}
