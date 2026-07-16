import { render } from "@testing-library/react";
import type { ReactElement } from "react";
import { NextIntlClientProvider } from "next-intl";
import enMessages from "@/messages/en.json";
import esMessages from "@/messages/es.json";

const messagesByLocale = { en: enMessages, es: esMessages } as const;

export function renderWithIntl(ui: ReactElement, locale: "en" | "es" = "en") {
  return render(
    <NextIntlClientProvider locale={locale} messages={messagesByLocale[locale]}>
      {ui}
    </NextIntlClientProvider>
  );
}
