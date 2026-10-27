# 2026-10-27 - github-no-retry-5xx (diff)

- Worker: implementer · Version: 0.1.0
- Node: `github-no-retry-5xx` (last row of `haven/diagrams/dev-loop.prime-mermaid.md`)
- Task: issue #307 (GitHub part), branch `bug/307` off `staging` ae783ff
- Status: `sealed_pending_verifier`

## Hub bytes before
80060

## Diff
| File | Why |
|---|---|
| `server/utils/fetchGithub.ts` (new) | `fetchGithub` moved here (auto-imported in Nitro, importable by tests); `retry: 0`; fallback only for 401 / non-rate-limit 403. `/** */` WHY. |
| `server/api/github.ts` | Local `fetchGithub` removed (now from utils) |
| `themes/portfolio-dev/pages/github/Index.vue` | `error` → `throw createError({ statusCode: 502, fatal: true })`; always 502 even for an upstream 404 so ISR never caches an error. `/** */` WHY. |
| `tests/fetchGithub.test.ts` (new) | 3 cases: 401 fallback (2 calls, both `retry: 0`), 403 + `x-ratelimit-remaining: 0` (1 call, rejects), 429 (1 call, rejects) |
| `haven/diagrams/dev-loop.prime-mermaid.md` | Node row appended |

## Commands + output (worktree; build/server env = `scratchpad/p0/mockenv.sh`)
```
npx nuxi prepare (fresh worktree had no .nuxt/tsconfig.json; CI's npm ci does this via postinstall)
npm test → Test Files 4 passed (4) · Tests 10 passed (10)
npm run build → rc=0
npm run lint → rc=0
npx nuxi typecheck → rc=0, 0 "error TS"
```
Mutation checks (each reverted after):
```
drop "&& !rateLimited" (old: fallback on every 403) → × does not fall back or retry when the quota is exhausted · Tests 1 failed | 9 passed
drop retry: 0 on the token call                    → Tests 1 failed | 9 passed
restored                                            → Tests 10 passed (10)
```

## Browser / HTTP (prod build, mock resume API; GitHub real, read-only)
```
:4182 (normal user)          /api/github → repos 22, forks 0 · /en/github → 200
:4181 (NUXT_PUBLIC_GITHUB_USER=nonexistent → GitHub 404, same error path as 429/403)
                             /api/github → 404 · /en/github → 502, error page "Something went wrong on our side"
                             server log: TypeError 0 (before this change: "Cannot convert undefined or null to object" → 500)
                             api.github.com calls in log: 4 = 2 requests × (user + repos), no repeats
grep -c onrender on both server logs → 0
```

## Acceptance
| Criterion | Evidence |
|---|---|
| 1. 5xx, no crash | bad page 502, TypeError 0 |
| 2. one call on quota/429 | unit tests 2–3 (`toHaveBeenCalledTimes(1)`) |
| 3. happy path | 22 repos, 0 forks, 200 |
| 4. checks + mutation | above |
| 5. comments per code-comments.md | `fetchGithub` doc comment and the page's `/** */` say why (quota, ofetch's default retry, ISR); no `(#N)` refs |

## Supersedes
none

## Still open
- `/api/generate-pdf` has no rate limit (per-instance in-memory cache only); the investigation comment on #307 left it as is unless real abuse shows up. PR uses `Refs #307`.

## Seal gate
none.
