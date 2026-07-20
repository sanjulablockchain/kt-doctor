import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Service } from "@/data/services";

type ServiceCardProps = {
  service: Service;
};

export function ServiceCard({ service }: ServiceCardProps) {
  const locale = useLocale();
  const name = locale === "es" ? service.nameEs : service.name;
  const description = locale === "es" ? service.descriptionEs : service.description;

  return (
    <Link
      href={`/services/${service.id}`}
      className="block rounded-2xl border border-border bg-surface p-5 shadow-card transition-all hover:-translate-y-1 hover:shadow-soft"
    >
      <p className="font-display text-base font-bold text-ink">{name}</p>
      <p className="mt-2 text-sm text-ink-soft">{description}</p>
    </Link>
  );
}
