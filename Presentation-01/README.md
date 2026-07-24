# Network Science — presentation

## How this is structured

```
index.html                        <- shell: loads libs + chapter scripts in order
css/theme.css                     <- all styling / design tokens (dark + light variants)
js/lib/network-sim.js             <- reusable live network simulation (D3, preferential attachment)
js/lib/theme-toggle.js            <- light/dark toggle button, persisted in localStorage
js/main.js                        <- assembles chapters into reveal.js, boots it
js/chapters/chapter-00-intro.js   <- TEMPLATE chapter — copy this pattern for new chapters
```

## Design

Theme is "Growth & Attachment" — a graph-of-hubs-and-edges palette (`css/theme.css`),
with a warm-amber accent for hubs/emphasis and teal for edges/links. Every color is a
CSS variable under `:root`, with a matching light-mode override under
`:root[data-theme="light"]`, so panels, equation blocks, and simulation containers stay
legible and consistent in both. A toggle button (top-right, 🌙 / ☀️) switches themes and
remembers the choice across visits; it defaults to the visitor's OS preference on first
load.

## Workflow

1. Read a chapter of the book.
2. Tell me what content/points/equations/figures to add for it.
3. I'll add a new `js/chapters/chapter-NN-name.js` file (copy the shape of `chapter-00-intro.js`) and add one `<script>` line for it in `index.html`.
4. I'll tell you what's still missing / what I'd suggest covering next, you review and we iterate.
5. Repeat per chapter — nothing gets touched in other chapter files, so earlier chapters stay stable while later ones are added.

## Adding a new chapter (the pattern)

```js
window.chapters = window.chapters || [];
window.chapters.push({
  id: 'ch01',
  title: 'Chapter name',
  slides: [
    `<section> ... </section>`,   // one string per top-level slide
  ],
  afterRender: function () {      // optional — only needed if the chapter has a live sim
    // init any simulations here
  }
});
```

Then add `<script src="js/chapters/chapter-01-....js"></script>` in `index.html`, right after the previous chapter's line — order of those lines = order of slides.

## Notes
- Equations: wrap in `\\( ... \\)` (inline) or `\\[ ... \\]` (block) — KaTeX renders them automatically.
- No slide-count limit — this can grow to hundreds of slides without restructuring.
- Reordering chapters later = just reordering the `<script>` lines in `index.html`.
