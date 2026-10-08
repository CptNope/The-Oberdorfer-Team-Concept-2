// Static build for the concept site. Reads /data, writes /site/**/index.html and the terrain sprite.
// In production these templates become WordPress block templates; the data becomes CPTs + taxonomies.
import { writeFileSync, mkdirSync, readFileSync } from 'node:fs';
import { dirname } from 'node:path';
import * as L from './lib.mjs';
const { esc, money, icon, frame, sym, terrainSvg, cropView, settings, agents, towns, listings, guides, journeys, terrain } = L;

const ROOT = new URL('../', import.meta.url);
function write(path, html) { const u = new URL(path, ROOT); mkdirSync(dirname(u.pathname), { recursive: true }); writeFileSync(u, html); }
const depth = path => path.split('/').length - 1;
const prefix = path => '../'.repeat(depth(path));

// ---- terrain sprite ------------------------------------------------------
{
  const minor = terrain.levels.filter(l => !l.index).map(l => l.d).join('');
  const index = terrain.levels.filter(l => l.index).map(l => l.d).join('');
  write('assets/terrain/terrain.svg', `<svg xmlns="http://www.w3.org/2000/svg"><!-- ${terrain.note} -->
<symbol id="t-minor" viewBox="0 0 1600 1000"><path pathLength="1" d="${minor}"/></symbol>
<symbol id="t-index" viewBox="0 0 1600 1000"><path pathLength="1" d="${index}"/></symbol>
<symbol id="t-lake" viewBox="0 0 1600 1000"><path d="${terrain.lake}"/></symbol>
<symbol id="t-river" viewBox="0 0 1600 1000"><path pathLength="1" d="${terrain.river}"/></symbol>
</svg>`);
  write('assets/terrain/terrain-tall.svg', `<svg xmlns="http://www.w3.org/2000/svg"><!-- ${terrain.note} Continued north and south of the sheet for portrait map columns. -->
<symbol id="t-minor-xl" viewBox="0 -500 1600 2000"><path d="${terrain.levelsXL.filter(l => !l.index).map(l => l.d).join('')}"/></symbol>
<symbol id="t-index-xl" viewBox="0 -500 1600 2000"><path d="${terrain.levelsXL.filter(l => l.index).map(l => l.d).join('')}"/></symbol>
</svg>`);
}

const crumbs = (p, items) => `<ol class="crumbs" aria-label="Breadcrumb">${items.map(([n, h], i) => `<li>${i < items.length - 1 ? `<a href="${p}${h}">${esc(n)}</a>` : `<span aria-current="page">${esc(n)}</span>`}</li>`).join('')}</ol>`;
const townPins = (p, { cls = '' } = {}) => terrain.towns.map(t => { const c = L.town(t.slug); return `<a class="town-pin ${cls}" href="${p}site/communities/${t.slug}/" style="--x:${t.x};--y:${t.y}" data-town="${t.slug}"><span class="town halo">${esc(t.name)}</span><span class="visually-hidden"> — town guide</span></a>`; }).join('');
const waterLabels = () => `<span class="water-label water-name halo" style="--x:.533;--y:.38;--rot:-84deg">Lake Quinsigamond</span><span class="water-label water-name halo" style="--x:.585;--y:.86;--rot:8deg">Blackstone River</span>`;

