# 2026-08-16 — editor-dracula-scope (diff)

- Worker: implementer
- Version: 0.1.0
- Node: `haven/diagrams/dev-loop.prime-mermaid.md` → `editor-dracula-scope`
- Task: see today's plan note for the full verbatim text (2 exchanges +
  an AskUserQuestion confirming scope + a clarification about activation).

## Diff
| File | Why |
|---|---|
| `themes/portfolio-dev/settings-colors-theme/editor-dracula.css` (new) | 2 blocks, `.dark .editor-scope` / `.light .editor-scope`, each overriding all 25 tokens (`--theme-canvas/panel/panel-subtle/editor/border*/text*/muted/faint/accent*` + 10 `--theme-code-*`) — dark = 11 canonical Dracula colors + interpolation for roles without a dedicated color; light = a derived palette (Foreground↔Background swapped, each accent hue darkened) |
| `themes/portfolio-dev/tokens.css` | Added `@import './settings-colors-theme/editor-dracula.css'` (3rd line) + a comment explaining this is a scoped override, not a 3rd mode |
| `themes/portfolio-dev/components/Panel.vue` | Added the class `editor-scope` to the root `<div>` — this is the ONLY place that wraps all editor content (audited: every usage of `ThemeFolder`/`ThemeNavItem`/`ThemeFilterFolder`/`ThemePostCategories`/`ThemeCodeBlock` lives inside `<ThemePanel>`) |
| `CLAUDE.md` (root) | Added a paragraph explaining the scoped-override mechanism (class + CSS var inheritance) in the "Color mode" section |
| `agent-hub/doctrine/domains/PROJECT.md` | Added 1 Decision row: Dracula only applies to the editor, rides the existing dark/light toggle, no 3rd mode/toggle added |

NOT changed: `Folder.vue`, `NavItem.vue`, `FilterFolder.vue`,
`CodeBlock.vue`, `PostCategories.vue`, `Experiences.vue`,
`utils/tsCodeLines.ts`, `utils/jsonCodeLines.ts` — exactly as planned (the
CSS variable inheritance mechanism made 0 changes to these files
possible).

## Command
```
npm run build
```
```
npm run lint
```

## Output
`npm run build` — 1st run failed (UNRELATED to this diff): `RollupError:
.nuxt/dist/server/client.manifest.mjs (1:148): A numeric separator is only
allowed between two digits` — the `.nuxt` artifact got corrupted/mixed
between 2 consecutive builds in the same session (not a real syntax error
in code, that file wasn't written by me). Handled per the known trap:
`rm -rf node_modules/.cache .nuxt .output` then rebuilt — fully clean:
```
Σ Total size: 26.4 MB (9.76 MB gzip)
[nitro] ✔ You can preview this build using node .output/server/index.mjs
```

`npm run lint` — verbatim tail:
```
✖ 34 problems (0 errors, 34 warnings)
```
Matches the baseline of every previous node, none of the files in
`## Diff` appear.

## Browser verification
Chrome CDP port 9888 (already running), a dev server started specifically
for this step (`nohup npm run dev` — killed once by a polling command's
timeout on the first attempt, restarted successfully on the 2nd). Connected
via `puppeteer-core`, read the real computed style in BOTH modes (by
clicking the real toggle button on the UI, not setting `localStorage` by
hand):

**Dark mode** (`<html class="dark">`):
```json
{
  "bodyBg": "rgb(2, 6, 23)",          // slate-950 — page did NOT change
  "headerBg": "rgb(15, 23, 42)",      // slate-900 — header did NOT change
  "editorBg": "rgb(40, 42, 54)",      // #282a36 Dracula Background — CORRECT
  "codeKeyword": "rgb(255, 121, 198)", // #ff79c6 Pink — CORRECT
  "codeType": "rgb(139, 233, 253)",    // #8be9fd Cyan — CORRECT
  "codeString": "rgb(241, 250, 140)",  // #f1fa8c Yellow — CORRECT
  "codeKey": "rgb(80, 250, 123)",      // #50fa7b Green — CORRECT
  "codeComment": "rgb(98, 114, 164)"   // #6272a4 Comment — CORRECT
}
```
**Light mode** (`<html class="light">`, real toggle click):
```json
{
  "bodyBg": "rgb(255, 255, 255)",     // page did NOT change
  "headerBg": "rgb(248, 250, 252)",   // slate-50 — header did NOT change
  "editorBg": "rgb(248, 248, 242)",   // #f8f8f2 — Dracula Foreground reused as the light background
  "codeKeyword": "rgb(219, 42, 142)", // Pink, darkened
  "codeType": "rgb(8, 145, 178)",     // Cyan, darkened
  "codeString": "rgb(122, 110, 20)",  // Yellow → darkened to olive
  "codeKey": "rgb(13, 138, 54)",      // Green, darkened
  "codePunct": "rgb(69, 78, 109)",
  "codeComment": "rgb(98, 114, 164)"  // Comment — identical to dark (works on both backgrounds)
}
```
Every value matches EXACTLY the token table defined in the new CSS file.
`bodyBg`/`headerBg` STAYED THE SAME between the before/after measurements —
confirming the scope does NOT leak outside `<ThemePanel>`.

3 real screenshots taken (`skills.ts` dark, `experiences.pug` light,
`skills.ts` light) — observed directly: in dark mode the editor has a
clearly purple-black Dracula background, distinctly different from the
site's usual blue-black header; in light mode the editor has a warm
off-white background, dark, readable syntax colors, header stays its
usual light grey, unchanged.

## Acceptance
| # | Criterion | Evidence |
|---|---|---|
| 1 | Header/footer/the page outside doesn't change | `bodyBg`/`headerBg` identical to the original values (dark slate-950/900, light white/slate-50) in both measurements |
| 2 | Dark mode = canonical Dracula | 5 hex values match the official Dracula spec verbatim via CDP |
| 3 | Light mode = a distinct, high-enough-contrast palette | The darkened values match the CSS file, clearly different from both Dracula dark AND the current light chrome (`248 250 252` slate-50) |
| 4 | No new toggle needed | Used the existing toggle button (clicked via CDP), no new UI added |
| 5 | Build/lint clean | Cited above |
| 6 | No child component was edited | `git status --short` confirms only the 5 files in `## Diff` + 1 new file changed, no Folder/NavItem/FilterFolder/CodeBlock/PostCategories/utils/*CodeLines.ts |

## Noticed, not done
- `projects/Index.vue` line 62 has a literal `text-blue-400` (pre-existing,
  not this node's bug) — it's INSIDE the editor scope so in dark mode it's
  still standard Tailwind blue-400 instead of Dracula Cyan/Purple. The
  user didn't report this, not fixing it myself — if "the whole editor
  should be 100% Dracula" is wanted, that's a separate task.
- `UBadge` (a Nuxt UI component, used in `projects/Index.vue` for tech
  tags) uses `@nuxt/ui`'s own theming (`app.config.ts`), doesn't go
  through `--theme-*` — won't automatically pick up Dracula. Out of scope
  (changing it would touch `app.config.ts`/Nuxt UI config, not a theme
  token).

## Seal gate
None — no outward-facing action in this implementer pass.
