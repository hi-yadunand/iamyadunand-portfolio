const removedWorksPattern =
  /\b(004|005|006|007|008|009)\b|TECHNOGYM|CAMPARI|SPIRITHEQUE|ARISTON|FARCHIONI|LAMBORGHINI|COSTA/i;

function removeExtraWorks() {
  const works = document.querySelector("[data-works]");

  if (!works) {
    return false;
  }

  let removed = false;

  Array.from(works.children).forEach((item, index) => {
    if (index >= 3 || removedWorksPattern.test(item.textContent || "")) {
      item.remove();
      removed = true;
    }
  });

  return removed;
}

function scheduleRemoval() {
  cancelAnimationFrame(scheduleRemoval.frame);
  scheduleRemoval.frame = requestAnimationFrame(removeExtraWorks);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", removeExtraWorks, { once: true });
} else {
  removeExtraWorks();
}

const observer = new MutationObserver(scheduleRemoval);
observer.observe(document.body, {
  childList: true,
  subtree: true,
});

scheduleRemoval();
