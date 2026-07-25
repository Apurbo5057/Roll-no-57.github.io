/* ============================================================
   CHAPTER 11 — The Basis Paper
   -------------------------------------------------------------
   Folder: js/chapters/chapter-11-basis-paper/
     chapter-11-basis-paper.js  <- this file

   Source notes: Chapters/paper_explainer.md
   Walkthrough of Kamal, Das & Rahman, "Generating Scale-Free
   Caterpillar and Series-Parallel Networks" (ICCA 2024) — the
   thesis's direct predecessor.

   Live sims (shared lib js/lib/network-sim.js):
     createCaterpillarStepSim   — Algorithm 1, click-through
     createSeriesParallelStepSim — Algorithm 2, click-through
   ============================================================ */

window.chapters = window.chapters || [];

window.chapters.push({
  id: 'ch11',
  title: 'The Basis Paper',
  slides: [
    // Chapter divider
    `<section class="chapter-divider" style="text-align:center;">
      <div style="margin-top:14%;">
        <p style="font-family:var(--font-mono); color:var(--accent-edge); font-size:1rem; letter-spacing:0.14em; text-transform:uppercase;">Chapter 11 &mdash; The Paper</p>
        <h1 style="font-size:2.5rem; margin-top:0.6em; line-height:1.2;">Generating Scale-Free<br>Caterpillar &amp; Series-Parallel Networks</h1>
        <div style="width:120px; height:1px; background:var(--rule); margin:1.6rem auto;"></div>
        <p class="caption">Kamal, Das &amp; Rahman &mdash; ICCA 2024 &middot; doi:10.1145/3723178.3723189</p>
        <p class="caption" style="margin-top:0.4rem;">The direct predecessor to this thesis.</p>
      </div>
    </section>`,

    // 1. Why this paper matters
    `<section>
      <h2>Why This Paper?</h2>
      <div class="two-col">
        <div>
          <p>It solves the <strong>"scale-free + specific graph class"</strong> problem for <em>two</em> classes: caterpillars and series-parallel graphs.</p>
          <p>My thesis solves the same style of problem for <strong>planar graphs</strong>.</p>
        </div>
        <div class="panel">
          <strong style="color:var(--accent-hub)">The real goal</strong>
          <p class="caption">Not just "understand the paper" &mdash; extract the <em>template</em> it uses, so we can see which pieces transfer to planar graphs and which are specific to caterpillars / series-parallel.</p>
        </div>
      </div>
    </section>`,

    // 2. Two ideas combined -> the gap
    `<section>
      <h2>Two Ideas, Combined</h2>
      <div class="two-col">
        <div class="panel">
          <strong style="color:var(--accent-hub)">Scale-free</strong>
          <p class="caption">A <em>statistical</em> property &mdash; the shape of the degree distribution. Studied by Barabási &amp; descendants, with no constraint on graph shape.</p>
        </div>
        <div class="panel">
          <strong style="color:var(--accent-edge)">Graph class</strong>
          <p class="caption">A <em>structural</em> property &mdash; the graph's topology (tree, planar, caterpillar&hellip;). Studied separately in graph theory.</p>
        </div>
      </div>
      <div class="panel" style="margin-top:0.7rem; border-left:3px solid var(--accent-hub);">
        <strong>The gap</strong>
        <p class="caption">Almost nobody asks: can I generate a graph that is <em>simultaneously</em> scale-free <em>and</em> guaranteed to belong to a specific structural class? The class restricts which degree sequences are even possible &mdash; a much harder, more constrained problem.</p>
      </div>
    </section>`,

    // 3. What scale-free means
    `<section>
      <h2>What "Scale-Free" Means</h2>
      <p>The degree distribution follows a <strong>power law</strong>:</p>
      <div class="eq-panel">\\[ P(k) \\propto k^{-\\gamma}, \\qquad 2 &lt; \\gamma &lt; 3 \\]</div>
      <div class="two-col">
        <div>
          <p>Normalized, with \\(\\zeta(\\gamma)=\\sum_{k\\geq 1} k^{-\\gamma}\\) (the Riemann zeta function):</p>
          <div class="eq-panel">\\[ P(k) = \\frac{k^{-\\gamma}}{\\zeta(\\gamma)} \\]</div>
        </div>
        <div>
          <p>The <strong>expected number</strong> of degree-\\(k\\) vertices in an \\(n\\)-vertex graph:</p>
          <div class="eq-panel">\\[ N(k) = n\\,P(k) = \\frac{n\\,k^{-\\gamma}}{\\zeta(\\gamma)} \\]</div>
        </div>
      </div>
      <p class="caption">Most vertices have low degree; a few <em>hubs</em> have very high degree. \\(N(k)\\) is the workhorse &mdash; every derivation of \\(\\gamma\\) starts from it.</p>
    </section>`,

    // 4. The two target classes
    `<section>
      <h2>The Two Target Classes</h2>
      <div class="two-col">
        <div class="panel">
          <strong style="color:var(--accent-hub)">Caterpillar</strong>
          <p class="caption">A tree where removing all leaves leaves a simple path &mdash; the <em>spine</em>. Every vertex is either on the spine or a leaf hanging off it. Like the insect: a body line with legs sticking out.</p>
        </div>
        <div class="panel">
          <strong style="color:var(--accent-edge)">Series-Parallel</strong>
          <p class="caption">Defined recursively with two terminals \\(s,t\\): base = single edge; <em>series</em> = glue \\(t_1\\) to \\(s_2\\); <em>parallel</em> = glue \\(s_1{=}s_2\\), \\(t_1{=}t_2\\). Central to circuit theory.</p>
        </div>
      </div>
      <p class="caption">Both happen to be <strong>planar</strong> &mdash; but "planar" is far broader, with no recursive grammar or spine to lean on. That's exactly why the thesis is harder.</p>
    </section>`,

    // 5. The general recipe
    `<section>
      <h2>The General Degree-Sequence Recipe</h2>
      <p>Before any class-specific work, how to draw <em>a</em> power-law sequence of size \\(n\\):</p>
      <div class="panel">
        <ol style="font-size:0.95rem; margin:0;">
          <li>Choose \\(k_{min}\\), \\(k_{max}\\), and \\(\\gamma\\).</li>
          <li>Compute \\(P(k)\\) for every integer \\(k\\) in range.</li>
          <li>Draw \\(n\\) degree values from this distribution.</li>
          <li>The ordered list is your <strong>degree sequence</strong>.</li>
        </ol>
      </div>
      <p class="caption">This is just "draw raw material." It does <em>not</em> guarantee the sequence is realizable in the target class &mdash; sculpting it into a legal graph is the hard part the rest of the paper solves.</p>
    </section>`,

    // ---- PART A DIVIDER ----
    `<section class="chapter-divider" style="text-align:center;">
      <div style="margin-top:20%;">
        <p style="font-family:var(--font-mono); color:var(--accent-edge); font-size:0.95rem; letter-spacing:0.14em; text-transform:uppercase;">Part A</p>
        <h1 style="font-size:2.4rem; margin-top:0.5em;">Scale-Free Caterpillars</h1>
        <p class="caption" style="margin-top:1rem;">The cleaner half &mdash; and the gentler on-ramp.</p>
      </div>
    </section>`,

    // 6. Caterpillar: derive gamma (Lemma 3.1)
    `<section>
      <h2>Step 1 &mdash; Derive \\(\\gamma\\) (Lemma 3.1)</h2>
      <p>Split vertices: \\(U\\) = spine (degree \\(\\geq 2\\)), \\(V\\) = leaves (degree \\(1\\)). A spine vertex of degree \\(k\\) spends 2 edges on spine-neighbors; the other \\(k-2\\) go to leaves. The two spine ends have one spare slot each (the "+2").</p>
      <div class="eq-panel">\\[ \\underbrace{2 + \\sum_{u\\in U}(\\deg(u)-2)}_{\\text{leaf-slots supplied}} = \\underbrace{|V|}_{\\text{leaves needed}} \\]</div>
      <p class="caption">A pure counting identity &mdash; true for <em>any</em> caterpillar, scale-free or not.</p>
    </section>`,

    // 7. Caterpillar: substitute + solve
    `<section>
      <h2>Substitute the Power Law &rarr; \\(\\gamma \\approx 2.47\\)</h2>
      <p>Plug in \\(N(k)\\): leaves \\(|V| = N(1) = n/\\zeta(\\gamma)\\), open slots \\((k-2)N(k)\\):</p>
      <div class="eq-panel">\\[ 2 + \\sum_{k=2}^{\\infty}(k-2)\\frac{n\\,k^{-\\gamma}}{\\zeta(\\gamma)} = \\frac{n}{\\zeta(\\gamma)} \\qquad \\text{(Eq. 2)} \\]</div>
      <div class="two-col">
        <div>
          <p>\\(n\\) cancels asymptotically &mdash; one fixed \\(\\gamma\\) works for a caterpillar of <em>any</em> size. No closed form, so solve numerically (bisection):</p>
        </div>
        <div class="eq-panel" style="font-size:1.4rem; text-align:center;">\\[ \\boxed{\\gamma \\approx 2.47} \\]</div>
      </div>
      <p class="caption"><strong>The template move:</strong> write a structural identity &rarr; substitute \\(N(k)\\) &rarr; solve for \\(\\gamma\\). For planar, the identity is different (Euler's formula, \\(m\\le 3n-6\\)).</p>
    </section>`,

    // 8. Caterpillar Algorithm 1
    `<section>
      <h2>Step 2 &mdash; Algorithm 1: Build It</h2>
      <div class="panel">
        <ol style="font-size:0.9rem; margin:0;">
          <li>Start with \\(n\\) isolated vertices.</li>
          <li>Split into \\(U\\) (spine, deg \\(\\geq 2\\)) and \\(V\\) (leaves).</li>
          <li><strong>Sanity-fix:</strong> a random draw won't satisfy the identity exactly &mdash; adjust the <em>largest-degree</em> vertex just enough to force it.</li>
          <li><strong>Build spine:</strong> connect consecutive \\(U\\) vertices &rarr; a simple path.</li>
          <li><strong>Attach leaves:</strong> for each spine vertex, pop \\(\\deg(u)-2\\) leaves off \\(V\\) and connect.</li>
          <li>Give each spine endpoint one extra leaf (the "+2").</li>
        </ol>
      </div>
      <p class="caption">"Skeleton first, then fill in" &mdash; the pattern that recurs for both classes and, hopefully, for planar.</p>
    </section>`,

    // 8b. Caterpillar Algorithm 1 — step-by-step simulation
    `<section>
      <h2>Algorithm 1, Step by Step</h2>
      <p>Click through the build on a fixed 9-vertex example &mdash; spine \\(s_0,s_1,s_2\\) with degrees 3, 4, 3, and six leaves.</p>
      <div class="sim-container" id="cat-step-sim" style="height:330px;"></div>
      <div class="sim-controls">
        <button onclick="window.catStepSim.prev()">&lsaquo; back</button>
        <button onclick="window.catStepSim.next()">next &rsaquo;</button>
        <button onclick="window.catStepSim.reset()">reset</button>
        <span id="cat-step-count" class="caption"></span>
      </div>
      <p class="caption" id="cat-step-cap" style="min-height:2.6em; margin-top:0.4rem;"></p>
    </section>`,

    // 9. Caterpillar correctness + complexity
    `<section>
      <h2>Step 3 &mdash; Correctness &amp; Complexity (Thm 3.2)</h2>
      <div class="two-col">
        <div class="panel">
          <strong style="color:var(--accent-hub)">It's a caterpillar</strong>
          <p class="caption">Exactly \\(n-1\\) edges + connected + acyclic \\(\\Rightarrow\\) a tree. Remove the leaves &rarr; the spine (a path) remains \\(\\Rightarrow\\) caterpillar by definition.</p>
        </div>
        <div class="panel">
          <strong style="color:var(--accent-edge)">It's scale-free</strong>
          <p class="caption">The degree sequence <em>is</em> the power-law draw (modulo the small fix) &mdash; scale-free by construction.</p>
        </div>
      </div>
      <div class="eq-panel" style="text-align:center;">Time: \\(O(|U|+|V|) = O(n)\\) &mdash; <strong>linear</strong></div>
    </section>`,

    // 10. Caterpillar experiments
    `<section>
      <h2>Experimental Validation</h2>
      <p>Runs at \\(n = 10^2\\) to \\(10^5\\), checking three things:</p>
      <table style="width:100%; font-size:0.82rem; border-collapse:collapse;">
        <tr style="border-bottom:1px solid var(--rule); color:var(--accent-edge);">
          <th style="text-align:left; padding:0.4rem;">Check</th><th style="text-align:left; padding:0.4rem;">Result</th><th style="text-align:left; padding:0.4rem;">Why</th></tr>
        <tr style="border-bottom:1px solid var(--rule);"><td style="padding:0.4rem;">Clustering coeff.</td><td style="padding:0.4rem;"><strong>Always 0</strong></td><td style="padding:0.4rem;">Trees have no triangles &mdash; sanity check it's a tree.</td></tr>
        <tr style="border-bottom:1px solid var(--rule);"><td style="padding:0.4rem;">Avg. path vs \\(n\\)</td><td style="padding:0.4rem;"><strong>Linear</strong></td><td style="padding:0.4rem;">Spine length grows linearly with \\(n\\).</td></tr>
        <tr><td style="padding:0.4rem;">Degree dist. (log-log)</td><td style="padding:0.4rem;"><strong>Straight line</strong></td><td style="padding:0.4rem;">Power-law shape survived construction.</td></tr>
      </table>
      <p class="caption">Figures 4 &amp; 5 in the paper. This "clustering + log-log + structural sanity check" trio is a good template for the thesis experiments.</p>
    </section>`,

    // ---- PART B DIVIDER ----
    `<section class="chapter-divider" style="text-align:center;">
      <div style="margin-top:20%;">
        <p style="font-family:var(--font-mono); color:var(--accent-edge); font-size:0.95rem; letter-spacing:0.14em; text-transform:uppercase;">Part B</p>
        <h1 style="font-size:2.4rem; margin-top:0.5em;">Scale-Free Series-Parallel</h1>
        <p class="caption" style="margin-top:1rem;">Richer class, trickier algorithm, more intricate proof.</p>
      </div>
    </section>`,

    // 11. Two observations
    `<section>
      <h2>Two Observations That Shape Everything</h2>
      <div class="two-col">
        <div class="panel">
          <strong style="color:var(--accent-hub)">1. No degree-1 vertices</strong>
          <p class="caption">Composition touches every non-terminal vertex at least twice &rarr; degree \\(\\geq 2\\) always. So here \\(k_{min}=2\\) (contrast caterpillars, where leaves were essential).</p>
        </div>
        <div class="panel">
          <strong style="color:var(--accent-edge)">2. Degree-2 vertices are free</strong>
          <p class="caption"><em>Subdividing</em> any edge (insert a vertex mid-edge) is a local series step &mdash; always preserves series-parallel. So: build the deg-\\(\\geq 3\\) skeleton first, sprinkle deg-2 vertices in as a trivial last pass.</p>
        </div>
      </div>
      <p class="caption">Same "hard structure first, easy vertices last" move as caterpillars &mdash; adapted to a richer class.</p>
    </section>`,

    // 12. Open-ports / stack model
    `<section>
      <h2>The "Open Ports" Stack Model</h2>
      <p>Treat each vertex's degree as <strong>ports</strong> to fill. Process \\(U\\) (deg \\(\\geq 3\\)) in non-increasing degree order.</p>
      <div class="panel">
        <ul style="font-size:0.88rem; margin:0;">
          <li>\\(u_0\\) (largest) is one terminal &mdash; drawing it opens \\(\\deg(u_0)\\) ports.</li>
          <li>Each next \\(u_i\\) closes the <em>most recently opened</em> ports first, then leaves <strong>one</strong> of its own ports open for the next vertex.</li>
        </ul>
      </div>
      <p class="caption">"Close most-recent ports first" is exactly a <strong>stack (LIFO)</strong> discipline &rarr; implemented with an explicit stack \\(S\\) in Algorithm 2. New vertices only ever attach to currently-exposed boundary vertices &mdash; that nesting is what keeps the series/parallel structure intact.</p>
    </section>`,

    // 13. Algorithm 2 steps
    `<section>
      <h2>Algorithm 2, in Plain Steps</h2>
      <div class="panel">
        <ol style="font-size:0.85rem; margin:0;">
          <li>Split into \\(U\\) (deg \\(&gt;2\\), sorted descending) and \\(V\\) (deg \\(=2\\)).</li>
          <li><strong>Readjust:</strong> simulate port-closing abstractly; dump leftover open-ness onto \\(U[0]\\) so it balances.</li>
          <li>Push \\(u_0\\) onto the stack \\(\\deg(u_0)\\) times.</li>
          <li>For each \\(u_i\\): pop up to \\(\\deg(u_i)-1\\) items, connect; push \\(u_i\\)'s leftover ports back on.</li>
          <li>At the end, connect any two remaining stack items (the parallel \\(s\\)&ndash;\\(t\\) edges).</li>
          <li><strong>Insert deg-2 vertices:</strong> subdivide a random edge for each \\(v\\in V\\).</li>
        </ol>
      </div>
      <p class="caption">Figure 6 walks a concrete 5-vertex example &mdash; the fastest way to build intuition.</p>
    </section>`,

    // 13b. Algorithm 2 — step-by-step simulation
    `<section>
      <h2>Algorithm 2, Step by Step</h2>
      <p>Watch the open-port <strong>stack</strong> (right) drive the build for \\(U=\\{u_0{:}4, u_1{:}3, u_2{:}3\\}\\) and one deg-2 vertex \\(v_0\\).</p>
      <div class="sim-container" id="sp-step-sim" style="height:330px;"></div>
      <div class="sim-controls">
        <button onclick="window.spStepSim.prev()">&lsaquo; back</button>
        <button onclick="window.spStepSim.next()">next &rsaquo;</button>
        <button onclick="window.spStepSim.reset()">reset</button>
        <span id="sp-step-count" class="caption"></span>
      </div>
      <p class="caption" id="sp-step-cap" style="min-height:2.6em; margin-top:0.4rem;"></p>
    </section>`,

    // 14. Correctness (induction)
    `<section>
      <h2>Correctness &mdash; Strong Induction (Thm 4.1)</h2>
      <p>Strip deg-2 vertices (Obs. 2) to get \\(G'\\) with all degrees \\(\\geq 3\\), then induct on vertex count:</p>
      <div class="two-col">
        <div class="panel">
          <strong style="color:var(--accent-hub)">Case 1</strong>
          <p class="caption">Some \\(u_x\\) has \\(&gt;1\\) open port left &rarr; \\(G'\\) splits at \\(u_x\\) into "before" and "after" &mdash; a <em>series</em> composition of two smaller SP graphs.</p>
        </div>
        <div class="panel">
          <strong style="color:var(--accent-edge)">Case 2</strong>
          <p class="caption">No vertex has extra open ports &rarr; multiple parallel edges between first and last vertex &mdash; a <em>parallel</em> composition plus one series step.</p>
        </div>
      </div>
      <div class="eq-panel" style="text-align:center;">Time: \\(O(n+m) = O(m)\\) &mdash; linear in edges (\\(m \\gg n\\) for hub-heavy graphs)</div>
    </section>`,

    // 15. Theorem 4.2 - honesty
    `<section>
      <h2>The Honesty Point &mdash; Thm 4.2</h2>
      <div class="two-col">
        <div>
          <p>A <strong>simple</strong> graph has no repeated edges or self-loops. Algorithm 2 <em>cannot guarantee</em> this: the same vertex pair can get connected more than once during port-closing.</p>
          <p>The authors <strong>derive an inequality (Eq. 3)</strong>: "spare" deg-2 vertices available vs. expected repeated edges&hellip;</p>
        </div>
        <div class="panel" style="border-left:3px solid var(--accent-danger);">
          <strong style="color:var(--accent-danger)">Conclusion</strong>
          <p class="caption">For <em>no</em> \\(\\gamma \\in (2,3)\\) does the inequality hold. The output <strong>may be a multigraph</strong> &mdash; and they flag it plainly rather than hiding it.</p>
        </div>
      </div>
      <p class="caption">A model for thesis rigor: when your algorithm has a limitation, prove it and state it.</p>
    </section>`,

    // 16. SP experiments
    `<section>
      <h2>Series-Parallel Experiments</h2>
      <div class="two-col">
        <div class="panel">
          <strong style="color:var(--accent-hub)">Clustering vs \\(\\gamma\\)</strong>
          <p class="caption">Lower \\(\\gamma\\) &rarr; higher clustering. Heavier tail = bigger hubs = more triangles through the hub. Unlike caterpillars, SP graphs <em>can</em> have cycles, so clustering is nonzero (Fig. 7).</p>
        </div>
        <div class="panel">
          <strong style="color:var(--accent-edge)">Degree dist.</strong>
          <p class="caption">Log-log plot at \\(n = 10^5\\) is roughly linear &mdash; power-law shape survived (Fig. 8).</p>
        </div>
      </div>
    </section>`,

    // 17. Side-by-side comparison
    `<section>
      <h2>The Two Halves, Side by Side</h2>
      <table style="width:100%; font-size:0.72rem; border-collapse:collapse;">
        <tr style="border-bottom:1px solid var(--rule); color:var(--accent-edge);">
          <th style="text-align:left; padding:0.35rem;">Aspect</th><th style="text-align:left; padding:0.35rem;">Caterpillar</th><th style="text-align:left; padding:0.35rem;">Series-Parallel</th></tr>
        <tr style="border-bottom:1px solid var(--rule);"><td style="padding:0.35rem;">\\(k_{min}\\)</td><td style="padding:0.35rem;">1 (leaves matter)</td><td style="padding:0.35rem;">2 (deg-1 forbidden)</td></tr>
        <tr style="border-bottom:1px solid var(--rule);"><td style="padding:0.35rem;">Required \\(\\gamma\\)</td><td style="padding:0.35rem;">Forced, \\(\\approx 2.47\\)</td><td style="padding:0.35rem;">Any \\(\\gamma\\in(2,3)\\)</td></tr>
        <tr style="border-bottom:1px solid var(--rule);"><td style="padding:0.35rem;">Structure</td><td style="padding:0.35rem;">Spine + leaves</td><td style="padding:0.35rem;">Stack / open-port composition</td></tr>
        <tr style="border-bottom:1px solid var(--rule);"><td style="padding:0.35rem;">Complexity</td><td style="padding:0.35rem;">\\(O(n)\\)</td><td style="padding:0.35rem;">\\(O(m)\\)</td></tr>
        <tr style="border-bottom:1px solid var(--rule);"><td style="padding:0.35rem;">Simple graph?</td><td style="padding:0.35rem;">Yes</td><td style="padding:0.35rem;"><span style="color:var(--accent-danger)">No (proven)</span></td></tr>
        <tr style="border-bottom:1px solid var(--rule);"><td style="padding:0.35rem;">Clustering</td><td style="padding:0.35rem;">Always 0</td><td style="padding:0.35rem;">Nonzero, varies with \\(\\gamma\\)</td></tr>
        <tr><td style="padding:0.35rem;">Proof technique</td><td style="padding:0.35rem;">Edge-count + acyclicity</td><td style="padding:0.35rem;">Strong induction, 2 cases</td></tr>
      </table>
    </section>`,

    // 18. The reusable template
    `<section>
      <h2>The One Reusable Pattern</h2>
      <div class="panel">
        <ol style="font-size:0.92rem; margin:0;">
          <li><strong>Structural identity</strong> &mdash; write what every graph in the class must satisfy (counting for caterpillars; recursive decomposition for SP).</li>
          <li><strong>Solve for \\(\\gamma\\)</strong> &mdash; substitute the power-law counts \\(N(k)\\); get a forced value or a feasible range.</li>
          <li><strong>Build the skeleton</strong> &mdash; draw a random sequence, minimally readjust the largest vertex to fit exactly.</li>
          <li><strong>Attach the remainder</strong> &mdash; mechanically assemble so it's a class member by construction, in linear time.</li>
        </ol>
      </div>
      <p class="caption">This four-stage recipe is the scaffold to carry into the thesis.</p>
    </section>`,

    // 19. What it means for the thesis
    `<section>
      <h2>What This Means for My Thesis (Planar)</h2>
      <div class="two-col">
        <div class="panel">
          <strong style="color:var(--accent-hub)">Transfers well</strong>
          <p class="caption">The 4-stage recipe; the "readjust the largest vertex" fix; reporting a complexity bound + log-log / clustering / structural validation; being explicit about limitations.</p>
        </div>
        <div class="panel" style="border-left:3px solid var(--accent-danger);">
          <strong style="color:var(--accent-danger)">Won't transfer</strong>
          <p class="caption">Planar has <em>no</em> canonical recursive grammar like SP &rarr; need a different proof strategy. The constraint becomes Euler's formula \\(n-m+f=2\\) &amp; \\(m\\le 3n-6\\) &mdash; likely a feasibility <em>region</em>, not a single forced \\(\\gamma\\).</p>
        </div>
      </div>
      <p class="caption">Decide early: general planar, or a planar subclass? The multigraph issue (à la Thm 4.2) may resurface &mdash; check it up front.</p>
    </section>`,

    // 20. Takeaways
    `<section>
      <h2>Chapter Takeaways</h2>
      <div class="panel">
        <ul style="font-size:0.95rem; margin:0;">
          <li>The paper marries a <strong>statistical</strong> property (power law) to a <strong>structural</strong> one (graph class) &mdash; a hard, under-explored combination.</li>
          <li><strong>Caterpillars:</strong> a counting identity forces \\(\\gamma\\approx 2.47\\); \\(O(n)\\); always simple, always clustering 0.</li>
          <li><strong>Series-parallel:</strong> a stack-based port model; \\(O(m)\\); any \\(\\gamma\\in(2,3)\\), but provably <em>not</em> always simple.</li>
          <li>The reusable 4-stage template is the map for taking this to <strong>planar graphs</strong>.</li>
        </ul>
      </div>
      <p class="caption">Cite the original directly: Kamal, Das &amp; Rahman, ICCA 2024, doi:10.1145/3723178.3723189.</p>
    </section>`
  ],

  afterRender: function () {
    const cat = document.getElementById('cat-step-sim');
    if (cat && cat.clientWidth > 0 && !cat.dataset.inited) {
      window.catStepSim = createCaterpillarStepSim(cat, {
        capEl: document.getElementById('cat-step-cap'),
        countEl: document.getElementById('cat-step-count')
      });
      cat.dataset.inited = '1';
    }

    const sp = document.getElementById('sp-step-sim');
    if (sp && sp.clientWidth > 0 && !sp.dataset.inited) {
      window.spStepSim = createSeriesParallelStepSim(sp, {
        capEl: document.getElementById('sp-step-cap'),
        countEl: document.getElementById('sp-step-count')
      });
      sp.dataset.inited = '1';
    }
  }
});
