"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { BOOKING_URL, PAY_ONLINE_URL, PATIENT_PORTAL_URL, MAIN_PHONE } from "@/lib/constants";
import { ThemeToggle } from "@/components/ThemeToggle";
import { withBasePath } from "@/lib/basePath";

// Formats a US display number like "(818) 361-5437" into E.164 for tel:
// links, e.g. "+18183615437" — matches components/Footer.tsx's formatting.
function toE164(usPhone: string): string {
  return `+1${usPhone.replace(/\D/g, "")}`;
}

const primaryLinkClass =
  "flex items-center justify-between gap-2 rounded-xl border-b border-border/70 px-3 py-3.5 text-lg font-semibold text-ink transition-colors hover:bg-ivory-deep hover:text-teal-dark xl:whitespace-nowrap xl:rounded-none xl:border-none xl:px-0 xl:py-0 xl:text-sm xl:font-medium xl:text-ink-soft xl:hover:bg-transparent";

const secondaryLinkClass =
  "rounded-xl bg-ivory-deep/50 px-3 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-ivory-deep hover:text-teal-dark xl:bg-transparent xl:px-3 xl:py-2.5 xl:font-normal xl:text-ink-soft";

const locales = ["en", "es"] as const;

function ChevronRight() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className="h-4 w-4 shrink-0 text-ink-soft/60 xl:hidden">
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

