export function initHalftone(wordmark, text, { colors, padding = 0, fitWidth = false }) {
  const canvas = wordmark?.querySelector("canvas");
  const context = canvas?.getContext("2d");
  if (!text || !context) return;
  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  const mask = document.createElement("canvas");
  const maskContext = mask.getContext("2d", { willReadFrequently: true });
  if (!maskContext) return;

  const ringDuration = 850;
  let dots = [];
  let frame = 0;
  let visible = false;
  let pointer = null;
  let ring = null;
  let width = 0;
  let height = 0;

  function layout() {
    if (!wordmark.clientWidth || !wordmark.clientHeight) return;
    width = wordmark.clientWidth + padding * 2;
    height = wordmark.clientHeight + padding * 2;
    const style = getComputedStyle(text);
    const fontSize = parseFloat(style.fontSize);

    const dpr = Math.min(devicePixelRatio || 1, 2, Math.sqrt(1800000 / (width * height)));
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    context.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Each cell samples a 3×3 mask. Partial cells form smaller edge dots.
    const gap = fitWidth
      ? Math.max(4, Math.min(12, width / 155))
      : Math.max(3, Math.min(9, fontSize / 21));
    const columns = Math.ceil(width / gap);
    const rows = Math.ceil(height / gap);
    mask.width = columns * 3;
    mask.height = rows * 3;
    const scale = 3 / gap;
    maskContext.setTransform(scale, 0, 0, scale, 0, 0);
    drawMask(style, fontSize);

    const { data } = maskContext.getImageData(0, 0, mask.width, mask.height);
    dots = [];
    for (let row = 0; row < rows; row++) {
      for (let column = 0; column < columns; column++) {
        let opacity = 0;
        for (let y = 0; y < 3; y++) {
          const rowOffset = ((row * 3 + y) * mask.width + column * 3) * 4;
          opacity += data[rowOffset + 3] + data[rowOffset + 7] + data[rowOffset + 11];
        }
        const coverage = opacity / (9 * 255);
        if (coverage < 0.06) continue;
        const x = (column + 0.5) * gap;
        const y = (row + 0.5) * gap;
        dots.push({ x, y, homeX: x, homeY: y, vx: 0, vy: 0, radius: Math.sqrt(coverage) * gap * 0.54 });
      }
    }
    draw();
    wordmark.toggleAttribute("data-halftone-ready", dots.length > 0);
  }

  function drawMask(style, fontSize) {
    const label = text.textContent.trim();
    const fontAt = (size) => `${style.fontStyle} ${style.fontWeight} ${size}px ${style.fontFamily}`;

    if (fitWidth) {
      maskContext.font = fontAt(100);
      const size = 100 * width / maskContext.measureText(label).width;
      maskContext.font = fontAt(size);
      const metrics = maskContext.measureText(label);
      const crop = (metrics.actualBoundingBoxAscent || size * 0.72) * 0.16;
      maskContext.fillText(label, (width - metrics.width) / 2, height + crop);
      return;
    }

    maskContext.font = fontAt(fontSize);
    if ("letterSpacing" in maskContext) maskContext.letterSpacing = style.letterSpacing;
    if ("fontKerning" in maskContext) maskContext.fontKerning = style.fontKerning;
    const metrics = maskContext.measureText(label);
    const ascent = metrics.fontBoundingBoxAscent ?? fontSize * 0.8;
    const descent = metrics.fontBoundingBoxDescent ?? fontSize * 0.2;
    const baseline = (height + ascent - descent) / 2;
    maskContext.fillText(label, padding, baseline);
  }

  function draw() {
    context.clearRect(0, 0, width, height);
    const paths = colors.map(() => new Path2D());
    for (const dot of dots) {
      const displacement = Math.hypot(dot.x - dot.homeX, dot.y - dot.homeY);
      const path = paths[Math.min(paths.length - 1, Math.round(displacement / 5))];
      path.moveTo(dot.x + dot.radius, dot.y);
      path.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
    }
    colors.forEach((color, index) => {
      context.fillStyle = color;
      context.fill(paths[index]);
    });
  }

  function wake() {
    if (!frame && visible && !document.hidden && !motion.matches) frame = requestAnimationFrame(tick);
  }

  function tick(now) {
    frame = 0;
    const age = ring ? now - ring.time : ringDuration;
    if (age >= ringDuration) ring = null;
    let moving = false;

    for (const dot of dots) {
      if (pointer) {
        const dx = dot.x - pointer.x;
        const dy = dot.y - pointer.y;
        const distance = Math.hypot(dx, dy);
        if (distance > 0 && distance < 80) {
          const force = 2.6 * (1 - distance / 80) / distance;
          dot.vx += dx * force;
          dot.vy += dy * force;
        }
      }
      if (ring) {
        const dx = dot.homeX - ring.x;
        const dy = dot.homeY - ring.y;
        const distance = Math.hypot(dx, dy);
        const band = 1 - Math.abs(distance - age * 0.9) / 26;
        if (distance > 0 && band > 0) {
          const force = 3.2 * band * (1 - age / ringDuration) / distance;
          dot.vx += dx * force;
          dot.vy += dy * force;
        }
      }

      dot.vx = (dot.vx + (dot.homeX - dot.x) * 0.05) * 0.84;
      dot.vy = (dot.vy + (dot.homeY - dot.y) * 0.05) * 0.84;
      dot.x += dot.vx;
      dot.y += dot.vy;
      const speed = Math.abs(dot.vx) + Math.abs(dot.vy);
      const offset = Math.abs(dot.x - dot.homeX) + Math.abs(dot.y - dot.homeY);
      if (speed < 0.025 && offset < 0.08) reset(dot);
      else if (speed >= 0.025 || !pointer) moving = true;
    }

    draw();
    if (moving || ring) wake();
  }

  function reset(dot) {
    dot.x = dot.homeX;
    dot.y = dot.homeY;
    dot.vx = 0;
    dot.vy = 0;
  }

  function settle() {
    cancelAnimationFrame(frame);
    frame = 0;
    pointer = ring = null;
    dots.forEach(reset);
    draw();
  }

  function localPoint(event) {
    const bounds = canvas.getBoundingClientRect();
    return {
      x: (event.clientX - bounds.left) * width / bounds.width,
      y: (event.clientY - bounds.top) * height / bounds.height,
    };
  }

  wordmark.addEventListener("pointermove", (event) => {
    if (motion.matches || event.pointerType === "touch") return;
    pointer = localPoint(event);
    wake();
  }, { passive: true });
  const releasePointer = () => {
    if (!pointer) return;
    pointer = null;
    wake();
  };
  wordmark.addEventListener("pointerleave", releasePointer);
  wordmark.addEventListener("pointercancel", releasePointer);
  wordmark.addEventListener("pointerdown", (event) => {
    if (motion.matches || event.button !== 0 || event.pointerType === "touch") return;
    ring = { ...localPoint(event), time: performance.now() };
    wake();
  });

  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (!visible && (frame || pointer || ring)) settle();
  }).observe(wordmark);
  new ResizeObserver(layout).observe(wordmark);
  document.fonts?.ready.then(layout);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) settle();
  });
  motion.addEventListener("change", settle);
  wordmark.style.setProperty("--halftone-padding", `${padding}px`);
  layout();
}
