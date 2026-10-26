# 2026-10-26 - error-states-retry (plan)

- Worker: implementer · Version: 0.1.0
- Node: `error-states-retry` (`haven/diagrams/dev-loop.prime-mermaid.md`, appended last row; slug grepped in both diagram files → 0 hits)
- Task: issue #286 "error states" (P1), branch `bug/286` off freshly pulled `staging` (`daec0c9`)

## Hub bytes before: 77940

## Findings re-checked on staging
- `pages/index.vue` raw `{{ error }}`: already gone (resume-isr-fallback, #282) — a resume failure now throws to `error.vue`. So the "502 → message + retry" criterion lands in `error.vue`.
- `components/ListRender.vue:30`: `status !== 'success'` covers `'error'` → loading forever. Only consumer: `themes/portfolio-dev/pages/blogs/Index.vue`.
- `composables/useDownloadResume.ts:33,57`: `isDisabled = true` on any failure, never reset. Consumers: `Hero.vue` (`:disabled`), `AboutMe.vue` (`downloadCvLine`).
- `error.vue`: same "great nothing" copy for 404 and 5xx, English only, `NuxtImg` without `alt`, home button ignores locale.

## Plan
1. `useDownloadResume`: delete `isDisabled` (and its two consumers' uses); only `isLoading` disables.
2. `ListRender`: `'error'` branch → `role="alert"` message + `UButton` retry emitting `retry`; blogs passes `@retry="refresh()"`.
3. `error.vue`: i18n copy per status (404 vs other), "Try again" (full reload) shown for non-404, home via `localePath('/')`, `alt=""` (decorative image).
4. New i18n `error.*` keys in en/vi.

## Acceptance criteria
1. Resume upstream failing on a cold server → `/` and `/en` show 502 with localized server-error copy + "Try again"; no raw error object; retry reloads the page.
2. 404 page: not-found copy, no retry button, home link keeps locale.
3. `/api/blogs/posts` failing client-side → blogs list shows error + retry; retry refetches.
4. Download fails once → button still enabled; second click fires a new request.
5. build / lint / typecheck clean; comments per code-comments.md.
