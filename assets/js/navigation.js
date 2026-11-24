// Shared by every page through the base layout module.
export function initNavigation(signal) {
  const header = document.querySelector('[data-header]');
  if (!header) return;

  const darkSections = [...document.querySelectorAll('[data-dark]')];
  let compact = false;
  const update = () => {
    const scrollY = window.scrollY;
    const nextCompact = compact ? scrollY > 24 : scrollY >= 64;
    // Read section geometry before changing header attributes, avoiding a
    // style write followed immediately by a forced layout on every scroll.
    const viewportHeight = window.innerHeight;
    const onDark = darkSections.some((section) => {
      const rect = section.getBoundingClientRect();
      if (rect.top > 32 || rect.bottom < 32) return false;
      const [start, end] = (section.dataset.dark || '0:1').split(':').map(Number);
      const progress = -rect.top / Math.max(1, rect.height - viewportHeight);
      return progress >= start && progress <= end;
    });
    if (nextCompact !== compact) {
      compact = nextCompact;
      header.toggleAttribute('data-compact', compact);
    }
    // The loader scales the page to zero, so its section rectangles cannot
    // determine the header color until the reveal restores the page layout.
    if (!document.documentElement.hasAttribute('data-preloader-active')) {
      header.toggleAttribute('data-on-dark', onDark);
    }
  };

  window.addEventListener('scroll', update, { passive: true, signal });
  window.addEventListener('resize', update, { signal });
  window.addEventListener('pageshow', update, { signal });
  document.addEventListener('portfolio:preloader-complete', update, { signal });
  update();
}
