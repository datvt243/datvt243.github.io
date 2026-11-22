# 2026-11-17 - visit-tracking (analyst, backfill)

- Worker: analyst · Version: 0.1.0 · Mode: backfill
- Result: round 1 `needs_input` → round 2 `spec_ready`
- Doc: `doctrine/features/visit-tracking.md` (Status: draft) + INDEX row

## Task (verbatim)
document the feature touched by: GitHub issue #389 (bug) "API visit không đếm khi chạy local" — When running the app locally (`npm run dev` / `npm run preview`), visits aren't counted: open a page, the backend visit count doesn't increase. `plugins/VisitTracker.client.ts` calls `POST /api/visit` (client-only, fire-and-forget). `server/api/visit.post.ts` relays to `${NODE_API}/api/me/${MY_EMAIL}/visit` with `x-forwarded-for` = visitor IP, always returns 204; errors are only `console.error('VISIT:TRACK -----', ...)` server-side. To check (cause unconfirmed): is POST /api/visit called? does the server log VISIT:TRACK (5s timeout, rate limit, 4xx/5xx)? where does NUXT_PUBLIC_NODE_API point at runtime (real backend vs mock)? is local IP (::1/127.0.0.1) in x-forwarded-for ignored/deduped by backend? Acceptance criteria: root cause clearly identified; either visits are counted locally, or not counting is intentional and documented (code comment / CLAUDE.md). Related: #398 (aware only, not specced).

## Sources read
- `doctrine/domains/PROJECT.md` (Invariants, Decisions), `doctrine/MEMORY.md`, `doctrine/features/INDEX.md`
- `plugins/VisitTracker.client.ts`, `server/api/visit.post.ts`, `nuxt.config.ts` (runtimeConfig)
- `evidence/implementer/2026-10-26/visit-tracker-proxy-diff.md`
- `.env` NODE_API host only (value redacted): `nodejs-resume-api-ts.onrender.com` = real backend
- Backend repo `../resume-nodejs-api` (read-only): `agent-hub/doctrine/features/profile-visits.md`, `src/candidate_me/index.ts:253-312` (`handlerRecordVisit`, `visitorIp`, `VISIT_DEDUP_WINDOW_MS`), `src/routers/index.ts:125-165`, `git log -S VISIT_DEDUP_WINDOW_MS` → `fa32751` 2026-11-09
- `gh issue view 389/398` → both created 2026-11-05

## Findings (for the implementer, not confirmed by a run)
- Today: local relay forwards `x-forwarded-for: ::1`/`127.0.0.1` (valid IP) to the PRODUCTION backend; backend stores 1 visit per IP per candidate per 24h and answers 200 for repeats → count looks frozen, no log anywhere. Loopback has no geo → empty location.
- But the dedup landed 2026-11-09, after #389 was filed (2026-11-05). So the cause at filing time was something else, not confirmed: candidates are rate limit (429, would log VISIT:TRACK), a runtime `NUXT_PUBLIC_NODE_API` pointing at a mock (see user memory `mock-backend-runtime-env`), or the backend's IP choice before 11-07. Needs a real local run reading the server log.
- Frontend sends no body, so backend `referrer`/`profileId` are always null.

## Questions + answers
1. (#389) Local runs today send visits to the production backend and are counted at most once per 24h per loopback IP (`::1`/`127.0.0.1`), with no location. What should a local run do? (a) not record visits at all when running locally (dev/preview), documented as intentional; (b) record them, and you check counting against a local/mock backend; (c) keep today's behavior and just document it (one count per 24h, into production stats).
2. The backend accepts an optional body `{ referrer, profile }` (visitor's `document.referrer`, the `?profile=` id) and stores them for source/profile stats; this app sends no body, so every visit is stored with `referrer: null`, `profileId: null`. Intended, or should the relay/plugin pass them (separate issue)?

Answers (operator 2026-11-17, relayed by coordinator): Q1 = (a) local runs (dev/preview) must NOT record visits at all, documented as intentional. Q2 = separate issue, out of scope for #389/#398; noted in doc as a known gap (issue not created by analyst).

## Round 2 changes
Doc: Behavior 7 added (no visit recorded on dev/preview; code comment + root CLAUDE.md); #389 acceptance criteria (0 mock visit POSTs on dev and preview, comment + CLAUDE.md, root cause from a real run); relay criteria scoped to deployed/non-local path against a mock; referrer/profile gap under Out of scope; open questions marked answered; Changelog row. Status stays draft (fix spec; verified only by the node's SEAL or operator confirmation of the doc).

## Isolation proof
Separate analyst subagent spawned by the main session's `/worker analyst`; got only the issue #389 summary + #398 title and the instruction to load the analyst bundle. No implementer reasoning or diff in context. No code edited, no diagram touched, no commands with side effects (read-only greps, `gh issue view`).
