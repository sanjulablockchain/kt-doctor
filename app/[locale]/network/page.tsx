import type { Metadata } from "next";
import { NetworkPageContent } from "@/components/NetworkPageContent";

export const metadata: Metadata = {
  title: "Our Network | Kids & Teens Medical Group",
  description:
    "Kids & Teens Medical Group, St. Gianna Medical Group, LA Intensive Pediatric Therapy, and St. Joseph Hospital Negombo: one trusted network covering pediatrics, family practice, pediatric therapy, and hospital care in Sri Lanka.",
};

export default function NetworkPage() {
  return <NetworkPageContent />;
}
