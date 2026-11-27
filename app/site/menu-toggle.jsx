"use client";

import { Cancel01Icon, Menu01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useState } from "react";

export function MenuToggle({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    // The shared navigation runtime owns the overlay and scroll lock.
    const syncState = () => setIsOpen(root.hasAttribute("data-menu-open"));
    const observer = new MutationObserver(syncState);
    observer.observe(root, { attributeFilter: ["data-menu-open"] });
    syncState();
    return () => observer.disconnect();
  }, []);

  return (
    <button
      type="button"
      data-menu-toggle=""
      aria-controls="site-menu"
      aria-expanded={isOpen}
      className="text-sm lg:hidden"
    >
      <HugeiconsIcon
        icon={Menu01Icon}
        altIcon={Cancel01Icon}
        showAlt={isOpen}
        size={24}
        strokeWidth={1.5}
        color="currentColor"
        className="site-menu-toggle__icon"
        aria-hidden="true"
      />
      {children}
    </button>
  );
}
