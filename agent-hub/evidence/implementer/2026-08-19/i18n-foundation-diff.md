# 2026-08-19 — i18n-foundation (diff)

- Worker: implementer
- Version: 0.1.0
- Node: `haven/diagrams/dev-loop.prime-mermaid.md` → `i18n-foundation`
- Issue: #75, branch `feature/75`

## Diff
| File | Why |
|---|---|
| `package.json`/`package-lock.json` | New dependency `@nuxtjs/i18n@9.5.6` |
| `nuxt.config.ts` | Added `@nuxtjs/i18n` to `modules`, `i18n` config block (`locales`, `defaultLocale: 'vi'`, `strategy: 'prefix_except_default'`, `langDir: 'locales'`, `detectBrowserLanguage: false`) |
| `i18n/locales/vi.json`, `i18n/locales/en.json` (new) | Message catalogs — `header.*` (switch-language/dark/light/open-menu/close-menu aria-labels) + `footer.findMeIn` |
| `themes/portfolio-dev/layout/Header.vue` | `useI18n()` for `t()`/`locale`/`locales`/`setLocale()`, `useLocalePath()` for every nav link (logo, `mainTabs`, `contactTab`, mobile menu list), `isActive()` compares against `localePath(link)`, new language-switcher button next to the dark/light toggle |
| `themes/portfolio-dev/layout/Footer.vue` | `useI18n()`, `"find me in:"` → `t('footer.findMeIn')` |
| `agent-hub/haven/diagrams/dev-loop.prime-mermaid.md` | New node `i18n-foundation`: PENDING → IN_PROGRESS (will be SEALED by the verifier) |

