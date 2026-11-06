# analyst — resume-view-toggle — 2026-11-07

## Task (verbatim)
document resume-view-toggle

## Doc
`agent-hub/doctrine/features/resume-view-toggle.md` (existing bulk-backfill draft, re-checked per recipe step 4, not rewritten)

## Sources read
- `agent-hub/haven/workers/analyst/SOUL.md`
- `agent-hub/haven/workers/analyst/recipes/spec_feature.md`
- `agent-hub/doctrine/features/INDEX.md`
- `agent-hub/doctrine/domains/PROJECT.md`
- `agent-hub/doctrine/MEMORY.md`
- `composables/useResumeView.ts`
- `themes/portfolio-dev/layout/Header.vue`
- `themes/portfolio-dev/pages/resumeObject/Index.vue`
- `themes/portfolio-dev/pages/resumeObject/Hr.vue`
- `app.vue` (ThemeHeader on every page)

## Re-check vs code
Behavior 1–7 match code. `useState('resumeView', () => 'dev')`, no cookie/URL/storage. Header button always rendered (no `v-if`), active label `text-theme-accent`, aria-label/title `header.switchToHr|switchToDev`; `toggleResumeView` flips and `navigateTo(localePath('/'))` when not on `/`. `Index.vue` keeps Hero, swaps panel for `ThemeResumeObjectHr` when `hr`. Hr.vue: Experience/Skills/Education/Languages sections each `v-if` length; briefcase accent for `isCurrent`, pause icon for career break, company hidden for career breaks; skills table via `groupSkills(..., t('resume.hr.other'))` + `resume.hr.years`; education description shown only when ≠ major; languages "<language> — <level>". No discrepancy.

## Questions + answers
Operator (2026-11-07): "ok, behavior đúng" (Behavior section confirmed correct).
1. Should the HR choice survive a reload or be linkable (e.g. `?view=hr`)?
   Today it deliberately does not (ISR comment in `useResumeView.ts`), but a
   recruiter sharing the link gets the Dev view. → **Answer (operator 2026-11-07):** Change: `?view=hr`, applied after mount like `?tab` — #422
2. The toggle is shown on every page, even where it has no local effect;
   intended (it doubles as a shortcut to `/` in HR view)? → **Answer (operator 2026-11-07):** Intended

## Result
status: verified — every open question answered + operator confirmed Behavior.
`Status: verified — confirmed by operator 2026-11-07, see evidence/analyst/2026-11-07/resume-view-toggle-spec.md` set in doc + INDEX row; Issues: #422. Behavior unchanged (describes code today; changes tracked by the issues).

## Isolation proof
Separate spawned agent (Agent tool), blank context. Received only the
dispatch prompt (5 tasks, operator's "ok, behavior đúng" confirmation, the
operator's answers + issue numbers). No implementer reasoning, no main
session transcript. All Behavior items re-checked by reading code myself.
