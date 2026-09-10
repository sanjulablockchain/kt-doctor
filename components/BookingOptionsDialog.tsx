"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";
import { BOOKING_URL, MAIN_PHONE, TEXT_PHONE } from "@/lib/constants";
import { toE164 } from "@/lib/phone";

type BookingOption = {
  key: string;
  href: string;
  title: string;
  body: string;
  external?: boolean;
  /** Reaches the practice without waiting on the phone, so we steer here. */
  recommended?: boolean;
  /** Selling points, shown as a tick list. Recommended options only. */
  perks?: string[];
  icon: ReactNode; // inner <path>/<rect> of a 24x24 stroke icon
};

const CALENDAR_ICON = (
  <>
    <rect x="3" y="4.5" width="18" height="16" rx="2" />
    <path d="M16 2.5v4M8 2.5v4M3 10h18" />
  </>
);

const CHAT_ICON = (
  <path d="M21 11.5a8.4 8.4 0 0 1-9 8.3 9 9 0 0 1-2.5-.4L4 21l1.4-4.1A8 8 0 0 1 4 11.5 8.4 8.4 0 0 1 12.5 3 8.4 8.4 0 0 1 21 11.5Z" />
);

const PHONE_ICON = (
  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" />
);

function SectionIcon({ children }: { children: ReactNode }) {
  return (
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-tint text-teal-dark">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden
        className="h-5 w-5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {children}
      </svg>
    </span>
  );
}

