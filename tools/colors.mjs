import { converter, formatHex, wcagContrast } from 'culori';
const toRgb = converter('rgb');
export const palette = {
  paper:        'oklch(97.6% 0.006 135)',
  'paper-deep': 'oklch(94.4% 0.012 135)',
  woodland:     'oklch(90.5% 0.04 140)',
  'woodland-deep':'oklch(84% 0.055 142)',
  forest:       'oklch(36% 0.068 158)',
  'forest-deep':'oklch(27.5% 0.052 160)',
  'forest-tint':'oklch(84% 0.045 150)',
  ink:          'oklch(23% 0.018 245)',
  'ink-soft':   'oklch(41% 0.02 245)',
  'ink-faint':  'oklch(58% 0.015 245)',
  contour:      'oklch(62% 0.095 52)',
  'contour-ink':'oklch(48% 0.105 47)',
  clay:         'oklch(90% 0.032 62)',
  water:        'oklch(49% 0.1 242)',
  'water-tint': 'oklch(91% 0.028 235)',
  'water-light':'oklch(74% 0.075 238)',
  route:        'oklch(43% 0.14 27)',
  'route-deep': 'oklch(35% 0.12 27)',
  'route-tint': 'oklch(91% 0.03 30)',
};
const out = {};
for (const [k, v] of Object.entries(palette)) out[k] = { oklch: v, hex: formatHex(toRgb(v)) };
const pairs = [['ink','paper'],['ink-soft','paper'],['ink-faint','paper'],['water','paper'],['route','paper'],['contour-ink','paper'],['paper','forest'],['forest-tint','forest'],['paper','route'],['ink','woodland'],['ink-soft','woodland'],['ink','clay'],['ink','water-tint'],['paper','forest-deep'],['water-light','forest-deep'],['contour','paper'],['ink-soft','paper-deep'],['water','paper-deep'],['woodland','forest']];
const contrast = pairs.map(([f,b]) => ({ fg:f, bg:b, ratio: +wcagContrast(palette[f], palette[b]).toFixed(2) }));
console.log(JSON.stringify({ out, contrast }, null, 1));
import { writeFileSync } from 'node:fs';
writeFileSync(new URL('../data/palette.json', import.meta.url), JSON.stringify({ colors: out, contrast }, null, 2));
