const ready = (callback) => {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", callback, { once: true });
  } else {
    callback();
  }
};

ready(() => {
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (!finePointer.matches || reduceMotion.matches) return;

  document.documentElement.classList.add("custom-cursor-active");

  const cursor = document.createElement("div");
  cursor.className = "pPointer";
  cursor.setAttribute("aria-hidden", "true");
  cursor.innerHTML = '<span class="pPointer__label"></span>';
  document.body.appendChild(cursor);

  const label = cursor.querySelector(".pPointer__label");
  const target = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    width: 10,
    height: 10,
  };
  const current = { ...target };

  const interactiveSelector = [
    "a",
    "button",
    "[role='button']",
    "[data-cursor-snap]",
    "[data-cursor-label]",
  ].join(",");

  let raf = 0;
  let lastElement = null;

  const horizontalSectionSelector = "[data-horizontal-works]";
  const isOverHorizontalSection = (element) =>
    Boolean(element?.closest?.(horizontalSectionSelector));

  const getPointerElement = () =>
    document.elementFromPoint(target.x, target.y) || lastElement;

  const setInteractiveState = (element) => {
    lastElement = element;
    const interactive = element?.closest?.(interactiveSelector);
    const isHorizontalScroll = document.documentElement.classList.contains("is-horizontal-scroll-cursor");
    const shouldShowScroll = isHorizontalScroll && isOverHorizontalSection(element) && !interactive;
    const labelText = shouldShowScroll ? "Scroll" : interactive?.getAttribute?.("data-cursor-label")?.trim() || "";

    cursor.classList.toggle("isHover", Boolean(interactive));
    cursor.classList.toggle("hasLabel", Boolean(labelText));
    cursor.classList.toggle("isScrollMouse", shouldShowScroll);
    label.textContent = labelText;

    if (shouldShowScroll) {
      target.width = 46;
      target.height = 24;
    } else if (labelText) {
      target.width = 140;
      target.height = 44;
    } else if (interactive) {
      target.width = 44;
      target.height = 44;
    } else {
      target.width = 10;
      target.height = 10;
    }
  };

  const syncScrollCursor = () => {
    if (document.documentElement.classList.contains("is-horizontal-scroll-cursor")) {
      const pointerElement = getPointerElement();
      const interactive = pointerElement?.closest?.(interactiveSelector);
      const isOverHorizontal = isOverHorizontalSection(pointerElement);
      if (interactive) {
        setInteractiveState(pointerElement);
        return;
      }

      if (!isOverHorizontal) {
        setInteractiveState(pointerElement);
        return;
      }

      cursor.classList.remove("isHover");
      cursor.classList.add("hasLabel", "isScrollMouse");
      label.textContent = "Scroll";
      target.width = 46;
      target.height = 24;
      return;
    }

    if (cursor.classList.contains("isScrollMouse")) {
      cursor.classList.remove("isScrollMouse");
      setInteractiveState(lastElement);
    }
  };

  const render = () => {
    syncScrollCursor();

    current.x += (target.x - current.x) * 0.24;
    current.y += (target.y - current.y) * 0.24;
    current.width += (target.width - current.width) * 0.28;
    current.height += (target.height - current.height) * 0.28;

    cursor.style.width = `${current.width.toFixed(2)}px`;
    cursor.style.height = `${current.height.toFixed(2)}px`;
    cursor.style.transform = `translate3d(${(current.x - current.width / 2).toFixed(2)}px, ${(current.y - current.height / 2).toFixed(2)}px, 0)`;

    raf = requestAnimationFrame(render);
  };

  document.addEventListener(
    "mousemove",
    (event) => {
      target.x = event.clientX;
      target.y = event.clientY;
      cursor.classList.add("isEnter");
      setInteractiveState(event.target);
    },
    { passive: true },
  );

  document.addEventListener(
    "pointerover",
    (event) => {
      cursor.classList.add("isEnter");
      setInteractiveState(event.target);
    },
    { passive: true },
  );

  document.addEventListener("pointerleave", () => {
    lastElement = null;
    cursor.classList.remove("isEnter", "isHover", "hasLabel", "isScrollMouse");
    label.textContent = "";
    target.width = 10;
    target.height = 10;
  });

  const teardown = () => {
    if (finePointer.matches && !reduceMotion.matches) return;
    cancelAnimationFrame(raf);
    document.documentElement.classList.remove("custom-cursor-active");
    cursor.remove();
  };

  raf = requestAnimationFrame(render);
  finePointer.addEventListener?.("change", teardown);
  reduceMotion.addEventListener?.("change", teardown);
});
