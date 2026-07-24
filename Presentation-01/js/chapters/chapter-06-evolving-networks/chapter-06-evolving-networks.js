/* ============================================================
   CHAPTER 06 — Evolving Networks
   -------------------------------------------------------------
   Folder: js/chapters/chapter-06-evolving-networks/
     chapter-06-evolving-networks.js   <- this file
     images/  <- empty; book figures hot-linked

   SIMULATED: fitness growth (latecomer overtakes), fitness degree
     dynamics, Bose-Einstein condensation slider, gamma tuner.
   EMBEDDED: 6.1, 6.4, 6.5, 6.7, 6.10, 6.11, 6.12, 6.14, 6.15.

   Requires shared lib: createFitnessGrowthSim,
     createFitnessDynamicsSim, createCondensationSim, createGammaTuner
   ============================================================ */

window.chapters = window.chapters || [];

window.chapters.push({
  id: 'ch06',
  title: 'Evolving Networks',
  slides: [
    // Chapter title slide
    `<section class="chapter-divider" style="text-align:center;">
      <div style="margin-top:20%;">
        <p style="font-family:var(--font-mono); color:var(--accent-edge); font-size:1rem; letter-spacing:0.14em; text-transform:uppercase;">Chapter 06</p>
        <h1 style="font-size:2.8rem; margin-top:0.6em;">Evolving Networks</h1>
        <div style="width:120px; height:1px; background:var(--rule); margin:2rem auto;"></div>
      </div>
    </section>`,

    // 1. Title / the problem
    `<section>
      <h2>Evolving Networks</h2>
      <div class="two-col">
        <div>
          <p>The BA model is minimal &mdash; and has three limits: it predicts only \\(\\gamma = 3\\), only a <em>pure</em> power law, and it says the oldest node is always the biggest.</p>
          <p>But Google and Facebook arrived <em>late</em> and became the biggest hubs. Something beyond age lets a node win: <strong>fitness</strong>.</p>
        </div>
        <img src="js/chapters/chapter-06-evolving-networks/images/book/figure-6-1.jpg" alt="Garment district" style="width:100%; border-radius:6px; border:1px solid var(--rule);">
      </div>
      <p class="caption">Image 6.1 &mdash; a competitive marketplace: some players thrive regardless of when they entered.</p>
    </section>`,

    // 2. The fitness model
    `<section>
      <h2>The Bianconi&ndash;Barabási Model</h2>
      <p>Give each node an intrinsic <strong>fitness</strong> \\(\\eta\\) (its ability to attract links). Attachment now depends on <em>degree &times; fitness</em>:</p>
      <div class="eq-panel">\\[ \\Pi_i = \\frac{\\eta_i k_i}{\\sum_j \\eta_j k_j} \\]</div>
      <p>Between two equal-degree nodes, the fitter one wins the link. So a young, low-degree, high-fitness node can climb fast and overtake older nodes.</p>
      <p class="caption">Fitness is fixed at birth, drawn from a distribution \\(\\rho(\\eta)\\).</p>
    </section>`,

    // 3. Fitness growth - LIVE centerpiece
    `<section>
      <h2>Fit-Gets-Rich &mdash; watch a latecomer win</h2>
      <p>Node colour = fitness (bright = high), size = degree. Add nodes and watch: a late arrival with high fitness can still become the biggest hub (outlined), something impossible in pure BA.</p>
      <div class="sim-container" id="fit-grow-sim" style="height:360px;"></div>
      <div class="sim-controls">
        <button onclick="window.fitGrowSim.addNode()">+ add node</button>
        <button onclick="for(let i=0;i&lt;20;i++) window.fitGrowSim.addNode()">+ add 20</button>
        <button onclick="window.fitGrowSim.reset()">reset</button>
      </div>
    </section>`,

    // 4. Fitness dynamics
    `<section>
      <h2>Each Node, Its Own Growth Rate</h2>
      <p>Now the dynamical exponent depends on fitness &mdash; fitter nodes grow on steeper curves:</p>
      <div class="eq-panel">\\[ k(t, t_i, \\eta_i) = m\\left(\\frac{t}{t_i}\\right)^{\\beta(\\eta_i)}, \\qquad \\beta(\\eta) = \\frac{\\eta}{C} \\]</div>
      <div class="sim-container" id="fit-dyn-sim" style="height:240px;"></div>
      <p class="caption">The late, high-fitness node (amber) starts lower but its steeper slope lets it cross over the early, low-fitness node.</p>
    </section>`,

    // 5. Degree distribution
    `<section>
      <h2>Fitness Shifts γ</h2>
      <p>The degree distribution becomes a weighted sum of power laws, one per fitness:</p>
      <div class="eq-panel">\\[ p_k \\approx C \\int d\\eta\\,\\rho(\\eta)\\,\\frac{1}{\\eta}\\left(\\frac{m}{k}\\right)^{\\frac{C}{\\eta}+1} \\]</div>
      <p>For <strong>uniform</strong> fitness, \\(C^* = 1.255\\) and:</p>
      <div class="eq-panel">\\[ p_k \\sim \\frac{k^{-(1+C^*)}}{\\ln k} \\quad\\Rightarrow\\quad \\gamma = 2.255 \\]</div>
      <p class="caption">So fitness alone moves \\(\\gamma\\) away from 3 &mdash; one clean answer to "why isn't real \\(\\gamma\\) always 3?"</p>
    </section>`,

    // 6. Measuring fitness (book images)
    `<section>
      <h2>Fitness Is Measurable</h2>
      <div class="two-col">
        <div>
          <img src="js/chapters/chapter-06-evolving-networks/images/book/figure-6-4.jpg" alt="WWW fitness distribution" style="width:100%; border-radius:6px; border:1px solid var(--rule);">
          <p class="caption">WWW &mdash; exponential fitness.</p>
        </div>
        <div>
          <img src="js/chapters/chapter-06-evolving-networks/images/book/figure-6-5.jpg" alt="Paper fitness distribution" style="width:100%; border-radius:6px; border:1px solid var(--rule);">
          <p class="caption">Papers &mdash; peaked fitness.</p>
        </div>
      </div>
      <p class="caption">Different systems have different \\(\\rho(\\eta)\\) &mdash; and its shape can qualitatively change the whole network.</p>
    </section>`,

    // 7. Bose gas mapping (book image)
    `<section>
      <h2>An Exact Map to a Quantum Gas</h2>
      <div class="two-col">
        <div>
          <p>The fitness model maps <em>exactly</em> onto a Bose gas:</p>
          <div class="eq-panel">\\[ \\varepsilon_i = \\frac{1}{\\beta_T}\\ln\\eta_i \\]</div>
          <ul style="font-size:0.9rem;">
            <li>fitness &rarr; energy (high fitness = low energy)</li>
            <li>links &rarr; particles</li>
            <li>nodes &rarr; energy levels</li>
          </ul>
          <p class="caption">The links obey Bose statistics &mdash; and the mapping predicts two phases.</p>
        </div>
        <img src="js/chapters/chapter-06-evolving-networks/images/book/figure-6-7.jpg" alt="Mapping networks to a Bose gas" style="width:100%; border-radius:6px; border:1px solid var(--rule);">
      </div>
    </section>`,

    // 8. Condensation - LIVE slider
    `<section>
      <h2>Bose&ndash;Einstein Condensation</h2>
      <p>Raise the fittest node's advantage. Below threshold, links spread across a hierarchy of hubs (scale-free). Above it, a single super-hub grabs a finite fraction of <em>all</em> links &mdash; winner-takes-all, and the network is no longer scale-free.</p>
      <div class="sim-container" id="cond-sim" style="height:320px;"></div>
      <div class="sim-controls">
        <label>top fitness <input type="range" id="cond-fit" min="0.5" max="8" value="0.5" step="0.5" oninput="window.condSim.setFitness(+this.value)"></label>
        <span id="cond-label"></span>
      </div>
    </section>`,

    // 9. Initial attractiveness
    `<section>
      <h2>Initial Attractiveness</h2>
      <div class="two-col">
        <div>
          <p>In BA a \\(k=0\\) node can never gain a link. Real isolated nodes do (every paper gets a first citation). Add a constant \\(A\\):</p>
          <div class="eq-panel">\\[ \\Pi_k \\sim A + k \\]</div>
          <p>Two effects: raises the exponent \\(\\gamma = 3 + A/m\\), and creates a low-degree saturation \\(p_k = C(k+A)^{-\\gamma}\\).</p>
          <p class="caption">Measured in citations: \\(A \\approx 7\\). This is the mechanistic origin of the \\(k_{sat}\\) you fit empirically.</p>
        </div>
        <img src="js/chapters/chapter-06-evolving-networks/images/book/figure-6-10.jpg" alt="Initial attractiveness" style="width:100%; border-radius:6px; border:1px solid var(--rule);">
      </div>
    </section>`,

    // 10. Gamma tuner - LIVE
    `<section>
      <h2>Every Process Tunes γ</h2>
      <p>Each real-world process shifts the exponent by a known formula. Drag the controls and watch \\(\\gamma\\) move &mdash; this is how the full \\(2 \\le \\gamma \\le 5\\) range arises.</p>
      <div class="sim-container" id="gamma-tuner" style="height:300px; overflow:auto;"></div>
    </section>`,

    // 11. Node deletion & phase transitions (book image)
    `<section>
      <h2>Node Deletion &amp; Phase Transitions</h2>
      <div class="two-col">
        <div>
          <p>Delete nodes at rate \\(r\\). While the network still grows (\\(r&lt;1\\)):</p>
          <div class="eq-panel">\\[ \\gamma = 3 + \\frac{2}{1-r} \\]</div>
          <p>Combined with initial attractiveness, a rising removal rate drives an actual <strong>topological phase transition</strong>: scale-free &rarr; stretched exponential &rarr; exponential.</p>
        </div>
        <img src="js/chapters/chapter-06-evolving-networks/images/book/figure-6-12.jpg" alt="Phase transitions from node removal" style="width:100%; border-radius:6px; border:1px solid var(--rule);">
      </div>
    </section>`,

    // 12. Aging (book image)
    `<section>
      <h2>Aging</h2>
      <div class="two-col">
        <div>
          <p>Nodes fade with age (actors stop acting, scientists stop publishing):</p>
          <div class="eq-panel">\\[ \\Pi(k_i, t-t_i) \\sim k_i\\,(t-t_i)^{-\\nu} \\]</div>
          <ul style="font-size:0.9rem;">
            <li>\\(\\nu &lt; 0\\): prefer old nodes &rarr; \\(\\gamma\\) drops below 3, hub-and-spoke</li>
            <li>\\(0 &lt; \\nu &lt; 1\\): prefer young nodes &rarr; \\(\\gamma\\) rises</li>
            <li>\\(\\nu &gt; 1\\): scale-free property lost &rarr; chain</li>
          </ul>
        </div>
        <img src="js/chapters/chapter-06-evolving-networks/images/book/figure-6-14.jpg" alt="The impact of aging" style="width:100%; border-radius:6px; border:1px solid var(--rule);">
      </div>
    </section>`,

    // 13. Summary
    `<section>
      <h2>The Evolving-Network Paradigm</h2>
      <p>The observed \\(2 \\le \\gamma \\le 5\\) range and the deviations from pure power laws aren't mysteries &mdash; each is the fingerprint of a specific process:</p>
      <div class="two-col">
        <ul style="font-size:0.9rem;">
          <li>Initial attractiveness \\(\\to 3 + A/m\\) (↑)</li>
          <li>Preferential internal links \\(\\to\\) 2&ndash;3 (↓)</li>
          <li>Node deletion \\(\\to 3 + \\tfrac{2}{1-r}\\) (↑)</li>
        </ul>
        <ul style="font-size:0.9rem;">
          <li>Accelerated growth \\(\\to 3 + \\tfrac{2\\theta}{1-\\theta}\\) (↑)</li>
          <li>Aging \\(\\nu&lt;0 \\to\\) below 3 (↓)</li>
          <li>Fitness \\(\\to\\) fit-gets-rich or condensation</li>
        </ul>
      </div>
      <p class="caption">Unlike the configuration model, these are <em>mechanistic</em> &mdash; they explain <em>why</em> a network has the \\(p_k\\) it does.</p>
    </section>`
  ],

  afterRender: function () {
    const fg = document.getElementById('fit-grow-sim');
    if (fg && fg.clientWidth > 0 && !fg.dataset.inited) { window.fitGrowSim = createFitnessGrowthSim(fg, { m: 1 }); fg.dataset.inited = '1'; }

    const fd = document.getElementById('fit-dyn-sim');
    if (fd && fd.clientWidth > 0 && !fd.dataset.inited) { createFitnessDynamicsSim(fd, {}); fd.dataset.inited = '1'; }

    const cd = document.getElementById('cond-sim');
    if (cd && cd.clientWidth > 0 && !cd.dataset.inited) { window.condSim = createCondensationSim(cd, { N: 140, initialFitness: 0.5, labelEl: document.getElementById('cond-label') }); cd.dataset.inited = '1'; }

    const gt = document.getElementById('gamma-tuner');
    if (gt && gt.clientWidth > 0 && !gt.dataset.inited) { createGammaTuner(gt, {}); gt.dataset.inited = '1'; }
  }
});
