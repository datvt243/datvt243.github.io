# 2026-08-16 — light-theme-elevation (plan)

- Worker: implementer
- Version: 0.1.0
- Node: `haven/diagrams/dev-loop.prime-mermaid.md` → `light-theme-elevation`
- Task (verbatim): "Light theme: set --theme-canvas (page background) to
  pure white (255 255 255), and make header/footer and the editor
  (ThemePanel component) have a background color visibly different from
  that white — the editor (ThemePanel) specifically needs to stand out
  more than header/footer, not just a slight color difference."

## Current state (read before writing)
- `themes/portfolio-dev/tokens/light.css`: `--theme-canvas: 226 232 240`
  (slate-200, grey), `--theme-panel: 248 250 252` (slate-50, used by
  `ThemeHeader`/`ThemeFooter` via `bg-theme-panel`), `--theme-panel-subtle:
  241 245 249` (slate-100, used broadly for hover/active states:
  `PostCategories`, `NavItem`, `projects/Index`, `contact/Index`,
  `resumeObject/Index`).
- `themes/portfolio-dev/components/Panel.vue` (tag `<ThemePanel>`, the
  "editor" shell used in `resumeObject/Index.vue`, `github/Index.vue`,
  `projects/Index.vue`, `contact/Index.vue`): the outer wrapper has NO bg
  of its own (transparent, shows the canvas color), only `aside`/`filetab`
  have `bg-theme-panel/50` and `/30` (translucent, layered over canvas).
- `--theme-panel` is used WIDELY in other components beyond header/footer
  (icon bg in `Hero.vue`, badge in `CornerFrame.vue`, project card in
  `projects/Index.vue`) → changing `--theme-panel`'s value would leak
  outside scope (`SmallestDiff` risk). Decision: do NOT change
  `--theme-panel`/`-subtle`, only add a new token `--theme-editor`
  dedicated to `ThemePanel`.

## Plan (smallest diff)
1. `themes/portfolio-dev/tokens/light.css`: `--theme-canvas` → `255 255
   255` (pure white). Add `--theme-editor: 226 232 240` (reusing the exact
   old slate-200 canvas value — already proven to look fine in the prior
   version — as a dedicated, more prominent background for the editor).
2. `themes/portfolio-dev/tokens/dark.css`: add `--theme-editor: 2 6 23`
   (exactly equal to the current dark `--theme-canvas`) so dark mode's
   visual is NOT changed — out of this task's scope (the task only
   mentions "light theme").
3. `tailwind.config.js`: map `theme.editor` → `themeColor('--theme-editor')`
   following the same pattern as the other tokens.
4. `themes/portfolio-dev/components/Panel.vue`: add `bg-theme-editor
   shadow-md` to the outer wrapper for its own background + a clearer lift
   (elevation) than header/footer (which only have `bg-theme-panel`, no
   shadow).

## Acceptance criteria
| # | Criterion |
|---|---|
| 1 | `.light` → `--theme-canvas` = `255 255 255` |
| 2 | `npm run build` clean (read the output back) |
| 3 | `npm run lint` clean (read the output back) |
| 4 | Chrome CDP, light mode: computed `background-color` of `<body>` = `rgb(255, 255, 255)` |
| 5 | Chrome CDP, light mode: computed bg of `ThemeHeader`/`ThemeFooter` ≠ white and ≠ `ThemePanel`'s bg |
| 6 | Chrome CDP, light mode: `ThemePanel` has a bg different from `ThemeHeader`/`ThemeFooter` AND has a `box-shadow` (header/footer don't) — proving it "stands out more" |

## Files
- `themes/portfolio-dev/tokens/light.css`
- `themes/portfolio-dev/tokens/dark.css`
- `tailwind.config.js`
- `themes/portfolio-dev/components/Panel.vue`

## Blocked by
None — no new env var needed, no server API touched.
