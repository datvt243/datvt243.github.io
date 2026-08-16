# 2026-08-16 — light-theme-elevation (diff)

- Worker: implementer
- Version: 0.1.0
- Node: `haven/diagrams/dev-loop.prime-mermaid.md` → `light-theme-elevation`
- Task (nguyên văn): "Light theme: đặt --theme-canvas (nền trang) thành
  trắng thuần (255 255 255), và làm cho header/footer với editor
  (ThemePanel component) có màu nền khác biệt rõ với nền trắng đó — riêng
  editor (ThemePanel) phải nổi trội/nổi bật hơn header/footer, không chỉ
  khác màu nhẹ."

## Diff
| File | Why |
|---|---|
| `themes/portfolio-dev/tokens/light.css` | `--theme-canvas` → trắng thuần `255 255 255`. Thêm token mới `--theme-editor: 226 232 240` (tái dùng đúng giá trị slate-200 cũ của canvas) thay vì đổi `--theme-panel` — `--theme-panel` bị dùng rộng ở nhiều nơi ngoài header/footer (icon bg, badge, project card...), đổi nó sẽ vượt scope task |
| `themes/portfolio-dev/tokens/dark.css` | Thêm `--theme-editor: 2 6 23` = đúng giá trị `--theme-canvas` dark hiện tại, để KHÔNG đổi visual dark mode (task chỉ nói light theme) |
| `tailwind.config.js` | Map `theme.editor` → `themeColor('--theme-editor')`, theo đúng pattern các token khác (`canvas`, `panel`, `panel-subtle`) |
| `themes/portfolio-dev/components/Panel.vue` | Outer wrapper (`<ThemePanel>`, editor shell) thêm class `bg-theme-editor shadow-md` — nền riêng + shadow để nổi khối rõ hơn `ThemeHeader`/`ThemeFooter` (vốn chỉ `bg-theme-panel`, không shadow) |
| `agent-hub/haven/diagrams/dev-loop.prime-mermaid.md` | Tạo node đầu tiên `light-theme-elevation` (PM status trước đó trống — `pick_next` failure branch: không có node PENDING nào tồn tại) |

## Command
```
npm run build
```
```
npm run lint
```

## Output
`npm run build` — verbatim tail (không lỗi, kết thúc bằng):
```
Σ Total size: 27.4 MB (10 MB gzip)
[nitro] ✔ You can preview this build using node .output/server/index.mjs
```

`npm run lint` — verbatim cuối:
```
✖ 34 problems (0 errors, 34 warnings)
```
34 warning này pre-existing, không thuộc 5 file bị đổi ở trên (đã kiểm —
không file nào trong `## Diff` xuất hiện trong danh sách warning).

## Browser verification
Chrome CDP port 9888 (đã chạy sẵn, không launch instance mới), connect qua
`puppeteer-core`, navigate `http://localhost:3000/` (dev server tự khởi
động cho việc kiểm tra này). `<html>` đã có class `light` sẵn khi load —
không cần bấm toggle. Đọc computed style qua `page.evaluate`:

```json
{
  "body":   { "bg": "rgb(255, 255, 255)", "shadow": "none",
              "border": "rgb(229, 231, 235)" },
  "header": { "bg": "rgb(248, 250, 252)", "shadow": "none",
              "border": "rgb(226, 232, 240)" },
  "footer": { "bg": "rgb(248, 250, 252)", "shadow": "none",
              "border": "rgb(234, 88, 12)" },
  "panel":  { "bg": "rgb(226, 232, 240)",
              "shadow": "rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.1) 0px 2px 4px -2px",
              "border": "rgb(226, 232, 240)" }
}
```
Screenshot chụp cùng lúc (trang chủ, viewport mặc định) lưu tại phiên làm
việc (không commit vào repo — không phải asset cần giữ lâu dài); mô tả:
thanh header nền trắng-xám nhạt phẳng, không shadow; khối "editor"
(sidebar file-tree "PERSONAL-INFO" + nội dung) nền xám rõ (`rgb(226, 232,
240)`) với drop-shadow mềm, nổi khối rõ trên nền trắng của trang.

## Acceptance
| # | Criterion | Evidence |
|---|---|---|
| 1 | `.light` → `--theme-canvas` = `255 255 255` | `themes/portfolio-dev/tokens/light.css` diff; xác nhận runtime: `body.bg = "rgb(255, 255, 255)"` ở trên |
| 2 | `npm run build` sạch | `[nitro] ✔ You can preview this build using node .output/server/index.mjs`, không có dòng lỗi trong output đầy đủ |
| 3 | `npm run lint` sạch | `✖ 34 problems (0 errors, 34 warnings)` — 0 errors |
| 4 | Computed bg `<body>` = `rgb(255, 255, 255)` | trích ở trên |
| 5 | bg header/footer ≠ trắng và ≠ bg panel | header/footer = `rgb(248, 250, 252)`; panel = `rgb(226, 232, 240)`; canvas = `rgb(255, 255, 255)` — cả 3 giá trị khác nhau |
| 6 | Panel có bg khác header/footer VÀ có box-shadow (header/footer thì không) | panel `shadow` có giá trị thật (`0px 4px 6px -1px rgba(0,0,0,0.1)...`); header/footer `shadow: "none"` |

## Noticed, not done
- `--theme-panel` (`248 250 252`, slate-50) chỉ khác `--theme-canvas`
  (`255 255 255`) một khoảng RGB nhỏ (~7 đơn vị) — về mặt số liệu là "khác
  màu" thật, nhìn trên ảnh chụp thấy có viền `border-b`/`border-t-2
  border-theme-accent` (cam) làm rõ ranh giới, nhưng nếu operator thấy vẫn
  chưa đủ rõ so với kỳ vọng, có thể cân nhắc bump `--theme-panel` lên
  `241 245 249` (slate-100) ở một task/node riêng — KHÔNG tự làm ở đây vì
  `--theme-panel` dùng rộng ngoài header/footer (xem bảng Diff), đổi nó
  vượt `SmallestDiff` cho task này.
- Dev server (`npm run dev`) đã được khởi động riêng cho bước kiểm tra
  này, đang chạy nền (log: process ngoài phiên implementer) — không phải
  hành động outward-facing, không cần seal gate, nhưng operator có thể
  muốn dừng nó sau khi xem xong.

## Seal gate
None — không có hành động outward-facing (không commit/push/xoá file/mở
PR) trong lượt implementer này.
