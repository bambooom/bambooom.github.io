/* Booooom theme runtime: pixel icons, 竹 avatar, marquee overflow, keyboard nav */
(() => {
  'use strict';
  const RISO = { pink: '#ff48b0', blue: '#0078bf' };

  // 12x12 pixel icons. b = blue, p = pink, . = transparent
  const ICONS = {
    trv: ['............', '....bbbb....', '...b....b...', '.bbbbbbbbbb.', '.b........b.', '.b.pp..pp.b.', '.b........b.', '.b.pppppp.b.', '.b........b.', '.b........b.', '.bbbbbbbbbb.', '............'],
    tech: ['bbbbbbbbbbb.', 'b.bbbbbb..b.', 'b.b....b..bb', 'b.bbbbbb...b', 'b..........b', 'b..........b', 'b.bbbbbbbb.b', 'b.b......b.b', 'b.b.pppp.b.b', 'b.b.pppp.b.b', 'bbbbbbbbbbbb', '............'],
    lrn: ['............', '.bbbbb.bbbbb', 'b.....b....b', 'b.ppp.b.pp.b', 'b.....b....b', 'b.ppp.b.pp.b', 'b.....b....b', 'b.ppp.b.pp.b', 'b.....b....b', '.bbbbbbbbbb.', '.....b......', '............'],
    sum: ['............', '.bbbbbbbbbb.', '.bbbbbbbbbb.', '.b........b.', '.b.pp.b.b.b.', '.b........b.', '.b.b.pp.b.b.', '.b........b.', '.b.b.b.pp.b.', '.b........b.', '.bbbbbbbbbb.', '............'],
    dia: ['............', '.........bb.', '........bppb', '.......bppb.', '......bppb..', '.....bppb...', '....bppb....', '...bbpb.....', '...bbb......', '............', '.bbbbbbbbbb.', '............'],
    ent: ['............', '...b....b...', '....b..b....', '.bbbbbbbbbb.', '.b........b.', '.b.pppppp.b.', '.b.pppppp.b.', '.b.pppppp.b.', '.b........b.', '.bbbbbbbbbb.', '...bb..bb...', '............'],
    heart: ['.bb...bb...', 'bppb.bppb..', 'bpppbpppb..', 'bpppppppb..', '.bpppppb...', '..bpppb....', '...bpb.....', '....b......', '...........', '...........'],
  };
  // 14x13 「竹」 avatar, drawn twice with misregistration (pink under blue)
  const TAKE = ['....b......b..', '...b......b...', '..bbbbb..bbbbb', '.b..b...b..b..', 'b...b..b...b..', '....b......b..', '....b......b..', '....b......b..', '....b......b..', '....b......b..', '....b.....bb..', '....b....bb...', '..............'];

  function paint(canvas, rows, dx = 0, dy = 0, color) {
    const x = canvas.getContext('2d');
    rows.forEach((r, y) => [...r].forEach((ch, xx) => {
      if (ch === '.') return;
      x.fillStyle = color || (ch === 'p' ? RISO.pink : RISO.blue);
      x.fillRect(xx + dx, y + dy, 1, 1);
    }));
  }

  function drawIcons(root = document) {
    root.querySelectorAll('canvas[data-i]').forEach(c => {
      const rows = ICONS[c.dataset.i];
      if (!rows || c.dataset.done) return;
      c.width = rows[0].length; c.height = rows.length; c.dataset.done = 1;
      paint(c, rows);
    });
    root.querySelectorAll('canvas[data-take]').forEach(c => {
      if (c.dataset.done) return;
      c.width = 15; c.height = 14; c.dataset.done = 1;
      paint(c, TAKE, 1, 1, RISO.pink);
      paint(c, TAKE, 0, 0, RISO.blue);
    });
  }

  // Titles wider than their cell: fade mask at rest, marquee on hover
  function marquee(root = document) {
    root.querySelectorAll('.log .mq').forEach(m => {
      const sp = m.firstElementChild; if (!sp) return;
      const d = m.clientWidth - sp.scrollWidth;
      m.classList.toggle('of', d < 0);
      m.style.setProperty('--shift', (d < 0 ? d : 0) + 'px');
    });
  }

  // Keyboard: j/k or arrows move the ▶ cursor over .log rows / .cmd items, Enter opens, Backspace goes back
  function keys() {
    const items = [...document.querySelectorAll('[data-nav] a, .log tr[data-href]')];
    let cur = items.findIndex(el => el.classList.contains('on'));
    const set = i => {
      if (!items.length) return;
      cur = (i + items.length) % items.length;
      items.forEach((el, k) => el.classList.toggle('on', k === cur));
      items[cur].scrollIntoView({ block: 'nearest' });
    };
    document.addEventListener('keydown', e => {
      if (e.target.closest('input,textarea,[contenteditable]') || e.metaKey || e.ctrlKey || e.altKey) return;
      switch (e.key) {
        case 'j': case 'ArrowDown': e.preventDefault(); set(cur + 1); break;
        case 'k': case 'ArrowUp': e.preventDefault(); set(cur - 1); break;
        case 'Enter': case 'a': {
          const el = items[cur]; if (!el) return;
          const href = el.getAttribute('href') || el.dataset.href; if (href) location.href = href; break;
        }
        case 'Backspace': case 'b': {
          const back = document.querySelector('.crumb a:nth-last-child(2)');
          e.preventDefault(); location.href = back ? back.href : '/'; break;
        }
        case '/': {
          const s = document.querySelector('[data-search]');
          if (s) { e.preventDefault(); s.dispatchEvent(new CustomEvent('open')); }
          break;
        }
      }
    });
  }

  // Whole LOG row is a link
  function rows() {
    document.addEventListener('click', e => {
      const tr = e.target.closest('tr[data-href]');
      if (tr && !e.target.closest('a')) location.href = tr.dataset.href;
    });
  }

  // Search overlay: substring match over /index.json (title · category · date · summary)
  function search() {
    const box = document.querySelector('[data-search]'); if (!box) return;
    const input = box.querySelector('.sin'), table = box.querySelector('.sres table');
    let idx = null, cur = 0, hits = [];
    const esc = s => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    const load = () => idx || fetch(input.dataset.src).then(r => r.json()).then(j => (idx = j));
    const render = () => {
      table.innerHTML = hits.length ? hits.map((h, i) =>
        `<tr data-href="${h.u}"${i === cur ? ' class="on"' : ''}><td class="k">第${h.ep}話</td><td class="t"><div class="mq"><span>${esc(h.t)}</span></div></td><td class="k">${esc(h.c)}</td><td class="d"><i class="stamp">${h.d}</i></td></tr>`
      ).join('') : `<tr><td class="none" colspan="4">— 該当なし —</td></tr>`;
    };
    const run = () => {
      const q = input.value.trim().toLowerCase();
      if (!idx) return;
      hits = q ? idx.filter(p => (p.t + ' ' + p.c + ' ' + p.d + ' ' + (p.s || '')).toLowerCase().includes(q)).slice(0, 30) : idx.slice(0, 12);
      cur = 0; render();
    };
    const open = () => { box.hidden = false; input.value = ''; Promise.resolve(load()).then(run); setTimeout(() => input.focus(), 0); };
    const close = () => { box.hidden = true; };
    box.addEventListener('open', open);
    document.querySelectorAll('[data-search-open]').forEach(b => b.addEventListener('click', open));
    box.addEventListener('click', e => { if (e.target === box) close(); });
    input.addEventListener('input', run);
    input.addEventListener('keydown', e => {
      if (e.key === 'Escape') { e.preventDefault(); close(); }
      else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault(); if (!hits.length) return;
        cur = (cur + (e.key === 'ArrowDown' ? 1 : -1) + hits.length) % hits.length; render();
        table.querySelector('tr.on')?.scrollIntoView({ block: 'nearest' });
      } else if (e.key === 'Enter' && hits[cur]) location.href = hits[cur].u;
    });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && !box.hidden) close(); });
    if (location.hash === '#search') open();
  }

  function init() { drawIcons(); marquee(); keys(); rows(); search(); }
  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', init) : init();
  window.addEventListener('resize', () => marquee());
  if (document.fonts) document.fonts.ready.then(() => marquee());
  window.Booooom = { drawIcons, marquee, paint, ICONS, RISO };
})();
