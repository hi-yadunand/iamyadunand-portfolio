export function initServiceScroll(section) {
  const stage = section.querySelector('[data-service-stage]');
  const content = section.querySelector('[data-service-content]');
  const cards = [...section.querySelectorAll('[data-service-card]')];
  const toggles = cards.map((card) => card.querySelector('[data-service-toggle]'));
  const panels = cards.map((card) => card.querySelector('[data-service-panel]'));
  const bodies = cards.map((card) => card.querySelector('.service-scroll-card__body'));
  if (!stage || !content || !cards.length) return;

  const scrollLayout = window.matchMedia('(min-width: 768px) and (min-height: 600px) and (prefers-reduced-motion: no-preference)');
  let enabled = false;
  let current = -1;
  let stepHeight = 1;
  let frame = 0;
  let cardHeights = [];
  let bodyHeights = [];
  let listTop = 0;

  const select = (index) => {
    if (current === index) return;
    current = index;
    cards.forEach((card, i) => {
      const open = !enabled || i === index;
      card.toggleAttribute('data-active', open);
      toggles[i].setAttribute('aria-expanded', String(open));
      panels[i].toggleAttribute('inert', !open);
      panels[i].setAttribute('aria-hidden', String(!open));
    });
    // Earlier headings remain above the open row. Move the list only as much as
    // needed to keep the current service's details inside a shorter viewport.
    const headers = cardHeights.slice(0, index + 1).reduce((sum, height) => sum + height, 0);
    const activeBottom = listTop + headers + bodyHeights[index];
    const offset = enabled ? Math.max(0, activeBottom - (window.innerHeight - 112)) : 0;
    section.style.setProperty('--service-stack-offset', `${offset}px`);
  };

  const update = () => {
    frame = 0;
    if (!enabled) return;
    const distance = -section.getBoundingClientRect().top;
    select(Math.max(0, Math.min(cards.length - 1, Math.floor(distance / stepHeight))));
  };

  const requestUpdate = () => {
    if (enabled && !frame) frame = window.requestAnimationFrame(update);
  };

  const configure = () => {
    enabled = scrollLayout.matches;
    stepHeight = Math.round(window.innerHeight * .8);
    section.style.setProperty('--service-count', cards.length);
    section.style.setProperty('--service-stage-height', `${window.innerHeight}px`);
    section.style.setProperty('--service-step-height', `${stepHeight}px`);
    section.classList.toggle('is-scroll-driven', enabled);
    cardHeights = toggles.map((toggle) => toggle.offsetHeight + 1);
    bodyHeights = bodies.map((body) => body.scrollHeight);
    listTop = section.querySelector('.services-scroll__cards').getBoundingClientRect().top - content.getBoundingClientRect().top;
    current = -1;
    if (enabled) update();
    else select(0);
  };

  toggles.forEach((toggle, index) => {
    // Scrolling drives the accordion. Buttons also provide keyboard access to
    // any service without depending on pointer input or scroll precision.
    toggle.addEventListener('click', () => {
      if (!enabled) return;
      const top = window.scrollY + section.getBoundingClientRect().top + index * stepHeight + 1;
      select(index);
      window.scrollTo({ top, behavior: 'auto' });
    });
  });
  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', configure, { passive: true });
  window.addEventListener('pageshow', configure);
  scrollLayout.addEventListener('change', configure);
  document.fonts?.ready.then(configure);
  configure();
}

document.querySelectorAll('[data-service-scroll]').forEach(initServiceScroll);
