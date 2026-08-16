# 2026-08-16 — light-theme-code-syntax-contrast (plan)

- Worker: implementer
- Version: 0.1.0
- Node: `haven/diagrams/dev-loop.prime-mermaid.md` → `light-theme-code-syntax-contrast`
- Task (nguyên văn): "page _resume, phần skills, exp, educations... màu sắc
  text với màu nền đang rất khó đọc, hãy kiểm tra, light theme"

## Root cause (đọc trước khi viết)
`ThemeResumeObjectSkills`/`Educations` render qua `<ThemeCodeBlock>` (đã
dùng theme token đúng: `text-theme-faint`, `text-theme-text-soft`), nhưng
nội dung HTML bên trong (`v-html`) do 2 hàm build sẵn tạo ra, và cả 2 đều
literal Tailwind color — KHÔNG qua theme token:
- `utils/tsCodeLines.ts` (dùng bởi `Skills.vue`): `text-blue-400` (keyword),
  `text-sky-300` (type), `text-orange-300` (string), `text-slate-500`
  (punct), `text-slate-600 italic` (comment).
- `utils/jsonCodeLines.ts` (dùng bởi `Educations.vue`): `text-slate-500`
  (punct), `text-blue-300` (key), `text-orange-300` (value).
- `themes/portfolio-dev/pages/resumeObject/Experiences.vue` — `<style
  scoped lang="scss">`: `.code-line { color: theme('colors.slate.300') }`
  (text nền), `.code-line::before { color: theme('colors.slate.600') }`
  (số dòng — component TỰ vẽ line-number riêng, không dùng chung
  `ThemeCodeBlock`), `.title { color: white }` (tiêu đề job), `.comment {
  color: theme('colors.slate.600') }`, `:deep(.tag-name) { color:
  theme('colors.pink.400') }`, `:deep(.class-name) { color:
  theme('colors.sky.300') }`.

Đã build thử + grep CSS ra thật: các class này CÓ được Tailwind generate
(không bị purge dù `utils/` không nằm trong `content` glob của
`tailwind.config.js` — module `@nuxtjs/tailwindcss` tự thêm default content
paths rộng hơn). Xác nhận: `.text-blue-300{color:rgb(147 197 253/...)}`,
`.text-orange-300{color:rgb(253 186 116/...)}` có mặt trong CSS build thật.

Đây đúng loại bug đã ghi trong `doctrine/domains/PROJECT.md` Invariants:
màu literal thay vì theme token phá light mode một cách vô hình — chỉ khác
lần này không phải `RenderHTML.ts` (đã fix trước) mà là 3 file khác chưa
từng được migrate khi light mode ra đời.

Tất cả các màu literal trên đều là shade "300"/"400" (pastel, sáng) —
thiết kế cho chữ trên nền tối. Trên light theme (canvas trắng, editor
`slate-200`), các màu này có contrast rất thấp → đúng như user báo "rất
khó đọc".

## Plan (smallest diff, correctness-driven)
Thêm 10 token màu syntax-highlight mới vào
`themes/portfolio-dev/settings-colors-theme/{dark,light}.css` — dark giữ
NGUYÊN VĂN giá trị Tailwind literal hiện có (không đổi 1 pixel nào ở dark
mode), light chọn shade đậm hơn cùng hue để đủ contrast trên nền
trắng/`slate-200`:

