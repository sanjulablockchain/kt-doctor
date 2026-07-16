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

const contactLinkClass =
  "group flex items-center gap-3 text-sm transition-colors";

const iconChipClass =
  "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-teal/20 bg-teal/15 text-teal-tint transition-colors group-hover:bg-teal/25";

const navLinkClass = "transition-colors hover:text-teal-tint";

export function Footer() {
  const t = useTranslations("Footer");
  const locale = useLocale();
  const textPhone = locale === "es" ? TEXT_PHONE_ES : TEXT_PHONE;

  return (
    <footer className="mt-16 rounded-t-3xl bg-navy text-ivory sm:rounded-t-[3rem]">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-5 py-14 sm:flex-row sm:justify-between sm:px-8">
        <div className="max-w-sm">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-ivory p-1.5">
              <Image
                src="/clinic-logo.svg"
                alt="Kids & Teens Medical Group"
                width={36}
                height={11}
                className="h-full w-auto"
                unoptimized
              />
            </span>
            <p className="font-display text-lg font-bold">Kids &amp; Teens Medical Group</p>
          </div>
          <p className="mt-4 text-sm text-ivory/70">{t("tagline")}</p>

          <div className="mt-6 flex flex-col gap-3">
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
              <span className="font-semibold text-ivory group-hover:text-teal-tint">
                {MAIN_PHONE}
              </span>
            </a>
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
              <span className="text-ivory/70 group-hover:text-teal-tint">
                {t("textLabel")}: {textPhone}
              </span>
            </a>
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
              <span className="text-ivory/70 group-hover:text-teal-tint">{GENERAL_EMAIL}</span>
            </a>
          </div>

          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex w-fit items-center rounded-full bg-teal px-5 py-2.5 font-display text-sm font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5 hover:bg-teal-dark"
          >
            {t("bookAppointment")}
          </a>
        </div>

        <div className="flex flex-col gap-8 sm:flex-row sm:gap-10">
          <div>
            <p className="font-display text-sm font-semibold uppercase tracking-wide text-teal-tint">
              {t("patients")}
            </p>
            <ul className="mt-4 flex flex-col gap-2 text-sm text-ivory/80">
              <li>
                <Link href="/doctors" className={navLinkClass}>
                  {t("doctors")}
                </Link>
              </li>
              <li>
                <Link href="/locations" className={navLinkClass}>
                  {t("locations")}
                </Link>
              </li>
              <li>
                <Link href="/insurance" className={navLinkClass}>
                  {t("insurance")}
                </Link>
              </li>
              <li>
                <Link href="/resources" className={navLinkClass}>
                  {t("resources")}
                </Link>
              </li>
              <li>
                <Link href="/testimonials" className={navLinkClass}>
                  {t("testimonials")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="font-display text-sm font-semibold uppercase tracking-wide text-teal-tint">
              {t("about")}
            </p>
            <ul className="mt-4 flex flex-col gap-2 text-sm text-ivory/80">
              <li>
                <Link href="/about" className={navLinkClass}>
                  {t("aboutUs")}
                </Link>
              </li>
              <li>
                <Link href="/network" className={navLinkClass}>
                  {t("network")}
                </Link>
              </li>
              <li>
                <Link href="/foundation" className={navLinkClass}>
                  {t("foundation")}
                </Link>
              </li>
              <li>
                <Link href="/careers" className={navLinkClass}>
                  {t("careers")}
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-teal/15 px-5 py-5 text-center text-xs text-ivory/50 sm:px-8">
        © {new Date().getFullYear()} Kids &amp; Teens Medical Group. {t("rights")}
      </div>
    </footer>
  );
}
