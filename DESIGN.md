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

## Contact page layout

Reference: [Bram van Vugt’s contact page](https://www.bramvanvugt.com/contact),
captured on 10 November 2026. The two supplied desktop screenshots were visually
inspected. A fresh Firecrawl capture confirmed the field sequence, portrait link,
typography, and pill-shaped controls. The separately returned screenshot was
not inspected. Branding extraction reports Neuemontreal with a heading sample
of 76.8px and body sample of 20.4px; its general color extraction conflicts with
the light page visible in the supplied screenshots. Color extraction is not used.

Observed layout: two roughly equal columns with substantial open space, a
two-line introduction on the left, a square portrait next to an email link, and
the enquiry form on the right. Form controls have bottom borders, the service
choices are rounded pills, and the submit button has a small outlined circle.
The reference portrait is published at
`https://cdn.prod.website-files.com/6978dadfad803d74561d3cfc/6979ead3b10a3cca85c1cf7e_foioter-img.avif`;
the implementation uses the existing local `images/iamyadunandhero.webp` instead.

Portfolio adaptation: retain Inter Tight, personal copy and contact details,
white text, and the orange interaction accent. The existing black ASCII
background files, horizon placement, palette, opacity, and animation settings
are unchanged. New layout styles live separately in `assets/contact-layout.css`.
The 2.5vw side gutters, 1.5vw column gap, responsive 48–88px heading, and generous
field spacing are implementation estimates based on the supplied images, not
extracted CSS. Below 768px the columns stack; this is an implementation choice
because the supplied evidence is desktop-only. Focus states and service checkbox
selection remain available with the keyboard.

The form asks for name, email, company, services, budget, deadline, and a project
description. Budget ranges are editable enquiry choices in INR, not published
service prices. Native validation requires name, email, and project description.
Submission prepares a local email draft and clearly tells visitors to send it
from their email app. It does not claim server delivery or clear entered details.
The original shared navigation and footer remain in place. All nine rendered
contact routes share the same layout and behavior. Local browser visual QA
remains unavailable without a connected browser.

## Project image loader

The supplied loader screenshot and the live public animation source at
`https://slater.app/17302/55042.js`, inspected on 11 November 2026, inform this
implementation. The reference scales four image wrappers from zero to full
size over 0.8 seconds, staggered by 0.5 seconds, with rotations of 7, -7, 4,
and -4 degrees. Each inner image simultaneously scales from 2 to 1 and fades
in, using `power3.out`. The counter runs for 1.9 seconds with `power2.inOut`.
The page scales up from zero with a five-degree rotation, using the reference's
`cubic-bezier(0.25, 0.1, 0.1, 0.95)` curve evaluated without another plugin.

The portfolio retains the `#111` background and centered stack, using local
Karuvin, Lobiatek, Zappo, and Spakgen images. Stable card stacking replaces
the earlier shuffle. Transform and opacity animations run on compositor
layers, and the counter remains near the bottom. The percentage follows the
entrance animation timeline.

Shared styles and animation live in `assets/preloader.css` and
`assets/preloader.js`. All rendered pages use the same markup. The existing
session flag skips repeat direct visits, while every browser reload replays
the loader on any page. Internal links retain their arrival fade, and
reduced-motion visitors skip the loader. The existing
four-second CSS fallback stays active if JavaScript fails. A 3.8-second
JavaScript fallback also restores the page and header styles if animation
execution stops. Completion restores authored inline styles and refreshes
scroll measurements after the temporary viewport crop. Mobile uses a smaller
stack, and the counter respects the bottom safe area. Browser preview was
unavailable, so the motion was checked against source rather than visually
verified in a live browser.

Homepage reloads without a URL fragment disable browser scroll restoration in
the head and start at the hero. The scroll controller synchronizes to zero
after layout refreshes until the loader and initial layout finish, then restores
automatic history handling. User interaction cancels initial positioning.
Back/forward navigation and explicit fragment URLs retain their existing
positioning. Regression checks simulate a saved footer position and layout
changes during the loader; live browser verification remains unavailable.

The homepage header starts with `data-on-dark` so its text is white over the
hero before initialization. Navigation retains its initial color while the
loader transforms the page and recalculates section colors on the shared
`portfolio:preloader-complete` event after page styles are restored.

## Overlapping page transitions

Normal internal page changes follow the supplied reference screenshots and the
reference's public animation source: the outgoing page shrinks to 95% and dims,
while the incoming page slides up at a five-degree tilt, then expands from 85%
to full size. The slide lasts one second; expansion lasts 0.8 seconds and starts
at 0.6 seconds. A `#111` backdrop fills the exposed edges.

Native cross-document View Transitions preserve overlapping viewport snapshots
without transforming the actual document layout. The early shared head script
handles the snapshot lifecycle. Full overlap requires browser support; the
fallback animates each document separately. Home and reloads retain the starter
loader, and reduced motion skips both effects. See `NAVIGATION.md` for behavior
and validation details. Live browser comparison remains unavailable.