// ============================================================ HOME
function home() {
  const path = 'site/index.html', p = prefix(path);
  const feat = listings.find(l => l.slug === '128-chester-hill-road-holden');
  const rows = listings.filter(l => l !== feat && l.status !== 'Under agreement').slice(0, 5);
  const intents = [
    ['Buying', 'route', 'site/buying/', 'Find a home and get through the offer.'],
    ['Selling', 'double', 'site/selling/', 'Price, prepare and sell with a plan.'],
    ['Relocating', 'dashed', 'site/relocating/', 'Learn the towns before you move.'],
    ['Exploring', 'contour', 'site/communities/', 'Browse towns and homes, no rush.'],
    ['Advice', 'water', 'site/contact/?intent=advice', 'Ask us anything. A person replies.'],
  ];
  const lead = guides[0], others = guides.slice(1, 4);
  const [brandon, kait] = agents;
  const body = `
<section class="opening" aria-labelledby="h-open">
  <div class="opening__field">
    <div class="mapbox" data-home-map>
      <div class="stage opening__stage">
        ${terrainSvg(p, { aspect: 'xMidYMid meet', draw: true, lift: true })}
        ${townPins(p)}
        ${waterLabels()}
      </div>
      ${towns.map(t => `<div class="placecard" data-card="${t.slug}" aria-hidden="true">${frame(p, { kind: 'place', code: t.photo.code, direction: t.photo.direction, ar: '16 / 9', seed: t.slug.length, bare: true })}<div class="placecard__body"><span class="town">${t.name}</span><p>${esc(t.lede)}</p></div></div>`).join('')}
    </div>
    <div class="opening__text">
      <h1 id="h-open"><span>Find</span><span>your</span><span><em>place.</em></span></h1>
      <p class="opening__lede">Homes, streets and towns across Central Massachusetts, with Brandon &amp; Kait Oberdorfer and the team.</p>
      <form class="opening__find" action="${p}site/search/" method="get" role="search">
        <div class="findfield"><label class="visually-hidden" for="q">Search homes by town, street or ZIP</label><input id="q" name="q" type="search" placeholder="Town, street or ZIP" autocomplete="off"><button type="submit" aria-label="Search homes">${icon(p, 'search')}</button></div>
        <p class="opening__quick"><span>Or browse:</span><a href="${p}site/search/?status=Open%20house">Open houses</a><a href="${p}site/search/?mode=discover">Homes with a story</a><a href="${p}site/communities/">All six towns</a></p>
      </form>
    </div>
  </div>
  <div class="opening__mapstrip" aria-hidden="true"><div class="mapbox"><div class="stage stage--cover">${terrainSvg(p, { aspect: 'xMidYMid meet' })}${terrain.towns.map(t => `<span class="town-pin" style="--x:${t.x};--y:${t.y}"><span class="town halo">${t.name}</span></span>`).join('')}</div></div></div>
  <nav class="opening__legend" aria-labelledby="h-legend">
    <h2 id="h-legend" class="legend-title">Where are you headed?</h2>
    ${intents.map(([n, s, h, note]) => `<a class="intent" href="${p}${h}">${sym(s)}<span class="intent__name">${n}${icon(p, 'arrow')}</span><span class="intent__note">${note}</span></a>`).join('')}
  </nav>
  <div class="opening__collar">
    <span class="credit"><span class="town" style="font-size:.75rem;margin-right:1rem">Central Massachusetts Sheet</span>Prepared by <b>The Oberdorfer Team</b> · Brokered by ${esc(settings.brokerage.legalName)}</span>
    <span class="scalebar" aria-hidden="true"><span class="scalebar__bar"><span></span><span></span><span></span><span></span></span>Schematic · not to scale</span>
    <span>Worcester County · edition 2026</span>
  </div>
</section>

<section class="section on-forest" aria-labelledby="h-personal">
  <div class="mapbox" aria-hidden="true" style="opacity:.9"><div class="stage stage--cover">${terrainSvg(p, { cls: 'terrain--dark', water: false })}</div></div>
  <div class="wrap personal" style="position:relative">
    <h2 id="h-personal">Real estate, <em>personally handled.</em></h2>
    <div class="personal__note">
      <p>We’d rather spend an hour walking a street with you than send you forty listings. Most of what matters about a home isn’t in the listing: the light in the kitchen at four o’clock, how the neighbors use the sidewalk, what the drive is like when it snows.</p>
      <p>So we keep the team small enough that you always know who’s handling your move, and we learn these towns the slow way.</p>
      <p class="signature">— Brandon &amp; Kait</p>
    </div>
    <div class="personal__people">
      ${[brandon, kait].map(a => frame(p, { kind: 'people', code: a.portrait.code, direction: a.portrait.direction, ar: '4 / 5', caption: `<b>${esc(a.name)}</b>${esc(a.role)}`, cls: 'reveal' })).join('')}
    </div>
    <div class="personal__actions"><a class="btn btn--paper" href="${p}site/contact/">Talk with Brandon &amp; Kait ${icon(p, 'arrow')}</a><a class="btn btn--ghost-paper" href="${p}site/agents/">Meet the team</a></div>
  </div>
</section>

<section class="section" aria-labelledby="h-homes">
  <div class="wrap">
    <div class="sec-head">
      <h2 id="h-homes">On the market <em>around here</em></h2>
      <div class="sec-head__aside"><p class="meta">One home told properly, the rest at a glance. Switch between story and search any time.</p><span class="synthetic">Sample listings · fictional</span></div>
    </div>
    <article class="feature rise">
      <div class="feature__frame">${frame(p, { kind: 'property', code: feat.photos[0].code, direction: feat.photos[0].direction, ar: '16 / 10', cls: 'reveal', style: feat.style })}${L.favBtn(p, feat)}</div>
      <div class="feature__body">
                <h3><a href="${L.listingHref(p, feat)}">${esc(feat.storyTitle)}</a></h3>
        <p class="feature__dek">${esc(feat.storyDek)}</p>
        <div class="feature__data">
          <a class="address" href="${L.listingHref(p, feat)}">${esc(feat.address)}</a>
          <span class="town meta">${esc(L.town(feat.town).name)}</span>
          <span class="price">${money(feat.price)}</span>
          ${L.facts(feat)}
          ${feat.openHouse ? `<p class="openhouse">${icon(p, 'calendar')} Open house ${esc(feat.openHouse)}</p>` : ''}
        </div>
        <a class="link-arrow" href="${L.listingHref(p, feat)}">Read the story &amp; see the facts ${icon(p, 'arrow')}</a>
      </div>
    </article>
    <div style="margin-top:var(--s-8)">
      <div class="results-meta"><h3 class="label" style="color:var(--ink)">Also listed</h3><div style="display:flex;gap:1.25rem;flex-wrap:wrap"><a class="link-arrow" href="${p}site/search/">Search all homes ${icon(p, 'arrow')}</a><a class="link-arrow" href="${p}site/search/?mode=discover">Browse by story ${icon(p, 'arrow')}</a></div></div>
      ${L.rowsTable(p, rows, { caption: 'Also listed' })}
    </div>
  </div>
</section>

<section class="section" style="background:var(--paper-deep);border-block:var(--neatline) solid var(--ink)" aria-labelledby="h-towns">
  <div class="wrap">
    <div class="sec-head">
      <h2 id="h-towns">Six towns, <em>one sheet</em></h2>
      <p>Start from how you want to live, not from a town name. Choose what matters and we’ll highlight the places that fit.</p>
    </div>
    <div class="lifefirst" data-lifefirst>
      <div class="chips" role="group" aria-label="What matters to you">${journeys.attributes.map(a => `<button class="chip" type="button" aria-pressed="false" data-attr="${a.id}">${sym(a.symbol)}${esc(a.label)}</button>`).join('')}</div>
      <p class="lifefirst__status" aria-live="polite" data-lifefirst-status>Showing all six towns.</p>
    </div>
    <div class="sheetindex" data-sheetindex>
      ${towns.map(t => { const tp = L.tpos(t.slug); return `<a class="sheetindex__cell" href="${p}site/communities/${t.slug}/" data-attrs="${t.attributes.join(' ')}">
        <div class="terrain-wrap" aria-hidden="true">${terrainSvg(p, { view: cropView(tp.x, tp.y, 480, 300), cls: 'terrain--quiet' })}</div>
        <span class="sheetindex__name town halo">${t.name}</span>
        ${icon(p, 'arrow-ne', 'arrow')}
        <span class="sheetindex__label"><span class="sheetindex__lede">${esc(t.lede)}</span>
        <span class="sheetindex__tags">${t.attributes.map(a => esc(journeys.attributes.find(x => x.id === a).label)).join(' · ')}</span></span>
      </a>`; }).join('')}
    </div>
    <p class="meta" style="margin-top:var(--s-4)">Town attributes describe housing and location only. ${esc(settings.fairHousing)}</p>
  </div>
</section>

<section class="section" aria-labelledby="h-routes">
  <div class="wrap">
    <div class="sec-head">
      <h2 id="h-routes">Two routes, <em>mapped</em></h2>
      <div class="sec-head__aside"><p class="meta">Every move has the same shape: a gentle start, a climb in the middle, and a closing. We tell you where you are on it.</p>
      <div class="journey__tabs" role="tablist" aria-label="Choose a route"><button role="tab" aria-selected="true" aria-controls="route-buying" id="rt-buying" data-route-tab="buying">Buying</button><button role="tab" aria-selected="false" aria-controls="route-selling" id="rt-selling" data-route-tab="selling" tabindex="-1">Selling</button></div></div>
    </div>
    <div role="tabpanel" id="route-buying" aria-labelledby="rt-buying">${L.journeyBlock(p, 'buying', { id: 'home-buying' })}</div>
    <div role="tabpanel" id="route-selling" aria-labelledby="rt-selling" hidden>${L.journeyBlock(p, 'selling', { id: 'home-selling' })}</div>
  </div>
</section>

<section class="section" style="border-top:var(--neatline) solid var(--ink)" aria-labelledby="h-notes">
  <div class="wrap">
    <div class="sec-head"><h2 id="h-notes">From the <em>Field Guide</em></h2><p>Notes on towns, houses and the process, written by the team. Worth reading even if you aren’t moving this year.</p></div>
    <div class="notes">
      <article class="notes__lead rise">${frame(p, { kind: 'place', code: lead.photo.code, direction: lead.photo.direction, ar: '3 / 2', seed: 4, cls: 'reveal' })}
        <h3><a href="${p}site/field-guide/${lead.slug}/">${esc(lead.title)}</a></h3><p>${esc(lead.dek)}</p>
        <p class="byline" style="font-style:normal"><b>${esc(L.agent(lead.author).name)}</b><span>${esc(lead.category)}</span><time datetime="${lead.date}">${L.fmtDate(lead.date)}</time></p></article>
      <ul class="notes__list">${others.map(g => `<li><h3><a href="${p}site/field-guide/${g.slug}/">${esc(g.title)}</a></h3><p class="byline"><b>${esc(L.agent(g.author).name)}</b><span>${esc(g.category)}</span><time datetime="${g.date}">${L.fmtDate(g.date)}</time></p></li>`).join('')}
        <li><a class="link-arrow" href="${p}site/field-guide/">The whole Field Guide ${icon(p, 'arrow')}</a></li></ul>
    </div>
  </div>
</section>

<section class="section" style="background:var(--woodland);border-top:var(--neatline) solid var(--ink)" aria-labelledby="h-talk" id="talk">
  <div class="wrap converse">
    <div class="converse__head">
      <h2 id="h-talk">Ask us about <em>a street.</em></h2>
      <p>Or a town, a house you drove past, or whether now is the time. You’ll hear back from one of us, by name.</p>
      <div class="converse__people">${[brandon, kait].map(a => L.personLine(p, a)).join('')}</div>
    </div>
    <div class="converse__form">${L.leadForm(p, { id: 'home-lead', intent: 'advice' })}</div>
  </div>
</section>`;
  write(path, L.page({ p, path, title: 'The Oberdorfer Team · Real estate in Central Massachusetts', description: 'Find your place in Worcester, Shrewsbury, Grafton, Holden, Auburn and Millbury with The Oberdorfer Team at REWAP Brokerage.', current: 'home', body, jsonld: L.ldTeam(), scripts: ['home.js'], bodyClass: 'page-home' }));
}

