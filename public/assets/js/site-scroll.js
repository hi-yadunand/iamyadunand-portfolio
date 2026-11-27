// The generated base module passes its existing library instances here.
// ESM caches this module once per document; no second library/runtime is loaded.
let runtime;
const ENTRY_KEY = "portfolio-page-entry";
const HEADER_OFFSET = -80;

export function anchorTarget(doc, hash) {
  if (!hash || hash === "#") return 0;
  let id;
  try { id = decodeURIComponent(hash.slice(1)); } catch { return null; }
  const target = doc.getElementById(id) || doc.getElementsByName(id)[0];
  return target || (id === "top" ? 0 : null);
}

export function navigationURL(event, currentURL) {
  if (event.defaultPrevented || event.button !== 0 ||
      event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return null;
  const link = event.target?.closest?.("a[href]");
  if (!link || link.hasAttribute("download") ||
      (link.target && link.target.toLowerCase() !== "_self") ||
      link.relList?.contains("external") ||
      link.closest("[data-native-navigation]") ||
      link.closest("[data-no-transition]") ||
      link.hasAttribute("data-no-transition")) return null;
  const href = link.getAttribute("href");
  if (!href?.trim()) return null;
  let url;
  try { url = new URL(href, currentURL); } catch { return null; }
  if (!/^https?:$/.test(url.protocol) || url.origin !== new URL(currentURL).origin) return null;
  return { link, url };
}

function focusTarget(target) {
  const element = target === 0 ? document.querySelector("main") : target;
  if (!element?.focus) return;
  const temporary = !element.hasAttribute("tabindex");
  if (temporary) element.setAttribute("tabindex", "-1");
  element.focus({ preventScroll: true });
  if (temporary) element.addEventListener("blur", () => element.removeAttribute("tabindex"), { once: true });
}

function initProjectsTunnel(tunnel, gsap, signal) {
  const stage = tunnel.querySelector(".projects-tunnel__stage");
  const copy = tunnel.querySelector(".projects-tunnel__copy");
  const hint = tunnel.querySelector(".projects-tunnel__hint");
  const plane = tunnel.querySelector(".projects-tunnel__cards");
  const cards = [...plane.children];
  const wide = window.matchMedia("(min-width: 48rem)");
  const media = gsap.matchMedia();

  media.add("(prefers-reduced-motion: no-preference)", () => {
    tunnel.setAttribute("data-projects-tunnel-active", "");
    const timeline = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: tunnel,
        start: "top top",
        end: "bottom 45%",
        scrub: true,
        invalidateOnRefresh: true,
      },
    });
    const cardDuration = 0.56;
    const stagger = (1 - cardDuration) / Math.max(1, cards.length - 1);
    for (const [index, card] of cards.entries()) {
      const angle = (18 + index * 137.5) * Math.PI / 180;
      const start = index * stagger;
      gsap.set(card, {
        "--project-orbit-x": `${Math.cos(angle) * (28 + (index % 3) * 8)}%`,
        "--project-orbit-y": `${Math.sin(angle) * (26 + (index % 2) * 9)}%`,
        xPercent: -50,
        yPercent: -50,
        rotation: (index % 2 === 0 ? 1 : -1) * (3 + (index % 5) * 2),
        opacity: 0,
      });
      timeline
        .fromTo(card, { z: () => wide.matches ? -1700 : -1050 }, {
          z: () => wide.matches ? 440 : 310,
          duration: cardDuration,
        }, start)
        .fromTo(card, { opacity: 0 }, { opacity: 1, duration: 0.1 }, start)
        .to(card, { opacity: 0, duration: 0.12 }, start + cardDuration - 0.12);
    }
    timeline
      .fromTo(copy, { scale: 1 }, { scale: 1.08, duration: 0.8 }, 0)
      .to(copy, { opacity: 0, duration: 0.2 }, 0.8);
    gsap.to(hint, {
      opacity: 0,
      ease: "none",
      scrollTrigger: {
        trigger: tunnel,
        start: "top top",
        end: "top -25%",
        scrub: true,
      },
    });

    const panX = gsap.quickTo(plane, "x", { duration: 0.65, ease: "power3.out" });
    const panY = gsap.quickTo(plane, "y", { duration: 0.65, ease: "power3.out" });
    const move = (event) => {
      if (event.pointerType !== "mouse") return;
      const { left, top, width, height } = stage.getBoundingClientRect();
      panX((0.5 - (event.clientX - left) / width) * 44);
      panY((0.5 - (event.clientY - top) / height) * 44);
    };
    const reset = () => {
      panX(0);
      panY(0);
    };
    stage.addEventListener("pointermove", move, { passive: true });
    stage.addEventListener("pointerleave", reset);
    return () => {
      stage.removeEventListener("pointermove", move);
      stage.removeEventListener("pointerleave", reset);
      tunnel.removeAttribute("data-projects-tunnel-active");
    };
  });
  signal.addEventListener("abort", () => media.revert(), { once: true });
}

