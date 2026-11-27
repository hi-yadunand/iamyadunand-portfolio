"use client";

import { useEffect } from "react";

export function SiteRuntime({ scripts }) {
  useEffect(() => {
    if (document.head.querySelector("[data-site-runtime]")) return;

    // These modules own the DOM effects for a full document. Start them after
    // React hydrates so their mutations cannot invalidate server-rendered HTML.
    for (const { src, integrity, crossOrigin, data } of scripts) {
      const script = document.createElement("script");
      script.type = "module";
      script.async = false;
      script.src = src;
      script.setAttribute("data-site-runtime", "");
      if (integrity) script.integrity = integrity;
      if (crossOrigin) script.crossOrigin = crossOrigin;
      if (data) script.setAttribute("data-cf-beacon", data);
      document.head.append(script);
    }
  }, [scripts]);

  return null;
}
