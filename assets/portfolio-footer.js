const footer = document.querySelector("[data-profile-footer]");

// Reuse the bundled animation runtime; no extra scroll engine or ticker.
async function initFooterReveal() {
  const stage = footer?.closest("[data-footer-reveal-stage]");
  if (!stage) return;
  const { gsap, ScrollTrigger } = await import("../_astro/BaseLayout.astro_astro_type_script_index_0_lang.Dpw5V1aT.js");
  if (!gsap?.context || !ScrollTrigger?.create) return;

  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const controller = new AbortController();
  const { signal } = controller;
  let context;
  let tween;
  let refresh;
  const refreshLayout = () => {
    refresh?.kill();
    refresh = gsap.delayedCall(0.08, () => ScrollTrigger.refresh());
  };
  const configure = () => {
    context?.revert();
    context = tween = undefined;
    if (!motion.matches) {
      context = gsap.context(() => {
        tween = gsap.fromTo(footer, {
          y: () => -Math.min(180, window.innerHeight * 0.24),
        }, {
          y: 0,
          ease: "none",
          scrollTrigger: {
            trigger: stage,
            start: "top bottom",
            end: () => `+=${Math.min(window.innerHeight, footer.offsetHeight)}`,
            scrub: true,
            invalidateOnRefresh: true,
          },
        });
      }, stage);
    }
    refreshLayout();
  };

  // Reveal clipped content before a keyboard user enters its links.
  footer.addEventListener("focusin", () => {
    const trigger = tween?.scrollTrigger;
    if (trigger && trigger.progress < 1) {
      window.scrollTo({ top: trigger.end, behavior: "instant" });
      ScrollTrigger.update();
    }
  }, { signal });
  motion.addEventListener("change", configure, { signal });
  stage.addEventListener("load", refreshLayout, { capture: true, signal });
  window.addEventListener("pageshow", refreshLayout, { signal });
  const observer = "ResizeObserver" in window ? new ResizeObserver(refreshLayout) : null;
  observer?.observe(footer);
  document.fonts?.ready.then(() => { if (!signal.aborted) refreshLayout(); });
  window.addEventListener("pagehide", (event) => {
    if (event.persisted) return;
    observer?.disconnect();
    refresh?.kill();
    context?.revert();
    controller.abort();
  }, { signal });
  configure();
}

// Keep the ordinary footer if the existing animation bundle cannot be loaded.
initFooterReveal().catch(() => {});

const video = footer?.querySelector("[data-profile-video]");
if (video) {
  // Preserve the initial frame via metadata preload; warm the full clip well
  // before the footer arrives instead of competing with the hero's download.
  let warmObserver;
  const warmVideo = () => {
    video.preload = "auto";
    warmObserver?.disconnect();
  };
  if ("IntersectionObserver" in window) {
    warmObserver = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) warmVideo();
    }, { rootMargin: "1600px 0px" });
    warmObserver.observe(footer);
  } else {
    warmVideo();
  }
  window.addEventListener("pagehide", (event) => {
    if (!event.persisted) warmObserver?.disconnect();
  });
  const triggers = footer.querySelectorAll("[data-profile-video-trigger], [data-profile-video]");
  const hovered = new Set();
  const reverseSpeed = 2;
  let focused = null;
  let reverseFrame = null;

  const cancelReverse = () => {
    if (reverseFrame === null) return;
    cancelAnimationFrame(reverseFrame);
    reverseFrame = null;
  };

  // Browsers do not consistently support negative video playback rates.
  // Seek backward from the current frame, stopping on the opening frame.
  const playReverse = () => {
    video.pause();
    if (reverseFrame !== null || !video.readyState || video.currentTime <= 0) return;

    let reverseTime = video.currentTime;
    let lastTimestamp = null;
    const step = (timestamp) => {
      if (lastTimestamp !== null) {
        reverseTime = Math.max(0, reverseTime - ((timestamp - lastTimestamp) / 1000) * reverseSpeed);
      }
      lastTimestamp = timestamp;

      // Let the decoder finish each seek before requesting another frame.
      if (!video.seeking) {
        video.currentTime = reverseTime;
        if (reverseTime === 0) {
          reverseFrame = null;
          return;
        }
      }
      reverseFrame = requestAnimationFrame(step);
    };
    reverseFrame = requestAnimationFrame(step);
  };

  // Keep the profile free of native control overlays on every screen size.
  video.controls = false;
  video.muted = true;
  video.loop = false;
  video.autoplay = false;
  video.removeAttribute("loop");
  video.removeAttribute("autoplay");

  const updatePlayback = () => {
    if (document.hidden) {
      cancelReverse();
      video.pause();
    } else if (hovered.size || focused) {
      warmVideo();
      cancelReverse();
      // Hold on the final frame while hovered instead of starting again.
      if (!video.ended) {
        video.play().catch(() => {
          // Keep the still frame if the browser blocks playback.
        });
      }
    } else {
      playReverse();
    }
  };

  for (const trigger of triggers) {
    trigger.addEventListener("pointerenter", (event) => {
      if (event.pointerType === "touch") return;
      hovered.add(trigger);
      updatePlayback();
    });
    trigger.addEventListener("pointerleave", () => {
      hovered.delete(trigger);
      updatePlayback();
    });
    trigger.addEventListener("pointercancel", () => {
      hovered.delete(trigger);
      updatePlayback();
    });
    trigger.addEventListener("focus", () => {
      focused = trigger.matches(":focus-visible") ? trigger : null;
      updatePlayback();
    });
    trigger.addEventListener("pointerdown", () => {
      // A mouse click must not keep playback active after the pointer leaves.
      focused = null;
      updatePlayback();
    });
    trigger.addEventListener("blur", () => {
      focused = null;
      updatePlayback();
    });
  }

  document.addEventListener("visibilitychange", updatePlayback);
}
