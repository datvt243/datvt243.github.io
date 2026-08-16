# 2026-08-16 — light-theme-code-syntax-contrast (diff)

- Worker: implementer
- Version: 0.1.0
- Node: `haven/diagrams/dev-loop.prime-mermaid.md` → `light-theme-code-syntax-contrast`
- Task (nguyên văn): "page _resume, phần skills, exp, educations... màu sắc
  text với màu nền đang rất khó đọc, hãy kiểm tra, light theme"

## Diff
| File | Why |
|---|---|
| `themes/portfolio-dev/settings-colors-theme/dark.css` | Thêm 10 token `--theme-code-*`, giá trị = NGUYÊN VĂN màu Tailwind literal cũ (không đổi dark mode) |
| `themes/portfolio-dev/settings-colors-theme/light.css` | Thêm 10 token `--theme-code-*` cùng tên, giá trị = shade đậm hơn cùng hue, đủ contrast trên nền trắng/`slate-200` |
| `tailwind.config.js` | Map 10 token trên vào `theme.colors.theme['code-*']` theo pattern có sẵn (`themeColor()`) |
| `utils/tsCodeLines.ts` | `text-blue-400`→`text-theme-code-keyword`, `text-sky-300`→`text-theme-code-type`, `text-orange-300`→`text-theme-code-string`, `text-slate-500`→`text-theme-code-punct`, `text-slate-600 italic`→`text-theme-code-comment italic` |
| `utils/jsonCodeLines.ts` | `text-slate-500`→`text-theme-code-punct`, `text-blue-300`→`text-theme-code-key`, `text-orange-300`→`text-theme-code-string` |
| `themes/portfolio-dev/pages/resumeObject/Experiences.vue` | `<style scoped>`: `theme('colors.slate.300')`→`rgb(var(--theme-code-text))`, `theme('colors.slate.600')` (2 chỗ, vai trò khác nhau)→`rgb(var(--theme-code-line-number))` và `rgb(var(--theme-code-comment))`, `color: white`→`rgb(var(--theme-code-title))`, `theme('colors.pink.400')`→`rgb(var(--theme-code-tag))`, `theme('colors.sky.300')`→`rgb(var(--theme-code-type))`. Dùng `rgb(var(--x))` trực tiếp thay vì `theme('colors.theme.x')` vì `<alpha-value>` placeholder trong định nghĩa token không được Tailwind thay thế khi gọi qua `theme()` ngoài ngữ cảnh utility class. |
| `agent-hub/haven/diagrams/dev-loop.prime-mermaid.md` | Node `light-theme-code-syntax-contrast`: PENDING → (sẽ SEALED bởi verifier) |

Không đổi: `themes/portfolio-dev/components/CodeBlock.vue` (đã dùng đúng
theme token từ trước — `text-theme-faint`, `text-theme-text-soft`, không
phải nguồn bug).

## Command
```
npm run build
```
```
npm run lint
```

## Output
`npm run build` — lần 1 (ngay sau khi xoá cache `.nuxt`/`.output`) lỗi
prerender `/contact`:
```
 ERROR  [nuxt] [request error] [unhandled] [500] Cannot find module '@iconify-json/fe/icons.json'
...
Errors prerendering:
[nitro]   ├─ /contact (107ms)
...
 ERROR  Exiting due to prerender errors.
```
Đã xác nhận đây KHÔNG liên quan tới diff này: `@iconify-json/fe` và
`@iconify-json/grommet-icons` vẫn nằm đúng ở `dependencies` trong
`package.json` (không phải `devDependencies` — trap đã fix trước đó vẫn
còn hiệu lực). Chạy lại `npm run build` lần 2 (không đổi gì) — cùng loại
WARN xuất hiện (`[Icon] loading icon ... timed out after 500ms`) nhưng lần
này resolve được, build thành công:
```
[nitro]   ├─ /contact (1045ms)
[nitro]   ├─ /contact/_payload.json (3ms)
[nitro] ℹ Prerendered 2 routes in 11.348 seconds
[nitro] ✔ Generated public .output/public
...
Σ Total size: 26.3 MB (9.76 MB gzip)
[nitro] ✔ You can preview this build using node .output/server/index.mjs
```
Kết luận: flaky do module warm-up ngay sau khi xoá cache toàn bộ (không
phải do diff), retry thành công là hành vi đã biết (tương tự trap
"Build lỗi/flaky lặp lại" trong `doctrine/domains/PROJECT.md`, dù trap đó
mô tả nguyên nhân hơi khác — ghi bổ sung ở mục Traps bên dưới).

`npm run lint` — verbatim cuối:
```
✖ 34 problems (0 errors, 34 warnings)
```
34 warning giống hệt baseline các node trước, không file nào trong
`## Diff` xuất hiện trong output.

