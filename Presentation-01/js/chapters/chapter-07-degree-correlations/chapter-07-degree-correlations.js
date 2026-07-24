/* ============================================================
   CHAPTER 07 — Degree Correlations
   -------------------------------------------------------------
   Folder: js/chapters/chapter-07-degree-correlations/
     chapter-07-degree-correlations.js  <- this file
     images/  <- empty; book figures hot-linked

   SIMULATED: assortativity toggle (centerpiece), k_nn(k) curves.
   EMBEDDED: 7.1, 7.2, 7.3, 7.6, 7.7, 7.13, 7.15, 7.16, 7.18.

   Requires shared lib: createAssortativitySim, createKnnSim
   ============================================================ */

window.chapters = window.chapters || [];

window.chapters.push({
  id: 'ch07',
  title: 'Degree Correlations',
  slides: [
    // Chapter title slide
    `<section class="chapter-divider" style="text-align:center;">
      <div style="margin-top:20%;">
        <p style="font-family:var(--font-mono); color:var(--accent-edge); font-size:1rem; letter-spacing:0.14em; text-transform:uppercase;">Chapter 07</p>
        <h1 style="font-size:2.8rem; margin-top:0.6em;">Degree Correlations</h1>
        <div style="width:120px; height:1px; background:var(--rule); margin:2rem auto;"></div>
      </div>
    </section>`,

    // 1. Title / the question
    `<section>
      <h2>Degree Correlations</h2>
      <div class="two-col">
        <div>
          <p>So far we asked <em>how many</em> links each node has (\\(p_k\\)). Now we ask a deeper question: <strong>who links to whom?</strong></p>
          <p>Do hubs connect to other hubs, or avoid them? Two networks with the <em>identical</em> degree distribution can look completely different depending on the answer.</p>
        </div>
        <div class="two-col" style="gap:0.5rem;">
          <img src="js/chapters/chapter-07-degree-correlations/images/book/figure-7-1.jpg" alt="Hubs dating hubs" style="width:100%; border-radius:6px; border:1px solid var(--rule);">
          <img src="js/chapters/chapter-07-degree-correlations/images/book/figure-7-2.jpg" alt="Hubs avoiding hubs" style="width:100%; border-radius:6px; border:1px solid var(--rule);">
        </div>
      </div>
      <p class="caption">Images 7.1 &amp; 7.2 &mdash; hubs bonding (left) vs. hubs avoiding each other (right).</p>
    </section>`,

    // 2. Three flavours
    `<section>
      <h2>Three Flavours</h2>
      <div class="two-col">
        <div class="panel">
          <strong style="color:var(--accent-hub)">Assortative</strong>
          <p class="caption">Hubs link to hubs, small nodes to small nodes. Typical of <em>social</em> networks.</p>
        </div>
        <div class="panel">
          <strong style="color:#b7a56a">Neutral</strong>
          <p class="caption">Nodes link regardless of degree. What BA and ER produce.</p>
        </div>
      </div>
      <div class="panel" style="margin-top:0.6rem;">
        <strong style="color:var(--accent-edge)">Disassortative</strong>
        <p class="caption">Hubs link to small nodes, avoiding each other. Typical of <em>biological / technological</em> networks.</p>
      </div>
    </section>`,

    // 3. Assortativity toggle - LIVE centerpiece
    `<section>
      <h2>See the Difference &mdash; same degrees, rewired</h2>
      <p>One scale-free network, rewired three ways while keeping every node's degree fixed. Watch the hubs (amber) pull together or push apart. \\(r\\) is Newman's correlation coefficient.</p>
      <div class="sim-container" id="assort-sim" style="height:340px;"></div>
      <div class="sim-controls">
        <button onclick="window.assortSim.setMode(1)">assortative</button>
        <button onclick="window.assortSim.setMode(0)">neutral</button>
        <button onclick="window.assortSim.setMode(-1)">disassortative</button>
        <span id="assort-label"></span>
      </div>
    </section>`,

    // 4. Measuring: k_nn(k)
    `<section>
      <h2>Measuring: the kₙₙ(k) Function</h2>
      <p>For each node, average the degrees of its neighbors, then average over all nodes of degree \\(k\\):</p>
      <div class="eq-panel">\\[ k_{nn}(k) = \\sum_{k'} k'\\,P(k' \\mid k) \\]</div>
      <p>"If I have \\(k\\) links, how well-connected are my neighbors?" For a <strong>neutral</strong> network this is flat:</p>
      <div class="eq-panel">\\[ k_{nn}(k) = \\frac{\\langle k^2 \\rangle}{\\langle k \\rangle} \\]</div>
      <p class="caption">That this constant exceeds \\(\\langle k\\rangle\\) is the <em>friendship paradox</em> &mdash; your friends have more friends than you do.</p>
    </section>`,

    // 5. k_nn(k) shapes - LIVE
    `<section>
      <h2>The Shape Tells the Type</h2>
      <p>Fit \\(k_{nn}(k) = a\\,k^{\\mu}\\). The sign of the <strong>correlation exponent \\(\\mu\\)</strong> classifies the network:</p>
      <div class="sim-container" id="knn-sim"></div>
      <p class="caption">Rising (\\(\\mu&gt;0\\), assortative), flat (\\(\\mu=0\\), neutral), falling (\\(\\mu&lt;0\\), disassortative). Collaboration: \\(\\mu=0.37\\); metabolic: \\(\\mu=-0.76\\).</p>
    </section>`,

    // 6. k_nn real data (book image)
    `<section>
      <h2>In Real Networks</h2>
      <img src="js/chapters/chapter-07-degree-correlations/images/book/figure-7-6.jpg" alt="Degree correlation function for real networks" style="width:82%; display:block; margin:0 auto 0.5rem; border-radius:6px; border:1px solid var(--rule);">
      <p class="caption">Image 7.6 &mdash; \\(k_{nn}(k)\\) rising for collaboration (assortative), flat for the power grid (neutral), falling for metabolism (disassortative). The horizontal line is the neutral prediction.</p>
    </section>`,

    // 7. Structural cutoff (book image)
    `<section>
      <h2>The Structural-Cutoff Trap</h2>
      <div class="two-col">
        <div>
          <p>In a <em>simple</em> network the neutral pattern wants multiple links between two big hubs:</p>
          <div class="eq-panel">\\[ E_{kk'} = \\frac{k\\,k'}{\\langle k\\rangle N} \\]</div>
          <p>But only one link is allowed. Above the <strong>structural cutoff</strong> \\(k_s \\sim (\\langle k\\rangle N)^{1/2}\\), hubs are <em>forced</em> onto small nodes &mdash; an artificial disassortativity.</p>
        </div>
        <img src="js/chapters/chapter-07-degree-correlations/images/book/figure-7-7.jpg" alt="Structural disassortativity" style="width:100%; border-radius:6px; border:1px solid var(--rule);">
      </div>
      <p class="caption">Thesis caution: always check whether measured disassortativity is <em>structural</em> or genuine.</p>
    </section>`,

    // 8. Tuning correlations (book image)
    `<section>
      <h2>Tuning Correlations</h2>
      <div class="two-col">
        <div>
          <p>The <strong>Xulvi-Brunet &amp; Sokolov algorithm</strong>: pick two links, rewire their four endpoints to connect <em>similar</em> degrees (assortative) or <em>dissimilar</em> degrees (disassortative).</p>
          <p class="caption">Dialing the rewiring probability \\(p\\) moves a network across the full range &mdash; all while keeping \\(p_k\\) fixed. The standard tool for isolating what correlations actually <em>do</em>.</p>
        </div>
        <img src="js/chapters/chapter-07-degree-correlations/images/book/figure-7-13.jpg" alt="Xulvi-Brunet Sokolov algorithm" style="width:100%; border-radius:6px; border:1px solid var(--rule);">
      </div>
    </section>`,

    // 9. Impact: giant component (book image)
    `<section>
      <h2>Why We Care: the Giant Component</h2>
      <div class="two-col">
        <div>
          <p>Correlations shift the \\(\\langle k\\rangle = 1\\) phase transition:</p>
          <ul style="font-size:0.9rem;">
            <li><strong>Assortative</strong> &rarr; giant component forms <em>earlier</em> (hubs seek each other), but is <em>smaller</em> at high \\(\\langle k\\rangle\\).</li>
            <li><strong>Disassortative</strong> &rarr; transition <em>delayed</em>; harder to form a giant component.</li>
          </ul>
        </div>
        <img src="js/chapters/chapter-07-degree-correlations/images/book/figure-7-15.jpg" alt="Correlations and the phase transition" style="width:100%; border-radius:6px; border:1px solid var(--rule);">
      </div>
    </section>`,

    // 10. Impact: downstream (book image)
    `<section>
      <h2>Downstream Consequences</h2>
      <div class="two-col">
        <div>
          <ul style="font-size:0.92rem;">
            <li><strong>Epidemics:</strong> social assortativity gives hubs a tight core that acts as a disease <em>reservoir</em>.</li>
            <li><strong>Robustness:</strong> assortative hubs are redundant (resilient); disassortative hubs each hold many leaves (fragile).</li>
            <li><strong>Distances:</strong> assortative &rarr; shorter \\(\\langle d\\rangle\\) but <em>larger</em> diameter (long chains of \\(k=2\\) nodes).</li>
          </ul>
        </div>
        <img src="js/chapters/chapter-07-degree-correlations/images/book/figure-7-16.jpg" alt="Correlations and path lengths" style="width:100%; border-radius:6px; border:1px solid var(--rule);">
      </div>
    </section>`,

    // 11. Summary
    `<section>
      <h2>Beyond the Degree Distribution</h2>
      <div class="two-col">
        <div>
          <p>Three reasons degree correlations matter:</p>
          <ol style="font-size:0.95rem;">
            <li>They're present in most real networks.</li>
            <li>They change the network's behavior &mdash; phase transition, robustness, spreading, path length.</li>
            <li>They're real structure that \\(p_k\\) alone cannot see.</li>
          </ol>
          <p class="caption">The coefficient \\(r\\) gives a single number, but \\(\\mu\\) is more faithful &mdash; \\(r\\) force-fits a line to a power law and fades for large \\(N\\).</p>
        </div>
        <img src="js/chapters/chapter-07-degree-correlations/images/book/figure-7-18.jpg" alt="Political blogosphere" style="width:100%; border-radius:6px; border:1px solid var(--rule);">
      </div>
      <p class="caption">Image 7.18 &mdash; the US political blogosphere: an extreme assortative network, blogs almost never linking across the divide.</p>
    </section>`
  ],

  afterRender: function () {
    const as = document.getElementById('assort-sim');
    if (as && as.clientWidth > 0 && !as.dataset.inited) { window.assortSim = createAssortativitySim(as, { N: 100, labelEl: document.getElementById('assort-label') }); as.dataset.inited = '1'; }

    const kn = document.getElementById('knn-sim');
    if (kn && kn.clientWidth > 0 && !kn.dataset.inited) { createKnnSim(kn, {}); kn.dataset.inited = '1'; }
  }
});
