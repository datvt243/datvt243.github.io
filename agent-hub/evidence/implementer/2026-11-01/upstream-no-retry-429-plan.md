# 2026-11-01 - upstream-no-retry-429 (plan)

- Worker: implementer · Version 0.1.0
- Node: `upstream-no-retry-429` on `haven/diagrams/dev-loop.prime-mermaid.md` (appended row, IN_PROGRESS). The slug is not in `dev-loop-archive.md` (`grep -n "upstream-no-retry-429" agent-hub/haven/diagrams/dev-loop-archive.md` → no match). The only other #307 row is `github-no-retry-5xx`, archived as SEALED (2026-10-27, landed as #330), so this is a new node (LAI-13), not a resume.
- Task (verbatim from `/todo`): GitHub issue #307 "investigate: no HTTP 429 (Too Many Requests) handling for resume, GitHub, PDF and blog upstreams". Re-check each row of the issue's table against current code, simulate an upstream 429 (and a GitHub 403 with `x-ratelimit-remaining: 0`) locally for `/api/resume`, `/api/github` and `/api/blogs/posts`, then fix only what is still actually broken (no auto-retry on 429, honour `Retry-After` where cheap, tell 403 rate-limit from 403 bad token, clear error state, reuse existing mechanisms, PDF rate limit only if trivial, unit test only for non-trivial pure logic).
- Branch `bug/307` off `staging` at `d1f2004`.

## Hub bytes before: 80110

From the `/hub-tokens` script (scratchpad `hub.sh`, a copy of the skill's script): `  = per-session total (implementer or verifier boot load)     80110 B  ~   20027 tok`.

## Table re-check against current code (before any edit)

| Issue row | Code now | Still broken? |
|---|---|---|
| `/api/resume`: any error → 502, uncached, page prints raw error | `server/utils/fetchResume.ts`: `retry: 0`, `timeout: 8000`, failure throws 502 (thrown, so `defineCachedEventHandler` does not cache it). `stores/resume.ts:17` client call `retry: 0`. Page error state via `error.vue` (#286) | No |
| `/api/github`: 403 always falls back to unauthenticated, 429 throws, page renders with `user` undefined | `server/utils/fetchGithub.ts` (#330): `retry: 0`, fallback only on 401 or a 403 whose `x-ratelimit-remaining` is not `'0'`. `themes/portfolio-dev/pages/github/Index.vue:14-16` throws fatal 502 on `error`. 3 unit tests in `tests/fetchGithub.test.ts` | Server side no. But the page's `useFetch('/api/github')` has no `retry: 0`, so ofetch repeats a 429 once during SSR → 2× GitHub calls per failed render (measured below) |
| `/api/generate-pdf`: no rate limit, per-instance cache | Unchanged: module-level in-memory cache per `lang`; data via `fetchResume` (`retry: 0`) | "Consider" item, skipped (see Decision) |
| `/api/blogs/posts`: any error → silent `emptyResult` | `server/api/blogs/posts.ts` (#287): failure → 503; `cacheGetPost.ts` `retry: 0`, `timeout: 6000`. `blogs/Index.vue:36-41` throws fatal on SSR error | Server side no. Page `useFetch` has no `retry: 0` (503 is in ofetch's retry list) |
| (not in the table, same blog upstream) `/api/blogs/categories` | `$fetch` with ofetch's default retry, called from `PostCategories.vue` through `utils/fetchWithRetry.ts` (3 tries, 1s apart), whose inner `$fetch` also retries once | Yes: 3 × 2 × 2 = 12 upstream calls per `/blogs` render on a 429, measured below |
| (not in the table) `/api/blogs/detail/[id]` | `$fetch` default retry; page `useFetch` default retry | Yes, same class |

## Acceptance criteria
1. On a simulated upstream 429, one failed SSR render of `/`, `/en/github`, `/blogs`, `/blogs/<id>` makes exactly one call per upstream URL (mock hit log).
2. GitHub 403 with `x-ratelimit-remaining: 0` → no unauthenticated fallback call; 403 bad token → fallback still works (mock hit log shows `auth` / `noauth`).
3. Limited upstream → error page with status code + retry button (or the sidebar's own error text for categories), not "No data" or a crash (headless browser).
4. `npm run build`, `npm run lint`, `npx nuxi typecheck`, `npm test` clean.

## Files
`server/api/blogs/categories.ts`, `server/api/blogs/detail/[id].ts`, `themes/portfolio-dev/components/PostCategories.vue`, `themes/portfolio-dev/pages/github/Index.vue`, `themes/portfolio-dev/pages/blogs/Index.vue`, `pages/blogs/[id].vue`, `utils/fetchWithRetry.ts` (deleted, only caller is PostCategories), `utils/index.ts`.

## Blockers
None. `MY_EMAIL`, `GITHUB_TOKEN`, `GITHUB_USER` are set in `.env` (values not printed). For runs, `NUXT_GITHUB_TOKEN=fake-token-307` overrides the real token so the authenticated path is exercised against the mock only.
