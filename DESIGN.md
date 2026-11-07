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

The five-service section uses its original full-width accordion on desktop and
mobile. Clicking a numbered title opens its image, description, and capability
list below the heading and closes the other service panels. The first service
starts open. The existing shared accordion controller owns this interaction;
the FAQ keeps its independent accordion group and the workflow is unchanged.

The page no longer loads the sticky-scroll enhancement CSS or JavaScript. Those
assets remain in the repository, inactive. The approved editorial palette,
fonts, content, and service images are preserved. Scoped reduced-motion styles
remove the accordion transitions, and a no-JavaScript fallback reveals all five
service details in document flow.

## Approved Phase 1 — editorial design system

Direction: **Editorial Precision Meets Cinematic Restraint**. Implemented in
`assets/editorial-system.css`, loaded after existing styles on the seven main
pages and eight retained contact routes. Redirect-only project pages are
unchanged. This phase establishes tokens and reusable primitives; it does not
reorder content, redesign sections, or change animation controllers.

### Colour tokens

| Role | Token | Approved value |
| --- | --- | --- |
| Background | `--ed-color-background` | `#F4F1EA` |
| Secondary surface | `--ed-color-surface` | `#E9E5DD` |
| Primary text | `--ed-color-text` | `#111110` |
| Secondary text | `--ed-color-text-secondary` | `#68655F` |
| Accent | `--ed-color-accent` | `#EF4418` |
| Small-text accent | `--ed-color-accent-text` | `#EF4418` (aliases the accent) |
| Dark section | `--ed-color-dark` | `#1B1B1B` |

Borders use primary text at 14% opacity on light surfaces and bone at 20%
opacity on dark surfaces. Existing `--color-page`, `--color-paper`,
`--color-ink`, `--color-graphite`, `--color-signal`, and border tokens alias the
approved palette. Plain `bg-ink` sections use the dark-section token; existing
page-specific image treatments and the footer backdrop retain their styles.

Use the accent for large titles and decorative emphasis. Small labels, selected
filter controls and text links use the stronger small-text accent on light
surfaces. Contextual link and rule tokens switch to light colours in existing
dark/white-text containers. Buttons use ink/bone by default, and the small-text
accent with bone on hover/focus, retaining readable contrast.

### Typography tokens

- Sans: `Inter Tight Variable`, from the existing local WOFF2 declarations.
- Metadata: `Geist Mono Variable`, from the existing local WOFF2 declarations.
- No new fonts, font downloads or duplicate `@font-face` declarations.
- Existing five `--text-display-*` clamp ranges are retained through
  `--ed-type-display-*` aliases to preserve current headline compositions.
- Body: `clamp(1rem, .94rem + .25vw, 1.125rem)`, line-height `1.5`.
- Metadata: `clamp(.75rem, .72rem + .1vw, .8125rem)`, line-height `1.4`,
  tracking `.04em`. This raises the previous 11px label baseline to 12–13px.
- Display weight: `450`; body weight: `400`; button weight: `500`.
- Heading defaults live in the existing `base` cascade layer. Explicit utility
  classes and page-specific type/leading rules remain authoritative.

### Spacing and layout tokens

`--ed-space-*` uses the existing 4px base: 4, 8, 12, 16, 24, 32, 48, 64,
96, 144 and 192px. The original `--spacing` aliases that same 4px unit so existing
spacing utilities retain their measurements.

| Width | Content side margin | Reusable grid | Reusable gutter |
| --- | --- | --- | --- |
| Below 768px | 24px | 4 columns | 16px |
| 768–1023px | 32px | 12 columns | 24px |
| 1024–1439px | 48px | 12 columns | 24px |
| 1440px and above | 64px | 12 columns | 24px |

Content shells cap at 100rem (1600px at the default root size). Existing
12-column templates and explicit gap/spacing utilities are preserved. The
navigation's more-specific shell rules keep its existing inset/expanded widths.

Opt-in primitives for later phases: `editorial-grid`, `editorial-section`,
`editorial-copy`, `editorial-meta`, `editorial-link`, `editorial-section-label`,
`editorial-rule`, and `editorial-surface`. These do not restructure existing
sections. Buttons retain their variants and gain a 44px minimum height and
consistent keyboard focus treatment. Reduced motion disables button transitions.

### Integration boundaries and verification

All existing stylesheets remain loaded. No generated `_astro` file, JavaScript,
font, image, page content, navigation destination, or interaction is changed.
The only HTML edit per rendered page is the final shared stylesheet link.
Responsive token/cascade, source-preservation, local font/asset path and link
checks cover 375, 390, 768, 1024 and 1440px. Browser access is unavailable, so
rendered overflow, visual regressions and network/console font errors still
require a live browser check.

## Current page routes

`terms.html`, `privacy.html`, and `studio.html` were removed at the owner's
request. The primary pages are now `index.html`, `projects.html`, `services.html`,
and `contact.html`. All former Projects links to `studio.html` point to
`projects.html`, including navigation and footer links on retained contact
routes. Existing project redirects continue to lead to the project index.
