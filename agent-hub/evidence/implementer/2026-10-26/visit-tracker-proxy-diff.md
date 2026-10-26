# 2026-10-26 - visit-tracker-proxy (diff)

- Worker: implementer · Version: 0.1.0
- Node: `visit-tracker-proxy` (`haven/diagrams/dev-loop.prime-mermaid.md`, last row)
- Task: issue #285, branch `bug/285` off `staging` a3d27c1
- Status: `sealed_pending_verifier`

## Hub bytes before
77964

## Diff
| File | Why |
|---|---|
| `server/api/visit.post.ts` (new) | Same-origin relay: POSTs to `${NODE_API}/api/me/${MY_EMAIL}/visit` with `x-forwarded-for: <visitor ip>` (`getRequestIP(event, { xForwardedFor: true })`), `timeout: 5000`, `retry: 0`; upstream failure only `console.error`'d; always 204. |
| `plugins/VisitTracker.client.ts` | `$fetch('/api/visit', { method: 'POST', retry: 0 })` instead of the cross-origin backend URL; dropped the now-unneeded `NODE_API`/`MY_EMAIL` guard; header comment updated (why client-only, why relay). |
| `haven/diagrams/dev-loop.prime-mermaid.md` | Node row appended |

## Commands + output
```
source scratchpad/p0/env.sh
npm run build → rc=0, "◆ ✨ Build complete in 12.9s!", 1 WARN "components-BKndnV3n.js (369:0): A comment" — same WARN on base (stash) build, pre-existing
npm run lint → rc=0 ("> eslint ." only)
npx nuxi typecheck → 0 "error TS"
```

## Runtime (prod build on :4140, `NUXT_PUBLIC_NODE_API=http://localhost:4199` → `scratchpad/p1/visit-mock.cjs`, logs every `/visit` hit)
```
mode=ok   status=204 secs=0 upstream=[{"method":"POST","url":"/api/me/votan.it@gmail.com/visit","xff":"203.0.113.7"}]
mode=fail status=204 secs=0 upstream=[1 call, same]
mode=slow status=204 secs=5 upstream=[1 call, same]
server log: 2 "VISIT:TRACK" lines (fail + timeout)
```

## Browser (CDP :9888, Chrome/155.0.8059.85, fresh incognito context per run, `scratchpad/p1/visit-ui.cjs`)
`/en`, `/en/projects`, `/en/contact`, `/en/github`, `/en/blogs`: each status 200, `visits: ["POST /api/visit"]` (one, same-origin; no direct backend `/visit` request), `errors: []`. Upstream mock logged exactly 5 POSTs (xff `::1` = local browser).
Before (audit, production): 3 console errors per page (CORS blocked, ERR_FAILED, `VISIT:TRACK ----- FetchError`) — quoted in issue #285.

## Acceptance
| Criterion | Evidence |
|---|---|
| 1. 204 + 1 upstream POST with visitor xff | mode=ok line |
| 2. Upstream 500/timeout → 204, 1 call | mode=fail/slow lines |
| 3. Console clean on 5 pages, 1 `/api/visit` each | visit-ui output |
| 4. build/lint/typecheck; comments | rc=0 / 0 TS errors; one `/** */` WHY block + one `//` line in the route |

## Noticed, not done
- Backend `handlerRecordVisit` uses `req.ip` with no `trust proxy` → it records Render's proxy IP both before and after this change; the forwarded `x-forwarded-for` only helps once the backend trusts it (backend repo, operator's call).
- The old cross-origin POST was a CORS "simple request" (no custom headers), so the backend most likely already recorded visits — only the response was blocked. Visit counts should be unchanged, not newly started.
- No privacy notice added (issue mentions it as optional; not in acceptance).
- The relay is unauthenticated, same as the backend endpoint it replaces — anyone could inflate visit counts before too.

## Seal gate
none (no commit/push/PR in this pass).
