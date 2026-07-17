import type { Metadata } from "next";
import { AboutPageContent } from "@/components/AboutPageContent";

export const metadata: Metadata = {
  title: "About Us | Kids & Teens Medical Group",
  description:
    "Kids & Teens Pediatric Medical Group provides compassionate, comprehensive pediatric care across Greater Los Angeles, from routine check-ups to urgent care and after-hours visits.",
};

export default function AboutPage() {
  return <AboutPageContent />;
}
