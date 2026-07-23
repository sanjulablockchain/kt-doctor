import { ImageResponse } from "next/og";
import { stories } from "@/data/stories";
import { SITE_NAME } from "@/lib/constants";
import { OgCard, ogSize, ogContentType, loadOgFonts } from "@/app/_og/template";

export const alt = "Kids & Teens Medical Group blog";
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  const story = stories.find((s) => s.id === slug);
  const title = story ? (locale === "es" ? story.titleEs : story.title) : SITE_NAME;
  const eyebrow = locale === "es" ? "Del Blog" : "From the Blog";
  return new ImageResponse(<OgCard eyebrow={eyebrow} title={title} />, {
    ...size,
    fonts: await loadOgFonts(),
  });
}
