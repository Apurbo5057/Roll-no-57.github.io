/* ============================================================
   CHAPTER 00 — Personal Introduction
   -------------------------------------------------------------
   Folder layout expected:
     js/chapters/chapter-00-personal-introduction/
       chapter-00-personal-introduction.js   <- this file
       images/                                <- empty; nothing needed for this chapter

   NOTE: delete/rename the old placeholder folder
   "chapter-00-intro" (from the initial scaffold) — it also
   registers id 'ch00' and will collide with this one.
   ============================================================ */

window.chapters = window.chapters || [];

window.chapters.push({
  id: 'ch00',
  title: 'Personal Introduction',
  slides: [
    // 0. Front / title slide
    `<section style="text-align:center;">
      <div style="margin-top:8%;">
        <svg viewBox="0 0 120 60" width="120" height="60" style="margin-bottom:1.5rem;">
          <line x1="20" y1="30" x2="60" y2="15" stroke="var(--accent-edge)" stroke-width="1.5"/>
          <line x1="20" y1="30" x2="60" y2="45" stroke="var(--accent-edge)" stroke-width="1.5"/>
          <line x1="60" y1="15" x2="100" y2="30" stroke="var(--accent-edge)" stroke-width="1.5"/>
          <line x1="60" y1="45" x2="100" y2="30" stroke="var(--accent-edge)" stroke-width="1.5"/>
          <circle cx="20" cy="30" r="5" fill="var(--accent-hub)"/>
          <circle cx="60" cy="15" r="4" fill="var(--ink-dim)"/>
          <circle cx="60" cy="45" r="4" fill="var(--ink-dim)"/>
          <circle cx="100" cy="30" r="5" fill="var(--accent-hub)"/>
        </svg>
        <h1 style="font-size:3rem; margin-bottom:0.3em;">Network Science</h1>
        <p style="font-family:var(--font-mono); color:var(--accent-edge); font-size:1.1rem; letter-spacing:0.03em;">Albert-László Barabási</p>
        <div style="width:120px; height:1px; background:var(--rule); margin:2.2rem auto;"></div>
        <p style="color:var(--ink-dim); font-size:0.95rem; font-family:var(--font-mono);">Presented by</p>
        <p style="font-size:1.4rem; color:var(--ink); font-family:var(--font-display);">Mosharaf Hossain Apurbo</p>
      </div>
    </section>`,

    // Chapter title slide
    `<section class="chapter-divider" style="text-align:center;">
      <div style="margin-top:20%;">
        <p style="font-family:var(--font-mono); color:var(--accent-edge); font-size:1rem; letter-spacing:0.14em; text-transform:uppercase;">Chapter 00</p>
        <h1 style="font-size:2.8rem; margin-top:0.6em;">Personal Introduction</h1>
        <div style="width:120px; height:1px; background:var(--rule); margin:2rem auto;"></div>
      </div>
    </section>`,

    `<section>
      <h2>How Network Science Began</h2>
      <p>A personal account by Albert-László Barabási &mdash; five years of setbacks before a ten-day discovery. Five turning points:</p>
      <svg viewBox="0 0 900 240" width="100%" height="360">
        <line x1="40" y1="120" x2="860" y2="120" stroke="var(--rule)" stroke-width="2"/>

        <circle cx="60" cy="120" r="7" fill="var(--accent-hub)"/>
        <line x1="60" y1="113" x2="60" y2="70" stroke="var(--rule)" stroke-width="1.5"/>
        <text x="60" y="55" text-anchor="middle" fill="var(--accent-hub)" font-family="var(--font-mono)" font-size="15" font-weight="600">1994</text>
        <text x="60" y="75" text-anchor="middle" fill="var(--ink-dim)" font-family="var(--font-body)" font-size="13"><tspan x="60" dy="0">First</tspan><tspan x="60" dy="15">network paper</tspan></text>

        <circle cx="260" cy="120" r="7" fill="var(--accent-hub)"/>
        <line x1="260" y1="127" x2="260" y2="170" stroke="var(--rule)" stroke-width="1.5"/>
        <text x="260" y="190" text-anchor="middle" fill="var(--accent-hub)" font-family="var(--font-mono)" font-size="15" font-weight="600">1998</text>
        <text x="260" y="210" text-anchor="middle" fill="var(--ink-dim)" font-family="var(--font-body)" font-size="13"><tspan x="260" dy="0">Crawler reveals</tspan><tspan x="260" dy="15">the Web isn't random</tspan></text>

        <circle cx="460" cy="120" r="7" fill="var(--accent-hub)"/>
        <line x1="460" y1="113" x2="460" y2="70" stroke="var(--rule)" stroke-width="1.5"/>
        <text x="460" y="55" text-anchor="middle" fill="var(--accent-hub)" font-family="var(--font-mono)" font-size="15" font-weight="600">1999</text>
        <text x="460" y="75" text-anchor="middle" fill="var(--ink-dim)" font-family="var(--font-body)" font-size="13"><tspan x="460" dy="0">Same pattern</tspan><tspan x="460" dy="15">everywhere &mdash; universal</tspan></text>

        <circle cx="660" cy="120" r="7" fill="var(--accent-hub)"/>
        <line x1="660" y1="127" x2="660" y2="170" stroke="var(--rule)" stroke-width="1.5"/>
        <text x="660" y="190" text-anchor="middle" fill="var(--accent-hub)" font-family="var(--font-mono)" font-size="15" font-weight="600">1999</text>
        <text x="660" y="210" text-anchor="middle" fill="var(--ink-dim)" font-family="var(--font-body)" font-size="13"><tspan x="660" dy="0">Growth +</tspan><tspan x="660" dy="15">preferential attachment</tspan></text>

        <circle cx="840" cy="120" r="7" fill="var(--accent-hub)"/>
        <line x1="840" y1="113" x2="840" y2="70" stroke="var(--rule)" stroke-width="1.5"/>
        <text x="840" y="55" text-anchor="middle" fill="var(--accent-hub)" font-family="var(--font-mono)" font-size="15" font-weight="600">2000</text>
        <text x="840" y="75" text-anchor="middle" fill="var(--ink-dim)" font-family="var(--font-body)" font-size="13"><tspan x="840" dy="0">Robust to failure,</tspan><tspan x="840" dy="15">fragile to attack</tspan></text>
      </svg>
    </section>`,

    `<section>
      <h2>The Surprise: Poisson vs. Power Law</h2>
      <div class="two-col">
        <div>
          <p><strong>Expected</strong> (random network): most nodes have a similar number of links &mdash; like people's heights clustering near an average.</p>
          <p><strong>Found</strong> (real networks): a few "hub" nodes have vastly more links than everyone else &mdash; more like wealth than height.</p>
        </div>
        <div>
          <svg viewBox="0 0 300 160" width="100%" height="160">
            <text x="0" y="14" fill="var(--ink-dim)" font-family="var(--font-mono)" font-size="11">degree distribution shape</text>
            <path d="M10,140 C60,140 70,40 110,40 C150,40 160,140 210,140" fill="none" stroke="var(--accent-edge)" stroke-width="2.5"/>
            <text x="10" y="155" fill="var(--accent-edge)" font-family="var(--font-mono)" font-size="10">Poisson (expected)</text>
            <path d="M10,60 C40,140 90,145 290,150" fill="none" stroke="var(--accent-hub)" stroke-width="2.5" transform="translate(0,-25)"/>
            <text x="150" y="30" fill="var(--accent-hub)" font-family="var(--font-mono)" font-size="10">power law (found)</text>
          </svg>
        </div>
      </div>
    </section>`,

    `<section>
      <h2>The Mechanism: Growth + Preferential Attachment</h2>
      <p>Two simple ingredients, identified within days, explained the pattern:</p>
      <ol>
        <li><strong>Growth</strong> &mdash; networks aren't static; nodes are added over time.</li>
        <li><strong>Preferential attachment</strong> &mdash; new nodes tend to link to already well-connected nodes ("rich get richer").</li>
      </ol>
      <p class="caption">This combination alone is enough to mathematically generate a power-law degree distribution.</p>
    </section>`,

    `<section>
      <h2>Robustness vs. Attack &mdash; try it</h2>
      <p>Remove nodes from a scale-free network at random, or deliberately target the biggest hub each time. Watch how many separate "islands" the network breaks into.</p>
      <div class="sim-container" id="robustness-sim"></div>
      <div class="sim-controls">
        <button onclick="window.robustnessSim.randomFailure()">random failure</button>
        <button onclick="window.robustnessSim.targetedAttack()">targeted attack</button>
        <button onclick="window.robustnessSim.reset()">reset</button>
        <span id="robustness-stats"></span>
      </div>
    </section>`
  ],
  afterRender: function () {
    const el = document.getElementById('robustness-sim');
    if (el && el.clientWidth > 0 && !el.dataset.inited) {
      window.robustnessSim = createRobustnessSim(el, {
        initialNodes: 40,
        m: 2,
        statsEl: document.getElementById('robustness-stats')
      });
      el.dataset.inited = '1';
    }
  }
});