// ============================================================ SEARCH
function search() {
  const path = 'site/search/index.html', p = prefix(path);
  const data = listings.map(l => ({ ...l, townName: L.town(l.town).name, href: L.listingHref(p, l), agentName: L.agent(l.agent).name, frames: Object.fromEntries(['16 / 10', '4 / 5', '3 / 2'].map(ar => [ar, frame(p, { kind: 'property', code: l.photos[0].code, direction: l.photos[0].direction, ar, style: l.style })])) }));
  const typeCounts = t => listings.filter(l => l.town === t).length;
  const filtersHtml = idp => `
    <div class="filter-group"><fieldset><legend class="filter-group__label">Towns</legend><div class="checks">${towns.map(t => `<label class="check"><input type="checkbox" name="town" value="${t.slug}" form="${idp}">${t.name}<span class="n">${typeCounts(t.slug)}</span></label>`).join('')}</div></fieldset></div>
    <div class="filter-group"><span class="filter-group__label" id="${idp}-price">Price</span><div class="range" role="group" aria-labelledby="${idp}-price"><label class="visually-hidden" for="${idp}-min">Minimum price</label><select id="${idp}-min" name="min" form="${idp}"><option value="">No min</option>${[300, 400, 500, 600, 700, 800].map(v => `<option value="${v * 1000}">$${v}k</option>`).join('')}</select><label class="visually-hidden" for="${idp}-max">Maximum price</label><select id="${idp}-max" name="max" form="${idp}"><option value="">No max</option>${[400, 500, 600, 700, 800, 1000].map(v => `<option value="${v * 1000}">$${v}k</option>`).join('')}</select></div></div>
    <div class="filter-group"><fieldset><legend class="filter-group__label">Bedrooms</legend><div class="steps">${['Any', '2+', '3+', '4+'].map((v, i) => `<label><input type="radio" name="beds" value="${i ? i + 1 : ''}" form="${idp}" ${i ? '' : 'checked'}><span>${v}</span></label>`).join('')}</div></fieldset></div>
    <div class="filter-group"><fieldset><legend class="filter-group__label">Home type</legend><div class="checks">${['Single family', 'Multi-family', 'Condominium'].map(v => `<label class="check"><input type="checkbox" name="type" value="${v}" form="${idp}">${v}</label>`).join('')}</div></fieldset></div>
    <div class="filter-group"><fieldset><legend class="filter-group__label">Status</legend><div class="checks">${['Active', 'Open house', 'Coming soon', 'Under agreement'].map(v => `<label class="check"><input type="checkbox" name="status" value="${v}" form="${idp}"><span class="status" data-status="${v}" style="font-size:.8125rem">${v}</span></label>`).join('')}</div></fieldset></div>
    <div class="filter-group"><fieldset><legend class="filter-group__label">Character</legend><div class="checks"><label class="check"><input type="checkbox" name="story" value="1" form="${idp}">Has a property story</label><label class="check"><input type="checkbox" name="older" value="1" form="${idp}">Built before 1940</label><label class="check"><input type="checkbox" name="lot" value="1" form="${idp}">Lot of 1 acre or more</label></div></fieldset></div>`;
  const body = `
<form id="sf" class="searchbar" role="search" data-search-form onsubmit="return false">
  <div class="searchbar__inner">
    <div class="findfield"><label class="visually-hidden" for="sq">Search by town, street or ZIP</label><input id="sq" name="q" type="search" placeholder="Town, street or ZIP" autocomplete="off"><button type="submit" aria-label="Search">${icon(p, 'search')}</button></div>
    <div class="seg" role="group" aria-label="View mode"><button type="button" aria-pressed="true" data-mode-btn="search">${icon(p, 'list')}Search</button><button type="button" aria-pressed="false" data-mode-btn="discover">${icon(p, 'frames')}Discover</button></div>
    <label class="visually-hidden" for="sort">Sort homes</label>
    <select id="sort" name="sort"><option value="new">Newest</option><option value="price-asc">Price, low to high</option><option value="price-desc">Price, high to low</option><option value="sqft">Largest</option></select>
    <button class="btn btn--line btn--small filters-open-btn" type="button" data-filters-open>${icon(p, 'legend')} Filters <span data-filter-count></span></button>
    <button class="btn btn--line btn--small" type="button" data-save-search>${icon(p, 'bookmark')} Save this search</button>
  </div>
</form>
<div class="search-layout" data-search-layout data-mode="search" data-view="list">
  <aside class="filters" aria-labelledby="flt-h"><h2 id="flt-h">Legend · Filters</h2>${filtersHtml('sf')}<button class="btn btn--line btn--small" type="button" data-clear style="margin-top:var(--s-4)">Clear filters</button></aside>
  <div class="listcol">
    <div class="results-meta"><p class="count" aria-live="polite" data-result-count>${listings.length} homes</p><span class="synthetic">Sample listings · fictional</span></div>
    <div data-results-search>${L.rowsTable(p, listings, { caption: 'Search results' })}</div>
    <div data-results-discover hidden><div class="discover"></div></div>
    <div class="empty" data-empty hidden><h3>No homes match all of that.</h3><p>Try fewer filters, or tell us what you’re looking for and we’ll watch for it, including homes that haven’t hit the market yet.</p><div style="display:flex;gap:.75rem;flex-wrap:wrap"><button class="btn btn--line" type="button" data-clear>Clear filters</button><a class="btn btn--route" href="${p}site/contact/?intent=buying">Ask us to watch for it ${icon(p, 'arrow')}</a></div></div>
    <p class="meta" style="margin-top:var(--s-6)">${esc(settings.idx.disclaimer)}</p>
  </div>
  <div class="mapcol" aria-label="Map of results">
    <div class="mapbox searchmap"><div class="stage stage--search"><div class="terrain terrain--xl" aria-hidden="true"><svg viewBox="0 0 1600 1000" preserveAspectRatio="none" focusable="false"><use class="t-minor" href="${p}assets/terrain/terrain-tall.svg#t-minor-xl" x="0" y="-500" width="1600" height="2000"/><use class="t-index" href="${p}assets/terrain/terrain-tall.svg#t-index-xl" x="0" y="-500" width="1600" height="2000"/><use class="t-lake" href="${p}assets/terrain/terrain.svg#t-lake" x="0" y="0" width="1600" height="1000"/><use class="t-river" href="${p}assets/terrain/terrain.svg#t-river" x="0" y="0" width="1600" height="1000"/></svg></div>${terrain.towns.map(t => `<span class="town-lbl town halo" style="--x:${t.x};--y:${t.y}">${t.name}</span>`).join('')}<div data-pins></div></div></div><span class="map-hint">Drag to pan the sheet</span>
  </div>
</div>
<button class="btn map-toggle" type="button" data-map-toggle aria-pressed="false">${icon(p, 'map')}<span>Map</span></button>
<form id="sfd" hidden></form>
<dialog class="filterdialog" data-filter-dialog aria-labelledby="fd-h"><div class="filterdialog__head"><h2 id="fd-h">Filters</h2><button class="btn btn--line btn--icon" type="button" data-filters-close aria-label="Close filters">${icon(p, 'close')}</button></div><div class="filterdialog__body">${filtersHtml('sfd').replace(/id="sf-/g, 'id="sfd-').replace(/aria-labelledby="sf-/g, 'aria-labelledby="sfd-').replace(/for="sf-/g, 'for="sfd-')}</div><div class="filterdialog__foot"><button class="btn btn--line btn--small" type="button" data-clear>Clear</button><button class="btn btn--route btn--small" type="button" data-filters-close>Show homes</button></div></dialog>
<dialog class="modal" data-save-dialog aria-labelledby="ss-h"><div class="modal__head"><h2 id="ss-h">Save this search</h2><button class="btn btn--line btn--icon" type="button" data-save-close aria-label="Close">${icon(p, 'close')}</button></div>
  <form class="modal__body" data-save-form method="dialog"><p data-save-summary class="meta"></p><div class="field"><label for="ss-name">Name this search</label><input id="ss-name" name="name" placeholder="e.g. Grafton, 3+ beds"></div><div class="field"><label for="ss-email">Email me new matches</label><input id="ss-email" name="email" type="email" autocomplete="email" placeholder="you@example.com"><span class="hint">Optional. Your search is saved on this device either way; email alerts go through the team’s CRM.</span></div><div class="form__actions"><button class="btn btn--route" type="submit">Save search</button><button class="btn btn--line" type="button" data-save-close>Cancel</button></div></form></dialog>
<script type="application/json" id="listings-data">${JSON.stringify(data)}</script>`;
  write(path, L.page({ p, path, title: 'Search homes · The Oberdorfer Team', description: 'Search homes for sale across Central Massachusetts, by list or by story.', current: 'search', body, scripts: ['search.js'], bodyClass: 'page-search', jsonld: [L.ldCrumbs([['Home', ''], ['Homes', 'search/']])] }));
}

