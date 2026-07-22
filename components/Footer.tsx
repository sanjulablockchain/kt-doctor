import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  MAIN_PHONE,
  TEXT_PHONE,
  TEXT_PHONE_ES,
  GENERAL_EMAIL,
  BOOKING_URL,
} from "@/lib/constants";

// Formats a US display number like "(818) 361-5437" into E.164 for tel:/sms:
// links, e.g. "+18183615437".
function toE164(usPhone: string): string {
  return `+1${usPhone.replace(/\D/g, "")}`;
}

// Official channels — confirmed with the client. Icons are single-path brand
// glyphs on a 24×24 grid, filled with currentColor so the chip controls color.
const SOCIAL_LINKS = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/pediatriciansincalifornia/",
    path: "M24 12.073c0-6.627-5.373-12-12-12S0 5.446 0 12.073c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/napediatricurgentcare/",
    path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z",
  },
  {
    label: "X",
    href: "https://x.com/KTDoctorGroup",
    path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/channel/UCpc-umQeo6CQFLHq4bTWeUQ",
    path: "M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
  },
];

const contactLinkClass =
  "group flex items-start gap-3 rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-tint focus-visible:ring-offset-2 focus-visible:ring-offset-navy";

const iconChipClass =
  "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-teal/20 bg-teal/15 text-teal-tint transition-colors group-hover:bg-teal/25";

const navLinkClass =
  "inline-flex rounded text-sm text-ivory/75 transition-colors hover:text-teal-tint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-tint focus-visible:ring-offset-2 focus-visible:ring-offset-navy";

const headingClass =
  "font-display text-sm font-semibold uppercase tracking-[0.14em] text-teal-tint";

const microLabelClass =
  "text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-ivory/45";

export function Footer() {
  const t = useTranslations("Footer");
  const locale = useLocale();
  const textPhone = locale === "es" ? TEXT_PHONE_ES : TEXT_PHONE;

  const quickLinks = [
    { href: "/", label: t("home") },
    { href: "/about", label: t("aboutUs") },
    { href: "/network", label: t("network") },
    { href: "/foundation", label: t("foundation") },
    { href: "/careers", label: t("careers") },
    { href: "/blog", label: t("blog") },
    { href: "/privacy-policy", label: t("privacyPolicy") },
    { href: "/terms-and-conditions", label: t("termsAndConditions") },
  ] as const;

  const patientLinks = [
    { href: "/services/same-day-appointments", label: t("sameDayAppointments") },
    { href: "/services/telehealth", label: t("telehealth") },
    { href: "/doctors", label: t("doctors") },
    { href: "/services", label: t("services") },
    { href: "/locations", label: t("locations") },
    { href: "/insurance", label: t("insurance") },
    { href: "/resources", label: t("resources") },
    { href: "/testimonials", label: t("testimonials") },
  ] as const;

  return (
    <footer data-on-navy className="relative mt-16 overflow-hidden rounded-t-3xl bg-navy text-ivory sm:rounded-t-[3rem]">
      {/* Soft brand glow — keeps the large navy block from reading as a flat slab. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-28 -right-16 h-72 w-72 rounded-full bg-teal/15 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1.6fr]">
          {/* Brand + social */}
          <div className="max-w-sm sm:col-span-2 lg:col-span-1">
            <Image
              src="/footer-logo.png"
              alt="Kids & Teens Medical Group"
              width={300}
              height={262}
              className="h-16 w-auto"
              unoptimized
            />

            <p className="mt-3 font-display text-sm font-semibold text-gold">{t("highlight")}</p>
            <p className="mt-4 text-sm leading-relaxed text-ivory/70">{t("tagline")}</p>

            <div className="mt-7">
              <p className={microLabelClass}>{t("followUs")}</p>
              <ul className="mt-3 flex flex-wrap gap-2.5">
                {SOCIAL_LINKS.map((social) => (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/12 bg-white/5 text-ivory/75 transition-colors hover:border-teal hover:bg-teal hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-tint focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4.5 w-4.5">
                        <path d={social.path} />
                      </svg>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Quick links */}
          <nav aria-label={t("quickLinks")}>
            <h2 className={headingClass}>{t("quickLinks")}</h2>
            <ul className="mt-4 flex flex-col gap-2.5">
              {quickLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={navLinkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* For patients */}
          <nav aria-label={t("forPatients")}>
            <h2 className={headingClass}>{t("forPatients")}</h2>
            <ul className="mt-4 flex flex-col gap-2.5">
              {patientLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={navLinkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Get in touch */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h2 className={headingClass}>{t("getInTouch")}</h2>
            <ul className="mt-4 flex flex-col gap-4">
              <li>
                <a href={`tel:${toE164(MAIN_PHONE)}`} className={contactLinkClass}>
                  <span aria-hidden className={iconChipClass}>
                    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                      <path
                        d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.9 21 3 13.1 3 3.9c0-.6.4-1 1-1h4.4c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.6.1.4 0 .7-.2 1L6.6 10.8Z"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <span className="flex flex-col">
                    <span aria-hidden className={microLabelClass}>
                      {t("callLabel")}
                    </span>
                    <span className="font-semibold text-ivory group-hover:text-teal-tint">
                      {MAIN_PHONE}
                    </span>
                  </span>
                </a>
              </li>
              <li>
                <a href={`sms:${toE164(textPhone)}`} className={contactLinkClass}>
                  <span aria-hidden className={iconChipClass}>
                    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                      <path
                        d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H9l-4 4v-4.06A2.5 2.5 0 0 1 4 13.5v-8Z"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <span className="flex flex-col">
                    <span aria-hidden className={microLabelClass}>
                      {t("textLabel")}
                    </span>
                    <span className="text-ivory/85 group-hover:text-teal-tint">{textPhone}</span>
                  </span>
                </a>
              </li>
              <li>
                <a href={`mailto:${GENERAL_EMAIL}`} className={contactLinkClass}>
                  <span aria-hidden className={iconChipClass}>
                    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                      <path
                        d="M4 6.5A1.5 1.5 0 0 1 5.5 5h13A1.5 1.5 0 0 1 20 6.5v11a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 17.5v-11Z"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinejoin="round"
                      />
                      <path
                        d="m4.5 6.5 7.5 6 7.5-6"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <span className="flex min-w-0 flex-col">
                    <span aria-hidden className={microLabelClass}>
                      {t("emailLabel")}
                    </span>
                    <span className="break-all text-ivory/85 group-hover:text-teal-tint">
                      {GENERAL_EMAIL}
                    </span>
                  </span>
                </a>
              </li>
            </ul>

            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex w-fit items-center rounded-full bg-teal px-5 py-2.5 font-display text-sm font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5 hover:bg-teal-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-tint focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
            >
              {t("bookAppointment")}
            </a>
          </div>
        </div>
      </div>

      <div className="relative border-t border-white/10 px-5 py-5 text-center text-xs text-ivory/50 sm:px-8">
        © {new Date().getFullYear()} Kids &amp; Teens Medical Group. {t("rights")}
      </div>
    </footer>
  );
}
