/* ============================================================
   CHAPTER 02 — Graph Theory
   -------------------------------------------------------------
   Folder layout expected:
     js/chapters/chapter-02-graph-theory/
       chapter-02-graph-theory.js   <- this file
       images/                      <- empty; no book images required
                                       (all visuals are redrawn or simulated)

   Requires the shared lib to expose:
     createBFSSim(container, {statsEl})
     createDegreeDistSim(container, {N, m})
   (both were appended to js/lib/network-sim.js)
   ============================================================ */

window.chapters = window.chapters || [];

window.chapters.push({
  id: 'ch02',
  title: 'Graph Theory',
  slides: [
    // Chapter title slide
    `<section class="chapter-divider" style="text-align:center;">
      <div style="margin-top:20%;">
        <p style="font-family:var(--font-mono); color:var(--accent-edge); font-size:1rem; letter-spacing:0.14em; text-transform:uppercase;">Chapter 02</p>
        <h1 style="font-size:2.8rem; margin-top:0.6em;">Graph Theory</h1>
        <div style="width:120px; height:1px; background:var(--rule); margin:2rem auto;"></div>
      </div>
    </section>`,

    // 1. Königsberg — the origin
    `<section>
      <h2>The Bridges of Königsberg</h2>
      <div class="two-col">
        <div>
          <p>Seven bridges, four land masses. Can you walk a route crossing every bridge exactly once?</p>
          <p>Euler (1735) proved it's <strong>impossible</strong> &mdash; and invented graph theory doing it. He threw away the geography: each land mass a <em>node</em>, each bridge a <em>link</em>.</p>
          <p class="caption">A pass-through node needs an even number of links (one in, one out). Königsberg had four odd-degree nodes &mdash; too many.</p>
        </div>
        <svg viewBox="0 0 300 220" width="100%" height="260">
          <line x1="150" y1="40" x2="80" y2="110" stroke="var(--accent-edge)" stroke-width="2"/>
          <line x1="150" y1="40" x2="220" y2="110" stroke="var(--accent-edge)" stroke-width="2"/>
          <line x1="80" y1="110" x2="150" y2="120" stroke="var(--accent-edge)" stroke-width="2"/>
          <line x1="220" y1="110" x2="150" y2="120" stroke="var(--accent-edge)" stroke-width="2"/>
          <line x1="80" y1="110" x2="150" y2="190" stroke="var(--accent-edge)" stroke-width="2"/>
          <line x1="220" y1="110" x2="150" y2="190" stroke="var(--accent-edge)" stroke-width="2"/>
          <path d="M150,120 C120,150 120,170 150,190" fill="none" stroke="var(--accent-edge)" stroke-width="2"/>
          <g font-family="var(--font-mono)" font-size="13" fill="#12151c">
            <circle cx="150" cy="40" r="16" fill="var(--accent-hub)"/><text x="150" y="45" text-anchor="middle">A</text>
            <circle cx="80" cy="110" r="16" fill="var(--accent-hub)"/><text x="80" y="115" text-anchor="middle">B</text>
            <circle cx="220" cy="110" r="16" fill="var(--accent-hub)"/><text x="220" y="115" text-anchor="middle">C</text>
            <circle cx="150" cy="155" r="16" fill="var(--accent-hub)"/><text x="150" y="160" text-anchor="middle">D</text>
          </g>
        </svg>
      </div>
    </section>`,

    // 2. Two lessons + N, L
    `<section>
      <h2>Different Systems, Same Graph</h2>
      <div class="two-col">
        <div>
          <p>Internet routers, co-acting actors, interacting proteins &mdash; utterly different systems can share the <em>exact same graph</em>. That shared abstraction is what makes one common toolkit possible.</p>
          <p>Two basic parameters:</p>
          <ul>
            <li><strong>N</strong> &mdash; number of nodes (the network's size)</li>
            <li><strong>L</strong> &mdash; number of links</li>
          </ul>
        </div>
        <svg viewBox="0 0 240 180" width="100%" height="200">
          <line x1="60" y1="50" x2="180" y2="50" stroke="var(--accent-edge)" stroke-width="2"/>
          <line x1="60" y1="50" x2="60" y2="130" stroke="var(--accent-edge)" stroke-width="2"/>
          <line x1="180" y1="50" x2="60" y2="130" stroke="var(--accent-edge)" stroke-width="2"/>
          <line x1="180" y1="50" x2="180" y2="130" stroke="var(--accent-edge)" stroke-width="2"/>
          <g font-family="var(--font-mono)" font-size="12" fill="#12151c">
            <circle cx="60" cy="50" r="14" fill="var(--accent-hub)"/><text x="60" y="54" text-anchor="middle">1</text>
            <circle cx="180" cy="50" r="14" fill="var(--accent-hub)"/><text x="180" y="54" text-anchor="middle">2</text>
            <circle cx="60" cy="130" r="14" fill="var(--accent-hub)"/><text x="60" y="134" text-anchor="middle">3</text>
            <circle cx="180" cy="130" r="14" fill="var(--accent-hub)"/><text x="180" y="134" text-anchor="middle">4</text>
          </g>
          <text x="120" y="170" text-anchor="middle" fill="var(--ink-dim)" font-family="var(--font-mono)" font-size="12">N = 4, L = 4</text>
        </svg>
      </div>
    </section>`,

    // 3. Degree + average degree (equations)
    `<section>
      <h2>Degree &amp; Average Degree</h2>
      <p>The <strong>degree</strong> \\(k_i\\) is the number of links node \\(i\\) has. For an undirected network, total links relate to degrees by:</p>
      <div class="eq-panel">
        \\[ L = \\frac{1}{2}\\sum_{i=1}^{N} k_i \\qquad\\qquad \\langle k \\rangle = \\frac{2L}{N} \\]
      </div>
      <p>The \\(\\tfrac{1}{2}\\) corrects for counting each link twice &mdash; once from each end. For <strong>directed</strong> networks, degree splits into in and out:</p>
      <div class="eq-panel">
        \\[ k_i = k_i^{in} + k_i^{out} \\qquad\\qquad \\langle k^{in} \\rangle = \\langle k^{out} \\rangle = \\frac{L}{N} \\]
      </div>
    </section>`,

    // 4. Degree distribution (equation + why it matters)
    `<section>
      <h2>The Degree Distribution</h2>
      <p>\\(p_k\\) is the probability a randomly chosen node has degree \\(k\\) &mdash; just a normalized histogram of degrees:</p>
      <div class="eq-panel">
        \\[ p_k = \\frac{N_k}{N}, \\qquad \\sum_{k=1}^{\\infty} p_k = 1, \\qquad \\langle k \\rangle = \\sum_{k=0}^{\\infty} k\\,p_k \\]
      </div>
      <p>This is <strong>the</strong> central object of the book: most network properties &mdash; robustness, virus spread, resilience &mdash; depend on the <em>shape</em> of \\(p_k\\), not just its average.</p>
    </section>`,

    // 5. Live degree distribution (simulation)
    `<section>
      <h2>Why the Average Misleads</h2>
      <p>A generated scale-free network (\\(N = 2000\\)). Most nodes have very few links, a handful are huge hubs. Switch to log-log axes to see the straight-line signature.</p>
      <div class="sim-container" id="degdist-sim"></div>
      <div class="sim-controls">
        <button onclick="window.__degdistLog = window.degDistSim.toggleScale()">toggle linear / log-log</button>
        <span class="caption">The mean sits in an almost empty region &mdash; no node is "typical".</span>
      </div>
    </section>`,

    // 6. Adjacency matrix
    `<section>
      <h2>The Adjacency Matrix</h2>
      <div class="two-col">
        <div>
          <p>An \\(N \\times N\\) matrix: \\(A_{ij} = 1\\) if a link exists, else \\(0\\).</p>
          <p>Undirected networks give a <strong>symmetric</strong> matrix (\\(A_{ij} = A_{ji}\\)). A node's degree is a row or column sum:</p>
          <div class="eq-panel">\\[ k_i = \\sum_{j=1}^{N} A_{ij} \\]</div>
        </div>
        <svg viewBox="0 0 200 200" width="100%" height="200">
          <g font-family="var(--font-mono)" font-size="15" fill="var(--ink)" text-anchor="middle">
            <text x="30" y="25" fill="var(--ink-dim)">1</text><text x="70" y="25" fill="var(--ink-dim)">2</text><text x="110" y="25" fill="var(--ink-dim)">3</text><text x="150" y="25" fill="var(--ink-dim)">4</text>
            <text x="10" y="55" fill="var(--ink-dim)">1</text><text x="10" y="90" fill="var(--ink-dim)">2</text><text x="10" y="125" fill="var(--ink-dim)">3</text><text x="10" y="160" fill="var(--ink-dim)">4</text>
            <text x="30" y="55">0</text><text x="70" y="55" fill="var(--accent-hub)">1</text><text x="110" y="55" fill="var(--accent-hub)">1</text><text x="150" y="55">0</text>
            <text x="30" y="90" fill="var(--accent-hub)">1</text><text x="70" y="90">0</text><text x="110" y="90" fill="var(--accent-hub)">1</text><text x="150" y="90" fill="var(--accent-hub)">1</text>
            <text x="30" y="125" fill="var(--accent-hub)">1</text><text x="70" y="125" fill="var(--accent-hub)">1</text><text x="110" y="125">0</text><text x="150" y="125">0</text>
            <text x="30" y="160">0</text><text x="70" y="160" fill="var(--accent-hub)">1</text><text x="110" y="160">0</text><text x="150" y="160">0</text>
          </g>
          <line x1="22" y1="38" x2="22" y2="170" stroke="var(--rule)" stroke-width="1.5"/>
          <line x1="168" y1="38" x2="168" y2="170" stroke="var(--rule)" stroke-width="1.5"/>
        </svg>
      </div>
    </section>`,

    // 7. Sparsity
    `<section>
      <h2>Real Networks Are Sparse</h2>
      <div class="two-col">
        <div>
          <p>A <strong>complete graph</strong> (everyone linked to everyone) has the maximum:</p>
          <div class="eq-panel">\\[ L_{max} = \\binom{N}{2} = \\frac{N(N-1)}{2} \\]</div>
          <p>Real networks have \\(L \\ll L_{max}\\). The WWW sample uses about <strong>0.003%</strong> of possible links &mdash; so we store a link list, not a near-empty matrix.</p>
        </div>
        <svg viewBox="0 0 200 200" width="100%" height="200">
          <text x="100" y="15" text-anchor="middle" fill="var(--ink-dim)" font-family="var(--font-mono)" font-size="11">sparse adjacency matrix</text>
          <rect x="30" y="25" width="150" height="150" fill="var(--bg-panel-2)" stroke="var(--rule)"/>
          <g fill="var(--accent-hub)">
            <rect x="45" y="55" width="6" height="6"/><rect x="90" y="40" width="6" height="6"/>
            <rect x="140" y="70" width="6" height="6"/><rect x="60" y="110" width="6" height="6"/>
            <rect x="120" y="130" width="6" height="6"/><rect x="155" y="95" width="6" height="6"/>
            <rect x="75" y="150" width="6" height="6"/><rect x="105" y="60" width="6" height="6"/>
            <rect x="40" y="140" width="6" height="6"/><rect x="160" y="150" width="6" height="6"/>
          </g>
        </svg>
      </div>
    </section>`,

    // 8. Bipartite
    `<section>
      <h2>Bipartite Networks</h2>
      <div class="two-col">
        <div>
          <p>Two disjoint node sets; links only ever cross between them, never within a set.</p>
          <p>Any bipartite network yields two <strong>projections</strong> &mdash; e.g. the actor&ndash;movie network projects to the actor network (two actors linked if they shared a film), or to the movie network.</p>
          <p class="caption">The Human Disease Network (diseases &harr; genes) works the same way.</p>
        </div>
        <svg viewBox="0 0 220 200" width="100%" height="200">
          <line x1="60" y1="40" x2="160" y2="60" stroke="var(--rule)" stroke-width="1.5"/>
          <line x1="60" y1="40" x2="160" y2="120" stroke="var(--rule)" stroke-width="1.5"/>
          <line x1="60" y1="100" x2="160" y2="60" stroke="var(--rule)" stroke-width="1.5"/>
          <line x1="60" y1="100" x2="160" y2="180" stroke="var(--rule)" stroke-width="1.5"/>
          <line x1="60" y1="160" x2="160" y2="120" stroke="var(--rule)" stroke-width="1.5"/>
          <g>
            <circle cx="60" cy="40" r="11" fill="var(--accent-edge)"/>
            <circle cx="60" cy="100" r="11" fill="var(--accent-edge)"/>
            <circle cx="60" cy="160" r="11" fill="var(--accent-edge)"/>
            <circle cx="160" cy="60" r="11" fill="var(--accent-hub)"/>
            <circle cx="160" cy="120" r="11" fill="var(--accent-hub)"/>
            <circle cx="160" cy="180" r="11" fill="var(--accent-hub)"/>
          </g>
          <text x="60" y="192" text-anchor="middle" fill="var(--accent-edge)" font-family="var(--font-mono)" font-size="11">set U</text>
          <text x="160" y="20" text-anchor="middle" fill="var(--accent-hub)" font-family="var(--font-mono)" font-size="11">set V</text>
        </svg>
      </div>
    </section>`,

    // 9. Paths & distances
    `<section>
      <h2>Paths &amp; Distances</h2>
      <p>In networks, physical distance is replaced by <strong>path length</strong> &mdash; the number of links along a route.</p>
      <div class="two-col">
        <ul>
          <li><strong>Distance</strong> \\(d_{ij}\\) &mdash; the shortest path (fewest links) between two nodes</li>
          <li><strong>Diameter</strong> \\(d_{max}\\) &mdash; the largest distance in the network</li>
        </ul>
        <div>
          <p>Average distance over all connected pairs:</p>
          <div class="eq-panel">\\[ \\langle d \\rangle = \\frac{1}{N(N-1)}\\sum_{i \\neq j} d_{ij} \\]</div>
        </div>
      </div>
      <p class="caption">Path counts also come straight from the matrix: the number of length-\\(d\\) paths between \\(i\\) and \\(j\\) is the \\((i,j)\\) entry of \\(A^d\\).</p>
    </section>`,

    // 10. BFS animation (interactive)
    `<section>
      <h2>Breadth-First Search &mdash; watch it spread</h2>
      <p>BFS finds distances like ripples from a pebble: label the start 0, its neighbors 1, their unlabeled neighbors 2, and so on. A node's label <em>is</em> its distance. Cost is \\(O(N+L)\\) &mdash; linear.</p>
      <div class="sim-container" id="bfs-sim" style="height:340px;"></div>
      <div class="sim-controls">
        <button onclick="window.bfsSim.run(0)">run BFS</button>
        <button onclick="window.bfsSim.reset()">reset</button>
        <span id="bfs-stats"></span>
      </div>
    </section>`,

    // 11. Connectedness + clustering
    `<section>
      <h2>Connectedness &amp; Clustering</h2>
      <div class="two-col">
        <div>
          <p><strong>Components</strong> are maximal groups where every pair is reachable. Real networks usually have one <em>giant component</em> plus small scattered ones. A <strong>bridge</strong> is a link whose removal disconnects the network.</p>
        </div>
        <div>
          <p>The <strong>local clustering coefficient</strong> asks "do my neighbors know each other?"</p>
          <div class="eq-panel">\\[ C_i = \\frac{2L_i}{k_i(k_i - 1)} \\]</div>
          <p class="caption">\\(L_i\\) = links among \\(i\\)'s neighbors. Ranges 0 (none connected) to 1 (all connected).</p>
        </div>
      </div>
    </section>`
  ],

  afterRender: function () {
    const dd = document.getElementById('degdist-sim');
    if (dd && dd.clientWidth > 0 && !dd.dataset.inited) {
      window.degDistSim = createDegreeDistSim(dd, { N: 2000, m: 2 });
      dd.dataset.inited = '1';
    }
    const bfs = document.getElementById('bfs-sim');
    if (bfs && bfs.clientWidth > 0 && !bfs.dataset.inited) {
      window.bfsSim = createBFSSim(bfs, { statsEl: document.getElementById('bfs-stats') });
      bfs.dataset.inited = '1';
    }
  }
});