export function Header() {
  const t = useTranslations("Header");
  const locale = useLocale();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!moreOpen) return;

    function handlePointerDown(event: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(event.target as Node)) {
        setMoreOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setMoreOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [moreOpen]);

  return (
    <header className="sticky top-0 z-40">
      {/* Decorative frosted-glass background on its own layer, behind the
          content row below. Keeping backdrop-blur off the row that contains
          <nav> matters: a `filter`/`backdrop-filter` ancestor becomes the
          containing block for `position: fixed` descendants, which would
          otherwise trap the mobile drawer inside this ~64px bar instead of
          letting it cover the viewport. */}
      <div
        aria-hidden
        className="absolute inset-0 border-b border-border bg-ivory/95 shadow-header backdrop-blur-md"
      />

      {/* Height comes from the --header-h token rather than padding so the Hero
          can subtract an exact number from 100svh. `items-center` keeps the
          crest optically identical to the previous `sm:py-2.5` sizing. */}
      <div className="relative mx-auto flex h-[var(--header-h,4rem)] max-w-7xl items-center justify-between gap-3 px-5 sm:gap-6 sm:px-8">
        <Link href="/" className="flex shrink-0 items-center">
          {/* Two variants toggled by theme (see .logo-light/.logo-dark in
              globals.css). The dark-mode PNG recolors the near-black ink so the
              crest tagline stays legible on the dark header. Only one is ever
              displayed, so both carry the same alt without duplicating it. */}
          <Image
            src={withBasePath("/nav_logo.png")}
            alt="Kids & Teens Medical Group"
            width={300}
            height={262}
            className="logo-light h-9 w-auto min-[375px]:h-11 sm:h-12"
            priority
            unoptimized
          />
          <Image
            src={withBasePath("/nav_logo_dark.png")}
            alt="Kids & Teens Medical Group"
            width={300}
            height={262}
            className="logo-dark h-9 w-auto min-[375px]:h-11 sm:h-12"
            priority
            unoptimized
          />
        </Link>

        <nav
          data-testid="mobile-menu"
          onClick={() => setMenuOpen(false)}
          className={`fixed inset-x-0 top-[var(--header-h,4rem)] bottom-0 z-30 flex-col gap-1 overflow-y-auto bg-ivory px-5 pb-4 pt-3 font-medium text-ink-soft xl:static xl:inset-auto xl:z-auto xl:flex xl:w-auto xl:flex-1 xl:flex-row xl:flex-wrap xl:items-center xl:justify-center xl:gap-x-7 xl:gap-y-2 xl:overflow-visible xl:bg-transparent xl:p-0 xl:text-sm ${
            menuOpen ? "flex" : "hidden"
          }`}
        >
          <Link href="/doctors" className={`${primaryLinkClass} order-1`}>
            {t("doctors")}
            <ChevronRight />
          </Link>
          <Link href="/locations" className={`${primaryLinkClass} order-2`}>
            {t("locations")}
            <ChevronRight />
          </Link>
          <a
            href={PAY_ONLINE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={`${primaryLinkClass} order-3 xl:order-5`}
          >
            {t("payOnline")}
            <ChevronRight />
          </a>
          <a
            href={PATIENT_PORTAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={`${primaryLinkClass} order-4 xl:order-6`}
          >
            {t("portalLogIn")}
            <ChevronRight />
          </a>

          <div ref={moreRef} className="relative order-6 xl:order-4 xl:inline-block">
            <p className="mb-1.5 mt-5 px-3 text-xs font-semibold uppercase tracking-wide text-ink-soft/80 xl:hidden">
              {t("more")}
            </p>
            <button
              type="button"
              aria-expanded={moreOpen}
              onClick={() => setMoreOpen((open) => !open)}
              className="hidden items-center gap-1 rounded-xl px-3 py-2.5 transition-colors hover:bg-ivory-deep hover:text-teal-dark xl:flex xl:rounded-none xl:px-0 xl:py-0 xl:hover:bg-transparent"
            >
              {t("more")}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className={`h-3.5 w-3.5 transition-transform ${moreOpen ? "rotate-180" : ""}`}
              >
                <path
                  d="m6 9 6 6 6-6"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <div
              className={`grid grid-cols-2 gap-1.5 xl:absolute xl:right-0 xl:top-full xl:mt-2 xl:w-56 xl:gap-0.5 xl:rounded-2xl xl:border xl:border-border xl:bg-surface xl:p-2 xl:shadow-card ${
                moreOpen ? "xl:flex xl:flex-col" : "xl:hidden"
              }`}
            >
              <Link href="/resources" onClick={() => setMoreOpen(false)} className={secondaryLinkClass}>
                {t("resources")}
              </Link>
              <Link href="/services/telehealth" onClick={() => setMoreOpen(false)} className={secondaryLinkClass}>
                {t("telehealth")}
              </Link>
              <Link href="/about" onClick={() => setMoreOpen(false)} className={secondaryLinkClass}>
                {t("aboutUs")}
              </Link>
              <Link href="/network" onClick={() => setMoreOpen(false)} className={secondaryLinkClass}>
                {t("network")}
              </Link>
              <Link href="/foundation" onClick={() => setMoreOpen(false)} className={secondaryLinkClass}>
                {t("foundation")}
              </Link>
              <Link href="/careers" onClick={() => setMoreOpen(false)} className={secondaryLinkClass}>
                {t("careers")}
              </Link>
              <Link href="/insurance" onClick={() => setMoreOpen(false)} className={secondaryLinkClass}>
                {t("insurance")}
              </Link>
              <Link href="/services" onClick={() => setMoreOpen(false)} className={secondaryLinkClass}>
                {t("services")}
              </Link>
              <Link href="/blog" onClick={() => setMoreOpen(false)} className={secondaryLinkClass}>
                {t("blog")}
              </Link>
              <Link href="/testimonials" onClick={() => setMoreOpen(false)} className={secondaryLinkClass}>
                {t("testimonials")}
              </Link>
              <Link href="/contact" onClick={() => setMoreOpen(false)} className={secondaryLinkClass}>
                {t("contact")}
              </Link>
            </div>
          </div>

          <div className="order-7 sticky bottom-0 -mx-5 mt-6 flex flex-col gap-3 border-t border-border bg-ivory px-5 pb-1 pt-4 xl:static xl:mx-0 xl:mt-0 xl:flex-row xl:items-center xl:gap-5 xl:border-none xl:bg-transparent xl:p-0">
            <a
              href={`tel:${toE164(MAIN_PHONE)}`}
              className="flex items-center gap-3 rounded-xl px-1 py-1 transition-colors hover:bg-ivory-deep xl:px-0 xl:py-0 xl:hover:bg-transparent"
            >
              <span
                aria-hidden
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-tint text-teal-dark"
              >
                <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                  <path
                    d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.9 21 3 13.1 3 3.9c0-.6.4-1 1-1h4.4c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.6.1.4 0 .7-.2 1L6.6 10.8Z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className="flex flex-col whitespace-nowrap leading-tight">
                <span className="hidden text-[10px] font-semibold uppercase tracking-wide text-ink-soft xl:block">
                  {t("callUs")}
                </span>
                <span className="font-display text-sm font-bold text-ink">{MAIN_PHONE}</span>
              </span>
            </a>

            <ThemeToggle />

            <div
              role="group"
              aria-label={t("toggleLanguage")}
              className="flex items-center gap-1 self-start rounded-full bg-ivory-deep p-1"
            >
              {locales.map((loc) =>
                loc === locale ? (
                  <span
                    key={loc}
                    aria-current="true"
                    className="rounded-full bg-teal px-3 py-1.5 font-display text-xs font-bold text-white"
                  >
                    {loc.toUpperCase()}
                  </span>
                ) : (
                  <Link
                    key={loc}
                    href={pathname}
                    locale={loc}
                    className="rounded-full px-3 py-1.5 font-display text-xs font-semibold text-ink-soft transition-colors hover:bg-surface hover:text-teal-dark"
                  >
                    {loc.toUpperCase()}
                  </Link>
                ),
              )}
            </div>
          </div>
        </nav>

        <div className="flex shrink-0 items-center gap-2.5">
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-teal px-4 py-2 font-display text-xs font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5 hover:bg-teal-dark motion-safe:animate-[heartbeat_2.5s_ease-in-out_infinite] hover:[animation-play-state:paused] sm:px-5 sm:py-2.5 sm:text-sm"
          >
            {t("appointments")}
          </a>

          <button
            type="button"
            aria-label={t("toggleMenu")}
            aria-pressed={menuOpen}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ivory-deep text-ink transition-colors hover:bg-border xl:hidden"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? (
              <svg viewBox="0 0 24 24" fill="none" aria-hidden className="h-5 w-5">
                <path
                  d="M18 6 6 18M6 6l12 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <span aria-hidden className="flex flex-col gap-1.5">
                <span className="h-0.5 w-5 rounded-full bg-ink" />
                <span className="h-0.5 w-5 rounded-full bg-ink" />
                <span className="h-0.5 w-5 rounded-full bg-ink" />
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
