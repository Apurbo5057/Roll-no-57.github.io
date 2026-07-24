/* ============================================================
   Reusable interactive network simulations.
   Shared across chapters — any chapter file can call these.
   ============================================================ */

// ---- 1. Growth + preferential attachment (Barabási-Albert) ----
function createBAGrowthSim(container, opts = {}) {
  const width = container.clientWidth;
  const height = container.clientHeight;
  const m = opts.m || 2; // edges per new node

  const svg = d3.select(container)
    .append('svg')
    .attr('width', width)
    .attr('height', height);

  let nodes = [{ id: 0 }, { id: 1 }];
  let links = [{ source: 0, target: 1 }];

  const sim = d3.forceSimulation(nodes)
    .force('link', d3.forceLink(links).id(d => d.id).distance(60))
    .force('charge', d3.forceManyBody().strength(-140))
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force('collide', d3.forceCollide(14));

  let linkSel = svg.append('g').selectAll('line');
  let nodeSel = svg.append('g').selectAll('circle');

  function degree(id) {
    return links.filter(l => l.source.id === id || l.source === id || l.target.id === id || l.target === id).length;
  }

  function render() {
    linkSel = linkSel.data(links, d => d.source + '-' + d.target);
    linkSel.exit().remove();
    linkSel = linkSel.enter().append('line')
      .attr('stroke', 'var(--accent-edge)')
      .attr('stroke-opacity', 0.5)
      .merge(linkSel);

    nodeSel = nodeSel.data(nodes, d => d.id);
    nodeSel.exit().remove();
    nodeSel = nodeSel.enter().append('circle')
      .attr('r', 6)
      .attr('fill', 'var(--accent-hub)')
      .merge(nodeSel)
      .attr('r', d => 5 + Math.sqrt(degree(d.id)) * 3);

    sim.nodes(nodes);
    sim.force('link').links(links);
    sim.alpha(0.7).restart();
  }

  sim.on('tick', () => {
    linkSel
      .attr('x1', d => d.source.x).attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x).attr('y2', d => d.target.y);
    nodeSel
      .attr('cx', d => d.x).attr('cy', d => d.y);
  });

  render();

  function addNode() {
    const newId = nodes.length;
    const weights = nodes.map(n => degree(n.id) + 1);
    const total = weights.reduce((a, b) => a + b, 0);
    const chosen = new Set();
    while (chosen.size < Math.min(m, nodes.length)) {
      let r = Math.random() * total;
      for (let i = 0; i < nodes.length; i++) {
        r -= weights[i];
        if (r <= 0) { chosen.add(nodes[i].id); break; }
      }
    }
    nodes.push({ id: newId });
    chosen.forEach(target => links.push({ source: newId, target }));
    render();
  }

  function reset() {
    nodes = [{ id: 0 }, { id: 1 }];
    links = [{ source: 0, target: 1 }];
    render();
  }

  return { addNode, reset };
}

// ---- 2. Robustness: random failure vs targeted attack ----
// Grows a small scale-free network once, then lets you remove
// nodes either at random ("failure") or by picking the current
// highest-degree node ("attack"), tracking how many separate
// connected components ("islands") the network breaks into.
function createRobustnessSim(container, opts = {}) {
  const width = container.clientWidth;
  const height = container.clientHeight;
  const n0 = opts.initialNodes || 40;
  const m = opts.m || 2;

  const svg = d3.select(container).append('svg').attr('width', width).attr('height', height);
  const statsEl = opts.statsEl;

  let nodes = [];
  let links = [];

  function degree(id) {
    return links.filter(l => l.source.id === id || l.source === id || l.target.id === id || l.target === id).length;
  }

  // Build an initial scale-free-ish network via growth + preferential attachment.
  function buildInitial() {
    nodes = [{ id: 0 }, { id: 1 }];
    links = [{ source: 0, target: 1 }];
    for (let i = 2; i < n0; i++) {
      const weights = nodes.map(n => degree(n.id) + 1);
      const total = weights.reduce((a, b) => a + b, 0);
      const chosen = new Set();
      while (chosen.size < Math.min(m, nodes.length)) {
        let r = Math.random() * total;
        for (let j = 0; j < nodes.length; j++) {
          r -= weights[j];
          if (r <= 0) { chosen.add(nodes[j].id); break; }
        }
      }
      nodes.push({ id: i });
      chosen.forEach(target => links.push({ source: i, target }));
    }
  }

  const sim = d3.forceSimulation()
    .force('link', d3.forceLink().id(d => d.id).distance(40))
    .force('charge', d3.forceManyBody().strength(-90))
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force('collide', d3.forceCollide(10));

  let linkSel = svg.append('g').selectAll('line');
  let nodeSel = svg.append('g').selectAll('circle');

  function countComponents() {
    const idToIdx = new Map(nodes.map((n, i) => [n.id, i]));
    const parent = nodes.map((_, i) => i);
    function find(x) { while (parent[x] !== x) { x = parent[x]; } return x; }
    function union(a, b) { const ra = find(a), rb = find(b); if (ra !== rb) parent[ra] = rb; }
    links.forEach(l => {
      const s = typeof l.source === 'object' ? l.source.id : l.source;
      const t = typeof l.target === 'object' ? l.target.id : l.target;
      union(idToIdx.get(s), idToIdx.get(t));
    });
    return new Set(nodes.map((_, i) => find(i))).size;
  }

  function updateStats() {
    if (statsEl) {
      statsEl.textContent = `nodes: ${nodes.length}  |  islands: ${countComponents()}`;
    }
  }

  function render() {
    linkSel = linkSel.data(links, d => (d.source.id ?? d.source) + '-' + (d.target.id ?? d.target));
    linkSel.exit().remove();
    linkSel = linkSel.enter().append('line')
      .attr('stroke', 'var(--accent-edge)').attr('stroke-opacity', 0.5)
      .merge(linkSel);

    nodeSel = nodeSel.data(nodes, d => d.id);
    nodeSel.exit().remove();
    nodeSel = nodeSel.enter().append('circle')
      .attr('r', 6).attr('fill', 'var(--accent-hub)')
      .merge(nodeSel)
      .attr('r', d => 4 + Math.sqrt(degree(d.id)) * 2.5);

    sim.nodes(nodes);
    sim.force('link').links(links);
    sim.alpha(0.8).restart();
    updateStats();
  }

  sim.on('tick', () => {
    linkSel.attr('x1', d => d.source.x).attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x).attr('y2', d => d.target.y);
    nodeSel.attr('cx', d => d.x).attr('cy', d => d.y);
  });

  function removeNodeById(id) {
    nodes = nodes.filter(n => n.id !== id);
    links = links.filter(l => {
      const s = typeof l.source === 'object' ? l.source.id : l.source;
      const t = typeof l.target === 'object' ? l.target.id : l.target;
      return s !== id && t !== id;
    });
    render();
  }

  function randomFailure() {
    if (nodes.length === 0) return;
    const victim = nodes[Math.floor(Math.random() * nodes.length)];
    removeNodeById(victim.id);
  }

  function targetedAttack() {
    if (nodes.length === 0) return;
    const hub = nodes.reduce((best, n) => degree(n.id) > degree(best.id) ? n : best, nodes[0]);
    removeNodeById(hub.id);
  }

  function reset() {
    buildInitial();
    render();
  }

  buildInitial();
  render();

  return { randomFailure, targetedAttack, reset };
}

// ---- 3. BFS ripple animation ----
// Lays out a small fixed graph, then on "run" spreads BFS layers
// outward from a start node, coloring nodes by their distance
// label — the "pebble in a pond" picture from Box 2.5.
function createBFSSim(container, opts = {}) {
  const width = container.clientWidth;
  const height = container.clientHeight;
  const svg = d3.select(container).append('svg').attr('width', width).attr('height', height);
  const statsEl = opts.statsEl;

  // A small hand-placed graph (positions in a 0..1 box, scaled to container).
  const layout = [
    [0.10, 0.50], [0.28, 0.25], [0.28, 0.75], [0.48, 0.45],
    [0.50, 0.85], [0.68, 0.20], [0.70, 0.60], [0.88, 0.45], [0.88, 0.80]
  ];
  const edges = [[0,1],[0,2],[1,3],[2,3],[2,4],[3,5],[3,6],[4,6],[5,7],[6,7],[6,8],[7,8]];

  const nodes = layout.map((p, i) => ({ id: i, x: p[0]*width, y: p[1]*height, dist: null }));
  const adj = nodes.map(() => []);
  edges.forEach(([a,b]) => { adj[a].push(b); adj[b].push(a); });

  svg.append('g').selectAll('line').data(edges).enter().append('line')
    .attr('x1', d => nodes[d[0]].x).attr('y1', d => nodes[d[0]].y)
    .attr('x2', d => nodes[d[1]].x).attr('y2', d => nodes[d[1]].y)
    .attr('stroke', 'var(--rule)').attr('stroke-width', 2);

  const palette = ['var(--accent-danger)','var(--accent-hub)','var(--accent-edge)','#7d8fb3','#556080'];
  function colorFor(d) { return d === null ? 'var(--bg-panel-2)' : palette[Math.min(d, palette.length-1)]; }

  const nodeG = svg.append('g').selectAll('g').data(nodes).enter().append('g');
  nodeG.append('circle')
    .attr('cx', d => d.x).attr('cy', d => d.y).attr('r', 15)
    .attr('fill', d => colorFor(d.dist))
    .attr('stroke', 'var(--bg)').attr('stroke-width', 2);
  nodeG.append('text')
    .attr('x', d => d.x).attr('y', d => d.y + 4).attr('text-anchor', 'middle')
    .attr('font-family', 'var(--font-mono)').attr('font-size', 12).attr('fill', 'var(--bg)')
    .text(d => d.dist === null ? '' : d.dist);

  function repaint() {
    nodeG.select('circle').transition().duration(300).attr('fill', d => colorFor(d.dist));
    nodeG.select('text').text(d => d.dist === null ? '' : d.dist);
    if (statsEl) {
      const reached = nodes.filter(n => n.dist !== null).length;
      const maxd = Math.max(0, ...nodes.filter(n => n.dist !== null).map(n => n.dist));
      statsEl.textContent = `reached: ${reached}/${nodes.length}  |  frontier distance: ${maxd}`;
    }
  }

  let timer = null;
  function run(start = 0) {
    if (timer) clearInterval(timer);
    nodes.forEach(n => n.dist = null);
    nodes[start].dist = 0;
    let frontier = [start];
    repaint();
    timer = setInterval(() => {
      const next = [];
      frontier.forEach(u => adj[u].forEach(v => {
        if (nodes[v].dist === null) { nodes[v].dist = nodes[u].dist + 1; next.push(v); }
      }));
      repaint();
      frontier = next;
      if (next.length === 0) { clearInterval(timer); timer = null; }
    }, 700);
  }

  function reset() {
    if (timer) { clearInterval(timer); timer = null; }
    nodes.forEach(n => n.dist = null);
    repaint();
  }

  reset();
  return { run, reset };
}

// ---- 4. Degree distribution histogram ----
// Builds a scale-free network by growth+preferential attachment,
// then draws its degree distribution p_k as a bar chart. Toggle
// between linear and log-log axes to show why the log plot is used.
function createDegreeDistSim(container, opts = {}) {
  const width = container.clientWidth;
  const height = container.clientHeight;
  const N = opts.N || 2000;
  const m = opts.m || 2;
  const svg = d3.select(container).append('svg').attr('width', width).attr('height', height);
  const pad = { l: 45, r: 15, t: 15, b: 35 };

  // Generate degrees via preferential attachment (no layout needed — just degrees).
  function generateDegrees() {
    const deg = [1, 1];
    const stubs = [0, 1]; // target list weighted by degree
    for (let i = 2; i < N; i++) {
      const chosen = new Set();
      while (chosen.size < Math.min(m, i)) {
        chosen.add(stubs[Math.floor(Math.random() * stubs.length)]);
      }
      deg[i] = chosen.size;
      chosen.forEach(t => { deg[t]++; stubs.push(t); stubs.push(i); });
    }
    return deg;
  }

  let logScale = false;
  const degrees = generateDegrees();

  function histogram() {
    const counts = {};
    degrees.forEach(k => { counts[k] = (counts[k] || 0) + 1; });
    return Object.entries(counts)
      .map(([k, c]) => ({ k: +k, p: c / degrees.length }))
      .filter(d => d.k > 0)
      .sort((a, b) => a.k - b.k);
  }
  const data = histogram();

  function draw() {
    svg.selectAll('*').remove();
    const iw = width - pad.l - pad.r;
    const ih = height - pad.t - pad.b;

    let x, y;
    if (logScale) {
      x = d3.scaleLog().domain([1, d3.max(data, d => d.k)]).range([pad.l, pad.l + iw]);
      y = d3.scaleLog().domain([d3.min(data, d => d.p), 1]).range([pad.t + ih, pad.t]);
    } else {
      x = d3.scaleLinear().domain([0, d3.max(data, d => d.k)]).range([pad.l, pad.l + iw]);
      y = d3.scaleLinear().domain([0, d3.max(data, d => d.p)]).range([pad.t + ih, pad.t]);
    }

    svg.append('g').attr('transform', `translate(0,${pad.t + ih})`)
      .call(d3.axisBottom(x).ticks(5, logScale ? '~s' : undefined))
      .attr('color', 'var(--ink-dim)').attr('font-family', 'var(--font-mono)');
    svg.append('g').attr('transform', `translate(${pad.l},0)`)
      .call(d3.axisLeft(y).ticks(5, logScale ? '~e' : undefined))
      .attr('color', 'var(--ink-dim)').attr('font-family', 'var(--font-mono)');

    svg.append('text').attr('x', pad.l + iw/2).attr('y', height - 4)
      .attr('text-anchor', 'middle').attr('fill', 'var(--ink-dim)')
      .attr('font-family', 'var(--font-mono)').attr('font-size', 11).text('degree k');
    svg.append('text').attr('transform', 'rotate(-90)').attr('x', -(pad.t + ih/2)).attr('y', 14)
      .attr('text-anchor', 'middle').attr('fill', 'var(--ink-dim)')
      .attr('font-family', 'var(--font-mono)').attr('font-size', 11).text('p(k)');

    svg.append('g').selectAll('circle').data(data).enter().append('circle')
      .attr('cx', d => x(d.k)).attr('cy', d => y(d.p)).attr('r', 3)
      .attr('fill', 'var(--accent-hub)');
  }

  function toggleScale() { logScale = !logScale; draw(); return logScale; }

  draw();
  return { toggleScale };
}

