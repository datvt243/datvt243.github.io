# 2026-10-26 - github-own-repos-recent (diff)

- Worker: implementer · Version: 0.1.0
- Node: `github-own-repos-recent` (last row of `haven/diagrams/dev-loop.prime-mermaid.md`)
- Task: issue #299 (code part), branch `feature/299` off `staging` 843a936
- Status: `sealed_pending_verifier`

## Hub bytes before
77920

## Diff
| File | Why |
|---|---|
| `server/api/github.ts` | repos URL gets `?sort=pushed&per_page=100`; response `repos: repos.filter((repo) => !repo.fork)` with a `//` WHY (recent own work first; forks crowd it out). |
| `themes/portfolio-dev/pages/github/part/Item.vue` | (REOPEN 1) card date shows `pushed_at`, matching the sort; WHY in the doc comment |
| `haven/diagrams/dev-loop.prime-mermaid.md` | Node row appended |

## Commands + output
```
npm run build → rc=0, "◆ ✨ Build complete in 13.2s!"
npm run lint → rc=0
npx nuxi typecheck → 0 "error TS"
```
(`npm test` not on this branch yet — #300 unmerged.)

## Runtime (prod build :4154, real GitHub API unauthenticated — no GITHUB_TOKEN locally)
```
/api/github: repos 22 forks 0; first ['datvt243.github.io', 'resume-vuejs-website', 'resume-nodejs-api', 'datvt243', 'mrpc-music-player-client', 'vscode-settings']; sorted desc by pushed_at: True
/en/github (CDP :9888 incognito): 22 distinct repo links, same order, hasFork false, console errors []
```
Before (production /en/github, audit): sorted by name, forks included (clean-code-javascript, kickstart.nvim listed).

## Acceptance
| Criterion | Evidence |
|---|---|
| 1. No forks, recent first | API + page lines |
| 2. Filter / no errors | filter code untouched (works on the array it gets); errors [] |
| 3. checks; comments per code-comments.md | rc=0 / 0 TS errors; one `//` WHY, no `(#N)` |

## Still open
#299's non-code part (display name `_daniel`, joke bio, pinned repos) is the operator's own GitHub profile edit → PR uses `Refs #299`, not `Closes`.

## Supersedes
REOPEN 1 (`evidence/verifier/2026-10-27/github-own-repos-recent-reopen.md`): cards showed `updated_at` while the list sorts by `pushed_at`, so visible dates were out of order (e.g. card 6 `vscode-settings` 10/26/2026 under card 5's 8/9/2026). `themes/portfolio-dev/pages/github/part/Item.vue` now shows `pushed_at`, with a WHY in its doc comment.

## Noticed, not done
- More than 100 repos would need pagination (25 today).
- The cached handler (12 days) keeps the old list on a warm instance until it expires or the next deploy.

## Seal gate
none.

REOPEN 1 re-check: build=0 lint=0 typecheck=0; SSR `/en/github` on :4155 → `22 dates; non-increasing: True` (parsed every "Updated on" date in card order).
