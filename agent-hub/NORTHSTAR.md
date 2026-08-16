---
title: datvt243.github.io Agent-Hub Northstar
date: 2026-08-16
status: active
authority: 65537
dna: datvt243_portfolio_hub
---

> Northstar is what does NOT change when everything else does.

## One sentence
Keep every change to Đạt's Nuxt 3 portfolio/blog backed by independently
verified evidence, so an agent in a later session (or the same Claude in a
later session) doesn't have to re-scan the code or trust old notes to know
what's actually done.

## What done means
A node is ONLY considered done when **ALL** (not just some) of the
following are true:

1. It traces back to exactly one node on `haven/diagrams/`.
2. There's a minimal diff that makes that node qualify (no unnecessary
   refactor).
3. The exact commands from `doctrine/MEMORY.md` (`npm run build` + `npm run
   lint`) were run AND THE OUTPUT WAS READ — not inferred. This project has
   NO automated test suite; "verify" here also includes checking the real
   UI via Chrome CDP when a change has a visual part (see `doctrine/domains/
   PROJECT.md`'s "Browser verification" section).
4. There's an evidence note at `evidence/<...>/<date>-<slug>.md`.
5. The verifier returns `SEAL` with concrete cited evidence.
6. The diagram's PM status table has been updated to match.

Missing (3) or (5) → forbidden state `EDIT_UNVERIFIED`.

## What this hub does NOT do
- Doesn't automatically create GitHub issues/branches/PRs (`ADHOC_WORK` if
  code is changed without going through a node on the diagram, but opening
  an issue/PR/branch/merge is still a manual git action by the operator,
  outside the scope of `/worker`/`/todo`).
- Doesn't commit/push on the operator's behalf (`EDIT_UNVERIFIED` if it
  claims something was pushed/merged without real confirmation — the seal
  gate always stops to wait for approval).
- Doesn't make up test commands — the project has no test suite, and the
  hub won't pretend it does (`EDIT_UNVERIFIED` if it claims "tests pass"
  when no tests exist).
- Doesn't write code into `haven/` (`CODE_IN_HAVEN`).

## The success picture (3 months out)
- Every outward-facing change (high build/lint-breaking risk, theme
  changes, caching changes) goes through implementer → verifier → evidence
  before committing.
- `doctrine/domains/PROJECT.md` accumulates enough traps that the same real
  bugs don't get repeated (e.g.: `@iconify-json/*` must be in
  `dependencies`, not `devDependencies`).
- 0 forbidden states across the last 20 changes.
- `haven/diagrams/dev-loop.prime-mermaid.md` accurately reflects real
  state, no drift from the code.
- At least a few recipes in `haven/workers/*/recipes/` have been replayed
  ≥ 2 times.

## Cross-references
`CLAUDE.md` (root, the real project) · `agent-hub/CLAUDE.md` (hub contract) ·
`doctrine/MEMORY.md` · `haven/diagrams/dev-loop.prime-mermaid.md`
