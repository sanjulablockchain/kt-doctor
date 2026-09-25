// Each clinic's Yelp business page, provided by the client 2026-09-27
// (the "second tab" of the reviews spreadsheet, exported separately from
// the review text itself). These are business-page URLs, not links to any
// individual review, since Yelp doesn't expose per-review permalinks here.
//
// Four clinics were marked "nope" in the source sheet (no Yelp page yet)
// and simply have no entry: Camarillo, Hollywood, San Pedro, La Mirada.
// These are the same four clinics with no reviews in data/yelpReviews.ts.
//
// locationId values match data/locations.ts ids.
export const yelpLocationUrls: Record<string, string> = {
  "agoura-hills":
    "https://www.yelp.com/biz/kids-and-teens-medical-group-agoura-hills-3?osq=Kids+%26+Teens+Medical+Group+-+Agoura+Hills",
  arcadia:
    "https://www.yelp.com/biz/kids-and-teens-medical-group-arcadia-arcadia?osq=Kids+%26+Teens+Medical+Group+-+Arcadia",
  "beverly-hills":
    "https://www.yelp.com/biz/kids-and-teens-medical-group-beverly-hills-beverly-hills?osq=Kids+%26+Teens+Medical+Group+-+Beverly+Hills",
  "canyon-country":
    "https://www.yelp.com/biz/kids-and-teens-medical-group-canyon-country-canyon-country?osq=Kids+%26+Teens+Medical+Group+-+Canyon+Country",
  "culver-city":
    "https://www.yelp.com/biz/kids-and-teens-medical-group-culver-city-culver-city?osq=Kids+%26+Teens+Medical+Group+-+Culver+City",
  downey:
    "https://www.yelp.com/biz/kids-and-teens-medical-group-downey-downey?osq=Kids+%26+Teens+Medical+Group+-+Downey",
  glendale:
    "https://www.yelp.com/biz/kids-and-teens-medical-group-glendale-glendale?osq=Kids+%26+Teens+Medical+Group+-+Glendale",
  "la-canada":
    "https://www.yelp.com/biz/kids-and-teens-medical-group-la-canada-flintridge-7?osq=Kids+%26+Teens+Medical+Group+-+La+Ca%C3%B1ada",
  "mission-hills":
    "https://www.yelp.com/biz/kids-and-teens-medical-group-mission-hills-mission-hills-3?osq=Kids+%26+Teens+Medical+Group+-+Mission+Hills",
  northridge:
    "https://www.yelp.com/biz/kids-and-teens-medical-group-northridge-northridge-2?osq=Kids+%26+Teens+Medical+Group+-+Northridge",
  pasadena:
    "https://www.yelp.com/biz/kids-and-teens-medical-group-pasadena-6?osq=Kids+%26+Teens+Medical+Group+-+Pasadena",
  "pico-rivera":
    "https://www.yelp.com/biz/kids-and-teens-medical-group-pico-rivera-pico-rivera?osq=Kids+%26+Teens+Medical+Group+-+Pico+Rivera",
  "san-fernando":
    "https://www.yelp.com/biz/kids-and-teens-medical-group-san-fernando-san-fernando?osq=Kids+%26+Teens+Medical+Group+-+San+Fernando",
  "santa-monica":
    "https://www.yelp.com/biz/kids-and-teens-medical-group-santa-monica-santa-monica?osq=Kids+%26+Teens+Medical+Group+-+Santa+Monica",
  tarzana:
    "https://www.yelp.com/biz/kids-and-teens-medical-group-tarzana-tarzana?osq=Kids+%26+Teens+Medical+Group+-+Tarzana",
  torrance:
    "https://www.yelp.com/biz/kids-and-teens-medical-group-torrance-torrance-2?osq=Kids+%26+Teens+Medical+Group+-+Torrance",
  valencia:
    "https://www.yelp.com/biz/kids-and-teens-medical-group-valencia-valencia?osq=Kids+%26+Teens+Medical+Group+-+Valencia",
  "van-nuys":
    "https://www.yelp.com/biz/kids-and-teens-medical-group-van-nuys-5?osq=Kids+%26+Teens+Medical+Group+-+Van+Nuys",
  "west-hills":
    "https://www.yelp.com/biz/kids-and-teens-medical-group-west-hills-west-hills?osq=Kids+%26+Teens+Medical+Group+-+West+Hills",
  whittier:
    "https://www.yelp.com/biz/kids-and-teens-medical-group-whittier-whittier-3?osq=Kids+%26+Teens+Medical+Group+-+Whittier",
};

export function yelpUrlForLocation(locationId: string): string | undefined {
  return yelpLocationUrls[locationId];
}
