# 2026-11-05 - pdf-cv-filename (diff)
- Worker: implementer · Version 0.1.0
- Node: `pdf-cv-filename` (`haven/diagrams/dev-loop.prime-mermaid.md`)
- Task: `/todo #393` — "feat(pdf): đặt tên file PDF download theo cvFileName từ API"; branch `feature/393`
- Status: sealed_pending_verifier

## Hub bytes before
81192

## Diff
| File | Why |
|---|---|
| `server/utils/fetchResume.ts` | `'cvFileName'` added to `PUBLIC_FIELDS` — whitelist otherwise strips the new top-level field |
| `server/utils/createPDFAts.ts` | destructure `cvFileName`; `ownFileName` = tones removed, `[^\w-]+`→`-`, edge dashes trimmed; `fileName = ownFileName || <old fallback line unchanged>` |
| `types/resume-document.ts` | `Information.cvFileName?: string` (flows into `ResumeAPIResponse['data']` and `AtsRecord`) |
| `tests/fetchResume.test.ts` | whitelist case now asserts `cvFileName` is kept |
| `tests/createPDFAts.test.ts` (new) | cvFileName used + sanitized; unset/blank/all-symbols → `Vo-Tan-Dat-CV` |
| `agent-hub/haven/diagrams/dev-loop.prime-mermaid.md` | node row `pdf-cv-filename` |
`server/api/generate-pdf.ts` untouched: it already sends `pageRenderAts`'s `fileName` in `Content-Disposition` and caches it.

## Command
`npm test` · `npm run build` · `npm run lint` · `npx nuxi typecheck` (repo root, per `doctrine/MEMORY.md`)

## Output
```
 Test Files  9 passed (9)
      Tests  22 passed (22)
```
```
build_exit=0
◆ ✨ Build complete in 18.3s!
```
```
lint_exit=0
tc_exit=0
```
(lint/typecheck printed no errors; exit codes captured with `echo $?` after each command.)

## Acceptance
| Criterion | Evidence |
|---|---|
| (1) filename = API `cvFileName`, sanitized; none → current name | `tests/createPDFAts.test.ts`: `'Võ_Tấn_Đạt CV 2026'`→`Vo_Tan_Dat-CV-2026`, `'a"b\r\nc/../d'`→`a-b-c-d`; unset/`'   '`/`'"/\\..'`→`Vo-Tan-Dat-CV`; `tests/fetchResume.test.ts` keeps `cvFileName` — within "Tests 22 passed (22)" |
| (2) changed `cvFileName` → new name after cache expiry | code: `generate-pdf.ts` caches only in its in-memory Map (`CACHE_MAX_AGE_MS` 1 day, key = lang) and calls `fetchResume(lang)` directly (no cached handler in between); name is recomputed on each regeneration. No cache-key change needed — issue allows "sau khi cache hết hạn" |
| (3) build+lint+typecheck+test clean | Output above |
| comments per code-comments.md | one `/** */` WHY block (multi-sentence) on the filename rule, one JSDoc on the type field; no issue refs |
| Browser check | none — no UI change; the client already reads `Content-Disposition` (`composables/useDownloadResume.ts`) |

## Supersedes: none
`grep '#393'` on the active diagram → 1 row (this node).

## Noticed, not done
- No live check against the real backend (rate-limited; owner's `cvFileName` may be unset there, so it would only show the fallback). Live proof after deploy: `curl -sI <site>/api/generate-pdf | grep -i content-disposition`.
- `cvFileName` now also reaches `/api/resume`'s payload — it's public on the backend's `/api/me` anyway.

## Seal gate
none (no commit/push in this pass)
