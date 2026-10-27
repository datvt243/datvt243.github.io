# 2026-10-27 - github-no-retry-5xx (plan)

- Worker: implementer · Version: 0.1.0
- Node: `github-no-retry-5xx` (`haven/diagrams/dev-loop.prime-mermaid.md`, appended last row; slug grepped in both diagram files → 0 hits)
- Task: issue #307, GitHub part (operator: "Sửa cả hai"), branch `bug/307` off `staging` ae783ff

## Hub bytes before: 80060

## Plan
- `themes/portfolio-dev/pages/github/Index.vue`: on `useFetch` error throw a fatal 502 (same pattern as `blogs/Index.vue`, #287) — today `data` null crashes the render with a TypeError → 500.
- `fetchGithub` (moved from `server/api/github.ts` to `server/utils/fetchGithub.ts`, like `fetchResume`, so it's unit-testable): `retry: 0` on every call (ofetch otherwise repeats 429/5xx once); unauthenticated fallback only on 401 or a 403 without `x-ratelimit-remaining: 0`.
- `tests/fetchGithub.test.ts`: bad-token fallback, quota-exhausted 403 (no fallback/retry), 429 (no fallback).

## Acceptance criteria
1. `/api/github` failing → `/github` ends as a 5xx without a render crash.
2. GitHub quota/429 → exactly one upstream call per request.
3. Happy path unchanged (22 repos, 0 forks, page 200).
4. build/lint/typecheck/`npm test` clean; new tests fail when the old logic is put back.
