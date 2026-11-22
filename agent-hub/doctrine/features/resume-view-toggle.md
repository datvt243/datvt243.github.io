# Dev / HR resume view toggle

- Status: verified — verified by agent-hub/evidence/verifier/2026-11-22/resume-certificates-awards-seal.md (Behavior 1–11 earlier verified by resume-view-url-seal.md)
- Source: backfill from code
- Issues: #422, #420
- Anchors: `composables/useResumeView.ts`, `themes/portfolio-dev/layout/Header.vue`, `themes/portfolio-dev/pages/resumeObject/Index.vue`, `themes/portfolio-dev/pages/resumeObject/Hr.vue`

## Goal
Recruiters who don't want the code-editor metaphor can switch the home page
to a plain, conventional resume layout.

## Behavior
1. The header has a `dev / hr` button on every page; the active view's label
   is highlighted. Its aria-label/title says "switch to HR" or "switch to
   Dev" (localized).
2. Clicking it flips the view between `dev` and `hr`. If the user is not on
   `/` (in the current locale), it also navigates to `/` (to `/?view=hr` when
   switching to HR). (#422)
3. The view is app state (`useState('resumeView')`), default `dev`, mirrored
   in the URL as `?view=hr` (Behavior 8–10). It is not stored in a cookie or
   localStorage; the server always renders `dev` (`/` is ISR-cached), so a
   fresh load of `/` without `?view=hr` (new tab or reload) shows `dev`. (#422)
4. In `hr` view the home page keeps the hero and replaces the editor panel
   with one card containing, in order: Experience, Skills, Education,
   (Certificates, Awards — Behavior 12), Languages. Empty sections are hidden.
5. HR Experience: per job a title (position, or "Career break — <type>"), the
   date range, the company (not for career breaks), bullet points, and the
   job's skills comma-joined. A briefcase icon (accent color for the current
   job) or a pause icon for a career break.
6. HR Skills: a table with one row per skill group (skills without a group go
   to a localized "Other" row), each skill with its icon and "<n> years" when
   known; personal skills follow as a bullet list.
7. HR Education: school, start–end, major, and the description when it
   differs from the major. HR Languages: "<language> — <level>".
8. Opening `/` (or `/en`) with `?view=hr` switches to the HR view after the
   page mounts, client side only — the server HTML is still the Dev view,
   exactly like `?tab=` (`resume-home.md` Behavior 8). (#422)
9. Toggling on `/` updates the URL in place (replace, no new history entry):
   switching to HR sets `?view=hr`, switching to Dev removes `view` from the
   query. Other query params (e.g. `?tab=`) are kept. (#422)
10. Back/Forward that changes `?view` keeps the view in sync with the URL
    (`hr` → HR, any other value → Dev); an entry with no `?view` follows
    Behavior 11 (keeps the current view). (#422, operator answer 2026-11-22)
11. State wins over a URL without the param: when the view is already `hr`
    in this tab and `/` is shown with no `?view` (header nav tab, logo, `gr`,
    a language switch that drops the query, Back/Forward — from another page
    or on `/` itself), the page stays HR and re-adds `?view=hr` to the URL
    (replace). (#422, operator answers Q3 + Q4 2026-11-22)
12. (#420) The HR card also has a Certificates section (per item: name,
    organization, date range, description) and an Awards section (per item:
    name, organization, issue date, description), each hidden when empty,
    with localized headings (`resume.hr.*`, vi + en). Card order becomes
    Experience, Skills, Education, Certificates, Awards, Languages (the
    PDF's order; operator answer 2026-11-22). Item format and empty rules:
    `resume-home.md` Behavior 13, 14, 17; `career` is in the hero, which
    the HR view keeps (`resume-home.md` Behavior 16).

## Acceptance criteria
- On `/`, clicking `dev/hr` shows the HR card (headings Experience, Skills,
  Education, Languages) and hides the editor tabs; clicking again restores
  the tabs.
- On `/projects`, clicking `dev/hr` lands on `/` in HR view.
- On `/`, clicking `dev/hr` changes the URL to `/?view=hr`; clicking again
  changes it back to `/` (no `view` param). The history length does not grow.
- Opening `/?view=hr` in a fresh tab shows the HR card after load;
  `curl -s <origin>/?view=hr` returns HTML containing the editor panel (`experiences.pug`)
  (Dev view), not the HR card.
- Reloading `/?view=hr` shows HR; reloading `/` shows Dev.
- In HR view on `/`, go to `/projects` via the header tab, then back via the
  header `/` tab (or `gr`): HR card shown and the URL is `/?view=hr`.
- In HR view on `/`, switch language: the HR card stays and the URL of the
  other locale's home ends in `?view=hr`.
- On `/projects`, clicking `dev/hr` lands on `/?view=hr` in HR view.
- `/?tab=skills&view=hr`: HR card shown, and toggling back to Dev keeps
  `tab=skills` in the URL and opens the skills tab.
- (#420) In HR view with the `base` mock fixture (see `resume-home.md`
  acceptance), the card's headings read, in order, Experience, Skills,
  Education, Certificates, Awards, Languages (vi: localized), `Cert2` shows
  `- present`, and the hero career line is visible; with the third fixture
  (empty lists) neither Certificates nor Awards heading is in the DOM.
- `npm run build`, `npm run lint`, `npx nuxi typecheck` clean.
- `npm test` passes (`tests/groupSkills.test.ts` covers the grouping used by
  the HR skills table).

## Edge cases
- HR view active, user switches language → stays HR (state is per tab, not
  per locale).
- Resume with no skills groups → all skills under "Other".
- (#420) Only one of certificates/awards has data → only that section.
- `?view=dev`, `?view=HR`, `?view=foo` → Dev view, URL left unchanged (same
  as `?tab=unknown`).
- `?view=hr` on a page other than `/` (e.g. `/projects?view=hr`) → ignored.
- Back/Forward to an entry without `?view` while in HR → stays HR, URL gets
  `?view=hr` (Behavior 11; links and history pops are treated the same).

## Out of scope
- Persisting the choice in a cookie or localStorage (only the URL carries it).
- Server-rendering the HR view from `?view` (ISR page; view is client-only).
- Reading `?view` on any page other than `/`.
- An HR version of `/projects` or the PDF (PDF has its own template).

## Open questions
1. Should the HR choice survive a reload or be linkable (e.g. `?view=hr`)?
   Today it deliberately does not (ISR comment in `useResumeView.ts`), but a
   recruiter sharing the link gets the Dev view. → **Answer (operator 2026-11-07):** Change: `?view=hr`, applied after mount like `?tab` — #422
2. The toggle is shown on every page, even where it has no local effect;
   intended (it doubles as a shortcut to `/` in HR view)? → **Answer (operator 2026-11-07):** Intended

3. (#422) In HR view, the user leaves `/` (e.g. to `/projects`) and comes
   back via a plain link to `/` — header nav tab, logo, `gr`, or a language
   switch that drops the query. The URL has no `?view`. Which wins?
   (a) **State wins**: stay HR and re-add `?view=hr` to the URL on mount
   (keeps the 2026-11-07 edge case "language switch → stays HR"; URL always
   matches what's shown).
   (b) **URL wins**: `/` without `?view` shows Dev, like `/` without `?tab`
   shows the default tab (HR would then only survive navigation through
   links that carry `?view=hr`).
   → **Answer (operator 2026-11-22):** (a) State wins — stay HR and re-add `?view=hr` to the URL on mount → Behavior 11

4. (#422, raised by the implementer's review) Back/Forward to a `/` entry
   with no `?view` (Behavior 10: Dev) vs a link with no `?view` (Behavior 11:
   HR) can't be told apart without hooking the router history. Which rule?
   → **Answer (operator 2026-11-22):** No `?view` keeps the current view
   everywhere; `?view=hr` → HR; any other value → Dev → Behavior 10, 11

## Changelog
| Date | Change | Why | Node |
|---|---|---|---|
| 2026-11-06 | Backfilled from code | /spec-backfill | - |
| 2026-11-07 | Operator confirmed Behavior + answered all open questions; Status → verified | analyst backfill re-check, see `evidence/analyst/2026-11-07/resume-view-toggle-spec.md` | - |
| 2026-11-22 | #422 spec: `?view=hr` deep link (Behavior 2, 3 changed; 8–11 added); Status → draft until SEAL | operator answer to open question 1, see `evidence/analyst/2026-11-22/resume-view-toggle-spec.md` | - |
| 2026-11-22 | Behavior 10/11 + edge case: no `?view` keeps the current view on any navigation incl. Back/Forward | operator answer to open question 4 during implementation | `resume-view-url` |
| 2026-11-22 | #420 spec: Behavior 12 (HR Certificates/Awards); Status → draft until SEAL | `evidence/analyst/2026-11-22/resume-home-certificates-spec.md` | - |
