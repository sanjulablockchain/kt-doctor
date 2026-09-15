import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithIntl as render } from "@/lib/test-utils";
import PressReleasePage, { generateStaticParams, generateMetadata } from "./page";
import { pressReleases } from "@/data/pressReleases";

const release = pressReleases[0];

describe("PressReleasePage", () => {
  it("generates static params for every press release", () => {
    const params = generateStaticParams();
    expect(params).toHaveLength(pressReleases.length);
    expect(params).toContainEqual({ slug: release.id });
  });

  it("renders the release headline", async () => {
    const ui = await PressReleasePage({ params: Promise.resolve({ slug: release.id }) });
    render(ui);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(release.title);
  });

  it("renders the Spanish headline when locale is es", async () => {
    const ui = await PressReleasePage({
      params: Promise.resolve({ slug: release.id, locale: "es" }),
    });
    render(ui, "es");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(release.titleEs);
  });

  it("builds article metadata canonicalised to the release URL", async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ slug: release.id, locale: "en" }),
    });
    expect(metadata.title).toBe(release.title);
    expect(metadata.description).toBe(release.excerpt);
    expect(metadata.alternates?.canonical).toBe(
      `https://www.ktdoctor.com/media/press/${release.id}`
    );
    // `openGraph` is a discriminated union in Next's Metadata types, so `type`
    // is only visible after narrowing; the cast keeps the assertion readable.
    expect((metadata.openGraph as { type?: string } | undefined)?.type).toBe("article");
  });

  it("returns empty metadata for an unknown slug", async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ slug: "does-not-exist", locale: "en" }),
    });
    expect(metadata).toEqual({});
  });

  it("calls notFound for an unknown slug", async () => {
    await expect(
      PressReleasePage({ params: Promise.resolve({ slug: "does-not-exist" }) })
    ).rejects.toThrow();
  });
});
