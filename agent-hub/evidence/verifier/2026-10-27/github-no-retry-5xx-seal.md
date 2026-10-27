# 2026-10-27 - github-no-retry-5xx (SEAL)

- Worker: verifier · Version: 0.1.0
- Node: `github-no-retry-5xx` (issue #307, GitHub part only; branch `bug/307` off `staging` ae783ff, changes uncommitted)
- Note graded: `evidence/implementer/2026-10-27/github-no-retry-5xx-diff.md` (plan: `...-plan.md`)
- Verdict: **SEAL**

## Isolation proof
Separate Agent-tool verifier subagent, task string "You are the agent-hub **verifier** for the datvt243.github.io project, node `github-no-retry-5xx` (GitHub issue #307, GitHub part only) ... Independently SEAL or REOPEN". This is not the implementer's context. I used my own servers (:4191, :4192), not the implementer's :4181/:4182.

## Re-run
full: build, lint, typecheck, `npm test`, mutation runs, a local ofetch probe, two prod servers and a CDP script. Reasons: the operator's task asked for independent checks. The change is also outward-facing, because it changes the production `/github` status code that ISR depends on. The implementer's note also gives `rc=0` summaries instead of command output.

## Commands + output (worktree; build and server env = `scratchpad/p0/mockenv.sh`, mock :4199)
```
npm test           → Test Files  4 passed (4) / Tests  10 passed (10)
npx eslint .       → no output, lint_rc=0
npx nuxi typecheck → rc=0, grep -c "error TS" → 0
npm run build      → rc=0, "◆ ✨ Build complete in 13.9s!" (log: scratchpad/v307/build.log)
grep -c onrender srv-ok.log srv-bad.log → 0, 0
```

## Mutations (tests/fetchGithub.test.ts, restored after each run; restore confirmed with a diff against a backup)
```
403 fallback without the rate-limit check (old logic) → × does not fall back or retry when the quota is exhausted · 1 failed | 2 passed
every retry: 0 removed (old logic)                    → × bad-token fallback, × quota exhausted · 2 failed | 1 passed
fallback also on 429                                  → × does not fall back on a 429 · 1 failed | 2 passed
```

## Real ofetch behaviour (ofetch 1.5.1, local http server, `scratchpad/ofetch-probe.mjs`)
```
403 + x-ratelimit-remaining:0, {retry:0} → e.statusCode 403, e.response.headers.get(...) "0", hits 1
429, {}  (default)                       → statusCode 429, hits 2   (the default retry the issue describes)
429, {retry:0}                           → statusCode 429, hits 1
```
`FetchError.statusCode` comes from `response.status`, and `FetchError.response` is the real `Response`. So `response?.headers.get('x-ratelimit-remaining') === '0'` reads the header from a real error, not only from the mock the test uses.

## HTTP (prod build; GitHub real and read-only, no token set: 2 requests per server)
```
:4191 (datvt243)           /api/github 200 → repos 22, forks 0, login datvt243 · /en/github 200
:4192 (nonexistent user)   /api/github 404 · /en/github (Accept text/html) 502, <span>502</span>, h1 "Something went wrong on our side"
                           srv-bad.log: grep -c TypeError → 0 (only the expected FetchError 404 from /api/github)
```

## CDP (:9888 incognito, `scratchpad/v307/nav.cjs`, screenshots `scratchpad/v307/nav-{4191,4192}.png`)
The script loads /en, sets `window.__marker`, then clicks `a[href="/en/github"]`. That is a client-side route change: `sameDoc: true` on both servers.
```
4191 {"url":"/en/github","h1":"Github","repoCards":44,"reqs":["200 /en/github/_payload.json"],"errs":[]}
4192 {"url":"/en/github","code":"502","h1":"Something went wrong on our side","buttons":["Try again","Go to the homepage"],"repoCards":0,
      "reqs":["502 /en/github/_payload.json","404 /api/github"],"errs":[502/404 resource loads, "VUE:ERROR ----- [object Object]"]}
```
There was no `pageerror`. `VUE:ERROR` is the existing `plugins/ErrorHandler.ts` logging the intentional `createError`, not a crash. The screenshot shows the themed 502 page with Try again and Go to the homepage.

## Criteria
| Criterion | Result |
|---|---|
| 1. `/api/github` failing → `/github` is a 5xx, no render crash | met: SSR returns 502 with the error page and 0 TypeError. Client navigation shows the 502 error page with a retry button and no pageerror. |
| 2. Quota/429 → one upstream call | met: unit tests 2–3 (`toHaveBeenCalledTimes(1)`). The ofetch probe shows `retry: 0` cuts 2 hits to 1. |
| 3. Happy path unchanged | met: 22 repos, 0 forks, page 200 on SSR and on client navigation |
| 4. Checks clean + tests fail on regression | met: this pass, plus the 3 mutations above |
| 5. Comments per code-comments.md | met: the `fetchGithub` JSDoc and the page's `/** */` explain why (quota, ofetch's default retry, ISR). No `(#N)` refs and no WHAT comments. |

## Forbidden states / gate / proportionality
No forbidden state was hit. Seal gate: none (no push, no release). The diff is 1 new util, 1 removal, 1 page guard, 1 test file and the diagram row. Moving `fetchGithub` to `server/utils` is needed to test it and matches `fetchResume`. No row for #307 was already open on the active diagram, so `Supersedes: none` is correct. The PDF part stays open as `Still open`, so the PR should use `Refs #307`.

## Not checked
- I did not observe a real GitHub 403 or 429, or a request with a real token: no token was set, and I did not use up the quota. Those paths rely on the unit tests and the ofetch probe.
- GitHub's secondary rate limit (403 with `retry-after` and remaining ≠ 0) still makes one unauthenticated fallback call. That is a known, bounded extra call and it is in scope of the operator's rule ("only when remaining is not 0").
- ISR on Vercel keeping the last good page after a 502 was not tested on a deploy.
