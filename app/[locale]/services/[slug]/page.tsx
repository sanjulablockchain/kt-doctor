import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { serviceCategories } from "@/data/services";
import { Link } from "@/i18n/navigation";
import { BOOKING_URL } from "@/lib/constants";

function findService(slug: string) {
  for (const category of serviceCategories) {
    const service = category.services.find((s) => s.id === slug);
    if (service) return { service, category };
  }
  return null;
}

export function generateStaticParams() {
  return serviceCategories.flatMap((category) =>
    category.services.map((service) => ({ slug: service.id }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const found = findService(slug);
  if (!found) return {};

  return {
    title: `${found.service.name} | Kids & Teens Medical Group`,
    description: found.service.description,
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const found = findService(slug);
  if (!found) {
    notFound();
  }
  const { service, category } = found;

  return (
    <main className="mx-auto max-w-3xl px-5 py-12 sm:px-8">
      <Link
        href="/services"
        className="font-display text-sm font-semibold text-teal-dark hover:text-teal"
      >
        ← Back to Services
      </Link>

      <span className="mt-6 block font-display text-xs font-semibold uppercase tracking-wide text-teal-dark">
        {category.name}
      </span>
      <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
        {service.name}
      </h1>
      <p className="mt-2 text-lg font-semibold text-ink-soft">{service.description}</p>
      <p className="mt-6 text-ink-soft">{service.longDescription}</p>

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
