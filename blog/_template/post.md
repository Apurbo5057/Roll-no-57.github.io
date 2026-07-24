Open with a paragraph that earns the next one. No heading above it — the title
already came from `posts.js`.

## A heading

Ordinary Markdown works: **bold**, *italic*, `inline code`, [links](https://example.com),
lists, tables, blockquotes.

Inline maths sits between single dollars, like $\langle k \rangle = 2L/N$, and display
maths between double dollars:

$$
p_k = \binom{N-1}{k} p^k (1-p)^{N-1-k}
$$

## A chart

A fenced block tagged `chart` becomes a real chart. The body is JSON — see
`blog/lib/plot.js` for the full spec.

```chart
{
  "type": "line",
  "title": "Two series",
  "x": { "label": "x" },
  "y": { "label": "y" },
  "height": 300,
  "data": [
    { "name": "linear",    "points": [[0,0],[1,1],[2,2],[3,3],[4,4]] },
    { "name": "quadratic", "points": [[0,0],[1,1],[2,4],[3,9],[4,16]] }
  ]
}
```

`type` is `line`, `scatter` or `bar`. Either axis takes `"scale": "log"` for
log–log plots. Every chart ships a legend, direct labels and a data table
automatically — that is the accessibility contract, not an option.

## A simulation

Drop an empty div where the simulation should appear:

<div class="sim" data-sim="demo"></div>

then register it in this folder's `sim.js`:

```js
Blog.sim('demo', function (host) {
  host.innerHTML = '<div class="sim-head"><span class="sim-title">Title</span></div>';
  // build canvas / SVG / controls into `host`
});
```

and set `"sim": true` on this post's entry in `blog/posts.js`, so the page knows
to load `sim.js` at all.

<div class="note">
<span class="note-label">Note</span>
<p>Raw HTML works too — this callout is just a div. Use <code>note warn</code> for the amber variant.</p>
</div>

## Wrapping up

Close it out. Then add the entry to `blog/posts.js` and push.
