# 2026-11-17 - visit-ip-geo-check (resumed)

- Worker: implementer · Version: 0.1.0
- Node: `visit-ip-geo-check` (`haven/diagrams/dev-loop.prime-mermaid.md`), resumed in place (not a new node)
- Task: `/todo #398`: "Verify visit tracking stores the correct IP address and location"
- Branch: `bug/398` (recreated off `staging` 7ccf521 via `gh issue develop`)
- Outcome: **blocked** (no verifier pass)
- Previous pass: `evidence/implementer/2026-11-05/visit-ip-geo-check-plan.md`

## Hub bytes before
92395

## Feature doc
`doctrine/features/visit-tracking.md` (draft). Behavior #3 (relay forwards `getRequestIP` with `xForwardedFor: true`) and #6 (backend uses the leftmost XFF entry) are the spec. Nothing here contradicts them.

## Re-check since 2026-11-05 (read, not inferred)
| Link in the chain | Finding | Source |
|---|---|---|
| Relay picks the client hop | Unchanged: h3 `getRequestIP` → `x-forwarded-for.split(",").shift().trim()` (or `event.context.clientAddress`) | `node_modules/h3/dist/index.mjs:348-361`; `server/api/visit.post.ts:10,18` |
| Relay is live on production | `main` has the relay (`daec0c9 fix(visit): relay … (#313)`) | `git log origin/main -- server/api/visit.post.ts` |
| Backend reads relay's XFF | **Fixed**: `visitorIp(req)` = leftmost `x-forwarded-for` entry if `isIP`, else `req.ip`; stored IP + `geoip-lite` location come from it. Render's proxy *appends* the Vercel IP, so leftmost stays the visitor. | `resume-nodejs-api` `src/candidate_me/index.ts:278,300-312`; fix commit in tags `v2.6.1`, `v2.7.0`, `v2.7.1` (backend #371/#372) |
| Relay still 204 on prod | `curl -X POST https://resume-nuxt-vert.vercel.app/api/visit -H 'x-forwarded-for: 203.0.113.7'` → `204` | run 2026-11-17 |

**Disclosure:** that curl hit the production relay once. On Vercel the edge overwrites the forged XFF, so it most likely recorded (or deduped) one visit from this dev machine's public IP in production stats. No other production write was made.

## Why blocked
Criterion (1) needs real data I can't reach:
- `mcp__claude_ai_MongoDB_Atlas__atlas-list-clusters` → "MCP access is disabled for every MongoDB Atlas organization this user belongs to (1 total), so no Atlas data is reachable over MCP." An Atlas Organization Owner must enable AI client access, or the operator reads the records directly.
- The backend's visit-stats endpoints need the owner's auth token. I didn't use one, and I didn't take DB credentials from the backend's `.env` without approval.
- A second network (mobile data / VPN in another country) needs the operator's devices.

## Diff
none: no code change in this repo is justified (`SmallestDiff`). Agent-hub only: diagram row note + this note + log line.

## Command
build/lint/typecheck/test not run: no code diff, nothing for them to prove. Not claiming `sealed_pending_verifier`.

## Acceptance
| Criterion | Status | Evidence |
|---|---|---|
| (1) ≥2 real prod visits from different networks store the visitor's public IP + matching location | **Not met, blocked on operator** | above |
| (2) Root cause (relay vs backend) found + fixed or linked | Met: backend, resume-nodejs-api#371, fixed in v2.6.1 | 2026-11-05 note + backend code above |
| (3) `/api/visit` still 204, never blocks the page | Met on production | curl `204` above; `server/api/visit.post.ts` `.catch` + `setResponseStatus(event, 204)` |
| comments per code-comments.md | n/a: no code touched | — |

## What the operator needs to do to unblock
1. Open `/` on production from network A (home Wi-Fi). Note the public IP (e.g. ifconfig.me).
2. Open `/` from network B (mobile data, or a VPN in another country). Note that IP too.
3. Paste the 2 newest `visits` documents (`ip`, `location`, `createdAt`) for the owner's candidate, or enable Atlas MCP access, then re-run `/todo #398`.
Dedup is 1 per IP per 24h, so use IPs that haven't visited in the last day.

## Supersedes
none (the only row citing #398 is this node)

## Still open
`visit-ip-geo-check`: criterion (1), operator data.

## Noticed, not done
- (carried over) A non-Vercel host without a header-overwriting proxy would let a client spoof the leftmost XFF. Not an issue on the current host.

## Seal gate
One outward-facing request (the prod curl above), disclosed. No commit/push.
