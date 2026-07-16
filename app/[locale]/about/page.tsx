import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { locations } from "@/data/locations";
import { insuranceInfo } from "@/data/insurance";
import { BOOKING_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About Us | Kids & Teens Medical Group",
  description:
    "Kids & Teens Pediatric Medical Group provides compassionate, comprehensive pediatric care across Greater Los Angeles, from routine check-ups to urgent care and after-hours visits.",
};

const CARE_AREAS = [
  "Routine check-ups",
  "Allergies",
  "ADHD",
  "Urgent care",
  "Prenatal consultations",
  "After-hours care",
];

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-4xl px-5 py-12 sm:px-8">
      <span className="font-display text-xs font-semibold uppercase tracking-wide text-teal-dark">
        About Us
      </span>
      <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
        Kids &amp; Teens Pediatric Medical Group
      </h1>
      <p className="mt-2 max-w-xl font-display text-lg font-semibold text-teal-dark">
        Caring for the Future Generations in Greater Los Angeles
      </p>

      <p className="mt-5 max-w-2xl text-ink-soft">
        Kids &amp; Teens Medical Group is a pediatric practice dedicated to
        providing compassionate, comprehensive care for children and
        adolescents. Our team of board-certified pediatricians is committed
        to offering personalized care tailored to your child&apos;s unique
        needs. We offer a wide range of services, including:
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {CARE_AREAS.map((area) => (
          <span
            key={area}
            className="rounded-full bg-teal-tint px-4 py-2 font-display text-sm font-semibold text-teal-dark"
          >
            {area}
          </span>
        ))}
      </div>

      <p className="mt-6 max-w-2xl text-ink-soft">
        With {locations.length} locations throughout Los Angeles and beyond,
        we&apos;re here to serve your family&apos;s needs. We accept most
        major insurance plans, including any HMO/IPA:
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {insuranceInfo.acceptedCategories.map((category) => (
          <span
            key={category}
            className="rounded-full bg-gold-tint px-4 py-2 font-display text-sm font-semibold text-gold"
          >
            {category}
          </span>
        ))}
      </div>

      <p className="mt-6 max-w-2xl text-ink-soft">
        For those without insurance, we offer affordable payment options.
        Rest assured, your child&apos;s health is our top priority. Schedule
        an appointment today and let us help your family thrive.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <a
          href={BOOKING_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-teal px-7 py-3.5 text-center font-display font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5 hover:bg-teal-dark"
        >
          Book an Appointment
        </a>
        <Link
          href="/locations"
          className="rounded-full border border-border bg-white px-7 py-3.5 text-center font-display font-semibold text-ink transition-colors hover:border-teal hover:text-teal-dark"
        >
          Find a Clinic
        </Link>
      </div>
    </main>
  );
}
