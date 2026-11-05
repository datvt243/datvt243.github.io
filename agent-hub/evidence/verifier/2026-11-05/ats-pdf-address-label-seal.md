# 2026-11-05 - ats-pdf-address-label (verifier: SEAL)

- Worker: verifier · Version: 0.1.0
- Node: `ats-pdf-address-label` (#392), branch `bug/392`, uncommitted
- Note graded: `evidence/implementer/2026-11-05/ats-pdf-address-label-diff.md`
- New PM status: SEALED. Row archived to `haven/diagrams/dev-loop-archive.md` and replaced by a pointer.

## Verdict: SEAL

## Reasoning
| Criterion | Evidence (note + my own re-run) | Result |
|---|---|---|
| 1. Address on its own line with localized label | Note PDF text: `Địa chỉ: Quận Gò Vấp, TP. Hồ Chí Minh` (vi), `Address: Quận Gò Vấp, TP. Hồ Chí Minh` (en). Re-run (fresh outdir `scratchpad/ats-verify/`): line 3 `Địa chỉ: Quận Gò Vấp, TP. Hồ Chí Minh` (vi), `Address: Quận Gò Vấp, TP. Hồ Chí Minh` (en), each its own line | cited + reproduced |
| 2. Phone/email/links line unchanged apart from losing the address | Note + re-run line 4, both langs: `0901234567 · dat@example.com · https://linkedin.com/in/x · https://github.com/datvt243 · https://resume-nuxt-vert.vercel.app` (no address, ` · ` separator) | cited + reproduced |
| 3. build + lint + typecheck + test clean | `◆ ✨ Build complete in 14.6s!` (build=0, one pre-existing `@__NO_SIDE_EFFECTS__` WARN, cross-referenced to script-csp-enforce-diff.md), `lint=0`, `typecheck=0 ts_errors=0`, `Test Files  8 passed (8) / Tests  20 passed (20)` | cited |
| 4. Printed PDF has the labeled address line, both langs | Note's pypdf extract; reproduced by my re-run (above), PDFs printed via puppeteer-core + local Chrome from fixture data, no backend | cited + reproduced |
| comments per code-comments.md | Row present: no comment added or changed | cited |
| Step 4: commands match `doctrine/MEMORY.md` | Yes; Typecheck row has no `baseline:` | ok |
| Step 5: truncation | Only `…` shortens the text of a pre-existing build WARN (same as accepted precedent in script-csp-enforce-seal.md); build/test result lines verbatim | ok |
| 7b: Supersedes / Still open | `Supersedes: none`; only #392 row on the active diagram was this node. Still open: operator's manual CV-review-website check after deploy (outside node acceptance) | ok |

## Forbidden states / seal gate / proportionality
- Forbidden states: none of the 5 hit (node exists, note exists, no code in `haven/`, outputs run and reproduced, PM status updated here).
- Seal gate: `none`; nothing committed or pushed.
- Proportionality: `git diff --stat` → `server/utils/createPDFAts.ts | 4 +++-`, diagram `+1`. Matches the Diff table, no unclaimed file.

## Isolation proof
Spawned as a separate verifier subagent via the Agent tool. Task string starts "You are the VERIFIER in this repo's agent-hub ... Run `/worker verifier` for node `ats-pdf-address-label` (GitHub issue #392, branch `bug/392`, currently checked out — do not switch branches, do not commit/push)". Differs from the implementer's task (`/todo "fix tất cả các issue bug"`). This context didn't write or open the diff contents; it read the note, hub docs, `git diff --stat`, and the scratchpad render script.

## Re-run
partial. Reason: outward-facing exception (the ATS PDF is the downloadable resume on the live site). Re-ran only the PDF check: `npx vite-node --config vitest.config.ts scratchpad/ats/render.ts scratchpad/ats-verify` + pypdf extraction (`venv/bin/python -I`). Fixture data only, no backend call. Did not re-run build/lint/typecheck/`npm test`: verbatim results in the note, source unchanged since.

## PM status
- `ats-pdf-address-label`: IN_PROGRESS → SEALED. Full row appended to `dev-loop-archive.md` (main archived table) and replaced by a pointer.
- That made 26 pointer rows; deleted the 6 oldest (`resume-content-locale`, `vi-glyph-fallback`, `pages-nojekyll`, `skills-typo-map-drop`, `pdf-two-pages`, `blog-content-sanitize`, full rows confirmed in the archive). 20 remain.
