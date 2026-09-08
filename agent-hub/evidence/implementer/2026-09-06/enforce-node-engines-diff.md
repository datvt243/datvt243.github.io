# 2026-09-06 — enforce-node-engines (implementer diff)

- Worker: implementer
- Node: `enforce-node-engines` (`haven/diagrams/dev-loop.prime-mermaid.md`)
- Task string (as given via `/todo #140`): `#140`

## Status: sealed_pending_verifier

## Diff
`package.json`: added an `engines` block right after `"type": "module"`
(before `scripts`):
```json
"engines": {
    "node": ">=24",
    "npm": ">=11"
},
```
`package-lock.json`: auto-synced by `npm install` (4-line addition mirroring
the same `engines` block into the lockfile's root package entry) — not a
manual edit, confirmed via `git diff -- package-lock.json`.

No other file touched (`SmallestDiff`). `.npmrc`'s `engine-strict=true` was
deliberately NOT added — issue #140's "How" section marks it optional, and
it would be a 2nd file touched for a "nice to have" the issue doesn't
require. Recorded below under "Noticed, not done".

## Why `>=24` for node, `>=11` for npm
- `node >=24`: matches the existing `.nvmrc` (content `24`, from the
  already-SEALED `add-nvmrc` node, issue #89) and issue #140's title/How
  section verbatim.
- `npm >=11`: issue #140's "Why" section names the exact bug this guards
  against — npm 10.8.2's arborist `TypeError: Cannot read properties of
  null (reading 'edgesOut')` (already in `doctrine/domains/PROJECT.md`'s
  Traps table) — and the "Why" paragraph explicitly says "npm ≥11" as the
  fix boundary. Node 24 ships npm 11.x by default, so both constraints are
  consistent, not independently chosen.

## Commands run (from `doctrine/MEMORY.md`, copied verbatim)
### `npm run build`
Exit 0. Tail: `[nitro] ✔ You can preview this build using node
.output/server/index.mjs` / `✨ Build complete!`. Same pre-existing
darwin-arm64 `sharp` binary warning as every prior sealed node this week
(`[@nuxt/image] WARN sharp binaries for darwin-arm64 cannot be found`) —
not new, unrelated to this change.

### `npm run lint`
Tail: `✖ 32 problems (0 errors, 32 warnings)` — exact match to the current
baseline (every recently-sealed node cites the same count). 0 errors.

### `npm install` (acceptance criterion 4: "confirm `npm install` still
behaves correctly under Node 24")
Run under the active shell's Node (`node -v` → `v24.19.0`, `npm -v` →
`11.17.0` — both already satisfy the new `engines` range without needing
`nvm use` as a separate step, confirming the `.nvmrc`+`engines` combo is
consistent). Exit 0. Output: `up to date, audited 1281 packages in 15s` —
no dependency resolution changes, no arborist error, no `engines`
mismatch warning (would show as `npm warn EBADENGINE` if the active
Node/npm were below the new floor — not present here since 24/11.17
satisfy it). Confirms the new `engines` field does not break a normal
install under the already-supported Node version.

`package-lock.json` changed by exactly 4 lines (the same `engines` block
synced into the lockfile's root package entry) — `git diff --stat` /
`git diff` both checked, no other lockfile drift.

## Visual/behavior check
Not needed — `package.json`/`package-lock.json`-only change, no runtime
code path touched, nothing a user would see differently. No Chrome CDP
check performed (per `implement.md` step 7's "if the change has a
visual/behavior part" condition — this one doesn't).

## Noticed, not done
- `.npmrc`'s `engine-strict=true` (would make npm HARD-fail instead of
  warn on an engines mismatch) — issue #140 marks this optional; not added
  here (`SmallestDiff`). Flagging in case the operator wants a follow-up
  issue for it.
- No CI workflow exists in this repo to also enforce the Node version at
  CI time (issue #140's "and/or a CI check" alternative) — there is no CI
  configured in this repo at all (confirmed: no `.github/workflows/`
  directory), so this is out of scope, not an oversight.

## Hub bytes before
77553 (cited in the plan note, reused here — unchanged since no doctrine/
diagram archive pass happened between plan and diff).
