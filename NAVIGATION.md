# Website-wide smooth scrolling and page transitions

Implemented against the current static site on 2026-11-07. Existing performance
changes and the approved footer effect were captured in the baseline and retained.

## Public page URLs

Navigation now uses `/`, `/studio`, `/projects`, `/services`, `/contact`,
`/privacy` and `/terms`. The existing static HTML filenames remain unchanged.
The deployed host was checked directly and serves these extensionless routes,
including `/contact` and `/projects` alongside the legacy directories.

The existing early page helper replaces an old `.html` address with its clean
equivalent before processing arrival animations. Query strings, fragments and
history state are preserved, with no reload or added history entry. Legacy
contact copies normalize to `/contact`. Project aliases keep their existing
redirect behaviour and now target `/projects`, including the no-JavaScript
fallback. Canonical links use the clean public addresses.

The existing transition handler also recognizes extensionless document links.
Assets, external links, downloads and reduced-motion navigation stay native.
File-only preview servers, including VS Code Live Server, now use generated
directory indexes for `/studio`, `/projects`, `/services`, `/contact`, `/privacy`
and `/terms`. Both forms with and without a trailing slash load the actual page;
the early helper normalizes the visible URL to its clean form. Assets in these
entry documents use root paths so they also load before normalization. Directory
indexes contain the page itself, so there is no redirect loop or folder listing.

The root `.html` documents remain the editing source. After changing one, run
`node scripts/sync-routes.mjs` to update the directory entry pages. Run
`node scripts/sync-routes.mjs --check` to verify that they are current. Production
hosting can serve either the root HTML file or directory index with the same
content and canonical URL. The six indexes are additional rendered entry points;
the original 15 full documents and eight project redirects remain available.

## Coverage and repository audit

These 15 full documents each use the shared Lenis/GSAP integration:

- `index.html`
- `projects.html`
- `services.html`
- `contact.html`
- `studio.html`
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

The eight individual project URLs are existing routing aliases, not long-form
project detail documents. They continue to replace themselves with the project
index and now preserve query strings and a supplied hash (default `#all-projects`):

- `projects/almond-terrace.html`
- `projects/copper-stair.html`
- `projects/dune-house.html`
- `projects/foundry-exchange.html`
- `projects/harrow-civic-hall.html`
- `projects/kestrel-ridge.html`
- `projects/larch-court.html`
- `projects/quay-forty.html`

Aliases do not start a pointless Lenis/GSAP runtime before redirecting. Their
actual destination uses the global runtime. Existing meta-refresh and visible
link fallbacks remain available if JavaScript is disabled.

Audited the shared base module, navigation, header/menu, project filters and
previews, sliders, services accordion/FAQ, sticky workflow, hero/drone sticky
sections, contact forms, footer animations, anchors and legacy scripts. The
existing full pages already shared the bundled Lenis installation. The gaps were
exclusive anchor handling, consistent lifecycle/reduced-motion handling and
page-to-page transitions. No active independent vertical scroll container was
found in the current HTML. Horizontal tracks/carousels and native form scrolling
were retained; unused legacy scripts were not loaded or removed.

## Shared implementation

`assets/site-scroll.js` owns the application-level Lenis configuration. Every
full document creates exactly one instance from the **existing bundled Lenis
1.3.27 class**. Configuration retains duration `1.25`, the existing default
interpolation/easing, wheel settings and window/document wrapper. No new library,
version, framework, router or SPA architecture was introduced.

One GSAP ticker callback passes milliseconds to Lenis; Lenis scroll events update
the same ScrollTrigger instance. `autoRaf: false` prevents another scrolling
loop. The callback detaches in hidden/suspended documents and while reduced
motion is requested, and attaches only once on resume. Existing drone, ASCII
and particle renderers retain their visual behaviour and are not scroll engines.

Built-in Lenis anchor handling is disabled so it cannot compete with default
fragment jumps or the delegated handler. `allowNestedScroll: true` uses the
bundled engine's native-container detection. `syncTouch: false` keeps mobile
swipes and inertia native. No nested Lenis instances or horizontal wheel hijacks
were added. Existing `data-lenis-prevent` attributes remain supported by Lenis.

Font/load refresh requests are coalesced using the same GSAP scheduler. Main
layout changes request a refresh, while existing component-specific refreshes
remain in place. Native sticky sections, current services/FAQ accordions and
workflow markup/controller logic are untouched. There is no replacement services
section or restoration of an earlier sticky-services design.

