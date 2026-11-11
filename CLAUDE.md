# CLAUDE.md

Guidance for AI coding agents working in this repo. `AGENTS.md` points here.

**aneeshmg.com** is the personal site of Aneesh Megravalli Gangadhar (Aneesh MG): software engineer, fitness professional, author, maker. Static, no auth, no database. One home page ("Orbit": a WebGL particle field that morphs into one shape per section as you scroll, beside glass text plates; a polymath dial; a bookshelf) plus a book page and a 404. Light and dark themes. See `docs/DESIGN.md`.

## Read these first

| File | What it holds | When to update |
|---|---|---|
| [`docs/STATE.md`](docs/STATE.md) | Current status, open items, missing assets, next steps | End of every meaningful work session |
| [`docs/DESIGN.md`](docs/DESIGN.md) | The design system: layers, tokens, themes, components, motion rules | When the visual language changes |
| [`docs/CONTENT.md`](docs/CONTENT.md) | Facts about Aneesh, links, what copy is confirmed vs. drafted | When content changes or gets confirmed |
| [`docs/MEMORY.md`](docs/MEMORY.md) | Durable decisions and the reasons behind them | When a decision is made that shouldn't be re-argued |

## Commands

```bash
npm run dev       # astro dev, http://localhost:4321
npm run build     # astro check && astro build: must pass before declaring work done
npm run preview   # build, then wrangler dev (serves dist/ the way Cloudflare will)
npm run deploy    # build + wrangler deploy (production; only when the user asks)
```

## Stack

- Astro (static output), plain CSS (no Tailwind), TypeScript.
- **three.js** for the particle scene and **Lenis** for smooth scroll (home page only). Both come from npm. `scene.ts` is dynamically imported, so three.js is one lazy chunk loaded after the page is usable. No GSAP: the scroll position is read directly. Everything else is CSS, IntersectionObserver and View Transitions.
- One font, self-hosted through Fontsource: Albert Sans (variable).
- Hosted on **Cloudflare Workers Static Assets**. `wrangler.jsonc` has no Worker script, only `assets`. `not_found_handling: "404-page"` serves `dist/404.html`.

## Layout of the code

```
src/data/site.ts           every fact and every line of copy; pages only render it
src/layouts/Base.astro     <head> (theme pre-paint), wash/glow/canvas layers, nav ("I'm bored", theme), loads site.ts
src/pages/index.astro      hero + one section per practice + Say hello, all from data; annotations, section links, counter
src/pages/books/optimal-living.astro, src/pages/404.astro   one plate each, ambient scene
src/components/Dial.astro  polymath dial (Student section)
src/components/Shelf.astro bookshelf (Say hello section)
src/components/ThreeAm.astro  ON HOLD, not rendered (keeps its own styles)
src/styles/global.css      all styles; tokens at :root
src/scripts/site.ts        reveals, theme, Lenis, roles, name audio, dial, shelf, email arming, "I'm bored"; imports scene.ts
src/scripts/scene.ts       WebGL: shapes, swarm, dust, annotations, glow and --sc (mode from <canvas data-scene>)
public/fonts/              glyph subset of Droid Sans Bold for the { } and "hello." shapes (Apache 2.0, NOTICE alongside)
public/audio/              name pronunciation clips
```

## Conventions

- **Copy lives in `src/data/site.ts`.** Don't hardcode text in pages.
- **Never render the email address** as text or in an `href`. Use `<a data-mail={mailKey} href="…fallback…">`. `site.ts` arms the `mailto:` on hover, focus or touch (an optional `data-subject` is supported). After building, check with `grep -r "@gmail" dist/`, which should return nothing.
- **Progressive.** Content is complete without JS or WebGL: every section's text is in the HTML, and the scene is decoration on top. If WebGL fails, `site.ts` removes the canvas. An inline script in `Base.astro` adds `.js` (which hides `.rv` until revealed) only when reduced motion is off, and removes it after 2.5s if `site.ts` never sets `window.__site`.
- **Themes:** the pre-paint script always sets `data-theme`, from the saved choice or else the system setting. Dark tokens are defined twice in `global.css`: under `[data-theme="dark"]`, and under `prefers-color-scheme` for `:root:not([data-theme])` (no JS). Change both together. `site.ts` fires a `themechange` event that the scene listens for.
- **Colours live in two places:** `--c-*` in `global.css` and `PAL` in `scene.ts`. Keep them matched. Section colours never go on small text (contrast).
- **Shapes and annotations:** the order of the `practices` in `site.ts` must match the order of the shapes and of `ANCHORS` in `scene.ts`. Each practice's `notes` pair up with its anchors by index.
- Under `prefers-reduced-motion: reduce`: no Lenis and no reveals, and the shapes snap between sections with no drift.
- The "I'm bored" list is fetched from a GitHub gist **at build time** (`boredSites()`), with a small fallback. The live site never calls GitHub.

## Working agreements

- **The user does all git operations.** Never commit, push, branch or checkout. Say what's ready to commit.
- Present a plan before large or multi-file changes, and ask when requirements are ambiguous.
- Never invent facts about Aneesh. Unconfirmed copy is marked in `docs/CONTENT.md`.
- Never call the site "award-winning" or claim recognition.
- Before finishing: run `npm run build`, then update `docs/STATE.md`.
