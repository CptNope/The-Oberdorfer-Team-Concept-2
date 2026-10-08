// Builds the Design System artifact's project/ files from the built concept.
import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from 'node:fs';
import * as L from './lib.mjs';
const ROOT = new URL('../', import.meta.url);
const OUT = new URL('../ds/', import.meta.url);
const W = (p, s) => { const u = new URL(p, OUT); mkdirSync(new URL('./', u), { recursive: true }); writeFileSync(u, s); };
const pal = JSON.parse(readFileSync(new URL('data/palette.json', ROOT))).colors;
const usage = {
  paper: 'The sheet. Default page ground.', 'paper-deep': 'Collar strips, panels, data-block heads, the search map column.', woodland: 'Woodland tint: place frames, contact bands, matched towns.', 'woodland-deep': 'Selection and hover on woodland.',
  forest: 'Brand field. Drenched bands, the mark, positive states. Paper text on it 9.83:1.', 'forest-deep': 'Deepest field: code blocks, people frames on forest, paper-button text.', 'forest-tint': 'Secondary text and the mark on forest (6.55:1).',
  ink: 'Culture ink: body text, neatlines, controls (15.76:1 on paper).', 'ink-soft': 'Secondary text and labels (8.23:1 on paper).', 'ink-faint': 'Large type and marks only (3.99:1 on paper). Never body text.',
  contour: 'Contour linework and decorative strokes. Never text (3.51:1).', 'contour-ink': 'Contour-colored text: sample tags, list numerals (6.37:1 on paper).', clay: 'Property photo frames.',
  water: 'Links, information, verified-data tags, focus ring, rivers (5.79:1 on paper).', 'water-tint': 'People photo frames.', 'water-light': 'Links and water on dark fields.',
  route: 'The one primary route per view: main action, current nav, selected station (8.14:1 with paper).', 'route-deep': 'Hover and pressed route.', 'route-tint': 'Open-house field only.',
};
const tokens = {
  name: 'The Oberdorfer Team', version: 1,
  meta: { source: 'CptNope/The-Oberdorfer-Team-Concept-2 · assets/css/tokens.css' },
  color: { themes: [{ id: 'light', name: 'Paper' }], tokens: Object.entries(pal).map(([name, v]) => ({ name, value: { light: v.oklch }, usage: usage[name] || '' })).concat([
    { name: 'rule', value: { light: 'oklch(23% 0.018 245 / 0.16)' }, usage: 'Hairline rules between rows.' },
    { name: 'rule-strong', value: { light: 'oklch(23% 0.018 245 / 0.55)' }, usage: 'Control borders, chip outlines.' }]) },
  type: {
    fonts: [['besley-latin-400-normal.woff2', 'Besley', '400', 'normal'], ['besley-latin-400-italic.woff2', 'Besley', '400', 'italic'], ['besley-latin-600-normal.woff2', 'Besley', '600', 'normal'], ['besley-latin-800-normal.woff2', 'Besley', '800', 'normal'], ['besley-latin-800-italic.woff2', 'Besley', '800', 'italic'], ['overpass-latin-wght-normal.woff2', 'Overpass', '100 900', 'normal'], ['overpass-latin-wght-italic.woff2', 'Overpass', '100 900', 'italic'], ['overpass-mono-latin-500-normal.woff2', 'Overpass Mono', '500', 'normal']].map(([file, family, weight, style]) => ({ family, file: `fonts/${file}`, weight, style })),
    families: { serif: '"Besley", "Iowan Old Style", Georgia, serif', sans: '"Overpass", "Helvetica Neue", Arial, sans-serif', mono: '"Overpass Mono", ui-monospace, Menlo, monospace' },
    groups: [
      { name: 'Voice', family: 'serif', styles: [
        { name: 'display', fontSize: '96px', lineHeight: 0.9, fontWeight: 800, letterSpacing: '-0.035em', sample: 'Find your place.', usage: 'Openings only. clamp(3.25rem, 1.6rem + 6.2vw, 6rem). Second phrase turns italic.' },
        { name: 'h1', fontSize: '68px', lineHeight: 0.98, fontWeight: 800, letterSpacing: '-0.03em', sample: 'Selling, with a plan.', usage: 'Page titles. clamp(2.5rem, 1.55rem + 3.6vw, 4.25rem).' },
        { name: 'h2', fontSize: '48px', lineHeight: 1.02, fontWeight: 800, letterSpacing: '-0.025em', sample: 'Six towns, one sheet', usage: 'Section heads; italic 400 on the second phrase.' },
        { name: 'h3', fontSize: '26px', lineHeight: 1.1, fontWeight: 800, sample: 'The facts' },
        { name: 'lede', fontSize: '22px', lineHeight: 1.5, fontWeight: 400, sample: 'Homes, streets and towns across Central Massachusetts.' },
        { name: 'voice', fontSize: '19px', lineHeight: 1.6, fontWeight: 400, sample: 'The best thing about 6 Shore Walk is the line of the roof.', usage: 'Signed editorial writing: property stories, Field Guide.' },
        { name: 'price', fontSize: '40px', lineHeight: 1, fontWeight: 800, letterSpacing: '-0.02em', sample: '$574,000', usage: 'Lining figures. Prices only.' },
        { name: 'address', fontSize: '19px', lineHeight: 1.2, fontWeight: 600, sample: '6 Shore Walk' },
        { name: 'town', fontSize: '15px', lineHeight: 1.2, fontWeight: 600, letterSpacing: '0.32em', sample: 'SHREWSBURY', usage: 'Map lettering: uppercase, paper halo over terrain.' }] },
      { name: 'Interface', family: 'sans', styles: [
        { name: 'body', fontSize: '17px', lineHeight: 1.6, fontWeight: 400, sample: 'Ask about this home. Brandon will reply personally, usually the same day.' },
        { name: 'small', fontSize: '15px', lineHeight: 1.5, fontWeight: 400, sample: 'Schematic sheet; the live site shows the exact location.' },
        { name: 'label', fontSize: '13px', lineHeight: 1.3, fontWeight: 700, letterSpacing: '0.08em', sample: 'VERIFIED DATA · MLS PIN', usage: 'Uppercase. Table heads, legends, tags. Never a kicker above a heading.' },
        { name: 'button', fontSize: '15px', lineHeight: 1.1, fontWeight: 700, sample: 'Schedule a showing' },
        { name: 'facts', fontSize: '15px', lineHeight: 1.4, fontWeight: 600, sample: '3 bd  2 ba  1,720 sq ft', usage: 'Tabular lining figures; units at 400 in ink-soft.' }] },
      { name: 'Identifiers', family: 'mono', styles: [{ name: 'code', fontSize: '12px', lineHeight: 1.4, fontWeight: 500, sample: '42°16′N 71°48′W · PR-06 · MLS 7300102', usage: 'Coordinates, photo codes, MLS numbers. Nothing else.' }] }],
  },
  spacing: { tokens: [['s-1', '4px'], ['s-2', '8px'], ['s-3', '12px'], ['s-4', '16px'], ['s-5', '24px'], ['s-6', '32px'], ['s-7', '48px'], ['s-8', '64px'], ['s-9', '96px'], ['s-10', '128px']].map(([name, value]) => ({ name, value, usage: { 's-5': 'Panel padding, gaps inside groups.', 's-7': 'Section-head bottom margin.', 's-9': 'Section padding at wide screens (section token is fluid 64–128px).' }[name] || '' })) },
  radius: { tokens: [{ name: 'radius', value: '2px', usage: 'Buttons, fields, chips. Paper has corners.' }, { name: 'radius-pill', value: '99px', usage: 'Saved-count badge only.' }, { name: 'radius-round', value: '50%', usage: 'Save (heart) button, station dots.' }] },
  shadow: { tokens: [{ name: 'lift-1', value: { light: '0 1px 0 rgba(22,30,37,0.06), 0 6px 18px -10px rgba(22,30,37,0.28)' }, usage: 'Paper lifted slightly: map pins, opening legend.' }, { name: 'lift-2', value: { light: '0 2px 0 rgba(22,30,37,0.05), 0 22px 48px -24px rgba(22,30,37,0.42)' }, usage: 'Things over the sheet: town preview, dialogs, toast.' }] },
  line: { tokens: [{ name: 'neatline', value: '1.5px', usage: 'The sheet frame, section borders, legends, data blocks.' }, { name: 'hair', value: '1px', usage: 'Row rules and dividers.' }] },
};
W('project/tokens.json', JSON.stringify(tokens, null, 2));
for (const f of tokens.type.fonts) copyFileSync(new URL('assets/' + f.file, ROOT), new URL('project/' + f.file, OUT));

