@AGENTS.md

# Testing

Do not run end-to-end / manual browser verification (e.g. launching the app, Playwright, screenshots) after making changes. The user checks this manually. Only do it if the user explicitly asks for it.

Default verification method: code review + typecheck/lint/unit tests. Only reach for a browser (Playwright, dev server, screenshots) when something genuinely can't be resolved by reading the code — e.g. pixel-level visual matching against a reference image.

# UI requirements

Every UI feature or change must:
- Be fully responsive: work correctly on mobile, tablet, and desktop breakpoints.
- Support both dark mode and light mode.

# i18n

This is a bilingual site (next-intl). Any new user-facing text must be added to both `messages/en.json` and `messages/es.json`, with matching key structure in both files. Never hardcode UI copy — always route it through next-intl.

# Protected business data

Do not change values in `lib/constants.ts` (phone numbers, URLs, emails) or email-routing env vars (e.g. `CAREERS_TO`) without explicit confirmation from the user. These are live production contact/business info, not placeholders.

# Forms

Any new form must be validated with a zod schema (following the existing pattern, e.g. `lib/careersSchema.ts`), validated on both the client and the server action.

# Accessibility

- Images need meaningful `alt` text.
- Custom interactive elements need keyboard/focus support and ARIA labels where semantics aren't native.

# SEO

Every new page must include metadata (title/description/OG) consistent with the existing SEO setup and the `Seo` message namespace pattern.

# Tests

Colocate `.test.ts`/`.test.tsx` files for new components, server actions, and schemas, matching the existing test coverage pattern (unit/component level — not end-to-end, see Testing section above).

# Style

Never use the em dash (—) in generated copy, UI text, or code.
