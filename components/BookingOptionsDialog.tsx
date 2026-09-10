"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { BOOKING_URL, MAIN_PHONE, TEXT_PHONE } from "@/lib/constants";
import { toE164 } from "@/lib/phone";

type BookingOption = {
  key: string;
  href: string;
  title: string;
  body: string;
  external?: boolean;
  icon: ReactNode; // inner <path>/<rect> of a 24x24 stroke icon
};

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
      title: t("bookOnlineTitle"),
      body: t("bookOnlineBody"),
      icon: (
        <>
          <rect x="3" y="4.5" width="18" height="16" rx="2" />
          <path d="M16 2.5v4M8 2.5v4M3 10h18" />
        </>
      ),
    },
    {
      key: "text",
      href: `sms:${toE164(TEXT_PHONE)}`,
      title: t("textTitle"),
      body: t("textBody", { phone: TEXT_PHONE }),
      icon: (
        <path d="M21 11.5a8.4 8.4 0 0 1-9 8.3 9 9 0 0 1-2.5-.4L4 21l1.4-4.1A8 8 0 0 1 4 11.5 8.4 8.4 0 0 1 12.5 3 8.4 8.4 0 0 1 21 11.5Z" />
      ),
    },
    {
      key: "call",
      href: `tel:${toE164(MAIN_PHONE)}`,
      title: t("callTitle"),
      body: t("callBody", { phone: MAIN_PHONE }),
      icon: (
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" />
      ),
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 backdrop-blur-sm sm:items-center"
      onClick={onClose}
    >
      {/* Bottom sheet on phones (items-end above) where the thumb already is,
          a centred card from `sm` up. max-h + overflow keeps all three options
          reachable on a short landscape phone. */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-options-heading"
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
        className="relative flex max-h-[90svh] w-full max-w-md flex-col overflow-y-auto rounded-3xl bg-surface p-6 shadow-card motion-safe:animate-[slide-up_300ms_ease-out] focus:outline-none focus:ring-2 focus:ring-teal focus:ring-offset-2 focus:ring-offset-black/50 sm:p-7"
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

        <div className="mt-5 flex flex-col gap-3">
          {options.map((option) => (
            <a
              key={option.key}
              href={option.href}
              {...(option.external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
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
              <svg
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden
                className="h-4 w-4 shrink-0 text-ink-soft/60 transition-transform group-hover:translate-x-1 group-hover:text-teal-dark"
              >
                <path
                  d="m9 6 6 6-6 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
