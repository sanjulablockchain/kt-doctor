import { ImageResponse } from "next/og";
import { serviceCategories } from "@/data/services";
import { SITE_NAME } from "@/lib/constants";
import { OgCard, ogSize, ogContentType, loadOgFonts } from "@/app/_og/template";

export const alt = "Kids & Teens Medical Group service";
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  const service = serviceCategories.flatMap((c) => c.services).find((s) => s.id === slug);
  const title = service ? (locale === "es" ? service.nameEs : service.name) : SITE_NAME;
  const eyebrow = locale === "es" ? "Servicios" : "Services";
  return new ImageResponse(<OgCard eyebrow={eyebrow} title={title} />, {
    ...size,
    fonts: await loadOgFonts(),
  });
}
