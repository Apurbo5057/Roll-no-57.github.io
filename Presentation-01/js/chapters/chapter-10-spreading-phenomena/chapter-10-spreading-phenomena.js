/* ============================================================
   CHAPTER 10 — Spreading Phenomena
   -------------------------------------------------------------
   Folder: js/chapters/chapter-10-spreading-phenomena/
     chapter-10-spreading-phenomena.js  <- this file
     images/  <- empty; book figures hot-linked

   SIMULATED: SI/SIS/SIR curves, live network spreading
     (centerpiece), vanishing epidemic threshold.
   EMBEDDED: 10.1, 10.3, 10.4, 10.5, 10.6, 10.11, 10.13, 10.15,
     10.23, 10.24, 10.26, 10.32.

   Requires shared lib: createEpidemicCurvesSim,
     createNetworkEpidemicSim, createThresholdSim
   ============================================================ */

window.chapters = window.chapters || [];

window.chapters.push({
  id: 'ch10',
  title: 'Spreading Phenomena',
  slides: [
    // Chapter title slide
    `<section class="chapter-divider" style="text-align:center;">
      <div style="margin-top:20%;">
        <p style="font-family:var(--font-mono); color:var(--accent-edge); font-size:1rem; letter-spacing:0.14em; text-transform:uppercase;">Chapter 10</p>
        <h1 style="font-size:2.8rem; margin-top:0.6em;">Spreading Phenomena</h1>
        <div style="width:120px; height:1px; background:var(--rule); margin:2rem auto;"></div>
      </div>
    </section>`,

    // 1. Title
    `<section>
      <h2>Spreading Phenomena</h2>
      <div class="two-col">
        <div>
          <p>The final chapter, and the one where the whole book pays off. Diseases, ideas, viruses, and memes all spread over networks &mdash; and the <em>structure</em> of the network decides their fate.</p>
          <p>The headline result ties straight back to the scale-free property: on a scale-free network, <strong>the epidemic threshold vanishes</strong>.</p>
        </div>
        <img src="https://networksciencebook.com/images/ch-10/figure-10-1.jpg" alt="Super-spreaders" style="width:100%; border-radius:6px; border:1px solid var(--rule);">
      </div>
      <p class="caption">Image 10.1 &mdash; super-spreaders: a few hubs drive most of the transmission.</p>
    </section>`,

    // 2. Compartmental models intro
    `<section>
      <h2>Three Classic Models</h2>
      <div class="two-col">
        <div>
          <p>Epidemiology sorts a population into compartments and tracks the flow between them:</p>
          <ul style="font-size:0.92rem;">
            <li><strong>SI</strong> &mdash; susceptible &rarr; infected (no recovery)</li>
            <li><strong>SIS</strong> &mdash; recovery returns you to susceptible (colds)</li>
            <li><strong>SIR</strong> &mdash; recovery grants immunity (flu, measles)</li>
          </ul>
        </div>
        <img src="https://networksciencebook.com/images/ch-10/figure-10-6.jpg" alt="SIR model" style="width:100%; border-radius:6px; border:1px solid var(--rule);">
      </div>
      <p class="caption">Image 10.6 &mdash; the SIR compartments and their rate equations.</p>
    </section>`,

    // 3. SI model math
    `<section>
      <h2>The SI Model</h2>
      <p>Under homogeneous mixing, the infected fraction \\(i\\) grows as:</p>
      <div class="eq-panel">\\[ \\frac{di}{dt} = \\beta \\langle k\\rangle\\, i(1 - i) \\]</div>
      <p>A logistic curve: exponential at first (all contacts are susceptible), then saturating. The characteristic time is:</p>
      <div class="eq-panel">\\[ \\tau = \\frac{1}{\\beta \\langle k\\rangle} \\]</div>
      <p class="caption">Denser contacts (\\(\\langle k\\rangle\\)) or higher transmissibility (\\(\\beta\\)) spread the pathogen faster.</p>
    </section>`,

    // 4. SIS + endemic state
    `<section>
      <h2>The SIS Model &amp; the Endemic State</h2>
      <p>Add recovery at rate \\(\\mu\\):</p>
      <div class="eq-panel">\\[ \\frac{di}{dt} = \\beta \\langle k\\rangle\\, i(1-i) - \\mu i \\]</div>
      <p>Two outcomes. If recovery is slow, the disease settles into an <strong>endemic state</strong>:</p>
      <div class="eq-panel">\\[ i(\\infty) = 1 - \\frac{\\mu}{\\beta \\langle k\\rangle} \\]</div>
      <p class="caption">If recovery is fast enough (\\(\\mu &gt; \\beta\\langle k\\rangle\\)), the infection dies out exponentially.</p>
    </section>`,

    // 5. Compartmental curves - LIVE
    `<section>
      <h2>The Three Models, Live</h2>
      <p>Switch models and drag the transmission and recovery rates. Watch SI saturate at everyone, SIS reach an endemic plateau, and SIR rise then fall as people recover into immunity.</p>
      <div class="sim-container" id="epi-curves"></div>
      <div class="sim-controls">
        <button onclick="window.epiCurves.setModel('SI')">SI</button>
        <button onclick="window.epiCurves.setModel('SIS')">SIS</button>
        <button onclick="window.epiCurves.setModel('SIR')">SIR</button>
        <label>β <input type="range" min="0.0002" max="0.0015" step="0.0001" value="0.0006" oninput="window.epiCurves.setBeta(+this.value)"></label>
        <label>μ <input type="range" min="0.02" max="0.4" step="0.02" value="0.15" oninput="window.epiCurves.setMu(+this.value)"></label>
        <span id="epi-curves-label"></span>
      </div>
    </section>`,

    // 6. Network epidemics setup
    `<section>
      <h2>Beyond Homogeneous Mixing</h2>
      <div class="two-col">
        <div>
          <p>Homogeneous mixing pretends everyone contacts everyone. Real diseases follow the <strong>contact network</strong> &mdash; and its degrees vary wildly.</p>
          <p>The key quantity becomes the <strong>spreading rate</strong>:</p>
          <div class="eq-panel">\\[ \\lambda = \\frac{\\beta}{\\mu} \\]</div>
          <p class="caption">A pathogen persists only if \\(\\lambda\\) exceeds an <em>epidemic threshold</em> \\(\\lambda_c\\).</p>
        </div>
        <img src="https://networksciencebook.com/images/ch-10/figure-10-13.jpg" alt="The sex web" style="width:100%; border-radius:6px; border:1px solid var(--rule);">
      </div>
      <p class="caption">Image 10.13 &mdash; the scale-free "sex web," the contact network for STDs.</p>
    </section>`,

    // 7. Live network spreading - CENTERPIECE
    `<section>
      <h2>Watch an Epidemic Spread</h2>
      <p>SIR dynamics on a live network. Red = infected, teal = susceptible, grey = recovered. Compare topologies: on a scale-free network the infection rips through the hubs; on a random network it crawls.</p>
      <div class="sim-container" id="net-epi" style="height:330px;"></div>
      <div class="sim-controls">
        <button onclick="window.netEpi.start()">▶ spread</button>
        <button onclick="window.netEpi.setTopology('scalefree')">scale-free</button>
        <button onclick="window.netEpi.setTopology('random')">random</button>
        <button onclick="window.netEpi.reset()">reset</button>
        <span id="net-epi-label"></span>
      </div>
    </section>`,

    // 8. The vanishing threshold - the big result
    `<section>
      <h2>The Vanishing Epidemic Threshold</h2>
      <p>Solving SIS on a network gives the threshold in terms of the first two moments:</p>
      <div class="eq-panel">\\[ \\lambda_c = \\frac{\\langle k\\rangle}{\\langle k^2\\rangle} \\]</div>
      <div class="two-col">
        <div class="panel">
          <strong style="color:var(--accent-edge)">Random network</strong>
          <div class="eq-panel" style="font-size:0.85rem;">\\[ \\lambda_c = \\frac{1}{\\langle k\\rangle + 1} > 0 \\]</div>
          <p class="caption">Finite threshold &mdash; weak pathogens die out.</p>
        </div>
        <div class="panel">
          <strong style="color:var(--accent-hub)">Scale-free network</strong>
          <div class="eq-panel" style="font-size:0.85rem;">\\[ \\langle k^2\\rangle \\to \\infty \\Rightarrow \\lambda_c \\to 0 \\]</div>
          <p class="caption">No threshold &mdash; <em>even weak pathogens spread</em>.</p>
        </div>
      </div>
    </section>`,

    // 9. Threshold plot - LIVE
    `<section>
      <h2>Why Hubs Change Everything</h2>
      <p>The endemic infection level vs. spreading rate. A random network has a clean cutoff &mdash; below \\(\\lambda_c\\), nothing. A scale-free network has <em>no</em> cutoff: any \\(\\lambda &gt; 0\\) produces an outbreak.</p>
      <div class="sim-container" id="threshold-sim"></div>
      <p class="caption">A pathogen that fails on a random network can still infect a hub in a scale-free one &mdash; and the hub passes it to everyone.</p>
    </section>`,

    // 10. Airborne / air travel (book image)
    `<section>
      <h2>Real Contact Networks</h2>
      <div class="two-col">
        <div>
          <p>Different diseases ride different networks &mdash; and most are scale-free:</p>
          <ul style="font-size:0.9rem;">
            <li><strong>STDs</strong> &mdash; the sexual contact web</li>
            <li><strong>Airborne</strong> &mdash; the air-transportation network</li>
            <li><strong>Digital viruses</strong> &mdash; email / the Internet</li>
          </ul>
          <p class="caption">The air-travel network turns local outbreaks into global pandemics within days.</p>
        </div>
        <img src="https://networksciencebook.com/images/ch-10/figure-10-15.jpg" alt="Air transportation network" style="width:100%; border-radius:6px; border:1px solid var(--rule);">
      </div>
    </section>`,

    // 11. Random immunization fails
    `<section>
      <h2>Why Random Immunization Fails</h2>
      <p>Immunizing a random fraction \\(g\\) rescales the spreading rate to \\(\\lambda(1-g)\\). The critical coverage needed:</p>
      <div class="eq-panel">\\[ g_c = 1 - \\frac{\\mu}{\\beta}\\frac{\\langle k\\rangle}{\\langle k^2\\rangle} \\]</div>
      <p>For a scale-free network, \\(\\langle k^2\\rangle \\to \\infty\\) forces \\(g_c \\to 1\\) &mdash; you'd have to immunize <em>almost everyone</em>.</p>
      <p class="caption">Measles needs 95%; an email virus needs 99.7%. This is why weak digital viruses linger for years.</p>
    </section>`,

    // 12. Targeted immunization (book image)
    `<section>
      <h2>Target the Hubs</h2>
      <div class="two-col">
        <div>
          <p>The hubs create the huge \\(\\langle k^2\\rangle\\). Immunize <em>them</em> and you slash the variance, restoring a finite threshold:</p>
          <div class="eq-panel" style="font-size:0.85rem;">\\[ \\lambda_c = \\frac{\\langle k\\rangle}{\\langle k^2\\rangle} \\;\\uparrow \\text{ as hubs removed} \\]</div>
          <p class="caption">Immunizing hubs fragments the contact network &mdash; the pathogen gets trapped in small islands.</p>
        </div>
        <img src="https://networksciencebook.com/images/ch-10/figure-10-24.jpg" alt="Selective immunization" style="width:100%; border-radius:6px; border:1px solid var(--rule);">
      </div>
    </section>`,

    // 13. Attack = immunization duality (book image)
    `<section>
      <h2>Two Sides of the Same Coin</h2>
      <div class="two-col">
        <div>
          <p>This is the same result as Chapter 8's robustness, seen from the other side:</p>
          <ul style="font-size:0.9rem;">
            <li>Vanishing threshold \\(\\Leftrightarrow\\) \\(f_c \\to 1\\) under random failure (can't break it by chance)</li>
            <li>Hub immunization \\(\\Leftrightarrow\\) targeted attack (a few hubs shatter it)</li>
          </ul>
          <p class="caption">Robustness and immunization both trace back to the diverging \\(\\langle k^2\\rangle\\). Attack and targeted immunization are the same operation.</p>
        </div>
        <img src="https://networksciencebook.com/images/ch-10/figure-10-23.jpg" alt="Robustness and immunization" style="width:100%; border-radius:6px; border:1px solid var(--rule);">
      </div>
    </section>`,

    // 14. Prediction (book image)
    `<section>
      <h2>Predicting Pandemics</h2>
      <div class="two-col">
        <div>
          <p>Modern models (like GLEAM) combine the air-travel network with local epidemic dynamics to <em>forecast</em> a pandemic's spread &mdash; validated on the 2009 H1N1 outbreak.</p>
          <p>The key idea: geographic distance is misleading. <strong>Effective distance</strong> &mdash; derived from travel flows &mdash; predicts arrival times far better.</p>
        </div>
        <img src="https://networksciencebook.com/images/ch-10/figure-10-32.jpg" alt="Effective distance and arrival time" style="width:100%; border-radius:6px; border:1px solid var(--rule);">
      </div>
      <p class="caption">Image 10.32 &mdash; in effective-distance space, an epidemic spreads as a simple expanding wave.</p>
    </section>`,

    // 15. Summary / closing
    `<section>
      <h2>The Whole Book, in One Result</h2>
      <div class="two-col">
        <div>
          <p>Spreading phenomena tie every thread together:</p>
          <ul style="font-size:0.9rem;">
            <li>Networks are everywhere (Ch. 1&ndash;2)</li>
            <li>They're scale-free, with hubs (Ch. 4)</li>
            <li>Growth + preferential attachment build them (Ch. 5&ndash;6)</li>
            <li>Hubs make them robust yet fragile (Ch. 8)</li>
            <li>And hubs make epidemics almost unstoppable &mdash; unless we target the hubs themselves.</li>
          </ul>
        </div>
        <div class="panel">
          <strong style="color:var(--accent-hub)">The through-line</strong>
          <p class="caption">Everything comes back to the diverging second moment \\(\\langle k^2\\rangle\\). The hubs that define scale-free networks govern how they grow, break, and spread disease.</p>
        </div>
      </div>
      <p class="caption">From the topology of the Web to the control of pandemics &mdash; one structural idea, running through it all.</p>
    </section>`
  ],

  afterRender: function () {
    const ec = document.getElementById('epi-curves');
    if (ec && ec.clientWidth > 0 && !ec.dataset.inited) { window.epiCurves = createEpidemicCurvesSim(ec, { labelEl: document.getElementById('epi-curves-label') }); ec.dataset.inited = '1'; }

    const ne = document.getElementById('net-epi');
    if (ne && ne.clientWidth > 0 && !ne.dataset.inited) { window.netEpi = createNetworkEpidemicSim(ne, { N: 120, labelEl: document.getElementById('net-epi-label') }); ne.dataset.inited = '1'; }

    const th = document.getElementById('threshold-sim');
    if (th && th.clientWidth > 0 && !th.dataset.inited) { createThresholdSim(th, {}); th.dataset.inited = '1'; }
  }
});
