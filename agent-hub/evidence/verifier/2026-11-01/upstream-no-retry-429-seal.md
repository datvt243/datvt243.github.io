# 2026-11-01 - upstream-no-retry-429 (SEAL)

- Worker: verifier · Version 0.1.0
- Node: `upstream-no-retry-429` (issue #307), branch `bug/307`, uncommitted diff
- Notes graded: `evidence/implementer/2026-11-01/upstream-no-retry-429-plan.md`, `evidence/implementer/2026-11-01/upstream-no-retry-429-diff.md`
- Verdict: **SEAL**

## Isolation proof
This pass was spawned through the Agent tool by `/todo`, with a task string that begins "You are the VERIFIER pass of this repo's agent-hub, run from `/todo` as a separate subagent with a clean context (NeverVerifyOwnWork)" and asks to grade node `upstream-no-retry-429` from the two notes above. The implementer's task string (copied verbatim in the plan note) is the #307 "investigate: no HTTP 429 ..." text, so the two are different. This context did not write the diff. Caveat: both passes use the same session scratchpad directory (`.../adee8ad7-.../scratchpad`), so that path proves nothing by itself. My re-run outputs are in a separate `scratchpad/v307/`.

## Re-run: partial
Reason: outward-facing. The change is error handling on fetches to external upstreams (resume backend, GitHub, blog API), which is the "outward-facing" exception in `verify_seal.md` "Re-run scope". Re-ran with a warm cache (no cold rebuild): `npm run lint`, `npx nuxi typecheck`, `npm test`, `NODE_API=http://127.0.0.1:4199 NUXT_PUBLIC_NODE_API=http://127.0.0.1:4199 npm run build`, the implementer's `scen.sh` for 6 AFTER scenarios, the implementer's `ui.mjs` headless check, plus one extra HTML check of `/en/blogs/<id>` on a 429. Every upstream call went to the local mock `127.0.0.1:4199` (each one is in the `HIT` lists below). No real upstream was called. Before running, I confirmed nothing was listening on 4188/4199, and nothing was left listening afterwards.

## Command check (step 4)
The note's commands match `doctrine/MEMORY.md` exactly: `npm run build`, `npm run lint`, `npx nuxi typecheck`, `npm test`. All four outputs are in the note in full. Step 5: nothing is truncated. The build log is given in full (147 lines), and its one WARN existed before this diff and is cited.

My re-run, verbatim:
```
> nuxt-app@1.8.0 lint
> eslint .

lint=0
ℹ Nuxt Icon server bundle mode is set to local
[nuxt:icon] ✔ Nuxt Icon discovered local-installed 3 collections: fe, grommet-icons, heroicons
typecheck=0
 Test Files  6 passed (6)
      Tests  14 passed (14)
test=0
71: WARN  node_modules/.cache/nuxt/.nuxt/dist/server/_nuxt/components-BA7Pw5lr.js (369:0): A comment
◆ ✨ Build complete in 14.0s!
build=0
```
The WARN is at line 71, the same line the implementer cites.

## Simulation re-run (fresh server + mock per scenario, `scen-verifier.txt`)
```
########## MODE: resume=429 gh=ok blog=ok
--- GET /
HTTP/1.1 502 Unable to load resume data
--- upstream hits (mock.log):
HIT resume 429 noauth /api/me/votan.it@gmail.com?lang=vi
########## MODE: resume=ok gh=429 blog=ok
--- GET /en/github
HTTP/1.1 502 Unable to load GitHub data
--- upstream hits (mock.log):
HIT gh 429 auth /gh/users/datvt243/repos?sort=pushed&per_page=100
HIT gh 429 auth /gh/users/datvt243
########## MODE: resume=ok gh=403rl blog=ok
--- GET /en/github
HTTP/1.1 502 Unable to load GitHub data
--- upstream hits (mock.log):
HIT gh 403rl auth /gh/users/datvt243
HIT gh 403rl auth /gh/users/datvt243/repos?sort=pushed&per_page=100
########## MODE: resume=ok gh=403bad blog=ok
--- GET /en/github
HTTP/1.1 200 OK
<title>Github — Võ Tấn Đạt</title>
<h1 class="sr-only">Github</h1>
--- upstream hits (mock.log):
HIT gh 403bad auth /gh/users/datvt243/repos?sort=pushed&per_page=100
HIT gh 403bad auth /gh/users/datvt243
HIT gh 403bad noauth /gh/users/datvt243/repos?sort=pushed&per_page=100
HIT gh 403bad noauth /gh/users/datvt243
########## MODE: resume=ok gh=ok blog=429
--- GET /blogs
HTTP/1.1 503 Unable to load posts
--- upstream hits (mock.log):
HIT blog 429 noauth /blog/api/v1/post/?category&page=1&per_page=20
HIT blog 429 noauth /blog/api/v1/categories
########## MODE: resume=ok gh=ok blog=429
--- GET /blogs/507f1f77bcf86cd799439011
HTTP/1.1 429 Unable to load post
--- upstream hits (mock.log):
HIT blog 429 noauth /blog/api/v1/post/detail/507f1f77bcf86cd799439011
```
This matches the note's AFTER block hit for hit. The BEFORE baseline in the note (12 categories calls and 2 posts calls per `/blogs` render, 4 GitHub calls per `/en/github` render) is the amplification the diff removes.

## UI re-run (`ui.mjs`, headless Chrome, fresh profile, `ui.txt`)
```
status 502
A gh=429 /en/github {"vis":"visible","url":"/en/github","code":"502","h1":"Something went wrong on our side","retryBtn":true,"catErr":null,"catLinks":0}
status 503
B blog=429 /blogs {"vis":"visible","url":"/blogs","code":"503","h1":"Đã có lỗi phía máy chủ","retryBtn":true,"catErr":null,"catLinks":0}
status 200
C posts cached, categories=429 /blogs {"vis":"visible","url":"/blogs","code":null,"h1":"_blog","retryBtn":false,"catErr":"Không tải được danh sách chuyên mục.","catLinks":0}
status 200
D all ok /blogs {"vis":"visible","url":"/blogs","code":null,"h1":"_blog","retryBtn":false,"catErr":null,"catLinks":1}
pageerrors []
exit=0
```
Extra check, `/en/blogs/507f1f77bcf86cd799439011` with `blog=429`, `curl -H 'Accept: text/html'` → `429`. The page contains `<h1 class="my-2 font-bold text-2xl">Something went wrong on our side</h1>`, `<span>429</span>` inside `status-code`, and `Try again`. The mock logged exactly 1 hit (`HIT blog 429 noauth /blog/api/v1/post/detail/507f1f77bcf86cd799439011`).

## Acceptance (step 7)
| Criterion | Evidence | OK |
|---|---|---|
| 1 upstream call per URL per failed SSR render on 429 | Re-run above: `/` 1, `/en/github` 2 (user + repos, once each), `/blogs` 1 categories + 1 posts, `/blogs/<id>` 1 | yes |
| 403 rate limit: no unauthenticated fallback; 403 bad token: fallback still works | `403rl`: 2 `auth` hits, no `noauth`, 502. `403bad`: 2 `auth` + 2 `noauth`, 200 | yes |
| Clear error state, not "No data" and no crash | UI A/B: status code + retry button. C: sidebar's own error text. `/blogs/<id>`: error page with 429 + Try again. `pageerrors []` | yes |
| build / lint / typecheck / `npm test` clean | Note and re-run both show `build=0` `lint=0` `typecheck=0` `test=0` (14/14). Unit tests cover only pure functions, so they are not proof of this behaviour | yes |
| `retry: 0` at each site, `fetchWithRetry` removed | Note's diff shows 6 `retry: 0` sites and the deleted file + barrel line. Grepping `fetchWithRetry` across the source dirs finds no remaining reference | yes |
| comments per code-comments.md | Note's Acceptance row cites the 2 added `//` comments, each a one-sentence WHY with no issue reference. No rule broken | yes |

## Claim: three issue rows already fixed
The plan's table re-check names the code that fixes each row: `fetchResume.ts` `retry: 0` + 502 (#281/#282), `fetchGithub.ts` 403 classification (#330, 3 unit tests), `posts.ts` 503 (#287). The note's BEFORE run backs this up: at `d1f2004`, `GET /api/resume` made 1 hit and returned 502, and `GET /api/github` made 2 hits, while `403rl` made no `noauth` calls on the server path. Accepted.

## Supersedes check (step 7b)
The only other #307 row on the active diagram is `github-no-retry-5xx`, a SEALED pointer row. The note's `## Supersedes: none` is correct.

## Forbidden states (step 8)
- `ADHOC_WORK`: no. The node row exists (IN_PROGRESS).
- `NO_EVIDENCE`: no. Both notes are present.
- `EDIT_UNVERIFIED`: no. Outputs are verbatim, and my re-run reproduced them.
- `CODE_IN_HAVEN`: no. The only change under haven is the diagram row.
- `DIAGRAM_DRIFT`: no. The row was appended and is updated here.

forbidden_hit: null

## Seal gate (step 9)
Nothing was committed, pushed, or opened as a PR. `utils/fetchWithRetry.ts` is only staged as deleted in the working tree. Precedent: `remove-unused-deps-helpers-seal.md` (2026-11-01) treated staged-only deletions the same way. The operator's `/todo` claim names the deletion explicitly. A real commit/PR still has to go through `/ship` or the operator.

## Proportionality (step 10)
The diff only adds `retry: 0` options and deletes a helper that had a single caller. Out-of-scope items are listed under "Noticed, not done" and left unchanged: the `/blogs/[id]` 429 pass-through status, categories having no timeout, and the 429/403 status that `/api/github` and `/api/blogs/categories` pass through. `Retry-After` forwarding, a PDF rate limit, and the live `GITHUB_TOKEN` check are listed under "Still open".

## Note for the operator (not a gap)
`/blogs/<id>` answers HTTP 429, not 5xx, on an upstream 429. It is unverified whether Vercel ISR serves the last good page for a 4xx. The implementer recorded this under "Noticed, not done". It is a good follow-up node.

## PM status (step 12)
`upstream-no-retry-429` IN_PROGRESS → SEALED. The full row is appended to `dev-loop-archive.md`, and the active row is collapsed to a pointer. That makes 21 pointer rows, so the oldest, `mobile-experience-touch-kbd`, was removed from the active file (its full row is already in the archive).
