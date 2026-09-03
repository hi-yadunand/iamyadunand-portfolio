const easeOutExpo = (t) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));

const ready = (fn) => {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", fn, { once: true });
  } else {
    fn();
  }
};

ready(() => {
  const stage = document.querySelector("[data-footer-particles]");
  const canvas = stage?.querySelector("canvas");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (!stage || !canvas || reduceMotion.matches) return;

  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) return;

  let particles = [];
  let dpr = 1;
  let startedAt = 0;
  let settled = false;
  let raf = 0;
  let visible = false;

  const pointer = {
    x: -90000,
    y: -90000,
    amp: 0,
    targetAmp: 0,
  };

  const resizeCanvas = () => {
    const rect = stage.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    canvas.width = Math.max(1, Math.round(rect.width * dpr));
    canvas.height = Math.max(1, Math.round(rect.height * dpr));
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
  };

  const getTextLayout = (ctx2d, width, height) => {
    const text = "say hi.";
    const compact = width <= 700;
    let fontSize = compact
      ? Math.min(width * 0.26, height * 0.78)
      : Math.min(width * 0.27, height * 0.86);
    const maxWidth = width * (compact ? 0.92 : 0.86);
    const family = '"Archivo Variable", Archivo, "Helvetica Neue", Arial, sans-serif';

    ctx2d.font = `italic 760 ${fontSize}px ${family}`;
    while (ctx2d.measureText(text).width > maxWidth && fontSize > 32) {
      fontSize *= 0.96;
      ctx2d.font = `italic 760 ${fontSize}px ${family}`;
    }

    return {
      text,
      font: `italic 760 ${fontSize}px ${family}`,
      fontSize,
    };
  };

  const buildTargets = () => {
    resizeCanvas();

    const rect = stage.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const sampleScale = 1.35;
    const sample = document.createElement("canvas");
    const sampleCtx = sample.getContext("2d", { willReadFrequently: true });

    if (!sampleCtx || width <= 0 || height <= 0) {
      particles = [];
      return;
    }

    const layout = getTextLayout(sampleCtx, width, height);
    const metrics = sampleCtx.measureText(layout.text);
    const textWidth = Math.ceil(metrics.width);
    const pad = Math.ceil(layout.fontSize * 0.18);

    sample.width = Math.ceil((textWidth + pad * 2) * sampleScale);
    sample.height = Math.ceil(layout.fontSize * 1.55 * sampleScale);
    sampleCtx.scale(sampleScale, sampleScale);
    sampleCtx.font = layout.font;
    sampleCtx.fillStyle = "#fff";
    sampleCtx.textBaseline = "alphabetic";
    sampleCtx.fillText(layout.text, pad, layout.fontSize * 1.08);

    const pixels = sampleCtx.getImageData(0, 0, sample.width, sample.height);
    const rawPoints = [];
    const step = width <= 700 ? 3 : 2;
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    for (let y = 0; y < pixels.height; y += step) {
      for (let x = 0; x < pixels.width; x += step) {
        const alpha = pixels.data[(y * pixels.width + x) * 4 + 3];
        if (alpha > 128 && Math.random() > 0.22) {
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

    if (!rawPoints.length) {
      particles = [];
      return;
    }

    const glyphCenterX = (minX + maxX) / 2;
    const glyphCenterY = (minY + maxY) / 2;
    const targetCenterX = width * (width <= 700 ? 0.5 : 0.46);
    const targetCenterY = height * 0.52;
    const maxParticles = width <= 700 ? 3200 : 12000;

    const points = rawPoints.map((point) => ({
      x: targetCenterX + (point.x - glyphCenterX),
      y: targetCenterY + (point.y - glyphCenterY),
    }));

    points.sort(() => Math.random() - 0.5);
    particles = points.slice(0, maxParticles).map((point) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      tx: point.x,
      ty: point.y,
      sx: Math.random() * width,
      sy: Math.random() * height,
      drift: Math.random() * Math.PI * 2,
      size: 0.8 + Math.random() * 1.25,
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

    for (const particle of particles) {
      const settle = easeOutExpo(progress);
      const wobble = Math.sin(progress * 12 + particle.drift) * (1 - settle) * 16;
      const baseX = particle.sx + (particle.tx - particle.sx) * settle + wobble;
      const baseY =
        particle.sy +
        (particle.ty - particle.sy) * settle +
        Math.cos(progress * 10 + particle.drift) * (1 - settle) * 10;
      const alpha = Math.min(1, (0.05 + settle * 0.95) * particle.alpha);
      let x = baseX;
      let y = baseY;

      if (settled || progress > 0.72) {
        const dx = baseX - pointer.x;
        const dy = baseY - pointer.y;
        const distance = Math.hypot(dx, dy);
        const radius = width <= 700 ? 56 : 74;

        if (distance < radius && distance > 0.01) {
          const push = Math.pow(1 - distance / radius, 2) * 24 * pointer.amp;
          x += (dx / distance) * push;
          y += (dy / distance) * push * 0.58;
        }

        const shimmer = settled
          ? Math.sin(time * 0.002 + particle.drift) * 0.28
          : 0;
        x += shimmer * pointer.amp;
        y += Math.cos(time * 0.0017 + particle.drift) * 0.22 * pointer.amp;

        particle.x += (x - particle.x) * 0.2;
        particle.y += (y - particle.y) * 0.2;
        x = particle.x;
        y = particle.y;
      } else {
        particle.x = x;
        particle.y = y;
      }

      if (x < -4 || x > width + 4 || y < -4 || y > height + 4) continue;
      ctx.fillStyle = `rgba(238, 75, 43, ${alpha})`;
      ctx.fillRect(x, y, particle.size, particle.size);
    }

    ctx.restore();
  };

  const animate = (time) => {
    if (!visible) {
      raf = requestAnimationFrame(animate);
      return;
    }

    if (!startedAt) startedAt = time;
    const progress = Math.min(1, (time - startedAt) / 1900);
    draw(progress, time);

    if (progress >= 1) settled = true;
    raf = requestAnimationFrame(animate);
  };

  const onPointerMove = (event) => {
    const rect = canvas.getBoundingClientRect();
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

  const rebuild = () => {
    cancelAnimationFrame(raf);
    buildTargets();
    startedAt = settled ? performance.now() - 1900 : 0;
    raf = requestAnimationFrame(animate);
  };

  const start = () => {
    buildTargets();
    if (!particles.length) return;
    raf = requestAnimationFrame(animate);
  };

  new IntersectionObserver(
    ([entry]) => {
      visible = entry.isIntersecting;
    },
    { threshold: 0.02 },
  ).observe(stage);

  window.addEventListener("pointermove", onPointerMove, { passive: true });
  window.addEventListener("pointerdown", onPointerMove, { passive: true });
  stage.addEventListener("pointerleave", onPointerLeave);
  window.addEventListener("resize", rebuild);
  window.addEventListener("orientationchange", rebuild);

  const fontsReady = document.fonts?.ready || Promise.resolve();
  fontsReady.then(start);
});
