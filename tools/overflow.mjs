import { chromium } from 'playwright';
const [,, url, w = '1440'] = process.argv;
const b = await chromium.launch({ executablePath: '/opt/google/chrome/chrome', args: ['--no-sandbox'] });
const p = await b.newPage({ viewport: { width: +w, height: 900 } });
await p.goto(url, { waitUntil: 'networkidle' });
const r = await p.evaluate(() => { const W = document.documentElement.clientWidth; const out = []; document.querySelectorAll('body *').forEach(el => { const b = el.getBoundingClientRect(); let a = el.parentElement, clipped = false; while (a) { const o = getComputedStyle(a); if (o.overflowX !== "visible" && a !== document.documentElement && a !== document.body) { clipped = true; break; } a = a.parentElement; } if (!clipped && b.right > W + 1 && b.width > 0) { const cs = getComputedStyle(el); out.push(`${el.tagName}.${[...el.classList].join('.')} right=${Math.round(b.right)} w=${Math.round(b.width)}`); } }); return { sw: document.documentElement.scrollWidth, W, out: out.slice(0, 15) }; });
console.log(JSON.stringify(r, null, 1));
await b.close();
