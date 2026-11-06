# analyst — keyboard-navigation — 2026-11-07

## Task (verbatim)
document keyboard-navigation

## Doc
`agent-hub/doctrine/features/keyboard-navigation.md` (existing bulk-backfill draft, re-checked per recipe step 4, not rewritten)

## Sources read
- `agent-hub/haven/workers/analyst/SOUL.md`
- `agent-hub/haven/workers/analyst/recipes/spec_feature.md`
- `agent-hub/doctrine/features/INDEX.md`
- `agent-hub/doctrine/domains/PROJECT.md`
- `agent-hub/doctrine/MEMORY.md`
- `themes/portfolio-dev/components/KeyNav.vue`
- `themes/portfolio-dev/components/Kbd.vue`
- `themes/portfolio-dev/layout/Header.vue`
- `app.config.ts (menuPrimary)`
- `themes/portfolio-dev/pages/resumeObject/Index.vue`
- `themes/portfolio-dev/pages/resumeObject/Hero.vue`
- `themes/portfolio-dev/pages/github/GitRepos.vue`
- `app.vue`
- `layouts/default.vue`

## Re-check vs code
Behavior 1–9 match code. KeyNav mounted in Header.vue, one `window` `keydown` listener; returns on ctrl/meta/alt/`defaultPrevented`. `isTyping` (input/textarea/select/contenteditable) → off, `Escape` blurs. `?` toggles `isHelpOpen`; open → other keys ignored; header `?` button `hidden lg:flex` (Q1). `g` prefix 1000ms: `gg` top, else `menuPrimary` key r/p/h/c → `navigateTo(localePath(link))`, other key cancels. `j`/`k` ±80px, `G` bottom. Else visible `[data-shortcut]` match → `preventDefault`, `focus()`, `click()`. Current: resume tabs `1`–`4` (4 sections), Hero `c` + `D`, GitRepos `/` (Q2: `c` + `gc`). Dialog: menuPrimary `g<key>` rows, motions j/k/gg/G/?, "On this page" from visible shortcuts on open, `keyNav.extensionNote`. Header tab `g<key>` and Hero kbd badges `aria-hidden`. app.vue skip link first element, `@click.prevent` focuses `#main-content` (no hash). No discrepancy.

## Questions + answers
Operator (2026-11-07): "ok, behavior đúng" (Behavior section confirmed correct).
1. The `?` header button is hidden below `lg`, so on tablets/phones with a
   keyboard the help is reachable only via `?`. Intended? → **Answer (operator 2026-11-07):** Intended
2. `c` (Contact me on `/`) and `gc` (global contact) both exist. Keep both? → **Answer (operator 2026-11-07):** Change: keep only `gc`, drop the `c` shortcut — #438

## Result
status: verified — every open question answered + operator confirmed Behavior.
`Status: verified — confirmed by operator 2026-11-07, see evidence/analyst/2026-11-07/keyboard-navigation-spec.md` set in doc + INDEX row; Issues: #438. Behavior unchanged (describes code today; changes tracked by the issues).

## Isolation proof
Separate spawned agent (Agent tool), blank context. Received only the
dispatch prompt (5 tasks, operator's "ok, behavior đúng" confirmation, the
operator's answers + issue numbers). No implementer reasoning, no main
session transcript. All Behavior items re-checked by reading code myself.
