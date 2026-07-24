/* ============================================================
   plot.js — small SVG charting layer for blog posts.

   Written against the data-viz method rather than by taste:

   * Categorical palette is the documented, VALIDATED instance —
     both modes pass the lightness band, chroma floor, adjacent
     CVD separation (worst ΔE 9.1 light / 8.4 dark) and the
     normal-vision floor (19.6 / 19.3). Slots are assigned in
     fixed order and NEVER cycled: a 9th series is not a chart.
   * On the light surface three slots (aqua, yellow, magenta) sit
     below 3:1 contrast. That WARN is not dismissable, so every
     chart here ships its relief channel: a legend whenever there
     are >= 2 series, direct end-labels at <= 4 series, and a
     table view on every chart.
   * Scatter is an ALL-PAIRS form — any two marks can end up
     adjacent — and only the first three slots validate all-pairs.
     Hence SCATTER_CAP: past three, fold to "Other" or facet.
   * One y-axis, always. There is no dual-axis option here on
     purpose; two measures of different scale means two charts.

   Chrome (ink, grid, surface) is read from the site's CSS
   variables, so charts follow the theme toggle automatically.
   ============================================================ */

(function (global) {
  'use strict';

  var PALETTE = {
    light: ['#2a78d6', '#eb6834', '#1baf7a', '#eda100', '#e87ba4', '#008300', '#4a3aa7', '#e34948'],
    dark:  ['#3987e5', '#d95926', '#199e70', '#c98500', '#d55181', '#008300', '#9085e9', '#e66767']
  };

  var SCATTER_CAP = 3;   // all-pairs validated depth
  var MAX_SERIES = 8;    // never cycle past the documented slots

  function theme() {
    return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  }

  function tokens() {
    var s = getComputedStyle(document.documentElement);
    var v = function (n, f) { return (s.getPropertyValue(n) || '').trim() || f; };
    return {
      ink: v('--ink', '#e9e7e0'),
      dim: v('--ink-dim', '#a7adba'),
      faint: v('--ink-faint', '#6d7688'),
      grid: v('--rule-soft', '#212836'),
      axis: v('--rule', '#2b3342'),
      surface: v('--bg-panel', '#1a2029')
    };
  }

  function colorAt(i) { return PALETTE[theme()][i % MAX_SERIES]; }

  /* ---- scales ---------------------------------------------- */

  function makeScale(kind, domain, range) {
    var d0 = domain[0], d1 = domain[1], r0 = range[0], r1 = range[1];
    if (kind === 'log') {
      // Guard against a non-positive lower bound, which log cannot represent.
      if (d0 <= 0) d0 = Math.max(1e-9, d1 * 1e-6);
      var l0 = Math.log10(d0), l1 = Math.log10(d1);
      var f = function (x) {
        if (x <= 0) return NaN;
        return r0 + (Math.log10(x) - l0) / (l1 - l0) * (r1 - r0);
      };
      f.ticks = function () { return logTicks(d0, d1); };
      f.domain = [d0, d1];
      return f;
    }
    var g = function (x) { return r0 + (x - d0) / (d1 - d0) * (r1 - r0); };
    g.ticks = function (n) { return linTicks(d0, d1, n || 6); };
    g.domain = [d0, d1];
    return g;
  }

  function linTicks(a, b, n) {
    var span = b - a;
    if (!(span > 0)) return [a];
    var raw = span / n;
    var mag = Math.pow(10, Math.floor(Math.log10(raw)));
    var norm = raw / mag;
    var step = (norm >= 5 ? 10 : norm >= 2 ? 5 : norm >= 1 ? 2 : 1) * mag;
    var out = [], t = Math.ceil(a / step) * step;
    for (; t <= b + step * 1e-6; t += step) out.push(Math.abs(t) < step * 1e-6 ? 0 : t);
    return out;
  }

  function logTicks(a, b) {
    var out = [];
    for (var e = Math.floor(Math.log10(a)); e <= Math.ceil(Math.log10(b)); e++) {
      var v = Math.pow(10, e);
      if (v >= a * 0.999 && v <= b * 1.001) out.push(v);
    }
    return out.length > 1 ? out : linTicks(a, b, 5);
  }

  function fmt(v, scaleKind) {
    if (v === 0) return '0';
    var abs = Math.abs(v);
    if (scaleKind === 'log' || abs >= 1e4 || abs < 1e-3) {
      var e = Math.round(Math.log10(abs));
      if (Math.abs(abs - Math.pow(10, e)) < Math.pow(10, e) * 0.01) {
        return e === 0 ? '1' : '10' + sup(e);
      }
      return v.toExponential(1);
    }
    if (Number.isInteger(v)) return String(v);
    return String(Math.round(v * 1000) / 1000);
  }

  function sup(n) {
    var map = { '-': '⁻', 0: '⁰', 1: '¹', 2: '²', 3: '³',
                4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
    return String(n).split('').map(function (c) { return map[c] || c; }).join('');
  }

  /* ---- svg helpers ------------------------------------------ */

  var NS = 'http://www.w3.org/2000/svg';

  function el(name, attrs) {
    var n = document.createElementNS(NS, name);
    for (var k in attrs) if (attrs[k] != null) n.setAttribute(k, attrs[k]);
    return n;
  }

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  /* ---- main entry ------------------------------------------- */

  /**
   * Render a chart into `host`.
   * spec = {
   *   type: 'line' | 'scatter' | 'bar',
   *   title, caption,
   *   data: [{ name, points: [[x,y],...] }]   // bar: [[label, value],...]
   *   x: { label, scale: 'linear'|'log', domain: [a,b] },
   *   y: { ...same... },
   *   height: px
   * }
   */
  function chart(host, spec) {
    if (!host) return;
    spec = spec || {};
    var series = (spec.data || []).slice(0, MAX_SERIES);

    if (spec.type === 'scatter' && series.length > SCATTER_CAP) {
      console.warn('[plot] scatter caps at ' + SCATTER_CAP +
        ' series (all-pairs CVD limit); extra series dropped — facet instead.');
      series = series.slice(0, SCATTER_CAP);
    }

    host.classList.add('chart');
    host.innerHTML = '';

    var figure = document.createElement('figure');
    figure.className = 'chart-fig';

    if (spec.title) {
      var h = document.createElement('figcaption');
      h.className = 'chart-title';
      h.textContent = spec.title;
      figure.appendChild(h);
    }

    // Legend is mandatory at >= 2 series: identity must never be colour-alone.
    if (series.length >= 2) {
      var leg = document.createElement('div');
      leg.className = 'chart-legend';
      leg.innerHTML = series.map(function (s, i) {
        return '<span class="lg"><i style="background:' + colorAt(i) + '"></i>' + esc(s.name || ('Series ' + (i + 1))) + '</span>';
      }).join('');
      figure.appendChild(leg);
    }

    var plotBox = document.createElement('div');
    plotBox.className = 'chart-plot';
    figure.appendChild(plotBox);

    if (spec.caption) {
      var cap = document.createElement('p');
      cap.className = 'chart-caption';
      cap.textContent = spec.caption;
      figure.appendChild(cap);
    }

    // Table view — the relief channel for the sub-3:1 light slots,
    // and the accessible fallback generally.
    var tools = document.createElement('div');
    tools.className = 'chart-tools';
    var tBtn = document.createElement('button');
    tBtn.type = 'button';
    tBtn.className = 'chart-tablebtn';
    tBtn.textContent = 'Show data table';
    tools.appendChild(tBtn);
    figure.appendChild(tools);

    var tableWrap = document.createElement('div');
    tableWrap.className = 'chart-table';
    tableWrap.hidden = true;
    tableWrap.innerHTML = buildTable(series, spec);
    figure.appendChild(tableWrap);

    tBtn.addEventListener('click', function () {
      tableWrap.hidden = !tableWrap.hidden;
      tBtn.textContent = tableWrap.hidden ? 'Show data table' : 'Hide data table';
    });

    host.appendChild(figure);

    var draw = function () { drawInto(plotBox, series, spec); };
    draw();

    if ('ResizeObserver' in global) {
      var ro = new ResizeObserver(function () { draw(); });
      ro.observe(plotBox);
    } else {
      global.addEventListener('resize', draw);
    }
    global.addEventListener('themechange', function () {
      draw();
      var swatches = figure.querySelectorAll('.chart-legend i');
      for (var i = 0; i < swatches.length; i++) swatches[i].style.background = colorAt(i);
    });
  }

  function buildTable(series, spec) {
    if (spec.type === 'bar') {
      var rows = (series[0] && series[0].points) || [];
      return '<table><thead><tr><th>' + esc((spec.x && spec.x.label) || 'Category') +
        '</th><th>' + esc((spec.y && spec.y.label) || 'Value') + '</th></tr></thead><tbody>' +
        rows.map(function (r) {
          return '<tr><td>' + esc(r[0]) + '</td><td>' + esc(r[1]) + '</td></tr>';
        }).join('') + '</tbody></table>';
    }
    // Long format keeps the table honest when series don't share x values.
    var body = '';
    series.forEach(function (s, i) {
      (s.points || []).forEach(function (p) {
        body += '<tr><td>' + esc(s.name || ('Series ' + (i + 1))) + '</td><td>' +
          esc(fmt(p[0])) + '</td><td>' + esc(fmt(p[1])) + '</td></tr>';
      });
    });
    return '<table><thead><tr><th>Series</th><th>' +
      esc((spec.x && spec.x.label) || 'x') + '</th><th>' +
      esc((spec.y && spec.y.label) || 'y') + '</th></tr></thead><tbody>' + body + '</tbody></table>';
  }

  function drawInto(box, series, spec) {
    var t = tokens();
    var W = box.clientWidth || 640;
    var H = spec.height || 320;
    var isBar = spec.type === 'bar';
    var isScatter = spec.type === 'scatter';

    // Room on the right for direct end-labels (<= 4 series).
    var labelRoom = (!isBar && series.length >= 2 && series.length <= 4) ? 74 : 14;
    var m = { t: 12, r: labelRoom, b: 44, l: 56 };
    var iw = Math.max(40, W - m.l - m.r);
    var ih = Math.max(40, H - m.t - m.b);

    box.innerHTML = '';
    var svg = el('svg', {
      viewBox: '0 0 ' + W + ' ' + H,
      width: '100%', height: H,
      role: 'img',
      'aria-label': spec.title || 'chart'
    });

    var g = el('g', { transform: 'translate(' + m.l + ',' + m.t + ')' });
    svg.appendChild(g);

    var xs, ys, xKind = (spec.x && spec.x.scale) || 'linear', yKind = (spec.y && spec.y.scale) || 'linear';
    var cats = null;

    if (isBar) {
      cats = (series[0] && series[0].points) || [];
      var maxV = Math.max.apply(null, cats.map(function (r) { return r[1]; }).concat([0]));
      ys = makeScale('linear', (spec.y && spec.y.domain) || [0, maxV * 1.08 || 1], [ih, 0]);
    } else {
      var allX = [], allY = [];
      series.forEach(function (s) {
        (s.points || []).forEach(function (p) {
          if (isFinite(p[0])) allX.push(p[0]);
          if (isFinite(p[1])) allY.push(p[1]);
        });
      });
      if (!allX.length) { allX = [0, 1]; allY = [0, 1]; }
      var xd = (spec.x && spec.x.domain) || [Math.min.apply(null, allX), Math.max.apply(null, allX)];
      var yd = (spec.y && spec.y.domain) || [Math.min.apply(null, allY), Math.max.apply(null, allY)];
      if (yKind !== 'log' && !(spec.y && spec.y.domain)) {
        var pad = (yd[1] - yd[0]) * 0.08 || 1;
        yd = [yd[0] - pad, yd[1] + pad];
      }
      if (xd[0] === xd[1]) xd = [xd[0] - 1, xd[1] + 1];
      if (yd[0] === yd[1]) yd = [yd[0] - 1, yd[1] + 1];
      xs = makeScale(xKind, xd, [0, iw]);
      ys = makeScale(yKind, yd, [ih, 0]);
    }

    /* ---- recessive grid + axes ---- */
    var yTicks = ys.ticks(6);
    yTicks.forEach(function (v) {
      var y = ys(v);
      if (!isFinite(y)) return;
      g.appendChild(el('line', { x1: 0, y1: y, x2: iw, y2: y, stroke: t.grid, 'stroke-width': 1 }));
      var lb = el('text', { x: -10, y: y + 4, 'text-anchor': 'end', fill: t.faint,
        'font-size': 11, 'font-family': 'var(--font-mono)', 'font-variant-numeric': 'tabular-nums' });
      lb.textContent = fmt(v, yKind);
      g.appendChild(lb);
    });

    if (isBar) {
      var bw = iw / Math.max(1, cats.length);
      cats.forEach(function (r, i) {
        var lb = el('text', { x: i * bw + bw / 2, y: ih + 20, 'text-anchor': 'middle',
          fill: t.faint, 'font-size': 11, 'font-family': 'var(--font-mono)' });
        lb.textContent = r[0];
        g.appendChild(lb);
      });
    } else {
      xs.ticks(6).forEach(function (v) {
        var x = xs(v);
        if (!isFinite(x)) return;
        g.appendChild(el('line', { x1: x, y1: 0, x2: x, y2: ih, stroke: t.grid, 'stroke-width': 1 }));
        var lb = el('text', { x: x, y: ih + 20, 'text-anchor': 'middle', fill: t.faint,
          'font-size': 11, 'font-family': 'var(--font-mono)', 'font-variant-numeric': 'tabular-nums' });
        lb.textContent = fmt(v, xKind);
        g.appendChild(lb);
      });
    }

    // baseline
    g.appendChild(el('line', { x1: 0, y1: ih, x2: iw, y2: ih, stroke: t.axis, 'stroke-width': 1 }));

    if (spec.x && spec.x.label) {
      var xl = el('text', { x: iw / 2, y: ih + 40, 'text-anchor': 'middle', fill: t.dim, 'font-size': 12 });
      xl.textContent = spec.x.label;
      g.appendChild(xl);
    }
    if (spec.y && spec.y.label) {
      var yl = el('text', { transform: 'rotate(-90)', x: -ih / 2, y: -42,
        'text-anchor': 'middle', fill: t.dim, 'font-size': 12 });
      yl.textContent = spec.y.label;
      g.appendChild(yl);
    }

    /* ---- marks ---- */
    if (isBar) {
      var bw2 = iw / Math.max(1, cats.length);
      var gap = Math.min(10, bw2 * 0.25);
      cats.forEach(function (r, i) {
        var y = ys(r[1]);
        // 4px rounded data-end, anchored to the baseline (square bottom corners).
        var x = i * bw2 + gap / 2, wdt = bw2 - gap, hgt = Math.max(1, ih - y), rad = Math.min(4, wdt / 2);
        var d = 'M' + x + ',' + ih + 'V' + (y + rad) +
                'a' + rad + ',' + rad + ' 0 0 1 ' + rad + ',' + (-rad) +
                'h' + (wdt - 2 * rad) +
                'a' + rad + ',' + rad + ' 0 0 1 ' + rad + ',' + rad +
                'V' + ih + 'Z';
        var path = el('path', { d: d, fill: colorAt(0) });
        path.appendChild(el('title')).textContent = r[0] + ': ' + r[1];
        g.appendChild(path);
        var vlab = el('text', { x: x + wdt / 2, y: y - 7, 'text-anchor': 'middle',
          fill: t.dim, 'font-size': 11, 'font-variant-numeric': 'tabular-nums' });
        vlab.textContent = fmt(r[1]);
        g.appendChild(vlab);
      });
    } else {
      series.forEach(function (s, i) {
        var col = colorAt(i);
        var pts = (s.points || []).filter(function (p) {
          return isFinite(xs(p[0])) && isFinite(ys(p[1]));
        });
        if (!pts.length) return;

        if (isScatter) {
          pts.forEach(function (p) {
            // 2px surface ring so overlapping marks stay separable.
            var c = el('circle', { cx: xs(p[0]), cy: ys(p[1]), r: 4.5, fill: col,
              stroke: t.surface, 'stroke-width': 2 });
            c.appendChild(el('title')).textContent =
              (s.name || '') + ' (' + fmt(p[0]) + ', ' + fmt(p[1]) + ')';
            g.appendChild(c);
          });
        } else {
          var d = pts.map(function (p, k) {
            return (k ? 'L' : 'M') + xs(p[0]).toFixed(2) + ',' + ys(p[1]).toFixed(2);
          }).join('');
          g.appendChild(el('path', { d: d, fill: 'none', stroke: col, 'stroke-width': 2,
            'stroke-linejoin': 'round', 'stroke-linecap': 'round' }));
        }

        // Direct end-label at <= 4 series: identity without a colour lookup.
        if (!isScatter && series.length >= 2 && series.length <= 4) {
          var last = pts[pts.length - 1];
          var lab = el('text', { x: xs(last[0]) + 8, y: ys(last[1]) + 4, fill: col,
            'font-size': 11, 'font-family': 'var(--font-mono)' });
          lab.textContent = s.name || ('S' + (i + 1));
          g.appendChild(lab);
        }
      });
    }

    box.appendChild(svg);

    if (!isBar && !isScatter && series.length) hoverLayer(box, svg, g, series, xs, ys, iw, ih, m, t, spec);
  }

  /* ---- crosshair + tooltip for line charts ------------------ */

  function hoverLayer(box, svg, g, series, xs, ys, iw, ih, m, t, spec) {
    var tip = document.createElement('div');
    tip.className = 'chart-tip';
    tip.hidden = true;
    box.appendChild(tip);

    var rule = el('line', { y1: 0, y2: ih, stroke: t.axis, 'stroke-width': 1, 'stroke-dasharray': '3 3' });
    rule.setAttribute('visibility', 'hidden');
    g.appendChild(rule);

    var dots = series.map(function (_, i) {
      var c = el('circle', { r: 4.5, fill: colorAt(i), stroke: t.surface, 'stroke-width': 2, visibility: 'hidden' });
      g.appendChild(c);
      return c;
    });

    // Hit target spans the whole plot area, not just the marks.
    var hit = el('rect', { x: 0, y: 0, width: iw, height: ih, fill: 'transparent' });
    g.appendChild(hit);

    function nearest(pts, xv) {
      var best = null, bd = Infinity;
      for (var i = 0; i < pts.length; i++) {
        var d = Math.abs(pts[i][0] - xv);
        if (d < bd) { bd = d; best = pts[i]; }
      }
      return best;
    }

    function invert(px) {
      var d = xs.domain;
      var frac = px / iw;
      return (spec.x && spec.x.scale === 'log')
        ? Math.pow(10, Math.log10(d[0]) + frac * (Math.log10(d[1]) - Math.log10(d[0])))
        : d[0] + frac * (d[1] - d[0]);
    }

    function move(ev) {
      var r = svg.getBoundingClientRect();
      var scale = iw / (r.width - m.l - m.r || 1);
      var px = (ev.clientX - r.left - m.l * (r.width / (iw + m.l + m.r))) * scale;
      px = Math.max(0, Math.min(iw, px));
      var xv = invert(px);

      var rows = [];
      series.forEach(function (s, i) {
        var p = nearest(s.points || [], xv);
        if (!p) { dots[i].setAttribute('visibility', 'hidden'); return; }
        var cx = xs(p[0]), cy = ys(p[1]);
        if (!isFinite(cx) || !isFinite(cy)) { dots[i].setAttribute('visibility', 'hidden'); return; }
        dots[i].setAttribute('cx', cx);
        dots[i].setAttribute('cy', cy);
        dots[i].setAttribute('visibility', 'visible');
        rows.push({ i: i, name: s.name || ('Series ' + (i + 1)), x: p[0], y: p[1] });
      });
      if (!rows.length) return;

      var anchor = xs(rows[0].x);
      rule.setAttribute('x1', anchor);
      rule.setAttribute('x2', anchor);
      rule.setAttribute('visibility', 'visible');

      tip.hidden = false;
      tip.innerHTML =
        '<div class="tip-x">' + esc((spec.x && spec.x.label ? spec.x.label + ' ' : '') + fmt(rows[0].x)) + '</div>' +
        rows.map(function (r) {
          return '<div class="tip-row"><i style="background:' + colorAt(r.i) + '"></i>' +
                 '<span>' + esc(r.name) + '</span><b>' + esc(fmt(r.y)) + '</b></div>';
        }).join('');

      var left = m.l + anchor + 14;
      if (left + tip.offsetWidth > box.clientWidth) left = m.l + anchor - tip.offsetWidth - 14;
      tip.style.left = Math.max(4, left) + 'px';
      tip.style.top = m.t + 8 + 'px';
    }

    function leave() {
      tip.hidden = true;
      rule.setAttribute('visibility', 'hidden');
      dots.forEach(function (d) { d.setAttribute('visibility', 'hidden'); });
    }

    svg.addEventListener('mousemove', move);
    svg.addEventListener('mouseleave', leave);
    svg.addEventListener('touchmove', function (e) {
      if (e.touches[0]) move(e.touches[0]);
    }, { passive: true });
    svg.addEventListener('touchend', leave);
  }

  /* ---- convenience: plot y = f(x) --------------------------- */

  function fn(host, spec) {
    var dom = spec.domain || [0, 10];
    var n = spec.samples || 220;
    var logX = spec.x && spec.x.scale === 'log';
    var data = (spec.fns || []).map(function (f) {
      var pts = [];
      for (var i = 0; i <= n; i++) {
        var x = logX
          ? Math.pow(10, Math.log10(dom[0]) + (i / n) * (Math.log10(dom[1]) - Math.log10(dom[0])))
          : dom[0] + (i / n) * (dom[1] - dom[0]);
        var y = f.f(x);
        if (isFinite(y)) pts.push([x, y]);
      }
      return { name: f.name, points: pts };
    });
    chart(host, Object.assign({}, spec, { type: 'line', data: data }));
  }

  global.Plot = { chart: chart, fn: fn, color: colorAt, PALETTE: PALETTE, SCATTER_CAP: SCATTER_CAP };
})(window);
