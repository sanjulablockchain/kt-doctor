# Locations map — free, keyless Google Maps embed

The locations page map is a plain `<iframe>`. It needs **no API key and no billing**.

## It already works — no setup required

By default the map searches Google Maps for **"Kids & Teens Medical Group"** and
shows the group's indexed clinic pins across Greater LA. This works out of the box
with zero configuration, no Google account, and no cost.

**Trade-off:** the pins come from Google's own business listing, so you don't control
exactly which locations appear or their precision — Google shows what it has indexed
(most of the clinics, at business-listing accuracy). If that's good enough, you're
done. If you want an exact, hand-curated set of all 23 pins, use the optional My Maps
override below.

## Optional: curate exact pins with Google My Maps

This gives you full control over the pins, but **requires a Google account** to create
and host the map.

### 1. Create the map and import the clinics

1. Go to <https://www.google.com/mymaps> and sign in with the Google account that
   should own the map (ideally a company account, not a personal one).
2. Click **Create a new map**.
3. In the map's left panel, click **Import** under the untitled layer.
4. Upload **`docs/locations-mymaps-import.csv`** (in this repo).
5. When asked **"Choose columns to position your placemarks"**, tick **Latitude** and
   **Longitude**.
6. When asked **"Choose a column to title your markers"**, pick **Name**.

All 23 physical clinics drop onto the map as pins. (The telehealth entry has no
address, so it's intentionally excluded from the CSV.)

7. Give the map a title and, optionally, style the pins.

### 2. Make it public

1. Click **Share** (or the ⋮ menu → Share).
2. Set access to **"Anyone with this link can view"** — otherwise the embed shows a
   "you need permission" error.

### 3. Get the embed URL

1. Open the map's **⋮ menu** (top-left, next to the title) → **Embed on my site**.
2. Copy the URL inside `src="..."`. It looks like:
   ```
   https://www.google.com/maps/d/embed?mid=1AbCdEfGhIjKlMnOpQrStUvWxYz
   ```

### 4. Configure the app

1. Copy `.env.local.example` to `.env.local` if you haven't already.
2. Add the override:
   ```
   NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL=https://www.google.com/maps/d/embed?mid=YOUR_MAP_ID
   ```
3. Restart `npm run dev`. This is a `NEXT_PUBLIC_` variable — Next.js inlines it at
   build time, so a running dev server won't pick up the change until restarted, and
   production reads it at `next build` time.

## Hiding the map entirely

Set the override to an empty string to replace the map with the clinic-address list:
```
NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL=
```

## Keeping the CSV in sync

`docs/locations-mymaps-import.csv` was generated from `data/locations.ts`. If clinics
change there, regenerate the CSV and re-import it into the same My Maps (delete the old
imported layer first). Ask Claude to regenerate it from the current data.

## Why not the official Google APIs?

This replaced an `@react-google-maps/api` (JavaScript API) integration that required a
billed API key. Both the default business search and the My Maps embed are keyless and
free; the cost is that pins aren't wired to the app's "View details" links — the full
list view already provides that detail.
