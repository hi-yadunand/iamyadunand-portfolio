const ready = (callback) => {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", callback, { once: true });
  } else {
    callback();
  }
};

ready(() => {
  const section = document.querySelector("[data-horizontal-works]");
  const track = section?.querySelector("[data-horizontal-track]");

  if (!section || !track) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const smallScreen = window.matchMedia("(max-width: 800px)");
  let distance = 0;
  let start = 0;
  let ticking = false;

  const updateActiveState = () => {
    const rect = section.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const isActive = rect.top <= 1 && rect.bottom >= viewportHeight * 0.35;
    const canPin = !smallScreen.matches && !reduceMotion.matches;
    document.documentElement.classList.toggle("is-horizontal-works-active", isActive && canPin);
    document.documentElement.classList.toggle("is-horizontal-scroll-cursor", isActive && canPin);
    section.classList.toggle("is-pinned", canPin && isActive && rect.top <= 0 && rect.bottom >= viewportHeight);
    section.classList.toggle("is-ended", canPin && rect.bottom < viewportHeight);
  };

  const measure = () => {
    if (reduceMotion.matches || smallScreen.matches) {
      section.style.removeProperty("--horizontal-height");
      track.style.removeProperty("transform");
      section.classList.remove("is-pinned", "is-ended");
      document.documentElement.classList.remove("is-horizontal-works-active", "is-horizontal-scroll-cursor");
      distance = 0;
      return;
    }

    distance = Math.max(0, track.scrollWidth - window.innerWidth);
    section.style.setProperty("--horizontal-height", `${window.innerHeight + distance}px`);
    start = window.scrollY + section.getBoundingClientRect().top;
    update();
    updateActiveState();
  };

  const update = () => {
    ticking = false;
    updateActiveState();
    if (!distance || reduceMotion.matches || smallScreen.matches) return;

    const available = Math.max(1, section.offsetHeight - window.innerHeight);
    const progress = Math.min(1, Math.max(0, (window.scrollY - start) / available));
    track.style.transform = `translate3d(${-distance * progress}px, 0, 0)`;
  };

  const requestUpdate = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  };

  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", measure);
  reduceMotion.addEventListener?.("change", measure);
  smallScreen.addEventListener?.("change", measure);
  track.querySelectorAll("img").forEach((image) => {
    if (!image.complete) image.addEventListener("load", measure, { once: true });
  });

  measure();
});
