// Shared templates for the Oberdorfer Team concept site.
// Each function maps to a future WordPress block, pattern or template part (noted inline).
import { readFileSync } from 'node:fs';
const J = p => JSON.parse(readFileSync(new URL(`../data/${p}`, import.meta.url), 'utf8'));
export const settings = J('settings.json');
export const agents = J('agents.json');
export const towns = J('communities.json');
export const listings = J('listings.json');
export const guides = J('guides.json');
export const journeys = J('journeys.json');
export const mark = J('mark.json');
export const terrain = JSON.parse(readFileSync(new URL('../assets/terrain/terrain.json', import.meta.url), 'utf8'));

export const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
export const money = n => '$' + Number(n).toLocaleString('en-US');
export const town = slug => towns.find(t => t.slug === slug);
export const agent = slug => agents.find(a => a.slug === slug);
export const tpos = slug => terrain.towns.find(t => t.slug === slug);
export const fmtDate = iso => new Date(iso + 'T12:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
export const baths = b => (b % 1 ? `${Math.floor(b)}½` : `${b}`);

// --- Icons & marks -------------------------------------------------------
export const icon = (p, id, cls = '') => `<svg class="i i-${id} ${cls}" aria-hidden="true" focusable="false"><use href="${p}assets/icons.svg#i-${id}"/></svg>`;
export const markSvg = (cls = 'lockup__mark') => `<svg class="${cls}" viewBox="0 0 48 48" aria-hidden="true" focusable="false">${mark.rings.map(d => `<path d="${d}"/>`).join('')}</svg>`;
export const lockup = (p, { attr = true, href = 'site/' } = {}) =>
  `<a class="lockup" href="${p}${href}">${markSvg()}<span><span class="lockup__name"><i>The</i> <b>Oberdorfer</b> <i>Team</i></span>${attr ? `<span class="lockup__attr">${esc(settings.attribution.header)}</span>` : ''}</span></a>`;

// Legend symbols (map-legend linework) used for intents and attributes
export function sym(kind) {
  const s = {
    route: `<line x1="2" y1="7" x2="50" y2="7" stroke="var(--route)" stroke-width="3"/>`,
    double: `<line x1="2" y1="4.5" x2="50" y2="4.5" stroke="var(--ink)" stroke-width="1.6"/><line x1="2" y1="9.5" x2="50" y2="9.5" stroke="var(--ink)" stroke-width="1.6"/>`,
    dashed: `<line x1="2" y1="7" x2="50" y2="7" stroke="var(--route)" stroke-width="2.4" stroke-dasharray="7 4"/>`,
    contour: `<path d="M2 9c6-6 10-6 16 0s10 6 16 0 10-6 16 0" fill="none" stroke="var(--contour)" stroke-width="1.8"/>`,
    water: `<line x1="2" y1="7" x2="50" y2="7" stroke="var(--water)" stroke-width="2.4" stroke-dasharray="1.5 4" stroke-linecap="round"/>`,
    area: `<rect x="2" y="2" width="48" height="10" fill="var(--woodland)" stroke="var(--forest)" stroke-width="1.2"/>`,
    hatch: `<rect x="2" y="2" width="48" height="10" fill="var(--clay)" stroke="var(--contour-ink)" stroke-width="1.2"/><path d="M8 12 14 2M18 12 24 2M28 12 34 2M38 12 44 2" stroke="var(--contour-ink)" stroke-width="1"/>`,
    solid: `<rect x="2" y="2" width="48" height="10" fill="var(--ink)"/>`,
    parcel: `<rect x="2" y="2" width="48" height="10" fill="none" stroke="var(--ink)" stroke-width="1.4" stroke-dasharray="5 2.5"/>`,
    dot: `<circle cx="26" cy="7" r="4.5" fill="var(--route)"/>`,
    ring: `<circle cx="26" cy="7" r="5" fill="none" stroke="var(--ink)" stroke-width="1.6"/><circle cx="26" cy="7" r="1.8" fill="var(--ink)"/>`,
    rail: `<line x1="2" y1="7" x2="50" y2="7" stroke="var(--ink)" stroke-width="2"/><path d="M8 3v8M16 3v8M24 3v8M32 3v8M40 3v8" stroke="var(--ink)" stroke-width="1.2"/>`,
  }[kind] || '';
  return `<svg class="sym" viewBox="0 0 52 14" aria-hidden="true" focusable="false">${s}</svg>`;
}

// --- Terrain -------------------------------------------------------------
// Sprite at assets/terrain/terrain.svg. Symbols: t-minor, t-index, t-lake, t-river.
export function terrainSvg(p, { view = '0 0 1600 1000', cls = '', draw = false, water = true, lift = false, aspect = 'xMidYMid slice' } = {}) {
  const href = id => `${p}assets/terrain/terrain.svg#${id}`;
  const u = (id, c) => `<use class="${c}" href="${href(id)}" x="0" y="0" width="1600" height="1000"/>`;
  return `<div class="terrain ${draw ? 'terrain--draw' : ''} ${cls}" aria-hidden="true"><svg viewBox="${view}" preserveAspectRatio="${aspect}" focusable="false">` +
    u('t-minor', 't-minor') + u('t-index', 't-index') + (water ? u('t-lake', 't-lake') + u('t-river', 't-river') : '') +
    (lift ? `<clipPath id="lift-clip" class="lift"><circle cx="-500" cy="-500" r="0"/></clipPath><g clip-path="url(#lift-clip)">${u('t-minor', 't-lift')}${u('t-index', 't-lift')}</g>` : '') +
    `</svg></div>`;
}
// crop the sheet around a point (stage coords 0..1)
export const cropView = (x, y, w = 440, h = 280) => { const cx = Math.min(1600 - w / 2, Math.max(w / 2, x * 1600)), cy = Math.min(1000 - h / 2, Math.max(h / 2, y * 1000)); return `${Math.round(cx - w / 2)} ${Math.round(cy - h / 2)} ${w} ${h}`; };

// --- Frames: photography slots with shot direction ----------------------
// WP: core/image with a "frame" block style; the direction text becomes the image brief in the media library.
export function frame(p, { kind = 'place', code, direction, ar = '3 / 2', caption = '', cls = '', bare = false, seed = 0, alt, initials = '', style = '' } = {}) {
  const label = alt || `Photograph to come (${kind}): ${direction}`;
  const tx = (seed * 137) % 1200, ty = (seed * 89) % 700;
  const terr = kind === 'place' ? `<svg class="frame__terrain" viewBox="${tx} ${ty} 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><use href="${p}assets/terrain/terrain.svg#t-index" width="1600" height="1000"/></svg>` : '';
  // storyboard guide drawn from the brief: rule-of-thirds, a horizon, the subject's mass and a focal mark
  const h = (code || '').split('').reduce((a, c) => a + c.charCodeAt(0), seed);
  const fx = h % 2 ? 66.6 : 33.3, fy = h % 3 ? 33.3 : 66.6;
  const hz = kind === 'people' ? 0 : kind === 'property' ? 54 : 58;
  const ext = /elevation|facade|façade|exterior|from the street|from across|from the drive|from the end|cul-de-sac|seen through|split-level from|building exterior|gable|porch and/i.test(direction);
  const X = fx === 66.6 ? 60 : 40;
  const shapes = {
    ranch: `M${X - 26} ${hz} V${hz - 11} L${X - 19} ${hz - 18} H${X + 19} L${X + 26} ${hz - 11} V${hz}`,
    colonial: `M${X - 18} ${hz} V${hz - 24} L${X - 14} ${hz - 31} H${X + 14} L${X + 18} ${hz - 24} V${hz}M${X - 18} ${hz - 12} H${X + 18}`,
    gablefront: `M${X - 12} ${hz} V${hz - 22} L${X} ${hz - 34} L${X + 12} ${hz - 22} V${hz}`,
    triple: `M${X - 10} ${hz} V${hz - 36} H${X + 10} V${hz}M${X - 10} ${hz - 12} H${X + 14}M${X - 10} ${hz - 24} H${X + 14}M${X + 14} ${hz} V${hz - 34}`,
    loft: `M${X - 28} ${hz} V${hz - 30} H${X + 28} V${hz}M${X - 20} ${hz - 22} h8M${X - 4} ${hz - 22} h8M${X + 12} ${hz - 22} h8M${X - 20} ${hz - 10} h8M${X - 4} ${hz - 10} h8M${X + 12} ${hz - 10} h8`,
    split: `M${X - 24} ${hz} V${hz - 12} H${X - 2} V${hz}M${X - 2} ${hz - 20} H${X + 22} V${hz - 6} H${X - 2}`,
    cape: `M${X - 20} ${hz} V${hz - 12} L${X - 10} ${hz - 26} H${X + 10} L${X + 20} ${hz - 12} V${hz}`,
  };
  const st = style.toLowerCase();
  const shape = /three-decker/.test(st) ? 'triple' : /loft/.test(st) ? 'loft' : /split/.test(st) ? 'split' : /cape/.test(st) ? 'cape' : /ranch/.test(st) ? 'ranch' : /greek|victorian/.test(st) ? 'gablefront' : /colonial/.test(st) ? 'colonial' : 'ranch';
  const mass = kind === 'people'
    ? `<path class="mass" d="M${fx - 13} 100 C ${fx - 13} 74, ${fx - 9} 66, ${fx} 66 C ${fx + 9} 66, ${fx + 13} 74, ${fx + 13} 100 Z"/><ellipse class="mass" cx="${fx}" cy="52" rx="7" ry="9"/>`
    : kind === 'property' ? (ext ? `<path class="mass" d="${shapes[shape]} Z"/><path class="horizon" d="${shapes[shape]}"/>` : `<path class="mass interior" d="M28 26 H72 V68 H28 Z"/><path class="horizon interior" d="M28 26 H72 V68 H28 Z M0 0 L28 26 M100 0 L72 26 M0 100 L28 68 M100 100 L72 68"/>`)
    : `<path class="mass" d="M0 ${hz} C 20 ${hz - 9}, 40 ${hz - 4}, 60 ${hz - 11} S 90 ${hz - 6}, 100 ${hz - 2} V100 H0Z"/>`;
  const hzLine = kind === 'place' ? `<path class="horizon" d="M0 ${hz} C 20 ${hz - 9}, 40 ${hz - 4}, 60 ${hz - 11} S 90 ${hz - 6}, 100 ${hz - 2}"/>` : (kind === 'property' && !ext) ? '' : hz ? `<line class="horizon" x1="0" x2="100" y1="${hz}" y2="${hz}"/>` : '';
  const guide = `<svg class="frame__guide" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><line class="thirds" x1="33.3" x2="33.3" y1="0" y2="100"/><line class="thirds" x1="66.6" x2="66.6" y1="0" y2="100"/><line class="thirds" x1="0" x2="100" y1="33.3" y2="33.3"/><line class="thirds" x1="0" x2="100" y1="66.6" y2="66.6"/>${mass}${hzLine}</svg><svg class="frame__focal" style="left:${fx}%;top:${fy}%" viewBox="0 0 14 14" aria-hidden="true"><path d="M2 2l10 10M12 2 2 12"/></svg>`;
  const lens = (direction.match(/(\d+)mm/) || [])[1];
  return `<figure class="frame ${bare ? 'frame--bare' : ''} ${cls}" data-kind="${kind}">
  <div class="frame__plate" style="--ar:${ar}" role="img" aria-label="${esc(label)}">${terr}${guide}
    <span class="frame__crop frame__crop--tl"></span><span class="frame__crop frame__crop--tr"></span><span class="frame__crop frame__crop--bl"></span><span class="frame__crop frame__crop--br"></span>
    <span class="frame__code" aria-hidden="true"><b>${esc(kind)}</b>${esc(code || '')}<span>${esc(ar.replace(/\s/g, ''))}</span></span>${lens ? `<span class="frame__lens" aria-hidden="true">${lens}mm</span>` : ''}
    ${initials ? `<span class="frame__initials" aria-hidden="true">${esc(initials)}</span>` : ''}
    <span class="frame__slot" aria-hidden="true"><span class="frame__direction">${esc(direction)}</span></span>
  </div><span class="frame__brief" aria-hidden="true">${esc(direction)}</span>${caption ? `<figcaption>${caption}</figcaption>` : ''}
</figure>`;
}
export const initials = a => a.name.split(' ').map(w => w[0]).join('');

// --- Listing fragments ---------------------------------------------------
export const facts = l => `<p class="facts"><span>${l.beds}<abbr title="bedrooms"> bd</abbr></span><span>${baths(l.baths)}<abbr title="bathrooms"> ba</abbr></span><span>${l.sqft.toLocaleString('en-US')}<abbr title="square feet"> sq ft</abbr></span>${l.lot ? `<span>${l.lot}<abbr title="acres"> ac</abbr></span>` : ''}</p>`;
export const favBtn = (p, l, cls = '') => `<button class="fav ${cls}" type="button" data-fav="${l.id}" aria-pressed="false" aria-label="Save ${esc(l.address)}">${icon(p, 'heart')}</button>`;
export const statusTag = l => `<span class="status" data-status="${esc(l.status)}">${esc(l.status)}</span>`;
export const listingHref = (p, l) => `${p}site/homes/${l.slug}/`;

export function rowsTable(p, list, { caption = 'Homes', hideCaption = true } = {}) {
  return `<div class="rows-wrap"><table class="rows" data-rows>
  <caption class="${hideCaption ? 'visually-hidden' : ''}">${esc(caption)}</caption>
  <thead><tr><th scope="col">Address</th><th scope="col" class="num">Price</th><th scope="col">Details</th><th scope="col" class="hide-sm">Status</th><th scope="col"><span class="visually-hidden">Save</span></th></tr></thead>
  <tbody>${list.map(l => `<tr data-id="${l.id}">
    <td class="addr"><a href="${listingHref(p, l)}">${esc(l.address)}</a><span class="town">${esc(town(l.town).name)}</span></td>
    <td class="price-cell">${money(l.price)}</td>
    <td class="facts-cell">${facts(l)}</td>
    <td class="st hide-sm">${statusTag(l)}</td>
    <td class="fav-cell">${favBtn(p, l)}</td></tr>`).join('')}</tbody></table></div>`;
}

// --- Lead form -----------------------------------------------------------
// One form component, many contexts. Hidden fields carry routing metadata for Follow Up Boss.
// WP: a server-rendered block; fields map to FUB Events API (person, property, campaign, source, type).
export function leadForm(p, { id = 'lead', intent = 'general', heading = '', submit = 'Send to the team', agentSlug = '', listingId = '', community = '', compact = false, showIntent = true, showTimeframe = true, messageLabel = 'What would you like to talk about?', messagePlaceholder = 'A street you’re curious about, a timeline, a question…', extra = '', onForest = false } = {}) {
  const intents = [['buying', 'Buying'], ['selling', 'Selling'], ['relocating', 'Relocating'], ['showing', 'A showing'], ['advice', 'Advice']];
  return `<form class="form" id="${id}" data-lead novalidate>
  ${heading}
  <div class="form__row">
    <div class="field"><label for="${id}-first">First name</label><input id="${id}-first" name="firstName" autocomplete="given-name" required><span class="error" aria-live="polite"></span></div>
    <div class="field"><label for="${id}-last">Last name</label><input id="${id}-last" name="lastName" autocomplete="family-name"></div>
  </div>
  <div class="form__row">
    <div class="field"><label for="${id}-email">Email</label><input id="${id}-email" name="email" type="email" autocomplete="email" inputmode="email"><span class="error" aria-live="polite"></span></div>
    <div class="field"><label for="${id}-phone">Phone <span class="hint">(optional)</span></label><input id="${id}-phone" name="phone" type="tel" autocomplete="tel" inputmode="tel"></div>
  </div>
  ${extra}
  ${showIntent ? `<fieldset class="field"><legend>I’m thinking about</legend><div class="radios">${intents.map(([v, l]) => `<label class="chip"><input type="radio" name="intent" value="${v}" ${v === intent ? 'checked' : ''}>${l}</label>`).join('')}</div></fieldset>` : `<input type="hidden" name="intent" value="${esc(intent)}">`}
  ${showTimeframe ? `<div class="field"><label for="${id}-time">Timeframe</label><select id="${id}-time" name="timeframe"><option value="">Choose one</option><option>As soon as possible</option><option>1–3 months</option><option>3–6 months</option><option>6–12 months</option><option>Just exploring</option></select></div>` : ''}
  ${compact ? '' : `<div class="field"><label for="${id}-msg">${esc(messageLabel)}</label><textarea id="${id}-msg" name="message" rows="4" placeholder="${esc(messagePlaceholder)}"></textarea></div>`}
  <input type="hidden" name="agent" value="${esc(agentSlug)}">
  <input type="hidden" name="listing" value="${esc(listingId)}">
  <input type="hidden" name="community" value="${esc(community)}">
  <input type="hidden" name="sourcePage" value="">
  <input type="hidden" name="utm" value="">
  <div class="form__actions"><button class="btn btn--${onForest ? 'paper' : 'route'}" type="submit">${esc(submit)} ${icon(p, 'arrow')}</button><span class="form__note">Email or phone, whichever you prefer.</span></div>
  <p class="form__note">${esc(settings.attribution.contact)}</p>
  <div class="form__result" aria-live="polite"></div>
</form>`;
}

// --- Person line (contact a named human) --------------------------------
export function personLine(p, a, { links = true } = {}) {
  return `<div class="person-line">${frame(p, { kind: 'people', code: a.portrait.code, direction: a.portrait.direction, ar: '1 / 1', bare: true, alt: `Portrait of ${a.name} to come`, initials: initials(a) })}
  <div><a class="person-line__name" href="${p}site/agents/${a.slug}/">${esc(a.name)}</a><div class="meta">${esc(a.role)}</div>
  ${links ? `<div class="person-line__links"><a href="tel:${a.phone.replace(/\D/g, '')}">${icon(p, 'phone')}${esc(a.phone)}</a><a href="sms:${a.phone.replace(/\D/g, '')}">${icon(p, 'message')}Text</a><a href="mailto:${a.email}">${icon(p, 'mail')}Email</a></div>` : ''}</div></div>`;
}

// --- Journey profile -----------------------------------------------------
export function profileSvg(stations, { w = 1200, h = 220 } = {}) {
  const n = stations.length, pad = 0;
  const xs = stations.map((_, i) => 6 + (i / n) * w);
  const ys = stations.map(s => h - 18 - s.h * (h - 50));
  // smooth path through points
  const pts = [[-20, h - 18 - 0.1 * (h - 50)], ...xs.map((x, i) => [x, ys[i]]), [w + 20, h - 18 - 0.3 * (h - 50)]];
  let d = `M${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const [x0, y0] = pts[i], [x1, y1] = pts[i + 1], mx = (x0 + x1) / 2;
    d += ` C${mx} ${y0} ${mx} ${y1} ${x1} ${y1}`;
  }
  const ground = d + ` L${w + 20} ${h} L-20 ${h} Z`;
  const grid = [0.25, 0.5, 0.75].map(f => `<line class="grid-line" x1="0" x2="${w}" y1="${h - 18 - f * (h - 50)}" y2="${h - 18 - f * (h - 50)}"/>`).join('');
  const drops = xs.map((x, i) => `<line class="drop" x1="${x}" x2="${x}" y1="${ys[i]}" y2="${h}"/>`).join('');
  return `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" aria-hidden="true" focusable="false">${grid}<path class="ground" d="${ground}"/><path class="ground-line" d="${d}"/>${drops}<circle class="profile__marker" r="7" cx="${xs[0]}" cy="${ys[0]}" data-xs="${xs.join(',')}" data-ys="${ys.join(',')}"/></svg>`;
}

export function journeyBlock(p, key, { id = key, linkAll = true, anchors = false } = {}) {
  const j = journeys[key];
  const st = j.stations;
  if (anchors) return `<div class="journey" id="${id}"><div class="profile">${profileSvg(st)}<nav class="profile__stations" aria-label="${esc(j.title)}" style="--n:${st.length}">${st.map((s, i) => `<a class="station station--link" href="#${s.id}"><span class="station__n">${String(i + 1).padStart(2, '0')}</span><span class="station__name">${esc(s.name)}</span></a>`).join('')}</nav></div></div>`;
  return `<div class="journey" data-journey="${key}" id="${id}">
  <div class="profile">${profileSvg(st)}
    <div class="profile__stations" role="tablist" aria-label="${esc(j.title)}" style="--n:${st.length}">
      ${st.map((s, i) => `<button class="station" role="tab" id="${id}-tab-${s.id}" aria-controls="${id}-panel" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}" data-i="${i}"><span class="station__n">${String(i + 1).padStart(2, '0')}</span><span class="station__name">${esc(s.name)}</span></button>`).join('')}
    </div>
  </div>
  <div class="profile__panel" id="${id}-panel" role="tabpanel" aria-labelledby="${id}-tab-${st[0].id}" aria-live="polite">
    ${st.map((s, i) => `<template data-i="${i}"><h3>${esc(s.name)}</h3><p class="what">${esc(s.what)}</p><p class="us"><b>Our part</b>${esc(s.us)}</p><div class="acts">${s.action ? `<a class="link-arrow" href="${p}site/${s.action.href}">${esc(s.action.label)} ${icon(p, 'arrow')}</a>` : ''}${s.guide ? `<a href="${p}site/field-guide/${s.guide}/">Read: ${esc(guides.find(g => g.slug === s.guide).title)}</a>` : ''}${linkAll ? `<a href="${p}site/${key}/#${s.id}">More on this stop</a>` : ''}</div></template>`).join('')}
    <h3>${esc(st[0].name)}</h3><p class="what">${esc(st[0].what)}</p><p class="us"><b>Our part</b>${esc(st[0].us)}</p><div class="acts">${st[0].action ? `<a class="link-arrow" href="${p}site/${st[0].action.href}">${esc(st[0].action.label)} ${icon(p, 'arrow')}</a>` : ''}${linkAll ? `<a href="${p}site/${key}/#${st[0].id}">More on this stop</a>` : ''}</div>
  </div>
</div>`;
}

// --- Chrome: header, footer, page shell ----------------------------------
const NAV = [['site/search/', 'Homes', 'search'], ['site/communities/', 'Towns', 'communities'], ['site/buying/', 'Buying', 'buying'], ['site/selling/', 'Selling', 'selling'], ['site/field-guide/', 'Field Guide', 'field-guide'], ['site/agents/', 'The Team', 'agents']];

export function header(p, current) {
  return `<a class="skip" href="#main">Skip to content</a>
<p class="demo-note">Concept 2 for The Oberdorfer Team · every listing, figure and photograph slot is a labeled sample · <a href="${p}">Concept index</a></p>
<header class="collar-top">
  <div class="collar-top__bar">
    ${lockup(p)}
    <nav class="nav" aria-label="Main">${NAV.map(([h, l, k]) => `<a class="nav__link" href="${p}${h}" ${current === k ? 'aria-current="page"' : ''}>${l}</a>`).join('')}</nav>
    <div class="collar-top__actions">
      <a class="saved-link" href="${p}site/saved/">${icon(p, 'heart')}<span class="saved-link__label">Saved</span><span class="count" data-fav-count data-count="0">0</span></a>
      <a class="btn btn--route btn--small" href="${p}site/contact/"><span class="talk-long">Talk with us</span><span class="talk-short">Talk</span></a>
      <button class="btn btn--line btn--icon menu-btn" type="button" data-menu-open aria-haspopup="dialog" aria-label="Open menu">${icon(p, 'menu')}</button>
    </div>
  </div>
</header>
<dialog class="navsheet on-forest" data-menu aria-label="Menu">
  <div class="navsheet__inner">
    <div class="navsheet__top">${lockup(p)}<button class="btn btn--ghost-paper btn--icon" type="button" data-menu-close aria-label="Close menu">${icon(p, 'close')}</button></div>
    <nav aria-label="Main">${NAV.map(([h, l]) => `<a href="${p}${h}">${l}${icon(p, 'arrow')}</a>`).join('')}<a href="${p}site/relocating/">Relocating${icon(p, 'arrow')}</a><a href="${p}site/saved/">Saved homes${icon(p, 'heart')}</a></nav>
    <div class="navsheet__towns">${towns.map(t => `<a href="${p}site/communities/${t.slug}/">${t.name}</a>`).join('')}</div>
    <div class="navsheet__foot"><a class="btn btn--paper" href="${p}site/contact/">Talk with the team ${icon(p, 'arrow')}</a><a class="btn btn--ghost-paper" href="tel:${settings.team.phone.replace(/\D/g, '')}">${icon(p, 'phone')} ${settings.team.phone}</a></div>
  </div>
</dialog>`;
}

export function footer(p) {
  return `<footer class="collar-bottom">
  <div class="collar-bottom__credit">
    ${lockup(p, { attr: false })}
    <p>${esc(settings.attribution.footer)}</p>
    <p><a href="tel:${settings.team.phone.replace(/\D/g, '')}">${settings.team.phone}</a> · <a href="mailto:${settings.team.email}">${settings.team.email}</a></p>
  </div>
  <nav aria-labelledby="f-homes"><h2 id="f-homes">Homes</h2><ul><li><a href="${p}site/search/">Search homes</a></li><li><a href="${p}site/search/?mode=discover">Discover</a></li><li><a href="${p}site/search/?status=Open%20house">Open houses</a></li><li><a href="${p}site/saved/">Saved homes</a></li></ul></nav>
  <nav aria-labelledby="f-guide"><h2 id="f-guide">Guidance</h2><ul><li><a href="${p}site/buying/">Buying</a></li><li><a href="${p}site/selling/">Selling</a></li><li><a href="${p}site/relocating/">Relocating</a></li><li><a href="${p}site/field-guide/">Field Guide</a></li></ul></nav>
  <nav aria-labelledby="f-team"><h2 id="f-team">Team</h2><ul>${agents.map(a => `<li><a href="${p}site/agents/${a.slug}/">${esc(a.name)}</a></li>`).join('')}<li><a href="${p}site/contact/">Talk with us</a></li></ul></nav>
  <div class="collar-bottom__adjoin"><span class="label">Towns on this sheet</span>${towns.map(t => `<a class="town" href="${p}site/communities/${t.slug}/">${t.name}</a>`).join('')}</div>
  <div class="collar-bottom__legal">
    <p>${esc(settings.attribution.disclosure)}</p>
    <p>${esc(settings.idx.disclaimer)} ${esc(settings.idx.demoNotice)}</p>
    <p>${esc(settings.fairHousing)} <a href="${p}site/accessibility/">Accessibility</a> · <a href="${p}site/privacy/">Privacy</a> · Terrain is illustrative, generated for this concept, not survey data.</p>
  </div>
</footer>`;
}

const TICKS = { nw: '42°22′30″N  71°57′30″W', ne: '42°22′30″N  71°40′W', sw: '42°10′N  71°57′30″W', se: '42°10′N  71°40′W' };
export function page({ p, path, title, description, current = '', body, jsonld = [], scripts = [], bodyClass = '', head = '' }) {
  const ld = jsonld.length ? `<script type="application/ld+json">${JSON.stringify(jsonld.length === 1 ? jsonld[0] : { '@context': 'https://schema.org', '@graph': jsonld })}</script>` : '';
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<meta name="theme-color" content="#f5f8f4">
<link rel="icon" href="${p}assets/brand/favicon.svg" type="image/svg+xml">
<link rel="preload" href="${p}assets/fonts/besley-latin-800-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="${p}assets/fonts/overpass-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${p}assets/css/site.css">
<meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:type" content="website">
<link rel="canonical" href="https://${settings.team.domain}/${path.replace(/^site\//, '').replace(/index\.html$/, '')}">
<script>document.documentElement.classList.add('js')</script>
${head}${ld}
</head>
<body class="${bodyClass}" data-root="${p}">
${header(p, current)}
<main id="main" class="sheet" tabindex="-1">
${Object.entries(TICKS).map(([k, v]) => `<span class="sheet__tick sheet__tick--${k}" aria-hidden="true">${v}</span>`).join('')}
${body}
</main>
${footer(p)}
<div class="toast" role="status" aria-live="polite" data-toast></div>
<script src="${p}assets/js/site.js" defer></script>
${scripts.map(s => `<script src="${p}assets/js/${s}" defer></script>`).join('')}
</body>
</html>`;
}

