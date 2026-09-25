"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { yelpReviewsSlideshowOrder, featuredYelpReview } from "@/data/yelpReviews";
import { YelpStarRating } from "@/components/YelpStarRating";

// Auto-advance speed scales with how much there is to read (roughly 200
// words/minute), so a one-line review doesn't linger and a long one isn't
// cut off. Clamped to a sane range either way.
const MIN_INTERVAL_MS = 6000;
const MAX_INTERVAL_MS = 14000;
const MS_PER_WORD = 300;

function intervalForReview(text: string): number {
  const wordCount = text.trim().split(/\s+/).length;
  return Math.min(MAX_INTERVAL_MS, Math.max(MIN_INTERVAL_MS, wordCount * MS_PER_WORD));
}

function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="none" className="h-4 w-4">
      <path
        d={direction === "left" ? "m15 18-6-6 6-6" : "m9 18 6-6-6-6"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M7 5h3v14H7zM14 5h3v14h-3z" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M8 5v14l11-7Z" />
    </svg>
  );
}

const navButtonClass =
  "flex h-9 w-9 items-center justify-center rounded-full border border-border text-ink-soft transition-colors hover:border-teal hover:text-teal-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal";

type YelpAppreciationSlideshowProps = {
  /** Wires the heading to a wrapping <section aria-labelledby>, where the
   * page's own section convention expects one (e.g. the Media page). */
  headingId?: string;
};

// Shared "Yelp Appreciation" feature, identical on the Homepage and the
// Media page per the client's request: rotates through every 5-star review
// (195 across 18 clinics, see data/yelpReviews.ts), opening on Karmilia
// A.'s review, the one named when this feature was first requested.
//
// Auto-advances like WhyFamiliesSlideshow, but at this volume dot
// indicators aren't workable, so navigation is prev/next plus a "N of
// total" counter instead. Auto-advance is pausable (hover, focus, or the
// explicit pause button) and off entirely under prefers-reduced-motion,
// per WCAG 2.2.2 (moving content must be stoppable).
export function YelpAppreciationSlideshow({ headingId }: YelpAppreciationSlideshowProps = {}) {
  const t = useTranslations("YelpAppreciation");
  const locale = useLocale();
  const prefersReducedMotion = usePrefersReducedMotion();

  const startIndex = useMemo(() => {
    const index = yelpReviewsSlideshowOrder.indexOf(featuredYelpReview);
    return index === -1 ? 0 : index;
  }, []);
  const [activeIndex, setActiveIndex] = useState(startIndex);
  const [isPaused, setIsPaused] = useState(false);

  const total = yelpReviewsSlideshowOrder.length;
  const review = yelpReviewsSlideshowOrder[activeIndex];

  useEffect(() => {
    if (prefersReducedMotion || isPaused) return;
    const timer = setTimeout(() => {
      setActiveIndex((current) => (current + 1) % total);
    }, intervalForReview(review.text));
    return () => clearTimeout(timer);
  }, [activeIndex, isPaused, prefersReducedMotion, review.text, total]);

  const goToPrevious = () => setActiveIndex((current) => (current - 1 + total) % total);
  const goToNext = () => setActiveIndex((current) => (current + 1) % total);

  const formattedDate = new Intl.DateTimeFormat(locale, { dateStyle: "long" }).format(
    new Date(`${review.date}T00:00:00`)
  );

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      <span className="font-display text-xs font-semibold uppercase tracking-wide text-teal-dark">
        {t("eyebrow")}
      </span>
      <h2
        id={headingId}
        className="mt-2 max-w-2xl font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl"
      >
        {t("heading")}
      </h2>

      <blockquote
        key={activeIndex}
        className="mt-6 rounded-3xl border border-border bg-surface p-6 shadow-card motion-safe:animate-[slide-up_400ms_ease-out] sm:p-8"
      >
        <YelpStarRating
          rating={review.rating}
          label={t("ratingLabel", { rating: review.rating })}
        />
        <p className="mt-4 whitespace-pre-line text-lg text-ink sm:text-xl">{review.text}</p>
        <footer className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-1 font-display text-sm font-semibold text-ink-soft">
          <cite className="not-italic text-ink">
            {t("reviewerAttribution", { name: review.reviewer })}
          </cite>
          <span aria-hidden className="text-border">|</span>
          <span>{formattedDate}</span>
        </footer>
      </blockquote>

      <div className="mt-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button type="button" onClick={goToPrevious} aria-label={t("previousReview")} className={navButtonClass}>
            <ChevronIcon direction="left" />
          </button>
          <button type="button" onClick={goToNext} aria-label={t("nextReview")} className={navButtonClass}>
            <ChevronIcon direction="right" />
          </button>
          {!prefersReducedMotion && (
            <button
              type="button"
              onClick={() => setIsPaused((value) => !value)}
              aria-pressed={isPaused}
              aria-label={isPaused ? t("play") : t("pause")}
              className={navButtonClass}
            >
              {isPaused ? <PlayIcon /> : <PauseIcon />}
            </button>
          )}
        </div>
        <p className="font-display text-xs font-semibold text-ink-soft">
          {t("counter", { index: activeIndex + 1, total })}
        </p>
      </div>
    </div>
  );
}
