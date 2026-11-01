# 2026-10-31 - pages-nojekyll (diff)

- Worker: implementer · Version: 0.1.0
- Node: `pages-nojekyll` (last row of `haven/diagrams/dev-loop.prime-mermaid.md`)
- Task: issue #335, branch `bug/335` off `staging` 1ec9224. Root cause + acceptance: `pages-nojekyll-plan.md`.
- Status: `sealed_pending_verifier`

## Hub bytes before
80114

## Diff
| File | Why |
|---|---|
| `.nojekyll` (new, 0 bytes) | Tells the legacy Pages build to skip Jekyll and serve files as-is, so Liquid never parses the evidence notes |
| `haven/diagrams/dev-loop.prime-mermaid.md` | Node row appended |

## Output
```
npm run lint → lint=0
npx nuxi typecheck → typecheck=0, `grep -c "error TS"` = 0
npm test →       Tests  11 passed (11)
npm run build → ◆ ✨ Build complete in 28.9s!
git check-ignore -v .nojekyll → exit 1 (not ignored)
wc -c < .nojekyll → 0
```
(build env NODE_API=NUXT_PUBLIC_NODE_API=http://localhost:4199 mock)

## Browser verification
n/a — no UI change; the file is outside the Nuxt app.

## Acceptance
| Criterion | Evidence |
|---|---|
| 1 empty, tracked-able at root | `wc -c` = 0, `check-ignore` exit 1 |
| 2 checks | Output block |
| 3 Pages green | NOT verified — needs the next `/release` to `main`, then `gh run list --workflow pages-build-deployment` |
| comments per code-comments.md | no comments added |

## Supersedes: none

## Still open
- Criterion 3 (Pages build green) — only observable after release to `main`.

## Noticed, not done
- With Jekyll off, Pages serves the repo root as-is; there's no `index.html` at root, so datvt243.github.io may 404 instead of the old Jekyll-rendered README. Not measured. If that page isn't wanted, turning Pages off is the cleaner follow-up.

## Seal gate
none (commit/push left to `/ship`)
