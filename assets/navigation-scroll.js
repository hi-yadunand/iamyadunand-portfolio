const header = document.querySelector(".header");
const menuReveal = document.querySelector("[data-menu-reveal]");
const menuPanel = document.querySelector("[data-fixed-menu-panel]");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

if (header && menuReveal && menuPanel) {
  const hero = document.querySelector(".hero");
  const heroSampler = document.createElement("canvas");
  const heroContext = heroSampler.getContext("2d", { willReadFrequently: true });
  const heroImage = new Image();
  let lastScrollY = window.scrollY;
  let ticking = false;
  let heroImageReady = false;
  let menuOpen = false;

  const setMenuTone = (isLight) => {
    menuReveal.classList.toggle("is-on-light", isLight);
  };

  const readBackgroundImageUrl = () => {
    if (!hero) return "";
    const heroStyle = window.getComputedStyle(hero);
    const layerStyle = window.getComputedStyle(hero, "::after");
    const backgroundImage =
      layerStyle.backgroundImage && layerStyle.backgroundImage !== "none"
        ? layerStyle.backgroundImage
        : heroStyle.backgroundImage;
    const matches = [...backgroundImage.matchAll(/url\(["']?([^"')]+)["']?\)/g)];
    const imageMatch = matches[matches.length - 1];
    return imageMatch ? imageMatch[1] : "";
  };

  const prepareHeroSampler = () => {
    const imageUrl = readBackgroundImageUrl();
    if (!imageUrl) return;

    heroImage.crossOrigin = "anonymous";
    heroImage.addEventListener(
      "load",
      () => {
        heroSampler.width = heroImage.naturalWidth;
        heroSampler.height = heroImage.naturalHeight;
        heroContext?.drawImage(heroImage, 0, 0);
        heroImageReady = true;
        requestUpdate();
      },
      { once: true }
    );
    heroImage.src = imageUrl;
  };

  const isHeroPixelLight = (pointX, pointY) => {
    if (!hero || !heroContext || !heroImageReady) return false;

    const rect = hero.getBoundingClientRect();
    const localX = pointX - rect.left;
    const localY = pointY - rect.top;
    const scale = Math.max(rect.width / heroImage.naturalWidth, rect.height / heroImage.naturalHeight);
    const positionX = window.innerWidth <= 700 ? 0.58 : 0.5;
    const renderedWidth = heroImage.naturalWidth * scale;
    const renderedHeight = heroImage.naturalHeight * scale;
    const offsetX = (rect.width - renderedWidth) * positionX;
    const offsetY = (rect.height - renderedHeight) * 0.5;
    const imageX = Math.round((localX - offsetX) / scale);
    const imageY = Math.round((localY - offsetY) / scale);

    if (imageX < 0 || imageY < 0 || imageX >= heroImage.naturalWidth || imageY >= heroImage.naturalHeight) {
      return false;
    }

    let red;
    let green;
    let blue;

    try {
      [red, green, blue] = heroContext.getImageData(imageX, imageY, 1, 1).data;
    } catch {
      return false;
    }

    const brightness = red * 0.299 + green * 0.587 + blue * 0.114;

    return brightness > 150;
  };

  const updateMenuTone = () => {
    const rect = menuReveal.getBoundingClientRect();
    const pointX = rect.left + rect.width / 2;
    const pointY = rect.top + rect.height / 2;
    const heroRect = hero?.getBoundingClientRect();
    const isOverHero = Boolean(heroRect && pointY >= heroRect.top && pointY <= heroRect.bottom);

    setMenuTone(isOverHero ? isHeroPixelLight(pointX, pointY) : true);
  };

  const isInHeroSection = () => {
    if (!hero) return false;

    const rect = hero.getBoundingClientRect();
    return rect.bottom > 80 && rect.top < window.innerHeight * 0.35;
  };

  const showHeader = () => {
    header.classList.remove("is-nav-hidden");
    if (!menuOpen) {
      menuReveal.classList.remove("is-visible");
    }
  };

  const hideHeader = () => {
    header.classList.add("is-nav-hidden");
    menuReveal.classList.add("is-visible");
  };

  const closeMenu = () => {
    menuOpen = false;
    menuReveal.textContent = "Menu";
    menuReveal.setAttribute("aria-expanded", "false");
    menuPanel.setAttribute("aria-hidden", "true");
    document.documentElement.classList.remove("is-fixed-menu-open");
    requestUpdate();
  };

  const openMenu = () => {
    menuOpen = true;
    menuReveal.textContent = "Close";
    menuReveal.setAttribute("aria-expanded", "true");
    menuPanel.setAttribute("aria-hidden", "false");
    menuReveal.classList.add("is-visible");
    header.classList.add("is-nav-hidden");
    document.documentElement.classList.add("is-fixed-menu-open");
  };

  const updateNavigation = () => {
    ticking = false;

    const currentScrollY = Math.max(window.scrollY, 0);
    const delta = currentScrollY - lastScrollY;

    updateMenuTone();

    const inHeroSection = isInHeroSection();

    if (menuOpen) {
      hideHeader();
    } else if ((currentScrollY < 80 || delta < -6 || reduceMotion.matches) && inHeroSection) {
      showHeader();
    } else if (!inHeroSection) {
      hideHeader();
    } else if (delta > 6) {
      hideHeader();
    }

    lastScrollY = currentScrollY;
  };

  const requestUpdate = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(updateNavigation);
  };

  menuReveal.addEventListener("click", () => {
    menuOpen ? closeMenu() : openMenu();
  });

  menuPanel.querySelectorAll("a[href^='#']").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuOpen) closeMenu();
  });

  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate, { passive: true });
  reduceMotion.addEventListener?.("change", requestUpdate);

  prepareHeroSampler();
  requestUpdate();
}
