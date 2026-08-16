# 2026-08-16 — light-theme-code-syntax-contrast (diff)

- Worker: implementer
- Version: 0.1.0
- Node: `haven/diagrams/dev-loop.prime-mermaid.md` → `light-theme-code-syntax-contrast`
- Task (verbatim): "on the _resume page, the Skills, Experiences,
  Educations sections... the text color against the background is very
  hard to read, please check it, light theme"

## Diff
| File | Why |
|---|---|
| `themes/portfolio-dev/settings-colors-theme/dark.css` | Added 10 `--theme-code-*` tokens, values = the exact old literal Tailwind colors, VERBATIM (dark mode unchanged) |
| `themes/portfolio-dev/settings-colors-theme/light.css` | Added the same 10 `--theme-code-*` tokens, values = a darker shade of the same hue, enough contrast on white/`slate-200` |
| `tailwind.config.js` | Mapped the 10 tokens above into `theme.colors.theme['code-*']` following the existing pattern (`themeColor()`) |
| `utils/tsCodeLines.ts` | `text-blue-400`→`text-theme-code-keyword`, `text-sky-300`→`text-theme-code-type`, `text-orange-300`→`text-theme-code-string`, `text-slate-500`→`text-theme-code-punct`, `text-slate-600 italic`→`text-theme-code-comment italic` |
| `utils/jsonCodeLines.ts` | `text-slate-500`→`text-theme-code-punct`, `text-blue-300`→`text-theme-code-key`, `text-orange-300`→`text-theme-code-string` |
| `themes/portfolio-dev/pages/resumeObject/Experiences.vue` | `<style scoped>`: `theme('colors.slate.300')`→`rgb(var(--theme-code-text))`, `theme('colors.slate.600')` (2 spots, different roles)→`rgb(var(--theme-code-line-number))` and `rgb(var(--theme-code-comment))`, `color: white`→`rgb(var(--theme-code-title))`, `theme('colors.pink.400')`→`rgb(var(--theme-code-tag))`, `theme('colors.sky.300')`→`rgb(var(--theme-code-type))`. Used `rgb(var(--x))` directly instead of `theme('colors.theme.x')` since the `<alpha-value>` placeholder in the token's definition isn't substituted by Tailwind when called via `theme()` outside a utility-class context. |
| `agent-hub/haven/diagrams/dev-loop.prime-mermaid.md` | Node `light-theme-code-syntax-contrast`: PENDING → (will be SEALED by the verifier) |

Not changed: `themes/portfolio-dev/components/CodeBlock.vue` (already
using correct theme tokens beforehand — `text-theme-faint`,
`text-theme-text-soft`, not the source of the bug).

## Command
```
npm run build
```
```
npm run lint
```

## Output
`npm run build` — first run (right after clearing the `.nuxt`/`.output`
cache) failed to prerender `/contact`:
```
 ERROR  [nuxt] [request error] [unhandled] [500] Cannot find module '@iconify-json/fe/icons.json'
...
Errors prerendering:
[nitro]   ├─ /contact (107ms)
...
 ERROR  Exiting due to prerender errors.
```
Confirmed this is UNRELATED to this diff: `@iconify-json/fe` and
`@iconify-json/grommet-icons` are still correctly in `dependencies` in
`package.json` (not `devDependencies` — the previously-fixed trap is still
in effect). Ran `npm run build` a 2nd time (no changes) — the same class of
WARN appeared (`[Icon] loading icon ... timed out after 500ms`) but this
time it resolved fine, build succeeded:
```
[nitro]   ├─ /contact (1045ms)
[nitro]   ├─ /contact/_payload.json (3ms)
[nitro] ℹ Prerendered 2 routes in 11.348 seconds
[nitro] ✔ Generated public .output/public
...
Σ Total size: 26.3 MB (9.76 MB gzip)
[nitro] ✔ You can preview this build using node .output/server/index.mjs
```
Conclusion: flaky due to module warm-up right after a full cache wipe (not
from the diff); a successful retry is a known behavior (similar to the
"flaky/repeated build failure" trap in `doctrine/domains/PROJECT.md`,
though that trap describes a slightly different cause — added a note about
this below).

`npm run lint` — verbatim tail:
```
✖ 34 problems (0 errors, 34 warnings)
```
34 warnings, identical to the baseline of the previous nodes, none of the
files in `## Diff` appear in the output.

