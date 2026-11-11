import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import vm from 'node:vm';

const source = readFileSync(new URL('../assets/site-scroll.js', import.meta.url), 'utf8');
const redirectSource = readFileSync(new URL('../assets/project-redirect.js', import.meta.url), 'utf8');
class Events {
  handlers = new Map();
  addEventListener(name, fn, options = {}) {
    const list = this.handlers.get(name) || []; list.push(fn); this.handlers.set(name, list);
    options.signal?.addEventListener('abort', () => this.handlers.set(name, (this.handlers.get(name) || []).filter(x => x !== fn)), { once: true });
  }
  fire(name, props = {}) { for (const fn of [...(this.handlers.get(name) || [])]) fn(props); }
}
class Node extends Events {
  attrs = new Map(); target = ''; focused = false;
  relList = { contains: value => (this.attrs.get('rel') || '').split(' ').includes(value) };
  classList = { add: (...values) => values.forEach(v => this.attrs.set(`class:${v}`, '')) };
  hasAttribute(name) { return this.attrs.has(name); }
  setAttribute(name, value) { this.attrs.set(name, value); }
  getAttribute(name) { return this.attrs.get(name) ?? null; }
  removeAttribute(name) { this.attrs.delete(name); }
  closest(selector) {
    if (selector === 'a[href]') return this;
    if (selector === '[data-native-navigation]' && this.hasAttribute('data-native-navigation')) return this;
    if (selector === '[data-no-transition]' && this.hasAttribute('data-no-transition')) return this;
    return null;
  }
  focus(options) { this.focused = options; }
}
function fixture({ reduced = false, url = 'https://portfolio.test/index.html', type = 'navigate', complete = false, reloadTop = false, nativeTransitions = false } = {}) {
  const win = new Events(), doc = new Events(), motion = new Events(); motion.matches = reduced;
  const root = new Node(), body = new Node(), main = new Node(), target = new Node();
  if (nativeTransitions) root.setAttribute('data-native-page-transitions', '');
  let current = new URL(url); const assigned = [], entries = [], instances = [], frames = new Map(), timers = new Map(), animations = [], delayed = [], callbacks = new Set(), storage = new Map(); let sequence = 0;
  const location = { get href() { return current.href; }, get origin() { return current.origin; }, get pathname() { return current.pathname; }, get search() { return current.search; }, get hash() { return current.hash; }, assign(value) { assigned.push(value); }, set(value) { current = new URL(value, current); } };
  const history = { state: { existing: true }, scrollRestoration: 'auto', pushState(state, _, href) { this.state = state; entries.push(href); location.set(href); }, replaceState(state, _, href) { this.state = state; location.set(href); } };
  if (reloadTop) { root.setAttribute('data-reload-top', ''); history.scrollRestoration = 'manual'; }
  Object.assign(doc, { documentElement: root, body, readyState: complete ? 'complete' : 'interactive', hidden: false, fonts: { status: 'loaded' }, referrer: '', getElementById: id => id === 'brief' || id === 'space id' ? target : null, getElementsByName: id => id === 'legacy' ? [target] : [], querySelector: selector => selector === 'main' ? main : selector === '[data-menu-toggle]' ? { click() { root.removeAttribute('data-menu-open'); } } : null });
  Object.assign(win, { scrollY: 0, innerHeight: 900, scrollTo: options => { win.scrollY = options.top; }, matchMedia: () => motion });
  const requestAnimationFrame = fn => { frames.set(++sequence, fn); return sequence; };
  const cancelAnimationFrame = id => frames.delete(id);
  const setTimeout = (fn, ms) => { timers.set(++sequence, { fn, ms }); return sequence; };
  const clearTimeout = id => timers.delete(id);
  body.animate = (keyframes, options) => {
    let resolve, reject; const finished = new Promise((a, b) => { resolve = a; reject = b; });
    const animation = { keyframes, options, finished, finish: resolve, cancel() { reject(new Error('cancelled')); } };
    animations.push(animation); return animation;
  };
  body.getAnimations = () => [];
  class Lenis {
    constructor(options) { this.options = options; this.calls = []; this.time = 20; this.destroyed = 0; instances.push(this); }
    on(name, fn) { this.onEvent = { name, fn }; }
    raf(time) { this.lastFrame = time; }
    resize() { this.resizes = (this.resizes || 0) + 1; }
    scrollTo(value, options) { this.calls.push({ value, options }); if (typeof value === 'number') win.scrollY = value; options.onComplete?.(); }
    destroy() { this.destroyed++; }
  }
  const gsap = { ticker: { add: fn => callbacks.add(fn), remove: fn => callbacks.delete(fn), lagSmoothing() {} }, delayedCall(seconds, fn) { const call = { seconds, fn, killed: false, kill() { this.killed = true; } }; delayed.push(call); return call; } };
  const ScrollTrigger = { update() {}, refresh() {} };
  class ResizeObserver { constructor(fn) { this.fn = fn; } observe() {} disconnect() { this.disconnected = true; } }
  win.ResizeObserver = ResizeObserver;
  const sessionStorage = { getItem: key => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value), removeItem: key => storage.delete(key) };
  const context = vm.createContext({ window: win, document: doc, location, history, sessionStorage, performance: { getEntriesByType: () => [{ type }] }, URL, AbortController, ResizeObserver, requestAnimationFrame, cancelAnimationFrame, setTimeout, clearTimeout, Date });
  vm.runInContext(source.replace(/^export /gm, '') + '\nglobalThis.api = { initSiteScroll, requestSiteRefresh, anchorTarget, navigationURL };', context);
  const lenis = context.api.initSiteScroll({ Lenis, gsap, ScrollTrigger });
  const link = href => { const node = new Node(); node.setAttribute('href', href); return node; };
  const click = (node, extras = {}) => { const event = { button: 0, target: node, defaultPrevented: false, preventDefault() { this.defaultPrevented = true; }, ...extras }; doc.fire('click', event); return event; };
  return { win, doc, root, body, main, target, motion, location, history, assigned, entries, instances, frames, timers, animations, callbacks, storage, sessionStorage, lenis, api: context.api, link, click, context, Lenis, gsap, ScrollTrigger,
    refresh() { const call = delayed.at(-1); if (call && !call.killed) { call.killed = true; call.fn(); } },
    frame() { const jobs = [...frames.values()]; frames.clear(); jobs.forEach(fn => fn()); } };
}

