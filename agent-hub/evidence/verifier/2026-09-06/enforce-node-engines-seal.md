# 2026-09-06 — enforce-node-engines (verifier seal)

- Worker: verifier
- Node: `enforce-node-engines` (`haven/diagrams/dev-loop.prime-mermaid.md`)
- Note graded: `evidence/implementer/2026-09-06/enforce-node-engines-{plan,diff}.md`

## Verdict: SEAL

## Isolation proof
"enforce-node-engines"

This verify pass ran as a blank subagent context, spawned fresh with no
prior context of the implementer's diff. Its own task string (given by the
orchestrator for this specific verify pass, distinct from the
implementer's own task string `"#140"` cited in the implementer's plan
note) is exactly `"enforce-node-engines"` — quoted verbatim above as
required. This pass's first real actions were reading `NORTHSTAR.md` →
root `CLAUDE.md` → `doctrine/MEMORY.md` → `doctrine/domains/PROJECT.md` →
`haven/diagrams/dev-loop.prime-mermaid.md`, then the verifier bundle
(`manifest.yaml`, `SOUL.md`, `recipes/verify_seal.md` — the only file in
`recipes/`), then the two implementer evidence notes — never touched
`package.json`/`package-lock.json` until the independent re-verification
steps below. Confirmed I did not write this diff (`NeverVerifyOwnWork`).

## Bundle read
`agent-hub/haven/workers/verifier/manifest.yaml`, `SOUL.md`,
`recipes/verify_seal.md` (confirmed via `ls` — the only file present in
`recipes/`) — read in full. `MEMORY.md` does not exist for this worker
(confirmed, not skipped). Also read `NORTHSTAR.md`, root `CLAUDE.md`,
`doctrine/MEMORY.md`, `doctrine/domains/PROJECT.md`, and
`haven/diagrams/dev-loop.prime-mermaid.md` first, per the required
reading order. `agent-hub/CLAUDE.md` was auto-injected as a nested
`<system-reminder>` per the recipe's step-3 guard — not re-read manually.

## Diff scope check
`git diff --stat` (full repo, not scoped to specific paths) shows 5
modified files + 2 untracked evidence dirs:
```
agent-hub/evidence/worker-runs.log                 |  1 +
agent-hub/haven/diagrams/dev-loop.prime-mermaid.md |  4 ++++
package-lock.json                                  |  4 ++++
package.json                                       |  4 ++++
themes/portfolio-dev/pages/github/part/Item.vue    | 16 ++++++++++++++--
```
Of these, only `package.json` (4 lines) and `package-lock.json` (4 lines)
belong to THIS node, exactly matching the diff note's description
(`engines` block added after `"type": "module"`, before `"scripts"`, plus
the auto-synced lockfile mirror). The `agent-hub/haven/diagrams/
dev-loop.prime-mermaid.md` diff (before my own edit) contained TWO new
rows: the already-SEALED `editor-dracula-github-item-fix` row (issue
#145, its own independent verifier pass, timestamped
`2026-09-05T22:23:20Z` in `worker-runs.log`) and this node's own
`enforce-node-engines` row — I only touched the latter. `agent-hub/
evidence/worker-runs.log` (1 line) and `themes/portfolio-dev/pages/
github/part/Item.vue` (16 lines) belong entirely to that separate,
already-sealed `editor-dracula-github-item-fix` node — confirmed by
reading their diffs directly (`Item.vue`'s hunk is the `text-blue-400`→
`text-theme-code-keyword`/`topicBadgeUi` change described in that node's
own diagram row and evidence notes under `2026-09-06/
editor-dracula-github-item-fix-*`) and by the pre-existing git status at
the start of this task's session showing these exact two files already
modified before this verify pass began. Not in scope for this node — no
REOPEN basis.

