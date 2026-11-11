import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const source = readFileSync(new URL('../assets/navigation.js', import.meta.url), 'utf8');

test('homepage header stays white during the loader and follows section colors after reveal', () => {
  const attributes = new Set(['data-on-dark']);
  const rootAttributes = new Set(['data-preloader-active']);
  const header = Object.assign(new EventTarget(), {
    matches: () => false,
    removeAttribute: name => attributes.delete(name),
    setAttribute: name => attributes.add(name),
    toggleAttribute(name, enabled) { if (enabled) attributes.add(name); else attributes.delete(name); },
  });
  let rect = { top: 400, bottom: 400, height: 0 };
  const hero = { dataset: { dark: '0:0.32' }, getBoundingClientRect: () => rect };
  const document = Object.assign(new EventTarget(), {
    documentElement: { hasAttribute: name => rootAttributes.has(name) },
    querySelector: () => header,
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
  assert(attributes.has('data-on-dark'), 'collapsed loader geometry must not turn the header black');
  window.dispatchEvent(new Event('resize'));
  assert(attributes.has('data-on-dark'));

  rootAttributes.delete('data-preloader-active');
  rect = { top: 0, bottom: 1700, height: 1700 };
  document.dispatchEvent(new Event('portfolio:preloader-complete'));
  assert(attributes.has('data-on-dark'), 'the restored homepage hero uses white text');

  window.scrollY = 1800;
  rect = { top: -1800, bottom: -100, height: 1700 };
  window.dispatchEvent(new Event('scroll'));
  assert.equal(attributes.has('data-on-dark'), false, 'light sections still use dark text');

  controller.abort();
  rect = { top: 0, bottom: 1700, height: 1700 };
  document.dispatchEvent(new Event('portfolio:preloader-complete'));
  assert.equal(attributes.has('data-on-dark'), false, 'cleanup removes the reveal listener');
});

test('homepage markup starts with white navigation before scripts initialize', () => {
  const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  assert.match(html, /<header\b[^>]*\bdata-header\b[^>]*\bdata-on-dark\b/);
});
