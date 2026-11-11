// Shares the existing GSAP runtime and first-visit gate with the page reveal.
// The reference's cubic-bezier(0.25, 0.1, 0.1, 0.95), without another plugin.
function pageRevealEase(value) {
  if (value === 0 || value === 1) return value;
  let low = 0, high = 1, t = value;
  for (let iteration = 0; iteration < 20; iteration++) {
    t = (low + high) / 2;
    const inverse = 1 - t;
    const x = 0.75 * inverse * inverse * t + 0.3 * inverse * t * t + t * t * t;
    if (x < value) low = t;
    else high = t;
  }
  const inverse = 1 - t;
  return 0.3 * inverse * inverse * t + 2.85 * inverse * t * t + t * t * t;
}

export function animatePreloader(loader, gsap, refresh = () => {}) {
  const root = loader.ownerDocument.documentElement;
  root.setAttribute('data-preloader-active', '');
  const cards = [...loader.querySelectorAll('[data-preloader-card]')];
  const images = [...loader.querySelectorAll('[data-preloader-card] img')];
  const counter = loader.querySelector('[data-preloader-count]');
  const page = loader.ownerDocument.querySelector('main');
  const header = loader.ownerDocument.querySelector('[data-header]');
  const rotations = [7, -7, 4, -4];
  const revealAt = Math.max(1.7, 0.6 + (cards.length - 1) * 0.5);
  const snapshots = [page, header].filter(Boolean).map(element => ({
    element, style: element.getAttribute('style'),
  }));
  const progress = { value: 0 };
  let finished = false;
  let timeline;
  const finish = () => {
    if (finished) return;
    finished = true;
    clearTimeout(fallback);
    timeline?.kill();
    loader.style.display = 'none';
    snapshots.forEach(({ element, style }) => {
      if (style === null) element.removeAttribute('style');
      else element.setAttribute('style', style);
    });
    root.removeAttribute('data-preloader-active');
    loader.ownerDocument.dispatchEvent(new Event('portfolio:preloader-complete'));
    refresh();
  };
  // Restore the page as well as the overlay if animation execution stops.
  const fallback = setTimeout(finish, 3800);
  timeline = gsap.timeline({ onComplete: finish });

  gsap.set(cards, { scale: 0, rotation: 0, force3D: true });
  gsap.set(images, { scale: 2, opacity: 0, force3D: true });
  if (page) gsap.set(page, {
    scale: 0, rotation: 5, transformOrigin: '50% 50%',
    height: '100svh', overflow: 'hidden', position: 'relative', zIndex: 61,
    backgroundColor: 'var(--color-page)', willChange: 'transform', force3D: true,
  });
  if (header) gsap.set(header, { autoAlpha: 0, zIndex: 62 });

  // Match the reference: cards grow in place while their images zoom out.
  // Stable stacking avoids the abrupt depth changes in the old shuffle.
  timeline.to(cards, {
    scale: 1, rotation: index => rotations[index % rotations.length],
    duration: 0.8, stagger: 0.5, ease: 'power3.out',
  }, 0)
    .to(images, {
      scale: 1, opacity: 1,
      duration: 0.8, stagger: 0.5, ease: 'power3.out',
    }, 0)
    .to(progress, {
      value: 100, duration: 1.9, ease: 'power2.inOut',
      onUpdate: () => {
        if (counter) counter.textContent = `${Math.round(progress.value)}%`;
      },
    }, 0);

  if (page) timeline.to(page, {
    scale: 1, rotation: 0, duration: 0.8,
    ease: pageRevealEase,
  }, revealAt);
  if (counter) timeline.to(counter, {
    opacity: 0, duration: 0.6, ease: 'power2.inOut',
  }, revealAt);
  if (header) timeline.to(header, {
    autoAlpha: 1, duration: 0.3, ease: 'power2.inOut',
  }, revealAt + 0.5);

  return revealAt;
}
