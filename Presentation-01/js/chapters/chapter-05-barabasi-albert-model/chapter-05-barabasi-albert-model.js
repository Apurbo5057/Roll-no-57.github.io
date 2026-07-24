/* ============================================================
   CHAPTER 05 — The Barabási-Albert Model
   -------------------------------------------------------------
   Folder layout:
     js/chapters/chapter-05-barabasi-albert-model/
       chapter-05-barabasi-albert-model.js   <- this file
       images/                               <- empty; book figures hot-linked

   Image policy: simulate what's meaningful & reproducible; embed
   the rest from networksciencebook.com.
     - SIMULATED: BA growth (centerpiece), degree dynamics k(t),
       nonlinear-PA α slider, Model A vs BA distribution.
     - EMBEDDED: 5.1 (growth photos), 5.2 (history), 5.9 (two-map
       method), 5.10 (π(k) real data), 5.13/5.14/5.15/5.17 (origin
       models), 5.18/5.19 (distance & clustering scaling plots).

   Requires shared lib:
     createBAGrowthSim, createDegreeDynamicsSim,
     createNonlinearPASim, createModelABSim
   ============================================================ */

window.chapters = window.chapters || [];

window.chapters.push({
  id: 'ch05',
  title: 'The Barabási-Albert Model',
  slides: [
    // Chapter title slide
    `<section class="chapter-divider" style="text-align:center;">
      <div style="margin-top:20%;">
        <p style="font-family:var(--font-mono); color:var(--accent-edge); font-size:1rem; letter-spacing:0.14em; text-transform:uppercase;">Chapter 05</p>
        <h1 style="font-size:2.8rem; margin-top:0.6em;">The Barabási-Albert Model</h1>
        <div style="width:120px; height:1px; background:var(--rule); margin:2rem auto;"></div>
      </div>
    </section>`,

    // 1. Title
    `<section>
      <h2>The Barabási&ndash;Albert Model</h2>
      <div class="two-col">
        <div>
          <p>Chapter 4 showed <em>that</em> networks are scale-free. This chapter answers <em>why</em>.</p>
          <p>The answer is two simple mechanisms &mdash; <strong>growth</strong> and <strong>preferential attachment</strong> &mdash; and the chapter proves they are both necessary and sufficient.</p>
          <p class="caption">The deep message: a network's structure and its history are inseparable.</p>
        </div>
        <img src="https://networksciencebook.com/images/ch-05/figure-5-1.jpg" alt="The growth of networks" style="width:100%; border-radius:6px; border:1px solid var(--rule);">
      </div>
      <p class="caption">Image 5.1 &mdash; the WWW, citation, and actor networks all grow by continuously adding nodes.</p>
    </section>`,

    // 2. Two missing ingredients
    `<section>
      <h2>Two Things the Random Model Got Wrong</h2>
      <div class="two-col">
        <div class="panel">
          <strong>Networks grow</strong>
          <p class="caption">ER fixes \\(N\\). Real networks expand: the WWW went from 1 page (1991) to \\(>10^{12}\\) by adding nodes over time.</p>
        </div>
        <div class="panel">
          <strong>New nodes prefer hubs</strong>
          <p class="caption">ER links randomly. In reality a new page is far likelier to link to Google than to an obscure page &mdash; "rich get richer."</p>
        </div>
      </div>
      <p class="caption">Put these two ingredients together and hubs emerge on their own.</p>
    </section>`,

    // 3. The model definition
    `<section>
      <h2>The Model</h2>
      <p>Start with \\(m_0\\) nodes. At each timestep:</p>
      <ol>
        <li><strong>Growth</strong> &mdash; add one new node with \\(m\\) links.</li>
        <li><strong>Preferential attachment</strong> &mdash; each link attaches to an existing node with probability proportional to its degree:</li>
      </ol>
      <div class="eq-panel">\\[ \\Pi(k_i) = \\frac{k_i}{\\sum_j k_j} \\]</div>
      <p class="caption">A new node <em>can</em> link to anyone, but a degree-4 node is twice as likely to be chosen as a degree-2 node. After \\(t\\) steps: \\(N = t + m_0\\) nodes, and \\(\\gamma = 3\\).</p>
    </section>`,

    // 4. BA growth - THE centerpiece simulation
    `<section>
      <h2>Watch the Hubs Emerge</h2>
      <p>Add nodes one at a time. Each attaches preferentially, so well-connected nodes pull ahead &mdash; the rich-get-richer loop &mdash; and a few run away to become hubs.</p>
      <div class="sim-container" id="ba-grow-sim" style="height:360px;"></div>
      <div class="sim-controls">
        <button onclick="window.baGrowSim.addNode()">+ add node</button>
        <button onclick="for(let i=0;i&lt;20;i++) window.baGrowSim.addNode()">+ add 20</button>
        <button onclick="window.baGrowSim.reset()">reset</button>
      </div>
    </section>`,

    // 5. Degree dynamics derivation
    `<section>
      <h2>How One Node Grows</h2>
      <p>Track node \\(i\\). Its growth rate is \\(m\\Pi(k_i)\\); since \\(\\sum_j k_j \\approx 2mt\\):</p>
      <div class="eq-panel">\\[ \\frac{dk_i}{dt} = m\\,\\frac{k_i}{2mt} = \\frac{k_i}{2t} \\]</div>
      <p>Integrating with \\(k_i(t_i) = m\\):</p>
      <div class="eq-panel">\\[ k_i(t) = m\\left(\\frac{t}{t_i}\\right)^{\\beta}, \\qquad \\beta = \\tfrac{1}{2} \\]</div>
      <p class="caption">Every node follows the same law. Earlier nodes (smaller \\(t_i\\)) grow bigger &mdash; the "first-mover advantage." Hubs are hubs because they arrived early.</p>
    </section>`,

    // 6. Degree dynamics - LIVE plot
    `<section>
      <h2>First-Mover Advantage</h2>
      <p>Growth curves for nodes added at different times. All follow \\(t^{1/2}\\), but the earliest-added nodes ride the highest curves &mdash; they had the longest head start.</p>
      <div class="sim-container" id="dyn-sim"></div>
      <p class="caption">The growth is sublinear (\\(\\beta &lt; 1\\)): each node competes with an ever-growing pool of newcomers, so it gains links more and more slowly.</p>
    </section>`,

    // 7. Degree distribution derivation
    `<section>
      <h2>Why γ = 3</h2>
      <p>Continuum theory turns the dynamics into a distribution:</p>
      <div class="eq-panel">\\[ p(k) \\sim k^{-\\gamma}, \\qquad \\gamma = \\frac{1}{\\beta} + 1 = 3 \\]</div>
      <p>This links a <em>topological</em> quantity (\\(\\gamma\\)) to a <em>dynamical</em> one (\\(\\beta\\)). The exact distribution is:</p>
      <div class="eq-panel">\\[ p_k = \\frac{2m(m+1)}{k(k+1)(k+2)} \\]</div>
      <p class="caption">\\(\\gamma = 3\\) is independent of \\(m\\); \\(p_k\\) is independent of \\(t\\) and \\(N\\) &mdash; a stationary scale-free state, which is why networks of all ages share the same shape.</p>
    </section>`,

    // 8. Necessity: Model A vs BA (LIVE)
    `<section>
      <h2>Are Both Ingredients Needed?</h2>
      <p><strong>Model A</strong> keeps growth but drops preferential attachment (new nodes attach randomly). Result: an <em>exponential</em> distribution &mdash; no hubs. Compare it live against the full BA power law:</p>
      <div class="sim-container" id="modelab-sim"></div>
      <div class="sim-controls">
        <button onclick="window.modelABSim.toggleScale()">toggle linear / log-log</button>
        <span class="caption">Without the rich-get-richer bias, every node gains links equally &mdash; no winner emerges.</span>
      </div>
    </section>`,

    // 9. Necessity conclusion
    `<section>
      <h2>Necessary and Sufficient</h2>
      <div class="two-col">
        <div class="panel">
          <strong style="color:var(--accent-danger)">Model A: growth only</strong>
          <p class="caption">No preferential attachment &rarr; exponential \\(p_k\\), no hubs. \\(k_i(t)\\) grows only logarithmically.</p>
        </div>
        <div class="panel">
          <strong style="color:var(--accent-danger)">Model B: attachment only</strong>
          <p class="caption">No growth &rarr; \\(p_k\\) never stabilises; the network fills up into a complete graph.</p>
        </div>
      </div>
      <p>Neither ingredient alone works. <strong>Growth + preferential attachment are jointly required</strong> &mdash; and together they suffice.</p>
    </section>`,

    // 10. Measuring PA (book image)
    `<section>
      <h2>Detecting Preferential Attachment in Real Data</h2>
      <div class="two-col">
        <div>
          <p>Take two snapshots at \\(t\\) and \\(t+\\Delta t\\); measure how many links each node gained:</p>
          <div class="eq-panel">\\[ \\frac{\\Delta k_i}{\\Delta t} \\sim \\Pi(k_i) \\]</div>
          <p>The cumulative \\(\\pi(k) = \\sum \\Pi(k_i)\\) is cleaner: no attachment gives \\(\\pi(k)\\sim k\\); linear attachment gives \\(\\pi(k)\\sim k^2\\).</p>
        </div>
        <img src="https://networksciencebook.com/images/ch-05/figure-5-9.jpg" alt="Detecting preferential attachment" style="width:100%; border-radius:6px; border:1px solid var(--rule);">
      </div>
    </section>`,

    // 11. Evidence (book image)
    `<section>
      <h2>The Evidence</h2>
      <img src="https://networksciencebook.com/images/ch-05/figure-5-10.jpg" alt="Evidence of preferential attachment" style="width:75%; display:block; margin:0 auto 0.5rem; border-radius:6px; border:1px solid var(--rule);">
      <p class="caption">Image 5.10 &mdash; \\(\\pi(k)\\) for four real networks, all rising faster than \\(k\\) (attachment is real). Internet & citations are linear (\\(\\alpha\\approx1\\)); collaboration & actors are <em>sublinear</em> (\\(\\alpha\\approx0.9\\)).</p>
    </section>`,

    // 12. Nonlinear PA - LIVE slider
    `<section>
      <h2>What If Attachment Isn't Linear?</h2>
      <p>Replace \\(\\Pi(k)\\) with \\(\\Pi(k)\\sim k^\\alpha\\) and drag \\(\\alpha\\). Only \\(\\alpha = 1\\) gives a pure power law; sublinear suppresses hubs, superlinear creates a single super-hub.</p>
      <div class="sim-container" id="nlpa-sim" style="height:320px;"></div>
      <div class="sim-controls">
        <label>α <input type="range" id="nlpa-alpha" min="0.4" max="1.6" value="1" step="0.1" oninput="window.nlpaSim.setAlpha(+this.value)"></label>
        <span id="nlpa-label"></span>
      </div>
    </section>`,

    // 13. Origins of PA (book image)
    `<section>
      <h2>Where Does Preferential Attachment Come From?</h2>
      <p>New nodes don't need to know every degree. It <em>emerges</em> from simple local rules:</p>
      <div class="two-col">
        <div>
          <ul>
            <li><strong>Link selection</strong> &mdash; attach to the endpoint of a random link. High-degree nodes sit on more links, so \\(\\Pi \\sim k\\) for free.</li>
            <li><strong>Copying</strong> &mdash; copy a link from a random node (webpages, gene duplication).</li>
            <li><strong>Optimization</strong> &mdash; balance distance vs. centrality; the scale-free phase produces linear \\(\\Pi(k)\\).</li>
          </ul>
        </div>
        <img src="https://networksciencebook.com/images/ch-05/figure-5-17.jpg" alt="Luck or reason" style="width:100%; border-radius:6px; border:1px solid var(--rule);">
      </div>
      <p class="caption">Image 5.17 &mdash; preferential attachment arises from either randomness or optimization; both roads produce a linear \\(\\Pi(k)\\).</p>
    </section>`,

    // 14. Diameter & clustering (book images)
    `<section>
      <h2>Distance &amp; Clustering</h2>
      <div class="two-col">
        <div>
          <div class="eq-panel">\\[ \\langle d \\rangle \\sim \\frac{\\ln N}{\\ln\\ln N} \\]</div>
          <p class="caption">Smaller than a random network's \\(\\ln N\\) &mdash; BA networks are even more compact.</p>
          <img src="https://networksciencebook.com/images/ch-05/figure-5-18.jpg" alt="Average distance" style="width:100%; border-radius:6px; border:1px solid var(--rule); margin-top:0.5rem;">
        </div>
        <div>
          <div class="eq-panel">\\[ \\langle C \\rangle \\sim \\frac{(\\ln N)^2}{N} \\]</div>
          <p class="caption">Above the random network's \\(1/N\\) &mdash; BA networks are more locally clustered.</p>
          <img src="https://networksciencebook.com/images/ch-05/figure-5-19.jpg" alt="Clustering coefficient" style="width:100%; border-radius:6px; border:1px solid var(--rule); margin-top:0.5rem;">
        </div>
      </div>
    </section>`,

    // 15. Summary
    `<section>
      <h2>Structure and Evolution Are Inseparable</h2>
      <p>Earlier models arrange links among a <em>fixed</em> set of nodes &mdash; a photo of a painting. The BA model re-paints it, modelling how the network came to be.</p>
      <div class="two-col">
        <div class="panel">
          <strong>Necessary</strong>
          <p class="caption">Remove growth or attachment &rarr; scale-free property lost.</p>
        </div>
        <div class="panel">
          <strong>Sufficient</strong>
          <p class="caption">Both present &rarr; provably \\(\\gamma = 3\\) scale-free.</p>
        </div>
      </div>
      <p class="caption">Every known scale-free system has preferential attachment. What BA leaves open &mdash; varying \\(\\gamma\\), late-arriving hubs, higher clustering &mdash; is the subject of the next chapter.</p>
    </section>`
  ],

  afterRender: function () {
    const bg = document.getElementById('ba-grow-sim');
    if (bg && bg.clientWidth > 0 && !bg.dataset.inited) { window.baGrowSim = createBAGrowthSim(bg, { m: 2 }); bg.dataset.inited = '1'; }

    const dyn = document.getElementById('dyn-sim');
    if (dyn && dyn.clientWidth > 0 && !dyn.dataset.inited) { createDegreeDynamicsSim(dyn, { m: 2 }); dyn.dataset.inited = '1'; }

    const mab = document.getElementById('modelab-sim');
    if (mab && mab.clientWidth > 0 && !mab.dataset.inited) { window.modelABSim = createModelABSim(mab, {}); mab.dataset.inited = '1'; }

    const nl = document.getElementById('nlpa-sim');
    if (nl && nl.clientWidth > 0 && !nl.dataset.inited) { window.nlpaSim = createNonlinearPASim(nl, { N: 150, initialAlpha: 1, labelEl: document.getElementById('nlpa-label') }); nl.dataset.inited = '1'; }
  }
});
