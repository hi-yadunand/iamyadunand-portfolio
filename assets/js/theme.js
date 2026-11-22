(() => {
  const key = 'portfolio-theme';
  const root = document.documentElement;
  const system = window.matchMedia('(prefers-color-scheme: dark)');
  let preference = null;
  let toggle;

  function readPreference() {
    try {
      const value = localStorage.getItem(key);
      preference = value === 'light' || value === 'dark' ? value : null;
    } catch {
      // The current page can still toggle themes when storage is blocked.
    }
  }

  function applyTheme() {
    const theme = preference ?? (system.matches ? 'dark' : 'light');
    root.dataset.theme = theme;
    if (toggle) {
      toggle.setAttribute('aria-pressed', String(theme === 'dark'));
      toggle.title = theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme';
    }
  }

  readPreference();
  applyTheme();

  document.addEventListener('DOMContentLoaded', () => {
    toggle = document.querySelector('[data-theme-toggle]');
    if (!toggle) return;
    applyTheme();
    toggle.addEventListener('click', () => {
      preference = root.dataset.theme === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem(key, preference);
      } catch {}
      applyTheme();
    });
    toggle.hidden = false;
  }, { once: true });

  system.addEventListener('change', applyTheme);
  window.addEventListener('storage', event => {
    if (event.key !== key && event.key !== null) return;
    readPreference();
    applyTheme();
  });
  window.addEventListener('pageshow', event => {
    if (!event.persisted) return;
    readPreference();
    applyTheme();
  });
})();
