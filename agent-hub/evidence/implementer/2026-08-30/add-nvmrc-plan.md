# 2026-08-30 — add-nvmrc (plan)

- Worker: implementer
- Version: 0.1.0
- Node: `haven/diagrams/dev-loop.prime-mermaid.md` → `add-nvmrc` (new)
- Task (verbatim, issue #89): `npm run lint` crashes with `TypeError:
  Object.groupBy is not a function` if run on Node < 21
  (`eslint-flat-config-utils@3.2.0` needs `Object.groupBy`) — dev machine's
  default Node is `v20.18.0`. This trap is already recorded in
  `agent-hub/doctrine/domains/PROJECT.md`'s Traps table, but requires
  remembering `nvm use 24` (or any ≥21) by hand every session since the
  repo declares no `.nvmrc`/`engines`. Need: add `.nvmrc` (recommended
  content `24` or `lts/*`, prefer a version already installed via `nvm`) so
  a bare `nvm use` picks the right one, reducing the chance of repeating
  this error in a future session.

## Node exists? No — created new node `add-nvmrc`.

## Confirmation before choosing content
- `.nvmrc` did not already exist (`ls -la .nvmrc` → No such file).
- `package.json` has no `engines` field.
- `ls ~/.nvm/versions/node` → `v20.18.0`, `v24.19.0` both installed locally
  — `24` is already installed, matches the exact version the prior
  `blog-posts-shape-fix`/`remove-dead-related-articles` verifier passes
  used (`nvm use 24`) per `doctrine/domains/PROJECT.md`'s Traps table.
  Chose literal `24` over `lts/*` so the pinned version matches what's
  already proven to work on this machine, not a floating target.

## Blockers
None. No env var needed for this task.

## Acceptance criteria
1. `.nvmrc` created at repo root, content `24`.
2. `npm run build` clean (Node version doesn't affect build per the known
   trap — build already works on `v20.18.0`).
3. `npm run lint` clean, run under the Node version `.nvmrc` now declares
   (`nvm use` with no argument should resolve to it), unchanged warning
   count from the current baseline (docs/config-only change, no source
   file touched).
4. No visual/behavior change — no CDP needed.
