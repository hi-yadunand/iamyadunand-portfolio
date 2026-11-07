const footer = document.querySelector("[data-profile-footer]");
const video = footer?.querySelector("[data-profile-video]");
if (video) {
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
