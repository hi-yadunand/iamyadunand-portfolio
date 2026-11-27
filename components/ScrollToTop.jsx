"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export default function ScrollToTop() {
  const pathname = usePathname();
  const previousPath = useRef(pathname);

  useEffect(() => {
    if (previousPath.current === pathname) return;
    previousPath.current = pathname;
    // Initial document navigation and fragment alignment are owned by site-scroll.js.
    if (!window.location.hash) window.dispatchEvent(new Event("portfolio:scroll-to-top"));
  }, [pathname]);

  return null;
}
