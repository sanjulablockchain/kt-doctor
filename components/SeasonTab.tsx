"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { SeasonBanners } from "@/components/SeasonBanners";

// Floating "Season" tab, homepage only, `sm` breakpoint and up. Pinned to
// the left edge, vertically centered so it clears the bottom-anchored
// BackToTopButton (mirrors DonateTab's right-edge placement). Below `sm`,
// this is hidden in favor of MobileQuickDrawer, which merges Season and
// Donate into one launcher so two edge tabs don't crowd a small screen.
export function SeasonTab() {
  const t = useTranslations("SeasonTab");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-controls="season-drawer"
        aria-label={t("openSeason")}
        aria-hidden={open}
        tabIndex={open ? -1 : 0}
        onClick={() => setOpen(true)}
        className="fixed left-0 top-1/2 z-20 hidden -translate-y-1/2 flex-col items-center gap-1.5 rounded-r-2xl bg-teal px-1.5 py-3 text-white shadow-soft transition-colors duration-200 hover:bg-teal-dark focus-visible:bg-teal-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-dark focus-visible:ring-offset-2 motion-safe:animate-[slide-in-left_400ms_ease-out] sm:flex sm:gap-2 sm:px-2.5 sm:py-4"
      >
        <svg viewBox="0 0 24 24" fill="none" aria-hidden className="h-4 w-4 sm:h-5 sm:w-5">
          <path
            d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 1 1 0-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 0 1-1.44-4.282m3.102.069a18.03 18.03 0 0 1-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 0 1 8.835 2.535M10.34 6.66a23.847 23.847 0 0 0 8.835-2.535"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="rotate-180 font-display text-xs font-semibold uppercase tracking-wide [writing-mode:vertical-rl] sm:text-sm">
          {t("label")}
        </span>
      </button>

      {open && <SeasonBanners onClose={() => setOpen(false)} />}
    </>
  );
}
