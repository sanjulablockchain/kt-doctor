"use client";

import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { BOOKING_URL } from "@/lib/constants";
import { networkBrands } from "@/data/network";
import { serviceCategories } from "@/data/services";
import { locations } from "@/data/locations";
import { SocialLinks } from "@/components/SocialLinks";

type HeroRowProps = {
  icon: ReactNode; // inner <path>/<rect>/<circle> of a 24x24 stroke icon
  title: string;
  body: string;
  tag: string;
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
      <span className={`shrink-0 pl-2 text-xs font-semibold ${tagClassName ?? "text-ivory/60"}`}>
        {tag}
      </span>
    </>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={rowClass}>
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

export function HeroNetworkPanel() {
  const tHome = useTranslations("Home");
  const t = useTranslations("Hero");

  const partnerCount = networkBrands.length - 1;
  const serviceCount = serviceCategories.flatMap((category) => category.services).length;

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
        </li>
        <li>
          <HeroRow
            href="/services"
            tag={String(serviceCount)}
            title={t("servicesTile")}
            body={t("servicesBody")}
            icon={<path d="m9 12 2 2 4-4M12 22s7-4 7-10V5l-7-3-7 3v7c0 6 7 10 7 10Z" />}
          />
        </li>
        <li>
          <HeroRow
            href="/services/telehealth"
            tag={t("telehealthTag")}
            tagClassName="text-teal"
            title={t("telehealthTile")}
            body={t("telehealthBody")}
            icon={
              <>
                <rect x="2.5" y="5" width="14" height="12" rx="2.5" />
                <path d="M16.5 10.5 21.5 7.5v9l-5-3z" />
              </>
            }
          />
        </li>
        <li>
          <HeroRow
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
