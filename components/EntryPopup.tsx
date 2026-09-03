"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { BOOKING_URL, MAIN_PHONE } from "@/lib/constants";
import { withBasePath } from "@/lib/basePath";

const SEEN_KEY = "ktmg-entry-popup-seen";
const OPEN_DELAY_MS = 600;

// Formats a US display number like "(818) 361-5437" into E.164 for tel:
// links, e.g. "+18183615437" — matches components/Footer.tsx's formatting.
function toE164(usPhone: string): string {
  return `+1${usPhone.replace(/\D/g, "")}`;
}

// Homepage-only entry popup: a "Book Now" prompt shown once per browser
// session (gated by sessionStorage) shortly after the page mounts. Reuses
// PositionDetailsModal/MobileQuickDrawer's dialog pattern (Escape, backdrop
// click, body-scroll lock) but has no external trigger — it opens itself.
export function EntryPopup() {
  const t = useTranslations("EntryPopup");
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let alreadySeen = true;
    try {
      alreadySeen = sessionStorage.getItem(SEEN_KEY) === "true";
    } catch {
      // sessionStorage can be unavailable (e.g. private browsing) — fall
      // back to showing the popup rather than silently never showing it.
      alreadySeen = false;
    }
    if (alreadySeen) return;

    const timer = setTimeout(() => {
      setOpen(true);
      try {
        sessionStorage.setItem(SEEN_KEY, "true");
      } catch {
        // Best-effort only; see above.
      }
    }, OPEN_DELAY_MS);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Nothing triggered this dialog by user interaction (it opens itself on
    // a timer), so unlike PositionDetailsModal there's no prior click to
    // leave focus near — move it in explicitly so keyboard/screen-reader
    // users aren't left stranded on backgrounded content.
    panelRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={() => setOpen(false)}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="entry-popup-heading"
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
        className="relative flex w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-surface shadow-card motion-safe:animate-[slide-up_300ms_ease-out] focus:outline-none focus:ring-2 focus:ring-teal focus:ring-offset-2 focus:ring-offset-black/50 sm:flex-row"
      >
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label={t("closeLabel")}
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-surface/85 text-ink-soft shadow-soft backdrop-blur-sm transition-colors hover:bg-ivory-deep hover:text-ink"
        >
          <svg viewBox="0 0 24 24" fill="none" aria-hidden className="h-4 w-4">
            <path d="M18 6 6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        {/* Full-width band above the text on mobile; a side column on
            tablet/desktop (image right, text left). This source photo is
            landscape with the two faces spread wide (left and right of
            frame), so the side column is kept generously wide (46%) and the
            crop is biased with object-position rather than left centered -
            a narrow, center-cropped column would cut the right-hand face
            off. object-top handles the mobile band's vertical-only crop;
            the sm: override handles the side column's horizontal-only crop. */}
        <div className="relative h-40 w-full shrink-0 sm:order-2 sm:h-auto sm:w-[46%]">
          <Image
            src={withBasePath("/careers/benefits.jpg")}
            alt={t("photoAlt")}
            width={1200}
            height={900}
            unoptimized
            className="h-full w-full object-cover object-top sm:object-[58%_50%]"
          />
        </div>

        <div className="flex flex-1 flex-col justify-center gap-4 p-7 sm:order-1 sm:p-8">
          <div>
            <h2
              id="entry-popup-heading"
              className="font-display text-2xl font-extrabold uppercase tracking-tight text-ink sm:text-3xl"
            >
              {t("heading")}
            </h2>
            <p className="mt-2 text-ink-soft">{t("body")}</p>
          </div>

          <div className="flex flex-col gap-3">
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="flex w-full items-center justify-center rounded-full bg-teal px-6 py-3 text-center font-display font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5 hover:bg-teal-dark"
            >
              {t("bookCta")}
            </a>
            <a
              href={`tel:${toE164(MAIN_PHONE)}`}
              onClick={() => setOpen(false)}
              className="flex w-full items-center justify-center gap-2 rounded-full border border-border bg-surface px-6 py-3 text-center font-display font-semibold text-ink transition-colors hover:border-teal hover:text-teal-dark"
            >
              <svg viewBox="0 0 24 24" fill="none" aria-hidden className="h-4 w-4">
                <path
                  d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {t("callLabel", { phone: MAIN_PHONE })}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
