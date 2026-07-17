import type { Metadata } from "next";
import { ResourcesPageContent } from "@/components/ResourcesPageContent";

export const metadata: Metadata = {
  title: "Parent Resources | Kids & Teens Medical Group",
  description:
    "Vaccine schedules, patient forms, and developmental milestone guides for Kids & Teens Medical Group families.",
};

export default function ResourcesPage() {
  return <ResourcesPageContent />;
}
