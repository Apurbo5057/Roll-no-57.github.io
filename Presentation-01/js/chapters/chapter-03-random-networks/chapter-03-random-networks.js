/* ============================================================
   CHAPTER 03 — Random Networks (Erdos-Renyi)
   -------------------------------------------------------------
   Folder layout expected:
     js/chapters/chapter-03-random-networks/
       chapter-03-random-networks.js   <- this file
       images/
         3-21-phase-transition.jpg  <- OPTIONAL: Image 3.21 (ice/magnet
                                        analogy). Only needed if you keep the
                                        commented-out image block on the
                                        phase-transition-analogy slide below.

   Requires the shared lib to expose (appended to js/lib/network-sim.js):
     createPhaseTransitionSim(container, {N, initialK, labelEl})
     createBinomialPoissonSim(container, {N, k})
     createSmallWorldSim(container, {k, log})
     createWattsStrogatzSim(container, {N, kEach, initialP, labelEl})
   ============================================================ */

window.chapters = window.chapters || [];

window.chapters.push({
  id: 'ch03',
  title: 'Random Networks',
  slides: [
    // Chapter title slide
    `<section class="chapter-divider" style="text-align:center;">
      <div style="margin-top:20%;">
        <p style="font-family:var(--font-mono); color:var(--accent-edge); font-size:1rem; letter-spacing:0.14em; text-transform:uppercase;">Chapter 03</p>
        <h1 style="font-size:2.8rem; margin-top:0.6em;">Random Networks</h1>
        <div style="width:120px; height:1px; background:var(--rule); margin:2rem auto;"></div>
      </div>
    </section>`,

    // 1. Title / cocktail party
    `<section>
      <h2>Random Networks</h2>
      <div class="two-col">
        <div>
          <p>Tell one guest at a party a secret. It seems safe &mdash; meeting all 99 others would take 16 hours. But invisible <em>paths</em> form through intermediaries long before everyone has met.</p>
          <p>The lesson this chapter proves: you need barely <strong>one link per node</strong> before a single web connects everyone.</p>
        </div>
        <svg viewBox="0 0 260 200" width="100%" height="220">
          <g stroke="var(--rule)" stroke-width="1.5">
            <line x1="60" y1="50" x2="120" y2="40"/><line x1="120" y1="40" x2="100" y2="90"/>
            <line x1="180" y1="60" x2="210" y2="110"/><line x1="70" y1="140" x2="120" y2="160"/>
            <line x1="120" y1="160" x2="180" y2="150"/>
          </g>
          <g fill="var(--accent-edge)">
            <circle cx="60" cy="50" r="7"/><circle cx="120" cy="40" r="7"/><circle cx="100" cy="90" r="7"/>
            <circle cx="180" cy="60" r="7"/><circle cx="210" cy="110" r="7"/><circle cx="70" cy="140" r="7"/>
            <circle cx="120" cy="160" r="7"/><circle cx="180" cy="150" r="7"/>
          </g>
        </svg>
      </div>
    </section>`,

    // 2. Definition + link count
    `<section>
      <h2>The G(N, p) Model</h2>
      <p>\\(N\\) nodes; connect each of the \\(N(N-1)/2\\) possible pairs independently with probability \\(p\\). The number of links varies between realizations &mdash; its distribution is binomial:</p>
      <div class="eq-panel">
        \\[ \\langle L \\rangle = p\\,\\frac{N(N-1)}{2}, \\qquad \\langle k \\rangle = \\frac{2\\langle L \\rangle}{N} = p(N-1) \\]
      </div>
      <p class="caption">Average degree = (chance a link exists) &times; (max links per node). Raise \\(p\\) and the network densifies.</p>
    </section>`,

    // 3. Degree distribution: binomial -> Poisson (equations)
    `<section>
      <h2>Degree Distribution: Binomial &rarr; Poisson</h2>
      <p>Each node has \\(N-1\\) possible links, each present with probability \\(p\\):</p>
      <div class="eq-panel">\\[ p_k = \\binom{N-1}{k} p^k (1-p)^{N-1-k} \\]</div>
      <p>For sparse networks (\\(\\langle k \\rangle \\ll N\\), true of almost all real ones) this collapses to the far simpler <strong>Poisson</strong> form:</p>
      <div class="eq-panel">\\[ p_k = e^{-\\langle k \\rangle}\\,\\frac{\\langle k \\rangle^{k}}{k!} \\]</div>
      <p class="caption">Peaks at \\(\\langle k \\rangle\\); width \\(\\sigma_k = \\langle k \\rangle^{1/2}\\); depends only on \\(\\langle k \\rangle\\), not \\(N\\).</p>
    </section>`,

    // 4. Live binomial vs Poisson
    `<section>
      <h2>Binomial vs. Poisson &mdash; live</h2>
      <p>The exact binomial (bars) and its Poisson approximation (curve). For sparse networks they're nearly identical &mdash; both peak at \\(\\langle k \\rangle\\) with a narrow spread.</p>
      <div class="sim-container" id="binpois-sim"></div>
      <div class="sim-controls">
        <label>⟨k⟩ <input type="range" id="binpois-k" min="2" max="30" value="10" step="1" oninput="window.binPoisSim.setK(+this.value)"></label>
        <span class="caption">Notice: no matter the settings, a hump &mdash; never a fat tail of hubs.</span>
      </div>
    </section>`,

    // 5. No hubs problem
    `<section>
      <h2>The Missing Hubs</h2>
      <div class="two-col">
        <div>
          <p>Model society as random: \\(\\langle k \\rangle \\approx 1000\\), \\(N \\approx 7\\times10^9\\). The predictions:</p>
          <ul>
            <li>Most connected: \\(k_{max} \\approx 1185\\)</li>
            <li>Least connected: \\(k_{min} \\approx 816\\)</li>
            <li>Spread: \\(\\sigma_k \\approx 32\\)</li>
          </ul>
          <p>Everyone has 968&ndash;1032 friends. <strong>No outliers.</strong></p>
        </div>
        <div>
          <p>But reality has hubs: FDR personally met ~22,000 people; Facebook users hit the 5,000-friend cap.</p>
          <div class="eq-panel">\\[ p_k = \\frac{e^{-\\langle k\\rangle}}{\\sqrt{2\\pi k}}\\left(\\frac{e\\langle k\\rangle}{k}\\right)^{k} \\]</div>
          <p class="caption">The \\(1/k!\\) term kills hubs <em>faster than exponentially</em>. The random model simply cannot produce them.</p>
        </div>
      </div>
    </section>`,

    // 6. Phase transition (THE interactive)
    `<section>
      <h2>The Phase Transition &mdash; drag ⟨k⟩</h2>
      <p>Grow the network by raising \\(\\langle k \\rangle\\). The giant component (amber) stays absent&hellip; then snaps into existence exactly at \\(\\langle k \\rangle = 1\\). The curve at right is the theory \\(S = 1 - e^{-\\langle k\\rangle S}\\).</p>
      <div class="sim-container" id="phase-sim" style="height:360px;"></div>
      <div class="sim-controls">
        <label>⟨k⟩ <input type="range" id="phase-k" min="0" max="4" value="0.5" step="0.05" oninput="window.phaseSim.setK(+this.value)"></label>
        <span id="phase-label"></span>
      </div>
    </section>`,

    // 7. Four regimes
    `<section>
      <h2>Four Regimes</h2>
      <div class="two-col">
        <div class="panel">
          <strong style="color:var(--accent-danger)">Subcritical &nbsp;⟨k⟩ &lt; 1</strong>
          <p class="caption">Many tiny tree-like clusters, comparable sizes. Largest \\(\\sim \\ln N\\). No giant component.</p>
        </div>
        <div class="panel">
          <strong style="color:var(--accent-hub)">Critical &nbsp;⟨k⟩ = 1</strong>
          <p class="caption">Largest \\(\\sim N^{2/3}\\). Component sizes follow a power law \\(p_s \\sim s^{-3/2}\\).</p>
        </div>
        <div class="panel">
          <strong style="color:var(--accent-edge)">Supercritical &nbsp;⟨k⟩ &gt; 1</strong>
          <p class="caption">Giant component holds a finite fraction: \\(N_G/N \\sim \\langle k\\rangle - 1\\). Real systems live here.</p>
        </div>
        <div class="panel">
          <strong>Connected &nbsp;⟨k⟩ &gt; ln N</strong>
          <p class="caption">Giant component absorbs everything; no isolated nodes remain.</p>
        </div>
      </div>
    </section>`,

    // 8. Phase transition analogy (physics)
    `<section>
      <h2>Why "Phase Transition" Is Literal</h2>
      <div class="two-col">
        <div>
          <p>The jump at \\(\\langle k \\rangle = 1\\) behaves exactly like water freezing or a metal magnetizing at a critical temperature &mdash; a sudden move from <strong>disorder to order</strong>.</p>
          <ul>
            <li>Cluster sizes follow power laws at the critical point</li>
            <li>Average cluster size <em>diverges</em> there</li>
            <li>The behavior is <em>universal</em> across unrelated systems</li>
          </ul>
          <p class="caption">This is why physicists were well-equipped to attack networks.</p>
        </div>
        <svg viewBox="0 0 240 200" width="100%" height="200">
          <text x="60" y="20" text-anchor="middle" fill="var(--ink-dim)" font-family="var(--font-mono)" font-size="10">disordered</text>
          <g fill="var(--accent-edge)">
            <circle cx="30" cy="45" r="5"/><circle cx="60" cy="60" r="5"/><circle cx="90" cy="42" r="5"/>
            <circle cx="45" cy="80" r="5"/><circle cx="80" cy="85" r="5"/><circle cx="30" cy="105" r="5"/>
            <circle cx="70" cy="110" r="5"/><circle cx="95" cy="95" r="5"/>
          </g>
          <path d="M120,80 L150,80 M145,74 L150,80 L145,86" stroke="var(--accent-hub)" stroke-width="1.5" fill="none"/>
          <text x="185" y="20" text-anchor="middle" fill="var(--ink-dim)" font-family="var(--font-mono)" font-size="10">ordered</text>
          <g fill="var(--accent-hub)">
            <circle cx="165" cy="45" r="5"/><circle cx="195" cy="45" r="5"/><circle cx="225" cy="45" r="5"/>
            <circle cx="165" cy="75" r="5"/><circle cx="195" cy="75" r="5"/><circle cx="225" cy="75" r="5"/>
            <circle cx="165" cy="105" r="5"/><circle cx="195" cy="105" r="5"/><circle cx="225" cy="105" r="5"/>
          </g>
        </svg>
      </div>
      <p class="caption">Optional: the book's Image 3.21 (ice / magnetism) can go here &mdash; see the commented image slot in this slide's source.</p>
      <!-- To use the book image instead of the schematic above, drop
           images/3-21-phase-transition.jpg in and uncomment:
      <img src="images/3-21-phase-transition.jpg" style="width:60%; border-radius:4px;">
      -->
    </section>`,

    // 9. Small world formula
    `<section>
      <h2>Small Worlds</h2>
      <p>The number of nodes within distance \\(d\\) grows like \\(\\langle k \\rangle^d\\). Setting that equal to \\(N\\) gives the small-world formula:</p>
      <div class="eq-panel">\\[ \\langle d \\rangle \\approx \\frac{\\ln N}{\\ln \\langle k \\rangle} \\]</div>
      <p>Distances grow only <strong>logarithmically</strong> with size &mdash; that's what "small world" means. For society (\\(N \\approx 7\\times10^9\\), \\(\\langle k \\rangle \\approx 1000\\)) this gives \\(\\langle d \\rangle \\approx 3.3\\).</p>
      <p class="caption">Milgram measured ~6 (median 5.2); Facebook (721M users) measured 4.74.</p>
    </section>`,

    // 10. Small world vs lattice (live plot)
    `<section>
      <h2>Why Small Worlds Are Surprising</h2>
      <p>A random network's \\(\\ln N\\) scaling crushes the polynomial growth of regular lattices. In a 2D grid, two people would be ~83,000 steps apart &mdash; not a handful.</p>
      <div class="sim-container" id="smallworld-sim"></div>
      <div class="sim-controls">
        <button onclick="window.smallWorldSim.toggleScale()">toggle linear / log-log</button>
      </div>
    </section>`,

    // 11. Watts-Strogatz (interactive) + clustering failure
    `<section>
      <h2>Clustering &amp; the Watts&ndash;Strogatz Fix</h2>
      <p>A random network's clustering is just \\(C_i = p = \\langle k\\rangle/N\\) &mdash; far too low and size-dependent, unlike real networks. Start from a ring and rewire a fraction of links: distances collapse while clustering stays high.</p>
      <div class="sim-container" id="ws-sim" style="height:320px;"></div>
      <div class="sim-controls">
        <label>rewiring p <input type="range" id="ws-p" min="0" max="1" value="0" step="0.02" oninput="window.wsSim.setP(+this.value)"></label>
        <span id="ws-label"></span>
      </div>
    </section>`,

    // 12. Summary scorecard
    `<section>
      <h2>Real Networks Are Not Random</h2>
      <table style="width:100%; border-collapse:collapse; font-size:0.9rem;">
        <tr style="border-bottom:1px solid var(--rule); color:var(--ink-dim);">
          <th style="text-align:left; padding:0.4rem;">Property</th><th style="text-align:left;">Random predicts</th><th style="text-align:center;">Verdict</th>
        </tr>
        <tr style="border-bottom:1px solid var(--rule);"><td style="padding:0.4rem;">Degree distribution</td><td>Poisson, no hubs</td><td style="text-align:center; color:var(--accent-danger);">&#10007;</td></tr>
        <tr style="border-bottom:1px solid var(--rule);"><td style="padding:0.4rem;">Giant component</td><td>Exists for ⟨k⟩&gt;1</td><td style="text-align:center; color:var(--accent-edge);">&#10003;</td></tr>
        <tr style="border-bottom:1px solid var(--rule);"><td style="padding:0.4rem;">Full connectivity</td><td>Should fragment</td><td style="text-align:center; color:var(--accent-danger);">&#10007;</td></tr>
        <tr style="border-bottom:1px solid var(--rule);"><td style="padding:0.4rem;">Average path length</td><td>ln N / ln⟨k⟩</td><td style="text-align:center; color:var(--accent-edge);">&#10003;</td></tr>
        <tr><td style="padding:0.4rem;">Clustering</td><td>~1/N, flat in k</td><td style="text-align:center; color:var(--accent-danger);">&#10007;</td></tr>
      </table>
      <p class="caption">Small-world is the only property it gets right &mdash; yet the model stays essential as the <em>null hypothesis</em>: could randomness alone explain what we see?</p>
    </section>`
  ],

  afterRender: function () {
    const bp = document.getElementById('binpois-sim');
    if (bp && bp.clientWidth > 0 && !bp.dataset.inited) { window.binPoisSim = createBinomialPoissonSim(bp, { N: 100, k: 10 }); bp.dataset.inited = '1'; }

    const ph = document.getElementById('phase-sim');
    if (ph && ph.clientWidth > 0 && !ph.dataset.inited) { window.phaseSim = createPhaseTransitionSim(ph, { N: 100, initialK: 0.5, labelEl: document.getElementById('phase-label') }); ph.dataset.inited = '1'; }

    const sw = document.getElementById('smallworld-sim');
    if (sw && sw.clientWidth > 0 && !sw.dataset.inited) { window.smallWorldSim = createSmallWorldSim(sw, { k: 4, log: false }); sw.dataset.inited = '1'; }

    const ws = document.getElementById('ws-sim');
    if (ws && ws.clientWidth > 0 && !ws.dataset.inited) { window.wsSim = createWattsStrogatzSim(ws, { N: 24, kEach: 4, initialP: 0, labelEl: document.getElementById('ws-label') }); ws.dataset.inited = '1'; }
  }
});