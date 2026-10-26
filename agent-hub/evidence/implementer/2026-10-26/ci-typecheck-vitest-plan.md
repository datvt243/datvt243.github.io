# 2026-10-26 - ci-typecheck-vitest (plan)

- Worker: implementer · Version: 0.1.0
- Node: `ci-typecheck-vitest` (`haven/diagrams/dev-loop.prime-mermaid.md`, appended last row; slug grepped in both diagram files → 0 hits)
- Task: issue #300 "chore(ci): add typecheck to CI and a few unit tests for fragile logic"; operator chose "Typecheck CI + Vitest" and asked that the doctrine record the move from "no tests" to tests (AskUserQuestion 2026-10-26). Branch `feature/300` off `staging` efae617, in git worktree `scratchpad/wt300` (own `npm ci`).

## Hub bytes before: 77904

## Plan
1. `vitest` devDependency; `npm test` = `vitest run`; `vitest.config.ts` with `@`/`~` aliases, no Nuxt runtime.
2. `tests/`: `groupSkills` (the #281 rule), `fetchResume` (field whitelist from #280, no retry + 502 from #282; Nitro globals stubbed), `ResumeAdapter` (missing group → Other, timestamps → Date/null).
3. CI: `npx nuxi typecheck` + `npm test` after lint.
4. Docs/doctrine that say "no test suite" / "never say tests pass": CLAUDE.md, doctrine MEMORY/SOUL/INDEX/PROJECT (+ Decisions row), standards/edit-verification.md, agent-hub/README.md, .claude/skills/worker/SKILL.md.

## Acceptance criteria
1. `npm test` green; each test fails when its bug is reintroduced (mutation check).
2. CI workflow runs typecheck + tests.
3. build / lint / typecheck clean.
4. No doc still claims there is no test suite; the narrow scope of the tests is stated.
5. comments per code-comments.md.
