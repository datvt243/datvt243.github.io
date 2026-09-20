# 2026-09-20 — p2-polish-fixes-round2 (diff)

**Worker:** implementer
**Node:** `p2-polish-fixes-round2`

## Diff

| File | Why |
|---|---|
| `utils/themeBadgeUi.ts` (new) | Extracted the identical `techBadgeUi`/`topicBadgeUi` object (both files had byte-identical objects + identical explanatory comments) into one exported `accentBadgeUi` constant. |
| `utils/index.ts` | Added `export * from './themeBadgeUi'` to the existing barrel, matching how every other `utils/` file is re-exported. |
| `themes/portfolio-dev/pages/projects/Index.vue` | Removed its local `techBadgeUi` definition + comment, imports `accentBadgeUi` from `~/utils` instead, `:ui="accentBadgeUi"`. |
| `themes/portfolio-dev/pages/github/part/Item.vue` | Same: removed local `topicBadgeUi`, imports `accentBadgeUi`, `:ui="accentBadgeUi"`. |
| `components/ListRender.vue` | `bg-orange-800 bg-opacity-20 text-sky-500` → `bg-theme-panel-subtle text-theme-muted` on the "no data" empty state - reused existing neutral tokens rather than inventing a new "empty state" token, consistent with the prior `p2-polish-sweep` node's precedent of reusing existing tokens over adding new ones for a P2 item. |
| `themes/portfolio-dev/components/PostCategories.vue` | `text-red-400` → `text-theme-muted` on the fetch-error line. **Disclosed tradeoff**: no `--theme-danger`/error-red token exists anywhere in the theme (confirmed via grep - this was the only `text-red-*` usage in the entire codebase), and the issue explicitly asks to use an *existing* token, not invent one - so this loses the red "this is an error" visual signal. A real `--theme-danger` token pair would be the correct long-term fix if that distinction matters, same class of disclosed follow-up as `p2-polish-sweep`'s "no `--theme-success` token" note. Also added `const { t } = useI18n()` and replaced the raw `{{ error }}` object interpolation and the hardcoded `"No categories"` string with `t('blogs.categoriesLoadError')`/`t('blogs.noCategories')`. |
| `server/api/github.ts` | `getKey()` now returns `` `api-github-${user}` `` instead of `` `api-resume-${user}` ``. Functionally harmless (each `defineCachedEventHandler` is independently namespaced by its own `name` field, confirmed by reading the surrounding code) - a previously-cached entry under the old key just becomes orphaned, a fresh fetch happens under the new key. |
| `server/api/blogs/detail/[id].ts` | Added `sanitizeHtml(data.content)` (from the new `sanitize-html` dependency) right after `parseBlogApiResponse` succeeds, before the response is returned/cached. **Deliberate deviation from the issue's literal "dompurify" suggestion, disclosed**: plain `dompurify` requires a real DOM and isn't SSR-safe in a Node server context without an extra `jsdom` wrapper; `sanitize-html` is a pure-JS, Node-native sanitizer with no DOM dependency, and sanitizing once server-side (before caching) means the sanitized HTML is what gets cached and shipped, not re-sanitized per-request or duplicated between server/client - also avoids the exact class of SSR/CSR mismatch risk this same review session already hit once today (the GitHub-bio hydration bug in `p1-portfolio-review-fixes`). |
| `i18n/locales/vi.json`, `i18n/locales/en.json` | New `blogs.noCategories`/`blogs.categoriesLoadError` keys. |
| `package.json`, `package-lock.json` | Added `sanitize-html` (runtime dependency, used server-side) + `@types/sanitize-html` (dev dependency, for TS). |

## Command
```
npm run build
npm run lint
```

## Output

`npm run build` (verbatim tail):
```
[@nuxt/image]  WARN  sharp binaries for darwin-arm64 cannot be found. Please report this as a bug with a reproduction at https://github.com/nuxt/image.

[nitro] ✔ You can preview this build using node .output/server/index.mjs
│
└  ✨ Build complete!
```

`npm run lint` (verbatim):
```
✖ 13 problems (0 errors, 13 warnings)
```
Exact match to the current baseline (13 warnings, unchanged - same file/line set as before this diff, only shifted by one line in `PostCategories.vue` due to the new `useI18n()` line).

