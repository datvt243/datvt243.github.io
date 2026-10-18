# 2026-10-18 - vim-key-nav-page-shortcuts (implementer plan)

- Worker: implementer · Version: 0.1.0
- Node: `vim-key-nav-page-shortcuts` (new row appended at the end of the PM status table, IN_PROGRESS)
- Issue: #236 (follow-up) · Branch: `feature/236`
- Task (verbatim): "bổ sung cho nút Contact, Download. phần persional-info (5 mục). đồng nhất lại màu sắc"
- Operator decisions (AskUserQuestion): keys "c, d, 1–5 (Recommended)"; badge color "Cam accent (Recommended)".

## Hub bytes before: 152152
Measured after the node row was appended.

## Design
- **Page shortcuts are declared in markup, so there's no registry.** An element opts in with `data-shortcut="<key>"` (plus `data-shortcut-label`). `KeyNav` already owns the guarded `keydown` handler. When a single key isn't one of its own bindings, it looks for a *visible* `[data-shortcut="<key>"]` and does `focus()` then `click()`. `focus` scrolls the target into view; `click` is a no-op on a disabled button. Any page or theme component can then add shortcuts with no new JS.
- **The help overlay** gathers the visible `[data-shortcut]` elements each time it opens, and shows them in an "On this page" section when there are any.
- **One color:** `<ThemeKbd>` (new `themes/portfolio-dev/components/Kbd.vue`) is the only shortcut badge. It uses a new `--theme-kbd` token, an orange equal to `--theme-accent` per mode, defined in `dark.css` and `light.css` and wired up in `tailwind.config.js`. A separate token is needed because `editor-dracula.css` changes `--theme-accent` to purple inside `<ThemePanel>`, which would turn the file-tree badges purple. Dracula doesn't override `--theme-kbd`, so it stays orange everywhere.

## Code anchors
- `themes/portfolio-dev/pages/resumeObject/Hero.vue`: contact `<a>` (`c`) and download `<button>` (`d`).
- `themes/portfolio-dev/pages/resumeObject/Index.vue`: the `sections` loop over `ThemeNavItem` (`1`–`5`). NavItem's root is a `<button>`, so attrs fall through.
- `themes/portfolio-dev/components/KeyNav.vue`: the dispatch fallback and the overlay section, which switch to `ThemeKbd`.
- `themes/portfolio-dev/layout/Header.vue`: the tab badges and the `?` button switch to `ThemeKbd`.
- `i18n/locales/{en,vi}.json`: `keyNav.onThisPage`.
