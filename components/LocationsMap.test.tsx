import { describe, it, expect, vi, afterEach } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithIntl as render } from "@/lib/test-utils";

// The component reads NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL at module-evaluation
// time, so we stub the env before importing it fresh in each test via a dynamic
// import. Pass `undefined` to leave it unset and exercise the built-in default.
async function renderMap(
  overrideUrl: string | undefined,
  locations: Array<Record<string, unknown>>
) {
  if (overrideUrl !== undefined) {
    vi.stubEnv("NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL", overrideUrl);
  }
  vi.resetModules();
  const { LocationsMap } = await import("./LocationsMap");
  render(<LocationsMap locations={locations as never} />);
}

const MAP_TITLE = "Map of Kids & Teens clinic locations";

afterEach(() => {
  vi.unstubAllEnvs();
});

const alpha = {
  id: "a",
  name: "Alpha",
  address: "1 A St",
  phone: "1",
  email: "a@x.com",
  extension: "1",
  lat: 34,
  lng: -118,
  description: "",
  hours: { officeHours: "", telehealthHours: "" },
  photos: [],
};

const beta = {
  id: "b",
  name: "Beta",
  address: "2 B St",
  phone: "2",
  email: "b@x.com",
  extension: "2",
  lat: 34.1,
  lng: -118.1,
  description: "",
  hours: { officeHours: "", telehealthHours: "" },
  photos: [],
};

const telehealth = {
  id: "telehealth",
  name: "Telehealth",
  address: "Video visits only",
  phone: "",
  email: "",
  extension: "",
  description: "",
  hours: { officeHours: "", telehealthHours: "" },
  photos: [],
};

describe("LocationsMap", () => {
  it("defaults to the curated keyless My Maps embed when no override is set", async () => {
    await renderMap(undefined, [alpha, beta]);

    const iframe = screen.getByTitle(MAP_TITLE);
    expect(iframe.tagName).toBe("IFRAME");
    const src = iframe.getAttribute("src") ?? "";
    expect(src).toContain("/maps/d/embed");
    expect(src).toContain("mid=");
    // Keyless: no API key ever appears in the URL.
    expect(src).not.toContain("key=");
    // The map replaces the address fallback entirely.
    expect(screen.queryByText("1 A St")).not.toBeInTheDocument();
  });

  it("uses a My Maps override URL when one is configured", async () => {
    const url = "https://www.google.com/maps/d/embed?mid=TEST_MAP_ID";
    await renderMap(url, [alpha, beta]);

    const iframe = screen.getByTitle(MAP_TITLE);
    expect(iframe).toHaveAttribute("src", url);
    expect(iframe).toHaveAttribute("loading", "lazy");
  });

  it("falls back to a list with directions links when the embed is disabled", async () => {
    await renderMap("", [alpha, beta]);

    expect(screen.queryByTitle(MAP_TITLE)).not.toBeInTheDocument();
    expect(screen.getByText("Alpha")).toBeInTheDocument();
    expect(screen.getByText("1 A St")).toBeInTheDocument();
    const directionsLinks = screen.getAllByRole("link", { name: "Get Directions" });
    expect(directionsLinks).toHaveLength(2);
    expect(directionsLinks[0]).toHaveAttribute(
      "href",
      "https://www.google.com/maps/dir/?api=1&destination=34,-118"
    );
  });

  it("omits locations without lat/lng from the fallback list", async () => {
    await renderMap("", [alpha, telehealth]);

    expect(screen.getByText("Alpha")).toBeInTheDocument();
    expect(screen.queryByText("Telehealth")).not.toBeInTheDocument();
  });
});
