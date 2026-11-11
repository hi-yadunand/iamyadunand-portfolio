import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const source = readFileSync(new URL('../assets/page-transitions.js', import.meta.url), 'utf8');

function fixture({ supported = true, reduced = false, loaded = true, loaderHidden = false } = {}) {
  const attributes = new Set(['data-site-enter']);
  const classes = new Set(['motion', ...(loaded ? ['loaded'] : [])]);
  const root = {
    setAttribute: name => attributes.add(name), removeAttribute: name => attributes.delete(name),
    hasAttribute: name => attributes.has(name), classList: { contains: name => classes.has(name) },
  };
  const motion = Object.assign(new EventTarget(), { matches: reduced });
  const window = Object.assign(new EventTarget(), { matchMedia: () => motion });
  if (supported) Object.assign(window, { onpageswap: null, onpagereveal: null });
  const document = Object.assign(new EventTarget(), {
    documentElement: root,
    querySelector: () => ({ style: { display: loaderHidden ? 'none' : '' } }),
  });
  const location = { href: 'https://portfolio.test/studio', origin: 'https://portfolio.test', pathname: '/studio', search: '' };
  const context = vm.createContext({ document, window, location, URL });
  vm.runInContext(source, context);
  const dispatch = (target, type, properties = {}) => target.dispatchEvent(Object.assign(new Event(type), properties));
  const transition = () => {
    let resolve, reject, skips = 0;
    const finished = new Promise((a, b) => { resolve = a; reject = b; });
    return { finished, resolve, reject, skipTransition() { skips++; }, get skips() { return skips; } };
  };
  const click = (href, attrs = [], extras = {}) => {
    const link = { href: new URL(href, location.href).href, target: '',
      hasAttribute: name => attrs.includes(name), getAttribute: () => href,
      closest: selector => selector === 'a[href]' || attrs.includes('data-native-navigation') ? link : null,
    };
    // Native EventTarget supplies target; a minimal capture target supplies the link.
    const event = new Event('click');
    Object.defineProperty(event, 'target', { value: link });
    Object.assign(event, { button: 0, ...extras });
    document.dispatchEvent(event);
  };
  return { attributes, window, document, motion, dispatch, transition, click };
}

test('native page reveal owns the entrance and cleans up after completion or cancellation', async () => {
  for (const cancel of [false, true]) {
    const f = fixture(), transition = f.transition();
    assert(f.attributes.has('data-native-page-transitions'));
    f.dispatch(f.window, 'pagereveal', { viewTransition: transition });
    assert.equal(f.attributes.has('data-site-enter'), false);
    assert(f.attributes.has('data-page-transition-active'));
    if (cancel) transition.reject(new Error('Navigation interrupted'));
    else transition.resolve();
    await Promise.resolve();
    assert.equal(f.attributes.has('data-page-transition-active'), false);
  }
});

test('reduced motion and the starter loader skip overlapping page snapshots', async () => {
  for (const options of [{ reduced: true }, { loaded: false }]) {
    const f = fixture(options), transition = f.transition();
    f.dispatch(f.window, 'pagereveal', { viewTransition: transition });
    assert.equal(transition.skips, 1);
    assert.equal(f.attributes.has('data-page-transition-active'), false);
  }
  const cached = fixture({ loaded: false, loaderHidden: true }), transition = cached.transition();
  cached.dispatch(cached.window, 'pagereveal', { viewTransition: transition });
  assert.equal(transition.skips, 0, 'a completed cached loader does not suppress history transitions');
  cached.motion.matches = true;
  cached.dispatch(cached.motion, 'change');
  assert.equal(transition.skips, 1, 'a live reduced-motion change stops the transition');
  transition.resolve(); await Promise.resolve();
  cached.dispatch(cached.motion, 'change');
  assert.equal(transition.skips, 1, 'completion removes the preference listener');
});

test('Home, current-page reloads, explicit opt-outs and modified clicks retain their behavior', () => {
  const f = fixture();
  for (const [href, attrs] of [['/', []], ['/studio', []], ['/contact', ['data-no-transition']], ['/contact', ['data-native-navigation']]]) {
    f.click(href, attrs);
    const transition = f.transition();
    f.dispatch(f.window, 'pageswap', { viewTransition: transition });
    assert.equal(transition.skips, 1);
  }
  f.dispatch(f.window, 'pageshow');
  f.click('/', [], { ctrlKey: true });
  assert.equal(f.attributes.has('data-skip-page-transition'), false);
  f.click('/services');
  const transition = f.transition();
  f.dispatch(f.window, 'pageswap', { viewTransition: transition });
  assert.equal(transition.skips, 0);
});

test('unsupported browsers retain the self-contained entrance fallback', () => {
  const f = fixture({ supported: false });
  assert.equal(f.attributes.has('data-native-page-transitions'), false);
  assert(f.attributes.has('data-site-enter'));
});
