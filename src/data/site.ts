// Every fact the site states lives here. Edit copy here, not in the pages.
// docs/CONTENT.md tracks what is still missing or unconfirmed.

export const person = {
  name: "Aneesh Megravalli Gangadhar",
  short: "Aneesh MG",
  // Never rendered as text or in an href. Pages use `mailKey` below; site.ts decodes it on interaction.
  email: "aneesh.mg2007@gmail.com",
};

// The email, reversed and base64-encoded, so it never appears in the HTML for scrapers.
// src/scripts/site.ts turns it into a mailto: link only when a visitor hovers, focuses or clicks.
export const mailKey = btoa([...person.email].reverse().join(""));

export type Link = { label: string; href: string };

export const socials: Link[] = [
  { label: "GitHub", href: "https://github.com/aneeshmg" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/aneeshmg/" },
  { label: "Instagram", href: "https://www.instagram.com/aneeshmg/" },
];

export const ventures: Link[] = [
  { label: "FitWithAneeshMG", href: "https://fitwith.aneeshmg.com" },
  { label: "AuraByAneeshMG", href: "https://aura.aneeshmg.com" },
];

// The hero's "Today:" line rolls through these.
// Aneesh's own tags, as used on social media.
export const roles = ["programmer", "critical thinker", "armchair philosopher", "bibliophile", "geek", "Stoic", "aesthete", "student"];

// Polymath dial (Student section). One stop per interest; the knob takes the tint of the practice it belongs to.
// Lines marked DRAFT are agent-written; the rest reuse copy Aneesh approved. Aneesh should rewrite freely.
export const interests: { name: string; practice: Practice["id"]; line: string }[] = [
  { name: "Distributed systems", practice: "engineer", line: "Many machines, one answer. The hard part is getting them to agree." }, // DRAFT
  { name: "Applied AI", practice: "engineer", line: "What it can do, where it breaks, and how to build with it sensibly." },
  { name: "Tinkering", practice: "engineer", line: "A question I can't stop thinking about, turned into a small working answer." },
  { name: "Strength", practice: "trainer", line: "Strength is a skill. It gets taught like one." },
  { name: "Muay Thai", practice: "student", line: "The art of eight limbs, and a weekly lesson in humility." }, // DRAFT
  { name: "Jiu-jitsu", practice: "student", line: "Problem solving, with someone actively trying to stop you." }, // DRAFT
  { name: "Yoga", practice: "student", line: "Breath first, shape second." }, // DRAFT
  { name: "Writing", practice: "author", line: "How I find out what I actually think." },
  { name: "Soap & skincare", practice: "maker", line: "Chemistry you can hold in your hand, made slowly, by hand." }, // DRAFT
  { name: "Stoicism", practice: "student", line: "Focus on what's yours to control. Let the rest go." }, // DRAFT
  { name: "Philosophy", practice: "student", line: "I'd rather ask a good question than win an argument." },
  { name: "Trails & travel", practice: "student", line: "New places, new questions." }, // DRAFT
];

// Bookshelf (Say hello section). Aneesh's own list (2026-10-30), in Aneesh's order. `note` is optional:
// add one-line takes only in Aneesh's words, never invented.
export type Book = { title: string; author: string; note?: string };
export const shelf: Book[] = [
  { title: "Optimal Living", author: "Aneesh Megravalli Gangadhar", note: "Mine. The first of a few." },
  { title: "Do It Today", author: "Darius Foroux" },
  { title: "Predictably Irrational", author: "Dan Ariely" },
  { title: "The Intelligent Investor", author: "Benjamin Graham" },
  { title: "The Rational Optimist", author: "Matt Ridley" },
  { title: "The Art of Thinking Clearly", author: "Rolf Dobelli" },
  { title: "The Idiot Brain", author: "Dean Burnett" },
  { title: "Eat That Frog!", author: "Brian Tracy" },
  { title: "The Productivity Project", author: "Chris Bailey" },
  { title: "Confidence", author: "Martin Meadows" },
  { title: "Endure", author: "Alex Hutchinson" },
  { title: "Deep Work", author: "Cal Newport" },
  { title: "So Good They Can’t Ignore You", author: "Cal Newport" },
  { title: "Spark", author: "John J. Ratey with Eric Hagerman" },
  { title: "The Red Queen", author: "Matt Ridley" },
  { title: "Steal the Show", author: "Michael Port" },
  { title: "Essentialism", author: "Greg McKeown" },
  { title: "Ikigai", author: "Héctor García and Francesc Miralles" },
  { title: "The Art of Possibility", author: "Rosamund Stone Zander and Benjamin Zander" },
  { title: "Inner Engineering", author: "Sadhguru (Jaggi Vasudev)" },
  { title: "The Aesthetic Brain", author: "Anjan Chatterjee" },
  { title: "Outliers", author: "Malcolm Gladwell" },
  { title: "The Selfish Gene", author: "Richard Dawkins" },
  { title: "Unlimited Memory", author: "Kevin Horsley" },
  { title: "How to Analyze People", author: "Brian Hall" },
  { title: "Polymath", author: "Peter Hollins" },
  { title: "The Motivation Myth", author: "Jeff Haden" },
  { title: "The Telomere Effect", author: "Elizabeth Blackburn and Elissa Epel" },
  { title: "Indistractable", author: "Nir Eyal" },
  { title: "Ultralearning", author: "Scott H. Young" },
  { title: "The Oxygen Advantage", author: "Patrick McKeown" },
  { title: "Algorithms to Live By", author: "Brian Christian and Tom Griffiths" },
  { title: "The Elephant in the Brain", author: "Kevin Simler and Robin Hanson" },
  { title: "The Great Mental Models, Volume 1", author: "Shane Parrish and Rhiannon Beaubien" },
  { title: "The Great Mental Models, Volume 2", author: "Shane Parrish and Rhiannon Beaubien" },
  { title: "Exercised", author: "Daniel E. Lieberman" },
  { title: "Lifespan", author: "David A. Sinclair with Matthew D. LaPlante" },
  { title: "Discipline Equals Freedom", author: "Jocko Willink" },
  { title: "Finish What You Start", author: "Peter Hollins" },
  { title: "Raja Yoga", author: "Swami Vivekananda" },
  { title: "Arise, Awake, Know Your Strength", author: "Swami Vivekananda" },
  { title: "The Emperor’s New Mind", author: "Roger Penrose" },
  { title: "Chaos", author: "James Gleick" },
  { title: "A Brief History of Time", author: "Stephen Hawking" },
  { title: "Homo Deus", author: "Yuval Noah Harari" },
  { title: "The Tao of Physics", author: "Fritjof Capra" },
  { title: "How to Think Like Leonardo da Vinci", author: "Michael J. Gelb" },
  { title: "Sapiens", author: "Yuval Noah Harari" },
  { title: "Autobiography of a Yogi", author: "Paramahansa Yogananda" },
  { title: "The Art of the Good Life", author: "Rolf Dobelli" },
  { title: "Meditations", author: "Marcus Aurelius" },
  { title: "Consciousness and the Brain", author: "Stanislas Dehaene" },
  { title: "The 5AM Club", author: "Robin Sharma" },
  { title: "On the Shortness of Life", author: "Seneca" },
];

// "The 3 a.m. test" (ON HOLD, see src/components/ThreeAm.astro): Aneesh's goal is to give an impromptu talk on any subject, woken in the middle of the night.
// Mostly Aneesh's own areas, plus a few wildcards, because the point is "any subject". Edit freely.
export const topics = [
  "Stoicism",
  "distributed systems",
  "kettlebell swings",
  "the chemistry of soap",
  "Muay Thai",
  "large language models",
  "Marcus Aurelius",
  "the trolley problem",
  "caching",
  "Brazilian jiu-jitsu",
  "why habits stick",
  "yoga and breathing",
  "the Ship of Theseus",
  "consensus algorithms",
  "why the sky is blue",
  "reading more books",
  "deadlifts",
  "the art of a good question",
];

// Name pronunciation clips in public/audio: a play icon follows each word of the name in the hero.
// Generated 2026-10-30 with the macOS en-IN voice "Rishi" (`say -v Rishi -r 150`); replace with
// Aneesh's own recordings when available.
export const clips = [
  { word: "Aneesh", src: "/audio/aneesh.mp3" },
  { word: "Megravalli", src: "/audio/megravalli.mp3" },
  { word: "Gangadhar", src: "/audio/gangadhar.mp3" },
];

// The hero's line under the name.
export const tagline = "Programmer, Stoic, bibliophile, strength coach, soap maker. One person, many shapes.";

// One section each on the home page, in this order; the particle shapes in src/scripts/scene.ts follow it.
export type Practice = {
  id: "engineer" | "trainer" | "author" | "maker" | "student";
  title: string;
  lede: string;
  body: string;
  link?: Link;
  chips?: { label: string; items: string[] }; // short facts as pills under the body
  also?: string; // a smaller line after the chips
  notes: string[]; // annotation labels on the shape, in the order of the anchors in scene.ts
};

export const practices: Practice[] = [
  {
    id: "engineer",
    title: "Engineer",
    lede: "Systems first. The interesting part is usually where two of them meet.",
    body: "I write software for a living and tinker with it for fun: distributed systems, the plumbing that keeps them honest, and lately a lot of AI.",
    link: { label: "Code on GitHub", href: "https://github.com/aneeshmg" },
    notes: ["Distributed systems", "Applied AI", "Developer tooling"],
  },
  {
    id: "trainer",
    title: "Trainer",
    lede: "Strength is a skill. It gets taught like one.",
    body: "I coach strength, movement and mobility.",
    chips: { label: "Certifications", items: ["NASM", "Animal Flow", "StrongFirst (SFG)", "Yoga"] },
    also: "On the mats: Muay Thai and Brazilian jiu-jitsu.",
    link: { label: "Train at FitWithAneeshMG", href: "https://fitwith.aneeshmg.com" },
    notes: ["NASM", "StrongFirst (SFG)", "Animal Flow", "Yoga"],
  },
  {
    id: "author",
    title: "Author",
    lede: "Writing is how I find out what I actually think.",
    body: "Optimal Living is my first book. More are in the works.",
    link: { label: "About Optimal Living", href: "/books/optimal-living" },
    notes: ["Optimal Living", "More in the works"],
  },
  {
    id: "maker",
    title: "Maker",
    lede: "Some things are better made slowly, by hand.",
    body: "Soap and skincare in small batches under AuraByAneeshMG.",
    chips: { label: "What I make", items: ["Soap", "Lip balm", "Moisturizer"] },
    link: { label: "Visit AuraByAneeshMG", href: "https://aura.aneeshmg.com" },
    notes: ["Small batches", "Soap", "Lip balm & moisturizer"],
  },
  {
    id: "student",
    title: "Student",
    lede: "Jack of many trades, master of none. Often better than a master of one.",
    body: "An aspiring polymath. Wake me up in the middle of the night, name any subject, and I'll give you an impromptu talk on it.",
    notes: ["Martial arts", "Yoga", "Stoicism", "Books & trails"],
  },
];

export const book = {
  title: "Optimal Living",
  blurb: [
    "Optimal Living is a practical book about building a life that works: how you train, eat, rest, think and spend your attention.",
  ],
  // Fill once the book is out. An empty list renders an honest "coming soon" note.
  releaseNote: "Release details coming soon.",
  buyLinks: [] as Link[],
};

// "I'm bored" list. Fetched at build time so the live site has no runtime dependency on GitHub.
const BORED_GIST =
  "https://gist.githubusercontent.com/aneeshmg/7282d2a9af0f4a3036293aa9afe9df3b/raw/boredom-sites";

let boredCache: Promise<string[]> | undefined;
export const boredSites = () => (boredCache ??= loadBored());

async function loadBored(): Promise<string[]> {
  try {
    const res = await fetch(BORED_GIST);
    const list = await res.json();
    if (Array.isArray(list) && list.length) return list.filter((u) => typeof u === "string");
  } catch {}
  return ["https://www.htwins.net/scale2/", "http://listen.hatnote.com/", "https://sleepyti.me/"];
}
