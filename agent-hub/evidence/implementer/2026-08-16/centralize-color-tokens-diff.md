# 2026-08-16 — centralize-color-tokens (diff)

- Worker: implementer
- Version: 0.1.0
- Node: `haven/diagrams/dev-loop.prime-mermaid.md` → `centralize-color-tokens`
- Task (nguyên văn): "có thể tách các chỗ khai báo mã màu ra một nơi riêng,
  settings-colors-theme chẳng hạn, để user có thể tự đổi hoặc khi cung cấp
  1 ảnh mã màu thì claude có thể đổi luôn 1 cách nhanh chóng"

## Diff
| File | Why |
|---|---|
| `themes/portfolio-dev/tokens/dark.css` → `themes/portfolio-dev/settings-colors-theme/dark.css` (git mv) | Rename theo lựa chọn operator, KHÔNG đổi nội dung |
| `themes/portfolio-dev/tokens/light.css` → `themes/portfolio-dev/settings-colors-theme/light.css` (git mv) | Rename theo lựa chọn operator, KHÔNG đổi nội dung |
| `themes/portfolio-dev/tokens.css` | Cập nhật 2 dòng `@import` (`./tokens/dark.css` → `./settings-colors-theme/dark.css`, tương tự light) + 2 chỗ comment nhắc path cũ |
| `nuxt.config.ts` | 1 dòng comment (không đụng dòng `css: [...]` thật — path đó vẫn trỏ `~/themes/${ACTIVE_THEME}/tokens.css`, tên file aggregator không đổi) |
| `CLAUDE.md` (root) | Mục "Color mode (light/dark)": path `tokens/` → `settings-colors-theme/`, thêm câu nói rõ đây là "nơi duy nhất cần sửa để đổi palette" + cảnh báo RGB triplet là bắt buộc (không đổi hex) vì `<alpha-value>` opacity modifier trong `tailwind.config.js` |
| `agent-hub/haven/diagrams/dev-loop.prime-mermaid.md` | Node mới `centralize-color-tokens` (xem process note trong plan note — node được ghi sau khi đã `git mv`, không đúng thứ tự `NodeBeforeCode` lý tưởng, ghi rõ không giấu) |

Không đổi: `themes/portfolio-dev/tokens.css` (tên file, chỉ sửa nội dung),
`tailwind.config.js` (không cần đổi — vẫn đọc CSS var qua `themeColor()`,
không quan tâm var định nghĩa ở file nào), giá trị bất kỳ token màu nào
(giữ nguyên RGB triplet, theo lựa chọn operator).

## Command
```
npm run build
```
```
npm run lint
```

## Output
`npm run build` — lần chạy đầu tiên lỗi:
```
 ERROR  ENOTEMPTY: directory not empty, rmdir '/Users/_david/Workspace/Project/datvt243.github.io/.nuxt/types'
```
Đây là trap đã biết trong `doctrine/domains/PROJECT.md` (cache `.nuxt`
stale sau nhiều vòng dev/build liên tục trong cùng phiên — phiên này đã
`npm run dev` trước đó cho task `light-theme-elevation`). Xử lý theo đúng
trap: `rm -rf node_modules/.cache .nuxt .output` rồi build lại.

`npm run build` (sau khi xoá cache) — verbatim cuối:
```
Σ Total size: 26.3 MB (9.76 MB gzip)
[nitro] ✔ You can preview this build using node .output/server/index.mjs
```
Không có dòng lỗi nào trong output đầy đủ.

`npm run lint` — verbatim cuối:
```
✖ 34 problems (0 errors, 34 warnings)
```
34 warning giống hệt số lượng ở lần lint trước (node `light-theme-elevation`)
— cùng danh sách file, không file nào trong `## Diff` ở trên xuất hiện
trong output warning. 0 errors.

## Browser verification
N/A — không đổi visual/behavior. Đây là rename thuần path + cập nhật
`@import`/comment/docs, không đổi bất kỳ giá trị màu hay markup nào. Thay
vào đó verify bằng cách đọc trực tiếp CSS đã build (bằng chứng mạnh hơn
"trông ổn" trên UI vì đây đúng là thứ compile ra):

