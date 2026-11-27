import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { baseRuntime, scriptsFor } from '../app/site/assets.js';
import { boot } from '../app/site/boot.js';

const root = fileURLToPath(new URL('../out/', import.meta.url));
const routes = ['projects', 'services', 'contact', 'privacy'];
const htmlFiles = ['index.html', ...routes.flatMap(route => [`${route}.html`, `${route}/index.html`])];

function tags(html) {
  return [...html.matchAll(/<(a|img|source|video|link|script|meta)\b([^>]*)>/g)].map(match => {
    const attrs = Object.fromEntries([...match[2].matchAll(/([^\s=]+)\s*=\s*(["'])(.*?)\2/gs)].map(a => [a[1], a[3]]));
    return { tag: match[1], attrs };
  });
}

const source = name => readFileSync(path.join(root, name), 'utf8');
const routeFor = file => file.split(/[./]/)[0].replace(/^index$/, 'home');

test('every exported document loads the navigation stylesheet and schedules one shared behavior module', () => {
  for (const file of htmlFiles) {
    const html = source(file);
    const entries = tags(html);
    const scripts = entries.filter(entry => entry.tag === 'script' && entry.attrs.src).map(entry => entry.attrs.src);
    assert(scripts.some(src => src.startsWith('/_next/')), file);
    assert.equal(scripts.length, new Set(scripts).size, file);
    assert.equal(scripts.filter(src => src === '/assets/js/page-transitions.js').length, 1, file);
    assert(html.indexOf('/assets/js/page-transitions.js') < html.indexOf('</head>'), file);
    assert(html.includes(`<script>${boot}</script>`), file);

    const deferredScripts = scriptsFor(routeFor(file)).map(({ src }) => src);
    assert.equal(deferredScripts.filter(src => src === baseRuntime).length, 1, file);
    assert(!scripts.includes(baseRuntime), 'the site runtime starts after React hydration');
    for (const src of deferredScripts) {
      assert(html.includes(src), `${file} schedules ${src}`);
      assert(existsSync(path.join(root, src)), `${file} -> ${src}`);
    }
    assert.equal(entries.filter(entry =>
      entry.tag === 'link' && entry.attrs.rel === 'stylesheet' &&
      entry.attrs.href === '/assets/css/site-navigation.css'
    ).length, 1, file);
  }
});

test('exported local links, fragment destinations and asset references resolve', () => {
  for (const file of htmlFiles) {
    const entries = tags(source(file));
    for (const { tag, attrs } of entries) {
      if (tag === 'a' && attrs.href?.startsWith('/') && !attrs.href.startsWith('//')) {
        assert(!new URL(attrs.href, 'https://iamyadunand.com').pathname.endsWith('.html'), `${file} -> ${attrs.href}`);
      }
    }
    const references = entries.flatMap(({ attrs }) =>
      ['href', 'src', 'poster'].filter(key => attrs[key]).map(key => attrs[key]));
    for (const href of references) {
      if (/^(?:[a-z][\w+.-]*:|\/\/)/i.test(href)) continue;
      const [relative, hash] = href.split('#');
      const urlPath = relative.split('?')[0];
      let target = urlPath ? path.join(root, decodeURIComponent(urlPath)) : path.join(root, file);
      if (existsSync(target) && statSync(target).isDirectory()) target = path.join(target, 'index.html');
      assert(existsSync(target), `${file} -> ${href}`);
      if (hash && target.endsWith('.html')) {
        const ids = [...readFileSync(target, 'utf8').matchAll(/(?:\s|<)id=(["'])(.*?)\1/g)].map(match => match[2]);
        assert(ids.includes(decodeURIComponent(hash)), `${file} -> ${href}`);
      }
    }
  }
});

test('shared bundle bridges the existing libraries with one Lenis instance and ticker', () => {
  const bundle = source(baseRuntime);
  const scroll = source('assets/js/site-scroll.js');
  assert.equal((bundle.match(/initSiteScroll\(\{Lenis:Cc,gsap:hi,ScrollTrigger:Q\}\)/g) || []).length, 1);
  assert.equal((scroll.match(/new Lenis\(/g) || []).length, 1);
  assert.equal((scroll.match(/gsap\.ticker\.add\(tick\)/g) || []).length, 1);
  assert(scroll.includes('autoRaf: false'));
  assert(scroll.includes('syncTouch: false'));
  assert(scroll.includes('allowNestedScroll: true'));
  assert(!scroll.includes('requestAnimationFrame(tick)'));
  assert(!bundle.includes('new Cc('));
  assert(bundle.includes('a=()=>requestSiteRefresh();return document.fonts?.ready.then(a)'));
});

test('each clean route has a static directory index, legacy alias, and canonical URL', () => {
  for (const route of routes) assert.equal(source(`${route}/index.html`), source(`${route}.html`), route);
  for (const file of htmlFiles) {
    const html = source(file);
    const route = routeFor(file);
    assert(html.includes('<main'), file);
    const canonical = tags(html).filter(({ tag, attrs }) => tag === 'link' && attrs.rel === 'canonical');
    assert.equal(canonical.length, 1, file);
    assert.equal(canonical[0].attrs.href, `https://iamyadunand.com/${route === 'home' ? '' : route}`, file);
  }
  assert.equal(source('CNAME').trim(), 'iamyadunand.com');
  assert(existsSync(path.join(root, '.nojekyll')));
});

test('every page except Contact uses the footer scroll reveal', () => {
  for (const file of htmlFiles) {
    const route = routeFor(file);
    const html = source(file);
    const contact = route === 'contact';
    const panels = html.match(/<section\s+data-footer-portal\b/g) ?? [];
    assert.equal(panels.length, contact ? 0 : 1, file);
    assert.equal(scriptsFor(route).filter(script => script.src.endsWith('/footer-reveal.js')).length, contact ? 0 : 1, file);
    if (contact) {
      assert.match(html, /<\/main>\s*<footer\b[^>]*\bdata-profile-footer\b/, file);
    } else {
      assert.match(html, /<\/main>\s*<div data-footer-reveal-stage\b[^>]*>\s*<footer\b[^>]*\bdata-profile-footer\b/, file);
    }
  }
});
