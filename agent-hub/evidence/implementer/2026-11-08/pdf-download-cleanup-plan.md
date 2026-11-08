# 2026-11-08 - pdf-download-cleanup (plan)

- Worker: implementer · Version: 0.1.0
- Node: `pdf-download-cleanup` on `haven/diagrams/dev-loop.prime-mermaid.md` (new row, PENDING; no prior row for #423 in active or archive diagram — grep `423` / slug: 0 hits)
- Task: `#423: PDF download: close Chrome on failure, revoke the object URL, fix a stale comment`

## Hub bytes before: 94001

## Feature doc: doctrine/features/resume-pdf-download.md
Open questions 1-3 are answered by the operator (2026-11-07) as "Bug — #423" / "fix the comment" — this node implements those answers. Behavior #3/#4/#6 are the spec; the fix does not change them.

## Acceptance
See the node row (6 criteria). Self-check (pick_next step 5): each criterion names a file/anchor + a grep or command — no ambiguity/coverage gap found, not rewritten.

## Code anchors
- `server/api/generate-pdf.ts:82-94` — launch / newPage / setContent / pdf / close
- `composables/useDownloadResume.ts:1-11` (header), `:44-47` (createObjectURL + click)
- Callers: `themes/portfolio-dev/pages/resumeObject/Hero.vue:14` (only caller)

## Blockers: none
