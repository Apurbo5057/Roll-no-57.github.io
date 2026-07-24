/* ============================================================
   Hub page behaviour: theme toggle + the decorative drifting
   network behind the hero.

   The theme toggle deliberately reuses the SAME localStorage key
   ('ns-theme') as Presentation-01/js/lib/theme-toggle.js, so a
   visitor's light/dark choice carries between the hub and the
   presentations instead of resetting at each hop.
   ============================================================ */

(function () {
  const STORAGE_KEY = 'ns-theme';
  const root = document.documentElement;

  function getStored() {
    try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
  }

  function preferredTheme() {
    const stored = getStored();
    if (stored === 'light' || stored === 'dark') return stored;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches
      ? 'light' : 'dark';
  }

  function apply(theme) {
    root.setAttribute('data-theme', theme);
    const btn = document.getElementById('theme-toggle-btn');
    if (btn) btn.textContent = theme === 'light' ? '\u{1F319}' : '\u{2600}\u{FE0F}';
    try { localStorage.setItem(STORAGE_KEY, theme); } catch (e) {}
  }

  apply(preferredTheme());

  document.addEventListener('DOMContentLoaded', function () {
    const btn = document.createElement('button');
    btn.id = 'theme-toggle-btn';
    btn.className = 'theme-toggle';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Toggle light / dark theme');
    btn.textContent = root.getAttribute('data-theme') === 'light' ? '\u{1F319}' : '\u{2600}\u{FE0F}';
    btn.addEventListener('click', function () {
      apply(root.getAttribute('data-theme') === 'light' ? 'dark' : 'light');
    });
    document.body.appendChild(btn);

    initHeroNetwork();
  });

  /* ---- hero background: nodes drifting, edges drawn between the
     pairs that happen to be close. Degree is skewed on purpose —
     a few visually obvious hubs, which is the whole subject. ---- */
  function initHeroNetwork() {
    const canvas = document.getElementById('hero-net');
    if (!canvas || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = canvas.getContext('2d');
    const LINK_DIST = 130;
    let nodes = [], w = 0, h = 0, dpr = 1;

    function colors() {
      const s = getComputedStyle(root);
      return {
        hub: s.getPropertyValue('--accent-hub').trim(),
        edge: s.getPropertyValue('--accent-edge').trim()
      };
    }

    function resize() {
      dpr = window.devicePixelRatio || 1;
      const r = canvas.getBoundingClientRect();
      w = r.width; h = r.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    }

    function seed() {
      const count = Math.max(18, Math.min(46, Math.round(w / 26)));
      nodes = Array.from({ length: count }, function (_, i) {
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.22,
          vy: (Math.random() - 0.5) * 0.22,
          // ~1 in 7 nodes is a hub: bigger, warm-coloured, slower.
          hub: i % 7 === 0
        };
      });
    }

    function frame() {
      const c = colors();
      ctx.clearRect(0, 0, w, h);

      for (const n of nodes) {
        n.x += n.hub ? n.vx * 0.4 : n.vx;
        n.y += n.hub ? n.vy * 0.4 : n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
      }

      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const d = Math.hypot(dx, dy);
          if (d >= LINK_DIST) continue;
          ctx.globalAlpha = (1 - d / LINK_DIST) * 0.32;
          ctx.strokeStyle = c.edge;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }

      for (const n of nodes) {
        ctx.globalAlpha = n.hub ? 0.85 : 0.5;
        ctx.fillStyle = n.hub ? c.hub : c.edge;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.hub ? 4.5 : 2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      requestAnimationFrame(frame);
    }

    resize();
    window.addEventListener('resize', resize);
    requestAnimationFrame(frame);
  }
})();
