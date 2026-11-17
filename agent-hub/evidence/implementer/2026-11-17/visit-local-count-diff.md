# 2026-11-17 - visit-local-count (diff) — sealed_pending_verifier
Worker: implementer · Version: 0.1.0 · Node: haven/diagrams/dev-loop.prime-mermaid.md → `visit-local-count` (IN_PROGRESS)
Task: /todo #389 "API visit không đếm khi chạy local" · branch `bug/389` (off staging)
Plan: `evidence/implementer/2026-11-17/visit-local-count-plan.md` (approach there = loopback-IP skip; REPLACED after review, see ## Review)

## Hub bytes before: 95181
## Feature doc: agent-hub/doctrine/features/visit-tracking.md (Behavior 7; #389 criteria) — doc not changed by this diff

## Diff (code)
- `server/api/visit.post.ts`: the backend `$fetch` now runs only `if (process.env.VERCEL)`, with a one-line WHY comment
  `// Only the deployed (Vercel) runtime records: local runs (dev/preview) would land in production stats.`
  Response unchanged (single exit: `setResponseStatus(event, 204); return null`).
- `CLAUDE.md` (root), `/api/visit` bullet: + "Local runs (dev/preview) never record visits: the relay only forwards when `VERCEL` is set (Vercel's runtime), otherwise it just answers 204."
- Not mine, already dirty before /todo started: `.claude/skills/issues-ls/SKILL.md` (M), `.vercel/` (??) — exclude from this node's commit.

## Commands (doctrine/MEMORY.md, verbatim), env NODE_API=NUXT_PUBLIC_NODE_API=http://localhost:4789
- `npm run build` → exit 0, `◆ ✨ Build complete in 15.0s!`; no error lines (grep for ERROR/[error]/error TS empty).
- `npm run lint` → exit 0 (eslint, 0 errors).
- `npx nuxi typecheck` → exit 0, `error TS` count 0.
- `npm test` → `Test Files  10 passed (10)` / `Tests  28 passed (28)` (unit suite = pure functions only, not proof of this change).

## Real runs (logging mock :4789 = scratchpad mock.mjs; resume backend never called)
Mock logs every request as `MOCK <method> <url> xff=<x-forwarded-for>`. Browser = debug Chrome :9888 via puppeteer-core, fresh incognito context per run, tab visibilityState=visible.
1. `npm run dev` equivalent (`npx nuxi dev --port 3398`, VERCEL unset), full loads of / /projects /contact /github /blogs:
   `VISITS [5 × "POST http://localhost:3398/api/visit 204"]`, `DIRECT_BACKEND 0`, `mock visit POSTs (dev): 0`, `resume-backend onrender hits: 0`.
2. `npm run preview` equivalent (`node .output/server/index.mjs`, PORT 3399, VERCEL unset), same 5 loads:
   `VISITS [5 × "POST http://localhost:3399/api/visit 204"]`, `DIRECT_BACKEND 0`, `mock visit POSTs this run: 0`.
   + `curl -X POST -H 'x-forwarded-for: 203.0.113.7' :3399/api/visit` → `status=204`, mock visit POSTs `0` (local skip does not depend on client IP → LAN/container runs also skipped).
3. Deployed path simulated: same build, `VERCEL=1 PORT=3400`:
   - 5 loads → `VISITS [5 × "POST http://localhost:3400/api/visit 204"]`, `DIRECT_BACKEND 0`, `mock visit POSTs this run: 5` (one per load).
   - curl with `x-forwarded-for: 203.0.113.7` → `status=204`, mock: `MOCK POST /api/me/votan.it@gmail.com/visit xff=203.0.113.7` (exactly 1).
   - mock MOCK_MODE=500 → `mode=500 status=204 time=0.008819`, `mock calls: 1 | new VISIT:TRACK: 1`.
   - mock MOCK_MODE=slow (7s) → `mode=slow status=204 time=5.007292`, `mock calls: 1 | new VISIT:TRACK: 1`.
   - client nav (router.push /projects, /contact after first load) → `firstLoad=1 afterClientNav=0 url=http://localhost:3400/contact`.
   - `onrender` in both prod-server logs: `0`.
Console errors in every browser run are only `502 (Unable to load resume data)` (+ `503` blog/posts, dev-mode CSP inline-script notices in dev): caused by the mock's empty `{}` resume body and the hardcoded blog API, none mention VISIT:TRACK or /api/visit. Not introduced by this diff (server-only change, relay still 204).

## Root cause of the original report (#389)
From real output: local runs read `.env` `NODE_API=<https://nodejs-resume-api-ts.onrender.com>` (real backend; grep of .env this session; operator's dev PID 24185 had no override on 2026-11-05 — prior plan note). The relay then forwards every local visit with `x-forwarded-for: ::1` (mock showed `xff=::1` for every localhost browser load, 2026-11-05 and today run 3). So local runs wrote loopback-IP visits with empty geo into production stats; since backend 2026-11-09 they are also deduped to one per IP per 24h → the count looks frozen.
NOT confirmed: which of these the reporter saw on 2026-11-05 (before the backend dedup existed) — needs the real backend's records/server log, unavailable (Atlas MCP disabled; real-backend calls forbidden). Candidates kept in `2026-11-05/visit-local-count-plan.md`. With the fix, local runs no longer call the backend at all, so the question is moot for behavior.

## Acceptance
| Criterion | Evidence |
|---|---|
| dev + mock, 5 routes → 0 visit POSTs, no visit console error | run 1 |
| preview + mock → 0 visit POSTs | run 2 |
| one-line WHY comment + root CLAUDE.md line | ## Diff; comment is `//`, WHY, no issue ref (code-comments.md) |
| root cause from real runs | ## Root cause (partially — original 11-05 trigger unconfirmed, stated) |
| build/lint/typecheck/test clean | ## Commands |
| deployed path: one same-origin POST per load, none direct | run 3 |
| relay contract xff 203.0.113.7 → 204 + 1 forwarded with same xff | run 3 |
| mock 500 / >5s → 204, 1 call, 1 VISIT:TRACK | run 3 |
| client nav → no further POST | run 3 |

## Review
`/code-review medium` on the first version (loopback-IP regex skip), 7 findings:
1-3 (correctness: LAN/container local runs still relayed; self-hosted prod behind a same-box proxy would drop all visits; "local" inferred from IP not runtime) → FIXED: switched to `process.env.VERCEL` runtime check; run 2 curl proves a public-IP request on a local run is skipped.
4 (regex misses full-form/hex loopback) → moot, regex removed.
5 (no unit test for IP branch) → moot; remaining branch is a single env check, covered by runs 2/3.
6 (duplicated 204 exit) → FIXED: fetch is guarded, single exit.
7 (CLAUDE.md overclaims vs loopback code) → FIXED: doc now states the VERCEL condition.
Not re-reviewed after the fix (diff shrank to an `if` around the existing fetch).

## Risks / Noticed, not done
- Relies on Vercel exposing `VERCEL` at function runtime (documented Vercel system env var). If prod ever moves off Vercel, visits silently stop — the comment and CLAUDE.md name the condition. Real prod confirmation belongs to #398 (`visit-ip-geo-check`).
- Vercel preview deployments also have `VERCEL` set → they still record (unchanged from before; not "local").
- Separate gap (operator: separate issue, not created): app sends no `{ referrer, profile }` body.

## Supersedes: none
## Still open: `visit-ip-geo-check` (#398) — needs operator's real prod visits from 2 networks.
