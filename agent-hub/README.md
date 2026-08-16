# agent-hub — datvt243.github.io

Hub markdown cho project portfolio/blog Nuxt 3 của Đạt. Thay thế hoàn toàn
quy ước cũ (`.claude/commands/{start-work,finish-work,merge-work,ship}.md` +
`agent-hub/histories/` làm audit trail chính) từ 2026-08-16, chuyển sang kỷ
luật **implementer viết / verifier chấm độc lập**, evidence bắt buộc, 1
diagram làm nguồn trạng thái duy nhất.

## Dùng thế nào
```
/boot                                # 60 giây, đọc doctrine + diagram + evidence gần nhất
/worker implementer "<task>"         # implement → evidence note
/worker verifier "<task>"            # SEAL hoặc REOPEN
# hoặc gộp 2 lệnh trên:
/todo "<task>"                       # 2 lượt tách biệt tự động
```

## Vì sao thay thế hệ thống cũ
Xem `doctrine/domains/PROJECT.md` bảng Decisions, dòng 2026-08-16. Tóm tắt:
muốn verify độc lập chặt hơn (implementer không tự báo done), evidence bắt
buộc thay vì work-log tự do theo ngày.

## Đọc gì trước
1. `NORTHSTAR.md` — "done" nghĩa là gì
2. Root `CLAUDE.md` (ngoài `agent-hub/`) — stack/architecture project thật
3. `doctrine/MEMORY.md` — lệnh build/lint chính xác (không có test suite)
4. `doctrine/domains/PROJECT.md` — traps + decisions, kể cả rút ra từ
   `histories/` cũ

## Lưu ý quan trọng của riêng project này
- **Không có automated test suite.** "Verify" = `npm run build` sạch +
  `npm run lint` sạch + (nếu đổi visual) kiểm UI thật qua Chrome CDP port
  9888. Đừng bao giờ tin/viết "tests pass".
- **`agent-hub/histories/`** vẫn còn nguyên (2 file, 2026-08-11 và
  2026-08-13) — KHÔNG bị xoá, chỉ không còn là nơi ghi audit trail mới.
  Bài học durable trong đó đã được rút vào `doctrine/domains/PROJECT.md`.
- **Git workflow thật** (không push thẳng `main`, branch `bug/<n>` /
  `feature/<n>`, PR flow) vẫn áp dụng — hub không tự động hoá phần git/PR,
  chỉ chi phối kỷ luật implement/verify trong 1 task. Xem
  `doctrine/domains/PROJECT.md` mục Invariants.
