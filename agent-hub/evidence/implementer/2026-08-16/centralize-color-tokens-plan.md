# 2026-08-16 — centralize-color-tokens (plan)

- Worker: implementer
- Version: 0.1.0
- Node: `haven/diagrams/dev-loop.prime-mermaid.md` → `centralize-color-tokens`
- Task (nguyên văn): "có thể tách các chỗ khai báo mã màu ra một nơi riêng,
  settings-colors-theme chẳng hạn, để user có thể tự đổi hoặc khi cung cấp
  1 ảnh mã màu thì claude có thể đổi luôn 1 cách nhanh chóng"

## Process note (honest, không giấu)
Node này được tạo SAU khi file đã `git mv` xong (chuỗi thao tác thực tế:
hỏi operator 2 câu clarifying qua AskUserQuestion trước → nhận câu trả lời
→ `git mv` → mới quay lại ghi node + plan note này). Đúng ra `NodeBeforeCode`
đòi node phải có TRƯỚC khi chạm file. Ghi rõ ở đây thay vì giả vờ thứ tự
đã đúng — không có tác động thực tế (rename không đổi giá trị, build/lint
verify vẫn chạy đầy đủ trước khi seal) nhưng là một lệch quy trình thật.

## Current state (đọc trước khi viết)
- Trước khi đổi: `themes/portfolio-dev/tokens/dark.css` +
  `themes/portfolio-dev/tokens/light.css` — 2 file RGB triplet
  (`--theme-x: R G B`), import bởi `themes/portfolio-dev/tokens.css` qua
  `@import './tokens/dark.css'` + `@import './tokens/light.css'`.
- `tailwind.config.js` đọc value qua `rgb(var(--theme-x) / <alpha-value>)`
  — BẮT BUỘC giá trị là RGB triplet cách nhau bằng space (không phải hex)
  để `<alpha-value>` hoạt động với opacity modifier Tailwind
  (`bg-theme-panel/50` dùng ở nhiều nơi: `Panel.vue`, `Header.vue`,
  `PostCategories.vue`, `NavItem.vue`...). Operator đã xác nhận qua
  AskUserQuestion: giữ RGB triplet, không đổi hex.
- Operator chọn: đổi tên thư mục `tokens/` → `settings-colors-theme/`
  (không đổi sang 1 file JSON/TS + build step mới — vượt `SmallestDiff`,
  cần thiết kế/test riêng).
- Tham chiếu tới path `tokens/dark.css`/`tokens/light.css`/`tokens/<name>.css`
  nằm ở: `themes/portfolio-dev/tokens.css` (2 dòng `@import` + 2 dòng
  comment), `nuxt.config.ts` (1 dòng comment), root `CLAUDE.md` (mục
  "Color mode (light/dark)"). File aggregator `themes/portfolio-dev/tokens.css`
  GIỮ NGUYÊN tên (không đổi) vì `nuxt.config.ts:66` reference trực tiếp
  `~/themes/${ACTIVE_THEME}/tokens.css` — đổi tên file đó sẽ chạm vào dòng
  code thật, ngoài scope operator chọn (chỉ đổi tên thư mục con).

## Plan (smallest diff)
1. `git mv themes/portfolio-dev/tokens/dark.css themes/portfolio-dev/settings-colors-theme/dark.css`
2. `git mv themes/portfolio-dev/tokens/light.css themes/portfolio-dev/settings-colors-theme/light.css`
3. `themes/portfolio-dev/tokens.css`: cập nhật 2 dòng `@import` + comment liên quan.
4. `nuxt.config.ts`: cập nhật 1 dòng comment (không đụng dòng code `css: [...]` thật, path đó vẫn trỏ `tokens.css` không đổi).
5. Root `CLAUDE.md` mục "Color mode (light/dark)": cập nhật path
   `tokens/` → `settings-colors-theme/`, thêm 1 câu ghi rõ đây là "nơi duy
   nhất cần sửa để đổi palette" + cảnh báo không đổi sang hex (trực tiếp
   trả lời ý "để user tự đổi hoặc Claude đổi nhanh khi có ảnh" — giờ có
   1 câu trong CLAUDE.md nói thẳng "đây là chỗ" thay vì phải suy luận).

## Acceptance criteria
| # | Criterion |
|---|---|
| 1 | `themes/portfolio-dev/tokens/` không còn tồn tại |
| 2 | `themes/portfolio-dev/settings-colors-theme/dark.css` + `light.css` tồn tại, nội dung y hệt bản gốc (chỉ rename, không đổi giá trị) |
| 3 | `npm run build` sạch (chứng minh `@import` resolve đúng) |
| 4 | `npm run lint` sạch |
| 5 | CSS output thật (sau build) chứa đúng giá trị `--theme-canvas`/`--theme-editor` cho cả `.dark` và `.light` — không bị mất token nào trong lúc rename |
| 6 | Không còn reference nào tới path cũ `tokens/dark.css`/`tokens/light.css`/`tokens/<name>.css` trong code/docs (trừ `agent-hub/evidence/`, `agent-hub/histories/` — lịch sử, không sửa) |

## Files
- `themes/portfolio-dev/tokens/dark.css` → `themes/portfolio-dev/settings-colors-theme/dark.css` (rename)
- `themes/portfolio-dev/tokens/light.css` → `themes/portfolio-dev/settings-colors-theme/light.css` (rename)
- `themes/portfolio-dev/tokens.css`
- `nuxt.config.ts`
- `CLAUDE.md` (root)
- `agent-hub/haven/diagrams/dev-loop.prime-mermaid.md` (node mới)

## Blocked by
Không.
