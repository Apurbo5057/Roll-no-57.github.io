/* ============================================================
   Assembles window.chapters (populated by each chapter/*.js
   file, in the order those <script> tags appear in index.html)
   into the reveal.js slide container, then boots Reveal.
   ============================================================ */

(function () {
  const container = document.getElementById('slides');
  const afterRenderFns = [];

  window.chapters.forEach(chapter => {
    chapter.slides.forEach(html => {
      container.insertAdjacentHTML('beforeend', html);
    });
    if (typeof chapter.afterRender === 'function') {
      afterRenderFns.push(chapter.afterRender);
    }
  });

  Reveal.initialize({
    hash: true,
    width: 1280,
    height: 720,
    margin: 0.06,
    controls: true,
    progress: true,
    center: false,
    transition: 'fade',
    slideNumber: true,
    showSlideNumber: 'all',
    plugins: [RevealMath.KaTeX]
  }).then(() => {
    // Run each chapter's simulation-init hook once, and again
    // whenever reveal lands on a slide (so canvases/SVGs that
    // were 0-width while hidden get sized correctly).
    afterRenderFns.forEach(fn => fn());
    Reveal.on('slidechanged', () => afterRenderFns.forEach(fn => fn()));
  });
})();
