import { describe, it, expect } from "vitest";
import { googleDirectionsUrl, appleDirectionsUrl } from "./directions";

describe("googleDirectionsUrl", () => {
  it("routes to a street address with the address percent-encoded", () => {
    expect(googleDirectionsUrl("100 Main St, Alphatown, CA 90001")).toBe(
      "https://www.google.com/maps/dir/?api=1&destination=100%20Main%20St%2C%20Alphatown%2C%20CA%2090001"
    );
  });

  it("routes to coordinates as a bare lat,lng pair", () => {
    expect(googleDirectionsUrl({ lat: 34, lng: -118 })).toBe(
      "https://www.google.com/maps/dir/?api=1&destination=34,-118"
    );
  });
});

describe("appleDirectionsUrl", () => {
  it("routes to a street address with the address percent-encoded", () => {
    expect(appleDirectionsUrl("100 Main St, Alphatown, CA 90001")).toBe(
      "https://maps.apple.com/?daddr=100%20Main%20St%2C%20Alphatown%2C%20CA%2090001&dirflg=d"
    );
  });

  it("routes to coordinates as a bare lat,lng pair", () => {
    expect(appleDirectionsUrl({ lat: 34, lng: -118 })).toBe(
      "https://maps.apple.com/?daddr=34,-118&dirflg=d"
    );
  });
});
