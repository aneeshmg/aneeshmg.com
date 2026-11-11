// The WebGL scene, loaded by site.ts after the page is usable.
// "shapes" (home): ~40k particles morph through one shape per section as you scroll, with annotations, the
// glow following the shape, and the section colour fed to the CSS as --sc.
// "ambient" (other pages): drifting dust tinted by the page's practice; the CSS glow stays put.
// Without WebGL this module throws and site.ts removes the canvas; the page is unchanged otherwise.
import * as THREE from "three";
import { MeshSurfaceSampler } from "three/addons/math/MeshSurfaceSampler.js";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";

const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const mobile = matchMedia("(max-width: 760px), (pointer: coarse)").matches;
const root = document.documentElement;
const night = () => root.dataset.theme === "dark";
const canvas = document.querySelector<HTMLCanvasElement>("#gl")!;
const withShapes = canvas.dataset.scene === "shapes";

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, mobile ? 1.5 : 1.75));
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
camera.position.set(0, 0, 9.5);
const group = new THREE.Group();
scene.add(group);

// ---------- Palette: two shades per role; each particle picks a point between them ----------
// 0 neutral, 1 engineer, 2 trainer, 3 author, 4 maker, 5 student, 6 silver, 7 warm accent.
// The first shade of 1–5 is --c-* in global.css; change both together.
const PAL = {
  dark: [["#e6e1d6", "#fbf8f1"], ["#4f8dff", "#7cc3ff"], ["#ff6a3d", "#ff9466"], ["#ffb627", "#ffd76a"], ["#ff5c9d", "#a879ff"], ["#2fd88f", "#a6e24a"], ["#e4ecf7", "#ffffff"], ["#ffc46b", "#ff9a3d"]],
  light: [["#1c1c1a", "#3a3834"], ["#0f4fd1", "#2b6ef0"], ["#d6390a", "#ec5a24"], ["#b87800", "#d99400"], ["#c2186b", "#7a2fd0"], ["#0b8a54", "#4c9a0a"], ["#3d4a5e", "#647189"], ["#c95800", "#e57a10"]],
};
const palA = { value: Array.from({ length: 8 }, () => new THREE.Color()) };
const palB = { value: Array.from({ length: 8 }, () => new THREE.Color()) };
// Each section's colour role: hero, the five practices, say hello.
const SEC = [0, 1, 2, 3, 4, 5, 7];
const TINT: Record<string, number> = { neutral: 0, engineer: 1, trainer: 2, author: 3, maker: 4, student: 5 };
let secCols: THREE.Color[] = [], secColsB: THREE.Color[] = [];
const setPalette = () => {
  const pal = PAL[night() ? "dark" : "light"];
  pal.forEach(([a, b], i) => { palA.value[i].set(a); palB.value[i].set(b); });
  secCols = SEC.map((c) => new THREE.Color(pal[c][0]));
  secColsB = SEC.map((c) => new THREE.Color(pal[c][1]));
};

const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
const N = mobile ? 15000 : 40000;

// ---------- Shapes (home only) ----------
type Shape = { pos: Float32Array; ci: Float32Array };
const M = (x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0) =>
  new THREE.Matrix4().compose(V(x, y, z), new THREE.Quaternion().setFromEuler(new THREE.Euler(rx, ry, rz)), V(1, 1, 1));

