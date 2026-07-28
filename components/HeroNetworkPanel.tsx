"use client";

import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { BOOKING_URL } from "@/lib/constants";
import { networkBrands } from "@/data/network";
import { serviceCategories } from "@/data/services";
import { locations } from "@/data/locations";

type HeroTileProps = {
  icon: ReactNode; // inner <path>/<rect>/<circle> of a 24x24 stroke icon
  tag?: string;
  title: string;
  body: string;
  href: string;
  external?: boolean;
};

const tileClass =
  "flex flex-col rounded-2xl bg-white/5 p-4 transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-tint focus-visible:ring-offset-2 focus-visible:ring-offset-navy";

function HeroTile({ icon, tag, title, body, href, external = false }: HeroTileProps) {
  const content = (
    <>
      <div className="flex items-center justify-between">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal/15 text-teal">
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
        {tag && (
          <span className="rounded-full bg-white/12 px-2.5 py-1 text-[11px] font-semibold text-ivory/70">
            {tag}
          </span>
        )}
      </div>
      <p className="mt-3 font-display text-sm font-bold text-ivory">{title}</p>
      <p className="mt-1 text-xs leading-snug text-ivory/65">{body}</p>
    </>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={tileClass}>
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={tileClass}>
      {content}
    </Link>
  );
}

export function HeroNetworkPanel() {
  const tHome = useTranslations("Home");
  const t = useTranslations("Hero");

  const partnerCount = networkBrands.length - 1;
  const serviceCount = serviceCategories.flatMap((category) => category.services).length;

  return (
    <div className="relative mx-auto mt-6 mb-6 max-w-7xl px-5 sm:mb-8 sm:px-8 lg:-mt-6 xl:-mt-8">
      <div className="rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur-xl sm:p-6">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-white/15 pb-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-display text-xs font-semibold uppercase tracking-[0.14em] text-teal">
                {tHome("networkEyebrow")}
              </p>
              <span className="rounded-full border border-teal/25 bg-teal/10 px-2.5 py-0.5 text-[11px] font-semibold text-teal">
                {t("networkPartnerCount", { count: partnerCount })}
              </span>
            </div>
            <p className="mt-1 font-display text-lg font-bold text-ivory sm:text-xl">
              {tHome("networkHeading")}
            </p>
          </div>
          <Link
            href="/network"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 font-display text-sm font-semibold text-ivory transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-tint focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
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

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <HeroTile
            href={BOOKING_URL}
            external
            tag={t("bookAppointmentTag")}
            title={t("bookAppointmentTile")}
            body={t("bookAppointmentBody")}
            icon={
              <>
                <rect x="3" y="4.5" width="18" height="16" rx="2" />
                <path d="M16 2.5v4M8 2.5v4M3 10h18" />
              </>
            }
          />
          <HeroTile
            href="/network"
            tag={String(partnerCount)}
            title={t("supportingNetworkTile")}
            body={t("supportingNetworkBody", { count: partnerCount })}
            icon={
              <>
                <circle cx="12" cy="12" r="3" />
                <circle cx="5" cy="6" r="2.2" />
                <circle cx="19" cy="6" r="2.2" />
                <circle cx="5" cy="18" r="2.2" />
                <circle cx="19" cy="18" r="2.2" />
                <path d="M6.6 7.4 10 10.4M17.4 7.4 14 10.4M6.6 16.6 10 13.6M17.4 16.6 14 13.6" />
              </>
            }
          />
          <HeroTile
            href="/services"
            tag={String(serviceCount)}
            title={t("servicesTile")}
            body={t("servicesBody")}
            icon={
              <path d="m9 12 2 2 4-4M12 22s7-4 7-10V5l-7-3-7 3v7c0 6 7 10 7 10Z" />
            }
          />
          <HeroTile
            href="/services/telehealth"
            tag={t("telehealthTag")}
            title={t("telehealthTile")}
            body={t("telehealthBody")}
            icon={
              <>
                <rect x="2.5" y="5" width="14" height="12" rx="2.5" />
                <path d="M16.5 10.5 21.5 7.5v9l-5-3z" />
              </>
            }
          />
          <HeroTile
            href="/locations"
            tag={String(locations.length)}
            title={t("locationsTile")}
            body={t("locationsBody")}
            icon={
              <>
                <path d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12Z" />
                <circle cx="12" cy="9" r="2.25" />
              </>
            }
          />
          <HeroTile
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
        </div>
      </div>
    </div>
  );
}
