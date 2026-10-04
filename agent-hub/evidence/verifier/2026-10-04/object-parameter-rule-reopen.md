# 2026-10-04 - object-parameter-rule (verifier verdict: REOPEN)

- Worker: verifier · Version: 0.1.0
- Node: `object-parameter-rule` (`haven/diagrams/dev-loop.prime-mermaid.md`, issue #214)
- Notes graded: `evidence/implementer/2026-10-04/object-parameter-rule-plan.md`, `object-parameter-rule-diff.md`
- New PM status: **REOPEN** (row left at `IN_PROGRESS`; RatchetOnly, PM status is only updated on SEAL)

## Isolation proof
This pass ran as a separate subagent spawned via the Agent tool with description
"Verifier pass object-parameter-rule". The task string was the `/todo` pass-2 verifier
prompt, which is not the implementer's task string (the issue #214 body). No diff in this
context was written by this context (`NeverVerifyOwnWork` satisfied).

## Reasoning
Per criterion, independently re-checked where noted (Node v24.19.0, repo root as cwd):

| Criterion | Evidence | Verdict |
|---|---|---|
| All > 2-param functions found | Note: `files scanned 92 hits 8` before. Re-ran `scan.cjs` now: `files scanned 92 hits 2`, and `scan-types.cjs`: `files scanned 92 hits 0` | ok |
| Each refactored to a destructured object | Remaining 2 hits are exactly `plugins/ErrorHandler.ts:7` (Nuxt `vue:error` hook) and `server/utils/createPDFAts.ts:63` (`String.prototype.replace` callback). Excluding them is correct because the external caller passes positional args | ok |
| All call sites updated / functionality unchanged (PDF) | I did not reuse the implementer's `render-before.txt` as the baseline. I exported HEAD with `git archive HEAD` into a scratch dir and rendered it with the same fixtures: `8c9f8329c2afd7963f2533ee1259d9684c126c16a67aa58f1c1fecf7ccdec7f9`. Working tree (`TZ=UTC node .../render.cjs`): `8c9f8329c2afd7963f2533ee1259d9684c126c16a67aa58f1c1fecf7ccdec7f9`, 47064 bytes, 0 THROW, `Hiện tại` ×8, `Present` ×6. These match the note's figures | ok |
| Functionality unchanged (`parseBlogApiResponse`) | Re-ran `parse2.cjs`, pointed at the scratch HEAD export instead of a temp file in `server/`: `identical 18/18`, with both paths hit (3 OK, 15 THROW 502) | ok |
| ≤ 2-param functions untouched | `git diff --stat` touches only the 6 listed code files plus the diagram | ok |
| Build + lint clean, output verbatim | The build claim was not re-run (see Re-run). The **lint claim does not reproduce**: `npm run lint` on the submitted working tree gives `✖ 22 problems (0 errors, 22 warnings)`, but the note says `✖ 13 problems (0 errors, 13 warnings)`. The extra 9 warnings all come from this node's own untracked harness files in `evidence/implementer/2026-10-04/object-parameter-rule-assets/` (`parse2.cjs`, `scan.cjs`, `scan-types.cjs`: `no-console`, `prefer-const`). Running `npx eslint . --ignore-pattern '<assets dir>/**'` gives `✖ 13 problems (0 errors, 13 warnings)`, so the code diff itself does not regress lint | **missing** |
| PM status row on the diagram | The new row was appended **after** the table's footer paragraph ("Any regression must be a **new node** (LAI-13) …"), at line 127. That puts it outside the PM status table: it renders as continuation text of that paragraph, not as a table row. `pick_next.md` requires "APPEND the new row at the END of the PM status table" | **missing** |

Forbidden states: `ADHOC_WORK` no (node + issue exist). `NO_EVIDENCE` no. `CODE_IN_HAVEN` no. `DIAGRAM_DRIFT`: borderline, because the node is not inside the PM table (see above). `EDIT_UNVERIFIED`: the quoted lint output is not what `npm run lint` returns on the tree as submitted.
Seal gate: no outward-facing action recorded or needed. Proportionality: the code diff is minimal (6 functions, 15 call sites). No "tests pass" claim.

## Missing
1. **Lint evidence is not reproducible on the submitted tree.** `npm run lint` now returns `✖ 22 problems (0 errors, 22 warnings)`, not the quoted `13 problems (0 errors, 13 warnings)`. Committing `evidence/` as it stands would raise the repo's lint baseline by 9 warnings, all from this node's harness scripts (`object-parameter-rule-assets/{parse2,scan,scan-types}.cjs`). Fix with either option below, then re-run `npm run lint` on the final tree and quote that output verbatim:
   - keep the harness out of eslint's reach, e.g. an eslint-disable header in each script or an ignore entry; or
   - re-baseline the lint numbers in the note honestly.
2. **The PM status row is outside the table.** The `object-parameter-rule` row sits after the "Any regression must be a new node…" footer paragraph. Move it to the end of the table, directly after the `author-github-see-line` row and before the blank line and footer, so the verifier can update it in place on SEAL.

Everything else is independently confirmed. The code refactor itself (scan `hits 2`, PDF sha256 identical against a real HEAD export, parse `identical 18/18`, lint 13 when the assets are excluded) shows no defect. The next implementer pass only needs to fix the two evidence/bookkeeping items above.

## Re-run
`partial`. Re-ran `scan.cjs`, `scan-types.cjs`, `render.cjs` (both the working tree and a `git archive HEAD` scratch export, so the baseline is independent), `parse2.cjs` (against the scratch HEAD export), and `npm run lint`. I did not re-run `npm run build` or `tsc`.

Reason: the node rewrites the production PDF generator (`/api/generate-pdf`) and the blog API response validator. Those are user-facing server paths whose behavior equivalence rests only on implementer-written harnesses and an implementer-written baseline file, so the cheap seconds-long harnesses were worth re-running independently (outward-facing exception in "Re-run scope"). Once lint failed to reproduce, I skipped the build: the recipe says not to spend a rebuild confirming a note that is already broken. All re-run artifacts stayed in this session's scratchpad. Nothing was written under `server/`.
