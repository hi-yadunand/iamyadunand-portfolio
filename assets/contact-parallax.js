const ready = (callback) => {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", callback, { once: true });
  } else {
    callback();
  }
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const lerp = (from, to, amount) => from + (to - from) * amount;

ready(() => {
  const spacer = document.querySelector("[data-contact-parallax]");
  const footer = document.querySelector("[data-contact-parallax-inner]");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (!spacer || !footer || reduceMotion.matches) return;

  let scrollRaf = 0;
  let motionRaf = 0;
  let targetShift = 45;
  let currentShift = 45;
  let isVisible = true;
  let hasMeasured = false;

  const reset = () => {
    footer.style.removeProperty("--contact-footer-y");
  };

  const render = () => {
    motionRaf = 0;
    currentShift = lerp(currentShift, targetShift, 0.12);

    if (Math.abs(currentShift - targetShift) < 0.02) {
      currentShift = targetShift;
    }

    footer.style.setProperty(
      "--contact-footer-y",
      `${currentShift.toFixed(2)}%`,
    );

    if (isVisible && Math.abs(currentShift - targetShift) > 0.02) {
      motionRaf = requestAnimationFrame(render);
    }
  };

  const requestMotion = () => {
    if (motionRaf) return;
    motionRaf = requestAnimationFrame(render);
  };

  const updateTarget = () => {
    scrollRaf = 0;

    const rect = spacer.getBoundingClientRect();
    const viewportHeight =
      window.visualViewport?.height ||
      window.innerHeight ||
      document.documentElement.clientHeight;

    isVisible = rect.bottom >= 0 && rect.top <= viewportHeight;
    if (!isVisible) {
      targetShift = rect.top > viewportHeight ? 45 : 0;
      currentShift = targetShift;
      hasMeasured = true;
      footer.style.setProperty("--contact-footer-y", `${targetShift.toFixed(2)}%`);
      return;
    }

    const revealDistance = Math.min(viewportHeight, rect.height || viewportHeight);
    const progress = clamp((viewportHeight - rect.top) / revealDistance, 0, 1);
    targetShift = (1 - progress) * 45;

    if (!hasMeasured) {
      currentShift = targetShift;
      hasMeasured = true;
    }

    requestMotion();
  };

  const requestUpdate = () => {
    if (scrollRaf) return;
    scrollRaf = requestAnimationFrame(updateTarget);
  };

  updateTarget();
  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);
  window.addEventListener("orientationchange", requestUpdate);
});
