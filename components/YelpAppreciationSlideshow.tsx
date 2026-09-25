"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { yelpReviewsSlideshowOrder, featuredYelpReview } from "@/data/yelpReviews";
import { YelpReviewSlideshow } from "@/components/YelpReviewSlideshow";

type YelpAppreciationSlideshowProps = {
  /** Wires the heading to a wrapping <section aria-labelledby>, where the
   * page's own section convention expects one (e.g. the Media page). */
  headingId?: string;
  /** "center" (default, used on the Homepage): eyebrow, heading, card, and
   * nav are centered as one spotlighted column, matching that page's other
   * standalone callouts. "left": everything stays at the section's left
   * edge instead, still capped to a comfortable reading width - used on
   * the Media page, where every other section (Press, Leadership, Kit,
   * Downloads) is left-aligned in the same wide container, so a centered
   * block would be the odd one out there. */
  align?: "left" | "center";
};

// Shared "Yelp Appreciation" feature, identical on the Homepage and the
// Media page per the client's request: rotates through every 5-star review
// (195 across 19 clinics, see data/yelpReviews.ts), opening on Karmilia
// A.'s review, the one named when this feature was first requested. The
// carousel itself is YelpReviewSlideshow, shared with LocationYelpReviews.
export function YelpAppreciationSlideshow({
  headingId,
  align = "center",
}: YelpAppreciationSlideshowProps = {}) {
  const t = useTranslations("YelpAppreciation");

  const startIndex = useMemo(() => {
    const index = yelpReviewsSlideshowOrder.indexOf(featuredYelpReview);
    return index === -1 ? 0 : index;
  }, []);

  const headingWrapperClass =
    align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl";

  return (
    <div>
      <div className={headingWrapperClass}>
        <span className="font-display text-xs font-semibold uppercase tracking-wide text-teal-dark">
          {t("eyebrow")}
        </span>
        <h2
          id={headingId}
          className="mt-2 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl"
        >
          {t("heading")}
        </h2>
      </div>

      <div className="mt-6">
        <YelpReviewSlideshow reviews={yelpReviewsSlideshowOrder} startIndex={startIndex} align={align} />
      </div>
    </div>
  );
}
