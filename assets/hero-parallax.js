const ready = (callback) => {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", callback, { once: true });
  } else {
    callback();
  }
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

ready(() => {
  const hero = document.querySelector(".hero--bouayaben");
  const photo = hero?.querySelector(".hero__photo");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const compactViewport = window.matchMedia("(max-width: 700px)");

  if (!hero || !photo || reduceMotion.matches) return;

  let raf = 0;

  const update = () => {
    raf = 0;

    const rect = hero.getBoundingClientRect();
    const viewportHeight =
      window.visualViewport?.height ||
      window.innerHeight ||
      document.documentElement.clientHeight;

    if (rect.bottom < 0 || rect.top > viewportHeight) return;

    const scrollDistance = Math.max(0, -rect.top);
    const strength = compactViewport.matches ? 0.11 : 0.18;
    const maxShift = compactViewport.matches
      ? Math.min(viewportHeight * 0.12, 82)
      : Math.min(viewportHeight * 0.18, 160);
    const parallaxShift = clamp(scrollDistance * strength, 0, maxShift);

    hero.style.setProperty(
      "--hero-parallax-y",
      `${parallaxShift.toFixed(2)}px`,
    );
  };

  const requestUpdate = () => {
    if (raf) return;
    raf = requestAnimationFrame(update);
  };

  update();
  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);
  window.addEventListener("orientationchange", requestUpdate);
  if (compactViewport.addEventListener) {
    compactViewport.addEventListener("change", requestUpdate);
  } else if (compactViewport.addListener) {
    compactViewport.addListener(requestUpdate);
  }
});
