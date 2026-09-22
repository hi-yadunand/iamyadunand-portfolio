const ready = (callback) => {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", callback, { once: true });
  } else {
    callback();
  }
};

ready(() => {
  const header = document.querySelector("[data-header]");
  const hero = document.querySelector("[data-hero]");
  const horizontalSection = document.querySelector("[data-horizontal-works]");
  const toggle = document.querySelector("[data-nav-toggle]");
  const menu = document.querySelector("[data-nav-menu]");
  const themeToggle = document.querySelector("[data-theme-toggle]");
  if (!header || !toggle || !menu) return;

  const desktop = window.matchMedia("(min-width: 832px)");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let scrollRaf = 0;
  let motionRaf = 0;
  let lastScrollY = Math.max(0, window.scrollY || 0);
  let currentOffset = 0;
  let targetOffset = 0;

  const setHeaderOffset = (offset, headerHeight) => {
    header.style.setProperty("--header-scroll-offset", `${offset.toFixed(2)}px`);
    header.classList.toggle("is-scroll-hidden", offset <= -headerHeight + 1);
  };

  const isHorizontalSectionActive = () => {
    if (!horizontalSection) return false;

    const rect = horizontalSection.getBoundingClientRect();
    const viewportHeight =
      window.visualViewport?.height ||
      window.innerHeight ||
      document.documentElement.clientHeight;

    return rect.top < viewportHeight && rect.bottom > 0;
  };

  const renderHeaderOffset = () => {
    motionRaf = 0;

    const headerHeight = header.getBoundingClientRect().height || 104;
    currentOffset += (targetOffset - currentOffset) * 0.16;

    if (Math.abs(currentOffset - targetOffset) < 0.2) {
      currentOffset = targetOffset;
    }

    setHeaderOffset(currentOffset, headerHeight);

    if (Math.abs(currentOffset - targetOffset) > 0.2) {
      motionRaf = requestAnimationFrame(renderHeaderOffset);
    }
  };

  const requestHeaderMotion = () => {
    if (motionRaf) return;
    motionRaf = requestAnimationFrame(renderHeaderOffset);
  };

  const applyTheme = (isDark) => {
    const root = document.documentElement;
    const label = themeToggle?.querySelector(".header__theme-toggle-text");

    root.dataset.theme = isDark ? "dark" : "light";
    if (themeToggle) {
      themeToggle.setAttribute("aria-pressed", String(isDark));
    }
    if (label) {
      label.textContent = isDark ? "Light" : "Dark";
    }
    localStorage.setItem("site-theme", isDark ? "dark" : "light");
  };

  const storedTheme = localStorage.getItem("site-theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const initialDark = storedTheme ? storedTheme === "dark" : prefersDark;
  applyTheme(initialDark);

  const closeMenu = () => {
    header.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    requestHeaderUpdate();
  };

  const updateHeaderVisibility = () => {
    scrollRaf = 0;
    const headerHeight = header.getBoundingClientRect().height || 104;

    if (!hero || reduceMotion.matches || header.classList.contains("is-open")) {
      header.style.removeProperty("--header-scroll-offset");
      header.classList.remove("is-scroll-hidden");
      currentOffset = 0;
      targetOffset = 0;
      return;
    }

    const currentScrollY = Math.max(0, window.scrollY || 0);
    const delta = currentScrollY - lastScrollY;
    const heroBottom = hero.getBoundingClientRect().bottom;

    if (heroBottom > headerHeight) {
      currentOffset = 0;
      targetOffset = 0;
      setHeaderOffset(currentOffset, headerHeight);
    } else if (heroBottom > 0) {
      currentOffset = Math.min(0, Math.max(-headerHeight, heroBottom - headerHeight));
      targetOffset = currentOffset;
      setHeaderOffset(currentOffset, headerHeight);
    } else if (isHorizontalSectionActive()) {
      targetOffset = -headerHeight;
      requestHeaderMotion();
    } else if (delta < -4) {
      targetOffset = 0;
      requestHeaderMotion();
    } else if (delta > 4) {
      targetOffset = -headerHeight;
      requestHeaderMotion();
    }

    if (Math.abs(delta) > 1) {
      lastScrollY = currentScrollY;
    }
  };

  function requestHeaderUpdate() {
    if (scrollRaf) return;
    scrollRaf = requestAnimationFrame(updateHeaderVisibility);
  }

  toggle.addEventListener("click", () => {
    const isOpen = header.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
    requestHeaderUpdate();
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  themeToggle?.addEventListener("click", () => {
    const nextDark = document.documentElement.dataset.theme !== "dark";
    applyTheme(nextDark);
  });

  desktop.addEventListener?.("change", (event) => {
    if (event.matches) closeMenu();
  });

  window.addEventListener("scroll", requestHeaderUpdate, { passive: true });
  window.addEventListener("resize", requestHeaderUpdate);
  window.addEventListener("orientationchange", requestHeaderUpdate);
  reduceMotion.addEventListener?.("change", requestHeaderUpdate);
  requestHeaderUpdate();
});
