import { ImageResponse } from "next/og";
import { OgCard, ogSize, ogContentType, loadOgFonts } from "@/app/_og/template";

export const alt = "Kids & Teens Medical Group";
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image() {
  return new ImageResponse(
    <OgCard title="Pediatric Care Across Greater Los Angeles" />,
    { ...size, fonts: await loadOgFonts() }
  );
}
