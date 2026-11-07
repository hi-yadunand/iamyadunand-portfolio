# Phase 3 — Performance optimisation

Date: 2026-11-07. Scope: static portfolio; design frozen.

## Baseline and evidence limits

Inspected all 20 HTML files, live CSS/JavaScript imports, the generated base
bundle, local font declarations, media inventory and the Three.js drone module.
Twelve HTML documents render pages; eight project routes are redirects. Also
checked dormant custom scripts/assets to distinguish disk size from live loading.

The phase-start snapshot includes the already implemented homepage footer
parallax. Its layout, movement and timing remain intact. In particular,
`assets/portfolio-footer.css` already had uncommitted changes at phase start;
this phase does not change that stylesheet.

The connected browser list was empty. No Lighthouse, LCP, INP, CLS, FPS, GPU,
network-waterfall or real-browser console measurements are available. File sizes
below are actual local byte counts, not estimates of initial network transfer.
DOM/scheduler fixtures are controlled code tests, not browser rendering tests.

### Largest files found before changes

| File | Bytes | Loading relevance |
| --- | ---: | --- |
| `images/startupgrow.png` | 3,094,779 | Referenced by a homepage project preview |
| `images/iamyadunandhero.png` | 2,138,398 | Unused original; live hero already uses WebP |
| `images/codeandthrive.png` | 544,706 | Unused original; live references use WebP |
| `images/howdyiamyadunand.MOV` | 529,087 | Unused source; live video uses MP4 |
| `images/codingdesk.png` | 391,741 | Below-fold CTA illustration on three pages |
| `images/howdyiamyadunand.mp4` | 362,306 | Footer profile video on all 12 rendered pages |
| `images/iamyadunand-favicon.png` | 167,929 | Shared favicon, retained unchanged |
| Shared base JavaScript bundle | 149,785 | GSAP, ScrollTrigger, Lenis and shared interactions |
| `assets/models/drone.glb` | 146,392 | Drone model, previously requested during initialisation |
| `images/iamyadunandhero.webp` | 138,576 | Existing high-priority homepage hero |

## Main findings and changes

### Media

- Re-encoded the two live PNGs as **lossless WebP**, without resizing, cropping or
  changing composition. Verified full RGBA byte equality, dimensions, ICC colour
  profile and orientation. Preserved the original files and the Startup Grow
  embedded colour profile. Did not substitute the existing lower-resolution,
  lossy Startup Grow image.
- Changed only those image references on the homepage, projects and services
  pages. Existing width/height, CSS and lazy-loading attributes are unchanged.
- All image elements already had width and height attributes; below-fold images
  were already lazy loaded. No extra dimension/layout changes were needed.
- Made the homepage hero's existing default eager behaviour explicit; retained
  `fetchpriority="high"`, its original image, dimensions and image treatment.
- Footer videos now request metadata/initial-frame data instead of using an
  unconditional `preload="auto"`. The existing video script promotes to auto
  preload 1,600px before the footer, or immediately on hover/focus. The source,
  fragment, dimensions, playback and reverse-playback logic remain the same.
  Metadata preload is a browser hint; actual bytes fetched need a waterfall check.

### Initial loading and fonts

- The homepage previously dynamically imported the drone immediately at the
  bottom of the document; dynamic import alone did not defer the expensive work.
  A small bootstrap now waits until the drone is within 2,500px of the viewport
  before importing the same module, Three.js loaders, model and decoder.
- A single cached import and disconnected preload observer prevent duplicate
  initialisation. Unsupported observation falls back to immediate loading;
  import failures retain the original fallback state. No dependencies added.
- Added preloads for only the Latin Inter Tight and Geist Mono files used above
  the fold (68,000 bytes combined). Existing font faces and `font-display: swap`
  are unchanged. No extra language subsets or fonts are preloaded.
- Preloaded `assets/navigation.css` to shorten its discovery chain through the
  base CSS's existing `@import`. This is only a preload hint: CSS order and
  application remain unchanged, with one canonical URL reused by the import.
- Other stylesheets remain render blocking to preserve first-paint styling.
  All external executable scripts are already modules; the tiny inline startup
  script intentionally establishes motion/session classes before rendering.