function shuffle(pos: Float32Array, ci: Float32Array): Shape {
  for (let i = N - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    for (let c = 0; c < 3; c++) { const t = pos[i * 3 + c]; pos[i * 3 + c] = pos[j * 3 + c]; pos[j * 3 + c] = t; }
    const t = ci[i]; ci[i] = ci[j]; ci[j] = t;
  }
  return { pos, ci };
}
// Sample parts by surface area (times w) into one shuffled set of N points, each with a palette role.
type Part = { g: THREE.BufferGeometry; ci: number; m?: THREE.Matrix4; w?: number };
function sample(parts: Part[]): Shape {
  const A = V(), B = V(), C = V(), v = V();
  const info = parts.map((p) => {
    const g = p.g.index ? p.g.toNonIndexed() : p.g.clone();
    if (p.m) g.applyMatrix4(p.m);
    const pos = g.attributes.position as THREE.BufferAttribute;
    let a = 0;
    for (let i = 0; i < pos.count; i += 3) {
      A.fromBufferAttribute(pos, i); B.fromBufferAttribute(pos, i + 1); C.fromBufferAttribute(pos, i + 2);
      a += B.sub(A).cross(C.sub(A)).length() / 2;
    }
    return { g, a: a * (p.w ?? 1), ci: p.ci };
  });
  const total = info.reduce((s, x) => s + x.a, 0);
  const out = new Float32Array(N * 3), ci = new Float32Array(N);
  let k = 0;
  info.forEach((x, idx) => {
    const cnt = idx === info.length - 1 ? N - k : Math.round((N * x.a) / total);
    const s = new MeshSurfaceSampler(new THREE.Mesh(x.g)).build();
    for (let i = 0; i < cnt && k < N; i++, k++) { s.sample(v); out.set([v.x, v.y, v.z], k * 3); ci[k] = x.ci; }
  });
  return shuffle(out, ci);
}
// Hero: a sphere of points, in the neutral tone.
function sphere(): Shape {
  const pos = new Float32Array(N * 3), ci = new Float32Array(N), g = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < N; i++) {
    const y = 1 - (i / (N - 1)) * 2, r = Math.sqrt(1 - y * y), t = g * i, R = 1.7 + (Math.random() - 0.5) * 0.12;
    pos.set([Math.cos(t) * r * R, y * R, Math.sin(t) * r * R], i * 3);
  }
  return shuffle(pos, ci);
}
async function buildShapes(): Promise<Shape[]> {
  // Only the glyphs used here ({ } h e l o .), subset from three.js's Droid Sans Bold (Apache 2.0, see public/fonts).
  const font = await new FontLoader().loadAsync("/fonts/particle-glyphs.json");
  const text = (str: string, size: number, depth = 0.3) => {
    const g = new TextGeometry(str, { font, size, depth, curveSegments: 8, bevelEnabled: false });
    g.center();
    return g;
  };
  const box = (x: number, y: number, z: number) => new THREE.BoxGeometry(x, y, z);
  const fan = (len: number, ang: number) =>
    new THREE.Matrix4().makeTranslation(-1, -0.7, 0).multiply(M(0, 0, 0, 0, 0, ang)).multiply(new THREE.Matrix4().makeTranslation(len / 2, 0, 0));
  return [
    sphere(),
    // Engineer: code between braces.
    sample([{ g: text("{", 2.6, 0.35), ci: 1, m: M(-1.35) }, { g: text("}", 2.6, 0.35), ci: 1, m: M(1.35) },
      { g: box(1.2, 0.12, 0.12), ci: 2, m: M(-0.1, 0.6), w: 3 }, { g: box(1.4, 0.12, 0.12), ci: 3, m: M(0.1, 0.2), w: 3 },
      { g: box(0.8, 0.12, 0.12), ci: 5, m: M(0, -0.2), w: 3 }, { g: box(1.1, 0.12, 0.12), ci: 4, m: M(-0.15, -0.6), w: 3 }]),
    // Trainer: a kettlebell.
    sample([{ g: new THREE.LatheGeometry([[0, 0], [0.75, 0], [1.05, 0.2], [1.2, 0.7], [1.12, 1.25], [0.9, 1.65], [0.5, 1.9], [0, 1.95]].map(([x, y]) => new THREE.Vector2(x, y)), 64), ci: 2, m: M(0, -1.45) },
      { g: new THREE.TubeGeometry(new THREE.CatmullRomCurve3([[-0.62, 0.3], [-0.78, 0.85], [-0.45, 1.3], [0.45, 1.3], [0.78, 0.85], [0.62, 0.3]].map(([x, y]) => V(x, y, 0))), 64, 0.15, 16), ci: 2, w: 2 }]),
    // Author: an open book with lines of text.
    sample([{ g: new THREE.BoxGeometry(1.5, 2, 0.05, 20, 20, 1), ci: 3, m: M(-0.74, 0, 0.25, 0, 0.45) }, { g: new THREE.BoxGeometry(1.5, 2, 0.05, 20, 20, 1), ci: 3, m: M(0.74, 0, 0.25, 0, -0.45) },
      { g: box(1, 0.06, 0.02), ci: 7, m: M(-0.78, 0.5, 0.32, 0, 0.45), w: 4 }, { g: box(1, 0.06, 0.02), ci: 7, m: M(-0.78, 0.2, 0.32, 0, 0.45), w: 4 }, { g: box(0.7, 0.06, 0.02), ci: 7, m: M(-0.9, -0.1, 0.3, 0, 0.45), w: 4 }]),
    // Maker: a soap bar and bubbles.
    sample([{ g: new RoundedBoxGeometry(2.4, 0.8, 1.3, 4, 0.32), ci: 4, m: M(0, -0.6) },
      { g: new THREE.SphereGeometry(0.35, 24, 16), ci: 6, m: M(-0.6, 0.55), w: 1.4 }, { g: new THREE.SphereGeometry(0.22, 24, 16), ci: 6, m: M(0.25, 0.95), w: 1.4 },
      { g: new THREE.SphereGeometry(0.45, 24, 16), ci: 6, m: M(0.7, 0.45), w: 1.4 }, { g: new THREE.SphereGeometry(0.14, 24, 16), ci: 6, m: M(1.05, 1.4), w: 1.4 }]),
    // Student: a multi-tool, blades fanned out.
    sample([{ g: new RoundedBoxGeometry(2.6, 0.55, 0.4, 4, 0.2), ci: 5, m: M(0.2, -0.7) },
      { g: box(2, 0.18, 0.06), ci: 6, m: fan(2, 1.15), w: 1.6 }, { g: box(1.7, 0.08, 0.06), ci: 6, m: fan(1.7, 0.75), w: 1.6 }, { g: box(1.4, 0.14, 0.06), ci: 6, m: fan(1.4, 0.4), w: 1.6 }]),
    // Say hello.
    sample([{ g: text("hello.", 1.25, 0.3), ci: 7 }]),
  ];
}