// ---- 5. Phase transition: giant component vs <k> ----
// A slider sets <k>; we build an Erdos-Renyi network at that
// average degree, draw it (giant component highlighted), and
// plot N_G/N on the theoretical curve so the jump at <k>=1 is
// visible both in the graph and on the curve.
function createPhaseTransitionSim(container, opts = {}) {
  const N = opts.N || 100;
  const W = container.clientWidth;
  const H = container.clientHeight;
  const graphW = Math.floor(W * 0.56);
  const plotW = W - graphW;

  const svg = d3.select(container).append('svg').attr('width', W).attr('height', H);
  const gGraph = svg.append('g');
  const gPlot = svg.append('g').attr('transform', `translate(${graphW},0)`);

  let nodes = [], links = [], sim = null;

  function buildER(avgK) {
    const p = avgK / (N - 1);
    nodes = d3.range(N).map(i => ({ id: i }));
    links = [];
    for (let i = 0; i < N; i++)
      for (let j = i + 1; j < N; j++)
        if (Math.random() < p) links.push({ source: i, target: j });
  }

  function giantComponentSet() {
    const parent = d3.range(N);
    const find = x => { while (parent[x] !== x) x = parent[x]; return x; };
    links.forEach(l => {
      const a = find(typeof l.source === 'object' ? l.source.id : l.source);
      const b = find(typeof l.target === 'object' ? l.target.id : l.target);
      if (a !== b) parent[a] = b;
    });
    const size = {};
    d3.range(N).forEach(i => { const r = find(i); size[r] = (size[r] || 0) + 1; });
    let best = -1, bestSize = 0;
    Object.entries(size).forEach(([r, s]) => { if (s > bestSize) { bestSize = s; best = +r; } });
    const inGC = new Set(d3.range(N).filter(i => find(i) === best));
    return { inGC, frac: bestSize / N };
  }

  // theoretical curve S = 1 - e^{-<k> S}
  function theoryFrac(avgK) {
    if (avgK <= 1) return 0;
    let S = 0.5;
    for (let it = 0; it < 100; it++) S = 1 - Math.exp(-avgK * S);
    return S;
  }

  const plotPad = { l: 40, r: 15, t: 20, b: 35 };
  const kMax = 4;
  const xk = d3.scaleLinear().domain([0, kMax]).range([plotPad.l, plotW - plotPad.r]);
  const yk = d3.scaleLinear().domain([0, 1]).range([H - plotPad.b, plotPad.t]);

  function drawPlot(currentK, empiricalFrac) {
    gPlot.selectAll('*').remove();
    // axes
    gPlot.append('g').attr('transform', `translate(0,${H - plotPad.b})`)
      .call(d3.axisBottom(xk).ticks(5)).attr('color', 'var(--ink-dim)').attr('font-family', 'var(--font-mono)');
    gPlot.append('g').attr('transform', `translate(${plotPad.l},0)`)
      .call(d3.axisLeft(yk).ticks(5)).attr('color', 'var(--ink-dim)').attr('font-family', 'var(--font-mono)');
    gPlot.append('text').attr('x', (plotPad.l + plotW - plotPad.r) / 2).attr('y', H - 4)
      .attr('text-anchor', 'middle').attr('fill', 'var(--ink-dim)').attr('font-family', 'var(--font-mono)').attr('font-size', 10).text('⟨k⟩');
    gPlot.append('text').attr('transform', 'rotate(-90)').attr('x', -(H / 2)).attr('y', 12)
      .attr('text-anchor', 'middle').attr('fill', 'var(--ink-dim)').attr('font-family', 'var(--font-mono)').attr('font-size', 10).text('N_G / N');
    // theory curve
    const curve = d3.range(0, kMax + 0.01, 0.05).map(k => [k, theoryFrac(k)]);
    gPlot.append('path').datum(curve)
      .attr('fill', 'none').attr('stroke', 'var(--accent-edge)').attr('stroke-width', 2)
      .attr('d', d3.line().x(d => xk(d[0])).y(d => yk(d[1])));
    // critical line at k=1
    gPlot.append('line').attr('x1', xk(1)).attr('x2', xk(1)).attr('y1', yk(0)).attr('y2', yk(1))
      .attr('stroke', 'var(--accent-danger)').attr('stroke-dasharray', '4 3').attr('stroke-width', 1);
    gPlot.append('text').attr('x', xk(1) + 4).attr('y', yk(1) + 10).attr('fill', 'var(--accent-danger)')
      .attr('font-family', 'var(--font-mono)').attr('font-size', 9).text('⟨k⟩=1');
    // current empirical dot
    gPlot.append('circle').attr('cx', xk(currentK)).attr('cy', yk(empiricalFrac)).attr('r', 5).attr('fill', 'var(--accent-hub)');
  }

  function render(avgK) {
    buildER(avgK);
    const { inGC, frac } = giantComponentSet();
    gGraph.selectAll('*').remove();
    const linkSel = gGraph.append('g').selectAll('line').data(links).enter().append('line')
      .attr('stroke', 'var(--rule)').attr('stroke-opacity', 0.6).attr('stroke-width', 1);
    const nodeSel = gGraph.append('g').selectAll('circle').data(nodes).enter().append('circle')
      .attr('r', 4).attr('fill', d => inGC.has(d.id) ? 'var(--accent-hub)' : 'var(--ink-dim)');

    if (sim) sim.stop();
    sim = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id(d => d.id).distance(22).strength(0.4))
      .force('charge', d3.forceManyBody().strength(-24))
      .force('center', d3.forceCenter(graphW / 2, H / 2))
      .force('collide', d3.forceCollide(6))
      .on('tick', () => {
        linkSel.attr('x1', d => d.source.x).attr('y1', d => d.source.y)
          .attr('x2', d => d.target.x).attr('y2', d => d.target.y);
        nodeSel.attr('cx', d => Math.max(5, Math.min(graphW - 5, d.x)))
          .attr('cy', d => Math.max(5, Math.min(H - 5, d.y)));
      });
    drawPlot(avgK, frac);
    if (opts.labelEl) opts.labelEl.textContent = `⟨k⟩ = ${avgK.toFixed(2)}  |  giant component = ${(frac*100).toFixed(0)}% of nodes`;
  }

  render(opts.initialK || 0.5);
  return { setK: render };
}

// ---- 6. Binomial vs Poisson degree distribution ----
function createBinomialPoissonSim(container, opts = {}) {
  const W = container.clientWidth, H = container.clientHeight;
  const svg = d3.select(container).append('svg').attr('width', W).attr('height', H);
  const pad = { l: 45, r: 15, t: 20, b: 35 };
  let avgK = opts.k || 10;
  let N = opts.N || 100;

  function factLn(n) { let s = 0; for (let i = 2; i <= n; i++) s += Math.log(i); return s; }
  function poisson(k, lam) { return Math.exp(-lam + k * Math.log(lam) - factLn(k)); }
  function binom(k, n, p) {
    const lnC = factLn(n) - factLn(k) - factLn(n - k);
    return Math.exp(lnC + k * Math.log(p) + (n - k) * Math.log(1 - p));
  }

  function draw() {
    svg.selectAll('*').remove();
    const p = avgK / (N - 1);
    const kMaxPlot = Math.min(N - 1, Math.ceil(avgK * 2.6));
    const ks = d3.range(0, kMaxPlot + 1);
    const binomData = ks.map(k => ({ k, v: binom(k, N - 1, p) }));
    const poisData = ks.map(k => ({ k, v: poisson(k, avgK) }));
    const yMax = d3.max([...binomData, ...poisData], d => d.v) * 1.1;

    const x = d3.scaleLinear().domain([0, kMaxPlot]).range([pad.l, W - pad.r]);
    const y = d3.scaleLinear().domain([0, yMax]).range([H - pad.b, pad.t]);

    svg.append('g').attr('transform', `translate(0,${H - pad.b})`).call(d3.axisBottom(x).ticks(6))
      .attr('color', 'var(--ink-dim)').attr('font-family', 'var(--font-mono)');
    svg.append('g').attr('transform', `translate(${pad.l},0)`).call(d3.axisLeft(y).ticks(5))
      .attr('color', 'var(--ink-dim)').attr('font-family', 'var(--font-mono)');
    svg.append('text').attr('x', (pad.l + W - pad.r)/2).attr('y', H - 4).attr('text-anchor', 'middle')
      .attr('fill', 'var(--ink-dim)').attr('font-family', 'var(--font-mono)').attr('font-size', 10).text('degree k');
    svg.append('text').attr('transform', 'rotate(-90)').attr('x', -(H/2)).attr('y', 12).attr('text-anchor', 'middle')
      .attr('fill', 'var(--ink-dim)').attr('font-family', 'var(--font-mono)').attr('font-size', 10).text('p(k)');

    // binomial bars
    const bw = (x(1) - x(0)) * 0.6;
    svg.append('g').selectAll('rect').data(binomData).enter().append('rect')
      .attr('x', d => x(d.k) - bw/2).attr('y', d => y(d.v)).attr('width', bw)
      .attr('height', d => (H - pad.b) - y(d.v)).attr('fill', 'var(--accent-edge)').attr('opacity', 0.5);
    // poisson line + dots
    svg.append('path').datum(poisData).attr('fill', 'none').attr('stroke', 'var(--accent-hub)').attr('stroke-width', 2)
      .attr('d', d3.line().x(d => x(d.k)).y(d => y(d.v)));
    svg.append('g').selectAll('circle').data(poisData).enter().append('circle')
      .attr('cx', d => x(d.k)).attr('cy', d => y(d.v)).attr('r', 2.5).attr('fill', 'var(--accent-hub)');

    // legend
    svg.append('rect').attr('x', W - 150).attr('y', pad.t).attr('width', 10).attr('height', 10).attr('fill', 'var(--accent-edge)').attr('opacity', 0.5);
    svg.append('text').attr('x', W - 135).attr('y', pad.t + 9).attr('fill', 'var(--ink-dim)').attr('font-family', 'var(--font-mono)').attr('font-size', 10).text(`binomial (N=${N})`);
    svg.append('circle').attr('cx', W - 145).attr('cy', pad.t + 24).attr('r', 4).attr('fill', 'var(--accent-hub)');
    svg.append('text').attr('x', W - 135).attr('y', pad.t + 28).attr('fill', 'var(--ink-dim)').attr('font-family', 'var(--font-mono)').attr('font-size', 10).text('Poisson');
  }

  draw();
  return {
    setK: v => { avgK = v; draw(); },
    setN: v => { N = v; draw(); }
  };
}

