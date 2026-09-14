"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";
import { BOOKING_URL, MAIN_PHONE, SITE_NAME, TEXT_PHONE } from "@/lib/constants";
import { locations } from "@/data/locations";
import { insuranceInfo } from "@/data/insurance";
import { toE164 } from "@/lib/phone";
import { withBasePath } from "@/lib/basePath";

type BookingOption = {
  key: string;
  href: string;
  /** Small uppercase label above the title. */
  eyebrow: string;
  title: string;
  body: string;
  external?: boolean;
  /** The one option we steer toward: tinted, teal-bordered, teal eyebrow. */
  highlighted?: boolean;
  /** Titles that are phone numbers must not break mid-number. */
  nowrapTitle?: boolean;
};

// A compact "window" of the three ways to reach us: a titled header bar, one
// row of options, and a footer of practice facts. Booking online is the only
// highlighted option - texting and calling sit level beside it.
//
// Rendered only while open: the caller mounts it and owns the open state, so
// there is never a hidden dialog in the DOM. Reuses EntryPopup's dialog
// behaviour (Escape, backdrop click, body-scroll lock, focus into the panel).
export function BookingOptionsDialog({ onClose }: { onClose: () => void }) {
  const t = useTranslations("BookingDialog");
  const panelRef = useRef<HTMLDivElement>(null);

  // Scroll lock and the initial focus move belong to the dialog being open at
  // all, so they run once per mount. Keeping them out of the Escape effect
  // below matters: callers pass an inline `onClose`, so that effect re-runs on
  // every render, and re-running `focus()` with it would yank focus back to
  // the panel while someone was tabbing through the options.
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // The trigger that opened this dialog is now behind a backdrop, so pull
    // focus in explicitly rather than leaving it on an obscured button.
    panelRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const options: BookingOption[] = [
    {
      key: "book",
      href: BOOKING_URL,
      external: true,
      highlighted: true,
      eyebrow: t("bookEyebrow"),
      title: t("bookTitle"),
      body: t("bookBody"),
    },
    {
      key: "text",
      href: `sms:${toE164(TEXT_PHONE)}`,
      eyebrow: t("textEyebrow"),
      title: t("textTitle"),
      body: TEXT_PHONE,
    },
    {
      key: "call",
      href: `tel:${toE164(MAIN_PHONE)}`,
      eyebrow: t("callEyebrow"),
      title: MAIN_PHONE,
      nowrapTitle: true,
      body: t("callBody"),
    },
  ];

  // Only ever mounted in response to a click, so this never runs during the
  // server render; the guard is just belt and braces.
  if (typeof document === "undefined") return null;

  // Portalled to <body> so the dialog escapes its trigger's subtree. The hero,
  // hero panel, bottom banner and footer are all [data-on-navy], which pins
  // --color-ivory and --color-teal-tint to light values for the region - a
  // dialog rendered inside one came out pale in dark mode while the same
  // dialog opened from the header looked right. Portalling also frees it from
  // those sections' overflow-hidden and stacking contexts.
  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 backdrop-blur-sm sm:items-center"
      onClick={onClose}
    >
      {/* Bottom sheet on phones (items-end above) where the thumb already is,
          a centred window from `sm` up. The three options sit in a row from
          `sm` and stack below it, so max-h + overflow keeps the stacked
          layout reachable on a short screen. */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-options-heading"
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
        className="relative flex max-h-[90svh] w-full max-w-2xl flex-col overflow-y-auto rounded-2xl border border-border bg-surface shadow-card motion-safe:animate-[slide-up_300ms_ease-out] focus:outline-none focus:ring-2 focus:ring-teal focus:ring-offset-2 focus:ring-offset-black/50"
      >
        {/* Header bar */}
        <div className="flex items-center justify-between gap-3 border-b border-border bg-ivory px-4 py-3 sm:px-5">
          <div className="flex min-w-0 items-center gap-3">
            {/* nav_logo.png unmodified, per 817cea4: the clinic-logo-dark /
                footer-logo variants recolor the crest's ink and render it
                washed out, so everything points at the reference asset. */}
            <Image
              src={withBasePath("/nav_logo.png")}
              alt={SITE_NAME}
              width={300}
              height={262}
              unoptimized
              className="h-8 w-auto shrink-0 object-contain sm:h-9"
            />
            <div className="flex min-w-0 flex-col">
              <span
                id="booking-options-heading"
                className="font-display text-base font-bold text-ink"
              >
                {t("heading")}
              </span>
              <span className="truncate text-xs text-ink-soft">
                {t("subheading", { count: locations.length })}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={t("closeLabel")}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-teal bg-teal-tint text-teal-dark transition-colors hover:bg-teal hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal"
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden className="h-3.5 w-3.5">
              <path d="M18 6 6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Options */}
        <div className="flex flex-col gap-3.5 px-4 pb-5 pt-4 sm:px-5">
          <div className="flex items-center gap-2.5">
            <span className="font-display text-[0.7rem] font-semibold uppercase tracking-[0.08em] text-ink-soft">
              {t("urgencyEyebrow")}
            </span>
            <span aria-hidden className="h-px flex-1 border-t border-dotted border-border" />
          </div>

          {/* Booking online gets the wider column from `sm` up: its copy is
              the longest and it is the option we steer toward. */}
          <div className="grid gap-3 sm:grid-cols-[1.3fr_1fr_1fr]">
            {options.map((option) => (
              <a
                key={option.key}
                href={option.href}
                {...(option.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                onClick={onClose}
                className={`flex flex-col gap-1.5 rounded-xl p-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 ${
                  option.highlighted
                    ? "border-[1.5px] border-teal bg-teal-tint"
                    : "border border-border bg-ivory hover:border-teal"
                }`}
              >
                <span
                  className={`font-display text-[0.7rem] font-bold uppercase tracking-[0.06em] ${
                    option.highlighted ? "text-teal-dark" : "text-ink-soft"
                  }`}
                >
                  {option.eyebrow}
                </span>
                <span
                  className={`font-display text-base font-bold text-ink ${
                    option.nowrapTitle ? "whitespace-nowrap" : ""
                  }`}
                >
                  {option.title}
                </span>
                <span className="text-[0.8125rem] text-ink-soft">{option.body}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Footer bar */}
        <div className="flex flex-col gap-3 border-t border-border bg-ivory px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <span className="text-[0.8125rem] text-ink-soft">
            {t("footerMeta", {
              categories: insuranceInfo.acceptedCategories.join(", "),
            })}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-lg border border-border px-4 py-2 font-display text-sm font-semibold text-ink transition-colors hover:border-teal hover:text-teal-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal"
          >
            {t("notNow")}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
