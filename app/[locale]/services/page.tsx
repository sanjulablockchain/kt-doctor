import type { Metadata } from "next";
import { ServicesPageContent } from "@/components/ServicesPageContent";

export const metadata: Metadata = {
  title: "Services | Kids & Teens Medical Group",
  description:
    "Comprehensive pediatric services across Kids & Teens Medical Group, from newborn care and vaccines to behavioral health and adolescent medicine.",
};

export default function ServicesPage() {
  return <ServicesPageContent />;
}
