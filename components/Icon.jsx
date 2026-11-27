import { HugeiconsIcon } from "@hugeicons/react";

export default function Icon({ icon, size = 24, strokeWidth = 1.5, className = "" }) {
  return (
    <HugeiconsIcon
      icon={icon}
      size={size}
      strokeWidth={strokeWidth}
      color="currentColor"
      className={className}
      aria-hidden="true"
    />
  );
}