// ============================================================ PROPERTY
function property(l) {
  const path = `site/homes/${l.slug}/index.html`, p = prefix(path);
  const t = L.town(l.town), a = L.agent(l.agent);
  const related = listings.filter(x => x !== l && (x.town === l.town || Math.abs(x.price - l.price) < 120000)).slice(0, 3);
  const keyf = [['Bedrooms', l.beds], ['Bathrooms', L.baths(l.baths)], ['Living area', `${l.sqft.toLocaleString('en-US')}<small>sq ft</small>`], ['Lot', l.lot ? `${l.lot}<small>ac</small>` : '—'], ['Built', l.year]];
  const dataRows = [['Property type', l.type], ['Style', l.style], ['Year built', l.year], ['Bedrooms', l.beds], ['Bathrooms', L.baths(l.baths)], ['Living area', `${l.sqft.toLocaleString('en-US')} sq ft`], ['Lot size', l.lot ? `${l.lot} acres` : 'n/a'], ['Parking', l.garage], ['Heating', l.heat], ['Annual taxes', money(l.taxes)], ...(l.hoa ? [['Condo fee', `${money(l.hoa)}/mo`]] : []), ['MLS #', l.mls], ['Status', l.status], ['ZIP', l.zip]];
  const head = l.story ? `
<header class="wrap story-hero">
  ${crumbs(p, [['Home', 'site/'], ['Homes', 'site/search/'], [t.name, `site/communities/${t.slug}/`], [l.address, '']])}
  <h1>${esc(l.storyTitle).replace(/ (\S+)$/, ' <em>$1</em>')}</h1>
  <p>${esc(l.storyDek)}</p>
</header>` : '';
  const body = `
${head}
<div class="prop-hero">${frame(p, { kind: 'property', code: l.photos[0].code, direction: l.photos[0].direction, ar: '21 / 9', cls: 'vt-frame', alt: `Exterior photograph of ${l.address} to come`, style: l.style }).replace('class="frame ', `style="--vt:home-${l.id}" class="frame `)}</div>
<div class="wrap">
  <div class="prop-title">
    ${l.story ? '' : crumbs(p, [['Home', 'site/'], ['Homes', 'site/search/'], [t.name, `site/communities/${t.slug}/`], [l.address, '']])}
    <h1>${l.story ? `<span class="prop-addr">${esc(l.address)}</span>` : esc(l.address)}<span class="town">${esc(t.name)}, MA ${esc(l.zip)}</span></h1>
    <div class="prop-title__right"><span class="price">${money(l.price)}</span><span>${L.statusTag(l)}</span><div style="display:flex;gap:.6rem">${L.favBtn(p, l)}<button class="fav" type="button" data-share aria-label="Share this home">${icon(p, 'share')}</button></div></div>
  </div>
  <dl class="prop-keyfacts">${keyf.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>
  <div class="prop-body">
    <div class="prop-main">
      ${l.story ? `<section class="prop-section" aria-labelledby="h-voice"><h2 id="h-voice">In our words <span class="source-tag source-tag--voice">Editorial · written by the team</span></h2><div class="voice">${l.story_body.map(x => `<p>${esc(x)}</p>`).join('')}</div><p class="voice-sign">Written by <b>${esc(a.name)}</b> after walking the house. Opinions are ours; facts are below.</p></section>` : ''}
      <section class="prop-section" aria-labelledby="h-gal"><h2 id="h-gal">Photographs <span class="gallery__count" data-gal-count>1 / ${l.photos.length}</span></h2>
        <div class="gallery" data-gallery><div class="gallery__track" tabindex="0" aria-label="Photo gallery, scroll horizontally">${l.photos.map((ph, i) => `<button class="frame-open" type="button" data-open="${i}" aria-label="Open photo ${i + 1} of ${l.photos.length} full screen">${frame(p, { kind: 'property', code: ph.code, direction: ph.direction, ar: '3 / 2', style: l.style })}</button>`).join('')}</div>
        <div class="gallery__controls"><span class="meta">Photography to be shot by the team’s photographer. Each frame carries its brief.</span><span style="display:flex;gap:.5rem"><button class="btn btn--line btn--icon" type="button" data-gal-prev aria-label="Previous photo">${icon(p, 'arrow-left')}</button><button class="btn btn--line btn--icon" type="button" data-gal-next aria-label="Next photo">${icon(p, 'arrow')}</button></span></div></div>
      </section>
      <section class="prop-section" aria-labelledby="h-feat"><h2 id="h-feat">Features &amp; spaces <span class="source-tag source-tag--data">From the listing</span></h2><ul class="features-list">${l.features.map(f => `<li>${esc(f)}</li>`).join('')}</ul></section>
      <section class="prop-section" aria-labelledby="h-data"><h2 id="h-data">The facts <span class="source-tag source-tag--data">Verified data · ${esc(settings.idx.mls)}</span></h2>
        <div class="datablock"><div class="datablock__head"><span class="label" style="color:var(--ink)">Property record</span><span class="synthetic">Sample data · fictional</span></div>
        <dl>${dataRows.map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
        <p class="datablock__foot">${esc(settings.attribution.listingCourtesy.replace('{listingOffice}', l.listingOffice))}. Source: ${esc(settings.idx.mls)} via IDX feed (sample). Data is displayed exactly as received and is never edited by the team. ${esc(settings.idx.disclaimer)}</p></div>
      </section>
      <section class="prop-section" aria-labelledby="h-loc"><h2 id="h-loc">Where it is</h2>
        <div class="minimap"><div class="mapbox"><div class="stage stage--cover">${terrainSvg(p, { aspect: 'xMidYMid meet' })}<span class="here" style="--x:${l.x};--y:${l.y}" role="img" aria-label="Approximate location of ${esc(l.address)}"></span>${terrain.towns.map(tt => `<span class="town-lbl town halo" style="--x:${tt.x};--y:${tt.y}">${tt.name}</span>`).join('')}</div></div></div>
        <p class="meta" style="margin-top:.75rem">Schematic sheet; the live site shows the exact location on an interactive map from the IDX provider.</p>
      </section>
      <section class="prop-section" aria-labelledby="h-comm"><h2 id="h-comm">About ${esc(t.name)}</h2>
        <p class="voice" style="font-size:1.125rem">${esc(t.lede)}</p>
        <ul class="getting" style="margin-top:var(--s-5)">${t.getting.map(g => `<li>${esc(g)}</li>`).join('')}</ul>
        <p style="margin-top:var(--s-5);display:flex;gap:1.5rem;flex-wrap:wrap"><a class="link-arrow" href="${p}site/communities/${t.slug}/">The ${esc(t.name)} sheet ${icon(p, 'arrow')}</a><a href="${p}site/contact/?intent=advice&amp;community=${t.slug}">Ask about this town</a></p>
      </section>
    </div>
    <aside class="prop-side" aria-label="Ask about this home"><div class="prop-side__sticky">
      ${l.openHouse ? `<p class="openhouse">${icon(p, 'calendar')} Open house · ${esc(l.openHouse)}</p>` : ''}
      <div class="askcard">
        <div class="askcard__agent">${frame(p, { kind: 'people', code: a.portrait.code, direction: a.portrait.direction, ar: '1 / 1', bare: true, alt: `Portrait of ${a.name} to come`, initials: L.initials(a) })}<div><b>${esc(a.name)}</b><span>${esc(a.role)} · knows this one</span></div></div>
        <div class="askcard__body">
          <a class="btn btn--route" href="#ask">${icon(p, 'calendar')} Schedule a showing</a>
          <a class="btn btn--line" href="#ask">${icon(p, 'message')} Ask about this home</a>
          <a class="meta" href="tel:${a.phone.replace(/\D/g, '')}" style="text-align:center">or call ${esc(a.first)} at ${esc(a.phone)}</a>
        </div>
        <p class="askcard__attr">${esc(settings.attribution.property)}</p>
      </div>
    </div></aside>
  </div>
  <section class="prop-section" id="ask" aria-labelledby="h-ask" style="display:grid;grid-template-columns:repeat(12,minmax(0,1fr));gap:var(--gutter)">
    <div style="grid-column:1/span 5" class="stack"><h2 id="h-ask" style="font:800 var(--t-h2)/1.02 var(--f-serif)">Ask about <em style="font-weight:400">this home.</em></h2><p class="voice" style="font-size:1.125rem">${esc(a.first)} will reply personally, usually the same day. If you’d like to see it, suggest a time and we’ll confirm.</p>${L.personLine(p, a)}</div>
    <div style="grid-column:7/span 6">${L.leadForm(p, { id: 'ask-form', intent: 'showing', agentSlug: a.slug, listingId: l.id, community: l.town, submit: 'Send to ' + a.first, messageLabel: 'Your question or a good time to visit', messagePlaceholder: 'Is the basement dry? Could we see it Saturday morning?' })}</div>
  </section>
  ${related.length ? `<section class="prop-section" aria-labelledby="h-rel"><h2 id="h-rel">Nearby &amp; similar</h2>${L.rowsTable(p, related, { caption: 'Related homes' })}</section>` : ''}
  <section class="prop-section" aria-label="Disclosures"><p class="meta">${esc(settings.idx.demoNotice)} ${esc(settings.attribution.disclosure)}</p></section>
</div>
<script type="application/json" id="page-context">${JSON.stringify({ agentName: a.first, listing: { id: l.id, street: l.address, city: t.name, zip: l.zip, mls: l.mls, price: l.price } })}</script>
<dialog class="lightbox" data-lightbox aria-label="Photographs of ${esc(l.address)}"><div class="lightbox__inner"><div class="lightbox__bar"><span class="code" data-lb-count></span><button class="btn btn--ghost-paper btn--icon" type="button" data-lb-close aria-label="Close photos">${icon(p, 'close')}</button></div><div class="lightbox__stage" data-lb-stage></div><div class="lightbox__nav"><button class="btn btn--ghost-paper btn--icon" type="button" data-lb-prev aria-label="Previous photo">${icon(p, 'arrow-left')}</button><button class="btn btn--ghost-paper btn--icon" type="button" data-lb-next aria-label="Next photo">${icon(p, 'arrow')}</button></div></div></dialog>`;
  write(path, L.page({ p, path, title: `${l.address}, ${t.name} MA · ${money(l.price)} · The Oberdorfer Team`, description: `${l.style}, ${l.beds} bedrooms, ${L.baths(l.baths)} baths in ${t.name}. Sample listing.`, current: 'search', body, scripts: ['property.js'], jsonld: [L.ldListing(l), L.ldCrumbs([['Home', ''], ['Homes', 'search/'], [l.address, `homes/${l.slug}/`]])] }));
}

// ============================================================ COMMUNITIES
function communityIndex() {
  const path = 'site/communities/index.html', p = prefix(path);
  const body = `
<header class="pagehead"><div class="mapbox" aria-hidden="true"><div class="stage stage--cover">${terrainSvg(p, { aspect: 'xMidYMid meet', draw: true })}${townPins(p)}</div></div>
  <div class="wrap pagehead__inner" style="pointer-events:none">${crumbs(p, [['Home', 'site/'], ['Towns', '']])}<h1 class="halo">The towns <em>on this sheet</em></h1><p class="lede halo">Six places we know well, each with its own center, its own housing and its own reasons people choose it.</p></div></header>
<section class="section"><div class="wrap">
  <div class="sec-head"><h2>Start with <em>how you live</em></h2><p>Choose what matters. We’ll highlight the towns where you’re most likely to find it. Descriptions cover housing and location only.</p></div>
  <div class="lifefirst" data-lifefirst><div class="chips" role="group" aria-label="What matters to you">${journeys.attributes.map(a => `<button class="chip" type="button" aria-pressed="false" data-attr="${a.id}">${sym(a.symbol)}${esc(a.label)}</button>`).join('')}</div><p class="lifefirst__status" aria-live="polite" data-lifefirst-status>Showing all six towns.</p></div>
  <div class="sheetindex" data-sheetindex>${towns.map(t => { const tp = L.tpos(t.slug); return `<a class="sheetindex__cell" href="${p}site/communities/${t.slug}/" data-attrs="${t.attributes.join(' ')}"><div aria-hidden="true">${terrainSvg(p, { view: cropView(tp.x, tp.y, 480, 300), cls: 'terrain--quiet' })}</div><span class="sheetindex__name town halo">${t.name}</span>${icon(p, 'arrow-ne', 'arrow')}<span class="sheetindex__label"><span class="sheetindex__lede">${esc(t.lede)}</span><span class="sheetindex__tags">${t.attributes.map(a => esc(journeys.attributes.find(x => x.id === a).label)).join(' · ')}</span></span></a>`; }).join('')}</div>
  <p class="meta" style="margin-top:var(--s-4)">${esc(settings.fairHousing)}</p>
</div></section>`;
  write(path, L.page({ p, path, title: 'Towns · Central Massachusetts · The Oberdorfer Team', description: 'Guides to Worcester, Shrewsbury, Grafton, Holden, Auburn and Millbury: housing, places, getting around.', current: 'communities', body, scripts: ['home.js'], jsonld: towns.map(L.ldPlace) }));
}

function community(t) {
  const path = `site/communities/${t.slug}/index.html`, p = prefix(path);
  const tp = L.tpos(t.slug);
  const homes = listings.filter(l => l.town === t.slug);
  const tg = guides.filter(g => g.towns.includes(t.slug));
  const team = t.agents.map(L.agent);
  const adj = dir => (t.adjoining[dir] || []).map(n => { const c = L.town(n); return c ? `<a href="${p}site/communities/${c.slug}/">${c.name}</a>` : `<span>${esc(n)}</span>`; }).join(' · ');
  const arrows = { n: '↑', s: '↓', e: '→', w: '←' };
  const mx = Math.max(...t.market.trend), mn = Math.min(...t.market.trend);
  const spark = t.market.trend.map((v, i) => `${(i / (t.market.trend.length - 1)) * 300},${80 - ((v - mn) / (mx - mn || 1)) * 64}`).join(' ');
  const body = `
<header class="commhead">
  <div class="mapbox" aria-hidden="true"><div class="stage stage--cover" style="width:max(100cqw,160cqh)">${terrainSvg(p, { view: cropView(Math.min(tp.x + 0.08, 0.85), tp.y, 900, 560), draw: true })}</div></div>
  ${['n', 'e', 's', 'w'].map(d => t.adjoining[d] ? `<span class="adjoin adjoin--${d}">${icon(p, 'arrow')}<span class="visually-hidden">Adjoining to the ${({ n: 'north', e: 'east', s: 'south', w: 'west' })[d]}:</span> ${adj(d)}</span>` : '').join('')}
  <div class="wrap commhead__inner">
    ${crumbs(p, [['Home', 'site/'], ['Towns', 'site/communities/'], [t.name, '']])}
    <h1 class="halo">${esc(t.name)}</h1>
    <p class="lede halo">${esc(t.lede)}</p>
    <div class="coords"><span class="label">${esc(t.county)}, Massachusetts</span><a class="link-arrow" href="#homes">${homes.length} home${homes.length === 1 ? '' : 's'} listed ${icon(p, 'arrow')}</a><a class="link-arrow" href="#ask">Ask about ${esc(t.name)} ${icon(p, 'arrow')}</a></div>
  </div>
</header>
<section class="section"><div class="wrap comm-grid">
  <div class="comm-overview">${t.overview.map(x => `<p>${esc(x)}</p>`).join('')}</div>
  <aside class="comm-aside"><h2 class="label" style="color:var(--ink);margin-bottom:.75rem">Getting around</h2><ul class="getting">${t.getting.map(g => `<li>${esc(g)}</li>`).join('')}</ul></aside>
</div></section>
<section class="section" style="background:var(--paper-deep);border-block:var(--neatline) solid var(--ink)" aria-labelledby="h-housing"><div class="wrap comm-grid">
  <div style="grid-column:1/span 5"><h2 id="h-housing" style="font:800 var(--t-h2)/1.02 var(--f-serif)">The houses <em style="font-weight:400">here</em></h2><p class="meta" style="margin-top:1rem;max-width:36ch">What you’ll find on the side streets, in roughly the order you’ll notice it.</p></div>
  <ul class="comm-housing" style="grid-column:7/span 6">${t.housing.map((h, i) => `<li>${sym(['hatch', 'area', 'solid', 'parcel'][i % 4]).replace('class="sym"', 'class="sym" style="width:30px;margin-top:6px"')}<div><b>${esc(h.type)}</b><span>${esc(h.note)}</span></div></li>`).join('')}</ul>
</div></section>
<section class="section" aria-labelledby="h-places"><div class="wrap">
  <div class="sec-head"><h2 id="h-places">Where people <em>actually go</em></h2><p>Parks, landmarks and everyday places. A short list, not a directory.</p></div>
  <div class="comm-places"><div class="comm-places__frame">${frame(p, { kind: 'place', code: t.photo.code, direction: t.photo.direction, ar: '4 / 3', seed: t.slug.length + 3, cls: 'reveal' })}</div>
  <ol class="comm-places__list">${t.places.map(pl => `<li><b>${esc(pl.name)}</b><span>${esc(pl.note)}</span></li>`).join('')}</ol></div>
</div></section>
<section class="section" id="homes" style="border-top:var(--neatline) solid var(--ink)" aria-labelledby="h-chomes"><div class="wrap">
  <div class="sec-head"><h2 id="h-chomes">Homes in <em>${esc(t.name)}</em></h2><div class="sec-head__aside"><a class="link-arrow" href="${p}site/search/?town=${t.slug}">Search ${esc(t.name)} ${icon(p, 'arrow')}</a><span class="synthetic">Sample listings · fictional</span></div></div>
  ${homes.length ? L.rowsTable(p, homes, { caption: `Homes in ${t.name}` }) : `<p class="meta">No sample listings here right now. <a href="${p}site/contact/?intent=buying&amp;community=${t.slug}">Ask us to watch for one</a>.</p>`}
  <div class="datablock" style="margin-top:var(--s-7)"><div class="datablock__head"><span class="label" style="color:var(--ink)">Market context · ${esc(t.name)}</span><span class="synthetic">Illustrative figures · replaced by dated MLS data</span></div>
    <dl><div><dt>Median sale price, last 12 months</dt><dd>${t.market.median}</dd></div><div><dt>Median days on market</dt><dd>${t.market.dom}</dd></div><div><dt>Months of supply</dt><dd>${t.market.inventory}</dd></div><div><dt>Source</dt><dd>MLS PIN · [date]</dd></div></dl>
    <div class="market__chart" style="padding:1rem">${(() => { const tr = t.market.trend.map(v => Math.round(v / t.market.trend[0] * 100)), n = tr.length, lo = 95, hi = Math.max(...tr) + 5, X = i => 44 + i * (620 / (n - 1)), Y = v => 104 - ((v - lo) / (hi - lo)) * 84; return `<svg viewBox="0 0 680 128" role="img" aria-label="Illustrative median sale price index for ${esc(t.name)}, Q1 2025 equals 100, rising to ${tr[n - 1]} by Q4 2026"><line x1="44" x2="664" y1="104" y2="104" stroke="var(--ink)" vector-effect="non-scaling-stroke"/><line x1="44" x2="664" y1="${Y(100)}" y2="${Y(100)}" stroke="var(--rule-strong)" stroke-dasharray="3 4" vector-effect="non-scaling-stroke"/><text class="axis" x="0" y="${Y(100) + 3}">100</text><text class="axis" x="0" y="${Y(hi - 5) + 3}">${hi - 5}</text>${tr.map((v, i) => `<text class="axis" x="${X(i)}" y="122" text-anchor="middle">Q${i % 4 + 1}${i % 4 === 0 ? ` ’${25 + i / 4}` : ''}</text>`).join('')}<polyline points="${tr.map((v, i) => `${X(i)},${Y(v)}`).join(' ')}" fill="none" stroke="var(--forest)" stroke-width="2" vector-effect="non-scaling-stroke"/><circle cx="${X(n - 1)}" cy="${Y(tr[n - 1])}" r="3.5" fill="var(--forest)"/><text class="axis" x="${X(n - 1) - 8}" y="${Y(tr[n - 1]) - 8}" text-anchor="end" style="fill:var(--forest)">${tr[n - 1]}</text></svg><p class="meta" style="font-size:.8125rem;margin-top:.25rem">Median sale price index, Q1 2025 = 100. Illustrative.</p>`; })()}</div></div>
</div></section>
${tg.length ? `<section class="section section--tight" style="border-top:var(--hair) solid var(--rule)"><div class="wrap"><h2 class="label" style="color:var(--ink);margin-bottom:1rem">From the Field Guide</h2><ul class="notes__list" style="grid-column:auto">${tg.map(g => `<li><h3><a href="${p}site/field-guide/${g.slug}/">${esc(g.title)}</a></h3><p class="meta">${esc(g.dek)}</p></li>`).join('')}</ul></div></section>` : ''}
<section class="section" id="ask" style="background:var(--woodland);border-top:var(--neatline) solid var(--ink)" aria-labelledby="h-ask"><div class="wrap converse">
  <div class="converse__head"><h2 id="h-ask">Ask about <em>${esc(t.name)}.</em></h2><p>Which streets, which village, what the drive is like at 8 a.m. We’ll answer from experience.</p><div class="converse__people">${team.map(a => L.personLine(p, a)).join('')}</div></div>
  <div class="converse__form">${L.leadForm(p, { id: 'town-lead', intent: 'relocating', community: t.slug, submit: 'Ask about ' + t.name })}</div>
</div></section>`;
  write(path, L.page({ p, path, title: `${t.name}, MA · Town guide · The Oberdorfer Team`, description: t.lede, current: 'communities', body, jsonld: [L.ldPlace(t), L.ldCrumbs([['Home', ''], ['Towns', 'communities/'], [t.name, `communities/${t.slug}/`]])] }));
}

// ============================================================ AGENTS
function agentsIndex() {
  const path = 'site/agents/index.html', p = prefix(path);
  const body = `
<header class="pagehead"><div class="mapbox" aria-hidden="true"><div class="stage stage--cover">${terrainSvg(p, { cls: 'terrain--quiet', water: false })}</div></div><div class="wrap pagehead__inner">${crumbs(p, [['Home', 'site/'], ['The Team', '']])}<h1>One team, <em>by name.</em></h1><p class="lede">A small team on purpose. You’ll always know who is handling your move, and you can reach them directly.</p></div></header>
<section class="section"><div class="wrap">
  <ul class="roster">${agents.map(a => `<li class="rise">${frame(p, { kind: 'people', code: a.portrait.code, direction: a.portrait.direction, ar: '4 / 5', alt: `Portrait of ${a.name} to come` })}
    <div class="roster__name"><h2><a href="${p}site/agents/${a.slug}/">${esc(a.name)}</a></h2><p class="roster__role">${esc(a.role)}${a.example ? ' <span class="synthetic">Example profile</span>' : ''}</p><p class="meta">${esc(a.license)}</p><p class="roster__areas">${a.areas.map(s => `<a class="town" href="${p}site/communities/${s}/">${L.town(s).name}</a>`).join('')}</p></div>
    <div class="roster__intro"><p>${esc(a.intro)}</p><p style="margin-top:1rem;display:flex;gap:1.25rem;flex-wrap:wrap;font-family:var(--f-sans);font-size:1rem"><a class="link-arrow" href="${p}site/agents/${a.slug}/">${esc(a.first)}’s page ${icon(p, 'arrow')}</a><a href="tel:${a.phone.replace(/\D/g, '')}">${esc(a.phone)}</a></p></div></li>`).join('')}</ul>
  <div class="attr-line" style="margin-top:var(--s-7)">${L.markSvg('')}<span>${esc(settings.attribution.footer)}</span></div>
</div></section>`;
  write(path, L.page({ p, path, title: 'The Team · The Oberdorfer Team', description: 'Meet Brandon and Kait Oberdorfer and the agents of The Oberdorfer Team at REWAP Brokerage.', current: 'agents', body, jsonld: [...L.ldTeam(), ...agents.map(L.ldPerson)] }));
}

function agentPage(a) {
  const path = `site/agents/${a.slug}/index.html`, p = prefix(path);
  const mine = listings.filter(l => l.agent === a.slug);
  const writes = guides.filter(g => g.author === a.slug);
  const body = `
<div class="wrap">
  <header class="agenthead">
    ${crumbs(p, [['Home', 'site/'], ['The Team', 'site/agents/'], [a.name, '']])}
    ${frame(p, { kind: 'people', code: a.portrait.code, direction: a.portrait.direction, ar: '4 / 5', alt: `Portrait of ${a.name} to come`, cls: 'reveal' })}
    <div class="agenthead__text">
      <h1>${esc(a.name.split(' ')[0])} <em>${esc(a.name.split(' ').slice(1).join(' '))}</em></h1>
      <p class="agenthead__role"><b>${esc(a.role)}</b> · The Oberdorfer Team${a.example ? ' · <span class="synthetic">Example profile</span>' : ''}</p>
      <blockquote class="agenthead__quote">${esc(a.quote)}</blockquote>
      <div class="agenthead__actions"><a class="btn btn--route" href="#ask">${icon(p, 'message')} Talk with ${esc(a.first)}</a><a class="btn btn--line" href="tel:${a.phone.replace(/\D/g, '')}">${icon(p, 'phone')} ${esc(a.phone)}</a><a class="btn btn--line" href="mailto:${a.email}">${icon(p, 'mail')} Email</a></div>
    </div>
  </header>
  <section class="section comm-grid">
    <div class="comm-overview">${a.bio.map(x => `<p>${esc(x)}</p>`).join('')}<p class="meta" style="font-family:var(--f-sans);font-size:.875rem;margin-top:1.5rem"><span class="synthetic">${esc(a.bioStatus)}</span></p></div>
    <aside class="comm-aside stack" style="--flow:2rem">
      <dl class="kv"><dt>Areas</dt><dd>${a.areas.map(s => `<a href="${p}site/communities/${s}/">${L.town(s).name}</a>`).join(', ')}</dd><dt>Focus</dt><dd>${a.specialties.map(esc).join('<br>')}</dd><dt>License</dt><dd>${a.credentials.map(esc).join('<br>')}</dd>${a.social.length ? `<dt>Elsewhere</dt><dd>${a.social.map(s => `<a href="${s.url}">${esc(s.label)}</a>`).join(' · ')}</dd>` : ''}</dl>
      <div class="minimap" style="aspect-ratio:4/3"><div class="mapbox"><div class="stage stage--cover">${terrainSvg(p, { aspect: 'xMidYMid meet', cls: 'terrain--quiet' })}${terrain.towns.map(tt => `<span class="town-lbl town halo" style="--x:${tt.x};--y:${tt.y};${a.areas.includes(tt.slug) ? 'color:var(--route);font-weight:800' : 'opacity:.55'}">${tt.name}</span>`).join('')}${a.areas.map(s => { const tt = L.tpos(s); return `<span class="here" style="--x:${tt.x};--y:${tt.y};width:12px;height:12px"></span>`; }).join('')}</div></div></div>
      <div class="attr-line">${L.markSvg('')}<span>${esc(settings.attribution.agent.replace('{name}', a.name))}</span></div>
    </aside>
  </section>
  ${mine.length ? `<section class="prop-section" aria-labelledby="h-al"><h2 id="h-al">${esc(a.first)}’s listings <span class="synthetic">Sample listings</span></h2>${L.rowsTable(p, mine, { caption: `${a.name}'s listings` })}</section>` : ''}
  ${writes.length ? `<section class="prop-section" aria-labelledby="h-aw"><h2 id="h-aw">Written by ${esc(a.first)}</h2><ul class="notes__list" style="grid-column:auto">${writes.map(g => `<li><h3><a href="${p}site/field-guide/${g.slug}/">${esc(g.title)}</a></h3><p class="meta">${esc(g.category)}</p></li>`).join('')}</ul></section>` : ''}
  <section class="prop-section" id="ask" aria-labelledby="h-ask" style="display:grid;grid-template-columns:repeat(12,minmax(0,1fr));gap:var(--gutter)">
    <div style="grid-column:1/span 5"><h2 id="h-ask" style="font:800 var(--t-h2)/1.02 var(--f-serif)">Talk with <em style="font-weight:400">${esc(a.first)}.</em></h2><p class="voice" style="font-size:1.125rem;margin-top:1rem">Your note goes to ${esc(a.first)} directly. If ${esc(a.first)} is away, a teammate will reply and tell you so.</p></div>
    <div style="grid-column:7/span 6">${L.leadForm(p, { id: 'agent-lead', agentSlug: a.slug, submit: 'Send to ' + a.first })}</div>
  </section>
</div>`;
  write(path, L.page({ p, path, title: `${a.name} · ${a.role} · The Oberdorfer Team`, description: a.intro, current: 'agents', body, jsonld: [L.ldPerson(a), L.ldCrumbs([['Home', ''], ['The Team', 'agents/'], [a.name, `agents/${a.slug}/`]])] }));
}

// ============================================================ FIELD GUIDE
function guideIndex() {
  const path = 'site/field-guide/index.html', p = prefix(path);
  const cats = [...new Set(guides.map(g => g.category))];
  const [lead, ...rest] = guides;
  const body = `
<header class="pagehead"><div class="wrap pagehead__inner">${crumbs(p, [['Home', 'site/'], ['Field Guide', '']])}<h1>The <em>Field Guide</em></h1><p class="lede">Notes on Central Massachusetts towns, houses and the process of moving, written by the team who walks them.</p><div class="pagehead__aside"><p class="meta">${cats.map(esc).join(' · ')}</p></div></div></header>
<section class="section"><div class="wrap">
  <div class="notes"><article class="notes__lead">${frame(p, { kind: 'place', code: lead.photo.code, direction: lead.photo.direction, ar: '3 / 2', seed: 4, cls: 'reveal' })}<h3><a href="${p}site/field-guide/${lead.slug}/">${esc(lead.title)}</a></h3><p>${esc(lead.dek)}</p><p class="byline"><b>${esc(L.agent(lead.author).name)}</b><span>${esc(lead.category)}</span><time datetime="${lead.date}">${L.fmtDate(lead.date)}</time></p></article>
  <ul class="notes__list">${rest.map(g => `<li><h3><a href="${p}site/field-guide/${g.slug}/">${esc(g.title)}</a></h3><p class="meta">${esc(g.dek)}</p><p class="byline"><b>${esc(L.agent(g.author).name)}</b><span>${esc(g.category)}</span><time datetime="${g.date}">${L.fmtDate(g.date)}</time></p></li>`).join('')}</ul></div>
</div></section>`;
  write(path, L.page({ p, path, title: 'Field Guide · The Oberdorfer Team', description: 'Local guides, architecture notes and plain-language buying and selling advice for Central Massachusetts.', current: 'field-guide', body }));
}

function guidePage(g) {
  const path = `site/field-guide/${g.slug}/index.html`, p = prefix(path);
  const a = L.agent(g.author);
  const body = `
<div class="wrap">
  <header class="story-hero" style="padding-bottom:var(--s-6)">${crumbs(p, [['Home', 'site/'], ['Field Guide', 'site/field-guide/'], [g.title, '']])}<h1 style="font-size:var(--t-h1)">${esc(g.title)}</h1><p>${esc(g.dek)}</p></header>
  ${frame(p, { kind: g.photo.code.startsWith('PE') ? 'people' : g.photo.code.startsWith('PR') ? 'property' : 'place', code: g.photo.code, direction: g.photo.direction, ar: '21 / 9', seed: 7 })}
  <div class="article section">
    <aside class="article__aside" style="grid-column:1/span 2;grid-row:1"><p class="byline" style="display:grid;gap:.4rem"><span class="label">${esc(g.category)}</span><b>${esc(a.name)}</b><span>${esc(a.role)}</span><time datetime="${g.date}">${L.fmtDate(g.date)}</time></p></aside>
    <div class="article__body">${g.body.map(([k, v]) => k === 'p' ? `<p>${esc(v)}</p>` : k === 'h2' ? `<h2>${esc(v)}</h2>` : `<p class="note">${esc(v)}</p>`).join('')}</div>
    <aside class="article__aside stack" style="--flow:1.5rem">${g.towns.map(s => `<a class="link-arrow" href="${p}site/communities/${s}/">The ${L.town(s).name} sheet ${icon(p, 'arrow')}</a>`).join('<br>')}<div class="askcard"><div class="askcard__agent">${frame(p, { kind: 'people', code: a.portrait.code, direction: a.portrait.direction, ar: '1 / 1', bare: true, initials: L.initials(a) })}<div><b>${esc(a.name)}</b><span>Wrote this</span></div></div><div class="askcard__body"><a class="btn btn--line btn--small" href="${p}site/agents/${a.slug}/#ask">Ask ${esc(a.first)} a question</a></div></div></aside>
  </div>
</div>`;
  write(path, L.page({ p, path, title: `${g.title} · Field Guide · The Oberdorfer Team`, description: g.dek, current: 'field-guide', body, jsonld: [L.ldArticle(g), L.ldPerson(a)] }));
}

// ============================================================ JOURNEY PAGES
function journeyPage(key) {
  const path = `site/${key}/index.html`, p = prefix(path);
  const j = journeys[key];
  const selling = key === 'selling';
  const body = `
<header class="pagehead"><div class="mapbox" aria-hidden="true"><div class="stage stage--cover">${terrainSvg(p, { cls: 'terrain--quiet', water: false })}</div></div><div class="wrap pagehead__inner">${crumbs(p, [['Home', 'site/'], [selling ? 'Selling' : 'Buying', '']])}<h1>${selling ? 'Selling, <em>with a plan.</em>' : 'Buying, <em>one stop at a time.</em>'}</h1><p class="lede">${esc(j.intro)}</p><div class="pagehead__aside"><a class="btn btn--route" href="${selling ? '#consult' : p + 'site/search/'}">${selling ? 'Talk about selling' : 'Start a search'} ${icon(p, 'arrow')}</a></div></div></header>
<section class="section"><div class="wrap">${L.journeyBlock(p, key, { id: `${key}-route`, anchors: true })}</div></section>
<section class="section" style="border-top:var(--neatline) solid var(--ink);padding-top:0"><div class="wrap">
  <ol class="journey-list">${j.stations.map((s, i) => `<li id="${s.id}"><h3><span class="station__n">${String(i + 1).padStart(2, '0')} / ${String(j.stations.length).padStart(2, '0')}</span>${esc(s.name)}</h3><p class="what">${esc(s.what)}</p><p class="us"><b>Our part</b>${esc(s.us)}</p>${s.action || s.guide ? `<div class="acts">${s.action ? `<a class="link-arrow" href="${p}site/${s.action.href}">${esc(s.action.label)} ${icon(p, 'arrow')}</a>` : ''}${s.guide ? `<a href="${p}site/field-guide/${s.guide}/">Read: ${esc(guides.find(g => g.slug === s.guide).title)}</a>` : ''}</div>` : ''}</li>`).join('')}</ol>
</div></section>
${selling ? `<section class="section on-forest" id="consult" aria-labelledby="h-consult"><div class="wrap converse">
  <div class="converse__head"><h2 id="h-consult">A pricing <em style="color:var(--forest-tint)">conversation.</em></h2><p>No instant online estimate. We walk through your house and your street, then sit down with recent sales and explain a range, with our reasoning. There’s no obligation and no pressure to list.</p>
  <ul class="getting" style="margin-top:var(--s-6);border-color:var(--paper)"><li style="border-color:oklch(97.6% 0.006 135 / .2)">A walk-through, 45 minutes to an hour</li><li style="border-color:oklch(97.6% 0.006 135 / .2)">Comparable sales, explained in plain terms</li><li style="border-color:oklch(97.6% 0.006 135 / .2)">A preparation list and a realistic timeline</li></ul></div>
  <div class="converse__form">${L.leadForm(p, { id: 'consult-form', intent: 'selling', showIntent: false, submit: 'Request a pricing conversation', onForest: true, messageLabel: 'Anything we should know?', messagePlaceholder: 'Timing, condition, what you’re hoping for…', extra: `<div class="field"><label for="consult-addr">Property address</label><input id="consult-addr" name="address" autocomplete="street-address" placeholder="Street, town"></div>` })}</div>
</div></section>` : `<section class="section" style="background:var(--woodland);border-top:var(--neatline) solid var(--ink)"><div class="wrap converse"><div class="converse__head"><h2>Planning <em>a purchase?</em></h2><p>Tell us where you are on the route. We’ll meet you there.</p><div class="converse__people">${agents.slice(0, 2).map(a => L.personLine(p, a)).join('')}</div></div><div class="converse__form">${L.leadForm(p, { id: 'buy-lead', intent: 'buying', submit: 'Talk about buying' })}</div></div></section>`}`;
  write(path, L.page({ p, path, title: `${selling ? 'Selling' : 'Buying'} a home in Central Massachusetts · The Oberdorfer Team`, description: j.intro, current: key, body }));
}

function relocating() {
  const path = 'site/relocating/index.html', p = prefix(path);
  const body = `
<header class="pagehead"><div class="mapbox" aria-hidden="true"><div class="stage stage--cover">${terrainSvg(p, { aspect: 'xMidYMid meet', draw: true })}${townPins(p)}${waterLabels()}</div></div><div class="wrap pagehead__inner" style="pointer-events:none">${crumbs(p, [['Home', 'site/'], ['Relocating', '']])}<h1 class="halo">New to <em>the sheet?</em></h1><p class="lede halo">Central Massachusetts is a region of distinct towns around one city. Here’s how to read it before you visit.</p></div></header>
<section class="section"><div class="wrap comm-grid">
  <div class="comm-overview"><p>Worcester sits at the middle of everything on this map. The towns around it each have their own center and their own character, and they differ more than the distances suggest: a fifteen-minute drive can take you from three-deckers to stone walls and two-acre lots.</p><p>Most people relocating here make the same three decisions in this order: how they’ll get to work, how much space they want, and what kind of street they want to live on. The towns sort themselves out from there.</p></div>
  <aside class="comm-aside"><h2 class="label" style="color:var(--ink);margin-bottom:.75rem">Getting around the region</h2><ul class="getting"><li>MBTA Worcester/Framingham Line from Worcester and Grafton toward Boston</li><li>The Mass Pike, I-290, I-190, I-395 and Route 146</li><li>Worcester Regional Airport (ORH)</li></ul></aside>
</div></section>
<section class="section" style="background:var(--paper-deep);border-block:var(--neatline) solid var(--ink)"><div class="wrap">
  <div class="sec-head"><h2>Narrow it <em>by how you live</em></h2><p>Choose what matters. These describe housing and location, never who lives somewhere.</p></div>
  <div class="lifefirst" data-lifefirst><div class="chips" role="group" aria-label="What matters to you">${journeys.attributes.map(a => `<button class="chip" type="button" aria-pressed="false" data-attr="${a.id}">${sym(a.symbol)}${esc(a.label)}</button>`).join('')}</div><p class="lifefirst__status" aria-live="polite" data-lifefirst-status>Showing all six towns.</p></div>
  <div class="sheetindex" data-sheetindex>${towns.map(t => { const tp = L.tpos(t.slug); return `<a class="sheetindex__cell" href="${p}site/communities/${t.slug}/" data-attrs="${t.attributes.join(' ')}"><div aria-hidden="true">${terrainSvg(p, { view: cropView(tp.x, tp.y, 480, 300), cls: 'terrain--quiet' })}</div><span class="sheetindex__name town halo">${t.name}</span>${icon(p, 'arrow-ne', 'arrow')}<span class="sheetindex__label"><span class="sheetindex__lede">${esc(t.lede)}</span></span></a>`; }).join('')}</div>
</div></section>
<section class="section"><div class="wrap"><div class="sec-head"><h2>Reading <em>for the move</em></h2></div><ul class="notes__list" style="grid-column:auto">${guides.filter(g => ['Relocating', 'Buying', 'Around here'].includes(g.category)).map(g => `<li><h3><a href="${p}site/field-guide/${g.slug}/">${esc(g.title)}</a></h3><p class="meta">${esc(g.category)} · ${esc(g.dek)}</p></li>`).join('')}</ul></div></section>
<section class="section" style="background:var(--woodland);border-top:var(--neatline) solid var(--ink)" aria-labelledby="h-plan"><div class="wrap converse"><div class="converse__head"><h2 id="h-plan">Planning <em>a move?</em></h2><p>Tell us where you’re coming from and what your days look like. Kait plans relocation tours so three towns fit in one afternoon.</p><div class="converse__people">${L.personLine(p, agents[1])}</div></div><div class="converse__form">${L.leadForm(p, { id: 'reloc-lead', intent: 'relocating', agentSlug: 'kait-oberdorfer', submit: 'Plan a relocation tour', extra: `<div class="field"><label for="reloc-from">Moving from</label><input id="reloc-from" name="movingFrom" placeholder="City, state"></div>` })}</div></div></section>`;
  write(path, L.page({ p, path, title: 'Relocating to Central Massachusetts · The Oberdorfer Team', description: 'Orientation for people moving to Worcester and the surrounding towns.', current: 'relocating', body, scripts: ['home.js'] }));
}

function contact() {
  const path = 'site/contact/index.html', p = prefix(path);
  const body = `
<section class="section" style="background:var(--woodland)"><div class="wrap converse">
  <div class="converse__head">${crumbs(p, [['Home', 'site/'], ['Talk with us', '']])}<h1 style="font:800 var(--t-h1)/0.98 var(--f-serif);letter-spacing:-.03em">Talk with <em style="font-style:italic;font-weight:400;display:block;color:var(--forest)">the team.</em></h1><p style="margin-top:var(--s-5);font:400 1.125rem/1.55 var(--f-serif);max-width:34ch">One short note is enough. Tell us what you’re thinking about and who you’d like to hear from; a real person replies, usually the same day.</p>
  <div class="converse__people">${agents.slice(0, 2).map(a => L.personLine(p, a)).join('')}</div>
  <p class="meta" style="margin-top:var(--s-6)">Team line <a href="tel:${settings.team.phone.replace(/\D/g, '')}">${settings.team.phone}</a> · <a href="mailto:${settings.team.email}">${settings.team.email}</a></p></div>
  <div class="converse__form">${L.leadForm(p, { id: 'contact-lead', intent: 'advice', extra: `<div class="field"><label for="contact-who">Who would you like to hear from?</label><select id="contact-who" name="preferredAgent"><option value="">Whoever is best placed</option>${agents.map(a => `<option value="${a.slug}">${esc(a.name)}</option>`).join('')}</select></div>` })}</div>
</div></section>`;
  write(path, L.page({ p, path, title: 'Talk with us · The Oberdorfer Team', description: 'Reach Brandon, Kait and the team directly.', current: 'contact', body }));
}

function saved() {
  const path = 'site/saved/index.html', p = prefix(path);
  const data = listings.map(l => ({ id: l.id, address: l.address, townName: L.town(l.town).name, price: l.price, beds: l.beds, baths: l.baths, sqft: l.sqft, status: l.status, href: L.listingHref(p, l) }));
  const body = `
<header class="pagehead"><div class="wrap pagehead__inner">${crumbs(p, [['Home', 'site/'], ['Saved', '']])}<h1>Saved <em>homes</em></h1><p class="lede">Homes you’ve marked, and searches you’ve saved. Kept on this device; create an account later to sync and share with someone you’re moving with.</p></div></header>
<section class="section"><div class="wrap">
  <div data-saved-list></div>
  <div class="empty" data-saved-empty hidden><h3>Nothing saved yet.</h3><p>Tap the heart on any home to keep it here.</p><a class="btn btn--route" href="${p}site/search/">Search homes ${icon(p, 'arrow')}</a></div>
  <h2 class="label" style="color:var(--ink);margin:var(--s-8) 0 1rem">Saved searches</h2><ul class="notes__list" data-saved-searches style="grid-column:auto"></ul>
</div></section>
<script type="application/json" id="listings-data">${JSON.stringify(data)}</script>`;
  write(path, L.page({ p, path, title: 'Saved homes · The Oberdorfer Team', description: 'Your saved homes and searches.', body, scripts: ['saved.js'] }));
}

function simple(slug, title, html) {
  const path = `site/${slug}/index.html`, p = prefix(path);
  write(path, L.page({ p, path, title: `${title} · The Oberdorfer Team`, description: title, body: `<header class="pagehead"><div class="wrap pagehead__inner">${crumbs(p, [['Home', 'site/'], [title, '']])}<h1>${esc(title)}</h1></div></header><section class="section"><div class="wrap"><div class="article__body" style="grid-column:auto;max-width:66ch">${html}</div></div></section>` }));
}

home(); search(); listings.forEach(property); communityIndex(); towns.forEach(community); agentsIndex(); agents.forEach(agentPage);
guideIndex(); guides.forEach(guidePage); journeyPage('buying'); journeyPage('selling'); relocating(); contact(); saved();
simple('accessibility', 'Accessibility', `<p>We aim to meet WCAG 2.2 AA across this site: keyboard access to search, filters, galleries and forms; visible focus; sufficient contrast; and reduced-motion support.</p><p>If anything here doesn’t work for you, call ${settings.team.phone} or email ${settings.team.email} and we’ll help directly and fix it.</p>`);
simple('privacy', 'Privacy', `<p>[Privacy policy to be drafted with counsel, covering Massachusetts requirements, CRM processing (Follow Up Boss), analytics and cookies.]</p><p>This concept stores saved homes and searches only in your browser’s local storage.</p>`);
console.log('site built:', 6 + listings.length + towns.length + agents.length + guides.length + 7, 'pages');