// ---- 7. Small world vs lattice scaling ----
function createSmallWorldSim(container, opts = {}) {
  const W = container.clientWidth, H = container.clientHeight;
  const svg = d3.select(container).append('svg').attr('width', W).attr('height', H);
  const pad = { l: 55, r: 20, t: 20, b: 40 };
  let logScale = opts.log || false;
  const avgK = opts.k || 4;

  const Ns = d3.range(2, 7.01, 0.1).map(e => Math.pow(10, e)); // 10^2 .. 10^7
  const random = Ns.map(n => ({ n, d: Math.log(n) / Math.log(avgK) }));
  const lat2d = Ns.map(n => ({ n, d: Math.sqrt(n) }));
  const lat3d = Ns.map(n => ({ n, d: Math.cbrt(n) }));

  function draw() {
    svg.selectAll('*').remove();
    const all = [...random, ...lat2d, ...lat3d];
    const x = d3.scaleLog().domain([100, 1e7]).range([pad.l, W - pad.r]);
    const y = logScale
      ? d3.scaleLog().domain([1, d3.max(all, d => d.d)]).range([H - pad.b, pad.t])
      : d3.scaleLinear().domain([0, d3.max(random, d => d.d) * 3]).range([H - pad.b, pad.t]);

    svg.append('g').attr('transform', `translate(0,${H - pad.b})`).call(d3.axisBottom(x).ticks(5, '~s'))
      .attr('color', 'var(--ink-dim)').attr('font-family', 'var(--font-mono)');
    svg.append('g').attr('transform', `translate(${pad.l},0)`).call(d3.axisLeft(y).ticks(5, logScale ? '~s' : undefined))
      .attr('color', 'var(--ink-dim)').attr('font-family', 'var(--font-mono)');
    svg.append('text').attr('x', (pad.l + W - pad.r)/2).attr('y', H - 6).attr('text-anchor', 'middle')
      .attr('fill', 'var(--ink-dim)').attr('font-family', 'var(--font-mono)').attr('font-size', 10).text('network size N');
    svg.append('text').attr('transform', 'rotate(-90)').attr('x', -(H/2)).attr('y', 14).attr('text-anchor', 'middle')
      .attr('fill', 'var(--ink-dim)').attr('font-family', 'var(--font-mono)').attr('font-size', 10).text('⟨d⟩');

    const line = d3.line().x(d => x(d.n)).y(d => y(Math.max(d.d, logScale ? 1 : 0)));
    const series = [
      { data: lat2d, color: 'var(--accent-danger)', label: '2D lattice  √N' },
      { data: lat3d, color: '#c9a36a', label: '3D lattice  N^⅓' },
      { data: random, color: 'var(--accent-hub)', label: 'random  ln N / ln⟨k⟩' }
    ];
    series.forEach((s, i) => {
      svg.append('path').datum(s.data).attr('fill', 'none').attr('stroke', s.color).attr('stroke-width', 2.5).attr('d', line);
      svg.append('text').attr('x', pad.l + 10).attr('y', pad.t + 12 + i * 14).attr('fill', s.color)
        .attr('font-family', 'var(--font-mono)').attr('font-size', 10).text(s.label);
    });
  }

  draw();
  return { toggleScale: () => { logScale = !logScale; draw(); return logScale; } };
}

// ---- 8. Watts-Strogatz rewiring ----
// A ring lattice; a slider rewires a fraction of links to random
// targets. Shows path length collapsing while clustering stays high.
function createWattsStrogatzSim(container, opts = {}) {
  const N = opts.N || 24;
  const kEach = opts.kEach || 4; // neighbors on each side total
  const W = container.clientWidth, H = container.clientHeight;
  const R = Math.min(W, H) / 2 - 30;
  const cx = W / 2, cy = H / 2;
  const svg = d3.select(container).append('svg').attr('width', W).attr('height', H);

  const pos = d3.range(N).map(i => {
    const a = (i / N) * 2 * Math.PI - Math.PI / 2;
    return { id: i, x: cx + R * Math.cos(a), y: cy + R * Math.sin(a) };
  });

  // base ring edges
  function baseEdges() {
    const e = [];
    for (let i = 0; i < N; i++)
      for (let d = 1; d <= kEach / 2; d++)
        e.push({ a: i, b: (i + d) % N, rewired: false });
    return e;
  }

  function rewire(frac) {
    const edges = baseEdges();
    edges.forEach(e => {
      if (Math.random() < frac) {
        let t = Math.floor(Math.random() * N);
        let guard = 0;
        while ((t === e.a || edges.some(x => (x.a === e.a && x.b === t) || (x.a === t && x.b === e.a))) && guard < 20) {
          t = Math.floor(Math.random() * N); guard++;
        }
        e.b = t; e.rewired = true;
      }
    });
    return edges;
  }

  // BFS average path length + clustering, for the label
  function metrics(edges) {
    const adj = d3.range(N).map(() => new Set());
    edges.forEach(e => { adj[e.a].add(e.b); adj[e.b].add(e.a); });
    // avg path
    let total = 0, pairs = 0;
    for (let s = 0; s < N; s++) {
      const dist = new Array(N).fill(-1); dist[s] = 0;
      const q = [s];
      while (q.length) { const u = q.shift(); adj[u].forEach(v => { if (dist[v] < 0) { dist[v] = dist[u] + 1; q.push(v); } }); }
      for (let t = 0; t < N; t++) if (t !== s && dist[t] > 0) { total += dist[t]; pairs++; }
    }
    const avgD = pairs ? total / pairs : 0;
    // clustering
    let cSum = 0;
    for (let i = 0; i < N; i++) {
      const nb = [...adj[i]]; const ki = nb.length;
      if (ki < 2) continue;
      let li = 0;
      for (let a = 0; a < nb.length; a++) for (let b = a + 1; b < nb.length; b++) if (adj[nb[a]].has(nb[b])) li++;
      cSum += (2 * li) / (ki * (ki - 1));
    }
    return { avgD, avgC: cSum / N };
  }

  function render(frac) {
    const edges = rewire(frac);
    svg.selectAll('*').remove();
    svg.append('g').selectAll('line').data(edges).enter().append('line')
      .attr('x1', d => pos[d.a].x).attr('y1', d => pos[d.a].y)
      .attr('x2', d => pos[d.b].x).attr('y2', d => pos[d.b].y)
      .attr('stroke', d => d.rewired ? 'var(--accent-hub)' : 'var(--rule)')
      .attr('stroke-width', d => d.rewired ? 1.8 : 1)
      .attr('stroke-opacity', d => d.rewired ? 0.9 : 0.55);
    svg.append('g').selectAll('circle').data(pos).enter().append('circle')
      .attr('cx', d => d.x).attr('cy', d => d.y).attr('r', 5).attr('fill', 'var(--accent-edge)');
    const m = metrics(edges);
    if (opts.labelEl) opts.labelEl.textContent = `rewiring p = ${frac.toFixed(3)}  |  ⟨d⟩ = ${m.avgD.toFixed(2)}  |  ⟨C⟩ = ${m.avgC.toFixed(2)}`;
  }

  render(opts.initialP || 0);
  return { setP: render };
}

// ---- 9. Poisson vs power-law degree distribution ----
// Overlays a Poisson and a power law with the SAME <k>, on
// linear or log-log axes, so the fat tail (hubs) is visible.
function createPoissonPowerlawSim(container, opts = {}) {
  const W = container.clientWidth, H = container.clientHeight;
  const svg = d3.select(container).append('svg').attr('width', W).attr('height', H);
  const pad = { l: 55, r: 20, t: 20, b: 38 };
  let logScale = opts.log !== undefined ? opts.log : true;
  const avgK = opts.k || 11;
  const gamma = opts.gamma || 2.1;
  const kmin = 1, kmax = 1000;

  function factLn(n) { let s = 0; for (let i = 2; i <= n; i++) s += Math.log(i); return s; }
  function poisson(k) { return Math.exp(-avgK + k * Math.log(avgK) - factLn(k)); }
  // normalized discrete power law over [kmin, kmax]
  let Z = 0; for (let k = kmin; k <= kmax; k++) Z += Math.pow(k, -gamma);
  function powerlaw(k) { return Math.pow(k, -gamma) / Z; }

  function draw() {
    svg.selectAll('*').remove();
    const ks = d3.range(1, 200);
    const pois = ks.map(k => ({ k, v: poisson(k) })).filter(d => d.v > 1e-12);
    const pl = ks.map(k => ({ k, v: powerlaw(k) })).filter(d => d.v > 1e-12);

    let x, y;
    if (logScale) {
      x = d3.scaleLog().domain([1, 200]).range([pad.l, W - pad.r]);
      y = d3.scaleLog().domain([1e-8, 1]).range([H - pad.b, pad.t]);
    } else {
      x = d3.scaleLinear().domain([0, 40]).range([pad.l, W - pad.r]);
      y = d3.scaleLinear().domain([0, Math.max(d3.max(pois, d=>d.v), 0.15)]).range([H - pad.b, pad.t]);
    }

    svg.append('g').attr('transform', `translate(0,${H - pad.b})`).call(d3.axisBottom(x).ticks(6, logScale ? '~s' : undefined))
      .attr('color', 'var(--ink-dim)').attr('font-family', 'var(--font-mono)');
    svg.append('g').attr('transform', `translate(${pad.l},0)`).call(d3.axisLeft(y).ticks(5, logScale ? '~e' : undefined))
      .attr('color', 'var(--ink-dim)').attr('font-family', 'var(--font-mono)');
    svg.append('text').attr('x', (pad.l + W - pad.r)/2).attr('y', H - 4).attr('text-anchor', 'middle')
      .attr('fill', 'var(--ink-dim)').attr('font-family', 'var(--font-mono)').attr('font-size', 10).text('degree k');
    svg.append('text').attr('transform', 'rotate(-90)').attr('x', -(H/2)).attr('y', 14).attr('text-anchor', 'middle')
      .attr('fill', 'var(--ink-dim)').attr('font-family', 'var(--font-mono)').attr('font-size', 10).text('p(k)');

    const line = d3.line().x(d => x(d.k)).y(d => y(Math.max(d.v, logScale ? 1e-8 : 0))).defined(d => d.v > 0);
    svg.append('path').datum(pois).attr('fill','none').attr('stroke','var(--accent-edge)').attr('stroke-width',2.5).attr('d', line);
    svg.append('path').datum(pl).attr('fill','none').attr('stroke','var(--accent-hub)').attr('stroke-width',2.5).attr('d', line);

    svg.append('circle').attr('cx', W-140).attr('cy', pad.t+4).attr('r',4).attr('fill','var(--accent-edge)');
    svg.append('text').attr('x', W-132).attr('y', pad.t+8).attr('fill','var(--ink-dim)').attr('font-family','var(--font-mono)').attr('font-size',10).text('Poisson (random)');
    svg.append('circle').attr('cx', W-140).attr('cy', pad.t+20).attr('r',4).attr('fill','var(--accent-hub)');
    svg.append('text').attr('x', W-132).attr('y', pad.t+24).attr('fill','var(--ink-dim)').attr('font-family','var(--font-mono)').attr('font-size',10).text(`power law γ=${gamma}`);
  }

  draw();
  return { toggleScale: () => { logScale = !logScale; draw(); return logScale; } };
}

// ---- 10. Scale-free network via preferential attachment (static display) ----
// Grows a BA network to N nodes and shows it with node size / color
// scaled by degree, so the hubs stand out. Just a visual.
function createScaleFreeDisplay(container, opts = {}) {
  const N = opts.N || 120;
  const m = opts.m || 1;
  const W = container.clientWidth, H = container.clientHeight;
  const svg = d3.select(container).append('svg').attr('width', W).attr('height', H);

  let nodes = [{ id: 0 }, { id: 1 }];
  let links = [{ source: 0, target: 1 }];
  const targets = [0, 1];
  for (let i = 2; i < N; i++) {
    const chosen = new Set();
    while (chosen.size < Math.min(m, i)) chosen.add(targets[Math.floor(Math.random() * targets.length)]);
    nodes.push({ id: i });
    chosen.forEach(t => { links.push({ source: i, target: t }); targets.push(t); targets.push(i); });
  }
  const deg = {};
  links.forEach(l => { deg[l.source] = (deg[l.source]||0)+1; deg[l.target] = (deg[l.target]||0)+1; });
  const maxDeg = Math.max(...Object.values(deg));

  const linkSel = svg.append('g').selectAll('line').data(links).enter().append('line')
    .attr('stroke', 'var(--rule)').attr('stroke-opacity', 0.5);
  const nodeSel = svg.append('g').selectAll('circle').data(nodes).enter().append('circle')
    .attr('r', d => 2 + Math.sqrt(deg[d.id] || 1) * 2.2)
    .attr('fill', d => (deg[d.id]||1) > maxDeg * 0.4 ? 'var(--accent-hub)' : (deg[d.id]||1) > maxDeg*0.15 ? '#c9884e' : 'var(--accent-edge)');

  const sim = d3.forceSimulation(nodes)
    .force('link', d3.forceLink(links).id(d => d.id).distance(24).strength(0.3))
    .force('charge', d3.forceManyBody().strength(-30))
    .force('center', d3.forceCenter(W/2, H/2))
    .force('collide', d3.forceCollide(d => 3 + Math.sqrt(deg[d.id]||1)*2.2))
    .on('tick', () => {
      linkSel.attr('x1',d=>d.source.x).attr('y1',d=>d.source.y).attr('x2',d=>d.target.x).attr('y2',d=>d.target.y);
      nodeSel.attr('cx',d=>Math.max(6,Math.min(W-6,d.x))).attr('cy',d=>Math.max(6,Math.min(H-6,d.y)));
    });
  return {};
}