test('one Lenis, one ticker, same scroll settings, native touch/nested configuration', () => {
  const f = fixture();
  assert.equal(f.api.initSiteScroll({ Lenis: f.Lenis, gsap: f.gsap, ScrollTrigger: f.ScrollTrigger }), f.lenis);
  assert.equal(f.instances.length, 1); assert.equal(f.callbacks.size, 1);
  assert.equal(f.lenis.options.duration, 1.25); assert.equal(f.lenis.options.autoRaf, false);
  assert.equal(f.lenis.options.syncTouch, false); assert.equal(f.lenis.options.allowNestedScroll, true); assert.equal(f.lenis.options.anchors, false);
  [...f.callbacks][0](2); assert.equal(f.lenis.lastFrame, 2000);
  assert.equal(f.lenis.onEvent.name, 'scroll'); assert.equal(f.lenis.onEvent.fn, f.ScrollTrigger.update);
});

test('reduced motion uses native wheel input with no scroll ticker, including live changes', () => {
  const f = fixture({ reduced: true });
  assert.equal(f.instances.length, 1); assert.equal(f.callbacks.size, 0); assert.equal(f.lenis.options.smoothWheel, false);
  assert.equal(f.click(f.link('projects.html')).defaultPrevented, false);
  f.click(f.link('#brief')); assert.equal(f.lenis.calls.at(-1).options.immediate, true);
  f.motion.matches = false; f.motion.fire('change'); f.motion.fire('change');
  assert.equal(f.callbacks.size, 1); assert.equal(f.lenis.options.smoothWheel, true);
  f.motion.matches = true; f.motion.fire('change'); assert.equal(f.callbacks.size, 0);
});

