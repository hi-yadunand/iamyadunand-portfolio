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

## Expanding navigation reference

Scope: shared navigation across the portfolio. Reference:
https://daqconsulting.com/, inspected through the user's two desktop screenshots
and a Firecrawl page capture on 7 November 2026. The screenshots show an inset,
transparent header at the top and an opaque, full-width bar after scrolling,
with the brand and action moving toward opposite edges. Center links stay
centered. The returned live screenshot was not separately inspected.

Implementation values are adaptations, not extracted reference CSS: desktop
horizontal padding starts at 9.5vw (capped at 192px), then becomes 32px after
32px of scrolling. Vertical padding changes from 30px to 16px. Per the user's
latest preference, the navigation background and border stay transparent before
and after scrolling. Existing section-aware text colors remain in effect.
Padding transitions take 650ms, followed by a 250ms pause before hiding is allowed.
After 160px, continued downward scrolling slides the header up over 700ms;
upward scrolling reveals it and cancels a pending hide. An open menu or keyboard
focus keeps the header visible. It restores its inset state at the top. Mobile uses
28px initial side padding and 20px when expanded. Reduced motion disables
transitions. Existing type, navigation links, menu, and call to action remain.

Brand and content: loading screens and titles use Yadunand Pavithran. Navigation
images use local portfolio assets. Project notes describe existing work rather
than sample endorsements. Contact opens an email app using the portfolio's
published address; no delivery or response-time claim is made. Archived sample
architecture routes redirect to the real project register.

Navigation state checks and local asset references pass. Browser preview was
unavailable, so desktop/mobile visual fidelity remains unverified.

## Services accordion

The five services use the original click-to-open accordion in normal document
flow. The first service opens initially. Clicking a title closes the previous
panel and slides open the selected service; clicking it again closes it. The
existing shared accordion controller provides the interaction and refreshes
scroll animation positions after the panel transition. Titles, plus/cross
icons, images, descriptions, and feature lists are preserved.

The services section has no sticky stage, extra scroll distance, automatic
selection, wheel interception, or scroll locking. Mobile uses the same click
interaction. The temporary services scroll script and stylesheet are removed.