### Drone CPU/GPU work

- The old render callback requested its next frame before checking visibility.
  It therefore continued invoking JavaScript offscreen, even when skipping GPU
  rendering. It also continued scheduling frames for a static reduced-motion
  scene.
- The new scheduler cancels pending callbacks while offscreen or in a hidden
  tab, schedules at most one callback on resume and draws the reduced-motion
  band only when invalidated. Rendering starts only after a model is available.
  The existing 32% visibility threshold remains unchanged.
- No changes to model, textures, lighting, antialiasing, tone mapping, exposure,
  2x device-pixel-ratio cap, camera composition, entrance/flip timings, propeller
  speeds, pointer interpolation or visible rendering formulas.
- Resize checks skip redundant renderer buffer/camera work when the dimensions,
  pixel ratio and model are unchanged. Reuse one geometry read per resize and
  observe actual stage-size changes as well as window resize.
- Dispose decoder workers after loading, and release shared geometry, materials,
  textures and renderer resources on permanent page departure. Handle model
  completion after teardown. Back/forward-cache departure pauses rendering
  without disposing the retained scene; `pageshow` resumes it.

### Scroll and DOM work

- Verified one application Lenis constructor, guarded by `!Dc`; Lenis has
  `autoRaf: false` by default and is advanced by the existing GSAP ticker.
  Its scroll callback updates the same ScrollTrigger instance. No new Lenis,
  GSAP, ScrollTrigger, smooth-scroll loop or ticker was introduced.
- Kept duration `1.25`, anchor offset `-72`, ticker configuration and all scroll
  easing, animation timings, scrub settings and scroll distances unchanged.
- Navigation now reads section geometry before writing header attributes.
  Retained every threshold and the 650ms expansion plus 250ms hold. Cache the
  motion media query instead of recreating it during expansion.
- Project cursor now changes its text/opacity only when needed. Pointer position
  output and transitions remain unchanged; no extra animation loop added.
- Particle lettering already stops when settled/offscreen/hidden. The ASCII
  footer already pauses offscreen/hidden and caches its glyph atlas, with the
  existing 24fps/12fps paint throttling. Left these visual effects unchanged.

### Loader

The first-visit loader deliberately animates a 1.3-second counter/line followed
by a 0.9-second wipe; heading/copy delays are coordinated with it. This is an
intentional presentation delay, not a pending network dependency. Removing or
shortening it would violate the design/timing freeze, so it remains unchanged.
Session-return and reduced-motion startup behaviour also remain unchanged.

## Measured before and after

| Asset | Before | After | Reduction |
| --- | ---: | ---: | ---: |
| Coding desk illustration | 391,741 B | 237,406 B | 154,335 B (39.4%) |
| Full-resolution Startup Grow preview | 3,094,779 B | 1,252,202 B | 1,842,577 B (59.5%) |
| Combined | 3,486,520 B | 1,489,608 B | **1,996,912 B (57.3%)** |

These are replacement-file savings when those images are requested. The hero
image and video files themselves are unchanged. Original PNG files remain on
disk, so repository size increases; browser references use the smaller files.

A controlled scheduler test advanced 120 offscreen ticks: the original drone
callback ran 120 times; the updated callback ran zero times. This demonstrates
scheduler behaviour, **not** measured browser FPS, CPU usage or battery savings.

## Files changed in this phase

Created:

- `assets/drone-loader.js`: early viewport-driven import of the existing drone.
- `images/codingdesk.webp`: same-size, exact-pixel replacement.
- `images/startupgrow-lossless.webp`: same-size, exact-pixel replacement with ICC.
- `PERFORMANCE.md`: baseline, changes, measured byte counts and verification limits.

JavaScript modified:

- `assets/drone-services.js`: visibility scheduling, resize deduplication,
  decoder/GPU cleanup and cache-restoration handling.
- `assets/navigation.js`: geometry reads before writes; cached motion query.
- `assets/project-cursor.js`: avoid redundant text/opacity writes.
- `assets/portfolio-footer.js`: warm the existing video near the viewport;
  preserve the previously implemented footer reveal and playback interactions.

HTML modified:

