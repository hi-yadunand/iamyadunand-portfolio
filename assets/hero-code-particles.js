// A word-sized canvas; there is no permanent animation loop or per-particle glow.
async function initParticleText(word) {
  const text = word?.querySelector(".hero-code__text");
  const canvas = word?.querySelector("canvas");
  const ctx = canvas?.getContext("2d");
  if (!word || !text || !ctx) return;

  await document.fonts?.ready;

  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)");
  const isFooter = word.hasAttribute("data-particle-text");
  // Use the homepage's responsive type token on every footer, even on pages
  // without hero text. The empty, positioned probe does not affect layout.
  const referenceText = isFooter ? document.createElement("span") : null;
  if (referenceText) {
    referenceText.setAttribute("aria-hidden", "true");
    referenceText.style.cssText = "position:absolute;visibility:hidden;pointer-events:none;font-size:var(--text-display-xl)";
    word.appendChild(referenceText);
  }
  const maxParticles = finePointer.matches ? (isFooter ? 3200 : 1600) : 900;
  let padding = 28;
  let interactionScale = 1;
  const pointer = { active: false, clientX: 0, clientY: 0 };
  let particles = [];
  let visible = false;
  let dirty = true;
  let frame = 0;
  let buildTimer = 0;
  let bounds = null;
  let width = 0;
  let height = 0;
  let dpr = 1;
  let color = "#ee4b2b";
  let layoutKey = "";

  const stop = () => {
    cancelAnimationFrame(frame);
    clearTimeout(buildTimer);
    frame = buildTimer = 0;
    pointer.active = false;
    bounds = null;
  };

  const draw = () => {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = color;
    ctx.beginPath();
    for (const particle of particles) {
      ctx.rect(particle.x, particle.y, particle.size, particle.size);
    }
    ctx.fill();
  };

  const requestTick = () => {
    if (!frame && visible && !document.hidden && !motion.matches && particles.length) {
      frame = requestAnimationFrame(tick);
    }
  };

  function tick() {
    frame = 0;
    if (!visible || document.hidden || motion.matches) return;

    let pointerX = 0;
    let pointerY = 0;
    if (pointer.active) {
      // One layout read per interaction frame, never one per particle.
      bounds ??= word.getBoundingClientRect();
      pointerX = (pointer.clientX - bounds.left) * width / bounds.width + padding;
      pointerY = (pointer.clientY - bounds.top) * height / bounds.height + padding;
    }

    const radius = Math.min(85 * interactionScale, height * 0.75);
    let moving = false;
    for (const particle of particles) {
      let targetX = particle.targetX;
      let targetY = particle.targetY;
      if (pointer.active) {
        const dx = targetX - pointerX;
        const dy = targetY - pointerY;
        const distanceSquared = dx * dx + dy * dy;
        if (distanceSquared > 0 && distanceSquared < radius * radius) {
          const distance = Math.sqrt(distanceSquared);
          const force = (1 - distance / radius) ** 2 * 22 * interactionScale;
          targetX += dx / distance * force;
          targetY += dy / distance * force;
        }
      }
      const dx = targetX - particle.x;
      const dy = targetY - particle.y;
      if (Math.abs(dx) + Math.abs(dy) > 0.08 * interactionScale) {
        particle.x += dx * 0.24;
        particle.y += dy * 0.24;
        moving = true;
      } else {
        particle.x = targetX;
        particle.y = targetY;
      }
    }
    draw();
    // Once settled, keep the canvas bitmap and stop scheduling frames.
    if (moving) requestTick();
  }

  function build() {
    buildTimer = 0;
    if (!visible || document.hidden || motion.matches) return;
    dirty = false;
    const style = getComputedStyle(text);
    const fontSize = parseFloat(style.fontSize);
    const referenceSize = referenceText
      ? parseFloat(getComputedStyle(referenceText).fontSize)
      : fontSize;
    interactionScale = fontSize / Math.max(1, referenceSize);
    padding = Math.ceil(28 * interactionScale);
    width = word.offsetWidth;
    height = word.offsetHeight;
    if (!width || !height) return;
    dpr = Math.min(devicePixelRatio || 1, 1.5);
    const font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
    const nextKey = `${width}:${height}:${font}:${style.letterSpacing}:${dpr}:${referenceSize}`;
    if (nextKey === layoutKey && particles.length) {
      draw();
      word.classList.add("is-particle-ready");
      requestTick();
      return;
    }

    const mask = document.createElement("canvas");
    mask.width = width + padding * 2;
    mask.height = height + padding * 2;
    const sample = mask.getContext("2d", { willReadFrequently: true });
    if (!sample) return;
    sample.font = font;
    sample.textBaseline = "alphabetic";
    sample.fillStyle = "#fff";
    if ("letterSpacing" in sample) sample.letterSpacing = style.letterSpacing;
    if ("fontKerning" in sample) sample.fontKerning = style.fontKerning;
    const metrics = sample.measureText(text.textContent);
    const ascent = metrics.fontBoundingBoxAscent ?? fontSize * 0.8;
    const descent = metrics.fontBoundingBoxDescent ?? fontSize * 0.2;
    const baseline = padding + (height - ascent - descent) / 2 + ascent;
    sample.fillText(text.textContent, padding, baseline);
    const { data } = sample.getImageData(0, 0, mask.width, mask.height);
    let step = Math.max(2, Math.ceil((referenceSize < 70 ? 2 : 3) * interactionScale));
    const sampleGrid = () => {
      const points = [];
      for (let y = 0; y < mask.height; y += step) {
        for (let x = 0; x < mask.width; x += step) {
          if (data[(y * mask.width + x) * 4 + 3] > 100) points.push({ x, y });
        }
      }
      return points;
    };
    let targets = sampleGrid();
    if (!targets.length) return;

    // Increase spacing in both directions instead of dropping every nth point.
    // This keeps a uniform dot grid and avoids solid stripes on large lettering.
    while (targets.length > maxParticles) {
      step = Math.max(step + 1, Math.ceil(step * Math.sqrt(targets.length / maxParticles)));
      targets = sampleGrid();
    }
    const size = Math.min(
      Math.max(1.25, Math.min(2, referenceSize / 75)) * interactionScale,
      step * 0.66,
    );
    particles = targets.map((point) => ({
      x: point.x, y: point.y,
      targetX: point.x, targetY: point.y,
      size,
    }));
    canvas.width = Math.ceil(mask.width * dpr);
    canvas.height = Math.ceil(mask.height * dpr);
    canvas.style.width = `${mask.width}px`;
    canvas.style.height = `${mask.height}px`;
    canvas.style.left = `${-padding}px`;
    canvas.style.top = `${-padding}px`;
    color = getComputedStyle(word).color;
    layoutKey = nextKey;
    bounds = null;
    draw();
    // The original text remains the accessible, no-JS and reduced-motion fallback.
    word.classList.add("is-particle-ready");
  }

  const queueBuild = () => {
    dirty = true;
    clearTimeout(buildTimer);
    if (visible && !document.hidden && !motion.matches) {
      buildTimer = setTimeout(build, 120);
    }
  };

  const visibility = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (!visible) stop();
    else if (dirty) queueBuild();
    else requestTick();
  });
  visibility.observe(word);
  new ResizeObserver(queueBuild).observe(word);

  word.addEventListener("pointermove", (event) => {
    if (!finePointer.matches || motion.matches) return;
    pointer.active = true;
    pointer.clientX = event.clientX;
    pointer.clientY = event.clientY;
    bounds = null;
    requestTick();
  }, { passive: true });
  word.addEventListener("pointerleave", () => {
    pointer.active = false;
    requestTick();
  }, { passive: true });
  window.addEventListener("scroll", () => { bounds = null; }, { passive: true });
  window.addEventListener("resize", queueBuild, { passive: true });
  motion.addEventListener("change", () => {
    stop();
    word.classList.remove("is-particle-ready");
    queueBuild();
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stop();
    else if (dirty) queueBuild();
    else requestTick();
  });
  window.addEventListener("pagehide", stop);
  window.addEventListener("pageshow", queueBuild);
}

document.querySelectorAll("[data-hero-code], [data-particle-text]").forEach(initParticleText);
