# 2026-10-18 - vim-key-nav-hint (implementer plan)

- Worker: implementer · Version: 0.1.0
- Node: `vim-key-nav-hint` (new row appended at the end of the PM status table, IN_PROGRESS)
- Issue: #236 (follow-up) · Branch: `feature/236`
- Task (verbatim): "hãy show gì đó lên UI để user biết là có feature này"

## Hub bytes before: 150789

## pick_next
`vim-key-nav` is SEALED, so per LAI-13 this is a new node and the old one stays as it is. No env vars needed.

## Acceptance
1. A visible `?` button in the header, desktop only (`lg+`, where a keyboard exists), next to the locale and color-mode buttons, with a localized `aria-label`/`title`.
2. Clicking it opens the same help overlay that the `?` key opens.
3. The header looks the same otherwise. build, lint and typecheck are clean, and the change is checked in a real browser in light and dark.

## Code anchors
- `themes/portfolio-dev/layout/Header.vue` is always on screen; the footer is only visible at the bottom of the page. Header already renders `<ThemeKeyNav />`, so it can own the open state and pass it with `v-model`.
- `themes/portfolio-dev/components/KeyNav.vue`: `isHelpOpen` changes from a local `ref` to `defineModel`, so the header button and the `?` key toggle the same state.
- `i18n/locales/{en,vi}.json`: reuse `keyNav.title` for the button label. No new string needed.
