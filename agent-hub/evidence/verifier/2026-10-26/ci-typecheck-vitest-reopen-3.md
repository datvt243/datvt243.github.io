# 2026-10-26 - ci-typecheck-vitest (verdict: REOPEN, pass 3)

- Worker: verifier · Version: 0.1.0
- Node: `ci-typecheck-vitest` (issue #300, branch `feature/300`, git worktree `scratchpad/wt300`)
- New PM status: unchanged (IN_PROGRESS). Nothing is archived on a REOPEN.
- Notes audited: `evidence/implementer/2026-10-26/ci-typecheck-vitest-diff.md` (`## Supersedes`, REOPEN 2 paragraph); previous verdicts `ci-typecheck-vitest-reopen.md`, `ci-typecheck-vitest-reopen-2.md`

## Isolation proof
This is a separate subagent, started through the Agent tool. Its task: "You are the agent-hub **verifier** ... Node `ci-typecheck-vitest` (#300), third pass. Previous REOPENs: ... reopen.md and ...-reopen-2.md ... Implementer's rework: the REOPEN 2 paragraph under `## Supersedes` ... wording only, with a list of remaining grep hits it argues can stay." The implementer's task was the REOPEN 2 rework. This context did not write the diff or the rework. The spawn prompt asked me to read `git diff` and to look for contradictions in `/todo`, `/ship`, `/release`, `evidence/README.md` and boot, so I did.

## Reasoning
| Check | Result |
|---|---|
| REOPEN 2 Missing #1: `implement.md` steps 5 and 8 | Met. Step 5 adds the "`Test (unit)` row (`npm test`)". Step 8 now reads "clean build + lint + typecheck + `npm test` + UI verification if needed". |
| Missing #2: `worker/SKILL.md` §5, verifier `SOUL.md` invariant 7 | Met. Both now list build + lint + `npx nuxi typecheck` + `npm test`. |
| Missing #3: `edit-verification.md:37`, implementer `SOUL.md` invariant 4 | Met. `TestsBeforeDone` is defined as "build + lint + typecheck + `npm test`", which matches `implementer/manifest.yaml:17`. |
| Missing #4: the shorthand mentions | Met. `agent-hub/CLAUDE.md:27`, `doctrine/MEMORY.md:49`, the diagram `build` node, `todo/SKILL.md:60` and root `CLAUDE.md:116` now all say build+lint+typecheck+test. |
| The kept grep hits | Justified. `/release` keeps its build+lint gate, as REOPEN 2 allowed, and its step 4 already says "(and test, if this project has one) commands from `doctrine/MEMORY.md`", so it now picks up `npm test` on its own. `PROJECT.md:34` continues with typecheck + test on the next line. `PROJECT.md:85` is a merge-conflict trap, not a list of commands. `verify_seal.md:57` and the archive rows are history. My wider pattern (which also matches `build/lint`) finds only general examples such as "build/lint output" and "build/lint pass" in `BOOT.md:10`, `CLAUDE.md:57`, `NORTHSTAR.md:51`, `INDEX.md:20`, `doctrine/MEMORY.md:12`, `doctrine/SOUL.md:31` and implementer `MEMORY.md:10`. None of them lists the full set of commands, so they can stay. |
| Recipes/SOULs/manifests/skills agree | Agree for the worker files. **Not met hub-wide**: see the next row. |
| **`evidence/README.md` implementer-note template** | **Not met.** `agent-hub/evidence/README.md:20-22` (`## Format — implementer note`, the `## Command` bullet) still says: "`npm run build`, `npm run lint`, + the `Typecheck` row — NEVER `npm test`, this project has no test suite". `implement.md` step 10 tells the implementer to write its note "following the format in `evidence/README.md`". So the template forbids exactly the output that `verify_seal.md` step 4 now requires, and an implementer who follows it gets REOPENed with `EDIT_UNVERIFIED`. This is the same kind of contradiction as REOPEN 2. It was missed because every grep so far, including the implementer's REOPEN 1 and 2 greps and mine in REOPEN 2, excluded all of `agent-hub/evidence`, and that also excluded this template file. |
| Other skills | `/ship`: lint-fix only, makes no verification claim, so it is fine. `boot/SKILL.md:23`: "commands (test/build/dev …)", which is generic, so it is fine. `/todo`: only line 60 mentions the commands, and it is fixed. |
| No code/test change since pass 1 | Met. `git diff --stat` outside `agent-hub/`, `.claude/` and `CLAUDE.md` shows only `ci.yml` (+4), `package.json` (+2/-1) and `package-lock.json` (+233), the same as passes 1 and 2. `find -newer ci-typecheck-vitest-reopen.md` outside the hub finds no files. mtimes: `tests/*.ts` and `vitest.config.ts` 20:30:33, `package.json` and `ci.yml` 20:31:22, both before REOPEN 1 (20:38:21). |
| Step 7b: Supersedes | Present (REOPEN 1 + 2). There is no other #300 row on the active diagram. |
| Step 8: forbidden states | ADHOC_WORK no. NO_EVIDENCE no. EDIT_UNVERIFIED no for this diff (all four commands are cited). CODE_IN_HAVEN no. DIAGRAM_DRIFT no. |
| Step 9: seal gate | No commit or push. "none" is fine. |
| Step 10: proportionality | Met. The rework is wording only and limited to the files REOPEN 2 listed. |

## Re-run
partial: `npm run lint` and `npm test`, because the operator's spawn prompt asked for them. Build and typecheck were not re-run: no code, test or config file changed after pass 1 (see the mtime check above), and pass 1 ran both from a cold cache with rc=0. Worktree, `scratchpad/p0/env.sh` sourced, Node v24.19.0:
```
npm run lint → "> eslint ." only, rc=0
npm test → "Test Files  3 passed (3)", "Tests  7 passed (7)", rc=0
```

## Missing
1. `agent-hub/evidence/README.md:20-22`: change the `## Command` bullet so it requires `npm test`, for example: "`npm run build`, `npm run lint`, the `Typecheck` row and the `Test (unit)` row (`npm test`); the unit suite covers only a few pure functions". Remove "NEVER `npm test`, this project has no test suite".
2. Re-grep with `agent-hub/evidence/README.md` included. Exclude only the dated folders (`':!agent-hub/evidence/implementer' ':!agent-hub/evidence/verifier'`), not all of `evidence/`. For example: `git grep -niE "no test suite|never .?npm test" -- agent-hub .claude CLAUDE.md ':!agent-hub/evidence/implementer' ':!agent-hub/evidence/verifier' ':!agent-hub/histories'`. The only hits allowed are the archive row and this node's own row.

## Noticed, not done
- `/hub-tokens`: `PROJECT.md` is still over 15 KB. As before, archiving it is a separate node.
