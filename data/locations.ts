import type { Location } from "@/lib/types";

// "telehealth" (added 2026-07-17) is not a physical clinic — Healow's live booking system
// confirmed one provider (Trish Reyes) is telehealth-only with no in-person clinic. It
// intentionally has no lat/lng so LocationsMap skips it instead of plotting a fake pin.

// Lat/lng below are city-level approximations (not exact street precision) —
// flagged in the spec as needing refinement via the Google Geocoding API
// before production launch. "La Mirada" email/extension values follow the
// {cityslug}@ktdoctor.com pattern used everywhere else but were not directly
// confirmed on the real /directory/ page — confirm with the client before
// launch.
//
// description/hours/photos below were captured from the real, individual
// location pages at www.ktdoctor.com/locations/<slug>/ ("Meet Our Providers"
// pages). That scrape also surfaced three real address corrections vs. the
// previous data here (Downey, Mission Hills suite number, and Santa Monica
// moved to a new address), and confirmed a real "Hollywood" location that
// replaces the old unconfirmed "west-la" placeholder entry — its extension
// is not confirmed (no Healow deep-link code was found for it on the real
// site) and is left blank pending confirmation from the client.
export const locations: Location[] = [
  {
    id: "agoura-hills",
    name: "Agoura Hills",
    address: "5115 Clareton Dr UNIT 150, Agoura Hills, CA 91301",
    phone: "(818) 361-5437",
    email: "agourahills@ktdoctor.com",
    extension: "207",
    lat: 34.1361,
    lng: -118.7615,
    description:
      "Located on Clareton Drive in Agoura Hills, California, Kids & Teens Medical Group is a general pediatrics practice specializing in newborn care, well-child exams, and adolescent medicine. The team of board-certified pediatricians also diagnoses and treats common pediatric health conditions, including asthma, autism, and allergies, taking an integrated and evidence-based approach to care with a focus on child health and well-being, vaccinations, and nutrition services. Kids & Teens Medical Group offers health care services seven days a week, including after-hours care and extended evening appointments through their telehealth service.",
    hours: { officeHours: "Monday-Friday, 9AM-6PM", telehealthHours: "Monday-Sunday, 9AM-8PM" },
    photos: ["/locations/agoura-hills/1.png", "/locations/agoura-hills/2.png", "/locations/agoura-hills/3.png"],
  },
  {
    id: "arcadia",
    name: "Arcadia",
    address: "16 E Huntington Dr, Arcadia, CA 91006",
    phone: "(818) 361-5437",
    email: "arcadia@ktdoctor.com",
    extension: "060",
    lat: 34.1397,
    lng: -118.0353,
    description:
      "A general pediatrics practice specializing in newborn care, well-child exams, and adolescent medicine. The board-certified pediatricians diagnose and treat common pediatric health conditions, including asthma, autism, and allergies, with an integrated and evidence-based approach to care focused on child health and well-being, vaccinations, and nutrition services. Health care is available seven days a week, including after-hours care and extended evening telehealth appointments.",
    hours: { officeHours: "Monday-Friday, 9AM-6PM", telehealthHours: "Monday-Sunday, 9AM-8PM" },
    photos: ["/locations/arcadia/1.png", "/locations/arcadia/2.png", "/locations/arcadia/3.png"],
  },
  {
    id: "beverly-hills",
    name: "Beverly Hills",
    address: "8733 Beverly Blvd # 200, West Hollywood, CA 90048",
    phone: "(818) 361-5437",
    email: "beverlyhills@ktdoctor.com",
    extension: "115",
    lat: 34.0836,
    lng: -118.3762,
    description:
      "The highest quality of general pediatric care, with board-certified pediatricians using an integrated and evidence-based approach. Services include newborn care, well-child exams, physicals, adolescent medicine, pediatric infectious disease, asthma, and allergies. Extended hours include telehealth services to serve the Greater Los Angeles area.",
    hours: { officeHours: "Monday-Friday, 9AM-6PM", telehealthHours: "Monday-Sunday, 9AM-8PM" },
    photos: ["/locations/beverly-hills/1.png", "/locations/beverly-hills/2.png", "/locations/beverly-hills/3.png"],
  },
  {
    id: "camarillo",
    name: "Camarillo",
    address: "2486 Ponderosa Dr. N., Suite D-211, Camarillo, CA 93010",
    phone: "(818) 361-5437",
    email: "camarillo@ktdoctor.com",
    extension: "469",
    lat: 34.2164,
    lng: -119.0376,
    description:
      "The highest quality of general pediatric care, with board-certified pediatricians providing comprehensive newborn care, well-child exams, and physicals. Services include adolescent medicine, pediatric infectious disease, asthma, and allergies, with extended hours and seven-day-a-week telehealth availability.",
    hours: { officeHours: "Monday-Friday, 9AM-6PM", telehealthHours: "Monday-Sunday, 9AM-8PM" },
    photos: ["/locations/camarillo/1.png", "/locations/camarillo/2.png", "/locations/camarillo/3.png"],
  },
  {
    id: "canyon-country",
    name: "Canyon Country",
    address: "20655 Soledad Canyon Rd Suite 25, Canyon Country, CA 91351",
    phone: "(818) 361-5437",
    email: "canyoncountry@ktdoctor.com",
    extension: "014",
    lat: 34.4237,
    lng: -118.4873,
    description:
      "A general pediatrics practice specializing in newborn care, well-child exams, and adolescent medicine. The board-certified pediatricians diagnose and treat common pediatric health conditions, including asthma, autism, and allergies, with an integrated, evidence-based approach and vaccination and nutrition services. Extended hours include after-hours care and evening telehealth appointments.",
    hours: { officeHours: "Monday-Friday, 9AM-6PM", telehealthHours: "Monday-Sunday, 9AM-8PM" },
    photos: ["/locations/canyon-country/1.png", "/locations/canyon-country/2.png", "/locations/canyon-country/3.png"],
  },
  {
    id: "culver-city",
    name: "Culver City",
    address: "3831 Hughes Ave #602, Culver City, CA 90232",
    phone: "(818) 361-5437",
    email: "culvercity@ktdoctor.com",
    extension: "073",
    lat: 34.0211,
    lng: -118.3965,
    description:
      "General pediatrics, including newborn care, adolescent medicine, well-child exams, and specialized physicals for sports and school, as well as common pediatric health conditions like asthma and allergies. After-hours care and telehealth appointments are available seven days a week.",
    hours: { officeHours: "Monday-Friday, 9AM-6PM", telehealthHours: "Monday-Sunday, 9AM-8PM" },
    photos: ["/locations/culver-city/1.png", "/locations/culver-city/2.png", "/locations/culver-city/3.png"],
  },
  {
    id: "downey",
    name: "Downey",
    // Real address corrected from a scrape of the live location page — the
    // previous entry here (11525 Brookshire Ave STE 302) no longer matches
    // the site.
    address: "8201 4th St, Downey, CA 90241",
    phone: "(818) 361-5437",
    email: "downey@ktdoctor.com",
    extension: "079",
    lat: 33.9401,
    lng: -118.1332,
    description:
      "A general pediatrics practice specializing in newborn care, well-child exams, and adolescent medicine, treating common pediatric conditions including asthma, autism, and allergies with an integrated, evidence-based approach, vaccinations, and nutrition services. Care is available seven days a week, including after-hours care and extended evening telehealth appointments.",
    hours: {
      officeHours: "Monday-Friday, 9AM-6PM; Saturday, 8AM-4PM",
      telehealthHours: "Monday-Sunday, 9AM-8PM",
    },
    photos: ["/locations/downey/1.jpg", "/locations/downey/2.jpg", "/locations/downey/3.jpg"],
  },
  {
    id: "glendale",
    name: "Glendale",
    address: "1530 E Chevy Chase Dr Ste 202, Glendale, CA 91206",
    phone: "(818) 361-5437",
    email: "glendale@ktdoctor.com",
    extension: "239",
    lat: 34.1425,
    lng: -118.2551,
    description:
      "The highest quality of general pediatric care, with comprehensive newborn care, well-child exams, and physicals. The team specializes in adolescent medicine, pediatric infectious disease, asthma, and allergies, offering care seven days a week with extended telehealth hours.",
    hours: { officeHours: "Monday-Friday, 9AM-6PM", telehealthHours: "Monday-Sunday, 9AM-8PM" },
    photos: ["/locations/glendale/1.png", "/locations/glendale/2.png", "/locations/glendale/3.png"],
  },
  {
    id: "hollywood",
    name: "Hollywood",
    // Real location confirmed from the live site at
    // /locations/hollywood-clinic/ — replaces the previous unconfirmed
    // "west-la" placeholder entry. Extension is not confirmed: no
    // Healow deep-link code was found for this location on the real site.
    address: "5255 W Sunset Blvd, Los Angeles, CA 90027",
    phone: "(818) 361-5437",
    email: "hollywood@ktdoctor.com",
    extension: "",
    lat: 34.0983,
    lng: -118.308,
    description:
      "The highest quality of general pediatric care, with comprehensive newborn care, well-child exams, and physicals. The team specializes in adolescent medicine, pediatric infectious disease, asthma, and allergies, operating seven days a week with extended telehealth hours.",
    hours: { officeHours: "Monday-Friday, 8:30AM-5PM", telehealthHours: "Monday-Sunday, 9AM-8PM" },
    photos: ["/locations/hollywood/1.png", "/locations/hollywood/2.png"],
  },
  {
    id: "la-canada",
    name: "La Cañada",
    address: "1021 Foothill Blvd, La Canada Flintridge, CA 91011",
    phone: "(818) 361-5437",
    email: "lacanada@ktdoctor.com",
    extension: "841",
    lat: 34.2064,
    lng: -118.2001,
    description:
      "Comprehensive primary pediatric care for infants, children, and teens, specializing in newborn care, adolescent medicine, and pediatric infectious disease, along with well-child exams, vaccinations, sports and school physicals, and nutrition services.",
    hours: { officeHours: "Monday-Friday, 9AM-6PM", telehealthHours: "Monday-Sunday, 9AM-8PM" },
    photos: ["/locations/la-canada/1.png", "/locations/la-canada/2.png", "/locations/la-canada/3.png"],
  },
  {
    id: "mission-hills",
    name: "Mission Hills",
    // Suite number corrected from the live location page (previously
    // recorded as #200).
    address: "10200 Sepulveda Blvd #220, Mission Hills, CA 91345",
    phone: "(818) 361-5437",
    email: "missionhills@ktdoctor.com",
    extension: "195",
    lat: 34.2695,
    lng: -118.4595,
    description:
      "Board-certified pediatricians providing attentive and integrated patient-focused care, specializing in general pediatrics, including newborn care, adolescent medicine, well-child exams, and specialized physicals for sports and school, and treating conditions like asthma and allergies. Open seven days a week with after-hours care and telehealth appointments.",
    hours: { officeHours: "Monday-Friday, 9AM-6PM", telehealthHours: "Monday-Sunday, 9AM-8PM" },
    photos: ["/locations/mission-hills/1.png", "/locations/mission-hills/2.png", "/locations/mission-hills/3.png"],
  },
  {
    id: "northridge",
    name: "Northridge",
    address: "8628 Reseda Blvd, Northridge, CA 91324",
    phone: "(818) 361-5437",
    email: "northridge@ktdoctor.com",
    extension: "713",
    lat: 34.2381,
    lng: -118.5364,
    description:
      "High-quality primary care for pediatric patients, with board-certified pediatricians offering well-child exams, newborn care, sick visits, and urgent care. The team specializes in autism, asthma, and allergies, with a pediatric infectious disease expert on staff, plus extended evening telehealth hours.",
    hours: { officeHours: "Monday-Friday, 9AM-6PM", telehealthHours: "Monday-Sunday, 9AM-8PM" },
    photos: ["/locations/northridge/1.jpg", "/locations/northridge/2.jpg", "/locations/northridge/3.jpg"],
  },
  {
    id: "pasadena",
    name: "Pasadena",
    address: "504 S Sierra Madre Blvd, Pasadena, CA 91107",
    phone: "(626) 655-4041",
    email: "pasadena@ktdoctor.com",
    extension: "118",
    lat: 34.1478,
    lng: -118.1445,
    description:
      "Attentive and comprehensive care for infants, children, and teens, with integrated care for well-child exams, sick visits, and after-hours services, specializing in diagnosing and treating common pediatric health conditions like asthma, autism, and allergies.",
    hours: { officeHours: "Monday-Friday, 9AM-6PM", telehealthHours: "Monday-Sunday, 9AM-8PM" },
    photos: ["/locations/pasadena/1.png", "/locations/pasadena/2.png", "/locations/pasadena/3.png"],
  },
  {
    id: "pico-rivera",
    name: "Pico Rivera",
    address: "8337 Telegraph Rd #119, Pico Rivera, CA 90660",
    phone: "(818) 361-5437",
    email: "picorivera@ktdoctor.com",
    extension: "191",
    lat: 33.9836,
    lng: -118.0967,
    description:
      "Attentive and integrated patient-focused care specializing in general pediatrics, including newborn care, adolescent medicine, well-child exams, and specialized physicals for sports and school, treating conditions like asthma and allergies. Open seven days a week with after-hours care and telehealth options.",
    hours: { officeHours: "Monday-Friday, 9AM-6PM", telehealthHours: "Monday-Sunday, 9AM-8PM" },
    photos: ["/locations/pico-rivera/1.png", "/locations/pico-rivera/2.png", "/locations/pico-rivera/3.png"],
  },
  {
    id: "san-fernando",
    name: "San Fernando",
    address: "777 Truman St. Suite 105, San Fernando, CA 91340",
    phone: "(818) 361-5437",
    email: "sanfernando@ktdoctor.com",
    extension: "774",
    lat: 34.2817,
    lng: -118.4392,
    description:
      "Expert pediatrics care from board-certified providers, focused on promoting health and well-being across newborn through adolescent ages, providing vaccinations and nutrition services and specializing in allergies, asthma, and ADHD management.",
    hours: { officeHours: "Monday-Friday, 9AM-6PM", telehealthHours: "Monday-Sunday, 9AM-8PM" },
    photos: ["/locations/san-fernando/1.png", "/locations/san-fernando/2.png", "/locations/san-fernando/3.png"],
  },
  {
    id: "santa-monica",
    name: "Santa Monica",
    // Real address corrected from a scrape of the live location page — the
    // previous entry here (3200 Santa Monica Blvd UNIT 204) no longer
    // matches the site.
    address: "2221 Lincoln Blvd #200, Santa Monica, CA 90405",
    phone: "(310) 234-0300",
    email: "santamonica@ktdoctor.com",
    extension: "059",
    lat: 34.0089,
    lng: -118.4649,
    description:
      "Board-certified pediatricians specializing in general pediatrics, including newborn care, adolescent medicine, well-child exams, and specialized physicals for sports and school, and treating common pediatric health conditions like asthma and allergies. After-hours care and telehealth appointments are available seven days a week.",
    hours: { officeHours: "Monday-Friday, 9AM-6PM", telehealthHours: "Monday-Sunday, 9AM-8PM" },
    photos: ["/locations/santa-monica/1.png", "/locations/santa-monica/2.png", "/locations/santa-monica/3.png"],
  },
  {
    id: "san-pedro",
    name: "San Pedro",
    address: "887 W 9th St, San Pedro, CA 90731",
    phone: "(818) 361-5437",
    email: "sanpedro@ktdoctor.com",
    extension: "443",
    lat: 33.7361,
    lng: -118.2922,
    description:
      "The highest quality of general pediatric care, with board-certified pediatricians using an integrated and evidence-based approach. Services include comprehensive newborn care, well-child exams, and physicals, with specializations in adolescent medicine, pediatric infectious disease, asthma, and allergies.",
    hours: { officeHours: "Monday-Friday, 9AM-6PM", telehealthHours: "Monday-Sunday, 9AM-8PM" },
    photos: ["/locations/san-pedro/1.png", "/locations/san-pedro/2.png", "/locations/san-pedro/3.png"],
  },
  {
    id: "tarzana",
    name: "Tarzana",
    address: "18372 Clark St #226, Tarzana, CA 91356",
    phone: "(818) 361-5437",
    email: "tarzana@ktdoctor.com",
    extension: "136",
    lat: 34.173,
    lng: -118.5537,
    description:
      "The highest quality of general pediatric care, with board-certified pediatricians providing comprehensive newborn care, well-child exams, and physicals. The team specializes in adolescent medicine, pediatric infectious disease, asthma, and allergies, offering care seven days a week with telehealth access.",
    hours: { officeHours: "Monday-Friday, 9AM-6PM", telehealthHours: "Monday-Sunday, 9AM-8PM" },
    photos: ["/locations/tarzana/1.png", "/locations/tarzana/2.png", "/locations/tarzana/3.png"],
  },
  {
    id: "torrance",
    name: "Torrance",
    address: "3524 Torrance Blvd Suite 101, Torrance, CA 90503",
    phone: "(818) 361-5437",
    email: "torrance@ktdoctor.com",
    extension: "247",
    lat: 33.8358,
    lng: -118.3406,
    description:
      "The highest quality of general pediatric care, with board-certified pediatricians employing an integrated and evidence-based approach, providing comprehensive newborn care, well-child exams, and physicals. Specializations include adolescent medicine, pediatric infectious disease, asthma, and allergies, with care seven days a week and extended telehealth hours.",
    hours: { officeHours: "Monday-Friday, 9AM-6PM", telehealthHours: "Monday-Sunday, 9AM-8PM" },
    photos: ["/locations/torrance/1.png", "/locations/torrance/2.png", "/locations/torrance/3.png"],
  },
  {
    id: "valencia",
    name: "Valencia",
    address: "24330 McBean Pkwy, Valencia, CA 91355",
    phone: "(818) 361-5437",
    email: "valencia@ktdoctor.com",
    extension: "026",
    lat: 34.4211,
    lng: -118.5542,
    description:
      "A general pediatrics practice specializing in newborn care, well-child exams, and adolescent medicine, diagnosing and treating common pediatric health conditions including asthma, autism, and allergies with an integrated, evidence-based approach, vaccinations, and nutrition services.",
    hours: { officeHours: "Monday-Friday, 9AM-6PM", telehealthHours: "Monday-Sunday, 9AM-8PM" },
    photos: ["/locations/valencia/1.png", "/locations/valencia/2.png", "/locations/valencia/3.png"],
  },
  {
    id: "van-nuys",
    name: "Van Nuys",
    address: "14426 Gilmore St Suite B, Van Nuys, CA 91401",
    phone: "(818) 361-5437",
    email: "vannuys@ktdoctor.com",
    extension: "302",
    lat: 34.1866,
    lng: -118.4487,
    description:
      "Primary care services for infants, children, and teens, handling all aspects of a child's health needs, from well-child exams to sick visits to vaccinations, specializing in conditions like asthma, allergies, and autism, with care available seven days a week including extended telehealth hours.",
    hours: { officeHours: "Monday-Friday, 9AM-6PM", telehealthHours: "Monday-Sunday, 9AM-8PM" },
    photos: ["/locations/van-nuys/1.png", "/locations/van-nuys/2.png", "/locations/van-nuys/3.png"],
  },
  {
    id: "west-hills",
    name: "West Hills",
    address: "22736 Vanowen St #300, West Hills, CA 91307",
    phone: "(818) 361-5437",
    email: "westhills@ktdoctor.com",
    extension: "110",
    lat: 34.2011,
    lng: -118.6428,
    description:
      "Board-certified pediatricians providing attentive and integrated patient-focused care, specializing in general pediatrics including newborn care, adolescent medicine, well-child exams, and sports and school physicals, and treating common pediatric conditions like asthma and allergies.",
    hours: { officeHours: "Monday-Friday, 9AM-6PM", telehealthHours: "Monday-Sunday, 9AM-8PM" },
    photos: [],
  },
  {
    id: "whittier",
    name: "Whittier",
    address: "13470 Telegraph Rd, Whittier, CA 90605",
    phone: "(818) 361-5437",
    email: "whittier@ktdoctor.com",
    extension: "103",
    lat: 33.9792,
    lng: -118.0328,
    description:
      "An integrated approach to care, providing expert newborn care, well-child exams, vaccinations, sick visits, and urgent care. Board-certified pediatricians specialize in adolescent medicine, nutrition, and treating conditions including autism, asthma, and allergies, with care available seven days a week and extended telehealth hours.",
    hours: { officeHours: "Monday-Friday, 9AM-6PM", telehealthHours: "Monday-Sunday, 9AM-8PM" },
    photos: ["/locations/whittier/1.png", "/locations/whittier/2.png", "/locations/whittier/3.png"],
  },
  {
    id: "la-mirada",
    name: "La Mirada",
    address: "12675 La Mirada Blvd, #200, La Mirada, CA 90638",
    phone: "(714) 979-3917",
    email: "lamirada@ktdoctor.com",
    extension: "205",
    lat: 33.9172,
    lng: -118.012,
    description:
      "A general pediatrics practice offering newborn care, well-child exams, and adolescent medicine, diagnosing and treating conditions including asthma, autism, and allergies with an integrated, evidence-based approach, vaccination, and nutrition services.",
    hours: { officeHours: "Monday-Friday, 9AM-6PM", telehealthHours: "Monday-Sunday, 9AM-8PM" },
    photos: ["/locations/la-mirada/1.png", "/locations/la-mirada/2.jpg", "/locations/la-mirada/3.jpg"],
  },
  {
    id: "telehealth",
    name: "Telehealth",
    address: "Video visits only — no physical address",
    phone: "(818) 361-5437",
    email: "customerservice@ktdoctor.com",
    extension: "",
    description:
      "Video visits with select Kids & Teens Medical Group providers, for patients who prefer or need a remote appointment instead of an in-person clinic visit.",
    hours: { officeHours: "By appointment", telehealthHours: "Monday-Sunday, 9AM-8PM" },
    photos: [],
  },
];
