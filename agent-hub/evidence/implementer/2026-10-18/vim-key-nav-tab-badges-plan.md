# 2026-10-18 - vim-key-nav-tab-badges (implementer plan)

- Worker: implementer · Version: 0.1.0
- Node: `vim-key-nav-tab-badges` (new row appended at the end of the PM status table, IN_PROGRESS)
- Issue: #236 (follow-up) · Branch: `feature/236`
- Task (verbatim): "hãy thêm các badge  gr gp bên cạnh các text"

## Hub bytes before: 152157

## Reading of the task
"các text" means the header nav tab labels (`_resume`, `_projects`, …), which are the targets of `gr`/`gp`/…. Each one gets a badge with its shortcut.

## Acceptance
1. Each desktop nav tab, `_contact` included, shows a small `g<key>` badge next to its label. The key comes from `menuPrimary[].key`.
2. The badge has `aria-hidden="true\"`, so screen readers don't hear "g r" after each link name.
3. The mobile slideover is unchanged (no keyboard there).
4. The header still fits on one line at 1024px (lg) and 1280px, in light and dark. build, lint and typecheck are clean, and the change is checked in a real browser.

## Code anchors
- `themes/portfolio-dev/layout/Header.vue`: the two desktop `NuxtLink` loops (`mainTabs` and `contactTab`).
- The badge style reuses the `kbd` classes from the overlay and the `?` button, at a smaller size, so it doesn't compete with the label.
