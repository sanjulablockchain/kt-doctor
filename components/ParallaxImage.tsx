"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

type ParallaxImageProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  wrapperClassName: string;
  preload?: boolean;
  speed?: number;
};

export function ParallaxImage({
  src,
  alt,
  width,
  height,
  wrapperClassName,
  preload = false,
  speed = 0.2,
}: ParallaxImageProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;

    const wrapper = wrapperRef.current;
    const image = imageRef.current;
    if (!wrapper || !image) return;

    let frameId: number | null = null;

    function updatePosition() {
      frameId = null;
      if (!wrapper || !image) return;
      const wrapperRect = wrapper.getBoundingClientRect();
      const maxOffset = Math.max(0, (image.offsetHeight - wrapper.offsetHeight) / 2);
      const viewportCenter = window.innerHeight / 2;
      const wrapperCenter = wrapperRect.top + wrapperRect.height / 2;
      const rawOffset = (viewportCenter - wrapperCenter) * speed;
      const clampedOffset = Math.max(-maxOffset, Math.min(maxOffset, rawOffset));
      image.style.transform = `translateY(${clampedOffset}px)`;
    }

    function onScroll() {
      if (frameId !== null) return;
      frameId = requestAnimationFrame(updatePosition);
    }

    updatePosition();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frameId !== null) cancelAnimationFrame(frameId);
    };
  }, [speed, prefersReducedMotion]);

  return (
    <div ref={wrapperRef} className={`relative overflow-hidden ${wrapperClassName}`}>
      <Image
        ref={imageRef}
        src={src}
        alt={alt}
        width={width}
        height={height}
        preload={preload}
        className="absolute inset-x-0 -top-[8%] h-[116%] w-full object-cover"
      />
    </div>
  );
}
