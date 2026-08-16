> Evidence là ai đã làm gì và tại sao (`NO_EVIDENCE` nếu thiếu). Mọi worker
> action kết thúc bằng một note.

## Layout
```
evidence/implementer/<date>/<slug>-plan.md
evidence/implementer/<date>/<slug>-diff.md
evidence/verifier/<date>/<slug>-{seal|reopen}.md
```
Ngày dạng `YYYY-mm-dd`, slug kebab-case lấy từ tên task.

## Format — implementer note
- Tiêu đề (ngày - node) · Worker · Version · Node (trỏ diagram) · Task
  (nguyên văn prompt)
- `## Diff` — files | file | why |
- `## Command` — lệnh nguyên văn từ `doctrine/MEMORY.md` (`npm run build`,
  `npm run lint` — KHÔNG BAO GIỜ `npm test`, project không có test suite)
- `## Output` — nguyên văn, không tự diễn giải
- `## Browser verification` — chỉ cần nếu node đổi visual/behavior:
  screenshot path hoặc computed style trích dẫn được qua Chrome CDP, hoặc
  ghi rõ "N/A — no visual change" nếu không áp dụng
- `## Acceptance` — bảng | Criterion | Evidence | (evidence trỏ tới dòng
  output cụ thể — không nói suông "build ổn", phải trích verbatim)
- `## Noticed, not done` — điều nhận thấy ngoài scope nhưng không tự sửa
- `## Seal gate` — ghi approval nếu có hành động outward-facing, hoặc "none"

## Format — verifier verdict
- Worker · Node · PM status mới (PENDING/SEALED/REOPEN)
- `## Reasoning` — trích dẫn evidence cho từng criterion
- `## Missing` — chỉ có khi REOPEN

## The three rules of this directory
1. **VERBATIM, ALWAYS** — không claim gì thiếu evidence trích dẫn thật.
2. **KHÔNG BAO GIỜ XOÁ** — note sai thì thêm correction, không xoá.
3. **BAD NOTES STAY** — note "task thất bại" vẫn giữ lại; giữ trail sạch
   không quan trọng bằng giữ giá trị của doctrine.

## Quan hệ với `agent-hub/histories/`
`histories/` là work-log cũ (trước khi hub này tồn tại) — vẫn giữ nguyên,
không di chuyển/xoá, nhưng KHÔNG còn là nơi ghi audit trail mới. Từ
2026-08-16, mọi hành động implementer/verifier ghi vào đây.
