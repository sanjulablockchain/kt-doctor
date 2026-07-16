import type { Metadata } from "next";
import { serviceCategories } from "@/data/services";
import { ServiceCard } from "@/components/ServiceCard";

export const metadata: Metadata = {
  title: "Services | Kids & Teens Medical Group",
  description:
    "Comprehensive pediatric services across Kids & Teens Medical Group, from newborn care and vaccines to behavioral health and adolescent medicine.",
};

export default function ServicesPage() {
  return (
    <main className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
      <span className="font-display text-xs font-semibold uppercase tracking-wide text-teal-dark">
        What We Offer
      </span>
      <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
        Comprehensive Pediatric Care
      </h1>
      <p className="mt-2 max-w-xl text-ink-soft">
        Kids & Teens Medical Group provides exceptional healthcare tailored to the needs of
        children and adolescents, from newborn checkups to teen medicine.
      </p>

      {serviceCategories.map((category) => (
        <section key={category.id} className="mt-10">
          <h2 className="font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            {category.name}
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {category.services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
