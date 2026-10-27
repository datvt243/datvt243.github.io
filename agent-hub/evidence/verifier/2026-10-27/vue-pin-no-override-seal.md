# 2026-10-27 - vue-pin-no-override (SEAL)

- Worker: verifier · Version: 0.1.0
- Node: `vue-pin-no-override` (issue #294, branch `feature/294` off `staging` ae783ff, changes uncommitted)
- Note graded: `evidence/implementer/2026-10-27/vue-pin-no-override-diff.md` (plan: `...-plan.md`)
- Verdict: **SEAL**

## Isolation proof
Separate Agent-tool verifier subagent, task string "You are the agent-hub **verifier** for the datvt243.github.io project, node `vue-pin-no-override` (GitHub issue #294) ... Independently SEAL or REOPEN". Not the implementer's context. I used my own server on :4183, not the implementer's :4184.

## Re-run
full: `npm ci`, `npm ls`, build, lint, typecheck and `npm test` all re-run, plus a prod smoke on :4183. Reason: the coordinator asked for an independent check of a hand-edited lockfile. CI's first step is `npm ci`, so the change affects every future build, the `/release` path included.

## Commands + output (worktree; build and server env = `scratchpad/p0/mockenv.sh`)
```
npm ci → rc=0 (only the usual npm 11 allow-scripts warnings)
npm ls → rc=0
npm ls vue --all → 31 × vue@3.5.44, no other vue version; only non-deduped line "└── vue@3.5.44"
package-lock.json packages keys matching /(^|\/)vue$/ → only node_modules/vue@3.5.44 (others are @floating-ui/vue, @iconify/vue, @unhead/vue)
lock packages[""].dependencies / devDependencies === package.json → true true
git diff --numstat package-lock.json → 1 1 (npm ci left the lock untouched)
npm run build → rc=0, "◆ ✨ Build complete in 15.1s!"
npm run lint → rc=0, "> eslint ." with no findings
npx nuxi typecheck → rc=0
npm test → "Test Files  3 passed (3) / Tests  7 passed (7)" rc=0
.output/server/node_modules/vue/package.json version → 3.5.44
prod :4183: /en 200, /en/projects 200, /en/github 200, /en/contact 200
server log (scratchpad/v294-server.log) grep -c onrender → 0
```

## Independent lockfile checks
- Fresh resolve: I copied package.json and the lockfile to scratch and ran `npm install --package-lock-only`. All package versions came out the same. The only difference was 6 added `@tailwindcss/oxide-wasm32-wasi/node_modules/*` entries. I ran the same thing on the staging baseline ae783ff (with `latest` and the override) and got the same 6-entry drift. So the drift was already there and does not come from this change.
- Nothing else depended on the override. Outside `evidence/`, no file contains `overrides`, `"vue": "latest"` or `vue@latest`. The only override was `vue: latest`.
- CI (`.github/workflows/ci.yml`): Node comes from `.nvmrc` (24, the same as local v24.19.0). It runs npm ci → build → lint → typecheck → test, and I re-ran each of those steps above.

## Criteria
| Criterion | Result |
|---|---|
| 1. npm ci accepts lock; npm ls rc=0, single vue@3.5.44 | met (this pass) |
| 2. Server bundle vue 3.5.44; pages render | met: 3.5.44 and 4 pages returned 200 |
| 3. build/lint/typecheck/test clean | met (this pass) |
| 4. comments per code-comments.md | N/A: only JSON changed and no comments were added |

## Forbidden states / gate / proportionality
No forbidden state hit. Seal gate: none needed (no push, no release). The diff is the smallest one possible: 2 lines in package.json, 1 lock spec line and the diagram row. The implementer was right not to regenerate the whole lock. There was no earlier open row for #294, so `## Supersedes: none` is correct.

## Not checked
The real GitHub Actions run (I only ran the same commands locally, on macOS rather than ubuntu). `npm run generate`. The in-browser UI: there is no UI change, so I only checked the HTTP status codes.
