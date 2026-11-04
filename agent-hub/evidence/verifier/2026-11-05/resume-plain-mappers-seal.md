# 2026-11-05 - resume-plain-mappers (SEAL)

- Worker: verifier · Version: 0.1.0
- Node: `resume-plain-mappers` (#304, `feature/304`)
- Note judged: `evidence/implementer/2026-11-05/resume-plain-mappers-diff.md`
- Verdict: **SEAL**

## Isolation proof
Separate Agent-tool subagent spawned by the operator session with the task string "You are the VERIFIER worker of the agent-hub ... Run exactly `/worker verifier` for one node ... Judge the implementer note `agent-hub/evidence/implementer/2026-11-05/resume-plain-mappers-diff.md`". This context never saw the implementer pass and did not write the diff (step 1: no refusal).

## Re-run
partial — `npm test`, `npm run lint`, `npx nuxi typecheck`, the criterion-1 grep, the SSR snapshot diff (`r304/snap.sh`) and the browser script (`r304/ui.mjs`) against the `.output` on disk; NOT `npm run build`. Reason: outward-facing node (it changes the production render path of `/` and `/projects`). `.output/server/index.mjs` mtime 01:04:18 is newer than `utils/ResumeAdapter.ts` (01:03:40) and `stores/resume.ts` (01:03:44).

## Re-run output (verbatim)
Server: :4188, `node --import csp/redirect.mjs .output/server/index.mjs`, `NODE_API`/`NUXT_PUBLIC_NODE_API=http://127.0.0.1:4199`, `MY_EMAIL`/`NUXT_PUBLIC_MY_EMAIL=mock@example.com`, GitHub tokens empty, mock `csp/mock.mjs` on :4199. Both killed afterwards.
```
npm test → Test Files  8 passed (8) / Tests  20 passed (20)
lint=0
typecheck=0, grep -c "error TS" → 0
ls models → "models": No such file or directory
grep -rn -E '@/models|~/models|cloneDeep|resumeAdapter\.|class ResumeAdapter' (ts/vue, excl node_modules .nuxt .output agent-hub) | wc -l → 0
grep -c "class " utils/ResumeAdapter.ts → 0
snap.sh vs r304/before/, both build ids (8dcbd25a-…, a0653382-…) normalized → total_diff_lines=0
  (first pass with a narrower `_payload.json?_b=` sed left 2 lines in each of the 6 `?tab=` files; a char-level diff showed only `_payload.json?tab=…&_b=<build id>` and `buildId:"<build id>"`)
experience tab ranges: 12/2024 - present / 05/2024 - 11/2024 / 02/2022 - 05/2024 / 08/2020 - 01/2022
ui.mjs → ui=0, all 7 routes "200 hydrated=true", home dates ["12/2024 - present","05/2024 - 11/2024","02/2022 - 05/2024"], social 5,
  about-me visible links (github, linkedin, website, …), client nav /projects dates ["12/2024 - present","06/2024 - 10/2026"], console msgs 0 []
grep -c onrender v-srv.log → 0; mock HIT lines 12
```

## Criteria
| Criterion | Cited | Re-run |
|---|---|---|
| 1 models/, class, cloneDeep, grep 0 | note Acceptance row 1 | yes, 0 / 0 / missing dir |
| 2 SSR byte-identical (build id normalized) | note "SSR identity" block, total_diff_lines=0 | yes, 0 |
| 3 hydrate, 0 console errors, social links + dates | note "Browser" block | yes, identical output |
| 4 unit test covers mappers incl. labels + `links` | note: 20/20, UTC−10 and UTC+14 runs | `npm test` 20/20 |
| 5 build+lint+typecheck+test | note Output block (build=0 verbatim, one pre-existing WARN) | lint/typecheck/test yes; build not re-run |
| comments per code-comments.md | note row: WHY-only, field docs moved verbatim, no `(#N)` | audited from note |

- Command vs `doctrine/MEMORY.md`: all 4 match; Typecheck row has no `baseline:`.
- Output not truncated. `## Supersedes: none`; the only #304 row on the active diagram is this node.
- Forbidden states: none hit. Seal gate: no outward action (commit/push left to `/ship`).
- Proportionality: models/ + cloneDeep deletion and the store/test edits are what the node names; no extra scope.

## PM update
Step 11 done: full row (SEALED) appended to `haven/diagrams/dev-loop-archive.md`; active row replaced by the pointer; 21 pointer rows → oldest (`experience-skills-inline`) dropped, its full row already in the archive (line 111).