All twelve rendered pages get the same three resource preloads and video
metadata hint. `index.html` additionally uses the drone bootstrap and explicit
hero eager hint. The two WebP substitutions affect `index.html`; the coding
illustration substitution also affects `projects.html` and `services.html`.

- `index.html`
- `projects.html`
- `services.html`
- `contact.html`
- `contact/.project=Almond%20Terrace.html`
- `contact/.project=Dune%20House.html`
- `contact/.project=Foundry%20Exchange.html`
- `contact/.project=Harrow%20Civic%20Hall.html`
- `contact/.project=Kestrel%20Ridge%20House.html`
- `contact/.project=Larch%20Court.html`
- `contact/.project=Quay%20Forty.html`
- `contact/.project=The%20Copper%20Stair.html`

No CSS, generated bundle, animation library, redirect, content or deleted page
was changed/restored in this phase. No commit or push was performed.

## Verification completed

- `git diff --check` and JavaScript syntax checks for all 21 JavaScript files.
- All local HTML links/fragments, images, media, scripts, styles, preloads and
  live CSS font/import URLs resolve across all 20 HTML files.
- No duplicate script tags; one drone import gate and one base runtime. No second
  Lenis or GSAP bootstrap. Verified Three.js imports still use version 0.160.0.
- Source comparison against phase-start: all CSS/generated assets byte identical;
  HTML content, classes, dimensions, section order and markup identical after
  reversing only the documented hints/import and image substitutions.
- Full decoded image pixels, colour profiles, orientation and dimensions match.
- Controlled before/after drone tests: sampled visible poses, camera, exposure
  and DPR match; no callbacks offscreen; hidden-tab resume, reduced-motion stop,
  resize deduplication, bfcache restoration, pending-load teardown and resource
  disposal pass.
- Controlled navigation tests: same states and hide delays with both motion
  settings, and all geometry reads precede header writes.
- Controlled cursor test: same output across pointer events, fewer text/opacity
  writes. Drone bootstrap test: deferred single import, fallback and observer
  cleanup. Footer-video test: metadata until nearby, then warm/hover/reverse
  paths execute without fixture errors.
- Existing FAQ, accordion, workflow and footer markup/shared controller code
  preserved; actual browser interaction remains unverified.
- `studio.html`, `privacy.html` and `terms.html` remain absent.

## Remaining bottlenecks and browser verification

1. At **375, 390, 768, 1024 and 1440px**, compare the page with the original:
   identical layouts, portrait/crops, illustration colours, typography,
   navigation expansion/hide, hover states, footer reveal and no overflow.
2. In DevTools with cache disabled and a throttled connection, record cold-load
   LCP, CLS, INP/long tasks and the network waterfall. Check that the two font
   preloads are consumed (no duplicate/unused-preload warnings), and the hidden
   menu does not unexpectedly request large previews during initial loading.
3. Scroll slowly and quickly toward the drone: verify import/model/decoder
   requests start before it appears and there is no visible late loading. Test
   GPU/model failures. Observe performance while entering/leaving the section,
   changing tabs and navigating back/forward.
4. The 1.25 MB lossless full-resolution preview and 168 KB favicon remain large.
   Smaller responsive/lossy replacements would need visual review; they were not
   introduced without it. The original unused large PNG/MOV assets do not cause
   requests simply by existing and were not deleted.
5. Three.js/loaders and the Draco decoder still rely on the existing third-party
   hosts. Cold connection/decoder/shader compilation costs remain, now deferred
   until the section approaches. Test fast scrolling on a cold, slow connection.
6. The intentional loader limits first-visit perceived readiness even if assets
   download faster. Any timing change requires a separate decision outside the
   design freeze.
7. Check the footer's initial video frame, prompt hover playback and reverse
   playback on Safari/iOS and Chrome, both after slow scrolling and jumping to
   the footer. Browser metadata/preload behaviour varies.
8. Test initial and changed reduced-motion preferences, all project filters,
   sliders, mobile services accordion, FAQ, workflow, menu, contact form and
   footer links. Check the browser console for runtime/CORS/WebGL/media errors.
   No real-browser console or visual regression results are claimed here.
