# doctrine/domains/PROJECT.md ★ — ground truth của datvt243.github.io

## What is it
Portfolio & blog cá nhân của Võ Tấn Đạt (datvt243). Nuxt 3 SSR app với ISR
caching, đang chạy production thật (không phải demo). Chi tiết đầy đủ về
stack/routes/theme system nằm ở root `CLAUDE.md` — file này chỉ ghi phần
KHÔNG suy ra được từ đọc code, và không lặp lại nội dung root `CLAUDE.md`.

## Stack + shape
| Thing | Value |
|---|---|
| Language/runtime | TypeScript, Nuxt 3 / Vue 3 SSR |
| Entry point | `app.vue` (chrome) + `pages/*.vue` (thin loaders, mỗi file render đúng 1 `Theme*` component) |
| Data store | Không có DB — toàn bộ data qua external API (resume Node API, blog API, GitHub API) |
| Theme system | `themes/<name>/` swappable qua `ACTIVE_THEME` trong `nuxt.config.ts` — xem root `CLAUDE.md` mục "UI Theme" |

## Invariants (things that never happen here)
- **Không bao giờ push trực tiếp lên `main`** — luôn qua branch
  `bug/<issue_number>` hoặc `feature/<issue_number>` + pull request.
- **`feature/*` branch không bao giờ bị xoá** sau khi merge (khác `bug/*`,
  được phép xoá) — quy ước kế thừa từ workflow cũ, vẫn áp dụng.
- **Không có automated test suite** — "verified" nghĩa là `npm run build`
  sạch + `npm run lint` sạch + kiểm UI thật (xem mục Browser verification).
  Đừng bao giờ claim "tests pass".
- **`server/plugins/RenderHTML.ts`** không được set màu literal (Tailwind
  class như `bg-slate-950`) — phải dùng theme token (`bg-theme-*`), nếu
  không sẽ phá light mode một cách vô hình (đã xảy ra thật, xem Traps).

