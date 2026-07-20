import { Location } from "@/lib/types";
import { Link } from "@/i18n/navigation";

type LocationCardProps = {
  location: Location;
};

export function LocationCard({ location }: LocationCardProps) {
  return (
    <Link
      href={`/locations/${location.id}`}
      aria-label={location.name}
      className="group block rounded-3xl border border-border bg-surface p-6 shadow-card transition-all hover:-translate-y-1 hover:shadow-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal"
    >
      <div className="flex items-center gap-3">
        <span
          aria-hidden
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-teal-tint text-teal-dark"
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
            <path
              d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12Z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
            <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.8" />
          </svg>
        </span>
        <h3 className="font-display text-lg font-bold text-ink transition-colors group-hover:text-teal-dark">
          {location.name}
        </h3>
      </div>
      <p className="mt-3 text-sm text-ink-soft">{location.address}</p>
      <p className="mt-2 font-display text-sm font-semibold text-ink">{location.phone}</p>
      <p className="mt-1 text-sm text-ink-soft">{location.email}</p>
    </Link>
  );
}
