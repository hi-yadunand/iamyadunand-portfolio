const easeOutExpo = (t) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));

const prefersReducedMotion = () =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const ready = (fn) => {
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", fn, { once: true });
    } else {
        fn();
    }
};

const splitTextNodes = (root) => {
    const chars = [];

    const walk = (node) => {
        for (const child of [...node.childNodes]) {
            if (child.nodeType === Node.TEXT_NODE) {
                const fragment = document.createDocumentFragment();
                const parts = child.textContent.split(/(\s+)/);

                for (const part of parts) {
                    if (!part) continue;
                    if (!part.trim()) {
                        fragment.append(part);
                        continue;
                    }

                    const word = document.createElement("span");
                    word.className = "word";

                    for (const letter of part) {
                        const char = document.createElement("span");
                        char.className = "char";
                        char.textContent = letter;
                        word.append(char);
                        chars.push(char);
                    }

                    fragment.append(word);
                }

                child.replaceWith(fragment);
            } else {
                walk(child);
            }
        }
    };

    walk(root);
    return chars;
};

const waitForLoader = () =>
    new Promise((resolve) => {
        const loader = document.querySelector("[data-loader]");
        const started = performance.now();

        const check = () => {
            if (!loader) {
                resolve();
                return;
            }

            const style = getComputedStyle(loader);
            const faded =
                style.display === "none" ||
                style.visibility === "hidden" ||
                Number(style.opacity) < 0.02;
            const timedOut = performance.now() - started > 7000;

            if (faded || timedOut) {
                resolve();
                return;
            }

            requestAnimationFrame(check);
        };

        check();
    });

const initCharacterRepel = (root, chars) => {
    let pointer = { x: -90000, y: -90000 };
    let centers = [];
    const states = chars.map(() => ({ x: 0, y: 0, tx: 0, ty: 0 }));

    const measure = () => {
        centers = chars.map((char) => {
            const rect = char.getBoundingClientRect();
            return {
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2,
            };
        });
    };

    const onPointerMove = (event) => {
        pointer = { x: event.clientX, y: event.clientY };
    };

    const tick = () => {
        for (let index = 0; index < chars.length; index += 1) {
            const center = centers[index];
            if (!center) continue;

            const state = states[index];
            const dx = center.x - pointer.x;
            const dy = center.y - pointer.y;
            const distance = Math.hypot(dx, dy);

            if (distance < 150 && distance > 0.01) {
                const force = (1 - distance / 150) * 14;
                state.tx = (dx / distance) * force;
                state.ty = (dy / distance) * force * 0.6;
            } else {
                state.tx = 0;
                state.ty = 0;
            }

            state.x += (state.tx - state.x) * 0.14;
            state.y += (state.ty - state.y) * 0.14;
            chars[index].style.transform = `translate(${state.x.toFixed(
                2,
            )}px, ${state.y.toFixed(2)}px)`;
        }

        requestAnimationFrame(tick);
    };

    measure();
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, { passive: true });
    root.addEventListener("animationend", measure, { once: true });
    requestAnimationFrame(tick);
};

