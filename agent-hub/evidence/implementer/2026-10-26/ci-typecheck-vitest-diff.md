# 2026-10-26 - ci-typecheck-vitest (diff)

- Worker: implementer · Version: 0.1.0
- Node: `ci-typecheck-vitest` (last row of `haven/diagrams/dev-loop.prime-mermaid.md`)
- Task: issue #300, branch `feature/300` (worktree `scratchpad/wt300`) off `staging` efae617
- Status: `sealed_pending_verifier`

## Hub bytes before
77904

## Diff
| File | Why |
|---|---|
| `package.json` / `package-lock.json` | `vitest@^5.0.5` devDependency (`npm install -D vitest`, lock updated by npm); `"test": "vitest run"`. |
| `vitest.config.ts` (new) | `@`/`~` → repo root, `tests/**/*.test.ts`; one `//` WHY (plain Vitest, no Nuxt runtime). |
| `tests/groupSkills.test.ts` (new) | 3 cases: groups derived when the listed list is empty; listed first / unlisted / Other last; no-group → Other, empty groups dropped. |
| `tests/fetchResume.test.ts` (new) | 2 cases with `useRuntimeConfig`/`$fetch`/`createError` stubbed as globals: private fields (salary, birthday, gender, maritalStatus, expectedSalary) stripped at both levels; a rejected upstream → 502, called once, `retry: 0` passed. |
| `tests/resumeAdapter.test.ts` (new) | 2 cases: `toSkill` without group → 'Other'; `toExperience` timestamps → Date, missing → null. |
| `.github/workflows/ci.yml` | `npx nuxi typecheck` and `npm test` after lint. |
| `CLAUDE.md` | Commands list gets `npm test`; "No test suite" paragraph → narrow unit suite + full "Verified" definition. |
| `agent-hub/doctrine/MEMORY.md` | Test row = `npm test`; "Verify" paragraph includes typecheck + test and says "tests pass" never stands for the whole verification. |
| `agent-hub/doctrine/SOUL.md`, `INDEX.md`, `domains/PROJECT.md` (invariant + Decisions row 2026-10-26), `standards/edit-verification.md`, `agent-hub/README.md`, `.claude/skills/worker/SKILL.md` | Same correction: from "no test suite, never say tests pass" to "narrow unit suite; never use it as proof a feature works". |
| REOPEN 1: `agent-hub/CLAUDE.md`, `BOOT.md`, `NORTHSTAR.md` (2 places), `haven/workers/implementer/{MEMORY.md, SOUL.md, manifest.yaml (description + TestsBeforeDone)}`, `haven/workers/verifier/{SOUL.md (2), manifest.yaml}`, `haven/workers/verifier/recipes/verify_seal.md` (step 4 now lists `npm test` as a real command and requires its output; failure-branch row reworded) | Same correction; these are read every worker session and contradicted `doctrine/MEMORY.md`. |
| `haven/diagrams/dev-loop.prime-mermaid.md` | Node row appended |

## Commands + output (worktree)
```
npm ci → rc=0; npm install -D vitest → vitest@5.0.5 (npm's pre-existing "allow-scripts" warnings for esbuild/fsevents/… also printed by npm ci)
npm run build → rc=0, "◆ ✨ Build complete in 14.5s!", 1 pre-existing WARN (components-*.js (369:0): A comment)
npm run lint → rc=0 (covers tests/ and vitest.config.ts)
npx nuxi typecheck → rc=0, 0 "error TS" (includes tests/)
npm test → "Test Files  3 passed (3)", "Tests  7 passed (7)"
```

## Mutation check (each bug reintroduced, then `git checkout`)
```
1. groupSkills labels = listed + other only (the #281 bug) → × derives groups from the skills… ; × keeps listed groups first…
2. fetchResume returns the raw object (no whitelist, #280)  → × returns only public fields… (1 failed | 6 passed)
3. fetchResume retry: 1 (#282)                              → × never retries the rate-limited upstream… (1 failed | 6 passed)
```

## Acceptance
| Criterion | Evidence |
|---|---|
| 1. Tests green + catch regressions | 7/7 pass; mutations 1–3 each fail the matching test |
| 2. CI runs typecheck + tests | ci.yml diff (first real run happens on the PR) |
| 3. build/lint/typecheck | above |
| 4. Docs consistent | REOPEN 1 re-grep over the WHOLE `agent-hub/` (minus `evidence/`, `histories/`) + `.claude/` + root `CLAUDE.md` for `no test suite\|no automated test\|has no test\|no tests exist\|made-up command like` → 0 hits (exit 1). First pass had only searched doctrine/ + README + skills (9 places); REOPEN 1 added 12 more in 9 files |
| 5. comments per code-comments.md | one `//` WHY in vitest.config.ts; tests use descriptive `it()` names instead of comments; no `(#N)` refs in code |

## Supersedes
REOPEN 3 (`evidence/verifier/2026-10-26/ci-typecheck-vitest-reopen-3.md`): `agent-hub/evidence/README.md` `## Command` still said "NEVER `npm test`" — the note template the implementer recipe points to. Now asks for the `Typecheck` and `Test (unit)` rows. Re-grep `no test suite|NEVER .npm test` over `agent-hub/ .claude/ CLAUDE.md`, excluding only dated `evidence/{implementer,verifier}/`, `histories/` and archives: 0 hits. Wording only.

REOPEN 2 (`evidence/verifier/2026-10-26/ci-typecheck-vitest-reopen-2.md`): the recipes disagreed (verifier step 4 required `npm test` output, the implementer recipe didn't ask for it). Aligned on build + lint + typecheck + `npm test` in: `haven/workers/implementer/recipes/implement.md` steps 5 and 8, `.claude/skills/worker/SKILL.md` §5, `haven/workers/verifier/SOUL.md` invariant 7, `doctrine/standards/edit-verification.md` (`TestsBeforeDone` definition), `haven/workers/implementer/SOUL.md` invariant 4, and the shorthands `agent-hub/CLAUDE.md` default loop, `doctrine/MEMORY.md` workflow line, `dev-loop.prime-mermaid.md` flowchart `build` node, `.claude/skills/todo/SKILL.md` step 2, root `CLAUDE.md` `/worker implementer` line. Re-grep with the verifier's pattern (`build\`? *(\+|then|and) *\`?(npm run )?lint`, excluding lines that already name typecheck/test) leaves: `/release`'s build+lint gate (separate decision, kept as the verifier said), `PROJECT.md:34` (the sentence continues with typecheck + test on the next line), `PROJECT.md:85` (a merge-conflict trap, not a command list), two archived diagram rows (history), `verify_seal.md:57` (describes the 2026-09-02 re-run cost audit, history). Wording only, no code change.

REOPEN 1:
REOPEN 1 (`evidence/verifier/2026-10-26/ci-typecheck-vitest-reopen.md`): 12 stale "no test suite" passages left in agent-hub CLAUDE/BOOT/NORTHSTAR and the worker SOUL/MEMORY/manifest/recipe files — all reworded (wording only, no code change). `npx eslint .` rc=0 after the edit; code/tests untouched since pass 1.

## Noticed, not done
- `doctrine/domains/PROJECT.md` is 16.8 KB after the new Decisions row, past `/hub-tokens`' 15 KB warning (verifier note); archiving old rows is a separate node.
- CI time grows by typecheck (~20s locally) + tests (<1s).
- `ResumeAdapter` covered only for the two fields that matter to known bugs, not every method.

## Seal gate
none.