## Browser verification
Khi thay đổi có phần visual/behavior người dùng thấy được: chạy lệnh
`/browser` (`.claude/commands/browser.md` — vẫn còn, KHÔNG bị gỡ, đã quay
lại repo qua PR #66) để đảm bảo có Chrome debuggable trên port 9888, tự kiểm
tra `curl -s http://localhost:9888/json/version` trước và chỉ launch instance
mới nếu chưa chạy (không tự ý gọi `curl`/`open -na` tay khi đã có lệnh này).
Sau đó connect bằng `puppeteer-core` (`puppeteer.connect({ browserURL:
'http://localhost:9888' })` — đã là dependency sẵn có, đừng thêm tool mới).
Ưu tiên click-based navigation thật (không phải `Page.navigate` thô) khi
test cache/hydration behavior — `Page.navigate` bypass client cache và
không exercise đúng bug thật (bài học từ stale-while-revalidate fix).

## Diagram-first
Diagram (`haven/diagrams/`) là source of truth cho tiến độ — code phải khớp.

## Forbidden states
Xem `agent-hub/CLAUDE.md` — `ADHOC_WORK`, `NO_EVIDENCE`, `EDIT_UNVERIFIED`,
`CODE_IN_HAVEN`, `DIAGRAM_DRIFT`.

## Traps (append khi gặp cái mới)
| Trap | Why | What to do instead |
|---|---|---|
| Nuxt `useFetch`'s mặc định `getCachedData` không sống sót qua client-side re-navigation (chỉ đọc SSR/static payload lúc hydrate) | Mỗi lần quay lại 1 route sẽ refetch từ đầu dù đã fetch trước đó trong session | Set `key` cố định + custom `getCachedData: (key, nuxtApp) => nuxtApp.payload.data[key]` để đọc thẳng `nuxtApp.payload.data` (sống suốt SPA session) |
| Nuxt gọi `onMounted` **2 lần** cho cùng 1 navigation thật (do Suspense/transition), không phải bug do code mình viết | Dedupe kiểu "đang có fetch in-flight thì bỏ qua" không bắt được — lượt fetch đầu có thể xong trước khi `onMounted` lượt 2 chạy | Dùng 1 boolean scoped instance (`hasRevalidated`), set đồng bộ, reset về `false` mỗi lần mount mới thật |
| `@iconify-json/fe`, `@iconify-json/grommet-icons` để ở `devDependencies` làm `npm run build`'s prerender step lỗi `Cannot find module .../icons.json` | Nitro prerender chạy `.output/server` đã trim, không phải `node_modules` dev đầy đủ — icon dùng qua binding động (`:name="dynamic"`) fallback về `require()` package gốc, không có trong bundle | Icon collection packages dùng binding động phải nằm ở `dependencies`, không phải `devDependencies` |
| Thêm config `nuxt.config.ts` tưởng như không liên quan (vd `colorMode:`) có thể đổi cách Nitro tree-shake, làm hỏng import động ở chỗ khác | Nitro's dependency tracing nhạy với thay đổi config hơn trực giác | Khi build lỗi sau 1 thay đổi "không liên quan", bisect bằng `git worktree` (checkout `main` sạch, revert từng file một, rebuild) thay vì đoán |
| Build lỗi/flaky lặp lại dù đã fix đúng root cause | `node_modules/.cache`, `.nuxt`, `.output` có thể stale sau nhiều vòng dev/build liên tục trong cùng session | `rm -rf node_modules/.cache .nuxt .output` rồi rebuild trước khi kết luận "fix chưa đúng" — cache này gitignored, không tồn tại ở CI/prod sạch |
| Regex rename tag component (vd `Post` → `ThemePost`) bằng text substitution thô sẽ phá TS type import (`import type { Post }`) | Tên component và tên TS type trùng chữ | Anchor regex vào `<Tag`/`</Tag`, không thay thế chữ trần |
| Ngay sau `rm -rf node_modules/.cache .nuxt .output`, lần `npm run build` ĐẦU TIÊN có thể lỗi prerender `/contact` với `Cannot find module '@iconify-json/.../icons.json'` dù package vẫn đúng ở `dependencies` | Module warm-up: prerender chạy trước khi Nitro kịp resolve xong icon package lần đầu sau khi xoá cache — không phải regression thật | Chạy lại `npm run build` lần 2 (không sửa gì) trước khi nghi ngờ code — nếu lần 2 cũng lỗi y hệt thì mới là bug thật, cần điều tra tiếp |

## Decisions, with reasoning
> Một quyết định không ghi lý do sẽ bị một agent tương lai "làm đẹp" mất —
> what đã có trong code, chỉ why là load-bearing.

| Date | Decision | Why | Alternative rejected |
|---|---|---|---|
| 2026-08-11 | Toàn bộ page-content markup (không chỉ 8 chrome primitive) tính là "theme", chuyển hết vào `themes/portfolio-dev/` | User chọn scope rộng tường minh: "toàn bộ markup trình bày" | Chỉ tách 8 primitive chrome, giữ page-content ở `components/` gốc |
| 2026-08-11 | Theme tách `pages/` (nội dung theo route) vs `components/` (chrome dùng lại) | User muốn 2 loại phân biệt trực quan để dễ điều hướng | Giữ chung 1 thư mục `components/` cho cả 2 loại |
| 2026-08-13 | Light/Dark mode mặc định là **dark** | Khớp giao diện hiện tại, không đổi trải nghiệm cho user cũ cho tới khi họ tự bật light | Mặc định light |
| 2026-08-13 | Persistence theme mode qua `localStorage`, không phải cookie | Đơn giản hơn, chấp nhận đánh đổi | Cookie-based SSR-safe (không flash tối khi reload) — chưa làm, có thể revisit nếu bị report phiền |
| 2026-08-13 | `@iconify-json/fe`/`@iconify-json/grommet-icons` chuyển từ `devDependencies` sang `dependencies` | Fix thật cho lỗi prerender (xem Traps) | Không có — đây là fix chuẩn cho loại lỗi `@nuxt/icon` này |
| 2026-08-16 | Thay thế quy ước `agent-hub/histories/` + `.claude/commands/{start-work,finish-work,merge-work,ship}.md` bằng agent-hub doctrine/haven/evidence + implementer/verifier | User muốn kỷ luật verify độc lập chặt hơn (builder không tự báo done), evidence bắt buộc thay vì work-log tự do | Giữ nguyên hệ thống cũ song song — bị bác, chọn thay thế hoàn toàn |
| 2026-08-16 | Dracula chỉ áp cho `<ThemePanel>` (file-tree + editor), KHÔNG phải toàn site; bám theo dark/light toggle sẵn có (Dracula khi dark, 1 palette Dracula-light tự suy khi light) thay vì thêm mode/toggle thứ 3 | User xác nhận qua AskUserQuestion + làm rõ thêm ("dracula theo dark, thêm 1 theme khác theo light") — scope hẹp hơn ví dụ "thêm mode Dracula" đã ghi sẵn ở root `CLAUDE.md` | Thêm Dracula làm mode thứ 3 toàn site (cycle dark→light→dracula) — user chọn phạm vi hẹp hơn, chỉ editor |

## Legacy reference
`agent-hub/histories/2026-08-11.md` và `2026-08-13.md` — work-log narrative
chi tiết trước khi hub này tồn tại, giữ nguyên không xoá. Mọi trap/decision
durable trong đó đã được rút vào 2 bảng trên; đọc file gốc nếu cần đầy đủ
tường thuật (ví dụ: quy trình bisect bằng git worktree, cách verify qua CDP
từng bước).