export function initSiteScroll({ Lenis, gsap, ScrollTrigger }) {
  if (runtime) return runtime.lenis;
  const controller = new AbortController();
  const { signal } = controller;
  const root = document.documentElement;
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const navigationType = performance.getEntriesByType?.("navigation")[0]?.type;
  const register = document.querySelector(".works-register");
  // anchors:false gives the delegated handler exclusive ownership of fragments.
  // Nested/horizontal containers and touch retain their own native scrolling.
  const lenis = new Lenis({
    duration: 1.2,
    easing: (progress) => Math.min(1, 1.001 - 2 ** (-10 * progress)),
    smoothWheel: !motion.matches,
    syncTouch: false,
    autoRaf: false,
    anchors: false,
    allowNestedScroll: true,
    respectReducedMotion: true,
    virtualScroll(gesture) {
      const { event, deltaY } = gesture;
      if (motion.matches || event.type !== "wheel" || event.ctrlKey || !deltaY ||
          !register?.hasAttribute("data-register-scroll")) return;
      const travel = Number.parseFloat(register.style.getPropertyValue("--register-scroll-distance"));
      if (!(travel > 0)) return;
      const current = window.scrollY;
      const direction = Math.sign(deltaY);
      const target = lenis.targetScroll;
      const start = current + register.getBoundingClientRect().top;
      const end = start + travel;
      const entry = direction > 0 ? start : end;
      const exit = direction > 0 ? end : start;
      if (direction * (exit - current) <= 0 || direction * (target + deltaY - entry) <= 0) return;

      // Limit the queue for the project register. The footer camera catches up to the full scroll.
      const lead = Math.max(0, direction * (entry - current)) + window.innerHeight * 0.6;
      const available = lead - direction * (target - current);
      // A zero delta would let the browser scroll natively while Lenis is still catching up.
      gesture.deltaY = direction * Math.min(Math.abs(deltaY), Math.max(Number.EPSILON, available));
    },
  });
  let ticking = false;
  let suspended = false;
  let refresh;
  let syncFrame = 0;
  let exitAnimation;
  let entryAnimation;
  let navigating = false;
  let pendingURL;
  let recovery = 0;
  let userInteracted = false;
  let initialTop = root.hasAttribute("data-reload-top");
  let initialHash = Boolean(location.hash) && !["reload", "back_forward"].includes(navigationType);
  const initialInteraction = new AbortController();
  const finishInitialAlignment = () => {
    initialHash = false;
    initialTop = false;
    if (root.hasAttribute("data-reload-top")) {
      root.removeAttribute("data-reload-top");
      history.scrollRestoration = "auto";
    }
    initialInteraction.abort();
  };

  const tick = (seconds) => lenis.raf(seconds * 1000);
  const syncTicker = () => {
    // With the ticker detached, reduced-motion wheel events must stay native
    // instead of entering Lenis's animation queue.
    lenis.options.smoothWheel = !motion.matches;
    const active = !motion.matches && !document.hidden && !suspended;
    if (active === ticking) return;
    ticking = active;
    if (active) gsap.ticker.add(tick);
    else gsap.ticker.remove(tick);
  };
  gsap.ticker.lagSmoothing(0);
  lenis.on("scroll", ScrollTrigger.update);

  const projectsTunnel = document.querySelector("[data-projects-tunnel]");
  if (projectsTunnel) initProjectsTunnel(projectsTunnel, gsap, signal);

  const recentWork = document.querySelector("[data-recent-work]");
  if (recentWork) {
    const media = gsap.matchMedia();
    const wide = window.matchMedia("(min-width: 48rem)");
    media.add("(prefers-reduced-motion: no-preference)", () => {
      for (const card of recentWork.querySelectorAll("[data-project-entrance]")) {
        const direction = card.dataset.projectEntrance;
        const side = { left: -105, right: 105 }[direction] ?? 0;
        const preview = card.querySelector("[data-project-preview]");
        const caption = card.querySelector(".project-card__caption");

        // Measure from the static grid cell so the preview settles just before the viewport center.
        gsap.timeline({
          defaults: { duration: 1, ease: "sine.out" },
          scrollTrigger: {
            trigger: card.parentElement,
            start: "top bottom",
            end: () => `top+=${preview.offsetHeight / 2} 57%`,
            scrub: 0.35,
            invalidateOnRefresh: true,
          },
        })
          .fromTo(card, {
            xPercent: () => wide.matches ? side : 0,
            yPercent: () => wide.matches && side ? 0 : 42,
            scale: 1.4, rotateX: 16, transformPerspective: 1000,
          }, { xPercent: 0, yPercent: 0, scale: 1, rotateX: 0, clearProps: "transform" }, 0)
          .fromTo(card, { opacity: 0 }, { opacity: 1, duration: 0.36 }, 0)
          .fromTo(preview, { filter: "blur(7px)" }, { filter: "blur(0px)", clearProps: "filter" }, 0)
          .fromTo(caption, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: "sine.inOut" }, 0.5);
      }
    });
    signal.addEventListener("abort", () => media.revert(), { once: true });
  }

  const workflow = document.querySelector("[data-workflow]");
  if (workflow) {
    const path = workflow.querySelector("[data-workflow-path]");
    const svg = path.ownerSVGElement;
    const mobile = window.matchMedia("(width < 64rem)");
    const desktopPath = path.getAttribute("d");
    const desktopViewBox = svg.getAttribute("viewBox");
    const fitStroke = () => {
      if (!mobile.matches) {
        if (svg.hasAttribute("data-workflow-fitted")) {
          svg.setAttribute("viewBox", desktopViewBox);
          path.setAttribute("d", desktopPath);
          svg.removeAttribute("data-workflow-fitted");
        }
        return;
      }

      const width = svg.clientWidth;
      const height = svg.clientHeight;
      if (!width || height < 72) return;

      // Draw the mobile curl in CSS pixels and stretch only the spacing between bends.
      svg.setAttribute("viewBox", `${24 - width / 2} 0 ${width} ${height}`);
      let curve = "M22 10 C38 10 42 33 26 36 C12 40 8 21 20 20 C31 19 32 40 32 54";
      const bends = [16, 32, 16, 32, 16, 32, 24];
      const distance = (height - 66) / bends.length;
      let x = 32;
      let y = 54;
      for (const bend of bends) {
        const nextY = y + distance;
        curve += ` C${x} ${y + distance * 0.45} ${bend} ${nextY - distance * 0.45} ${bend} ${nextY}`;
        x = bend;
        y = nextY;
      }
      path.setAttribute("d", curve);
      svg.setAttribute("data-workflow-fitted", "");
    };
    fitStroke();
    const strokeResize = "ResizeObserver" in window ? new ResizeObserver(fitStroke) : null;
    strokeResize?.observe(svg);
    mobile.addEventListener("change", fitStroke, { signal });
    window.addEventListener("resize", fitStroke, { signal });

    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(path, { attr: { "stroke-dashoffset": () => mobile.matches ? 0.97 : 0.9 } }, {
        attr: { "stroke-dashoffset": 0 },
        ease: "none",
        scrollTrigger: {
          trigger: workflow,
          start: "top 82%",
          end: "bottom 90%",
          scrub: 0.35,
          invalidateOnRefresh: true,
        },
      });
      for (const step of workflow.querySelectorAll(".workflow__step")) {
        gsap.fromTo(step.children, { opacity: 0, y: 20 }, {
          opacity: 1,
          y: 0,
          ease: "sine.out",
          clearProps: "opacity,transform",
          scrollTrigger: {
            trigger: step,
            start: "top 75%",
            end: "top 53%",
            scrub: 0.35,
          },
        });
      }
    });
    signal.addEventListener("abort", () => {
      strokeResize?.disconnect();
      media.revert();
    }, { once: true });
  }

  const transition = document.querySelector("[data-record-transition]");
  if (transition) {
    const outgoing = transition.querySelector(".record-transition__outgoing");
    const incoming = transition.querySelector(".record-transition__incoming");
    const record = incoming.firstElementChild;
    const media = gsap.matchMedia();
    // Keep the content inside the dark section at both ends of the scroll.
    const distance = () => Math.min(
      window.innerHeight * 0.085,
      Number.parseFloat(window.getComputedStyle(record).paddingTop) * 0.75,
    );
    media.add("(prefers-reduced-motion: no-preference)", () => {
      transition.setAttribute("data-record-transition-active", "");
      const measure = () => {
        const pinTop = Math.min(0, window.innerHeight - outgoing.offsetHeight);
        transition.style.setProperty("--record-transition-pin-top", `${pinTop}px`);
      };
      measure();
      const resize = "ResizeObserver" in window ? new ResizeObserver(measure) : null;
      resize?.observe(outgoing);
      window.addEventListener("resize", measure);

      gsap.fromTo(record, { "--record-edge-progress": 1 }, {
        "--record-edge-progress": 0,
        ease: "none",
        scrollTrigger: {
          trigger: incoming,
          start: "top bottom",
          end: "top 30%",
          scrub: true,
        },
      });

      gsap.fromTo(record.firstElementChild, { y: distance }, {
        y: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: incoming,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      const revealFocusedService = (event) => {
        const top = incoming.getBoundingClientRect().top;
        if (event.target.matches(":focus-visible") && top < window.innerHeight) {
          scrollToSitePosition(window.scrollY + top - window.innerHeight, true);
        }
      };
      outgoing.addEventListener("focusin", revealFocusedService);
      return () => {
        resize?.disconnect();
        window.removeEventListener("resize", measure);
        outgoing.removeEventListener("focusin", revealFocusedService);
        transition.removeAttribute("data-record-transition-active");
        transition.style.removeProperty("--record-transition-pin-top");
      };
    });
    signal.addEventListener("abort", () => media.revert(), { once: true });
  }

  const closeMenu = () => {
    if (root.hasAttribute("data-menu-open")) document.querySelector("[data-menu-toggle]")?.click();
  };
  const alignInitialHash = () => {
    if (!initialHash || userInteracted) return;
    const target = anchorTarget(document, location.hash);
    if (target !== null) lenis.scrollTo(target, { offset: HEADER_OFFSET, immediate: true, force: true });
  };
  const requestRefresh = () => {
    if (signal.aborted || suspended) return;
    refresh?.kill();
    refresh = gsap.delayedCall(0.08, () => {
      lenis.resize();
      ScrollTrigger.refresh();
      alignInitialHash();
      if (initialTop && !userInteracted) lenis.scrollTo(0, { immediate: true, force: true });
      if (document.readyState === "complete" && document.fonts?.status !== "loading" &&
          !root.hasAttribute("data-preloader-active")) finishInitialAlignment();
    });
  };
  const syncNativePosition = () => {
    lenis.scrollTo(window.scrollY, { immediate: true, force: true });
    lenis.time = 0;
    ScrollTrigger.update();
  };
  const afterNativeRestore = () => {
    cancelAnimationFrame(syncFrame);
    // One frame after the browser restores history; this is not a second loop.
    syncFrame = requestAnimationFrame(() => {
      syncFrame = 0;
      if (!signal.aborted) { lenis.resize(); syncNativePosition(); }
    });
  };

  const resetExit = () => {
    clearTimeout(recovery);
    exitAnimation?.cancel();
    exitAnimation = undefined;
    navigating = false;
    pendingURL = undefined;
    root.removeAttribute("data-site-leaving");
  };
  const revealRestoredPage = () => {
    if (motion.matches || root.hasAttribute("data-native-page-transitions") || !document.body.animate) return;
    entryAnimation?.cancel();
    entryAnimation = document.body.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: 180, easing: "ease-out",
    });
    entryAnimation.finished.catch(() => {});
  };
  const leave = (url) => {
    navigating = true;
    pendingURL = url;
    // Remove a fallback entrance before the outgoing transition starts.
    root.removeAttribute("data-site-enter");
    entryAnimation?.cancel();
    const navigate = () => {
      if (!navigating || signal.aborted) return;
      try {
        sessionStorage.setItem(ENTRY_KEY, JSON.stringify({ to: url.href, from: location.href, at: Date.now() }));
      } catch { /* Navigation also works when storage is unavailable. */ }
      try { location.assign(url.href); } catch { resetExit(); return; }
      // Recovery only: never wait on this timer before navigating. It avoids a
      // frozen source document if navigation is cancelled or fails.
      recovery = setTimeout(resetExit, 1800);
    };
    if (root.hasAttribute("data-native-page-transitions")) {
      // Navigation begins now; the browser animates both documents together.
      navigate();
      return;
    }
    root.setAttribute("data-site-leaving", "");
    const origin = `50% ${window.scrollY + window.innerHeight / 2}px`;
    exitAnimation = document.body.animate([
      { transform: "scale(1)", filter: "brightness(1)", transformOrigin: origin },
      { transform: "scale(0.95)", filter: "brightness(0.6)", transformOrigin: origin },
    ], { duration: 700, easing: "cubic-bezier(0.215, 0.61, 0.355, 1)", fill: "forwards" });
    exitAnimation.finished.then(navigate, navigate);
  };

  document.addEventListener("click", (event) => {
    const destination = navigationURL(event, location.href);
    if (!destination) return;
    const { link, url } = destination;
    const isPageLink = !url.hash && !link.getAttribute("href").startsWith("#");
    const refreshCurrentPage = url.pathname === location.pathname &&
      (!url.search || url.search === location.search);
    // Current-page links reload; explicit fragments keep their in-page target.
    if (isPageLink && refreshCurrentPage) {
      event.preventDefault();
      if (navigating) return;
      finishInitialAlignment();
      closeMenu();
      try {
        sessionStorage.removeItem("yadunand-loaded");
        sessionStorage.removeItem(ENTRY_KEY);
      } catch { /* Navigation also works when storage is unavailable. */ }
      if (url.pathname === location.pathname && url.search === location.search) {
        // Removing only a fragment with assign() would stay in this document.
        if (location.hash) history.replaceState(history.state, "", url.href);
        location.reload();
      }
      else location.assign(url.href);
      return;
    }
    const samePage = (url.pathname === location.pathname && url.search === location.search) ||
      (url.pathname === "/" && location.pathname === "/");
    if (samePage) {
      const target = anchorTarget(document, url.hash);
      if (target === null) return; // Leave unknown/text fragments to the browser.
      event.preventDefault();
      if (navigating) return;
      finishInitialAlignment();
      closeMenu();
      if (url.href !== location.href) {
        try { history.pushState(history.state, "", url.href); } catch { location.assign(url.href); return; }
      }
      lenis.scrollTo(target, {
        offset: target === 0 ? 0 : HEADER_OFFSET,
        immediate: motion.matches,
        force: true,
        onComplete: () => focusTarget(target),
      });
      return;
    }
    // Only HTML/document navigation receives a transition. Assets and explicit
    // opt-outs keep the browser's normal handling.
    const htmlPage = /(?:\/|\.html?|\/[^/.]+)$/i.test(url.pathname);
    if (!htmlPage || link.hasAttribute("data-no-transition") || motion.matches ||
        (!root.hasAttribute("data-native-page-transitions") && !document.body.animate)) return;
    event.preventDefault();
    if (!navigating) leave(url);
  }, { signal });

  document.addEventListener("keydown", (event) => {
    if (event.defaultPrevented || event.ctrlKey || event.metaKey || event.altKey ||
        lenis.isStopped || lenis.isScrolling !== "smooth" ||
        !["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " ", "Tab"].includes(event.key) ||
        event.target?.closest?.("input, textarea, select, button, [contenteditable]")) return;
    // Cancel pending wheel/anchor inertia, then let the browser perform its
    // native keyboard scroll/focus action. Never prevent the key event.
    syncNativePosition();
  }, { signal });

  const markInteraction = () => { userInteracted = true; finishInitialAlignment(); };
  if (initialHash || initialTop) for (const type of ["wheel", "touchstart", "pointerdown", "keydown"]) {
    window.addEventListener(type, markInteraction, { passive: true, signal: initialInteraction.signal });
  }
  window.addEventListener("popstate", () => {
    finishInitialAlignment();
    resetExit();
    closeMenu();
    syncNativePosition(); // Stop a previous programmatic scroll first.
    afterNativeRestore();
  }, { signal });
  window.addEventListener("hashchange", afterNativeRestore, { signal });
  window.addEventListener("portfolio:scroll-to-top", () => {
    finishInitialAlignment();
    closeMenu();
    lenis.scrollTo(0, { immediate: true, force: true });
  }, { signal });
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) syncNativePosition();
    syncTicker();
  }, { signal });
  motion.addEventListener("change", () => {
    const destination = pendingURL;
    resetExit();
    entryAnimation?.cancel();
    root.removeAttribute("data-site-enter");
    syncNativePosition();
    syncTicker();
    if (destination) location.assign(destination.href);
  }, { signal });
  window.addEventListener("pageshow", (event) => {
    suspended = false;
    resetExit();
    syncTicker();
    if (event.persisted || navigationType === "back_forward") {
      finishInitialAlignment();
      root.removeAttribute("data-site-enter");
      closeMenu();
      afterNativeRestore();
      revealRestoredPage();
    }
    requestRefresh();
  }, { signal });
  const observer = "ResizeObserver" in window ? new ResizeObserver(requestRefresh) : null;
  const main = document.querySelector("main");
  if (main) observer?.observe(main);
  window.addEventListener("pagehide", (event) => {
    suspended = true;
    finishInitialAlignment();
    syncTicker();
    resetExit();
    entryAnimation?.cancel();
    refresh?.kill();
    cancelAnimationFrame(syncFrame);
    if (event.persisted) return;
    observer?.disconnect();
    lenis.destroy();
    controller.abort();
  }, { signal });

  // Native history restoration stays automatic except while a homepage reload
  // reveals its hero. Stop initial positioning once the visitor interacts.
  syncTicker();
  runtime = { lenis, requestRefresh };
  requestRefresh();
  // The fallback entrance is self-contained CSS, including if this module fails.
  document.addEventListener("animationend", (event) => {
    if (event.target === document.body && event.animationName === "site-page-enter") {
      root.removeAttribute("data-site-enter");
    }
  }, { signal });
  // A cached/slow module can execute after the CSS entrance has finished.
  // Finished fill-mode animations are still returned by getAnimations().
  if (root.hasAttribute("data-site-enter")) {
    const arrival = document.body.getAnimations?.().find((animation) => animation.animationName === "site-page-enter");
    arrival?.finished.then(
      () => root.removeAttribute("data-site-enter"),
      () => root.removeAttribute("data-site-enter"),
    );
  }
  return lenis;
}

export function requestSiteRefresh() {
  runtime?.requestRefresh();
}

export function scrollToSitePosition(position, immediate = false) {
  if (runtime) runtime.lenis.scrollTo(position, { immediate });
  else window.scrollTo({ top: position, behavior: immediate ? "instant" : "smooth" });
}
