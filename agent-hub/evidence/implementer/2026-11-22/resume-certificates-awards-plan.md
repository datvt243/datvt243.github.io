# 2026-11-22 - resume-certificates-awards (plan)

- Worker: implementer · Version: 0.1.0
- Node: `resume-certificates-awards` on `haven/diagrams/dev-loop.prime-mermaid.md` (new row, IN_PROGRESS)
- Task (verbatim, via `/todo #420`, issue #420): "Home: show certificates, awards and career (hidden when empty)" — `certificates`, `awards` and `generalInformation.career` are whitelisted and sent to the browser by `/api/resume`, but the home page shows none of them (only the PDF uses certificates/awards). Expected: show them on the home page in both Dev and HR views; a section with no data is not rendered.
- Branch: `feature/420` (off `staging`, synced: `Already up to date.`)

## Hub bytes before: 93630

## Feature doc: agent-hub/doctrine/features/resume-home.md (Behavior 13–17, #420 criteria) + agent-hub/doctrine/features/resume-view-toggle.md (Behavior 12, #420 criteria)
Analyst spec `evidence/analyst/2026-11-22/resume-home-certificates-spec.md` (`spec_ready`); open questions 5–8 answered by the operator (Q5 (a) two tabs, Q6 (a) hero line, Q7 (a) PDF order, Q8 (a) `<start> - present`). None unanswered.

## Slug check
`grep -c "resume-certificates-awards"` → archive `0`, active `0`. `grep -n "#420"` on the active diagram → no output.

## Acceptance (from the feature docs, #420 rows)
1. `base` fixture (+ `career: 'Career X'`, `positionDesired: 'Dev'`): sidebar `5:certificates.json`, `6:awards.json`; `5` shows `"Cert"`, `"Org"`, `"Cert2"`; `6` shows `"Award"`; `Cert2` end = `present`; `/?tab=awards` selects `awards.json`; hero line `Career X` under `Dev`.
2. Empty fixture (`certificates: []`, `awards: []`, `career: ''`): no new tabs, no `data-shortcut="5"`, `/?tab=certificates` → `experiences.pug`, URL unchanged; no career line.
3. `career` = `positionDesired` → no career line.
4. Description `<b>x</b>` → text `x`, no `<b>` element.
5. HR card order: Experience, Skills, Education, Certificates, Awards, Languages (localized); empty lists → no Certificates/Awards heading.
6. Edge: only awards → `awards.json` gets `5`; career with HTML-looking text → literal text.
7. build/lint/typecheck/`npm test` clean; new adapter functions have a case in `tests/resumeAdapter.test.ts`.
Self-check: each criterion is a concrete DOM/URL observation; no rewrite needed.

## Code anchors
`types/resume-document.ts` (`Resume`, `Certificate`, `Award`), `utils/ResumeAdapter.ts` (mappers, `toHero`), `stores/resume.ts` (getters), `themes/portfolio-dev/pages/resumeObject/{Index,Hero,Hr,Educations}.vue`, `i18n/locales/{vi,en}.json` (`resume.hr.*`), `tests/resumeAdapter.test.ts`. PDF (`server/utils/createPDFAts.ts`) has its own `certificates`/`awards` handling — untouched.
