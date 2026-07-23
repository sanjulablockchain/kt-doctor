import { describe, it, expect } from "vitest";
import {
  localePath,
  absoluteUrl,
  buildAlternates,
  buildMetadata,
  organizationJsonLd,
  parseAddress,
  physicianJsonLd,
  localBusinessJsonLd,
  articleJsonLd,
  breadcrumbJsonLd,
  faqPageJsonLd,
} from "./seo";
import type { Doctor, Location } from "@/lib/types";

describe("localePath", () => {
  it("returns unprefixed paths for the default locale", () => {
    expect(localePath("en", "/about")).toBe("/about");
    expect(localePath("en", "/")).toBe("/");
  });
  it("prefixes non-default locales", () => {
    expect(localePath("es", "/about")).toBe("/es/about");
    expect(localePath("es", "/")).toBe("/es");
  });
});

describe("absoluteUrl", () => {
  it("builds absolute URLs under the canonical host", () => {
    expect(absoluteUrl("en", "/")).toBe("https://www.ktdoctor.com/");
    expect(absoluteUrl("es", "/doctors")).toBe("https://www.ktdoctor.com/es/doctors");
  });
});

describe("buildAlternates", () => {
  it("uses a self-referential canonical plus en/es/x-default languages", () => {
    const alt = buildAlternates("es", "/about");
    expect(alt.canonical).toBe("https://www.ktdoctor.com/es/about");
    expect(alt.languages.en).toBe("https://www.ktdoctor.com/about");
    expect(alt.languages.es).toBe("https://www.ktdoctor.com/es/about");
    expect(alt.languages["x-default"]).toBe("https://www.ktdoctor.com/about");
  });
});

describe("buildMetadata", () => {
  it("produces canonical, openGraph, and twitter fields", () => {
    const meta = buildMetadata({
      locale: "en",
      path: "/about",
      title: "About Us",
      description: "desc",
    });
    expect(meta.title).toBe("About Us");
    expect(meta.alternates?.canonical).toBe("https://www.ktdoctor.com/about");
    expect(meta.openGraph?.url).toBe("https://www.ktdoctor.com/about");
    expect(meta.openGraph?.siteName).toBe("Kids & Teens Medical Group");
    expect((meta.twitter as { card?: string })?.card).toBe("summary_large_image");
  });
  it("sets es_ES locale for Spanish", () => {
    const meta = buildMetadata({ locale: "es", path: "/", title: "t", description: "d" });
    expect(meta.openGraph?.locale).toBe("es_ES");
  });
  it("attaches the localized default OG image for pages without a dedicated one", () => {
    const meta = buildMetadata({ locale: "es", path: "/about", title: "t", description: "d" });
    const images = (meta.openGraph as { images?: unknown[] })?.images;
    expect(images).toEqual(["https://www.ktdoctor.com/es/opengraph-image"]);
    expect((meta.twitter as { images?: unknown[] })?.images).toEqual([
      "https://www.ktdoctor.com/es/opengraph-image",
    ]);
  });
  it("omits images when the route has its own opengraph-image (dedicatedOgImage)", () => {
    const meta = buildMetadata({
      locale: "en",
      path: "/doctors/x",
      title: "t",
      description: "d",
      dedicatedOgImage: true,
    });
    expect((meta.openGraph as { images?: unknown[] })?.images).toBeUndefined();
    expect((meta.twitter as { images?: unknown[] })?.images).toBeUndefined();
  });
});

describe("parseAddress", () => {
  it("splits a well-formed US address", () => {
    expect(parseAddress("5115 Clareton Dr UNIT 150, Agoura Hills, CA 91301")).toEqual({
      streetAddress: "5115 Clareton Dr UNIT 150",
      addressLocality: "Agoura Hills",
      addressRegion: "CA",
      postalCode: "91301",
      addressCountry: "US",
    });
  });
  it("falls back to the full string when it cannot parse", () => {
    expect(parseAddress("Somewhere weird")).toEqual({
      streetAddress: "Somewhere weird",
      addressCountry: "US",
    });
  });
});