### Necessary generated-bundle bridge

Because the Lenis constructor and GSAP instances are private variables inside
the static bundle, `_astro/BaseLayout.astro_astro_type_script_index_0_lang.Dpw5V1aT.js`
contains three narrow application-level changes:

1. Import the shared initializer and refresh function from `assets/site-scroll.js`.
2. Replace the previous inline `kc()` Lenis setup with that initializer, passing
   the existing `Cc`, `hi` and `Q` instances. Existing menu code still sees `Dc`.
3. Send the existing font/load refresh requests through the shared batching hook.

A source comparison verified that reversing only those changes reproduces the
original bundle exactly. No GSAP, ScrollTrigger, Lenis vendor code, registration,
section animation calculations or library versions were altered. If an Astro
source/build project is introduced later, move this bridge into its source so a
new generated build does not overwrite it.

## Anchors, history, focus and URL handling

- A single delegated click handler manages valid same-document anchors with the
  existing `-72px` header offset. `#`, missing `#top`, and current-page Home links
  scroll to the top. IDs are decoded safely; legacy named anchors are supported.
- Normal same-page anchor clicks push one history entry, retaining other history
  state. Repeating the same hash does not add duplicate entries.
- Completion focuses the destination with `preventScroll`; a temporary `tabindex`
  is removed on blur. Missing/malformed/text fragments retain browser handling.
- Direct document/hash visits align after layout settles. Reload/back-forward
  entries keep the browser's saved position rather than being forced to the hash.
  Initial correction stops when the visitor interacts.
- Homepage reloads without a fragment start at the hero for the starter
  animation. Browser restoration is temporarily manual, and Lenis synchronizes
  to zero through loader layout changes. Automatic restoration resumes when
  initial layout finishes or the visitor interacts. Back/forward is preserved.
- Home links open a fresh homepage document and replay the starter animation.
  Clicking Home while already at `/` reloads the page. Explicit fragment links
  keep in-page scrolling; modified clicks retain native browser behavior.
- Native history restoration is not replaced by a manual position store. A
  single one-shot frame after traversal synchronizes Lenis with the browser's
  restored position and cancels an obsolete programmatic scroll.
- Keyboard scrolling/focus keys can cancel pending smooth inertia before the
  browser performs its native action; no key events are prevented. Form controls
  and editable content retain normal editing behaviour.
- Query strings and hashes remain part of the destination URL. Project redirects
  use `location.replace` so Back does not loop through an alias.
- External links, downloads, assets, mail/telephone links, non-self targets,
  modified clicks, middle clicks and component-prevented clicks stay native.

Optional developer exceptions: `data-native-navigation` on an anchor/container
opts out of both delegated anchors and page transitions; `data-no-transition`
on an anchor opts out of a cross-document animation. No visible controls were added.

## Multi-page transitions

Same-origin HTML links use native cross-document View Transitions in supporting
browsers. Navigation starts immediately with `location.assign`, and the browser
retains both viewport snapshots for the overlapping animation. The outgoing
snapshot scales to 95% and dims over 700ms. The incoming snapshot rises from
below with a five-degree rotation over 1000ms and scales from 85% to full size
over 800ms, starting 600ms into the movement. A black backdrop frames both pages.
These values follow the supplied screenshots and the public reference source
at `https://slater.app/17302/55042.js` inspected on 11 November 2026.

`assets/page-transitions.js` registers `pageswap` and `pagereveal` in the head,
before first render. It prevents the fallback entrance from animating beneath
the native snapshot transition. Browsers without cross-document transition
support use a 700ms outgoing shrink/dim, normal navigation, and a self-contained
1400ms rising entrance. This fallback cannot display both documents together.
The browser owns each new document/history entry, and every document initializes
its own runtime. Existing per-page scripts and form state follow normal document
navigation; there is no fetch router or script reinjection.

A small addition to each existing head startup script consumes a short-lived
session intent before first paint. This skips a repeated loader only for an
intentional internal arrival. The destination uses entry CSS if a native
transition is unavailable or skipped. Reloads and Home links retain their
starter loader; Home's navigation explicitly skips overlapping snapshots.
Alias redirects forward the intent. Direct fragment links remain in-page moves.

