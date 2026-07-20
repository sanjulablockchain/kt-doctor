import Image from "next/image";
import { Doctor } from "@/lib/types";
import { BOOKING_URL } from "@/lib/constants";
import { Link } from "@/i18n/navigation";

type DoctorCardProps = {
  doctor: Doctor;
  locationNames: string[];
};

function initials(name: string): string {
  return name
    .replace(/^Dr\.\s*/i, "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export function DoctorCard({ doctor, locationNames }: DoctorCardProps) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-3xl bg-surface shadow-card transition-all hover:-translate-y-1 hover:shadow-soft">
      <div className="h-20 shrink-0 bg-teal" />

      <div className="flex flex-1 flex-col items-center px-6 pb-6 text-center">
        <div className="-mt-12 shrink-0">
          {doctor.photoSrc ? (
            <Image
              src={doctor.photoSrc}
              alt={doctor.name}
              width={96}
              height={96}
              className="h-24 w-24 rounded-full object-cover shadow-card ring-4 ring-surface"
            />
          ) : (
            <div
              aria-hidden
              className="flex h-24 w-24 items-center justify-center rounded-full bg-teal-tint font-display text-2xl font-bold text-teal-dark shadow-card ring-4 ring-surface"
            >
              {initials(doctor.name)}
            </div>
          )}
        </div>

        <h3 className="mt-3 font-display text-lg font-bold leading-tight text-ink">
          <Link href={`/doctors/${doctor.id}`} className="hover:text-teal-dark">
            {doctor.name}
          </Link>
        </h3>
        <p className="text-sm font-semibold text-teal-dark">{doctor.credentials}</p>

        <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5">
          {doctor.specialties.map((s) => (
            <span
              key={s}
              className="rounded-full bg-gold-tint px-3 py-1 text-xs font-semibold text-gold"
            >
              {s}
            </span>
          ))}
        </div>

        <span className="mt-2 mb-4 flex items-center gap-1 text-sm text-ink-soft">
          <svg aria-hidden viewBox="0 0 24 24" fill="none" className="h-4 w-4 shrink-0">
            <path
              d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12Z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
            <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.8" />
          </svg>
          {locationNames.join(", ")}
        </span>

        <a
          href={doctor.healowUrl ?? BOOKING_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto flex w-full items-center justify-center gap-1.5 rounded-full bg-teal px-5 py-2.5 font-display text-sm font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5 hover:bg-teal-dark"
        >
          Book Online
          <svg aria-hidden viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5">
            <path
              d="M5 12h14M13 6l6 6-6 6"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      </div>
    </div>
  );
}
