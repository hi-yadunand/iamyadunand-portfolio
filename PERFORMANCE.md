# Phase 3 — Performance review and optimisation

Baseline: 2026-11-07, current working tree including the approved footer reveal.
Design, content, scroll feel and animation appearance are frozen.

## Baseline findings

Inspected 23 HTML documents (15 rendered pages and eight redirects), their live
script/style dependencies, generated GSAP/ScrollTrigger/Lenis bundle, font
faces, media inventory, drone model loading and animation callbacks.

| File/resource | Baseline bytes | Finding |
| --- | ---: | --- |
| `images/startupgrow.png` | 3,094,779 | Live homepage project-preview reference |
| `images/iamyadunandhero.png` | 2,138,398 | Unused original; live hero already uses WebP |
| `images/codeandthrive.png` | 544,706 | Unused original; live references use WebP |
| `images/howdyiamyadunand.MOV` | 529,087 | Unused source; live video uses MP4 |
| `images/codingdesk.png` | 391,741 | Live CTA illustration on four pages |
| `images/howdyiamyadunand.mp4` | 362,306 | Footer video with automatic preload on 15 pages |
| `images/iamyadunand-favicon.png` | 167,929 | Shared favicon; retained unchanged |
| Generated base JavaScript | 149,741 | Shared animation libraries and interactions |
| `assets/models/drone.glb` | 146,392 | Compressed model; previously loaded on startup |
| `images/iamyadunandhero.webp` | 138,576 | Existing high-priority hero; retained unchanged |
| Generated base CSS | 44,373 | Render blocking; imports navigation CSS |
| Two Latin font subsets | 68,000 combined | Needed for the initial Inter Tight/Geist Mono text |

The drone requested another animation frame before checking visibility, so its
JavaScript callback continued running offscreen even when GPU rendering was
skipped. Static reduced-motion scenes also kept scheduling callbacks. The
initial homepage import immediately fetched Three.js/loaders/model despite the
section being below the fold. Navigation wrote attributes before reading
section geometry, and the project cursor rewrote text/opacity on each event.

All image elements already had width/height attributes, and below-fold images
were already lazy loaded. External scripts were already modules. The tiny
inline startup script applies motion/session classes before paint and remains.
All 13 local font faces already used `font-display: swap`.

**Measurement limits:** no connected browser was available. No Lighthouse, LCP,
CLS, INP, FPS, CPU/GPU, waterfall, visual-diff or browser-console results are
claimed. Byte counts are measured local file sizes; execution fixtures are
controlled code tests, not browser measurements.

## Implemented optimisations

- Added same-resolution, lossless WebP copies of the two live PNGs. Full decoded
  RGBA pixels, dimensions, embedded ICC colour profile and orientation match.
  Originals remain unchanged. Only the relevant image URLs changed; alt text,
  CSS, HTML dimensions and composition are preserved. No TARS imagery or other
  project images were substituted.
- Kept the hero image unchanged and high priority; explicitly marked its existing
  default eager loading. No crops, responsive resampling or image quality changes.
- Changed footer video preload to `metadata` to retain its opening frame without
  requesting the whole clip unconditionally. The existing script promotes to
  auto preload 1,600px before the footer, or on hover/focus. Source/fragment,
  playback and reverse-playback logic remain intact. Preload is a browser hint;
  actual transfer savings need a browser waterfall check.
- Added a small drone bootstrap. It imports the same experience when the section
  is within 2,500px of the viewport, caches the import and disconnects its
  observer. Unsupported observation loads immediately; errors retain the existing
  fallback. No second renderer, animation library or scroll engine is introduced.
- Paused drone frame scheduling while offscreen or in a hidden tab. Resume
  schedules a single callback. The reduced-motion band renders only when needed.
- Deduplicated drone resize work and reused its geometry read. Added optional
  stage-size observation with window-resize fallback. Rendering formulas,
  timings, interpolation, camera, lighting, model/textures, antialiasing, exposure,
  tone mapping and the original pixel-ratio configuration remain unchanged.
- Released Draco workers after loading; dispose shared geometry, materials,
  textures and renderer resources on permanent departure. A late load after
  teardown is cleaned up. Back/forward-cache departure only pauses, and page
  restoration resumes the retained scene.
- Added preloads for just the two existing Latin font subsets used above the
  fold, with anonymous CORS matching font requests. Preloaded navigation CSS to
  shorten its existing base-CSS import discovery chain. Stylesheet order and
  font declarations remain unchanged.
- Moved navigation geometry reads ahead of header writes and cached its motion
  media query. Expansion thresholds, 650ms expansion and 250ms pause are unchanged.
- Avoided redundant cursor text/opacity writes while preserving pointer output.

## Existing infrastructure deliberately preserved

The bundle contains one guarded Lenis constructor (`!Dc`), uses its default
`autoRaf: false`, advances it through the existing GSAP ticker, and connects
Lenis scroll events to the same ScrollTrigger instance. Duration `1.25`, anchor
offset `-72`, easing and ticker configuration are unchanged. No generated files
were modified.

Particle lettering already stops when settled, hidden or offscreen. The ASCII
footer already pauses offscreen/hidden, caches its glyph atlas and uses its
existing 24/12fps paint throttling. These effects and the approved -170px to 0px
footer parallax are byte-identical to the phase-start snapshot.

