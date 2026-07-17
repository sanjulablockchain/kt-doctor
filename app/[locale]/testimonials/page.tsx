import type { Metadata } from "next";
import { TestimonialsPageContent } from "@/components/TestimonialsPageContent";

export const metadata: Metadata = {
  title: "Testimonials | Kids & Teens Medical Group",
  description:
    "Read what families are saying about Kids & Teens Medical Group, and share your own experience with our pediatric clinics across Greater LA.",
};

export default function TestimonialsPage() {
  return <TestimonialsPageContent />;
}
