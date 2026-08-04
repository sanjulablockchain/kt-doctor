import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { SocialLinks } from "@/components/SocialLinks";
import {
  MAIN_PHONE,
  TEXT_PHONE,
  TEXT_PHONE_ES,
  GENERAL_EMAIL,
  BOOKING_URL,
  PATIENT_PORTAL_URL,
} from "@/lib/constants";
import { withBasePath } from "@/lib/basePath";

// Formats a US display number like "(818) 361-5437" into E.164 for tel:/sms:
// links, e.g. "+18183615437".
function toE164(usPhone: string): string {
  return `+1${usPhone.replace(/\D/g, "")}`;
}

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
    { href: "/contact", label: t("contact") },
    { href: "/blog", label: t("blog") },
    { href: "/privacy-policy", label: t("privacyPolicy") },
    { href: "/terms-and-conditions", label: t("termsAndConditions") },
  ] as const;

  const patientLinks = [
    { href: "/services/same-day-appointments", label: t("sameDayAppointments"), external: false },
    { href: "/services/telehealth", label: t("telehealth"), external: false },
    { href: "/doctors", label: t("doctors"), external: false },
    { href: "/services", label: t("services"), external: false },
    { href: "/locations", label: t("locations"), external: false },
    { href: "/insurance", label: t("insurance"), external: false },
    { href: "/resources", label: t("resources"), external: false },
    { href: "/testimonials", label: t("testimonials"), external: false },
    { href: PATIENT_PORTAL_URL, label: t("patientPortal"), external: true },
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
              src={withBasePath("/footer-logo.png")}
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
              <div className="mt-3">
                <SocialLinks />
              </div>
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
              {patientLinks.map((item) =>
                item.external ? (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={navLinkClass}
                    >
                      {item.label}
                    </a>
                  </li>
                ) : (
                  <li key={item.href}>
                    <Link href={item.href} className={navLinkClass}>
                      {item.label}
                    </Link>
                  </li>
                )
              )}
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
