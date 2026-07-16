import { Link } from "@/i18n/navigation";
import type { Service } from "@/data/services";

type ServiceCardProps = {
  service: Service;
};

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <Link
      href={`/services/${service.id}`}
      className="block rounded-2xl border border-border bg-white p-5 shadow-card transition-all hover:-translate-y-1 hover:shadow-soft"
    >
      <p className="font-display text-base font-bold text-ink">{service.name}</p>
      <p className="mt-2 text-sm text-ink-soft">{service.description}</p>
    </Link>
  );
}
