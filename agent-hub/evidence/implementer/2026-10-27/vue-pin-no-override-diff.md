# 2026-10-27 - vue-pin-no-override (diff)

- Worker: implementer · Version: 0.1.0
- Node: `vue-pin-no-override` (last row of `haven/diagrams/dev-loop.prime-mermaid.md`)
- Task: issue #294, branch `feature/294` off `staging` ae783ff
- Status: `sealed_pending_verifier`

## Hub bytes before
80060

## Diff
| File | Why |
|---|---|
| `package.json` | `vue` `latest` → `^3.5.44`; `overrides` (`vue: latest`) removed — a moving tag made every fresh lock resolve a different vue; no other package needs forcing (see below) |
| `package-lock.json` | Root `dependencies.vue` spec `latest` → `^3.5.44` only |
| `haven/diagrams/dev-loop.prime-mermaid.md` | Node row appended |

## Commands + output (worktree, real `npm ci` — this worktree has its own node_modules)
```
npm ci → rc=0
npm ls vue | grep -v deduped → only the root "└── vue@3.5.44"; 31 lines mention vue@3.5.44, all others deduped
npm ls → rc=0
npm run build → rc=0 "◆ ✨ Build complete in 13.8s!"
npm run lint → rc=0
npx nuxi typecheck → rc=0
npm test → Tests 7 passed (7)
.output/server/node_modules/vue/package.json version → 3.5.44
```
Investigation (on issue #294): a scratch copy with the override removed and a full `npm install --package-lock-only` also resolved a single `node_modules/vue` @ 3.5.44.

## Browser
N/A — no UI change. Smoke: prod build on :4184 (mockenv, `grep -c onrender` = 0): `/en`, `/en/projects`, `/en/github`, `/en/contact` → 200.

## Acceptance
| Criterion | Evidence |
|---|---|
| 1. npm ci / npm ls | `npm ci` rc=0, `npm ls` rc=0, single vue@3.5.44 |
| 2. bundle + render | server vue 3.5.44; 4 pages 200 |
| 3. checks | above |
| 4. comments per code-comments.md | No comments added (JSON has none); N/A |

## Supersedes
none

## Seal gate
none.
