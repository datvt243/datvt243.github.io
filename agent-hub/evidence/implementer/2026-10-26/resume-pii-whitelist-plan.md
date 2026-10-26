# 2026-10-26 - resume-pii-whitelist (plan)

- Worker: implementer · Version: 0.1.0
- Node: `resume-pii-whitelist` (`haven/diagrams/dev-loop.prime-mermaid.md`, appended last row; slug grepped in both diagram files → 0 hits; no other open row for #280)
- Task: issue #280 "bug(privacy): /api/resume and SSR payload expose salary, birthday, marital status, gender", branch `bug/280` off freshly pulled `staging` (`b7d87cd`), via `/todo "fix P0"` (P0 set: #280 #281 #282 #283; this pass = #280 only)

## Hub bytes before: 78002

## Acceptance criteria (from #280, made command-checkable)
1. `/api/resume` JSON contains none of the keys `salaryDesired`, `birthday`, `marital`, `gender` (checked with `grep -E` against a local prod build).
2. SSR HTML of `/` contains none of those keys.
3. Every field the UI/PDF reads is still present → `/`, `/en?tab=skills`, `/projects`, `/api/generate-pdf?lang=en` render the same content as before (text diff of rendered output).
4. `npm run build`, `npm run lint`, `npx nuxi typecheck` clean.
5. comments per code-comments.md.

## Field inventory (grep of consumers)
- Top level: `firstName`, `lastName`, `email`, `phone`, `address`, `introduction`, `socialMedia`, `generalInformation`, `experiences`, `educations`, `projects` (stores/resume.ts, utils/ResumeAdapter.ts, pages/index.vue) + `certificates`, `awards` (server/utils/createPDFAts.ts `pageRenderAts`).
- `generalInformation`: `positionDesired`, `career` (PDF headline fallback), `yearsOfExperience`, `openToWork`, `professionalSkills`, `professionalSkillsGroup`, `personalSkills`, `foreignLanguages`.
- Nested experience/project/education items: kept whole (no private fields in them; `_id` used as list keys).

## Files (expected)
`server/utils/fetchResume.ts` only — single choke point for `/api/resume` and `/api/generate-pdf`.

## Blockers
none (`.env` present locally for `NODE_API`/`MY_EMAIL`; checked at build time).