```
$ grep -o -- "--theme-canvas:[^;]*;[a-zA-Z0-9.:;#, -]\{0,120\}" .output/server/chunks/build/entry-styles.CsAT9TMw.mjs
--theme-canvas:2 6 23;--theme-panel:15 23 42;--theme-editor:2 6 23;--theme-panel-subtle:30 41 59;--theme-border:30 41 59;--theme-border-subtle
--theme-canvas:255 255 255;--theme-panel:248 250 252;--theme-panel-subtle:241 245 249;--theme-editor:226 232 240;--theme-border:226 232 240;--theme
```
Cả 2 block (`.dark`/`:root` và `.light`) đều có mặt với đúng giá trị đã
seal ở node `light-theme-elevation` — chứng minh chuỗi `@import` sau khi
rename vẫn resolve đúng, không mất token nào.

```
$ git diff HEAD -- themes/portfolio-dev/settings-colors-theme/dark.css themes/portfolio-dev/settings-colors-theme/light.css
```
(trích ở diff note đầy đủ, không lặp lại ở đây) — nội dung 2 file y hệt
bản trước khi rename (chỉ đổi đường dẫn), không có edit nào lẫn vào lúc
`git mv`.

## Acceptance
| # | Criterion | Evidence |
|---|---|---|
| 1 | `themes/portfolio-dev/tokens/` không còn tồn tại | `rmdir themes/portfolio-dev/tokens` chạy thành công (thư mục rỗng sau `git mv` 2 file) |
| 2 | File mới tồn tại, nội dung y hệt bản gốc | `git status --short` báo `RM themes/portfolio-dev/tokens/dark.css -> themes/portfolio-dev/settings-colors-theme/dark.css` (và tương tự light.css) — `RM` = rename detected bởi git, không phải delete+add nội dung khác |
| 3 | `npm run build` sạch | `[nitro] ✔ You can preview this build using node .output/server/index.mjs`, 0 dòng lỗi (sau khi xử lý cache trap) |
| 4 | `npm run lint` sạch | `✖ 34 problems (0 errors, 34 warnings)` |
| 5 | CSS output chứa đúng token cho cả 2 mode | trích `entry-styles.CsAT9TMw.mjs` ở trên — cả `.dark`/`:root` và `.light` block đều đủ token |
| 6 | Không còn reference path cũ trong code/docs | `grep -rn "tokens/dark\|tokens/light\|tokens/<name>\|themes/<name>/tokens/\|'./tokens/"` (loại trừ `agent-hub/evidence/`, `agent-hub/histories/`) → 0 kết quả |

## Noticed, not done
- Thứ tự thao tác thực tế lệch `NodeBeforeCode` (xem process note trong
  plan note cùng ngày) — node được tạo sau khi đã `git mv`. Không sửa lại
  lịch sử, chỉ ghi rõ để verifier/operator biết.
- `themes/portfolio-dev/tokens.css` (file aggregator gốc) vẫn giữ tên
  `tokens.css`, không đổi thành `settings-colors-theme.css` hay tương tự —
  operator chỉ chọn đổi tên thư mục con chứa 2 file mode, không yêu cầu
  đổi file gốc, và đổi tên file đó sẽ chạm dòng code thật ở
  `nuxt.config.ts:66` (`css: [`~/themes/${ACTIVE_THEME}/tokens.css`, ...]`)
  — vượt phạm vi operator đã chọn.
- Task gốc còn nhắc tới việc "khi cung cấp 1 ảnh mã màu thì Claude có thể
  đổi luôn nhanh chóng" — phần này KHÔNG cần thêm tooling gì (không có
  image-color-extraction script nào được viết), chỉ cần 2 file
  `settings-colors-theme/{dark,light}.css` đã đủ gọn (mỗi token 1 dòng, có
  comment tên màu Tailwind) để một agent tương lai tự đọc ảnh rồi sửa số
  tay — không phải một criterion có thể "build/lint sạch" để verify, chỉ
  là hệ quả tự nhiên của việc gom file.

## Seal gate
None — không có hành động outward-facing (không commit/push/xoá/mở PR)
trong lượt implementer này. Các file bị xoá (`themes/portfolio-dev/tokens/*`)
chỉ là do `git mv` trong working tree, chưa commit.