// ---- 11. k_max vs N: scale-free (polynomial) vs random (log) ----
function createKmaxSim(container, opts = {}) {
  const W = container.clientWidth, H = container.clientHeight;
  const svg = d3.select(container).append('svg').attr('width', W).attr('height', H);
  const pad = { l: 60, r: 20, t: 20, b: 40 };
  const gamma = opts.gamma || 2.5, kmin = 1, lam = 1;
  const Ns = d3.range(2, 12.01, 0.1).map(e => Math.pow(10, e));
  const sf = Ns.map(n => ({ n, v: kmin * Math.pow(n, 1/(gamma-1)) }));
  const rand = Ns.map(n => ({ n, v: kmin + Math.log(n)/lam }));

  const x = d3.scaleLog().domain([1e2, 1e12]).range([pad.l, W - pad.r]);
  const y = d3.scaleLog().domain([1, 1e6]).range([H - pad.b, pad.t]);

  svg.append('g').attr('transform', `translate(0,${H - pad.b})`).call(d3.axisBottom(x).ticks(6, '~s'))
    .attr('color','var(--ink-dim)').attr('font-family','var(--font-mono)');
  svg.append('g').attr('transform', `translate(${pad.l},0)`).call(d3.axisLeft(y).ticks(6, '~s'))
    .attr('color','var(--ink-dim)').attr('font-family','var(--font-mono)');
  svg.append('text').attr('x',(pad.l+W-pad.r)/2).attr('y',H-6).attr('text-anchor','middle')
    .attr('fill','var(--ink-dim)').attr('font-family','var(--font-mono)').attr('font-size',10).text('network size N');
  svg.append('text').attr('transform','rotate(-90)').attr('x',-(H/2)).attr('y',16).attr('text-anchor','middle')
    .attr('fill','var(--ink-dim)').attr('font-family','var(--font-mono)').attr('font-size',10).text('k_max (largest hub)');

  const line = d3.line().x(d => x(d.n)).y(d => y(Math.max(d.v,1)));
  svg.append('path').datum(sf).attr('fill','none').attr('stroke','var(--accent-hub)').attr('stroke-width',2.5).attr('d', line);
  svg.append('path').datum(rand).attr('fill','none').attr('stroke','var(--accent-edge)').attr('stroke-width',2.5).attr('d', line);
  svg.append('text').attr('x', pad.l+10).attr('y', pad.t+12).attr('fill','var(--accent-hub)').attr('font-family','var(--font-mono)').attr('font-size',10).text(`scale-free  N^(1/(γ-1))`);
  svg.append('text').attr('x', pad.l+10).attr('y', pad.t+26).attr('fill','var(--accent-edge)').attr('font-family','var(--font-mono)').attr('font-size',10).text('random  ln N');
  return {};
}

// ---- 12. Power-law plotting: the four-way binning comparison ----
// Same synthetic power-law data plotted 4 ways to show why
// log-binning / cumulative beat linear binning (Image 4.22).
function createBinningSim(container, opts = {}) {
  const W = container.clientWidth, H = container.clientHeight;
  const svg = d3.select(container).append('svg').attr('width', W).attr('height', H);
  const pad = { l: 55, r: 20, t: 30, b: 38 };
  const gamma = 2.5, k0 = 10, Npts = 50000;

  // sample degrees from p ~ (k+k0)^-gamma via inverse transform on a grid
  const grid = d3.range(1, 5000);
  let cum = 0; const cdf = grid.map(k => { cum += Math.pow(k + k0, -gamma); return cum; });
  const total = cum;
  const degrees = [];
  for (let i = 0; i < Npts; i++) {
    const r = Math.random() * total;
    let lo = 0, hi = grid.length - 1;
    while (lo < hi) { const mid = (lo+hi)>>1; if (cdf[mid] < r) lo = mid+1; else hi = mid; }
    degrees.push(grid[lo]);
  }

  const modes = ['linear', 'logbin', 'cumulative'];
  let mode = 0;

  function linHist() {
    const c = {}; degrees.forEach(k => c[k]=(c[k]||0)+1);
    return Object.entries(c).map(([k,n]) => ({ k:+k, p:n/Npts })).filter(d=>d.p>0);
  }
  function logHist() {
    const bins = []; let edge = 1;
    while (edge < 5000) { bins.push([edge, edge*2]); edge *= 2; }
    return bins.map(([a,b]) => {
      const cnt = degrees.filter(k => k>=a && k<b).length;
      return { k: Math.sqrt(a*b), p: cnt/Npts/(b-a) };
    }).filter(d => d.p > 0);
  }
  function cumDist() {
    const c = {}; degrees.forEach(k => c[k]=(c[k]||0)+1);
    const ks = Object.keys(c).map(Number).sort((a,b)=>a-b);
    let running = Npts; const out = [];
    ks.forEach(k => { out.push({ k, p: running/Npts }); running -= c[k]; });
    return out.filter(d => d.p > 0);
  }

  function draw() {
    svg.selectAll('*').remove();
    let data, title;
    if (mode === 0) { data = linHist(); title = 'linear binning — note the noisy plateau in the tail'; }
    else if (mode === 1) { data = logHist(); title = 'logarithmic binning — clean scaling into the tail'; }
    else { data = cumDist(); title = 'cumulative distribution — clean, shifted slope (γ−1)'; }

    const x = d3.scaleLog().domain([1, 5000]).range([pad.l, W-pad.r]);
    const y = d3.scaleLog().domain([d3.min(data,d=>d.p), d3.max(data,d=>d.p)]).range([H-pad.b, pad.t]);
    svg.append('g').attr('transform',`translate(0,${H-pad.b})`).call(d3.axisBottom(x).ticks(6,'~s')).attr('color','var(--ink-dim)').attr('font-family','var(--font-mono)');
    svg.append('g').attr('transform',`translate(${pad.l},0)`).call(d3.axisLeft(y).ticks(5,'~e')).attr('color','var(--ink-dim)').attr('font-family','var(--font-mono)');
    svg.append('text').attr('x',(pad.l+W-pad.r)/2).attr('y',16).attr('text-anchor','middle').attr('fill','var(--accent-hub)').attr('font-family','var(--font-mono)').attr('font-size',11).text(title);
    svg.append('text').attr('x',(pad.l+W-pad.r)/2).attr('y',H-4).attr('text-anchor','middle').attr('fill','var(--ink-dim)').attr('font-family','var(--font-mono)').attr('font-size',10).text('degree k');
    svg.append('g').selectAll('circle').data(data).enter().append('circle')
      .attr('cx',d=>x(d.k)).attr('cy',d=>y(d.p)).attr('r',2.5).attr('fill','var(--accent-hub)');
  }

  draw();
  return { cycle: () => { mode = (mode+1) % modes.length; draw(); return modes[mode]; } };
}

// ---- 13. Degree dynamics: k_i(t) = m (t/t_i)^{1/2} ----
// Plots the growth curves of nodes added at different times.
function createDegreeDynamicsSim(container, opts = {}) {
  const W = container.clientWidth, H = container.clientHeight;
  const svg = d3.select(container).append('svg').attr('width', W).attr('height', H);
  const pad = { l: 55, r: 20, t: 20, b: 40 };
  const m = opts.m || 2;
  const tMax = 1e6;
  const tis = [1, 10, 100, 1000, 10000, 100000];
  const colors = ['var(--accent-hub)', '#d59a5b', '#b7a56a', 'var(--accent-edge)', '#6f9fb5', '#7d8fb3'];

  const x = d3.scaleLog().domain([1, tMax]).range([pad.l, W - pad.r]);
  const y = d3.scaleLog().domain([m, 2000]).range([H - pad.b, pad.t]);

  svg.append('g').attr('transform', `translate(0,${H - pad.b})`).call(d3.axisBottom(x).ticks(6, '~s'))
    .attr('color', 'var(--ink-dim)').attr('font-family', 'var(--font-mono)');
  svg.append('g').attr('transform', `translate(${pad.l},0)`).call(d3.axisLeft(y).ticks(5, '~s'))
    .attr('color', 'var(--ink-dim)').attr('font-family', 'var(--font-mono)');
  svg.append('text').attr('x', (pad.l + W - pad.r)/2).attr('y', H - 6).attr('text-anchor', 'middle')
    .attr('fill', 'var(--ink-dim)').attr('font-family', 'var(--font-mono)').attr('font-size', 10).text('time t');
  svg.append('text').attr('transform', 'rotate(-90)').attr('x', -(H/2)).attr('y', 14).attr('text-anchor', 'middle')
    .attr('fill', 'var(--ink-dim)').attr('font-family', 'var(--font-mono)').attr('font-size', 10).text('degree k(t)');

  const line = d3.line().x(d => x(d.t)).y(d => y(d.k));
  tis.forEach((ti, idx) => {
    const pts = [];
    for (let e = Math.log10(ti); e <= 6; e += 0.1) {
      const t = Math.pow(10, e);
      pts.push({ t, k: m * Math.sqrt(t / ti) });
    }
    svg.append('path').datum(pts).attr('fill', 'none').attr('stroke', colors[idx % colors.length])
      .attr('stroke-width', 2).attr('d', line);
  });
  svg.append('text').attr('x', pad.l + 10).attr('y', pad.t + 10).attr('fill', 'var(--accent-hub)')
    .attr('font-family', 'var(--font-mono)').attr('font-size', 10).text('earlier nodes (small tᵢ) ride higher →  β = ½');
  return {};
}

// ---- 14. Nonlinear preferential attachment: alpha slider ----
// Grows a network with Pi(k) ~ k^alpha and shows it + the largest hub size.
function createNonlinearPASim(container, opts = {}) {
  const N = opts.N || 150;
  const W = container.clientWidth, H = container.clientHeight;
  const svg = d3.select(container).append('svg').attr('width', W).attr('height', H);
  let sim = null;

  function build(alpha) {
    let nodes = [{ id: 0 }, { id: 1 }];
    let links = [{ source: 0, target: 1 }];
    const deg = { 0: 1, 1: 1 };
    for (let i = 2; i < N; i++) {
      // weight each node by k^alpha
      const ids = Object.keys(deg).map(Number);
      const weights = ids.map(id => Math.pow(deg[id], alpha));
      const total = weights.reduce((a, b) => a + b, 0);
      let r = Math.random() * total, chosen = ids[0];
      for (let j = 0; j < ids.length; j++) { r -= weights[j]; if (r <= 0) { chosen = ids[j]; break; } }
      nodes.push({ id: i });
      links.push({ source: i, target: chosen });
      deg[i] = 1; deg[chosen] = (deg[chosen] || 0) + 1;
    }
    return { nodes, links, deg };
  }

  function render(alpha) {
    const { nodes, links, deg } = build(alpha);
    const maxDeg = Math.max(...Object.values(deg));
    svg.selectAll('*').remove();
    const linkSel = svg.append('g').selectAll('line').data(links).enter().append('line')
      .attr('stroke', 'var(--rule)').attr('stroke-opacity', 0.5);
    const nodeSel = svg.append('g').selectAll('circle').data(nodes).enter().append('circle')
      .attr('r', d => 2 + Math.sqrt(deg[d.id] || 1) * 2)
      .attr('fill', d => (deg[d.id] || 1) > maxDeg * 0.5 ? 'var(--accent-hub)' : (deg[d.id]||1) > maxDeg*0.2 ? '#c9884e' : 'var(--accent-edge)');
    if (sim) sim.stop();
    sim = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id(d => d.id).distance(20).strength(0.3))
      .force('charge', d3.forceManyBody().strength(-25))
      .force('center', d3.forceCenter(W/2, H/2))
      .force('collide', d3.forceCollide(d => 3 + Math.sqrt(deg[d.id]||1)*2))
      .on('tick', () => {
        linkSel.attr('x1',d=>d.source.x).attr('y1',d=>d.source.y).attr('x2',d=>d.target.x).attr('y2',d=>d.target.y);
        nodeSel.attr('cx',d=>Math.max(6,Math.min(W-6,d.x))).attr('cy',d=>Math.max(6,Math.min(H-6,d.y)));
      });
    if (opts.labelEl) {
      const regime = alpha < 1 ? 'sublinear — hubs suppressed (stretched exponential)'
        : alpha > 1 ? 'superlinear — winner takes all (super-hub)'
        : 'linear — pure scale-free (γ = 3)';
      opts.labelEl.textContent = `α = ${alpha.toFixed(1)}  |  largest hub = ${maxDeg} links  |  ${regime}`;
    }
  }

  render(opts.initialAlpha || 1);
  return { setAlpha: render };
}

