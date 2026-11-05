# 2026-11-05 - pdf-cv-filename (verdict)

- Worker: verifier · Version: 0.1.0
- Node: `pdf-cv-filename` (issue #393, branch `feature/393`, uncommitted working tree)
- Note judged: `evidence/implementer/2026-11-05/pdf-cv-filename-diff.md`
- Verdict: **SEAL** · New PM status: SEALED (archived)

## Isolation proof
This is a separate Agent-tool subagent. Its task string was "You are the VERIFIER worker in this repo's agent-hub (repo root: ..., branch feature/393, uncommitted changes in the working tree). You are a separate subagent from the implementer ... Task: \"/worker verifier agent-hub/evidence/implementer/2026-11-05/pdf-cv-filename-diff.md\" — node `pdf-cv-filename` ... GitHub issue #393". That string is not the implementer's `/todo #393` pass. I started with a blank context and did not write this diff.

## Re-run
none. I audited the note and did not re-run build, lint, typecheck, test or a browser check. I made read-only checks only:
- `stat` mtimes: the source files are from 23:50:29, the tests from 23:50:35 and `.output/nitro.json` from 23:50:57, so the build is newer than the last edit.
- `grep` of `server/api/generate-pdf.ts` and `server/utils/fetchResume.ts` (see criterion 2).
- `grep` of the test cases the note cites.
- `git diff --stat`: 5 files, +14/−2, plus the new test file.

## Reasoning
| Criterion | Verdict | Cited |
|---|---|---|
| (1) Filename comes from `cvFileName`, sanitized; unset, blank or all symbols falls back to `<Full-Name>-CV` | met | `tests/createPDFAts.test.ts:8-9`: `'Võ_Tấn_Đạt CV 2026'`→`Vo_Tan_Dat-CV-2026` and `'a"b\r\nc/../d'`→`a-b-c-d`. Lines 13-15: unset, `'   '` and `'"/\\..'` all give `Vo-Tan-Dat-CV`. `tests/fetchResume.test.ts:23,36`: `cvFileName` is kept. All are inside `Tests  22 passed (22)` |
| (2) A changed `cvFileName` shows up after the cache expires | met | Checked against the code. `generate-pdf.ts:18` is an in-memory `Map`. Line 55 sets `cacheKey = lang`. Line 58 checks the `CACHE_MAX_AGE_MS` age. Line 64 calls `fetchResume(lang)` directly, and `fetchResume.ts` contains no `defineCached`, `cachedFunction` or `useStorage`. Line 78 recomputes `fileName` from `pageRenderAts`, and line 99 sets it in `Content-Disposition` |
| (3) build + lint + typecheck + `npm test` clean | met | `build_exit=0 ◆ ✨ Build complete in 18.3s!`, `lint_exit=0`, `tc_exit=0`, `Test Files  9 passed (9)` / `Tests  22 passed (22)`. The commands match the MEMORY.md table. The Typecheck row has no baseline. Earlier seals accepted this exit-code format, for example `hero-download-shortcut-D-seal.md` |
| Comments per code-comments.md | met | The note lists one `/** */` WHY block on the filename rule and one JSDoc on the type field, with no issue refs |
| Browser check | n/a | No visual change. The filename only reaches the client through the existing `Content-Disposition` header |

## Forbidden states
None hit. The active row said `PENDING` and now moves forward to SEALED. The node exists, the note exists, and no code is in `haven/`.

## Seal gate
No outward action, so this passes.

## Proportionality
This passes. One whitelist entry, one optional type field, a small filename rule and its tests. `generate-pdf.ts` is untouched.

## Supersedes
none. The note greps `#393` and finds only this row.

## Risk carried forward
The backend was not checked live. After deploy, run `curl -sI <site>/api/generate-pdf | grep -i content-disposition`; this is already listed in the note's "Noticed, not done".
