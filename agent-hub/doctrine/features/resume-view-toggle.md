# Dev / HR resume view toggle

- Status: verified — confirmed by operator 2026-11-07, see `evidence/analyst/2026-11-07/resume-view-toggle-spec.md`
- Source: backfill from code
- Issues: #422
- Anchors: `composables/useResumeView.ts`, `themes/portfolio-dev/layout/Header.vue`, `themes/portfolio-dev/pages/resumeObject/Index.vue`, `themes/portfolio-dev/pages/resumeObject/Hr.vue`

## Goal
Recruiters who don't want the code-editor metaphor can switch the home page
to a plain, conventional resume layout.

## Behavior
1. The header has a `dev / hr` button on every page; the active view's label
   is highlighted. Its aria-label/title says "switch to HR" or "switch to
   Dev" (localized).
2. Clicking it flips the view between `dev` and `hr`. If the user is not on
   `/` (in the current locale), it also navigates to `/`.
3. The view is in-memory app state (`useState('resumeView')`), default `dev`.
   It is not stored in a cookie, URL or localStorage, so the server always
   renders `dev` and a reload returns to `dev`.
4. In `hr` view the home page keeps the hero and replaces the editor panel
   with one card containing, in order: Experience, Skills, Education,
   Languages. Empty sections are hidden.
5. HR Experience: per job a title (position, or "Career break — <type>"), the
   date range, the company (not for career breaks), bullet points, and the
   job's skills comma-joined. A briefcase icon (accent color for the current
   job) or a pause icon for a career break.
6. HR Skills: a table with one row per skill group (skills without a group go
   to a localized "Other" row), each skill with its icon and "<n> years" when
   known; personal skills follow as a bullet list.
7. HR Education: school, start–end, major, and the description when it
   differs from the major. HR Languages: "<language> — <level>".

## Acceptance criteria
- On `/`, clicking `dev/hr` shows the HR card (headings Experience, Skills,
  Education, Languages) and hides the editor tabs; clicking again restores
  the tabs.
- On `/projects`, clicking `dev/hr` lands on `/` in HR view.
- Reloading `/` after switching shows the Dev view.
- `npm test` passes (`tests/groupSkills.test.ts` covers the grouping used by
  the HR skills table).

## Edge cases
- HR view active, user switches language → stays HR (state is per tab, not
  per locale).
- Resume with no skills groups → all skills under "Other".

## Out of scope
- Persisting the choice across reloads or sharing it by URL.
- An HR version of `/projects` or the PDF (PDF has its own template).

## Open questions
1. Should the HR choice survive a reload or be linkable (e.g. `?view=hr`)?
   Today it deliberately does not (ISR comment in `useResumeView.ts`), but a
   recruiter sharing the link gets the Dev view. → **Answer (operator 2026-11-07):** Change: `?view=hr`, applied after mount like `?tab` — #422
2. The toggle is shown on every page, even where it has no local effect;
   intended (it doubles as a shortcut to `/` in HR view)? → **Answer (operator 2026-11-07):** Intended

## Changelog
| Date | Change | Why | Node |
|---|---|---|---|
| 2026-11-06 | Backfilled from code | /spec-backfill | - |
| 2026-11-07 | Operator confirmed Behavior + answered all open questions; Status → verified | analyst backfill re-check, see `evidence/analyst/2026-11-07/resume-view-toggle-spec.md` | - |
