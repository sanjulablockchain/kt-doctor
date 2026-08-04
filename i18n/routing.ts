import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "es"],
  defaultLocale: "en",
  localePrefix: process.env.NEXT_PUBLIC_BASE_PATH ? "always" : "as-needed",
});
