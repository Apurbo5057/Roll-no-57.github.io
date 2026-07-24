/* ============================================================
   CHAPTER 01 — Networks at the Heart of Complex Systems
   -------------------------------------------------------------
   Folder layout expected:
     js/chapters/chapter-01-networks-at-the-heart/
       chapter-01-networks-at-the-heart.js   <- this file
       images/
         1-1-blackout-before.jpg   <- Image 1.1a from the book
         1-1-blackout-after.jpg    <- Image 1.1b from the book
         1-7-mapping-orgs.jpg      <- Image 1.7 from the book

   These three are non-reproducible (real photos / a specific
   real dataset), so they're referenced as plain <img> tags
   below. Drop the files into images/ with those exact names,
   or edit the src="" paths if you name them differently.
   ============================================================ */

window.chapters = window.chapters || [];

window.chapters.push({
  id: 'ch01',
  title: 'Networks at the Heart of Complex Systems',
  slides: [
    // Chapter title slide
    `<section class="chapter-divider" style="text-align:center;">
      <div style="margin-top:20%;">
        <p style="font-family:var(--font-mono); color:var(--accent-edge); font-size:1rem; letter-spacing:0.14em; text-transform:uppercase;">Chapter 01</p>
        <h1 style="font-size:2.8rem; margin-top:0.6em;">Networks at the Heart of Complex Systems</h1>
        <div style="width:120px; height:1px; background:var(--rule); margin:2rem auto;"></div>
      </div>
    </section>`,

    // 1. Title / hook
    `<section>
      <h2>Networks at the Heart of Complex Systems</h2>
      <div class="two-col">
        <div>
          <p>August 14, 2003: a local fault in Ohio cascaded into a blackout affecting roughly <strong>45 million people</strong> across the US Northeast, and 10 million more in Ontario.</p>
          <p class="caption">Image 1.1 &mdash; satellite view of the Northeast before / after the blackout.</p>
        </div>
        <div class="panel">
          <img src="js/chapters/chapter-01-Introduction/images/1-1-blackout-before.jpg" alt="US Northeast before the 2003 blackout" style="width:100%; border-radius:4px; margin-bottom:0.5rem;">

        </div>
      </div>
    </section>`,

    // 2. Cascading failure mechanism (original diagram)
    `<section>
      <h2>How a Local Fault Becomes a Cascade</h2>
      <div class="two-col">
        <div>
          <p>When a network carries load &mdash; electricity, traffic, money &mdash; a failing node dumps its load onto its neighbors.</p>
          <p>If neighbors can absorb it, nothing happens. If they can't, <em>they</em> fail too &mdash; and the failure keeps propagating.</p>
        </div>
        <svg viewBox="0 0 320 180" width="100%" height="180">
          <line x1="60" y1="90" x2="140" y2="50" stroke="var(--rule)" stroke-width="2"/>
          <line x1="60" y1="90" x2="140" y2="130" stroke="var(--rule)" stroke-width="2"/>
          <line x1="140" y1="50" x2="230" y2="30" stroke="var(--rule)" stroke-width="2"/>
          <line x1="140" y1="50" x2="230" y2="70" stroke="var(--rule)" stroke-width="2"/>
          <line x1="140" y1="130" x2="230" y2="110" stroke="var(--rule)" stroke-width="2"/>
          <line x1="140" y1="130" x2="230" y2="150" stroke="var(--rule)" stroke-width="2"/>
          <circle cx="60" cy="90" r="12" fill="var(--accent-danger)"/>
          <text x="60" y="94" text-anchor="middle" font-family="var(--font-mono)" font-size="10" fill="#12151c">1</text>
          <circle cx="140" cy="50" r="10" fill="var(--accent-hub)"/>
          <circle cx="140" cy="130" r="10" fill="var(--accent-hub)"/>
          <circle cx="230" cy="30" r="7" fill="var(--accent-edge)"/>
          <circle cx="230" cy="70" r="7" fill="var(--accent-edge)"/>
          <circle cx="230" cy="110" r="7" fill="var(--accent-edge)"/>
          <circle cx="230" cy="150" r="7" fill="var(--accent-edge)"/>
          <text x="60" y="115" text-anchor="middle" font-family="var(--font-mono)" font-size="10" fill="var(--accent-danger)">fails first</text>
          <text x="140" y="20" text-anchor="middle" font-family="var(--font-mono)" font-size="10" fill="var(--accent-hub)">absorbs extra load</text>
        </svg>
      </div>
      <p class="caption">Whether a failure stays local or cascades depends on the position and capacity of the nodes it hits &mdash; not on random chance.</p>
    </section>`,

    // 3. Complex systems / networks everywhere
    `<section>
      <h2>A Network Behind Every Complex System</h2>
      <p>A complex system is one whose collective behavior can't be predicted just from knowing its parts. Behind each one sits a network:</p>
      <div class="two-col">
        <ul>
          <li><strong>Cellular network</strong> &mdash; genes, proteins, metabolites</li>
          <li><strong>Neural network</strong> &mdash; neurons in the brain</li>
          <li><strong>Social network</strong> &mdash; friendship, family, professional ties</li>
        </ul>
        <ul>
          <li><strong>Communication network</strong> &mdash; devices, wired & wireless links</li>
          <li><strong>Power grid</strong> &mdash; generators and transmission lines</li>
          <li><strong>Trade network</strong> &mdash; global exchange of goods & services</li>
        </ul>
      </div>
    </section>`,

    // 4. Two forces
    `<section>
      <h2>Two Forces Behind Network Science</h2>
      <div class="two-col">
        <div class="panel">
          <h3 style="font-size:1.1rem; margin-top:0;">Network Maps</h3>
          <p>Cheap digital storage and internet-era data sharing made it possible, for the first time, to actually assemble large-scale maps of real networks (Internet topology, protein interactions, social platforms, brain connectivity).</p>
        </div>
        <div class="panel">
          <h3 style="font-size:1.1rem; margin-top:0;">Universality</h3>
          <p>Wildly different networks &mdash; molecules, web pages, people &mdash; turned out to be shaped by the <em>same</em> organizing principles, meaning one mathematical toolkit applies across all of them.</p>
        </div>
      </div>
      <p class="caption">Together, these two things are why network science became possible only in the 21st century &mdash; not two hundred years earlier.</p>
    </section>`,

    // 5. Methodology / characteristics
    `<section>
      <h2>What Makes It a Science</h2>
      <div class="two-col">
        <div class="panel">
          <strong>Interdisciplinary</strong>
          <p class="caption">tools cross freely between biology, CS, sociology, medicine</p>
        </div>
        <div class="panel">
          <strong>Empirical, data-driven</strong>
          <p class="caption">every tool is tested against real network data</p>
        </div>
        <div class="panel">
          <strong>Quantitative</strong>
          <p class="caption">formalism from graph theory & statistical physics</p>
        </div>
        <div class="panel">
          <strong>Computational</strong>
          <p class="caption">real networks are huge &mdash; needs algorithms, databases, mining</p>
        </div>
      </div>
    </section>`,

    // 6. Real example: hubs in an organization
    `<section>
      <h2>Who's Actually the Hub?</h2>
      <div class="two-col">
        <div>
          <p>A company mapped who its employees actually turn to for advice &mdash; not the official org chart, the <em>real</em> communication network.</p>
          <p>The biggest hub wasn't a director or a manager. It was an ordinary employee handling safety and environmental issues &mdash; someone who visits every location and talks to everyone.</p>
          <p class="caption">Image 1.7 &mdash; Mapping Organizations (Maven 7 case study)</p>
        </div>
        <div class="panel">
          <img src="js/chapters/chapter-01-Introduction/images/1-7-mapping-orgs.jpg" alt="Organizational network map showing hub identification" style="width:100%; border-radius:4px;">
        </div>
      </div>
    </section>`,

    // 7. Summary
    `<section>
      <h2>Networks as an Enabling Platform</h2>
      <div class="two-col">
        <div>
          <p>Like evolutionary theory or quantum mechanics, network science isn't just a subfield &mdash; it's a platform that other fields build on, from drug design to social platforms to epidemic forecasting.</p>
          <p class="caption">Illustrative only &mdash; for the real Google Ngram data, see Image 1.12 in the book.</p>
        </div>
        <svg viewBox="0 0 300 160" width="100%" height="160">
          <line x1="20" y1="140" x2="290" y2="140" stroke="var(--rule)" stroke-width="1"/>
          <path d="M20,130 C80,120 120,60 290,45" fill="none" stroke="var(--accent-edge)" stroke-width="2"/>
          <text x="292" y="45" font-family="var(--font-mono)" font-size="9" fill="var(--accent-edge)">evolution</text>
          <path d="M20,138 C120,135 160,90 290,70" fill="none" stroke="var(--ink-dim)" stroke-width="2"/>
          <text x="292" y="70" font-family="var(--font-mono)" font-size="9" fill="var(--ink-dim)">quantum</text>
          <path d="M20,139 C200,138 230,50 290,15" fill="none" stroke="var(--accent-hub)" stroke-width="2.5"/>
          <text x="292" y="15" font-family="var(--font-mono)" font-size="9" fill="var(--accent-hub)">network</text>
        </svg>
      </div>
    </section>`
  ]
});