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
  const talkVideo = stage?.querySelector("[data-footer-talk-video]");

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
    const maxWidth = width * (compact ? 0.74 : 0.62);
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
    const targetBaseline = height * (compact ? 0.4 : 0.42);
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
    const phraseCenterY = targetBaseline - phraseAscent / 2 + phraseDescent / 2;

    if (mailLink) {
      stage.style.setProperty("--footer-mail-left", `${mailLeft}px`);
      stage.style.setProperty("--footer-mail-top", `${mailTop}px`);
      stage.style.setProperty("--footer-mail-width", `${mailWidth}px`);
      stage.style.setProperty("--footer-mail-height", `${mailHeight}px`);
      mailLink.style.font = font;
    }

    if (talkVideo) {
      stage.style.setProperty("--footer-video-top", `${phraseCenterY}px`);
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
      targetCenterY: phraseCenterY,
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

  if (mailLink && talkVideo) {
    const firstFrameTime = 0.001;
    const lastFrameTrim = 0.04;
    const reverseSpeed = 1.35;
    let reverseFrame = 0;
    let reverseStartedAt = 0;
    let reverseVideoStartedAt = firstFrameTime;

    talkVideo.preload = "auto";
    talkVideo.setAttribute("preload", "auto");

    const cancelReverse = () => {
      if (!reverseFrame) return;
      cancelAnimationFrame(reverseFrame);
      reverseFrame = 0;
    };

    const getDuration = () =>
      Number.isFinite(talkVideo.duration) ? talkVideo.duration : 0;

    const keepOnFrame = () => {
      const duration = getDuration();
      const safeTime = duration
        ? Math.min(firstFrameTime, Math.max(0, duration - firstFrameTime))
        : firstFrameTime;

      try {
        talkVideo.currentTime = safeTime;
      } catch {
        // Some browsers reject early seeks before metadata is ready.
      }
    };

    const getSafeEndTime = () => {
      const duration = getDuration();
      return duration
        ? Math.max(firstFrameTime, duration - lastFrameTrim)
        : talkVideo.currentTime;
    };

    const playReverseFrame = (timestamp) => {
      if (!reverseStartedAt) {
        reverseStartedAt = timestamp;
      }

      const elapsed = ((timestamp - reverseStartedAt) / 1000) * reverseSpeed;
      const nextTime = reverseVideoStartedAt - elapsed;

      if (nextTime <= firstFrameTime) {
        cancelReverse();
        reverseStartedAt = 0;
        keepOnFrame();
        return;
      }

      talkVideo.currentTime = nextTime;
      reverseFrame = requestAnimationFrame(playReverseFrame);
    };

    const playVideo = () => {
      cancelReverse();
      reverseStartedAt = 0;
      talkVideo.playbackRate = 1;
      if (talkVideo.ended) keepOnFrame();
      talkVideo.play().catch(() => {});
    };

    const playVideoBack = () => {
      cancelReverse();
      talkVideo.pause();

      if (!talkVideo.readyState) {
        keepOnFrame();
        return;
      }

      reverseStartedAt = 0;
      reverseVideoStartedAt = Math.max(
        firstFrameTime,
        Math.min(talkVideo.currentTime, getSafeEndTime()),
      );
      reverseFrame = requestAnimationFrame(playReverseFrame);
    };

    talkVideo.addEventListener("loadedmetadata", keepOnFrame, { once: true });
    mailLink.addEventListener("pointerenter", playVideo);
    mailLink.addEventListener("focus", playVideo);
    mailLink.addEventListener("pointerleave", playVideoBack);
    mailLink.addEventListener("blur", playVideoBack);
  }
});
