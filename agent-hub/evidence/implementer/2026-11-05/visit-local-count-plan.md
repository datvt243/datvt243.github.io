# 2026-11-05 - visit-local-count (plan, blocked)
Worker: implementer · Version: 0.1.0 · Node: haven/diagrams/dev-loop.prime-mermaid.md → `visit-local-count`
Task: /todo #389 "API visit không đếm khi chạy local" (branch bug/389)

## Hub bytes before: 80592

## Outcome: blocked — no diff

## Investigation (real output)
- Operator's dev server PID 24185 (`nuxt dev`, :3000) has no NODE_API/NUXT_PUBLIC_NODE_API override → uses `.env` NODE_API=https://nodejs-resume-api-ts.onrender.com (real backend).
- Repro in a detached worktree, dev :3389, NODE_API + NUXT_PUBLIC_NODE_API = local mock :4789 (0 real-backend calls):
  - `curl -X POST :3389/api/visit` → `204`; mock: `MOCK POST /api/me/votan.it@gmail.com/visit xff=::1`
  - headless Chrome (fresh profile) load `/contact` → `BROWSER POST http://localhost:3389/api/visit` / `STATUS 204`; mock got a 2nd `POST .../visit xff=::1`
  → plugin fires, relay forwards, IP sent is `::1`. App side works locally.
- Backend (resume-nodejs-api origin/main d2f62e7, v2.6.1): `handlerRecordVisit` (src/candidate_me/index.ts:242-264) always `Visit.create`s; `visitorIp` takes leftmost XFF if `isIP` → `::1`; geoip(`::1`) → null → location ''. `visit.model.ts`: ip/location plain String default '' — nothing rejects `::1`. No dedicated limiter on the route (only global `rateLimitMiddleware`).
- By code, a local visit should be stored (ip `::1`, empty location, so it lands in stats' `country: null` bucket). Not reproduced; cause unconfirmed.

## Blocker
Need the real backend's stored records for a local visit. Atlas MCP: "MCP access is disabled for every MongoDB Atlas organization this user belongs to". Real POST from here rejected by the no-real-backend rule.

## Candidates to confirm (operator)
1. Visit IS stored, but shows under country "null"/no location → looks "not counted" in a country/location view.
2. Global backend rate limit (shared 100/15min) → 429, visible only as `VISIT:TRACK -----` in the dev terminal.
3. Issue filed 03:31Z, before backend v2.6.1 (11:59Z) — re-test on current backend.

## Supersedes: none
