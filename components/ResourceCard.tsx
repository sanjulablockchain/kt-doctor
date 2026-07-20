import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { ParentResource } from "@/data/resources";

type ResourceCardProps = {
  resource: ParentResource;
  className?: string;
};

export function ResourceCard({ resource, className = "" }: ResourceCardProps) {
  const t = useTranslations("Resources");
  const locale = useLocale();
  const name = locale === "es" ? resource.nameEs : resource.name;
  const description = locale === "es" ? resource.descriptionEs : resource.description;

  return (
    <div className={`rounded-2xl border border-border bg-surface p-5 shadow-card transition-all hover:-translate-y-1 hover:shadow-soft ${className}`}>
      <p className="font-display text-base font-bold text-ink">{name}</p>
      <p className="mt-2 text-sm text-ink-soft">{description}</p>
      {resource.available && resource.href ? (
        resource.external ? (
          <a
            href={resource.href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block font-display text-sm font-semibold text-teal-dark hover:text-teal"
          >
            {name} →
          </a>
        ) : (
          <Link
            href={resource.href}
            className="mt-3 inline-block font-display text-sm font-semibold text-teal-dark hover:text-teal"
          >
            {name} →
          </Link>
        )
      ) : (
        <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-gold">
          {t("contactForCopy")}
        </p>
      )}
    </div>
  );
}
