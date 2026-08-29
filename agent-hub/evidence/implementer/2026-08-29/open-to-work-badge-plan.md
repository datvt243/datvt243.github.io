# 2026-08-29 — open-to-work-badge (plan)

- Worker: implementer
- Version: 0.1.0
- Node: `haven/diagrams/dev-loop.prime-mermaid.md` → `open-to-work-badge` (new)
- Task (verbatim): Add openToWork field support: backend ResumeAPI added
  `openToWork` (Boolean, default false) to generalInformation document,
  exposed via /api/me/{email} as data.generalInformation.openToWork. Wire
  it through types/resume-document.ts's GeneralInformation interface ->
  HeroModel (models/Hero.ts) -> ResumeAdapter.toHero() -> useResumeStore's
  hero getter, then display a small badge (green dot + "Open to work" text)
  next to the name in themes/portfolio-dev/pages/resumeObject/Hero.vue,
  visible only when openToWork === true, hidden entirely when false. Check
  whether Hero.vue on this branch (feature/84, off main, predates
  feature/80's i18n merge) has useI18n()/t() wired already; if not, do NOT
  pull in feature/80's unmerged i18n work — just use plain text matching
  this branch's actual current state, and disclose the i18n gap as a known
  limitation. Issue #84, branch feature/84.

## Confirmation of the backend field (read, not guessed)
Read directly in the `ResumeAPI` repo (added as a working directory this
session):
- `backend/src/models/generalInformation.model.ts:27` —
  `openToWork: { type: Boolean, default: false, required: false }`
- `backend/src/candidate_profile/general_information/generalInformation.validate.ts:23`
  — `openToWork: _boolean`
- `backend/src/config/swagger.config.ts:192` — `openToWork: { type: 'boolean' }`
- `backend/src/candidate_me/index.ts`'s `handlerGetAboutMe` — flattens the
  candidate's `generalInformation` collection (first item, or `{}`) onto
  `dataResult.generalInformation`, returned as `data.generalInformation` in
  the `/api/me/{email}` response. No renaming/remapping happens to this
  field on the way out.
- Confirmed live on production API
  (`curl https://nodejs-resume-api-ts.onrender.com/api/me/votan.it@gmail.com`):
  `data.generalInformation` currently has NO `openToWork` key at all — the
  deployed backend hasn't shipped this yet (local `ResumeAPI` repo is ahead
  of the deployed instance). Frontend code must treat it as
  optional/possibly-`undefined` (`Boolean(...)`), not assume it's always
  present.

## Node exists? No — created new node `open-to-work-badge` (LAI-13 ratchet,
starts at `IN_PROGRESS` since code + evidence exist, awaiting verifier).

## Anchors located via grep (real paths)
- `types/resume-document.ts` — `GeneralInformation` interface
- `models/Hero.ts` — `HeroModel`
- `utils/ResumeAdapter.ts` — `toHero()`
- `stores/resume.ts` — `hero` getter (reads `resumeAdapter.toHero(resume,
  this.generalInformation)`, no change needed — already passes
  `generalInformation` through)
- `themes/portfolio-dev/pages/resumeObject/Hero.vue` — render target

## Blockers
None. `.env` already has `MY_EMAIL`/`NODE_API` set (needed to exercise the
real API during CDP verification). `PUPPETEER_EXECUTABLE_PATH` not needed
(no PDF work here).

## Acceptance criteria
1. `GeneralInformation` type has `openToWork: boolean`.
2. `HeroModel` has `openToWork` defaulting to `false`.
3. `ResumeAdapter.toHero()` maps `generalInformation.openToWork` through
   `Boolean(...)` (survives `undefined` from the not-yet-deployed backend).
4. `Hero.vue` shows a small green "Open to work" badge only when
   `hero.openToWork === true`; the badge is fully absent from the DOM
   (not just visually hidden) when `false`.
5. No i18n regression: `Hero.vue` on this branch has no `useI18n()` — badge
   text stays plain, matching the branch's existing un-translated strings.
6. `npm run build` + `npm run lint` clean (0 new errors/warnings vs. the
   pre-existing baseline).
7. Real UI check via Chrome CDP: badge appears with `openToWork: true` data,
   is absent with real production data (currently `false`/absent), 0
   console errors either way.
