# 2026-09-06 — enforce-node-engines (implementer plan)

- Worker: implementer
- Task string (as given via `/todo #140`): `#140`
- Source: GitHub issue #140, "Enforce Node >=24 via package.json engines
  (npm arborist bug)" (`gh issue view 140`).

## Node
No PENDING node existed on `haven/diagrams/dev-loop.prime-mermaid.md` for
this task — new node created: `enforce-node-engines`, appended at the end
of the PM status table (`AppendOnly`).

## Current state
- `.nvmrc` already exists (content `24`), added by the already-SEALED
  `add-nvmrc` node (issue #89) — covers a bare `nvm use`, but nothing stops
  `npm install`/`npm run *` from running under whatever Node happens to be
  active if a developer skips `nvm use` first.
- `package.json` has no `engines` field at all (confirmed via `cat
  package.json`).
- The real bug this guards against is already documented:
  `doctrine/domains/PROJECT.md`'s Traps table, the
  `TypeError: Cannot read properties of null (reading 'edgesOut')` row
  (npm 10.8.2's arborist bug resolving a newer peer-dependency set).
- Referenced by issue #140 as flagged in
  `evidence/implementer/2026-09-02/dependency-upgrade-phase1-diff.md`'s
  "Noticed, not done".

## Acceptance (from issue #140's "How")
1. Add `"engines": { "node": ">=24" }` to `package.json`.
2. (Optional, issue says "Optionally") `engine-strict`/`preinstall` check —
   NOT adding this: `SmallestDiff` — the issue's own wording marks it
   optional, and `.npmrc`'s `engine-strict=true` would be a 2nd file touched
   for a "nice to have" the issue doesn't require. Recorded as "Noticed,
   not done" below in case the operator wants it later.
3. `npm run build` + `npm run lint` must stay clean.
4. Confirm `npm install` still behaves correctly under Node 24.

## Files
- `package.json` (add `engines` field only)

## Env vars
None needed — no env var gates this change (`.env.example`'s
`MY_EMAIL`/`NODE_API`/`GITHUB_TOKEN`/`GITHUB_USER`/
`PUPPETEER_EXECUTABLE_PATH` are all unrelated to this task).

## Blockers
None.

## Hub bytes before
77553