## Real issue #1: wrong major version (caught by `npm run build`, not guessed)
`npm install @nuxtjs/i18n` installed `10.6.0` by default. First `npm run
build` failed immediately:
```
ERROR  Error while requiring module @nuxtjs/i18n: SyntaxError: Cannot use 'import.meta' outside a module
```
Root cause, confirmed via `npm ls @nuxtjs/i18n jiti`: `@nuxtjs/i18n@10.x`
depends on `@nuxt/kit@4.5.2` (Nuxt 4's kit, bundling `jiti@2.7.0`), while
this repo runs `nuxt@3.13.2` (Nuxt 3's kit, `jiti@1.21.6`) — a real major-
version incompatibility, not a fluke. Fixed by pinning
`@nuxtjs/i18n@9.5.6` (the last major targeting Nuxt 3), confirmed via
`npm view @nuxtjs/i18n@9 version` before installing. Re-ran `rm -rf
node_modules/.cache .nuxt .output` + rebuild after the version swap per
the documented cache trap in `doctrine/domains/PROJECT.md`.

## Real issue #2: unrequested auto-redirect (caught live via CDP)
First CDP pass on `/` with `detectBrowserLanguage` left at its default
showed `location.pathname` was already `/en` on first load (this Chrome
profile's `Accept-Language` is English) — `@nuxtjs/i18n`'s default
`detectBrowserLanguage: { redirectOn: 'root' }` auto-redirects every
visitor based on browser locale. Not something either the task or the
operator's 3 `AskUserQuestion` answers asked for (only a manual switcher
was), and a real behavior change for every visitor on a live production
site. Fixed by explicitly `detectBrowserLanguage: false`.

## Real issue #3: nav links dropped the locale prefix (caught live via CDP)
With plain `<NuxtLink to="/projects">` (unchanged from before this diff),
clicking a nav tab while on `/en` navigated to `/projects` — silently
losing the `/en` prefix instead of going to `/en/projects`. Confirmed
`@nuxtjs/i18n` does NOT auto-localize plain `to="..."` strings under
`prefix_except_default` in this version; the documented fix is
`useLocalePath()`. Applied to every `menuPrimary`-driven link (`mainTabs`,
`contactTab`, mobile menu), the logo link, and `isActive()`'s comparison
(which was comparing raw `route.path` against the un-prefixed `link`,
also broken under `/en`).

## Command
```
npm run build
```
```
npm run lint
```

## Output
`npm run build` — ran 3 times total across the version swap + the 2 real
fixes above; final run clean, verbatim tail:
```
Σ Total size: 28.5 MB (10.3 MB gzip)
[nitro] ✔ You can preview this build using node .output/server/index.mjs
```
Exit code 0, full log checked, no error string anywhere.

`npm run lint` — final run, verbatim tail, exact match to the pre-existing
session baseline:
```
✖ 34 problems (0 errors, 34 warnings)
```
Grepped for `Header.vue`/`Footer.vue` → 0 matches (0 new warnings from
either changed file). Note: 3 throwaway verification scripts
(`verify-i18n*.cjs`) were created at the repo root during CDP testing and
briefly caused the count to read 35/36 (a `no-console` warning each) —
all 3 deleted before this final lint run; `git status` (below) confirms
none remain in the diff.

## Browser verification
Chrome CDP port 9888 (already running, reused per `/browser`). Built +
ran a real preview server (`node .output/server/index.mjs`, port 3000).
Connected via `puppeteer-core`, real `page.goto` + real
`page.click('header button.uppercase')` (the language switcher) and
`page.click('header nav a[href*="projects"]')` (a real nav tab) — not raw
store mutation or `Page.navigate`.

Final verification run (after both bug fixes), full sequence in one
script:
```json
{
  "initial": {"url": "/", "footer": "Tìm mình ở:\n·\n© 2026 datvt243\n@datvt243"},
  "afterToggle": {"url": "/en", "footer": "find me in:\n·\n© 2026 datvt243\n@datvt243"},
  "afterNavClick": {"url": "/en/projects", "active": "/en/projects"},
  "afterToggleBack": {"url": "/projects", "footer": "Tìm mình ở:\n·\n© 2026 datvt243\n@datvt243"},
  "consoleErrors": []
}
```
Confirms, in order: (1) root loads `vi` unprefixed with NO auto-redirect
despite an English-locale browser, (2) the switcher toggles to `/en` with
English text, (3) a nav click while on `/en` correctly STAYS under the
`/en` prefix (the bug-fix), (4) toggling back to `vi` from `/en/projects`
correctly drops to the unprefixed `/projects` with Vietnamese text. 0
console errors across the entire sequence. Preview server + all temp
scripts cleaned up after verification.

## Acceptance
| # | Criterion | Evidence |
|---|---|---|
| 1 | `@nuxtjs/i18n` in `dependencies`, in `modules` | `package.json` diff; correct major version after the real build failure |
| 2 | `locales: [vi, en]`, `defaultLocale: 'vi'`, `strategy: 'prefix_except_default'` | `nuxt.config.ts` diff |
| 3 | `vi.json`/`en.json` catalogs for Header/Footer strings | Files created |
| 4 | `Header`/`Footer` use `$t`/`useI18n()` | Diff cited; CDP text assertions above |
| 5 | Language switcher in `Header` | CDP: real click toggles locale + URL |
| 6 | Build/lint clean | Cited above, including 2 real bugs caught and fixed |
| 7 | CDP: root=vi unprefixed, switch→`/en`, nav preserves prefix, 0 errors | Cited above, exact JSON |
| 8 | Nav tab labels / per-page content NOT translated | `app.config.ts` untouched (confirmed via `git status` below); no other theme files touched |

## Noticed, not done
- Per-page content translation is a real, sizeable follow-up: every
  `themes/portfolio-dev/pages/{resumeObject,projects,blogs,post,contact,
  github}/` file has static prose (e.g. `pages/blogs/index.vue`'s
  `useSeoMeta` title/description, `post/Detail.vue`'s "Tags"/"Back to the
  blog", the new `post/Comments.vue`'s "Giscus chưa được cấu hình"). Not
  attempted here — would multiply this node's diff size well past
  `SmallestDiff`, and each page needs its own CDP pass to verify text
  actually swaps. Worth one follow-up node per page-content folder, or
  one combined node if the operator prefers a single larger pass.
- `useSeoMeta`/`<html lang>` (`app.head.htmlAttrs.lang: 'vi'` in
  `nuxt.config.ts`) still hardcodes `'vi'` regardless of active locale —
  `@nuxtjs/i18n` can set this automatically via its SEO helpers
  (`useLocaleHead()`), not wired in this foundation pass; a real (minor)
  gap if a follow-up node is picked up, not something this node's
  acceptance criteria required.
- `npm audit` independently re-checked both sides: `git stash` (this
  diff's `package.json`/`package-lock.json` removed) → baseline `55
  vulnerabilities (4 low, 9 moderate, 36 high, 6 critical)`; `git stash
  pop` (this diff restored) → `52 vulnerabilities (4 low, 8 moderate, 34
  high, 6 critical)` — this diff does NOT introduce new vulnerabilities;
  the count is actually slightly lower (likely dependency deduping from
  the `10.x`→`9.5.6` downgrade's `npm install`). Did not run `npm audit
  fix`/`--force` — pre-existing transitive-tree advisories are outside
  this node's scope, and `--force` can introduce breaking version bumps
  unrelated to i18n.

## Seal gate
None — no outward-facing action (no commit/push/PR) in this implementer
pass.