Back/forward-cache restoration cancels a stale outgoing animation, retains the
Lenis instance, and resumes one ticker. Supporting browsers use native snapshots
for history transitions; fallback browsers retain a brief restored-page reveal.
Permanent departure disconnects observers/listeners and destroys the departing
Lenis instance.

Animation/storage failures retain navigation fallbacks. A recovery timer resets
the source page if navigation is cancelled/fails; it starts after the navigation
attempt and never delays it. Entry CSS ends at its normal transform even if the
shared module fails. Transition completion or cancellation clears native state.

## Mobile and reduced motion

Touch scrolling stays native on phones and tablets. Native nested scroll areas
and horizontal interactions are not turned into extra smooth-scroll engines.

Reduced motion disables wheel smoothing and the scrolling ticker callback,
makes managed anchor moves immediate and skips page transitions. Live preference
changes update the engine and cancel animations without blocking navigation.
Existing section-animation startup still uses the base module's original motion
gate; no section effects were rewritten in this task.

## Files created/modified

Created:

- `assets/site-scroll.js` — shared scrolling, anchors, lifecycle and link transitions.
- `assets/site-navigation.css` — overlapping snapshot animations, fallback entrance and scroll compatibility.
- `assets/page-transitions.js` — early native transition lifecycle and navigation exceptions.
- `assets/project-redirect.js` — lightweight URL/history/intent forwarding for aliases.
- `tests/site-scroll.test.mjs` — isolated controller/history/accessibility/lifecycle tests.
- `tests/site-integration.test.mjs` — all-page loading/link/runtime checks.
- `NAVIGATION.md` — this implementation and verification report.

Modified:

- The generated base module listed above: only the three integration changes.
- The 15 full HTML documents listed above: entry-intent code in the existing head
  script and one shared stylesheet link.
- The eight redirect documents listed above: the shared redirect script, before
  the existing native fallback.

All page-body markup, existing stylesheets, images, fonts, model assets, page
content, section order and existing custom animation scripts match the fresh
baseline. Earlier uncommitted performance work was preserved. No commits/pushes.

## Verification and limitations

Run:

```sh
node --test tests/site-*.test.mjs
git diff --check
```

**16 automated tests passed.** These cover all 23 documents; script uniqueness;
relative asset/link/fragment/redirect paths; one Lenis/ticker; native touch/nested
configuration; reduced-motion changes; valid/missing/encoded anchors; focus and
history; special links; page fades and failure recovery; initial hashes/reloads;
simulated native history restoration; keyboard input; hidden tabs/cache cleanup;
and all alias redirects. All custom/shared scripts passed syntax checks.

Source comparisons verified unchanged bodies on all 23 documents, unchanged
existing CSS/media/fonts/custom animations and the three-only bundle bridge.
Tests use controlled DOM/library fixtures plus actual repository sources; they
are **not real-browser tests**. The available browser list was empty. No browser
console, live wheel/touch feel, visual/viewport or real history restoration
results are claimed.

Manual checks still required:

1. At 375, 390, 768, 1024 and 1440px, compare every full page's layout and test
   mouse wheel, trackpad, native touch, keyboard, menu, filters, sliders, services
   accordion/FAQ, sticky workflow, drone and footer effects.
2. Test same-page `#all-projects`, cross-page `contact.html#brief`, direct hash
   URLs, repeated anchors, reload at a saved position and rapid anchor clicks.
3. Test Back/Forward with and without bfcache, including after scrolling away
   from an anchor, menu interaction and navigating away mid-fade.
4. Visit all eight project aliases with query/hash state. They are redirects,
   not project-detail content; an ID absent from the project index cannot be
   created by the scrolling system.
5. Test natural scrolling in native textarea/menu/modal/carousel containers where
   available, plus the documented opt-outs for any custom future component.
6. Test reduced motion on initial load and after changing the OS preference,
   blocked session storage, disabled JavaScript, slow navigation and animation
   cancellation. With storage blocked, native navigation works but the token-based
   arrival fade may be unavailable. JavaScript-disabled aliases use the original
   fixed-target meta fallback rather than preserving arbitrary query/hash state.
7. Check the browser console for module errors, network failures, missing assets,
   focus/scroll jumps and unwanted persisted opacity. Use a local HTTP server or
   the deployed site; file-URL module loading follows browser restrictions.
