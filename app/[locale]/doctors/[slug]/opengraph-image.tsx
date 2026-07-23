import { ImageResponse } from "next/og";
import { doctors } from "@/data/doctors";
import { SITE_NAME } from "@/lib/constants";
import { OgCard, ogSize, ogContentType, loadOgFonts } from "@/app/_og/template";

export const alt = "Kids & Teens Medical Group doctor";
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  const doctor = doctors.find((d) => d.id === slug);
  const eyebrow = locale === "es" ? "Nuestros Médicos" : "Our Doctors";
  return new ImageResponse(
    <OgCard eyebrow={eyebrow} title={doctor?.name ?? SITE_NAME} />,
    { ...size, fonts: await loadOgFonts() }
  );
}
