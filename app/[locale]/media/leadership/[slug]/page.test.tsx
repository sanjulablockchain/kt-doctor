import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithIntl as render } from "@/lib/test-utils";
import PressBioPage, { generateStaticParams, generateMetadata } from "./page";
import { pressBios } from "@/data/pressBios";

const bio = pressBios[0];

describe("PressBioPage", () => {
  it("generates static params for every press biography", () => {
    const params = generateStaticParams();
    expect(params).toHaveLength(pressBios.length);
    expect(params).toContainEqual({ slug: bio.id });
  });

  it("renders the subject's name and credentials", async () => {
    const ui = await PressBioPage({ params: Promise.resolve({ slug: bio.id }) });
    render(ui);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Janesri De Silva, MD, FAAP"
    );
  });

  it("renders the Spanish role when locale is es", async () => {
    const ui = await PressBioPage({ params: Promise.resolve({ slug: bio.id, locale: "es" }) });
    render(ui, "es");
    expect(screen.getByText(bio.roleEs)).toBeInTheDocument();
  });

  it("builds profile metadata canonicalised to the biography URL", async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ slug: bio.id, locale: "en" }),
    });
    expect(metadata.title).toBe("Janesri De Silva, MD, FAAP");
    expect(metadata.description).toBe(bio.summary);
    expect(metadata.alternates?.canonical).toBe(
      `https://www.ktdoctor.com/media/leadership/${bio.id}`
    );
    // `openGraph` is a discriminated union in Next's Metadata types, so `type`
    // is only visible after narrowing; the cast keeps the assertion readable.
    expect((metadata.openGraph as { type?: string } | undefined)?.type).toBe("profile");
  });

  it("returns empty metadata for an unknown slug", async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ slug: "does-not-exist", locale: "en" }),
    });
    expect(metadata).toEqual({});
  });

  it("calls notFound for an unknown slug", async () => {
    await expect(
      PressBioPage({ params: Promise.resolve({ slug: "does-not-exist" }) })
    ).rejects.toThrow();
  });
});
