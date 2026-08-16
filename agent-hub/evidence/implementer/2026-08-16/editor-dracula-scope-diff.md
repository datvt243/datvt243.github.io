# 2026-08-16 — editor-dracula-scope (diff)

- Worker: implementer
- Version: 0.1.0
- Node: `haven/diagrams/dev-loop.prime-mermaid.md` → `editor-dracula-scope`
- Task: xem plan note cùng ngày cho nguyên văn đầy đủ (2 lượt trao đổi +
  AskUserQuestion xác nhận phạm vi + làm rõ activation).

## Diff
| File | Why |
|---|---|
| `themes/portfolio-dev/settings-colors-theme/editor-dracula.css` (mới) | 2 block `.dark .editor-scope` / `.light .editor-scope`, mỗi block override toàn bộ 25 token (`--theme-canvas/panel/panel-subtle/editor/border*/text*/muted/faint/accent*` + 10 `--theme-code-*`) — dark = 11 màu Dracula canonical + nội suy cho vai trò không có màu riêng; light = palette suy ra (đảo Foreground↔Background, đậm hoá từng accent hue) |
| `themes/portfolio-dev/tokens.css` | Thêm `@import './settings-colors-theme/editor-dracula.css'` (dòng thứ 3) + comment giải thích đây là scoped override, không phải mode thứ 3 |
| `themes/portfolio-dev/components/Panel.vue` | Thêm class `editor-scope` vào root `<div>` — đây là NƠI DUY NHẤT bọc mọi nội dung editor (đã audit: mọi usage của `ThemeFolder`/`ThemeNavItem`/`ThemeFilterFolder`/`ThemePostCategories`/`ThemeCodeBlock` đều nằm trong `<ThemePanel>`) |
| `CLAUDE.md` (root) | Thêm đoạn giải thích cơ chế scoped-override (class + CSS var inheritance) trong mục "Color mode" |
| `agent-hub/doctrine/domains/PROJECT.md` | Thêm 1 dòng Decision: Dracula chỉ áp cho editor, bám dark/light có sẵn, không thêm mode/toggle thứ 3 |

KHÔNG sửa: `Folder.vue`, `NavItem.vue`, `FilterFolder.vue`, `CodeBlock.vue`,
`PostCategories.vue`, `Experiences.vue`, `utils/tsCodeLines.ts`,
`utils/jsonCodeLines.ts` — đúng dự kiến trong plan note (cơ chế CSS
variable inheritance cho phép 0 thay đổi ở các file này).

## Command
```
npm run build
```
```
npm run lint
```

## Output
`npm run build` — lần 1 lỗi (KHÔNG liên quan diff): `RollupError:
.nuxt/dist/server/client.manifest.mjs (1:148): A numeric separator is only
allowed between two digits` — artifact `.nuxt` bị hỏng/lẫn giữa 2 lần build
liên tiếp trong cùng phiên (không phải lỗi cú pháp thật trong code, file
đó không do tôi viết). Xử lý theo trap đã biết:
`rm -rf node_modules/.cache .nuxt .output` rồi build lại — sạch hoàn toàn:
```
Σ Total size: 26.4 MB (9.76 MB gzip)
[nitro] ✔ You can preview this build using node .output/server/index.mjs
```

`npm run lint` — verbatim cuối:
```
✖ 34 problems (0 errors, 34 warnings)
```
Khớp baseline mọi node trước, không file nào trong `## Diff` xuất hiện.

## Browser verification
Chrome CDP port 9888 (đã chạy sẵn), dev server khởi động riêng cho bước
này (`nohup npm run dev` — lần đầu bị kill do timeout của lệnh polling,
khởi động lại thành công lần 2). Connect qua `puppeteer-core`, đọc computed
style thật ở CẢ 2 mode (bằng cách bấm nút toggle thật trên UI, không set
`localStorage` tay):

