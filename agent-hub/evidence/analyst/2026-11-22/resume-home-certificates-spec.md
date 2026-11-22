# Analyst — spec_feature — #420 certificates, awards, career on home

## Task (verbatim)
GitHub issue #420 — "Home: show certificates, awards and career (hidden when empty)"
> ## Problem
> `certificates`, `awards` and `generalInformation.career` are whitelisted and sent to the browser by `/api/resume`, but the home page shows none of them (only the PDF uses certificates/awards).
> ## Expected
> Show them on the home page in both Dev and HR views; a section with no data is not rendered.
> ---
> Decided by the operator while confirming `agent-hub/doctrine/features/resume-home.md` (2026-11-07).

## Result
Round 1: `needs_input` (Open questions 5–8). Round 2 (operator answers via coordinator, 2026-11-22): `spec_ready`.

## Docs written
- `agent-hub/doctrine/features/resume-home.md` — Behavior 13–15, acceptance, edge cases, Open questions 5–8, Changelog; Status verified → draft (pending SEAL, same as #422 precedent)
- `agent-hub/doctrine/features/resume-view-toggle.md` — Behavior 12 (HR Certificates/Awards), acceptance, Issues +#420, Changelog; Status → draft
- `agent-hub/doctrine/features/INDEX.md` — both rows' status/issues

## Sources read
- `agent-hub/haven/workers/analyst/{manifest.yaml,SOUL.md,recipes/spec_feature.md}`
- `agent-hub/doctrine/domains/PROJECT.md`, `agent-hub/doctrine/MEMORY.md`, `agent-hub/doctrine/features/{INDEX.md,resume-home.md,resume-view-toggle.md}`
- `server/utils/fetchResume.ts` (whitelist incl. `certificates`, `awards`, `career`)
- `server/utils/createPDFAts.ts` (PDF: section order, `formatRange` with `isNoExpiration` → "present", `career` only as headline fallback)
- `types/resume-document.ts` (`Certificate`, `Award`, `GeneralInformation.career: string`; `Resume` interface has no `certificates`/`awards` fields yet)
- `stores/resume.ts` (no certificates/awards/career getter), `composables/useResumeData.ts`, `utils/ResumeAdapter.ts` (`toEducation`, `dateLabel`, `descriptionText`)
- `themes/portfolio-dev/pages/resumeObject/{Index.vue,Hr.vue,Educations.vue}`, `Hero.vue` (positionDesired line)
- `i18n/locales/{vi,en}.json` (`resume.hr.*`)
- `agent-hub/evidence/implementer/2026-10-04/object-parameter-rule-assets/fixtures.cjs` (certificate/award fixture data)
- Live `https://resume-nuxt-vert.vercel.app/api/resume?lang=vi` → 502 FUNCTION_INVOCATION_FAILED (2026-11-22), so the real `career` value and real certificate/award data were not observed.

## Decided from existing conventions (not asked)
- Dates `MM/YYYY` via the education formatter; missing date `--/--`.
- Descriptions plain text, tags stripped (education `descriptionText`), no `v-html`.
- API order kept (PDF does not sort).
- "Empty" = missing/empty array; `career` missing/blank.

## Questions + answers
5. Dev view placement of certificates/awards — (a) two tabs `certificates.json`/`awards.json` · (b) one `achievements.json` tab · (c) append to `educations.json` → **operator 2026-11-22:** (a) Two new tabs
6. What `career` holds and where it shows — (a) hero line under position · (b) hero fallback only when `positionDesired` empty · (c) per view separately → **operator 2026-11-22:** (a) Hero line — no note on what `career` holds, treated as unknown free text
7. HR card order — (a) PDF order (Education, Certificates, Awards, Languages) · (b) appended after Languages → **operator 2026-11-22:** (a) PDF order
8. `isNoExpiration` label — (a) "present" like PDF · (b) localized "no expiration" · (c) start date only → **operator 2026-11-22:** (a) `<start> - present`

## Isolation proof
This spawn received only the issue text, the two feature-doc paths and the branch name from the main session — no implementer reasoning, no diff, no plan. Branch `feature/420`, working tree clean at start; this run wrote only the 3 doctrine docs + this note, no code.

## Round 2 changes
- `resume-home.md`: Behavior 7 note, 14 tweak, 15 (two tabs, consecutive shortcuts), 16 (hero career line), 17 (`isNoExpiration` → present); acceptance rewritten against the mock fixture (with the `grep -c onrender` = 0 guard); edge cases added; Q5–8 answered.
- `resume-view-toggle.md`: Behavior 4 + 12 with the PDF order; acceptance with the exact heading order; edge case.
- Operator rule relayed: do not call production or the real backend again — no network calls in round 2; all data-dependent criteria use the mock fixture.
