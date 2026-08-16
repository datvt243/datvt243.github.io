# 2026-08-16 — light-theme-elevation (diff)

- Worker: implementer
- Version: 0.1.0
- Node: `haven/diagrams/dev-loop.prime-mermaid.md` → `light-theme-elevation`
- Task (verbatim): "Light theme: set --theme-canvas (page background) to
  pure white (255 255 255), and make header/footer and the editor
  (ThemePanel component) have a background color visibly different from
  that white — the editor (ThemePanel) specifically needs to stand out
  more than header/footer, not just a slight color difference."

## Diff
| File | Why |
|---|---|
| `themes/portfolio-dev/tokens/light.css` | `--theme-canvas` → pure white `255 255 255`. Added a new token `--theme-editor: 226 232 240` (reusing the exact old slate-200 canvas value) instead of changing `--theme-panel` — `--theme-panel` is used widely beyond header/footer (icon bg, badge, project card...), changing it would exceed this task's scope |
| `themes/portfolio-dev/tokens/dark.css` | Added `--theme-editor: 2 6 23` = exactly the current dark `--theme-canvas` value, so dark mode's visual is NOT changed (the task only mentions light theme) |
| `tailwind.config.js` | Mapped `theme.editor` → `themeColor('--theme-editor')`, following the same pattern as the other tokens (`canvas`, `panel`, `panel-subtle`) |
| `themes/portfolio-dev/components/Panel.vue` | The outer wrapper (`<ThemePanel>`, the editor shell) got `bg-theme-editor shadow-md` added — its own background + a shadow so it stands out more clearly than `ThemeHeader`/`ThemeFooter` (which only have `bg-theme-panel`, no shadow) |

## Command
```
npm run build
```
```
npm run lint
```

## Output
`npm run build` — verbatim tail (no errors, ends with):
```
Σ Total size: 27.4 MB (10 MB gzip)
[nitro] ✔ You can preview this build using node .output/server/index.mjs
```

`npm run lint` — verbatim tail:
```
✖ 34 problems (0 errors, 34 warnings)
```
These 34 warnings are pre-existing, not from any of the 5 files changed
above (checked — none of the files in `## Diff` appear in the warning
list).

## Browser verification
Chrome CDP port 9888 (already running, no new instance launched), connected
via `puppeteer-core`, navigated to `http://localhost:3000/` (dev server
started specifically for this check). `<html>` already had the class
`light` on load — no need to click the toggle. Read computed style via
`page.evaluate`:

```json
{
  "body":   { "bg": "rgb(255, 255, 255)", "shadow": "none",
              "border": "rgb(229, 231, 235)" },
  "header": { "bg": "rgb(248, 250, 252)", "shadow": "none",
              "border": "rgb(226, 232, 240)" },
  "footer": { "bg": "rgb(248, 250, 252)", "shadow": "none",
              "border": "rgb(234, 88, 12)" },
  "panel":  { "bg": "rgb(226, 232, 240)",
              "shadow": "rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.1) 0px 2px 4px -2px",
              "border": "rgb(226, 232, 240)" }
}
```
Screenshot taken at the same time (homepage, default viewport) saved for
this session (not committed to the repo — not an asset worth keeping
long-term); description: the header bar has a flat, near-white-grey
background, no shadow; the "editor" block (file-tree sidebar
"PERSONAL-INFO" + content) has a clearly grey background (`rgb(226, 232,
240)`) with a soft drop-shadow, standing out clearly against the page's
white background.

## Acceptance
| # | Criterion | Evidence |
|---|---|---|
| 1 | `.light` → `--theme-canvas` = `255 255 255` | `themes/portfolio-dev/tokens/light.css` diff; confirmed at runtime: `body.bg = "rgb(255, 255, 255)"` above |
| 2 | `npm run build` clean | `[nitro] ✔ You can preview this build using node .output/server/index.mjs`, no error line in the full output |
| 3 | `npm run lint` clean | `✖ 34 problems (0 errors, 34 warnings)` — 0 errors |
| 4 | Computed bg of `<body>` = white | cited above |
| 5 | header/footer bg ≠ white and ≠ panel bg | header/footer = `rgb(248, 250, 252)`; panel = `rgb(226, 232, 240)`; canvas = `rgb(255, 255, 255)` — all 3 values differ |
| 6 | Panel has a bg different from header/footer AND has a box-shadow (header/footer don't) | panel's `shadow` has a real value (`0px 4px 6px -1px rgba(0,0,0,0.1)...`); header/footer `shadow: "none"` |

## Noticed, not done
- `--theme-panel` (`248 250 252`, slate-50) only differs from
  `--theme-canvas` (`255 255 255`) by a small RGB gap (~7 units) —
  numerically it really is "a different color", and the screenshot shows a
  `border-b`/`border-t-2 border-theme-accent` (orange) border making the
  boundary clear, but if the operator feels it's still not distinct
  enough, `--theme-panel` could be bumped up to `241 245 249` (slate-100)
  as a separate task/node — NOT done here since `--theme-panel` is used
  broadly beyond header/footer (see the Diff table), changing it would
  exceed `SmallestDiff` for this task.
- The dev server (`npm run dev`) was started specifically for this
  verification step, running in the background (log: a process outside
  the implementer session) — not an outward-facing action, no seal gate
  needed, but the operator may want to stop it after reviewing.

## Seal gate
None — no outward-facing action (no commit/push/delete/PR) in this
implementer pass.
