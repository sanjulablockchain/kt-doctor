"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { locations } from "@/data/locations";
import { doctors } from "@/data/doctors";
import { partners } from "@/data/partners";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { BookAppointmentButton } from "@/components/BookAppointmentButton";
import { HeroNetworkPanel } from "@/components/HeroNetworkPanel";
import { HeroSlideshow } from "@/components/HeroSlideshow";
import { withBasePath } from "@/lib/basePath";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-tint focus-visible:ring-offset-2 focus-visible:ring-offset-navy";

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className="h-3.5 w-3.5 text-teal transition-transform group-hover:translate-x-0.5"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14m-6-6 6 6-6 6" />
    </svg>
  );
}

function VideoIcon({ className }: { className: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className={className}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    >
      <rect x="3" y="6" width="13" height="12" rx="2" />
      <path d="m16 10 5-3v10l-5-3" />
    </svg>
  );
}

function HeroTextLink({ href, icon, children }: { href: string; icon: ReactNode; children: ReactNode }) {
  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-1.5 rounded font-display text-sm font-semibold text-ivory/85 transition-colors hover:text-ivory ${focusRing}`}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden
        className="h-4 w-4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {icon}
      </svg>
      {children}
      <ArrowIcon />
    </Link>
  );
}

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
        className="absolute inset-0 bg-gradient-to-r from-navy from-0% via-navy/80 via-40% to-transparent to-85%"
      />
      {/* Bottom fade so the frosted stats strip sits on a dark base rather
          than on whatever the current slide happens to show. */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-72 bg-gradient-to-b from-navy/0 to-navy/85"
      />

      {/* Padding and gaps are viewport-relative from `lg` up so the content
          tightens on short laptops rather than spilling past the fold, while
          `flex-1` + `lg:items-center` centre it in the slack on tall screens.
          The stats strip below takes ~70px of the screen at 1366x768, which is
          why the vertical padding bottoms out lower than the gaps. */}
      <div className="relative mx-auto grid w-full grid-cols-1 max-w-7xl gap-10 px-5 py-12 sm:px-8 sm:py-16 lg:flex-1 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:gap-12 lg:py-[clamp(0.5rem,2.5svh,2.5rem)]">
        <div className="flex min-w-0 flex-col gap-6 lg:gap-[clamp(0.75rem,2.4svh,1.5rem)]">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex w-fit items-center gap-2.5 rounded-full border border-teal/40 bg-teal/15 py-1.5 pl-3 pr-3.5 font-display text-xs font-semibold uppercase tracking-wide text-teal-tint">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inset-0 rounded-full bg-teal motion-reduce:hidden animate-[ktmg-ping_1.6s_ease-out_infinite]" />
                <span className="relative h-2.5 w-2.5 rounded-full bg-teal" />
              </span>
              {t("heroSameDayPill")}
            </span>
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 font-display text-xs font-semibold uppercase tracking-wide text-ivory">
              <VideoIcon className="h-3.5 w-3.5" />
              {t("heroTelehealthPill")}
            </span>
          </div>

          {/* Sized by the smaller of viewport height and width from `lg` up:
              height keeps a 1366x768 laptop above the fold, width stops a tall
              portrait tablet from blowing the headline up to four lines. */}
          <h1 className="max-w-2xl font-display text-4xl font-extrabold leading-[1.04] tracking-tight text-ivory sm:text-5xl md:text-6xl lg:text-[clamp(2.5rem,min(7svh,5.2vw),4.5rem)]">
            {t("headingStart")}{" "}
            <span className="text-teal">{t("headingHighlight")}</span>
          </h1>

          <p className="max-w-xl text-lg leading-relaxed text-ivory/80 text-pretty">
            {t("subheading", { count: locations.length })}
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <BookAppointmentButton
              className={`inline-flex items-center justify-center gap-2 rounded-full bg-teal px-6 py-3.5 font-display text-[15px] font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5 hover:bg-teal-dark ${focusRing}`}
            >
              <svg viewBox="0 0 24 24" fill="none" aria-hidden className="h-4 w-4">
                <rect x="3" y="4.5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
                <path d="M16 2.5v4M8 2.5v4M3 10h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              {t("bookAppointment")}
            </BookAppointmentButton>
            <Link
              href="/services/telehealth"
              className={`inline-flex items-center justify-center gap-2 rounded-full border border-teal/60 bg-teal/15 px-6 py-3.5 font-display text-[15px] font-semibold text-teal-tint transition-colors hover:bg-teal/25 hover:text-white ${focusRing}`}
            >
              <VideoIcon className="h-4 w-4" />
              {t("heroTelehealthCta")}
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <HeroTextLink
              href="/doctors"
              icon={
                <>
                  <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6h0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1" />
                  <path d="M8 15v1a6 6 0 0 0 6 6h0a6 6 0 0 0 6-6v-4" />
                  <circle cx="20" cy="10" r="2" />
                </>
              }
            >
              {t("findDoctor")}
            </HeroTextLink>
            <HeroTextLink
              href="/locations"
              icon={
                <>
                  <path d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12Z" />
                  <circle cx="12" cy="9" r="2.25" />
                </>
              }
            >
              {t("findClinic")}
            </HeroTextLink>
          </div>
        </div>

        <HeroNetworkPanel />
      </div>

      {/* Frosted stats + partners strip. Stacks below `xl`: side by side, the
          four stats and seven logos need ~1200px, which only the xl container
          (1216px inside its padding) guarantees. */}
      <div className="relative border-t border-white/10 bg-black/30 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-6 sm:px-8 lg:py-[clamp(0.625rem,1.8svh,1.375rem)] xl:flex-row xl:items-center xl:justify-between xl:gap-10">
          <dl className="grid grid-cols-2 gap-x-6 gap-y-4 md:flex md:gap-0 md:divide-x md:divide-white/15">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col-reverse md:px-6 md:first:pl-0 md:last:pr-0">
                <dt className="mt-0.5 text-xs leading-tight text-ivory/65 md:whitespace-nowrap">{stat.label}</dt>
                <dd className="font-display text-2xl font-extrabold leading-tight text-ivory">
                  <AnimatedCounter value={stat.value} />
                </dd>
              </div>
            ))}
          </dl>

          <div className="flex flex-col gap-3 xl:items-end">
            <p className="font-display text-[11px] font-semibold uppercase tracking-[0.14em] text-gold">
              {t("partnersHeading")}
            </p>
            <ul className="flex flex-wrap items-center gap-x-5 gap-y-3 xl:flex-nowrap xl:justify-end">
              {partners.map((partner) => (
                <li key={partner.id}>
                  <Image
                    src={withBasePath(partner.logoSrc)}
                    alt={partner.name}
                    width={160}
                    height={48}
                    unoptimized
                    className="h-6 w-auto opacity-80 brightness-0 invert"
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