// ---- 15. Model A (no PA) vs BA: exponential vs power law ----
function createModelABSim(container, opts = {}) {
  const W = container.clientWidth, H = container.clientHeight;
  const svg = d3.select(container).append('svg').attr('width', W).attr('height', H);
  const pad = { l: 55, r: 20, t: 20, b: 38 };
  const N = 30000, m = 2;
  let logScale = true;

  function grow(preferential) {
    const deg = { 0: 1, 1: 1 };
    const targets = [0, 1];
    for (let i = 2; i < N; i++) {
      let chosen;
      if (preferential) chosen = targets[Math.floor(Math.random() * targets.length)];
      else chosen = Math.floor(Math.random() * i);
      deg[i] = 1; deg[chosen] = (deg[chosen] || 0) + 1;
      targets.push(chosen, i);
    }
    return deg;
  }
  function hist(deg) {
    const c = {}; Object.values(deg).forEach(k => c[k] = (c[k]||0)+1);
    const tot = Object.keys(deg).length;
    return Object.entries(c).map(([k,n]) => ({ k:+k, p:n/tot })).filter(d=>d.k>0).sort((a,b)=>a.k-b.k);
  }
  const ba = hist(grow(true));
  const ma = hist(grow(false));

  function draw() {
    svg.selectAll('*').remove();
    const all = [...ba, ...ma];
    const x = logScale ? d3.scaleLog().domain([1, d3.max(all,d=>d.k)]).range([pad.l, W-pad.r])
                       : d3.scaleLinear().domain([0, 40]).range([pad.l, W-pad.r]);
    const y = logScale ? d3.scaleLog().domain([1e-6, 1]).range([H-pad.b, pad.t])
                       : d3.scaleLinear().domain([0, d3.max(all,d=>d.p)]).range([H-pad.b, pad.t]);
    svg.append('g').attr('transform',`translate(0,${H-pad.b})`).call(d3.axisBottom(x).ticks(6, logScale?'~s':undefined)).attr('color','var(--ink-dim)').attr('font-family','var(--font-mono)');
    svg.append('g').attr('transform',`translate(${pad.l},0)`).call(d3.axisLeft(y).ticks(5, logScale?'~e':undefined)).attr('color','var(--ink-dim)').attr('font-family','var(--font-mono)');
    svg.append('text').attr('x',(pad.l+W-pad.r)/2).attr('y',H-4).attr('text-anchor','middle').attr('fill','var(--ink-dim)').attr('font-family','var(--font-mono)').attr('font-size',10).text('degree k');

    const dots = (data, color) => svg.append('g').selectAll(null).data(data.filter(d=>d.p>0)).enter().append('circle')
      .attr('cx',d=>x(d.k)).attr('cy',d=>y(d.p)).attr('r',2.4).attr('fill',color);
    dots(ba, 'var(--accent-hub)');
    dots(ma, 'var(--accent-edge)');
    svg.append('circle').attr('cx',W-180).attr('cy',pad.t+4).attr('r',4).attr('fill','var(--accent-hub)');
    svg.append('text').attr('x',W-172).attr('y',pad.t+8).attr('fill','var(--ink-dim)').attr('font-family','var(--font-mono)').attr('font-size',10).text('BA (power law, γ=3)');
    svg.append('circle').attr('cx',W-180).attr('cy',pad.t+20).attr('r',4).attr('fill','var(--accent-edge)');
    svg.append('text').attr('x',W-172).attr('y',pad.t+24).attr('fill','var(--ink-dim)').attr('font-family','var(--font-mono)').attr('font-size',10).text('Model A (exponential)');
  }
  draw();
  return { toggleScale: () => { logScale = !logScale; draw(); return logScale; } };
}

// ---- 16. Bianconi-Barabasi fitness growth ----
// Grows a network where each node has a random fitness (color);
// attachment ~ fitness x degree. High-fitness latecomers overtake.
function createFitnessGrowthSim(container, opts = {}) {
  const W = container.clientWidth, H = container.clientHeight;
  const svg = d3.select(container).append('svg').attr('width', W).attr('height', H);
  const m = opts.m || 1;
  const fitColor = d3.scaleSequential(d3.interpolatePlasma).domain([0, 1]);

  let nodes = [{ id: 0, fit: 0.5, deg: 1 }, { id: 1, fit: 0.5, deg: 1 }];
  let links = [{ source: 0, target: 1 }];
  let sim = null;

  function draw() {
    const maxDeg = Math.max(...nodes.map(n => n.deg));
    const linkSel = svg.selectAll('line').data(links);
    linkSel.exit().remove();
    linkSel.enter().append('line').attr('stroke', 'var(--rule)').attr('stroke-opacity', 0.5);

    const nodeSel = svg.selectAll('circle').data(nodes, d => d.id);
    nodeSel.exit().remove();
    nodeSel.enter().append('circle').merge(nodeSel)
      .attr('r', d => 3 + Math.sqrt(d.deg) * 2.4)
      .attr('fill', d => fitColor(d.fit))
      .attr('stroke', d => d.deg === maxDeg ? 'var(--ink)' : 'none')
      .attr('stroke-width', 2);

    if (sim) sim.stop();
    sim = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id(d => d.id).distance(24).strength(0.3))
      .force('charge', d3.forceManyBody().strength(-30))
      .force('center', d3.forceCenter(W/2, H/2))
      .force('collide', d3.forceCollide(d => 4 + Math.sqrt(d.deg)*2.4))
      .on('tick', () => {
        svg.selectAll('line').attr('x1',d=>d.source.x).attr('y1',d=>d.source.y).attr('x2',d=>d.target.x).attr('y2',d=>d.target.y);
        svg.selectAll('circle').attr('cx',d=>Math.max(8,Math.min(W-8,d.x))).attr('cy',d=>Math.max(8,Math.min(H-8,d.y)));
      });
  }

  function addNode() {
    const id = nodes.length;
    const fit = Math.random();
    // weight = fitness * degree
    const weights = nodes.map(n => n.fit * n.deg);
    const total = weights.reduce((a,b)=>a+b,0);
    const chosen = new Set();
    while (chosen.size < Math.min(m, nodes.length)) {
      let r = Math.random() * total;
      for (let i = 0; i < nodes.length; i++) { r -= weights[i]; if (r <= 0) { chosen.add(nodes[i].id); break; } }
    }
    const newNode = { id, fit, deg: 0 };
    nodes.push(newNode);
    chosen.forEach(tid => { links.push({ source: id, target: tid }); newNode.deg++; nodes.find(n=>n.id===tid).deg++; });
    draw();
  }

  function reset() {
    nodes = [{ id: 0, fit: 0.5, deg: 1 }, { id: 1, fit: 0.5, deg: 1 }];
    links = [{ source: 0, target: 1 }];
    svg.selectAll('*').remove();
    draw();
  }

  draw();
  return { addNode, reset };
}

// ---- 17. Fitness degree dynamics: k(t)=m(t/ti)^{eta/C} ----
function createFitnessDynamicsSim(container, opts = {}) {
  const W = container.clientWidth, H = container.clientHeight;
  const svg = d3.select(container).append('svg').attr('width', W).attr('height', H);
  const pad = { l: 55, r: 20, t: 20, b: 40 };
  const m = 1, C = 1.255, tMax = 1e6;
  // (ti, eta): an early low-fitness node vs a late high-fitness node
  const actors = [
    { ti: 1, eta: 0.3, color: 'var(--accent-edge)', label: 'early, low fitness' },
    { ti: 100, eta: 0.9, color: 'var(--accent-hub)', label: 'late, high fitness' },
    { ti: 10, eta: 0.55, color: '#b7a56a', label: 'mid, mid fitness' }
  ];
  const x = d3.scaleLog().domain([1, tMax]).range([pad.l, W-pad.r]);
  const y = d3.scaleLog().domain([m, 5000]).range([H-pad.b, pad.t]);

  svg.append('g').attr('transform',`translate(0,${H-pad.b})`).call(d3.axisBottom(x).ticks(6,'~s')).attr('color','var(--ink-dim)').attr('font-family','var(--font-mono)');
  svg.append('g').attr('transform',`translate(${pad.l},0)`).call(d3.axisLeft(y).ticks(5,'~s')).attr('color','var(--ink-dim)').attr('font-family','var(--font-mono)');
  svg.append('text').attr('x',(pad.l+W-pad.r)/2).attr('y',H-6).attr('text-anchor','middle').attr('fill','var(--ink-dim)').attr('font-family','var(--font-mono)').attr('font-size',10).text('time t');
  svg.append('text').attr('transform','rotate(-90)').attr('x',-(H/2)).attr('y',14).attr('text-anchor','middle').attr('fill','var(--ink-dim)').attr('font-family','var(--font-mono)').attr('font-size',10).text('degree k(t)');

  const line = d3.line().x(d=>x(d.t)).y(d=>y(d.k));
  actors.forEach((a, idx) => {
    const beta = a.eta / C;
    const pts = [];
    for (let e = Math.log10(a.ti); e <= 6; e += 0.1) { const t = Math.pow(10, e); pts.push({ t, k: m * Math.pow(t/a.ti, beta) }); }
    svg.append('path').datum(pts).attr('fill','none').attr('stroke',a.color).attr('stroke-width',2.5).attr('d', line);
    svg.append('text').attr('x', pad.l+10).attr('y', pad.t+12+idx*14).attr('fill',a.color).attr('font-family','var(--font-mono)').attr('font-size',10).text(a.label + `  (β=${beta.toFixed(2)})`);
  });
  return {};
}

// ---- 18. Bose-Einstein condensation: fittest-node slider ----
// Grows a fitness network; a slider sets the top node's fitness
// advantage. Low -> scale-free (many hubs); high -> one super-hub.
function createCondensationSim(container, opts = {}) {
  const N = opts.N || 140;
  const W = container.clientWidth, H = container.clientHeight;
  const svg = d3.select(container).append('svg').attr('width', W).attr('height', H);
  let sim = null;

  function build(topFitness) {
    let nodes = [{ id: 0, fit: 0.5 }, { id: 1, fit: 0.5 }];
    let links = [{ source: 0, target: 1 }];
    const deg = { 0: 1, 1: 1 };
    // node 2 is the "special" high-fitness node
    for (let i = 2; i < N; i++) {
      const fit = i === 2 ? topFitness : Math.random() * 0.5;
      const ids = nodes.map(n => n.id);
      const weights = nodes.map(n => n.fit * deg[n.id]);
      const total = weights.reduce((a,b)=>a+b,0);
      let r = Math.random()*total, chosen = ids[0];
      for (let j=0;j<ids.length;j++){ r-=weights[j]; if(r<=0){chosen=ids[j];break;} }
      nodes.push({ id: i, fit });
      links.push({ source: i, target: chosen });
      deg[i] = 1; deg[chosen] = (deg[chosen]||0)+1;
    }
    return { nodes, links, deg };
  }

  function render(topFitness) {
    const { nodes, links, deg } = build(topFitness);
    const maxDeg = Math.max(...Object.values(deg));
    const condensate = maxDeg / (2 * (N - 1)); // share of links on biggest hub
    svg.selectAll('*').remove();
    const linkSel = svg.append('g').selectAll('line').data(links).enter().append('line').attr('stroke','var(--rule)').attr('stroke-opacity',0.5);
    const nodeSel = svg.append('g').selectAll('circle').data(nodes).enter().append('circle')
      .attr('r', d => 2 + Math.sqrt(deg[d.id]||1)*2)
      .attr('fill', d => (deg[d.id]||1) === maxDeg ? 'var(--accent-hub)' : 'var(--accent-edge)');
    if (sim) sim.stop();
    sim = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id(d=>d.id).distance(18).strength(0.3))
      .force('charge', d3.forceManyBody().strength(-24))
      .force('center', d3.forceCenter(W/2, H/2))
      .force('collide', d3.forceCollide(d => 3+Math.sqrt(deg[d.id]||1)*2))
      .on('tick', () => {
        linkSel.attr('x1',d=>d.source.x).attr('y1',d=>d.source.y).attr('x2',d=>d.target.x).attr('y2',d=>d.target.y);
        nodeSel.attr('cx',d=>Math.max(6,Math.min(W-6,d.x))).attr('cy',d=>Math.max(6,Math.min(H-6,d.y)));
      });
    if (opts.labelEl) {
      const phase = condensate > 0.5 ? 'CONDENSED — one super-hub owns the links (winner-takes-all)' : 'scale-free — links spread across a hierarchy of hubs';
      opts.labelEl.textContent = `top fitness = ${topFitness.toFixed(2)}  |  biggest hub holds ${(condensate*100).toFixed(0)}% of links  |  ${phase}`;
    }
  }

  render(opts.initialFitness || 0.5);
  return { setFitness: render };
}

