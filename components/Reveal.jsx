"use client";

import { motion } from "motion/react";

export default function Reveal({
  as = "div",
  children,
  delay = 0,
  y = 40,
  className,
  ...props
}) {
  const Element = motion[as];

  return (
    <Element
      {...props}
      className={className}
      data-motion-reveal=""
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </Element>
  );
}
