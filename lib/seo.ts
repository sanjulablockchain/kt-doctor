import type { Metadata } from "next";
import { SITE_URL, SITE_NAME, MAIN_PHONE } from "@/lib/constants";
import { routing } from "@/i18n/routing";
import type { Doctor, Location } from "@/lib/types";
import type { Story } from "@/data/stories";
import type { FaqItem } from "@/data/faq";

export type OgType = "website" | "article" | "profile";

/**
 * Locale-aware path under the `as-needed` prefix strategy.
 *   localePath("en", "/about") -> "/about"
 *   localePath("en", "/")      -> "/"
 *   localePath("es", "/about") -> "/es/about"
 *   localePath("es", "/")      -> "/es"
 */
export function localePath(locale: string, path: string): string {
  const suffix = path === "/" ? "" : path;
  if (locale === routing.defaultLocale) {
    return suffix === "" ? "/" : suffix;
  }
  return `/${locale}${suffix}`;
}

export function absoluteUrl(locale: string, path: string): string {
  return `${SITE_URL}${localePath(locale, path)}`;
}

export function buildAlternates(locale: string, path: string) {
  return {
    canonical: absoluteUrl(locale, path),
    languages: {
      en: absoluteUrl("en", path),
      es: absoluteUrl("es", path),
      "x-default": absoluteUrl("en", path),
    },
  };
}

type BuildMetadataArgs = {
  locale: string;
  path: string;
  title: string;
  description: string;
  type?: OgType;
  /**
   * Set for routes that ship their own `opengraph-image.tsx` (home + the four
   * detail types). See the images note in `buildMetadata` below.
   */
  dedicatedOgImage?: boolean;
};

export function buildMetadata({
  locale,
  path,
  title,
  description,
  type = "website",
  dedicatedOgImage = false,
}: BuildMetadataArgs): Metadata {
  const url = absoluteUrl(locale, path);
  // Next 16 shallow-merges `openGraph`/`twitter`: a page that sets these
  // *replaces* the object inherited from parent segments, so a nested static
  // page (e.g. /about) loses the default `app/[locale]/opengraph-image`
  // file-convention image. We therefore attach the branded default image here.
  // But empirically (Next 16.2.10) an explicit `openGraph.images` in a page's
  // metadata *wins over* a same-segment `opengraph-image.tsx` file, so routes
  // that generate their own per-entity card (home + doctor/location/blog/service
  // detail) must NOT set it here, or they would fall back to the generic
  // default. Those callers pass `dedicatedOgImage: true`.
  const defaultOgImage = `${SITE_URL}/${locale}/opengraph-image`;
  const images = dedicatedOgImage ? {} : { images: [defaultOgImage] };
  return {
    title,
    description,
    alternates: buildAlternates(locale, path),
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale: locale === "es" ? "es_ES" : "en_US",
      type,
      ...images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...images,
    },
  };
}

const LOGO_URL = `${SITE_URL}/clinic-logo.svg`;

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalOrganization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: LOGO_URL,
    image: LOGO_URL,
    telephone: MAIN_PHONE,
    areaServed: "Greater Los Angeles",
    medicalSpecialty: "Pediatric",
  };
}

export function parseAddress(address: string): {
  streetAddress: string;
  addressLocality?: string;
  addressRegion?: string;
  postalCode?: string;
  addressCountry: string;
} {
  const parts = address.split(",").map((p) => p.trim());
  if (parts.length >= 3) {
    const stateZip = parts[parts.length - 1];
    const match = stateZip.match(/^([A-Za-z]{2})\s+(\d{5}(?:-\d{4})?)$/);
    if (match) {
      return {
        streetAddress: parts.slice(0, parts.length - 2).join(", "),
        addressLocality: parts[parts.length - 2],
        addressRegion: match[1],
        postalCode: match[2],
        addressCountry: "US",
      };
    }
  }
  return { streetAddress: address, addressCountry: "US" };
}

export function physicianJsonLd(doctor: Doctor, locale: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Physician",
    name: doctor.name,
    url: absoluteUrl(locale, `/doctors/${doctor.id}`),
    medicalSpecialty: doctor.specialties,
    ...(doctor.photoSrc ? { image: `${SITE_URL}${doctor.photoSrc}` } : {}),
    worksFor: {
      "@type": "MedicalOrganization",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}

export function localBusinessJsonLd(location: Location, locale: string) {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    name: `${SITE_NAME} - ${location.name}`,
    url: absoluteUrl(locale, `/locations/${location.id}`),
    telephone: location.phone,
    address: { "@type": "PostalAddress", ...parseAddress(location.address) },
    ...(location.lat != null && location.lng != null
      ? {
          geo: {
            "@type": "GeoCoordinates",
            latitude: location.lat,
            longitude: location.lng,
          },
        }
      : {}),
    ...(location.photos && location.photos.length > 0
      ? { image: `${SITE_URL}${location.photos[0]}` }
      : {}),
    parentOrganization: {
      "@type": "MedicalOrganization",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}

function toIsoDate(dateStr: string): string {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function articleJsonLd(story: Story, locale: string) {
  const title = locale === "es" ? story.titleEs : story.title;
  const description = locale === "es" ? story.excerptEs : story.excerpt;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    image: `${SITE_URL}${story.imageSrc}`,
    datePublished: toIsoDate(story.date),
    ...(story.author ? { author: { "@type": "Person", name: story.author } } : {}),
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: { "@type": "ImageObject", url: LOGO_URL },
    },
    mainEntityOfPage: absoluteUrl(locale, `/blog/${story.id}`),
  };
}

export function breadcrumbJsonLd(
  items: Array<{ name: string; path: string }>,
  locale: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(locale, item.path),
    })),
  };
}

export function faqPageJsonLd(faqs: FaqItem[], locale: string) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: locale === "es" ? faq.questionEs : faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: locale === "es" ? faq.answerEs : faq.answer,
      },
    })),
  };
}
