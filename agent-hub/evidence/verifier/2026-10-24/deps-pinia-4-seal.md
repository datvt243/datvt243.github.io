# 2026-10-24 - deps-pinia-4 (SEAL)

- Worker: verifier · Version: 0.1.0
- Node: `deps-pinia-4` (`haven/diagrams/dev-loop.prime-mermaid.md`)
- Evidence judged: `evidence/implementer/2026-10-24/deps-pinia-4-diff.md`, the whole file including `## Rework 1` (+ `-plan.md`)
- Previous verdict: `evidence/verifier/2026-10-24/deps-pinia-4-reopen.md` (missing: 0 hydration warnings)
- New PM status: `SEALED`. Row archived to `haven/diagrams/dev-loop-archive.md`, pointer left in place.

## Isolation proof
Separate subagent spawned through the Agent tool by `/todo` after the REOPEN, description
`"Verifier pass deps-pinia-4 round 2"`, with a fresh context. This pass did not write the diff,
and it is not the round-1 verifier (whose description was `"Verifier pass deps-pinia-4"`).

## Reasoning
| Criterion (node row) | Evidence in note | Judgment |
|---|---|---|
| `npm ls` 4.1.x / 1.0.x | `@pinia/nuxt@1.0.3` → `pinia@4.1.0 deduped`. Spot-check after the A/B restore: `npm ls` again shows `@pinia/nuxt@1.0.3`, `pinia@4.1.0` | met |
| build clean | rc=0, `└  ✨ Build complete!`. The only warning is the i18n one, which was there before the change | met |
| lint clean | rc=0, 0 problems | met |
| typecheck clean | rc=0, 0 `error TS`. Rework adds the verbatim last line, `✔ Nuxt Icon discovered local-installed 3 collections: fe, grommet-icons, heroicons`, with exit `0` | met |
| npm audit before/after | 60 → 60 | met |
| store data renders on `/`, `/projects`, `/en` | prod CDP + dev CDP: `hasPinia:23`, the `/projects` sample lists projects, `/en` `lang:"en-US"` | met |
| real click-nav | `projects link found: true`, then `click()` → `path:"/projects"` | met |
| 0 console errors | prod run: `console issues: none`, excluding only VisitTracker CORS, which round 1 already accepted. Dev run: the only entry is a `warn`, not an error. See the A/B row below | met |
| **0 hydration warnings** (the REOPEN item) | Dev server (`npx nuxi dev --port 3998`) on `/`, `/projects` (click), `/en`: `hydration msgs: 0 []`. Spot-check of the cited script `scratchpad/cdp-pinia-dev.cjs`: the `console` listener is attached before the first `goto`, and the `/hydrat/i` match runs on every message type, before the CORS filter. So the 0 is a real count, not a filtered one. SSR hydration happens on `/` and `/en` (direct loads). `/projects` is reached by SPA nav, so it is not hydrated. That matches how the criterion pairs it with click-nav | met |
| dev warning `api-resume` "different handler" is pre-existing | Read-only spot-check of the cited facts: `git grep api-resume` finds `pages/index.vue:18` and `themes/portfolio-dev/pages/projects/Index.vue:11`, two different arrow handlers. `git diff --stat staging -- '*.vue' '*.ts'` is empty. `git log -1` on `projects/Index.vue` gives `19fc36c 2026-10-04`. The warning comes from the Nuxt `useAsyncData` key/handler check in source this branch does not touch. On top of that, the A/B on staging deps (`pinia@2.2.4`) reproduced it identically. The reasoning holds | met (out of scope, logged under Noticed) |
| comments per code-comments.md | N/A. The diff is `package.json`, the lockfile and the diagram row; no source comments | met |
| Supersedes check (7b) | `## Supersedes: none`; `#265` has only this row | met |

Forbidden states: none hit. On SEAL, the diagram row is updated in place, so there is no `DIAGRAM_DRIFT`.
Seal gate: no outward-facing action in the note, so none is needed. The A/B
`npm install` swaps were local and restored: `git diff HEAD -- package.json` again shows only the 2 pinia lines.
Proportionality: `package.json` (2 lines), the lockfile and one diagram row. Minimal.

## Re-run
`none`. No build, lint, typecheck or CDP re-run. Read-only spot-checks only:
`git grep -n api-resume`, `git diff --stat staging -- '*.vue' '*.ts'`,
`git diff HEAD -- package.json`, `npm ls pinia @pinia/nuxt`, `git log -1` on
`projects/Index.vue`, and reading the cited `cdp-pinia-dev.cjs` script. No network calls.
