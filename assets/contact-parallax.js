const ready = (callback) => {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", callback, { once: true });
  } else {
    callback();
  }
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

ready(() => {
  const spacer = document.querySelector("[data-contact-parallax]");
  const footer = document.querySelector("[data-contact-parallax-inner]");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (!spacer || !footer || reduceMotion.matches) return;

  let raf = 0;

  const reset = () => {
    footer.style.removeProperty("--contact-footer-y");
  };

  const update = () => {
    raf = 0;

    const rect = spacer.getBoundingClientRect();
    const viewportHeight =
      window.visualViewport?.height ||
      window.innerHeight ||
      document.documentElement.clientHeight;

    if (rect.bottom < 0 || rect.top > viewportHeight) return;

    const revealDistance = Math.min(viewportHeight, rect.height || viewportHeight);
    const progress = clamp((viewportHeight - rect.top) / revealDistance, 0, 1);
    const footerShift = (1 - progress) * 45;

    footer.style.setProperty(
      "--contact-footer-y",
      `${footerShift.toFixed(2)}%`,
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
});
