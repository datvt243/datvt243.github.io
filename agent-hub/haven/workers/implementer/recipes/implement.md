> This is the recipe that touches code the most — where `EDIT_UNVERIFIED`
> gets caught or slips through.

# Contract
- Input: the output of `pick_next`.
- Output: `{status: sealed_pending_verifier | reopened_by_test | failed, node,
  diff summary, command, evidence}`
- NEVER: `status: done` — only the verifier uses a sealed status.

## Steps
1. Re-read the node + acceptance criteria.
2. Read every related file before writing — match the existing
   naming/style/idiom.
3. Smallest diff — only change what the acceptance criteria require.
   Any comment added/changed follows `doctrine/standards/code-comments.md`
   (incl. its enabled opt-ins).
4. SEAL GATE before any outward-facing action — stop, show the diff,
   wait for approval.
5. Run the EXACT test command from `doctrine/MEMORY.md` — copied
   verbatim. Plus its `Typecheck` row: a standalone
   command → run it too; `inside Build` → the build run must be in the
   note; `n/a — no TypeScript` → skip.
6. READ THE OUTPUT BACK verbatim — a claim that can't be cited =
   `EDIT_UNVERIFIED`.
7. Only report `sealed_pending_verifier` once ALL criteria pass with
   evidence.
7b. `grep` the active diagram for other
   not-yet-SEALED rows citing the same issue (`#<n>`) or task. Each one
   goes in the note under `## Supersedes` (this node finishes its work →
   `verify_seal` retires it) or `## Still open` (with a 1-line reason,
   e.g. a later phase). None found → `## Supersedes: none`.
8–9. If a new bug/trap is found, consider recording it in
   `doctrine/domains/` or `MEMORY.md`.
10. Write to `evidence/` per the format in `evidence/README.md`.
11. ONLY when the result is `blocked` or `failed`
    (never reaches the verifier) — append 1 line to
    `evidence/worker-runs.log`:
    `<ISO timestamp> role=implementer outcome=blocked|failed node=<slug>
    hub_bytes_before=<N from pick_next's measure step> verifier_rerun=n/a`. When
    the result is `sealed_pending_verifier`, do NOT log here — the
    verifier will log both sides (before/after) in
    `recipes/verify_seal.md` once it has a real verdict. This logging
    runs identically whether called via `/todo` or by typing
    `/worker implementer` by hand — independent of how it's invoked.

## Hard rules honored
`SmallestDiff` | `TestsBeforeDone` | `EvidencePerAction` | `NoSilentFailure` |
`NodeBeforeCode`

## Failure branches
| Failure | Handling |
|---|---|
| Missing test command in `doctrine/MEMORY.md` | `blocked`, suggest filling in `<<FILL>>`, log per step 11 |
| Project has `tsconfig.json` but `Typecheck` is `<<FILL>>` | `blocked` — except the node whose task IS adding that command |
| Lint/typecheck reports errors the diff didn't introduce | Don't fix them in this diff (`SmallestDiff`) — prove they pre-exist (same count on the base branch, or ≤ the row's `baseline:` in `doctrine/MEMORY.md`, none in touched files), list under `## Noticed, not done`; no baseline recorded yet → propose one to the operator, don't write it into `MEMORY.md` yourself |
| A failure from missing setup (env, deps) | Report the REAL error, don't work around it, log per step 11 |

## Runtime
`/worker implementer "<task>"`.

## Project extensions
- Idioms: `Theme*` component prefix; semantic Tailwind tokens
  (`bg-theme-*`/`text-theme-*`), never literal colors.
- `nuxt build` strips types without checking them — the `Typecheck` row
  (`npx nuxi typecheck`) is a separate run.
- Visual/behavior change → check the real UI via Chrome CDP port 9888:
  `curl -s http://localhost:9888/json/version` (running?), else launch with
  `--remote-debugging-port=9888 --user-data-dir="$HOME/.chrome-debug-profile"`;
  connect with `puppeteer-core`. Prefer real click navigation over
  `Page.navigate` when testing cache/hydration.
- Build fails/flakes, not reproducible → suspect cache first (`rm -rf
  node_modules/.cache .nuxt .output`), check the matching trap in
  `doctrine/domains/PROJECT.md` before concluding.
