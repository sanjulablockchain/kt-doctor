# Homepage image sources

All photos are royalty-free, downloaded and self-hosted (not hotlinked). Unsplash's
license permits free commercial use without attribution; this manifest is kept for
provenance. Crop params for Unsplash URLs: `?w=<W>&h=<H>&fit=crop&q=80&auto=format`.

## Hero slideshow

`components/HeroSlideshow.tsx` crossfades these four in order. All are resized with
`sharp` to 1920px wide, JPEG q80.

| File | Source | Description |
|------|--------|-------------|
| hero-slide-1.jpg | https://unsplash.com/photos/YGcleYb9wEQ (Hillshire Farm) | A parent and two young children in a bright kitchen (1920x947). Cropped to the top 74% of the original frame to keep the photographer's branded food packaging out of shot. |
| hero-slide-2.jpg | https://unsplash.com/photos/LOuffSFpWQI (Ta Focando) | A family of four silhouetted against a sunset in an open field (1920x1280). |
| hero-slide-3.jpg | Gemini-generated | Three generations of a family under blossoming spring trees (1920x1280). |
| hero-slide-4.jpg | https://unsplash.com/photos/ScnyD7znFTk (Javier Gonzalez Fotografo) | A family of four sitting together on a green sofa in a bright living room (1920x1280). Standard Unsplash Licence: free for commercial use, no attribution required. Replaced an earlier Vecteezy asset whose commercial licence could not be confirmed. |

## Retired

| File | Source | Description |
|------|--------|-------------|
| hero.jpg | https://images.unsplash.com/photo-1666819256222-7034f91340a7 | A family of four sitting together in a sunlit grassy field (1200x1400). No longer rendered; kept in case the slideshow is reverted. |

To swap any image, overwrite the file (keep the same filename), update the `width`/`height`
in `HeroSlideshow.tsx` if the aspect changes, and update the row above.