const createParticles = (root, canvas, word) => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particles = [];
    let dpr = 1;
    let startedAt = 0;
    let settled = false;
    let raf = 0;
    const pointer = {
        x: -90000,
        y: -90000,
        amp: 0,
        targetAmp: 0,
    };

    const resizeCanvas = () => {
        const rect = root.getBoundingClientRect();
        dpr = Math.min(window.devicePixelRatio || 1, 1.75);
        canvas.width = Math.max(1, Math.round(rect.width * dpr));
        canvas.height = Math.max(1, Math.round(rect.height * dpr));
        canvas.style.width = `${rect.width}px`;
        canvas.style.height = `${rect.height}px`;
    };

    const buildTargets = () => {
        resizeCanvas();

        const rootRect = root.getBoundingClientRect();
        const wordRect = word.getBoundingClientRect();
        const style = getComputedStyle(word);
        const fontSize = parseFloat(style.fontSize) || wordRect.height;
        const sampleScale = 1.8;
        const pad = Math.ceil(fontSize * 0.35);
        const sample = document.createElement("canvas");
        const sampleCtx = sample.getContext("2d", { willReadFrequently: true });

        if (!sampleCtx || wordRect.width <= 0 || wordRect.height <= 0) {
            particles = [];
            return;
        }

        sample.width = Math.ceil((wordRect.width + pad * 2) * sampleScale);
        sample.height = Math.ceil((wordRect.height + pad * 2) * sampleScale);
        sampleCtx.scale(sampleScale, sampleScale);
        sampleCtx.font = `${style.fontStyle} ${style.fontWeight} ${fontSize}px ${style.fontFamily}`;
        sampleCtx.fillStyle = "#fff";
        sampleCtx.textBaseline = "middle";
        sampleCtx.fillText(word.textContent, pad, sample.height / sampleScale / 2);

        const pixels = sampleCtx.getImageData(0, 0, sample.width, sample.height);
        const rawPoints = [];
        const step = window.innerWidth <= 700 ? 3 : 2;
        let minX = Infinity;
        let minY = Infinity;
        let maxX = -Infinity;
        let maxY = -Infinity;

        for (let y = 0; y < pixels.height; y += step) {
            for (let x = 0; x < pixels.width; x += step) {
                const alpha = pixels.data[(y * pixels.width + x) * 4 + 3];
                if (alpha > 128 && Math.random() > 0.16) {
                    const px = x / sampleScale;
                    const py = y / sampleScale;
                    minX = Math.min(minX, px);
                    minY = Math.min(minY, py);
                    maxX = Math.max(maxX, px);
                    maxY = Math.max(maxY, py);
                    rawPoints.push({ x: px, y: py });
                }
            }
        }

        const glyphWidth = Math.max(1, maxX - minX);
        const glyphHeight = Math.max(1, maxY - minY);
        const scale = wordRect.width / glyphWidth;
        const targetHeight = glyphHeight * scale;
        const yOffset =
            wordRect.top - rootRect.top + (wordRect.height - targetHeight) * 0.62;
        const points = rawPoints.map((point) => ({
            x: wordRect.left - rootRect.left + (point.x - minX) * scale,
            y: yOffset + (point.y - minY) * scale,
        }));
        const maxParticles = window.innerWidth <= 700 ? 2800 : 8200;
        points.sort(() => Math.random() - 0.5);
        particles = points.slice(0, maxParticles).map((point) => ({
            x: Math.random() * rootRect.width,
            y: Math.random() * rootRect.height,
            tx: point.x,
            ty: point.y,
            sx: Math.random() * rootRect.width,
            sy: Math.random() * rootRect.height,
            drift: Math.random() * Math.PI * 2,
            size: 0.75 + Math.random() * 1.15,
            alpha: 0.55 + Math.random() * 0.45,
        }));
    };

    const draw = (progress, time = 0) => {
        const width = canvas.width / dpr;
        const height = canvas.height / dpr;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.scale(dpr, dpr);

        pointer.amp += (pointer.targetAmp - pointer.amp) * 0.12;

        for (const p of particles) {
            const settle = easeOutExpo(progress);
            const wobble = Math.sin(progress * 12 + p.drift) * (1 - settle) * 16;
            const baseX = p.sx + (p.tx - p.sx) * settle + wobble;
            const baseY =
                p.sy +
                (p.ty - p.sy) * settle +
                Math.cos(progress * 10 + p.drift) * (1 - settle) * 10;
            const alpha = Math.min(1, (0.05 + settle * 0.95) * p.alpha);
            let x = baseX;
            let y = baseY;

            if (settled || progress > 0.72) {
                const dx = baseX - pointer.x;
                const dy = baseY - pointer.y;
                const distance = Math.hypot(dx, dy);
                const radius = window.innerWidth <= 700 ? 96 : 140;

                if (distance < radius && distance > 0.01) {
                    const push = Math.pow(1 - distance / radius, 2) * 54 * pointer.amp;
                    x += (dx / distance) * push;
                    y += (dy / distance) * push * 0.72;
                }

                const shimmer = settled ? Math.sin(time * 0.002 + p.drift) * 0.65 : 0;
                x += shimmer * pointer.amp;
                y += Math.cos(time * 0.0017 + p.drift) * 0.45 * pointer.amp;

                p.x += (x - p.x) * 0.2;
                p.y += (y - p.y) * 0.2;
                x = p.x;
                y = p.y;
            } else {
                p.x = x;
                p.y = y;
            }

            if (x < -4 || x > width + 4 || y < -4 || y > height + 4) continue;
            ctx.fillStyle = `rgba(255, 92, 40, ${alpha})`;
            ctx.fillRect(x, y, p.size, p.size);
        }

        ctx.restore();
    };

    const animate = (time) => {
        if (!startedAt) startedAt = time;
        const progress = Math.min(1, (time - startedAt) / 1900);
        draw(progress, time);

        if (progress < 1) {
            raf = requestAnimationFrame(animate);
        } else {
            settled = true;
            raf = requestAnimationFrame(animate);
        }
    };

    const onPointerMove = (event) => {
        const rect = root.getBoundingClientRect();
        pointer.x = event.clientX - rect.left;
        pointer.y = event.clientY - rect.top;
        pointer.targetAmp =
            event.clientX >= rect.left &&
            event.clientX <= rect.right &&
            event.clientY >= rect.top &&
            event.clientY <= rect.bottom
                ? 1
                : 0;
    };

    const onPointerLeave = () => {
        pointer.targetAmp = 0;
    };

    const start = () => {
        buildTargets();
        if (!particles.length) return;
        word.style.transition = "opacity 0.7s ease";
        word.style.opacity = "0";
        raf = requestAnimationFrame(animate);
    };

    const rebuild = () => {
        cancelAnimationFrame(raf);
        buildTargets();
        if (settled) draw(1);
    };

    window.addEventListener("resize", rebuild);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    root.addEventListener("pointerleave", onPointerLeave);
    setTimeout(start, 1800);
};

ready(() => {
    const root = document.querySelector(".hero--bouayaben");
    if (!root || prefersReducedMotion()) return;

    const headline = root.querySelector(".hero__title--bouayaben");
    const canvas = root.querySelector("[data-million-particles]");
    const word = root.querySelector("[data-particle-word]");
    if (!headline || !canvas || !word) return;

    const init = () => {
        const chars = splitTextNodes(headline);
        initCharacterRepel(root, chars);
        root.classList.add("is-hero-animated");
        if (!window.matchMedia("(max-width: 700px)").matches) {
            createParticles(root, canvas, word);
        }
    };

    const fontsReady = document.fonts?.ready || Promise.resolve();
    Promise.all([fontsReady, waitForLoader()]).then(init);
});
