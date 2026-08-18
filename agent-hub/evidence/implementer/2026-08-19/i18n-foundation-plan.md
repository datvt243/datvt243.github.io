# 2026-08-19 — i18n-foundation (plan)

- Worker: implementer
- Node: `haven/diagrams/dev-loop.prime-mermaid.md` → `i18n-foundation` (NEW)
- Issue: #75 (`i18n VI/EN cho toàn site`)

## Task
i18n cho toàn site — quá lớn cho 1 node duy nhất. Operator đã chốt 3 quyết
định trước khi implement (qua `AskUserQuestion`, không tự đoán vì task ban
đầu ghi rõ "cần quyết định trước khi implement"):
1. Route structure: **prefix theo locale** (không giữ URL cố định như
   color-mode).
2. Scope: **chỉ UI chrome/labels tĩnh** — nội dung động (resume/blog từ
   external API) giữ nguyên ngôn ngữ gốc, vì API không hỗ trợ đa ngôn ngữ.
3. Thư viện: **`@nuxtjs/i18n`** (module chính thức của Nuxt 3).

## Scoping this node (SmallestDiff)
Toàn bộ `themes/portfolio-dev/` có rất nhiều string tĩnh rải rác qua
~15+ file. Làm hết trong 1 node vi phạm `SmallestDiff` và khó verify đầy
đủ trong 1 lượt CDP. Theo đúng tiền lệ đã có trong diagram này
(`resume-data-models` → `resume-adapter-class`, `rss-sitemap-feed`'s
"Noticed, not done"), node này chỉ dựng **nền móng + 1 lát cắt đại diện**:
- Cài + cấu hình `@nuxtjs/i18n` với route prefix.
- Tạo message catalog `vi`/`en` đầu tiên.
- Dịch phần chrome xuất hiện trên MỌI trang: `ThemeHeader` (aria-labels:
  "Switch to light/dark mode", "Open/Close menu") + `ThemeFooter`
  ("find me in:").
- Thêm language switcher UI trong Header (cùng vị trí với nút dark/light
  toggle, theo đúng pattern đã có).
- **KHÔNG** dịch: nav tab labels trong `app.config.ts`'s `menuPrimary`
  (`_resume`, `_projects`, `_github`, `_blogs`, `_contact` — đây là
  filename-style labels theo metaphor "code editor tab", không phải prose,
  dịch chúng sẽ phá vỡ ẩn dụ thiết kế, giống như không ai dịch tên file
  thật trong 1 IDE) — xác nhận qua đọc `Header.vue`, không phải suy đoán.
- **KHÔNG** dịch nội dung riêng từng trang (resumeObject, projects, blogs
  intro text, post Detail's "Tags"/"Back to the blog", Comments.vue) —
  để lại thành node follow-up, ghi rõ trong "Noticed, not done".

## Real design decision (disclosed, not silent)
User chose "prefix theo locale (/en/..., /vi/...)" nhưng KHÔNG nói rõ mặc
định `vi` có bị prefix hay không. Chọn `strategy: 'prefix_except_default'`
(mặc định `vi` giữ nguyên `/`, chỉ `en` có prefix `/en/*`) thay vì
`strategy: 'prefix'` (cả 2 đều bị prefix, kể cả `/vi/...`), vì:
- `strategy: 'prefix'` sẽ đổi URL của MỌI trang hiện có (`/` → `/vi/`,
  `/blogs` → `/vi/blogs`...) — phá vỡ mọi link/bookmark/SEO index đang có
  trên site production thật, vi phạm "Care" lens (đây là site thật, không
  phải demo).
- `nuxt.config.ts`'s `routeRules` (ISR/prerender keyed theo path cố định:
  `/`, `/github`, `/blogs`, `/blogs/**`, `/contact`) sẽ cần nhân đôi cho
  từng locale nếu dùng `strategy: 'prefix'` — rủi ro cao hơn, phạm vi lớn
  hơn nhiều so với 1 node nền móng.
- `prefix_except_default` vẫn thoả yêu cầu "route đổi theo ngôn ngữ" của
  operator (tiếng Anh có URL riêng `/en/...`), chỉ khác ở việc `vi` (ngôn
  ngữ gốc, đang là 100% traffic hiện tại) không bị đổi URL.
Nếu operator thực sự muốn CẢ `/vi/...` bị prefix, đây là điểm cần
REOPEN/điều chỉnh — ghi rõ để verifier/operator có thể bắt được, không
giấu quyết định này.

## Acceptance criteria
1. `@nuxtjs/i18n` cài vào `dependencies`, thêm vào `modules` trong
   `nuxt.config.ts`.
2. `i18n` config: `locales: ['vi', 'en']`, `defaultLocale: 'vi'`,
   `strategy: 'prefix_except_default'`.
3. `i18n/locales/vi.json` + `i18n/locales/en.json` — ít nhất các key cho
   Header aria-labels + "Open menu"/"Close menu" + Footer "find me in:".
4. `ThemeHeader`/`ThemeFooter` dùng `$t(...)`/`useI18n()` thay vì hardcode
   string tiếng Anh.
5. Language switcher mới trong `ThemeHeader` (nút bên cạnh dark/light
   toggle), dùng `useSwitchLocalePath()`/`setLocale()`.
6. `npm run build` + `npm run lint` clean.
7. CDP: điều hướng `/` (vi mặc định) → click switcher → xác nhận URL đổi
   thành `/en` + text Header/Footer đổi ngôn ngữ + 0 console error → click
   lại quay về `/` + text về lại tiếng Việt.
8. Explicitly NOT trong scope: dịch nav tab labels, dịch nội dung riêng
   từng trang (resumeObject/projects/blogs/post/contact/github) — follow-
   up nodes riêng.

## Files
- `nuxt.config.ts`
- `i18n/locales/vi.json`, `i18n/locales/en.json` (new)
- `themes/portfolio-dev/layout/Header.vue`
- `themes/portfolio-dev/layout/Footer.vue`
- `package.json`/`package-lock.json` (new dependency)
- `agent-hub/haven/diagrams/dev-loop.prime-mermaid.md` (new node row)

## Blockers
None — `@nuxtjs/i18n` has no external service dependency, no env var
needed.