// ---- 19. Gamma tuner: each evolving-network process -> gamma ----
function createGammaTuner(container, opts = {}) {
  const W = container.clientWidth, H = container.clientHeight;
  const el = d3.select(container);
  const wrap = el.append('div').style('font-family','var(--font-mono)').style('color','var(--ink)').style('padding','1rem');

  const state = { A: 0, m: 2, r: 0, theta: 0 };
  function gammaFrom() {
    // combine: base 3 + initial attractiveness + node removal + accelerated growth
    return 3 + state.A/state.m + (state.r>0 ? 2/(1-state.r) : 0) + (state.theta>0 ? 2*state.theta/(1-state.theta) : 0);
  }

  const readout = wrap.append('div').style('font-size','2.2rem').style('color','var(--accent-hub)').style('margin-bottom','1rem').style('text-align','center');
  const controls = [
    { key:'A', label:'initial attractiveness A', min:0, max:20, step:1 },
    { key:'r', label:'node removal rate r', min:0, max:0.9, step:0.05 },
    { key:'theta', label:'accelerated growth θ', min:0, max:0.9, step:0.05 }
  ];
  controls.forEach(c => {
    const row = wrap.append('div').style('margin','0.5rem 0').style('display','flex').style('align-items','center').style('gap','0.8rem');
    row.append('span').style('flex','0 0 220px').style('font-size','0.85rem').style('color','var(--ink-dim)').text(c.label);
    const val = row.append('span').style('flex','0 0 50px').style('color','var(--accent-edge)').text(state[c.key]);
    const input = row.append('input').attr('type','range').attr('min',c.min).attr('max',c.max).attr('step',c.step).attr('value',state[c.key]).style('flex','1');
    input.on('input', function(){ state[c.key] = +this.value; val.text((+this.value).toFixed(2)); update(); });
  });
  function update() { readout.html(`γ = ${gammaFrom().toFixed(2)}`); }
  update();
  return {};
}

// ---- 20. Assortativity toggle (Xulvi-Brunet & Sokolov style) ----
// One scale-free network, rewired to be assortative / neutral /
// disassortative, keeping the degree sequence fixed. Reports r.
function createAssortativitySim(container, opts = {}) {
  const N = opts.N || 100;
  const W = container.clientWidth, H = container.clientHeight;
  const svg = d3.select(container).append('svg').attr('width', W).attr('height', H);
  let sim = null;

  // build a BA network as the neutral base
  function buildBase() {
    const nodes = [{ id: 0 }, { id: 1 }];
    const links = [{ a: 0, b: 1 }];
    const targets = [0, 1];
    for (let i = 2; i < N; i++) {
      const t = targets[Math.floor(Math.random() * targets.length)];
      nodes.push({ id: i });
      links.push({ a: i, b: t });
      targets.push(i, t);
    }
    return { nodes, links };
  }
  const base = buildBase();

  function degMap(links) {
    const d = {}; base.nodes.forEach(n => d[n.id] = 0);
    links.forEach(l => { d[l.a]++; d[l.b]++; });
    return d;
  }

  // rewire toward assortative (mode=1) or disassortative (mode=-1)
  function rewire(mode, steps) {
    const links = base.links.map(l => ({ a: l.a, b: l.b }));
    const has = new Set(links.map(l => l.a < l.b ? `${l.a}-${l.b}` : `${l.b}-${l.a}`));
    const deg = degMap(links);
    for (let s = 0; s < steps; s++) {
      const i = Math.floor(Math.random() * links.length);
      let j = Math.floor(Math.random() * links.length);
      if (i === j) continue;
      // four endpoints, order by degree
      let ends = [links[i].a, links[i].b, links[j].a, links[j].b];
      if (new Set(ends).size < 4) continue;
      ends.sort((x, y) => deg[x] - deg[y]);
      let n1, n2, n3, n4;
      if (mode === 1) { [n1, n2, n3, n4] = ends; } // similar-similar: (lo,lo2)(hi1,hi)
      else { n1 = ends[0]; n2 = ends[3]; n3 = ends[1]; n4 = ends[2]; }
      const e1 = n1 < n2 ? `${n1}-${n2}` : `${n2}-${n1}`;
      const e2 = n3 < n4 ? `${n3}-${n4}` : `${n4}-${n3}`;
      if (has.has(e1) || has.has(e2)) continue;
      // remove old
      const o1 = links[i].a < links[i].b ? `${links[i].a}-${links[i].b}` : `${links[i].b}-${links[i].a}`;
      const o2 = links[j].a < links[j].b ? `${links[j].a}-${links[j].b}` : `${links[j].b}-${links[j].a}`;
      has.delete(o1); has.delete(o2);
      links[i] = { a: n1, b: n2 }; links[j] = { a: n3, b: n4 };
      has.add(e1); has.add(e2);
    }
    return links;
  }

  function assortativity(links, deg) {
    // Newman's r
    let s1 = 0, s2 = 0, s3 = 0; const M = links.length;
    links.forEach(l => { const j = deg[l.a], k = deg[l.b]; s1 += j*k; s2 += 0.5*(j+k); s3 += 0.5*(j*j+k*k); });
    s1 /= M; s2 /= M; s3 /= M;
    const num = s1 - s2*s2, den = s3 - s2*s2;
    return den === 0 ? 0 : num/den;
  }

  function render(mode) {
    const links = mode === 0 ? base.links.map(l=>({a:l.a,b:l.b})) : rewire(mode, N * 6);
    const deg = degMap(links);
    const maxDeg = Math.max(...Object.values(deg));
    const nodeData = base.nodes.map(n => ({ id: n.id }));
    const linkData = links.map(l => ({ source: l.a, target: l.b }));
    svg.selectAll('*').remove();
    const linkSel = svg.append('g').selectAll('line').data(linkData).enter().append('line').attr('stroke','var(--rule)').attr('stroke-opacity',0.5);
    const nodeSel = svg.append('g').selectAll('circle').data(nodeData).enter().append('circle')
      .attr('r', d => 3 + Math.sqrt(deg[d.id]||1)*2)
      .attr('fill', d => (deg[d.id]||1) > maxDeg*0.4 ? 'var(--accent-hub)' : 'var(--accent-edge)');
    if (sim) sim.stop();
    sim = d3.forceSimulation(nodeData)
      .force('link', d3.forceLink(linkData).id(d=>d.id).distance(24).strength(0.3))
      .force('charge', d3.forceManyBody().strength(-30))
      .force('center', d3.forceCenter(W/2, H/2))
      .force('collide', d3.forceCollide(d => 4 + Math.sqrt(deg[d.id]||1)*2))
      .on('tick', () => {
        linkSel.attr('x1',d=>d.source.x).attr('y1',d=>d.source.y).attr('x2',d=>d.target.x).attr('y2',d=>d.target.y);
        nodeSel.attr('cx',d=>Math.max(6,Math.min(W-6,d.x))).attr('cy',d=>Math.max(6,Math.min(H-6,d.y)));
      });
    if (opts.labelEl) {
      const r = assortativity(links, deg);
      const name = mode === 1 ? 'assortative — hubs bond to hubs' : mode === -1 ? 'disassortative — hubs avoid each other' : 'neutral — BA baseline';
      opts.labelEl.textContent = `${name}  |  r = ${r.toFixed(2)}`;
    }
  }

  render(0);
  return { setMode: render };
}

// ---- 21. k_nn(k): rising / flat / falling ----
function createKnnSim(container, opts = {}) {
  const W = container.clientWidth, H = container.clientHeight;
  const svg = d3.select(container).append('svg').attr('width', W).attr('height', H);
  const pad = { l: 55, r: 20, t: 20, b: 40 };
  const x = d3.scaleLog().domain([1, 1000]).range([pad.l, W-pad.r]);
  const y = d3.scaleLog().domain([1, 200]).range([H-pad.b, pad.t]);

  svg.append('g').attr('transform',`translate(0,${H-pad.b})`).call(d3.axisBottom(x).ticks(5,'~s')).attr('color','var(--ink-dim)').attr('font-family','var(--font-mono)');
  svg.append('g').attr('transform',`translate(${pad.l},0)`).call(d3.axisLeft(y).ticks(5,'~s')).attr('color','var(--ink-dim)').attr('font-family','var(--font-mono)');
  svg.append('text').attr('x',(pad.l+W-pad.r)/2).attr('y',H-6).attr('text-anchor','middle').attr('fill','var(--ink-dim)').attr('font-family','var(--font-mono)').attr('font-size',10).text('node degree k');
  svg.append('text').attr('transform','rotate(-90)').attr('x',-(H/2)).attr('y',14).attr('text-anchor','middle').attr('fill','var(--ink-dim)').attr('font-family','var(--font-mono)').attr('font-size',10).text('kₙₙ(k)');

  const ks = d3.range(1, 3.01, 0.05).map(e => Math.pow(10, e));
  const curves = [
    { mu: 0.4, color: 'var(--accent-hub)', label: 'assortative  μ > 0' },
    { mu: 0, color: '#b7a56a', label: 'neutral  μ = 0' },
    { mu: -0.5, color: 'var(--accent-edge)', label: 'disassortative  μ < 0' }
  ];
  const line = d3.line().x(d=>x(d.k)).y(d=>y(d.v));
  curves.forEach((c, idx) => {
    const a = 20;
    const pts = ks.map(k => ({ k, v: Math.max(1, a * Math.pow(k, c.mu)) }));
    svg.append('path').datum(pts).attr('fill','none').attr('stroke',c.color).attr('stroke-width',2.5).attr('d', line);
    svg.append('text').attr('x', pad.l+10).attr('y', pad.t+12+idx*14).attr('fill',c.color).attr('font-family','var(--font-mono)').attr('font-size',10).text(c.label);
  });
  return {};
}

// ---- 22. f_c vs gamma: failure threshold -> 1, attack threshold low ----
function createFcGammaSim(container, opts = {}) {
  const W = container.clientWidth, H = container.clientHeight;
  const svg = d3.select(container).append('svg').attr('width', W).attr('height', H);
  const pad = { l: 55, r: 20, t: 20, b: 40 };
  const kmin = 3, N = 1e5;

  const x = d3.scaleLinear().domain([2, 5]).range([pad.l, W-pad.r]);
  const y = d3.scaleLinear().domain([0, 1]).range([H-pad.b, pad.t]);

  svg.append('g').attr('transform',`translate(0,${H-pad.b})`).call(d3.axisBottom(x).ticks(6)).attr('color','var(--ink-dim)').attr('font-family','var(--font-mono)');
  svg.append('g').attr('transform',`translate(${pad.l},0)`).call(d3.axisLeft(y).ticks(5)).attr('color','var(--ink-dim)').attr('font-family','var(--font-mono)');
  svg.append('text').attr('x',(pad.l+W-pad.r)/2).attr('y',H-6).attr('text-anchor','middle').attr('fill','var(--ink-dim)').attr('font-family','var(--font-mono)').attr('font-size',10).text('degree exponent γ');
  svg.append('text').attr('transform','rotate(-90)').attr('x',-(H/2)).attr('y',14).attr('text-anchor','middle').attr('fill','var(--ink-dim)').attr('font-family','var(--font-mono)').attr('font-size',10).text('critical threshold fc');

  // moments for a scale-free net kmin..kmax with exponent gamma (continuum)
  function moments(gamma) {
    const kmax = kmin * Math.pow(N, 1/(gamma-1));
    function mom(n) {
      const e = n - gamma + 1;
      const C = (gamma-1) * Math.pow(kmin, gamma-1);
      if (Math.abs(e) < 1e-9) return C * Math.log(kmax/kmin);
      return C * (Math.pow(kmax, e) - Math.pow(kmin, e)) / e;
    }
    return { k1: mom(1), k2: mom(2) };
  }
  const gs = d3.range(2.05, 5.01, 0.02);
  const failure = gs.map(g => { const { k1, k2 } = moments(g); const kappa = k2/k1; return { g, fc: Math.max(0, 1 - 1/(kappa - 1)) }; });

  // attack threshold: numerically solve (8.12)
  function attackFc(gamma) {
    function f(fc) {
      const a = (2-gamma)/(1-gamma), b = (3-gamma)/(1-gamma);
      return Math.pow(fc, a) - 2 - ((2-gamma)/(3-gamma))*kmin*(Math.pow(fc, b) - 1);
    }
    let lo = 1e-4, hi = 0.9999;
    for (let i = 0; i < 60; i++) { const mid = (lo+hi)/2; if (f(lo)*f(mid) <= 0) hi = mid; else lo = mid; }
    return (lo+hi)/2;
  }
  const attack = gs.map(g => ({ g, fc: Math.min(1, Math.max(0, attackFc(g))) }));

  const line = d3.line().x(d=>x(d.g)).y(d=>y(d.fc));
  svg.append('path').datum(failure).attr('fill','none').attr('stroke','var(--accent-edge)').attr('stroke-width',2.5).attr('d', line);
  svg.append('path').datum(attack).attr('fill','none').attr('stroke','var(--accent-danger)').attr('stroke-width',2.5).attr('d', line);

  // gamma=3 marker
  svg.append('line').attr('x1',x(3)).attr('x2',x(3)).attr('y1',pad.t).attr('y2',H-pad.b).attr('stroke','var(--rule)').attr('stroke-dasharray','4 4');
  svg.append('text').attr('x',x(3)+4).attr('y',pad.t+10).attr('fill','var(--ink-dim)').attr('font-family','var(--font-mono)').attr('font-size',9).text('γ=3');

  svg.append('circle').attr('cx',W-150).attr('cy',pad.t+4).attr('r',4).attr('fill','var(--accent-edge)');
  svg.append('text').attr('x',W-142).attr('y',pad.t+8).attr('fill','var(--ink-dim)').attr('font-family','var(--font-mono)').attr('font-size',10).text('random failure');
  svg.append('circle').attr('cx',W-150).attr('cy',pad.t+20).attr('r',4).attr('fill','var(--accent-danger)');
  svg.append('text').attr('x',W-142).attr('y',pad.t+24).attr('fill','var(--ink-dim)').attr('font-family','var(--font-mono)').attr('font-size',10).text('targeted attack');
  return {};
}