**Dark mode** (`<html class="dark">`):
```json
{
  "bodyBg": "rgb(2, 6, 23)",          // slate-950 — trang KHÔNG đổi
  "headerBg": "rgb(15, 23, 42)",      // slate-900 — header KHÔNG đổi
  "editorBg": "rgb(40, 42, 54)",      // #282a36 Dracula Background — ĐÚNG
  "codeKeyword": "rgb(255, 121, 198)", // #ff79c6 Pink — ĐÚNG
  "codeType": "rgb(139, 233, 253)",    // #8be9fd Cyan — ĐÚNG
  "codeString": "rgb(241, 250, 140)",  // #f1fa8c Yellow — ĐÚNG
  "codeKey": "rgb(80, 250, 123)",      // #50fa7b Green — ĐÚNG
  "codeComment": "rgb(98, 114, 164)"   // #6272a4 Comment — ĐÚNG
}
```
**Light mode** (`<html class="light">`, bấm toggle thật):
```json
{
  "bodyBg": "rgb(255, 255, 255)",     // trang KHÔNG đổi
  "headerBg": "rgb(248, 250, 252)",   // slate-50 — header KHÔNG đổi
  "editorBg": "rgb(248, 248, 242)",   // #f8f8f2 — Dracula Foreground tái dùng làm nền sáng
  "codeKeyword": "rgb(219, 42, 142)", // Pink đậm hoá
  "codeType": "rgb(8, 145, 178)",     // Cyan đậm hoá
  "codeString": "rgb(122, 110, 20)",  // Yellow → olive đậm hoá
  "codeKey": "rgb(13, 138, 54)",      // Green đậm hoá
  "codePunct": "rgb(69, 78, 109)",
  "codeComment": "rgb(98, 114, 164)"  // Comment — giống hệt dark (dùng được cả 2 nền)
}
```
Mọi giá trị khớp CHÍNH XÁC bảng token đã định nghĩa trong file CSS mới.
`bodyBg`/`headerBg` GIỮ NGUYÊN giữa 2 lần đo trước/sau khi thêm
`editor-scope` — xác nhận scope KHÔNG rò rỉ ra ngoài `<ThemePanel>`.

3 screenshot chụp thật (`skills.ts` dark, `experiences.pug` light,
`skills.ts` light) — quan sát trực tiếp: dark mode editor có nền tím-đen
Dracula rõ rệt khác hẳn header xanh-đen thường của site; light mode editor
nền trắng-ngà ấm, chữ syntax màu đậm dễ đọc, header vẫn xám nhạt bình
thường không đổi.

## Acceptance
| # | Criterion | Evidence |
|---|---|---|
| 1 | Header/footer/trang ngoài không đổi | `bodyBg`/`headerBg` giống hệt giá trị gốc (slate-950/900 dark, white/slate-50 light) ở cả 2 lần đo |
| 2 | Dark mode = Dracula canonical | 5 giá trị hex Dracula chính thức khớp verbatim qua CDP |
| 3 | Light mode = palette riêng, đủ contrast | Giá trị đậm hoá khớp file CSS, khác hẳn cả Dracula dark VÀ chrome light hiện tại (`248 250 252` slate-50) |
| 4 | Không cần toggle mới | Dùng đúng nút toggle có sẵn trên header (bấm qua CDP), không thêm UI |
| 5 | Build/lint sạch | Trích ở trên |
| 6 | Không sửa component con | `git status --short` xác nhận chỉ 5 file trong `## Diff` bị đổi + 1 file mới, không có Folder/NavItem/FilterFolder/CodeBlock/PostCategories/utils/*CodeLines.ts |

## Noticed, not done
- `projects/Index.vue` dòng 62 có `text-blue-400` literal (đã có từ
  trước, không phải bug node này) — nằm TRONG editor scope nên ở dark
  mode nó vẫn là Tailwind blue-400 chuẩn thay vì Dracula Cyan/Purple. User
  không báo lỗi này, không tự sửa — nếu muốn "toàn bộ editor chuẩn
  Dracula 100%" thì đây là 1 task riêng.
- `UBadge` (Nuxt UI component, dùng trong `projects/Index.vue` cho tech
  tag) dùng theming riêng của `@nuxt/ui` (`app.config.ts`), không đi qua
  `--theme-*` — không tự động ăn Dracula. Ngoài scope (đổi sẽ đụng
  `app.config.ts`/Nuxt UI config, không phải theme token).

## Seal gate
None — không có hành động outward-facing trong lượt implementer này.