test('anchors update history once, use the fixed-header offset and manage focus', () => {
  const f = fixture(); f.root.setAttribute('data-menu-open', '');
  const event = f.click(f.link('#brief')); assert(event.defaultPrevented);
  assert.equal(f.root.hasAttribute('data-menu-open'), false);
  assert.equal(f.entries.length, 1); assert.equal(f.location.hash, '#brief'); assert.equal(f.history.state.existing, true);
  const call = f.lenis.calls.at(-1); assert.equal(call.value, f.target); assert.equal(call.options.offset, -72); assert.equal(call.options.force, true);
  assert.equal(f.target.focused.preventScroll, true); assert.equal(f.target.getAttribute('tabindex'), '-1');
  f.target.fire('blur'); assert.equal(f.target.hasAttribute('tabindex'), false);
  f.click(f.link('#brief')); assert.equal(f.entries.length, 1);
  f.click(f.link('#top')); assert.equal(f.lenis.calls.at(-1).value, 0); assert.equal(f.lenis.calls.at(-1).options.offset, 0);
  assert.equal(f.api.anchorTarget(f.doc, '#space%20id'), f.target); assert.equal(f.api.anchorTarget(f.doc, '#legacy'), f.target);
  assert.equal(f.click(f.link('#does-not-exist')).defaultPrevented, false);
  assert.equal(f.click(f.link('#%ZZ')).defaultPrevented, false);
});

test('Home navigates normally from other pages and reloads when already at home', () => {
  for (const path of ['/', '/contact', '/studio', '/?from=work#projects']) {
    const f = fixture({ url: `https://portfolio.test${path}`, nativeTransitions: true });
    let reloads = 0;
    f.location.reload = () => reloads++;
    f.storage.set('yadunand-loaded', '1');
    f.storage.set('portfolio-page-entry', 'stale');
    const event = f.click(f.link('/'));
    assert(event.defaultPrevented);
    assert.equal(reloads, path === '/' ? 1 : 0, path);
    if (path === '/contact' || path === '/studio') {
      assert.deepEqual(f.assigned, ['https://portfolio.test/']);
      assert.equal(f.storage.has('yadunand-loaded'), true);
      assert.equal(JSON.parse(f.storage.get('portfolio-page-entry')).to, 'https://portfolio.test/');
      assert.equal(f.lenis.calls.length, 0, 'Home on another route uses document navigation');
    } else if (path === '/') {
      assert.deepEqual(f.assigned, []);
      assert.equal(f.lenis.calls.length, 0, 'Home on the current homepage reloads');
    } else {
      assert.deepEqual(f.assigned, ['https://portfolio.test/']);
      assert.equal(f.lenis.calls.length, 0, 'Home navigates to the clean homepage URL');
    }
  }
  const f = fixture({ url: 'https://portfolio.test/' });
  let reloads = 0;
  f.location.reload = () => reloads++;
  assert.equal(f.click(f.link('/'), { ctrlKey: true }).defaultPrevented, false);
  f.click(f.link('#'));
  assert.equal(reloads, 0, 'explicit fragment links still scroll within the page');
  assert.equal(f.lenis.calls.at(-1).value, 0);
});

test('current-page navigation reloads every route, including home and section fragments', () => {
  for (const path of ['/', '/studio', '/projects', '/services', '/contact', '/privacy', '/terms']) {
    for (const hash of ['', '#brief']) {
      for (const reduced of [false, true]) {
        const f = fixture({ url: `https://portfolio.test${path}${hash}`, reduced, nativeTransitions: true });
        let reloads = 0;
        f.location.reload = () => reloads++;
        f.storage.set('yadunand-loaded', '1');
        f.storage.set('portfolio-page-entry', 'stale');
        assert(f.click(f.link(path)).defaultPrevented);
        assert.equal(reloads, 1, `${path}${hash}`);
        assert.equal(f.location.hash, '', 'a page link removes the section fragment before reloading');
        assert.equal(f.storage.has('yadunand-loaded'), false);
        assert.equal(f.storage.has('portfolio-page-entry'), false);
        assert.equal(f.lenis.calls.length, 0);
        assert.equal(f.animations.length, 0);
      }
    }
  }
  const f = fixture({ url: 'https://portfolio.test/services?campaign=work#brief' });
  assert(f.click(f.link('/services')).defaultPrevented);
  assert.deepEqual(f.assigned, ['https://portfolio.test/services']);
  const blocked = fixture({ url: 'https://portfolio.test/services' });
  let reloads = 0;
  blocked.location.reload = () => reloads++;
  blocked.sessionStorage.removeItem = () => { throw new Error('Storage blocked'); };
  assert.doesNotThrow(() => blocked.click(blocked.link('/services')));
  assert.equal(reloads, 1);
});