// bundle.css: the site's component CSS, with aliases from the generated token names
let css = readFileSync(new URL('assets/css/site.css', ROOT), 'utf8').replace('@import url("tokens.css");', '');
const tok = readFileSync(new URL('assets/css/tokens.css', ROOT), 'utf8');
const rootBlock = tok.slice(tok.indexOf(':root {'));
const nonColor = rootBlock.split('\n').filter(l => /--(t-|lh-|track|f-|section|collar|gutter|max|measure|ease|d-|halo|focus|lift)/.test(l)).join('\n');
css = `/* The Oberdorfer Team — component styles (from the concept's site.css). Colors, spacing and fonts come from tokens.css. */\n:root {\n  --f-serif: var(--font-serif); --f-sans: var(--font-sans); --f-mono: var(--font-mono);\n${nonColor.replace(/--f-(serif|sans|mono):[^;]+;/g, '')}\n  --neatline: 1.5px; --hair: 1px;\n}\n` + css;
W('project/components/bundle.css', css);

// README = brand book
const design = readFileSync(new URL('DESIGN.md', ROOT), 'utf8');
const body = design.split(/^---$/m).slice(2).join('---').replace(/^# Design System:.*\n/, '');
W('project/README.md', `# The Oberdorfer Team

The design system of The Oberdorfer Team, a Central Massachusetts real estate team at REWAP Brokerage LLC. Concept 2, "The Quadrangle": every page is a survey sheet of the region, read with the people who know it.

**Brand idea:** Find your place. **Tagline (proposed):** Let's find your place. **Promise:** Real estate, personally handled.

The full brand book (purpose, positioning, audience, voice, messaging, logo, attribution, photography shot list, content model) lives with the concept: \`brand/index.html\` in the repo CptNope/The-Oberdorfer-Team-Concept-2. This system carries the reusable parts: tokens, fonts, logos and component patterns.

## Content fundamentals

- **Voice:** a knowledgeable neighbor who happens to be very good at this. Concrete (name the street, the room, the hour), short, unhurried, plain about money.
- **Two voices, always labeled:** signed editorial ("In our words · written by the team") and verified data ("The facts · MLS PIN"). Never mix them; never invent a figure.
- **Actions name a person and a step:** "Ask about this home", "Schedule a showing", "Talk with Kait", "Send to Brandon". Never "Contact us" or "Submit".
- **Fair housing:** describe places and housing, never who lives somewhere. No "family-friendly", "safe", "great schools".
- **Brokerage attribution:** "at REWAP Brokerage" in the lockup; full disclosure in the footer collar. Set in Overpass, never larger than the team name, never with a logo. Wording lives in one settings file.

## Iconography & marks

- **The mark:** three contour rings of one hill, summit offset to the northwest; an O for Oberdorfer and a place on a map. Use the supplied SVGs in Logos; never retype the wordmark (Besley italic "The" and "Team", Besley ExtraBold "Oberdorfer").
- **Icons:** a 24-unit set at 1.6 stroke, square caps, drawn to match map linework (assets/icons.svg in the repo).
- **Legend symbols** (route line, double line, dashes, contour wave, dotted water, hatched and solid fills, rail ticks) mark intents, attributes and filters.

${body}`);

// Components
const comp = (name, group, height, html, readme) => {
  W(`project/components/${name}/preview.html`, `<!-- @dsCard group="${group}" height=${height} -->\n<div style="padding:24px;background:var(--paper);font-family:var(--f-sans);color:var(--ink)">${html.replaceAll('../../assets/icons.svg', '../icons.svg')}</div>`);
  W(`project/components/${name}/README.md`, readme);
};
const p = '../../';
const icon = id => `<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="square"/></svg>`;
comp('Button', 'Actions', 200, `<div style="display:flex;gap:12px;flex-wrap:wrap;align-items:center"><a class="btn btn--route" href="#">Schedule a showing ${icon()}</a><a class="btn btn--line" href="#">Ask about this home</a><a class="link-arrow" href="#">Read the story ${icon()}</a></div><div class="on-forest" style="margin-top:16px;padding:16px;display:flex;gap:12px;flex-wrap:wrap"><a class="btn btn--paper" href="#">Talk with Brandon &amp; Kait ${icon()}</a><a class="btn btn--ghost-paper" href="#">Meet the team</a></div>`,
  `# Button\n\nActions that name a person and a next step. \`.btn--route\` (oxblood) is the one primary route per view; \`.btn--line\` is secondary; \`.link-arrow\` is a text action with a route underline. On forest use \`.btn--paper\` and \`.btn--ghost-paper\`. Min height 48px (40px for \`.btn--small\`), 2px radius, hover lifts 1px; arrows nudge 3px.\n`);
comp('LegendIntent', 'Navigation', 220, `<nav class="opening__legend" style="grid-template-columns:repeat(3,minmax(0,1fr));border:1.5px solid var(--ink)">${[['Buying', 'route', 'Find a home and get through the offer.'], ['Selling', 'double', 'Price, prepare and sell with a plan.'], ['Relocating', 'dashed', 'Learn the towns before you move.']].map(([n, s, t]) => `<a class="intent" href="#">${L.sym(s)}<span class="intent__name">${n}${icon()}</span><span class="intent__note">${t}</span></a>`).join('')}</nav>`,
  `# LegendIntent\n\nChoices presented as map-legend entries: a line symbol, a Besley name and a short note. Used for homepage intents (Buying, Selling, Relocating, Exploring, Advice) and anywhere a visitor picks a path. Symbols come from the shared legend vocabulary.\n`);
comp('Chip', 'Inputs', 140, `<div class="chips">${L.journeys.attributes.slice(0, 5).map((a, i) => `<button class="chip" type="button" aria-pressed="${i === 1}">${L.sym(a.symbol)}${a.label}</button>`).join('')}</div>`,
  `# Chip\n\nA toggle shaped like a legend entry, for life-first discovery and filters. Pressed state fills forest. Attributes must be neutral housing and location facts (More space, Older homes, Commuter rail), never demographics. Use \`aria-pressed\`.\n`);
comp('Frame', 'Media', 360, `<div style="display:grid;grid-template-columns:1.4fr 1fr 1fr;gap:16px">${L.frame(p, { kind: 'property', code: 'PR-06', direction: 'Street elevation emphasizing the long roofline, early morning, lawn in shadow; 28mm shift.', ar: '3 / 2', style: 'Mid-century ranch' })}${L.frame(p, { kind: 'place', code: 'PL-03', direction: 'Grafton Common in late October, low sun raking across the grass toward the white church; 35mm.', ar: '4 / 5', seed: 3 })}${L.frame(p, { kind: 'people', code: 'PE-02', direction: "Kait at a kitchen island with a notebook open; window light from the left; 50mm.", ar: '4 / 5' })}</div>`,
  `# Frame\n\nThe art-directed photography slot: a tinted plate per category (clay = property, woodland = place, water-tint = people) with a mount rule, crop marks, the photo code and aspect, the lens, a storyboard guide (thirds, horizon, the subject's shape drawn from the listing style, a focal mark) and the one-line shot brief. Every frame is a shot-list entry until the real photograph replaces it. Under 560px the brief moves below the plate; under 150px a people frame shows initials.\n`);
comp('ListingRows', 'Real estate', 300, L.rowsTable(p, L.listings.slice(0, 3), { caption: 'Homes' }),
  `# ListingRows\n\nSearch mode: one row per home with address (Besley 600) and town (spaced caps), price (Besley 800, lining figures), facts (Overpass tabular), status with its map symbol, and a save button. Rows stack by container width (container query at 760px), not viewport.\n`);
comp('DataBlock', 'Real estate', 260, `<div class="datablock"><div class="datablock__head"><span class="label" style="color:var(--ink)">Property record</span><span class="synthetic">Sample data</span></div><dl><div><dt>Year built</dt><dd>1957</dd></div><div><dt>Living area</dt><dd>1,720 sq ft</dd></div><div><dt>Heating</dt><dd>Gas, forced air</dd></div><div><dt>MLS #</dt><dd>7300102</dd></div></dl><p class="datablock__foot">Listing courtesy of [listing office]. Source: MLS PIN via IDX. Displayed exactly as received.</p></div>`,
  `# DataBlock\n\nVerified data, separated from editorial voice: neatline frame, paper-deep head with its source tag, two-column definition rows in tabular figures, and a foot line with listing courtesy, source and the MLS disclaimer. Data is displayed as received and never edited.\n`);
comp('PersonLine', 'People', 140, L.personLine(p, L.agents[0]),
  `# PersonLine\n\nA named human with direct lines: portrait frame (initials when tiny), name linked to their page, role, and call / text / email actions. Ends every contact surface so the visitor always knows who replies.\n`);
comp('Field', 'Inputs', 220, `<div style="display:grid;gap:20px;max-width:420px"><div class="field"><label for="a">Email</label><input id="a" placeholder="you@example.com"></div><div class="field" data-invalid><label for="b">First name</label><input id="b" aria-invalid="true"><span class="error">Please tell us your first name.</span></div></div>`,
  `# Field\n\nSurvey-style fields: label above, a 1.5px ink underline, route underline on focus, route color and a plain-language message on error ("Add an email or a phone number so we can reply."). Forms carry hidden routing metadata (agent, listing, community, intent, UTM) for the CRM.\n`);

// Cover
W('project/components/Cover/preview.html', `<!-- @dsCard height=300 -->
<style>
.cv{position:relative;width:960px;height:300px;background:var(--paper);font-family:var(--f-serif);overflow:hidden}
.cv svg{position:absolute;left:480px;top:0;width:480px;height:300px}
.f{fill:var(--forest)}.w{fill:var(--woodland)}.c{fill:var(--clay)}.i{fill:var(--ink)}.r{fill:var(--route)}
.ct{fill:none;stroke:var(--contour);stroke-width:1.5px}.ctp{fill:none;stroke:var(--paper);stroke-width:1.5px;opacity:.55}
.nm{position:absolute;left:32px;bottom:72px;width:440px;font-weight:800;font-size:56px;line-height:.95;letter-spacing:-.03em;color:var(--ink);margin:0}
.nm i{font-weight:400}
.tg{position:absolute;left:32px;bottom:40px;width:440px;font-family:var(--f-sans);font-size:14px;color:var(--ink-soft);margin:0}
</style>
<div class="cv">
<svg viewBox="0 0 480 300" aria-hidden="true">
<!-- blocks: forest 240x300 (brand field), woodland 144x168, clay 144x132 (property), ink 96x96, route 48x48 (the one route)
     arrangement: one tall forest slab with satellites, flush, square corners (radius 2px), like sheets in an index
     pattern: contour rings (the mark's own linework) — editorial + cartographic system, "borders not shadows": a few lines, not a field
     steps: s-7 48, s-9 96; neatline 1.5px; radius 2px -->
<rect class="f" x="240" y="0" width="240" height="300" rx="2"/>
<rect class="w" x="96" y="0" width="144" height="168" rx="2"/>
<rect class="c" x="96" y="168" width="144" height="132" rx="2"/>
<rect class="i" x="0" y="204" width="96" height="96" rx="2"/>
<rect class="r" x="48" y="156" width="48" height="48" rx="2"/>
<g transform="translate(300 70) scale(3.4)">${L.mark.rings.map(d => `<path class="ctp" d="${d}"/>`).join('')}</g>
<g transform="translate(110 30) scale(2.4)">${L.mark.rings.slice(0, 2).map(d => `<path class="ct" d="${d}"/>`).join('')}</g>
</svg>
<p class="nm"><i>The</i> Oberdorfer <i>Team</i></p>
<p class="tg">Let’s find your place. Central Massachusetts, personally handled.</p>
</div>`);
copyFileSync(new URL('assets/icons.svg', ROOT), new URL('project/components/icons.svg', OUT));
console.log('ds files written');
