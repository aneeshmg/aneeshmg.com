// All client behaviour. The page is complete without it; this adds the interactions.
import Lenis from "lenis";
declare global {
  interface Window {
    __site?: boolean;
  }
}
window.__site = true;

const root = document.documentElement;
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

// Email links carry the address encoded in data-mail (see mailKey in src/data/site.ts). They become a
// real mailto: only when a visitor hovers, focuses or taps, so scrapers reading the HTML never see it.
const arm = (a: HTMLAnchorElement) => {
  if (a.dataset.armed) return;
  const addr = [...atob(a.dataset.mail!)].reverse().join("");
  a.href = `mailto:${addr}` + (a.dataset.subject ? `?subject=${encodeURIComponent(a.dataset.subject)}` : "");
  a.dataset.armed = "1";
};
document.addEventListener("pointerover", (e) => { const a = (e.target as Element).closest?.<HTMLAnchorElement>("a[data-mail]"); if (a) arm(a); });
document.addEventListener("focusin", (e) => { const a = (e.target as Element).closest?.<HTMLAnchorElement>("a[data-mail]"); if (a) arm(a); });
document.addEventListener("touchstart", (e) => { const a = (e.target as Element).closest?.<HTMLAnchorElement>("a[data-mail]"); if (a) arm(a); }, { passive: true });

// Reveal on entry.
const rv = new IntersectionObserver(
  (es) => es.forEach((e) => e.isIntersecting && (e.target.classList.add("in"), rv.unobserve(e.target))),
  { rootMargin: "0px 0px -8% 0px" },
);
document.querySelectorAll<HTMLElement>(".rv").forEach((el, i) => {
  el.style.transitionDelay = `${(i % 5) * 90}ms`;
  rv.observe(el);
});

