# 2026-11-05 - visit-ip-geo-check

- Worker: implementer · Version: 0.1.0
- Node: `visit-ip-geo-check` (`haven/diagrams/dev-loop.prime-mermaid.md`)
- Task: `/todo #398` — "Verify visit tracking stores the correct IP address and location"
- Branch: `bug/398` (off `staging`, linked via `gh issue develop`)
- Outcome: **blocked** (no verifier pass)

## Hub bytes before
79769

## Investigation (read, not inferred)
| Question from #398 | Finding | Source |
|---|---|---|
| Which XFF hop does the relay forward? | Leftmost: `getRequestHeader(event, "x-forwarded-for")?.split(",").shift()?.trim()`. On Vercel the edge overwrites XFF with the client IP, so leftmost = visitor. | `node_modules/h3/dist/index.mjs:348-361` (h3 `1.15.11`); `server/api/visit.post.ts:10-16` |
| Does the backend read the relay's `x-forwarded-for`? | **No.** `const ip = req.ip \|\| req.socket.remoteAddress` with no `trust proxy` on the Express app → stores the address of whatever connects (Render proxy / Vercel relay). The code comment says so itself: "behind a reverse proxy (e.g. Render) this may resolve to the proxy's address … out of scope to fix here." | `resume-nodejs-api@staging (877a138)` `src/candidate_me/index.ts:252-259` |
| Location correct? | Computed by `geoip.lookup(ip)` on that same wrong IP → wrong/empty too. | same file `:259-260` |
| Rate limit | Same `req.ip` key. | `src/middlewares/rateLimit.middleware.ts:65` |

Root cause: **backend**, not the relay. Already filed as
https://github.com/datvt243/resume-nodejs-api/issues/371 (OPEN, created
2026-11-05T11:34:36Z, body says "Found while checking
datvt243/datvt243.github.io#398" → GitHub cross-links it to #398). Its
"Things to decide" already covers the hop count (Vercel relay + Render proxy)
and spoofing risk.

## Diff
none — no change in this repo is needed or justified (`SmallestDiff`).
Agent-hub only: diagram row added + this note.

## Command
None run: with no code diff there's nothing for build/lint/typecheck/test to
prove. Not claiming `sealed_pending_verifier`.

## Acceptance
| Criterion | Status | Evidence |
|---|---|---|
| (1) ≥2 real visits from different networks: IP + location correct | **Not met, blocked** — known to be wrong until #371 ships; also needs the operator on 2 real networks | backend code above |
| (2) Root cause found (relay vs backend) + fixed here or linked backend issue | Met | resume-nodejs-api#371 |
| (3) Relay still returns 204, never blocks the page | Unchanged (no diff) — `setResponseStatus(event, 204)` + `.catch` | `server/api/visit.post.ts:13-19` |
| comments per code-comments.md | n/a — no code touched | — |

## Supersedes
none (no other row cites #398)

## Still open
`visit-ip-geo-check` itself — reopen as implementer once #371 is deployed:
make 2 prod visits from different networks and quote the stored Visit records.

## Noticed, not done
- Once the backend trusts XFF, the relay's own `getRequestIP(..., { xForwardedFor: true })` is fine on Vercel, but on a non-Vercel host without a header-overwriting proxy a client could spoof its leftmost XFF entry. Not an issue on the current host.

## Seal gate
none — no outward-facing action taken.
