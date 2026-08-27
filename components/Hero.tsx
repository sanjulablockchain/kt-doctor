"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { BOOKING_URL } from "@/lib/constants";
import { locations } from "@/data/locations";
import { doctors } from "@/data/doctors";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { HeroNetworkPanel } from "@/components/HeroNetworkPanel";
import { HeroSlideshow } from "@/components/HeroSlideshow";

export function Hero() {
  const t = useTranslations("Home");

  const stats = [
    { label: t("statClinics"), value: `${locations.length}` },
    { label: t("statProviders"), value: `${doctors.length}+` },
    { label: t("statYears"), value: "18+" },
    { label: t("statAges"), value: "0-21" },
  ];

  return (
    // From `lg` up the hero occupies exactly the screen left under the sticky
    // header, so the fold lands on its bottom edge: no dead space on tall
    // monitors, no next-section sliver peeking in. `svh` (not `vh`) keeps that
    // stable while mobile browser chrome collapses. Below `lg` the two columns
    // stack, which is inherently taller than a screen, so height stays natural.
    <section
      data-on-navy
      className="relative flex flex-col overflow-hidden bg-navy lg:min-h-[calc(100svh-var(--header-h,4rem))]"
    >
      <HeroSlideshow />

      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-navy from-0% via-navy/75 via-40% to-transparent to-85%"
      />

      {/* Padding and gaps are viewport-relative from `lg` up so the content
          tightens on short laptops rather than spilling past the fold, while
          `flex-1` + `lg:items-center` centre it in the slack on tall screens.
          Every clamp sits at its max by ~900px tall, so large displays keep
          today's spacing exactly. */}
      <div className="relative mx-auto grid w-full grid-cols-1 max-w-7xl gap-10 px-5 py-12 sm:px-8 sm:py-16 lg:flex-1 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:gap-12 lg:py-[clamp(1rem,4svh,3.5rem)]">
        <div className="flex min-w-0 flex-col gap-6 lg:gap-[clamp(0.75rem,2.4svh,1.5rem)]">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 font-display text-xs font-semibold uppercase tracking-wide text-ivory">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden className="h-3.5 w-3.5">
              <path
                d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
              />
            </svg>
            {t("badge", { count: locations.length })}
          </span>

          <h1 className="max-w-xl font-display text-4xl font-extrabold leading-[1.08] tracking-tight text-ivory sm:text-5xl lg:text-[clamp(2.25rem,5.8svh,3.4rem)]">
            {t("headingStart")}{" "}
            <span className="text-teal">{t("headingHighlight")}</span>
          </h1>

          <p className="max-w-lg text-lg text-ivory/75">{t("subheading")}</p>

          <div className="mt-2 flex flex-wrap items-center gap-3">
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-teal px-5 py-2.5 font-display text-sm font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5 hover:bg-teal-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-tint focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
            >
              <svg viewBox="0 0 24 24" fill="none" aria-hidden className="h-4 w-4">
                <rect x="3" y="4.5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
                <path d="M16 2.5v4M8 2.5v4M3 10h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              {t("bookAppointment")}
            </a>
            <Link
              href="/doctors"
              className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-5 py-2.5 font-display text-sm font-semibold text-ivory transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-tint focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
            >
              <svg viewBox="0 0 24 24" fill="none" aria-hidden className="h-4 w-4">
                <path
                  d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6h0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8 15v1a6 6 0 0 0 6 6h0a6 6 0 0 0 6-6v-4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="20" cy="10" r="2" stroke="currentColor" strokeWidth="2" />
              </svg>
              {t("findDoctor")}
            </Link>
            <Link
              href="/locations"
              className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-5 py-2.5 font-display text-sm font-semibold text-ivory transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-tint focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
            >
              <svg viewBox="0 0 24 24" fill="none" aria-hidden className="h-4 w-4">
                <path
                  d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                <circle cx="12" cy="9" r="2.25" stroke="currentColor" strokeWidth="2" />
              </svg>
              {t("findClinic")}
            </Link>
          </div>

          <div aria-hidden className="mt-2 h-px w-full max-w-md bg-white/15" />

          <div className="grid grid-cols-2 gap-x-6 gap-y-4 sm:flex sm:flex-wrap sm:gap-x-0 sm:divide-x sm:divide-white/15">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col sm:pl-6 sm:first:pl-0">
                <p className="font-display text-2xl font-extrabold text-ivory">
                  <AnimatedCounter value={stat.value} />
                </p>
                <p className="mt-0.5 text-xs leading-tight text-ivory/60">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <HeroNetworkPanel />
      </div>
    </section>
  );
}
