# 2026-10-26 - resume-isr-fallback (diff)

- Worker: implementer · Version: 0.1.0
- Node: `resume-isr-fallback` (`haven/diagrams/dev-loop.prime-mermaid.md`, last row)
- Task: issue #282 "bug: cold start returns 504 on /projects and /api/resume", branch `bug/282` off `staging` 3e82898 (via `/todo "fix P0"`)
- Status: `sealed_pending_verifier`

## Hub bytes before
77980

## Diff
| File | Why |
|---|---|
| `nuxt.config.ts` | `isr: 60` for `/en`, `/projects`, `/en/projects`, `/api/resume` (only `/` had it; i18n `prefix_except_default` routes and `/projects` were plain SSR). `/** */` WHY block: ISR keeps the last good render on failure only if the failure ends as a 5xx. |
| `composables/useResumeData.ts` | Now `async`; throws a fatal `createError` (fetch error's status, default 502) when the load fails, instead of returning `error`. Single choke point for `/` (pages/index.vue) and `/projects` (themes/.../projects/Index.vue) — both callers already `await` it. `/** */` WHY block. |
| `pages/index.vue` | Drops the now-unreachable `{{ error }}` branch (printed the raw error object) and the unused `error` binding. |
| `server/utils/fetchResume.ts` | `$fetch(..., { timeout: 8000, retry: 0 })`. `/** */` WHY block (fail inside the function budget; retrying a 429/cold start repeats the wait and burns the rate limit). |
| `stores/resume.ts` | `$fetch('/api/resume', { retry: 0 })` — found during verification: ofetch's default GET retry doubled upstream calls per page (9 calls for 5 requests → 5). One `//` WHY line. |
| `haven/diagrams/dev-loop.prime-mermaid.md` | Node row appended |

## Commands + output (final state, after the `stores/resume.ts` addition)
```
source scratchpad/p0/env.sh
rm -rf .nuxt .output node_modules/.cache && npm run build → rc=0, "◆ ✨ Build complete in 13.9s!", WARN count 0
npm run lint → rc=0
npx nuxi typecheck → rc=0, 0 "error TS", last line "[nuxt:icon] ✔ Nuxt Icon discovered local-installed 3 collections: fe, grommet-icons, heroicons"
NITRO_PRESET=vercel npm run build → rc=0, "◆ ✨ Build complete in 13.8s!"  (output inspected below, then `.vercel/` removed — not gitignored, created by this check)
```

## Failure modes (local prod builds vs a toggleable mock upstream `scratchpad/p0/mock.cjs` serving the real resume data; base = `staging` 3e82898 build on :4140, fix on :4141, cold caches)
```
== upstream fail (HTTP 500)
base  4140  /api/resume   502 0.032694s 177B errText=2
base  4140  /             200 0.105632s 24151B errText=1
base  4140  /en           200 0.018683s 24016B errText=1
base  4140  /projects     200 0.029128s 24376B errText=1
base  4140  /en/projects  200 0.014375s 24342B errText=1
   upstream calls for these 5 requests: 18
fix   4141  /api/resume   502 0.035081s 177B errText=2
fix   4141  /             502 0.093474s 153B errText=1
fix   4141  /en           502 0.011768s 155B errText=1
fix   4141  /projects     502 0.013789s 161B errText=1
fix   4141  /en/projects  502 0.008754s 164B errText=1
   upstream calls for these 5 requests: 5
== upstream 429 (retry-after: 120)
base  → same as fail: /api/resume 502, the 4 pages 200 with the error text, 18 upstream calls
fix   4141  /api/resume   502 0.004596s 177B errText=2
fix   4141  /             502 0.008576s 153B errText=1
fix   4141  /en           502 0.008364s 155B errText=1
fix   4141  /projects     502 0.008010s 161B errText=1
fix   4141  /en/projects  502 0.007691s 164B errText=1
   upstream calls for these 5 requests: 5
== upstream slow (responds after 20s)
base  4140  /api/resume   200 20.013897s 10723B errText=0
fix   4141  /api/resume   502 8.006588s 177B errText=2
```
(The base rows in the 429 block are summarized; full base output printed identically to the fail block in the first run. The first fix run, before the `stores/resume.ts` change, showed 9 upstream calls for 5 requests — the reason for that change.)

## Upstream OK — unchanged output (`scratchpad/p0/ok/`, visible text, HTML-unescaped)
```
base/fix /api/resume / /en /projects /en/projects → all 200
_api_resume identical 9604
_ identical 7615
_en identical 7611
_projects identical 1065
_en_projects identical 1063
```

## Vercel build output (`NITRO_PRESET=vercel`, `.vercel/output/functions/*.prerender-config.json`)
```
functions/api/resume-isr.prerender-config.json {'expiration': 60}
functions/en-isr.prerender-config.json {'expiration': 60}
functions/en/projects-isr.prerender-config.json {'expiration': 60}
functions/projects-isr.prerender-config.json {'expiration': 60}
functions/index-isr.prerender-config.json {'expiration': 60}     (pre-existing `/`)
```
`config.json` routes include `(?<__isr_route>/en)`, `/projects`, `/en/projects`, `/api/resume` → their `-isr` functions.
Stale-on-error is Vercel platform behavior, not reproducible locally — https://vercel.com/docs/incremental-static-regeneration, "On failure": "If revalidation fails, Vercel keeps serving the existing cached content", failure = timeouts, "Any status code other than 200, 301, 302, 307, 308, 404, or 410", runtime errors. This diff makes every failed resume render a 502 so it falls in that set.

## Browser verification (CDP :9888, Chrome/155, incognito context — `scratchpad/p0/isr-ui.cjs`, `isr-fail-ui.cjs`)
Upstream OK, real click navigation `/en` → Projects → back:
```
"okStatus": 200, "h1": "Võ Tấn Đạt",
"projects": ["SimpleMDG", "Personal Portfolio", "AiHR – Human Resource Management System"],
"backH1": "Võ Tấn Đạt", "errors": []
```
Then upstream switched to fail on the same server: a fresh load of `/en/projects` still returned 200 with the full projects list — the server's existing `api-resume` cached handler served the last good data (desirable; same "keep last good" behavior at the Nitro level).
Fresh server, cold caches, upstream failing:
```
"/en":          { "status": 502, "text": "502 Looks like you've found the doorway to the great nothing …", "rawErrorObject": false }
"/en/projects": { "status": 502, "text": "502 Looks like you've found the doorway to the great nothing …", "rawErrorObject": false }
```
Screenshot `scratchpad/p0/isr-fail-1280.png`. (Error-page copy is #286's scope.)

## Acceptance
| Criterion | Evidence |
|---|---|
| 1. Upstream failing → resume routes 5xx, never 200 with an error/empty body | fix rows: 502 on all 5 routes for both `fail` and `429`; base rows show the old 200-with-error-text |
| 2. Slow upstream → `/api/resume` 502 within the timeout | `fix … 502 8.006588s` vs base `200 20.013897s` |
| 3. One upstream call per failing fetch | fix "upstream calls for these 5 requests: 5" (base 18) |
| 4. Vercel output declares ISR for the new routes | prerender-config lines above, `expiration: 60` |
| 5. Upstream OK → unchanged | "identical" ×5 |
| 6. build / lint / typecheck clean | rc=0 ×3 (+ vercel-preset build rc=0), WARN 0, 0 "error TS" |
| 6b. comments per code-comments.md | 3 `/** */` WHY blocks (nuxt.config routeRules, useResumeData, fetchResume) + 1 `//` one-liner (stores/resume.ts); no `(#N)` refs |

## Supersedes
none on the diagram. Issue-level: removes `pages/index.vue`'s raw `{{ error }}` output, item 1 of #286 (#286 stays open for `ListRender`, Download button, `error.vue` copy).

## Still open
- **First request after a deploy**: Vercel's ISR cache is per deployment, so if the upstream is down when a fresh deployment gets its first request for a route, there is no stale copy yet → visitors get the 502 error page (instead of the old 200-with-error-text or raw 504). Covering that needs a build-time snapshot fallback — not done here (more code, build would depend on the upstream). Candidate follow-up.
- `/en/github`, `/en/blogs`, `/en/blogs/**`, `/en/contact` have no routeRules either (same `prefix_except_default` gap) — not resume routes, outside #282.

## Noticed, not done
- Vercel deploy itself not observed here (needs push); after merge, `curl -I https://…/en` should show `x-vercel-cache` HIT/STALE/PRERENDER instead of MISS.
- `error.vue` message is a generic 404-style text for a 502 (#286).

## Seal gate
none (no commit/push/PR in this pass).
