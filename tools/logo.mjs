// Builds the Oberdorfer Team mark and lockups as outlined SVG (no font dependency).
import opentype from 'opentype.js';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const fontDir = new URL('./node_modules/@fontsource/', import.meta.url);
const load = p => { const b = readFileSync(new URL(p, fontDir)); return opentype.parse(b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength)); };
const besley800 = load('besley/files/besley-latin-800-normal.woff');
const besley400i = load('besley/files/besley-latin-400-italic.woff');
const over700 = load('overpass/files/overpass-latin-700-normal.woff');

// ---- The mark: three contour rings of one small hill, the summit offset north-west.
// Read as an "O" for Oberdorfer and as a place on a map. Deterministic.
export function markRings(size = 48) {
  const rings = [
    { r: 0.43, cx: 0.5, cy: 0.5, a: [0.035, 0.03, 0.02], p: [0.6, 1.9, 0.2] },
    { r: 0.285, cx: 0.48, cy: 0.475, a: [0.05, 0.035, 0.02], p: [0.9, 2.4, 1.1] },
    { r: 0.135, cx: 0.455, cy: 0.445, a: [0.07, 0.05, 0.0], p: [1.3, 0.4, 0] },
  ];
  return rings.map(({ r, cx, cy, a, p }) => {
    const pts = [];
    for (let i = 0; i < 96; i++) {
      const t = i / 96 * Math.PI * 2;
      const rr = r * (1 + a[0] * Math.sin(2 * t + p[0]) + a[1] * Math.sin(3 * t + p[1]) + a[2] * Math.sin(5 * t + p[2]));
      pts.push([(cx + rr * Math.cos(t)) * size, (cy + rr * Math.sin(t)) * size]);
    }
    return 'M' + pts.map(([x, y]) => `${x.toFixed(2)} ${y.toFixed(2)}`).join('L') + 'Z';
  });
}
const STROKE = 2.9; // at 48 units

const n = v => (Math.round(v * 100) / 100).toString();
const ser = cmds => cmds.map(c => c.type === 'Z' ? 'Z' : c.type === 'Q' ? `Q${n(c.x1)} ${n(c.y1)} ${n(c.x)} ${n(c.y)}` : c.type === 'C' ? `C${n(c.x1)} ${n(c.y1)} ${n(c.x2)} ${n(c.y2)} ${n(c.x)} ${n(c.y)}` : `${c.type}${n(c.x)} ${n(c.y)}`).join('');
function textPath(font, str, x, y, size, letterSpacing = 0) {
  let d = '', cx = x;
  const glyphs = font.stringToGlyphs(str);
  glyphs.forEach((g, i) => {
    d += ser(g.getPath(cx, y, size).commands);
    cx += (g.advanceWidth / font.unitsPerEm) * size + letterSpacing;
    if (i < glyphs.length - 1) cx += ((font.getKerningValue(g, glyphs[i + 1]) || 0) / font.unitsPerEm) * size;
  });
  return { d, width: cx - x - letterSpacing };
}

function lockup({ attribution = false, stacked = false, ink = '#161e25', accent = '#17482f', sub = '#424c55' }) {
  const rings = markRings(48);
  const mark = (tx, ty, s) => `<g transform="translate(${tx} ${ty}) scale(${s})" fill="none" stroke="${accent}" stroke-width="${STROKE}" stroke-linejoin="round">${rings.map(d => `<path d="${d}"/>`).join('')}</g>`;
  if (!stacked) {
    const S = 34; // cap-ish size
    const the = textPath(besley400i, 'The', 0, 0, S * 0.98);
    const ob = textPath(besley800, 'Oberdorfer', 0, 0, S);
    const team = textPath(besley400i, 'Team', 0, 0, S * 0.98);
    const gap = S * 0.24, x0 = 66;
    let x = x0;
    const parts = [];
    parts.push(textPath(besley400i, 'The', x, 42, S * 0.98)); x += the.width + gap;
    parts.push(textPath(besley800, 'Oberdorfer', x, 42, S)); x += ob.width + gap;
    parts.push(textPath(besley400i, 'Team', x, 42, S * 0.98)); x += team.width;
    let h = 56, extra = '';
    if (attribution) {
      const at = textPath(over700, 'AT REWAP BROKERAGE', x0 + 1, 70, 11.5, 2.2);
      extra = `<path d="${at.d}" fill="${sub}"/>`; h = 78;
    }
    const w = Math.ceil(x + 2);
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="The Oberdorfer Team${attribution ? ' at REWAP Brokerage' : ''}">${mark(0, attribution ? 6 : 4, 1)}<path d="${parts.map(p => p.d).join('')}" fill="${ink}"/>${extra}</svg>`;
  }
  // stacked: mark, then "The" / "Oberdorfer" / "Team", centered
  const ob = textPath(besley800, 'Oberdorfer', 0, 0, 52);
  const w = Math.ceil(ob.width + 8), cx = w / 2;
  const the = textPath(besley400i, 'The', 0, 0, 26), team = textPath(besley400i, 'Team', 0, 0, 26);
  const theP = textPath(besley400i, 'The', cx - the.width / 2, 108, 26);
  const obP = textPath(besley800, 'Oberdorfer', 4, 152, 52);
  const teamP = textPath(besley400i, 'Team', cx - team.width / 2, 186, 26);
  let h = 198, extra = '';
  if (attribution) { const at = textPath(over700, 'AT REWAP BROKERAGE', 0, 0, 12, 2.4); const atP = textPath(over700, 'AT REWAP BROKERAGE', cx - at.width / 2, 222, 12, 2.4); extra = `<path d="${atP.d}" fill="${sub}"/>`; h = 232; }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="The Oberdorfer Team${attribution ? ' at REWAP Brokerage' : ''}">${mark(cx - 34, 0, 68 / 48)}<path d="${theP.d}${obP.d}${teamP.d}" fill="${ink}"/>${extra}</svg>`;
}

const out = new URL('../assets/brand/', import.meta.url);
mkdirSync(out, { recursive: true });
const rings = markRings(48);
const markSvg = (stroke) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48" role="img" aria-label="The Oberdorfer Team mark"><g fill="none" stroke="${stroke}" stroke-width="${STROKE}" stroke-linejoin="round">${rings.map(d => `<path d="${d}"/>`).join('')}</g></svg>`;
writeFileSync(new URL('mark.svg', out), markSvg('#17482f'));
writeFileSync(new URL('mark-reversed.svg', out), markSvg('#f5f8f4'));
writeFileSync(new URL('mark-ink.svg', out), markSvg('#161e25'));
writeFileSync(new URL('favicon.svg', out), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><rect width="48" height="48" rx="6" fill="#17482f"/><g fill="none" stroke="#f5f8f4" stroke-width="3.4" stroke-linejoin="round" transform="translate(5 5) scale(.79)">${rings.map(d => `<path d="${d}"/>`).join('')}</g></svg>`);
writeFileSync(new URL('logo-horizontal.svg', out), lockup({}));
writeFileSync(new URL('logo-horizontal-attribution.svg', out), lockup({ attribution: true }));
writeFileSync(new URL('logo-horizontal-reversed.svg', out), lockup({ attribution: true, ink: '#f5f8f4', accent: '#b7d3bb', sub: '#b7d3bb' }));
writeFileSync(new URL('logo-stacked.svg', out), lockup({ stacked: true }));
writeFileSync(new URL('logo-stacked-attribution.svg', out), lockup({ stacked: true, attribution: true }));
writeFileSync(new URL('../data/mark.json', import.meta.url), JSON.stringify({ rings, stroke: STROKE }));
console.log('logo files written');
