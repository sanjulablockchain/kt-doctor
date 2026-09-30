"use client";

import { useMemo } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { yelpReviewsSlideshowOrder, featuredYelpReview } from "@/data/yelpReviews";
import { YelpReviewSlideshow } from "@/components/YelpReviewSlideshow";
import { withBasePath } from "@/lib/basePath";

type YelpAppreciationSlideshowProps = {
  /** Wires the heading to a wrapping <section aria-labelledby>, where the
   * page's own section convention expects one (e.g. the Media page). */
  headingId?: string;
  /** "center" (default): eyebrow, heading, card, and nav are centered as
   * one spotlighted column. "left": everything stays at the section's
   * left edge instead, still capped to a comfortable reading width - used
   * on the Media page, where every other section (Press, Leadership, Kit,
   * Downloads) is left-aligned in the same wide container. Ignored when
   * showImage is true, since that layout is always left-aligned to sit
   * next to the photo, matching this page's other two-column sections. */
  align?: "left" | "center";
  /** Homepage only: lays this out as a two-column section (review teaser
   * on the left, a photo on the right) matching "Why families choose us"
   * and the Telehealth teaser just above and below it, instead of the
   * single centered/left-aligned column used on its own. */
  showImage?: boolean;
};

// Shared "Yelp Appreciation" feature, on the Homepage and the Media page
// per the client's request: rotates through every 5-star review (195
// across 19 clinics, see data/yelpReviews.ts), opening on Karmilia A.'s
// review, the one named when this feature was first requested. The
// carousel itself is YelpReviewSlideshow, shared with LocationYelpReviews.
export function YelpAppreciationSlideshow({
  headingId,
  align = "center",
  showImage = false,
}: YelpAppreciationSlideshowProps = {}) {
  const t = useTranslations("YelpAppreciation");

  const startIndex = useMemo(() => {
    const index = yelpReviewsSlideshowOrder.indexOf(featuredYelpReview);
    return index === -1 ? 0 : index;
  }, []);

  const effectiveAlign = showImage ? "left" : align;
  const headingWrapperClass =
    effectiveAlign === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl";

  const textBlock = (
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
        <YelpReviewSlideshow
          reviews={yelpReviewsSlideshowOrder}
          startIndex={startIndex}
          align={effectiveAlign}
          variant="spotlight"
        />
      </div>
    </div>
  );

  if (!showImage) {
    return textBlock;
  }

  return (
    // Exactly the grid/image classes "Why families choose us" and the
    // Telehealth teaser use (h-72/sm:h-96, lg:items-center, lg:gap-12) so
    // this image is the same size as theirs, not stretched or shrunk to
    // fit whatever height the review card happens to need. The card's own
    // height is what's tuned to be a reasonable match (see
    // YelpReviewSlideshow's review-text box), not the other way around.
    <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-12">
      <Image
        src={withBasePath("/home/yelp-appreciation.jpg")}
        alt={t("imageAlt")}
        width={1000}
        height={630}
        sizes="(min-width: 1024px) 45vw, 100vw"
        className="h-72 w-full rounded-[2rem] object-cover shadow-card sm:h-96 lg:order-2"
      />
      <div className="lg:order-1">{textBlock}</div>
    </div>
  );
}
