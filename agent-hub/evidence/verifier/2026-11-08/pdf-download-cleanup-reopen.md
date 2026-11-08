# 2026-11-08 - pdf-download-cleanup (REOPEN)

- Worker: verifier · Version: 0.1.0
- Node: `pdf-download-cleanup` (`haven/diagrams/dev-loop.prime-mermaid.md`) — PENDING → IN_PROGRESS
- Note audited: `evidence/implementer/2026-11-08/pdf-download-cleanup-diff.md` (+ `-plan.md`)
- Task: `#423: PDF download: close Chrome on failure, revoke the object URL, fix a stale comment`

## Verdict: REOPEN
forbidden_hit: `EDIT_UNVERIFIED` (behavior change claimed safe without a real-browser run)

## Cited (holds)
- Crit 1: note quotes `try { ... newPage ... } finally { await browser.close() }`; spot-grep confirms `server/api/generate-pdf.ts:85-95` (`try {` / `newPage` / `setContent` / `page.pdf` / `} finally {` / `await browser.close()`). Runtime: `Content-Type: application/pdf`, headless count before=2 after=2.
- Crit 2: `link.click()` then `setTimeout(() => URL.revokeObjectURL(link.href), 0)`; grep confirms `composables/useDownloadResume.ts:45,47`.
- Crit 3: header now "CV-download logic behind the Hero's \"Download CV\" button"; grep `About` in the composable → 0 hits.
- Crit 4: build `✨ Build complete in 14.3s!` exit 0; `eslint .` exit 0 no output; `npx nuxi typecheck` exit 0, no errors; `Tests  28 passed (28)`. Commands match `doctrine/MEMORY.md`. No truncation markers.
- Crit 6: both new comments are one-line whys; issue refs removed from the rewritten `@file` block.

## Missing
- Crit 5 / feature doc `resume-pdf-download.md` Behavior #3 + its acceptance criterion "Clicking the button in a real browser downloads a PDF and shows the success toast": no evidence. The note's own `## Browser verification` says "Not run in a real browser". Criterion 2 is a client-side behavior change in exactly this path — revoking the blob URL is the one thing that could stop the save — and the curl runtime check only exercises the server. Project rule (`agent-hub/CLAUDE.md` Project extensions; verifier SOUL invariant 7): a behavior change needs real UI verification via Chrome CDP (port 9888), cited concretely (download event/saved filename, success-toast text, screenshot path).
- To fix: run `/browser`, click the Hero "Download CV" button (or press `D`) against the built server + mock backend, cite the download (e.g. Playwright `download.suggestedFilename()` = `Dat-Vo-CV-EN.pdf`, non-zero size) and the success toast text. Optional per feature doc: server stopped → error toast, button re-enabled.

## Forbidden states
ADHOC_WORK no (node exists) · NO_EVIDENCE no · EDIT_UNVERIFIED **yes** (above) · CODE_IN_HAVEN no · DIAGRAM_DRIFT no (row added).

## Seal gate
Not outward-facing (no commit/push) — none required.

## Proportionality
Diff 3 files, +22/−19 (`git diff --stat`); within the node's scope.

## Doctrine proposal: none

## Isolation proof
Fresh Agent-tool spawn for this verify pass; prompt began "You are running `/worker verifier` for the datvt243.github.io project ... You must NOT trust the implementer's claims — re-check from the code and real command output only." — not the implementer's task string.

## Re-run: partial
`git diff --stat` + `grep` of the cited lines in `server/api/generate-pdf.ts` / `composables/useDownloadResume.ts` (confirming the note's quotes). No build/lint/typecheck/test re-run — the note's outputs are verbatim and not the gap. Reason: operator instruction for this spawn asked to re-check the code, not only the note.
