/* ============================================================
   post.js — renders one blog post from its post.md.

   Pipeline, in this order for a reason:
     1. lift fenced code blocks out (so $ inside code is safe, and
        so ```chart fences can become charts instead of code)
     2. lift $$…$$ / $…$ math out (so Markdown can't eat \_, \\, *)
     3. run Markdown over what's left
     4. put math back verbatim, then let KaTeX render it
     5. put code blocks back, as <pre><code> or a mounted chart
     6. mount <div class="sim"> blocks from the post's sim.js

   Steps 1–2 are the whole reason math and code survive Markdown
   intact; rendering KaTeX first would let Markdown mangle the
   output, and rendering it last without protection lets Markdown
   mangle the source.
   ============================================================ */

(function (global) {
  'use strict';

  var Blog = global.Blog = global.Blog || {};
  var sims = {};

  /** Posts call this from their own sim.js to register an interactive block. */
  Blog.sim = function (name, fn) { sims[name] = fn; };

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function slugFromPath() {
    var parts = location.pathname.split('/').filter(Boolean);
    return parts[parts.length - 1] || '';
  }

  function fmtDate(iso) {
    var d = new Date(iso + 'T00:00:00');
    return isNaN(d) ? iso : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  function loadScript(src) {
    return new Promise(function (res, rej) {
      var s = document.createElement('script');
      s.src = src;
      s.onload = res;
      s.onerror = function () { rej(new Error('failed to load ' + src)); };
      document.head.appendChild(s);
    });
  }

  /* ---- step 1 & 2: protect fences and math ------------------ */

  function protect(md) {
    var blocks = [], maths = [];

    // Fenced code first — anything inside is off limits to later passes.
    md = md.replace(/```([\w-]*)\n([\s\S]*?)```/g, function (_, lang, code) {
      blocks.push({ lang: (lang || '').trim(), code: code });
      return '\n\nXFENCEX' + (blocks.length - 1) + 'X\n\n';
    });

    // Display math before inline, so $$ isn't chewed up as two $.
    md = md.replace(/\$\$([\s\S]+?)\$\$/g, function (_, tex) {
      maths.push({ tex: tex, display: true });
      return 'XMATHX' + (maths.length - 1) + 'X';
    });

    // Inline $…$ — must not span a blank line, and not match a bare
    // currency amount like "$5 and $10".
    md = md.replace(/\$([^\$\n]+?)\$/g, function (whole, tex) {
      if (/^\s|\s$/.test(tex) && !/[\\^_{}]/.test(tex)) return whole;
      maths.push({ tex: tex, display: false });
      return 'XMATHX' + (maths.length - 1) + 'X';
    });

    return { md: md, blocks: blocks, maths: maths };
  }

  function restoreMath(html, maths) {
    return html.replace(/XMATHX(\d+)X/g, function (_, i) {
      var m = maths[+i];
      if (!m) return '';
      // Hand raw TeX to KaTeX's auto-render in step 4.
      return m.display ? '$$' + m.tex + '$$' : '$' + m.tex + '$';
    });
  }

  /* ---- render ------------------------------------------------ */

  function render(article, md) {
    var p = protect(md);
    var html = global.marked.parse(p.md, { mangle: false, headerIds: false });
    html = restoreMath(html, p.maths);
    article.innerHTML = html;

    // step 5 — swap fence placeholders for real nodes
    var walker = document.createTreeWalker(article, NodeFilter.SHOW_TEXT);
    var hits = [], node;
    while ((node = walker.nextNode())) {
      if (/XFENCEX\d+X/.test(node.nodeValue)) hits.push(node);
    }

    hits.forEach(function (textNode) {
      var m = textNode.nodeValue.match(/XFENCEX(\d+)X/);
      if (!m) return;
      var blk = p.blocks[+m[1]];
      var host = textNode.parentNode;
      // the placeholder sits alone in its own <p>
      var target = (host.tagName === 'P' && host.textContent.trim() === m[0]) ? host : textNode;
      var replacement;

      if (blk.lang === 'chart') {
        replacement = document.createElement('div');
        try {
          var spec = JSON.parse(blk.code);
          global.Plot.chart(replacement, spec);
        } catch (err) {
          replacement.className = 'note warn';
          replacement.innerHTML = '<span class="note-label">Chart error</span><p>' + esc(err.message) + '</p>';
        }
      } else {
        replacement = document.createElement('pre');
        var codeEl = document.createElement('code');
        if (blk.lang) codeEl.className = 'language-' + blk.lang;
        codeEl.textContent = blk.code.replace(/\n$/, '');
        replacement.appendChild(codeEl);
      }

      target.parentNode.replaceChild(replacement, target);
    });

    // wide tables scroll in their own box, never the page
    article.querySelectorAll('table').forEach(function (t) {
      if (t.closest('.chart-table')) return;
      var box = document.createElement('div');
      box.className = 'scroll-x';
      t.parentNode.insertBefore(box, t);
      box.appendChild(t);
    });

    // step 4 — KaTeX
    if (global.renderMathInElement) {
      global.renderMathInElement(article, {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '$', right: '$', display: false },
          { left: '\\[', right: '\\]', display: true },
          { left: '\\(', right: '\\)', display: false }
        ],
        throwOnError: false,
        strict: false
      });
    }
  }

  /* ---- table of contents ------------------------------------ */

  function buildToc(article, toc) {
    var heads = article.querySelectorAll('h2, h3');
    if (heads.length < 2) { toc.style.display = 'none'; return; }

    var used = {};
    var links = [];
    var html = '<h4>Contents</h4>';

    heads.forEach(function (h) {
      var id = h.textContent.toLowerCase().replace(/[^\w]+/g, '-').replace(/^-|-$/g, '');
      if (used[id]) id += '-' + (++used[id]); else used[id] = 1;
      h.id = id;
      html += '<a href="#' + id + '" class="lvl-' + h.tagName[1] + '">' + esc(h.textContent) + '</a>';
    });

    toc.innerHTML = html;
    links = Array.prototype.slice.call(toc.querySelectorAll('a'));

    if (!('IntersectionObserver' in global)) return;
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (a) {
          a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id);
        });
      });
    }, { rootMargin: '-15% 0px -70% 0px' });
    heads.forEach(function (h) { obs.observe(h); });
  }

  /* ---- reading progress -------------------------------------- */

  function initProgress(article) {
    var bar = document.querySelector('.progress');
    if (!bar) return;
    function update() {
      var box = article.getBoundingClientRect();
      var total = box.height - global.innerHeight;
      var done = total > 0 ? Math.min(1, Math.max(0, -box.top / total)) : (box.top <= 0 ? 1 : 0);
      bar.style.width = (done * 100).toFixed(1) + '%';
    }
    update();
    global.addEventListener('scroll', update, { passive: true });
    global.addEventListener('resize', update);
  }

  /* ---- sims --------------------------------------------------- */

  function mountSims(article) {
    article.querySelectorAll('.sim[data-sim]').forEach(function (host) {
      var name = host.getAttribute('data-sim');
      var fn = sims[name];
      if (!fn) {
        host.innerHTML = '<div class="note warn"><span class="note-label">Missing simulation</span>' +
          '<p>No simulation registered as <code>' + esc(name) + '</code>. ' +
          'Add <code>Blog.sim(\'' + esc(name) + '\', fn)</code> to this post\'s <code>sim.js</code>, ' +
          'and set <code>"sim": true</code> on its entry in <code>blog/posts.js</code>.</p></div>';
        return;
      }
      try {
        fn(host);
      } catch (err) {
        console.error('[blog] sim "' + name + '" threw', err);
        host.innerHTML = '<div class="note warn"><span class="note-label">Simulation error</span><p>' +
          esc(err.message) + '</p></div>';
      }
    });
  }

  /* ---- boot ---------------------------------------------------- */

  function fail(msg) {
    var article = document.querySelector('.article');
    if (article) {
      article.innerHTML = '<div class="note warn"><span class="note-label">Could not load post</span><p>' +
        esc(msg) + '</p><p>If you are opening this file straight from disk, run a local server instead ' +
        '(<code>python -m http.server</code>) — <code>fetch()</code> is blocked on <code>file://</code>.</p></div>';
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    var article = document.querySelector('.article');
    var slug = slugFromPath();
    var posts = (global.POSTS || []).slice().sort(function (a, b) { return b.date.localeCompare(a.date); });
    var idx = posts.findIndex(function (p) { return p.slug === slug; });
    var meta = idx >= 0 ? posts[idx] : null;

    var h1 = document.querySelector('.post-head h1');

    if (!meta && h1) {
      // Unregistered folder (e.g. _template, or a draft not yet in posts.js).
      h1.textContent = 'Draft';
    }

    if (meta) {
      document.title = meta.title + ' — Mosharaf Hossain Apurbo';
      if (h1) h1.textContent = meta.title;
      var mEl = document.querySelector('.post-meta');
      if (mEl) {
        mEl.innerHTML = '<span>' + esc(fmtDate(meta.date)) + '</span>' +
          (meta.readingTime ? '<span>' + esc(meta.readingTime) + '</span>' : '') +
          (meta.tags || []).map(function (t) { return '<span class="chip">' + esc(t) + '</span>'; }).join('');
      }

      // newer = earlier in the sorted list
      var nav = document.querySelector('.post-nav');
      if (nav) {
        var newer = posts[idx - 1], older = posts[idx + 1];
        nav.innerHTML =
          (newer ? '<a href="../' + esc(newer.slug) + '/"><span class="lbl">&larr; Newer</span>' + esc(newer.title) + '</a>' : '<span></span>') +
          (older ? '<a href="../' + esc(older.slug) + '/" style="text-align:right"><span class="lbl">Older &rarr;</span>' + esc(older.title) + '</a>' : '<span></span>');
      }
    }

    fetch('post.md', { cache: 'no-cache' })
      .then(function (r) {
        if (!r.ok) throw new Error('post.md returned HTTP ' + r.status);
        return r.text();
      })
      .then(function (md) {
        render(article, md);
        buildToc(article, document.querySelector('.toc'));
        initProgress(article);
        // sim.js is loaded only when the manifest says the post has one,
        // so ordinary posts never take a 404 on every view.
        if (meta && meta.sim) {
          return loadScript('sim.js').then(function () { mountSims(article); });
        }
        mountSims(article);
      })
      .catch(function (err) { fail(err.message); });
  });
})(window);
