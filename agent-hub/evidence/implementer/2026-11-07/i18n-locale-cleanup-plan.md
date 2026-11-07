# 2026-11-07 - i18n-locale-cleanup (plan)
- Worker: implementer · Version: 0.1.0
- Node: `i18n-locale-cleanup` (`haven/diagrams/dev-loop.prime-mermaid.md`, new row — no existing row for #424/#417/#418/#426; slug not in the archive)
- Task: `/todo #424 + #417, #418, #426, gom lại fix chung nếu có thể` — fix the four i18n bugs together on `bug/424`.

## Hub bytes before
94008

## Feature doc
`agent-hub/doctrine/features/i18n-language-switch.md` (Behavior #1, #4, #6; OQ1 → #424/#417, OQ3 → #426) and `agent-hub/doctrine/features/error-page.md` (OQ4 → #418). Both `verified`; all relevant open questions answered "Bug" by the operator. The fix restores documented behavior — no doc edit.

## Code anchors (grep, real paths)
- `themes/portfolio-dev/pages/resumeObject/Index.vue:93` — `to="/contact"` (#417)
- `themes/portfolio-dev/components/PostCategories.vue:29-30` — `/blogs?category=` link + English aria-label (#424, #426)
- `themes/portfolio-dev/pages/post/Detail.vue:67` — `to="/blogs"` (#424)
- `error.vue` — no `useLocaleHead` (#418)
- `components/ListRender.vue:40,47` — "loading ...", "No data" (#426)
- `themes/portfolio-dev/components/FilterFolder.vue:46` — "Clear filters" (#426)
- `themes/portfolio-dev/pages/contact/Index.vue:16` — mail subject (#426)
- `i18n/locales/{vi,en}.json` — new keys

## Acceptance
See the node row (4 criteria). Self-check (pick_next step 5): each criterion has a command + pass condition and points at the anchors above.
