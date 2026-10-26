# 2026-10-26 - github-own-repos-recent (plan)

- Worker: implementer · Version: 0.1.0
- Node: `github-own-repos-recent` (`haven/diagrams/dev-loop.prime-mermaid.md`, appended last row; slug grepped in both diagram files → 0 hits)
- Task: issue #299 (code part only). Operator chose "Ẩn fork + sắp theo cập nhật" and keeps the tab in the nav; profile name/bio/pins are the operator's own GitHub edits. Branch `feature/299` off `staging` 843a936.

## Hub bytes before: 77920

## Facts (GitHub API, read-only, 2026-10-26)
`/users/datvt243/repos?sort=pushed&per_page=100` → 25 repos, 3 forks (kickstart.nvim, anonystick, clean-code-javascript). The current call has no params → GitHub's default `sort=full_name`, `per_page=30`.

## Plan
`server/api/github.ts`: request `?sort=pushed&per_page=100`, return `repos.filter((repo) => !repo.fork)`. The page renders the array in order (no client sort) — language filter unchanged.

## Acceptance criteria
1. `/api/github` and `/en/github`: no fork; most recently pushed first.
2. Language filter still works; no console errors.
3. build/lint/typecheck; comments per code-comments.md.
