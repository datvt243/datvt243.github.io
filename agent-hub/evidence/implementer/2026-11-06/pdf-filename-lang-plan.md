# 2026-11-06 - pdf-filename-lang (plan)
- Worker: implementer · Version 0.1.0
- Node: `pdf-filename-lang` (`haven/diagrams/dev-loop.prime-mermaid.md`)
- Task: `/todo "kiểm tra lại #393, filename đã có lang VI/EN ở cuối chưa? chưa có thì tự thêm vào"` → new issue #409; branch `feature/409` off `staging` @ aeac495

## Hub bytes before: 81168

## Findings
- Check result: NOT present. `server/utils/createPDFAts.ts` `fileName = ownFileName || <Full-Name>-CV` — `lang` (2nd arg of `pageRenderAts`) unused for the name.
- `server/api/generate-pdf.ts` caches per `lang` and sends `${fileName}.pdf`; no change needed there.
- `tests/createPDFAts.test.ts` asserts exact names (default lang `vi`) → must be updated.

## Anchors
`server/utils/createPDFAts.ts`, `tests/createPDFAts.test.ts`.
