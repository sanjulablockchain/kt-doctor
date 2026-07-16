import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { doctors } from "@/data/doctors";
import { locations } from "@/data/locations";
import { Link } from "@/i18n/navigation";
import { BOOKING_URL } from "@/lib/constants";

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

function findDoctor(slug: string) {
  return doctors.find((d) => d.id === slug) ?? null;
}

export function generateStaticParams() {
  return doctors.map((doctor) => ({ slug: doctor.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const doctor = findDoctor(slug);
  if (!doctor) return {};

  return {
    title: `${doctor.name} | Kids & Teens Medical Group`,
    description: doctor.bio ?? `${doctor.name}, ${doctor.credentials} at Kids & Teens Medical Group.`,
  };
}

export default async function DoctorDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const doctor = findDoctor(slug);
  if (!doctor) {
    notFound();
  }

  const doctorLocations = doctor.locationIds
    .map((id) => locations.find((loc) => loc.id === id))
    .filter((loc): loc is (typeof locations)[number] => Boolean(loc));

  return (
    <main className="mx-auto max-w-3xl px-5 py-12 sm:px-8">
      <Link
        href="/doctors"
        className="font-display text-sm font-semibold text-teal-dark hover:text-teal"
      >
        ← Back to Doctors
      </Link>

      <div className="mt-6 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
        {doctor.photoSrc ? (
          <Image
            src={doctor.photoSrc}
            alt={doctor.name}
            width={112}
            height={112}
            className="h-28 w-28 shrink-0 rounded-3xl object-cover shadow-card"
          />
        ) : (
          <div
            aria-hidden
            className="flex h-28 w-28 shrink-0 items-center justify-center rounded-3xl bg-teal-tint font-display text-3xl font-bold text-teal-dark shadow-card"
          >
            {initials(doctor.name)}
          </div>
        )}

        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            {doctor.name}
          </h1>
          <p className="mt-1 text-lg font-semibold text-ink-soft">{doctor.credentials}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {doctor.specialties.map((s) => (
              <span
                key={s}
                className="rounded-full bg-gold-tint px-3 py-1 text-xs font-semibold text-gold"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>

      {doctor.bio && <p className="mt-8 text-ink-soft">{doctor.bio}</p>}

      <h2 className="mt-8 font-display text-lg font-bold text-ink">Locations</h2>
      <div className="mt-3 flex flex-col gap-3">
        {doctorLocations.map((loc) => (
          <Link
            key={loc.id}
            href={`/locations/${loc.id}`}
            className="rounded-2xl border border-border bg-white p-4 text-sm transition-colors hover:border-teal"
          >
            <p className="font-display font-semibold text-ink">{loc.name}</p>
            <p className="mt-0.5 text-ink-soft">{loc.address}</p>
          </Link>
        ))}
      </div>

      <a
        href={BOOKING_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-8 inline-block rounded-full bg-teal px-7 py-3.5 text-center font-display font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5 hover:bg-teal-dark"
      >
        Book an Appointment
      </a>
    </main>
  );
}
