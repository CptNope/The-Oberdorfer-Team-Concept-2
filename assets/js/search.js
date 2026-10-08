/* Property search: one dataset, two modes (Search = fast rows + map, Discover = editorial frames).
   Vendor-neutral: in production `data` comes from the IDX adapter's normalized JSON, not from the vendor's widget. */
(() => {
  const { $, $$, store, toast, root } = window.OBT;
  const data = JSON.parse($('#listings-data').textContent);
  const layout = $('[data-search-layout]'), form = $('[data-search-form]');
  const aside = $('.filters'), dialog = $('[data-filter-dialog]');
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const money = n => '$' + n.toLocaleString('en-US');
  const baths = b => (b % 1 ? `${Math.floor(b)}½` : b);
  const icon = id => `<svg class="i i-${id}" aria-hidden="true" focusable="false"><use href="${root}assets/icons.svg#i-${id}"/></svg>`;
  const facts = l => `<p class="facts"><span>${l.beds}<abbr title="bedrooms"> bd</abbr></span><span>${baths(l.baths)}<abbr title="bathrooms"> ba</abbr></span><span>${l.sqft.toLocaleString('en-US')}<abbr title="square feet"> sq ft</abbr></span>${l.lot ? `<span>${l.lot}<abbr title="acres"> ac</abbr></span>` : ''}</p>`;
  const fav = l => `<button class="fav" type="button" data-fav="${l.id}" aria-pressed="${window.OBT.favs.has(l.id)}" aria-label="Save ${esc(l.address)}">${icon('heart')}</button>`;
  const frameHtml = (ph, ar) => `<figure class="frame" data-kind="property"><div class="frame__plate" style="--ar:${ar}" role="img" aria-label="Photograph to come: ${esc(ph.direction)}"><span class="frame__crop frame__crop--tl"></span><span class="frame__crop frame__crop--tr"></span><span class="frame__crop frame__crop--bl"></span><span class="frame__crop frame__crop--br"></span><span class="frame__code" aria-hidden="true"><b>property</b>${ph.code}<span>${ar.replace(/\s/g, '')}</span></span><span class="frame__slot" aria-hidden="true"><span class="frame__direction">${esc(ph.direction)}</span></span></div></figure>`;

  /* ---- state <-> URL ---- */
  const params = new URLSearchParams(location.search);
  const setInputs = (name, values) => $$(`[name="${name}"]`).forEach(i => { if (i.type === 'checkbox' || i.type === 'radio') i.checked = values.includes(i.value); else i.value = values[0] || ''; });
  ['town', 'type', 'status', 'story', 'older', 'lot'].forEach(n => params.getAll(n).length && setInputs(n, params.getAll(n)));
  ['min', 'max', 'beds'].forEach(n => params.get(n) && setInputs(n, [params.get(n)]));
  if (params.get('q')) $('#sq').value = params.get('q');
  if (params.get('sort')) $('#sort').value = params.get('sort');
  let mode = params.get('mode') === 'discover' ? 'discover' : 'search';

  // mirror the two filter sets (sidebar & dialog)
  const mirror = src => $$(`[name="${src.name}"]`).forEach(i => { if (i === src) return; if (i.type === 'checkbox' || i.type === 'radio') { if (i.value === src.value) i.checked = src.checked; } else i.value = src.value; });
  const read = () => {
    const pick = n => $$(`.filters [name="${n}"]`).filter(i => i.checked).map(i => i.value);
    const val = n => $(`.filters [name="${n}"]`)?.value || ($$(`.filters [name="${n}"]`).find(i => i.checked)?.value ?? '');
    return { q: $('#sq').value.trim(), town: pick('town'), type: pick('type'), status: pick('status'), story: pick('story').length > 0, older: pick('older').length > 0, lot: pick('lot').length > 0, min: +val('min') || 0, max: +val('max') || 0, beds: +($$('.filters [name="beds"]').find(i => i.checked)?.value || 0), sort: $('#sort').value };
  };
  const writeUrl = s => {
    const u = new URLSearchParams();
    if (s.q) u.set('q', s.q); s.town.forEach(t => u.append('town', t)); s.type.forEach(t => u.append('type', t)); s.status.forEach(t => u.append('status', t));
    if (s.story) u.set('story', '1'); if (s.older) u.set('older', '1'); if (s.lot) u.set('lot', '1');
    if (s.min) u.set('min', s.min); if (s.max) u.set('max', s.max); if (s.beds) u.set('beds', s.beds); if (s.sort !== 'new') u.set('sort', s.sort); if (mode === 'discover') u.set('mode', 'discover');
    history.replaceState(null, '', `${location.pathname}${u.toString() ? '?' + u : ''}`);
  };
  const filter = s => {
    const q = s.q.toLowerCase();
    let out = data.filter(l =>
      (!q || `${l.address} ${l.townName} ${l.zip} ${l.style}`.toLowerCase().includes(q)) &&
      (!s.town.length || s.town.includes(l.town)) &&
      (!s.type.length || s.type.some(t => l.type.startsWith(t))) &&
      (!s.status.length || s.status.includes(l.status) || (s.status.includes('Open house') && l.openHouse)) &&
      (!s.story || l.story) && (!s.older || l.year < 1940) && (!s.lot || (l.lot || 0) >= 1) &&
      (!s.min || l.price >= s.min) && (!s.max || l.price <= s.max) && (!s.beds || l.beds >= s.beds));
    const by = { 'price-asc': (a, b) => a.price - b.price, 'price-desc': (a, b) => b.price - a.price, sqft: (a, b) => b.sqft - a.sqft, new: (a, b) => b.id.localeCompare(a.id) }[s.sort];
    out = out.sort(by);
    if (mode === 'discover' && s.sort === 'new') out = [...out.filter(l => l.story), ...out.filter(l => !l.story)];
    return out;
  };

  /* ---- render ---- */
  const tbody = $('[data-results-search] tbody');
  const disc = $('[data-results-discover] .discover');
  const pinsEl = $('[data-pins]');
  pinsEl.innerHTML = data.map(l => `<a class="mappin" href="${l.href}" data-pin="${l.id}" style="--x:${l.x};--y:${l.y}" aria-label="${esc(l.address)}, ${money(l.price)}">${money(Math.round(l.price / 1000))}k</a>`).join('');
  const render = () => {
    const s = read(), list = filter(s);
    writeUrl(s);
    $('[data-result-count]').textContent = `${list.length} home${list.length === 1 ? '' : 's'}${s.town.length === 1 ? ' in ' + data.find(d => d.town === s.town[0]).townName : ''}`;
    $('[data-empty]').hidden = list.length > 0;
    $('[data-results-search]').hidden = mode !== 'search' || !list.length;
    $('[data-results-discover]').hidden = mode !== 'discover' || !list.length;
    tbody.innerHTML = list.map(l => `<tr data-id="${l.id}"><td class="addr"><a href="${l.href}">${esc(l.address)}</a><span class="town">${esc(l.townName)}</span></td><td class="price-cell">${money(l.price)}</td><td class="facts-cell">${facts(l)}</td><td class="st hide-sm"><span class="status" data-status="${l.status}">${l.status}</span></td><td class="fav-cell">${fav(l)}</td></tr>`).join('');
    disc.innerHTML = list.map((l, i) => `<article class="discover__item">${fav(l)}<a href="${l.href}" style="text-decoration:none;color:inherit;display:block">${l.frames[i % 5 === 0 || i % 5 === 4 ? '16 / 10' : i % 5 === 1 ? '4 / 5' : '3 / 2']}</a>
      <div class="discover__meta"><a class="address" href="${l.href}">${l.story ? esc(l.storyTitle) : esc(l.address)}</a><span class="price">${money(l.price)}</span><span class="town meta" style="grid-column:1/-1">${l.story ? esc(l.address) + ' · ' : ''}${esc(l.townName)}</span>${l.story ? `<p class="discover__dek">${esc(l.storyDek)}</p>` : ''}${facts(l)}</div></article>`).join('');
    const ids = new Set(list.map(l => l.id));
    $$('.mappin', pinsEl).forEach(p => p.hidden = !ids.has(p.dataset.pin));
    if (typeof center === 'function' && mapEl) requestAnimationFrame(() => center(list));
    const n = s.town.length + s.type.length + s.status.length + (s.story ? 1 : 0) + (s.older ? 1 : 0) + (s.lot ? 1 : 0) + (s.min ? 1 : 0) + (s.max ? 1 : 0) + (s.beds ? 1 : 0);
    $$('[data-filter-count]').forEach(e => e.textContent = n ? `(${n})` : '');
    return { s, list };
  };
  /* simple collision pass: stack overlapping price pins upward */
  const declutter = () => {
    const pins = $$('.mappin', pinsEl).filter(p => !p.hidden);
    pins.forEach(p => p.style.setProperty('--dy', '0px'));
    const boxes = pins.map(p => ({ p, r: p.getBoundingClientRect() })).sort((a, b) => b.r.top - a.r.top);
    const placed = [];
    const wl = [...document.querySelectorAll('.searchmap .town-lbl')].find(l => l.textContent.trim().toLowerCase() === 'worcester');
    if (wl) { wl.classList.remove('is-up', 'is-left', 'is-right', 'is-off'); const r = wl.getBoundingClientRect(); placed.push({ left: r.left, right: r.right, top: r.top, bottom: r.bottom }); }
    boxes.forEach(b => {
      let dy = 0, r = { left: b.r.left, right: b.r.right, top: b.r.top, bottom: b.r.bottom };
      for (let k = 0; k < 6; k++) {
        const hit = placed.find(q => r.left < q.right + 4 && r.right > q.left - 4 && r.top < q.bottom + 2 && r.bottom > q.top - 2);
        if (!hit) break;
        const shift = r.bottom - hit.top + 4; dy -= shift; r = { ...r, top: r.top - shift, bottom: r.bottom - shift };
      }
      b.p.style.setProperty('--dy', `${dy}px`); placed.push(r);
    });
    const hits = lb => { const r = lb.getBoundingClientRect(); return placed.some(q => r.left < q.right + 2 && r.right > q.left - 2 && r.top < q.bottom + 2 && r.bottom > q.top - 2); };
    $$('.searchmap .town-lbl').forEach(lb => {
      if (lb === wl) return;
      lb.classList.remove('is-up', 'is-left', 'is-right', 'is-off');
      if (!hits(lb)) return;
      for (const c of ['is-up', 'is-left', 'is-right']) { lb.classList.add(c); if (!hits(lb)) return; lb.classList.remove(c); }
      if (lb.textContent.trim().toLowerCase() !== 'worcester') lb.classList.add('is-off');
    });
  };
  addEventListener('resize', () => requestAnimationFrame(declutter));
  /* pan: center the sheet on the listings, then drag or scroll to move */
  const mapEl = $('.searchmap');
  let lastList = data, off = { x: 0, y: 0 };
  /* fit the sheet to the current results; drag pans the sheet */
  const place = st => { st.style.left = off.x + 'px'; st.style.top = off.y + 'px'; };
  const center = (list = lastList) => {
    lastList = list; const st = $('.stage', mapEl); const cw = mapEl.clientWidth, ch = mapEl.clientHeight; if (!cw || !ch) return;
    const pts = list.length ? list : data;
    const x0 = Math.min(...pts.map(l => l.x)), x1 = Math.max(...pts.map(l => l.x)), y0 = Math.min(...pts.map(l => l.y)), y1 = Math.max(...pts.map(l => l.y));
    const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, bw = Math.max(0.25, x1 - x0), bh = Math.max(0.25, y1 - y0);
    const sw = Math.min((cw - 140) / bw, ((ch - 140) * 1.6) / bh), sh = sw / 1.6;
    st.style.width = sw + 'px'; st.style.height = sh + 'px';
    off = { x: cw / 2 - cx * sw, y: ch / 2 - cy * sh };
    if (sh >= ch) off.y = Math.min(0, Math.max(ch - sh, off.y)); else off.y = (ch - sh) / 2;
    place(st); requestAnimationFrame(declutter);
  };
  requestAnimationFrame(() => center()); addEventListener('resize', () => center());
  let drag = null;
  mapEl.addEventListener('pointerdown', e => { if (e.target.closest('.mappin')) return; drag = { x: e.clientX, y: e.clientY, ox: off.x, oy: off.y }; mapEl.classList.add('is-dragging'); mapEl.setPointerCapture(e.pointerId); });
  mapEl.addEventListener('pointermove', e => { if (!drag) return; off = { x: drag.ox + e.clientX - drag.x, y: drag.oy + e.clientY - drag.y }; place($('.stage', mapEl)); });
  mapEl.addEventListener('pointerup', () => { drag = null; mapEl.classList.remove('is-dragging'); requestAnimationFrame(declutter); });
  const setMode = m => { mode = m; layout.dataset.mode = m; $$('[data-mode-btn]').forEach(b => b.setAttribute('aria-pressed', b.dataset.modeBtn === m)); render(); };

  /* ---- events ---- */
  document.addEventListener('change', e => { if (['sf', 'sfd'].includes(e.target.getAttribute('form')) || e.target.id === 'sort') { if (e.target.name) mirror(e.target); render(); } });
  $('#sq').addEventListener('input', () => { clearTimeout(window.__qt); window.__qt = setTimeout(render, 160); });
  form.addEventListener('submit', e => { e.preventDefault(); render(); });
  $$('[data-mode-btn]').forEach(b => b.addEventListener('click', () => setMode(b.dataset.modeBtn)));
  $$('[data-clear]').forEach(b => b.addEventListener('click', () => { $$('[form="sf"],[form="sfd"]').forEach(i => { if (i.type === 'checkbox') i.checked = false; else if (i.type === 'radio') i.checked = i.value === ''; else i.value = ''; }); $('#sq').value = ''; render(); }));
  // row <-> pin highlighting
  const hot = (id, on) => { $(`[data-pin="${id}"]`)?.classList.toggle('is-hot', on); };
  tbody.addEventListener('pointerover', e => { const r = e.target.closest('tr'); if (r) hot(r.dataset.id, true); });
  tbody.addEventListener('pointerout', e => { const r = e.target.closest('tr'); if (r) hot(r.dataset.id, false); });
  tbody.addEventListener('focusin', e => { const r = e.target.closest('tr'); if (r) hot(r.dataset.id, true); });
  tbody.addEventListener('focusout', e => { const r = e.target.closest('tr'); if (r) hot(r.dataset.id, false); });
  // mobile map/list
  const mt = $('[data-map-toggle]');
  mt.addEventListener('click', () => { const map = layout.dataset.view !== 'map'; requestAnimationFrame(() => center()); layout.dataset.view = map ? 'map' : 'list'; mt.setAttribute('aria-pressed', map); mt.querySelector('span').textContent = map ? 'List' : 'Map'; mt.querySelector('use').setAttribute('href', `${root}assets/icons.svg#i-${map ? 'list' : 'map'}`); });
  // filters dialog
  $$('[data-filters-open]').forEach(b => b.addEventListener('click', () => dialog.showModal()));
  $$('[data-filters-close]').forEach(b => b.addEventListener('click', () => dialog.close()));
  // save search
  const sd = $('[data-save-dialog]');
  const summary = s => [s.q && `“${s.q}”`, s.town.length && s.town.map(t => data.find(d => d.town === t).townName).join(', '), s.beds && `${s.beds}+ beds`, s.min && `from ${money(s.min)}`, s.max && `up to ${money(s.max)}`, s.type.length && s.type.join(', '), s.status.length && s.status.join(', '), s.story && 'with a story', s.older && 'pre-1940', s.lot && '1+ acre'].filter(Boolean).join(' · ') || 'All homes';
  $('[data-save-search]').addEventListener('click', () => { const s = read(); $('[data-save-summary]').textContent = `Search: ${summary(s)}`; $('#ss-name').value = summary(s).slice(0, 48); sd.showModal(); });
  $$('[data-save-close]').forEach(b => b.addEventListener('click', () => sd.close()));
  $('[data-save-form]').addEventListener('submit', e => {
    e.preventDefault();
    const list = store.get('obt:searches', []);
    list.unshift({ name: $('#ss-name').value || summary(read()), query: location.search, email: $('#ss-email').value, created: new Date().toISOString() });
    store.set('obt:searches', list.slice(0, 20)); sd.close();
    toast(`Search saved. <a href="${root}site/saved/">See saved searches</a>`);
  });

  setMode(mode);
})();
