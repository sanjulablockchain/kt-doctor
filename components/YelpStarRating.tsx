// A single 5-point star, filled with currentColor via a text-* class -
// matches the site's other single-path icon glyphs (see e.g. LocationCard).
function StarIcon() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4 shrink-0 fill-gold">
      <path d="M12 2.5l2.9 6.02 6.6.79-4.86 4.55 1.3 6.52L12 17.17l-5.94 3.21 1.3-6.52L2.5 9.31l6.6-.79L12 2.5Z" />
    </svg>
  );
}

type YelpStarRatingProps = {
  rating: number;
  /** Translated, e.g. "5 out of 5 stars" - the row is decorative, so the
   * accessible name lives on the wrapping role="img" element instead. */
  label: string;
};

// Shared by YelpAppreciationCard (the featured Homepage/Media review) and
// LocationYelpReviews (the per-clinic list), so the rating row looks and
// reads identically everywhere it appears.
export function YelpStarRating({ rating, label }: YelpStarRatingProps) {
  return (
    <div className="flex items-center gap-1" role="img" aria-label={label}>
      {Array.from({ length: rating }).map((_, index) => (
        <StarIcon key={index} />
      ))}
    </div>
  );
}
