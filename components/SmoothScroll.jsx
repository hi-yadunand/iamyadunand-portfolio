"use client";

import { MotionConfig } from "motion/react";
import ScrollToTop from "./ScrollToTop";

export default function SmoothScroll({ children }) {
  // SiteRuntime starts the shared Lenis and ScrollTrigger ticker once per document.
  return (
    <MotionConfig reducedMotion="user">
      <ScrollToTop />
      {children}
    </MotionConfig>
  );
}
