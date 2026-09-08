import { createParticleTextEffect } from "./particle-text-effect.js";

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const ready = (fn) => {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", fn, { once: true });
  } else {
    fn();
  }
};

const splitTextNodes = (root) => {
  const chars = [];

  const walk = (node) => {
    for (const child of [...node.childNodes]) {
      if (child.nodeType === Node.TEXT_NODE) {
        const fragment = document.createDocumentFragment();
        const parts = child.textContent.split(/(\s+)/);

        for (const part of parts) {
          if (!part) continue;
          if (!part.trim()) {
            fragment.append(part);
            continue;
          }

          const word = document.createElement("span");
          word.className = "word";

          for (const letter of part) {
            const char = document.createElement("span");
            char.className = "char";
            char.textContent = letter;
            word.append(char);
            chars.push(char);
          }

          fragment.append(word);
        }

        child.replaceWith(fragment);
      } else {
        walk(child);
      }
    }
  };

  walk(root);
  return chars;
};

const waitForLoader = () =>
  new Promise((resolve) => {
    const loader = document.querySelector("[data-start-loader], [data-loader]");
    const started = performance.now();

    const check = () => {
      if (!loader) {
        resolve();
        return;
      }

      const style = getComputedStyle(loader);
      const faded =
        style.display === "none" ||
        style.visibility === "hidden" ||
        Number(style.opacity) < 0.02;
      const timedOut = performance.now() - started > 7000;

      if (faded || timedOut) {
        resolve();
        return;
      }

      requestAnimationFrame(check);
    };

    check();
  });

const initCharacterRepel = (root, chars) => {
  let pointer = { x: -90000, y: -90000 };
  let centers = [];
  const states = chars.map(() => ({ x: 0, y: 0, tx: 0, ty: 0 }));

  const measure = () => {
    centers = chars.map((char) => {
      const rect = char.getBoundingClientRect();
      return {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };
    });
  };

  const onPointerMove = (event) => {
    pointer = { x: event.clientX, y: event.clientY };
  };

  const tick = () => {
    for (let index = 0; index < chars.length; index += 1) {
      const center = centers[index];
      if (!center) continue;

      const state = states[index];
      const dx = center.x - pointer.x;
      const dy = center.y - pointer.y;
      const distance = Math.hypot(dx, dy);

      if (distance < 150 && distance > 0.01) {
        const force = (1 - distance / 150) * 14;
        state.tx = (dx / distance) * force;
        state.ty = (dy / distance) * force * 0.6;
      } else {
        state.tx = 0;
        state.ty = 0;
      }

      state.x += (state.tx - state.x) * 0.14;
      state.y += (state.ty - state.y) * 0.14;
      chars[index].style.transform = `translate(${state.x.toFixed(
        2,
      )}px, ${state.y.toFixed(2)}px)`;
    }

    requestAnimationFrame(tick);
  };

  measure();
  window.addEventListener("pointermove", onPointerMove, { passive: true });
  window.addEventListener("resize", measure);
  window.addEventListener("scroll", measure, { passive: true });
  root.addEventListener("animationend", measure, { once: true });
  requestAnimationFrame(tick);
};

const createParticles = (root, canvas, word) =>
  createParticleTextEffect({
    container: root,
    canvas,
    pointerTarget: root,
    color: "#ee4b2b",
    highlightColor: "#ee4b2b",
    particleSize: 2,
    density: 4,
    scatter: 180,
    gatherDuration: 1600,
    stagger: 420,
    pointerRepel: 40,
    repelRadius: 120,
    idleDrift: 0.7,
    glow: true,
    startDelay: 1800,
    getLayout: () => {
      const rootRect = root.getBoundingClientRect();
      const wordRect = word.getBoundingClientRect();
      const style = getComputedStyle(word);
      const fontSize = parseFloat(style.fontSize) || wordRect.height;

      return {
        text: word.textContent,
        font: `${style.fontStyle} ${style.fontWeight} ${fontSize}px ${style.fontFamily}`,
        fontSize,
        targetCenterX: wordRect.left - rootRect.left + wordRect.width / 2,
        targetCenterY: wordRect.top - rootRect.top + wordRect.height / 2,
      };
    },
    onSample: () => {
      word.style.transition = "opacity 0.7s ease";
      word.style.opacity = "0";
    },
  });

ready(() => {
  const root = document.querySelector(".hero--bouayaben");
  if (!root || prefersReducedMotion()) return;

  const headline = root.querySelector(".hero__title--bouayaben");
  const canvas = root.querySelector("[data-million-particles]");
  const word = root.querySelector("[data-particle-word]");
  if (!headline || !canvas || !word) return;

  const init = () => {
    const chars = splitTextNodes(headline);
    initCharacterRepel(root, chars);
    root.classList.add("is-hero-animated");

    createParticles(root, canvas, word);
  };

  const fontsReady = document.fonts?.ready || Promise.resolve();
  Promise.all([fontsReady, waitForLoader()]).then(init);
});
