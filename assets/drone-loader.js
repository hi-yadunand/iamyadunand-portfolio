// Fetch Three.js, its decoders and the model before the section comes into view,
// instead of competing with the hero during the initial page load.
const root = document.querySelector("[data-drone-services]");
if (root) {
  let loading;
  const load = () => {
    if (!loading) {
      loading = import("./drone-services.js").catch(() => {
        root.classList.add("is-fallback");
      });
    }
    return loading;
  };
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      observer.disconnect();
      load();
    }, { rootMargin: "2500px 0px" });
    observer.observe(root);
    window.addEventListener("pagehide", (event) => {
      if (!event.persisted) observer.disconnect();
    }, { once: true });
  } else {
    load();
  }
}
