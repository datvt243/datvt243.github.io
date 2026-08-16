---
title: datvt243.github.io Agent-Hub Northstar
date: 2026-08-16
status: active
authority: 65537
dna: datvt243_portfolio_hub
---

> Northstar là cái KHÔNG đổi khi mọi thứ khác đổi.

## One sentence
Giữ mọi thay đổi lên portfolio/blog Nuxt 3 của Đạt có bằng chứng verify độc
lập, để một agent phiên sau (hoặc chính Claude phiên sau) không phải re-scan
code hay tin lời note cũ để biết cái gì thật sự xong.

## What done means
Một node CHỈ được coi là xong khi **TẤT CẢ** (không phải chỉ một trong số)
điều sau đúng:

1. Trace được về đúng một node trên `haven/diagrams/`.
2. Có diff nhỏ nhất khiến node đó đủ điều kiện (không refactor thừa).
3. Đã chạy đúng lệnh từ `doctrine/MEMORY.md` (`npm run build` + `npm run
   lint`) và ĐỌC LẠI output — không suy luận. Project này KHÔNG có automated
   test suite; "verify" ở đây gồm cả kiểm tra UI thật qua Chrome CDP khi thay
   đổi có phần visual (xem `doctrine/domains/PROJECT.md`).
4. Có evidence note tại `evidence/<...>/<date>-<slug>.md`.
5. Verifier trả `SEAL` với evidence trích dẫn cụ thể.
6. Bảng PM status trên diagram đã cập nhật khớp.

Thiếu điều (3) hoặc (5) → forbidden state `EDIT_UNVERIFIED`.

## What this hub does NOT do
- Không tự động tạo GitHub issue/branch/PR (`ADHOC_WORK` nếu code bị sửa mà
  không qua node trên diagram, nhưng việc mở issue/PR/branch/merge vẫn là
  thao tác git thủ công của operator, ngoài phạm vi `/worker`/`/todo`).
- Không tự commit/push thay operator (`EDIT_UNVERIFIED` nếu claim đã
  push/merge mà chưa có xác nhận thật — seal gate luôn dừng lại chờ approval).
- Không tự bịa lệnh test — project không có test suite, và hub sẽ không giả
  vờ có (`EDIT_UNVERIFIED` nếu claim "tests pass" khi không có test nào).
- Không ghi code vào `haven/` (`CODE_IN_HAVEN`).

## The success picture (3 months out)
- Mọi thay đổi outward-facing (build/lint-breaking risk cao, thay đổi theme,
  thay đổi caching) đều đi qua implementer → verifier → evidence trước khi
  commit.
- `doctrine/domains/PROJECT.md` tích luỹ đủ traps để không lặp lại bug đã gặp
  (ví dụ: `@iconify-json/*` phải nằm ở `dependencies`, không phải
  `devDependencies`).
- 0 forbidden state trong 20 thay đổi gần nhất.
- `haven/diagrams/dev-loop.prime-mermaid.md` phản ánh đúng trạng thái thật,
  không lệch với code.
- Ít nhất vài recipe trong `haven/workers/*/recipes/` đã được replay ≥ 2 lần.

## Cross-references
`CLAUDE.md` (root, project thật) · `agent-hub/CLAUDE.md` (hợp đồng hub) ·
`doctrine/MEMORY.md` · `haven/diagrams/dev-loop.prime-mermaid.md`
