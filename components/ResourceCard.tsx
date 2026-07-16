import { Link } from "@/i18n/navigation";
import type { ParentResource } from "@/data/resources";

type ResourceCardProps = {
  resource: ParentResource;
};

export function ResourceCard({ resource }: ResourceCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-white p-5 shadow-card transition-all hover:-translate-y-1 hover:shadow-soft">
      <p className="font-display text-base font-bold text-ink">{resource.name}</p>
      <p className="mt-2 text-sm text-ink-soft">{resource.description}</p>
      {resource.available && resource.href ? (
        resource.external ? (
          <a
            href={resource.href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block font-display text-sm font-semibold text-teal-dark hover:text-teal"
          >
            {resource.name} →
          </a>
        ) : (
          <Link
            href={resource.href}
            className="mt-3 inline-block font-display text-sm font-semibold text-teal-dark hover:text-teal"
          >
            {resource.name} →
          </Link>
        )
      ) : (
        <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-gold">
          Contact us for a copy
        </p>
      )}
    </div>
  );
}
