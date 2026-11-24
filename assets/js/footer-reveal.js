/**
 * Adapted from Glyph Portal © 2026 Christian Katzmann. MIT.
 * Origin: UsefulPortal.astro on https://ktzm.dk → UsefulPortal.tsx → ClarityPortal.tsx.
 * A scroll-driven camera through live type.
 */
import { scrollToSitePosition } from "./site-scroll.js";

const portal = document.querySelector("[data-footer-portal]");
const clamp = (value) => Math.min(1, Math.max(0, value));
const easeBetween = (start, end, value) => {
  const t = clamp((value - start) / (end - start));
  return t * t * (3 - 2 * t);
};

// Measure the largest fully opaque square, then inscribe a circle in it.
// Scan at a fixed reference size so viewport changes only need fresh geometry.
function measureGlyph(character, font) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) return null;
  const fontSize = 300;
  const fontSpec = `${font.fontWeight} ${fontSize}px ${font.fontFamily}`;
  context.font = fontSpec;
  const metrics = context.measureText(character);
  const xOrigin = Math.ceil(metrics.actualBoundingBoxLeft) + 4;
  const baseline = Math.ceil(metrics.actualBoundingBoxAscent) + 4;
  canvas.width = Math.ceil(metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight) + 8;
  canvas.height = Math.ceil(metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent) + 8;
  const { width, height } = canvas;
  if (width <= 8 || height <= 8) return null;
  context.font = fontSpec;
  context.fillText(character, xOrigin, baseline);

  const { data } = context.getImageData(0, 0, width, height);
  const row = new Uint16Array(width + 1);
  let size = 0;
  let x = 0;
  let y = 0;
  for (let line = 0; line < height; line++) {
    let diagonal = 0;
    for (let column = 0; column < width; column++) {
      const above = row[column + 1];
      row[column + 1] = data[(line * width + column) * 4 + 3] > 245
        ? Math.min(above, row[column], diagonal) + 1
        : 0;
      diagonal = above;
      if (row[column + 1] > size) {
        size = row[column + 1];
        x = column + 1 - size / 2;
        y = line + 1 - size / 2;
      }
    }
  }
  if (size < 5) return null;
  return { x: (x - xOrigin) / fontSize, y: (y - baseline) / fontSize, radius: (size / 2 - 2) / fontSize };
}

if (portal) {
  const pin = portal.querySelector(".footer-portal__pin");
  const scene = portal.querySelector(".footer-portal__scene");
  const heading = portal.querySelector("h2");
  const glyph = heading.querySelector("[data-footer-portal-glyph]");
  const baseline = glyph.querySelector(".footer-portal__baseline");
  const motion = window.matchMedia("(prefers-reduced-motion: no-preference) and (min-height: 480px)");
  const controller = new AbortController();
  const { signal } = controller;
  let glyphFont;
  let ink;
  let geometry;
  let frame = 0;
  let lastProgress;

  const reset = () => {
    geometry = null;
    portal.removeAttribute("data-footer-portal-active");
    portal.removeAttribute("data-footer-portal-dark");
    heading.style.removeProperty("--footer-portal-camera");
    portal.style.removeProperty("--footer-portal-detail-opacity");
    portal.style.removeProperty("--footer-portal-detail-hit");
    portal.style.removeProperty("--footer-portal-surface-opacity");
    portal.style.removeProperty("--footer-portal-tint");
  };

  const paint = () => {
    frame = 0;
    if (!geometry) return;
    const progress = clamp(-portal.getBoundingClientRect().top / geometry.travel);
    if (progress === lastProgress) return;
    lastProgress = progress;

    const scale = geometry.scale ** easeBetween(0.09, 0.94, progress);
    const translation = (scale - 1) / (geometry.scale - 1);
    heading.style.setProperty(
      "--footer-portal-camera",
      progress <= 0.09 ? "none" : `translate(${geometry.x * translation}px, ${geometry.y * translation}px) scale(${scale})`,
    );
    const detail = 1 - easeBetween(0.04, 0.26, progress);
    portal.style.setProperty("--footer-portal-detail-opacity", detail);
    portal.style.setProperty("--footer-portal-detail-hit", detail > 0.35 ? "auto" : "none");
    portal.style.setProperty("--footer-portal-surface-opacity", easeBetween(0.78, 0.98, progress));
    portal.style.setProperty("--footer-portal-tint", `${100 * easeBetween(0.61, 0.93, progress)}%`);
    portal.toggleAttribute("data-footer-portal-dark", progress >= 0.82);
  };

  const schedule = () => {
    if (!frame && geometry) frame = requestAnimationFrame(paint);
  };

  const measure = () => {
    if (signal.aborted) return;
    if (!motion.matches) {
      reset();
      return;
    }
    if (document.fonts?.status === "loading" || document.documentElement.hasAttribute("data-preloader-active")) return;

    const font = getComputedStyle(heading);
    const key = `${font.fontFamily}:${font.fontWeight}`;
    if (key !== glyphFont) {
      ink = measureGlyph(glyph.textContent, font);
      glyphFont = key;
    }
    if (!ink) return;

    portal.setAttribute("data-footer-portal-active", "");
    heading.style.removeProperty("--footer-portal-camera");
    const width = pin.clientWidth;
    const height = pin.clientHeight;
    if (!width || scene.offsetHeight > height) {
      reset();
      return;
    }

    const fontSize = Number.parseFloat(getComputedStyle(heading).fontSize);
    const pinBounds = pin.getBoundingClientRect();
    const headingBounds = heading.getBoundingClientRect();
    const scale = Math.max(2, Math.hypot(width, height) / (2 * ink.radius * fontSize) * 1.08);
    const inkX = glyph.getBoundingClientRect().left - headingBounds.left + ink.x * fontSize;
    const inkY = baseline.getBoundingClientRect().top - headingBounds.top + ink.y * fontSize;
    geometry = {
      x: pinBounds.left - headingBounds.left + width / 2 - inkX * scale,
      y: pinBounds.top - headingBounds.top + height / 2 - inkY * scale,
      scale,
      travel: Math.max(1, portal.clientHeight - height),
    };
    lastProgress = undefined;
    schedule();
  };

  window.addEventListener("scroll", schedule, { passive: true, signal });
  window.addEventListener("resize", measure, { signal });
  window.addEventListener("pageshow", measure, { signal });
  motion.addEventListener("change", measure, { signal });
  document.addEventListener("portfolio:preloader-complete", measure, { signal });
  scene.addEventListener("focusin", (event) => {
    if (!geometry || !event.target.matches(":focus-visible") || !lastProgress) return;
    scrollToSitePosition(window.scrollY + portal.getBoundingClientRect().top, true);
    cancelAnimationFrame(frame);
    paint();
  }, { signal });
  window.addEventListener("pagehide", (event) => {
    if (event.persisted) return;
    cancelAnimationFrame(frame);
    controller.abort();
  }, { signal });
  if (document.fonts) document.fonts.ready.then(measure);
  else measure();
}
