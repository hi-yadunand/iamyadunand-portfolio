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

  document.documentElement.classList.add("is-loading");
  let isComplete = false;

  const complete = () => {
    if (isComplete) return;
    isComplete = true;
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
  const slideDuration = 1000;

  const startSlide = () => {
    loader.addEventListener(
      "transitionend",
      (event) => {
        if (event.propertyName === "transform") complete();
      },
      { once: true },
    );
    loader.style.setProperty("--loader-slide", "100%");
    window.setTimeout(complete, slideDuration + 120);
  };

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

    startSlide();
  };

  requestAnimationFrame(render);
});