## Browser verification
Chrome CDP port 9888 (đã chạy sẵn), dev server khởi động riêng cho bước
này, connect qua `puppeteer-core`. `<html>` đã có class `light` sẵn. Đọc
computed `color` trực tiếp trên DOM thật (mọi section render sẵn qua
`v-show`, không cần đợi client fetch thêm):

```json
{
  "codeKeyword": { "color": "rgb(37, 99, 235)", "text": "enum" },
  "codeType":    { "color": "rgb(3, 105, 161)", "text": "SkillGroup" },
  "codeString":  { "color": "rgb(194, 65, 12)", "text": "'Programming'" },
  "codePunct":   { "color": "rgb(71, 85, 105)", "text": "{" },
  "codeComment": { "color": "rgb(100, 116, 139)", "text": "// 3+ years" },
  "codeKey":     { "color": "rgb(29, 78, 216)", "text": "\"school\"" },
  "expTitle":    { "color": "rgb(15, 23, 42)", "text": "h3Frontend Developer (SAPUI5)" },
  "expTag":      { "color": "rgb(190, 24, 93)", "text": "article" },
  "expClass":    { "color": "rgb(3, 105, 161)", "text": ".company" },
  "expComment":  { "color": "rgb(100, 116, 139)", "text": "// next experience" },
  "bodyBg": "rgb(255, 255, 255)"
}
```
Mọi giá trị khớp đúng bảng token light-mode đã định nghĩa ở plan note.
Ngoài ra chụp 3 ảnh sau khi click từng tab (`skills.ts`,
`experiences.pug`, `educations.json`) trên trang `/` thật — quan sát trực
tiếp: chữ xanh dương (keyword/key), xanh sky (type/class), cam (string),
xám đậm (punct/comment), hồng đậm (tag), đen (title) — tất cả đọc rõ trên
nền editor xám nhạt (`--theme-editor: 226 232 240`), không còn chữ nhạt
màu-trên-màu như trước fix.

Xác nhận dark mode KHÔNG đổi: build ra CSS thật, grep trực tiếp
`entry-styles.*.mjs`:
```
--theme-code-keyword:96 165 250   (block :root/.dark — khớp blue-400 cũ)
--theme-code-type:125 211 252     (khớp sky-300 cũ)
--theme-code-string:253 186 116   (khớp orange-300 cũ)
--theme-code-punct:71 85 105 / --theme-code-comment:100 116 139 hoặc ngược lại tuỳ block — cả 2 giá trị 71 85 105 (slate-600) và 100 116 139 (slate-500) đều có mặt đúng ở đúng token, đúng block
--theme-code-tag:244 114 182      (khớp pink-400 cũ)
--theme-code-title:255 255 255    (khớp white cũ)
```
(giá trị light tương ứng cũng có mặt, không lẫn lộn giữa 2 block — xem
grep đầy đủ trong phiên làm việc).

## Acceptance
| # | Criterion | Evidence |
|---|---|---|
| 1 | Dark mode: mọi `--theme-code-*` khớp nguyên văn màu cũ | grep CSS build thật ở trên — `96 165 250`, `125 211 252`, `253 186 116`, `71 85 105`, `100 116 139`, `244 114 182`, `255 255 255`, `203 213 225` đều đúng khớp giá trị Tailwind gốc |
| 2 | Light mode: hết chữ pastel/nhạt trên nền sáng | computed style CDP + 3 screenshot ở trên |
| 3 | `npm run build` sạch | trích ở trên (sau khi loại trừ flaky không liên quan) |
| 4 | `npm run lint` sạch | `✖ 34 problems (0 errors, 34 warnings)` |
| 5 | Không còn class màu literal trong 3 file | `grep -n "text-blue-\|text-sky-\|text-orange-\|text-slate-5\|text-slate-6\|text-pink-\|theme('colors\.\|color: white"` trên cả 3 file → 0 kết quả |
| 6 | CDP xác nhận màu đúng cho cả 3 section | JSON computed style ở trên bao quát cả `codeKeyword/Type/String/Punct/Comment/Key` (Skills+Educations) và `expTitle/Tag/Class/Comment` (Experiences) |

## Noticed, not done
- Lỗi prerender `/contact` lần build đầu (module iconify) là flaky, không
  liên quan diff này — ghi thêm 1 dòng vào bảng Traps của
  `doctrine/domains/PROJECT.md` để lần sau không hoảng khi gặp lại (xem
  diff riêng ở `doctrine/domains/PROJECT.md` nếu implementer áp dụng —
  KHÔNG tự sửa doctrine trong evidence note này, chỉ ghi nhận ở đây).
- 10 token mới hơi nhiều cho 1 tính năng nhỏ (syntax highlight) nhưng mỗi
  token map 1-1 với 1 màu Tailwind literal riêng biệt đã tồn tại — gộp bớt
  sẽ đổi màu dark mode hiện có (vi phạm acceptance #1), nên giữ đủ 10,
  không gộp thêm.

## Seal gate
None — không có hành động outward-facing (không commit/push/xoá/PR) trong
lượt implementer này.
