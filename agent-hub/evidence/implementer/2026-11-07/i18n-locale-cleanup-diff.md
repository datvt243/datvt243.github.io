# 2026-11-07 - i18n-locale-cleanup (diff)
- Worker: implementer · Version: 0.1.0
- Node: `i18n-locale-cleanup` (`haven/diagrams/dev-loop.prime-mermaid.md`)
- Task (verbatim): `/todo #424 + #417, #418, #426, gom lại fix chung nếu có thể` — branch `bug/424`; the PR closes all four issues.
- Status: `sealed_pending_verifier`

## Hub bytes before
94008

## Feature doc
`agent-hub/doctrine/features/i18n-language-switch.md` (Behavior #1, #4, #6; OQ1, OQ3) + `agent-hub/doctrine/features/error-page.md` (OQ4). Not edited — the fix restores the documented behavior.

## Diff
| File | Why |
|---|---|
| `themes/portfolio-dev/pages/resumeObject/Index.vue` | `_contact.ts` → `:to="localePath('/contact')"` (#417, #424) |
| `themes/portfolio-dev/components/PostCategories.vue` | category link via `localePath` (#424); aria-label → `t('blogs.viewCategory', { name })` (#426) |
| `themes/portfolio-dev/pages/post/Detail.vue` | "Back to the blog" → `:to="localePath('/blogs')"` (#424) |
| `error.vue` | `useLocaleHead()` + `useHead` sets `<html lang>`, which app.vue normally does (#418); one `//` why-comment |
| `components/ListRender.vue` | "loading ..." / "No data" → `t('list.loading')` / `t('list.noData')` (#426) |
| `themes/portfolio-dev/components/FilterFolder.vue` | adds `useI18n`; aria-label → `t('a11y.clearFilters')` (#426) |
| `themes/portfolio-dev/pages/contact/Index.vue` | mail subject → `t('contact.mailSubject', { name: form.name \|\| t('contact.mailSomeone') })` (#426) |
| `i18n/locales/{vi,en}.json` | new keys `blogs.viewCategory`, `contact.mailSubject`, `contact.mailSomeone`, `a11y.clearFilters`, `list.loading`, `list.noData` (additions only) |

Code diff (components/themes/error.vue, 134 lines): `git diff staging -- components themes error.vue i18n`.

## Command
Repo root, Node v24.19.0 (`nvm use 24`, lint needs it — PROJECT.md trap). From `doctrine/MEMORY.md`: `npm run build`, `npm run lint`, `npx nuxi typecheck`, `npm test`. Typecheck row is a standalone command → run.

## Output
```
npm run build → exit 0
◆ ✨ Build complete in 14.8s!
(grep -iE '\berror\b' build.log → 2 lines, both file names: .output/server/chunks/_/error-template.mjs, .output/server/chunks/build/error-DhXKUbjL.mjs)

npm run lint
> nuxt-app@1.13.0 lint
> eslint .
lint exit 0

npx nuxi typecheck
ℹ Nuxt Icon server bundle mode is set to local
[nuxt:icon] ✔ Nuxt Icon discovered local-installed 3 collections: fe, grommet-icons, heroicons
tc exit 0

npm test
 Test Files  10 passed (10)
      Tests  27 passed (27)
test exit 0
```

## Runtime check (SSR + real browser)
Prod build `node .output/server/index.mjs`, `PORT=4188`, `NODE_API` + `NUXT_PUBLIC_NODE_API` = mock `http://127.0.0.1:4199` (`scratchpad/scripts/mock.mjs`, serves a snapshot of prod `/api/resume?lang=en` for every `/api/me/*`). Mock log: `GET /api/me/votan.it@gmail.com?lang=en`, `…?lang=vi`; `grep -c onrender srv.log` → `0`. Blog pages call the separate public blog API (hard-coded, not the resume backend).
```
[1a] curl /en | grep -oE 'href="[^"]*contact[^"]*"'   → href="/en/contact"
[1b] curl /    | same                                   → href="/contact"
[1c] curl /en/blogs | grep -oE '<a [^>]*aria-label="View posts tagged Vue"'
     → <a aria-current="page" href="/en/blogs?category=vue" … aria-label="View posts tagged Vue"
[1d] curl /blogs → href="/blogs?category=javascript", href="/blogs?category=vue"; aria-label="Xem bài viết gắn thẻ Vue"
[1e] curl /en/blogs/67123bdf9c6e9bcf4f7bf006 → <a href="/en/blogs" … aria-label="Back to the blog"
[1f] curl /blogs/67123bdf9c6e9bcf4f7bf006    → <a href="/blogs" … aria-label="Quay lại blog"
[2]  curl -H 'Accept: text/html' /en/does-not-exist | grep -o '<html[^>]*lang="[^"]*"' → <html  lang="en-US"
     curl -H 'Accept: text/html' /does-not-exist    | same                             → <html  lang="vi-VN"
     /en/does-not-exist h1 → This page doesn&#39;t exist
```
Browser (Chrome CDP :9888 via Playwright, `visibilityState` = `visible`), real clicks:
```
{"visibility":"visible","afterContactClick":"http://localhost:4188/en/contact","contactLang":"en-US",
 "/en/projects":["Clear filters"],"/projects":["Xóa bộ lọc"],
 "afterCategoryClick":"http://localhost:4188/en/blogs?category=vue"}
```
Console: 1 entry, `Could not establish connection. Receiving end does not exist.` (Chrome extension message, not the app).

## Acceptance
| Criterion | Evidence |
|---|---|
| (1) `/en` internal links keep the locale; `/` unprefixed (Behavior #1) | [1a]–[1f] above; browser clicks land on `/en/contact` and `/en/blogs?category=vue` |
| (2) error page `lang` en-US / vi-VN (Behavior #6, error-page OQ4) | [2]: `<html  lang="en-US"` / `<html  lang="vi-VN"` |
| (3) 0 hard-coded strings left, keys in vi + en (Behavior #4) | `grep -rnE "loading \.\.\.\|No data\|Clear filters\|View posts tagged\|Portfolio contact from" components themes` → no output, exit 1; all 6 keys printed from both JSONs (e.g. `vi a11y.clearFilters = "Xóa bộ lọc"`, `en list.noData = "No data"`); browser shows "Clear filters" / "Xóa bộ lọc" |
| (4) build + lint + typecheck + test clean | Output block: build exit 0, lint exit 0, tc exit 0, `Tests  27 passed (27)` |
| comments per code-comments.md | 1 comment added (`error.vue`): a single `//` sentence giving the WHY (error.vue replaces app.vue), no issue refs |

## Supersedes
none (grep `#424|#417|#418|#426` in the active diagram → only this row).

## Still open
none.

## Noticed, not done
- Mail subject (`contact/Index.vue`) is only checked via the key + template; the `mailto:` hand-off can't be observed from Playwright. Strings: `en` "Portfolio contact from {name}" / "someone", `vi` "Liên hệ từ portfolio: {name}" / "một người bạn".
- Every category link gets `aria-current="page"` on `/blogs` and `/en/blogs` alike (2 each) — vue-router's exact-active ignores the query. Was like this before the diff; not in scope.
- `post/Item.vue` post links use a relative `getURL` and already keep `/en` (feature doc OQ1) — left as is.
- Prod `https://resume-nuxt-vert.vercel.app/api/resume?lang=vi` returned `FUNCTION_INVOCATION_FAILED` (`x-vercel-cache: MISS`) at 2026-11-07 ~16:12 local while snapshotting; `?lang=en` was `STALE`. Unrelated to this diff — worth a look.

## Seal gate
none — no commit/push/delete in this pass.
