import { createParticleTextEffect } from "./particle-text-effect.js";

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
  const mailLink = stage?.querySelector("[data-footer-mail-link]");

  if (!stage || !canvas) return;

  let textLayout = null;

  const getFooterLayout = ({ ctx, width, height }) => {
    const staticText = "Let's ";
    const particleText = "talk.";
    const text = `${staticText}${particleText}`;
    const compact = width <= 700;
    let fontSize = compact
      ? Math.min(width * 0.115, height * 0.5)
      : Math.min(width * 0.12, height * 0.54);
    const maxWidth = width * (compact ? 0.82 : 0.74);
    const family = '"Archivo Variable", Archivo, "Helvetica Neue", Arial, sans-serif';
    let font = `italic 760 ${fontSize}px ${family}`;

    ctx.font = font;
    while (ctx.measureText(text).width > maxWidth && fontSize > 32) {
      fontSize *= 0.96;
      font = `italic 760 ${fontSize}px ${family}`;
      ctx.font = font;
    }

    const phraseMetrics = ctx.measureText(text);
    const staticWidth = ctx.measureText(staticText).width;
    const particleMetrics = ctx.measureText(particleText);
    const phraseLeft = 0;
    const targetBaseline = height * (compact ? 0.66 : 0.7);
    const particleLeft = phraseLeft + staticWidth;
    const phraseAscent = phraseMetrics.actualBoundingBoxAscent || fontSize;
    const phraseDescent =
      phraseMetrics.actualBoundingBoxDescent || fontSize * 0.22;
    const particleAscent =
      particleMetrics.actualBoundingBoxAscent || phraseAscent;
    const particleDescent =
      particleMetrics.actualBoundingBoxDescent || phraseDescent;
    const phraseLeftEdge =
      phraseLeft - Math.max(phraseMetrics.actualBoundingBoxLeft || 0, 0);
    const phraseRightEdge =
      phraseLeft +
      Math.max(
        phraseMetrics.actualBoundingBoxRight || phraseMetrics.width,
        phraseMetrics.width,
      );
    const hitPadding = compact ? 3 : 5;
    const mailLeft = Math.max(0, phraseLeftEdge - hitPadding);
    const mailTop = Math.max(0, targetBaseline - phraseAscent - hitPadding);
    const mailWidth = Math.min(
      width - mailLeft,
      phraseRightEdge - phraseLeftEdge + hitPadding * 2,
    );
    const mailHeight = Math.min(
      height - mailTop,
      phraseAscent + phraseDescent + hitPadding * 2,
    );

    if (mailLink) {
      stage.style.setProperty("--footer-mail-left", `${mailLeft}px`);
      stage.style.setProperty("--footer-mail-top", `${mailTop}px`);
      stage.style.setProperty("--footer-mail-width", `${mailWidth}px`);
      stage.style.setProperty("--footer-mail-height", `${mailHeight}px`);
      mailLink.style.font = font;
    }

    textLayout = {
      font,
      staticText,
      left: phraseLeft,
      baseline: targetBaseline,
    };

    return {
      text: particleText,
      font,
      fontSize,
      targetCenterX: particleLeft + particleMetrics.width / 2,
      targetCenterY: targetBaseline - particleAscent / 2 + particleDescent / 2,
    };
  };

  createParticleTextEffect({
    container: stage,
    canvas,
    pointerTarget: stage,
    color: "#ee4b2b",
    highlightColor: "#ee4b2b",
    particleSize: 2,
    density: 4,
    scatter: 180,
    gatherDuration: 1600,
    stagger: 420,
    pointerRepel: 40,
    repelRadius: 120,
    idleDrift: 0.7,
    glow: true,
    getLayout: getFooterLayout,
    drawBase: (ctx) => {
      if (!textLayout) return;

      ctx.font = textLayout.font;
      ctx.fillStyle = "#f5f0eb";
      ctx.textBaseline = "alphabetic";
      ctx.fillText(textLayout.staticText, textLayout.left, textLayout.baseline);
    },
  });
});
