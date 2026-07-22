import type { Metadata } from "next";
import { LocationsPageContent } from "@/components/LocationsPageContent";

export const metadata: Metadata = {
  title: "Find a Clinic | Kids & Teens Medical Group",
  description:
    "Find one of our 25 pediatric clinics across Greater LA, with addresses, phone lines, and a live map.",
};

export default function LocationsPage() {
  return <LocationsPageContent />;
}