describe("organizationJsonLd", () => {
  it("describes the medical organization", () => {
    const org = organizationJsonLd();
    expect(org["@type"]).toBe("MedicalOrganization");
    expect(org.url).toBe("https://www.ktdoctor.com");
    expect(org.name).toBe("Kids & Teens Medical Group");
  });
});

describe("physicianJsonLd", () => {
  it("emits a Physician with a self URL and worksFor", () => {
    const doctor = {
      id: "jane-smith",
      name: "Dr. Jane Smith",
      credentials: "MD",
      specialties: ["Pediatrics"],
      locationIds: ["arcadia"],
      photoSrc: "/doctors/jane.png",
    } as Doctor;
    const jsonld = physicianJsonLd(doctor, "en");
    expect(jsonld["@type"]).toBe("Physician");
    expect(jsonld.url).toBe("https://www.ktdoctor.com/doctors/jane-smith");
    expect(jsonld.image).toBe("https://www.ktdoctor.com/doctors/jane.png");
    expect(jsonld.worksFor.name).toBe("Kids & Teens Medical Group");
  });
});

describe("localBusinessJsonLd", () => {
  it("emits a MedicalClinic with parsed address and geo", () => {
    const location = {
      id: "arcadia",
      name: "Arcadia",
      address: "16 E Huntington Dr, Arcadia, CA 91006",
      phone: "(818) 361-5437",
      email: "arcadia@ktdoctor.com",
      extension: "060",
      lat: 34.1397,
      lng: -118.0353,
      description: "",
      hours: { officeHours: "", telehealthHours: "" },
      photos: ["/locations/arcadia/1.png"],
    } as Location;
    const jsonld = localBusinessJsonLd(location, "es");
    expect(jsonld["@type"]).toBe("MedicalClinic");
    expect(jsonld.url).toBe("https://www.ktdoctor.com/es/locations/arcadia");
    expect(jsonld.address.addressLocality).toBe("Arcadia");
    expect(jsonld.geo?.latitude).toBe(34.1397);
    expect(jsonld.image).toBe("https://www.ktdoctor.com/locations/arcadia/1.png");
  });
});

describe("articleJsonLd", () => {
  it("emits an Article with an ISO date and localized headline", () => {
    const story = {
      id: "x",
      title: "English Title",
      titleEs: "Titulo",
      date: "April 5, 2024",
      imageSrc: "/blog-x.png",
      excerpt: "en",
      excerptEs: "es",
      sections: [],
    };
    const jsonld = articleJsonLd(story, "es");
    expect(jsonld["@type"]).toBe("Article");
    expect(jsonld.headline).toBe("Titulo");
    expect(jsonld.datePublished).toBe("2024-04-05");
    expect(jsonld.image).toBe("https://www.ktdoctor.com/blog-x.png");
  });
});

describe("breadcrumbJsonLd", () => {
  it("numbers items from 1 and builds absolute URLs", () => {
    const jsonld = breadcrumbJsonLd(
      [
        { name: "Home", path: "/" },
        { name: "Doctors", path: "/doctors" },
      ],
      "en"
    );
    expect(jsonld.itemListElement[1]).toMatchObject({
      position: 2,
      name: "Doctors",
      item: "https://www.ktdoctor.com/doctors",
    });
  });
});

describe("faqPageJsonLd", () => {
  it("emits Spanish questions/answers when locale is es", () => {
    const faqs = [
      { id: "a", question: "Q", questionEs: "P", answer: "A", answerEs: "R" },
    ];
    const jsonld = faqPageJsonLd(faqs, "es");
    expect(jsonld["@type"]).toBe("FAQPage");
    expect(jsonld.mainEntity[0].name).toBe("P");
    expect(jsonld.mainEntity[0].acceptedAnswer.text).toBe("R");
  });
});
