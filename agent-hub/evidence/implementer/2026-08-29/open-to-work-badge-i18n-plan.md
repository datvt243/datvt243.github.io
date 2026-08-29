# 2026-08-29 — open-to-work-badge-i18n (plan)

- Worker: implementer
- Version: 0.1.0
- Node: `haven/diagrams/dev-loop.prime-mermaid.md` → `open-to-work-badge-i18n` (new)
- Task (verbatim): Fix issue #86: the "Open to work" badge text in
  themes/portfolio-dev/pages/resumeObject/Hero.vue is hardcoded English,
  not wired through i18n even though Hero.vue already has useI18n()/t()
  (from the now-merged i18n-page-content work). Add a new key under the
  `resume` namespace in i18n/locales/{vi,en}.json (e.g. resume.openToWork)
  with a real Vietnamese translation in vi.json and English in en.json,
  then change the badge's hardcoded "Open to work" text to
  {{ t('resume.openToWork') }}. Issue #86, branch feature/86.

## Node exists? No — created new node `open-to-work-badge-i18n`, follow-up
to the SEALED `open-to-work-badge` node (regression-style follow-up, not
touching the old node's PM status per LAI-13).

## Anchors located via grep (real paths)
- `i18n/locales/vi.json` / `i18n/locales/en.json` — `resume` namespace
  already exists (`greeting`, `aboutMeHeading`, `downloadCv`)
- `themes/portfolio-dev/pages/resumeObject/Hero.vue` — badge already has
  `const { t } = useI18n()` in scope (unchanged from `i18n-page-content`)

## Blockers
None. Same `.env` as prior open-to-work-badge node — `MY_EMAIL`/`NODE_API`
already set, needed to build a real+mocked payload for CDP verification.

## Acceptance criteria
1. New `resume.openToWork` key in both `i18n/locales/vi.json` and
   `i18n/locales/en.json`, real translations (not English echoed into
   `vi.json`).
2. Badge template uses `{{ t('resume.openToWork') }}`, no hardcoded string
   left.
3. `npm run build` + `npm run lint` clean, 0 new warnings vs. baseline.
4. Real UI check via Chrome CDP: badge shows the Vietnamese text on `/`
   and the English text on `/en`, `<html lang>` correctly flips, 0 console
   errors. Since production doesn't send `openToWork: true` yet, use the
   same mocked-payload technique as the original `open-to-work-badge` node.
