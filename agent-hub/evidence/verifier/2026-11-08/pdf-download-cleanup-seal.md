# 2026-11-08 - pdf-download-cleanup (SEAL, round 2)

- Worker: verifier · Version: 0.1.0
- Node: `pdf-download-cleanup` (#423) — IN_PROGRESS → SEALED (archived)
- Notes audited: `evidence/implementer/2026-11-08/pdf-download-cleanup-r2-diff.md` (round 2, re-read from disk), `pdf-download-cleanup-diff.md` (round 1, crit 1-4/6)
- Prior verdict: `evidence/verifier/2026-11-08/pdf-download-cleanup-reopen.md`

## Verdict: SEAL
forbidden_hit: none

## Cited
- Crit 1 (Chrome closed in `finally`): round-1 note + spot-grep `server/api/generate-pdf.ts:85-95`; runtime headless count before=2 after=2.
- Crit 2 (deferred revoke): `useDownloadResume.ts:45,47`; the save still works with it in place — `~/Downloads/Dat-Vo-CV-EN.pdf` 36724 bytes, `head -c 4` = `%PDF` (re-checked by me).
- Crit 3 (stale comment): round 1, holds (grep `About` → 0).
- Crit 4: round-1 verbatim build/lint/typecheck/`npm test` (28/28) still covers the code; `git diff --stat` for the two code files is unchanged since round 1 (14 / 26 lines), so no re-run needed.
- Crit 5 / feature doc Behavior #3, #4, #6 + its "real browser" acceptance criterion: real click on built server + mock (onrender hits 0) → `status 200`, `filename="Dat-Vo-CV-EN.pdf"`, toast `CV downloaded!` (screenshot `success-toast.png` viewed by me: green "CV downloaded!" toast). Server killed → toast `Couldn't download the CV. Please try again.`, `disabledAfter: false` (screenshot `error-toast.png` viewed: red error toast, button enabled-looking).
- Crit 6: no comments touched in round 2; round-1 row holds.
- `## Supersedes: none`, `## Still open: none`; `## Feature doc` line present, not changed.

## Missing: none
Not counted as a gap: the loading state was not captured (cache answered too fast). The diff doesn't touch that code; Behavior #2 isn't a criterion of this node.

## Forbidden states
ADHOC_WORK no · NO_EVIDENCE no · EDIT_UNVERIFIED no (browser evidence now concrete) · CODE_IN_HAVEN no · DIAGRAM_DRIFT no.

## Seal gate
Not outward-facing (no commit/push) — none required.

## Proportionality
3 files (+ diagram/evidence), within the node's scope.

## Feature doc
`doctrine/features/resume-pdf-download.md`: a fix SEAL, so its Status stays as is (11e).

## Doctrine proposal: none

## Isolation proof
Same verifier subagent, resumed for round 2 by the coordinator message "Round 2 for #423 (node pdf-download-cleanup): re-verify against the implementer's new note..." — not the implementer's context.

## Re-run: partial
`git diff --stat`, `ls -l ~/Downloads/Dat-Vo-CV-EN*.pdf`, `head -c 4` of the saved PDF, and viewed both screenshots. Reason: confirming the round-2 browser claims, which were the gap that caused the REOPEN (operator asked for re-checks from real output).

## PM
Row archived to `haven/diagrams/dev-loop-archive.md`; active row is now a pointer; oldest pointer (`hero-intro-full-avatar-128`, already in archive) pruned to keep 20.
