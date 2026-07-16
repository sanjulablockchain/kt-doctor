"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { BOOKING_URL, PAY_ONLINE_URL, PATIENT_PORTAL_URL, MAIN_PHONE } from "@/lib/constants";

// Formats a US display number like "(818) 361-5437" into E.164 for tel:
// links, e.g. "+18183615437" — matches components/Footer.tsx's formatting.
function toE164(usPhone: string): string {
  return `+1${usPhone.replace(/\D/g, "")}`;
}

const linkClass =
  "rounded-xl px-3 py-2.5 transition-colors hover:bg-ivory-deep hover:text-teal-dark sm:rounded-none sm:px-0 sm:py-0 sm:hover:bg-transparent";

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

  const otherLocale = locale === "en" ? "es" : "en";

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-ivory/95 shadow-[0_1px_0_0_rgba(18,24,31,0.04)] backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-y-2 px-5 py-2.5 sm:flex-nowrap sm:px-8">
        <Link href="/" className="flex shrink-0 items-center">
          <Image
            src="/clinic-logo.svg"
            alt="Kids & Teens Medical Group"
            width={48}
            height={15}
            className="h-11 w-auto sm:h-12"
            priority
            unoptimized
          />
        </Link>

        <nav
          data-testid="mobile-menu"
          onClick={() => setMenuOpen(false)}
          className={`order-4 w-full flex-col gap-1 border-t border-border pt-3 font-medium text-ink-soft sm:order-none sm:flex sm:w-auto sm:flex-1 sm:flex-row sm:items-center sm:justify-center sm:gap-7 sm:border-none sm:pt-0 sm:text-sm ${
            menuOpen ? "flex" : "hidden"
          }`}
        >
          <Link href="/doctors" className={linkClass}>
            {t("doctors")}
          </Link>
          <Link href="/locations" className={linkClass}>
            {t("locations")}
          </Link>
          <Link href="/resources" className={linkClass}>
            {t("resources")}
          </Link>

          <div ref={moreRef} className="relative flex flex-col gap-1 sm:inline-block">
            <button
              type="button"
              aria-expanded={moreOpen}
              onClick={() => setMoreOpen((open) => !open)}
              className="hidden items-center gap-1 rounded-xl px-3 py-2.5 transition-colors hover:bg-ivory-deep hover:text-teal-dark sm:flex sm:rounded-none sm:px-0 sm:py-0 sm:hover:bg-transparent"
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
              className={`flex flex-col gap-1 sm:absolute sm:right-0 sm:top-full sm:mt-2 sm:w-56 sm:flex-col sm:gap-0.5 sm:rounded-2xl sm:border sm:border-border sm:bg-white sm:p-2 sm:shadow-card ${
                moreOpen ? "sm:flex" : "sm:hidden"
              }`}
            >
              <Link
                href="/about"
                onClick={() => setMoreOpen(false)}
                className="rounded-xl px-3 py-2.5 transition-colors hover:bg-ivory-deep hover:text-teal-dark"
              >
                {t("aboutUs")}
              </Link>
              <Link
                href="/network"
                onClick={() => setMoreOpen(false)}
                className="rounded-xl px-3 py-2.5 transition-colors hover:bg-ivory-deep hover:text-teal-dark"
              >
                {t("network")}
              </Link>
              <Link
                href="/foundation"
                onClick={() => setMoreOpen(false)}
                className="rounded-xl px-3 py-2.5 transition-colors hover:bg-ivory-deep hover:text-teal-dark"
              >
                {t("foundation")}
              </Link>
              <Link
                href="/careers"
                onClick={() => setMoreOpen(false)}
                className="rounded-xl px-3 py-2.5 transition-colors hover:bg-ivory-deep hover:text-teal-dark"
              >
                {t("careers")}
              </Link>
              <Link
                href="/insurance"
                onClick={() => setMoreOpen(false)}
                className="rounded-xl px-3 py-2.5 transition-colors hover:bg-ivory-deep hover:text-teal-dark"
              >
                {t("insurance")}
              </Link>
              <Link
                href="/services"
                onClick={() => setMoreOpen(false)}
                className="rounded-xl px-3 py-2.5 transition-colors hover:bg-ivory-deep hover:text-teal-dark"
              >
                {t("services")}
              </Link>
              <Link
                href="/blog"
                onClick={() => setMoreOpen(false)}
                className="rounded-xl px-3 py-2.5 transition-colors hover:bg-ivory-deep hover:text-teal-dark"
              >
                {t("blog")}
              </Link>
              <Link
                href="/testimonials"
                onClick={() => setMoreOpen(false)}
                className="rounded-xl px-3 py-2.5 transition-colors hover:bg-ivory-deep hover:text-teal-dark"
              >
                {t("testimonials")}
              </Link>
            </div>
          </div>

          <a href={PAY_ONLINE_URL} target="_blank" rel="noopener noreferrer" className={linkClass}>
            {t("payOnline")}
          </a>
          <a
            href={PATIENT_PORTAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            {t("portalLogIn")}
          </a>
          <a
            href={`tel:${toE164(MAIN_PHONE)}`}
            className="flex items-center gap-1.5 rounded-xl px-3 py-2.5 font-display font-semibold text-ink sm:rounded-none sm:px-0 sm:py-0"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-teal-dark">
              <path
                d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.9 21 3 13.1 3 3.9c0-.6.4-1 1-1h4.4c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.6.1.4 0 .7-.2 1L6.6 10.8Z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
            </svg>
            {MAIN_PHONE}
          </a>

          <Link
            href={pathname}
            locale={otherLocale}
            className="rounded-xl px-3 py-2.5 font-display font-semibold uppercase text-ink-soft transition-colors hover:bg-ivory-deep hover:text-teal-dark sm:rounded-none sm:px-0 sm:py-0 sm:hover:bg-transparent"
          >
            {otherLocale.toUpperCase()}
          </Link>
        </nav>

        <div className="order-3 flex shrink-0 items-center gap-2.5 sm:order-none">
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-teal px-4 py-2 font-display text-xs font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5 hover:bg-teal-dark sm:px-5 sm:py-2.5 sm:text-sm"
          >
            {t("appointments")}
          </a>

          <button
            type="button"
            aria-label={t("toggleMenu")}
            aria-pressed={menuOpen}
            className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-full border border-border sm:hidden"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span
              className={`h-0.5 w-5 rounded-full bg-ink transition-transform ${menuOpen ? "translate-y-2 rotate-45" : ""}`}
            />
            <span
              className={`h-0.5 w-5 rounded-full bg-ink transition-opacity ${menuOpen ? "opacity-0" : ""}`}
            />
            <span
              className={`h-0.5 w-5 rounded-full bg-ink transition-transform ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`}
            />
          </button>
        </div>
      </div>
    </header>
  );
}
