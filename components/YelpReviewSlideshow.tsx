"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import type { YelpReview } from "@/data/yelpReviews";
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

type YelpReviewSlideshowProps = {
  reviews: YelpReview[];
  /** Which review to open on. Defaults to the first. Out-of-range values
   * are clamped rather than throwing. */
  startIndex?: number;
  /** "center" (default): card and nav row are centered as a column, so
   * they don't stretch edge to edge inside a wide section, and don't end
   * up stranded against its left edge either. "left": same reading-width
   * cap, but left-aligned instead, for pages whose other sections are
   * already left-aligned in the same wide container. */
  align?: "left" | "center";
};

// Shared carousel core behind both YelpAppreciationSlideshow (Home/Media,
// all 195 reviews) and LocationYelpReviews (one clinic's own reviews).
// Callers own their own heading; this renders only the card and controls.
//
// Auto-advances like WhyFamiliesSlideshow, but at review-carousel volumes
// dot indicators aren't workable, so navigation is prev/next plus a "N of
// total" counter instead. Auto-advance is pausable (hover, focus, or the
// explicit pause button) and off entirely under prefers-reduced-motion,
// per WCAG 2.2.2 (moving content must be stoppable). Slide changes swap
// instantly, no transition, by design.
export function YelpReviewSlideshow({
  reviews,
  startIndex = 0,
  align = "center",
}: YelpReviewSlideshowProps) {
  const t = useTranslations("YelpAppreciation");
  const locale = useLocale();
  const prefersReducedMotion = usePrefersReducedMotion();

  const contentWidthClass = align === "center" ? "mx-auto max-w-2xl" : "max-w-2xl";

  const total = reviews.length;
  const clampedStart = Math.min(Math.max(startIndex, 0), total - 1);
  const [activeIndex, setActiveIndex] = useState(clampedStart);

  // Hover/focus pause is transient and separate from the explicit pause
  // button: if these shared one boolean, moving the mouse away would
  // silently resume a review the visitor deliberately paused, and merely
  // hovering would flip the button to "Play" without it ever being
  // clicked. Auto-advance stops for either reason; the button's icon and
  // aria-pressed only ever reflect the deliberate click.
  const [isManuallyPaused, setIsManuallyPaused] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const isPaused = isManuallyPaused || isHovering || isFocused;

  const review = reviews[activeIndex];

  useEffect(() => {
    if (prefersReducedMotion || isPaused || total <= 1) return;
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
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    >
      <blockquote className={`rounded-3xl border border-border bg-surface p-6 shadow-card sm:p-8 ${contentWidthClass}`}>
        <YelpStarRating
          rating={review.rating}
          label={t("ratingLabel", { rating: review.rating })}
        />
        {/* Fixed height, not just a min-height: review length ranges from
            one sentence to several paragraphs (12 to 377 words across the
            195 reviews), and letting the card grow/shrink with it was
            shoving every section below it up and down on every slide
            change. A shorter review just leaves empty space below it here;
            a longer one scrolls internally (the thin themed scrollbar from
            globals.css applies automatically) rather than resizing the
            card. */}
        <div className="mt-4 h-48 overflow-y-auto pr-2 sm:h-56">
          <p className="whitespace-pre-line text-lg text-ink sm:text-xl">{review.text}</p>
        </div>
        <footer className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-1 font-display text-sm font-semibold text-ink-soft">
          <cite className="not-italic text-ink">
            {t("reviewerAttribution", { name: review.reviewer })}
          </cite>
          <span aria-hidden className="text-border">|</span>
          <span>{formattedDate}</span>
        </footer>
      </blockquote>

      <div className={`mt-4 flex items-center justify-between gap-3 ${contentWidthClass}`}>
        <div className="flex items-center gap-2">
          <button type="button" onClick={goToPrevious} aria-label={t("previousReview")} className={navButtonClass}>
            <ChevronIcon direction="left" />
          </button>
          <button type="button" onClick={goToNext} aria-label={t("nextReview")} className={navButtonClass}>
            <ChevronIcon direction="right" />
          </button>
          {!prefersReducedMotion && total > 1 && (
            <button
              type="button"
              onClick={() => setIsManuallyPaused((value) => !value)}
              aria-pressed={isManuallyPaused}
              aria-label={isManuallyPaused ? t("play") : t("pause")}
              className={navButtonClass}
            >
              {isManuallyPaused ? <PlayIcon /> : <PauseIcon />}
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
