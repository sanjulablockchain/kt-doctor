import type { Metadata } from "next";
import { networkBrands } from "@/data/network";
import { NetworkCard } from "@/components/NetworkCard";

export const metadata: Metadata = {
  title: "Our Network | Kids & Teens Medical Group",
  description:
    "Kids & Teens Medical Group, St. Gianna Medical Group, LA Intensive Pediatric Therapy, and St. Joseph Hospital Negombo: one trusted network covering pediatrics, family practice, pediatric therapy, and hospital care in Sri Lanka.",
};

export default function NetworkPage() {
  return (
    <main className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
      <span className="font-display text-xs font-semibold uppercase tracking-wide text-teal-dark">
        One Network
      </span>
      <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
        More ways to care for your family.
      </h1>
      <p className="mt-2 max-w-xl text-ink-soft">
        Kids &amp; Teens Medical Group works alongside three sister companies
        to cover family practice, pediatric therapy, and hospital care in Sri
        Lanka, all under one trusted network.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {networkBrands.map((brand) => (
          <NetworkCard key={brand.id} brand={brand} />
        ))}
      </div>
    </main>
  );
}
