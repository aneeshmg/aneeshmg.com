# Design system

**Status:** "Orbit", chosen and ported 2026-11-07, replacing the line-art baseline. The decisions behind it are in `docs/MEMORY.md`.

## Idea

One person, many shapes.
- A field of about 40,000 particles (15,000 on phones) rebuilds itself as you scroll, one shape per section: a sphere (hello), code braces (Engineer), a kettlebell (Trainer), an open book (Author), soap and bubbles (Maker), a multi-tool (Student), then "hello.".
- Text sits on frosted glass **plates** on the left; the shape sits on the right, with drawing-style **annotations**.
- The whole page takes on the current section's colour.

## Structure

- **Home:** seven full-height sections.
  - Each has a plate with an index line ("—— 03 PRACTICE"), title, lede, body, optional chips and a link.
  - The Student section holds the polymath dial; Say hello holds the bookshelf.
- **Fixed chrome:**
  - The nav: brand, "I'm bored", and an icon-only theme button (a moon in light mode, a sun in dark mode; its accessible label names the action).
  - Section links at bottom left (underlined when active).
  - A "01 / 07" counter at bottom right.
- **Book page and 404:** one plate with a breadcrumb, over the glow, wash and dust. No shape.

## Layers, back to front

1. **Wash:** a radial gradient from the left edge in the section colour (`--sc`), at `--wa` (light .14, dark .07).
2. **Glow:** two offset radial gradients (the practice's two shades) behind the shape. On the home page it follows the shape, set by `scene.ts`. It's larger and stronger in light mode. Fade radii are explicit (`--r1`, `--r2`) so no rim shows at the element's edge.
3. **Canvas** (`#gl`):
   - **Dust:** in dark mode, neutral plus tinted specks, blended additively. In light mode, soft coloured bokeh blended normally.
   - **The swarm:** home page only.
4. **Annotations:** an SVG leader line (dot, diagonal, elbow) plus a label. They draw in near each section and are hidden below 1000px.
5. **Content:** the plates.

## Colour

`--sc` is the live section colour as `r g b`. The scene sets it while scrolling. On other pages it comes from `data-tint` on `<html>`.

| Role | Light | Dark |
|---|---|---|
| Neutral (hero) | `#1c1c1a` | `#e6e1d6` |
| Engineer | `#0f4fd1` | `#4f8dff` |
| Trainer | `#d6390a` | `#ff6a3d` |
| Author | `#b87800` | `#ffb627` |
| Maker | `#c2186b` | `#ff5c9d` |
| Student | `#0b8a54` | `#2fd88f` |
| Warm accent ("hello.", book lines) | `#c95800` | `#ffc46b` |

- **Palette:** each role has a second shade in `PAL` in `src/scripts/scene.ts`, and each particle sits somewhere between the two.
- **Keep in sync:** `--c-*` in `global.css` must match the first shades in `PAL`.
- **Surfaces:** `--bg` is `#f1f1ee` in light and `#08090a` in dark. The ink and line tokens are in `global.css`.
- **Contrast:**
  - Section colours are for rules, chips, glows and particles, never small text.
  - Text on the gold *Optimal Living* cover and spine is dark ink (`#1a1408`).

## Type

One family: **Albert Sans Variable** (Fontsource, self-hosted).

| Role | Setting |
|---|---|
| Name (h1) | 200, `clamp(3rem, 6.4vw, 6.6rem)`, line-height .95, tracking −.045em; "Megravalli" muted |
| Section titles (h2) | 200, `clamp(2.8rem, 5.6vw, 5.6rem)` |
| Ledes | 300, `clamp(1.2rem, 1.7vw, 1.6rem)`, line-height 1.2 |
| Body | 17px, line-height 1.65, `--ink-2` |
| Labels (index line, cue) | .7–.75rem uppercase, tracked .12–.16em, muted |
| Smallest text | .75rem (12px); spine titles .7rem |

## Plates

- **Glass:** a translucent sheen over a 6% tint of `--sc`, with `blur(14px) saturate(140%)`.
- **Edges:** a bright 1px edge with a top highlight, a soft drop shadow and a 6px radius.
- **Crop marks:** 14px ticks at each corner in `--ink-2`.
- **Index line:** a 22px rule in the section colour, the number in ink, then the label. Never a glowing dot.
- **Eyebrows:** inner pages use a plain breadcrumb, not the uppercase index, to avoid the eyebrow-above-headline pattern.

## Motion

- **Scroll:** position across the page maps to 0–6, eased (×0.09 per frame), and drives the morph.
- **Particles:** each particle flies at its own time, arcing outward and up, with turbulence mid-flight.
- **Sway:** the shape sways slowly and leans toward the pointer.
- **Hover:** a soft parting in screen space (desktop only), so it's the same at any depth or rotation.
- **Smooth scroll:** Lenis (`lerp .08`), home page only. The section links glide.
- **Reveals:** text fades up and unblurs on entry.
- **Theme switch:** a circular view-transition reveal from the button.
- **Reduced motion:**
  - No Lenis, no reveals, no drift or flight.
  - The shapes snap to the nearest section; annotations show only for the current section.
- **No WebGL:** `site.ts` removes the canvas; the plates, CSS glow and wash remain.

## Components

- **Polymath dial** (`Dial.astro`):
  - A ring of 60 ticks and 12 stop dots over a dotted inner ring, with a hairline pointer.
  - The active stop fills with its practice colour and gets a soft halo.
  - Drag, wheel, arrows, Home/End, or click a stop. `data-lenis-prevent` keeps the wheel on the dial.
- **Bookshelf** (`Shelf.astro`):
  - Outline spines tinted by colour; *Optimal Living* is the one solid spine.
  - Shows 8 at random; Reshelve picks again.
  - The detail card has a coloured left rule.
- **Chips** (`.spec`): pills with a border tinted by the practice.
- **Cover** (`.cover-art`): a typographic stand-in until the real cover exists.

## Mobile (≤760px)

- **Layout:** the shape sits above, scaled to .68, and the plate sits at the bottom.
- **Hidden:** the section links, counter, dial hint and scroll cue.
- **Smaller:** the dial (96px) and the shelf (zoom .68).
- **Lighter:** about 15k particles and 900 dust.
