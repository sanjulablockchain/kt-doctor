import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { NetworkBrand } from "@/data/network";

type NetworkCardProps = {
  brand: NetworkBrand;
  compact?: boolean;
};

export function NetworkCard({ brand, compact = false }: NetworkCardProps) {
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

      {!compact && (
        <p className="mt-1 text-sm font-semibold text-teal-dark">{brand.tagline}</p>
      )}

      <p className="mt-2 text-sm text-ink-soft">{brand.description}</p>

      {!compact && (
        <div className="mt-4 flex flex-wrap justify-center gap-1.5">
          {brand.services.map((service) => (
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
            Browse doctors →
          </Link>
        ) : (
          <a
            href={brand.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-display font-semibold text-teal-dark hover:text-teal"
          >
            Visit site →
          </a>
        )}

        {brand.partnerCredit && (
          <a
            href={brand.partnerCredit.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 block text-xs text-ink-soft underline-offset-2 hover:text-teal-dark hover:underline"
          >
            {brand.partnerCredit.label}
          </a>
        )}
      </div>
    </div>
  );
}
