import type { ReactElement } from "react";

/**
 * Renders a JSON-LD structured-data block. `<` is escaped so a string value can
 * never break out of the <script> element. `data` is always our own trusted
 * structured-data object, never user-supplied HTML.
 */
export function JsonLd({ data }: { data: object }): ReactElement {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
