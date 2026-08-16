> Đây là recipe chạm code nhiều nhất — chỗ `EDIT_UNVERIFIED` bị bắt hoặc lọt qua.

# Contract
- Input: output của `pick_next`.
- Output: `{status: sealed_pending_verifier | reopened_by_build | failed,
  node, diff summary, command, evidence}`
- NEVER: `status: done` — chỉ verifier mới dùng trạng thái đã seal.

## Steps
1. Đọc lại node + acceptance criteria.
2. Đọc mọi file liên quan trước khi viết — khớp naming/style/idiom hiện có
   (vd `Theme*` prefix tag convention, semantic Tailwind token
   `bg-theme-*`/`text-theme-*` thay vì literal color).
3. Smallest diff — chỉ đổi cái acceptance criteria đòi hỏi.
4. SEAL GATE trước hành động outward-facing (commit/push/xoá file/mở PR) —
   dừng, show diff, đợi approval.
5. Chạy CHÍNH XÁC lệnh từ `doctrine/MEMORY.md`: `npm run build` rồi `npm run
   lint` — copy nguyên văn, không đoán.
6. ĐỌC OUTPUT LẠI nguyên văn — claim không trích dẫn được = `EDIT_UNVERIFIED`.
7. Nếu thay đổi có phần visual/behavior người dùng thấy được: kiểm UI thật
   qua Chrome CDP port 9888 (`curl -s http://localhost:9888/json/version`
   để check đã chạy chưa; nếu chưa, launch với
   `--remote-debugging-port=9888 --user-data-dir="$HOME/.chrome-debug-profile"`),
   connect bằng `puppeteer-core`. Ưu tiên click-based navigation thật hơn
   `Page.navigate` khi test cache/hydration behavior.
8. Chỉ báo `sealed_pending_verifier` khi TẤT CẢ criteria pass có evidence
   (build sạch + lint sạch + UI verify nếu cần).
9. Nếu gặp bug/trap mới (giống style các trap đã có trong
   `doctrine/domains/PROJECT.md`), cân nhắc ghi thêm vào bảng Traps.
10. Ghi vào `evidence/` theo format ở `evidence/README.md`.

## Hard rules honored
`SmallestDiff` | `TestsBeforeDone` | `EvidencePerAction` | `NoSilentFailure` |
`NodeBeforeCode`

## Failure branches
| Failure | Handling |
|---|---|
| `npm run build` lỗi | `reopened_by_build`, ghi lỗi verbatim vào evidence, không tự đoán fix nếu chưa rõ root cause |
| Build lỗi flaky, không tái lập ổn định | Nghi ngờ cache trước (`rm -rf node_modules/.cache .nuxt .output`), xem trap liên quan trong `doctrine/domains/PROJECT.md` trước khi kết luận |
| Thiếu env var cần cho build/run | `blocked`, không tự bịa giá trị |

## Runtime
`/worker implementer "<task>"` hoặc lượt 1 của `/todo "<task>"`.
