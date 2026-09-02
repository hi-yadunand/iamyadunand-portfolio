const ready = (callback) => {
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", callback, { once: true });
    } else {
        callback();
    }
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

ready(() => {
    const hero = document.querySelector(".hero--bouayaben");
    const title = hero?.querySelector(".hero__title--bouayaben");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (!hero || !title || reduceMotion.matches) return;

    let raf = 0;

    const update = () => {
        raf = 0;

        const rect = hero.getBoundingClientRect();
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

        if (rect.bottom < 0 || rect.top > viewportHeight) return;

        const scrollDistance = Math.max(0, -rect.top);
        const bgShift = clamp(scrollDistance * 0.18, 0, 140);
        const titleShift = clamp(scrollDistance * 0.34, 0, viewportHeight * 0.28);

        hero.style.setProperty("--hero-bg-y", `${bgShift.toFixed(2)}px`);
        hero.style.setProperty("--hero-title-y", `${titleShift.toFixed(2)}px`);
        title.style.setProperty("--hero-title-y", `${titleShift.toFixed(2)}px`);
    };

    const requestUpdate = () => {
        if (raf) return;
        raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
});
