const ready = (callback) => {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", callback, { once: true });
  } else {
    callback();
  }
};

const easeInOutQuart = (t) =>
  t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;

ready(() => {
  const loader = document.querySelector("[data-start-loader]");
  if (!loader) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const count = loader.querySelector("[data-loader-count]");
  const words = [...loader.querySelectorAll("[data-loader-word]")];
  const wipe = loader.querySelector("[data-loader-wipe]");

  document.documentElement.classList.add("is-loading");

  const complete = () => {
    loader.remove();
    document.documentElement.classList.remove("is-loading");
    window.dispatchEvent(new CustomEvent("portfolio:start-loader-complete"));
  };

  if (reduceMotion) {
    if (count) count.textContent = "099";
    words.forEach((word) => word.style.setProperty("--loader-progress", "100%"));
    complete();
    return;
  }

  const startedAt = performance.now();
  const fillDuration = 1900;
  const holdDuration = 260;
  const wipeDuration = 760;

  const render = (time) => {
    const elapsed = time - startedAt;
    const fillProgress = Math.min(elapsed / fillDuration, 1);
    const easedFill = easeInOutQuart(fillProgress);
    const percentage = Math.min(99, Math.round(easedFill * 99));

    if (count) count.textContent = String(percentage).padStart(3, "0");

    words.forEach((word, index) => {
      const localProgress = Math.max(0, Math.min(1, fillProgress * 1.18 - index * 0.08));
      word.style.setProperty("--loader-progress", `${easeInOutQuart(localProgress) * 100}%`);
    });

    if (elapsed < fillDuration + holdDuration) {
      requestAnimationFrame(render);
      return;
    }

    const wipeProgress = Math.min((elapsed - fillDuration - holdDuration) / wipeDuration, 1);
    const easedWipe = easeInOutQuart(wipeProgress);
    loader.style.setProperty("--loader-clip", `${easedWipe * 100}%`);
    loader.style.opacity = String(1 - Math.max(0, wipeProgress - 0.75) / 0.25);

    if (wipe) {
      wipe.style.transform = `scaleY(${1 + easedWipe * 10})`;
      wipe.style.opacity = String(1 - wipeProgress * 0.45);
    }

    if (wipeProgress < 1) {
      requestAnimationFrame(render);
    } else {
      complete();
    }
  };

  requestAnimationFrame(render);
});