The first-visit loader intentionally animates a 1.3-second counter/line and a
0.9-second wipe, coordinated with heading/copy delays. Shortening it would
change the requested experience, so its timing, session gate and reduced-motion
startup behaviour remain unchanged. Other render-blocking CSS and analytics
were retained after checking their purpose; no unknown scripts/assets deleted.

## Measured before and after

| Replacement | Before | After | Saved |
| --- | ---: | ---: | ---: |
| Coding desk | 391,741 B | 237,406 B | 154,335 B (39.4%) |
| Startup Grow full-resolution preview | 3,094,779 B | 1,252,202 B | 1,842,577 B (59.5%) |
| Combined | 3,486,520 B | 1,489,608 B | **1,996,912 B (57.3%)** |

Savings apply when these files are requested, not necessarily to initial page
transfer. Repository size increases because original assets are retained.

A controlled scheduler fixture advanced 120 offscreen ticks: the baseline drone
callback ran 120 times; the updated callback ran zero times. This verifies
scheduling behaviour, not measured browser frame rate or CPU savings. Sampled
visible drone poses/camera/exposure/DPR matched the baseline in that fixture.

## Files changed

Created:

- `assets/drone-loader.js` — viewport-based bootstrap for the existing module.
- `images/codingdesk.webp` — exact-pixel lossless copy.
- `images/startupgrow-lossless.webp` — exact-pixel lossless copy with colour profile.
- `PERFORMANCE.md` — baseline, changes, evidence and remaining checks.

Existing JavaScript modified:

- `assets/drone-services.js` — scheduling, resize deduplication and resource lifecycle.
- `assets/navigation.js` — geometry reads before writes; cached motion query.
- `assets/project-cursor.js` — avoid redundant DOM writes.
- `assets/portfolio-footer.js` — warm the existing video before it arrives.

All 15 rendered HTML pages receive the same font/navigation resource hints and
video metadata preload. The homepage also uses the drone bootstrap and explicit
hero eager hint. Image URL substitutions affect the homepage, projects,
services and studio CTA; the Startup Grow substitution is homepage-only.

- `index.html`
- `projects.html`
- `services.html`
- `studio.html`
- `contact.html`
- `privacy.html`
- `terms.html`
- `contact/.project=Almond%20Terrace.html`
- `contact/.project=Dune%20House.html`
- `contact/.project=Foundry%20Exchange.html`
- `contact/.project=Harrow%20Civic%20Hall.html`
- `contact/.project=Kestrel%20Ridge%20House.html`
- `contact/.project=Larch%20Court.html`
- `contact/.project=Quay%20Forty.html`
- `contact/.project=The%20Copper%20Stair.html`

Pre-existing uncommitted changes to `index.html`, `assets/portfolio-footer.css`
and the new `assets/footer-reveal.js` were captured in the fresh baseline and
preserved. No CSS or generated bundles changed during this phase. Existing
pages, redirects and assets remain present. Nothing was committed or pushed.

## Verification performed

- `git diff --check`; JavaScript syntax checks for all custom/shared scripts.
- Checked all local links/fragments, redirects, asset URLs, styles and preloads
  across 23 HTML files; no missing paths or duplicate script tags found.
- Exact HTML source comparison after reversing only documented loading hints,
  bootstrap and image substitutions: content/classes/dimensions/order preserved.
- All CSS, generated assets, original images/model and approved footer parallax
  match phase-start bytes. New WebP pixels, ICC, orientation and dimensions match.
- Drone render calculations/speeds/durations are exact source matches. Controlled
  tests cover sampled visible output, pause/resume, hidden tabs, reduced motion,
  redundant resize avoidance, cache restoration, pending-load cleanup and disposal.
- Controlled tests cover single/deferred drone import, import failures and observer
  fallback, identical navigation states/hide delays under both motion settings,
  cursor output with fewer writes, and video metadata/warm/hover/reverse paths.
- Single-instance Lenis/ScrollTrigger/renderer checks pass. No additional ticker
  or continuous animation loop was introduced.

## Remaining bottlenecks and required browser checks

Actual rendering at **375, 390, 768, 1024 and 1440px** remains unverified. At each
width, compare the existing design, typography, image colours/crops, overflow,
header expansion/hide, footer reveal and all interactions against the baseline.

Use a cold cache and throttled network to measure LCP/CLS/INP/long tasks and the
waterfall. Check font-preload reuse, initial video frame, hover/reverse playback,
fast and slow approaches to the drone, WebGL fallback and third-party/CDN errors.
Confirm no visible late loading, blank frames or browser-console errors, including
on Safari/iOS. Check hidden-tab resume, back/forward navigation and initial/live
reduced-motion changes. Test mobile menus, accordions/FAQ, workflow, filters,
sliders, contact forms and footer links.

The 1.25 MB lossless preview and 168 KB favicon remain relatively large. Smaller
responsive/lossy or alternative-icon variants need visual/cross-browser review.
The original unused PNG/MOV files listed in the historical baseline above were
removed during the subsequent repository cleanup; the live WebP/MP4 files remain.
Third-party Three.js and Draco requests and first-time shader/model
work remain, now deferred. The deliberate loader sequence still limits perceived
first-visit readiness; changing its appearance or timing is outside this phase.
