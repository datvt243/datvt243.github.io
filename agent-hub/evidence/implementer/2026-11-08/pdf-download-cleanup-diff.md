# 2026-11-08 - pdf-download-cleanup (diff)

- Worker: implementer · Version: 0.1.0
- Node: `pdf-download-cleanup` (`haven/diagrams/dev-loop.prime-mermaid.md`, PENDING)
- Task: `#423: PDF download: close Chrome on failure, revoke the object URL, fix a stale comment`
- Status: sealed_pending_verifier

## Hub bytes before: 94001

## Feature doc: doctrine/features/resume-pdf-download.md
Not changed. Implements operator answers to its Open questions 1-3; Behavior #3/#4/#6 unchanged.

## Diff
| File | Why |
|---|---|
| `server/api/generate-pdf.ts` | `newPage`/`setContent`/`pdf` wrapped in `try { } finally { await browser.close() }`; `pdfBuffer` hoisted as `let pdfBuffer: Uint8Array` (crit 1) |
| `composables/useDownloadResume.ts` | `setTimeout(() => URL.revokeObjectURL(link.href), 0)` after `link.click()` (crit 2); `@file` header rewritten: names only the Hero button, drops the About-tab mention and the `(issue #N)` refs (crit 3) |
| `agent-hub/haven/diagrams/dev-loop.prime-mermaid.md` | new node row |

## Command
From repo root, verbatim from `doctrine/MEMORY.md`: `npm run build` · `npm run lint` · `npx nuxi typecheck` · `npm test`.
Plus a runtime check: built server (`node .output/server/index.mjs`, PORT=4600) against a local mock resume API on :4599 (`NODE_API` + `NUXT_PUBLIC_NODE_API` both set to the mock), `curl -s -D - 'http://localhost:4600/api/generate-pdf?lang=en'`.

## Output
### npm run build (exit 0, tail)
```
[@nuxt/image] ℹ sharp binaries have been included in your build for darwin-arm64. Make sure you deploy to the same architecture.
[nitro] ✔ You can preview this build using node .output/server/index.mjs
config 191ms · modules 601ms · app 583ms · types 352ms · client 2.53s · server 1.77s · nitro 8.35s
◆ ✨ Build complete in 14.3s!
```
The only 2 `error` matches in the build log are file names: `error-template.mjs`, `error-DhXKUbjL.mjs`.

### npm run lint (exit 0, full)
```

> nuxt-app@1.13.1 lint
> eslint .

```

### npx nuxi typecheck (exit 0, full)
```
ℹ Nuxt Icon server bundle mode is set to local
[nuxt:icon] ✔ Nuxt Icon discovered local-installed 3 collections: fe, grommet-icons, heroicons
```

### npm test (exit 0, tail)
```

 Test Files  10 passed (10)
      Tests  28 passed (28)
   Start at  20:29:22
   Duration  228ms (import 35%, transform 34%, tests 21%, worker 10%)

```

### Runtime check (built server + mock backend)
```
Content-Type: application/pdf
Content-Disposition: attachment; filename="Dat-Vo-CV-EN.pdf"
Content-Length: 36724
%PDF-
headless chrome before=       2 after=       2
onrender hits: 0
```
(`pgrep -f "Google Chrome.*headless"` count before and after the request — Chrome from this request closed; the 2 pre-existing processes are unrelated. `onrender` = 0 → the real backend was never called.)

## Acceptance
| # | Criterion | Evidence |
|---|---|---|
| 1 | Browser closed in `finally` covering newPage/setContent/pdf | Diff of `server/api/generate-pdf.ts` (`try { const page = await browser.newPage() ... } finally { await browser.close() }`); runtime: headless count before=2 after=2, PDF returned |
| 2 | Object URL revoked after click, deferred | `composables/useDownloadResume.ts`: `link.click()` then `setTimeout(() => URL.revokeObjectURL(link.href), 0)` |
| 3 | No About-tab mention; only Hero uses it | Header now "CV-download logic behind the Hero's \"Download CV\" button"; grep `useDownloadResume` → only `themes/portfolio-dev/pages/resumeObject/Hero.vue:14` |
| 4 | build + lint + typecheck + test clean | build `✨ Build complete in 14.3s!` exit 0; lint `eslint .` exit 0, no output; typecheck exit 0, no errors; `Tests  28 passed (28)` |
| 5 | Behavior #3/#4/#6 unchanged | Success/error toast branches untouched in diff; runtime: `Content-Type: application/pdf`, `Content-Disposition: attachment; filename="Dat-Vo-CV-EN.pdf"` |
| 6 | comments per code-comments.md | Added `// A render failure must still close Chrome, or each failed request leaks a process.` (why, 1 line `//`); `// Deferred: revoking synchronously can cancel the download before the browser has read the blob.` (why); `@file` block rewritten, `(issue #179/#198/#206)` refs removed per "Delete: issue refs" |

## Browser verification
Not run in a real browser. Behavior change is a deferred `revokeObjectURL` after the click; the download flow/toasts are otherwise untouched. Server side checked at runtime (above). Verifier may want a real click on the Hero button (`D`) to confirm the download still saves.

## Supersedes: none
## Still open: none

## Noticed, not done
- Failure path (setContent/pdf throwing) not exercised at runtime — hard to trigger externally; covered by the `finally` by construction.
- `generate-pdf.ts` top comment still carries `(see #29)` / `(issue #206)` refs — outside the touched lines.

## Seal gate
none — no commit/push (operator instruction: do NOT commit/push).
