"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { locations } from "@/data/locations";
import { doctors } from "@/data/doctors";
import { networkBrands } from "@/data/network";
import { Hero } from "@/components/Hero";
import { NetworkCard } from "@/components/NetworkCard";
import { ClinicNearYouCard } from "@/components/ClinicNearYouCard";
import { BookingCtaBanner } from "@/components/BookingCtaBanner";
import { InfoStatCard } from "@/components/InfoStatCard";
import { ParallaxImage } from "@/components/ParallaxImage";
import { Reveal } from "@/components/Reveal";
import { foundation } from "@/data/foundation";
import { insuranceInfo } from "@/data/insurance";
import { serviceCategories } from "@/data/services";
import { partners } from "@/data/partners";
import { stories } from "@/data/stories";
import { parentResources } from "@/data/resources";
import { ResourceCard } from "@/components/ResourceCard";
import { faqs } from "@/data/faq";
import { FaqAccordion } from "@/components/FaqAccordion";
import { DonateTab } from "@/components/DonateTab";

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

export function HomePageContent() {
  const t = useTranslations("Home");
  const locale = useLocale();
  const doctorsWithPhotos = doctors.filter((d) => d.photoSrc);
  const previewDoctors = (doctorsWithPhotos.length >= 4 ? doctorsWithPhotos : doctors).slice(0, 4);
  const avatarTints = ["bg-teal-tint text-teal-dark", "bg-gold-tint text-gold"];
  const allServices = serviceCategories.flatMap((category) => category.services);
  const telehealthService = serviceCategories
    .flatMap((category) => category.services)
    .find((service) => service.id === "telehealth");
  const telehealthChips = (telehealthService?.benefits ?? []).slice(0, 3);

  return (
    <main>
      <Hero />

      {/* Why families choose us */}
      <section className="mx-auto max-w-7xl px-5 pb-16 pt-20 sm:px-8 sm:pt-24">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16">
          <ParallaxImage
            src="https://images.unsplash.com/photo-1769698678497-c41f0ab47c3e?auto=format&fit=crop&w=1000&q=80"
            alt="Modern medical clinic building with a glass facade"
            width={1000}
            height={1000}
            wrapperClassName="h-72 rounded-[2rem] shadow-card sm:h-96"
            speed={0.12}
          />

          <div>
            <span className="font-display text-xs font-semibold uppercase tracking-wide text-teal-dark">
              {t("whyChooseUsEyebrow")}
            </span>
            <h2 className="mt-2 max-w-md font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              {t("whyChooseUsHeading")}
            </h2>
            <p className="mt-3 max-w-md text-ink-soft">
              {t("whyChooseUsBody", { count: locations.length })}
            </p>

            <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-6">
              {[
                {
                  label: t("featureSameDay"),
                  icon: (
                    <path
                      d="M12 22c5.5 0 10-4.5 10-10S17.5 2 12 2 2 6.5 2 12s4.5 10 10 10Z M12 7v5l3.5 2"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  ),
                },
                {
                  label: t("featureTelehealth"),
                  icon: (
                    <path
                      d="M15 10.5 20 7v10l-5-3.5M4 6h9a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  ),
                },
                {
                  label: t("featureBoardCertified"),
                  icon: (
                    <path
                      d="m9 12 2 2 4-4M12 22s7-4 7-10V5l-7-3-7 3v7c0 6 7 10 7 10Z"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  ),
                },
                {
                  label: t("featureAges"),
                  icon: (
                    <path
                      d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 9a7 7 0 0 1 14 0"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  ),
                },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-tint text-teal-dark">
                    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                      {item.icon}
                    </svg>
                  </span>
                  <p className="font-display text-sm font-semibold text-ink">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Telehealth teaser */}
      <section className="mx-auto max-w-7xl px-5 pb-16 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-12">
          <ParallaxImage
            src="/services/telehealth-home.jpg"
            alt={t("telehealthImageAlt")}
            width={1000}
            height={665}
            wrapperClassName="h-72 rounded-[2rem] shadow-card sm:h-96 lg:order-2"
            speed={0.12}
          />

          <div className="lg:order-1">
            <span className="font-display text-xs font-semibold uppercase tracking-wide text-teal-dark">
              {t("telehealthEyebrow")}
            </span>
            <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              {t("telehealthHeading")}
            </h2>
            <p className="mt-3 max-w-xl text-ink-soft">{t("telehealthBody")}</p>
            {telehealthChips.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2.5">
                {telehealthChips.map((chip) => (
                  <span
                    key={chip.title}
                    className="rounded-full border border-border bg-ivory px-4 py-2 text-sm font-semibold text-ink"
                  >
                    {locale === "es" ? chip.titleEs : chip.title}
                  </span>
                ))}
              </div>
            )}
            <Link
              href="/services/telehealth"
              className="mt-6 inline-block font-display font-semibold text-teal-dark hover:text-teal"
            >
              {t("telehealthCta")} →
            </Link>
          </div>
        </div>
      </section>

      {/* Doctors preview */}
      <section className="border-y border-border bg-surface/60">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <span className="font-display text-xs font-semibold uppercase tracking-wide text-teal-dark">
                  {t("teamEyebrow")}
                </span>
                <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
                  {t("teamHeading", { count: doctors.length })}
                </h2>
              </div>
              <Link
                href="/doctors"
                className="font-display font-semibold text-teal-dark hover:text-teal"
              >
                {t("browseAllDoctors")} →
              </Link>
            </div>
          </Reveal>

          <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-4">
            {previewDoctors.map((doc, i) => (
              <Reveal key={doc.id} delayMs={Math.min(i, 4) * 70} className="h-full">
                <div className="h-full rounded-2xl border border-border bg-surface p-5 text-center shadow-card transition-all hover:-translate-y-1 hover:border-teal hover:shadow-soft">
                  {doc.photoSrc ? (
                    <Image
                      src={doc.photoSrc}
                      alt={doc.name}
                      width={64}
                      height={64}
                      className="mx-auto h-16 w-16 rounded-full object-cover"
                    />
                  ) : (
                    <div
                      className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full font-display text-lg font-bold ${
                        avatarTints[i % avatarTints.length]
                      }`}
                    >
                      {initials(doc.name)}
                    </div>
                  )}
                  <p className="mt-3 font-display text-sm font-bold text-ink">{doc.name}</p>
                  <p className="text-xs text-ink-soft">{doc.credentials}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Network teaser */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="font-display text-xs font-semibold uppercase tracking-wide text-teal-dark">
                {t("networkEyebrow")}
              </span>
              <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
                {t("networkHeading")}
              </h2>
            </div>
            <Link
              href="/network"
              className="font-display font-semibold text-teal-dark hover:text-teal"
            >
              {t("seeFullNetwork")} →
            </Link>
          </div>
        </Reveal>

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {networkBrands.slice(0, 4).map((brand, i) => (
            <Reveal key={brand.id} delayMs={Math.min(i, 4) * 70} className="h-full">
              <NetworkCard brand={brand} compact />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Find a clinic */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <Reveal>
          <ClinicNearYouCard />
        </Reveal>
      </section>

      {/* Foundation teaser */}
      <section className="mx-auto max-w-7xl px-5 pb-16 sm:px-8">
        <div className="flex flex-col items-center gap-6 rounded-3xl border border-border bg-surface p-8 text-center shadow-card transition-all hover:-translate-y-1 hover:shadow-soft sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <Image
              src={foundation.logoSrc}
              alt={`${foundation.name} logo`}
              width={160}
              height={53}
              unoptimized
              className="h-10 w-auto object-contain"
            />
            <div>
              <p className="font-display text-lg font-bold text-ink">{foundation.name}</p>
              <p className="mt-1 max-w-md text-sm text-ink-soft">{foundation.mission}</p>
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <a
              href={foundation.donateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-teal px-6 py-3 text-center font-display font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5 hover:bg-teal-dark"
            >
              Donate Now
            </a>
            <Link
              href="/foundation"
              className="rounded-full border border-border bg-surface px-6 py-3 text-center font-display font-semibold text-ink transition-colors hover:border-teal hover:text-teal-dark"
            >
              Learn more
            </Link>
          </div>
        </div>
      </section>

      {/* Careers, Insurance teaser */}
      <section className="mx-auto max-w-7xl px-5 pb-16 sm:px-8">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Reveal className="h-full">
            <InfoStatCard
              href="/careers"
              variant="teal"
              stat={`${doctors.length}+`}
              statLabel={t("careersStatLabel")}
              heading={t("careersHeading")}
              body={t("careersBody")}
              cta={t("joinOurTeam")}
              icon={
                <>
                  <rect x="2" y="7" width="20" height="14" rx="2" />
                  <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  <path d="M2 13h20" />
                </>
              }
            />
          </Reveal>

          <Reveal delayMs={90} className="h-full">
            <InfoStatCard
              href="/insurance"
              variant="navy"
              stat={`${insuranceInfo.acceptedCategories.length + 1}+`}
              statLabel={t("insuranceStatLabel")}
              heading={t("insuranceHeading")}
              body={t("insuranceBody", {
                categories: insuranceInfo.acceptedCategories.join(", "),
              })}
              cta={t("seeAcceptedInsurance")}
              icon={
                <>
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
                  <path d="m9 12 2 2 4-4" />
                </>
              }
            />
          </Reveal>
        </div>
      </section>

      {/* Resources */}
      <section className="mx-auto max-w-7xl px-5 pb-16 sm:px-8">
        <Reveal>
          <span className="font-display text-xs font-semibold uppercase tracking-wide text-teal-dark">
            {t("resourcesHeading")}
          </span>
          <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            {t("resourcesSectionHeading")}
          </h2>
          <p className="mt-2 max-w-lg text-ink-soft">{t("resourcesBody")}</p>
        </Reveal>

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {parentResources.map((resource, i) => (
            <Reveal key={resource.id} delayMs={Math.min(i, 4) * 70} className="h-full">
              <ResourceCard resource={resource} className="h-full" />
            </Reveal>
          ))}

          <Reveal
            delayMs={Math.min(parentResources.length, 4) * 70}
            className="h-full"
          >
            <Link
              href="/resources"
              className="flex h-full flex-col items-start justify-center rounded-2xl border border-border bg-teal-tint p-5 shadow-card transition-all hover:-translate-y-1 hover:shadow-soft"
            >
              <p className="font-display text-base font-bold text-teal-dark">
                {t("browseAllResourcesTitle")}
              </p>
              <p className="mt-2 text-sm text-ink-soft">{t("browseAllResourcesBody")}</p>
              <span className="mt-3 font-display text-sm font-semibold text-teal-dark">
                {t("viewAllResources")} →
              </span>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Services pill cloud */}
      <section className="mx-auto max-w-7xl px-5 pb-16 sm:px-8">
        <div className="rounded-3xl border border-border bg-surface p-8 text-center shadow-card sm:p-10">
          <span className="font-display text-xs font-semibold uppercase tracking-wide text-teal-dark">
            {t("servicesEyebrow", { count: allServices.length })}
          </span>
          <h2 className="mt-2 font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            {t("servicesHeading")}
          </h2>

          <div className="mt-6 flex flex-wrap justify-center gap-2.5">
            {allServices.map((service) => (
              <Link
                key={service.id}
                href={`/services/${service.id}`}
                className="rounded-full border border-border bg-ivory px-4 py-2 text-sm font-semibold text-ink transition-colors hover:border-teal hover:text-teal-dark"
              >
                {locale === "es" ? service.nameEs : service.name}
              </Link>
            ))}
          </div>

          <Link
            href="/services"
            className="mt-6 inline-block font-display font-semibold text-teal-dark hover:text-teal"
          >
            {t("viewAllServices")} →
          </Link>
        </div>
      </section>

      {/* Featured Stories */}
      <section className="mx-auto max-w-7xl px-5 pb-16 sm:px-8">
        <Reveal>
          <span className="font-display text-xs font-semibold uppercase tracking-wide text-teal-dark">
            {t("storiesEyebrow")}
          </span>
          <h2 className="mt-2 font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            {t("storiesHeading")}
          </h2>
        </Reveal>

        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stories.map((story, i) => {
            const title = locale === "es" ? story.titleEs : story.title;

            return (
              <Reveal key={story.id} delayMs={Math.min(i, 4) * 70} className="h-full">
                <Link
                  href={`/blog/${story.id}`}
                  className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-card transition-all hover:-translate-y-1 hover:shadow-soft"
                >
                  <Image
                    src={story.imageSrc}
                    alt={title}
                    width={300}
                    height={225}
                    unoptimized
                    className="h-36 w-full object-cover"
                  />
                  <div className="flex flex-1 flex-col p-5">
                    <p className="text-xs font-semibold text-ink-soft">{story.date}</p>
                    <p className="mt-2 font-display text-base font-bold text-ink">{title}</p>
                    <span className="mt-auto pt-4 font-display text-sm font-semibold text-teal-dark">
                      {t("readFullStory")} →
                    </span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Trusted Partners & Affiliations */}
      <section className="border-y border-border bg-surface">
        <div className="mx-auto max-w-7xl px-5 py-12 text-center sm:px-8">
          <span className="font-display text-xs font-semibold uppercase tracking-wide text-teal-dark">
            {t("partnersHeading")}
          </span>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-8 lg:gap-12">
            {partners.map((partner) => (
              <Image
                key={partner.id}
                src={partner.logoSrc}
                alt={partner.name}
                width={160}
                height={48}
                unoptimized
                className="h-8 w-auto object-contain opacity-60 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0 sm:h-10"
              />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ — the tint fades into the body toward the bottom (same pattern as
          the hero) so it doesn't end in a hard green→black seam above the
          bottom CTA in dark mode. */}
      <section className="bg-gradient-to-b from-teal-tint/60 to-ivory py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Reveal>
            <div className="mx-auto max-w-3xl text-center">
              <span className="font-display text-xs font-semibold uppercase tracking-wide text-teal-dark">
                {t("faqEyebrow")}
              </span>
              <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
                {t("faqHeading")}
              </h2>
              <p className="mt-3 text-ink-soft">{t("faqSubheading")}</p>
            </div>
          </Reveal>

          <div className="mx-auto mt-8 max-w-3xl">
            <FaqAccordion items={faqs} revealOnScroll />
          </div>
        </div>
      </section>

      {/* Bottom CTA — small bottom padding only; the footer's mt-16 already
          provides the gap before it (avoids doubling up to a ~144px band). */}
      <section className="mx-auto max-w-7xl px-5 pb-4 sm:px-8">
        <Reveal>
          <BookingCtaBanner />
        </Reveal>
      </section>

      <DonateTab />
    </main>
  );
}
