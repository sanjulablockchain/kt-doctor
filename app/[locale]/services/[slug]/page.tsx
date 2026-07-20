import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { serviceCategories } from "@/data/services";
import { BackLink } from "@/components/BackLink";
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
  params: Promise<{ slug: string; locale?: string }>;
}) {
  const { slug, locale } = await params;
  const found = findService(slug);
  if (!found) {
    notFound();
  }
  const { service, category } = found;
  const name = locale === "es" ? service.nameEs : service.name;
  const categoryName = locale === "es" ? category.nameEs : category.name;
  const description = locale === "es" ? service.descriptionEs : service.description;
  const longDescription = locale === "es" ? service.longDescriptionEs : service.longDescription;
  const imageAlt = locale === "es" ? service.imageAltEs : service.imageAlt;
  const bookLabel = locale === "es" ? "Reservar una Cita" : "Book an Appointment";
  const moreServicesLabel = locale === "es" ? "Más Servicios" : "More Services";

  const actions = (
    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
      <a
        href={BOOKING_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-full bg-teal px-7 py-3.5 text-center font-display font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5 hover:bg-teal-dark"
      >
        {bookLabel}
      </a>
      <Link
        href="/services"
        className="rounded-full border border-border bg-surface px-7 py-3.5 text-center font-display font-semibold text-ink transition-colors hover:border-teal hover:text-teal-dark"
      >
        {moreServicesLabel}
      </Link>
    </div>
  );

  if (service.imageSrc) {
    return (
      <main className="mx-auto max-w-5xl px-5 py-12 sm:px-8">
        <BackLink href="/services" messageKey="backToServices" namespace="Services" />

        <span className="mt-6 block font-display text-xs font-semibold uppercase tracking-wide text-teal-dark">
          {categoryName}
        </span>
        <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
          {name}
        </h1>

        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-center">
          <div className="overflow-hidden rounded-2xl">
            <Image
              src={service.imageSrc}
              alt={imageAlt ?? name}
              width={800}
              height={1000}
              unoptimized
              className="aspect-[4/5] w-full object-cover"
            />
          </div>

          <div>
            <p className="text-lg font-semibold text-ink-soft">{description}</p>
            <p className="mt-6 text-ink-soft">{longDescription}</p>

            {actions}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-5 py-12 sm:px-8">
      <BackLink href="/services" messageKey="backToServices" namespace="Services" />

      <span className="mt-6 block font-display text-xs font-semibold uppercase tracking-wide text-teal-dark">
        {categoryName}
      </span>
      <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
        {name}
      </h1>
      <p className="mt-2 text-lg font-semibold text-ink-soft">{description}</p>
      <p className="mt-6 text-ink-soft">{longDescription}</p>

      {actions}
    </main>
  );
}
