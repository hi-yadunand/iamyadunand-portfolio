// Routing aliases have no scrollable page. Replace them with the existing
// project index while retaining URL state and the pending arrival transition.
(() => {
  const destination = new URL("/projects", location.href);
  destination.search = location.search;
  destination.hash = location.hash || "#all-projects";
  try {
    const key = "portfolio-page-entry";
    const intent = JSON.parse(sessionStorage.getItem(key) || "null");
    if (intent?.to === location.href && Date.now() - intent.at < 10000) {
      intent.to = destination.href;
      sessionStorage.setItem(key, JSON.stringify(intent));
    }
  } catch { /* The native redirect also works with storage blocked. */ }
  location.replace(destination.href);
})();
