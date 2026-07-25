/* ============================================================
   CHAPTER 12 — Research Landscape & Gaps
   -------------------------------------------------------------
   Folder: js/chapters/chapter-12-research-gaps/
     chapter-12-research-gaps.js  <- this file

   Source notes: Chapters/research_gaps.md
   Maps the four research communities, the open gaps, the ranked
   candidate thesis problems, and the planar risk assessment.
   No live sims in this chapter.
   ============================================================ */

window.chapters = window.chapters || [];

window.chapters.push({
  id: 'ch12',
  title: 'Research Gaps',
  slides: [
    // Chapter divider
    `<section class="chapter-divider" style="text-align:center;">
      <div style="margin-top:16%;">
        <p style="font-family:var(--font-mono); color:var(--accent-edge); font-size:1rem; letter-spacing:0.14em; text-transform:uppercase;">Chapter 12 &mdash; Where the Gaps Are</p>
        <h1 style="font-size:2.6rem; margin-top:0.6em;">Research Landscape &amp; Gaps</h1>
        <div style="width:120px; height:1px; background:var(--rule); margin:1.6rem auto;"></div>
        <p class="caption">Scale-free generation for specific graph classes &mdash; a map for topic selection.</p>
      </div>
    </section>`,

    // 1. The single most important insight
    `<section>
      <h2>The One Key Insight</h2>
      <div class="panel" style="border-left:3px solid var(--accent-hub);">
        <p style="font-size:1.05rem; margin:0;">My niche is not one field &mdash; it is <strong>four separate research communities that barely cite each other.</strong></p>
      </div>
      <p class="caption" style="margin-top:0.8rem;">Most of the "is my idea novel?" confusion comes from not realizing this. The basis paper lives in one of them and under-uses the community that holds the actual mathematical machinery.</p>
    </section>`,

    // 2. The field map
    `<section>
      <h2>The Field Map &mdash; Four Communities</h2>
      <table style="width:100%; font-size:0.72rem; border-collapse:collapse;">
        <tr style="border-bottom:1px solid var(--rule); color:var(--accent-edge);">
          <th style="text-align:left; padding:0.35rem;"></th><th style="text-align:left; padding:0.35rem;">Community</th><th style="text-align:left; padding:0.35rem;">Optimizes for</th></tr>
        <tr style="border-bottom:1px solid var(--rule);"><td style="padding:0.35rem; color:var(--accent-hub);"><strong>A</strong></td><td style="padding:0.35rem;"><strong>Class-constrained generation</strong> (the basis paper's lineage)</td><td style="padding:0.35rem;">Class membership + power law + linear algo + proof</td></tr>
        <tr style="border-bottom:1px solid var(--rule);"><td style="padding:0.35rem; color:var(--accent-hub);"><strong>B</strong></td><td style="padding:0.35rem;"><strong>Degree-sequence realizability</strong> (Bar-Noy, Peleg&hellip;)</td><td style="padding:0.35rem;">Exactly <em>which</em> sequences are realizable in a class</td></tr>
        <tr style="border-bottom:1px solid var(--rule);"><td style="padding:0.35rem; color:var(--accent-edge);"><strong>C</strong></td><td style="padding:0.35rem;"><strong>Statistical-physics models</strong> (Barabási, Comellas&hellip;)</td><td style="padding:0.35rem;">Reproducing real-world stats via growth</td></tr>
        <tr><td style="padding:0.35rem; color:var(--accent-edge);"><strong>D</strong></td><td style="padding:0.35rem;"><strong>Scalable / parallel generation</strong> (Yoo, Alam&hellip;)</td><td style="padding:0.35rem;">Raw throughput &mdash; billions of vertices</td></tr>
      </table>
      <p class="caption" style="margin-top:0.7rem;"><strong>Why this matters:</strong> the basis paper (A) cites C and D heavily but barely touches <strong>B</strong> &mdash; where the machinery for this problem actually lives. A thesis that bridges <strong>A&harr;B</strong> is a genuine contribution. That bridge is wide open.</p>
    </section>`,

    // 3. Community A - the lineage
    `<section>
      <h2>Community A &mdash; My Direct Lineage</h2>
      <p>A <em>tiny</em>, <em>recent</em> body of work &mdash; essentially two papers from one lab:</p>
      <div class="two-col">
        <div class="panel">
          <strong style="color:var(--accent-hub)">2022 &mdash; Outerplanar</strong>
          <p class="caption">Rafid, Ibrat &amp; Rahman. \\(O(n)\\) generator, plus a <em>negative</em> result: a maximal outerplanar graph's degree distribution cannot strictly fit a power law.</p>
        </div>
        <div class="panel">
          <strong style="color:var(--accent-edge)">2024 &mdash; Caterpillar &amp; SP</strong>
          <p class="caption">Kamal, Das &amp; Rahman (the basis paper). \\(\\gamma\\approx 2.47\\) forced for caterpillars; SP not guaranteed simple.</p>
        </div>
      </div>
      <p class="caption">That's close to the <em>entirety</em> of the "class membership + power law + proof" literature: two papers, three-and-a-bit classes. The authors explicitly pose "which other classes?" as an open question &mdash; inviting exactly this thesis.</p>
    </section>`,

    // 4. The pattern of results
    `<section>
      <h2>Every Result So Far Is Forced or Negative</h2>
      <div class="panel">
        <ul style="font-size:0.92rem; margin:0;">
          <li><strong>Outerplanar:</strong> power law <em>cannot</em> strictly fit &rarr; impossibility result.</li>
          <li><strong>Caterpillar:</strong> \\(\\gamma\\) <em>forced</em> to \\(\\approx 2.47\\) &rarr; very rigid.</li>
          <li><strong>Series-parallel:</strong> \\(\\gamma\\) free, but <em>simplicity cannot be guaranteed</em> &rarr; limitation result.</li>
        </ul>
      </div>
      <div class="panel" style="margin-top:0.7rem; border-left:3px solid var(--accent-hub);">
        <strong>Prediction for my thesis</strong>
        <p class="caption">Expect "\\(\\gamma\\) is forced," "power law can't fit exactly," or "can't be simple/connected." These are <em>publishable results, not failures.</em> Plan the narrative so a restrictive result still counts &mdash; so there's no panic in month four.</p>
      </div>
    </section>`,

    // 5. Community B - the toolkit
    `<section>
      <h2>Community B &mdash; The Missing Toolkit</h2>
      <p>Realizability vocabulary &mdash; a sequence \\(d=(d_1,\\dots,d_n)\\) is:</p>
      <div class="two-col">
        <div class="panel">
          <p class="caption" style="margin:0;"><strong>graphic</strong> &mdash; realizable by some simple graph<br><strong>forestic</strong> &mdash; by a cycle-free graph<br><strong>planaric</strong> &mdash; by a simple planar graph<br><strong>outer-planaric</strong> &mdash; by an outerplanar graph</p>
        </div>
        <div>
          <p>The "volume" \\(\\sum d = 2m\\) is the master parameter. From Euler's theorem:</p>
          <div class="eq-panel">\\[ \\sum d &gt; 4n-6 \\;\\Rightarrow\\; \\text{not planaric} \\]</div>
        </div>
      </div>
      <p class="caption">Bar-Noy et al. (MFCS 2024 survey): graphic &amp; forestic are fully characterized; <strong>planaric and outer-planaric remain open.</strong> This is the rigor the basis paper under-uses.</p>
    </section>`,

    // 6. The characterization table - most actionable
    `<section>
      <h2>Known vs. Open Characterizations</h2>
      <p class="caption" style="margin-top:0;">The most actionable slide: a <em>known</em> characterization makes the scale-free version far more tractable.</p>
      <div class="two-col">
        <div class="panel">
          <strong style="color:var(--accent-hub)">Known (raw material)</strong>
          <p class="caption">General (Erdős&ndash;Gallai) &middot; Forests &middot; 2-trees &middot; \\(k\\)-trees &middot; Maximal outerplanar &middot; <strong>Cacti (Rao 1981)</strong> &middot; <strong>Halin (2005)</strong> &middot; Unicyclic &middot; Planar bipartite biregular</p>
        </div>
        <div class="panel" style="border-left:3px solid var(--accent-danger);">
          <strong style="color:var(--accent-danger)">OPEN</strong>
          <p class="caption"><strong>Planar (general)</strong><br><strong>Outerplanar (general)</strong></p>
        </div>
      </div>
      <p class="caption">Known-characterization class &rarr; substitute \\(N(k)=nP(k)\\), solve for \\(\\gamma\\), build the algorithm (just like Lemma 3.1). "OPEN" &rarr; you're attempting a problem a strong theory group has flagged as unsolved.</p>
    </section>`,

    // 7. Community C - planar scale-free already exists
    `<section>
      <h2>Community C &mdash; "Planar Scale-Free" Already Exists (sort of)</h2>
      <p>The finding I most need to know, because planar is my stated target:</p>
      <div class="panel">
        <ul style="font-size:0.85rem; margin:0;">
          <li><strong>"Planar growth generates scale-free networks"</strong> (2016) &mdash; growth on planar triangulations, exponent \\(\\approx 2.77\\) emerges.</li>
          <li><strong>Maximal planar Sierpinski networks</strong> (Zhang et al. 2007) &mdash; deterministic fractal, analytic degree distribution.</li>
          <li><strong>Planar unclustered scale-free graphs</strong> (Miralles, Comellas et al. 2009) &mdash; deterministic two-parameter family.</li>
        </ul>
      </div>
      <p class="caption">Titles that literally say "planar + scale-free." I must cite and distinguish these, or an examiner says "this was done in 2007."</p>
    </section>`,

    // 8. How C differs - the novelty statement
    `<section>
      <h2>How That Differs From What I'd Do</h2>
      <table style="width:100%; font-size:0.76rem; border-collapse:collapse;">
        <tr style="border-bottom:1px solid var(--rule); color:var(--accent-edge);">
          <th style="text-align:left; padding:0.4rem;"></th><th style="text-align:left; padding:0.4rem;">Physics line (C)</th><th style="text-align:left; padding:0.4rem;">My line (A)</th></tr>
        <tr style="border-bottom:1px solid var(--rule);"><td style="padding:0.4rem;">Input</td><td style="padding:0.4rem;">A growth rule</td><td style="padding:0.4rem;">A prescribed degree sequence</td></tr>
        <tr style="border-bottom:1px solid var(--rule);"><td style="padding:0.4rem;">\\(\\gamma\\)</td><td style="padding:0.4rem;"><em>Emergent</em> &mdash; can't dial it</td><td style="padding:0.4rem;"><em>Prescribed</em> &mdash; you choose it</td></tr>
        <tr style="border-bottom:1px solid var(--rule);"><td style="padding:0.4rem;">Class guarantee</td><td style="padding:0.4rem;">By construction (one family)</td><td style="padding:0.4rem;">Formal proof of membership</td></tr>
        <tr><td style="padding:0.4rem;">Coverage</td><td style="padding:0.4rem;">Narrow self-similar sub-family</td><td style="padding:0.4rem;">The general class</td></tr>
      </table>
      <div class="panel" style="margin-top:0.7rem; border-left:3px solid var(--accent-hub);">
        <p class="caption" style="margin:0;"><strong>Honest novelty statement:</strong> planar scale-free <em>growth models</em> exist, but a <strong>degree-sequence-driven generator with prescribed \\(\\gamma\\), a formal planarity proof, and linear time</strong> does not. Real and defensible &mdash; but only if I cite these three explicitly.</p>
      </div>
    </section>`,

    // 9. Community D - non-competitor
    `<section>
      <h2>Community D &mdash; Scalable Generation</h2>
      <div class="two-col">
        <div>
          <p>Yoo &amp; Henderson, Alam &amp; Perumalla, Hadian &amp; Nobari, Meyer &amp; Penschuck&hellip; billions of vertices, GPU/parallel. <strong>None impose class constraints.</strong></p>
          <p class="caption">Mostly a non-competitor &mdash; but cite it to establish that scale-free generation at scale is solved <em>without</em> class constraints, which sharpens my problem statement.</p>
        </div>
        <div class="panel">
          <strong style="color:var(--accent-edge)">One relevant item</strong>
          <p class="caption">Meinert &amp; Wagner, "Generating planar graphs" (2011) &mdash; planar generation as an engineering problem, just not tied to power laws. Worth reading if I go planar.</p>
        </div>
      </div>
    </section>`,

    // 10. Ranked candidates - Tier 1
    `<section>
      <h2>Candidate Problems &mdash; Tier 1 (best risk/reward)</h2>
      <div class="panel">
        <strong style="color:var(--accent-hub)">6.1 Scale-free Cactus networks &#11088; top recommendation</strong>
        <p class="caption">High novelty (none found), high tractability (Rao 1981 characterization + fresh 2025 work). Clean counting identity like the caterpillar. Sits neatly between trees and planar &mdash; easy motivation.</p>
      </div>
      <div class="panel" style="margin-top:0.5rem;">
        <strong style="color:var(--accent-hub)">6.2 Scale-free Halin networks</strong>
        <p class="caption">Nothing found; Bíyíkoglu (2005) studied Halin degree sequences. A tree + leaf-cycle decomposition maps beautifully onto the skeleton-then-fill template; leaves forced to degree 3 &rarr; likely a crisp forced-\\(\\gamma\\) result.</p>
      </div>
      <div class="panel" style="margin-top:0.5rem;">
        <strong style="color:var(--accent-hub)">6.3 Scale-free \\(k\\)-tree / 2-tree networks</strong>
        <p class="caption">2-trees fully characterized (Bose et al. 2008). Caveat: random \\(k\\)-trees are already known to be power-law-ish &mdash; novelty must be the <em>prescribed-\\(\\gamma\\), guaranteed-class</em> framing.</p>
      </div>
    </section>`,

    // 11. Tiers 2 & 3
    `<section>
      <h2>Tiers 2 &amp; 3 &mdash; With Caveats / Methodological</h2>
      <div class="two-col">
        <div class="panel">
          <strong style="color:var(--accent-edge)">Tier 2 &mdash; class choices</strong>
          <p class="caption"><strong>Planar</strong> (highest impact, highest risk &mdash; next slide). <strong>Bipartite / planar-bipartite</strong> (easy motivation, but crowded in C). <strong>Chordal / interval</strong> (wide open, but riskiest tractability).</p>
        </div>
        <div class="panel">
          <strong style="color:var(--accent-edge)">Tier 3 &mdash; fix the method</strong>
          <p class="caption">Fix the <strong>simplicity</strong> problem (Thm 4.2). Guarantee <strong>connectivity</strong>. A <strong>unifying framework</strong> (highest impact &mdash; the A&harr;B bridge). <strong>Uniform sampling</strong>. Proper <strong>power-law fitting</strong> (Clauset&ndash;Shalizi&ndash;Newman).</p>
        </div>
      </div>
      <div class="panel" style="margin-top:0.6rem; border-left:3px solid var(--accent-hub);">
        <p class="caption" style="margin:0;"><strong>6.9 Unifying theorem:</strong> "for any class whose degree sequences satisfy \\(\\sum d \\le \\alpha n + \\beta\\), the feasible \\(\\gamma\\) range is [formula]" &mdash; would subsume caterpillar, outerplanar, SP in one stroke. The most ambitious, highest-impact idea.</p>
      </div>
    </section>`,

    // 12. Planar risk assessment
    `<section>
      <h2>Risk Assessment on "Planar"</h2>
      <div class="two-col">
        <div class="panel">
          <strong style="color:var(--accent-hub)">For</strong>
          <p class="caption">Highest impact &mdash; the headline class, the natural culmination of outerplanar &rarr; SP &rarr; planar. The lab's institutional knowledge is right there. Euler gives a clean volume bound.</p>
        </div>
        <div class="panel" style="border-left:3px solid var(--accent-danger);">
          <strong style="color:var(--accent-danger)">Against (take seriously)</strong>
          <p class="caption">Full planaric characterization is a <em>known open problem</em> (MFCS survey) &mdash; not a Master's-scale deliverable. Prior art in C uses the same title. Planarity is "loose" (\\(m\\) up to \\(3n-6\\)) &rarr; a feasibility <em>region</em>, not a quotable forced-\\(\\gamma\\).</p>
        </div>
      </div>
    </section>`,

    // 13. De-risking strategy
    `<section>
      <h2>Recommended De-Risking Strategy</h2>
      <div class="panel" style="border-left:3px solid var(--accent-hub);">
        <p style="font-size:1rem; margin:0;">Don't target general planar. Target a <strong>planar subclass with a known degree-sequence characterization</strong>, framed as progress toward planar.</p>
      </div>
      <div class="eq-panel" style="text-align:center; margin-top:0.7rem;">outerplanar &rarr; series-parallel &rarr; <strong style="color:var(--accent-hub)">[cactus / Halin]</strong> &rarr; planar</div>
      <p class="caption" style="margin-top:0.7rem;">Gives a guaranteed-completable thesis, clean novelty, a framing that flatters the lab's programme, and an honest future-work chapter. If the core result lands early, attempt general planar as a stretch chapter &mdash; nothing lost. Alternatively: combine a Tier-1 class with the unifying framework (6.9).</p>
    </section>`,

    // 14. Field critique -> turn into strength
    `<section>
      <h2>A Critique to Turn Into a Strength</h2>
      <div class="two-col">
        <div>
          <p class="caption"><strong>Broido &amp; Clauset (2019)</strong> &mdash; "Scale-free networks are rare": rigorous testing finds genuine power laws far less often than assumed.</p>
          <p class="caption"><strong>Li, Alderson, Doyle &amp; Willinger (2005)</strong> &mdash; graphs with identical power-law degree sequences can have wildly different structure; degree distribution alone under-determines a network.</p>
        </div>
        <div class="panel" style="border-left:3px solid var(--accent-hub);">
          <strong style="color:var(--accent-hub)">Use it, don't fear it</strong>
          <p class="caption">If degree distribution alone under-determines structure, then generating graphs that are scale-free <em>and</em> constrained to a structural class is precisely the right response &mdash; adding back the information a bare degree sequence throws away. Put this in the introduction. It turns the field's main critique into the thesis's justification.</p>
        </div>
      </div>
    </section>`,

    // 15. Bottom line
    `<section>
      <h2>Bottom Line</h2>
      <div class="panel">
        <ol style="font-size:0.9rem; margin:0;">
          <li>The niche (community A) is <strong>tiny &mdash; two papers.</strong> Novelty is easy to establish.</li>
          <li>The biggest untapped asset is the <strong>realizability literature (B)</strong> &mdash; the A&harr;B bridge is where rigor and differentiation come from.</li>
          <li><strong>General planar is high-risk</strong> (open problem + physics prior art). Prefer a planar subclass, framed as progress toward planar.</li>
          <li><strong>Cactus and Halin</strong> are the top two recommendations &mdash; unclaimed, tractable, with existing characterizations.</li>
          <li><strong>Expect a restrictive / negative result.</strong> Plan the narrative so that's a finding, not a crisis.</li>
          <li><strong>Discuss the class choice with the supervisor early</strong> &mdash; the lab knows what's already being worked on internally.</li>
        </ol>
      </div>
    </section>`
  ]
});
