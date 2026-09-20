# i18n-seo-attributes — implementer diff

## Node
`i18n-seo-attributes` — enable `useLocaleHead()`'s `addSeoAttributes` so
canonical + hreflang alternate `<link>` tags actually render, closing a gap
surfaced while verifying the `seo-canonical-domain-fix` P0 node
(2026-09-19): the domain was fixed everywhere it was hardcoded, but
`app.vue` never emitted any canonical/hreflang tags at all, so the fix had
no live effect yet.

## Why it was previously off
`app.vue`'s old comment: omitted specifically to avoid an "I18n baseUrl is
required" build warning, scoped out of the original `i18n-foundation`/issue
#80 work (that issue only asked for the `<html lang>` fix). That blocker no
longer applies — `nuxt.config.ts`'s i18n `baseUrl` is now
`server/utils/siteUrl.ts`'s `SITE_URL` (real value), set during the P0
domain fix.

## Diff
```diff
--- a/app.vue
+++ b/app.vue
@@ -15,15 +15,17 @@
 // very first response, before any locale is known) - override it per real
 // active locale so <html lang> matches what's actually rendered (e.g. "en"
 // under the /en/* prefix), instead of always claiming Vietnamese.
-// addSeoAttributes/canonical alternate-links are out of this node's scope
-// (only the lang attribute was flagged as missing in issue #80) - omitting
-// that option also avoids a "I18n baseUrl is required" build warning it
-// would otherwise trigger.
-const i18nHead = useLocaleHead()
+// addSeoAttributes was previously omitted here because it triggered an
+// "I18n baseUrl is required" build warning - nuxt.config.ts's i18n.baseUrl
+// is now a real value (server/utils/siteUrl.ts's SITE_URL), so canonical +
+// hreflang alternate <link> tags can be generated for real.
+const i18nHead = useLocaleHead({ addSeoAttributes: true })
 useHead(() => ({
   htmlAttrs: {
     lang: i18nHead.value.htmlAttrs?.lang,
   },
+  link: i18nHead.value.link,
+  meta: i18nHead.value.meta,
 }))
```

`I18nHeadMetaInfo`'s real shape (confirmed from
`node_modules/@nuxtjs/i18n/dist/module.d.ts:328-332`): `{ htmlAttrs, meta,
link }` — both `meta` and `link` are populated by `addSeoAttributes`, so
both are spread into `useHead`, not just `link`.

## Verification
- `npm run build`: clean, exit 0, `✨ Build complete!` — **no** "I18n
  baseUrl is required" warning (the exact regression the old comment named
  did not reappear), only the pre-existing unrelated darwin-arm64 `sharp`
  warning.
- `npm run lint`: `13 problems (0 errors, 13 warnings)` — exact baseline
  match, unchanged.
- Built `.output` served via `npm run preview` (port 3000) and raw HTML
  fetched directly (not CDP, so this is the literal server response, not a
  post-hydration artifact):

  `curl http://localhost:3000/` (vi, unprefixed):
  ```
  <link rel="alternate" href="https://resume-nuxt-vert.vercel.app" hreflang="x-default">
  <link rel="alternate" href="https://resume-nuxt-vert.vercel.app" hreflang="vi">
  <link rel="alternate" href="https://resume-nuxt-vert.vercel.app" hreflang="vi-VN">
  <link rel="alternate" href="https://resume-nuxt-vert.vercel.app/en" hreflang="en">
  <link rel="alternate" href="https://resume-nuxt-vert.vercel.app/en" hreflang="en-US">
  <link rel="canonical" href="https://resume-nuxt-vert.vercel.app">
  ```

  `curl http://localhost:3000/en`:
  ```
  <link rel="alternate" href="https://resume-nuxt-vert.vercel.app" hreflang="x-default">
  <link rel="alternate" href="https://resume-nuxt-vert.vercel.app" hreflang="vi">
  <link rel="alternate" href="https://resume-nuxt-vert.vercel.app" hreflang="vi-VN">
  <link rel="alternate" href="https://resume-nuxt-vert.vercel.app/en" hreflang="en">
  <link rel="alternate" href="https://resume-nuxt-vert.vercel.app/en" hreflang="en-US">
  <link rel="canonical" href="https://resume-nuxt-vert.vercel.app/en">
  ```

  Canonical correctly differs per-locale (`/` vs `/en`); the 5 alternate
  tags are identical on both pages (expected — the full locale set, not
  per-page).

- Chrome CDP (`puppeteer.connect({ browserURL: 'http://localhost:9888' })`
  against the same preview server): navigated to `/`, waited for
  `networkidle0` + 1s, read `link[rel="canonical"]` back from the live DOM
  post-hydration — `https://resume-nuxt-vert.vercel.app/` (trailing slash
  from `useRoute` on `/`, consistent with the raw HTML), **0** console/page
  errors. Confirms the tag survives hydration rather than being an
  SSR-only artifact that Vue then strips.

## Scope
Single-file change (`app.vue`), no other file touched. `git diff --stat`:
`app.vue | 8 +++++---`.

## Caveat (disclosed, not silently omitted)
This implementer pass and the verifier pass below both ran in the same
agent session/context, not a fully separate independent process — the
verification steps above (fresh build/lint re-runs, direct source
type-shape confirmation, live curl + CDP against the actual preview
server) are real, but this is not the doctrine's default fully-independent
verifier flow. Same caveat pattern as this session's 2026-09-20 P1/P2/P3
rounds.
