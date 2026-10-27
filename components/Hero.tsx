"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { locations } from "@/data/locations";
import { doctors } from "@/data/doctors";
import { partners } from "@/data/partners";
import { networkBrands } from "@/data/network";
import { AFTER_HOURS_PHONE } from "@/lib/constants";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { BookAppointmentButton } from "@/components/BookAppointmentButton";
import { HeroNetworkPanel } from "@/components/HeroNetworkPanel";
import { HeroSlideshow } from "@/components/HeroSlideshow";
import { withBasePath } from "@/lib/basePath";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-tint focus-visible:ring-offset-2 focus-visible:ring-offset-navy";

function ArrowIcon({ diagonal = false, colorClass = "text-teal" }: { diagonal?: boolean; colorClass?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className={`h-3.5 w-3.5 shrink-0 ${colorClass} transition-transform group-hover:translate-x-0.5`}
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={diagonal ? "M7 17 17 7M9 7h8v8" : "M5 12h14m-6-6 6 6-6 6"} />
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

// Auto-scrolling logo strip. The track renders the logo set four times and
// slides by half its width (see `ktmg-marquee` in globals.css): two sets per
// half keeps each half wider than the 1216px container, so the loop never
// shows an empty gap on wide screens. Only the first set is exposed to
// assistive tech. The strip pauses on hover, and under reduced motion it stops
// and wraps into a static, centred row. Logos show in their brand colours, on
// a light band because most of them have dark lettering. They are the cropped
// marks, so the height is all logo, and the width cap keeps long wordmarks
// like Providence from outweighing the rest.
function PartnerMarquee() {
  const t = useTranslations("Home");

  return (
    <div className="relative border-b border-black/5 bg-white/95 backdrop-blur-lg">
      <div className="mx-auto max-w-7xl px-5 py-3.5 sm:px-8 lg:py-[clamp(0.625rem,1.8svh,1.125rem)]">
        <div className="overflow-hidden motion-safe:[mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
          <ul
            aria-label={t("partnersHeading")}
            className="flex w-max items-center gap-12 pr-12 animate-[ktmg-marquee_40s_linear_infinite] hover:[animation-play-state:paused] motion-reduce:w-full motion-reduce:animate-none motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-x-10 motion-reduce:gap-y-4 motion-reduce:pr-0 sm:gap-16 sm:pr-16"
          >
            {[0, 1, 2, 3].flatMap((copy) =>
              partners.map((partner) => (
                <li
                  key={`${copy}-${partner.id}`}
                  aria-hidden={copy > 0 || undefined}
                  className={copy > 0 ? "motion-reduce:hidden" : undefined}
                >
                  <Image
                    src={withBasePath(partner.markSrc)}
                    alt={copy > 0 ? "" : partner.name}
                    width={320}
                    height={100}
                    unoptimized
                    className="h-8 w-auto max-w-[8.5rem] object-contain sm:h-9 sm:max-w-[9.5rem] xl:h-10 xl:max-w-[10.5rem]"
                  />
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

type HeroCardProps = {
  imageSrc: string;
  imageAlt: string;
  badge?: ReactNode;
  title: string;
  body: ReactNode;
  // Renders the card's single call to action. Its `after:` overlay stretches
  // the hit area over the whole card, so the card reads as one target without
  // nesting the image and copy inside the link's accessible name.
  action: (className: string) => ReactNode;
};

const cardActionClass = `group mt-auto inline-flex w-fit items-center gap-1.5 pt-1 text-left font-display text-[13px] font-semibold text-teal-bright transition-colors hover:text-teal-tint after:absolute after:inset-0 after:content-[''] focus-visible:outline-none`;

// The photo takes the larger share of each stacked card (roughly 6:4 against
// the copy). Below `xl` it is width-driven via aspect ratio; at `xl` the
// columns are narrow, so the height follows the viewport instead, keeping the
// full share on tall screens and easing off on short laptops.
function HeroCard({ imageSrc, imageAlt, badge, title, body, action }: HeroCardProps) {
  return (
    <li className="relative flex overflow-hidden rounded-2xl border border-white/15 bg-white/[0.07] backdrop-blur-md transition-colors hover:border-teal/60 hover:bg-white/10 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-teal-tint sm:flex-col">
      <div className="relative w-36 shrink-0 sm:aspect-square sm:w-auto lg:aspect-[4/3] xl:aspect-auto xl:h-[clamp(9rem,25svh,15rem)]">
        <Image
          src={withBasePath(imageSrc)}
          alt={imageAlt}
          fill
          unoptimized
          sizes="(min-width: 640px) 320px, 144px"
          className="object-cover"
        />
        {badge}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1 p-3.5">
        <h2 className="font-display text-[15px] font-bold leading-tight text-ivory">{title}</h2>
        <p className="text-[13px] leading-snug text-ivory/75">{body}</p>
        {action(cardActionClass)}
      </div>
    </li>
  );
}

export function Hero() {
  const t = useTranslations("Home");

  const afterHours = networkBrands.find((b) => b.id === "pediatric-after-hour");
  if (!afterHours) throw new Error("Unknown network brand id: pediatric-after-hour");
  const afterHoursTel = `tel:+1${AFTER_HOURS_PHONE.replace(/\D/g, "")}`;

  const stats = [
    { label: t("statClinics"), value: `${locations.length}` },
    { label: t("statProviders"), value: `${doctors.length}+` },
    { label: t("statYears"), value: "18+" },
    { label: t("statAges"), value: "0-21" },
  ];

  return (
    // From `lg` up the hero is at least the screen left under the sticky
    // header, so tall monitors get no dead space and no next-section sliver.
    // `svh` (not `vh`) keeps that stable while mobile browser chrome collapses.
    <section
      data-on-navy
      className="relative flex flex-col overflow-hidden bg-navy lg:min-h-[calc(100svh-var(--header-h,4rem))]"
    >
      <HeroSlideshow />

      {/* Left-to-right fade for the two-column `xl` layout. Below `xl` the
          content runs the full width, so the right edge keeps more navy to
          hold text contrast over the photo. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-navy from-0% via-navy/80 via-40% to-navy/55 to-85% xl:to-navy/5"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-72 bg-gradient-to-b from-navy/0 to-navy/85"
      />

      <PartnerMarquee />

      {/* Padding and gaps are viewport-relative from `lg` up so the content
          tightens on short laptops, while `flex-1` + `xl:items-center` centre
          it in the slack on tall screens. The three cards need the width, so
          the network panel only moves beside the copy from `xl` (1280px). */}
      <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 gap-10 px-5 py-10 sm:px-8 sm:py-14 lg:flex-1 lg:py-[clamp(1rem,3.5svh,2.75rem)] xl:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] xl:items-center xl:gap-12">
        <div className="flex min-w-0 flex-col gap-5 lg:gap-[clamp(0.75rem,2.2svh,1.375rem)]">
          {/* Sized by the smaller of viewport height and width at `xl`:
              height keeps a 1366x768 laptop compact, width stops the headline
              from crowding the panel beside it. From `sm` the highlighted
              clause starts its own line. */}
          <h1 className="max-w-3xl font-display text-[2rem] font-extrabold leading-[1.06] tracking-tight text-ivory text-balance sm:text-5xl md:text-[3.25rem] xl:text-[clamp(2.25rem,min(6svh,4.2vw),3.5rem)]">
            {t("headingStart")}{" "}
            <span className="text-teal sm:block">{t("headingHighlight")}</span>
          </h1>

          <p className="max-w-xl text-[15px] leading-normal text-ivory/75 text-pretty sm:text-base">
            {t("subheading", { count: locations.length })}
          </p>

          <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6 sm:gap-y-3">
            <BookAppointmentButton
              className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-teal px-6 py-3.5 font-display text-[15px] font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5 hover:bg-teal-dark ${focusRing}`}
            >
              <svg viewBox="0 0 24 24" fill="none" aria-hidden className="h-4 w-4">
                <rect x="3" y="4.5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
                <path d="M16 2.5v4M8 2.5v4M3 10h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              {t("bookAppointment")}
            </BookAppointmentButton>
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

          {/* Stacked image-left rows on phones, three columns from `sm`. */}
          <ul className="mt-1 grid grid-cols-1 gap-3.5 sm:grid-cols-3 xl:max-w-[42.5rem]">
            <HeroCard
              imageSrc="/services/sick-visits.jpg"
              imageAlt={t("heroCardSameDayImageAlt")}
              badge={
                <span className="absolute left-2.5 top-2.5 inline-flex items-center gap-1.5 rounded-full bg-navy/85 px-2.5 py-1 font-display text-[10px] font-semibold uppercase tracking-[0.1em] text-teal-tint">
                  <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-teal" />
                  {t("heroCardSameDayBadge")}
                </span>
              }
              title={t("heroCardSameDayTitle")}
              body={t("heroCardSameDayBody", { count: locations.length })}
              action={(className) => (
                <BookAppointmentButton className={`cursor-pointer ${className}`}>
                  {t("heroCardSameDayCta")}
                  <ArrowIcon colorClass="text-current" />
                </BookAppointmentButton>
              )}
            />
            {/* Telehealth is booked like any other appointment type, so this
                card opens the same booking chooser rather than the info page. */}
            <HeroCard
              imageSrc="/services/telehealth.jpg"
              imageAlt={t("heroCardTelehealthImageAlt")}
              title={t("heroCardTelehealthTitle")}
              body={t("heroCardTelehealthBody")}
              action={(className) => (
                <BookAppointmentButton className={`cursor-pointer ${className}`}>
                  {t("heroCardTelehealthCta")}
                  <ArrowIcon colorClass="text-current" />
                </BookAppointmentButton>
              )}
            />
            <HeroCard
              imageSrc="/home/hero-slide-2.jpg"
              imageAlt={t("heroSlide2Alt")}
              badge={
                <Image
                  src={withBasePath(afterHours.logoSrc)}
                  alt={afterHours.name}
                  width={345}
                  height={88}
                  unoptimized
                  className="absolute left-2 top-2 h-6 w-auto rounded-md bg-white px-1.5 py-0.5 sm:left-2.5 sm:top-2.5 sm:h-7"
                />
              }
              title={t("heroCardAfterHoursTitle")}
              body={t.rich("heroCardAfterHoursBody", {
                phone: AFTER_HOURS_PHONE,
                // Sits above the card's stretched link so the number stays
                // tappable on its own.
                call: (chunks) => (
                  <a
                    href={afterHoursTel}
                    aria-label={t("afterHoursCallLabel", { phone: AFTER_HOURS_PHONE })}
                    className={`relative z-10 whitespace-nowrap rounded font-semibold text-ivory underline-offset-2 hover:underline ${focusRing}`}
                  >
                    {chunks}
                  </a>
                ),
              })}
              action={(className) => (
                <a href={afterHours.externalUrl} target="_blank" rel="noopener noreferrer" className={className}>
                  {/* One inline wrapper so the space before the hidden note
                      survives: as separate flex items it would be dropped
                      and the name would read "...now(opens...". */}
                  <span>
                    {t("afterHoursCta")} <span className="sr-only">{t("heroOpensInNewTab")}</span>
                  </span>
                  <ArrowIcon diagonal colorClass="text-current" />
                </a>
              )}
            />
          </ul>
        </div>

        <HeroNetworkPanel />
      </div>

      <div className="relative border-t border-white/10 bg-black/30 backdrop-blur-xl">
        <dl className="mx-auto grid max-w-7xl grid-cols-2 gap-y-5 px-5 py-5 sm:px-8 md:grid-cols-4 lg:py-[clamp(0.625rem,1.8svh,1.375rem)]">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col-reverse items-center px-3 text-center even:border-l even:border-white/15 md:border-l md:border-white/15 md:first:border-l-0"
            >
              <dt className="mt-0.5 text-[13px] leading-tight text-ivory/65">{stat.label}</dt>
              <dd className="font-display text-[1.75rem] font-extrabold leading-tight text-ivory sm:text-3xl lg:text-[clamp(1.5rem,3.6svh,1.875rem)]">
                <AnimatedCounter value={stat.value} />
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
