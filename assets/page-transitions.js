// Run in the head: pagereveal can happen before deferred page modules execute.
(() => {
  const root = document.documentElement;
  if (!('onpageswap' in window) || !('onpagereveal' in window)) return;
  root.setAttribute('data-native-page-transitions', '');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');

  // Explicit exceptions and current-page reloads keep their starter loader.
  document.addEventListener('click', event => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey ||
        event.ctrlKey || event.altKey || event.shiftKey) return;
    const link = event.target?.closest?.('a[href]');
    if (!link || link.hasAttribute('download') ||
        (link.target && link.target.toLowerCase() !== '_self')) return;
    let url;
    try { url = new URL(link.href, location.href); } catch { return; }
    if (url.origin !== location.origin) return;
    root.removeAttribute('data-skip-page-transition');
    if (link.closest('[data-native-navigation]') || link.closest('[data-no-transition]') ||
        link.hasAttribute('data-no-transition') ||
        link.relList?.contains('external') ||
        (url.pathname === location.pathname && !url.hash &&
          (!url.search || url.search === location.search) &&
          !link.getAttribute('href').startsWith('#')) ||
        (url.pathname === '/' && !url.search && !url.hash &&
          !link.getAttribute('href').startsWith('#'))) {
      root.setAttribute('data-skip-page-transition', '');
    }
  }, { capture: true });

  window.addEventListener('pageswap', event => {
    if (event.viewTransition && (motion.matches || root.hasAttribute('data-skip-page-transition'))) {
      event.viewTransition.skipTransition();
    }
  });

  window.addEventListener('pagereveal', event => {
    const transition = event.viewTransition;
    if (!transition) return;
    const loader = document.querySelector('[data-preloader]');
    const showingLoader = root.classList.contains('motion') &&
      !root.classList.contains('loaded') && loader?.style.display !== 'none';
    if (motion.matches || showingLoader) {
      transition.skipTransition();
      return;
    }
    // Snapshot animation owns the whole viewport; avoid a second body entrance.
    root.removeAttribute('data-site-enter');
    root.setAttribute('data-page-transition-active', '');
    const cleanup = () => root.removeAttribute('data-page-transition-active');
    transition.finished.then(cleanup, cleanup);
    const stop = () => { if (motion.matches) transition.skipTransition(); };
    motion.addEventListener('change', stop);
    transition.finished.then(
      () => motion.removeEventListener('change', stop),
      () => motion.removeEventListener('change', stop),
    );
  });

  window.addEventListener('pageshow', () => root.removeAttribute('data-skip-page-transition'));
})();
