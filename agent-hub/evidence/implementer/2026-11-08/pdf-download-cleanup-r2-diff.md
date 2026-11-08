# 2026-11-08 - pdf-download-cleanup (diff, REOPEN round 1 fix)

- Worker: implementer · Version: 0.1.0
- Node: `pdf-download-cleanup` (`haven/diagrams/dev-loop.prime-mermaid.md`, IN_PROGRESS)
- Task: `#423: PDF download: close Chrome on failure, revoke the object URL, fix a stale comment`
- Answers: `evidence/verifier/2026-11-08/pdf-download-cleanup-reopen.md` (Missing: crit 5, no real-browser click)
- Prior note (diff, commands, outputs, crit 1-4 and 6): `evidence/implementer/2026-11-08/pdf-download-cleanup-diff.md`
- Status: sealed_pending_verifier

## Hub bytes before: 94001

## Feature doc: doctrine/features/resume-pdf-download.md
Not changed.

## Diff
No code change in this round. The browser saved the PDF with the deferred `revokeObjectURL` in place, so the round-1 diff stands as is (`server/api/generate-pdf.ts`, `composables/useDownloadResume.ts`). Build, lint, typecheck and test were not re-run: no file changed after the round-1 run.

## Command
Same 4 commands as the round-1 note (unchanged outputs). Browser check:
- Built server `node .output/server/index.mjs` on PORT=4600, with `NODE_API` and `NUXT_PUBLIC_NODE_API` both set to a local mock resume API on :4599. Server log `grep -c onrender` = `0`.
- Chrome 156.0.8078.80 on CDP :9888 (`curl -s http://localhost:9888/json/version`), driven by the Playwright MCP. A new tab was opened at `http://localhost:4600/` and selected. `document.visibilityState` = `"visible"` before every step.
- The language toggle (`aria-label="VI, Chuyển ngôn ngữ"`) was clicked. Result: URL `http://localhost:4600/en`, `document.documentElement.lang` = `en-US`, button label `Download CV D`.
- Then a real `click()` on the Hero `Download CV` button.

## Output
### Success path (real click)
```
{"visibility":"visible","url":"http://localhost:4600/api/generate-pdf?lang=en","status":200,"cd":"attachment; filename=\"Dat-Vo-CV-EN.pdf\"","len":"36724","loading":{"disabled":false,"label":"Download CV D","toasts":["CV downloaded!"]},"success":"CV downloaded!","after":{"disabled":false,"toasts":["CV downloaded!"]}}
```
The file that Chrome itself saved, from `ls -lt ~/Downloads`:
```
-rw-r--r--@ 1 _david  staff     36724 Nov  8 20:34 Dat-Vo-CV-EN (1).pdf
-rw-r--r--@ 1 _david  staff     36724 Nov  8 20:33 Dat-Vo-CV-EN.pdf
```
`head -c 4 ~/Downloads/Dat-Vo-CV-EN.pdf` → `%PDF`. There are 2 files because there were 2 clicks. The first attempt to capture the toast was too late: the toast had already closed after its 4s duration. That click still saved `Dat-Vo-CV-EN.pdf`.

Playwright's `waitForEvent('download')` timed out on the first click (30000ms). That is expected when Playwright is connected over CDP to an existing Chrome profile: Chrome's own download manager handles the save, so Playwright gets no event. The saved file in `~/Downloads` is the proof of the download, not the Playwright event.

Screenshot: `/private/tmp/claude-501/-Users--david-Workspace-Project-resume-datvt243-github-io/6253f0a5-1189-48e8-a5d8-672d22d9691f/scratchpad/success-toast.png`

### Error path (server stopped, same tab)
`kill 23807` (the `node .output/server/index.mjs` on :4600); after that, `curl` to :4600 returned `000`. Then a real click:
```
{"visibility":"visible","err":"Couldn't download the CV. Please try again.","toasts":["Couldn't download the CV. Please try again."],"disabledAfter":false}
```
Screenshot: `/private/tmp/claude-501/-Users--david-Workspace-Project-resume-datvt243-github-io/6253f0a5-1189-48e8-a5d8-672d22d9691f/scratchpad/error-toast.png`. The page console logged 2 errors, which are the expected failed fetches to the stopped server.

## Acceptance
| # | Criterion | Evidence |
|---|---|---|
| 1 | Browser closed in `finally` | round-1 note (holds per verifier's Cited) |
| 2 | Object URL revoked after click, deferred | round-1 note. Revoking does not break the save: `Dat-Vo-CV-EN.pdf` 36724 bytes in `~/Downloads`, starts with `%PDF` |
| 3 | Stale comment fixed | round-1 note (holds) |
| 4 | build + lint + typecheck + test clean | round-1 note. No code change since then |
| 5 | Behavior #3/#4/#6 unchanged (real browser) | #3: `status 200`, `filename="Dat-Vo-CV-EN.pdf"`, file saved (36724 bytes), toast `CV downloaded!`. #4: server stopped → toast `Couldn't download the CV. Please try again.`, `disabledAfter: false` (button usable, a click is the retry). #6: server-side PDF generated (`%PDF`, 36724 bytes) |
| 6 | comments per code-comments.md | No comments touched in this round. Round-1 row holds |

## Browser verification
See Output. Screenshots: `success-toast.png`, `error-toast.png` (scratchpad paths above; session-scoped).

## Supersedes: none
## Still open: none

## Noticed, not done
- The loading state ("downloading" label, disabled button) was not captured: the second request was served from the 1-day in-memory cache too quickly. The diff did not change that code.
- `https://resume-nuxt-vert.vercel.app/` shows `502: BAD_GATEWAY` in an existing tab of the debug Chrome. Not checked; it may relate to #451's empty-resume-is-502 rule or to the backend being down.
- 2 test downloads remain in `~/Downloads` (`Dat-Vo-CV-EN.pdf`, `Dat-Vo-CV-EN (1).pdf`). Left in place, not deleted.

## Seal gate
none — no commit/push.
