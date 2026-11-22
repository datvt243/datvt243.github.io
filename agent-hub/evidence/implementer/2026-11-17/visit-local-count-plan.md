# 2026-11-17 - visit-local-count (plan, resumed)
Worker: implementer · Version: 0.1.0 · Node: haven/diagrams/dev-loop.prime-mermaid.md → `visit-local-count` (PENDING → IN_PROGRESS)
Task: /todo #389 "API visit không đếm khi chạy local" (branch bug/389)

## Hub bytes before: 95181
## Feature doc: agent-hub/doctrine/features/visit-tracking.md (draft; open questions answered by operator 2026-11-17)

## Acceptance (from feature doc, Behavior 7 + criteria)
1. dev + mock: load /, /projects, /contact, /github, /blogs → mock 0 visit POSTs, no console error.
2. preview + mock: same → 0 visit POSTs.
3. One-line WHY comment at the skip + root CLAUDE.md line.
4. Root cause of the original report named from real runs.
5. build/lint/typecheck/test clean.
6. Non-local path (incoming XFF 203.0.113.7) → 204, mock gets exactly 1 POST with xff 203.0.113.7; mock 500/slow → still 204 + 1 VISIT:TRACK line.
7. Client nav → no further POST /api/visit.

## Approach
Skip in the relay (`server/api/visit.post.ts`) when the visitor IP is loopback (`::1`, `127.*`, `::ffff:127.*`): covers dev and preview (both serve localhost), platform-agnostic, and keeps the non-local path testable locally by sending a public XFF. On Vercel the edge sets XFF to the real client IP, so prod is unaffected.
Known limit: a LAN device opening the dev server (private IP, not loopback) would still be relayed — noted.

## Anchors
`server/api/visit.post.ts`, `CLAUDE.md` (root), `plugins/VisitTracker.client.ts` (unchanged).