`npm install sanitize-html` / `npm install --save-dev @types/sanitize-html`: both exit 0, resolved `sanitize-html@2.17.7` + `@types/sanitize-html@2.16.1`. `npm audit` count after install: 15 vulnerabilities (2 moderate, 12 high, 1 critical) - all pre-existing (`sharp`/`tar-fs`, already documented in `DEPENDENCY-UPGRADE-PLAN.md`), none attributable to `sanitize-html` itself (not named anywhere in the audit output).

## Browser verification
Checked via Chrome CDP (port 9888, `puppeteer-core`) against a real `npm run dev` instance (port 4155).

- **`/projects`**: a real project's tech badge `className` confirmed to contain `text-theme-accent dark:text-theme-accent ring-1 ring-inset ring-theme-accent/40 dark:ring-theme-accent/40` - byte-identical visual output to before the refactor, now sourced from the shared constant.
- **`/github`**: a real repo's topic badge `className` confirmed identical to the projects badge's class list - same shared constant, same visual result.
- **`/blogs?category=__no_such_category__`** (forces the empty-result path): `.no-data` element confirmed present with `className: "no-data center p-8 bg-theme-panel-subtle text-theme-muted rounded"` - 0 literal Tailwind colors remaining.
- **`/blogs`** (real categories sidebar): raw HTML confirmed the real "categories" folder label renders (categories load successfully; neither the new `noCategories` nor `categoriesLoadError` string appears, confirming the happy path still works after adding `useI18n()` to the component).
- **Sanitize-html correctness, checked at 3 levels**:
  1. Raw API (`curl http://localhost:4155/api/blogs/detail/67123bdf9c6e9bcf4f7bf006`): content changed from the DB's raw `<h3 class="wp-block-heading" id="...">​<strong>...</strong></h3>` to `<h3><strong>...</strong></h3>` - `class`/`id` attributes stripped (not in `sanitize-html`'s default allowed-attributes list), the actual text and safe tags (`h3`, `strong`) preserved.
  2. Confirmed via `grep -rn "wp-block-heading"` across the whole repo (0 matches) that no CSS in this app ever targeted that WordPress-leftover class - so stripping it is not a visual regression, just removing dead markup the sanitizer doesn't allowlist.
  3. Real rendered page (`/blogs/67123bdf9c6e9bcf4f7bf006`): `.post-content h3` text content confirmed intact (`"1. Cài đặt iTerm2 có thể dùng thay cho Terminal mặc định của MacOS"`), 0 console/page errors.
- **Console errors across all pages checked**: `[]` (empty).

Scripts: `/private/tmp/claude-501/-Users--david-Workspace-Project-resume-datvt243-github-io/3010f9ae-4713-4cd2-8a1a-3217fd3407e6/scratchpad/verify-180{,b}.cjs` (scratch, not committed).

## Acceptance

| Criterion | Evidence |
|---|---|
| Badge UI de-duplicated, same visual output | CDP: identical `className` on both `/projects` and `/github` badges, sourced from `accentBadgeUi` |
| Literal colors replaced with existing tokens | CDP: `.no-data` `className` shows only `--theme-*`-backed classes; `PostCategories.vue`'s error line uses `text-theme-muted` |
| Cache key renamed | `server/api/github.ts` diff |
| Blog content sanitized server-side, no visual regression | Raw API + rendered-page checks above; `wp-block-heading` confirmed unused by any app CSS |
| i18n gaps closed | `PostCategories.vue`/locale file diffs; happy-path categories sidebar still renders correctly post-change |
| Build clean | `npm run build` tail: `✨ Build complete!`, only the pre-existing `sharp` warning |
| Lint clean, baseline unchanged | `npm run lint`: `✖ 13 problems (0 errors, 13 warnings)` |
| Real UI verified, 0 console errors | CDP scripts above |

## Noticed, not done
- `server/api/blogs/detail/[id].ts`'s own `defineCachedEventHandler` has `name: 'api-resume'` (also copy-paste residue, same class of bug as the `github.ts` one this issue explicitly asked to fix) - NOT fixed here, since issue #180 only named `server/api/github.ts`'s `getKey()`; flagged here as a legitimate follow-up rather than expanding this diff's scope unasked.
- `ListRender.vue`'s "No data" text and `.no-data`'s `uppercase` styling are still a hardcoded English literal, not run through `t()` - out of scope for issue #180 (which only named `PostCategories.vue`'s strings).

## Seal gate
None — no outward-facing action taken (no commit/push/PR). Working tree has the diff on branch `180-fix-5-p2-polish`, uncommitted, awaiting verifier then operator's own `/ship` step.
