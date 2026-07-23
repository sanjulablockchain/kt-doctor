import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";
import { doctors } from "@/data/doctors";
import { locations } from "@/data/locations";
import { stories } from "@/data/stories";
import { serviceCategories } from "@/data/services";

const STATIC_PATHS = [
  "/",
  "/about",
  "/blog",
  "/careers",
  "/doctors",
  "/foundation",
  "/insurance",
  "/locations",
  "/network",
  "/privacy-policy",
  "/resources",
  "/services",
  "/terms-and-conditions",
  "/testimonials",
];

function changeFrequency(path: string): "weekly" | "monthly" | "yearly" {
  if (path === "/" || path === "/blog") return "weekly";
  if (path === "/privacy-policy" || path === "/terms-and-conditions") return "yearly";
  return "monthly";
}

function priority(path: string): number {
  if (path === "/") return 1;
  if (path === "/privacy-policy" || path === "/terms-and-conditions") return 0.3;
  if (path.split("/").length > 2) return 0.6; // detail pages
  return 0.8; // index/section pages
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const serviceIds = serviceCategories.flatMap((c) => c.services.map((s) => s.id));
  const dynamicPaths = [
    ...doctors.map((d) => `/doctors/${d.id}`),
    ...locations.map((l) => `/locations/${l.id}`),
    ...serviceIds.map((id) => `/services/${id}`),
    ...stories.map((s) => `/blog/${s.id}`),
  ];

  return [...STATIC_PATHS, ...dynamicPaths].map((path) => ({
    url: absoluteUrl("en", path),
    lastModified: now,
    changeFrequency: changeFrequency(path),
    priority: priority(path),
    alternates: {
      languages: {
        en: absoluteUrl("en", path),
        es: absoluteUrl("es", path),
        "x-default": absoluteUrl("en", path),
      },
    },
  }));
}
