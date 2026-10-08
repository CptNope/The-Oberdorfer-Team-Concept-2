import { chromium } from 'playwright';
const S = process.argv[2]; const jobs = JSON.parse(process.argv[3]);
const b = await chromium.launch({ executablePath: '/opt/google/chrome/chrome', args: ['--no-sandbox'] });
for (const [url, name, w, h, full] of jobs) {
  const p = await b.newPage({ viewport: { width: w, height: h }, reducedMotion: 'reduce' });
  const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => m.type() === 'error' && errs.push(m.text()));
  await p.goto('http://localhost:8765/' + url, { waitUntil: 'networkidle' }); await p.waitForTimeout(400);
  const sw = await p.evaluate(() => document.documentElement.scrollWidth);
  await p.screenshot({ path: `${S}/${name}.png`, fullPage: !!full });
  console.log(name, 'scrollWidth', sw, errs.length ? 'ERR ' + errs.join(' | ') : '');
  await p.close();
}
await b.close();