test('external, special, modified, target, download and opt-out links stay native', () => {
  const f = fixture();
  for (const href of ['https://external.test/', 'mailto:me@example.test', 'tel:1234', 'javascript:void(0)', '/images/photo.webp']) assert.equal(f.click(f.link(href)).defaultPrevented, false);
  for (const extra of [{ button: 1 }, { metaKey: true }, { ctrlKey: true }, { altKey: true }, { shiftKey: true }, { defaultPrevented: true }]) assert.equal(f.click(f.link('projects.html'), extra).defaultPrevented, extra.defaultPrevented || false);
  for (const attr of ['download', 'data-native-navigation', 'data-no-transition']) { const link = f.link('projects.html'); link.setAttribute(attr, ''); assert.equal(f.click(link).defaultPrevented, false); }
  const wrapper = f.link('projects.html'); wrapper.closest = selector => selector === '[data-no-transition]' ? { hasAttribute: name => name === 'data-no-transition' } : null; assert.equal(f.click(wrapper).defaultPrevented, false);
  const blank = f.link('projects.html'); blank.target = '_blank'; assert.equal(f.click(blank).defaultPrevented, false);
  assert.equal(f.animations.length, 0);
});

test('fallback page transition navigates after shrinking with URL/query/hash intact', async () => {
  const f = fixture(); const event = f.click(f.link('contact.html?project=Robot#brief')); assert(event.defaultPrevented);
  assert.equal(f.assigned.length, 0); assert.equal(f.animations[0].options.duration, 700);
  assert.equal(f.animations[0].keyframes[1].transform, 'scale(0.95)');
  assert.equal(f.frames.size, 0); assert.equal(f.timers.size, 0);
  f.click(f.link('projects.html')); assert.equal(f.animations.length, 1);
  f.animations[0].finish(); await Promise.resolve();
  assert.equal(f.assigned[0], 'https://portfolio.test/contact.html?project=Robot#brief');
  assert.equal(JSON.parse(f.storage.get('portfolio-page-entry')).to, f.assigned[0]);
  assert.equal(f.timers.size, 1); // Recovery is scheduled after navigation, not before it.
  f.doc.fire('animationend', { target: f.body, animationName: 'site-page-enter' });
});

test('native overlapping page navigation starts immediately without transforming the document', () => {
  const f = fixture({ nativeTransitions: true });
  f.body.animate = undefined;
  const event = f.click(f.link('/contact?project=Robot#brief'));
  assert(event.defaultPrevented);
  assert.deepEqual(f.assigned, ['https://portfolio.test/contact?project=Robot#brief']);
  assert.equal(f.animations.length, 0);
  assert.equal(f.lenis.calls.length, 0);
  assert.equal(f.root.hasAttribute('data-site-leaving'), false);
  assert.equal(JSON.parse(f.storage.get('portfolio-page-entry')).to, f.assigned[0]);
  f.click(f.link('/studio'));
  assert.equal(f.assigned.length, 1, 'one pending navigation at a time');
  [...f.timers.values()][0].fn();
  f.click(f.link('/studio'));
  assert.equal(f.assigned.length, 2, 'a cancelled navigation can recover');

  const g = fixture({ nativeTransitions: true });
  g.sessionStorage.setItem = () => { throw new Error('blocked'); };
  assert.doesNotThrow(() => g.click(g.link('/contact')));
  assert.equal(g.assigned.length, 1);
});

test('animation/storage fallback and reduced-motion changes do not block navigation', async () => {
  const f = fixture(); f.body.animate = undefined;
  assert.equal(f.click(f.link('contact.html')).defaultPrevented, false);
  const g = fixture(); g.sessionStorage.setItem = () => { throw new Error('blocked'); };
  g.click(g.link('contact.html')); g.animations[0].finish(); await Promise.resolve(); assert.equal(g.assigned.length, 1);
  const h = fixture(); h.click(h.link('contact.html')); h.motion.matches = true; h.motion.fire('change'); assert.equal(h.assigned.length, 1);
});

