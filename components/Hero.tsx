"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { BOOKING_URL } from "@/lib/constants";
import { locations } from "@/data/locations";
import { doctors } from "@/data/doctors";
import { ParallaxImage } from "@/components/ParallaxImage";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { SocialLinks } from "@/components/SocialLinks";
import { HeroNetworkPanel } from "@/components/HeroNetworkPanel";

export function Hero() {
  const t = useTranslations("Home");
  const tHero = useTranslations("Hero");

  const stats = [
    { label: t("statClinics"), value: `${locations.length}` },
    { label: t("statProviders"), value: `${doctors.length}+` },
    { label: t("statYears"), value: "18+" },
    { label: t("statAges"), value: "0-21" },
  ];

  return (
    <section data-on-navy className="relative overflow-hidden bg-navy lg:min-h-[44rem]">
      <ParallaxImage
        src="https://images.unsplash.com/photo-1632053002928-1919605ee6f7?auto=format&fit=crop&w=1200&q=80"
        alt="A pediatrician examining a young patient during a check-up"
        width={1200}
        height={1400}
        wrapperClassName="absolute inset-0 h-full w-full"
        speed={0.12}
        preload
      />

      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-navy via-navy/85 to-navy/30"
      />

      <div className="relative mx-auto flex max-w-7xl flex-col gap-6 px-5 pb-8 pt-12 sm:px-8 sm:pt-16 lg:pb-60">
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

        <h1 className="max-w-xl font-display text-4xl font-extrabold leading-[1.08] tracking-tight text-ivory sm:text-5xl lg:text-[3.4rem]">
          {t("headingStart")}{" "}
          <span className="text-teal-tint">{t("headingHighlight")}</span>
        </h1>

        <p className="max-w-lg text-lg text-ivory/75">{t("subheading")}</p>

        <div className="mt-2 flex flex-wrap items-center gap-3">
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-teal px-5 py-2.5 font-display text-sm font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5 hover:bg-teal-dark"
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden className="h-4 w-4">
              <rect x="3" y="4.5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
              <path d="M16 2.5v4M8 2.5v4M3 10h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            {t("bookAppointment")}
          </a>
          <Link
            href="/doctors"
            className="inline-flex items-center gap-2 rounded-full bg-ivory px-5 py-2.5 font-display text-sm font-semibold text-ink transition-colors hover:bg-white"
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
            className="inline-flex items-center gap-2 rounded-full border border-white/30 px-5 py-2.5 font-display text-sm font-semibold text-ivory transition-colors hover:bg-white/10"
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

        <div className="mt-4 grid grid-cols-2 gap-4 rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-xl sm:w-fit sm:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col">
              <p className="font-display text-2xl font-extrabold text-ivory">
                <AnimatedCounter value={stat.value} />
              </p>
              <p className="mt-0.5 text-xs leading-tight text-ivory/65">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-4">
          <p className="font-display text-xs font-semibold uppercase tracking-wide text-ivory/50">
            {tHero("followUs")}
          </p>
          <SocialLinks />
          <span aria-hidden className="hidden h-6 w-px bg-white/20 sm:block" />
          <p className="text-sm text-ivory/70">{tHero("youtubeLine")}</p>
        </div>
      </div>

      <HeroNetworkPanel />
    </section>
  );
}
