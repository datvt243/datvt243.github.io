# 2026-08-16 — centralize-color-tokens (plan)

- Worker: implementer
- Version: 0.1.0
- Node: `haven/diagrams/dev-loop.prime-mermaid.md` → `centralize-color-tokens`
- Task (verbatim): "can you split out the color code declarations into one
  place, e.g. settings-colors-theme, so the user can edit it themselves, or
  when given a color reference image Claude can swap it quickly"

## Process note (honest, not hidden)
This node was created AFTER the file had already been `git mv`'d (the real
sequence of actions: asked the operator 2 clarifying questions via
AskUserQuestion first → got answers → `git mv` → only then came back to
write this node + plan note). `NodeBeforeCode` properly requires the node
to exist BEFORE touching any file. Recording that honestly here instead of
pretending the order was correct — no real impact (the rename didn't
change any value, build/lint verification still ran in full before
sealing) but it's a real process slip.

## Current state (read before writing)
- Before the change: `themes/portfolio-dev/tokens/dark.css` +
  `themes/portfolio-dev/tokens/light.css` — 2 RGB-triplet files
  (`--theme-x: R G B`), imported by `themes/portfolio-dev/tokens.css` via
  `@import './tokens/dark.css'` + `@import './tokens/light.css'`.
- `tailwind.config.js` reads the value via
  `rgb(var(--theme-x) / <alpha-value>)` — the value MUST be an RGB triplet
  separated by spaces (not hex) for `<alpha-value>` to work with Tailwind's
  opacity modifier (`bg-theme-panel/50`, used in many places: `Panel.vue`,
  `Header.vue`, `PostCategories.vue`, `NavItem.vue`...). The operator
  confirmed via AskUserQuestion: keep the RGB triplet, don't switch to hex.
- The operator chose: rename the `tokens/` folder → `settings-colors-theme/`
  (not switching to a single JSON/TS file + a new build step — that would
  exceed `SmallestDiff`, needs its own design/testing).
- References to the `tokens/dark.css`/`tokens/light.css`/`tokens/<name>.css`
  path live in: `themes/portfolio-dev/tokens.css` (2 `@import` lines + 2
  comment lines), `nuxt.config.ts` (1 comment line), root `CLAUDE.md` (the
  "Color mode (light/dark)" section). The aggregator file itself
  `themes/portfolio-dev/tokens.css` KEEPS its name (unchanged) since
  `nuxt.config.ts:66` references `~/themes/${ACTIVE_THEME}/tokens.css`
  directly — renaming that file would touch real running code, outside
  the scope the operator chose (they only chose to rename the subfolder).

## Plan (smallest diff)
1. `git mv themes/portfolio-dev/tokens/dark.css themes/portfolio-dev/settings-colors-theme/dark.css`
2. `git mv themes/portfolio-dev/tokens/light.css themes/portfolio-dev/settings-colors-theme/light.css`
3. `themes/portfolio-dev/tokens.css`: update the 2 `@import` lines + related comments.
4. `nuxt.config.ts`: update 1 comment line (don't touch the real `css: [...]` code line, that path still points at `tokens.css` unchanged).
5. Root `CLAUDE.md`'s "Color mode (light/dark)" section: update the
   `tokens/` → `settings-colors-theme/` path, add a sentence stating
   clearly this is "the only place you need to edit to repalette" (directly
   answers the "so the user can edit it, or Claude can edit it quickly with
   an image" intent — now there's a sentence in `CLAUDE.md` saying plainly
   "this is the place" instead of needing to infer it).

## Acceptance criteria
| # | Criterion |
|---|---|
| 1 | `themes/portfolio-dev/tokens/` no longer exists |
| 2 | `themes/portfolio-dev/settings-colors-theme/dark.css` + `light.css` exist, content identical to the originals (rename only, no value changes) |
| 3 | `npm run build` clean (proves the `@import` resolves correctly) |
| 4 | `npm run lint` clean |
| 5 | The real built CSS output contains the correct `--theme-canvas`/`--theme-editor` values for both `.dark` and `.light` — no token lost during the rename |
| 6 | No remaining references to the old `tokens/dark.css`/`tokens/light.css`/`tokens/<name>.css` path in code/docs (except `agent-hub/evidence/`, `agent-hub/histories/` — history, not edited) |

## Files
- `themes/portfolio-dev/tokens/dark.css` → `themes/portfolio-dev/settings-colors-theme/dark.css` (rename)
- `themes/portfolio-dev/tokens/light.css` → `themes/portfolio-dev/settings-colors-theme/light.css` (rename)
- `themes/portfolio-dev/tokens.css`
- `nuxt.config.ts`
- `CLAUDE.md` (root)
- `agent-hub/haven/diagrams/dev-loop.prime-mermaid.md` (new node)

## Blocked by
None.
