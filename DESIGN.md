# Footer animation reference

Scope: the shared portfolio footer background only. Existing content, profile
video, typography, orange wordmark particles, and links are preserved.

## Reference and evidence

- Reference: https://benjamincreative.me/, bottom project enquiry section.
- Inspected on 6 November 2026 using the supplied screenshot, a fresh Firecrawl
  capture, and the user's local export at
  `/Users/yadunand/Documents/GitHub/benjamincreative-me-20261106202230`.
- Live branding extraction reports `#111111` as the page background, `#FFFFFF`
  for primary text, and `#FB4618` for its orange accent. The portfolio keeps its
  own existing orange accent.
- The local scene configuration identifies gradient, circle, beam, zoom blur,
  dither, and ASCII layers with animated beam phases and speed. These establish
  that the original is a changing light field rather than a stationary ring.
- The supplied screenshot shows a near-black top grading toward charcoal below,
  with gray ASCII characters and a soft glow. The fresh screenshot URL was
  returned but its image download was unavailable; it was not visually inspected.

## Implementation choices

- Approximate the observed background grading with a `#030303` to `#171717`
  vertical gradient and a faint neutral radial glow. These gradient stops are
  visual estimates, not extracted original shader values.
- Draw a breathing ASCII ring with rotating highlights. Pre-render each glyph's
  glow in a padded sprite atlas to avoid blurring a full-footer image each frame.
  Cache grid geometry and trigonometric terms when the footer resizes.
  Anchor its origin to the footer's
  bottom edge so it expands upward, with the background glow aligned below.
  This is an original Canvas 2D
  approximation; it does not reuse the reference's proprietary shaders or runtime.
- Keep all background canvases behind content and outside the pointer hit area.
- Use the same shared assets on all 23 pages. Support mobile resizing, cap the
  backdrop canvas at one million pixels and a pixel ratio of 1, throttle drawing
  to 24 fps (12 during scrolling), and pause off screen or in hidden
  tabs. Reduced motion displays a still frame.

Live browser animation comparison was unavailable. Capture data and local scene
settings support the treatment, but exact motion and shader fidelity are not
claimed.
