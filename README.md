# Yadunand Pavithran’s portfolio

The portfolio uses the Next.js App Router and React. The five public pages
are prerendered, and the existing animation and form modules start after
React hydrates.

## Develop locally

```sh
npm ci
npm run dev
```

The development site is available at `http://localhost:3000`. Edit the route
components in `app/`, shared layout components in `app/site/`, and styles,
images, and browser animation modules in `public/`.

## Build and test

```sh
npm run build
npm test
```

Publish `out/` to a static host. The export includes extensionless canonical
URLs, directory indexes, legacy `.html` addresses, and the existing `CNAME`
and `.nojekyll` files. The existing full-document navigation drives the
portfolio’s page transitions, and the shared runtime manages Lenis.
