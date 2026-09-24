/* Home only: pop-art burst for the 🤯 hover, blah-blah ticker, stage scaling */
(() => {
  'use strict';

  // Starburst with concave spikes, halftone dots and a misregistered outline — two colours only
  function burstSVG(o = {}) {
    const { size = 200, spikes = 13, seed = 3, fill = '#ff48b0', line = '#0078bf', offset = 5, stroke = 2.5, inner = 0.62, jitter = 0.16, bow = 0.22 } = o;
    let s = seed; const rnd = () => (s = (s * 9301 + 49297) % 233280) / 233280;
    const cx = size / 2, cy = size / 2, R = size * 0.46, step = (Math.PI * 2) / spikes;
    const tips = [], inners = [];
    for (let i = 0; i < spikes; i++) {
      const a = i * step + (rnd() - 0.5) * step * 0.3;
      const len = R * (1 - jitter + rnd() * jitter * 2);
      tips.push([cx + Math.cos(a) * len, cy + Math.sin(a) * len]);
      const ai = a + step / 2, ri = R * inner * (0.9 + rnd() * 0.2);
      inners.push([cx + Math.cos(ai) * ri, cy + Math.sin(ai) * ri]);
    }
    const ctrl = (p, q) => { const mx = (p[0] + q[0]) / 2, my = (p[1] + q[1]) / 2; return [mx + (cx - mx) * bow, my + (cy - my) * bow]; };
    let d = '';
    for (let i = 0; i < spikes; i++) {
      const a = inners[(i - 1 + spikes) % spikes], t = tips[i], b = inners[i], c1 = ctrl(a, t), c2 = ctrl(t, b);
      if (!i) d += `M${a[0].toFixed(1)},${a[1].toFixed(1)}`;
      d += ` Q${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${t[0].toFixed(1)},${t[1].toFixed(1)} Q${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${b[0].toFixed(1)},${b[1].toFixed(1)}`;
    }
    d += ' Z';
    const id = 'b' + Math.floor(rnd() * 1e6);
    return `<svg viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg" style="overflow:visible">
<defs><pattern id="${id}d" width="6" height="6" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r="1.5" fill="${line}"/></pattern>
<radialGradient id="${id}g"><stop offset="35%" stop-color="#000"/><stop offset="100%" stop-color="#fff"/></radialGradient>
<mask id="${id}m"><rect width="${size}" height="${size}" fill="url(#${id}g)"/></mask>
<clipPath id="${id}c"><path d="${d}"/></clipPath></defs>
<path d="${d}" fill="none" stroke="${line}" stroke-width="${stroke}" transform="translate(${-offset},${offset})" style="mix-blend-mode:multiply"/>
<path d="${d}" fill="${fill}" style="mix-blend-mode:multiply"/>
<rect width="${size}" height="${size}" fill="url(#${id}d)" clip-path="url(#${id}c)" mask="url(#${id}m)" style="mix-blend-mode:multiply" opacity=".9"/>
<path d="${d}" fill="none" stroke="${line}" stroke-width="${stroke}" style="mix-blend-mode:multiply"/></svg>`;
  }

  function init() {
    const pop = document.getElementById('pop');
    if (pop) pop.insertAdjacentHTML('afterbegin', burstSVG());

    const t = document.getElementById('ticker');
    if (t) for (let i = 0; i < 4; i++) {
      const d = document.createElement('div');
      d.textContent = 'blah blah blah, blah blah… blah blah blah blah. blah blah '.repeat(8);
      t.appendChild(d);
    }

    // Fit the 1024px stage into narrower desktop viewports
    const stage = document.getElementById('stage');
    const fit = () => {
      const w = document.documentElement.clientWidth;
      stage.style.setProperty('--scale', w > 760 && w < 1060 ? Math.min(1, (w - 32) / 1024).toFixed(3) : 1);
    };
    fit(); window.addEventListener('resize', fit);

    // Touch: tap the bubble once to pop, second tap navigates
    const b = document.getElementById('bubble');
    if (b && matchMedia('(hover:none)').matches) {
      b.addEventListener('click', e => { if (!b.classList.contains('hov')) { e.preventDefault(); b.classList.add('hov'); } }, { passive: false });
    }
  }
  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', init) : init();
})();
