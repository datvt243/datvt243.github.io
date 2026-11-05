# 2026-11-06 - pdf-filename-lang (diff)
- Worker: implementer · Version 0.1.0
- Node: `pdf-filename-lang` (`haven/diagrams/dev-loop.prime-mermaid.md`)
- Task: #409 (follow-up #393) — "feat(pdf): thêm hậu tố ngôn ngữ VI/EN vào tên file PDF download"; branch `feature/409`
- Status: sealed_pending_verifier

## Hub bytes before
81168

## Diff
| File | Why |
|---|---|
| `server/utils/createPDFAts.ts` | `fileName = \`${ownFileName \|\| <fallback unchanged>}-${lang.toUpperCase()}\``; one WHY line added to the existing `/** */` block |
| `tests/createPDFAts.test.ts` | existing expectations get `-VI` (default lang); new case for `en` (cvFileName + fallback) |
| `agent-hub/haven/diagrams/dev-loop.prime-mermaid.md` | node row `pdf-filename-lang` |
`server/api/generate-pdf.ts` untouched: `lang` is normalized at line 54 (`query.lang === 'en' ? 'en' : 'vi'`), so the suffix is only ever `VI`/`EN` — header-safe; cache already keyed by lang.

## Command
`npm test` · `npm run lint` · `npx nuxi typecheck` · `npm run build` (repo root)

## Output
```
 Test Files  10 passed (10)
      Tests  24 passed (24)
lint_exit=0
tc_exit=0
◆ ✨ Build complete in 16.7s!
```
(build exit code not captured — `PIPESTATUS` empty under zsh; the success line is nitro's final output.)

## Acceptance
| Criterion | Evidence |
|---|---|
| (1) `-VI`/`-EN` for cvFileName and fallback | tests: `'Võ_Tấn_Đạt CV 2026'`→`Vo_Tan_Dat-CV-2026-VI`, unset→`Vo-Tan-Dat-CV-VI`, `('Vo_Tan_Dat CV','en')`→`Vo_Tan_Dat-CV-EN`, `(undefined,'en')`→`Vo-Tan-Dat-CV-EN` — in "Tests 24 passed (24)" |
| (2) only `[A-Za-z0-9_-]` | `a"b\r\nc/../d`→`a-b-c-d-VI`; suffix from normalized `lang` only |
| (3) build+lint+typecheck clean | Output above |
| comments per code-comments.md | 1 WHY sentence in existing block, no issue ref |
| Browser check | none — no UI change; client reads `Content-Disposition` (`composables/useDownloadResume.ts:46`) |

## Supersedes: none
`grep '#409'` on the active diagram → 1 row (this node). `pdf-cv-filename` (#393) already SEALED; this is a new node per LAI-13.

## Noticed, not done
- Live in-memory PDF cache (1 day) on prod serves the old name until a deploy restarts it — a deploy always does.

## Seal gate
none (no commit/push in this pass)
