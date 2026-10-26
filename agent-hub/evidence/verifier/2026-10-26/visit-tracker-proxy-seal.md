# 2026-10-26 - visit-tracker-proxy (verdict: SEAL)

- Worker: verifier · Version: 0.1.0
- Node: `visit-tracker-proxy` (issue #285, branch `bug/285`)
- New PM status: SEALED
- Notes audited: `evidence/implementer/2026-10-26/visit-tracker-proxy-plan.md`, `evidence/implementer/2026-10-26/visit-tracker-proxy-diff.md`

## Isolation proof
This pass ran as a separate subagent, spawned through the Agent tool with the task "You are the agent-hub **verifier** ... Node: `visit-tracker-proxy`, issue #285". The implementer's task string was issue #285 with the operator's "Proxy qua server Nuxt" choice (plan note). This context did not write the diff. The operator's spawn prompt asked me to judge from the code as well as the note, so I read `server/api/visit.post.ts` and `git diff plugins/VisitTracker.client.ts` to check comments and the rate-limit question. That goes beyond the `EvidenceOnly` default, by explicit operator request.

## Reasoning
| Check | Result |
|---|---|
| Step 4: commands match `doctrine/MEMORY.md` | `npm run build`, `npm run lint`, `npx nuxi typecheck`. No `npm test`, no "tests pass". |
| Step 5: truncation | Each command gives rc plus its key line. My re-run below reproduces them. |
| Step 6: behavior evidence | CDP :9888 JSON per page (`status`, `visits`, `errors`) in the note. My re-run below reproduces it. |
| AC1: 204, 1 upstream POST with the visitor's xff | Note: mode=ok line. **Re-run: `204 0.027s`, upstream `[{"method":"POST","url":"/api/me/votan.it@gmail.com/visit","xff":"198.51.100.9"}]`.** |
| AC2: upstream 500/timeout still gives 204, 1 call | Note: fail/slow lines. **Re-run: fail `204 0.009s`, 1 call; slow `204 5.008s`, 1 call (log read 7s after the request, past the 5s timeout, so a retry would have shown). Server log shows 2 `VISIT:TRACK -----` lines (500, TimeoutError).** |
| AC3: no console errors on 5 pages, 1 `/api/visit` each | **Re-run (`visit-ui.cjs http://localhost:4140`, fresh incognito context): `/en`, `/en/projects`, `/en/contact`, `/en/github`, `/en/blogs` each `"status": 200`, `"visits": ["POST /api/visit"]`, `"errors": []`. Mock logged exactly 5 POSTs, xff `::1`.** This meets the issue's only acceptance item, "Console sạch trên cả 5 trang" (console clean on all 5 pages). |
| AC4: build, lint, typecheck | Re-run, all rc=0 (below). |
| AC4b: comments follow code-comments.md | Route: one `/** */` WHY block (why a relay, why xff, why always 204) and one `//` WHY line ("No retry: every call counts against the backend's shared rate limit"). Plugin header: rewritten WHY (why client-only, why the relay). No `(#N)` refs, no stacked `//`, no restating comments. Compliant. |
| Step 7b: Supersedes / Still open | The active diagram has no other #285 row. Nothing to supersede. |
| Step 8: forbidden states | ADHOC_WORK: no, the node row exists. NO_EVIDENCE: no. EDIT_UNVERIFIED: no, typecheck is cited and re-run. CODE_IN_HAVEN: no, only the diagram row is under `haven/`. DIAGRAM_DRIFT: no, the row moves to SEALED here. |
| Step 9: seal gate | No commit, push or PR. "none" is acceptable. |
| Step 10: proportionality | 1 new 21-line route, and the plugin call shrinks (3 lines removed). No extra options or config. In proportion. |
| Rate limit (operator question) | Not worsened. Both hops use `retry: 0`, and the relay has a 5s timeout, so each page load still makes exactly 1 backend call, as before. The old browser POST already had 0 retries, because ofetch does not retry POST by default. The backend has no `trust proxy` (`resume-nodejs-api/src/candidate_me/index.ts:251` comment), so its limiter already keys every visitor on Render's proxy address. Moving the caller to this server does not merge buckets that were separate before. |
| Render blocking (operator question) | No. The plugin's `$fetch` is not awaited, and the 5s wait happens only inside the server function that handles `/api/visit`, never in SSR. |

## Re-run
partial. This change is outward-facing (a new public endpoint that every page load calls), and the operator asked for an independent re-run. With `scratchpad/p0/env.sh` sourced, from a warm cache:
```
npm run build → rc=0, "◆ ✨ Build complete in 15.5s!"
  1 WARN: node_modules/.cache/nuxt/.nuxt/dist/server/_nuxt/components-BKndnV3n.js (369:0): A comment   (same pre-existing warm-cache notice the note reports on base)
npm run lint → "> eslint ." only, no findings
npx nuxi typecheck → rc=0, 0 "error TS"
:4140 restarted on this build (NUXT_PUBLIC_NODE_API=http://localhost:4199), mock visit-mock.cjs:
mode=ok   204 0.027335 upstream=[{"method":"POST","url":"/api/me/votan.it@gmail.com/visit","xff":"198.51.100.9"}]
mode=fail 204 0.008621 upstream=[1 call, same]
mode=slow 204 5.007560 upstream=[1 call, same]
CDP (visit-ui.cjs): 5 pages × {status 200, visits ["POST /api/visit"], errors []}; upstream 5 POSTs
```
The real backend was not called. The :4140 server and the mock are stopped.

## Noted, not blocking
- The root `CLAUDE.md` "Server API" section says every handler uses `defineCachedEventHandler`, except the two it lists. `/api/visit` is now a third exception, and the docs do not mention it. This is a docs-only follow-up.
- Dropping the plugin's `NODE_API`/`MY_EMAIL` guard means a setup without those env vars logs one server `VISIT:TRACK` error per page load instead of skipping silently. It stays harmless: the response is still 204 and the visitor sees no console error.
- The `x-forwarded-for` value comes from the request header. On Vercel the platform sets that header, but anywhere else a client can spoof it. The backend ignores it today (no `trust proxy`). Whoever enables `trust proxy` on the backend has to keep this in mind.

## Missing
none
