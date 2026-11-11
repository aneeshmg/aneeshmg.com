# Project state

A living snapshot. Edit sections in place at the end of each work session; don't append a diary.

_Last updated: 2026-11-07_

## Current focus

**Orbit is ported into `src/`** (2026-11-07) and replaces the line-art baseline. `prototype3d/` is deleted. The design is described in `docs/DESIGN.md`, and the decisions behind it in `docs/MEMORY.md`. Next: Aneesh reviews it on the dev server, then the content items below, then deploy.

## Health

| Check | Command | Last result |
|---|---|---|
| Type check + build | `npm run build` | ✅ 0 errors, 0 warnings (2026-11-07). The scene chunk is ~530 kB (~135 kB gzipped), lazy |
| Wrangler config | `npx wrangler deploy --dry-run` | ✅ reads `dist/`, no bindings (2026-10-26) |
| Browser pass | manual, Chrome | ✅ 2026-11-07, desktop 1440×728 and phone 390px: no horizontal scroll, no console errors. Checked: dark and light home sections, theme switch, section links (Lenis), dial keys, book page, 404 |
| Design detector | `impeccable detect dist/*.html` | ✅ clean after fixes; false positives ignored in `.impeccable/config.json` (2026-11-07) |
| Deploy | `npm run deploy` | Not deployed yet |

## Open items

0. **Optional:** one-line takes for any books on the shelf (`note` in `shelf`).
0. **From Aneesh:** own recordings of the name, especially "Megravalli", to replace the synthetic clips.

1. **Content review:** drafted copy and unconfirmed links are listed in `docs/CONTENT.md`.
2. **Photos:** the Orbit design has no photo slots. Add them only if Aneesh wants them.
3. **Book:** cover, subtitle, blurb, release date and buy links.
4. **Social share image:** no `og:image` yet. Add `public/og.jpg` and a meta tag in `Base.astro`.
5. **Analytics:** turn on Cloudflare Web Analytics in the dashboard; no code needed.
6. **`www` redirect:** `wrangler.jsonc` only routes the apex. Add `www.aneeshmg.com` as a custom domain plus a redirect rule if wanted.
7. Not tested yet:
   - A VoiceOver or NVDA screen-reader pass.
   - Safari and Firefox, especially `backdrop-filter`, `zoom` on the phone shelf, and WebGL performance on older phones.
   - Reduced-motion mode, checked in the browser (the code path exists).
   - Name audio playback.
8. **Phones:** the plates cover the lower part of each shape on taller sections (Trainer, Say hello). This is acceptable for now; revisit if it bothers Aneesh.
9. **WebGL context loss:** not handled beyond the initial failure. A lost context leaves the canvas blank, and the plates stay readable.
10. **On hold:** `ThreeAm.astro` keeps its old line-art styles inside the component. Restyle it before reviving.

## Cutover from GitHub Pages (user steps)

1. `npx wrangler login`, then `npm run deploy`. This creates the `aneeshmg-com` Worker and attaches the custom domain `aneeshmg.com`, assuming the zone is already on Cloudflare.
2. If deploy complains about existing DNS records, delete the GitHub Pages A/AAAA (185.199.x.x) or CNAME records for the apex in the Cloudflare DNS dashboard, then deploy again.
3. In the GitHub repo settings, turn off Pages.
4. Check https://aneeshmg.com, then the 404 page with a made-up path.

## Next up

1. Aneesh reviews the copy in `src/data/site.ts` and supplies photos.
2. Fill in the book details and add the OG image.
3. Deploy and cut over.
