"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { networkBrands } from "@/data/network";
import { BookAppointmentButton } from "@/components/BookAppointmentButton";
import { ArrowIcon, focusRing } from "@/components/heroShared";
import { withBasePath } from "@/lib/basePath";

function findBrand(id: string) {
  const brand = networkBrands.find((b) => b.id === id);
  if (!brand?.externalUrl) throw new Error(`Unknown network brand id or missing URL: ${id}`);
  return { ...brand, externalUrl: brand.externalUrl };
}

type ReasonTileProps = {
  icon: ReactNode; // inner <path>/<rect>/<circle> of a 24x24 stroke icon
  title: string;
  body: ReactNode;
} & ({ href: string; external?: false } | { href: string; external: true; newTabNote: string });

// The title is the tile's link; its `after:` overlay stretches the hit area
// over the whole tile (the same pattern as the slide 1 cards).
const tileLinkClass =
  "after:absolute after:inset-0 after:content-[''] focus-visible:outline-none";

function ReasonTile(props: ReasonTileProps) {
  const { icon, title, body, href } = props;
  return (
    <li className="hero-fade group relative flex gap-3.5 rounded-2xl border border-white/15 bg-white/[0.07] p-4 backdrop-blur-md transition-colors hover:border-teal/60 hover:bg-white/10 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-teal-tint sm:flex-col sm:gap-3 sm:p-5 xl:p-[clamp(0.875rem,2.2svh,1.25rem)]">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal/15 text-teal-bright">
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
          {icon}
        </svg>
      </span>
      <div className="flex min-w-0 flex-col gap-1">
        <h3 className="font-display text-base font-bold leading-snug text-ivory">
          {props.external ? (
            <a href={href} target="_blank" rel="noopener noreferrer" className={tileLinkClass}>
              {/* One inline wrapper keeps the space before the hidden note. */}
              <span>
                {title} <span className="sr-only">{props.newTabNote}</span>
              </span>
            </a>
          ) : (
            <Link href={href} className={tileLinkClass}>
              {title}
            </Link>
          )}
        </h3>
        <p className="text-[13px] leading-snug text-ivory/75">{body}</p>
      </div>
    </li>
  );
}

// Slide 2 of the hero: why families pick Kids & Teens over a typical
// pediatric office. Leads with the USC partnership, then four reasons, each
// linking to where a parent can act on it.
export function HeroWhySlide() {
  const t = useTranslations("Home");
  const serendib = findBrand("serendib-healthways");
  const laipt = findBrand("laipt");
  const newTabNote = t("heroOpensInNewTab");

  return (
    <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] xl:items-center xl:gap-12">
      {/* `hero-fade` blocks fade with the slide (see HeroCarousel). This
          column has no blurred glass, so it fades as one block. */}
      <div className="hero-fade flex min-w-0 flex-col gap-5 lg:gap-[clamp(0.75rem,2.2svh,1.375rem)]">
        <div className="flex flex-wrap items-center gap-3">
          <Image
            src={withBasePath("/partners/usc.png")}
            alt={t("whyUscLogoAlt")}
            width={177}
            height={68}
            unoptimized
            className="h-8 w-auto sm:h-9"
          />
          <span className="font-display text-[11px] font-semibold uppercase tracking-[0.14em] text-gold sm:text-xs">
            {t("whyUscPartner")}
          </span>
        </div>

        <h2 className="font-display text-4xl font-extrabold leading-[1.04] tracking-tight text-ivory sm:text-5xl md:text-6xl xl:text-[clamp(2.5rem,min(7svh,4.5vw),3.75rem)]">
          {t("whyHeadingStart")}{" "}
          <span className="text-teal sm:block">{t("whyHeadingHighlight")}</span>
        </h2>

        <p className="max-w-md text-[15px] leading-normal text-ivory/75 text-pretty sm:text-base">
          {t("whyBody")}
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
          <Link
            href="/insurance"
            className={`group inline-flex items-center gap-1.5 rounded font-display text-sm font-semibold text-ivory/85 transition-colors hover:text-ivory ${focusRing}`}
          >
            {t("seeAcceptedInsurance")}
            <ArrowIcon />
          </Link>
        </div>
      </div>

      <ul className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
        <ReasonTile
          href="/insurance"
          title={t("whyInsuranceTitle")}
          body={t("whyInsuranceBody")}
          icon={
            <>
              <path d="M12 21s7-3.6 7-9V6l-7-3-7 3v6c0 5.4 7 9 7 9Z" />
              <path d="m9 12 2 2 4-4" />
            </>
          }
        />
        <ReasonTile
          href={serendib.externalUrl}
          external
          newTabNote={newTabNote}
          title={t("whyIpaTitle")}
          body={t("whyIpaBody", { ipa: serendib.name })}
          icon={
            <>
              <circle cx="12" cy="5" r="2" />
              <circle cx="5" cy="19" r="2" />
              <circle cx="19" cy="19" r="2" />
              <path d="M12 7v5m0 0-5.5 5.5M12 12l5.5 5.5" />
            </>
          }
        />
        <ReasonTile
          href={laipt.externalUrl}
          external
          newTabNote={newTabNote}
          title={t("whyTherapyTitle")}
          body={t("whyTherapyBody", { center: laipt.name })}
          icon={
            <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" />
          }
        />
        <ReasonTile
          href="/services/telehealth"
          title={t("whyTelehealthTitle")}
          body={t.rich("whyTelehealthBody", {
            stat: (chunks) => <strong className="font-bold text-teal-bright">{chunks}</strong>,
          })}
          icon={
            <>
              <rect x="3" y="5" width="13" height="12" rx="2" />
              <path d="m16 10 5-3v10l-5-3" />
            </>
          }
        />
      </ul>
    </div>
  );
}
