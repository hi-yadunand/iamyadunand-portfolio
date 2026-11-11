import {mkdir, readFile, writeFile} from 'node:fs/promises';

// Directory indexes support file-only servers as well as clean-URL hosting.
// Edit the root HTML documents, then run this script to refresh these copies.
const routes = ['studio', 'projects', 'services', 'contact', 'privacy', 'terms'];
const root = new URL('../', import.meta.url);
const check = process.argv.includes('--check');

for (const route of routes) {
  const source = `${route}.html`;
  let html = await readFile(new URL(source, root), 'utf8');
  // Resolve assets from the site root even before the early URL normalizer runs.
  // Fragment links remain relative to the current document.
  html = html.replace(/\b(href|src|poster)=(['"])(.*?)\2/g, (match, name, quote, value) => {
    if (!value || /^(?:[a-z][\w+.-]*:|\/|#)/i.test(value)) return match;
    const url = new URL(value, `https://portfolio.invalid/${source}`);
    return `${name}=${quote}${url.pathname}${url.search}${url.hash}${quote}`;
  });
  html = html.replace('<!DOCTYPE html>', `<!DOCTYPE html>\n<!-- Generated from ${source} by scripts/sync-routes.mjs. Edit the root document. -->`);
  const directory = new URL(`${route}/`, root);
  const target = new URL('index.html', directory);
  if (check) {
    const current = await readFile(target, 'utf8').catch(() => '');
    if (current !== html) throw new Error(`${route}/index.html is out of date. Run node scripts/sync-routes.mjs.`);
  } else {
    await mkdir(directory, {recursive: true});
    await writeFile(target, html);
  }
}

console.log(check ? 'All 6 clean-URL entry pages are current.' : 'Updated all 6 clean-URL entry pages.');
