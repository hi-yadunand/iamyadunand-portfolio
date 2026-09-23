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
  const hero = document.querySelector(".hero--bouayaben");
  const photo = hero?.querySelector(".hero__photo");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const compactViewport = window.matchMedia("(max-width: 700px)");

  if (!hero || !photo || reduceMotion.matches) return;

  let scrollRaf = 0;
  let motionRaf = 0;
  let targetShift = 0;
  let currentShift = 0;
  let targetProgress = 0;
  let currentProgress = 0;
  let isVisible = true;
  let hasMeasured = false;

  const render = () => {
    motionRaf = 0;
    currentShift = lerp(currentShift, targetShift, 0.12);
    currentProgress = lerp(currentProgress, targetProgress, 0.12);

    if (Math.abs(currentShift - targetShift) < 0.02) {
      currentShift = targetShift;
    }

    if (Math.abs(currentProgress - targetProgress) < 0.002) {
      currentProgress = targetProgress;
    }

    const zoom = 1 + currentProgress * 0.13;
    const blur = currentProgress * (compactViewport.matches ? 9 : 14);

    hero.style.setProperty(
      "--hero-parallax-y",
      `${currentShift.toFixed(2)}px`,
    );
    hero.style.setProperty("--hero-scale", zoom.toFixed(4));
    hero.style.setProperty("--hero-blur", `${blur.toFixed(2)}px`);

    if (
      isVisible &&
      (Math.abs(currentShift - targetShift) > 0.02 ||
        Math.abs(currentProgress - targetProgress) > 0.002)
    ) {
      motionRaf = requestAnimationFrame(render);
    }
  };

  const requestMotion = () => {
    if (motionRaf) return;
    motionRaf = requestAnimationFrame(render);
  };

  const updateTarget = () => {
    scrollRaf = 0;

    const rect = hero.getBoundingClientRect();
    const viewportHeight =
      window.visualViewport?.height ||
      window.innerHeight ||
      document.documentElement.clientHeight;

    isVisible = rect.bottom >= 0 && rect.top <= viewportHeight;
    if (!isVisible) return;

    const scrollDistance = Math.max(0, -rect.top);
    const strength = compactViewport.matches ? 0.11 : 0.18;
    const maxShift = compactViewport.matches
      ? Math.min(viewportHeight * 0.12, 82)
      : Math.min(viewportHeight * 0.18, 160);
    targetShift = clamp(scrollDistance * strength, 0, maxShift);
    targetProgress = clamp(scrollDistance / viewportHeight, 0, 1);

    if (!hasMeasured) {
      currentShift = targetShift;
      currentProgress = targetProgress;
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
  if (compactViewport.addEventListener) {
    compactViewport.addEventListener("change", requestUpdate);
  } else if (compactViewport.addListener) {
    compactViewport.addListener(requestUpdate);
  }
});
