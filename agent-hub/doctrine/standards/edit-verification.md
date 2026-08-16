> "You may not claim an outcome you have not observed." Quy tắc bị vi phạm
> nhiều nhất trong agent work. Exceptions: None.

## The rule
Chỉ được báo hoàn tất khi output đã thực sự được xuất ra và đọc lại — không
phải khi bạn nghĩ edit đã đúng. Project này KHÔNG có test suite; "output"
nghĩa là `npm run build`/`npm run lint` verbatim, và với thay đổi visual,
screenshot/DOM query thật qua Chrome CDP (port 9888).

## Not evidence vs Evidence
| Not evidence | Evidence |
|---|---|
| "Fix này chắc sẽ giải quyết được lỗi" | Chạy `npm run build`, đọc output thật |
| "Build should pass now" | Verbatim log — build không lỗi, không warning bị bỏ qua |
| "UI chắc đúng rồi" | Screenshot/computed style thật qua Chrome CDP, trích cụ thể (vd màu `rgb(...)` đọc được) |
| "Tests pass" | KHÔNG BAO GIỜ dùng câu này — project không có test suite |

## Why reasoning doesn't count
Lập luận về code không phải là chạy code. Mô hình thường tin vào mô tả của
chính nó hơn là kiểm tra thật.

## What read back means
Copy nguyên văn lệnh CHÍNH XÁC từ `doctrine/MEMORY.md`, chạy, đọc kết quả
verbatim, ghi vào evidence note — không tự diễn giải, không tóm tắt thành
kết luận riêng.

## No Exceptions
Chưa verify được → báo `blocked`. Không có ngoại lệ "chắc là đúng".

## Failure mode this catches
"Green-by-supposition" — tự claim build/UI đúng mà không thực sự chạy/kiểm.

## Enforcement
Implementer: hard rule `TestsBeforeDone` (ở đây nghĩa là build+lint trước
done). Verifier: hard rule `EvidencePerAction` — claim không đủ bằng chứng →
REOPEN. Liên quan: `EDIT_UNVERIFIED`.
