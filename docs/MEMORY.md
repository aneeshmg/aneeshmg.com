# Decisions

Durable decisions and why they were made. Add new entries at the top. Don't re-argue an entry without new information.

- **2026-11-07: Orbit is the site.** Ported into `src/`, replacing the line-art baseline. The prototypes (`prototype3d/`, including Atelier, Study and Prism) were deleted after porting. What Aneesh chose along the way:
  - **Hero:** the plain particle sphere from the first Orbit. The banded planet with a ring was rejected.
  - **Colours:** vivid per-practice palettes in both themes. Aneesh found the muted pastels dull.
  - **Atmosphere:** a section-coloured glow, a wash from the left and drifting dust. Light mode needs it stronger than dark.
  - **Plates:** glass plates with crop marks for the text. No glowing status dot: Aneesh said it felt "AI-like", so a short coloured rule replaced it.
  - **Annotations:** leader-line labels on the shapes. Aneesh liked them.
  - **Dial and shelf:** restyled to match the annotations (dots and hairlines; outline spines, with *Optimal Living* solid).
  - **Hover:** the pointer parts the particles in screen space, softly. The first version was inconsistent.
  - **Theme button:** icon only (2026-11-10): a moon in light mode, a sun in dark mode. The accessible label names the action.
  - **Dropped:** keys 1–5 and the line drawings. "I'm bored" moved to the nav. The book page and 404 get plates and atmosphere, but no shape.
  - **Reduced motion:** shapes still show, but snap between sections with no smooth scroll. Without WebGL, the glow and plates remain.
  - **Stack:** this supersedes the 2026-10-28 "no animation library" and 2026-10-26 "No Three.js" decisions. three.js and Lenis are now in, loaded lazily. GSAP was not needed: the scroll position is read directly.
- **2026-11-07: 3D redesign requested** (full redesign around 3D, scroll-driven; options calm to bold; lighter 3D on mobile). Reference: threeui.com, a paid Pro library whose licence terms aren't published, so it's used as a **style reference only; never copy its code**. Three prototypes are in `prototype3d/`: Study (clay desk diorama, calm), Orbit (particle morphs, in between), Prism (glass with dispersion, bold). Awaiting Aneesh's choice.

- **2026-10-30: Name audio is a play icon after each word, not waveforms.** Aneesh preferred a simple icon over a dedicated "Say it" row. All three names have clips (synthetic en-IN voice for now). Web Audio was removed.

- **2026-10-30: The email is never shown.** It's an anti-spam measure. The footer link reads "Write to me", and the address is encoded and armed on interaction.

- **2026-10-30: Bookshelf shows a random 8, not all 54.** Aneesh found the full 54-spine shelf unpolished. Now the shelf shows *Optimal Living* + 7 random books from the full list kept in `site.ts`, as bigger cloth-bound spines on a board with a bookend.

- **2026-10-29: Hero widget is the polymath dial; footer has a bookshelf.** Aneesh chose these from six options (3 a.m. test, desk still life, bookshelf, Stoic "argue with me", Kannada name, polymath dial). **The 3 a.m. test is on hold**, not rejected, and may be activated later (`ThreeAm.astro`). The bookshelf must hold Aneesh's real books only.

- **2026-10-29: Hero character piece is "the 3 a.m. test".** The hero felt empty, so Aneesh asked for a minimal interactive element unique to their personality. It's built from the stated goal (an impromptu talk on any subject, woken in the middle of the night): a line clock in local time that sweeps to 3:00 and deals a subject. Also: the Engineer drawing is now code between braces, because the circuit board read as hardware and wasn't relevant; the corkscrew became scissors; and the Author hover was fixed.

- **2026-10-28: "Wanderer" replaced by "Student".** Aneesh disliked Wanderer and preferred "Student" because it covers student of life, martial arts, reader and thinker. The "white belt" analogy was rejected; the framing is aspiring autodidactic polymath. The hero's rolling line uses Aneesh's own social tags. Trainer is the teaching side, and martial arts and yoga as learning live in Student.

- **2026-10-28: Merge implemented in `src/`.** Aneesh said overwriting v1 was fine, so no oct26v1 branch was made, and all prototypes were deleted. The stack is now animation-library-free: GSAP and Lenis were removed. CSS, IntersectionObserver, View Transitions and Web Audio cover everything.

- **2026-10-28: Baseline design is `prototype/merge.html`** (Nocturne × Line art). Light and dark themes (system default, toggle with a circular view-transition reveal, saved in localStorage). Albert Sans only. Practices are big rows that open (`<details>`), each with a minimal line drawing that draws in on open and acts out its subject on hover. Name pronunciation is shown as real waveforms decoded from the mp3s. Keys 1–5 open rows. Aneesh will **embellish it later**, so treat it as a base, not final.
- **2026-10-27–28: Directions tried and rejected** (prototypes deleted 2026-10-28; the look of each is described here):
  - Almanac (oct26v1): too bookish and quiet.
  - Five colours: too gaudy and bold.
  - Contours: topographic lines felt overused.
  - Circles: the Venn intersections felt overdone.
  - Line art, Split, Nocturne, Swiss: liked elements of Line art and Nocturne, but each alone lacked character.
- **Character comes from personal truth, not effects.** Recommended next embellishments, all needing input from Aneesh: a "Now" strip (reading, training, building, making), a hand signature, the name in Kannada (spelling to be confirmed), and copy in Aneesh's own voice.

- **2026-10-26: Readability pass.** Aneesh found the type hard to read. Bodoni Moda is now limited to poster sizes, chapter ledes use Source Serif 4 at 500, Plex Mono is dropped for italic serif marginalia, the grain sits behind the text, and night surfaces get extra weight and leading. Don't bring Bodoni back for text under about 5rem.
- **2026-10-26: Full name everywhere:** "Aneesh Megravalli Gangadhar".

- **2026-10-26: Fresh rebuild.** The old Gatsby/GitHub Pages site is preserved on branch `old-oct26`; older versions are on `old`, `old-hugo` and `old-json`. The repo was cleared and restarted.
- **2026-10-26: Cloudflare Workers Static Assets, no Worker script.** No auth and no database are planned, so there's nothing to run server-side. Add `main` only if a real dynamic need appears, such as a contact form.
- **2026-10-26: Astro, static output, plain CSS.** Astro for components and build-time data, nothing more. Plain CSS because the design is bespoke and small, so Tailwind would add a layer without saving anything.
- **2026-10-26: The almanac design direction.** Chosen by Aneesh over "systems/kinetic mono", "chromatic chapters" and "match fitwith". See `docs/DESIGN.md`.
- **2026-10-26: No blog yet.** Add `/writing` with content collections when there are posts.
- **2026-10-26: Kept from the old site:** the name pronunciation audio and the "I'm bored" button. Dropped: skills charts, the career timeline, and the 2018–2020 projects list.
- **2026-10-26: Book page has buy links only.** No newsletter or other third-party service.
- **2026-10-26: Lenis over Locomotive Scroll.** It's smaller, works directly with ScrollTrigger, and supports native `position: sticky`.
- **2026-10-26: No Three.js.** The concept was typographic. *Superseded 2026-11-07 by the Orbit port.*
- **2026-10-26: Analytics.** Old Universal Analytics (UA-119329240-1) is dead. The recommendation is Cloudflare Web Analytics (cookieless, so no consent banner), enabled in the dashboard. Not decided yet.
