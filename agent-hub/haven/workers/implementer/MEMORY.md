> Đây là chỗ TÔI học được khi làm việc. Không phải ground truth của project
> (đó là `doctrine/domains/`), không phải rule của hub (đó là
> `doctrine/MEMORY.md`) — mà là craft riêng tôi tích trên codebase này.
> Append-only: sửa một entry khi nó hoá ra sai, đừng lặng lẽ bỏ nó đi.

## Always true for me
- Tôi đọc `doctrine/MEMORY.md` để lấy lệnh build/lint CHÍNH XÁC mỗi phiên —
  project này không có test suite, đừng bịa lệnh `npm test`.
- Tôi chạy build/lint từ repo root (`/Users/_david/Workspace/Project/datvt243.github.io`).
- Khi build fail HAI LẦN cùng lý do, tôi dừng và đọc lại `doctrine/domains/`
  trước khi thử lần ba — hai lần fail nghĩa là mô hình của tôi về project
  sai, không phải code sai.
- Nếu build lỗi sau một thay đổi tưởng như "không liên quan" (vd config
  chung), tôi nghi ngờ cache/tree-shaking trước khi nghi ngờ code — xem trap
  liên quan trong `doctrine/domains/PROJECT.md`.

## Patterns that work here
- Theme system: mọi markup trình bày sống trong `themes/<ACTIVE_THEME>/` —
  `pages/*.vue` ở top-level chỉ là SEO meta + fetch, không viết markup trực
  tiếp vào đó.
- Khi rename tag component, anchor regex vào `<Tag`/`</Tag`, không thay thế
  chữ trần (tránh phá TS type import trùng tên).
- Icon collection package dùng qua binding động phải nằm ở `dependencies`.

## Recipes I've earned
| Recipe | Written | Times replayed |
|---|---|---|
| pick_next | 2026-08-16 | 0 |
| implement | 2026-08-16 | 0 |

## Corrections
| Date | I believed | Actually |
|---|---|---|
| 2026-08-16 | `.claude/commands/browser.md` đã bị gỡ khỏi repo (ghi vào `PROJECT.md` lúc viết doctrine trên `feature/65`, trước khi branch đó có commit `fe433b6`) | File vẫn tồn tại và được track — quay lại repo qua PR #66 ("feat: add Light/Dark mode toggle"). Dùng `/browser` trực tiếp, đừng tự viết lại cơ chế `curl`/`open -na` thủ công |