// Annotation anchors per practice (shape-local point, then label offset in px), in the order of
// each practice's `notes` in src/data/site.ts.
const ANCHORS: [number, number, number, number, number][][] = [
  [[1.55, 1.15, 0, 70, -36], [1.75, 0, 0, 80, 0], [1.55, -1.15, 0, 70, 36]],
  [[0.62, 1.4, 0, 80, -34], [1.2, -0.45, 0, 90, -14], [0.85, -1.35, 0, 80, 34], [-1.18, -0.6, 0, -90, 26]],
  [[-1.25, 0.95, 0.2, -70, -36], [1.25, -0.95, 0.2, 70, 36]],
  [[1.12, 1.45, 0, 70, -28], [1.2, -0.6, 0, 80, 6], [-0.9, -1.0, 0, -70, 44]],
  [[-0.18, 1.12, 0, 70, -34], [0.24, 0.46, 0, 140, -6], [0.29, -0.16, 0, 170, 14], [1.5, -0.7, 0, 60, 44]],
];

// ---------- Ambient dust: a sparse field over the whole page; on the home page some is drawn in while a shape forms ----------
const ND = mobile ? 900 : 2600, dust = new Float32Array(ND * 3);
for (let i = 0; i < ND; i++) dust.set([(Math.random() - 0.5) * 20, (Math.random() - 0.5) * 12, -8 + Math.random() * 10], i * 3);
const dustGeo = new THREE.BufferGeometry();
dustGeo.setAttribute("position", new THREE.BufferAttribute(dust, 3));
dustGeo.setAttribute("aR", new THREE.BufferAttribute(Float32Array.from({ length: ND }, Math.random), 1));
const dustMat = new THREE.ShaderMaterial({
  transparent: true, depthWrite: false,
  uniforms: { uTime: { value: 0 }, uPx: { value: renderer.getPixelRatio() }, uTurb: { value: reduce ? 0 : 1 }, uCol: { value: new THREE.Color() }, uNeu: { value: palA.value[0] },
    uAlpha: { value: 0.5 }, uScale: { value: 1 }, uNeuAmt: { value: 1 }, uPull: { value: 0 }, uG: { value: V() } },
  vertexShader: `attribute float aR; uniform float uTime, uPx, uTurb, uPull, uScale, uNeuAmt; uniform vec3 uCol, uNeu, uG; varying vec3 vCol; varying float vA;
    void main() {
      vec3 p = position + vec3(sin(uTime * .05 + aR * 40.) * .6, cos(uTime * .04 + aR * 25.) * .4, sin(uTime * .03 + aR * 13.) * .3) * uTurb;
      p = mix(p, uG + (p - uG) * .3, uPull * smoothstep(.8, .9, aR));
      vec4 mv = modelViewMatrix * vec4(p, 1.); gl_Position = projectionMatrix * mv;
      gl_PointSize = (9. + aR * 15.) * uScale * uPx / -mv.z;
      vCol = mix(uCol, uNeu, uNeuAmt * (1. - step(.4, aR))); vA = .3 + aR * .7;
    }`,
  fragmentShader: `uniform float uAlpha; varying vec3 vCol; varying float vA;
    void main() { float a = smoothstep(.5, 0., length(gl_PointCoord - .5)) * uAlpha * vA; if (a < .01) discard; gl_FragColor = vec4(vCol, a); }`,
});
const dustPts = new THREE.Points(dustGeo, dustMat);
dustPts.frustumCulled = false;
scene.add(dustPts);

