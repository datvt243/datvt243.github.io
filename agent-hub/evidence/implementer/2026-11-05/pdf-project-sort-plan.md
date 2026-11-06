# 2026-11-05 - pdf-project-sort (plan)
- Worker: implementer · Version 0.1.0
- Node: `pdf-project-sort` (`haven/diagrams/dev-loop.prime-mermaid.md`)
- Task: `/todo #394` — "feat(pdf): sort project trong PDF theo loại company → personal"; branch `feature/394` off `staging` @ 0974acb

## Hub bytes before: 81180

## Findings
- Backend dependency datvt243/resume-nodejs-api#361 CLOSED 2026-11-05T11:27:02Z.
- Live `GET /api/me/<email>` now returns `type` + `experienceId` per project: all 3 are `personal`, `experienceId: null` (curl'd 2026-11-05).
- `server/utils/createPDFAts.ts` `projectHtml` maps `projects` in API order (no sort).
- `stores/resume.ts:44` `projects` getter (web `/projects`) sorts `startDate` desc only.
- `server/utils/fetchResume.ts` `PUBLIC_FIELDS` picks top-level keys only → nested project fields (`type`, `experienceId`) pass through untouched; no whitelist change.
- PDF cache: `server/api/generate-pdf.ts:18` `const cache = new Map(...)` — module-level in-memory, gone on every deploy/cold start.

## Acceptance criteria clarified
"PDF hiển thị company trước personal, mới nhất trước" → measurable via `npm test` on the order of titles in `pageRenderAts(...).html`; cache criterion → confirmed by code reading (no runtime proof possible pre-deploy).

## Anchors
new `utils/sortProjects.ts`, `server/utils/createPDFAts.ts`, `stores/resume.ts`, `types/resume-document.ts`, new `tests/sortProjects.test.ts`.

## Out of scope (issue's "tuỳ chọn")
Group sub-headings and showing the linked Experience's company name — not in acceptance criteria.