| Token | Vai trò | Dark (giữ nguyên) | Light (mới) |
|---|---|---|---|
| `--theme-code-text` | body text mặc định trong `Experiences.vue` | `203 213 225` (slate-300) | `51 65 85` (slate-700) |
| `--theme-code-line-number` | số dòng tự vẽ trong `Experiences.vue` | `71 85 105` (slate-600) | `100 116 139` (slate-500) |
| `--theme-code-keyword` | TS keyword (`enum`/`const`) | `96 165 250` (blue-400) | `37 99 235` (blue-600) |
| `--theme-code-key` | JSON object key | `147 197 253` (blue-300) | `29 78 216` (blue-700) |
| `--theme-code-type` | TS type name + Experiences `.class-name` (cùng giá trị gốc sky-300) | `125 211 252` (sky-300) | `3 105 161` (sky-700) |
| `--theme-code-string` | TS string + JSON value (cùng giá trị gốc orange-300) | `253 186 116` (orange-300) | `194 65 12` (orange-700) |
| `--theme-code-punct` | dấu câu (`{`, `,`, `:`...) | `100 116 139` (slate-500) | `71 85 105` (slate-600) |
| `--theme-code-comment` | comment `// N+ years` + Experiences `.comment` | `71 85 105` (slate-600) | `100 116 139` (slate-500) — vẫn nhạt hơn punct, giữ đúng quan hệ "comment mờ hơn" |
| `--theme-code-tag` | Experiences `.tag-name` (pug `<tag>`) | `244 114 182` (pink-400) | `190 24 93` (pink-700) |
| `--theme-code-title` | Experiences job title (`h3`) | `255 255 255` (white) | `15 23 42` (slate-900, = `--theme-text` light) |

Map vào `tailwind.config.js` (`theme.colors.theme['code-text']`, ...) theo
đúng pattern các token khác (`themeColor('--theme-code-text')`) → sinh ra
class `text-theme-code-text`, v.v.

Sửa 3 file dùng màu literal:
1. `utils/tsCodeLines.ts`: `text-blue-400`→`text-theme-code-keyword`,
   `text-sky-300`→`text-theme-code-type`, `text-orange-300`→
   `text-theme-code-string`, `text-slate-500`→`text-theme-code-punct`,
   `text-slate-600 italic`→`text-theme-code-comment italic`.
2. `utils/jsonCodeLines.ts`: `text-slate-500`→`text-theme-code-punct`,
   `text-blue-300`→`text-theme-code-key`, `text-orange-300`→
   `text-theme-code-string`.
3. `themes/portfolio-dev/pages/resumeObject/Experiences.vue`: thay
   `theme('colors.X')`/`color: white` bằng `rgb(var(--theme-code-x))` trực
   tiếp trong `<style scoped lang="scss">` (KHÔNG dùng `theme('colors.theme.x')`
   — hàm `theme()` không thay thế `<alpha-value>` placeholder khi gọi
   ngoài ngữ cảnh utility class, sẽ ra CSS hỏng; `rgb(var(--x))` đọc thẳng
   custom property, an toàn và đúng với cách các token này vốn được định
   nghĩa).

## Acceptance criteria
| # | Criterion |
|---|---|
| 1 | Dark mode: mọi giá trị `--theme-code-*` trong `dark.css` khớp NGUYÊN VĂN màu Tailwind literal cũ (không đổi pixel nào) |
| 2 | Light mode: `Skills`/`Educations`/`Experiences` không còn text màu pastel/nhạt (shade 300/400) trên nền sáng — verify bằng computed style qua CDP |
| 3 | `npm run build` sạch |
| 4 | `npm run lint` sạch |
| 5 | Không còn class Tailwind color literal (`text-blue-*`, `text-sky-*`, `text-orange-*`, `text-slate-500`, `text-slate-600`, `text-pink-*`) hay `theme('colors.<literal>')`/`color: white` trong 3 file bị sửa |
| 6 | Chrome CDP: chụp/đọc computed style thật của `/` (trang resume) ở light mode cho cả 3 section (Skills/Experiences/Educations), xác nhận màu đã đổi khớp bảng token trên |

## Files
- `themes/portfolio-dev/settings-colors-theme/dark.css`
- `themes/portfolio-dev/settings-colors-theme/light.css`
- `tailwind.config.js`
- `utils/tsCodeLines.ts`
- `utils/jsonCodeLines.ts`
- `themes/portfolio-dev/pages/resumeObject/Experiences.vue`

## Blocked by
Không.
