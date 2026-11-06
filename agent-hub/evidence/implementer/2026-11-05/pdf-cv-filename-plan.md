# 2026-11-05 - pdf-cv-filename (plan)
- Worker: implementer · Version 0.1.0
- Node: `pdf-cv-filename` (`haven/diagrams/dev-loop.prime-mermaid.md`)
- Task: `/todo #393` — "feat(pdf): đặt tên file PDF download theo cvFileName từ API"; branch `feature/393` off `staging` @ e427157

## Hub bytes before: 81192

## Findings
- Backend dependency datvt243/resume-nodejs-api#363 CLOSED via PR #368 (released v2.6.0): `cvFileName` is a top-level Candidate field, returned by the public `GET /api/me/:email` (exclusion-only projection).
- `server/utils/fetchResume.ts` `PUBLIC_FIELDS` whitelist would strip it → must add.
- `server/utils/createPDFAts.ts:273` builds `fileName`; `server/api/generate-pdf.ts` uses it for `Content-Disposition` + cache.
- Cache: generate-pdf's in-memory Map (1 day, keyed by lang) is the only cache on this path — `fetchResume` is called directly, not through `/api/resume`'s cached handler. So criterion "changes after cache expiry" holds with no cache-key change.

## Acceptance criteria clarified
"PDF download có tên theo cvFileName" → measurable via unit test on `pageRenderAts(...).fileName` + `fetchResume` whitelist test (no real Chrome needed for the name).

## Anchors
`server/utils/fetchResume.ts`, `server/utils/createPDFAts.ts`, `types/resume-document.ts`, `tests/fetchResume.test.ts`, new `tests/createPDFAts.test.ts`.