// ---------- The swarm (home only): staggered, arcing flights between shapes; parts around the pointer ----------
const mat = new THREE.ShaderMaterial({
  transparent: true, depthWrite: false,
  uniforms: { uPalA: palA, uPalB: palB, uMix: { value: 0 }, uTime: { value: 0 }, uPx: { value: renderer.getPixelRatio() }, uSize: { value: 24 },
    uAlpha: { value: 0.8 }, uTurb: { value: reduce ? 0 : 1 }, uMouse: { value: new THREE.Vector2(9, 9) }, uAspect: { value: 1 }, uPush: { value: 0 } },
  vertexShader: `
    attribute vec3 aA; attribute vec3 aB; attribute float cA; attribute float cB; attribute float aR;
    uniform vec3 uPalA[8]; uniform vec3 uPalB[8]; uniform float uMix, uTime, uPx, uSize, uTurb, uPush, uAspect; uniform vec2 uMouse;
    varying vec3 vCol; varying float vA;
    void main() {
      float m = smoothstep(0., 1., clamp((uMix - aR * .4) / .6, 0., 1.));
      float fly = sin(3.14159 * m);
      vec3 p = mix(aA, aB, m);
      // Arc outward and up in flight, with turbulence mid-way; a slow breathing drift at rest.
      p += normalize(p + vec3(.001)) * fly * (.35 + aR * .6) * uTurb;
      p.y += fly * (.25 + aR * .5) * uTurb;
      p += vec3(sin(aR * 41. + uTime * .6), cos(aR * 29. + uTime * .7), sin(aR * 17. + uTime * .5)) * (fly * .35 + .025) * uTurb;
      vec4 mv = modelViewMatrix * vec4(p, 1.);
      gl_Position = projectionMatrix * mv;
      // Part around the pointer in screen space, so it is the same size and shape at any depth or rotation.
      vec2 d = (gl_Position.xy / gl_Position.w - uMouse) * vec2(uAspect, 1.); float r = length(d);
      vec2 push = normalize(d + vec2(1e-4)) * exp(-r * r * 22.) * .035 * uPush;
      gl_Position.xy += push * vec2(1. / uAspect, 1.) * gl_Position.w;
      gl_PointSize = uSize * uPx * (.45 + pow(aR, 2.) * 1.1) * (1. + fly * .3) / -mv.z;
      int a = int(cA + .5), b = int(cB + .5);
      vCol = mix(mix(uPalA[a], uPalB[a], aR), mix(uPalA[b], uPalB[b], aR), m);
      // Depth cue: particles at the back are dimmer.
      vA = (.5 + aR * .5) * mix(.7, 1., smoothstep(12., 8., -mv.z));
    }`,
  fragmentShader: `
    uniform float uAlpha; varying vec3 vCol; varying float vA;
    void main() { float d = length(gl_PointCoord - .5); float a = (smoothstep(.5, .0, d) * .6 + smoothstep(.22, .0, d) * .4) * uAlpha * vA; if (a < .01) discard; gl_FragColor = vec4(vCol, a); }`,
});

// ---------- Theme ----------
function applyTheme() {
  setPalette();
  const dark = night();
  for (const m of [mat, dustMat]) { m.blending = dark ? THREE.AdditiveBlending : THREE.NormalBlending; m.needsUpdate = true; }
  // Light mode: the dust becomes soft coloured bokeh rather than dark specks.
  dustMat.uniforms.uAlpha.value = dark ? 0.6 : 0.5;
  dustMat.uniforms.uScale.value = dark ? 1 : 2.4;
  dustMat.uniforms.uNeuAmt.value = dark ? 1 : 0;
  mat.uniforms.uAlpha.value = dark ? 0.85 : 1.8;
  mat.uniforms.uSize.value = (mobile ? 30 : 24) * (dark ? 1 : 1.1);
  if (!withShapes) dustMat.uniforms.uCol.value.copy(palA.value[TINT[root.dataset.tint ?? ""] ?? 0]);
}
applyTheme();
addEventListener("themechange", applyTheme);