// Theme: toggle and remember; the new theme spreads from the button where view transitions exist.
// The button is an icon (CSS picks sun or moon); its label names the action. The scene listens for "themechange".
const themeBtn = document.querySelector<HTMLButtonElement>(".theme");
const label = () => themeBtn?.setAttribute("aria-label", root.dataset.theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
const setTheme = (next: string) => {
  root.dataset.theme = next;
  label();
  dispatchEvent(new Event("themechange"));
};
label();
matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
  try { if (localStorage.getItem("theme")) return; } catch {}
  setTheme(e.matches ? "dark" : "light");
});
themeBtn?.addEventListener("click", (e) => {
  const next = root.dataset.theme === "dark" ? "light" : "dark";
  const apply = () => {
    setTheme(next);
    try { localStorage.setItem("theme", next); } catch {}
  };
  if (!document.startViewTransition || reduce) return apply();
  const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
  const x = r.left + r.width / 2, y = r.top + r.height / 2;
  const end = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  document.startViewTransition(apply).ready.then(() =>
    root.animate(
      { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${end}px at ${x}px ${y}px)`] },
      { duration: 750, easing: "cubic-bezier(.16, 1, .3, 1)", pseudoElement: "::view-transition-new(root)" },
    ),
  );
});

// Smooth scroll on the home page (not under reduced motion); the section links glide too.
const canvas = document.querySelector<HTMLCanvasElement>("#gl");
if (canvas?.dataset.scene === "shapes" && !reduce) {
  const lenis = new Lenis({ lerp: 0.08 });
  const raf = (t: number) => { lenis.raf(t); requestAnimationFrame(raf); };
  requestAnimationFrame(raf);
  document.querySelectorAll<HTMLAnchorElement>(".progress a").forEach((a) =>
    a.addEventListener("click", (e) => { e.preventDefault(); lenis.scrollTo(a.hash, { duration: 1.6 }); history.replaceState(null, "", a.hash); }),
  );
}
// The WebGL scene loads on its own, after the page is usable. The page is complete without it.
if (canvas) import("./scene").catch(() => canvas.remove());

// "Today:" line rolls through the roles (the full list is in a screen-reader span next to it).
const role = document.querySelector<HTMLElement>(".role");
if (role && !reduce) {
  const roles: string[] = JSON.parse(role.dataset.roles || "[]");
  let i = 0;
  setInterval(() => {
    if (document.hidden) return;
    role.classList.add("out");
    setTimeout(() => { i = (i + 1) % roles.length; role.textContent = roles[i]; role.classList.remove("out"); }, 350);
  }, 2400);
}

// Name pronunciation: each play icon plays its word; clicking again stops. One clip at a time.
let playing: HTMLAudioElement | undefined;
document.querySelectorAll<HTMLButtonElement>(".say").forEach((btn) => {
  const audio = new Audio(btn.dataset.src);
  audio.preload = "none";
  audio.onplay = () => btn.setAttribute("data-playing", "");
  audio.onpause = audio.onended = () => btn.removeAttribute("data-playing");
  btn.addEventListener("click", () => {
    if (!audio.paused) return audio.pause();
    playing?.pause();
    playing = audio;
    audio.currentTime = 0;
    audio.play().catch(() => btn.removeAttribute("data-playing"));
  });
});

// Polymath dial. The knob's rotation is unbounded (k steps); the active interest is k mod n.
const dial = document.querySelector<HTMLElement>(".dial");
if (dial) {
  const items: { name: string; practice: string; line: string }[] = JSON.parse(dial.dataset.interests || "[]");
  const n = items.length, step = 360 / n;
  const wrap = dial.querySelector<HTMLElement>(".knob-wrap")!;
  const knob = dial.querySelector<SVGGElement>(".knob")!;
  const stops = [...dial.querySelectorAll<SVGCircleElement>(".stop")];
  const nm = dial.querySelector(".nm")!, line = dial.querySelector(".ln1")!;
  const mod = (k: number) => ((k % n) + n) % n;
  let rot = 0, idx = 0, swapT = 0;
  const setRot = (r: number) => { rot = r; knob.style.transform = `rotate(${r}deg)`; };
  const select = (k: number) => {
    const i = mod(k);
    if (i === idx) return;
    idx = i;
    const it = items[i];
    stops.forEach((s, j) => s.classList.toggle("on", j === i));
    wrap.style.setProperty("--c", `var(--c-${it.practice})`);
    wrap.setAttribute("aria-valuenow", String(i));
    wrap.setAttribute("aria-valuetext", `${it.name}: ${it.line}`);
    dial.classList.add("swap");
    clearTimeout(swapT);
    swapT = window.setTimeout(() => {
      nm.textContent = it.name;
      line.textContent = it.line;
      dial.classList.remove("swap");
    }, reduce ? 0 : 160);
  };
  const go = (k: number) => { setRot(k * step); select(k); };
  const nearest = () => Math.round(rot / step);
  // Shortest way round to stop j from wherever the knob is now.
  const toStop = (j: number) => { const k0 = nearest(); let d = mod(j - k0); if (d > n / 2) d -= n; go(k0 + d); };

  // Drag: follow the pointer's angle around the centre; a tap without movement advances one stop.
  const angle = (e: PointerEvent) => {
    const r = wrap.getBoundingClientRect();
    return (Math.atan2(e.clientX - (r.left + r.width / 2), -(e.clientY - (r.top + r.height / 2))) * 180) / Math.PI;
  };
  let dragging = false, lastA = 0, moved = 0;
  wrap.addEventListener("pointerdown", (e) => {
    if ((e.target as Element).classList.contains("stop")) return;
    dragging = true; moved = 0; lastA = angle(e);
    wrap.setPointerCapture(e.pointerId);
    dial.classList.add("dragging");
  });
  wrap.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    const a = angle(e);
    let d = a - lastA;
    if (d > 180) d -= 360;
    if (d < -180) d += 360;
    lastA = a; moved += Math.abs(d);
    setRot(rot + d);
    select(nearest());
  });
  const end = () => {
    if (!dragging) return;
    dragging = false;
    dial.classList.remove("dragging");
    go(moved < 4 ? nearest() + 1 : nearest());
  };
  wrap.addEventListener("pointerup", end);
  wrap.addEventListener("pointercancel", end);
  stops.forEach((s, j) => s.addEventListener("click", () => toStop(j)));

  // Scroll tunes one stop per notch; trackpads accumulate until a notch's worth.
  let acc = 0;
  wrap.addEventListener("wheel", (e) => {
    e.preventDefault();
    acc += e.deltaY;
    if (Math.abs(acc) < 40) return;
    go(nearest() + Math.sign(acc));
    acc = 0;
  }, { passive: false });

  wrap.addEventListener("keydown", (e) => {
    const k = nearest();
    const next = { ArrowRight: k + 1, ArrowUp: k + 1, ArrowLeft: k - 1, ArrowDown: k - 1 }[e.key];
    if (next !== undefined) go(next);
    else if (e.key === "Home") toStop(0);
    else if (e.key === "End") toStop(n - 1);
    else return;
    e.preventDefault();
  });
}

// Bookshelf: shows Optimal Living plus a random pick of the rest (re-picked per visit and on "Reshelve").
// Hover, focus or tap a spine to tip it out and read it. One tab stop; arrow keys, Home and End move along it.
const shelfEl = document.querySelector<HTMLElement>(".shelf");
if (shelfEl) {
  const wrapEl = shelfEl.closest<HTMLElement>(".shelf-wrap")!;
  const row = wrapEl.querySelector<HTMLElement>(".shelf-row")!;
  const SHOWN = Number(wrapEl.dataset.shown) || 8;
  const [bt, ba, bn] = [".bt", ".ba", ".bn"].map((sel) => wrapEl.querySelector(sel)!);
  const items = [...shelfEl.children] as HTMLLIElement[];
  const mine = items.find((li) => li.dataset.i === "0")!;
  const visible = () => items.filter((li) => !li.hidden).map((li) => li.querySelector<HTMLButtonElement>(".spine")!);
  const card = wrapEl.querySelector<HTMLElement>(".card")!;
  let current: HTMLButtonElement | undefined, settle = 0, fade = 0;
  // Update the selection and crossfade the card. Hover is debounced so sweeping across the shelf
  // doesn't flick through every title; focus and click are immediate.
  const show = (b: HTMLButtonElement, instant = false) => {
    clearTimeout(settle);
    const apply = () => {
      if (b === current) return;
      current = b;
      visible().forEach((s) => { s.classList.toggle("on", s === b); s.tabIndex = s === b ? 0 : -1; });
      const fill = () => {
        bt.textContent = b.dataset.title!;
        ba.textContent = b.dataset.author!;
        bn.textContent = b.dataset.note || "";
        card.classList.remove("swap");
      };
      clearTimeout(fade);
      if (reduce || instant) return fill();
      card.classList.add("swap");
      fade = window.setTimeout(fill, 180);
    };
    instant ? apply() : (settle = window.setTimeout(apply, 90));
  };
  const pick = () => {
    const others = items.filter((li) => li !== mine).sort(() => Math.random() - 0.5);
    const chosen = [mine, ...others.slice(0, SHOWN - 1)];
    items.forEach((li) => (li.hidden = !chosen.includes(li)));
    [...chosen, ...others.slice(SHOWN - 1)].forEach((li) => shelfEl.append(li));
    items.forEach((li) => li.querySelector(".spine")!.classList.remove("on"));
    current = undefined;
    show(mine.querySelector(".spine")!, true);
  };
  items.forEach((li) => {
    const b = li.querySelector<HTMLButtonElement>(".spine")!;
    b.addEventListener("pointerenter", () => show(b));
    b.addEventListener("focus", () => show(b, true));
    b.addEventListener("click", () => show(b, true));
  });
  shelfEl.addEventListener("pointerleave", () => clearTimeout(settle));
  shelfEl.addEventListener("keydown", (e) => {
    const list = visible();
    const i = list.indexOf(document.activeElement as HTMLButtonElement);
    const j = { ArrowRight: i + 1, ArrowDown: i + 1, ArrowLeft: i - 1, ArrowUp: i - 1, Home: 0, End: list.length - 1 }[e.key];
    if (j === undefined || i < 0) return;
    e.preventDefault();
    list[Math.max(0, Math.min(list.length - 1, j))].focus();
  });
  pick();
  wrapEl.querySelector(".reshelve")!.addEventListener("click", () => {
    if (reduce) return pick();
    row.classList.add("out");
    setTimeout(() => { pick(); row.classList.remove("out"); }, 300);
  });
}

// ON HOLD (rendered only if <ThreeAm /> is mounted). The 3 a.m. test. The clock shows the visitor's local time. Picking a subject sweeps the hands
// forward to 3:00 (always forward, so they never spin backwards), swaps the subject, then
// drifts back to the real time.
const three = document.querySelector<HTMLElement>(".three");
if (three) {
  const topics: string[] = JSON.parse(three.dataset.topics || "[]");
  const hh = three.querySelector<SVGGElement>(".hh")!;
  const mh = three.querySelector<SVGGElement>(".mh")!;
  const topicEl = three.querySelector<HTMLElement>(".topic")!;
  const ask = three.querySelector<HTMLAnchorElement>(".ask")!;
  const now = () => {
    const d = new Date();
    const m = d.getMinutes() + d.getSeconds() / 60;
    return [((d.getHours() % 12) + m / 60) * 30, m * 6];
  };
  const ahead = (cur: number, target: number) => cur + ((((target - cur) % 360) + 360) % 360);
  let [hA, mA] = now();
  let at3 = false, back = 0, i = 0;
  const paint = () => {
    hh.style.transform = `rotate(${hA}deg)`;
    mh.style.transform = `rotate(${mA}deg)`;
  };
  hh.style.transition = mh.style.transition = "none";
  paint();
  requestAnimationFrame(() => requestAnimationFrame(() => (hh.style.transition = mh.style.transition = "")));
  setInterval(() => {
    if (at3 || document.hidden) return;
    const [h, m] = now();
    hA = ahead(hA, h);
    mA = ahead(mA, m);
    paint();
  }, 20000);

  const pick = () => {
    i = (i + 1 + Math.floor(Math.random() * (topics.length - 1))) % topics.length;
    at3 = true;
    hA = ahead(hA, 90);
    mA = ahead(mA, 0) + 360; // one full turn of the minute hand, even if it's already at 12
    paint();
    topicEl.classList.add("swap");
    setTimeout(() => {
      topicEl.textContent = topics[i];
      ask.dataset.subject = `3 a.m. question: ${topics[i]}`;
      ask.removeAttribute("data-armed");
      topicEl.classList.remove("swap");
    }, reduce ? 0 : 600);
    clearTimeout(back);
    back = window.setTimeout(() => {
      at3 = false;
      const [h, m] = now();
      hA = ahead(hA, h);
      mA = ahead(mA, m);
      paint();
    }, 7000);
  };
  three.querySelector(".clock-btn")!.addEventListener("click", pick);
  three.querySelector(".shuffle")!.addEventListener("click", pick);
}

// "I'm bored": a random site from the list baked in at build time.
const bored = document.querySelector<HTMLButtonElement>("[data-bored]");
bored?.addEventListener("click", () => {
  const sites: string[] = JSON.parse(bored.dataset.bored || "[]");
  const url = sites[Math.floor(Math.random() * sites.length)];
  if (!url) return;
  window.open(url, "_blank", "noopener");
  const note = document.querySelector("[data-bored-note]");
  if (note) note.textContent = `Opened ${new URL(url).hostname} in a new tab.`;
});

export {};
