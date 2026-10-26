# 2026-10-26 - resume-pii-whitelist (diff)

- Worker: implementer · Version: 0.1.0
- Node: `resume-pii-whitelist` (`haven/diagrams/dev-loop.prime-mermaid.md`, last row)
- Task: issue #280 "bug(privacy): /api/resume and SSR payload expose salary, birthday, marital status, gender", branch `bug/280` off `staging` b7d87cd (via `/todo "fix P0"`)
- Status: `sealed_pending_verifier`

## Hub bytes before
78002

## Diff
| File | Why |
|---|---|
| `server/utils/fetchResume.ts` | `PUBLIC_FIELDS` / `PUBLIC_GENERAL_FIELDS` whitelists + a `pick` helper; `fetchResume()` returns only those fields (`generalInformation` handled as object or array, as the API returns either). Single choke point: `/api/resume` (→ store → SSR payload) and `/api/generate-pdf` both call it. Error handling above it unchanged. |
| `haven/diagrams/dev-loop.prime-mermaid.md` | Node row appended |

## Env note (correction to plan's "Blockers: none")
No `.env` in the repo checkout. Local runs used the real production values read from the live site's public runtime config (`NODE_API:"https://nodejs-resume-api-ts.onrender.com"`, `MY_EMAIL:"votan.it@gmail.com"`, `GITHUB_USER:"datvt243"` in https://resume-nuxt-vert.vercel.app/ HTML) — not invented. Exported as both `X` and `NUXT_PUBLIC_X` (`scratchpad/p0/env.sh`).

## Upstream 429 observed during verification
First baseline capture got `/api/resume` → 502. Direct check: upstream `GET /api/me/<email>` → `HTTP/2 429`, `retry-after: 189`, `x-ratelimit-limit: 100`, `x-ratelimit-remaining: 0`, body `{"success":false,"error":{"code":"RATE_LIMITED",...}}`. Live site at the same time: `/` 200 (`x-vercel-cache: STALE`), `/en` and `/projects` 200 but 24KB with "Unable to load resume data". Waited for `retry-after` to clear (200 after 6 polls), then captured. Recorded for #282 / #307 — not in this node's scope.

## Commands + output
```
rm -rf .nuxt .output node_modules/.cache && npm run build → rc=0, "◆ ✨ Build complete in 13.8s!", WARN count 0
npm run lint → rc=0 ("> eslint ." only)
npx nuxi typecheck → rc=0, 0 "error TS", last line "[nuxt:icon] ✔ Nuxt Icon discovered local-installed 3 collections: fe, grommet-icons, heroicons"
```
Baseline: same build on unchanged `staging` code (rc=0, "Build complete in 14.5s!"), copied to `scratchpad/p0/output-base`.

## Before/after (prod builds side by side: base :4120, fix :4121, `scratchpad/p0/capture.sh` → `/api/resume`, `/`, `/en`, `/en/projects`, `/api/generate-pdf?lang=en|vi`)
```
== base
api keys: "birthday" "emailVerified" "gender" "isPublic" "levelDesired" "marital" "position" "references" "salaryDesired" "slug" "workLocation"
base/html_.html: "gender" birthday levelDesired marital salaryDesired
base/html_en_projects.html: "gender" birthday levelDesired marital salaryDesired
base/html_en.html: "gender" birthday levelDesired marital salaryDesired
== fix
api keys: "position"
fix/html_.html:
fix/html_en_projects.html:
fix/html_en.html:
html_.html visible text identical: True 5500
html_en.html visible text identical: True 5496
html_en_projects.html visible text identical: True 1073
dropped top-level: ['_id', 'birthday', 'deletedAt', 'emailVerified', 'gender', 'isPublic', 'marital', 'position', 'references', 'slug']
dropped generalInformation: ['careerGoal', 'deletedAt', 'education', 'levelCurrent', 'levelDesired', 'salaryDesired', 'workForm', 'workLocation']
kept fields equal: True
cv-en.pdf identical (minus dates): True
cv-vi.pdf identical (minus dates): True
```
`"position"` remaining in the fix JSON = nested `experiences[].position` / `projects[].position` (job titles, rendered); the top-level `position` is in the dropped list.

## Browser verification
N/A — no visual change intended. Evidence of no change: SSR visible text byte-identical on 3 routes and both PDFs byte-identical (minus CreationDate/ModDate), above. Client navigation reads the same `/api/resume` JSON (kept fields equal: True).

## Acceptance
| Criterion | Evidence |
|---|---|
| 1. `/api/resume` has no `salaryDesired`/`birthday`/`marital`/`gender` | `fix` "api keys:" line lists only `"position"` (nested job titles) |
| 2. SSR HTML of `/` has none of them | `fix/html_.html:` empty (also `/en`, `/en/projects`) |
| 3. Rendered content unchanged | "visible text identical: True" ×3; "kept fields equal: True"; both PDFs identical minus dates |
| 4. build / lint / typecheck clean | rc=0 ×3 above, WARN 0, 0 "error TS" |
| 5. comments per code-comments.md | One `/** */` block (>1 sentence, WHY: private fields would otherwise reach the API + SSR payload); no `(#N)` refs; `pick` has no comment (self-explanatory) |

## Supersedes
none

## Still open
none for #280. Related, separate nodes: #281 (skills), #282 (cold start / fallback — the 429 above shows the same failure mode), #307 (429 handling).

## Noticed, not done
- Nested items still carry `candidateId`/`createdAt`/`updatedAt`/`__v` (backend IDs, not personal data) — left as-is (`SmallestDiff`).
- Upstream rate limit (100/window, `retry-after`) can take the live site's non-ISR-stale routes down — belongs to #282/#307.

## Seal gate
none (no commit/push/PR in this pass).
