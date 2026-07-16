import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { MAIN_PHONE, TEXT_PHONE, TEXT_PHONE_ES, GENERAL_EMAIL } from "@/lib/constants";

// Formats a US display number like "(818) 361-5437" into E.164 for tel:/sms:
// links, e.g. "+18183615437".
function toE164(usPhone: string): string {
  return `+1${usPhone.replace(/\D/g, "")}`;
}

export function Footer() {
  const t = useTranslations("Footer");
  const locale = useLocale();
  const textPhone = locale === "es" ? TEXT_PHONE_ES : TEXT_PHONE;

  return (
    <footer className="mt-16 bg-navy text-ivory">
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

          <div className="mt-6 flex flex-col gap-2 text-sm">
            <a
              href={`tel:${toE164(MAIN_PHONE)}`}
              className="font-semibold text-ivory hover:text-teal-tint"
            >
              {MAIN_PHONE}
            </a>
            <a href={`sms:${toE164(textPhone)}`} className="text-ivory/70 hover:text-ivory">
              {t("textLabel")}: {textPhone}
            </a>
            <a href={`mailto:${GENERAL_EMAIL}`} className="text-ivory/70 hover:text-ivory">
              {GENERAL_EMAIL}
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-8 sm:flex-row sm:gap-10">
          <div>
            <p className="font-display text-sm font-semibold uppercase tracking-wide text-teal-tint">
              {t("patients")}
            </p>
            <ul className="mt-4 flex flex-col gap-2 text-sm text-ivory/80">
              <li>
                <Link href="/doctors" className="hover:text-ivory">
                  {t("doctors")}
                </Link>
              </li>
              <li>
                <Link href="/locations" className="hover:text-ivory">
                  {t("locations")}
                </Link>
              </li>
              <li>
                <Link href="/insurance" className="hover:text-ivory">
                  {t("insurance")}
                </Link>
              </li>
              <li>
                <Link href="/resources" className="hover:text-ivory">
                  {t("resources")}
                </Link>
              </li>
              <li>
                <Link href="/testimonials" className="hover:text-ivory">
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
                <Link href="/about" className="hover:text-ivory">
                  {t("aboutUs")}
                </Link>
              </li>
              <li>
                <Link href="/network" className="hover:text-ivory">
                  {t("network")}
                </Link>
              </li>
              <li>
                <Link href="/foundation" className="hover:text-ivory">
                  {t("foundation")}
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-ivory">
                  {t("careers")}
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 px-5 py-5 text-center text-xs text-ivory/50 sm:px-8">
        © {new Date().getFullYear()} Kids &amp; Teens Medical Group. {t("rights")}
      </div>
    </footer>
  );
}
