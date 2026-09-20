# i18n-seo-attributes — implementer plan

## Problem
`app.vue:22`'s `useLocaleHead()` omits `addSeoAttributes`, so no
canonical/hreflang `<link>` tags render at all. Flagged during verification
of the earlier `seo-canonical-domain-fix` P0 node: the domain hardcoded in
3-4 places was fixed, but since this flag was off, none of those fixes had
any visible SEO effect — there was nothing rendering a canonical tag to
begin with.

## Root cause of the original omission
`app.vue`'s own comment: enabling `addSeoAttributes` previously triggered
an "I18n baseUrl is required" Nuxt build warning, and the `i18n-foundation`
node (issue #80) only asked for the `<html lang>` fix, so it was scoped
out rather than blocked on indefinitely.

## Why it's safe now
`nuxt.config.ts`'s i18n `baseUrl` is no longer empty/missing — the P0 fix
earlier this session set it to `server/utils/siteUrl.ts`'s `SITE_URL`
(`https://resume-nuxt-vert.vercel.app`). The exact precondition the old
warning needed is now met.

## Plan
1. Confirm `I18nHeadMetaInfo`'s real return shape from the installed
   `@nuxtjs/i18n` package (not assumed) — `{ htmlAttrs, meta, link }`.
2. Pass `{ addSeoAttributes: true }` to `useLocaleHead()`.
3. Spread both `link` and `meta` (not just `link`) into the existing
   `useHead()` call, alongside the existing `htmlAttrs.lang` override.
4. Update the stale code comment explaining why the flag was off.
5. Verify: build (watch specifically for the named warning NOT
   reappearing), lint, then confirm the real tags server-render for both
   `/` and `/en` via raw HTML (curl against a real `npm run preview`
   build, not just dev-mode CDP) + confirm the tag survives hydration via
   CDP with 0 console errors.

## Scope
One file (`app.vue`). No diagram/routing/i18n-config changes needed —
purely turning on an existing library option now that its precondition is
met.
