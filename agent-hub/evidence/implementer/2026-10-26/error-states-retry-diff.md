# 2026-10-26 - error-states-retry (diff)

- Worker: implementer · Version: 0.1.0
- Node: `error-states-retry` (`haven/diagrams/dev-loop.prime-mermaid.md`, last row)
- Task: issue #286, branch `bug/286` off `staging` daec0c9
- Status: `sealed_pending_verifier`

## Hub bytes before
77940

## Diff
| File | Why |
|---|---|
| `composables/useDownloadResume.ts` | `isDisabled` deleted: one failure (e.g. cold server) disabled the button for good. Only `isLoading` disables now; a `//` WHY line at the failure branch. |
| `themes/portfolio-dev/pages/resumeObject/Hero.vue` | `:disabled="isLoading"` (no `isDisabled`). |
| `themes/portfolio-dev/pages/resumeObject/AboutMe.vue` | Same for the Markdown download line; its `/** */` comment no longer says "or after a failure". |
| `components/ListRender.vue` | New `status === 'error'` branch before the loading branch: `role="alert"` message (`message` prop or `error.loadError`) + `UButton` "Try again" emitting `retry`. Before, `'error'` fell into the loading branch forever. |
| `themes/portfolio-dev/pages/blogs/Index.vue` | `@retry="refresh()"` (the only ListRender consumer). |
| `error.vue` | i18n copy per status (404 → not-found, else server error), "Try again" (full `location.reload()`, `//` WHY) for non-404, home via `localePath('/')`, `alt=""` on the decorative image. |
| `i18n/locales/{en,vi}.json` | New `error.*` block (7 keys each), pure additions. |
| `haven/diagrams/dev-loop.prime-mermaid.md` | Node row appended |

`pages/index.vue` raw `{{ error }}` from the issue was already removed by `resume-isr-fallback` (#282).

## Commands + output
```
npm run build → "◆ ✨ Build complete in 13.6s!", 1 WARN components-BKndnV3n.js (369:0) — pre-existing (same on base, see visit-tracker-proxy-diff.md)
npm run lint → rc=0
npx nuxi typecheck → 0 "error TS"
```

## Runtime (prod build :4142 → `scratchpad/p0/mock.cjs` :4199)
SSR with `Accept: text/html`, mock in `fail` mode:
```
/        502 Đã có lỗi phía máy chủ          | leak: False | retry: True  | home: ['Về trang chủ']
/en      502 Something went wrong on our side | leak: False | retry: True  | home: ['Go to the homepage']
/nope    404 Trang này không tồn tại          | leak: False | retry: False | home: ['Về trang chủ']
/en/nope 404 This page doesn't exist          | leak: False | retry: False | home: ['Go to the homepage']
img: <img ... alt src="/_ipx/_/error.png">  (empty alt)
```
(leak = "Unable to load"/"statusMessage" in the HTML outside `<script>`.)

Browser (CDP :9888, incognito, `scratchpad/p1/err-ui.cjs`):
```
fail:            { status 502, h1 "Something went wrong on our side", retry true }
afterRetry:      mock→ok, real click "Try again" → url /en, h1 "Võ Tấn Đạt"
notFound:        { status 404, h1 "This page doesn't exist", retry false }; click home → /en
blogsError:      /api/blogs/posts intercepted 500, client nav → { alert true, "Couldn't load this content.Try again" }
blogsAfterRetry: interception off, click retry → { alert false, items 4 }
download1:       /api/generate-pdf intercepted 500, click → { disabled false, calls 1 }
download2:       second click → { disabled false, calls 2 }
console errors: only the 502/404/500 resource lines caused by the test itself
```
Screenshots: `scratchpad/p1/e286-502-{1280,390}.png` (both buttons visible, wrap fine at 390).

## Acceptance
| Criterion | Evidence |
|---|---|
| 1. Upstream down → localized message + retry, no raw error | SSR table + fail/afterRetry |
| 2. 404 copy, no retry, locale-keeping home | SSR table + notFound/home |
| 3. Blog list error + retry | blogsError / blogsAfterRetry |
| 4. Download retry after a failure | download1/2 |
| 5. build/lint/typecheck; comments | above; two `//` WHY lines, one updated `/** */` |

## Noticed, not done
- `/api/blogs/posts` swallows upstream failures into an empty page (by design), so in production the blog error branch only appears when the site's own API is unreachable; the empty-blog case is #287.
- Statuses other than 404 (e.g. 400/403) get the server-error copy + retry; no route produces them today.
- Both error.vue buttons share the accent style (pre-existing button class reused).

## Seal gate
none (no commit/push/PR in this pass).
