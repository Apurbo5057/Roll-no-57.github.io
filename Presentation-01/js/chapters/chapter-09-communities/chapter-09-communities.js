/* ============================================================
   CHAPTER 09 — Communities
   -------------------------------------------------------------
   Folder: js/chapters/chapter-09-communities/
     chapter-09-communities.js  <- this file
     images/  <- empty; book figures hot-linked

   SIMULATED: Girvan-Newman link removal (centerpiece),
     modularity partition demo.
   EMBEDDED: 9.1, 9.2, 9.3, 9.5, 9.7, 9.9, 9.12, 9.13, 9.14,
     9.16, 9.18, 9.20, 9.21, 9.27, 9.30.

   Requires shared lib: createGirvanNewmanSim, createModularitySim
   ============================================================ */

window.chapters = window.chapters || [];

window.chapters.push({
  id: 'ch09',
  title: 'Communities',
  slides: [
    // Chapter title slide
    `<section class="chapter-divider" style="text-align:center;">
      <div style="margin-top:20%;">
        <p style="font-family:var(--font-mono); color:var(--accent-edge); font-size:1rem; letter-spacing:0.14em; text-transform:uppercase;">Chapter 09</p>
        <h1 style="font-size:2.8rem; margin-top:0.6em;">Communities</h1>
        <div style="width:120px; height:1px; background:var(--rule); margin:2rem auto;"></div>
      </div>
    </section>`,

    // 1. Title
    `<section>
      <h2>Communities</h2>
      <div class="two-col">
        <div>
          <p>Networks aren't uniform. They break into <strong>communities</strong> &mdash; groups densely wired inside, loosely wired to the rest.</p>
          <p>Finding them reveals functional modules in cells, interest groups in society, topics on the Web &mdash; all from the wiring alone.</p>
        </div>
        <img src="https://networksciencebook.com/images/ch-09/figure-9-1.jpg" alt="Communities in Belgium" style="width:100%; border-radius:6px; border:1px solid var(--rule);">
      </div>
      <p class="caption">Image 9.1 &mdash; the Belgian call network splits into French- and Dutch-speaking communities, recovered from call data alone.</p>
    </section>`,

    // 2. The karate club
    `<section>
      <h2>The Fundamental Hypothesis</h2>
      <div class="two-col">
        <div>
          <p><strong>H1:</strong> a network's community structure is uniquely encoded in its wiring diagram &mdash; not imposed from outside.</p>
          <p>The classic proof: Zachary's karate club split into two factions after a dispute. The network structure <em>predicts the split</em> almost perfectly.</p>
        </div>
        <img src="https://networksciencebook.com/images/ch-09/figure-9-2.jpg" alt="Zachary karate club" style="width:100%; border-radius:6px; border:1px solid var(--rule);">
      </div>
      <p class="caption">Image 9.2 &mdash; the canonical test case for community detection.</p>
    </section>`,

    // 3. Defining communities
    `<section>
      <h2>What Is a Community?</h2>
      <p><strong>H2 &mdash; Connectedness &amp; Density:</strong> a community is a locally dense connected subgraph. Several definitions satisfy this:</p>
      <div class="two-col">
        <div class="panel">
          <strong>Strong community</strong>
          <div class="eq-panel" style="font-size:0.85rem;">\\[ k_i^{int}(C) > k_i^{ext}(C) \\;\\; \\forall i \\]</div>
          <p class="caption">Every node has more internal than external links.</p>
        </div>
        <div class="panel">
          <strong>Weak community</strong>
          <div class="eq-panel" style="font-size:0.85rem;">\\[ \\sum_i k_i^{int} > \\sum_i k_i^{ext} \\]</div>
          <p class="caption">Holds on average, not per node.</p>
        </div>
      </div>
      <p class="caption">Every clique is a strong community; every strong community is a weak one. The converses fail.</p>
    </section>`,

    // 4. The combinatorial explosion
    `<section>
      <h2>Why It's Hard</h2>
      <div class="two-col">
        <div>
          <p>The number of ways to partition \\(N\\) nodes is the <strong>Bell number</strong>:</p>
          <div class="eq-panel">\\[ B_N = \\frac{1}{e}\\sum_{j=0}^{\\infty} \\frac{j^N}{j!} \\]</div>
          <p>It grows <em>faster than exponentially</em> &mdash; over \\(10^{40}\\) partitions for just \\(N=50\\).</p>
          <p class="caption">Brute force is hopeless. Every method is a clever heuristic; none is provably "the" answer.</p>
        </div>
        <img src="https://networksciencebook.com/images/ch-09/figure-9-7.jpg" alt="Number of partitions" style="width:100%; border-radius:6px; border:1px solid var(--rule);">
      </div>
    </section>`,

    // 5. Girvan-Newman - LIVE centerpiece
    `<section>
      <h2>Girvan&ndash;Newman &mdash; cut the bridges</h2>
      <p>Inter-community links carry the most shortest paths (everything crossing between groups funnels through them). Remove the highest <strong>link betweenness</strong> edge, recompute, repeat &mdash; and watch the communities fall apart, each recoloured as it separates.</p>
      <div class="sim-container" id="gn-sim" style="height:330px;"></div>
      <div class="sim-controls">
        <button onclick="window.gnSim.removeTopLink()">remove top link</button>
        <button onclick="window.gnSim.reset()">reset</button>
        <span id="gn-label"></span>
      </div>
    </section>`,

    // 6. Agglomerative vs divisive (book image)
    `<section>
      <h2>Hierarchical Clustering</h2>
      <div class="two-col">
        <div>
          <p>Two directions, both building a <strong>dendrogram</strong>:</p>
          <ul style="font-size:0.9rem;">
            <li><strong>Agglomerative (Ravasz):</strong> start with singletons, merge the most similar. Uses topological overlap \\(x_{ij}^o\\).</li>
            <li><strong>Divisive (Girvan&ndash;Newman):</strong> start whole, cut the highest-betweenness links.</li>
          </ul>
          <p class="caption">On the karate club, Girvan&ndash;Newman got the real split with just one node misclassified.</p>
        </div>
        <img src="https://networksciencebook.com/images/ch-09/figure-9-12.jpg" alt="Girvan-Newman algorithm" style="width:100%; border-radius:6px; border:1px solid var(--rule);">
      </div>
    </section>`,

    // 7. Hierarchy & scale-free (book image)
    `<section>
      <h2>Communities Meet Scale-Free</h2>
      <div class="two-col">
        <div>
          <p>How can a scale-free network have separable communities if hubs link many at once? The <strong>hierarchical model</strong> resolves it &mdash; simultaneously scale-free and modular:</p>
          <div class="eq-panel" style="font-size:0.85rem;">\\[ \\gamma = 1 + \\frac{\\ln 5}{\\ln 4} = 2.16, \\quad C(k) \\sim k^{-1} \\]</div>
          <p class="caption">\\(C(k)\\sim k^{-1}\\) is the hierarchy signature: small nodes in dense communities, hubs bridging them. Flat for ER/BA; decreasing for 9 of 10 real networks.</p>
        </div>
        <img src="https://networksciencebook.com/images/ch-09/figure-9-13.jpg" alt="Hierarchical network" style="width:100%; border-radius:6px; border:1px solid var(--rule);">
      </div>
    </section>`,

    // 8. Modularity
    `<section>
      <h2>Modularity &mdash; scoring a partition</h2>
      <p><strong>H3:</strong> random networks have no communities. So a real community has more internal links than a random network with the same degrees. Modularity measures that excess:</p>
      <div class="eq-panel">\\[ M = \\sum_{c=1}^{n_c} \\left[ \\frac{L_c}{L} - \\left(\\frac{k_c}{2L}\\right)^2 \\right] \\]</div>
      <p class="caption">\\(M&gt;0\\): real structure (higher = better, max &lt; 1). \\(M=0\\): single community. \\(M&lt;0\\): every node separate. <strong>H4:</strong> the max-\\(M\\) partition is the best one.</p>
    </section>`,

    // 9. Modularity demo - LIVE
    `<section>
      <h2>Modularity in Action</h2>
      <p>The same network under different partitions. Cycle through them and watch \\(M\\): the natural two-community split scores highest, lumping-everything scores 0, and all-singletons goes negative.</p>
      <div class="sim-container" id="mod-sim" style="height:300px;"></div>
      <div class="sim-controls">
        <button onclick="window.modSim.cycle()">next partition</button>
        <span id="mod-label"></span>
      </div>
    </section>`,

    // 10. Greedy/Louvain + limits (book image)
    `<section>
      <h2>Maximizing Modularity &mdash; and Its Limits</h2>
      <div class="two-col">
        <div>
          <p><strong>Louvain</strong> is the workhorse: local greedy optimization, collapse communities into super-nodes, repeat. Near-linear &mdash; scales to millions of nodes.</p>
          <p>But two cautions:</p>
          <ul style="font-size:0.88rem;">
            <li><strong>Resolution limit:</strong> can't see communities below \\(\\sqrt{2L}\\) &mdash; merges small real ones.</li>
            <li><strong>Modularity plateau:</strong> many very different partitions have near-max \\(M\\), so the max isn't unique.</li>
          </ul>
        </div>
        <img src="https://networksciencebook.com/images/ch-09/figure-9-18.jpg" alt="Modularity maxima" style="width:100%; border-radius:6px; border:1px solid var(--rule);">
      </div>
    </section>`,

    // 11. Overlapping communities (book image)
    `<section>
      <h2>Overlapping Communities</h2>
      <div class="two-col">
        <div>
          <p>Real nodes belong to <em>many</em> communities. <strong>Clique percolation (CFinder)</strong> rolls \\(k\\)-cliques across the network; two are adjacent if they share \\(k-1\\) nodes.</p>
          <p class="caption">The word "bright" lands in four communities at once: light (<em>glow</em>), color (<em>yellow</em>), astronomy (<em>sun</em>), and intelligence (<em>brilliant</em>) &mdash; which partition methods would wrongly force into one.</p>
        </div>
        <img src="https://networksciencebook.com/images/ch-09/figure-9-21.jpg" alt="Overlapping communities bright" style="width:100%; border-radius:6px; border:1px solid var(--rule);">
      </div>
    </section>`,

    // 12. Testing (book image)
    `<section>
      <h2>Testing the Algorithms</h2>
      <div class="two-col">
        <div>
          <p>With no ground truth in real networks, test on <strong>benchmarks</strong> with planted communities:</p>
          <ul style="font-size:0.9rem;">
            <li><strong>GN benchmark</strong> &mdash; tunable community fuzziness.</li>
            <li><strong>LFR benchmark</strong> &mdash; realistic scale-free planted structure.</li>
          </ul>
          <p class="caption">Accuracy measured by normalized mutual information. No universal winner &mdash; speed (Louvain's near-linearity) often decides usability.</p>
        </div>
        <img src="https://networksciencebook.com/images/ch-09/figure-9-27.jpg" alt="Testing against benchmarks" style="width:100%; border-radius:6px; border:1px solid var(--rule);">
      </div>
    </section>`,

    // 13. Characterizing (book image)
    `<section>
      <h2>What Real Communities Look Like</h2>
      <div class="two-col">
        <div>
          <ul style="font-size:0.92rem;">
            <li><strong>Fat-tailed sizes:</strong> many small communities, a few huge ones &mdash; echoing the scale-free theme.</li>
            <li><strong>Weak ties (Granovetter):</strong> strong links <em>within</em> communities, weak links <em>between</em>. Weak ties bridge groups.</li>
            <li><strong>Evolution:</strong> communities are born, grow, merge, split, and die over time.</li>
          </ul>
        </div>
        <img src="https://networksciencebook.com/images/ch-09/figure-9-30.jpg" alt="Communities and link weights" style="width:100%; border-radius:6px; border:1px solid var(--rule);">
      </div>
      <p class="caption">Image 9.30 &mdash; Granovetter's weak ties, confirmed in the mobile call network.</p>
    </section>`,

    // 14. Summary
    `<section>
      <h2>Summary</h2>
      <div class="two-col">
        <div>
          <p>The chain of ideas:</p>
          <ol style="font-size:0.9rem;">
            <li>Communities = dense connected subgraphs, encoded in the wiring.</li>
            <li>Can't enumerate all partitions &rarr; need heuristics.</li>
            <li>Hierarchical clustering builds dendrograms; \\(C(k)\\sim k^{-1}\\) reveals hierarchy.</li>
            <li>Modularity scores partitions; Louvain maximizes it fast.</li>
            <li>Clique percolation handles overlaps; benchmarks test accuracy.</li>
          </ol>
        </div>
        <div class="panel">
          <strong>The meta-message</strong>
          <p class="caption">Community detection is <em>ill-posed</em> &mdash; no single correct definition or algorithm. Always state your definition, validate against a null model, and treat any one partition with healthy skepticism.</p>
        </div>
      </div>
    </section>`
  ],

  afterRender: function () {
    const gn = document.getElementById('gn-sim');
    if (gn && gn.clientWidth > 0 && !gn.dataset.inited) { window.gnSim = createGirvanNewmanSim(gn, { labelEl: document.getElementById('gn-label') }); gn.dataset.inited = '1'; }

    const md = document.getElementById('mod-sim');
    if (md && md.clientWidth > 0 && !md.dataset.inited) { window.modSim = createModularitySim(md, { labelEl: document.getElementById('mod-label') }); md.dataset.inited = '1'; }
  }
});