test('an interrupted fade still navigates; failed navigation recovery permits another click', async () => {
  const f = fixture(); f.click(f.link('contact.html')); f.animations[0].cancel();
  await Promise.resolve(); assert.equal(f.assigned.length, 1);
  [...f.timers.values()][0].fn();
  assert(f.click(f.link('projects.html')).defaultPrevented); assert.equal(f.animations.length, 2);
  const g = fixture(); g.location.assign = () => { throw new Error('navigation blocked'); };
  g.click(g.link('contact.html')); g.animations[0].finish(); await Promise.resolve();
  assert(g.click(g.link('projects.html')).defaultPrevented); assert.equal(g.animations.length, 2);
});

test('direct hashes align after layout; reload/back-forward and user input keep saved positions', () => {
  const f = fixture({ url: 'https://portfolio.test/contact.html#brief' });
  f.refresh(); assert.equal(f.lenis.calls.at(-1).value, f.target); assert.equal(f.lenis.calls.at(-1).options.immediate, true);
  f.doc.readyState = 'complete'; f.api.requestSiteRefresh(); f.refresh(); const count = f.lenis.calls.length;
  f.api.requestSiteRefresh(); f.refresh(); assert.equal(f.lenis.calls.length, count);
  for (const type of ['reload', 'back_forward']) { const g = fixture({ type, url: 'https://portfolio.test/contact.html#brief' }); g.refresh(); assert.equal(g.lenis.calls.length, 0); }
  const h = fixture({ url: 'https://portfolio.test/contact.html#brief' }); h.win.fire('wheel'); h.refresh(); assert.equal(h.lenis.calls.length, 0);
});

test('native back/forward restoration is synchronized after one frame, not replaced with hash scrolling', () => {
  const f = fixture(); f.click(f.link('#brief')); f.win.scrollY = 500;
  f.win.fire('popstate'); assert.equal(f.lenis.calls.at(-1).value, 500); assert.equal(f.frames.size, 1);
  f.win.scrollY = 120; f.frame(); assert.equal(f.lenis.calls.at(-1).value, 120);
  assert.equal(f.lenis.time, 0); assert.equal(f.history.scrollRestoration, 'auto'); assert.equal(f.frames.size, 0);
});

test('homepage reload stays at the hero through loader layout changes, then releases positioning', () => {
  const f = fixture({ reloadTop: true, type: 'reload', complete: true });
  f.root.setAttribute('data-preloader-active', '');
  f.ScrollTrigger.refresh = () => { f.win.scrollY = 4800; };
  f.refresh();
  assert.equal(f.win.scrollY, 0);
  assert.equal(f.lenis.calls.at(-1).options.immediate, true);
  assert.equal(f.history.scrollRestoration, 'manual');
  assert(f.root.hasAttribute('data-reload-top'));

  f.root.removeAttribute('data-preloader-active');
  f.api.requestSiteRefresh(); f.refresh();
  assert.equal(f.win.scrollY, 0);
  assert.equal(f.history.scrollRestoration, 'auto');
  assert.equal(f.root.hasAttribute('data-reload-top'), false);

  f.ScrollTrigger.refresh = () => {};
  f.win.scrollY = 900;
  f.api.requestSiteRefresh(); f.refresh();
  assert.equal(f.win.scrollY, 900, 'later refreshes preserve intentional scrolling');

  const interrupted = fixture({ reloadTop: true, type: 'reload', complete: true });
  interrupted.win.scrollY = 500;
  interrupted.win.fire('wheel'); interrupted.refresh();
  assert.equal(interrupted.win.scrollY, 500);
  assert.equal(interrupted.history.scrollRestoration, 'auto');
});

test('keyboard scrolling can interrupt smoothing without preventing native keys or changing form editing', () => {
  const f = fixture(); f.lenis.isScrolling = 'smooth'; f.win.scrollY = 300;
  const event = { key: 'PageDown', target: { closest: () => null }, defaultPrevented: false };
  f.doc.fire('keydown', event); assert.equal(f.lenis.calls.at(-1).value, 300); assert.equal(event.defaultPrevented, false);
  const count = f.lenis.calls.length;
  f.doc.fire('keydown', { ...event, target: { closest: () => ({}) } });
  assert.equal(f.lenis.calls.length, count);
});

