# 2026-10-31 - pages-nojekyll (SEAL)

- Worker: verifier · Version: 0.1.0
- Node: `pages-nojekyll` (#335, branch `bug/335`)
- Notes graded: `evidence/implementer/2026-10-31/pages-nojekyll-plan.md`, `evidence/implementer/2026-10-31/pages-nojekyll-diff.md`
- Verdict: **SEAL**

## Isolation proof
Separate subagent spawned via the Agent tool for "pass 2 of `/todo #335`" with the task string "You are running `/worker verifier` ... Node: `pages-nojekyll` ... Evidence notes: ...-plan.md and ...-diff.md" (differs from the implementer's issue-#335 task); this context did not write the diff.

## Re-run
none — note's output follows the same form as prior SEALed notes, commands match `doctrine/MEMORY.md`, no UI part. Read-only cross-checks only (no build/lint/typecheck/test re-run): `wc -c < .nojekyll` → `0`; `git check-ignore -v .nojekyll` → exit 1; `git status --short .nojekyll` → `?? .nojekyll` (untracked, not ignored: commit is left to `/ship`).

## Criteria
| # | Criterion | Evidence cited | OK |
|---|---|---|---|
| 1 | Empty `.nojekyll` at repo root, not gitignored | Note: `wc -c < .nojekyll → 0`, `check-ignore → exit 1`; re-observed above | yes |
| 2 | build + lint + typecheck + `npm test` | Note: `lint=0`, `typecheck=0` / `error TS`=0, `Tests 11 passed (11)`, `Build complete in 28.9s!` (mock backend :4199) | yes |
| 3 | Pages build green | NOT observed. The diagram row's own acceptance states it is "only verifiable after the next `/release` to `main`", and the note carries it under `## Still open`. No implementer pass can produce this evidence before the file reaches `main`, so a REOPEN could not be satisfied; accepted as an open item outside this node, same as the `Still open` PDF part in `github-no-retry-5xx-seal.md` | open (accepted) |
| — | comments per code-comments.md | Note: no comments added (0-byte file) | yes |

## Checks
- 7b: no other open row for #335 on the active diagram; `## Supersedes: none`.
- Forbidden states: none hit (node on diagram, evidence written, outputs cited, no code in `haven/`, PM row updated by this SEAL). `EDIT_UNVERIFIED` not hit: criterion 3 is declared unverified, not claimed.
- Seal gate: no outward-facing action in the diff (`## Seal gate: none`).
- Proportionality: one empty file plus the diagram row. Smallest possible fix at the cause (legacy Jekyll build over `agent-hub/evidence/**` Vue `{{ }}` syntax).

## Still open (carried forward)
- Criterion 3: after the next `/release`, run `gh run list --workflow pages-build-deployment` on `main` and confirm green. Until then, the PR should use `Refs #335`, not `Closes #335`, or #335 closes before the fix is observed.

## Residual risk (from the note's "Noticed, not done", not blocking)
There is no root `index.html` (confirmed: `ls index.html` → not found). With Jekyll off, datvt243.github.io stops rendering `README.md` and likely 404s at `/`. Root `CLAUDE.md` says that domain is not the canonical site (SITE_URL defaults to the Vercel host), so production is not affected. If a 404 there is unwanted, turning Pages off is the cleaner follow-up.
