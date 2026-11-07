// Shared by every page through the base layout module.
export function initNavigation(signal) {
  const header = document.querySelector('[data-header]');
  if (!header) return;

  const darkSections = [...document.querySelectorAll('[data-dark]')];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let previousScrollY = window.scrollY;
  let expanded = false;
  let hideAfter = 0;
  let hideTimer = null;
  const reveal = () => {
    window.clearTimeout(hideTimer);
    hideTimer = null;
    header.removeAttribute('data-hidden');
  };
  const hide = () => {
    hideTimer = null;
    if (window.scrollY > 160 &&
        !document.documentElement.hasAttribute('data-menu-open') &&
        !header.matches(':focus-within')) {
      header.setAttribute('data-hidden', '');
    }
  };
  const update = () => {
    const isExpanded = window.scrollY > 32;
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
    if (isExpanded && !expanded) {
      const expansionDuration = reducedMotion.matches ? 0 : 650;
      // Finish expanding, then hold briefly before allowing the slide up.
      hideAfter = performance.now() + expansionDuration + 250;
    }
    expanded = isExpanded;
    header.toggleAttribute('data-expanded', expanded);
    if (window.scrollY <= 160 || document.documentElement.hasAttribute('data-menu-open')) {
      reveal();
    }
    header.toggleAttribute('data-on-dark', onDark);
  };

  const onScroll = () => {
    update();
    const scrollY = window.scrollY;
    // Ignore tiny scroll movements so the header does not flicker.
    if (Math.abs(scrollY - previousScrollY) < 6) return;
    if (scrollY > previousScrollY && scrollY > 160 &&
        !document.documentElement.hasAttribute('data-menu-open')) {
      if (hideTimer === null) {
        const delay = Math.max(0, hideAfter - performance.now());
        if (delay > 0) hideTimer = window.setTimeout(hide, delay);
        else hide();
      }
    } else {
      reveal();
    }
    previousScrollY = scrollY;
  };

  header.addEventListener('focusin', reveal, { signal });
  signal.addEventListener('abort', () => window.clearTimeout(hideTimer), { once: true });
  window.addEventListener('scroll', onScroll, { passive: true, signal });
  window.addEventListener('resize', update, { signal });
  window.addEventListener('pageshow', update, { signal });
  update();
}