test('hidden tabs and bfcache pause/resume one ticker; permanent departure cleans up', async () => {
  const f = fixture(); f.doc.hidden = true; f.doc.fire('visibilitychange'); assert.equal(f.callbacks.size, 0);
  f.doc.hidden = false; f.doc.fire('visibilitychange'); assert.equal(f.callbacks.size, 1);
  f.click(f.link('contact.html')); f.win.fire('pagehide', { persisted: true }); assert.equal(f.callbacks.size, 0); assert.equal(f.lenis.destroyed, 0);
  f.win.fire('pageshow', { persisted: true }); assert.equal(f.callbacks.size, 1); assert.equal(f.animations.at(-1).options.duration, 180);
  f.frame(); f.win.fire('pagehide', { persisted: false }); assert.equal(f.callbacks.size, 0); assert.equal(f.lenis.destroyed, 1);
  assert.equal((f.doc.handlers.get('click') || []).length, 0);
  await Promise.resolve();
});

test('all eight project redirects preserve URL state, replace history and forward entry intent', () => {
  const names = readdirSync(new URL('../projects/', import.meta.url)).filter(x => x.endsWith('.html') && x !== 'index.html');
  assert.equal(names.length, 8);
  for (const name of names) {
    for (const hash of ['', '#all-projects']) {
      const f = fixture({ url: `https://portfolio.test/projects/${name}?filter=robot${hash}` });
      f.storage.set('portfolio-page-entry', JSON.stringify({ to: f.location.href, from: 'https://portfolio.test/index.html', at: Date.now() }));
      let replaced; f.location.replace = value => { replaced = value; };
      vm.runInContext(redirectSource, f.context);
      assert.equal(replaced, 'https://portfolio.test/projects?filter=robot#all-projects');
      assert.equal(JSON.parse(f.storage.get('portfolio-page-entry')).to, replaced);
      assert(readFileSync(new URL(`../projects/${name}`, import.meta.url), 'utf8').includes('src="../assets/project-redirect.js"'));
    }
  }
});

test('early entry helper only fades intentional arrivals and never strands a direct/reload page', () => {
  const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];
  for (const [kind, reduced, intent, expected] of [
    ['navigate', false, true, true], ['navigate', true, true, false],
    ['reload', false, true, false], ['back_forward', false, true, false], ['navigate', false, false, false],
  ]) {
    const f = fixture({ type: kind, reduced });
    if (intent) f.storage.set('portfolio-page-entry', JSON.stringify({ to: f.location.href, from: 'https://portfolio.test/projects.html', at: Date.now() }));
    f.context.matchMedia = query => ({ matches: query.includes('no-preference') ? !reduced : reduced });
    vm.runInContext(script, f.context);
    assert.equal(f.root.hasAttribute('data-site-enter'), expected);
    assert.equal(f.storage.has('portfolio-page-entry'), false);
  }
});

test('homepage head disables saved-scroll restoration before a reload paints', () => {
  const script = readFileSync(new URL('../index.html', import.meta.url), 'utf8').match(/<script>([\s\S]*?)<\/script>/)[1];
  for (const [kind, hash, reset] of [['reload', '', true], ['reload', '#work', false], ['back_forward', '', false], ['navigate', '', false]]) {
    const f = fixture({ type: kind, url: `https://portfolio.test/${hash}` });
    f.win.scrollY = 4800;
    f.context.matchMedia = query => ({ matches: query.includes('no-preference') });
    vm.runInContext(script, f.context);
    assert.equal(f.win.scrollY, reset ? 0 : 4800);
    assert.equal(f.history.scrollRestoration, reset ? 'manual' : 'auto');
    assert.equal(f.root.hasAttribute('data-reload-top'), reset);
  }
});