// ---- 23. Cascading failure: branching demo with <k> slider ----
// Trigger an avalanche; each failed node spawns Poisson(<k>) children.
// <k><1 dies out, =1 critical (power law), >1 global.
function createCascadeSim(container, opts = {}) {
  const W = container.clientWidth, H = container.clientHeight;
  const svg = d3.select(container).append('svg').attr('width', W).attr('height', H);
  let avgK = opts.initialK || 1;

  function poisson(lam) {
    let L = Math.exp(-lam), k = 0, p = 1;
    do { k++; p *= Math.random(); } while (p > L);
    return k - 1;
  }

  function run() {
    svg.selectAll('*').remove();
    // build a branching tree level by level
    const maxNodes = 400, maxDepth = 14;
    let nodes = [{ id: 0, x: W/2, y: 30, depth: 0 }];
    let links = [];
    let frontier = [nodes[0]];
    let idc = 1;
    while (frontier.length && nodes.length < maxNodes) {
      const next = [];
      const levelY = frontier[0].depth * (H / maxDepth) + 30;
      frontier.forEach(parent => {
        const kids = poisson(avgK);
        for (let c = 0; c < kids && nodes.length < maxNodes; c++) {
          const node = { id: idc++, depth: parent.depth + 1, x: 0, y: (parent.depth+1)*(H/maxDepth)+30 };
          nodes.push(node); links.push({ s: parent, t: node }); next.push(node);
        }
      });
      if (frontier[0].depth + 1 >= maxDepth) break;
      frontier = next;
    }
    // x-layout per depth
    const byDepth = {};
    nodes.forEach(n => { (byDepth[n.depth] = byDepth[n.depth] || []).push(n); });
    Object.values(byDepth).forEach(arr => {
      arr.forEach((n, i) => { n.x = (W / (arr.length + 1)) * (i + 1); });
    });

    svg.append('g').selectAll('line').data(links).enter().append('line')
      .attr('x1',d=>d.s.x).attr('y1',d=>d.s.y).attr('x2',d=>d.t.x).attr('y2',d=>d.t.y)
      .attr('stroke','var(--accent-danger)').attr('stroke-opacity',0.5);
    svg.append('g').selectAll('circle').data(nodes).enter().append('circle')
      .attr('cx',d=>d.x).attr('cy',d=>d.y).attr('r',d=>d.id===0?6:3)
      .attr('fill',d=>d.id===0?'var(--accent-hub)':'var(--accent-danger)');

    if (opts.labelEl) {
      const size = nodes.length;
      const regime = avgK < 1 ? 'subcritical — cascade dies out (exponential sizes)'
        : avgK > 1 ? 'supercritical — global cascade (system collapse)'
        : 'critical — power-law avalanche sizes';
      opts.labelEl.textContent = `⟨k⟩ = ${avgK.toFixed(2)}  |  avalanche size = ${size}${size>=maxNodes?'+':''}  |  ${regime}`;
    }
  }

  run();
  return { setK: (k) => { avgK = k; run(); }, retrigger: run };
}

// ---- 24. Girvan-Newman: remove high-betweenness links, watch communities split ----
function createGirvanNewmanSim(container, opts = {}) {
  const W = container.clientWidth, H = container.clientHeight;
  const svg = d3.select(container).append('svg').attr('width', W).attr('height', H);

  // planted 3-community network
  function buildPlanted() {
    const comm = [[0,1,2,3,4,5],[6,7,8,9,10,11],[12,13,14,15,16,17]];
    const nodes = []; comm.forEach((c,ci)=>c.forEach(id=>nodes.push({id, comm:ci})));
    const linkSet = new Set(); const links = [];
    const add = (a,b)=>{ const k=a<b?`${a}-${b}`:`${b}-${a}`; if(!linkSet.has(k)&&a!==b){linkSet.add(k);links.push({source:a,target:b});} };
    // dense within community
    comm.forEach(c => { for(let i=0;i<c.length;i++) for(let j=i+1;j<c.length;j++) if(Math.random()<0.7) add(c[i],c[j]); });
    // sparse bridges
    add(5,6); add(11,12); add(17,0);
    return { nodes, links };
  }
  let { nodes, links } = buildPlanted();
  const origLinks = links.map(l=>({source:l.source,target:l.target}));

  function adjacency(lks) {
    const adj = {}; nodes.forEach(n=>adj[n.id]=[]);
    lks.forEach(l=>{ 
      const s = l.source.id !== undefined ? l.source.id : l.source;
      const t = l.target.id !== undefined ? l.target.id : l.target;
      adj[s].push(t); adj[t].push(s); 
    });
    return adj;
  }

  // edge betweenness via BFS from every node (unweighted Brandes, simplified)
  function edgeBetweenness(lks) {
    const adj = adjacency(lks);
    const bet = {}; 
    lks.forEach(l=>{ 
      const s = l.source.id !== undefined ? l.source.id : l.source;
      const t = l.target.id !== undefined ? l.target.id : l.target;
      const k=key(s,t); 
      bet[k]=0; 
    });
    nodes.forEach(s => {
      const S=[], P={}, sigma={}, dist={};
      nodes.forEach(n=>{P[n.id]=[];sigma[n.id]=0;dist[n.id]=-1;});
      sigma[s.id]=1; dist[s.id]=0; const Q=[s.id];
      while(Q.length){ const v=Q.shift(); S.push(v);
        adj[v].forEach(w=>{ if(dist[w]<0){dist[w]=dist[v]+1;Q.push(w);} if(dist[w]===dist[v]+1){sigma[w]+=sigma[v];P[w].push(v);} });
      }
      const delta={}; nodes.forEach(n=>delta[n.id]=0);
      while(S.length){ const w=S.pop();
        P[w].forEach(v=>{ const c=(sigma[v]/sigma[w])*(1+delta[w]); bet[key(v,w)]+=c; delta[v]+=c; });
      }
    });
    return bet;
  }
  function key(a,b){ return a<b?`${a}-${b}`:`${b}-${a}`; }

  // connected components -> color index
  function components(lks) {
    const adj = adjacency(lks); const comp={}; let c=0;
    nodes.forEach(n=>{ if(comp[n.id]===undefined){ const Q=[n.id]; comp[n.id]=c;
      while(Q.length){ const v=Q.shift(); adj[v].forEach(w=>{ if(comp[w]===undefined){comp[w]=c;Q.push(w);} }); } c++; }});
    return comp;
  }

  const palette = ['var(--accent-hub)','var(--accent-edge)','#b3689a','#7d9f5a','#c98b4e','#6f8fb5'];
  let linkSel, nodeSel, sim;

  function draw() {
    const comp = components(links);
    svg.selectAll('*').remove();
    linkSel = svg.append('g').selectAll('line').data(links).enter().append('line')
      .attr('stroke','var(--rule)').attr('stroke-width',1.5).attr('stroke-opacity',0.6);
    nodeSel = svg.append('g').selectAll('circle').data(nodes).enter().append('circle')
      .attr('r',7).attr('fill',d=>palette[comp[d.id]%palette.length]).attr('stroke','var(--bg)').attr('stroke-width',1.5);
    if(sim) sim.stop();
    sim = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id(d=>d.id).distance(40).strength(0.4))
      .force('charge', d3.forceManyBody().strength(-120))
      .force('center', d3.forceCenter(W/2,H/2))
      .force('collide', d3.forceCollide(11))
      .on('tick',()=>{
        linkSel.attr('x1',d=>d.source.x).attr('y1',d=>d.source.y).attr('x2',d=>d.target.x).attr('y2',d=>d.target.y);
        nodeSel.attr('cx',d=>Math.max(8,Math.min(W-8,d.x))).attr('cy',d=>Math.max(8,Math.min(H-8,d.y)));
      });
    updateLabel(comp);
  }
  function updateLabel(comp) {
    if(opts.labelEl){ const nComp = new Set(Object.values(comp)).size; opts.labelEl.textContent = `${links.length} links remaining  |  ${nComp} communit${nComp===1?'y':'ies'}`; }
  }

  function removeTopLink() {
    if(!links.length) return;
    const bet = edgeBetweenness(links);
    let maxK=null, maxV=-1;
    links.forEach(l=>{ const k=key(l.source.id!==undefined?l.source.id:l.source, l.target.id!==undefined?l.target.id:l.target); if(bet[k]>maxV){maxV=bet[k];maxK=k;} });
    const idx = links.findIndex(l=>{ const a=l.source.id!==undefined?l.source.id:l.source, b=l.target.id!==undefined?l.target.id:l.target; return key(a,b)===maxK; });
    if(idx>=0) links.splice(idx,1);
    draw();
  }
  function reset() { links = origLinks.map(l=>({source:l.source,target:l.target})); draw(); }

  draw();
  return { removeTopLink, reset };
}

// ---- 25. Modularity demo: cycle partitions of a 2-community network ----
function createModularitySim(container, opts = {}) {
  const W = container.clientWidth, H = container.clientHeight;
  const svg = d3.select(container).append('svg').attr('width', W).attr('height', H);

  // two clear communities
  const commA=[0,1,2,3,4], commB=[5,6,7,8,9];
  const nodes=[...commA,...commB].map(id=>({id}));
  const links=[];
  const add=(a,b)=>links.push({source:a,target:b});
  [[0,1],[0,2],[1,2],[2,3],[3,4],[0,4],[1,3]].forEach(([a,b])=>add(a,b));
  [[5,6],[5,7],[6,7],[7,8],[8,9],[5,9],[6,8]].forEach(([a,b])=>add(a,b));
  add(4,5); // single bridge
  const L = links.length;
  const deg={}; nodes.forEach(n=>deg[n.id]=0); links.forEach(l=>{deg[l.source]++;deg[l.target]++;});

  // partitions to cycle
  const partitions = [
    { name:'two communities (optimal)', groups:[commA, commB] },
    { name:'single community', groups:[[...commA,...commB]] },
    { name:'every node separate', groups:nodes.map(n=>[n.id]) },
    { name:'suboptimal split', groups:[[0,1,2],[3,4,5,6],[7,8,9]] }
  ];
  let pi = 0;

  function modularity(groups) {
    let M=0;
    groups.forEach(g=>{ const gs=new Set(g);
      let Lc=0; links.forEach(l=>{ if(gs.has(l.source)&&gs.has(l.target)) Lc++; });
      let kc=0; g.forEach(id=>kc+=deg[id]);
      M += Lc/L - Math.pow(kc/(2*L),2);
    });
    return M;
  }

  const palette=['var(--accent-hub)','var(--accent-edge)','#b3689a','#7d9f5a','#c98b4e','#6f8fb5','#a0708f','#8f9f6a','#c07d5a','#7088a5'];
  let sim;
  function groupOf(id, groups){ for(let i=0;i<groups.length;i++) if(groups[i].includes(id)) return i; return 0; }

  function draw() {
    const { groups, name } = partitions[pi];
    svg.selectAll('*').remove();
    const linkSel = svg.append('g').selectAll('line').data(links).enter().append('line').attr('stroke','var(--rule)').attr('stroke-opacity',0.6).attr('stroke-width',1.5);
    const nodeSel = svg.append('g').selectAll('circle').data(nodes).enter().append('circle')
      .attr('r',9).attr('fill',d=>palette[groupOf(d.id,groups)%palette.length]).attr('stroke','var(--bg)').attr('stroke-width',1.5);
    if(sim) sim.stop();
    sim=d3.forceSimulation(nodes)
      .force('link',d3.forceLink(links).id(d=>d.id).distance(45).strength(0.3))
      .force('charge',d3.forceManyBody().strength(-140))
      .force('center',d3.forceCenter(W/2,H/2))
      .force('collide',d3.forceCollide(12))
      .on('tick',()=>{
        linkSel.attr('x1',d=>d.source.x).attr('y1',d=>d.source.y).attr('x2',d=>d.target.x).attr('y2',d=>d.target.y);
        nodeSel.attr('cx',d=>Math.max(10,Math.min(W-10,d.x))).attr('cy',d=>Math.max(10,Math.min(H-10,d.y)));
      });
    if(opts.labelEl){ const M=modularity(groups); opts.labelEl.textContent=`${name}  |  M = ${M.toFixed(3)}`; }
  }

  draw();
  return { cycle: () => { pi=(pi+1)%partitions.length; draw(); } };
}