function Chevron({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <path
        d="m9 6 6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// The three ways a family can actually reach us to get an appointment, offered
// side by side instead of sending everyone straight to Healow. Rendered only
// while open - the caller mounts it and owns the open state, so there is never
// a hidden dialog sitting in the DOM. Reuses EntryPopup's dialog behaviour
// (Escape, backdrop click, body-scroll lock, focus moved into the panel).
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
      recommended: true,
      title: t("bookOnlineTitle"),
      body: t("bookOnlineBody"),
      perks: [t("bookOnlinePerk1"), t("bookOnlinePerk2"), t("bookOnlinePerk3")],
      icon: CALENDAR_ICON,
    },
    {
      key: "text",
      href: `sms:${toE164(TEXT_PHONE)}`,
      recommended: true,
      title: t("textTitle"),
      body: t("textBody"),
      perks: [t("textPerk1"), t("textPerk2"), t("textPerk3")],
      icon: CHAT_ICON,
    },
    {
      key: "call",
      href: `tel:${toE164(MAIN_PHONE)}`,
      title: t("callTitle"),
      body: t("callBody", { phone: MAIN_PHONE }),
      icon: PHONE_ICON,
    },
  ];

  const recommended = options.filter((option) => option.recommended);
  const alternatives = options.filter((option) => !option.recommended);

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
          a centred card from `sm` up. The two recommended options sit side by
          side from `sm`, so the panel is wider than a plain list would need;
          max-h + overflow keeps the stacked mobile layout reachable. */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-options-heading"
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
        className="relative flex max-h-[90svh] w-full max-w-2xl flex-col overflow-y-auto rounded-3xl bg-surface p-6 shadow-card motion-safe:animate-[slide-up_300ms_ease-out] focus:outline-none focus:ring-2 focus:ring-teal focus:ring-offset-2 focus:ring-offset-black/50 sm:p-7"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label={t("closeLabel")}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-surface/85 text-ink-soft transition-colors hover:bg-ivory-deep hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal"
        >
          <svg viewBox="0 0 24 24" fill="none" aria-hidden className="h-4 w-4">
            <path d="M18 6 6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        <h2
          id="booking-options-heading"
          className="pr-8 font-display text-xl font-extrabold uppercase tracking-tight text-ink sm:text-2xl"
        >
          {t("heading")}
        </h2>
        <p className="mt-1.5 text-sm text-ink-soft">{t("body")}</p>

        {/* The recommended pair is boxed together so the grouping itself does
            some of the recommending, before anyone reads a badge. */}
        <section
          aria-labelledby="booking-options-group"
          className="mt-5 rounded-2xl border border-teal/40 bg-teal-tint/40 p-4 sm:p-5"
        >
          <div className="flex items-start gap-3">
            <SectionIcon>
              <path d="M13 2 4.5 13.5H11l-1 8.5 8.5-11.5H12l1-8.5Z" />
            </SectionIcon>
            <div className="min-w-0">
              <p
                id="booking-options-group"
                className="font-display text-base font-bold text-ink"
              >
                {t("groupTitle")}
              </p>
              <p className="text-sm text-ink-soft">{t("groupBody")}</p>
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {recommended.map((option) => (
              <a
                key={option.key}
                href={option.href}
                {...(option.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                onClick={onClose}
                className="group flex flex-col rounded-2xl border border-teal bg-surface p-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2"
              >
                <span className="flex items-start justify-between gap-2">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal text-white">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden
                      className="h-5 w-5"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      {option.icon}
                    </svg>
                  </span>
                  {/* Outlined rather than solid teal: text-teal-dark on
                      bg-surface clears 5.5:1 in both themes, where white on
                      teal drops to about 3.5:1 - under the 4.5:1 that text
                      this small needs. */}
                  <span className="inline-flex items-center gap-1 rounded-full border border-teal bg-surface px-2 py-0.5 font-display text-[0.65rem] font-bold text-teal-dark">
                    <svg viewBox="0 0 24 24" aria-hidden className="h-3 w-3 fill-current">
                      <path d="m12 2.5 2.9 5.9 6.6.9-4.8 4.6 1.2 6.5-5.9-3.1-5.9 3.1 1.2-6.5L2.5 9.3l6.6-.9L12 2.5Z" />
                    </svg>
                    {t("recommendedBadge")}
                  </span>
                </span>

                <span className="mt-3 flex items-center justify-between gap-2">
                  <span className="min-w-0">
                    <span className="block font-display text-lg font-bold text-ink">
                      {option.title}
                    </span>
                    <span className="block text-sm text-ink-soft">{option.body}</span>
                  </span>
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-tint text-teal-dark transition-transform group-hover:translate-x-0.5">
                    <Chevron className="h-4 w-4" />
                  </span>
                </span>

                <span className="mt-3 flex flex-col gap-1.5">
                  {option.perks?.map((perk) => (
                    <span key={perk} className="flex items-start gap-2 text-sm text-ink-soft">
                      <svg
                        viewBox="0 0 24 24"
                        aria-hidden
                        className="mt-0.5 h-4 w-4 shrink-0 fill-current text-teal-dark"
                      >
                        <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm4.7 7.7-5.4 5.4a1 1 0 0 1-1.4 0L7.3 12.5a1 1 0 1 1 1.4-1.4l1.9 1.9 4.7-4.7a1 1 0 1 1 1.4 1.4Z" />
                      </svg>
                      {perk}
                    </span>
                  ))}
                </span>
              </a>
            ))}
          </div>
        </section>

        <hr className="mt-6 border-t border-border" />

        {/* The prompt introduces the phone option rather than living inside
            its row: as row copy it pushed the number onto a second line. */}
        <div className="mt-5 flex items-start gap-3">
          <SectionIcon>
            <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 9a7 7 0 0 1 14 0" />
          </SectionIcon>
          <div className="min-w-0">
            <p className="font-display text-base font-bold text-ink">{t("speakPrompt")}</p>
            <p className="text-sm text-ink-soft">{t("speakBody")}</p>
          </div>
        </div>

        <div className="mt-3 flex flex-col gap-3">
          {alternatives.map((option) => (
            <a
              key={option.key}
              href={option.href}
              onClick={onClose}
              className="group flex items-center gap-4 rounded-2xl border border-border bg-ivory p-4 text-left transition-all hover:-translate-y-0.5 hover:border-teal hover:shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-tint text-teal-dark transition-colors group-hover:bg-teal group-hover:text-white">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden
                  className="h-5 w-5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {option.icon}
                </svg>
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-display text-base font-bold text-ink">
                  {option.title}
                </span>
                <span className="block text-sm text-ink-soft">{option.body}</span>
              </span>
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ivory-deep text-ink-soft transition-transform group-hover:translate-x-0.5 group-hover:text-teal-dark">
                <Chevron className="h-4 w-4" />
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>,
    document.body
  );
}
