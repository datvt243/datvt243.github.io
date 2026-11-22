# 2026-11-22 - error-retry-on-404 (plan)
- Worker: implementer · Version: 0.1.0
- Node: `error-retry-on-404` in `haven/diagrams/dev-loop.prime-mermaid.md`
- Task: "#428 Error page: add \"Try again\" on 404 too — Problem: The 404 page only has \"Go to the homepage\"; \"Try again\" (full reload) is shown for other codes only. Expected: 404 also shows \"Try again\" (full page reload), next to the homepage button. Decided by the operator while confirming agent-hub/doctrine/features/error-page.md (2026-11-07)."

## Hub bytes before: 93594
## Feature doc: doctrine/features/error-page.md (verified; Open question 2 answered "Change: add it on 404 too — #428", no unanswered question)

## Acceptance (copied onto the node)
1. `/does-not-exist` → 404, HTML contains "Thử lại" + "Về trang chủ"; `/en/does-not-exist` contains "Try again" + "Go to the homepage".
2. Clicking "Try again" on the 404 page fully reloads the same URL (browser check).
3. `features/error-page.md` Behavior #2 + Changelog reflect the change (operator's OQ2 answer authorizes it).
4. build + lint + typecheck + `npm test` clean.

## Files
- `error.vue:41` — `v-if="!isNotFound"` on the retry button; remove it. `error.retry` key already exists in both locales (`i18n/locales/{vi,en}.json:114`).
- `agent-hub/doctrine/features/error-page.md` — Behavior #2, Changelog.
