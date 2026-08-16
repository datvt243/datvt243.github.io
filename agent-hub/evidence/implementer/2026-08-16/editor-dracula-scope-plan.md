# 2026-08-16 — editor-dracula-scope (plan)

- Worker: implementer
- Version: 0.1.0
- Node: `haven/diagrams/dev-loop.prime-mermaid.md` → `editor-dracula-scope`
- Task (nguyên văn, gộp 2 lượt trao đổi): "hãy làm 1 theme riêng cho
  file-tree + editor. áp dụng theo dracula theme" + xác nhận qua
  AskUserQuestion: phạm vi = chỉ file-tree + editor (không phải toàn
  site); + làm rõ thêm: "dracular sẽ theo dark theme, triển khai thêm 1
  theme khác theo light theme" — tức Dracula gắn với dark mode hiện có
  (không phải mode/toggle thứ 3), và cần 1 palette đồng bộ cho light mode,
  KHÔNG cần toggle mới — tự động bám theo toggle dark/light sẵn có.

## Current state (đọc trước khi viết)
`<ThemePanel>` (`themes/portfolio-dev/components/Panel.vue`) là root DOM
duy nhất bọc TOÀN BỘ nội dung "editor": sidebar file-tree
(`ThemeFolder`/`ThemeNavItem`/`ThemeFilterFolder`/`ThemePostCategories`),
filetab, và mọi nội dung chính (resume sections qua `ThemeCodeBlock` +
`Experiences.vue`, contact form, project cards, github repo list). Đã grep
xác nhận: MỌI usage của `ThemeFolder`/`ThemeNavItem`/`ThemeFilterFolder`/
`ThemePostCategories`/`ThemeCodeBlock` đều nằm bên trong `<ThemePanel>` —
không có usage nào ở ngoài (header/footer/Hero dùng primitive khác,
`ThemeCornerFrame` không liên quan).

Mọi component con dùng ĐÚNG token hệ thống (`bg-theme-panel`,
`text-theme-muted`, `border-theme-border`, `text-theme-code-*`, ...) — 0
màu literal còn sót sau node `light-theme-code-syntax-contrast` vừa SEALED
(ngoại lệ đã biết, ngoài scope: `text-blue-400` ở `projects/Index.vue`
dòng 62, literal có sẵn từ trước, không phải bug user báo lần này).

CSS custom property là INHERITED property chuẩn — giá trị áp dụng cho 1
phần tử được quyết định bởi rule "gần nhất" khớp CHÍNH phần tử đó (không
phải specificity văn bản), không phải bởi rule khớp tổ tiên xa hơn. Nghĩa
là: nếu đặt 1 class (`editor-scope`) lên root của `<ThemePanel>` và định
nghĩa `.dark .editor-scope { --theme-panel: X; ... }`, mọi hậu duệ dùng
`bg-theme-panel` bên trong sẽ tự động đọc giá trị X — KHÔNG cần sửa bất kỳ
component con nào (Folder/NavItem/FilterFolder/CodeBlock/PostCategories/
Experiences.vue giữ nguyên 100%).

## Plan (smallest diff, tận dụng cơ chế CSS variable inheritance)
1. File mới `themes/portfolio-dev/settings-colors-theme/editor-dracula.css`:
   - `.dark .editor-scope { ... }` — Dracula chuẩn (11 màu canonical:
     Background #282a36, Current Line #44475a, Foreground #f8f8f2,
     Comment #6272a4, Cyan #8be9fd, Green #50fa7b, Orange #ffb86c, Pink
     #ff79c6, Purple #bd93f9, Red #ff5555, Yellow #f1fa8c — theo đúng
     spec chính thức draculatheme.com), map vào toàn bộ ~25 token hiện có
     (`--theme-canvas/panel/panel-subtle/editor/border*/text*/muted/faint/
     accent*` + 10 `--theme-code-*`). Vài token trung gian (`text-soft`,
     `muted`, `code-punct`) không có màu canonical riêng → nội suy tuyến
     tính giữa Foreground và Comment (2 điểm neo canonical), không bịa hue
     mới.
   - `.light .editor-scope { ... }` — palette "Dracula-light" tự suy ra:
     đảo vai trò Background ↔ Foreground (Foreground #f8f8f2 dùng làm nền
     sáng, Background #282a36 dùng làm chữ tối — cùng 2 màu canonical,
     chỉ đổi vai trò), giữ nguyên identity từng accent hue (Pink/Cyan/
     Green/Yellow/Purple) nhưng làm đậm hơn để đủ contrast trên nền sáng
     (cùng cách đã làm ở node `light-theme-code-syntax-contrast`).
2. `themes/portfolio-dev/tokens.css`: thêm `@import
   './settings-colors-theme/editor-dracula.css';` (dòng thứ 3, sau
   dark/light).
3. `themes/portfolio-dev/components/Panel.vue`: thêm class
   `editor-scope` vào root `<div>` (chỉ 1 class, không đổi gì khác).
4. Root `CLAUDE.md` — mục "UI Theme"/"Color mode": thêm 1 đoạn ngắn ghi
   nhận cơ chế mới (scoped token override qua 1 class trên `<ThemePanel>`)
   để agent sau không phải suy luận lại từ đầu.
5. `agent-hub/doctrine/domains/PROJECT.md` — bảng Decisions: 1 dòng ghi
   quyết định + lý do (Dracula chỉ áp cho editor, không phải toàn site;
   bám theo dark/light có sẵn, không thêm toggle).

## Acceptance criteria
| # | Criterion |
|---|---|
| 1 | Header/footer/trang ngoài `<ThemePanel>` KHÔNG đổi màu ở cả 2 mode (so computed style trước/sau) |
| 2 | Dark mode: bên trong `<ThemePanel>`, nền/chữ/accent/syntax-highlight đúng 11 màu Dracula canonical (kiểm computed style qua CDP, đối chiếu hex→rgb) |
| 3 | Light mode: bên trong `<ThemePanel>`, có palette riêng (khác hẳn Dracula dark VÀ khác chrome header/footer light hiện tại), đủ contrast đọc được |
| 4 | Không cần toggle mới — chuyển dark/light bằng đúng nút hiện có, editor tự đổi theo |
| 5 | `npm run build` sạch, `npm run lint` sạch |
| 6 | Không sửa bất kỳ file component con nào (Folder/NavItem/FilterFolder/CodeBlock/PostCategories/Experiences.vue/utils/*CodeLines.ts) — chỉ 1 file CSS mới + `tokens.css` (1 dòng import) + `Panel.vue` (1 class) |

## Files
- `themes/portfolio-dev/settings-colors-theme/editor-dracula.css` (mới)
- `themes/portfolio-dev/tokens.css`
- `themes/portfolio-dev/components/Panel.vue`
- `CLAUDE.md` (root)
- `agent-hub/doctrine/domains/PROJECT.md`

## Blocked by
Không.
