# analyst — projects — 2026-11-07

## Task (verbatim)
document projects

## Doc
`agent-hub/doctrine/features/projects.md` (existing bulk-backfill draft, re-checked per recipe step 4, not rewritten)

## Sources read
- `agent-hub/haven/workers/analyst/SOUL.md`
- `agent-hub/haven/workers/analyst/recipes/spec_feature.md`
- `agent-hub/doctrine/features/INDEX.md`
- `agent-hub/doctrine/domains/PROJECT.md`
- `agent-hub/doctrine/MEMORY.md`
- `pages/projects.vue`
- `themes/portfolio-dev/pages/projects/Index.vue`
- `themes/portfolio-dev/components/FilterFolder.vue`
- `themes/portfolio-dev/components/Folder.vue`
- `utils/sortProjects.ts`
- `stores/resume.ts`
- `composables/useResumeData.ts`
- `nuxt.config.ts (routeRules)`
- `CLAUDE.md (routes table)`
- `i18n/locales/en.json (projects.*)`

## Re-check vs code
Behavior 1–7 match code. routeRules `/projects`,`/en/projects` `isr: 60`; root `CLAUDE.md:41` says "none (no routeRule)" (Q1). `useResumeData` keyed `api-resume-<locale>`, error → fatal `createError` 5xx (default 502). Store `projects` getter sorts with `compareProjects` (company first, then `startDate` desc, missing → 0 → last). `allTech` = Set of all `technology`, `.sort()`. Filter OR via `technology.some(selected.includes)`. FilterFolder: comma-joined selection + × button `aria-label="Clear filters"` hard-coded (Q3); `collapse-below-lg` → Folder `hidden lg:block` until toggled. No match → `projects.noMatch`. Card: `thumbnail()` (images[0] → `aihr`/`simplemdg` prefix placeholder → `fe:file` icon), `#` badge iff `technology[0]`, `projectLabel` + `i + 1` of the filtered list (Q2), name, role iff `position`, `dateRangeLabel`, `descriptionText`, tech badges, link `target=_blank rel="noopener noreferrer"`. `pages/projects.vue` SEO from `projects.seoTitle`/`seoDescription`; sr-only `<h1>`. No discrepancy.

## Questions + answers
Operator (2026-11-07): "ok, behavior đúng" (Behavior section confirmed correct).
1. Root `CLAUDE.md` says `/projects` has "none (no routeRule)", but
   `nuxt.config.ts` sets `isr: 60` for `/projects` and `/en/projects`. Which is
   intended (the doc or the config)? → **Answer (operator 2026-11-07):** The config is right; fix CLAUDE.md — #434
2. "Project <n>" renumbers when filtering (a project's number changes).
   Intended? → **Answer (operator 2026-11-07):** Intended
3. The clear button's aria-label "Clear filters" in `FilterFolder.vue` is
   hardcoded English, not i18n. Intended? → **Answer (operator 2026-11-07):** Bug — #426
4. The filter selection is not kept in the URL, so a filtered view can't be
   shared. Wanted? → **Answer (operator 2026-11-07):** Change: keep it in the URL — #435

## Result
status: verified — every open question answered + operator confirmed Behavior.
`Status: verified — confirmed by operator 2026-11-07, see evidence/analyst/2026-11-07/projects-spec.md` set in doc + INDEX row; Issues: #426, #434, #435. Behavior unchanged (describes code today; changes tracked by the issues).

## Isolation proof
Separate spawned agent (Agent tool), blank context. Received only the
dispatch prompt (5 tasks, operator's "ok, behavior đúng" confirmation, the
operator's answers + issue numbers). No implementer reasoning, no main
session transcript. All Behavior items re-checked by reading code myself.
