---
name: todo
description: Gộp /worker implementer + /worker verifier thành 1 lệnh cho agent-hub của datvt243.github.io, vẫn chạy 2 lượt tách biệt bên trong (không phá vỡ NeverVerifyOwnWork). Trigger: /todo "<task>"
---

# /todo "<task>"

Orchestrator thuần — KHÔNG tự triển khai lại logic implement/verify riêng.
Gọi lại đúng `worker` skill (`.claude/skills/worker/SKILL.md`) 2 lần, ở 2
lượt tách biệt.

## Steps
1. **Lượt 1 — implementer**: chạy đúng quy trình `/worker implementer
   "<task>"` (load bundle → become → pick_next → implement → build+lint
   thật → evidence note). Dừng ở `sealed_pending_verifier`.
2. **Lượt 2 — verifier**: chạy đúng quy trình `/worker verifier "<task>"`
   như một lượt HOÀN TOÀN RIÊNG — không mang theo suy luận/context của lượt
   1 vào phán quyết, chỉ đọc evidence note vừa ghi (`NeverVerifyOwnWork`
   vẫn áp dụng dù cùng 1 lệnh `/todo` gọi cả hai).
3. **Nếu REOPEN**: tự động quay lại lượt 1 với đúng lý do REOPEN từ evidence
   note của verifier, tối đa **3 lần lặp**. Chạm giới hạn → dừng, báo cáo
   toàn bộ lịch sử REOPEN cho operator tự quyết, không lặp vô hạn.
4. **Nếu SEAL**: dừng, báo kết quả (node, evidence path, PM status mới).
   KHÔNG tự `git commit`/`git push`/mở PR — seal gate trong `agent-hub/CLAUDE.md`
   vẫn áp dụng cho mọi hành động outward-facing, kể cả khi `/todo` tự chạy
   xong cả 2 lượt.

## Hard rules honored
Thừa hưởng toàn bộ hard rules của cả `implementer` và `verifier` (xem
`manifest.yaml` mỗi worker) — `/todo` không có hard rule riêng, chỉ
orchestrate.

## Failure branches
| Failure | Handling |
|---|---|
| Lượt 1 báo `blocked` (thiếu env var, task mơ hồ...) | Dừng ngay, không chạy lượt 2, báo operator |
| REOPEN 3 lần liên tiếp cùng lý do | Dừng, nghi ngờ acceptance criteria hoặc recipe sai — báo operator xem lại node/task, không tự đoán thêm lần 4 |
| Task đòi hỏi outward-facing action ngay giữa lượt 1 | SEAL GATE trong recipe `implement.md` vẫn dừng lại chờ approval như bình thường, `/todo` không bỏ qua bước này |

## Runtime
`/todo "<task>"`. Dùng khi muốn 1 lệnh thay vì gõ `/worker implementer` rồi
`/worker verifier` tay; dùng 2 lệnh tách khi muốn tự đọc evidence giữa 2
bước trước khi để verifier chấm.
