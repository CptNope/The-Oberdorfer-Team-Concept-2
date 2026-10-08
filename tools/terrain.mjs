// Generates the illustrative contour terrain for "Central Massachusetts" sheets.
// Schematic, not survey data: synthetic elevation shaped to echo the region
// (higher ground to the NW toward Holden, drumlin hills around Worcester,
// the Lake Quinsigamond trough, and the Blackstone valley falling SE).
import { contours } from 'd3-contour';
import { createNoise2D } from 'simplex-noise';
import { writeFileSync } from 'node:fs';

const W = 1600, H = 1000, STEP = 2;
const GW = W / STEP + 1, GH = H / STEP + 1;

function mulberry32(a) { return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const rand = mulberry32(1874);           // seeded: the sheet is stable between builds
const n1 = createNoise2D(rand), n2 = createNoise2D(rand), n3 = createNoise2D(rand);

export const towns = [
  { slug: 'holden',     name: 'Holden',     x: 0.24, y: 0.21 },
  { slug: 'worcester',  name: 'Worcester',  x: 0.40, y: 0.47 },
  { slug: 'shrewsbury', name: 'Shrewsbury', x: 0.70, y: 0.34 },
  { slug: 'auburn',     name: 'Auburn',     x: 0.27, y: 0.75 },
  { slug: 'millbury',   name: 'Millbury',   x: 0.52, y: 0.80 },
  { slug: 'grafton',    name: 'Grafton',    x: 0.79, y: 0.70 },
];

// Lake Quinsigamond: long, narrow, north–south, between Worcester and Shrewsbury.
const lakePts = [];
for (let i = 0; i <= 40; i++) {
  const t = i / 40, y = 0.18 + t * 0.40;
  const x = 0.555 + Math.sin(t * 5.2) * 0.012 + (t - 0.5) * 0.02;
  const w = 0.004 + Math.sin(Math.PI * t) * 0.009;
  lakePts.push([x, y, w]);
}
// Blackstone River: from Worcester's south side down through Millbury to Grafton and off the sheet SE.
const riverCtl = [[0.43, 0.56], [0.46, 0.66], [0.50, 0.73], [0.54, 0.84], [0.62, 0.88], [0.71, 0.86], [0.80, 0.90], [0.90, 0.96], [1.0, 0.99]];
function catmull(pts, seg = 14) {
  const out = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
    for (let s = 0; s < seg; s++) {
      const t = s / seg, t2 = t * t, t3 = t2 * t;
      out.push([0, 1].map(k => 0.5 * ((2 * p1[k]) + (-p0[k] + p2[k]) * t + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * t2 + (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * t3)));
    }
  }
  out.push(pts[pts.length - 1]);
  return out;
}
const river = catmull(riverCtl);
function distToPolyline(px, py, pl) {
  let best = 1e9;
  for (let i = 0; i < pl.length - 1; i++) {
    const [ax, ay] = pl[i], [bx, by] = pl[i + 1];
    const dx = bx - ax, dy = by - ay, l = dx * dx + dy * dy;
    let t = l ? ((px - ax) * dx + (py - ay) * dy) / l : 0; t = Math.max(0, Math.min(1, t));
    const qx = ax + t * dx - px, qy = ay + t * dy - py;
    best = Math.min(best, Math.sqrt(qx * qx + qy * qy));
  }
  return best;
}
// Drumlins: elongated hills oriented NNW–SSE, the glacial grain of the region.
const drumlins = [];
for (let i = 0; i < 46; i++) drumlins.push({ x: rand(), y: rand(), a: 0.35 + rand() * 0.6, l: 0.05 + rand() * 0.06, w: 0.022 + rand() * 0.02 });
// Worcester's hills cluster near the city.
for (let i = 0; i < 7; i++) { const ang = i / 7 * Math.PI * 2 + 0.4; drumlins.push({ x: 0.40 + Math.cos(ang) * 0.075, y: 0.47 + Math.sin(ang) * 0.11, a: 0.9, l: 0.045, w: 0.024 }); }
const theta = 0.35; // NNW–SSE
const ct = Math.cos(theta), st = Math.sin(theta);

function elev(x, y) {
  const ax = x * 1.6, yc = Math.min(1, Math.max(0, y));
  let e = 0.32 * (1 - x) + 0.38 * (1 - yc) * (1 - x * 0.6);           // regional tilt: high NW, low SE
  e += 0.30 * n1(ax * 2.1, y * 2.1) + 0.16 * n2(ax * 5.3, y * 5.3) + 0.05 * n3(ax * 12, y * 12);
  for (const d of drumlins) {
    const dx = (x - d.x) * 1.6, dy = y - d.y;
    const u = dx * ct - dy * st, v = dx * st + dy * ct;
    e += d.a * Math.exp(-(u * u) / (2 * d.w * d.w) - (v * v) / (2 * d.l * d.l));
  }
  const rd = distToPolyline(x, y, river);
  e -= 0.55 * Math.exp(-(rd * rd) / (2 * 0.045 * 0.045));
  for (const [lx, ly, lw] of lakePts) { const dx = (x - lx) * 1.6, dy = (y - ly); e -= 0.05 * Math.exp(-(dx * dx) / (2 * (lw + 0.02) ** 2) - (dy * dy) / (2 * 0.02 ** 2)); }
  return e;
}
// extra drumlins in the extended bands (used only by the tall search-map sheet)
for (let i = 0; i < 30; i++) drumlins.push({ x: rand(), y: rand() < 0.5 ? -0.5 + rand() * 0.5 : 1 + rand() * 0.5, a: 0.35 + rand() * 0.6, l: 0.05 + rand() * 0.06, w: 0.022 + rand() * 0.02 });
const values = new Float64Array(GW * GH);
for (let j = 0; j < GH; j++) for (let i = 0; i < GW; i++) values[j * GW + i] = elev(i / (GW - 1), j / (GH - 1));
let min = Infinity, max = -Infinity; for (const v of values) { if (v < min) min = v; if (v > max) max = v; }
const LEVELS = 46;
const thresholds = Array.from({ length: LEVELS }, (_, k) => min + (max - min) * (k + 0.5) / LEVELS);
const gen = contours().size([GW, GH]).thresholds(thresholds)(values);

const onEdge = ([x, y]) => x <= 0.6 || y <= 0.6 || x >= GW - 1.6 || y >= GH - 1.6;
function rdp(pts, eps) {
  if (pts.length < 3) return pts;
  let idx = 0, dmax = 0; const [a, b] = [pts[0], pts[pts.length - 1]];
  const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1;
  for (let i = 1; i < pts.length - 1; i++) { const d = Math.abs(dy * pts[i][0] - dx * pts[i][1] + b[0] * a[1] - b[1] * a[0]) / l; if (d > dmax) { dmax = d; idx = i; } }
  if (dmax > eps) return rdp(pts.slice(0, idx + 1), eps).slice(0, -1).concat(rdp(pts.slice(idx), eps));
  return [a, b];
}
const f = v => Math.round(v * STEP * 10) / 10;
function simpXL(r) { const a = r[0], b = r[r.length - 1]; if (r.length > 8 && Math.hypot(a[0] - b[0], a[1] - b[1]) < 1e-6) { const m = r.length >> 1; return rdp(r.slice(0, m + 1), 0.45).slice(0, -1).concat(rdp(r.slice(m), 0.45)); } return rdp(r, 0.45); }
const levels = gen.map((g, k) => {
  const runs = [];
  for (const poly of g.coordinates) for (const ring of poly) {
    let cur = [];
    for (const p of ring) { if (onEdge(p)) { if (cur.length > 2) runs.push(cur); cur = []; } else cur.push(p); }
    if (cur.length > 2) runs.push(cur);
  }
  const simp = r => { const a = r[0], b = r[r.length - 1]; if (r.length > 8 && Math.hypot(a[0] - b[0], a[1] - b[1]) < 1e-6) { const m = r.length >> 1; return rdp(r.slice(0, m + 1), 0.45).slice(0, -1).concat(rdp(r.slice(m), 0.45)); } return rdp(r, 0.45); };
  const d = runs.map(simp).filter(r => r.length > 1).map(r => 'M' + r.map(([x, y]) => `${f(x)} ${f(y)}`).join('L')).join('');
  return { index: (k + 1) % 5 === 0, d };
}).filter(l => l.d);

// tall sheet: same field continued from y = -0.5 to 1.5 so maps can fill portrait columns
const GH2 = (GH - 1) * 2 + 1;
const valuesXL = new Float64Array(GW * GH2);
for (let j = 0; j < GH2; j++) for (let i = 0; i < GW; i++) valuesXL[j * GW + i] = elev(i / (GW - 1), -0.5 + j / (GH - 1));
const genXL = contours().size([GW, GH2]).thresholds(thresholds)(valuesXL);
const onEdgeXL = ([x, y]) => x <= 0.6 || y <= 0.6 || x >= GW - 1.6 || y >= GH2 - 1.6;
const levelsXL = genXL.map((g, k) => {
  const runs = [];
  for (const poly of g.coordinates) for (const ring of poly) { let cur = []; for (const p of ring) { if (onEdgeXL(p)) { if (cur.length > 2) runs.push(cur); cur = []; } else cur.push(p); } if (cur.length > 2) runs.push(cur); }
  const d = runs.map(simpXL).filter(r => r.length > 1).map(r => 'M' + r.map(([x, y]) => `${f(x)} ${Math.round((y * STEP - 500) * 10) / 10}`).join('L')).join('');
  return { index: (k + 1) % 5 === 0, d };
}).filter(l => l.d);
const lakeLeft = lakePts.map(([x, y, w]) => [(x - w / 1.6) * W, y * H]);
const lakeRight = lakePts.map(([x, y, w]) => [(x + w / 1.6) * W, y * H]).reverse();
const lake = 'M' + catmull(lakeLeft.concat(lakeRight).map(([x, y]) => [x, y]), 3).map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join('L') + 'Z';
const riverD = 'M' + river.map(([x, y]) => `${(x * W).toFixed(1)} ${(y * H).toFixed(1)}`).join('L');

const out = { width: W, height: H, levels, levelsXL, lake, river: riverD, towns: towns.map(t => ({ ...t, px: Math.round(t.x * W), py: Math.round(t.y * H) })),
  note: 'Illustrative terrain generated by tools/terrain.mjs (seed 1874). Not survey data.' };
writeFileSync(new URL('../assets/terrain/terrain.json', import.meta.url), JSON.stringify(out));
console.log('levels', levels.length, 'bytes', JSON.stringify(out).length);
