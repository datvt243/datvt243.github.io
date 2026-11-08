# 2026-11-08 - github-page-fixes (plan)
- Worker: implementer · Version: 0.1.0
- Node: `github-page-fixes` in `haven/diagrams/dev-loop.prime-mermaid.md`
- Task: "#436 GitHub page: fix "no data" check, case-insensitive search, locale dates, empty state, new-tab profile link" (issue body: `||` → `&&` in GitUser.vue; case-insensitive search; date by current locale; localized "no repositories match" state; profile link opens in a new tab with `noopener noreferrer`)

## Hub bytes before: 94004

## Feature doc: doctrine/features/github-profile.md
All 5 items are the operator's answers to its Open questions 1-5 (2026-11-07), so the doc's Behavior #4/#6/#7 get updated with the diff (Changelog row).

## Anchors
- `themes/portfolio-dev/pages/github/GitUser.vue:25` (`||`), `:30-33` (profile link, no target)
- `themes/portfolio-dev/pages/github/GitRepos.vue:20` (case-sensitive `includes`), `:49-55` (no empty state)
- `themes/portfolio-dev/pages/github/part/Item.vue:45-47` (`'en-US'` pinned)
- `i18n/locales/{vi,en}.json` `github.*` — new key for the empty state
- `nuxt.config.ts:94-95` locale `language` = `vi-VN` / `en-US` → read via `useI18n().localeProperties`

## Acceptance criteria clarified: none (the node's criteria were written measurable from the start)
