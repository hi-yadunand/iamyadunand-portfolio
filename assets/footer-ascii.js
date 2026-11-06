// An original canvas interpretation of the reference's flowing ASCII backdrop.
// No external animation runtime or downloaded shader is required.
const footer = document.querySelector("[data-profile-footer]");

if (footer) {
  const canvas = document.createElement("canvas");
  canvas.className = "portfolio-footer__background";
  canvas.setAttribute("aria-hidden", "true");
  footer.prepend(canvas);

  const context = canvas.getContext("2d", { alpha: true });
  if (context) {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const glyphs = ".:-=+*#%@";
    const levels = 8;
    const atlas = document.createElement("canvas");
    const ink = atlas.getContext("2d");
    const glowPadding = 8;
    let spriteWidth = 0;
    let spriteHeight = 0;
    let cells = [];
    let width = 0;
    let height = 0;
    let cellWidth = 0;
    let cellHeight = 0;
    let ratio = 1;
    let frame = null;
    let visible = false;
    let elapsed = 0;
    let previousTime = null;
    let lastPaint = -Infinity;
    let scrolling = false;
    let scrollTimer = 0;

    const draw = () => {
      if (!width || !height) return;
      context.clearRect(0, 0, width, height);
      const time = elapsed * 0.001;
      const breath = 0.5 + Math.sin(time * 0.8) * 0.5;
      const pulseRadius = 0.53 + breath * 0.29;
      const centerX = width * 0.5;
      // Anchor the expanding field to the bottom edge on every screen size.
      const centerY = height;
      const radiusX = width * (width < 640 ? 0.64 : 0.39);
      const radiusY = height * 0.92;

      // Broad neutral light under the ASCII field, like a softly lit dark studio.
      const glowX = centerX + Math.cos(time * 0.46) * radiusX * 0.3;
      const glowY = centerY - height * 0.04;
      const light = context.createRadialGradient(glowX, glowY, 0,
        glowX, glowY, Math.max(radiusX, radiusY) * 1.15);
      light.addColorStop(0, `rgba(145, 145, 145, ${0.025 + breath * 0.035})`);
      light.addColorStop(0.5, "rgba(80, 80, 80, 0.018)");
      light.addColorStop(1, "rgba(0, 0, 0, 0)");
      context.fillStyle = light;
      context.fillRect(0, 0, width, height);

      // Cache the fixed grid geometry on resize, and calculate animation phases
      // once per frame rather than repeating trigonometry for every character.
      const sinA = Math.sin(time * 0.45);
      const cosA = Math.cos(time * 0.45);
      const sinB = Math.sin(time * 0.4);
      const cosB = Math.cos(time * 0.4);
      const sinC = Math.sin(time * 0.9);
      const cosC = Math.cos(time * 0.9);
      const sinD = Math.sin(time * 0.65);
      const cosD = Math.cos(time * 0.65);
      context.save();
      for (const cell of cells) {
        const wave = (cell.sinAngle3 * cosA - cell.cosAngle3 * sinA) * 0.045
          + (cell.sinY5 * cosB + cell.cosY5 * sinB) * 0.035;
        const ring = Math.exp(-Math.pow((cell.radius - pulseRadius - wave)
          / (0.21 + breath * 0.045), 2));
        const beam = Math.pow(0.5
          + (cell.cosAngle2 * cosC + cell.sinAngle2 * sinC) * 0.5, 3);
        const ribbon = 0.70 + (cell.sinRibbon * cosD - cell.cosRibbon * sinD) * 0.18
          + (cell.cosY9 * cosA - cell.sinY9 * sinA) * 0.12;
        const density = Math.max(0, Math.min(1,
          ring * ribbon * cell.edge * (0.68 + beam * 0.32)));
        if (density < 0.055) continue;

        const glyph = Math.min(glyphs.length - 1, Math.floor(density * glyphs.length));
        const shade = Math.min(levels - 1, Math.floor(density * levels));
        context.drawImage(atlas,
          glyph * spriteWidth * ratio, shade * spriteHeight * ratio,
          spriteWidth * ratio, spriteHeight * ratio,
          cell.x - glowPadding, cell.y - glowPadding, spriteWidth, spriteHeight);
      }
      context.restore();
    };

    const resize = () => {
      if (width === footer.clientWidth && height === footer.clientHeight) return;
      width = footer.clientWidth;
      height = footer.clientHeight;
      // This subdued backdrop does not need a high-DPI full-footer framebuffer.
      ratio = Math.min(1, Math.sqrt(1000000 / Math.max(1, width * height)));
      cellWidth = width < 640 ? 13 : 17;
      cellHeight = width < 640 ? 18 : 22;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      spriteWidth = cellWidth + glowPadding * 2;
      spriteHeight = cellHeight + glowPadding * 2;
      atlas.width = Math.ceil(glyphs.length * spriteWidth * ratio);
      atlas.height = Math.ceil(levels * spriteHeight * ratio);
      ink.setTransform(ratio, 0, 0, ratio, 0, 0);
      ink.font = `${width < 640 ? 11 : 14}px ui-monospace, monospace`;
      ink.textAlign = "center";
      ink.textBaseline = "middle";
      for (let shade = 0; shade < levels; shade++) {
        // Low contrast keeps links, the profile, and wordmark in the foreground.
        ink.fillStyle = `rgba(230, 230, 230, ${0.04 + shade * 0.033})`;
        // Bake the halo once into padded glyph sprites instead of blurring a
        // full-size canvas every frame. Padding prevents neighboring glyph bleed.
        ink.shadowColor = "rgba(230, 230, 230, 0.6)";
        ink.shadowBlur = (width < 640 ? 3 : 5) * ratio;
        for (let glyph = 0; glyph < glyphs.length; glyph++) {
          ink.fillText(glyphs[glyph], glyph * spriteWidth + glowPadding + cellWidth / 2,
            shade * spriteHeight + glowPadding + cellHeight / 2);
        }
      }
      cells = [];
      const radiusX = width * (width < 640 ? 0.64 : 0.39);
      for (let y = cellHeight / 2; y < height; y += cellHeight) {
        for (let x = cellWidth / 2; x < width; x += cellWidth) {
          const nx = (x - width * 0.5) / radiusX;
          const ny = (y - height) / (height * 0.92);
          const angle = Math.atan2(ny, nx);
          cells.push({
            x: x - cellWidth / 2, y: y - cellHeight / 2,
            radius: Math.hypot(nx, ny),
            edge: Math.min(1, x / 70, (width - x) / 70, y / 70),
            sinAngle3: Math.sin(angle * 3), cosAngle3: Math.cos(angle * 3),
            sinAngle2: Math.sin(angle * 2), cosAngle2: Math.cos(angle * 2),
            sinY5: Math.sin(ny * 5), cosY5: Math.cos(ny * 5),
            sinY9: Math.sin(ny * 9), cosY9: Math.cos(ny * 9),
            sinRibbon: Math.sin(nx * 12 + ny * 3),
            cosRibbon: Math.cos(nx * 12 + ny * 3),
          });
        }
      }
      draw();
    };

    const tick = (timestamp) => {
      frame = null;
      if (!visible || document.hidden || reduceMotion.matches) return;
      if (previousTime !== null) elapsed += Math.min(timestamp - previousTime, 80);
      previousTime = timestamp;
      const frameDuration = 1000 / (scrolling ? 12 : 24);
      if (timestamp - lastPaint >= frameDuration) {
        draw();
        lastPaint = timestamp - ((timestamp - lastPaint) % frameDuration || 0);
      }
      frame = requestAnimationFrame(tick);
    };

    const sync = () => {
      if (frame !== null) cancelAnimationFrame(frame);
      frame = null;
      previousTime = null;
      if (visible && !document.hidden && !reduceMotion.matches) {
        frame = requestAnimationFrame(tick);
      } else if (reduceMotion.matches) {
        draw();
      }
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    observer.observe(footer);
    new ResizeObserver(resize).observe(footer);
    document.addEventListener("visibilitychange", sync);
    reduceMotion.addEventListener("change", sync);
    window.addEventListener("scroll", () => {
      if (!visible || reduceMotion.matches) return;
      scrolling = true;
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => { scrolling = false; }, 140);
    }, { passive: true });
    resize();
  }
}
