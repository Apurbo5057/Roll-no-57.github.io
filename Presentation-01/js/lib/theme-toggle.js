/* ============================================================
   Light/dark theme toggle. Applies data-theme="light"|"dark"
   on <html>, persists the choice in localStorage, and defaults
   to the visitor's OS preference on first load.
   ============================================================ */

(function () {
  const STORAGE_KEY = 'ns-theme';
  const root = document.documentElement;

  function getStored() {
    try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
  }

  function preferredTheme() {
    const stored = getStored();
    if (stored === 'light' || stored === 'dark') return stored;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches
      ? 'light' : 'dark';
  }

  function apply(theme) {
    root.setAttribute('data-theme', theme);
    const btn = document.getElementById('theme-toggle-btn');
    if (btn) btn.textContent = theme === 'light' ? '\u{1F319}' : '\u{2600}\u{FE0F}';
    try { localStorage.setItem(STORAGE_KEY, theme); } catch (e) {}
  }

  apply(preferredTheme());

  document.addEventListener('DOMContentLoaded', function () {
    const btn = document.createElement('button');
    btn.id = 'theme-toggle-btn';
    btn.className = 'theme-toggle';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Toggle light / dark theme');
    btn.textContent = root.getAttribute('data-theme') === 'light' ? '\u{1F319}' : '\u{2600}\u{FE0F}';
    btn.addEventListener('click', function () {
      apply(root.getAttribute('data-theme') === 'light' ? 'dark' : 'light');
    });
    document.body.appendChild(btn);
  });
})();
