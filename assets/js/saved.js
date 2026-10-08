/* Saved homes & searches (device-local in the concept; synced to a user account + CRM in production). */
(() => {
  const { $, store, root } = window.OBT;
  const data = JSON.parse($('#listings-data').textContent);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const money = n => '$' + n.toLocaleString('en-US');
  const baths = b => (b % 1 ? `${Math.floor(b)}½` : b);
  const render = () => {
    const ids = store.get('obt:favs', []);
    const list = data.filter(l => ids.includes(l.id));
    $('[data-saved-empty]').hidden = list.length > 0;
    $('[data-saved-list]').innerHTML = list.length ? `<div class="rows-wrap"><table class="rows"><caption class="visually-hidden">Saved homes</caption><thead><tr><th scope="col">Address</th><th scope="col" class="num">Price</th><th scope="col">Details</th><th scope="col" class="hide-sm">Status</th><th scope="col"><span class="visually-hidden">Remove</span></th></tr></thead><tbody>${list.map(l => `<tr><td class="addr"><a href="${l.href}">${esc(l.address)}</a><span class="town">${esc(l.townName)}</span></td><td class="price-cell">${money(l.price)}</td><td class="facts-cell"><p class="facts"><span>${l.beds} bd</span><span>${baths(l.baths)} ba</span><span>${l.sqft.toLocaleString('en-US')} sq ft</span></p></td><td class="st hide-sm"><span class="status" data-status="${l.status}">${l.status}</span></td><td class="fav-cell"><button class="fav" type="button" data-fav="${l.id}" aria-pressed="true" aria-label="Remove ${esc(l.address)} from saved"><svg class="i" aria-hidden="true"><use href="${root}assets/icons.svg#i-heart"/></svg></button></td></tr>`).join('')}</tbody></table></div>` : '';
    const ss = store.get('obt:searches', []);
    $('[data-saved-searches]').innerHTML = ss.length ? ss.map(s => `<li><h3><a href="${root}site/search/${esc(s.query)}">${esc(s.name)}</a></h3><p class="meta">Saved ${new Date(s.created).toLocaleDateString()}${s.email ? ' · alerts to ' + esc(s.email) : ''}</p></li>`).join('') : `<li class="meta">No saved searches yet. Use “Save this search” on the search page.</li>`;
  };
  document.addEventListener('obt:favs', render);
  render();
})();
