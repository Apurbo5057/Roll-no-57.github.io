/* ============================================================
   CHAPTER 04 — The Scale-Free Property  (THESIS CHAPTER)
   -------------------------------------------------------------
   Folder layout:
     js/chapters/chapter-04-scale-free-networks/
       chapter-04-scale-free-networks.js   <- this file
       images/                             <- empty; book figures are
                                              hot-linked from networksciencebook.com

   Image policy applied here:
     - EMBEDDED (non-reproducible: real photos, real data renders,
       algorithm schematics): 4.1, 4.9, 4.10, 4.12, 4.15, 4.17, 4.18,
       4.20, 4.21, 4.22(as backup), 4.24, 4.25
     - SIMULATED (meaningful, reproducible): Poisson-vs-power-law
       overlay, scale-free network with hubs, k_max vs N, the 4-way
       binning comparison.

   Requires shared lib (appended to js/lib/network-sim.js):
     createPoissonPowerlawSim, createScaleFreeDisplay, createKmaxSim,
     createBinningSim
   ============================================================ */

window.chapters = window.chapters || [];

window.chapters.push({
  id: 'ch04',
  title: 'The Scale-Free Property',
  slides: [
    // Chapter title slide
    `<section class="chapter-divider" style="text-align:center;">
      <div style="margin-top:20%;">
        <p style="font-family:var(--font-mono); color:var(--accent-edge); font-size:1rem; letter-spacing:0.14em; text-transform:uppercase;">Chapter 04</p>
        <h1 style="font-size:2.8rem; margin-top:0.6em;">The Scale-Free Property</h1>
        <div style="width:120px; height:1px; background:var(--rule); margin:2rem auto;"></div>
      </div>
    </section>`,

    // 1. Title
    `<section>
      <h2>The Scale-Free Property</h2>
      <div class="two-col">
        <div>
          <p>The 1999 discovery that launched network science. The World Wide Web &mdash; \\(N \\approx 10^{12}\\) documents, the largest network ever built &mdash; turned out <em>not</em> to be random.</p>
          <p>Its degree distribution is a <strong>power law</strong>: most nodes have a few links, a few "hubs" have millions. That single fact reshapes everything that follows.</p>
        </div>
        <img src="js/chapters/chapter-04-scale-free-networks/images/book/figure-4-1.jpg" alt="WWW topology" style="width:100%; border-radius:6px; border:1px solid var(--rule);">
      </div>
      <p class="caption">Image 4.1 &mdash; the 1998 WWW map (nodes &gt;50 links red, &gt;500 purple). Hubs everywhere.</p>
    </section>`,

    // 2. The power law definition
    `<section>
      <h2>Power Law = Straight Line on Log-Log</h2>
      <p>If the WWW were random, degrees would be Poisson. Instead, on log-log axes the data is a straight line &mdash; the signature of a power law:</p>
      <div class="eq-panel">\\[ p_k \\sim k^{-\\gamma} \\qquad\\Longrightarrow\\qquad \\log p_k \\sim -\\gamma \\log k \\]</div>
      <p>\\(\\gamma\\) is the <strong>degree exponent</strong>, and it's exactly the slope of that line. The scaling held over ~4 orders of magnitude.</p>
      <p class="caption"><strong>Definition:</strong> a scale-free network is a network whose degree distribution follows a power law.</p>
    </section>`,

    // 3. WWW degree distribution (book image - real data)
    `<section>
      <h2>The Evidence: WWW Degree Distribution</h2>
      <div class="two-col">
        <div>
          <p>The WWW is <em>directed</em>, so it has two power laws &mdash; in-degree and out-degree:</p>
          <div class="eq-panel">\\[ p_{k_{in}} \\sim k^{-\\gamma_{in}}, \\quad p_{k_{out}} \\sim k^{-\\gamma_{out}} \\]</div>
          <p>with \\(\\gamma_{in} \\approx 2.1\\), \\(\\gamma_{out} \\approx 2.45\\). The green Poisson fit misses completely.</p>
        </div>
        <img src="js/chapters/chapter-04-scale-free-networks/images/book/figure-4-2.jpg" alt="WWW degree distribution" style="width:100%; border-radius:6px; border:1px solid var(--rule);">
      </div>
    </section>`,

    // 4. Two formalisms
    `<section>
      <h2>Two Formalisms</h2>
      <div class="two-col">
        <div class="panel">
          <strong>Discrete</strong> (integer degrees)
          <div class="eq-panel">\\[ p_k = \\frac{k^{-\\gamma}}{\\zeta(\\gamma)} \\]</div>
          <p class="caption">\\(\\zeta(\\gamma)\\) is the Riemann zeta function. \\(p_k\\) <em>is</em> the probability of exactly degree \\(k\\).</p>
        </div>
        <div class="panel">
          <strong>Continuum</strong> (real degrees)
          <div class="eq-panel">\\[ p(k) = (\\gamma-1)\\,k_{min}^{\\gamma-1}\\,k^{-\\gamma} \\]</div>
          <p class="caption">A density &mdash; only \\(\\int_{k_1}^{k_2} p(k)\\,dk\\) is a probability.</p>
        </div>
      </div>
      <p class="caption">Both describe the same scale-free property; pick whichever makes the calculation easier.</p>
    </section>`,

    // 5. Poisson vs power law - LIVE
    `<section>
      <h2>Poisson vs. Power Law &mdash; the tail</h2>
      <p>Same average degree, wildly different tails. Toggle to log-log to see the gap: high-degree hubs are <em>orders of magnitude</em> more likely under a power law.</p>
      <div class="sim-container" id="ppl-sim"></div>
      <div class="sim-controls">
        <button onclick="window.pplSim.toggleScale()">toggle linear / log-log</button>
        <span class="caption">\\(p_{100}\\): Poisson \\(\\approx 10^{-94}\\) vs power law \\(\\approx 4\\times10^{-4}\\).</span>
      </div>
    </section>`,

    // 6. What hubs look like - LIVE scale-free network
    `<section>
      <h2>What Hubs Look Like</h2>
      <p>A scale-free network: node size and colour scale with degree. A few amber hubs hold together a crowd of small teal nodes &mdash; the structure a random network forbids.</p>
      <div class="sim-container" id="sf-display" style="height:380px;"></div>
      <p class="caption">For the WWW, a random model predicts ~0 nodes with \\(k \\ge 100\\); the power law predicts ~4 billion.</p>
    </section>`,

    // 7. The largest hub
    `<section>
      <h2>The Largest Hub</h2>
      <p>Require at most one node above \\(k_{max}\\) (probability \\(1/N\\) of exceeding it). The result differs radically by distribution:</p>
      <div class="two-col">
        <div class="eq-panel">
          <p style="margin:0 0 0.4rem;">Random (exponential):</p>
          \\[ k_{max} = k_{min} + \\frac{\\ln N}{\\lambda} \\]
        </div>
        <div class="eq-panel">
          <p style="margin:0 0 0.4rem;">Scale-free:</p>
          \\[ k_{max} = k_{min}\\,N^{\\frac{1}{\\gamma-1}} \\]
        </div>
      </div>
      <p>Logarithmic vs. polynomial. WWW sample: exponential predicts \\(k_{max}\\approx14\\); scale-free predicts \\(\\approx95{,}000\\). The real value was 10,721.</p>
    </section>`,

    // 8. k_max vs N - LIVE
    `<section>
      <h2>Bigger Network, Bigger Hubs</h2>
      <p>The polynomial growth of \\(k_{max}\\) in a scale-free network towers over the logarithmic growth in a random one &mdash; and the gap widens without limit as \\(N\\) grows.</p>
      <div class="sim-container" id="kmax-sim"></div>
      <p class="caption">This is why hubs are tiny even in a huge random network, but enormous in a scale-free one.</p>
    </section>`,

    // 9. Highway vs airport analogy (book image)
    `<section>
      <h2>Highways vs. Airports</h2>
      <div class="two-col">
        <div>
          <p><strong>Random ≈ highway system:</strong> cities have comparable numbers of highways. None has hundreds; none has zero.</p>
          <p><strong>Scale-free ≈ air traffic:</strong> most airports are tiny, but a few (Chicago, LA) are giant hubs. You route <em>through</em> a hub &mdash; which is why hubs reshape how we navigate.</p>
        </div>
        <img src="js/chapters/chapter-04-scale-free-networks/images/book/figure-4-6.jpg" alt="Random vs scale-free analogy" style="width:100%; border-radius:6px; border:1px solid var(--rule);">
      </div>
      <p class="caption">Image 4.6 &mdash; the highway (Poisson) vs airport (power-law) analogy.</p>
    </section>`,

    // 10. Meaning of scale-free: moments
    `<section>
      <h2>Why "Scale-Free"? The Moments</h2>
      <p>The \\(n\\)-th moment integrated from \\(k_{min}\\) to \\(k_{max}\\):</p>
      <div class="eq-panel">\\[ \\langle k^n \\rangle = C\\,\\frac{k_{max}^{\\,n-\\gamma+1} - k_{min}^{\\,n-\\gamma+1}}{n-\\gamma+1} \\]</div>
      <p>As \\(N \\to \\infty\\), \\(k_{max}\\to\\infty\\). A moment stays <strong>finite</strong> if \\(n \\le \\gamma-1\\), and <strong>diverges</strong> if \\(n &gt; \\gamma-1\\).</p>
      <p class="caption">For the common \\(2 &lt; \\gamma &lt; 3\\): \\(\\langle k \\rangle\\) is finite, but \\(\\langle k^2 \\rangle\\) diverges. That divergence is the whole reason for the name.</p>
    </section>`,

    // 11. Lack of a scale
    `<section>
      <h2>No Internal Scale</h2>
      <div class="two-col">
        <div>
          <p><strong>Random networks have a scale.</strong> \\(\\sigma_k = \\langle k\\rangle^{1/2} &lt; \\langle k\\rangle\\), so degrees sit in a tight band. The average <em>is</em> a typical size.</p>
          <p><strong>Scale-free networks don't.</strong> With \\(\\gamma &lt; 3\\), \\(\\sigma_k\\) diverges. Pick a random node and its degree could be 1 or a million &mdash; there's no "typical" degree.</p>
          <p class="caption">WWW: expected in-degree is "\\(4.6 \\pm 1546\\)". The average is nearly meaningless.</p>
        </div>
        <img src="js/chapters/chapter-04-scale-free-networks/images/book/figure-4-7.jpg" alt="Lack of an internal scale" style="width:100%; border-radius:6px; border:1px solid var(--rule);">
      </div>
    </section>`,

    // 12. Universality (book image - real distributions)
    `<section>
      <h2>Universality</h2>
      <p>The scale-free property appears across utterly unrelated domains &mdash; a man-made information web, a 4-billion-year-old protein network, email, citations. All deviate from Poisson (green), all fit a power law.</p>
      <img src="js/chapters/chapter-04-scale-free-networks/images/book/figure-4-10.jpg" alt="Many real networks are scale-free" style="width:78%; display:block; margin:0.5rem auto; border-radius:6px; border:1px solid var(--rule);">
      <p class="caption">Image 4.10 &mdash; Internet, protein interactions, email, citations. But not <em>everything</em> is scale-free: the power grid and materials (capped degree) are not.</p>
    </section>`,

    // 13. Ultra-small world
    `<section>
      <h2>The Ultra-Small World</h2>
      <p>Hubs shrink distances <em>below</em> the random small-world result. The scaling depends on \\(\\gamma\\):</p>
      <div class="eq-panel">
        \\[ \\langle d \\rangle \\sim \\begin{cases} \\text{const.} & \\gamma = 2 \\\\ \\ln\\ln N & 2 &lt; \\gamma &lt; 3 \\\\ \\ln N / \\ln\\ln N & \\gamma = 3 \\\\ \\ln N & \\gamma &gt; 3 \\end{cases} \\]
      </div>
      <p>For society (\\(N\\approx7\\times10^9\\)): random gives \\(\\ln N \\approx 22.7\\), but ultra-small gives \\(\\ln\\ln N \\approx 3.1\\). The hubs radically compress the network.</p>
    </section>`,

    // 14. Distances figure (book image)
    `<section>
      <h2>Distances Across the Four Regimes</h2>
      <img src="js/chapters/chapter-04-scale-free-networks/images/book/figure-4-12.jpg" alt="Distances in scale-free networks" style="width:82%; display:block; margin:0 auto 0.5rem; border-radius:6px; border:1px solid var(--rule);">
      <p class="caption">Image 4.12 &mdash; at small \\(N\\) the four \\(\\gamma\\)-regimes are indistinguishable; at large \\(N\\) they separate dramatically. The smaller the \\(\\gamma\\), the shorter the distances.</p>
    </section>`,

    // 15. Generating networks (book images - algorithm schematics)
    `<section>
      <h2>Generating Scale-Free Networks</h2>
      <p>To study scale-free networks we must build them with a prescribed \\(p_k\\). Three standard algorithms:</p>
      <div class="two-col">
        <div class="panel">
          <strong>Configuration model</strong>
          <p class="caption">Give each node stubs, randomly pair them. Link probability \\(p_{ij} = k_i k_j / (2L-1)\\). Allows self-loops / multi-links.</p>
        </div>
        <div class="panel">
          <strong>Degree-preserving randomization</strong>
          <p class="caption">Swap link pairs, keeping every degree fixed. Tests whether a property comes from \\(p_k\\) alone.</p>
        </div>
      </div>
      <img src="js/chapters/chapter-04-scale-free-networks/images/book/figure-4-17.jpg" alt="Degree preserving randomization" style="width:70%; display:block; margin:0.6rem auto 0; border-radius:6px; border:1px solid var(--rule);">
      <p class="caption">Image 4.17 &mdash; full randomization erases hubs (&rarr; random); degree-preserving keeps them (&rarr; still scale-free).</p>
    </section>`,

    // 16. Hidden parameter model (book image)
    `<section>
      <h2>The Hidden-Parameter Model</h2>
      <div class="two-col">
        <div>
          <p>Assign each node a hidden parameter \\(\\eta_i\\); connect pairs with probability \\(\\propto \\eta_i\\eta_j\\). Choosing \\(\\eta_i = c\\,i^{-\\alpha}\\) gives:</p>
          <div class="eq-panel">\\[ p_k \\sim k^{-(1 + 1/\\alpha)}, \\quad \\gamma = 1 + \\tfrac{1}{\\alpha} \\]</div>
          <p class="caption">Tune \\(\\alpha\\) for \\(\\gamma\\), and \\(\\langle\\eta\\rangle\\) for \\(\\langle k\\rangle\\) &mdash; independent control, unlike the configuration model. No self-loops or multi-links.</p>
        </div>
        <img src="js/chapters/chapter-04-scale-free-networks/images/book/figure-4-18.jpg" alt="Hidden parameter model" style="width:100%; border-radius:6px; border:1px solid var(--rule);">
      </div>
    </section>`,

    // 17. Plotting power laws - LIVE binning
    `<section>
      <h2>How to Plot a Power Law</h2>
      <p>The same power-law data, plotted three ways. Linear binning fabricates a noisy plateau in the tail that corrupts the fit; log-binning and the cumulative distribution recover the true scaling. Cycle through them:</p>
      <div class="sim-container" id="binning-sim"></div>
      <div class="sim-controls">
        <button onclick="window.binningSim.cycle()">next plotting method</button>
        <span class="caption">Always use log-log; never linear-bin the tail.</span>
      </div>
    </section>`,

    // 18. Fitting gamma (book images - the CSN procedure)
    `<section>
      <h2>Fitting the Degree Exponent</h2>
      <div class="two-col">
        <div>
          <p>Eyeballing a slope is biased. The proper procedure (Clauset&ndash;Shalizi&ndash;Newman):</p>
          <ol style="font-size:0.95rem;">
            <li>ML-estimate \\(\\gamma\\) for a cutoff \\(K_{min}\\)</li>
            <li>Measure KS distance \\(D\\) between data and fit</li>
            <li>Scan \\(K_{min}\\), minimize \\(D\\)</li>
            <li>Goodness-of-fit p-value vs. synthetic data</li>
          </ol>
          <p class="caption">The pure power law is <em>rejected</em> for citations (\\(p&lt;10^{-4}\\)); the saturation+cutoff form fits well (\\(p=0.69\\)).</p>
        </div>
        <img src="js/chapters/chapter-04-scale-free-networks/images/book/figure-4-24.jpg" alt="Maximum likelihood estimation" style="width:100%; border-radius:6px; border:1px solid var(--rule);">
      </div>
    </section>`,

    // 19. Summary
    `<section>
      <h2>Two Classes of Networks</h2>
      <div class="two-col">
        <div class="panel">
          <strong style="color:var(--accent-edge)">Exponentially bounded</strong>
          <p class="caption">Thin tail; \\(\\langle k^2\\rangle \\approx \\langle k\\rangle\\); no outliers. Poisson, Gaussian. Real: power grid, highways. Random model works.</p>
        </div>
        <div class="panel">
          <strong style="color:var(--accent-hub)">Fat tailed</strong>
          <p class="caption">Power-law tail; \\(\\langle k^2\\rangle \\gg \\langle k\\rangle\\); hubs expected. Real: WWW, Internet, proteins, social. Scale-free model works.</p>
        </div>
      </div>
      <p>The operational signal is \\(\\langle k^2 \\rangle\\): large &rarr; behaves scale-free; small &rarr; behaves random.</p>
      <p class="caption">The open question &mdash; <em>why</em> are so many networks scale-free? &mdash; is answered by the Barabási&ndash;Albert model next.</p>
    </section>`
  ],

  afterRender: function () {
    const ppl = document.getElementById('ppl-sim');
    if (ppl && ppl.clientWidth > 0 && !ppl.dataset.inited) { window.pplSim = createPoissonPowerlawSim(ppl, { k: 11, gamma: 2.1, log: true }); ppl.dataset.inited = '1'; }

    const sf = document.getElementById('sf-display');
    if (sf && sf.clientWidth > 0 && !sf.dataset.inited) { createScaleFreeDisplay(sf, { N: 120, m: 1 }); sf.dataset.inited = '1'; }

    const km = document.getElementById('kmax-sim');
    if (km && km.clientWidth > 0 && !km.dataset.inited) { createKmaxSim(km, { gamma: 2.5 }); km.dataset.inited = '1'; }

    const bn = document.getElementById('binning-sim');
    if (bn && bn.clientWidth > 0 && !bn.dataset.inited) { window.binningSim = createBinningSim(bn, {}); bn.dataset.inited = '1'; }
  }
});