import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const source = readFileSync(new URL('../public/assets/js/navigation.js', import.meta.url), 'utf8');

function setupNavigation({ introHeight = 1700, darkIntro = true } = {}) {
  const attributes = new Set(['data-on-dark']);
  const rootAttributes = new Set(['data-preloader-active']);
  const header = Object.assign(new EventTarget(), {
    matches: () => false,
    removeAttribute: name => attributes.delete(name),
    toggleAttribute(name, enabled) { if (enabled) attributes.add(name); else attributes.delete(name); },
  });
  const rect = { top: 400, bottom: 400, height: 0 };
  const intro = { dataset: { dark: '0:0.32' }, getBoundingClientRect: () => rect };
  const document = Object.assign(new EventTarget(), {
    documentElement: { hasAttribute: name => rootAttributes.has(name) },
    querySelector: selector => selector === '[data-header]' ? header : intro,
    querySelectorAll: () => darkIntro ? [intro] : [],
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
    Object.assign(rect, { top: -top, bottom: introHeight - top, height: introHeight });
    window.dispatchEvent(new Event('scroll'));
  }
  return { attributes, rootAttributes, header, rect, document, window, controller, scrollTo };
}

test('homepage header follows the theme and scroll direction after the loader', () => {
  const { attributes, rootAttributes, header, rect, document, window, controller, scrollTo } = setupNavigation();
  assert(attributes.has('data-on-dark'), 'collapsed loader geometry must not turn the header black');
  window.dispatchEvent(new Event('resize'));
  assert(attributes.has('data-on-dark'));

  rootAttributes.delete('data-preloader-active');
  Object.assign(rect, { top: 0, bottom: 1700, height: 1700 });
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
  header.matches = () => true;
  header.dispatchEvent(new Event('focusin'));
  assert(!attributes.has('data-hidden'), 'keyboard focus reveals the header');
  scrollTo(1860);
  assert(!attributes.has('data-hidden'), 'the focused navigation control remains visible');

  controller.abort();
  Object.assign(rect, { top: 0, bottom: 1700, height: 1700 });
  document.dispatchEvent(new Event('portfolio:preloader-complete'));
  assert.equal(attributes.has('data-on-dark'), false, 'cleanup removes the reveal listener');
});

test('inner pages keep the compact header in view until their intro ends', () => {
  const { attributes, rootAttributes, document, scrollTo } = setupNavigation({ introHeight: 640, darkIntro: false });
  scrollTo(640);
  assert(!attributes.has('data-hidden'), 'the header stays visible during the loader');
  rootAttributes.delete('data-preloader-active');
  document.dispatchEvent(new Event('portfolio:preloader-complete'));

  scrollTo(64);
  assert(attributes.has('data-compact'));
  assert(!attributes.has('data-hidden'), 'the compact bar appears before the slide');
  scrollTo(639);
  assert(!attributes.has('data-hidden'), 'the compact bar stays visible through the intro');
  scrollTo(640);
  assert(attributes.has('data-hidden'));
  scrollTo(720);
  scrollTo(710);
  assert(!attributes.has('data-hidden'), 'upward scroll shows the bar away from the top');
  assert(attributes.has('data-compact'));
  scrollTo(0);
  assert(!attributes.has('data-compact'));
});

test('all pages use the same desktop and mobile navigation with a local intro', () => {
  const read = file => readFileSync(new URL('../out/' + file, import.meta.url), 'utf8');
  const normalize = markup => markup.replace(/ aria-current="page"| data-on-dark=""/g, '')
    .replace(/>\s+</g, '><').replace(/\s+/g, ' ').trim();
  const home = read('index.html');
  const homeHeader = normalize(home.match(/<header\b[\s\S]*?<\/header>/)[0]);
  const homeMenu = normalize(home.match(/<div data-menu\b[\s\S]*?(?=<main\b)/)[0]);

  for (const file of ['index.html', 'projects.html', 'services.html', 'contact.html', 'privacy.html']) {
    const html = read(file);
    const header = html.match(/<header\b[\s\S]*?<\/header>/)[0];
    const menu = html.match(/<div data-menu\b[\s\S]*?(?=<main\b)/)[0];
    assert.equal(normalize(header), homeHeader, file);
    assert.equal(normalize(menu), homeMenu, file);
    assert.equal((html.match(/<[a-z][^>]*\sdata-nav-intro\b/g) || []).length, 1, file);
    if (file === 'index.html' || file === 'contact.html') assert.match(header, /\bdata-on-dark\b/, file);
  }
});
