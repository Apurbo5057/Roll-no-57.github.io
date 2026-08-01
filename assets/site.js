/* ============================================================
   Shared site behaviour: theme, nav state, hero graph, reveals.

   The theme toggle writes ONE localStorage key ('ns-theme') that
   the portfolio and the blog both read, so a visitor's light/dark
   choice carries across the site instead of resetting at each hop.
   ============================================================ */

(function () {
  'use strict';

  var STORAGE_KEY = 'ns-theme';
  var root = document.documentElement;

  /* ---- theme ------------------------------------------------ */

  function stored() {
    try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
  }

  function preferred() {
    var s = stored();
    if (s === 'light' || s === 'dark') return s;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches
      ? 'light' : 'dark';
  }

  function apply(theme) {
    root.setAttribute('data-theme', theme);
    var btn = document.getElementById('theme-toggle-btn');
    if (btn) btn.textContent = theme === 'light' ? '\u{1F319}' : '\u{2600}\u{FE0F}';
    try { localStorage.setItem(STORAGE_KEY, theme); } catch (e) {}
    // Charts and sims re-read CSS variables on this event.
    window.dispatchEvent(new CustomEvent('themechange', { detail: { theme: theme } }));
  }

  // Applied before first paint (this file is loaded in <head>) so the
  // page never flashes the wrong theme.
  apply(preferred());

  function mountToggle() {
    var btn = document.createElement('button');
    btn.id = 'theme-toggle-btn';
    btn.className = 'theme-toggle';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Toggle light / dark theme');
    btn.textContent = root.getAttribute('data-theme') === 'light' ? '\u{1F319}' : '\u{2600}\u{FE0F}';
    btn.addEventListener('click', function () {
      apply(root.getAttribute('data-theme') === 'light' ? 'dark' : 'light');
    });
    document.body.appendChild(btn);
  }

  /* ---- nav: hairline on scroll + active section -------------- */

  function initNav() {
    var nav = document.querySelector('.nav');
    if (nav) {
      var onScroll = function () { nav.classList.toggle('scrolled', window.scrollY > 8); };
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
    }

    var links = Array.prototype.slice.call(document.querySelectorAll('.nav-links a[href^="#"]'));
    if (!links.length || !('IntersectionObserver' in window)) return;

    var sections = links
      .map(function (a) { return document.querySelector(a.getAttribute('href')); })
      .filter(Boolean);

    // -45% bottom margin means a section counts as "current" once it
    // reaches the upper half of the viewport, which matches where the
    // eye actually is while scrolling.
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (a) {
          a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id);
        });
      });
    }, { rootMargin: '-20% 0px -45% 0px' });

    sections.forEach(function (s) { obs.observe(s); });
  }

  /* ---- scroll reveal ---------------------------------------- */

  function initReveal() {
    var items = document.querySelectorAll('.reveal-up');
    if (!items.length) return;

    if (!('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('shown'); });
      return;
    }

    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('shown');
        obs.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -8% 0px' });

    items.forEach(function (el, i) {
      // Stagger within a group so rows cascade rather than snapping in together.
      el.style.transitionDelay = (Math.min(i % 6, 5) * 55) + 'ms';
      obs.observe(el);
    });
  }

  /* ---- hero background graph --------------------------------
     Nodes drift; an edge is drawn between any pair that happens to
     be close. Degree is skewed on purpose — a few visually obvious
     hubs, which is the subject matter.
     ----------------------------------------------------------- */

  function initHeroNetwork() {
    var canvas = document.getElementById('hero-net');
    if (!canvas) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var ctx = canvas.getContext('2d');
    var LINK_DIST = 132;
    var nodes = [], w = 0, h = 0, running = true;

    function colors() {
      var s = getComputedStyle(root);
      return {
        hub: s.getPropertyValue('--accent-hub').trim(),
        edge: s.getPropertyValue('--accent-edge').trim()
      };
    }

    var c = colors();
    window.addEventListener('themechange', function () { c = colors(); });

    function resize() {
      var dpr = window.devicePixelRatio || 1;
      var r = canvas.getBoundingClientRect();
      w = r.width; h = r.height;
      if (!w || !h) return;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    }

    function seed() {
      var count = Math.max(20, Math.min(52, Math.round(w / 24)));
      nodes = [];
      for (var i = 0; i < count; i++) {
        nodes.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.2,
          vy: (Math.random() - 0.5) * 0.2,
          hub: i % 7 === 0          // ~1 in 7 is a hub
        });
      }
    }

    function frame() {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);

      for (var i = 0; i < nodes.length; i++) {
        var n = nodes[i];
        n.x += n.hub ? n.vx * 0.35 : n.vx;
        n.y += n.hub ? n.vy * 0.35 : n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
      }

      ctx.lineWidth = 1;
      ctx.strokeStyle = c.edge;
      for (var a = 0; a < nodes.length; a++) {
        for (var b = a + 1; b < nodes.length; b++) {
          var dx = nodes[a].x - nodes[b].x;
          var dy = nodes[a].y - nodes[b].y;
          var d = Math.sqrt(dx * dx + dy * dy);
          if (d >= LINK_DIST) continue;
          ctx.globalAlpha = (1 - d / LINK_DIST) * 0.3;
          ctx.beginPath();
          ctx.moveTo(nodes[a].x, nodes[a].y);
          ctx.lineTo(nodes[b].x, nodes[b].y);
          ctx.stroke();
        }
      }

      for (var k = 0; k < nodes.length; k++) {
        var p = nodes[k];
        ctx.globalAlpha = p.hub ? 0.9 : 0.5;
        ctx.fillStyle = p.hub ? c.hub : c.edge;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.hub ? 4.5 : 2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      requestAnimationFrame(frame);
    }

    resize();
    window.addEventListener('resize', resize);

    // Stop burning frames when the hero is off screen or the tab is hidden.
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) { running = false; }
      else if (!running) { running = true; requestAnimationFrame(frame); }
    });

    requestAnimationFrame(frame);
  }

  /* ---- boot -------------------------------------------------- */

  document.addEventListener('DOMContentLoaded', function () {
    mountToggle();
    initNav();
    initReveal();
    initHeroNetwork();
  });
})();