Untracked `agent-hub/evidence/implementer/2026-09-06/` and
`agent-hub/evidence/verifier/2026-09-06/` are the expected new evidence
dirs (this node's implementer note + this seal note).

Conclusion: this node's own diff is exactly `package.json` +
`package-lock.json` + its own diagram row, matching the diff note.
`SmallestDiff` holds.

## Acceptance criteria — one by one (from `gh issue view 140`, read directly)
| # | Criterion | Evidence | Met? |
|---|---|---|---|
| 1 | `engines` field added to `package.json` | `cat`/`Read package.json`: `"engines": { "node": ">=24", "npm": ">=11" }`, positioned right after `"type": "module"`, before `"scripts"` — independently confirmed | ✅ |
| 2 | `npm run build` clean | Independently re-run (see below): exit 0, `✨ Build complete!`, only the pre-existing darwin-arm64 `sharp` warning | ✅ |
| 3 | `npm run lint` clean | Independently re-run: exit 0, `✖ 32 problems (0 errors, 32 warnings)` — exact baseline match | ✅ |
| 4 | `npm install` still behaves correctly under Node 24 | Independently re-run under this machine's active Node/npm (both already ≥ the new floor): exit 0, `up to date, audited 1281 packages`, no `EBADENGINE`, no arborist `edgesOut` error, `package-lock.json` diff unchanged (still exactly 4 lines) after the re-run | ✅ |

Issue's "How" section only literally names `node >=24`; the implementer
also added `npm >=11`. Checked this isn't scope creep: the issue's own
"Why" section names npm 10.8.2's arborist bug and npm ≥11 as the exact fix
boundary — the `npm` constraint is directly justified by the issue text
itself, not an independent addition. Not a `SmallestDiff` violation.

## Commands (verbatim from `doctrine/MEMORY.md`)
### `node -v` / `npm -v` (this verifier's own machine, independent of the note)
```
v24.19.0
11.17.0
```
Both satisfy the new `engines` range (`node >=24`, `npm >=11`) without
`nvm use` as an extra step — consistent with `.nvmrc`. This is what gives
the below re-runs real proof value: they ran under a Node/npm that
actually falls inside the new floor, not below it.

### `npm run lint`
Independently re-run. Real exit code captured separately from output
(`npm run lint > /tmp/lint_out.txt 2>&1; echo $?`) to avoid a piped
`tail`'s exit code masking the real one: `REAL_EXIT=0`. Verbatim tail:
`✖ 32 problems (0 errors, 32 warnings)` — exact match to the implementer's
cited baseline and to every recently-sealed node.

### `npm run build`
Independently re-run (warm cache, not a `rm -rf .nuxt .output` cold
rebuild — see "Re-run" declaration below for why this suffices here).
Real exit code captured the same way: `REAL_EXIT=0`. Tail: same
`[@nuxt/image] WARN sharp binaries for darwin-arm64 cannot be found`
(pre-existing, unrelated) then `[nitro] ✔ You can preview this build
using node .output/server/index.mjs` / `✨ Build complete!`. No new
errors, no `engines`-related failure — confirms the `engines` field's
JSON syntax and value strings don't break the build.

### `npm install`
Independently re-run. `REAL_EXIT=0`. Output: pre-existing unrelated
`ERESOLVE overriding peer dependency` warnings (`@nuxt/cli` vs
`@nuxt/schema` peer mismatch, nothing to do with `engines`), then
`up to date, audited 1281 packages in 35s`, `18 vulnerabilities` (matches
the current baseline from the `dependency-upgrade-phase2` node). No
`npm warn EBADENGINE`, no arborist `edgesOut` TypeError. Re-checked
`git diff --stat -- package-lock.json` after this install: still exactly
`4 ++++` — no additional drift introduced by re-running install a second
time.

## `.nvmrc` cross-check
`Read .nvmrc` → content `24` (single line). Consistent, not contradictory,
with the new `engines.node: >=24` floor — both name the same minimum.

## Forbidden-states scan
| State | Hit? | Why |
|---|---|---|
| `ADHOC_WORK` | No | Traces to the `enforce-node-engines` node on the diagram |
| `NO_EVIDENCE` | No | Plan + diff notes exist, this seal note now exists |
| `EDIT_UNVERIFIED` | No | build/lint/npm install/engines field/.nvmrc/node-npm versions all independently re-checked and read back by this pass, not just reasoned about |
| `CODE_IN_HAVEN` | No | Only `package.json`/`package-lock.json` changed, both outside `haven/` |
| `DIAGRAM_DRIFT` | No (fixed by this seal) | PM status row updated to SEALED below |

No forbidden state hit. No "tests pass" claim anywhere in either note
(this project has no test suite) — the note correctly frames criterion 4
as "confirm npm install still behaves correctly", not a test claim.

## Proportionality (`SmallestDiff`)
Diff is exactly the `engines` block (2 keys) in `package.json` plus the
auto-synced lockfile mirror — no unrelated file touched by this node
(confirmed by the scope check above, once the two unrelated
already-sealed-node files are excluded). `.npmrc`'s `engine-strict` and a
CI check were both correctly left out — issue #140 marks both optional,
and no CI exists in this repo at all.

## Seal gate
No outward-facing action was taken by this pass — no `commit`/`push`/PR.
This note only updates the diagram's PM status (an allowed verifier
action, not a git action) and appends one log line, both within
`haven/workers/verifier/manifest.yaml`'s `writes:` scope. This node has no
branch yet (evidence-only pass, same convention as the two most recently
sealed nodes).

