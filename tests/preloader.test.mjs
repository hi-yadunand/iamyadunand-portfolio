import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const source = readFileSync(new URL('../assets/preloader.js', import.meta.url), 'utf8');
const bundle = readFileSync(new URL('../_astro/BaseLayout.astro_astro_type_script_index_0_lang.Dpw5V1aT.js', import.meta.url), 'utf8');

function animationFixture() {
  const cards = [{}, {}, {}, {}], images = [{}, {}, {}, {}];
  const counter = { textContent: '0%' };
  const node = (initial = null) => ({
    value: initial,
    getAttribute() { return this.value; },
    setAttribute(name, value) { this.value = value; },
    removeAttribute() { this.value = null; },
  });
  const page = node('color: red'), header = node(), root = node(), events = [];
  const loader = {
    style: {},
    ownerDocument: { documentElement: root, querySelector: selector => selector === 'main' ? page : header,
      dispatchEvent(event) { events.push({ type: event.type, pageStyle: page.value, active: root.value }); } },
    querySelectorAll: selector => selector.endsWith(' img') ? images : cards,
    querySelector: () => counter,
  };
  const tweens = [], setup = [], timers = new Map();
  let completed, refreshed = 0, killed = 0;
  const timeline = {
    to(target, vars, at) { tweens.push({ target, vars, at }); return this; },
    kill() { killed++; },
  };
  const gsap = {
    timeline(options) { completed = options.onComplete; return timeline; },
    set(target, vars) {
      setup.push({ target, vars });
      if (target === page || target === header) target.setAttribute('style', 'animation styles');
    },
  };
  const context = vm.createContext({
    loader, gsap, Event, refresh: () => refreshed++,
    setTimeout(fn, delay) { timers.set(1, { fn, delay }); return 1; },
    clearTimeout(id) { timers.delete(id); },
  });
  const delay = vm.runInContext(source.replace('export ', '') + '\nanimatePreloader(loader, gsap, refresh);', context);
  return { cards, images, counter, page, header, root, events, loader, tweens, setup, timers, delay,
    complete: () => completed(), get refreshed() { return refreshed; }, get killed() { return killed; } };
}

test('loader counter reaches 100% and completion restores authored page styles', () => {
  const f = animationFixture();
  const progress = f.tweens.find(tween => tween.vars.onUpdate);
  progress.target.value = 57.6;
  progress.vars.onUpdate();
  assert.equal(f.counter.textContent, '58%');
  progress.target.value = progress.vars.value;
  progress.vars.onUpdate();
  assert.equal(f.counter.textContent, '100%');
  f.complete();
  assert.equal(f.loader.style.display, 'none');
  assert.equal(f.page.value, 'color: red');
  assert.equal(f.header.value, null);
  assert.equal(f.root.value, null, 'scroll positioning can finish after the loader');
  assert.deepEqual(f.events, [{ type: 'portfolio:preloader-complete', pageStyle: 'color: red', active: null }]);
  assert.equal(f.refreshed, 1);
  assert.equal(f.timers.size, 0);
  assert.equal(f.loader.style.animation, undefined, 'the CSS fallback must stay active');
  f.complete();
  assert.equal(f.refreshed, 1, 'completion must run once');
});

test('interrupted animation cannot leave the page scaled down or hidden', () => {
  const f = animationFixture();
  const fallback = [...f.timers.values()][0];
  assert(fallback.delay < 4000);
  fallback.fn();
  assert.equal(f.loader.style.display, 'none');
  assert.equal(f.page.value, 'color: red');
  assert.equal(f.header.value, null);
  assert.equal(f.root.value, null);
  assert.equal(f.killed, 1);
  assert.equal(f.refreshed, 1);
});

test('reference image reveals overlap smoothly before the page reveal', () => {
  const f = animationFixture();
  const cards = f.tweens.find(tween => tween.target[0] === f.cards[0]);
  const images = f.tweens.find(tween => tween.target[0] === f.images[0]);
  assert.equal(cards.at, images.at);
  assert(cards.vars.duration > cards.vars.stagger, 'successive cards must overlap');
  assert.equal(images.vars.duration, cards.vars.duration);
  assert.equal(images.vars.stagger, cards.vars.stagger);
  assert.equal(f.setup.filter(set => set.target[0] === f.cards[0]).length, 1, 'stacking stays fixed');
  const page = f.tweens.find(tween => tween.target === f.page);
  assert(page.at < cards.vars.duration + cards.vars.stagger * 3);
  assert.equal(f.delay, page.at);
  assert.equal(page.vars.ease(0), 0);
  assert.equal(page.vars.ease(1), 1);
  for (let step = 1; step <= 100; step++) {
    assert(page.vars.ease(step / 100) >= page.vars.ease((step - 1) / 100));
  }
});

function gate({ hidden = false, blockedStorage = false } = {}) {
  const loader = {}, calls = [], stored = [];
  const start = bundle.indexOf('function Vc(){');
  const end = bundle.indexOf('function ', start + 10);
  const context = vm.createContext({
    Oc: false, hi: {}, requestSiteRefresh() {},
    document: { querySelector: () => loader },
    getComputedStyle: () => ({ display: hidden ? 'none' : 'grid' }),
    sessionStorage: {
      setItem(key, value) {
        if (blockedStorage) throw new Error('Storage blocked');
        stored.push([key, value]);
      },
    },
    animatePreloader: () => { calls.push(loader); return 2.1; },
  });
  vm.runInContext(bundle.slice(start, end), context);
  return { run: () => vm.runInContext('Vc()', context), calls, stored };
}

test('internal navigation and reduced-motion visitors skip the hidden loader', () => {
  const skipped = gate({ hidden: true });
  assert.equal(skipped.run(), 0);
  assert.equal(skipped.calls.length, 0);
  assert.equal(skipped.stored.length, 0);

  const first = gate();
  assert.equal(first.run(), 2.1);
  assert.equal(first.run(), 0);
  assert.equal(first.calls.length, 1);
  assert.deepEqual(first.stored, [['yadunand-loaded', '1']]);
});

test('blocked session storage still allows the loader to run and finish', () => {
  const first = gate({ blockedStorage: true });
  assert.equal(first.run(), 2.1);
  assert.equal(first.calls.length, 1);
});
