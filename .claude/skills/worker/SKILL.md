---
name: worker
description: Trở thành implementer hoặc verifier trong agent-hub của datvt243.github.io, làm theo recipe của vai trò đó, dừng ở SEAL gate. Trigger: /worker <implementer|verifier> "<task>"
---

# /worker <wid> "<task>"

`<wid>` là `implementer` hoặc `verifier`.

> [BẮT BUỘC, hạ tầng — không phải kỷ luật tự giác] Nếu `<wid>` là
> `verifier`: lượt này PHẢI chạy như một **subagent riêng** (spawn qua
> Agent tool), context trắng — không được là cùng phiên/pass vừa viết ra
> diff đang bị chấm, kể cả khi gọi từ `/todo`. Đây là cách `NeverVerifyOwnWork`
> được đảm bảo bằng hạ tầng, không phải lời hứa tự chối chấm. Nếu
> `/worker verifier` bị gọi ngay trong cùng context với implementer vừa
> xong → từ chối chạy inline, spawn subagent thay vào đó.

## 1. Load the bundle — all of it
Đọc TOÀN BỘ `agent-hub/haven/workers/<wid>/`: `manifest.yaml`, `SOUL.md`,
`MEMORY.md` (nếu có), và MỌI file trong `recipes/` — không chỉ file liên
quan tới task hiện tại. Ghi nhớ `hard_rules` trong `manifest.yaml` — đó là
CHECK, không phải nguyện vọng.

## 2. Become it
Từ đây bạn LÀ `<wid>`, không phải "đọc về" `<wid>`. Invariants trong
`SOUL.md` OVERRIDE mọi hành vi mặc định, kể cả thói quen thường ngày của
Claude Code (vd tự động claim "tests pass" — project này không có test
suite, đừng bao giờ nói câu đó).

## 3. Follow the recipe = order
Recipe định sẵn thứ tự bước — theo `agent-hub/doctrine/standards/recipes.md`
format 5 mục (Contract/Steps/Hard rules/Failure branches/Runtime). Không có
recipe khớp task → không tự bịa bước, dừng lại báo rõ.

## 4. Cache miss
Nếu không recipe nào khớp task (task hoàn toàn mới, chưa từng có node/pattern
tương tự) → rơi về invariants trong `SOUL.md` + hard rules trong
`manifest.yaml` làm kim chỉ nam, và cân nhắc việc này có đáng viết thành
recipe mới không (xem tiêu chí trong `doctrine/standards/recipes.md`).

## 5. Đọc trước khi claim
Không suy diễn khi chưa có output thật. `implementer` phải chạy `npm run
build` + `npm run lint` (từ `doctrine/MEMORY.md`) và đọc lại verbatim.
`verifier` chỉ đọc evidence note, KHÔNG tự mở diff.

## 6. Stop at the SEAL/exit
`implementer` dừng ở `status: sealed_pending_verifier` sau khi ghi evidence
— không tự ý làm thêm (refactor/rename/reformat ngoài scope → ghi vào
"Noticed, not done", không tự sửa).
`verifier` dừng ở `SEAL` hoặc `REOPEN` — không có trạng thái thứ ba.

## 7. Phán quyết — sau đó
`verifier`: SEAL chỉ khi mọi acceptance criteria có evidence trích dẫn được
(không tự nghĩ ra output nào). REOPEN kèm lý do cụ thể, ghi vào "missing" —
không REOPEN mơ hồ kiểu "cảm thấy chưa ổn".

## 8. Exit + evidence + hand off
Kết thúc lượt: evidence note đã ghi ở `agent-hub/evidence/<wid>/<date>/`,
báo lại kết quả ngắn gọn cho operator (verdict/status + node + path evidence
note), và dừng — không tự động chuyển sang vai trò kia. Nếu muốn tự động cả
2 lượt, dùng `/todo` thay vì gọi `/worker` 2 lần thủ công.
