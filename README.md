# Roll-no-57.github.io

Portfolio of browser-based presentations. Live at **https://roll-no-57.github.io/**

Everything here is static — no build step, no dependencies to install. GitHub Pages
serves the repository root as-is.

## Layout

```
index.html            <- portfolio hub: one card per presentation
assets/hub.css        <- hub styling (shares the palette with the decks)
assets/hub.js         <- theme toggle + hero network animation
.nojekyll             <- serve files verbatim, skip Jekyll processing

Presentation-01/      <- Network Science (Barabási) — reveal.js deck
  index.html
  css/ js/ Chapters/
```

## Adding a presentation

1. Drop the new deck's folder next to `index.html` (e.g. `Presentation-02/`), with its
   own `index.html` inside. Use **relative** paths inside the deck — it is served from a
   sub-path, so a leading `/` would break.
2. Copy one `<a class="deck">` block in `index.html` (see the `DECK REGISTRY` comment),
   point `href` at the folder, update the text, and bump the `count` in the section head.
3. Commit and push to `main` — Pages redeploys within a minute or so.

## Local preview

Opening `index.html` straight off disk works, but a local server matches production
more closely:

```
python -m http.server 8000
# then visit http://localhost:8000/
```

## Note on figures

The Network Science deck hot-links book figures from `networksciencebook.com`. They
render online as long as that site keeps serving them; if any go missing, download the
affected images into the chapter's `images/` folder and switch the `src` to the local
relative path.
