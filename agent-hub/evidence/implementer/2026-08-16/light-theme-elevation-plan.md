# 2026-08-16 — light-theme-elevation (plan)

- Worker: implementer
- Version: 0.1.0
- Node: `haven/diagrams/dev-loop.prime-mermaid.md` → `light-theme-elevation`
- Task (nguyên văn): "Light theme: đặt --theme-canvas (nền trang) thành
  trắng thuần (255 255 255), và làm cho header/footer với editor
  (ThemePanel component) có màu nền khác biệt rõ với nền trắng đó — riêng
  editor (ThemePanel) phải nổi trội/nổi bật hơn header/footer, không chỉ
  khác màu nhẹ."

## Current state (đọc code trước khi viết)
- `themes/portfolio-dev/tokens/light.css`: `--theme-canvas: 226 232 240`
  (slate-200, xám), `--theme-panel: 248 250 252` (slate-50, dùng cho
  `ThemeHeader`/`ThemeFooter` qua `bg-theme-panel`), `--theme-panel-subtle:
  241 245 249` (slate-100, dùng rộng cho hover/active state ở nhiều nơi:
  `PostCategories`, `NavItem`, `projects/Index`, `contact/Index`,
  `resumeObject/Index`).
- `themes/portfolio-dev/components/Panel.vue` (tag `<ThemePanel>`, "editor"
  shell dùng ở `resumeObject/Index.vue`, `github/Index.vue`,
  `projects/Index.vue`, `contact/Index.vue`): outer wrapper KHÔNG có bg
  riêng (trong suốt, hiện màu canvas), chỉ `aside`/`filetab` có
  `bg-theme-panel/50` và `/30` (translucent, đè lên canvas).
- `--theme-panel` bị dùng RỘNG ở nhiều component khác ngoài header/footer
  (icon bg ở `Hero.vue`, badge ở `CornerFrame.vue`, project card ở
  `projects/Index.vue`) → đổi giá trị `--theme-panel` sẽ lan ra ngoài scope
  (`SmallestDiff` risk). Quyết định: KHÔNG đổi `--theme-panel`/`-subtle`,
  chỉ thêm token mới `--theme-editor` dành riêng cho `ThemePanel`.

## Plan (smallest diff)
1. `themes/portfolio-dev/tokens/light.css`: `--theme-canvas` → `255 255
   255` (trắng thuần). Thêm `--theme-editor: 226 232 240` (tái dùng đúng
   giá trị slate-200 cũ của canvas — đã được kiểm chứng nhìn ổn trong bản
   trước — làm nền riêng, nổi bật cho editor).
2. `themes/portfolio-dev/tokens/dark.css`: thêm `--theme-editor: 2 6 23`
   (bằng đúng `--theme-canvas` dark hiện tại) để KHÔNG đổi visual dark mode
   — ngoài scope của task này (task chỉ nói "light theme").
3. `tailwind.config.js`: map `theme.editor` → `themeColor('--theme-editor')`
   theo đúng pattern các token khác.
4. `themes/portfolio-dev/components/Panel.vue`: outer wrapper thêm
   `bg-theme-editor shadow-md` để có nền riêng + nổi khối (elevation) rõ
   hơn header/footer (vốn chỉ có `bg-theme-panel`, không có shadow).

## Acceptance criteria
| # | Criterion |
|---|---|
| 1 | `.light` → `--theme-canvas` = `255 255 255` |
| 2 | `npm run build` sạch (đọc lại output) |
| 3 | `npm run lint` sạch (đọc lại output) |
| 4 | Chrome CDP, light mode: computed `background-color` của `<body>` = `rgb(255, 255, 255)` |
| 5 | Chrome CDP, light mode: computed bg của `ThemeHeader`/`ThemeFooter` ≠ trắng và ≠ bg của `ThemePanel` |
| 6 | Chrome CDP, light mode: `ThemePanel` có bg khác `ThemeHeader`/`ThemeFooter` VÀ có `box-shadow` (header/footer thì không) — chứng minh "nổi trội hơn" |

## Files
- `themes/portfolio-dev/tokens/light.css`
- `themes/portfolio-dev/tokens/dark.css`
- `tailwind.config.js`
- `themes/portfolio-dev/components/Panel.vue`

## Blocked by
Không — không cần env var mới, không đụng server API.
