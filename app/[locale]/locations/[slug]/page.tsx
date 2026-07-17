import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { locations } from "@/data/locations";
import { doctors } from "@/data/doctors";
import { Link } from "@/i18n/navigation";
import { BOOKING_URL } from "@/lib/constants";

function findLocation(slug: string) {
  return locations.find((loc) => loc.id === slug) ?? null;
}

export function generateStaticParams() {
  return locations.map((loc) => ({ slug: loc.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const location = findLocation(slug);
  if (!location) return {};

  return {
    title: `${location.name} Clinic | Kids & Teens Medical Group`,
    description: location.description,
  };
}

export default async function LocationDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const location = findLocation(slug);
  if (!location) {
    notFound();
  }

  const providers = doctors.filter((doc) => doc.locationIds.includes(location.id));

  return (
    <main className="mx-auto max-w-3xl px-5 py-12 sm:px-8">
      <Link
        href="/locations"
        className="font-display text-sm font-semibold text-teal-dark hover:text-teal"
      >
        ← Back to Locations
      </Link>

      <h1 className="mt-6 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
        {location.name}
      </h1>
      <p className="mt-2 text-ink-soft">{location.address}</p>
      <p className="mt-1 font-display font-semibold text-ink">{location.phone}</p>

      {location.photos.length > 0 && (
        <div className="mt-6 grid grid-cols-3 gap-3">
          {location.photos.map((src) => (
            <Image
              key={src}
              src={src}
              alt={`${location.name} clinic`}
              width={400}
              height={300}
              className="h-28 w-full rounded-2xl object-cover shadow-card sm:h-36"
            />
          ))}
        </div>
      )}

      <p className="mt-6 text-ink-soft">{location.description}</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-border bg-white p-4">
          <p className="font-display text-sm font-bold text-ink">Office Hours</p>
          <p className="mt-1 text-sm text-ink-soft">{location.hours.officeHours}</p>
        </div>
        <div className="rounded-2xl border border-border bg-white p-4">
          <p className="font-display text-sm font-bold text-ink">Telehealth Hours</p>
          <p className="mt-1 text-sm text-ink-soft">{location.hours.telehealthHours}</p>
        </div>
      </div>

      {providers.length > 0 ? (
        <>
          {/* Booking is per-provider: Healow has no per-clinic deep link (its
              practice URL always lands on the same default location), so we
              route patients straight to the booking page of a provider who
              actually practices here instead of a generic, wrong-location link. */}
          <h2 className="mt-8 font-display text-lg font-bold text-ink">
            Book with a provider at this location
          </h2>
          <p className="mt-1 text-sm text-ink-soft">
            Choose a provider to book your appointment online.
          </p>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {providers.map((doc) => (
              <a
                key={doc.id}
                href={doc.healowUrl ?? BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Book online with ${doc.name}`}
                className="group rounded-2xl border border-border bg-white p-4 text-sm transition-colors hover:border-teal"
              >
                <span className="block font-display font-semibold text-ink">{doc.name}</span>
                <span className="mt-0.5 block text-ink-soft">{doc.credentials}</span>
                <span className="mt-2 flex items-center gap-1 font-display text-xs font-semibold text-teal-dark">
                  Book Online
                  <svg
                    aria-hidden
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-3 w-3 transition-transform group-hover:translate-x-0.5"
                  >
                    <path
                      d="M5 12h14M13 6l6 6-6 6"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </a>
            ))}
          </div>
        </>
      ) : (
        <a
          href={BOOKING_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-block rounded-full bg-teal px-7 py-3.5 text-center font-display font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5 hover:bg-teal-dark"
        >
          Book an Appointment
        </a>
      )}
    </main>
  );
}