const pointer = { x: 0, y: 0, in: false };
addEventListener("pointermove", (e) => { pointer.x = e.clientX / innerWidth - 0.5; pointer.y = e.clientY / innerHeight - 0.5; pointer.in = true; });
document.addEventListener("pointerleave", () => (pointer.in = false));

function resize() {
  const w = innerWidth, h = innerHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  mat.uniforms.uAspect.value = w / h;
  // The shape sits right of the plates on wide screens, above them on phones.
  group.position.set(w > 760 ? Math.min(2.7, (w / h) * 1.4) : 0, w > 760 ? 0 : 1.6, 0);
  group.scale.setScalar(w > 760 ? 1 : 0.68);
}
addEventListener("resize", resize);
resize();

const clock = new THREE.Clock();
let frame: (t: number) => void = () => {};

if (withShapes) {
  const shapes = await buildShapes();
  const geo = new THREE.BufferGeometry();
  const aA = new THREE.BufferAttribute(new Float32Array(N * 3), 3), aB = new THREE.BufferAttribute(new Float32Array(N * 3), 3);
  const cA = new THREE.BufferAttribute(new Float32Array(N), 1), cB = new THREE.BufferAttribute(new Float32Array(N), 1);
  geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(N * 3), 3));
  geo.setAttribute("aA", aA); geo.setAttribute("aB", aB); geo.setAttribute("cA", cA); geo.setAttribute("cB", cB);
  geo.setAttribute("aR", new THREE.BufferAttribute(Float32Array.from({ length: N }, Math.random), 1));
  const swarm = new THREE.Points(geo, mat);
  swarm.frustumCulled = false;
  group.add(swarm);

  let seg = -1;
  const setSegment = (i: number) => {
    if (i === seg) return;
    seg = i;
    const j = Math.min(i + 1, shapes.length - 1);
    aA.copyArray(shapes[i].pos); aB.copyArray(shapes[j].pos); cA.copyArray(shapes[i].ci); cB.copyArray(shapes[j].ci);
    for (const x of [aA, aB, cA, cB]) x.needsUpdate = true;
  };
  setSegment(0);

  // Annotations: a leader line from a point on the shape, an elbow, then the label (rendered by index.astro).
  const SVG = "http://www.w3.org/2000/svg";
  const notesEl = document.querySelector<HTMLElement>(".notes")!;
  const leads = document.createElementNS(SVG, "svg");
  notesEl.prepend(leads);
  const labels = [...notesEl.querySelectorAll<HTMLElement>(".note")];
  const seen: Record<number, number> = {};
  const notes = labels.map((lab) => {
    const k = Number(lab.dataset.k), [x, y, z, dx, dy] = ANCHORS[k - 1][(seen[k] = (seen[k] ?? -1) + 1)];
    const g = document.createElementNS(SVG, "g"), path = document.createElementNS(SVG, "path"), dot = document.createElementNS(SVG, "circle");
    path.setAttribute("pathLength", "1");
    dot.setAttribute("r", "2.2");
    g.append(path, dot);
    g.style.display = "none";
    leads.append(g);
    return { k, a: V(x, y, z), o: [dx, dy], g, path, dot, lab, on: false };
  });
  const tmp = V();
  const drawNotes = (shown: number) => {
    if (innerWidth <= 1000) return;
    for (const n of notes) {
      const vis = reduce ? +(Math.round(shown) === n.k) : Math.max(0, 1 - Math.abs(shown - n.k) * 3.2);
      if (!vis) { if (n.on) { n.g.style.display = "none"; n.lab.style.opacity = "0"; n.on = false; } continue; }
      if (!n.on) { n.g.style.display = ""; n.on = true; }
      tmp.copy(n.a); group.localToWorld(tmp); tmp.project(camera);
      const x = (tmp.x * 0.5 + 0.5) * innerWidth, y = (-tmp.y * 0.5 + 0.5) * innerHeight;
      const dir = Math.sign(n.o[0]), lx = x + n.o[0], ly = y + n.o[1], e = vis * vis * (3 - 2 * vis);
      n.path.setAttribute("d", `M${x.toFixed(1)},${y.toFixed(1)}L${(lx - dir * 22).toFixed(1)},${ly.toFixed(1)}L${lx.toFixed(1)},${ly.toFixed(1)}`);
      n.path.style.strokeDashoffset = String(1 - e);
      n.dot.setAttribute("cx", x.toFixed(1));
      n.dot.setAttribute("cy", y.toFixed(1));
      n.lab.style.transform = `translate(${lx}px, ${ly}px) translate(${dir > 0 ? "8px" : "calc(-100% - 8px)"}, -50%)`;
      n.lab.style.opacity = String(Math.max(0, (e - 0.5) * 2));
    }
  };

  const glowEl = document.querySelector<HTMLElement>(".glow")!;
  const countEl = document.querySelector(".count b");
  const links = [...document.querySelectorAll<HTMLAnchorElement>(".progress a")];
  const cur = new THREE.Color(), curB = new THREE.Color(), rgb = { r: 0, g: 0, b: 0 }, rgbB = { r: 0, g: 0, b: 0 };
  const css = (c: { r: number; g: number; b: number }) => `${(c.r * 255) | 0} ${(c.g * 255) | 0} ${(c.b * 255) | 0}`;
  let shown = 0, lastCount = 0, lastSc = "";

  frame = (t) => {
    // Scroll position → 0..6 across the page; eased so the shapes glide between sections.
    const max = document.documentElement.scrollHeight - innerHeight;
    const p = max > 0 ? (scrollY / max) * (shapes.length - 1) : 0;
    shown += ((reduce ? Math.round(p) : p) - shown) * (reduce ? 1 : 0.09);
    const i = Math.min(Math.floor(shown), shapes.length - 2);
    setSegment(i);
    mat.uniforms.uMix.value = Math.min(1, shown - i);
    mat.uniforms.uTime.value = t;

    // A slow sway, and a lean toward the pointer.
    group.rotation.y += ((reduce ? 0 : Math.sin(t * 0.22) * 0.35) + pointer.x * 0.55 - group.rotation.y) * 0.05;
    group.rotation.x += (pointer.y * 0.25 - group.rotation.x) * 0.05;
    if (!mobile && !reduce && pointer.in) {
      const m = mat.uniforms.uMouse.value as THREE.Vector2;
      if (mat.uniforms.uPush.value < 0.02) m.set(pointer.x * 2, -pointer.y * 2);
      else m.lerp(new THREE.Vector2(pointer.x * 2, -pointer.y * 2), 0.18);
      mat.uniforms.uPush.value += (1 - mat.uniforms.uPush.value) * 0.08;
    } else mat.uniforms.uPush.value *= 0.92;

    // Section colour: the dust, the glow (which follows the shape) and --sc for the plates and wash.
    const i0 = Math.min(Math.floor(shown), SEC.length - 1), f = Math.min(1, shown - i0), i1 = Math.min(i0 + 1, SEC.length - 1);
    cur.lerpColors(secCols[i0], secCols[i1], f);
    dustMat.uniforms.uCol.value.copy(cur);
    dustMat.uniforms.uPull.value = reduce ? 0 : Math.sin(Math.PI * f);
    dustMat.uniforms.uG.value.copy(group.position);
    cur.getRGB(rgb, THREE.SRGBColorSpace);
    curB.lerpColors(secColsB[i0], secColsB[i1], f).getRGB(rgbB, THREE.SRGBColorSpace);
    tmp.copy(group.position).project(camera);
    glowEl.style.transform = `translate(${((tmp.x * 0.5 + 0.5) * innerWidth).toFixed(1)}px, ${((-tmp.y * 0.5 + 0.5) * innerHeight).toFixed(1)}px)`;
    const sc = css(rgb);
    if (sc !== lastSc) { lastSc = sc; root.style.setProperty("--sc", sc); }
    // In light mode the hero's ink-black would read as a grey smudge, so its glow fades in only as colour arrives.
    const dark = night(), ga = dark || i0 > 0 ? 1 : 0.25 + f * 0.75;
    glowEl.style.setProperty("--gc", `rgb(${sc} / ${(dark ? 0.22 : 0.4) * ga})`);
    glowEl.style.setProperty("--gc2", `rgb(${css(rgbB)} / ${(dark ? 0.12 : 0.3) * ga})`);

    group.updateMatrixWorld();
    drawNotes(shown);
    const c = Math.round(shown);
    if (c + 1 !== lastCount) {
      lastCount = c + 1;
      if (countEl) countEl.textContent = String(lastCount).padStart(2, "0");
      links.forEach((l, k) => l.classList.toggle("on", k === c));
    }
  };
}

// Render only while the tab is visible.
renderer.setAnimationLoop(() => {
  if (document.hidden) return;
  const t = clock.getElapsedTime();
  dustMat.uniforms.uTime.value = t;
  frame(t);
  renderer.render(scene, camera);
});
