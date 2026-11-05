const header = document.querySelector("[data-site-header]");
const darkSections = [...document.querySelectorAll("[data-dark-section]")];
let scrollFrame = 0;

// Only respond to scrolling; there is no permanent animation loop.
const updateHeader = () => {
  scrollFrame = 0;
  if (!header) return;
  const headerMiddle = header.offsetHeight / 2;
  const onDark = darkSections.some((section) => {
    const rect = section.getBoundingClientRect();
    return rect.top <= headerMiddle && rect.bottom > headerMiddle;
  });
  header.classList.toggle("is-dark", onDark);
};
const requestHeaderUpdate = () => {
  if (!scrollFrame) scrollFrame = requestAnimationFrame(updateHeader);
};
window.addEventListener("scroll", requestHeaderUpdate, { passive: true });
window.addEventListener("resize", requestHeaderUpdate, { passive: true });
window.addEventListener("pageshow", requestHeaderUpdate);
updateHeader();

const menu = document.querySelector("#site-menu");
const menuToggle = document.querySelector("[data-menu-toggle]");
const menuClose = document.querySelector("[data-menu-close]");
if (menu && menuToggle && menuClose) {
  const resetMenu = () => {
    menuToggle.setAttribute("aria-expanded", "false");
    document.documentElement.classList.remove("menu-open");
  };
  menuToggle.addEventListener("click", () => {
    menu.showModal();
    menuToggle.setAttribute("aria-expanded", "true");
    document.documentElement.classList.add("menu-open");
  });
  menuClose.addEventListener("click", () => menu.close());
  menu.addEventListener("close", resetMenu);
  menu.addEventListener("click", (event) => {
    if (event.target.closest("a")) menu.close();
  });
  const desktop = window.matchMedia("(min-width: 801px)");
  desktop.addEventListener("change", () => {
    if (desktop.matches && menu.open) menu.close();
  });
}

const serviceButtons = [...document.querySelectorAll("[data-service]")];
const serviceImages = [...document.querySelectorAll("[data-service-image]")];
const serviceCaption = document.querySelector("[data-service-caption]");
const selectService = (button) => {
  if (button.getAttribute("aria-pressed") === "true") return;
  const active = button.dataset.service;
  for (const item of serviceButtons) {
    item.setAttribute("aria-pressed", String(item === button));
  }
  for (const image of serviceImages) {
    image.setAttribute("aria-hidden", String(image.dataset.serviceImage !== active));
  }
  if (serviceCaption) serviceCaption.textContent = button.nextElementSibling.textContent;
};
for (const button of serviceButtons) {
  button.addEventListener("click", () => selectService(button));
  button.addEventListener("focus", () => selectService(button));
  button.addEventListener("pointerenter", (event) => {
    if (event.pointerType === "mouse") selectService(button);
  });
}

const navLinks = [...document.querySelectorAll(".header__nav a[href^='#']")];
const sectionLinks = new Map(navLinks.map((link) => [document.querySelector(link.getAttribute("href")), link]));
const intersectingSections = new Set();
const navObserver = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (entry.isIntersecting) intersectingSections.add(entry.target);
    else intersectingSections.delete(entry.target);
  }
  const active = navLinks.find((link) => intersectingSections.has(document.querySelector(link.getAttribute("href"))));
  for (const link of navLinks) {
    if (link === active) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  }
}, { rootMargin: "-20% 0px -60% 0px", threshold: 0 });
for (const section of sectionLinks.keys()) {
  if (section) navObserver.observe(section);
}

// Minute precision keeps the small clock from doing unnecessary work.
const clock = document.querySelector("[data-local-time]");
let clockTimer = null;
const timeFormat = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", hour12: false,
});
const updateClock = () => {
  if (clock) clock.textContent = timeFormat.format(new Date());
};
const syncClock = () => {
  if (clockTimer !== null) window.clearInterval(clockTimer);
  clockTimer = null;
  if (!document.hidden && clock) {
    updateClock();
    clockTimer = window.setInterval(updateClock, 60_000);
  }
};
document.addEventListener("visibilitychange", syncClock);
syncClock();
const year = document.querySelector("[data-year]");
if (year) year.textContent = new Intl.DateTimeFormat("en", { timeZone: "Asia/Kolkata", year: "numeric" }).format(new Date());
