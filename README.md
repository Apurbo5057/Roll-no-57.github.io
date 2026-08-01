# Roll-no-57.github.io

Portfolio and writing. Live at **https://roll-no-57.github.io/**

Everything is static — no build step, no dependencies to install. GitHub Pages serves
the repository root as-is, and every page is plain HTML/CSS/JS.

## Layout

```
index.html              <- portfolio / CV
favicon.svg
assets/
  site.css              <- the design system: all tokens live here
  site.js               <- theme toggle, nav state, hero graph, scroll reveal
  apurbo.jpg            <- hero portrait

blog/
  index.html            <- post listing
  posts.js              <- THE MANIFEST — a post is not published until it is here
  lib/
    blog.css            <- reading layout, chart & simulation chrome
    post.js             <- markdown + KaTeX renderer, chart/sim mounting
    plot.js             <- charting layer
  _template/            <- copy this folder to start a post
  why-hubs-happen/      <- a post: index.html + post.md + sim.js
```

The theme toggle writes one `localStorage` key (`ns-theme`) that the portfolio and the
blog both read, so a visitor's light/dark choice follows them across the site.

## Writing a post

```
cp -r blog/_template blog/my-post-slug
```

1. Write `blog/my-post-slug/post.md` — plain Markdown.
2. Add an entry to the **top** of the array in `blog/posts.js`. Nothing appears on the
   blog index or the homepage until this exists.
3. Commit and push. Pages redeploys in about a minute.

`blog/_template/post.md` is a live cheat-sheet for everything below — open
`/blog/_template/` in a browser to see it rendered.

### Maths

Inline between single dollars (`$\langle k \rangle$`), display between double dollars.
KaTeX renders it. Markdown can't mangle it: `lib/post.js` lifts every maths span and code
fence out of the source *before* Markdown runs and puts them back afterwards.

### Charts

A fenced block tagged `chart` becomes a real chart. The body is JSON:

````
```chart
{
  "type": "line",
  "title": "Poisson vs power law",
  "x": { "label": "degree k", "scale": "log" },
  "y": { "label": "p(k)", "scale": "log" },
  "data": [
    { "name": "power law", "points": [[1,0.75],[10,0.0024],[100,7.5e-6]] },
    { "name": "Poisson",   "points": [[1,0.15],[10,0.0008],[20,7.1e-11]] }
  ]
}
```
````

`type` is `line`, `scatter` or `bar`; either axis takes `"scale": "log"`. Every chart gets
a legend, direct end-labels and a data-table toggle automatically — that is the
accessibility contract in `lib/plot.js`, not a per-chart option. Line charts also get a
crosshair tooltip.

The categorical palette in `lib/plot.js` is validated (colourblind separation, contrast,
lightness band) in both light and dark mode. **Don't hand-pick series colours** — slots are
assigned in a fixed order and never cycled. Scatter caps at 3 series by design; past that,
facet into two charts.

### Simulations

Put an empty div where it should appear:

```html
<div class="sim" data-sim="my-sim"></div>
```

register it in that post's `sim.js`:

```js
Blog.sim('my-sim', function (host) { /* build into host */ });
```

and set `"sim": true` on the post's entry in `blog/posts.js` — that flag is what tells the
page to load `sim.js` at all. `blog/why-hubs-happen/sim.js` is a full worked example
(D3 force layout, live histogram, controls, pauses when off-screen).

Simulations and charts should redraw on the `themechange` window event so they follow the
theme toggle.

## Local preview

`fetch()` is blocked on `file://`, so posts will not load if you open the HTML directly.
Use a server:

```
python -m http.server 8000
```

## Resources

The **Resources** section at the bottom of `index.html` is a single `<a class="resource-card">`
pointing at a Google Drive folder. To change where it goes, edit that one `href`.
