export const boot = String.raw`(function () {
      // Keep public page URLs extensionless; the static host serves the HTML files.
      var originalPageURL = location.href;
      try {
        var pageURL = new URL(originalPageURL);
        var pagePath = pageURL.pathname.replace(/\/index\.html$/i, "/").replace(/\.html$/i, "");
        if (pagePath !== "/") pagePath = pagePath.replace(/\/+$/, "");
        if (pagePath !== pageURL.pathname) {
          history.replaceState(history.state, "", pagePath + pageURL.search + pageURL.hash);
        }
      } catch (e) {}
      var h = document.documentElement;
      if (matchMedia("(prefers-reduced-motion: no-preference)").matches) h.classList.add("motion");
      try {
        // Reloads replay the starter animation from the top of the page.
        var initialNavigation = performance.getEntriesByType("navigation")[0];
        if (initialNavigation && initialNavigation.type === "reload" &&
            !location.hash) {
          h.setAttribute("data-reload-top", "");
          history.scrollRestoration = "manual";
          window.scrollTo({ top: 0, left: 0, behavior: "instant" });
        }
        if ((!initialNavigation || initialNavigation.type !== "reload") &&
            sessionStorage.getItem("yadunand-loaded")) h.classList.add("loaded");
      } catch (e) { }

      // Arrival fade applies only to an intentional internal page navigation.
      // Reloads replay the loader; intentional internal navigation uses the arrival fade.
      try {
        var entry = sessionStorage.getItem("portfolio-page-entry");
        if (entry) {
          sessionStorage.removeItem("portfolio-page-entry");
          var intent = JSON.parse(entry), to = new URL(intent.to, location.href);
          var referrer = document.referrer ? new URL(document.referrer) : null;
          var kind = performance.getEntriesByType("navigation")[0];
          if (to.origin === location.origin && Date.now() - intent.at < 10000 &&
              (to.href === location.href || to.href === originalPageURL || (referrer && (referrer.href === to.href || referrer.href === intent.from))) &&
              (!kind || (kind.type !== "reload" && kind.type !== "back_forward"))) {
            h.classList.add("loaded");
            if (!matchMedia("(prefers-reduced-motion: reduce)").matches) h.setAttribute("data-site-enter", "");
          }
        }
      } catch (e) {}
    })();`;
