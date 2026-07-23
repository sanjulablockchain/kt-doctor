import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { serviceCategories } from "@/data/services";
import { BackLink } from "@/components/BackLink";
import { Link } from "@/i18n/navigation";
import { BOOKING_URL, MAIN_PHONE, TEXT_PHONE, TEXT_PHONE_ES } from "@/lib/constants";
import { buildMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";

// Formats a US display number like "(818) 361-5437" into E.164 for tel:/sms:
// links, e.g. "+18183615437" — matches components/Footer.tsx.
function toE164(usPhone: string): string {
  return `+1${usPhone.replace(/\D/g, "")}`;
}

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
  params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  const found = findService(slug);
  if (!found) return {};
  const title = locale === "es" ? found.service.nameEs : found.service.name;
  const description =
    locale === "es" ? found.service.descriptionEs : found.service.description;
  return buildMetadata({
    locale,
    path: `/services/${found.service.id}`,
    title,
    description,
    dedicatedOgImage: true,
  });
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
    <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
      <a
        href={BOOKING_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="whitespace-nowrap rounded-full bg-teal px-6 py-3.5 text-center font-display font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5 hover:bg-teal-dark"
      >
        {bookLabel}
      </a>
      <Link
        href="/services"
        className="whitespace-nowrap rounded-full border border-border bg-surface px-6 py-3.5 text-center font-display font-semibold text-ink transition-colors hover:border-teal hover:text-teal-dark"
      >
        {moreServicesLabel}
      </Link>
    </div>
  );

  const benefits = service.benefits ?? [];
  const howItWorks = locale === "es" ? service.howItWorksEs : service.howItWorks;
  const benefitsHeading = locale === "es" ? "Beneficios" : "Benefits";
  const howItWorksHeading = locale === "es" ? "Cómo Funciona" : "How It Works";
  const scheduleHeading = locale === "es" ? "Cómo Agendar" : "How to Schedule";
  const callLabel = locale === "es" ? "Llamar" : "Call";
  const textEnLabel = locale === "es" ? "Texto (Inglés)" : "Text (English)";
  const textEsLabel = locale === "es" ? "Texto (Español)" : "Text (Spanish)";

  const scheduleRows = [
    { label: callLabel, value: MAIN_PHONE, href: `tel:${toE164(MAIN_PHONE)}` },
    { label: textEnLabel, value: TEXT_PHONE, href: `sms:${toE164(TEXT_PHONE)}` },
    { label: textEsLabel, value: TEXT_PHONE_ES, href: `sms:${toE164(TEXT_PHONE_ES)}` },
  ];

  const detailSections = (
    <>
      {benefits.length > 0 && (
        <section className="mt-14">
          <h2 className="font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            {benefitsHeading}
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit) => {
              const title = locale === "es" ? benefit.titleEs : benefit.title;
              const description = locale === "es" ? benefit.descriptionEs : benefit.description;
              return (
                <div
                  key={benefit.title}
                  className="rounded-2xl border border-border bg-surface p-5 shadow-card transition-all hover:-translate-y-1 hover:border-teal hover:shadow-soft"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-tint text-teal-dark">
                    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                      <path
                        d="m5 13 4 4L19 7"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <h3 className="mt-4 font-display text-base font-bold text-ink">{title}</h3>
                  <p className="mt-1 text-sm text-ink-soft">{description}</p>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {howItWorks && (
        <section className="mt-14">
          <h2 className="font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            {howItWorksHeading}
          </h2>
          <p className="mt-4 max-w-3xl text-ink-soft">{howItWorks}</p>
        </section>
      )}

      {service.showSchedule && (
        <section className="mt-14">
          <h2 className="font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            {scheduleHeading}
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {scheduleRows.map((row) => (
              <a
                key={row.label}
                href={row.href}
                className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-5 shadow-card transition-colors hover:border-teal"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-tint text-teal-dark">
                  <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                    <path
                      d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.9 21 3 13.1 3 3.9c0-.6.4-1 1-1h4.4c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.6.1.4 0 .7-.2 1L6.6 10.8Z"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span className="flex flex-col">
                  <span className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
                    {row.label}
                  </span>
                  <span className="font-display text-sm font-bold text-ink">{row.value}</span>
                </span>
              </a>
            ))}
          </div>
        </section>
      )}
    </>
  );

  const breadcrumb = (
    <JsonLd
      data={breadcrumbJsonLd(
        [
          { name: locale === "es" ? "Inicio" : "Home", path: "/" },
          { name: locale === "es" ? "Servicios" : "Services", path: "/services" },
          { name, path: `/services/${service.id}` },
        ],
        locale ?? "en"
      )}
    />
  );

  if (service.imageSrc) {
    return (
      <main className="mx-auto max-w-5xl px-5 py-12 sm:px-8">
        {breadcrumb}
        <BackLink href="/services" messageKey="backToServices" namespace="Services" />

        <div className="mt-6 overflow-hidden rounded-3xl border border-border shadow-soft">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="aspect-[4/5] sm:aspect-[16/11] lg:aspect-auto lg:h-full">
              <Image
                src={service.imageSrc}
                alt={imageAlt ?? name}
                width={800}
                height={1000}
                unoptimized
                className="h-full w-full object-cover"
              />
            </div>

            <div className="flex flex-col justify-center bg-gradient-to-br from-teal-tint to-surface p-8 sm:p-10 lg:p-12">
              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-surface px-3.5 py-1.5 font-display text-xs font-semibold uppercase tracking-wide text-teal-dark shadow-card ring-1 ring-inset ring-teal/15">
                <span className="h-1.5 w-1.5 rounded-full bg-teal" />
                {categoryName}
              </span>

              <h1 className="mt-5 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
                {name}
              </h1>
              <p className="mt-4 text-lg font-semibold text-ink">{description}</p>
              <p className="mt-4 text-ink-soft">{longDescription}</p>

              {actions}
            </div>
          </div>
        </div>

        {detailSections}
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-5 py-12 sm:px-8">
      {breadcrumb}
      <BackLink href="/services" messageKey="backToServices" namespace="Services" />

      <span className="mt-6 inline-flex items-center gap-2 rounded-full bg-teal-tint px-3.5 py-1.5 font-display text-xs font-semibold uppercase tracking-wide text-teal-dark">
        <span className="h-1.5 w-1.5 rounded-full bg-teal" />
        {categoryName}
      </span>
      <h1 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
        {name}
      </h1>
      <p className="mt-2 text-lg font-semibold text-ink-soft">{description}</p>
      <p className="mt-6 text-ink-soft">{longDescription}</p>

      {actions}

      {detailSections}
    </main>
  );
}
