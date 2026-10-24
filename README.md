# datvt243.github.io

Portfolio và blog cá nhân của **Võ Tấn Đạt** — trang CV, dự án, GitHub và blog song ngữ Việt/Anh, giao diện kiểu "code editor", điều hướng bằng phím tắt Vim.

Bản chạy thật: https://resume-nuxt-vert.vercel.app

## Mục lục

- [Bắt đầu nhanh](#bắt-đầu-nhanh)
- [Biến môi trường](#biến-môi-trường)
- [Các trang](#các-trang)
- [Phím tắt](#phím-tắt)
- [Công nghệ](#công-nghệ)
- [Đóng góp & quy trình git](#đóng-góp--quy-trình-git)
- [Ghi công](#ghi-công)
- [License](#license)

## Bắt đầu nhanh

```bash
npm install
cp .env.example .env   # rồi điền giá trị, xem mục bên dưới
npm run dev            # dev server
```

Các lệnh khác:

```bash
npm run build      # build SSR
npm run generate   # build static
npm run preview    # xem thử bản build
npm run lint       # eslint (npm run lint:fix để tự sửa)
```

## Biến môi trường

```env
MY_EMAIL=                    # Email dùng để lấy dữ liệu CV
NODE_API=                    # Base URL của resume API
GITHUB_TOKEN=                # GitHub token (không có thì gọi API ẩn danh)
GITHUB_USER=                 # GitHub username
PUPPETEER_EXECUTABLE_PATH=   # Đường dẫn Chrome/Chromium để xuất PDF (bắt buộc ở production)
GISCUS_CATEGORY=             # Tên category GitHub Discussions cho bình luận blog
GISCUS_CATEGORY_ID=          # Lấy từ https://giscus.app
GISCUS_REPO_ID=              # Lấy từ https://giscus.app
DEPLOY_HOOK_URL=             # Tuỳ chọn: /release gọi URL này sau khi tag main
SITE_URL=                    # Tuỳ chọn: domain chuẩn cho sitemap/rss/hreflang (mặc định https://resume-nuxt-vert.vercel.app)
```

`GISCUS_*` là tuỳ chọn — chưa điền thì khung bình luận hiện thông báo "chưa cấu hình" thay vì bị lỗi.

Dữ liệu lấy từ 3 API ngoài: resume API (`${NODE_API}/api/me/${MY_EMAIL}`), blog API (`https://blog-api-nodejs-express.onrender.com/api/v1/`) và GitHub API.

## Các trang

| Route | Nội dung |
|---|---|
| `/` | CV |
| `/projects` | Dự án, lọc theo công nghệ |
| `/github` | Hồ sơ & repo GitHub |
| `/contact` | Thông tin liên hệ |
| `/blogs` | Danh sách bài viết, lọc theo category |
| `/blogs/[id]` | Chi tiết bài viết, bình luận qua Giscus |
| `/rss.xml` | RSS 2.0 — 20 bài mới nhất |
| `/sitemap.xml` | Sitemap các trang tĩnh + từng bài viết |

Song ngữ qua `@nuxtjs/i18n`: tiếng Việt là mặc định, URL không có tiền tố (`/blogs`); tiếng Anh nằm dưới `/en/*` (`/en/blogs`).

## Phím tắt

Nhấn `?` (hoặc nút `?` trên header) để xem toàn bộ phím tắt của trang hiện tại.

| Phím | Tác dụng |
|---|---|
| `gr` `gp` `gh` `gb` `gc` | Sang Resume / Projects / GitHub / Blogs / Contact |
| `j` / `k` | Cuộn xuống / lên |
| `gg` / `G` | Lên đầu / xuống cuối trang |
| `c` / `d` | Trang CV: liên hệ / tải CV |
| `1`–`5` | Trang CV: đổi tab thông tin cá nhân |
| `/` / `Esc` | Trang GitHub: vào / thoát ô tìm repo |
| `?` | Bật/tắt bảng phím tắt |

Phím tắt tạm tắt khi đang gõ trong ô nhập. Nếu extension như Vimium chiếm phím, nhấn `i` để chuyển phím cho trang, hoặc loại trừ trang này trong cài đặt extension.

## Công nghệ

Nuxt 3 (SSR + ISR) · Vue 3 + TypeScript · TailwindCSS v3 + @nuxt/ui · Pinia · puppeteer-core (xuất PDF) · @nuxtjs/i18n

## Đóng góp & quy trình git

- `main` và `staging` đều được GitHub bảo vệ: không push thẳng, bắt buộc qua PR.
- Tạo branch `bug/<số-issue>` hoặc `feature/<số-issue>` từ `staging`, mở PR vào `staging`.
- `main` là production, chỉ nhận code từ `staging` qua `/release` (merge commit, tag `vX.Y.Z`, chạy build + lint trước).
- Thay đổi code đi qua quy trình agent-hub (implementer → verifier độc lập → ship) — xem [`agent-hub/README.md`](agent-hub/README.md) và [`CLAUDE.md`](CLAUDE.md).
- Báo lỗi / đề xuất: [GitHub Issues](https://github.com/datvt243/datvt243.github.io/issues).

## Ghi công

Giao diện "code editor" (tab bar, file tree, status bar) lấy cảm hứng từ [developer-portfolio-v2](https://github.com/alexdeploy/developer-portfolio-v2) — thiết kế bởi [@darelova](https://www.behance.net/darelova), phát triển bởi [@alexdeploy](https://github.com/alexdeploy). Dự án này tự viết lại toàn bộ trên lớp dữ liệu/API riêng, không sao chép code từ repo gốc.

## License

Chưa chọn license — mọi quyền thuộc tác giả.
