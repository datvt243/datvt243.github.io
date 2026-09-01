# 2026-09-01 — visit-tracking-client-call (diff)

- Worker: implementer
- Version: 0.1.0
- Node: `visit-tracking-client-call` (`haven/diagrams/dev-loop.prime-mermaid.md`)
- Plan: `evidence/implementer/2026-09-01/visit-tracking-client-call-plan.md`

## Diff
| File | Why |
|---|---|
| `plugins/VisitTracker.client.ts` (new) | `.client.ts`-suffixed Nuxt plugin (client-only, mirrors the existing `plugins/ErrorHandler.ts`'s header/style convention). Reads `NODE_API`/`MY_EMAIL` from `useRuntimeConfig().public` (both already wired in `nuxt.config.ts`, no new env var). Guards on either being unset (no-op). Fires `$fetch(\`${NODE_API}/api/me/${MY_EMAIL}/visit\`, { method: 'POST' })`, `.catch()`-logged via `console.error` — never throws, never blocks rendering. |
| `agent-hub/haven/diagrams/dev-loop.prime-mermaid.md` | New node row, `IN_PROGRESS` (implementer state; verifier owns the SEALED transition). |

No other file touched — single new file + diagram row, matches `SmallestDiff`.

## Command
```
npm run build
```
Output (tail): `[nitro] ✔ You can preview this build using node
.output/server/index.mjs`, exit `0`, no `error` lines (confirmed via
`grep -iE "error|✗|fail"` over the full captured log — no real hits,
only unrelated "ℹ" informational lines matching the "error" substring
inside asset filenames like `error-500.mjs`).

```
npm run lint
```
(run under `nvm use` → Node `v24.19.0`, per the recorded Node-version
trap in `doctrine/domains/PROJECT.md`)

Output (tail):
```
✖ 32 problems (0 errors, 32 warnings)
```
Exact match to the last recorded baseline (`blog-posts-shape-fix`
onward) — 0 new warnings from the new file.

## Real UI check via Chrome CDP
`/browser` confirmed a debuggable Chrome already up on `:9888` (reused,
no new instance launched). Started an independent preview server
(`PORT=3980 node .output/server/index.mjs`), confirmed `200` via `curl`.
Wrote a fresh `puppeteer-core` script (`.tmp-v116-check.mjs`, deleted
after use) that connects via `puppeteer.connect({ browserURL:
'http://localhost:9888' })`, navigates to `http://localhost:3980/` with
`waitUntil: 'networkidle0'`, and records every request whose URL contains
`/visit` plus all console errors. Verbatim result:
```json
{
  "hasContent": true,
  "visitRequests": [
    {
      "url": "https://nodejs-resume-api-ts.onrender.com/api/me/votan.it@gmail.com/visit",
      "method": "POST"
    }
  ],
  "consoleErrors": [
    "Failed to load resource: the server responded with a status of 404 ()",
    "VISIT:TRACK ----- JSHandle@error"
  ]
}
```
Reading this honestly, not glossing over the console lines:
- The plugin fires exactly the intended request: one `POST` to the real
  production `NODE_API` at the exact contracted path
  (`/api/me/:email/visit`), confirming criterion 1.
- `hasContent: true` — the real page still renders fully; the visit call
  never blocked or broke anything, confirming criterion 2.
- The 2 console-error lines are BOTH expected, not a bug in this repo:
  the backend's `feat/visit-tracking` branch isn't merged/deployed yet
  (see plan note investigation #4), so production genuinely 404s right
  now — Chrome's own "Failed to load resource: 404" line plus this
  plugin's own `.catch()` logging that same failure are exactly the
  designed fire-and-forget failure path working as intended, not a
  silent crash. This will resolve itself (both lines disappear) once the
  backend branch ships to production — no code change needed on this
  side when that happens.
- Cleanup: preview process killed (own PID via `kill "$(cat
  /tmp/preview-visit.pid)"`), confirmed via `ps aux | grep index.mjs` no
  stray listener remained. Temp script (`.tmp-v116-check.mjs`) deleted.
  `git status --short` re-checked after cleanup — only the 2 real source
  changes remain untracked/modified.

## Acceptance
| Criterion | Evidence |
|---|---|
| Fires one POST to `${NODE_API}/api/me/${MY_EMAIL}/visit` per real page load | CDP `visitRequests` above, exact URL/method match |
| Client-only, never during SSR/ISR | `.client.ts` filename suffix (Nuxt convention, verified by the request only appearing in the browser-side CDP capture, not server-side) |
| Never blocks/throws on failure | `hasContent: true` despite the live 404 — page fully rendered |
| `npm run build` clean | Command/Output above, exit 0 |
| `npm run lint` clean, unchanged baseline | Command/Output above, `32 problems (0 errors, 32 warnings)` — exact match |
| Real UI check via CDP | Command/Output above, fresh script, fresh port |

## Noticed, not done
- The backend's own `feat/visit-tracking` branch is not yet merged into
  `main`/`staging` or deployed to the production `NODE_API` — this
  repo's call is correct against the reviewed contract but will keep
  404ing (harmlessly) until that ships. Outside this repo's scope/reach.
- Backend's own "Noticed, not done" (no `trust proxy` on Express) means
  the real visitor IP may not resolve correctly even once deployed,
  behind Render's reverse proxy. Backend-side, out of scope here.
- The backend also added an authenticated `GET /api/v1/candidate/visits`
  (to read back recorded visits). This repo has no candidate-auth flow
  (it's a public portfolio site, not a logged-in dashboard) — out of
  scope for this node, flagged in case a future "visits admin view" node
  is wanted.

## Seal gate
No outward-facing action taken — no `commit`/`push`. Diff + evidence
ready for the verifier pass; deferred to `/ship` or a manual commit after
SEAL.
