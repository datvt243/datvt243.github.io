# 2026-10-26 - resume-isr-fallback (plan)

- Worker: implementer · Version: 0.1.0
- Node: `resume-isr-fallback` (`haven/diagrams/dev-loop.prime-mermaid.md`, appended last row; slug grepped in both diagram files → 0 hits; no other open row for #282)
- Task: issue #282 "bug: cold start returns 504 on /projects and /api/resume", branch `bug/282` off freshly pulled `staging` (`3e82898`), via `/todo "fix P0"`

## Hub bytes before: 77980

## Observed (live, 2026-10-26)
- Cold: `/projects` 504 after 11.8s, `/api/resume` 504 after 10.5s; warm retry 200 in ~0.5s.
- Upstream rate-limited (`429`, `retry-after`, `x-ratelimit-limit: 100`): `/` stayed up (`x-vercel-cache: STALE`, ISR), `/en` and `/projects` returned **200** with "Unable to load resume data" (no ISR rule matches `/en*` or `/projects`).

## Root causes
1. `routeRules` ISR only on `/`; `prefix_except_default` i18n routes (`/en`, `/en/projects`) and `/projects`, `/api/resume` have none.
2. A failed resume load renders as HTTP 200 (`pages/index.vue` prints `{{ error }}`; projects page renders an empty list). Vercel ISR treats 200 as a successful revalidation → would cache the broken page. Vercel docs (https://vercel.com/docs/incremental-static-regeneration, "On failure"): "If revalidation fails, Vercel keeps serving the existing cached content" — failure = network errors/timeouts, "Any status code other than 200, 301, 302, 307, 308, 404, or 410", runtime errors.
3. `fetchResume()` `$fetch` has no `timeout` and ofetch's default retry (1 for GET) → a slow upstream runs into the platform's function timeout (raw 504); a 429 is retried immediately, doubling upstream calls.

## Approach (smallest, platform-native)
- `nuxt.config.ts` routeRules: `isr: 60` for `/en`, `/projects`, `/en/projects`, `/api/resume` (same value as `/`).
- `composables/useResumeData.ts`: throw a fatal `createError` (status from the fetch error, default 502) when the load fails — single choke point for `/` and `/projects`.
- `pages/index.vue`: drop the now-unreachable `{{ error }}` branch.
- `server/utils/fetchResume.ts`: `timeout` + `retry: 0`.
Rejected for now: a build-time snapshot fallback (covers the first request after a deploy, when the per-deployment ISR cache is still empty) — more code + build depends on the upstream; recorded under "Still open".

## Acceptance criteria clarified
before: "Upstream tắt/chậm → `/`, `/projects`, `/api/resume` vẫn 200 với dữ liệu cũ"
after:
1. Upstream failing (5xx/429/slow) → `/`, `/en`, `/projects`, `/en/projects`, `/api/resume` respond **5xx** (never 200 with an error/empty body) — checked locally against a toggleable mock upstream.
2. Slow upstream → `/api/resume` answers 502 within the configured timeout (well under 10s), not a hang/504.
3. One upstream call per failing fetch (no implicit retry) — mock request counter.
4. Vercel build output declares ISR (prerender config, `expiration: 60`) for `/en`, `/projects`, `/en/projects`, `/api/resume` (`NITRO_PRESET=vercel` build, inspect `.vercel/output`). Stale-on-error itself is Vercel platform behavior (docs above), not reproducible locally.
5. Upstream OK → all routes 200 with unchanged visible text vs `staging`.
6. build / lint / typecheck clean; comments per code-comments.md.

## Files (expected)
`nuxt.config.ts`, `composables/useResumeData.ts`, `pages/index.vue`, `server/utils/fetchResume.ts`.

## Blockers
No `.env`; local runs use the real public values (`scratchpad/p0/env.sh`) or a local mock upstream for failure modes.
