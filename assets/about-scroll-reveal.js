const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const ready = (fn) => {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", fn, { once: true });
  } else {
    fn();
  }
};

const splitWords = (paragraph, startIndex = 0) => {
  const text = paragraph.textContent.replace(/\s+/g, " ").trim();
  paragraph.setAttribute("aria-label", text);
  paragraph.textContent = "";

  const fragment = document.createDocumentFragment();
  const parts = text.split(/(\s+)/);
  let wordIndex = startIndex;

  parts.forEach((part) => {
    if (!part) return;

    if (/^\s+$/.test(part)) {
      fragment.append(" ");
      return;
    }

    const word = document.createElement("span");
    word.className = "scroll-reveal__word";
    word.textContent = part;
    word.style.setProperty("--word-index", wordIndex);
    wordIndex += 1;
    fragment.append(word);
  });

  paragraph.append(fragment);
  return wordIndex;
};

ready(() => {
  const groups = [...document.querySelectorAll("[data-scroll-reveal]")];
  if (!groups.length) return;

  groups.forEach((group) => {
    const paragraphs = group.matches("p")
      ? [group]
      : [...group.querySelectorAll("p")];
    let wordIndex = 0;
    paragraphs.forEach((paragraph) => {
      wordIndex = splitWords(paragraph, wordIndex);
    });
  });

  if (prefersReducedMotion()) {
    groups.forEach((group) => {
      group.classList.add("is-scroll-reveal-ready");
      group.querySelectorAll(".scroll-reveal__word").forEach((word) => {
        word.style.opacity = "1";
      });
    });
    return;
  }

  const items = groups.map((group) => ({
    group,
    words: [...group.querySelectorAll(".scroll-reveal__word")],
  }));

  let ticking = false;

  const update = () => {
    ticking = false;
    const viewportHeight =
      window.innerHeight || document.documentElement.clientHeight;

    items.forEach(({ group, words }) => {
      const rect = group.getBoundingClientRect();
      const startTop = viewportHeight * 0.88;
      const endTop = viewportHeight * 0.12;
      const wordProgress = clamp(
        (startTop - rect.top) / Math.max(1, startTop - endTop),
      );

      group.classList.add("is-scroll-reveal-ready");

      const revealWindow = 0.18;
      const staggerRange = 1 - revealWindow;
      words.forEach((word, index) => {
        const offset =
          words.length > 1 ? (index / (words.length - 1)) * staggerRange : 0;
        const progress = clamp((wordProgress - offset) / revealWindow);
        const opacity = 0.12 + progress * 0.88;
        word.style.opacity = opacity.toFixed(3);
      });
    });
  };

  const requestUpdate = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  };

  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);
  document.fonts?.ready?.then(requestUpdate);
  requestUpdate();
});
