# 2026-11-08 - resume-cache-empty (plan)
- Worker: implementer · Version: 0.1.0
- Node: `resume-cache-empty` in `haven/diagrams/dev-loop.prime-mermaid.md`
- Task: "#421 + #419 (one branch bug/421, one PR closing both). #421 Resume API: shorten the 12-day server cache — server/api/resume.ts:21 caches upstream resume 60*60*24*12 s per email+lang; change to ~1 hour (ISR 60s stays); /api/generate-pdf keeps its own 1-day cache. #419 Home: show a message when the resume comes back empty — pages/index.vue renders a blank page when /api/resume returns 200 with an empty resume (isValid false). Operator decision 2026-11-08: make it a FATAL error (same path as the existing upstream-failure 502 throw) so the error page shows and ISR keeps the last good render."

## Hub bytes before: 94007

## Feature doc: doctrine/features/resume-home.md
Behavior #3 (12-day cache) and #5 (upstream failure → 502 → fatal) are the
spec. Both changes were already decided by the operator in its Open
questions 1 + 3 (2026-11-07); the fatal-vs-inline choice for #419 was
answered via AskUserQuestion 2026-11-08: "Fatal error (Recommended)".
Branching answer, same call: "One branch, one PR (Recommended)".

## Anchors
- `server/api/resume.ts:21` — `maxAge: 60 * 60 * 24 * 12`
- `server/utils/fetchResume.ts:61` — `if (!res?.success || !res.data)` → 502;
  `{}` passes it, so an empty resume is returned and cached
- `composables/useResumeData.ts:20-22` — fatal throw on fetch error (already there)
- `pages/index.vue:64,69` — `isValid` guard that renders the blank page
- `server/api/generate-pdf.ts:19` — `CACHE_MAX_AGE_MS` 1 day (leave as is); it also calls `fetchResume`
- `tests/fetchResume.test.ts` — existing unit tests

## Plan
Root cause fix in shared `fetchResume`: treat an empty `data` object like
`success: false` (controlled 502, never cached). `/api/resume`, `/`, `/projects`
and the PDF all get it; the page's existing fatal throw does the rest.
