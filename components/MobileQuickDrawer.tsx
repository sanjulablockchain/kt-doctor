"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { foundation } from "@/data/foundation";
import { SeasonBanners } from "@/components/SeasonBanners";

const EDGE_ZONE_PX = 24;
const SWIPE_OPEN_THRESHOLD_PX = 60;
const SHEET_ID = "quick-actions-sheet";
const SHEET_TITLE_ID = "quick-actions-title";

// Mobile-only (hidden at the `sm` breakpoint and up) floating launcher that
// merges the Season and Donate actions into a single app-drawer-style grid,
// since two separate edge tabs crowd a small screen - SeasonTab and
// DonateTab hide themselves at this breakpoint for the same reason. Opens on
// tap, or via an edge swipe (a touch starting within EDGE_ZONE_PX of the
// left edge, dragged right past SWIPE_OPEN_THRESHOLD_PX) - the mobile entry
// point SeasonTab's edge swipe used to own before the merge. Tapping the
// Season tile opens the same SeasonBanners drawer the desktop tab uses;
// tapping Donate opens the same foundation donate link DonateTab does.
export function MobileQuickDrawer() {
  const tSeason = useTranslations("SeasonTab");
  const tDonate = useTranslations("DonateTab");
  const tQuick = useTranslations("QuickActions");
  const [gridOpen, setGridOpen] = useState(false);
  const [seasonOpen, setSeasonOpen] = useState(false);

  useEffect(() => {
    if (!gridOpen && !seasonOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      if (seasonOpen) setSeasonOpen(false);
      else setGridOpen(false);
    }
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [gridOpen, seasonOpen]);

  useEffect(() => {
    if (gridOpen || seasonOpen) return;

    let startX: number | null = null;
    let startY: number | null = null;

    function handleTouchStart(event: TouchEvent) {
      const touch = event.touches[0];
      if (touch && touch.clientX <= EDGE_ZONE_PX) {
        startX = touch.clientX;
        startY = touch.clientY;
      } else {
        startX = null;
        startY = null;
      }
    }

    function handleTouchMove(event: TouchEvent) {
      if (startX === null || startY === null) return;
      const touch = event.touches[0];
      if (!touch) return;
      const deltaX = touch.clientX - startX;
      const deltaY = Math.abs(touch.clientY - startY);
      if (deltaX > SWIPE_OPEN_THRESHOLD_PX && deltaX > deltaY) {
        setGridOpen(true);
        startX = null;
        startY = null;
      }
    }

    function handleTouchEnd() {
      startX = null;
      startY = null;
    }

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [gridOpen, seasonOpen]);

  return (
    <div className="sm:hidden">
      <button
        type="button"
        aria-expanded={gridOpen}
        aria-haspopup="dialog"
        aria-controls={SHEET_ID}
        aria-label={tQuick("openLabel")}
        aria-hidden={gridOpen}
        tabIndex={gridOpen ? -1 : 0}
        onClick={() => setGridOpen(true)}
        className="fixed bottom-5 left-1/2 z-20 flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full bg-teal text-white shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:bg-teal-dark active:scale-90"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="h-6 w-6">
          <circle cx="6" cy="6" r="1.7" />
          <circle cx="12" cy="6" r="1.7" />
          <circle cx="18" cy="6" r="1.7" />
          <circle cx="6" cy="12" r="1.7" />
          <circle cx="12" cy="12" r="1.7" />
          <circle cx="18" cy="12" r="1.7" />
          <circle cx="6" cy="18" r="1.7" />
          <circle cx="12" cy="18" r="1.7" />
          <circle cx="18" cy="18" r="1.7" />
        </svg>
      </button>

      {gridOpen && (
        <>
          <div
            data-testid="quick-actions-backdrop"
            aria-hidden="true"
            onClick={() => setGridOpen(false)}
            className="fixed inset-0 z-40 bg-black/50"
          />
          <div
            id={SHEET_ID}
            role="dialog"
            aria-modal="true"
            aria-labelledby={SHEET_TITLE_ID}
            className="fixed inset-x-0 bottom-0 z-50 rounded-t-3xl bg-surface px-6 pb-[calc(2rem+env(safe-area-inset-bottom))] pt-3 shadow-card motion-safe:animate-[slide-up_300ms_ease-out]"
          >
            <div aria-hidden="true" className="mx-auto mb-4 h-1.5 w-10 shrink-0 rounded-full bg-border" />

            <div className="flex items-center justify-between gap-4">
              <h2 id={SHEET_TITLE_ID} className="font-display text-xl font-bold text-ink">
                {tQuick("title")}
              </h2>
              <button
                type="button"
                onClick={() => setGridOpen(false)}
                aria-label={tQuick("closeLabel")}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-ivory-deep hover:text-ink"
              >
                <svg viewBox="0 0 24 24" fill="none" aria-hidden className="h-4 w-4">
                  <path d="M18 6 6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <p className="mt-1 text-sm text-ink-soft">{tQuick("helper")}</p>

            <div className="mt-5 grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => {
                  setGridOpen(false);
                  setSeasonOpen(true);
                }}
                className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-surface p-5 shadow-card transition-all hover:-translate-y-1 hover:shadow-soft active:translate-y-0 active:scale-95"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-teal text-white shadow-soft">
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden className="h-6 w-6">
                    <path
                      d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 1 1 0-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 0 1-1.44-4.282m3.102.069a18.03 18.03 0 0 1-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 0 1 8.835 2.535M10.34 6.66a23.847 23.847 0 0 0 8.835-2.535"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span className="font-display text-sm font-semibold text-ink">{tSeason("label")}</span>
              </button>

              <a
                href={foundation.donateUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={tDonate("ariaLabel")}
                onClick={() => setGridOpen(false)}
                className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-surface p-5 shadow-card transition-all hover:-translate-y-1 hover:shadow-soft active:translate-y-0 active:scale-95"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gold text-white shadow-soft">
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="h-6 w-6">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                </span>
                <span className="font-display text-sm font-semibold text-ink">{tDonate("label")}</span>
              </a>
            </div>
          </div>
        </>
      )}

      {seasonOpen && <SeasonBanners onClose={() => setSeasonOpen(false)} />}
    </div>
  );
}
