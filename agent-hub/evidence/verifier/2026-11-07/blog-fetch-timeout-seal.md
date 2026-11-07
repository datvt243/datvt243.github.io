# 2026-11-07 - blog-fetch-timeout (verdict)
- Worker: verifier · Version: 0.1.0
- Node: `blog-fetch-timeout` (#416) · Verdict: **SEAL**
- Notes audited: `evidence/implementer/2026-11-07/blog-fetch-timeout-plan.md`, `evidence/implementer/2026-11-07/blog-fetch-timeout-diff.md`

## Isolation proof
Fresh subagent spawned by `/todo #416` pass 2 with the prompt "You are pass 2 of `/todo #416` ... Judge independently: you have NOT seen the implementer's reasoning"; worker args `verifier "#416 Blog categories/detail fetch has no timeout: raw Vercel 504 when the blog API is cold" node=blog-fetch-timeout` — not the implementer's task string.

## Re-run
full — the operator's spawn prompt explicitly asked to "Rerun the checks yourself", and the node is outward-facing (prod API/page status codes). Re-ran build, lint, typecheck, test and the cold-API curl check with my own preload (`<scratchpad>/slow.mjs`, onrender.com fetches hang 30s honouring abort). Also read `git diff server/` once to confirm the note's diff and the #431 exclusion.

## Re-run output (verbatim)
Build:
```
[nitro] ✔ You can preview this build using node .output/server/index.mjs
config 224ms · modules 703ms · app 617ms · types 391ms · client 2.67s · server 1.67s · nitro 8.47s
◆ ✨ Build complete in 14.7s!
```
Lint:
```
> nuxt-app@1.13.0 lint
> eslint .

lint exit 0
```
Typecheck:
```
ℹ Nuxt Icon server bundle mode is set to local
[nuxt:icon] ✔ Nuxt Icon discovered local-installed 3 collections: fe, grommet-icons, heroicons
typecheck exit 0
```
Test:
```
 Test Files  10 passed (10)
      Tests  27 passed (27)
test exit 0
```
Cold API (`PORT=3917 node --import slow.mjs .output/server/index.mjs`):
```
/api/blogs/categories 503 6.021452s
/api/blogs/detail/x 500 6.010708s
/blogs 503 6.107317s
/en/blogs 503 6.018863s
/blogs/x 500 6.020679s
```
Second `/api/blogs/categories` call body (not served from cache — the error re-ran):
```
"statusCode": 503,
"statusMessage": "Unable to load categories",
```

## Criteria
| Criterion | Verdict | Cited |
|---|---|---|
| (1) both `$fetch` carry `timeout: 6000, retry: 0` | met | `git diff`: `{ timeout: 6000, retry: 0 }` in `categories.ts` and `detail/[id].ts` |
| (2) categories → 503 "Unable to load categories", not cached; detail 404 kept, rest re-thrown | met | body above; second call still 503 after ~6s; detail `.catch` unchanged apart from the option |
| (3) cold API → controlled 5xx within ~6s | met | all five URLs 5xx in 6.01–6.11s (baseline in implementer note: 30s) |
| (4) build + lint + typecheck + test clean | met | re-run output above, all exit 0 |
| blog-list.md Behavior #3, blog-post.md Behavior #3 | met | categories error now returns in time (client error text path); detail 404 → 404 / re-throw kept |
| comments per code-comments.md | met | two existing comments extended with a WHY pointer to `cacheGetPost.ts`; no issue refs |
| #431 changes absent | met | `detail/[id].ts:18` `message: 'Missing ID'` and `:42` `name: 'api-resume'` still present |

## Forbidden states
none hit. Seal gate: none needed (no commit/push). Proportionality: 2 server files + 1 diagram row, smallest diff.

## Doctrine proposal
none.

## Feature doc
fix SEAL — `blog-list.md` / `blog-post.md` status unchanged (already verified).

## Note for operator
Detail timeout surfaces as generic 500 "Server Error", not posts' 503 — consistent with blog-post.md Behavior #3 ("re-thrown"); changing it is a spec call. Warm path and real Vercel not checked by either pass.
