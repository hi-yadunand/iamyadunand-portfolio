// Match the reference's -170px -> 0px in-view footer translation. Native
// scroll positions also track the existing Lenis engine; no new ticker needed.
const stage = document.querySelector("[data-footer-reveal-stage]");
const footer = stage?.querySelector("[data-footer-reveal]");

if (footer) {
  const controller = new AbortController();
  const { signal } = controller;
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let enabled = false;
  let start = 0;
  let distance = 1;
  let previousY;

  const paint = () => {
    if (!enabled || signal.aborted) return;
    const progress = Math.min(1, Math.max(0, (window.scrollY - start) / distance));
    const y = Math.round(-170 * (1 - progress) * 1000) / 1000;
    if (y === previousY) return;
    previousY = y;
    footer.style.setProperty("--footer-reveal-y", `${y}px`);
  };
  const measure = () => {
    if (signal.aborted) return;
    // Geometry is cached on layout changes, never read in the scroll handler.
    start = stage.getBoundingClientRect().top + window.scrollY - window.innerHeight;
    distance = Math.max(1, Math.min(window.innerHeight, footer.offsetHeight));
    paint();
  };
  const configure = () => {
    enabled = !motion.matches;
    stage.toggleAttribute("data-footer-parallax-active", enabled);
    previousY = undefined;
    if (!enabled) footer.style.removeProperty("--footer-reveal-y");
    measure();
  };

  window.addEventListener("scroll", paint, { passive: true, signal });
  window.addEventListener("resize", measure, { signal });
  window.addEventListener("pageshow", measure, { signal });
  stage.addEventListener("load", measure, { capture: true, signal });
  motion.addEventListener("change", configure, { signal });
  const observer = "ResizeObserver" in window ? new ResizeObserver(measure) : null;
  observer?.observe(footer);
  const main = document.querySelector("main");
  if (main) observer?.observe(main);
  document.fonts?.ready.then(measure);

  // Keyboard focus must never land in content clipped by the reveal.
  footer.addEventListener("focusin", () => {
    if (enabled && window.scrollY < start + distance) {
      window.scrollTo({ top: start + distance, behavior: "instant" });
      paint();
    }
  }, { signal });
  window.addEventListener("pagehide", (event) => {
    if (event.persisted) return;
    observer?.disconnect();
    controller.abort();
    stage.removeAttribute("data-footer-parallax-active");
    footer.style.removeProperty("--footer-reveal-y");
  }, { signal });
  configure();
}
