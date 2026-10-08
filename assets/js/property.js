/* Property page: scroll-snap gallery with counter, and a full-screen lightbox (native dialog). */
(() => {
  const { $, $$ } = window.OBT;
  const g = $('[data-gallery]'); if (!g) return;
  const track = $('.gallery__track', g), items = $$('.frame-open', track), count = $('[data-gal-count]');
  const idx = () => Math.round(track.scrollLeft / (items[0].offsetWidth + parseFloat(getComputedStyle(track).columnGap || 0)));
  const go = i => { i = Math.max(0, Math.min(items.length - 1, i)); track.scrollTo({ left: items[i].offsetLeft - track.offsetLeft, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }); };
  track.addEventListener('scroll', () => { if (count) count.textContent = `${Math.min(items.length, idx() + 1)} / ${items.length}`; }, { passive: true });
  $('[data-gal-prev]', g).addEventListener('click', () => go(idx() - 1));
  $('[data-gal-next]', g).addEventListener('click', () => go(idx() + 1));
  track.addEventListener('keydown', e => { if (e.key === 'ArrowRight') { e.preventDefault(); go(idx() + 1); } if (e.key === 'ArrowLeft') { e.preventDefault(); go(idx() - 1); } });

  const lb = $('[data-lightbox]'), stage = $('[data-lb-stage]'), lbc = $('[data-lb-count]');
  let cur = 0, opener = null;
  const show = i => { cur = (i + items.length) % items.length; stage.innerHTML = items[cur].innerHTML; lbc.textContent = `${cur + 1} / ${items.length}`; };
  items.forEach((b, i) => b.addEventListener('click', () => { opener = b; show(i); lb.showModal(); }));
  $('[data-lb-close]').addEventListener('click', () => lb.close());
  $('[data-lb-prev]').addEventListener('click', () => show(cur - 1));
  $('[data-lb-next]').addEventListener('click', () => show(cur + 1));
  lb.addEventListener('keydown', e => { if (e.key === 'ArrowRight') show(cur + 1); if (e.key === 'ArrowLeft') show(cur - 1); });
  lb.addEventListener('close', () => { go(cur); opener?.focus(); });
})();
