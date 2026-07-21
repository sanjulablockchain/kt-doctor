"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { BOOKING_URL, MAIN_PHONE } from "@/lib/constants";

// Homepage bottom "book an appointment" banner. A fixed-navy surface (identical
// in light and dark via data-on-navy) carrying a live "same-day openings" status
// pill, the primary Healow booking CTA, and a secondary phone link. The pulsing
// dot reuses the shared `ktmg-ping` keyframe and is gated for reduced motion,
// matching ClinicNearYouCard.
export function BookingCtaBanner() {
  const t = useTranslations("Home");
  const telHref = `tel:+1${MAIN_PHONE.replace(/\D/g, "")}`;

  return (
    <div
      data-on-navy
      className="relative flex flex-col items-start gap-6 overflow-hidden rounded-3xl bg-navy px-8 py-10 text-white sm:flex-row sm:items-center sm:justify-between"
    >
      {/* Decorative corner glow — clipped by overflow-hidden so it never causes
          horizontal page scroll. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(14,143,160,0.28), transparent 65%)",
        }}
      />

      {/* Left: logo + text */}
      <div className="relative flex items-center gap-4">
        <Image
          src="/clinic-logo.svg"
          alt=""
          aria-hidden
          width={48}
          height={15}
          className="hidden h-12 w-auto brightness-0 invert sm:block"
          unoptimized
        />
        <div>
          <span className="inline-flex w-fit items-center gap-2 font-display text-[11px] font-semibold uppercase tracking-[0.16em] text-white/80">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inset-0 rounded-full bg-teal motion-reduce:hidden animate-[ktmg-ping_2.4s_ease-out_infinite]" />
              <span className="relative m-auto h-1.5 w-1.5 rounded-full bg-teal" />
            </span>
            {t("bottomCtaPill")}
          </span>
          <p className="mt-2 font-display text-xl font-bold">{t("bottomCtaHeading")}</p>
          <p className="mt-1 text-white/70">{t("bottomCtaBody")}</p>
        </div>
      </div>

      {/* Right: primary CTA + phone */}
      <div className="relative flex w-full flex-col gap-2 sm:w-auto">
        <a
          href={BOOKING_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center justify-center gap-2 rounded-full bg-teal px-7 py-3.5 text-center font-display font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5 hover:bg-teal-dark"
        >
          {t("bookAppointment")}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-4 w-4 transition-transform group-hover:translate-x-1"
          >
            <path
              d="M5 12h14m-6-6 6 6-6 6"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
        <a
          href={telHref}
          aria-label={t("bottomCtaCall", { phone: MAIN_PHONE })}
          className="inline-flex items-center justify-center gap-2 py-1 font-display text-sm font-semibold text-white/85 transition-colors hover:text-white"
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
            <path
              d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {MAIN_PHONE}
        </a>
      </div>
    </div>
  );
}