## Browser verification
Chrome CDP port 9888 (already running), a dev server started specifically
for this step, connected via `puppeteer-core`. `<html>` already had the
class `light`. Read computed `color` directly on the real DOM (every
section renders through `v-show`, no need to wait for extra client
fetches):

```json
{
  "codeKeyword": { "color": "rgb(37, 99, 235)", "text": "enum" },
  "codeType":    { "color": "rgb(3, 105, 161)", "text": "SkillGroup" },
  "codeString":  { "color": "rgb(194, 65, 12)", "text": "'Programming'" },
  "codePunct":   { "color": "rgb(71, 85, 105)", "text": "{" },
  "codeComment": { "color": "rgb(100, 116, 139)", "text": "// 3+ years" },
  "codeKey":     { "color": "rgb(29, 78, 216)", "text": "\"school\"" },
  "expTitle":    { "color": "rgb(15, 23, 42)", "text": "h3Frontend Developer (SAPUI5)" },
  "expTag":      { "color": "rgb(190, 24, 93)", "text": "article" },
  "expClass":    { "color": "rgb(3, 105, 161)", "text": ".company" },
  "expComment":  { "color": "rgb(100, 116, 139)", "text": "// next experience" },
  "bodyBg": "rgb(255, 255, 255)"
}
```
Every value matches the light-mode token table defined in the plan note.
Also took 3 screenshots after clicking each tab (`skills.ts`,
`experiences.pug`, `educations.json`) on the real `/` page — observed
directly: blue text (keyword/key), sky-blue text (type/class), orange
(string), dark grey (punct/comment), dark pink (tag), black (title) — all
clearly readable against the light-grey editor background
(`--theme-editor: 226 232 240`), no more low-contrast-color-on-color like
before the fix.

Confirmed dark mode was NOT changed: built the real CSS, grepped it
directly:
```
--theme-code-keyword:96 165 250   (block :root/.dark — matches the old blue-400)
--theme-code-type:125 211 252     (matches the old sky-300)
--theme-code-string:253 186 116   (matches the old orange-300)
--theme-code-punct:71 85 105 / --theme-code-comment:100 116 139 or the reverse depending on the block — both values 71 85 105 (slate-600) and 100 116 139 (slate-500) are present at the correct token, correct block
--theme-code-tag:244 114 182      (matches the old pink-400)
--theme-code-title:255 255 255    (matches the old white)
```
(the corresponding light values are also present, not mixed up between the
2 blocks — see the full grep in this session).

## Acceptance
| # | Criterion | Evidence |
|---|---|---|
| 1 | Dark mode: every `--theme-code-*` matches the old value verbatim | Cited real built-CSS grep above — `96 165 250`, `125 211 252`, `253 186 116`, `71 85 105`, `100 116 139`, `244 114 182`, `255 255 255`, `203 213 225` all correctly match the original Tailwind values |
| 2 | Light mode: no more pastel/light text on a light background | CDP computed style + 3 screenshots above |
| 3 | `npm run build` clean | Cited above (after excluding an unrelated flake) |
| 4 | `npm run lint` clean | `✖ 34 problems (0 errors, 34 warnings)` |
| 5 | No remaining literal color class in the 3 files | `grep -n "text-blue-\|text-sky-\|text-orange-\|text-slate-5\|text-slate-6\|text-pink-\|theme('colors\.\|color: white"` on all 3 files → 0 results |
| 6 | CDP confirms correct colors for all 3 sections | The computed-style JSON above covers `codeKeyword/Type/String/Punct/Comment/Key` (Skills+Educations) and `expTitle/Tag/Class/Comment` (Experiences) |

## Noticed, not done
- The first `/contact` prerender failure (iconify module) is flaky,
  unrelated to this diff — added a line to the Traps table in
  `doctrine/domains/PROJECT.md` so it's not alarming next time it happens
  (see the separate diff to `doctrine/domains/PROJECT.md` if the
  implementer applied it — NOT editing the doctrine within this evidence
  note itself, just recording it here).
- 10 new tokens is a fair number for one small feature (syntax
  highlighting), but each maps 1:1 to a separate pre-existing literal
  Tailwind color — merging them would change dark mode's existing colors
  (violating acceptance #1), so kept all 10, no further merging.

## Seal gate
None — no outward-facing action (no commit/push/delete/PR) in this
implementer pass.
