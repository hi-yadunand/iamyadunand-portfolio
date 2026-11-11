import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
function files(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap(item => {
    if (item.name.startsWith('.git')) return [];
    const target = path.join(dir, item.name);
    return item.isDirectory() ? files(target) : [target];
  });
}
const htmlFiles = files(root).filter(name => name.endsWith('.html'));
function tags(html) {
  return [...html.matchAll(/<(a|img|source|video|link|script|meta)\b([^>]*)>/g)].map(match => {
    const attrs = Object.fromEntries([...match[2].matchAll(/([^\s=]+)\s*=\s*(["'])(.*?)\2/gs)].map(a => [a[1], a[3]]));
    return { tag: match[1], attrs };
  });
}
const source = name => readFileSync(path.join(root, name), 'utf8');

test('every rendered document loads one base runtime, one navigation stylesheet and the entry helper', () => {
  let rendered = 0, redirects = 0;
  for (const file of htmlFiles) {
    const html = readFileSync(file, 'utf8'), entries = tags(html);
    const scripts = entries.filter(t => t.tag === 'script' && t.attrs.src).map(t => t.attrs.src);
    assert.equal(scripts.length, new Set(scripts).size, file);
    const base = scripts.filter(src => src.includes('BaseLayout.astro_astro_type_script'));
    if (html.includes('http-equiv="refresh"')) {
      redirects++;
      assert.equal(base.length, 0, file);
      assert.equal(scripts.filter(src => src.endsWith('/project-redirect.js')).length, 1, file);
      assert(html.indexOf('/project-redirect.js') < html.indexOf('http-equiv="refresh"'), file);
      continue;
    }
    rendered++;
    assert.equal(base.length, 1, file);
    assert.equal(entries.filter(t => t.tag === 'link' && t.attrs.rel === 'stylesheet' && t.attrs.href.endsWith('/site-navigation.css')).length, 1, file);
    assert(html.includes('sessionStorage.getItem("portfolio-page-entry")'), file);
    assert(html.includes('h.setAttribute("data-site-enter", "")'), file);
    const transitionScript = scripts.filter(src => src.endsWith('/page-transitions.js'));
    assert.equal(transitionScript.length, 1, file);
    assert(html.indexOf(transitionScript[0]) < html.indexOf('</head>'), file);
  }
  assert.equal(rendered, 21); assert.equal(redirects, 8);
});

test('all local HTML links, fragments, redirects and relative asset references resolve', () => {
  for (const file of htmlFiles) {
    const html = readFileSync(file, 'utf8');
    const references = tags(html).flatMap(({ tag, attrs }) => {
      const values = ['href', 'src', 'poster'].filter(k => attrs[k]).map(k => attrs[k]);
      if (tag === 'meta' && attrs['http-equiv']?.toLowerCase() === 'refresh') values.push(attrs.content.split(/url=/i)[1]);
      return values;
    });
    for (const href of references) {
      if (/^(?:[a-z][\w+.-]*:|\/\/)/i.test(href)) continue;
      const [relative, hash] = href.split('#');
      let target = relative ? relative.startsWith('/') ? path.join(root, relative) : path.resolve(path.dirname(file), relative.split('?')[0]) : file;
      if (!existsSync(target)) target = decodeURIComponent(target);
      // Clean routes have directory indexes for file-only preview servers.
      // The deployed host may also serve their matching root HTML documents.
      if ((!existsSync(target) || statSync(target).isDirectory()) && existsSync(`${target}.html`)) target += '.html';
      if (existsSync(target) && statSync(target).isDirectory()) target = path.join(target, 'index.html');
      assert(existsSync(target), `${path.relative(root, file)} -> ${href}`);
      if (hash && target.endsWith('.html')) {
        const ids = [...readFileSync(target, 'utf8').matchAll(/(?:\s|<)id=(["'])(.*?)\1/g)].map(m => m[2]);
        assert(ids.includes(decodeURIComponent(hash)), `${path.relative(root, file)} -> ${href}`);
      }
    }
  }
});

test('shared bundle bridges the existing libraries without creating another scroll engine or ticker', () => {
  const bundle = source('_astro/BaseLayout.astro_astro_type_script_index_0_lang.Dpw5V1aT.js');
  const scroll = source('assets/site-scroll.js');
  assert.equal((bundle.match(/initSiteScroll\(\{Lenis:Cc,gsap:hi,ScrollTrigger:Q\}\)/g) || []).length, 1);
  assert.equal((scroll.match(/new Lenis\(/g) || []).length, 1);
  assert.equal((scroll.match(/gsap\.ticker\.add\(tick\)/g) || []).length, 1);
  assert(scroll.includes('autoRaf: false')); assert(scroll.includes('syncTouch: false'));
  assert(scroll.includes('allowNestedScroll: true'));
  assert(!scroll.includes('requestAnimationFrame(tick)'));
  assert(!bundle.includes('new Cc('));
  assert(bundle.includes('a=()=>requestSiteRefresh();return document.fonts?.ready.then(a)'));
});

test('clean routes have real directory entry pages with root asset paths', () => {
  for (const route of ['studio', 'projects', 'services', 'contact', 'privacy', 'terms']) {
    const html = source(`${route}/index.html`);
    assert(html.includes('<main'), route);
    assert(html.includes(`href="https://iamyadunand.com/${route}"`), route);
    for (const { tag, attrs } of tags(html)) {
      for (const name of ['src', 'poster', ...(tag === 'link' ? ['href'] : [])]) {
        const value = attrs[name];
        if (value && !/^(?:[a-z][\w+.-]*:|\/|#)/i.test(value)) {
          assert.fail(`${route}/index.html has a route-relative asset: ${value}`);
        }
      }
    }
  }
});

test('page links, canonical URLs and redirect fallbacks use extensionless routes', () => {
  for (const file of htmlFiles) {
    const html = readFileSync(file, 'utf8');
    const entries = tags(html);
    for (const { attrs } of entries) {
      if (!attrs.href || attrs.href.startsWith('#')) continue;
      const url = new URL(attrs.href, `https://iamyadunand.com/${path.relative(root, file)}`);
      if (url.origin === 'https://iamyadunand.com') assert(!url.pathname.endsWith('.html'), `${file} -> ${attrs.href}`);
    }
    const canonical = entries.filter(({ tag, attrs }) => tag === 'link' && attrs.rel === 'canonical');
    assert.equal(canonical.length, 1, file);
    if (html.includes('http-equiv="refresh"')) {
      assert(html.includes('url=/projects#all-projects'), file);
    } else {
      assert(html.includes('history.replaceState(history.state, "", pagePath + pageURL.search + pageURL.hash)'), file);
      assert(html.indexOf('var originalPageURL') < html.indexOf('sessionStorage.getItem("portfolio-page-entry")'), file);
    }
  }
});
