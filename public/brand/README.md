# Kids & Teens Medical Group logo assets

Transparent-background logo files for the website, email signatures, print
and partner use. Generated from the vector master `public/clinic-logo.svg`;
do not hand-edit the PNGs, regenerate them from the SVG instead.

## Files

| File | Use on |
| --- | --- |
| `kt-crest-light-bg.*` | White or light backgrounds. Crest only, the original colours. |
| `kt-crest-dark-bg.*` | Black, navy or any dark background. The "Kids & Teens" script is white; the silhouettes and MEDICAL GROUP lettering stay dark because they sit on the pale shield and gold ribbon. |
| `kt-lockup-light-bg.*` | Light backgrounds, crest plus the "Largest Pediatric Medical Group in California" tagline. |
| `kt-lockup-dark-bg.*` | Dark backgrounds, crest plus tagline. |

Each variant ships as:

- `.svg`: vector, scales to any size. Use on the web and in print.
- `-1600w.png`: print, posters, slide decks.
- `-600w.png`: web and social.
- `-200w.png`: email signatures (Gmail, Outlook, RingCentral).

All PNGs have a transparent background, so the page or email colour shows
through. Pick the `light-bg` or `dark-bg` variant to match what sits behind
the logo. Never place `light-bg` on black or `dark-bg` on white: the script
lettering disappears.

## Email signature

Use `kt-crest-dark-bg-200w.png` on dark signature blocks and
`kt-crest-light-bg-200w.png` on white ones. Set the image to 100 to 120 px
wide in the signature editor; the file is sized at 200 px so it stays sharp
on high-density screens.

## Regenerating

The crest is the master SVG with its viewBox narrowed to `0 0 151 123.555`.
The dark variants recolour the script lettering (the last ten `#231F20`
fills in the file) and the fill-less tagline paths to white. Everything else
is untouched.
