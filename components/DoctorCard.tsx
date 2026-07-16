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
    <div className="flex h-full flex-col rounded-3xl border border-border bg-white p-6 shadow-card transition-all hover:-translate-y-1 hover:shadow-soft">
      <div className="flex items-start gap-4">
        {doctor.photoSrc ? (
          <Image
            src={doctor.photoSrc}
            alt={doctor.name}
            width={56}
            height={56}
            className="h-14 w-14 shrink-0 rounded-2xl object-cover"
          />
        ) : (
          <div
            aria-hidden
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-teal-tint font-display text-lg font-bold text-teal-dark"
          >
            {initials(doctor.name)}
          </div>
        )}
        <div>
          <h3 className="font-display text-lg font-bold leading-tight text-ink">
            <Link href={`/doctors/${doctor.id}`} className="hover:text-teal-dark">
              {doctor.name}
            </Link>
          </h3>
          <p className="text-sm text-ink-soft">{doctor.credentials}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {doctor.specialties.map((s) => (
          <span
            key={s}
            className="rounded-full bg-gold-tint px-3 py-1 text-xs font-semibold text-gold"
          >
            {s}
          </span>
        ))}
      </div>

      <p className="mt-3 text-sm text-ink-soft">{locationNames.join(", ")}</p>

      <a
        href={BOOKING_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 inline-flex w-fit items-center justify-center rounded-full bg-teal px-5 py-2.5 font-display text-sm font-semibold text-white transition-colors hover:bg-teal-dark"
      >
        Book Online
      </a>
    </div>
  );
}
