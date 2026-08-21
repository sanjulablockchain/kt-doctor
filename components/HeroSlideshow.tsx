"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { ParallaxImage } from "@/components/ParallaxImage";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { withBasePath } from "@/lib/basePath";

// How long each slide holds before the crossfade starts, and how long the
// crossfade itself takes. The fade overlaps the hold, so a full loop is
// slides.length * SLIDE_HOLD_MS.
const SLIDE_HOLD_MS = 6000;
const FADE_MS = 1200;

const slides = [
  { src: "/home/hero-slide-1.jpg", altKey: "heroSlide1Alt", width: 1920, height: 947 },
  { src: "/home/hero-slide-2.jpg", altKey: "heroSlide2Alt", width: 1920, height: 1280 },
  { src: "/home/hero-slide-3.jpg", altKey: "heroSlide3Alt", width: 1920, height: 1280 },
  { src: "/home/hero-slide-4.jpg", altKey: "heroSlide4Alt", width: 1920, height: 1280 },
] as const;

/**
 * Full-bleed background slideshow for the Hero. Every slide is stacked in the
 * same box and only the active one is opaque, so advancing is a pure CSS
 * opacity crossfade with no layout work. Auto-advance is skipped entirely when
 * the visitor prefers reduced motion, leaving the first slide on screen.
 */
export function HeroSlideshow() {
  const t = useTranslations("Home");
  const prefersReducedMotion = usePrefersReducedMotion();
  const [autoIndex, setAutoIndex] = useState(0);

  // Under reduced motion the timer never runs, so pinning the rendered index to
  // the first slide also covers the case where the setting is turned on partway
  // through a rotation.
  const activeIndex = prefersReducedMotion ? 0 : autoIndex;

  useEffect(() => {
    if (prefersReducedMotion) return;

    const timerId = setInterval(() => {
      setAutoIndex((current) => (current + 1) % slides.length);
    }, SLIDE_HOLD_MS);

    return () => clearInterval(timerId);
  }, [prefersReducedMotion]);

  return (
    <div className="absolute inset-0">
      {slides.map((slide, index) => {
        const isActive = index === activeIndex;

        return (
          <div
            key={slide.src}
            // Only the visible slide is exposed; the rest would otherwise read
            // out as a pile of alt text with no visual counterpart.
            aria-hidden={!isActive}
            data-active={isActive || undefined}
            className="absolute inset-0 transition-opacity ease-in-out motion-reduce:transition-none"
            style={{ opacity: isActive ? 1 : 0, transitionDuration: `${FADE_MS}ms` }}
          >
            <ParallaxImage
              src={withBasePath(slide.src)}
              alt={t(slide.altKey)}
              width={slide.width}
              height={slide.height}
              wrapperClassName="h-full w-full"
              speed={0.12}
              preload={index === 0}
            />
          </div>
        );
      })}
    </div>
  );
}
