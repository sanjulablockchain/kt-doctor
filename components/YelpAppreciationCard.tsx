"use client";

import { useLocale, useTranslations } from "next-intl";
import { featuredYelpReview } from "@/data/yelpReviews";
import { YelpStarRating } from "@/components/YelpStarRating";

// Shared "Yelp Appreciation" feature, identical on the Homepage and the
// Media page per the client's request: one featured review (currently
// Karmilia A.'s most recent Valencia review, see data/yelpReviews.ts),
// shown under a fixed heading. Deliberately not wrapped in its own
// <section> -- each page supplies that, matching AfterHoursCtaBanner's
// convention of returning content only.
type YelpAppreciationCardProps = {
  /** Wires the heading to a wrapping <section aria-labelledby>, where the
   * page's own section convention expects one (e.g. the Media page). */
  headingId?: string;
};

export function YelpAppreciationCard({ headingId }: YelpAppreciationCardProps = {}) {
  const t = useTranslations("YelpAppreciation");
  const locale = useLocale();
  const formattedDate = new Intl.DateTimeFormat(locale, { dateStyle: "long" }).format(
    new Date(`${featuredYelpReview.date}T00:00:00`)
  );

  return (
    <div>
      <span className="font-display text-xs font-semibold uppercase tracking-wide text-teal-dark">
        {t("eyebrow")}
      </span>
      <h2
        id={headingId}
        className="mt-2 max-w-2xl font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl"
      >
        {t("heading")}
      </h2>

      <blockquote className="mt-6 rounded-3xl border border-border bg-surface p-6 shadow-card sm:p-8">
        <YelpStarRating
          rating={featuredYelpReview.rating}
          label={t("ratingLabel", { rating: featuredYelpReview.rating })}
        />
        <p className="mt-4 whitespace-pre-line text-lg text-ink sm:text-xl">
          {featuredYelpReview.text}
        </p>
        <footer className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-1 font-display text-sm font-semibold text-ink-soft">
          <cite className="not-italic text-ink">
            {t("reviewerAttribution", { name: featuredYelpReview.reviewer })}
          </cite>
          <span aria-hidden className="text-border">|</span>
          <span>{formattedDate}</span>
        </footer>
      </blockquote>
    </div>
  );
}
