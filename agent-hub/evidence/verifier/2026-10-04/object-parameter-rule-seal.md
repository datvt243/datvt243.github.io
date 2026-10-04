# 2026-10-04 - object-parameter-rule (verifier verdict: SEAL)

- Worker: verifier · Version: 0.1.0
- Node: `object-parameter-rule` (`haven/diagrams/dev-loop.prime-mermaid.md`, issue #214)
- Notes graded: `evidence/implementer/2026-10-04/object-parameter-rule-plan.md`, `object-parameter-rule-diff.md` (including "## Correction after REOPEN #1"), prior verdict `evidence/verifier/2026-10-04/object-parameter-rule-reopen.md`
- New PM status: **SEALED** (row updated in place, IN_PROGRESS → SEALED)

## Isolation proof
This pass ran as a separate subagent spawned via the Agent tool with description
"Verifier re-pass object-parameter-rule after REOPEN 1". That differs from the implementer's
task string (the issue #214 body) and from the first verifier's spawn
("Verifier pass object-parameter-rule"). This context wrote no part of the diff, the
correction, or the first verdict (`NeverVerifyOwnWork`).

## Reasoning
Node v24.19.0, repo root as cwd. I re-checked everything below myself on the current working tree.

### REOPEN #1 reasons
| Reason | Now | Verdict |
|---|---|---|
| 1. Lint claim (`13 problems`) didn't reproduce with the harness scripts present (`22 problems`) | `parse2.cjs`, `scan.cjs` and `scan-types.cjs` now start with `/* eslint-disable */`. `npm run lint` on the tree with the assets present gives `✖ 13 problems (0 errors, 13 warnings)` with exit 0, which matches the baseline of the 3 previously SEALED nodes. `eslint.config.js` was not modified (`git diff --stat` doesn't list it) | resolved |
| 2. The node row was outside the PM status table | The row is at line 124, directly after the `author-github-see-line` row (123). It is followed by a blank line (125) and then the "Any regression must be a **new node**…" footer (126). `git diff` on the diagram shows exactly 1 added row | resolved |

### Acceptance criteria (issue #214)
| Criterion | Evidence | Verdict |
|---|---|---|
| All functions with > 2 params found (incl. arrow/async/constructor/method) | Plan inventory gave `files scanned 92 hits 8` (AST, all function-like kinds). Type-only `scan-types.cjs` re-run: `files scanned 92 hits 0` | ok |
| Each one refactored to a destructured object param | `scan.cjs` re-run: `files scanned 92 hits 2`. The 2 left are `plugins/ErrorHandler.ts:7` (Nuxt `vue:error` hook) and `server/utils/createPDFAts.ts:63` (`String.prototype.replace` callback). External callers pass positional args to both, so excluding them is correct | ok |
| All call sites updated | `npm run build` exit 0, `└  ✨ Build complete!`. The implementer's tsc check (0 errors on touched files, with a negative control) was not contradicted. The first verifier's render and parse checks against an independent `git archive HEAD` export also pass | ok |
| Functionality unchanged | `TZ=UTC node …/render.cjs` gives sha256 `8c9f8329c2afd7963f2533ee1259d9684c126c16a67aa58f1c1fecf7ccdec7f9`, 47064 bytes, 0 THROW. That equals `render-before.txt`, which the first verifier had already confirmed equal to a real HEAD export render. The fixed `parse2.cjs` gives `identical 18/18`, and afterwards `ls server/utils/ \| grep -c __head` returns `0` (temp file cleaned up) | ok |
| ≤ 2-param functions untouched | `git diff --stat`: code changes are limited to the 6 listed server files (`categories.ts`, `detail/[id].ts`, `blogSchemas.ts`, `cacheGetPost.ts`, `createPDF.ts`, `createPDFAts.ts`), plus the diagram and log | ok |
| Build + lint clean, verbatim | Build `build exit=0`, `✨ Build complete!` (grep "error" matched only `error-500.mjs`/`error-*.mjs` chunk filenames). Lint `✖ 13 problems (0 errors, 13 warnings)` = baseline | ok |

Forbidden states: `ADHOC_WORK` no (node + issue #214). `NO_EVIDENCE` no. `CODE_IN_HAVEN` no. `DIAGRAM_DRIFT` no (the row is now inside the table). `EDIT_UNVERIFIED` no (the lint and build claims reproduce verbatim).
Seal gate: no outward-facing action was taken (no commit, push or PR). Proportionality: 6 functions and 15 call sites. The correction pass only touched evidence files and moved the row. There is no "tests pass" claim. Browser verification is N/A: there is no visual change, and the PDF HTML is byte-identical.

## Re-run
`partial`. I re-ran `npm run lint`, `npm run build`, `scan.cjs`, `scan-types.cjs`, `render.cjs` (TZ=UTC) and `parse2.cjs`, but not tsc and not a cold-cache rebuild.

Reasons:
- The node rewrites the production PDF generator (`/api/generate-pdf`) and the blog API validator. That is the outward-facing exception in "Re-run scope".
- REOPEN #1 was specifically about the lint output not reproducing, so the corrected claim needed independent confirmation.
- `parse2.cjs` was modified in the correction.
- No prior verifier had confirmed the build.

Re-run artifacts are in this session's scratchpad. Nothing under `server/` was written.
