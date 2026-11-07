# Projects page with technology filter

- Status: verified — confirmed by operator 2026-11-07, see `evidence/analyst/2026-11-07/projects-spec.md`
- Source: backfill from code
- Issues: #426, #434, #435
- Anchors: `pages/projects.vue`, `themes/portfolio-dev/pages/projects/Index.vue`, `themes/portfolio-dev/components/FilterFolder.vue`, `utils/sortProjects.ts`, `stores/resume.ts`, `composables/useResumeData.ts`, `nuxt.config.ts`

## Goal
Visitors browse the owner's projects and narrow them to the technologies they
care about.

## Behavior
1. `/projects` and `/en/projects` are ISR-cached 60s and load the same resume
   data as the home page (`useResumeData`, one fetch per locale; a failure
   ends as a fatal 5xx).
2. Projects are ordered: company projects (`type === 'company'`) before all
   others (no `type` counts as personal); within each group newest
   `startDate` first; projects without `startDate` last.
3. The sidebar lists every technology used by any project, de-duplicated and
   sorted alphabetically, as a multi-select filter.
4. No technology selected → all projects. One or more selected → projects
   using at least one of them (OR). Selected items are listed comma-joined
   below the filter with a clear (×) button. Below `lg` the filter folder is
   collapsible.
5. No match → localized "no match" text.
6. Each card shows: thumbnail (first API image; else a placeholder for names
   starting with `aihr` or `simplemdg`; else a file icon), a `#` badge when
   the project has technologies, "Project <n>" (n = position in the current
   filtered list), name, role (when present), date range, description,
   technology badges, and "View project" opening `link` in a new tab when
   present.
7. SEO title/description come from i18n keys `projects.seoTitle`/
   `projects.seoDescription`; a visually hidden `<h1>` repeats the title.

## Acceptance criteria
- `npm test` passes, including `tests/sortProjects.test.ts`.
- On `/projects`, selecting two technologies shows exactly the projects that
  use either one; clicking × shows all projects again.
- A project with `link` renders an `<a target="_blank" rel="noopener noreferrer">`.
- `curl -sI <host>/projects` on production shows an ISR/cache response (not a
  fresh render every time).

## Edge cases
- Resume has no projects → empty sidebar and the "no match" text.
- Project with no technology → never matches a non-empty filter.

## Out of scope
- Search by name, AND-filtering, filter in the URL.

## Open questions
1. Root `CLAUDE.md` says `/projects` has "none (no routeRule)", but
   `nuxt.config.ts` sets `isr: 60` for `/projects` and `/en/projects`. Which is
   intended (the doc or the config)? → **Answer (operator 2026-11-07):** The config is right; fix CLAUDE.md — #434
2. "Project <n>" renumbers when filtering (a project's number changes).
   Intended? → **Answer (operator 2026-11-07):** Intended
3. The clear button's aria-label "Clear filters" in `FilterFolder.vue` is
   hardcoded English, not i18n. Intended? → **Answer (operator 2026-11-07):** Bug — #426
4. The filter selection is not kept in the URL, so a filtered view can't be
   shared. Wanted? → **Answer (operator 2026-11-07):** Change: keep it in the URL — #435

## Changelog
| Date | Change | Why | Node |
|---|---|---|---|
| 2026-11-06 | Backfilled from code | /spec-backfill | - |
| 2026-11-07 | Operator confirmed Behavior + answered all open questions; Status → verified | analyst backfill re-check, see `evidence/analyst/2026-11-07/projects-spec.md` | - |
