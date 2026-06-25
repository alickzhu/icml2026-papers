// ICML 2026 Papers — shared utilities (loaded by both views)

const PAGE_SIZE = 30;
const FAV_KEY = 'icml26_favorites';

// ---------- data loading ----------
async function loadJSON(path) {
  const resp = await fetch(path);
  if (!resp.ok) throw new Error(`Failed to load ${path}: ${resp.status}`);
  return resp.json();
}

// ---------- favorites (localStorage) ----------
function getFavorites() {
  try {
    return new Set(JSON.parse(localStorage.getItem(FAV_KEY) || '[]'));
  } catch (e) {
    return new Set();
  }
}
function toggleFavorite(paperId) {
  const favs = getFavorites();
  if (favs.has(paperId)) favs.delete(paperId);
  else favs.add(paperId);
  localStorage.setItem(FAV_KEY, JSON.stringify([...favs]));
  return favs.has(paperId);
}
function isFavorited(paperId) {
  return getFavorites().has(paperId);
}

// ---------- HTML escaping ----------
function esc(s) {
  if (s == null) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ---------- paper card render ----------
// Render one paper card. `paper` is the compact record (id,t,v,u,ab,ez,c,o).
// `orgTypes` is name -> type for tagging orgs.
function renderPaperCard(paper, orgTypes) {
  const venueClass = paper.v || 'regular';
  const venueLabel = paper.v || 'regular';
  const fav = isFavorited(paper.id);
  const favClass = fav ? ' active' : '';
  const favTitle = fav ? '取消收藏' : '收藏';

  const catTag = paper.c
    ? `<span class="cat-tag">${esc(paper.c)}</span>`
    : '';

  const orgTags = (paper.o || []).slice(0, 6).map(org => {
    const t = orgTypes[org] || 'other';
    return `<span class="org-tag ${t}">${esc(org)}</span>`;
  }).join('');
  const orgOverflow = (paper.o || []).length > 6
    ? `<span class="org-tag">+${paper.o.length - 6}</span>` : '';

  const ezBlock = paper.ez
    ? `<div class="summary-zh">${esc(paper.ez)}</div>` : '';

  const abBlock = paper.ab
    ? `<details>
         <summary>📄 英文摘要</summary>
         <div class="body">${esc(paper.ab)}</div>
       </details>` : '';

  return `<div class="paper-card" data-pid="${esc(paper.id)}">
    <div class="row1">
      <div class="title">
        <a href="${esc(paper.u)}" target="_blank" rel="noopener">${esc(paper.t)}</a>
      </div>
      <span class="venue ${venueClass}">${esc(venueLabel)}</span>
      <button class="fav-btn${favClass}" title="${favTitle}" data-pid="${esc(paper.id)}">★</button>
    </div>
    <div>${catTag}${orgTags}${orgOverflow}</div>
    ${ezBlock}
    ${abBlock}
  </div>`;
}

// Attach fav-btn click handler (delegation) to a container.
function bindFavButtons(container) {
  container.addEventListener('click', (e) => {
    const btn = e.target.closest('.fav-btn');
    if (!btn) return;
    const pid = btn.dataset.pid;
    const active = toggleFavorite(pid);
    btn.classList.toggle('active', active);
    btn.title = active ? '取消收藏' : '收藏';
  });
}

// ---------- pagination ----------
// Render a pager. `total` items, `pageSize`, current `page` (0-indexed).
// onChange(newPage) fires when user clicks a button.
function renderPager(total, pageSize, page, onChange) {
  if (total <= pageSize) return '';
  const last = Math.ceil(total / pageSize) - 1;
  const buttons = [];
  buttons.push(`<button data-page="0" ${page === 0 ? 'disabled' : ''}>« 首页</button>`);
  buttons.push(`<button data-page="${page - 1}" ${page === 0 ? 'disabled' : ''}>‹ 上一页</button>`);
  buttons.push(`<span class="info">第 ${page + 1} / ${last + 1} 页 (共 ${total} 条)</span>`);
  buttons.push(`<button data-page="${page + 1}" ${page >= last ? 'disabled' : ''}>下一页 ›</button>`);
  buttons.push(`<button data-page="${last}" ${page >= last ? 'disabled' : ''}>末页 »</button>`);
  const html = `<div class="pagination">${buttons.join('')}</div>`;
  // Bind happens after the caller injects HTML into DOM.
  setTimeout(() => {
    document.querySelectorAll('.pagination button[data-page]').forEach(btn => {
      btn.onclick = () => {
        const np = parseInt(btn.dataset.page, 10);
        if (!isNaN(np)) onChange(np);
      };
    });
  }, 0);
  return html;
}

// ---------- filter helpers ----------
function applyFilter(papers, mode) {
  if (mode === 'oral') return papers.filter(p => p.v === 'oral');
  if (mode === 'spotlight') return papers.filter(p => p.v === 'spotlight');
  if (mode === 'fav') {
    const favs = getFavorites();
    return papers.filter(p => favs.has(p.id));
  }
  return papers;
}

function applySearch(papers, q) {
  if (!q) return papers;
  const lower = q.toLowerCase();
  return papers.filter(p =>
    (p.t || '').toLowerCase().includes(lower) ||
    (p.ab || '').toLowerCase().includes(lower) ||
    (p.ez || '').includes(q) ||
    (p.o || []).some(o => o.toLowerCase().includes(lower)) ||
    (p.c || '').toLowerCase().includes(lower)
  );
}

// Debounce helper for search inputs
function debounce(fn, ms = 200) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}
