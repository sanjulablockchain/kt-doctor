import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { NetworkBrand } from "@/data/network";

type NetworkCardProps = {
  brand: NetworkBrand;
  compact?: boolean;
};

export function NetworkCard({ brand, compact = false }: NetworkCardProps) {
  const t = useTranslations("Network");
  const locale = useLocale();
  const tagline = locale === "es" ? brand.taglineEs : brand.tagline;
  const description = locale === "es" ? brand.descriptionEs : brand.description;
  const services = locale === "es" ? brand.servicesEs : brand.services;

  return (
    <div className="flex h-full flex-col items-center rounded-3xl border border-border bg-white p-6 text-center shadow-card transition-all hover:-translate-y-1 hover:shadow-soft">
      <div className="flex h-14 items-center justify-center">
        <Image
          src={brand.logoSrc}
          alt={`${brand.name} logo`}
          width={140}
          height={44}
          unoptimized
          className="h-full w-auto object-contain"
        />
      </div>

      <p className="mt-4 font-display text-lg font-bold text-ink">{brand.name}</p>

      {!compact && <p className="mt-1 text-sm font-semibold text-teal-dark">{tagline}</p>}

      <p className="mt-2 text-sm text-ink-soft">{description}</p>

      {!compact && (
        <div className="mt-4 flex flex-wrap justify-center gap-1.5">
          {services.map((service) => (
            <span
              key={service}
              className="rounded-full bg-teal-tint px-3 py-1 text-xs font-semibold text-teal-dark"
            >
              {service}
            </span>
          ))}
        </div>
      )}

      <div className="mt-auto pt-5">
        {brand.internalHref ? (
          <Link
            href={brand.internalHref}
            className="font-display font-semibold text-teal-dark hover:text-teal"
          >
            {t("browseDoctors")} →
          </Link>
        ) : (
          <a
            href={brand.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-display font-semibold text-teal-dark hover:text-teal"
          >
            {t("visitSite")} →
          </a>
        )}
      </div>
    </div>
  );
}
