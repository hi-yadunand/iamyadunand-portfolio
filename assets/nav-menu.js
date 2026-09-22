const ready = (callback) => {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", callback, { once: true });
  } else {
    callback();
  }
};

ready(() => {
  const header = document.querySelector("[data-header]");
  const toggle = document.querySelector("[data-nav-toggle]");
  const menu = document.querySelector("[data-nav-menu]");
  const themeToggle = document.querySelector("[data-theme-toggle]");
  if (!header || !toggle || !menu) return;

  const desktop = window.matchMedia("(min-width: 832px)");

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
  };

  toggle.addEventListener("click", () => {
    const isOpen = header.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
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
});
