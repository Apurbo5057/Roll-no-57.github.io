/* ============================================================
   CHAPTER 08 — Robustness
   -------------------------------------------------------------
   Folder: js/chapters/chapter-08-robustness/
     chapter-08-robustness.js  <- this file
     images/  <- empty; book figures hot-linked

   SIMULATED: attack-vs-failure (REUSES createRobustnessSim from
     Ch.0), f_c vs gamma, cascading-failure branching demo.
   EMBEDDED: 8.1, 8.4, 8.5, 8.7, 8.9, 8.11, 8.12, 8.13, 8.16,
     8.17, 8.21, 8.22, 8.24.

   Requires shared lib: createRobustnessSim, createFcGammaSim,
     createCascadeSim
   ============================================================ */

window.chapters = window.chapters || [];

window.chapters.push({
  id: 'ch08',
  title: 'Robustness',
  slides: [
    // Chapter title slide
    `<section class="chapter-divider" style="text-align:center;">
      <div style="margin-top:20%;">
        <p style="font-family:var(--font-mono); color:var(--accent-edge); font-size:1rem; letter-spacing:0.14em; text-transform:uppercase;">Chapter 08</p>
        <h1 style="font-size:2.8rem; margin-top:0.6em;">Robustness</h1>
        <div style="width:120px; height:1px; background:var(--rule); margin:2rem auto;"></div>
      </div>
    </section>`,

    // 1. Title
    `<section>
      <h2>Robustness</h2>
      <div class="two-col">
        <div>
          <p>The payoff of the scale-free story. The hubs we spent four chapters explaining have one dominant consequence:</p>
          <p><strong>Scale-free networks shrug off random failure &mdash; but shatter under targeted attack.</strong></p>
          <p class="caption">Same hubs, opposite outcomes. This is the "Achilles' heel" of complex networks.</p>
        </div>
        <img src="js/chapters/chapter-08-robustness/images/book/figure-8-1.jpg" alt="Achilles heel of complex networks" style="width:100%; border-radius:6px; border:1px solid var(--rule);">
      </div>
      <p class="caption">Image 8.1 &mdash; robust and fragile at once.</p>
    </section>`,

    // 2. Robustness = inverse percolation
    `<section>
      <h2>Robustness Is Inverse Percolation</h2>
      <div class="two-col">
        <div>
          <p>Removing a fraction \\(f\\) of nodes is percolation run backwards. Past a critical \\(f_c\\) the giant component vanishes &mdash; the network fragments.</p>
          <p class="caption">For random networks the critical exponents match \\(d&gt;6\\) percolation: \\(\\gamma_p = 1\\), \\(\\beta_p = 1\\), \\(\\nu = 1/2\\).</p>
        </div>
        <img src="js/chapters/chapter-08-robustness/images/book/figure-8-5.jpg" alt="Network breakdown as inverse percolation" style="width:100%; border-radius:6px; border:1px solid var(--rule);">
      </div>
    </section>`,

    // 3. Attack vs failure - LIVE centerpiece (reuses Ch0 sim)
    `<section>
      <h2>Random Failure vs. Attack &mdash; try it</h2>
      <p>The same demo from the opening chapter &mdash; now we can explain it. Random failure barely dents the network; targeting hubs shatters it fast. Watch the number of disconnected islands.</p>
      <div class="sim-container" id="robust8-sim" style="height:340px;"></div>
      <div class="sim-controls">
        <button onclick="window.robust8Sim.randomFailure()">random failure</button>
        <button onclick="window.robust8Sim.targetedAttack()">targeted attack</button>
        <button onclick="window.robust8Sim.reset()">reset</button>
        <span id="robust8-stats"></span>
      </div>
    </section>`,

    // 4. Molloy-Reed
    `<section>
      <h2>The Molloy&ndash;Reed Criterion</h2>
      <p>A network has a giant component as long as the average node in it connects to at least two others:</p>
      <div class="eq-panel">\\[ \\kappa = \\frac{\\langle k^2 \\rangle}{\\langle k \\rangle} > 2 \\]</div>
      <p>Valid for <em>any</em> degree distribution &mdash; it ties integrity to the first two moments of \\(p_k\\). Check on a random network:</p>
      <div class="eq-panel">\\[ \\kappa = 1 + \\langle k\\rangle > 2 \\;\\Rightarrow\\; \\langle k\\rangle > 1 \\]</div>
      <p class="caption">...which recovers the Erdős&ndash;Rényi giant-component condition from Chapter 3.</p>
    </section>`,

    // 5. Critical threshold
    `<section>
      <h2>The Critical Threshold</h2>
      <p>Applying Molloy&ndash;Reed to random node removal gives the fraction that fragments the network:</p>
      <div class="eq-panel">\\[ f_c = 1 - \\frac{1}{\\dfrac{\\langle k^2 \\rangle}{\\langle k \\rangle} - 1} \\]</div>
      <p>It depends <em>only</em> on \\(\\langle k\\rangle\\) and \\(\\langle k^2\\rangle\\). For a random network:</p>
      <div class="eq-panel">\\[ f_c^{ER} = 1 - \\frac{1}{\\langle k\\rangle} \\]</div>
      <p class="caption">Always finite &mdash; a random network always breaks after removing a finite fraction.</p>
    </section>`,

    // 6. The punchline: fc -> 1
    `<section>
      <h2>Why Scale-Free Networks Don't Break</h2>
      <div class="two-col">
        <div>
          <p>For \\(\\gamma &lt; 3\\), the second moment diverges: \\(\\langle k^2\\rangle \\to \\infty\\). Insert that into \\(f_c\\):</p>
          <div class="eq-panel">\\[ \\langle k^2\\rangle \\to \\infty \\;\\Rightarrow\\; f_c \\to 1 \\]</div>
          <p><strong>To fragment a large scale-free network by random failure, you must remove <em>all</em> its nodes.</strong></p>
          <p class="caption">Random failure is blind to degree, and there are vastly more small nodes than hubs &mdash; so it almost always removes something unimportant.</p>
        </div>
        <img src="js/chapters/chapter-08-robustness/images/book/figure-8-9.jpg" alt="Robustness and degree exponent" style="width:100%; border-radius:6px; border:1px solid var(--rule);">
      </div>
    </section>`,

    // 7. fc vs gamma - LIVE
    `<section>
      <h2>Failure vs. Attack Thresholds</h2>
      <p>Plotting both thresholds against \\(\\gamma\\): the failure threshold (teal) climbs toward 1 as \\(\\gamma \\to 2\\), while the attack threshold (red) stays low throughout.</p>
      <div class="sim-container" id="fcgamma-sim"></div>
      <p class="caption">The attack threshold is always below the failure threshold. The gap between them <em>is</em> the scale-free signature.</p>
    </section>`,

    // 8. Attack tolerance (book image)
    `<section>
      <h2>Attack Tolerance</h2>
      <div class="two-col">
        <div>
          <p>Remove hubs first (biggest degree down). The critical point &mdash; absent under random failure &mdash; <em>reappears</em>, at a remarkably low \\(f_c\\):</p>
          <div class="eq-panel" style="font-size:0.85rem;">\\[ f_c^{\\frac{2-\\gamma}{1-\\gamma}} = 2 + \\frac{2-\\gamma}{3-\\gamma}k_{min}\\left(f_c^{\\frac{3-\\gamma}{1-\\gamma}} - 1\\right) \\]</div>
          <p class="caption">Removing just a few percent of the hubs breaks the network into tiny clusters.</p>
        </div>
        <img src="js/chapters/chapter-08-robustness/images/book/figure-8-11.jpg" alt="Scale-free network under attack" style="width:100%; border-radius:6px; border:1px solid var(--rule);">
      </div>
    </section>`,

    // 9. Cascading failures (book image)
    `<section>
      <h2>Cascading Failures</h2>
      <div class="two-col">
        <div>
          <p>Real failures <em>propagate</em>: one node fails, redistributes load, overloads neighbors, which fail in turn. A tiny trigger can collapse the system.</p>
          <p>Cascade sizes follow a <strong>power law</strong> \\(p(s) \\sim s^{-\\alpha}\\) &mdash; most are tiny, rare ones are catastrophic (the 2003 blackout: a few lines &rarr; 50 million dark).</p>
        </div>
        <img src="js/chapters/chapter-08-robustness/images/book/figure-8-16.jpg" alt="Northeast blackout 2003" style="width:100%; border-radius:6px; border:1px solid var(--rule);">
      </div>
    </section>`,

    // 10. Cascade demo - LIVE
    `<section>
      <h2>The Branching Model</h2>
      <p>Model a cascade as a branching tree: each failure spawns \\(\\langle k\\rangle\\) offspring on average. Drag \\(\\langle k\\rangle\\) across the critical point and re-trigger.</p>
      <div class="sim-container" id="cascade-sim" style="height:300px;"></div>
      <div class="sim-controls">
        <label>⟨k⟩ <input type="range" id="cascade-k" min="0.6" max="1.4" value="1" step="0.05" oninput="window.cascadeSim.setK(+this.value)"></label>
        <button onclick="window.cascadeSim.retrigger()">re-trigger</button>
        <span id="cascade-label"></span>
      </div>
    </section>`,

    // 11. Avalanche exponent (book image)
    `<section>
      <h2>The Avalanche Exponent</h2>
      <div class="two-col">
        <div>
          <p>Mapping the branching process to a random walk gives the avalanche exponent:</p>
          <div class="eq-panel">\\[ \\alpha = \\begin{cases} 3/2 & \\gamma \\ge 3 \\\\ \\dfrac{\\gamma}{\\gamma-1} & 2&lt;\\gamma&lt;3 \\end{cases} \\]</div>
          <p class="caption">For \\(\\gamma \\ge 3\\), the universal random-walk value 3/2; for \\(2&lt;\\gamma&lt;3\\) the hubs make it \\(\\gamma\\)-dependent. Measured real cascades all fall between 1.5 and 2.</p>
        </div>
        <img src="js/chapters/chapter-08-robustness/images/book/figure-8-22.jpg" alt="The avalanche exponent" style="width:100%; border-radius:6px; border:1px solid var(--rule);">
      </div>
    </section>`,

    // 12. Building robustness (book image)
    `<section>
      <h2>Designing Robust Networks</h2>
      <div class="two-col">
        <div>
          <p>Robust to <em>both</em> failure and attack at fixed cost? Maximize \\(\\langle k^2\\rangle\\) at fixed \\(\\langle k\\rangle\\) &mdash; a <strong>bimodal</strong> distribution:</p>
          <div class="eq-panel" style="font-size:0.9rem;">\\[ p_k = (1-r)\\delta(k - k_{min}) + r\\,\\delta(k - k_{max}) \\]</div>
          <p>Optimum at \\(r = 1/N\\): a single hub with \\(k_{max} = A N^{2/3}\\) plus a mesh of equal-degree nodes that survive the hub's loss.</p>
        </div>
        <img src="js/chapters/chapter-08-robustness/images/book/figure-8-24.jpg" alt="Optimizing attack and failure tolerance" style="width:100%; border-radius:6px; border:1px solid var(--rule);">
      </div>
    </section>`,

    // 13. Summary
    `<section>
      <h2>The Achilles' Heel</h2>
      <div class="two-col">
        <div class="panel">
          <strong style="color:var(--accent-edge)">Robust to failure</strong>
          <p class="caption">\\(f_c \\to 1\\) for \\(\\gamma&lt;3\\). Random damage almost never hits a hub. Cells, the Internet, ecosystems all rely on this.</p>
        </div>
        <div class="panel">
          <strong style="color:var(--accent-danger)">Fragile to attack</strong>
          <p class="caption">A low \\(f_c\\). Remove a few hubs and the network shatters. The same hubs that grant robustness are the liability.</p>
        </div>
      </div>
      <p>One structural feature &mdash; the hubs &mdash; produces both. That duality is the defining practical consequence of the scale-free property.</p>
    </section>`
  ],

  afterRender: function () {
    const rb = document.getElementById('robust8-sim');
    if (rb && rb.clientWidth > 0 && !rb.dataset.inited) { window.robust8Sim = createRobustnessSim(rb, { initialNodes: 40, m: 2, statsEl: document.getElementById('robust8-stats') }); rb.dataset.inited = '1'; }

    const fg = document.getElementById('fcgamma-sim');
    if (fg && fg.clientWidth > 0 && !fg.dataset.inited) { createFcGammaSim(fg, {}); fg.dataset.inited = '1'; }

    const cs = document.getElementById('cascade-sim');
    if (cs && cs.clientWidth > 0 && !cs.dataset.inited) { window.cascadeSim = createCascadeSim(cs, { initialK: 1, labelEl: document.getElementById('cascade-label') }); cs.dataset.inited = '1'; }
  }
});
