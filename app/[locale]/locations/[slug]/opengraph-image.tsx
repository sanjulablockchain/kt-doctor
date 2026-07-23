import { ImageResponse } from "next/og";
import { locations } from "@/data/locations";
import { SITE_NAME } from "@/lib/constants";
import { OgCard, ogSize, ogContentType, loadOgFonts } from "@/app/_og/template";

export const alt = "Kids & Teens Medical Group clinic";
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  const location = locations.find((l) => l.id === slug);
  const eyebrow = locale === "es" ? "Nuestras Clínicas" : "Our Clinics";
  const title = location ? `${location.name} Clinic` : SITE_NAME;
  return new ImageResponse(<OgCard eyebrow={eyebrow} title={title} />, {
    ...size,
    fonts: await loadOgFonts(),
  });
}
