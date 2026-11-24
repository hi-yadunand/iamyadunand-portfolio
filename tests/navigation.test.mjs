import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const source = readFileSync(new URL('../assets/js/navigation.js', import.meta.url), 'utf8');

test('homepage header follows the theme and scroll direction after the loader', () => {
  const attributes = new Set(['data-on-dark']);
  const rootAttributes = new Set(['data-preloader-active']);
  let keyboardFocus = false;
  const header = Object.assign(new EventTarget(), {
    matches: () => keyboardFocus,
    removeAttribute: name => attributes.delete(name),
    toggleAttribute(name, enabled) { if (enabled) attributes.add(name); else attributes.delete(name); },
  });
  let rect = { top: 400, bottom: 400, height: 0 };
  const hero = { dataset: { dark: '0:0.32' }, getBoundingClientRect: () => rect };
  const document = Object.assign(new EventTarget(), {
    documentElement: { hasAttribute: name => rootAttributes.has(name) },
    querySelector: selector => selector === '[data-header]' ? header : hero,
    querySelectorAll: () => [hero],
  });
  const window = Object.assign(new EventTarget(), {
    scrollY: 0, innerHeight: 1000,
    matchMedia: () => ({ matches: false }),
    clearTimeout() {}, setTimeout: () => 1,
  });
  const controller = new AbortController();
  const context = vm.createContext({ document, window, performance, signal: controller.signal });
  vm.runInContext(source.replace('export ', '') + '\ninitNavigation(signal);', context);
  function scrollTo(top) {
    window.scrollY = top;
    rect = { top: -top, bottom: 1700 - top, height: 1700 };
    window.dispatchEvent(new Event('scroll'));
  }
  assert(attributes.has('data-on-dark'), 'collapsed loader geometry must not turn the header black');
  window.dispatchEvent(new Event('resize'));
  assert(attributes.has('data-on-dark'));

  rootAttributes.delete('data-preloader-active');
  rect = { top: 0, bottom: 1700, height: 1700 };
  document.dispatchEvent(new Event('portfolio:preloader-complete'));
  assert(attributes.has('data-on-dark'), 'the restored homepage hero uses white text');

  scrollTo(64);
  assert(attributes.has('data-compact'), 'scrolling down compacts the navigation');
  scrollTo(40);
  assert(attributes.has('data-compact'), 'small reversals keep the compact state stable');
  scrollTo(24);
  assert.equal(attributes.has('data-compact'), false, 'the wide header returns near the top');

  scrollTo(1699);
  assert(!attributes.has('data-hidden'), 'the compact header remains visible through the hero');
  scrollTo(1700);
  assert.equal(attributes.has('data-on-dark'), false, 'light sections still use dark text');
  assert(attributes.has('data-hidden'), 'downward scroll hides the header as the hero exits');
  scrollTo(1800);
  scrollTo(1799);
  assert(!attributes.has('data-hidden'), 'upward scroll reveals the header below the hero');
  assert(attributes.has('data-compact'));

  rootAttributes.add('data-menu-open');
  scrollTo(1820);
  assert(!attributes.has('data-hidden'), 'the mobile menu keeps its toggle visible');
  rootAttributes.delete('data-menu-open');
  scrollTo(1840);
  assert(attributes.has('data-hidden'));
  keyboardFocus = true;
  header.dispatchEvent(new Event('focusin'));
  assert(!attributes.has('data-hidden'), 'keyboard focus reveals the header');
  scrollTo(1860);
  assert(!attributes.has('data-hidden'), 'the focused navigation control remains visible');

  controller.abort();
  rect = { top: 0, bottom: 1700, height: 1700 };
  document.dispatchEvent(new Event('portfolio:preloader-complete'));
  assert.equal(attributes.has('data-on-dark'), false, 'cleanup removes the reveal listener');
});

test('homepage markup starts with white navigation before scripts initialize', () => {
  const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  assert.match(html, /<header\b[^>]*\bdata-header\b[^>]*\bdata-on-dark\b/);
});
