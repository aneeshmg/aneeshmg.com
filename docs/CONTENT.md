# Content notes

The facts behind the copy in `src/data/site.ts`. **Confirmed** means it came from Aneesh. **Drafted** means an agent wrote it and Aneesh still needs to review it.

## About Aneesh (confirmed)

- Full name **Aneesh Megravalli Gangadhar** (always use the full name), known as Aneesh MG. From Mysore.
- Pronunciation clips (`public/audio/{aneesh,megravalli,gangadhar}.mp3`) were **synthetic**, generated 2026-10-30 with the macOS en-IN voice "Rishi" because Aneesh asked for an Indian accent. Aneesh should check the pronunciation, especially "Megravalli", and the syllable labels in `clips`. Apple's licence for system voices covers personal, non-commercial use, so prefer Aneesh's own recordings before launch.
- Education and career from the old site: NIE Mysore undergrad (2011–15), software engineer at Tesco Bengaluru (2015–18), grad school at Arizona State University (2018–20). Not used on the new site yet.
- Software engineer who likes systems, AI and tinkering. Tech enthusiast.
- Fitness professional on the side. Certified in NASM, Animal Flow, SFG (StrongFirst) and yoga. Trains Muay Thai and BJJ. Fitness business: https://fitwith.aneeshmg.com
- Author. First book, *Optimal Living*, is due out around launch. More in progress.
- Maker of soap and skincare (lip balms, moisturizers) under the brand AuraByAneeshMG: https://aura.aneeshmg.com
- Enjoys hiking, travel, learning, reading, and occasional writing.
- Social-media tags (Aneesh's own words, used for the hero's rolling line): Programmer | Critical thinker | Arm chair philosopher | Bibliophile | geek | Stoic | Aesthete | Inquisitive | Student of Martial Arts, Yoga and Life.
- Self-description (confirmed 2026-10-28): an aspiring autodidactic polymath. Favourite phrase: "jack of many trades, master of none, better than a master of one". Goal: to be able to give an impromptu speech on any subject when woken in the middle of the night, and to hold a conversation with anybody about anything.
- The old site's self-description: "Software Engineer | Critical Thinker | Polymath | Arm Chair Philosopher | … | Stoic | Inquisitive".

## Links

- Email: aneesh.mg2007@gmail.com. **Not shown on the site** (Aneesh asked, 2026-10-30, to avoid spam). The Say hello section says "Write to me", the address is encoded (`mailKey`), and the mailto is built only on interaction. The no-JS and scraper fallback is LinkedIn. Recommended next step: a Cloudflare Email Routing alias (for example hello@aneeshmg.com) so the Gmail address isn't exposed even in the mail client.
- GitHub `aneeshmg`, LinkedIn `in/aneeshmg`, Instagram `aneeshmg`: carried over, still need confirming. Facebook and Twitter (`mg_aneesh`) are left off until confirmed.
- "I'm bored" gist: `https://gist.github.com/aneeshmg/7282d2a9af0f4a3036293aa9afe9df3b`
- Old subdomains reads.aneeshmg.com and blog.aneeshmg.com aren't linked. No blog for now (decided 2026-10-26).

## Drafted copy to review

- `interests` in `site.ts` (polymath dial): Aneesh approved all one-liners "for now" (2026-10-30), including the ones marked `// DRAFT`.
- `shelf` in `site.ts` (bookshelf): Aneesh's own list of 53 books (2026-10-30), in Aneesh's order, after *Optimal Living*. Only 8 are shown at a time (Optimal Living + 7 random). Only *Optimal Living* has a `note`. Add one-line takes only in Aneesh's words.
- `topics` in `site.ts` (the 3 a.m. test, on hold) is my draft list: mostly Aneesh's own areas, plus a few wildcards (the trolley problem, why the sky is blue). Aneesh should edit it.

Everything in `tagline`, `practices` (lede, body, chips, `also`, `notes`), `roles` and `book.blurb`. The practice copy is the Orbit prototype's shorter wording, which Aneesh saw and approved as a design (2026-11-07). Specific claims to check:
- Trainer `also` line, "On the mats: Muay Thai and Brazilian jiu-jitsu.": agent-written from Aneesh's stated interests (2026-11-07).
- Annotation labels (`notes`) restate the copy: Developer tooling, Small batches, Books & trails.
- Engineer: "Distributed systems", "Developer tooling", "I write software for a living".
- Trainer: "I coach people on strength, movement and mobility". Exact certification names: NASM-CPT? SFG I? Which yoga credential (for example RYT-200)?
- Author: the description of *Optimal Living* is a placeholder, and Aneesh will update the Author section.
- Student: the body was approved by Aneesh (2026-10-28). "Most of what I know, I taught myself" is Aneesh's chosen wording.

## Assets needed

| Asset | Where it goes | Notes |
|---|---|---|
| 3–5 portraits (desk, training, outdoors) | `public/img/`; no slot in the current design yet | Real photos only. |
| *Optimal Living* cover | replaces the typographic `.cover-art` on the home Author plate and the book page | 2:3, at least 1200px tall |
| Book subtitle, blurb, release date, buy links | `book` in `site.ts` | Buy links render as a list. Empty shows "Release details coming soon." |
| Social share image | `public/og.jpg` (1200×630) | Not wired yet; see STATE.md |
