# analyst — resume-view-toggle — 2026-11-22

## Task (verbatim)
HR view: make it linkable with `?view=hr` (#422)
## Problem
The Dev/HR view is in-memory only (`useResumeView.ts`): a reload returns to Dev and a recruiter can't share an HR link.
## Expected
`?view=hr` selects HR after mount (client only, like `?tab=`, so ISR still renders Dev); the toggle updates the query (`dev` removes it).
---
Decided by the operator while confirming `agent-hub/doctrine/features/resume-view-toggle.md` (2026-11-07).

## Doc
`agent-hub/doctrine/features/resume-view-toggle.md` (existing doc updated: Behavior 2, 3 changed; 8–11 added; acceptance, edge cases, out of scope updated; open question 3 added; Changelog row). INDEX row → draft.

## Sources read
- `agent-hub/haven/workers/analyst/{manifest.yaml,SOUL.md,recipes/spec_feature.md}`
- `agent-hub/doctrine/domains/PROJECT.md`, `agent-hub/doctrine/MEMORY.md`, `agent-hub/doctrine/features/INDEX.md`
- `agent-hub/doctrine/features/resume-view-toggle.md`, `agent-hub/doctrine/features/resume-home.md` (`?tab` Behavior 8, edge cases)
- `agent-hub/evidence/analyst/2026-11-07/resume-view-toggle-spec.md`
- `composables/useResumeView.ts`, `themes/portfolio-dev/layout/Header.vue` (`toggleResumeView`), `themes/portfolio-dev/pages/resumeObject/Index.vue` (`?tab` precedent: `router.replace({ query: { ...route.query, tab } })`, `onMounted` + `watch(route.query.tab)`), `themes/portfolio-dev/components/KeyNav.vue`, `nuxt.config.ts` (i18n `prefix_except_default`, `/` + `/en` `isr: 60`)

## Questions + answers
- Q1 (2026-11-07, answered): linkable via `?view=hr`, applied after mount like `?tab` → this issue.
- Q3 (new): in HR view, returning to `/` via a link without `?view` (nav tab, logo, `gr`, language switch dropping the query) — (a) state wins, stay HR and re-add `?view=hr`; or (b) URL wins, show Dev. Changes Behavior 3/8–10 and the 2026-11-07 edge case "language switch → stays HR".
  → **Answer (operator 2026-11-22, via coordinator):** "(a) State wins" — stay HR and re-add `?view=hr` to the URL on mount. Recorded as Behavior 11 + 2 acceptance criteria + an edge case separating it from Back/Forward (Behavior 10).
- Decided without asking (follows existing `?tab` convention, not new intent): replace not push; other query params kept; unknown values → Dev, URL unchanged; `?view` ignored off `/`.

## Result
status: spec_ready (round 1 needs_input on Q3; round 2 answered).  Doc Status: draft (feat spec; only the node's SEAL verifies it).

## Isolation proof
Separate spawned agent, blank context. Received only the dispatch prompt (issue #422 title + body, branch name, doc path). No implementer reasoning or main-session transcript; all anchors grep-confirmed by reading code myself.
