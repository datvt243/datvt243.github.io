# 2026-10-31 - pages-nojekyll (plan)

- Worker: implementer · Version: 0.1.0
- Node: `pages-nojekyll` (last row of `haven/diagrams/dev-loop.prime-mermaid.md`)
- Task: issue #335 "chore(ci): GitHub Pages Jekyll build fails on every push to main". Operator picked `.nojekyll` over turning Pages off (AskUserQuestion). Branch `bug/335` off `staging` 1ec9224.

## Hub bytes before
80114 (measured before the node row was appended)

## Root cause
`gh api repos/datvt243/datvt243.github.io/pages` → `{"build_type":"legacy","source":{"branch":"main","path":"/"},"status":"errored"}`. The legacy build runs Jekyll over every `.md` in the repo; run 40504413168 log shows Liquid errors on Vue `{{ t(...) }}` syntax in `agent-hub/evidence/**`.

## Acceptance criteria
1. Empty `.nojekyll` at the repo root, not gitignored.
2. build + lint + typecheck + `npm test` clean.
3. Pages build green: only checkable after the next `/release` puts it on `main` — out of this node's reach, stated as open.

## Files
.nojekyll

## Blockers
none
