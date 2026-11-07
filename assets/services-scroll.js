// Reuse the exact instances registered by the preceding base module.
// The original accordion stays the source of truth and owns mobile interaction.
export function initServicesScroll(section, runtime = window, animations = {}) {
  const { gsap, ScrollTrigger } = animations;
  const accordion = section.querySelector('[data-services-accordion]');
  const services = [...(accordion?.querySelectorAll('[data-accordion]') || [])];
  if (!accordion || !services.length) return;

  if (!gsap?.context || !ScrollTrigger?.create) {
    // If the animation bundle fails, every service remains readable.
    services.forEach((service) => {
      service.setAttribute('data-open', '');
      service.querySelector('[data-accordion-btn]').setAttribute('aria-expanded', 'true');
    });
    return;
  }

  const controller = new AbortController();
  const { signal } = controller;
  const desktopQuery = runtime.matchMedia('(min-width: 768px)');
  const motionQuery = runtime.matchMedia('(prefers-reduced-motion: reduce)');
  const desktop = document.createElement('div');
  desktop.className = 'services-desktop';
  desktop.hidden = true;
  const titles = document.createElement('div');
  titles.className = 'services-desktop__titles';
  const visual = document.createElement('div');
  visual.className = 'services-desktop__visual';
  const sticky = document.createElement('div');
  sticky.className = 'services-desktop__sticky';
  const steps = [];
  const panels = [];

  services.forEach((service, index) => {
    const button = service.querySelector('[data-accordion-btn]');
    const labels = button.querySelectorAll('span');
    const step = document.createElement('div');
    step.className = 'services-desktop__step';
    const heading = document.createElement('h2');
    heading.id = `desktop-${button.id}`;
    heading.className = 'services-desktop__title';
    const number = document.createElement('span');
    number.className = 'label';
    number.textContent = labels[0].textContent;
    const name = document.createElement('span');
    name.className = 'display services-desktop__name';
    name.textContent = labels[1].textContent;
    heading.append(number, name);
    step.append(heading);
    titles.append(step);
    steps.push(step);

    const source = service.querySelector('.fold');
    const panel = document.createElement('div');
    panel.className = 'services-desktop__panel';
    panel.setAttribute('role', 'region');
    panel.setAttribute('aria-labelledby', heading.id);
    const image = source.querySelector('img').cloneNode(true);
    image.className = 'services-desktop__image';
    image.sizes = '(min-width: 768px) 48vw, 100vw';
    const description = source.querySelector('p').cloneNode(true);
    description.className = 'services-desktop__description';
    const capabilities = source.querySelector('ul').cloneNode(true);
    capabilities.className = 'label services-desktop__capabilities';
    [...capabilities.children].forEach((item) => item.removeAttribute('class'));
    panel.append(image, description, capabilities);
    sticky.append(panel);
    panels.push(panel);
  });

  visual.append(sticky);
  desktop.append(titles, visual);
  accordion.after(desktop);
  section.setAttribute('data-services-ready', '');

  let context;
  let reducedMotion;
  let refreshTimer;
  let destroyed = false;
  const refresh = () => {
    if (destroyed) return;
    runtime.clearTimeout(refreshTimer);
    refreshTimer = runtime.setTimeout(() => {
      if (!destroyed) ScrollTrigger.refresh();
    }, 80);
  };

  const stopDesktop = () => {
    runtime.clearTimeout(refreshTimer);
    context?.revert();
    context = undefined;
    desktop.hidden = true;
    accordion.hidden = false;
    steps.forEach((step) => step.removeAttribute('data-active'));
  };

  const configure = () => {
    if (destroyed) return;
    if (!desktopQuery.matches) {
      stopDesktop();
      refresh();
      return;
    }
    if (context && reducedMotion === motionQuery.matches) return;
    stopDesktop();
    reducedMotion = motionQuery.matches;
    desktop.hidden = false;
    accordion.hidden = true;

    context = gsap.context((scope) => {
      let current = -1;
      scope.add('activate', (index, animate = true) => {
        if (index === current) return;
        const previous = current;
        current = index;
        steps.forEach((step, i) => step.toggleAttribute('data-active', i === index));
        panels.forEach((panel, i) => {
          panel.setAttribute('aria-hidden', String(i !== index));
          panel.toggleAttribute('inert', i !== index);
        });
        gsap.killTweensOf(panels);
        gsap.set(panels.filter((_, i) => i !== previous && i !== index), { autoAlpha: 0, y: 0 });
        if (reducedMotion || !animate || previous < 0) {
          gsap.set(panels, { autoAlpha: 0, y: 0 });
          gsap.set(panels[index], { autoAlpha: 1 });
        } else {
          gsap.to(panels[previous], { autoAlpha: 0, y: -6, duration: .2, ease: 'power1.out', overwrite: true });
          gsap.fromTo(panels[index], { autoAlpha: 0, y: 10 }, {
            autoAlpha: 1, y: 0, duration: .45, ease: 'power2.out', overwrite: true,
          });
        }
      });

      steps.forEach((step, index) => ScrollTrigger.create({
        trigger: step,
        start: 'top 55%',
        end: 'bottom 55%',
        onToggle: (trigger) => { if (trigger.isActive) scope.activate(index); },
      }));
      let initial = 0;
      steps.forEach((step, index) => {
        if (step.getBoundingClientRect().top <= runtime.innerHeight * .55) initial = index;
      });
      scope.activate(initial, false);
    }, section);
    refresh();
  };

  desktopQuery.addEventListener('change', configure, { signal });
  motionQuery.addEventListener('change', configure, { signal });
  section.querySelectorAll('img').forEach((image) => {
    if (!image.complete) image.addEventListener('load', refresh, { once: true, signal });
  });
  runtime.addEventListener('pagehide', stopDesktop, { signal });
  runtime.addEventListener('pageshow', configure, { signal });
  document.fonts?.ready.then(refresh);
  configure();

  return () => {
    destroyed = true;
    controller.abort();
    runtime.clearTimeout(refreshTimer);
    stopDesktop();
    desktop.remove();
    section.removeAttribute('data-services-ready');
  };
}

const initialize = (animations) => {
  document.querySelectorAll('[data-services-scroll]').forEach((section) => initServicesScroll(section, window, animations));
};

// ESM caching shares the already loaded bundle; no second GSAP or Lenis starts.
import('../_astro/BaseLayout.astro_astro_type_script_index_0_lang.Dpw5V1aT.js')
  .then(initialize)
  .catch(() => initialize({}));
