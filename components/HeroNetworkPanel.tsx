"use client";

import type { ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { BOOKING_URL } from "@/lib/constants";
import { networkBrands } from "@/data/network";
import { SocialLinks } from "@/components/SocialLinks";

type HeroRowProps = {
  icon: ReactNode; // inner <path>/<rect>/<circle> of a 24x24 stroke icon
  title: string;
  body: string;
  tag?: string;
  tagClassName?: string;
  href: string;
  external?: boolean;
};

const rowClass =
  "-mx-2 flex items-center gap-3 rounded-xl px-2 py-3 transition-colors hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-tint focus-visible:ring-offset-2 focus-visible:ring-offset-navy";

function HeroRow({ icon, title, body, tag, tagClassName, href, external = false }: HeroRowProps) {
  const content = (
    <>
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-ivory">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden
          className="h-4.5 w-4.5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {icon}
        </svg>
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-display text-sm font-bold text-ivory">{title}</span>
        <span className="block truncate text-xs text-ivory/60">{body}</span>
      </span>
      {tag && (
        <span className={`shrink-0 pl-2 text-xs font-semibold ${tagClassName ?? "text-ivory/60"}`}>
          {tag}
        </span>
      )}
    </>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={rowClass}>
        {content}
      </a>
    );
  }

  if (href.startsWith("#")) {
    return (
      <a
        href={href}
        onClick={(e) => {
          e.preventDefault();
          document.getElementById(href.slice(1))?.scrollIntoView({ behavior: "smooth", block: "start" });
        }}
        className={rowClass}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={rowClass}>
      {content}
    </Link>
  );
}

function findBrand(id: string) {
  const brand = networkBrands.find((b) => b.id === id);
  if (!brand) throw new Error(`Unknown network brand id: ${id}`);
  return brand;
}

export function HeroNetworkPanel() {
  const tHome = useTranslations("Home");
  const t = useTranslations("Hero");
  const locale = useLocale();

  const partnerCount = networkBrands.length - 1;

  const stGianna = findBrand("st-gianna");
  const laipt = findBrand("laipt");
  const serendibHealthways = findBrand("serendib-healthways");
  const pediatricAfterHour = findBrand("pediatric-after-hour");

  return (
    <div className="min-w-0 w-full rounded-3xl border border-white/10 bg-navy/75 p-5 backdrop-blur-xl sm:p-6 lg:max-w-md lg:ml-auto">
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center rounded-full border border-teal/30 bg-teal/10 px-3 py-1 font-display text-[11px] font-semibold uppercase tracking-[0.14em] text-teal">
          {tHome("networkEyebrow")}
        </span>
        <span className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-ivory/70">
          {t("networkPartnerCount", { count: partnerCount })}
        </span>
      </div>

      <p className="mt-3 font-display text-lg font-bold text-ivory sm:text-xl">
        {tHome("networkHeading")}
      </p>

      <ul className="mt-4 divide-y divide-white/10 border-t border-white/15">
        <li>
          <HeroRow
            href={BOOKING_URL}
            external
            tag={t("bookAppointmentTag")}
            tagClassName="text-teal"
            title={t("bookAppointmentTile")}
            body={t("bookAppointmentBody")}
            icon={
              <>
                <rect x="3" y="4.5" width="18" height="16" rx="2" />
                <path d="M16 2.5v4M8 2.5v4M3 10h18" />
              </>
            }
          />
        </li>
        <li>
          <HeroRow
            href="#network-teaser"
            title={stGianna.name}
            body={locale === "es" ? stGianna.taglineEs : stGianna.tagline}
            icon={
              <>
                <rect x="4" y="4" width="16" height="16" rx="4" />
                <path d="M12 8.5v7M8.5 12h7" />
              </>
            }
          />
        </li>
        <li>
          <HeroRow
            href="#network-teaser"
            title={laipt.name}
            body={locale === "es" ? laipt.taglineEs : laipt.tagline}
            icon={
              <>
                <rect x="4" y="13" width="6.5" height="6.5" rx="1" />
                <rect x="13.5" y="13" width="6.5" height="6.5" rx="1" />
                <rect x="8.75" y="4.5" width="6.5" height="6.5" rx="1" />
              </>
            }
          />
        </li>
        <li>
          <HeroRow
            href="#network-teaser"
            title={serendibHealthways.name}
            body={locale === "es" ? serendibHealthways.taglineEs : serendibHealthways.tagline}
            icon={
              <>
                <path d="M12 21s7-3.6 7-9V6l-7-3-7 3v6c0 5.4 7 9 7 9Z" />
                <path d="M12 14.8s-3.3-2-3.3-4.4A1.8 1.8 0 0 1 12 9.2a1.8 1.8 0 0 1 3.3 1.2c0 2.4-3.3 4.4-3.3 4.4Z" />
              </>
            }
          />
        </li>
        <li>
          <HeroRow
            href="#network-teaser"
            title={pediatricAfterHour.name}
            body={locale === "es" ? pediatricAfterHour.taglineEs : pediatricAfterHour.tagline}
            icon={
              <>
                <circle cx="12" cy="12" r="8.5" />
                <path d="M12 7.5V12l3.2 2" />
              </>
            }
          />
        </li>
        <li>
          <HeroRow
            href="/foundation"
            tag={t("sriLankaTag")}
            title={t("sriLankaTile")}
            body={t("sriLankaBody")}
            icon={
              <>
                <circle cx="12" cy="12" r="9" />
                <path d="M3 12h18M12 3c2.6 2.4 2.6 15.2 0 18M12 3c-2.6 2.4-2.6 15.2 0 18" />
              </>
            }
          />
        </li>
      </ul>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-white/15 pt-4">
        <SocialLinks />
        <Link
          href="/network"
          className="inline-flex items-center gap-1.5 font-display text-sm font-semibold text-teal transition-colors hover:text-teal-tint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-tint focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
        >
          {t("exploreNetwork")}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden
            className="h-3.5 w-3.5"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14m-6-6 6 6-6 6" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
