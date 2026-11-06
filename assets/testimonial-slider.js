document.querySelectorAll("[data-testimonial-slider]").forEach((slider) => {
  const slides = [...slider.querySelectorAll("[data-slide]")];
  const count = slider.querySelector("[data-slider-count]");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (!slides.length) return;

  let current = 0;
  let transitioning = false;
  let queuedDirection = null;

  const updateActive = () => {
    slides.forEach((slide, index) => {
      const active = index === current;
      slide.toggleAttribute("data-active", active);
      slide.toggleAttribute("inert", !active);
      slide.setAttribute("aria-hidden", String(!active));
    });
    if (count) count.textContent = String(current + 1).padStart(2, "0");
  };

  const move = (direction) => {
    if (slides.length < 2) return;
    if (transitioning) {
      queuedDirection = direction;
      return;
    }

    const outgoing = slides[current];
    current = (current + direction + slides.length) % slides.length;
    const incoming = slides[current];
    updateActive();
    if (reducedMotion.matches) return;

    transitioning = true;
    outgoing.setAttribute("data-slide-moving", "");
    const options = { duration: 650, easing: "cubic-bezier(0.22, 1, 0.36, 1)", fill: "both" };
    const animations = [
      outgoing.animate(
        [{ transform: "translateX(0)" }, { transform: `translateX(${-direction * 110}%)` }],
        options,
      ),
      incoming.animate(
        [{ transform: `translateX(${direction * 110}%)` }, { transform: "translateX(0)" }],
        options,
      ),
    ];

    const complete = () => {
      outgoing.removeAttribute("data-slide-moving");
      animations.forEach((animation) => animation.cancel());
      transitioning = false;
      if (queuedDirection !== null) {
        const nextDirection = queuedDirection;
        queuedDirection = null;
        move(nextDirection);
      }
    };
    Promise.all(animations.map((animation) => animation.finished)).then(complete, complete);
  };

  updateActive();
  slider.querySelector("[data-slider-prev]")?.addEventListener("click", () => move(-1));
  slider.querySelector("[data-slider-next]")?.addEventListener("click", () => move(1));
});
