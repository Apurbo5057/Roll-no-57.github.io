/* ============================================================
   Barabási–Albert growth, live.

   One node arrives per tick carrying m links, choosing targets
   with probability proportional to current degree. The target
   draw uses the standard repeated-endpoint trick: every link
   contributes both of its endpoints to a bag, so drawing a node
   uniformly from the bag draws it with probability k_i / Σk_j —
   which is exactly Π(k_i), with no normalisation step.

   Registered as 'ba-growth'; the post mounts it with
   <div class="sim" data-sim="ba-growth"></div>.
   ============================================================ */

Blog.sim('ba-growth', function (host) {
  var MAX_N = 130;          // stop here — past this the force layout stops being readable
  var m = 2;                // links per arriving node
  var speed = 6;            // ticks per second
  var running = true;

  host.innerHTML =
    '<div class="sim-head">' +
      '<span class="sim-title">Preferential attachment, running</span>' +
      '<span class="sim-tag">live</span>' +
    '</div>' +
    '<div class="ba-panels">' +
      '<svg class="ba-graph" aria-label="Growing network"></svg>' +
      '<svg class="ba-hist" aria-label="Degree distribution"></svg>' +
    '</div>' +
    '<div class="sim-controls">' +
      '<button class="sim-btn" data-act="toggle">Pause</button>' +
      '<button class="sim-btn" data-act="reset">Restart</button>' +
      '<label>m <input type="range" min="1" max="4" step="1" value="2" data-ctl="m"><output data-out="m">2</output></label>' +
      '<label>speed <input type="range" min="1" max="20" step="1" value="6" data-ctl="speed"><output data-out="speed">6</output></label>' +
      '<span class="sim-readout" data-readout></span>' +
    '</div>';

  // Panel layout lives here rather than in blog.css because it is
  // specific to this one simulation.
  var style = document.createElement('style');
  style.textContent =
    '.ba-panels{display:grid;grid-template-columns:1.45fr 1fr;gap:0.9rem;align-items:stretch}' +
    '@media(max-width:640px){.ba-panels{grid-template-columns:1fr}}' +
    '.ba-graph,.ba-hist{width:100%;height:290px;display:block;background:var(--bg-sunken);' +
      'border:1px solid var(--rule-soft);border-radius:8px}';
  host.appendChild(style);

  var graphSvg = d3.select(host).select('.ba-graph');
  var histSvg = d3.select(host).select('.ba-hist');
  var readout = host.querySelector('[data-readout]');

  var nodes, links, bag, sim, timer = null;

  function css(name, fallback) {
    var v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return v || fallback;
  }

  var C = {};
  function refreshColors() {
    C = {
      hub: css('--accent-hub', '#e0a458'),
      edge: css('--accent-edge', '#5fa3a3'),
      dim: css('--ink-dim', '#a7adba'),
      faint: css('--ink-faint', '#6d7688'),
      rule: css('--rule', '#2b3342'),
      surface: css('--bg-sunken', '#0d1015')
    };
  }
  refreshColors();

  function size(sel) {
    var r = sel.node().getBoundingClientRect();
    return { w: Math.max(120, r.width), h: Math.max(120, r.height) };
  }

  /* ---- model ------------------------------------------------ */

  function reset() {
    // Seed: a small complete-ish core of m+1 mutually linked nodes.
    nodes = [];
    links = [];
    bag = [];
    var seed = m + 1;
    for (var i = 0; i < seed; i++) nodes.push({ id: i, deg: 0 });
    for (var a = 0; a < seed; a++) {
      for (var b = a + 1; b < seed; b++) {
        links.push({ source: nodes[a], target: nodes[b] });
        nodes[a].deg++; nodes[b].deg++;
        bag.push(a, b);
      }
    }
    restartLayout();
    draw();
  }

  function step() {
    if (nodes.length >= MAX_N) { setRunning(false); return; }

    var nu = { id: nodes.length, deg: 0 };
    var picked = {};
    var targets = [];
    var guard = 0;

    while (targets.length < Math.min(m, nodes.length) && guard++ < 500) {
      var cand = bag.length
        ? bag[(Math.random() * bag.length) | 0]
        : (Math.random() * nodes.length) | 0;
      if (picked[cand]) continue;      // no multi-edges from one arrival
      picked[cand] = true;
      targets.push(cand);
    }

    nodes.push(nu);
    targets.forEach(function (t) {
      links.push({ source: nu, target: nodes[t] });
      nu.deg++; nodes[t].deg++;
      bag.push(nu.id, t);              // both endpoints enter the bag
    });

    restartLayout();
    draw();
  }

  /* ---- layout ------------------------------------------------ */

  function restartLayout() {
    var s = size(graphSvg);
    if (!sim) {
      sim = d3.forceSimulation(nodes)
        .force('link', d3.forceLink(links).distance(26).strength(0.55))
        .force('charge', d3.forceManyBody().strength(-42))
        .force('center', d3.forceCenter(s.w / 2, s.h / 2))
        .force('collide', d3.forceCollide().radius(function (d) { return radius(d) + 1.5; }))
        .on('tick', paintGraph);
    } else {
      sim.nodes(nodes);
      sim.force('link').links(links);
      sim.force('center').x(s.w / 2).y(s.h / 2);
    }
    sim.alpha(0.7).restart();
  }

  function radius(d) { return 3 + Math.sqrt(d.deg) * 1.7; }

  function maxDeg() {
    return nodes.reduce(function (a, n) { return Math.max(a, n.deg); }, 0);
  }

  /* ---- painting ---------------------------------------------- */

  function paintGraph() {
    var s = size(graphSvg);
    graphSvg.attr('viewBox', '0 0 ' + s.w + ' ' + s.h);
    var top = maxDeg();

    var lk = graphSvg.selectAll('line').data(links);
    lk.enter().append('line')
      .attr('stroke-width', 1)
      .merge(lk)
      .attr('stroke', C.edge)
      .attr('stroke-opacity', 0.32)
      .attr('x1', function (d) { return d.source.x; })
      .attr('y1', function (d) { return d.source.y; })
      .attr('x2', function (d) { return d.target.x; })
      .attr('y2', function (d) { return d.target.y; });
    lk.exit().remove();

    var nd = graphSvg.selectAll('circle').data(nodes);
    nd.enter().append('circle')
      .merge(nd)
      // "hub" here is purely visual: the top fifth of the degree range.
      .attr('fill', function (d) { return d.deg >= top * 0.45 ? C.hub : C.edge; })
      .attr('fill-opacity', function (d) { return d.deg >= top * 0.45 ? 0.95 : 0.62; })
      .attr('stroke', C.surface)
      .attr('stroke-width', 1.5)
      .attr('r', radius)
      .attr('cx', function (d) { return d.x = Math.max(6, Math.min(s.w - 6, d.x)); })
      .attr('cy', function (d) { return d.y = Math.max(6, Math.min(s.h - 6, d.y)); });
    nd.exit().remove();
  }

  function paintHist() {
    var s = size(histSvg);
    histSvg.attr('viewBox', '0 0 ' + s.w + ' ' + s.h);
    histSvg.selectAll('*').remove();

    var top = Math.max(1, maxDeg());
    var counts = new Array(top + 1).fill(0);
    nodes.forEach(function (n) { counts[n.deg]++; });

    var m0 = { t: 22, r: 10, b: 26, l: 26 };
    var iw = s.w - m0.l - m0.r, ih = s.h - m0.t - m0.b;
    var g = histSvg.append('g').attr('transform', 'translate(' + m0.l + ',' + m0.t + ')');

    var maxC = Math.max.apply(null, counts) || 1;
    var bw = iw / counts.length;

    g.append('text')
      .attr('x', 0).attr('y', -8)
      .attr('fill', C.dim).attr('font-size', 11)
      .text('degree distribution');

    counts.forEach(function (c, k) {
      if (!c) return;
      var h = (c / maxC) * ih;
      var x = k * bw;
      var w = Math.max(1, bw - 1.5);            // 2px surface gap between bars
      var rr = Math.min(3, w / 2);
      g.append('path')
        .attr('d',
          'M' + x + ',' + ih + 'V' + (ih - h + rr) +
          'a' + rr + ',' + rr + ' 0 0 1 ' + rr + ',' + (-rr) +
          'h' + (w - 2 * rr) +
          'a' + rr + ',' + rr + ' 0 0 1 ' + rr + ',' + rr +
          'V' + ih + 'Z')
        .attr('fill', k >= top * 0.45 ? C.hub : C.edge)
        .attr('fill-opacity', 0.85)
        .append('title').text(c + ' node' + (c === 1 ? '' : 's') + ' with degree ' + k);
    });

    g.append('line')
      .attr('x1', 0).attr('y1', ih).attr('x2', iw).attr('y2', ih)
      .attr('stroke', C.rule);

    [0, Math.round(top / 2), top].forEach(function (k) {
      g.append('text')
        .attr('x', k * bw + bw / 2).attr('y', ih + 16)
        .attr('text-anchor', 'middle')
        .attr('fill', C.faint).attr('font-size', 10)
        .attr('font-family', 'var(--font-mono)')
        .text(k);
    });

    g.append('text')
      .attr('x', -6).attr('y', 4)
      .attr('text-anchor', 'end')
      .attr('fill', C.faint).attr('font-size', 10)
      .attr('font-family', 'var(--font-mono)')
      .text(maxC);
  }

  function draw() {
    paintGraph();
    paintHist();
    var avg = nodes.length ? (2 * links.length / nodes.length) : 0;
    readout.textContent = 'N ' + nodes.length + ' · ⟨k⟩ ' + avg.toFixed(2) + ' · k(max) ' + maxDeg();
  }

  /* ---- driving ------------------------------------------------ */

  function setRunning(on) {
    running = on;
    host.querySelector('[data-act="toggle"]').textContent = on ? 'Pause' : 'Resume';
    clearInterval(timer);
    if (on) timer = setInterval(step, 1000 / speed);
  }

  host.addEventListener('click', function (e) {
    var act = e.target.getAttribute && e.target.getAttribute('data-act');
    if (act === 'toggle') setRunning(!running);
    if (act === 'reset') { reset(); setRunning(true); }
  });

  host.addEventListener('input', function (e) {
    var ctl = e.target.getAttribute && e.target.getAttribute('data-ctl');
    if (!ctl) return;
    var val = +e.target.value;
    host.querySelector('[data-out="' + ctl + '"]').value = val;
    if (ctl === 'speed') { speed = val; if (running) setRunning(true); }
    if (ctl === 'm') { m = val; reset(); setRunning(true); }
  });

  window.addEventListener('themechange', function () { refreshColors(); draw(); });
  window.addEventListener('resize', function () { restartLayout(); draw(); });

  // Don't animate a simulation nobody is looking at.
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting && running) { clearInterval(timer); }
        else if (en.isIntersecting && running) { clearInterval(timer); timer = setInterval(step, 1000 / speed); }
      });
    }, { threshold: 0.05 }).observe(host);
  }

  reset();
  setRunning(true);
});
