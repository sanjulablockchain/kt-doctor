import type { Metadata } from "next";
import { DoctorsPageContent } from "@/components/DoctorsPageContent";

export const metadata: Metadata = {
  title: "Our Doctors | Kids & Teens Medical Group",
  description:
    "Search our board-certified pediatricians across 24 Greater LA clinics. Filter by location and specialty to find the right doctor for your family.",
};

export default function DoctorsPage() {
  return <DoctorsPageContent />;
}
