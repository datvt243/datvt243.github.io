# Resume home page

- Status: verified — verified by agent-hub/evidence/verifier/2026-11-22/resume-certificates-awards-seal.md (Behavior 1–12 earlier confirmed/verified, see prior notes)
- Source: backfill from code
- Issues: #417, #419, #420, #421
- Anchors: `pages/index.vue`, `composables/useResumeData.ts`, `stores/resume.ts`, `server/api/resume.ts`, `server/utils/fetchResume.ts`, `themes/portfolio-dev/pages/resumeObject/Index.vue`, `themes/portfolio-dev/pages/resumeObject/Hero.vue`, `themes/portfolio-dev/pages/resumeObject/Experiences.vue`, `themes/portfolio-dev/pages/resumeObject/Educations.vue`, `themes/portfolio-dev/pages/resumeObject/Skills.vue`, `themes/portfolio-dev/pages/resumeObject/Languages.vue`, `themes/portfolio-dev/pages/resumeObject/Hr.vue`, `utils/ResumeAdapter.ts`, `types/resume-document.ts`, `i18n/locales/vi.json`, `i18n/locales/en.json`, `nuxt.config.ts`

## Goal
Recruiters and visitors open `/` (or `/en`) to read the owner's resume in a
code-editor look: who he is, what he has done, what he knows.

## Behavior
1. `/` and `/en` are ISR-cached for 60s (`nuxt.config.ts` routeRules).
2. The page fetches `/api/resume?lang=<locale>` once per locale (key
   `api-resume-<locale>`); switching language refetches instead of reusing
   the other language's text.
3. `/api/resume` calls `${NODE_API}/api/me/${MY_EMAIL}?lang=<vi|en>` with an
   8s timeout and no retry, and caches the result 1 hour per email+lang
   (bypassed in dev). Any `lang` other than `en` is treated as `vi`.
4. Only whitelisted fields leave the server: top-level `firstName`,
   `lastName`, `email`, `phone`, `address`, `introduction`, `socialMedia`,
   `generalInformation`, `experiences`, `educations`, `projects`,
   `certificates`, `awards`, `cvFileName`; inside `generalInformation` only
   `positionDesired`, `career`, `yearsOfExperience`, `openToWork`,
   `professionalSkills`, `professionalSkillsGroup`, `personalSkills`,
   `mainSkills`, `familiarSkills`, `foreignLanguages`. Salary, birthday,
   marital status and gender never reach the browser.
5. If the upstream fails (network error, non-2xx, `success: false`, or a
   resume with no whitelisted field), the
   API throws 502 "Unable to load resume data" (not cached), and the page
   throws a fatal error (upstream status or 502) so ISR keeps serving the last
   good render instead of caching a broken 200.
6. The hero shows: avatar (hidden below `sm`), a greeting, the full name (in
   `lang="vi"` from `app.config.ts` `resumeContentLang`), an "open to work"
   badge when `openToWork` is true, a "Contact me" link to `/contact`
   (no page shortcut; global `gc`), the CV download button (see `resume-pdf-download.md`), the
   desired position, the introduction (only `<strong>`/`<b>` kept as bold,
   every other tag stripped, rendered without `v-html`), the main-skills chips
   and a "familiar with" chip row, each with an icon when the name matches one.
7. Below the hero (Dev view) an editor panel has 4 sidebar tabs (plus up
   to 2 more, Behavior 15), in this order, with number shortcuts `1`–`4`: `experiences.pug` (default),
   `skills.ts`, `educations.json`, `languages.json`. The sidebar also links
   `_contact.ts` to the literal `/contact` (no `localePath`, so `/en` also
   goes to `/contact` — see Open question 4).
8. Selecting a non-default tab sets `?tab=<key>` in the URL (the default tab
   removes it) and scrolls the panel's tab row into view (instant when the
   user prefers reduced motion). Opening the page with `?tab=skills|education|languages`
   selects that tab after mount (client only); Back/Forward keeps the tab in
   sync with the URL.
9. Experiences are sorted newest `startDate` first and rendered as semantic
   HTML styled like Pug source with CSS line numbers. Career breaks show
   "Career break — <type>" (or just "Career break" for an unknown/empty type)
   and no company. Below 48rem the gutter and tag glyphs are hidden and list
   items get a "- " marker.
10. The skills tab has two sub-tabs, `skills.ts` (default; grouped skills
    plus personal skills) and `skill-group.ts` (the group list).
11. Education and languages render as JSON-looking code blocks.
12. SEO: title "Resume <firstName> <lastName>" (fallback "Võ Tấn CV") with
    no site title template, description = introduction without HTML, OG/
    Twitter image `${SITE_URL}/og-image.png` 1200×630, and a schema.org
    `Person` JSON-LD (name from `AppHeading`, jobTitle = positionDesired,
    url = SITE_URL, sameAs = GitHub + LinkedIn).
