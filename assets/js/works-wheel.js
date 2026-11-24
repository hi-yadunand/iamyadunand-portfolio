import { scrollToSitePosition } from "./site-scroll.js";

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

function initWorksWheel(section) {
  const register = section.closest(".works-register");
  const panel = register.querySelector(".shell");
  const viewport = section.querySelector("[data-wheel-viewport]");
  const wheel = section.querySelector("[data-wheel-cards]");
  const heading = section.querySelector(".works-wheel__heading");
  const index = section.querySelector("[data-wheel-index]");
  const details = section.querySelector("[data-wheel-details]");
  const title = section.querySelector("[data-wheel-current]");
  const meta = section.querySelector("[data-wheel-current-meta]");
  const cards = Array.from(section.querySelectorAll("[data-wheel-card]"), (item) => {
    const name = item.querySelector("[data-wheel-name]").textContent;
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = name;
    const entry = document.createElement("li");
    entry.append(button);
    index.append(entry);
    return { item, name, button, meta: item.querySelector("[data-wheel-meta]").textContent };
  });
  if (!cards.length) return;

  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const wide = matchMedia("(min-width: 56rem), (min-width: 42rem) and (max-height: 34rem)");
  let scrollLeadIn = 0;
  let introDistance = 1;
  let scrollStep = 1;
  let scrollDistance = 0;
  let turn = 0;
  let paintedTurn;
  let selected = -1;
  let frame = 0;
  let lastFrame = 0;
  let drag;
  let moved = false;
  let cardHeight = 1;
  let ringRadius = 1;
  let ringScale = 1;

  function updateSelection(position) {
    if (position === selected) return;
    selected = position;
    const active = cards[position - 1];
    section.toggleAttribute("data-wheel-open", Boolean(active));
    title.textContent = active?.name ?? "";
    meta.textContent = active?.meta ?? "";
    cards.forEach(({ item, button }, index) => {
      const inactive = Boolean(active) && item !== active.item;
      if (inactive && item.contains(document.activeElement)) viewport.focus({ preventScroll: true });
      item.inert = inactive;
      button.setAttribute("aria-pressed", String(index + 1 === position));
    });
  }

  function render(now) {
    frame = 0;
    if (!reduced.matches) {
      const { top, bottom } = register.getBoundingClientRect();
      const offset = -top;
      const progress = offset - scrollLeadIn;
      const destination = progress < introDistance
        ? clamp(progress / introDistance, 0, 1)
        : Math.min(cards.length, 1 + (progress - introDistance) / scrollStep);
      const gap = destination - turn;
      if (Math.abs(gap) < 0.003 || bottom <= 0 || top >= window.innerHeight) {
        turn = destination;
        lastFrame = 0;
      } else {
        // Catch up faster during a fling while keeping every visible step continuous.
        const elapsed = lastFrame ? Math.min(now - lastFrame, 34) : 16;
        const maxTurn = elapsed * (0.0038 + Math.min(Math.abs(gap), 3) * 0.002);
        turn += clamp(gap * (1 - Math.exp(-elapsed / 120)), -maxTurn, maxTurn);
        lastFrame = now;
        requestRender();
      }
    }
    if (paintedTurn === turn) return;
    paintedTurn = turn;
    const intro = clamp(turn, 0, 1);
    const morph = intro * intro * (3 - 2 * intro);
    const position = Math.max(0, turn - 1);
    const drumRadius = cardHeight * 2.22;
    const bow = cardHeight * 1.82;
    heading.style.opacity = 1 - morph;
    wheel.style.transform = `translateZ(${-morph * drumRadius}px)`;

    cards.forEach(({ item }, index) => {
      // Tangent cards circle the heading before turning onto a bowed 3D drum.
      const offset = index - position;
      const pitch = offset * 40;
      const arc = -bow * (1 - Math.cos(pitch * Math.PI / 180));
      item.style.transform = `translateX(${morph * arc}px) rotateZ(${(1 - morph) * index * 360 / cards.length}deg) translateY(${-(1 - morph) * ringRadius}px) rotateX(${morph * pitch}deg) translateZ(${morph * drumRadius}px) scale(${ringScale + (1 - ringScale) * morph})`;
      const visible = clamp((1.85 - Math.abs(offset)) / 0.25, 0, 1);
      item.style.opacity = morph > 0.55 ? 1 - ((morph - 0.55) / 0.45) * (1 - visible) : 1;
    });

    updateSelection(clamp(Math.round(turn), 0, cards.length));
  }

  function requestRender() {
    if (!frame) frame = requestAnimationFrame(render);
  }

  function choose(position, immediate = false) {
    const destination = clamp(position, 0, cards.length);
    if (reduced.matches) {
      turn = Math.round(destination);
    } else {
      const start = window.scrollY + register.getBoundingClientRect().top;
      const travel = destination <= 1 ? introDistance * destination : introDistance + scrollStep * (destination - 1);
      const offset = destination > 0 ? scrollLeadIn + travel : 0;
      scrollToSitePosition(start + offset, immediate);
      if (immediate) turn = destination;
    }
    requestRender();
  }

  function measure() {
    const width = viewport.clientWidth;
    const height = viewport.clientHeight;
    if (!width || !height) return;
    scrollLeadIn = Math.round(clamp(window.innerHeight * 0.12, 64, 120));
    scrollStep = Math.round(clamp(window.innerHeight * 0.36, 175, 340));
    introDistance = Math.round(scrollStep * 1.55);
    // Give the last project a little scroll room for the eased motion to settle.
    const endHold = Math.round(clamp(window.innerHeight * 0.25, 125, 220));
    scrollDistance = scrollLeadIn + introDistance + scrollStep * (cards.length - 1) + endHold;
    register.style.setProperty("--register-scroll-distance", `${scrollDistance}px`);
    const cardWidth = Math.min(width * (wide.matches ? 0.35 : 0.79), height * 0.56);
    cardHeight = cardWidth / 1.5;
    ringRadius = Math.min(width * 0.32, height * 0.39, cardHeight * 1.28);
    ringScale = clamp(2 * Math.PI * ringRadius * 0.82 / (cards.length * cardWidth), 0.16, 0.75);
    viewport.style.setProperty("--wheel-card-width", `${cardWidth}px`);
    viewport.style.setProperty("--wheel-card-height", `${cardHeight}px`);
    viewport.style.setProperty("--wheel-perspective", `${cardHeight * 2.7}px`);
    const viewportOffset = viewport.offsetTop + viewport.parentElement.offsetTop;
    const inset = Math.min(height / 2, ringRadius + cardHeight * ringScale * 0.7);
    const center = reduced.matches ? height / 2 : clamp(panel.clientHeight / 2 - viewportOffset, inset, height - inset);
    viewport.style.setProperty("--wheel-center", `${center}px`);
    paintedTurn = undefined;
    requestRender();
  }

  viewport.addEventListener("pointerdown", (event) => {
    if (!event.isPrimary || event.button !== 0) return;
    moved = false;
    const top = register.getBoundingClientRect().top;
    if (!reduced.matches && (top > 1 || top < -scrollDistance - 1)) return;
    const axis = event.pointerType === "touch" ? "clientX" : "clientY";
    drag = { id: event.pointerId, axis, start: turn, position: turn, from: event[axis] };
  });

  viewport.addEventListener("pointermove", (event) => {
    if (drag?.id !== event.pointerId) return;
    const distance = drag.from - event[drag.axis];
    if (!moved && Math.abs(distance) < 8) return;
    if (!moved) {
      viewport.setPointerCapture(event.pointerId);
      section.setAttribute("data-wheel-dragging", "");
      moved = true;
    }
    drag.position = drag.start + distance / (drag.axis === "clientX" ? 155 : 285);
    choose(drag.position, true);
  });

  function finishDrag(event) {
    if (drag?.id !== event.pointerId) return;
    if (moved) {
      const nearest = Math.round(drag.position);
      const delta = drag.position - drag.start;
      choose(Math.abs(delta) > 0.15 && nearest === Math.round(drag.start) ? nearest + Math.sign(delta) : nearest);
    }
    drag = undefined;
    section.removeAttribute("data-wheel-dragging");
  }

  viewport.addEventListener("pointerup", finishDrag);
  viewport.addEventListener("pointercancel", finishDrag);
  viewport.addEventListener("lostpointercapture", finishDrag);
  viewport.addEventListener("pointerleave", (event) => {
    if (!moved) finishDrag(event);
  });
  viewport.addEventListener("dragstart", (event) => event.preventDefault());
  viewport.addEventListener("click", (event) => {
    if (moved && event.detail) {
      event.preventDefault();
      moved = false;
    }
  }, { capture: true });

  viewport.addEventListener("keydown", (event) => {
    const step = Math.round(turn);
    const positions = { ArrowDown: step + 1, ArrowRight: step + 1, ArrowUp: step - 1, ArrowLeft: step - 1, Home: 0, End: cards.length };
    if (positions[event.key] === undefined || event.altKey || event.ctrlKey || event.metaKey) return;
    event.preventDefault();
    choose(positions[event.key], true);
  });

  cards.forEach(({ button }, index) => button.addEventListener("click", () => choose(index + 1)));
  function configureScroll() {
    lastFrame = 0;
    if (reduced.matches) turn = Math.round(turn);
    register.toggleAttribute("data-register-scroll", !reduced.matches);
    measure();
  }

  window.addEventListener("scroll", requestRender, { passive: true });
  window.addEventListener("resize", measure);
  window.addEventListener("pageshow", requestRender);
  reduced.addEventListener("change", configureScroll);
  section.setAttribute("data-wheel-ready", "");
  viewport.setAttribute("role", "group");
  viewport.setAttribute("aria-label", "Project wheel");
  viewport.setAttribute("aria-describedby", "register-instructions");
  viewport.tabIndex = 0;
  index.hidden = false;
  details.hidden = false;
  new ResizeObserver(measure).observe(viewport);
  configureScroll();
  updateSelection(0);
}

document.querySelectorAll("[data-works-wheel]").forEach(initWorksWheel);
