"use client";

import { useTranslations } from "next-intl";
import { foundation } from "@/data/foundation";

// Floating donate call-to-action, homepage only. Pinned to the right edge,
// vertically centered so it clears the bottom-anchored ContactWidget and
// BackToTopButton. External link — uses a plain <a>, not next-intl's Link.
// All motion is gated behind `motion-safe:` so it is inert under
// prefers-reduced-motion; the keyframes live in app/globals.css.
export function DonateTab() {
  const t = useTranslations("DonateTab");

  return (
    <a
      href={foundation.donateUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t("ariaLabel")}
      className="fixed right-0 top-1/2 z-20 flex -translate-y-1/2 flex-col items-center gap-1.5 rounded-l-2xl bg-gold px-1.5 py-3 text-white shadow-soft transition-all duration-200 hover:bg-gold-dark focus-visible:bg-gold-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-dark focus-visible:ring-offset-2 motion-safe:animate-[slide-in-right_400ms_ease-out] motion-safe:hover:-translate-x-1 motion-safe:focus-visible:-translate-x-1 sm:gap-2 sm:px-2.5 sm:py-4"
    >
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden
        className="h-4 w-4 motion-safe:animate-[heartbeat_2.5s_ease-in-out_infinite] sm:h-5 sm:w-5"
      >
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
      <span className="font-display text-xs font-semibold uppercase tracking-wide [writing-mode:vertical-rl] sm:text-sm">
        {t("label")}
      </span>
    </a>
  );
}
