import type { Metadata } from "next";
import { locations } from "@/data/locations";
import type { Location } from "@/lib/types";

export const metadata: Metadata = {
  title: "Testimonials | Kids & Teens Medical Group",
  description:
    "Read what families are saying about Kids & Teens Medical Group, and share your own experience with our pediatric clinics across Greater LA.",
};

function googleReviewsUrl(location: Location): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `Kids & Teens Medical Group ${location.name} ${location.address}`
  )}`;
}

export default function TestimonialsPage() {
  return (
    <main className="mx-auto max-w-4xl px-5 py-12 sm:px-8">
      <span className="font-display text-xs font-semibold uppercase tracking-wide text-teal-dark">
        Testimonials & Reviews
      </span>
      <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
        Share Your Experience
      </h1>
      <p className="mt-3 max-w-2xl text-ink-soft">
        Kids &amp; Teens Medical Group is a general pediatrics practice that
        takes an integrated approach to care, with offices across Greater LA
        offering high-quality pediatric care and pediatric urgent care
        services.
      </p>
      <p className="mt-3 max-w-2xl text-ink-soft">
        We always appreciate feedback from our valued patients, and
        we&apos;re thrilled that so many parents have shared their positive
        experiences with us.
      </p>

      <h2 className="mt-10 font-display text-xl font-bold text-ink">
        Google Reviews
      </h2>
      <p className="mt-1 text-sm text-ink-soft">
        Select a clinic to read or leave a review on Google.
      </p>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {locations.map((location) => (
          <a
            key={location.id}
            href={googleReviewsUrl(location)}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-2xl border border-border bg-white px-4 py-3 text-center font-display text-sm font-semibold text-teal-dark shadow-card transition-all hover:-translate-y-0.5 hover:shadow-soft"
          >
            {location.name}
          </a>
        ))}
      </div>

      <p className="mt-10 max-w-2xl text-ink-soft">
        Please read what others are saying about Kids &amp; Teens Medical
        Group above, and as always, we would love to collect your feedback
        too.
      </p>
    </main>
  );
}