13. (#420) The home page shows the resume's `certificates`, `awards` and
    `generalInformation.career` in both the Dev and the HR view
    (`resume-view-toggle.md` Behavior 12). A section/tab/line with no data
    is not rendered at all (no heading, no empty code block, no sidebar
    entry). "No data": `certificates`/`awards` missing or an empty array;
    `career` missing, empty or whitespace only.
14. (#420) Each certificate shows name, organization, a date range and the
    description; each award shows name, organization, the issue date and
    the description. Dates are `MM/YYYY` (same formatter as education);
    descriptions are plain text with HTML tags stripped (same as education
    `descriptionText`), never `v-html`. Items keep the API order (the PDF
    does not sort them either). A missing date shows `--/--` like education.
    A certificate with `isNoExpiration` follows Behavior 17.
15. (#420) Dev view: two new sidebar tabs after `languages.json`, in this
    order: `certificates.json` (keys `name`, `organization`, `startDate`,
    `endDate`, `description`) and `awards.json` (keys `name`,
    `organization`, `issueDate`, `description`), rendered as JSON code
    blocks like `educations.json`. `?tab=certificates` / `?tab=awards`
    select them (Behavior 8 rules apply). A tab whose list is empty is not
    in the sidebar, and the number shortcuts stay consecutive over the tabs
    shown (both present: `5` certificates, `6` awards; only awards: `5`
    awards).
16. (#420) `career` is shown in the hero (so in both views) as one line
    under the desired position, as plain text (free text, content unknown;
    no `v-html`). Hidden when empty/whitespace or equal (trimmed) to the
    shown `positionDesired`.
17. (#420) A certificate's date range is `<startDate> - <endDate>`, or
    `<startDate> - present` when `isNoExpiration` is true (the PDF's
    wording); an award shows its `issueDate` alone.

## Acceptance criteria
- `npm test` passes, including `tests/fetchResume.test.ts`,
  `tests/resumeAdapter.test.ts`, `tests/groupSkills.test.ts`,
  `tests/skillIcon.test.ts`, `tests/tsCodeLines.test.ts`.
- `curl -s <host>/api/resume` JSON contains none of the keys `salary`,
  `birthday`, `maritalStatus`, `gender` (anywhere in `resume`).
- `curl -s -o /dev/null -w '%{http_code}' <host>/api/resume` returns `502`
  when `NODE_API` points at an unreachable host.
- Opening `/?tab=skills` shows `skills.ts` as the active tab after load;
  clicking `experiences.pug` removes `tab` from the URL.
- Pressing `2` on `/` selects the skills tab.
- `/en` shows the introduction/descriptions in English when the backend has
  an English version.
- Page source of `/` contains one `<script type="application/ld+json">` with
  `"@type":"Person"`.
- (#420) With a mock `NODE_API` (never the real backend: set `NODE_API`
  and `NUXT_PUBLIC_NODE_API` to the mock at build and start, and
  `grep -c onrender <server log>` = 0) returning the `base` fixture of
  `evidence/implementer/2026-10-04/object-parameter-rule-assets/fixtures.cjs`
  (2 certificates, 1 award) plus `generalInformation.career: 'Career X'`
  and `positionDesired: 'Dev'`:
  - the Dev sidebar shows `certificates.json` with shortcut `5` and
    `awards.json` with shortcut `6`; pressing `5` shows a code block
    containing `"Cert"`, `"Org"`, `"Cert2"`; pressing `6` shows `"Award"`;
  - the `Cert2` entry (`isNoExpiration: true`) shows its end as `present`;
  - opening `/?tab=awards` selects `awards.json` after load;
  - the hero shows the line `Career X` under `Dev`.
- (#420) Same mock with the third fixture (`certificates: []`,
  `awards: []`) and `career: ''`: no `certificates.json`/`awards.json` in
  the sidebar, no element with `data-shortcut="5"`, `/?tab=certificates`
  shows `experiences.pug` with the URL unchanged, and no career line.
- (#420) `career` equal to `positionDesired` → no career line.
- (#420) Certificate/award descriptions containing `<b>x</b>` render the
  text `x` with no `<b>` element.
- (#420) `npm run build`, `npm run lint`, `npx nuxi typecheck`, `npm test`
  clean; if a new adapter function is added for certificates/awards it has
  a case in `tests/resumeAdapter.test.ts`.

## Edge cases
- Upstream down → 5xx error page (see `error-page.md`), last good ISR copy
  served on Vercel.
- `generalInformation` is an array → the first item is used; missing → `{}`.
- `?tab=unknown` → default tab, URL unchanged.
- No `openToWork` → no badge; empty main/familiar skills → that row hidden.
- (#420) Only one of certificates/awards has data → only that one is shown.
- (#420) `?tab=certificates|awards` while that list is empty → default tab,
  URL unchanged (same as `?tab=unknown`).
- (#420) Only awards present → `awards.json` gets shortcut `5`.
- (#420) `career` with HTML-looking text → shown as literal text.
- (#420) Certificate/award with an empty `organization` → name only, no
  dangling " — ".

## Out of scope
- Editing resume data (lives in the external backend).
- Server-rendered tab from `?tab` (ISR page; tab is client-only).

## Open questions
1. `pages/index.vue` renders an empty page (no message) when the API returns
   200 with an empty `resume` object (`isValid` false). Intended, or should it
   be an error/empty state? → **Answer (operator 2026-11-07):** Bug: show an empty/error state — #419
2. `certificates`, `awards` and `career` are whitelisted and sent to the
   browser but not shown on the page (the PDF uses certificates/awards).
   Intended? → **Answer (operator 2026-11-07):** Change: show them on the page, a section with no data is hidden — #420
3. `/api/resume` on Vercel ISR allows only the `lang` query (60s); the
   handler itself caches 12 days. Is the 12-day server cache the intended
   max staleness after a backend edit? → **Answer (operator 2026-11-07):** Change: shorten to ~1h — #421 (#379 only fixed the browser cache)
4. The sidebar `_contact.ts` link in `themes/portfolio-dev/pages/resumeObject/Index.vue`
   is `to="/contact"` (no `localePath`); live `/en` renders `href="/contact"`,
   dropping English readers to the Vietnamese page (the hero "Contact me" uses
   `localePath`). Bug? → **Answer (operator 2026-11-07):** Bug — #417
5. (#420) Where do certificates and awards go in the **Dev view** editor panel?
   (a) Two new sidebar tabs after `languages.json`: `certificates.json` and
   `awards.json`, rendered as JSON code blocks like `educations.json`, with
   `?tab=certificates|awards` and shortcuts `5`/`6`; an empty one is left
   out of the sidebar and the shortcuts of the remaining tabs stay
   consecutive.
   (b) One new tab `achievements.json` holding `{ certificates: [...],
   awards: [...] }` (an empty key omitted, the tab hidden when both empty),
   shortcut `5`, `?tab=achievements`.
   (c) No new tab: append them to the existing `educations.json` tab as
   extra JSON blocks.
   → **Answer (operator 2026-11-22):** (a) Two new tabs → Behavior 15
6. (#420) `generalInformation.career` is one string (the PDF uses it only as
   the headline fallback when `positionDesired` is empty). The live API
   returned 502 on 2026-11-22, so its real value is unknown here — what
   does it hold (e.g. an industry like "Information Technology", or a
   career summary)? And where should it show?
   (a) In the hero (shared by both views): one line under the desired
   position; hidden when empty or equal to `positionDesired`.
   (b) Only as the hero fallback when `positionDesired` is empty (replacing
   today's hardcoded "A frontend developer"), like the PDF.
   (c) Separately per view: Dev = a `career` field in a code tab (which
   one?), HR = a labelled line at the top of the HR card.
   → **Answer (operator 2026-11-22):** (a) Hero line; no note on what
   `career` holds → treated as unknown free text → Behavior 16
7. (#420) Order of the new sections in the **HR card**?
   (a) Experience, Skills, Education, Certificates, Awards, Languages (the
   PDF's order).
   (b) Experience, Skills, Education, Languages, Certificates, Awards
   (appended at the end).
   → **Answer (operator 2026-11-22):** (a) PDF order →
   `resume-view-toggle.md` Behavior 12
8. (#420) A certificate with `isNoExpiration: true` — what date label?
   (a) `<start> - present` (what the PDF prints today).
   (b) `<start> - <localized "no expiration">` (new i18n string vi/en).
   (c) Only `<start>`.
   → **Answer (operator 2026-11-22):** (a) `<start> - present` → Behavior 17

## Changelog
| Date | Change | Why | Node |
|---|---|---|---|
| 2026-11-06 | Backfilled from code | /spec-backfill | - |
| 2026-11-06 | Reviewer corrections (code + live) | `evidence/spec-backfill/2026-11-06/review.md` | - |
| 2026-11-07 | Operator confirmed Behavior + answered all open questions; Status → verified | analyst backfill re-check, see `evidence/analyst/2026-11-07/resume-home-spec.md` | - |
| 2026-11-08 | Behavior #3: server cache 12 days → 1 hour; #5: an empty resume fails like an upstream error (fatal, not a blank page) | operator answers to Open questions 3 + 1 (fatal chosen 2026-11-08) | `resume-cache-empty` |
| 2026-11-22 | Behavior #6: Contact me link has no `c` shortcut (contact is global `gc`) | #438, operator answer in `keyboard-navigation.md` Q2 | `keyboard-drop-c-shortcut` |
| 2026-11-22 | #420 spec: Behavior 13–17, acceptance + edge cases, Open questions 5–8 (answered by operator 2026-11-22); Status → draft until SEAL | operator answer to Open question 2, see `evidence/analyst/2026-11-22/resume-home-certificates-spec.md` | - |
