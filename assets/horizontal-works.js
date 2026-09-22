const ready = (callback) => {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", callback, { once: true });
  } else {
    callback();
  }
};

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const easeProgress = (value) => value * value * (3 - 2 * value);
const lerp = (from, to, amount) => from + (to - from) * amount;

ready(() => {
  const section = document.querySelector("[data-horizontal-works]");
  const track = section?.querySelector("[data-horizontal-track]");

  if (!section || !track) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const smallScreen = window.matchMedia("(max-width: 800px)");
  let distance = 0;
  let start = 0;
  let ticking = false;
  let motionFrame = 0;
  let targetX = 0;
  let currentX = 0;
  let targetNavProgress = 0;
  let currentNavProgress = 0;
  let hasMeasured = false;

  const applyNavProgress = (progress) => {
    document.documentElement.style.setProperty("--horizontal-nav-progress", progress.toFixed(3));
    document.documentElement.style.setProperty("--horizontal-nav-opacity", (1 - progress).toFixed(3));
    document.documentElement.style.setProperty("--horizontal-nav-offset", `${(-120 * progress).toFixed(2)}%`);
  };

  const renderMotion = () => {
    motionFrame = 0;
    currentX = lerp(currentX, targetX, 0.14);
    currentNavProgress = lerp(currentNavProgress, targetNavProgress, 0.16);

    if (Math.abs(currentX - targetX) < 0.08) currentX = targetX;
    if (Math.abs(currentNavProgress - targetNavProgress) < 0.001) {
      currentNavProgress = targetNavProgress;
    }

    if (!reduceMotion.matches && !smallScreen.matches && distance) {
      track.style.transform = `translate3d(${currentX.toFixed(2)}px, 0, 0)`;
    }

    applyNavProgress(currentNavProgress);

    if (
      Math.abs(currentX - targetX) > 0.08 ||
      Math.abs(currentNavProgress - targetNavProgress) > 0.001
    ) {
      motionFrame = requestAnimationFrame(renderMotion);
    }
  };

  const requestMotion = () => {
    if (motionFrame) return;
    motionFrame = requestAnimationFrame(renderMotion);
  };

  const updateActiveState = () => {
    const rect = section.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const canPin = !smallScreen.matches && !reduceMotion.matches;
    const hideDistance = Math.min(280, viewportHeight * 0.34);
    const exitDistance = viewportHeight * 0.35;
    const enterProgress = clamp((hideDistance - rect.top) / hideDistance);
    const exitProgress = clamp(rect.bottom / exitDistance);
    const navProgress = canPin ? easeProgress(Math.min(enterProgress, exitProgress)) : 0;
    const isActive = navProgress > 0.02;

    targetNavProgress = navProgress;
    requestMotion();
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
      document.documentElement.style.removeProperty("--horizontal-nav-progress");
      document.documentElement.style.removeProperty("--horizontal-nav-opacity");
      document.documentElement.style.removeProperty("--horizontal-nav-offset");
      distance = 0;
      targetX = 0;
      currentX = 0;
      targetNavProgress = 0;
      currentNavProgress = 0;
      hasMeasured = false;
      if (motionFrame) {
        cancelAnimationFrame(motionFrame);
        motionFrame = 0;
      }
      return;
    }

    distance = Math.max(0, track.scrollWidth - window.innerWidth);
    section.style.setProperty("--horizontal-height", `${window.innerHeight + distance}px`);
    start = window.scrollY + section.getBoundingClientRect().top;
    hasMeasured = false;
    update();
    updateActiveState();
  };

  const update = () => {
    ticking = false;
    updateActiveState();
    if (!distance || reduceMotion.matches || smallScreen.matches) return;

    const available = Math.max(1, section.offsetHeight - window.innerHeight);
    const progress = Math.min(1, Math.max(0, (window.scrollY - start) / available));
    targetX = -distance * progress;

    if (!hasMeasured) {
      currentX = targetX;
      currentNavProgress = targetNavProgress;
      hasMeasured = true;
    }

    requestMotion();
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
