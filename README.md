# Kids & Teens Medical Group

The marketing site for Kids & Teens Medical Group, built with [Next.js](https://nextjs.org) (App Router), React 19, Tailwind CSS 4, and `next-intl` (English + Spanish).

## Getting Started

Install dependencies and run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser. Pages live under `app/[locale]/`; UI strings live in `messages/en.json` and `messages/es.json`.

Useful scripts:

```bash
npm run dev     # start the dev server
npm run build   # production build
npm start       # serve the production build
npm run lint    # ESLint
npm test        # Vitest unit/component tests
```

## Environment variables

Copy the example file and fill in your values:

```bash
cp .env.local.example .env.local
```

`.env.local` is gitignored and never committed. Everything works for local development without any values except the contact form, which needs the SMTP block below to actually send email.

### Contact form email (Microsoft 365 SMTP)

The `/contact` form sends messages by email through Nodemailer over SMTP. The sender and recipient are read from the environment, so they can change without code edits. On Microsoft 365 the `From` address must be the authenticated mailbox, so the visitor's address is placed in `Reply-To`.

```dotenv
# Microsoft 365 SMTP
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_SECURE=false             # STARTTLS on 587; set true only for port 465
SMTP_USER=you@ktdoctor.com    # the authenticating mailbox
SMTP_PASS=                    # mailbox password, or an App Password if 2FA is on
CONTACT_TO=you@ktdoctor.com   # where contact messages are delivered
CONTACT_FROM=you@ktdoctor.com # must equal SMTP_USER on Microsoft 365
```

If sending fails with an authentication error, the tenant likely has "Authenticated SMTP" disabled. Enable it for the mailbox (Microsoft 365 admin center > Users > mailbox > Mail > Manage email apps > Authenticated SMTP), and use an App Password if the account has 2FA.

### Careers application email

The `/careers` application form sends over the same SMTP transport as the contact form, with the applicant's CV attached, but delivers to its own inbox(es):

```dotenv
CAREERS_TO=you@ktdoctor.com                     # where job applications are delivered
# CAREERS_TO=you@ktdoctor.com,hr@ktdoctor.com   # comma-separate to deliver to more than one inbox
```

This is separate from `CAREERS_EMAILS` in `lib/constants.ts`, which is just the "prefer to email us directly" addresses shown on the page and can differ from where the form actually delivers.

### Locations map (optional)

```dotenv
# NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL=
```

A curated, keyless Google "My Maps" showing every clinic is baked in as the default, so the map works with no configuration. Set this only to point the map at a different Google "My Maps" embed URL, or set it to an empty string to hide the map and show the clinic address list instead.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [next-intl Documentation](https://next-intl.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
