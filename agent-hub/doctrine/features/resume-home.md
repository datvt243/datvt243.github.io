# Resume home page

- Status: draft
- Source: backfill from code
- Issues: -
- Anchors: `pages/index.vue`, `composables/useResumeData.ts`, `stores/resume.ts`, `server/api/resume.ts`, `server/utils/fetchResume.ts`, `themes/portfolio-dev/pages/resumeObject/Index.vue`, `themes/portfolio-dev/pages/resumeObject/Hero.vue`, `themes/portfolio-dev/pages/resumeObject/Experiences.vue`, `themes/portfolio-dev/pages/resumeObject/Educations.vue`, `themes/portfolio-dev/pages/resumeObject/Skills.vue`, `themes/portfolio-dev/pages/resumeObject/Languages.vue`, `nuxt.config.ts`

## Goal
Recruiters and visitors open `/` (or `/en`) to read the owner's resume in a
code-editor look: who he is, what he has done, what he knows.

## Behavior
1. `/` and `/en` are ISR-cached for 60s (`nuxt.config.ts` routeRules).
2. The page fetches `/api/resume?lang=<locale>` once per locale (key
   `api-resume-<locale>`); switching language refetches instead of reusing
   the other language's text.
3. `/api/resume` calls `${NODE_API}/api/me/${MY_EMAIL}?lang=<vi|en>` with an
   8s timeout and no retry, and caches the result 12 days per email+lang
   (bypassed in dev). Any `lang` other than `en` is treated as `vi`.
4. Only whitelisted fields leave the server: top-level `firstName`,
   `lastName`, `email`, `phone`, `address`, `introduction`, `socialMedia`,
   `generalInformation`, `experiences`, `educations`, `projects`,
   `certificates`, `awards`, `cvFileName`; inside `generalInformation` only
   `positionDesired`, `career`, `yearsOfExperience`, `openToWork`,
   `professionalSkills`, `professionalSkillsGroup`, `personalSkills`,
   `mainSkills`, `familiarSkills`, `foreignLanguages`. Salary, birthday,
   marital status and gender never reach the browser.
5. If the upstream fails (network error, non-2xx, or `success: false`), the
   API throws 502 "Unable to load resume data" (not cached), and the page
   throws a fatal error (upstream status or 502) so ISR keeps serving the last
   good render instead of caching a broken 200.
6. The hero shows: avatar (hidden below `sm`), a greeting, the full name (in
   `lang="vi"` from `app.config.ts` `resumeContentLang`), an "open to work"
   badge when `openToWork` is true, a "Contact me" link to `/contact`
   (shortcut `c`), the CV download button (see `resume-pdf-download.md`), the
   desired position, the introduction (only `<strong>`/`<b>` kept as bold,
   every other tag stripped, rendered without `v-html`), the main-skills chips
   and a "familiar with" chip row, each with an icon when the name matches one.
7. Below the hero (Dev view) an editor panel has 4 sidebar tabs, in this
   order, with number shortcuts `1`–`4`: `experiences.pug` (default),
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

## Edge cases
- Upstream down → 5xx error page (see `error-page.md`), last good ISR copy
  served on Vercel.
- `generalInformation` is an array → the first item is used; missing → `{}`.
- `?tab=unknown` → default tab, URL unchanged.
- No `openToWork` → no badge; empty main/familiar skills → that row hidden.

## Out of scope
- Editing resume data (lives in the external backend).
- Server-rendered tab from `?tab` (ISR page; tab is client-only).

## Open questions
1. `pages/index.vue` renders an empty page (no message) when the API returns
   200 with an empty `resume` object (`isValid` false). Intended, or should it
   be an error/empty state?
2. `certificates`, `awards` and `career` are whitelisted and sent to the
   browser but not shown on the page (the PDF uses certificates/awards).
   Intended?
3. `/api/resume` on Vercel ISR allows only the `lang` query (60s); the
   handler itself caches 12 days. Is the 12-day server cache the intended
   max staleness after a backend edit?
4. The sidebar `_contact.ts` link in `themes/portfolio-dev/pages/resumeObject/Index.vue`
   is `to="/contact"` (no `localePath`); live `/en` renders `href="/contact"`,
   dropping English readers to the Vietnamese page (the hero "Contact me" uses
   `localePath`). Bug?

## Changelog
| Date | Change | Why | Node |
|---|---|---|---|
| 2026-11-06 | Backfilled from code | /spec-backfill | - |
| 2026-11-06 | Reviewer corrections (code + live) | `evidence/spec-backfill/2026-11-06/review.md` | - |