// --- Structured data (schema.org) ---------------------------------------
export const teamId = `https://${settings.team.domain}/#team`;
export const brokerId = `https://${settings.team.domain}/#brokerage`;
export function ldTeam() {
  return [{
    '@type': 'RealEstateAgent', '@id': teamId, name: settings.team.name, url: `https://${settings.team.domain}/`,
    telephone: settings.team.phone, email: settings.team.email, areaServed: towns.map(t => ({ '@type': 'City', name: `${t.name}, MA` })),
    parentOrganization: { '@id': brokerId }, member: agents.map(a => ({ '@id': `https://${settings.team.domain}/agents/${a.slug}/#person` })),
    logo: `https://${settings.team.domain}/assets/brand/logo-horizontal.svg`,
  }, { '@type': 'RealEstateAgent', '@id': brokerId, name: settings.brokerage.legalName, url: settings.brokerage.url, address: { '@type': 'PostalAddress', addressLocality: 'Worcester', addressRegion: 'MA', addressCountry: 'US' } }];
}
export const ldPerson = a => ({ '@type': 'Person', '@id': `https://${settings.team.domain}/agents/${a.slug}/#person`, name: a.name, jobTitle: a.role, telephone: a.phone, email: a.email, url: `https://${settings.team.domain}/agents/${a.slug}/`, memberOf: { '@id': teamId }, worksFor: { '@id': brokerId }, knowsAbout: a.specialties, areaServed: a.areas.map(s => ({ '@type': 'City', name: `${town(s).name}, MA` })) });
export const ldListing = l => ({ '@type': 'RealEstateListing', name: `${l.address}, ${town(l.town).name}, MA`, url: `https://${settings.team.domain}/homes/${l.slug}/`, description: `${l.style} · ${l.beds} bedrooms · SAMPLE LISTING (fictional)`, offers: { '@type': 'Offer', price: l.price, priceCurrency: 'USD', availability: 'https://schema.org/InStock', offeredBy: { '@id': teamId } }, about: { '@type': l.type.startsWith('Condo') ? 'Apartment' : 'SingleFamilyResidence', numberOfRooms: l.beds, numberOfBathroomsTotal: l.baths, floorSize: { '@type': 'QuantitativeValue', value: l.sqft, unitCode: 'FTK' }, yearBuilt: l.year, address: { '@type': 'PostalAddress', streetAddress: l.address, addressLocality: town(l.town).name, addressRegion: 'MA', postalCode: l.zip } } });
export const ldPlace = t => ({ '@type': 'City', name: `${t.name}, Massachusetts`, containedInPlace: { '@type': 'AdministrativeArea', name: 'Worcester County, Massachusetts' }, description: t.lede });
export const ldArticle = g => ({ '@type': 'Article', headline: g.title, description: g.dek, datePublished: g.date, author: { '@id': `https://${settings.team.domain}/agents/${g.author}/#person` }, publisher: { '@id': teamId }, about: g.towns.map(s => ({ '@type': 'City', name: `${town(s).name}, MA` })) });
export const ldCrumbs = items => ({ '@type': 'BreadcrumbList', itemListElement: items.map(([name, url], i) => ({ '@type': 'ListItem', position: i + 1, name, item: `https://${settings.team.domain}/${url}` })) });
