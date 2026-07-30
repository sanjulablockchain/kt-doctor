"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

// Filenames as stored in `public/Why families choose us/` - inconsistent
// casing/naming is preserved as-is rather than renamed, since these are
// live production assets.
const SLIDE_FILENAMES = [
  "Image (1).jpg",
  "Image (2).jpg",
  "image (3) 1.jpg",
  "Image (5).jpg",
  "Image (6).jpg",
  "Image (8).jpg",
  "Image (9).jpg",
  "Image (10).jpg",
  "Image (11).jpg",
  "Image (12).jpg",
  "Image (13).jpg",
  "Image.jpg",
  "Image (3).jpg",
  "Image (4).jpg",
  "Image (7).jpg",
  "Image (14).jpg",
  "Image (15).jpg",
  "Image (16).jpg",
  "Image (17).jpg",
  "Image (18).jpg",
  "Image (19).jpg",
];

const SLIDES = SLIDE_FILENAMES.map((filename) => `/Why families choose us/${filename}`);

type WhyFamiliesSlideshowProps = {
  alt: string;
  slideLabel: (index: number, total: number) => string;
  previousSlideLabel: string;
  nextSlideLabel: string;
  wrapperClassName: string;
  intervalMs?: number;
};

export function WhyFamiliesSlideshow({
  alt,
  slideLabel,
  previousSlideLabel,
  nextSlideLabel,
  wrapperClassName,
  intervalMs = 5000,
}: WhyFamiliesSlideshowProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || isPaused) return;
    const timer = setInterval(() => {
      setActiveIndex((current) => (current + 1) % SLIDES.length);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [prefersReducedMotion, isPaused, intervalMs]);

  const goToPrevious = () => {
    setActiveIndex((current) => (current - 1 + SLIDES.length) % SLIDES.length);
  };

  const goToNext = () => {
    setActiveIndex((current) => (current + 1) % SLIDES.length);
  };

  return (
    <div
      className={`group relative overflow-hidden ${wrapperClassName}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      {SLIDES.map((src, index) => (
        <Image
          key={src}
          src={src}
          alt={alt}
          fill
          sizes="(min-width: 1024px) 45vw, 100vw"
          priority={index === 0}
          className={`absolute inset-0 h-full w-full object-cover ease-in-out ${
            prefersReducedMotion ? "duration-0" : "duration-1000 transition-opacity"
          } ${index === activeIndex ? "opacity-100" : "opacity-0"}`}
        />
      ))}

      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/45 to-transparent"
      />

      <button
        type="button"
        onClick={goToPrevious}
        aria-label={previousSlideLabel}
        className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white opacity-100 transition-opacity hover:bg-black/45 focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100"
      >
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
          <path
            d="m15 18-6-6 6-6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <button
        type="button"
        onClick={goToNext}
        aria-label={nextSlideLabel}
        className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white opacity-100 transition-opacity hover:bg-black/45 focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100"
      >
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
          <path
            d="m9 18 6-6-6-6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <div className="absolute inset-x-0 bottom-4 flex justify-center gap-2">
        {SLIDES.map((src, index) => (
          <button
            key={src}
            type="button"
            onClick={() => setActiveIndex(index)}
            aria-current={index === activeIndex}
            aria-label={slideLabel(index + 1, SLIDES.length)}
            className={`h-2 rounded-full transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
              index === activeIndex ? "w-5 bg-white" : "w-2 bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
