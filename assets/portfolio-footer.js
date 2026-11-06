const footer = document.querySelector("[data-profile-footer]");
const video = footer?.querySelector("[data-profile-video]");
const header = document.querySelector("[data-header]");

if (footer && header) {
  const observer = new IntersectionObserver(([entry]) => {
    header.toggleAttribute("data-footer-visible", entry.isIntersecting);
  });
  observer.observe(footer);
}

if (video) {
  const triggers = footer.querySelectorAll("[data-profile-video-trigger]");
  const hovered = new Set();
  const reverseSpeed = 1.5;
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

  const updatePlayback = () => {
    if (document.hidden) {
      cancelReverse();
      video.pause();
    } else if (hovered.size || focused) {
      cancelReverse();
      video.play().catch(() => {
        // Keep the still frame if the browser blocks playback.
      });
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
      focused = trigger;
      updatePlayback();
    });
    trigger.addEventListener("blur", () => {
      focused = null;
      updatePlayback();
    });
  }

  document.addEventListener("visibilitychange", updatePlayback);
}
