/* Home & town index: the signature interaction (town lift) and life-first discovery. */
(() => {
  const { $, $$ } = window.OBT || { $: (s, r = document) => r.querySelector(s), $$: (s, r = document) => [...r.querySelectorAll(s)] };

  /* Town lift: hovering or focusing a town raises its contours (a clip circle reveals a darker layer)
     and opens a preview of the place. The pin itself is the link; the preview is decorative. */
  const box = $('[data-home-map]');
  if (box) {
    const circle = $('#lift-clip circle', box);
    const stage = $('.stage', box);
    let current = null, closeT;
    const open = pin => {
      clearTimeout(closeT);
      const slug = pin.dataset.town;
      const x = parseFloat(pin.style.getPropertyValue('--x')), y = parseFloat(pin.style.getPropertyValue('--y'));
      if (circle) { circle.setAttribute('cx', x * 1600); circle.setAttribute('cy', y * 1000); circle.setAttribute('r', 190); }
      $$('.town-pin', box).forEach(p => p.classList.toggle('is-active', p === pin));
      $$('.placecard', box).forEach(c => c.classList.remove('is-open'));
      const card = $(`.placecard[data-card="${slug}"]`, box);
      if (card) {
        const br = box.getBoundingClientRect(), pr = pin.getBoundingClientRect();
        const w = card.offsetWidth || 300, h = card.offsetHeight || 260;
        let left = pr.left - br.left + 8, top = pr.bottom - br.top + 10;
        if (left + w > br.width - 16) left = br.width - w - 16;
        if (top + h > br.height - 16) top = pr.top - br.top - h - 10;
        card.style.left = `${Math.max(16, left)}px`; card.style.top = `${Math.max(16, top)}px`;
        card.classList.add('is-open');
      }
      current = pin;
    };
    const close = () => { closeT = setTimeout(() => { if (circle) circle.setAttribute('r', 0); $$('.town-pin', box).forEach(p => p.classList.remove('is-active')); $$('.placecard', box).forEach(c => c.classList.remove('is-open')); current = null; }, 120); };
    $$('.town-pin', box).forEach(pin => {
      pin.addEventListener('pointerenter', () => open(pin));
      pin.addEventListener('pointerleave', close);
      pin.addEventListener('focus', () => open(pin));
      pin.addEventListener('blur', close);
    });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && current) { clearTimeout(closeT); close(); } });
  }

  /* Life-first discovery: neutral housing & location attributes highlight matching towns. */
  $$('[data-lifefirst]').forEach(lf => {
    const scope = lf.parentElement;
    const cells = $$('[data-sheetindex] .sheetindex__cell', scope);
    const status = $('[data-lifefirst-status]', lf);
    const chips = $$('.chip', lf);
    const update = () => {
      const on = chips.filter(c => c.getAttribute('aria-pressed') === 'true').map(c => c.dataset.attr);
      let n = 0;
      cells.forEach(c => {
        const attrs = c.dataset.attrs.split(' ');
        const match = on.every(a => attrs.includes(a));
        c.classList.toggle('is-dim', on.length > 0 && !match);
        c.classList.toggle('is-match', on.length > 0 && match);
        if (match) n++;
      });
      const names = cells.filter(c => c.classList.contains('is-match')).map(c => c.querySelector('.sheetindex__name').textContent.trim());
      status.textContent = !on.length ? 'Showing all six towns.' : n ? `${n} of ${cells.length} towns fit: ${names.join(', ')}.` : 'No single town has all of those. Try one fewer, or ask us; there are always exceptions street by street.';
    };
    chips.forEach(c => c.addEventListener('click', () => { c.setAttribute('aria-pressed', c.getAttribute('aria-pressed') === 'true' ? 'false' : 'true'); update(); }));
  });
})();