// ---- 26. SI / SIS / SIR compartmental curves ----
function createEpidemicCurvesSim(container, opts = {}) {
  const W = container.clientWidth, H = container.clientHeight;
  const svg = d3.select(container).append('svg').attr('width', W).attr('height', H);
  const pad = { l: 50, r: 20, t: 20, b: 38 };
  let model = 'SIS';
  let beta = 0.0006, mu = 0.15, avgK = 8;

  const x = d3.scaleLinear().domain([0, 100]).range([pad.l, W-pad.r]);
  const y = d3.scaleLinear().domain([0, 1]).range([H-pad.b, pad.t]);

  function simulate() {
    const dt = 0.5, steps = 200;
    let s = 0.99, i = 0.01, r = 0;
    const si = [], ii = [], ri = [];
    for (let t = 0; t <= steps; t++) {
      si.push({ t: t*dt, v: s }); ii.push({ t: t*dt, v: i }); ri.push({ t: t*dt, v: r });
      const newInf = beta * avgK * s * i * 100;
      if (model === 'SI') { const di = newInf; s -= di*dt; i += di*dt; }
      else if (model === 'SIS') { const di = newInf - mu*i; s += (-newInf + mu*i)*dt; i += di*dt; }
      else { const rec = mu*i; s -= newInf*dt; i += (newInf - rec)*dt; r += rec*dt; }
      s = Math.max(0, Math.min(1, s)); i = Math.max(0, Math.min(1, i)); r = Math.max(0, Math.min(1, r));
    }
    return { si, ii, ri };
  }

  function draw() {
    const { si, ii, ri } = simulate();
    svg.selectAll('*').remove();
    svg.append('g').attr('transform',`translate(0,${H-pad.b})`).call(d3.axisBottom(x).ticks(6)).attr('color','var(--ink-dim)').attr('font-family','var(--font-mono)');
    svg.append('g').attr('transform',`translate(${pad.l},0)`).call(d3.axisLeft(y).ticks(5)).attr('color','var(--ink-dim)').attr('font-family','var(--font-mono)');
    svg.append('text').attr('x',(pad.l+W-pad.r)/2).attr('y',H-4).attr('text-anchor','middle').attr('fill','var(--ink-dim)').attr('font-family','var(--font-mono)').attr('font-size',10).text('time');
    svg.append('text').attr('transform','rotate(-90)').attr('x',-(H/2)).attr('y',14).attr('text-anchor','middle').attr('fill','var(--ink-dim)').attr('font-family','var(--font-mono)').attr('font-size',10).text('fraction');
    const line = d3.line().x(d=>x(d.t)).y(d=>y(d.v));
    svg.append('path').datum(ii).attr('fill','none').attr('stroke','var(--accent-danger)').attr('stroke-width',2.5).attr('d',line);
    svg.append('path').datum(si).attr('fill','none').attr('stroke','var(--accent-edge)').attr('stroke-width',2).attr('stroke-dasharray','4 3').attr('d',line);
    if (model === 'SIR') svg.append('path').datum(ri).attr('fill','none').attr('stroke','var(--ink-dim)').attr('stroke-width',2).attr('d',line);
    // legend
    const items = [['infected','var(--accent-danger)'],['susceptible','var(--accent-edge)']];
    if (model==='SIR') items.push(['recovered','var(--ink-dim)']);
    items.forEach((it,idx)=>{ svg.append('circle').attr('cx',W-110).attr('cy',pad.t+4+idx*14).attr('r',4).attr('fill',it[1]); svg.append('text').attr('x',W-102).attr('y',pad.t+8+idx*14).attr('fill','var(--ink-dim)').attr('font-family','var(--font-mono)').attr('font-size',9).text(it[0]); });
    if (opts.labelEl) { const lam=(beta*100/mu).toFixed(2); opts.labelEl.textContent = `${model}  |  λ = β/μ = ${lam}`; }
  }
  draw();
  return {
    setModel: (m) => { model = m; draw(); },
    setBeta: (b) => { beta = b; draw(); },
    setMu: (m) => { mu = m; draw(); }
  };
}

// ---- 27. Live epidemic spreading on a network (centerpiece) ----
// SIR spreading from a seed; toggle random vs scale-free topology.
function createNetworkEpidemicSim(container, opts = {}) {
  const N = opts.N || 120;
  const W = container.clientWidth, H = container.clientHeight;
  const svg = d3.select(container).append('svg').attr('width', W).attr('height', H);
  let topology = 'scalefree';
  let beta = 0.18, mu = 0.12;
  let nodes, links, state, timer = null, sim;

  function build() {
    nodes = []; links = [];
    if (topology === 'scalefree') {
      nodes = [{id:0},{id:1}]; links=[{source:0,target:1}];
      const targets=[0,1];
      for (let i=2;i<N;i++){ const t=targets[Math.floor(Math.random()*targets.length)]; nodes.push({id:i}); links.push({source:i,target:t}); targets.push(i,t); const t2=targets[Math.floor(Math.random()*targets.length)]; if(t2!==i){links.push({source:i,target:t2});targets.push(i,t2);} }
    } else {
      for(let i=0;i<N;i++) nodes.push({id:i});
      const p = 3/N;
      for(let i=0;i<N;i++) for(let j=i+1;j<N;j++) if(Math.random()<p) links.push({source:i,target:j});
    }
    state = {}; nodes.forEach(n=>state[n.id]='S');
    state[0] = 'I';
  }

  function adjacency() { const adj={}; nodes.forEach(n=>adj[n.id]=[]); links.forEach(l=>{ const s=l.source.id!==undefined?l.source.id:l.source, t=l.target.id!==undefined?l.target.id:l.target; adj[s].push(t); adj[t].push(s); }); return adj; }
  let adj;

  const color = st => st==='S'?'var(--accent-edge)':st==='I'?'var(--accent-danger)':'var(--ink-dim)';
  let nodeSel, linkSel;

  function render() {
    svg.selectAll('*').remove();
    linkSel = svg.append('g').selectAll('line').data(links).enter().append('line').attr('stroke','var(--rule)').attr('stroke-opacity',0.4);
    nodeSel = svg.append('g').selectAll('circle').data(nodes).enter().append('circle').attr('r',5).attr('fill',d=>color(state[d.id])).attr('stroke','var(--bg)').attr('stroke-width',1);
    if(sim) sim.stop();
    sim = d3.forceSimulation(nodes)
      .force('link',d3.forceLink(links).id(d=>d.id).distance(26).strength(0.3))
      .force('charge',d3.forceManyBody().strength(-45))
      .force('center',d3.forceCenter(W/2,H/2))
      .force('collide',d3.forceCollide(7))
      .on('tick',()=>{
        linkSel.attr('x1',d=>d.source.x).attr('y1',d=>d.source.y).attr('x2',d=>d.target.x).attr('y2',d=>d.target.y);
        nodeSel.attr('cx',d=>Math.max(6,Math.min(W-6,d.x))).attr('cy',d=>Math.max(6,Math.min(H-6,d.y)));
      });
  }
  function recolor(){ if(nodeSel) nodeSel.attr('fill',d=>color(state[d.id])); updateLabel(); }
  function counts(){ let S=0,I=0,R=0; nodes.forEach(n=>{ const s=state[n.id]; if(s==='S')S++;else if(s==='I')I++;else R++;}); return {S,I,R}; }
  function updateLabel(){ if(opts.labelEl){ const c=counts(); opts.labelEl.textContent = `${topology==='scalefree'?'scale-free':'random'}  |  S:${c.S}  I:${c.I}  R:${c.R}`; } }

  function step() {
    const newState = Object.assign({}, state);
    let active = false;
    nodes.forEach(n=>{
      if (state[n.id]==='I') {
        active = true;
        adj[n.id].forEach(nb=>{ if(state[nb]==='S' && Math.random()<beta) newState[nb]='I'; });
        if (Math.random()<mu) newState[n.id]='R';
      }
    });
    state = newState; recolor();
    if (!active && timer){ clearInterval(timer); timer=null; }
  }

  function start(){ if(timer) return; adj=adjacency(); timer=setInterval(step, 500); }
  function reset(){ if(timer){clearInterval(timer);timer=null;} build(); render(); setTimeout(updateLabel,100); }

  function setTopology(t){ topology=t; reset(); }

  build(); adj=adjacency(); render(); setTimeout(updateLabel,100);
  return { start, reset, setTopology, step: ()=>{ adj=adjacency(); step(); } };
}

// ---- 28. Vanishing epidemic threshold: i(lambda) random vs scale-free ----
function createThresholdSim(container, opts = {}) {
  const W = container.clientWidth, H = container.clientHeight;
  const svg = d3.select(container).append('svg').attr('width', W).attr('height', H);
  const pad = { l: 50, r: 20, t: 20, b: 40 };
  const x = d3.scaleLinear().domain([0, 1]).range([pad.l, W-pad.r]);
  const y = d3.scaleLinear().domain([0, 1]).range([H-pad.b, pad.t]);

  svg.append('g').attr('transform',`translate(0,${H-pad.b})`).call(d3.axisBottom(x).ticks(6)).attr('color','var(--ink-dim)').attr('font-family','var(--font-mono)');
  svg.append('g').attr('transform',`translate(${pad.l},0)`).call(d3.axisLeft(y).ticks(5)).attr('color','var(--ink-dim)').attr('font-family','var(--font-mono)');
  svg.append('text').attr('x',(pad.l+W-pad.r)/2).attr('y',H-6).attr('text-anchor','middle').attr('fill','var(--ink-dim)').attr('font-family','var(--font-mono)').attr('font-size',10).text('spreading rate λ');
  svg.append('text').attr('transform','rotate(-90)').attr('x',-(H/2)).attr('y',14).attr('text-anchor','middle').attr('fill','var(--ink-dim)').attr('font-family','var(--font-mono)').attr('font-size',10).text('infected fraction i(∞)');

  const lamC = 0.25; // random-network threshold
  const rand = d3.range(0,1.001,0.01).map(l=>({ l, v: l>lamC ? 1-lamC/l : 0 }));
  const sf = d3.range(0,1.001,0.01).map(l=>({ l, v: l>0 ? Math.pow(l,1.6)*0.9 : 0 })); // threshold ~0

  const line = d3.line().x(d=>x(d.l)).y(d=>y(d.v));
  svg.append('path').datum(sf).attr('fill','none').attr('stroke','var(--accent-hub)').attr('stroke-width',2.5).attr('d',line);
  svg.append('path').datum(rand).attr('fill','none').attr('stroke','var(--accent-edge)').attr('stroke-width',2.5).attr('d',line);
  // threshold marker
  svg.append('line').attr('x1',x(lamC)).attr('x2',x(lamC)).attr('y1',pad.t).attr('y2',H-pad.b).attr('stroke','var(--accent-edge)').attr('stroke-dasharray','4 4').attr('stroke-opacity',0.6);
  svg.append('text').attr('x',x(lamC)+4).attr('y',H-pad.b-6).attr('fill','var(--accent-edge)').attr('font-family','var(--font-mono)').attr('font-size',9).text('λc (random)');

  svg.append('circle').attr('cx',W-150).attr('cy',pad.t+4).attr('r',4).attr('fill','var(--accent-hub)');
  svg.append('text').attr('x',W-142).attr('y',pad.t+8).attr('fill','var(--ink-dim)').attr('font-family','var(--font-mono)').attr('font-size',9).text('scale-free (λc → 0)');
  svg.append('circle').attr('cx',W-150).attr('cy',pad.t+20).attr('r',4).attr('fill','var(--accent-edge)');
  svg.append('text').attr('x',W-142).attr('y',pad.t+24).attr('fill','var(--ink-dim)').attr('font-family','var(--font-mono)').attr('font-size',9).text('random (finite λc)');
  return {};
}
