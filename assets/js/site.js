/* The Oberdorfer Team — shared behavior. Progressive enhancement: every page works without this file. */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const root = document.body.dataset.root || '';
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* storage unavailable: degrade silently */ } },
  };
  window.OBT = { store, $, $$, root };

  /* header state */
  const onScroll = () => document.body.classList.toggle('is-scrolled', scrollY > 8);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* mobile menu (native dialog: focus trap + Esc for free) */
  const menu = $('[data-menu]');
  $('[data-menu-open]')?.addEventListener('click', () => menu?.showModal());
  $$('[data-menu-close]').forEach(b => b.addEventListener('click', () => menu?.close()));

  /* toast */
  const toastEl = $('[data-toast]'); let toastT;
  const toast = html => { if (!toastEl) return; toastEl.innerHTML = html; toastEl.classList.add('is-on'); clearTimeout(toastT); toastT = setTimeout(() => toastEl.classList.remove('is-on'), 3200); };
  window.OBT.toast = toast;

  /* favorites */
  const FK = 'obt:favs';
  const favs = new Set(store.get(FK, []));
  const paintFavs = () => {
    $$('[data-fav]').forEach(b => b.setAttribute('aria-pressed', favs.has(b.dataset.fav) ? 'true' : 'false'));
    $$('[data-fav-count]').forEach(c => { c.textContent = favs.size; c.dataset.count = favs.size; });
  };
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-fav]'); if (!b) return;
    e.preventDefault();
    const id = b.dataset.fav;
    if (favs.has(id)) { favs.delete(id); toast('Removed from saved homes'); }
    else { favs.add(id); toast(`Saved. <a href="${root}site/saved/">See saved homes</a>`); }
    store.set(FK, [...favs]); paintFavs();
    document.dispatchEvent(new CustomEvent('obt:favs', { detail: [...favs] }));
  });
  paintFavs();
  window.OBT.favs = favs;

  /* share */
  $$('[data-share]').forEach(b => b.addEventListener('click', async () => {
    try { if (navigator.share) await navigator.share({ title: document.title, url: location.href }); else { await navigator.clipboard.writeText(location.href); toast('Link copied'); } } catch { /* cancelled */ }
  }));

  /* reveal: content is visible by default; motion only when JS + IO + motion allowed */
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealEls = $$('.rise, .reveal');
  if (!reduce && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } }), { rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(el => io.observe(el));
  } else revealEls.forEach(el => el.classList.add('is-in'));

  /* journey profiles: tabs move a marker along the elevation line */
  $$('[data-journey]').forEach(j => {
    const tabs = $$('.station', j), panel = $('.profile__panel', j), marker = $('.profile__marker', j);
    const xs = marker?.dataset.xs.split(',').map(Number), ys = marker?.dataset.ys.split(',').map(Number);
    const select = (i, focus) => {
      tabs.forEach((t, k) => { t.setAttribute('aria-selected', k === i); t.tabIndex = k === i ? 0 : -1; });
      const tpl = $(`template[data-i="${i}"]`, panel);
      $$(':scope > :not(template)', panel).forEach(n => n.remove());
      panel.append(tpl.content.cloneNode(true));
      panel.setAttribute('aria-labelledby', tabs[i].id);
      if (marker) { marker.setAttribute('cx', xs[i]); marker.setAttribute('cy', ys[i]); }
      if (focus) tabs[i].focus();
    };
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => select(i));
      t.addEventListener('keydown', e => {
        const n = tabs.length; let k = null;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') k = (i + 1) % n;
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') k = (i - 1 + n) % n;
        if (e.key === 'Home') k = 0; if (e.key === 'End') k = n - 1;
        if (k !== null) { e.preventDefault(); select(k, true); }
      });
    });
  });

  /* generic tab pairs (home: buying / selling) */
  const routeTabs = $$('[data-route-tab]');
  routeTabs.forEach((t, i) => {
    const go = (k, focus) => { routeTabs.forEach((x, j) => { x.setAttribute('aria-selected', j === k); x.tabIndex = j === k ? 0 : -1; document.getElementById(x.getAttribute('aria-controls')).hidden = j !== k; }); if (focus) routeTabs[k].focus(); };
    t.addEventListener('click', () => go(i));
    t.addEventListener('keydown', e => { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); go((i + 1) % routeTabs.length, true); } });
  });

  /* lead forms: context metadata + validation + Follow Up Boss payload preview */
  const params = new URLSearchParams(location.search);
  const UTM = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
  let firstTouch = (() => { try { return JSON.parse(sessionStorage.getItem('obt:utm') || 'null'); } catch { return null; } })();
  if (!firstTouch && UTM.some(k => params.get(k))) { firstTouch = Object.fromEntries(UTM.map(k => [k, params.get(k) || ''])); try { sessionStorage.setItem('obt:utm', JSON.stringify(firstTouch)); } catch {} }
  const ctx = (() => { try { return JSON.parse($('#page-context')?.textContent || '{}'); } catch { return {}; } })();
  const typeFor = (intent, hasListing) => hasListing ? 'Property Inquiry' : intent === 'selling' ? 'Seller Inquiry' : intent === 'showing' ? 'Property Inquiry' : 'General Inquiry';

  $$('[data-lead]').forEach(form => {
    form.sourcePage.value = location.pathname;
    form.utm.value = firstTouch ? JSON.stringify(firstTouch) : '';
    const pi = params.get('intent'); if (pi) { const r = form.querySelector(`input[name="intent"][value="${pi}"]`); if (r) r.checked = true; }
    const pc = params.get('community'); if (pc && !form.community.value) form.community.value = pc;
    const err = (name, msg) => { const f = form.elements[name]?.closest('.field'); if (!f) return; const e = f.querySelector('.error'); if (msg) { f.setAttribute('data-invalid', ''); if (e) e.textContent = msg; form.elements[name].setAttribute('aria-invalid', 'true'); } else { f.removeAttribute('data-invalid'); if (e) e.textContent = ''; form.elements[name].removeAttribute('aria-invalid'); } };
    form.addEventListener('submit', e => {
      e.preventDefault();
      const d = Object.fromEntries(new FormData(form));
      let ok = true;
      if (!d.firstName?.trim()) { err('firstName', 'Please tell us your first name.'); ok = false; } else err('firstName');
      const emailOk = !d.email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email);
      if (!d.email && !d.phone) { err('email', 'Add an email or a phone number so we can reply.'); ok = false; }
      else if (!emailOk) { err('email', 'That email address looks incomplete.'); ok = false; } else err('email');
      if (!ok) { form.querySelector('[aria-invalid="true"]')?.focus(); return; }
      const listing = ctx.listing && d.listing ? ctx.listing : null;
      const utm = d.utm ? JSON.parse(d.utm) : {};
      const payload = {
        source: location.hostname || 'oberdorferteam.com', system: 'Oberdorfer Team website',
        type: typeFor(d.intent, !!listing),
        message: [d.message, d.address && `Property: ${d.address}`, d.movingFrom && `Moving from: ${d.movingFrom}`, d.timeframe && `Timeframe: ${d.timeframe}`].filter(Boolean).join('\n'),
        person: { firstName: d.firstName, lastName: d.lastName || undefined, emails: d.email ? [{ value: d.email }] : [], phones: d.phone ? [{ value: d.phone }] : [], tags: ['Website', d.intent, d.community].filter(Boolean) },
        property: listing ? { street: listing.street, city: listing.city, state: 'MA', code: listing.zip, mlsNumber: listing.mls, price: listing.price, url: location.href } : undefined,
        campaign: utm.utm_source ? { source: utm.utm_source, medium: utm.utm_medium, campaign: utm.utm_campaign, term: utm.utm_term, content: utm.utm_content } : undefined,
        pageUrl: location.href,
        'x-routing': { agent: d.preferredAgent || d.agent || null, rule: (d.preferredAgent || d.agent) ? 'route-to-agent' : 'team-lead-flow', community: d.community || null, intent: d.intent },
      };
      const who = ctx.agentName || (d.agent ? d.agent.split('-')[0].replace(/^./, c => c.toUpperCase()) : 'the team');
      $('.form__result', form).innerHTML = `<div class="form__success" tabindex="-1"><h3>Thanks, ${d.firstName.replace(/[<>&]/g, '')}. It’s on its way.</h3><p>${who === 'the team' ? 'Brandon or Kait' : who} will reply personally, usually the same day. This concept doesn’t send anything yet; below is exactly what the live site would hand to Follow Up Boss.</p><details class="payload"><summary>Show the CRM payload</summary><pre>${JSON.stringify(payload, null, 2).replace(/[<>&]/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]))}</pre></details></div>`;
      $('.form__success', form).focus();
    });
  });
})();
