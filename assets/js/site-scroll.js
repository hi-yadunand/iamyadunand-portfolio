// The generated base module passes its existing library instances here.
// ESM caches this module once per document; no second library/runtime is loaded.
let runtime;
const ENTRY_KEY = "portfolio-page-entry";
const HEADER_OFFSET = -72;

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

export function initSiteScroll({ Lenis, gsap, ScrollTrigger }) {
  if (runtime) return runtime.lenis;
  const controller = new AbortController();
  const { signal } = controller;
  const root = document.documentElement;
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const navigationType = performance.getEntriesByType?.("navigation")[0]?.type;
  // anchors:false gives the delegated handler exclusive ownership of fragments.
  // Nested/horizontal containers and touch retain their own native scrolling.
  const lenis = new Lenis({
    duration: 1.25,
    smoothWheel: !motion.matches,
    syncTouch: false,
    autoRaf: false,
    anchors: false,
    allowNestedScroll: true,
    respectReducedMotion: true,
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
