// Keep the homepage project cursor independent of scroll animation setup.
const cursor = document.querySelector("[data-project-cursor]");

if (cursor) {
  const finePointer = window.matchMedia("(pointer: fine)");
  let pointer = null;
  let activeLabel = "";
  let shown = false;

  const hide = () => {
    if (shown) cursor.style.opacity = "0";
    if (activeLabel) cursor.textContent = "";
    shown = false;
    activeLabel = "";
  };

  const update = (element) => {
    const link = element?.closest?.("[data-cursor-label]");
    const label = link?.dataset.cursorLabel?.trim();
    if (!finePointer.matches || !label || !pointer) {
      hide();
      return;
    }

    if (activeLabel !== label) cursor.textContent = label;
    activeLabel = label;
    cursor.style.transform = `translate3d(${pointer.x}px, ${pointer.y}px, 0)`;
    if (!shown) cursor.style.opacity = "1";
    shown = true;
  };

  window.addEventListener("pointermove", (event) => {
    if (event.pointerType === "touch") return;
    pointer = { x: event.clientX, y: event.clientY };
    update(event.target);
  }, { passive: true });

  // Recheck the link beneath a stationary pointer when the page scrolls.
  window.addEventListener("scroll", () => {
    if (pointer) update(document.elementFromPoint(pointer.x, pointer.y));
  }, { passive: true });

  document.documentElement.addEventListener("pointerleave", () => {
    pointer = null;
    hide();
  });
  window.addEventListener("blur", () => {
    pointer = null;
    hide();
  });
  finePointer.addEventListener("change", hide);
  hide();
}
