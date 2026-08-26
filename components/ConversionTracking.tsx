"use client";

import { useEffect } from "react";
import { conversionActionForLink, trackConversion } from "@/lib/gtag";

/**
 * Reports contact and booking link clicks to Google Ads.
 *
 * One delegated listener on the document covers every tel:, sms:, WhatsApp and
 * healow booking link on the site. Those links live in a dozen components,
 * most of them server components, so per-link onClick handlers would mean
 * turning large parts of the tree into client components purely for tracking.
 */
export function ConversionTracking() {
  useEffect(() => {
    function handleClick(event: MouseEvent) {
      const link = (event.target as Element | null)?.closest?.("a");
      if (!link) return;
      const action = conversionActionForLink(link.getAttribute("href") ?? "");
      if (action) trackConversion(action);
    }

    // Capture phase, so the conversion is recorded even if something further
    // down stops the event from bubbling.
    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, []);

  return null;
}