## PM status update
`haven/diagrams/dev-loop.prime-mermaid.md`'s `enforce-node-engines` row
updated in place (`AppendOnly` — not moved/reordered) from `IN_PROGRESS`
to `SEALED`, with the verification summary appended to the same row's
Notes cell.

## Re-run
`partial` — independently re-ran `npm run build` (warm cache, not a cold
`rm -rf .nuxt .output` wipe), `npm run lint`, and `npm install`, plus
independently read `package.json`/`.nvmrc` and captured this machine's own
`node -v`/`npm -v`. Reason: per `verify_seal.md`'s "Re-run scope"
exceptions, this node carries real risk beyond an ordinary docs/UI diff —
an `engines` field with wrong syntax or an overly strict range could
silently break `npm install`/`npm run build` for every future contributor,
so this pass's own task instructions explicitly required an independent
`npm run build` re-run rather than auditing the note's claim alone. A full
cold-cache wipe was not judged necessary on top of that: the `engines`
field is metadata-only (doesn't touch build inputs/dependency versions
that a stale `.nuxt`/`.output` cache could mask), and this is not an
outward-facing/`/release`-gate node (no commit/push/PR).

## Hub bytes before / after
- `hub_bytes_before` (given by the orchestrator for this pass, matching
  the implementer's plan note's own citation and the last line of
  `evidence/worker-runs.log` before this pass): 77553
- `hub_bytes_after` (measured via `/hub-tokens`'s exact script from
  `.claude/skills/hub-tokens/SKILL.md`, run AFTER the PM status update
  above): 79419

Note (informational, not a REOPEN basis): the same run flags
`haven/diagrams/dev-loop.prime-mermaid.md` as having crossed the 15KB
archive threshold this pass (19929 B active-file bytes reported by the
script's diagram-specific check). Not addressed here — out of scope for
this node, flagging for a future archive pass per the file's own header
convention.

## Cleanup
`.output`/build artifacts from the independent `npm run build` re-run left
on disk (gitignored, not committed) — no preview server was started (no
CDP/browser check needed for this non-visual node), so nothing to kill.
`git status --short` after this pass's writes shows only: this node's own
`package.json`/`package-lock.json` diff (implementer's, unchanged by this
pass), the diagram + `worker-runs.log` edits made by this seal, the two
evidence-note directories, and the pre-existing unrelated
`editor-dracula-github-item-fix` files disclosed above — nothing else.
