import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  output: "standalone",
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
  experimental: {
    turbopackFileSystemCacheForDev: false,
    serverActions: {
      bodySizeLimit: "6mb",
    },
  },
  async redirects() {
    return [
      // Locations: old WordPress slugs were longer than the new site's.
      { source: "/agoura-hills-pediatrician", destination: "/locations/agoura-hills", permanent: true },
      { source: "/arcadia-clinic", destination: "/locations/arcadia", permanent: true },
      { source: "/beverly-hills-clinic", destination: "/locations/beverly-hills", permanent: true },
      { source: "/camarillo-pediatric-clinic", destination: "/locations/camarillo", permanent: true },
      { source: "/canyon-country-pediatric-clinic", destination: "/locations/canyon-country", permanent: true },
      { source: "/culver-city-pediatric-clinic", destination: "/locations/culver-city", permanent: true },
      { source: "/downey", destination: "/locations/downey", permanent: true },
      { source: "/glendale-pediatric-clinic", destination: "/locations/glendale", permanent: true },
      { source: "/hollywood-clinic", destination: "/locations/hollywood", permanent: true },
      { source: "/la-canada-flintridge", destination: "/locations/la-canada", permanent: true },
      { source: "/mission-hills", destination: "/locations/mission-hills", permanent: true },
      { source: "/northridge", destination: "/locations/northridge", permanent: true },
      { source: "/pasadena", destination: "/locations/pasadena", permanent: true },
      { source: "/pico-rivera-pediatric-clinic", destination: "/locations/pico-rivera", permanent: true },
      { source: "/san-fernando-pediatric-clinic", destination: "/locations/san-fernando", permanent: true },
      { source: "/santa-monica-pediatric-clinic", destination: "/locations/santa-monica", permanent: true },
      { source: "/san-pedro-pediatric-clinic", destination: "/locations/san-pedro", permanent: true },
      { source: "/tarzana-pediatric-clinic", destination: "/locations/tarzana", permanent: true },
      { source: "/torrance-pediatric-clinic", destination: "/locations/torrance", permanent: true },
      { source: "/valencia-pediatric-clinic", destination: "/locations/valencia", permanent: true },
      { source: "/van-nuys-pediatric-clinic", destination: "/locations/van-nuys", permanent: true },
      { source: "/west-hills-pediatric-clinic", destination: "/locations/west-hills", permanent: true },
      {
        source: "/whittier-pediatric-clinic-whitter-telehealth-kidsandteens",
        destination: "/locations/whittier",
        permanent: true,
      },
      { source: "/la-mirada-clinic", destination: "/locations/la-mirada", permanent: true },
      { source: "/directory", destination: "/locations", permanent: true },

      // Services that were renamed, not just moved.
      { source: "/services/telemedicine-for-children", destination: "/services/telehealth", permanent: true },
      { source: "/services/new-born-care-clinic", destination: "/services/newborn-care", permanent: true },
      { source: "/services/circumcision", destination: "/services/circumcisions", permanent: true },
      { source: "/services/sick-visit-pediatric-clinic", destination: "/services/sick-visits", permanent: true },
      { source: "/services/walk-in-visits-pediatric-clinic", destination: "/services/walk-ins", permanent: true },
      { source: "/services/asthma-and-allergy-center", destination: "/services/asthma-allergy-center", permanent: true },
      { source: "/services/school-physicals", destination: "/services/physicals", permanent: true },
      { source: "/services/sports-physicals", destination: "/services/physicals", permanent: true },
      { source: "/services/well-visit-checkups", destination: "/services/well-child-exam", permanent: true },
      { source: "/urgent-care", destination: "/services", permanent: true },

      // Services with no new-site equivalent (content gap): land on the services hub for now.
      { source: "/services/ear-infections", destination: "/services", permanent: true },
      { source: "/services/reflux", destination: "/services", permanent: true },
      { source: "/services/colic", destination: "/services", permanent: true },
      { source: "/services/cough-cold", destination: "/services", permanent: true },
      { source: "/services/diarrhea-vomiting", destination: "/services", permanent: true },
      { source: "/services/fever", destination: "/services", permanent: true },
      { source: "/services/rashes", destination: "/services", permanent: true },
      { source: "/services/strep-throat-sore-throat", destination: "/services", permanent: true },
      { source: "/services/urinary-tract-infections", destination: "/services", permanent: true },
      { source: "/services/constipation-toilet-training-issues", destination: "/services", permanent: true },
      { source: "/services/infant-feeding-support", destination: "/services", permanent: true },
      { source: "/services/newborn-hearing-screening", destination: "/services", permanent: true },
      { source: "/services/ear-nose-throat-disorders", destination: "/services", permanent: true },
      { source: "/services/dermatology", destination: "/services", permanent: true },
      { source: "/services/eczema-skin-conditions", destination: "/services", permanent: true },
      { source: "/services/developmental-delays-speech-delay", destination: "/services", permanent: true },
      { source: "/services/behavioral-health", destination: "/services", permanent: true },
      { source: "/services/vaccinations", destination: "/services", permanent: true },

      // Blog posts that were recreated on the new site, just under shorter slugs.
      {
        source: "/breathe-easy-this-winter-simple-steps-to-protect-your-child-from-asthma-2",
        destination: "/blog/breathe-easy-this-winter",
        permanent: true,
      },
      {
        source: "/breathe-easy-this-winter-simple-steps-to-protect-your-child-from-asthma",
        destination: "/blog/breathe-easy-this-winter",
        permanent: true,
      },
      { source: "/halloween-safety-tips-for-parents", destination: "/blog/halloween-safety-tips", permanent: true },
      {
        source: "/the-difference-between-pediatric-emergency-room-urgent-care-in-california",
        destination: "/blog/er-vs-urgent-care",
        permanent: true,
      },

      // Blog posts with no new-site equivalent (content gap): land on the blog index for now.
      {
        source: "/the-ideal-healthcare-plan-for-families-in-los-angeles-and-why-its-often-overlooked",
        destination: "/blog",
        permanent: true,
      },
      { source: "/the-importance-of-early-childhood-education", destination: "/blog", permanent: true },
      { source: "/how-to-help-your-child-develop-healthy-habits", destination: "/blog", permanent: true },
      { source: "/what-is-pediatrics", destination: "/blog", permanent: true },
      { source: "/how-ai-can-impact-childhood-loneliness", destination: "/blog", permanent: true },
      { source: "/how-to-choose-a-pediatrician-in-2023", destination: "/blog", permanent: true },
      { source: "/understanding-childhood-developmental-milestones", destination: "/blog", permanent: true },
      { source: "/category/blog", destination: "/blog", permanent: true },

      // Other pages that just moved or were duplicated in WordPress.
      { source: "/our-doctors", destination: "/doctors", permanent: true },
      { source: "/about-kids-teens-medical-group", destination: "/about", permanent: true },
      { source: "/about-kids-teens-medical-group-2", destination: "/about", permanent: true },
      { source: "/careers-ts", destination: "/careers", permanent: true },
      { source: "/terms_and_conditions", destination: "/terms-and-conditions", permanent: true },
      { source: "/terms_and_conditions-2", destination: "/terms-and-conditions", permanent: true },
      { source: "/privacy-policy-2", destination: "/privacy-policy", permanent: true },
      { source: "/appointments-best-pediatric-doctors-los-angeles", destination: "/contact", permanent: true },
      { source: "/thanks-for-applying", destination: "/careers", permanent: true },

      // WordPress junk with no real content.
      { source: "/articles/auto-draft", destination: "/", permanent: true },
      { source: "/elementor-page-7648", destination: "/", permanent: true },
    ];
  },
};

export default withNextIntl(nextConfig);