test('every rendered page replays its loader on reload after a previous visit', () => {
  const routes = ['studio', 'projects', 'services', 'contact', 'privacy', 'terms'];
  const pages = ['index.html', ...routes.flatMap(route => [`${route}.html`, `${route}/index.html`]),
    ...readdirSync(new URL('../contact/', import.meta.url)).filter(name => name.startsWith('.project=')).map(name => `contact/${name}`)];
  assert.equal(pages.length, 21);
  for (const page of pages) {
    const script = readFileSync(new URL(`../${page.replace(/%/g, '%25')}`, import.meta.url), 'utf8').match(/<script>([\s\S]*?)<\/script>/)[1];
    for (const [kind, reduced] of [['reload', false], ['reload', true], ['navigate', false]]) {
      const f = fixture({ type: kind, reduced, url: `https://portfolio.test/${page}` });
      f.storage.set('yadunand-loaded', '1');
      f.storage.set('portfolio-page-entry', JSON.stringify({ to: f.location.href, from: 'https://portfolio.test/', at: Date.now() }));
      f.context.matchMedia = query => ({ matches: query.includes('no-preference') ? !reduced : reduced });
      vm.runInContext(script, f.context);
      assert.equal(f.root.hasAttribute('class:loaded'), kind !== 'reload', page);
      assert.equal(f.root.hasAttribute('class:motion'), !reduced, page);
      assert.equal(f.root.hasAttribute('data-site-enter'), kind === 'navigate' && !reduced, page);
    }
  }
});

test('extensionless document navigation keeps transitions, query strings and fragments', async () => {
  const f = fixture({ url: 'https://portfolio.test/' });
  assert(f.click(f.link('/contact?project=Robot#brief')).defaultPrevented);
  f.animations[0].finish(); await Promise.resolve();
  assert.equal(f.assigned[0], 'https://portfolio.test/contact?project=Robot#brief');
  assert.equal(JSON.parse(f.storage.get('portfolio-page-entry')).to, f.assigned[0]);
  const reduced = fixture({ reduced: true });
  assert.equal(reduced.click(reduced.link('/studio')).defaultPrevented, false);
  assert.equal(reduced.animations.length, 0);
  const native = fixture();
  for (const href of ['/assets/drone-services.js', '/images/iamyadunandhero.webp', '/robots.txt']) {
    assert.equal(native.click(native.link(href)).defaultPrevented, false);
  }
});

test('legacy page URLs normalize before arrival animation without losing URL or history state', () => {
  const script = readFileSync(new URL('../index.html', import.meta.url), 'utf8').match(/<script>([\s\S]*?)<\/script>/)[1];
  for (const [original, expected] of [
    ['/index.html?from=home#top', '/?from=home#top'],
    ['/studio.html?filter=web#selected-work', '/studio?filter=web#selected-work'],
    ['/services.html#faq', '/services#faq'],
    ['/contact.html?project=Robot#brief', '/contact?project=Robot#brief'],
    ['/projects.html', '/projects'], ['/privacy.html', '/privacy'], ['/terms.html', '/terms'],
    ['/contact/.project=Almond%20Terrace.html?from=work#brief', '/contact?from=work#brief'],
    ['/studio', '/studio'], ['/', '/'],
    ['/studio/', '/studio'], ['/studio/index.html', '/studio'],
    ['/services/?from=nav#faq', '/services?from=nav#faq'],
    ['/contact/?project=Robot#brief', '/contact?project=Robot#brief'],
    ['/contact/index.html?project=Robot#brief', '/contact?project=Robot#brief'],
    ['/projects/', '/projects'], ['/privacy/', '/privacy'], ['/terms/', '/terms'],
  ]) {
    const f = fixture({ url: `https://portfolio.test${original}` });
    f.context.matchMedia = () => ({ matches: false });
    f.storage.set('portfolio-page-entry', JSON.stringify({ to: f.location.href, from: 'https://portfolio.test/', at: Date.now() }));
    vm.runInContext(script, f.context);
    assert.equal(f.location.href, `https://portfolio.test${expected}`);
    assert.equal(f.history.state.existing, true);
    assert.equal(f.entries.length, 0, 'Normalization replaces the current entry');
    assert.equal(f.assigned.length, 0, 'Normalization does not reload the document');
    assert(f.root.hasAttribute('data-site-enter'), original);
    assert.equal(f.storage.has('portfolio-page-entry'), false);
  }
  const blocked = fixture();
  blocked.context.matchMedia = () => ({ matches: false });
  blocked.history.replaceState = () => { throw new Error('History unavailable'); };
  assert.doesNotThrow(() => vm.runInContext(script, blocked.context));
  assert.equal(blocked.assigned.length, 0);
});
