# 2026-10-26 - ci-typecheck-vitest (verdict: REOPEN)

- Worker: verifier · Version: 0.1.0
- Node: `ci-typecheck-vitest` (issue #300, branch `feature/300`, git worktree `scratchpad/wt300`)
- New PM status: unchanged (IN_PROGRESS). Nothing is archived on a REOPEN.
- Notes audited: `evidence/implementer/2026-10-26/ci-typecheck-vitest-plan.md`, `evidence/implementer/2026-10-26/ci-typecheck-vitest-diff.md`

## Isolation proof
This pass ran as a separate subagent, spawned through the Agent tool with the task "You are the agent-hub **verifier** for the Nuxt 4 portfolio. This change lives in a separate **git worktree** ... Node `ci-typecheck-vitest`, issue #300 ... You did not write this change." The implementer's task was issue #300 (plan note). This context did not write the diff. The spawn prompt asked for mutation checks, a CI simulation and a doctrine grep, so I read `git diff` and the new files for that. The verdict rests on the commands below.

## Reasoning
| Check | Result |
|---|---|
| Step 4: commands match `doctrine/MEMORY.md` | `npm run build`, `npm run lint`, `npx nuxi typecheck`, `npm test` (the new MEMORY row). Reproduced below. |
| Step 5: truncation | Key lines quoted; re-run matches. |
| AC1: tests green + catch regressions | 7/7 pass. My own 10 mutations each fail at least one test (below), incl. 3 the note did not try (adapter `group ?? 'Other'`, adapter dates, 502 → 500). Tests assert real outputs, not tautologies. Met. |
| AC2: CI runs typecheck + tests | `ci.yml` adds `npx nuxi typecheck` + `npm test` after lint. Fresh-runner reasoning: `npm ci` → postinstall `nuxt prepare` writes `.nuxt/tsconfig.json`; simulated with `rm -rf .nuxt node_modules/.cache`, empty env (`env -i PATH HOME`): `nuxt prepare` rc=0, `nuxi typecheck` rc=0. `vue-tsc@2.2.12` + `typescript@5.9.3` are devDependencies. `.nvmrc` = `24`; vitest@5.0.5 engines `^22.12.0 \|\| ^24.0.0 \|\| >=26.0.0`, peer vite `^6.4.0 \|\| ^7.0.0 \|\| ^8.0.0`, repo vite 8.3.5 deduped. A probe `tests/zz-typeprobe.test.ts` with `const x: number = "s"` gave `error TS2322`, so typecheck covers `tests/` (probe deleted). Met. |
| AC3: build/lint/typecheck | All rc=0 (below). Met. |
| **AC4: no doc still claims there is no test suite** | **Not met.** The note says "all 9 places updated", but its grep only covered `CLAUDE.md`, `agent-hub/README.md`, `doctrine/`, `.claude/skills`. `git grep` outside `evidence/`/`histories/` still finds the old claim in files loaded on every worker session: `agent-hub/CLAUDE.md:78` ("NO test suite — never mention \"tests pass\""), `agent-hub/BOOT.md:11`, `agent-hub/NORTHSTAR.md:26,43-45` ("Doesn't make up test commands — the project has no test suite"), `haven/workers/implementer/MEMORY.md:8` ("don't make up a `npm test`"), `haven/workers/implementer/SOUL.md:20`, `haven/workers/implementer/manifest.yaml:8,17`, `haven/workers/verifier/SOUL.md:13,30`, `haven/workers/verifier/manifest.yaml:7-9`, `haven/workers/verifier/recipes/verify_seal.md:90` (step 4: "not a made-up command like `npm test`") and `:162` (failure branch: note claims "tests pass" → "REOPEN immediately — this project has no test suite"). These now contradict `doctrine/MEMORY.md`, which lists `npm test` as the Test command: the next verifier is told by its own recipe to REOPEN a note that cites `npm test` output. |
| Comments per code-comments.md | One `//` WHY in `vitest.config.ts` (plain Vitest, no Nuxt runtime; stubs per test). No `(#N)` in code; tests use `it()` names. Met. |
| Decisions row | 4 cells, matches header `\| Date \| Decision \| Why \| Alternative rejected \|`. Met. |
| Dependency / config | One devDependency, `"test": "vitest run"`, 10-line config with `@`/`~` aliases. No `@nuxt/test-utils`. Proportionate. |
| Step 7b: Supersedes / Still open | No other #300 row on the active diagram. |
| Step 8: forbidden states | ADHOC_WORK no (row exists). NO_EVIDENCE no. EDIT_UNVERIFIED no (typecheck cited). CODE_IN_HAVEN no. DIAGRAM_DRIFT no. |
| Step 9: seal gate | No commit/push/PR. "none" acceptable. |
| Step 10: proportionality | Matches the issue's two bullets + the operator's doctrine ask. |

## Re-run
full. The operator's spawn prompt asked for independent build/lint/typecheck/test, mutation checks and a fresh `nuxt prepare` simulation. In the worktree, `scratchpad/p0/env.sh` sourced, Node v24.19.0:
```
npm run build → rc=0, "◆ ✨ Build complete in 17.1s!"
npm run lint → rc=0, "> eslint ." only
npx nuxi typecheck → rc=0
npm test → "Test Files  3 passed (3)", "Tests  7 passed (7)", rc=0
rm -rf .nuxt node_modules/.cache; env -i: nuxt prepare rc=0, nuxi typecheck rc=0
mutations (each restored with git checkout --; git status identical to before):
M1 groupSkills labels = listed + other     → 2 failed | 5 passed
M2 drop Other-last sort                    → 1 failed (keeps listed groups first…)
M3 keep empty groups                       → 1 failed (…drops empty groups)
M4 no nested generalInformation pick       → 1 failed (returns only public fields…)
M5 'salary' added to PUBLIC_FIELDS         → 1 failed (returns only public fields…)
M6 retry: 1                                → 1 failed (never retries…)
M7 statusCode 500 instead of 502           → 1 failed (never retries… 502)
M8 adapter group: raw.group (no 'Other')   → 1 failed (gives a skill without a group…)
M9 adapter endDate always new Date(...)    → 1 failed (…missing ones into null)
M10 adapter startDate left as number       → 1 failed (turns timestamps into dates…)
```

## Missing
1. AC4: update the remaining "no test suite" / "never say tests pass" / "`npm test` is made up" lines listed above (`agent-hub/CLAUDE.md`, `BOOT.md`, `NORTHSTAR.md`, `haven/workers/implementer/{MEMORY.md,SOUL.md,manifest.yaml}`, `haven/workers/verifier/{SOUL.md,manifest.yaml,recipes/verify_seal.md}`) to the same wording as `doctrine/MEMORY.md`: `npm test` is a real command for a few pure functions, and "tests pass" never replaces build/lint/typecheck/UI check. In `verify_seal.md` step 4 add `npm test` to the expected commands, and change the failure branch to "note claims tests pass without verbatim `npm test` output, or uses it as the whole verification". Then re-run the grep (`git grep -niE "no (automated )?test suite|tests pass|no tests exist|npm test" -- . ':!agent-hub/evidence' ':!agent-hub/histories'`) and cite it in the note.

## Noticed, not done
- `/hub-tokens` now warns `PROJECT.md is 16799B (>15KB threshold)`; the new Decisions row pushed it over. Archiving old rows is a separate node.
