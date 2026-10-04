# Comment cleanup report — issue #210

Generated from `comment-cleanup-standardize-ledger.json` (one entry per change; line numbers are pre-change).

## Totals

| Metric | Count |
|---|---|
| Comments deleted | **30** |
| Converted `//` → `/** */` | **29** (2 of them also reworded) |
| Converted `/** */` → `//` | **49** (Author-only file headers) |
| Headers trimmed, style kept as `/** */` | 8 |
| Placeholder header lines removed (`Date: --/--`, empty `Description:`) | 106 |
| Reworded only (style unchanged) | 1 |
| Files modified | 65 |

## Files modified

| File | Changes |
|---|---|
| `app.vue` | line_to_block×1 |
| `components/ListRender.vue` | header_block_to_line×1 |
| `composables/debounceRef.ts` | header_block_to_line×1 |
| `composables/useDownloadResume.ts` | header_trim×1 |
| `eslint.config.js` | delete×4 |
| `layouts/blog.vue` | header_block_to_line×1 |
| `nuxt.config.ts` | delete×1, line_to_block×4, line_to_block+reword×1 |
| `pages/blogs/[id].vue` | header_block_to_line×1 |
| `pages/blogs/index.vue` | header_block_to_line×1 |
| `pages/contact.vue` | header_block_to_line×1 |
| `pages/github.vue` | header_block_to_line×1 |
| `pages/index.vue` | header_block_to_line×1, line_to_block×1 |
| `pages/projects.vue` | header_block_to_line×1 |
| `plugins/ErrorHandler.ts` | header_block_to_line×1 |
| `server/api/blogs/categories.ts` | delete×1, header_block_to_line×1 |
| `server/api/blogs/detail/[id].ts` | header_block_to_line×1 |
| `server/api/blogs/posts.ts` | header_block_to_line×1 |
| `server/api/generate-pdf.ts` | delete×4, line_to_block×2 |
| `server/api/github.ts` | header_block_to_line×1, line_to_block×1 |
| `server/api/resume.ts` | header_block_to_line×1 |
| `server/plugins/RenderHTML.ts` | header_block_to_line×1 |
| `server/routes/robots.txt.ts` | header_trim×1 |
| `server/routes/rss.xml.ts` | header_trim×1 |
| `server/routes/sitemap.xml.ts` | header_trim×1 |
| `server/utils/blogSchemas.ts` | header_trim×1, line_to_block×4 |
| `server/utils/cacheGetPost.ts` | header_block_to_line×1, line_to_block×1 |
| `server/utils/createPDF.ts` | delete×7, line_to_block×1 |
| `server/utils/createPDFAts.ts` | line_to_block×2 |
| `stores/resume.ts` | header_block_to_line×1 |
| `tailwind.config.js` | delete×5, line_to_block×1 |
| `themes/portfolio-dev/components/PageHeading.vue` | header_block_to_line×1 |
| `themes/portfolio-dev/components/PostCategories.vue` | header_block_to_line×1 |
| `themes/portfolio-dev/pages/blogs/Index.vue` | header_block_to_line×1, line_to_block×1 |
| `themes/portfolio-dev/pages/contact/Index.vue` | header_block_to_line×1 |
| `themes/portfolio-dev/pages/github/GitRepos.vue` | delete×1, header_block_to_line×1 |
| `themes/portfolio-dev/pages/github/GitUser.vue` | header_block_to_line×1 |
| `themes/portfolio-dev/pages/github/Index.vue` | header_block_to_line×1 |
| `themes/portfolio-dev/pages/github/part/Item.vue` | line_to_block×1 |
| `themes/portfolio-dev/pages/post/Author.vue` | header_block_to_line×1 |
| `themes/portfolio-dev/pages/post/Comments.vue` | header_trim×1 |
| `themes/portfolio-dev/pages/post/Detail.vue` | header_block_to_line×1 |
| `themes/portfolio-dev/pages/post/Item.vue` | delete×1, header_block_to_line×1 |
| `themes/portfolio-dev/pages/post/Loading.vue` | header_block_to_line×1 |
| `themes/portfolio-dev/pages/projects/Index.vue` | header_block_to_line×1 |
| `themes/portfolio-dev/pages/resumeObject/AboutMe.vue` | header_block_to_line×1, line_to_block×2, line_to_block+reword×1, reword×1 |
| `themes/portfolio-dev/pages/resumeObject/Educations.vue` | header_block_to_line×1 |
| `themes/portfolio-dev/pages/resumeObject/Experiences.vue` | header_trim×1 |
| `themes/portfolio-dev/pages/resumeObject/Hero.vue` | header_block_to_line×1, line_to_block×1 |
| `themes/portfolio-dev/pages/resumeObject/Index.vue` | header_block_to_line×1 |
| `themes/portfolio-dev/pages/resumeObject/Languages.vue` | header_block_to_line×1 |
| `themes/portfolio-dev/pages/resumeObject/Skills.vue` | header_block_to_line×1 |
| `types/blog.ts` | header_block_to_line×1, line_to_block×1 |
| `types/codeLine.ts` | header_block_to_line×1 |
| `types/github.ts` | header_block_to_line×1 |
| `types/index.ts` | header_block_to_line×1 |
| `types/resume-api.ts` | header_block_to_line×1, line_to_block×1 |
| `types/resume-document.ts` | header_block_to_line×1, line_to_block×2 |
| `utils/cloneDeep.ts` | delete×4, header_block_to_line×1 |
| `utils/convertNumberToDate.ts` | header_block_to_line×1 |
| `utils/htmlCodeLines.ts` | header_block_to_line×1 |
| `utils/index.ts` | header_block_to_line×1 |
| `utils/jsonCodeLines.ts` | header_block_to_line×1 |
| `utils/removeHtmlTags.ts` | delete×2, header_block_to_line×1 |
| `utils/themeBadgeUi.ts` | header_trim×1 |
| `utils/tsCodeLines.ts` | header_block_to_line×1 |

## Deleted comments

### `eslint.config.js:7`
```ts
// Vue
```

### `eslint.config.js:18`
```ts
// TypeScript
```

### `eslint.config.js:23`
```ts
// Formatting
```

### `eslint.config.js:28`
```ts
// General
```

### `nuxt.config.ts:3`
```ts
/* import * as dotenv from 'dotenv' */
```

### `server/api/blogs/categories.ts:17`
```ts
// base: 'PostCategories',
```

### `server/api/generate-pdf.ts:81`
```ts
// Khởi tạo Puppeteer và tạo PDF
```

### `server/api/generate-pdf.ts:87`
```ts
// Đặt nội dung HTML vào trang
```

### `server/api/generate-pdf.ts:90`
```ts
// Tạo PDF
```

### `server/api/generate-pdf.ts:103`
```ts
// Trả file PDF cho client
```

### `server/utils/createPDF.ts:27`
```ts
/**
   * get data format
   */
```

### `server/utils/createPDF.ts:41`
```ts
/**
   * render HTML
   */
```

### `server/utils/createPDF.ts:62`
```ts
/* res.send(html); */
```

### `server/utils/createPDF.ts:65`
```ts
/**
 * format data
 * @param {*} RECORD
 * @returns
 */
```

### `server/utils/createPDF.ts:71`
```ts
// Thông tin cơ bản
```

### `server/utils/createPDF.ts:104`
```ts
// Thông tin công việc
```

### `server/utils/createPDF.ts:110`
```ts
// ---
```

### `tailwind.config.js:11`
```ts
// Các mức độ màu từ 100 đến 900 (thêm sáng hoặc tối)
```

### `tailwind.config.js:13`
```ts
// Điều chỉnh độ sáng/tối
```

### `tailwind.config.js:15`
```ts
// '100', '200', ..., '900'
```

### `tailwind.config.js:41`
```ts
/* colors: {
			transparent: 'transparent',
			current: 'currentColor',
			white: '#ffffff',
			darkness: '#23272d',
			red: generateColorScale('#fe3d57'),
			pink: generateColorScale('#ec4899'),
			green: generateColorScale('#42b883'),
			blue: generateColorScale('#38b2ac'),
			sky: generateColorScale('#61dafb'),
			violet: generateColorScale('#18315a'),
			dark: generateColorScale('#333333'),
			orange: generateColorScale('#C66828'),
		}, */
```

### `tailwind.config.js:57`
```ts
// padding: '10px',
```

### `themes/portfolio-dev/pages/github/GitRepos.vue:15`
```ts
// Filter
```

### `themes/portfolio-dev/pages/post/Item.vue:6`
```ts
/* import { convertNumberToDate } from '@/utils/index'; */
```

### `utils/cloneDeep.ts:12`
```ts
// Kiểm tra nếu obj không phải là đối tượng hoặc là null
```

### `utils/cloneDeep.ts:17`
```ts
// Tạo một bản sao mới, sử dụng Array.isArray để kiểm tra nếu obj là mảng
```

### `utils/cloneDeep.ts:20`
```ts
// Duyệt qua tất cả các thuộc tính của obj
```

### `utils/cloneDeep.ts:22`
```ts
// Đệ quy để sao chép các thuộc tính
```

### `utils/removeHtmlTags.ts:7`
```ts
/**
 * @param input - string
 * @returns string
 * */
```

### `utils/removeHtmlTags.ts:13`
```ts
// Sử dụng RegEx để tìm và loại bỏ tất cả các thẻ HTML
```

## Converted `//` → `/** */`

### `app.vue:15`
Before:
```ts
// nuxt.config.ts's app.head.htmlAttrs.lang is a static 'vi' fallback (SSR's
// very first response, before any locale is known) - override it per real
// active locale so <html lang> matches what's actually rendered (e.g. "en"
// under the /en/* prefix), instead of always claiming Vietnamese.
// addSeoAttributes was previously omitted here because it triggered an
// "I18n baseUrl is required" build warning - nuxt.config.ts's i18n.baseUrl
// is now a real value (server/utils/siteUrl.ts's SITE_URL), so canonical +
// hreflang alternate <link> tags can be generated for real.
```
After:
```ts
/**
 * nuxt.config.ts's app.head.htmlAttrs.lang is a static 'vi' fallback (SSR's
 * very first response, before any locale is known) - override it per real
 * active locale so <html lang> matches what's actually rendered (e.g. "en"
 * under the /en/* prefix), instead of always claiming Vietnamese.
 * addSeoAttributes was previously omitted here because it triggered an
 * "I18n baseUrl is required" build warning - nuxt.config.ts's i18n.baseUrl
 * is now a real value (server/utils/siteUrl.ts's SITE_URL), so canonical +
 * hreflang alternate <link> tags can be generated for real.
 */
```

### `nuxt.config.ts:7`
Before:
```ts
// The active UI theme. A theme is a folder under `themes/<name>/` providing:
// - `pages/` - one subfolder per route content (resumeObject, github, contact,
//   projects, blogs, post), auto-imported with the `Theme` prefix (e.g.
//   <ThemeGithub>, <ThemePostDetail>) - these are what each `pages/*.vue` file
//   renders.
// - `components/` - reusable chrome shared across pages (Panel, Folder,
//   NavItem, FilterFolder, CodeBlock, CornerFrame, PageHeading, PostCategories),
//   same `Theme` prefix (e.g. <ThemePanel>).
// - `layout/` - site-wide chrome outside the page content (Header, Footer),
//   rendered directly by app.vue, same `Theme` prefix (e.g. <ThemeHeader>).
// - `tokens.css` - the theme's CSS custom properties (see
//   themes/portfolio-dev/tokens.css).
// Swapping UI = add a new themes/<name>/ folder implementing that contract,
// then change this constant.
```
After:
```ts
/**
 * The active UI theme. A theme is a folder under `themes/<name>/` providing:
 * - `pages/` - one subfolder per route content (resumeObject, github, contact,
 *   projects, blogs, post), auto-imported with the `Theme` prefix (e.g.
 *   <ThemeGithub>, <ThemePostDetail>) - these are what each `pages/*.vue` file
 *   renders.
 * - `components/` - reusable chrome shared across pages (Panel, Folder,
 *   NavItem, FilterFolder, CodeBlock, CornerFrame, PageHeading, PostCategories),
 *   same `Theme` prefix (e.g. <ThemePanel>).
 * - `layout/` - site-wide chrome outside the page content (Header, Footer),
 *   rendered directly by app.vue, same `Theme` prefix (e.g. <ThemeHeader>).
 * - `tokens.css` - the theme's CSS custom properties (see
 *   themes/portfolio-dev/tokens.css).
 * Swapping UI = add a new themes/<name>/ folder implementing that contract,
 * then change this constant.
 */
```

### `nuxt.config.ts:73`
Before:
```ts
// @nuxt/ui auto-installs @nuxtjs/color-mode (forcing classSuffix: ''); these
// options merge with that. Defaults to dark (existing look) until the user
// explicitly toggles - see themes/<name>/settings-colors-theme/{dark,light}.css
// for the `.dark`/`.light` palettes this class selects between.
```
After:
```ts
/**
   * @nuxt/ui auto-installs @nuxtjs/color-mode (forcing classSuffix: ''); these
   * options merge with that. Defaults to dark (existing look) until the user
   * explicitly toggles - see themes/<name>/settings-colors-theme/{dark,light}.css
   * for the `.dark`/`.light` palettes this class selects between.
   */
```

### `nuxt.config.ts:88`
Before:
```ts
// UI-chrome-only i18n (nav tab labels in app.config.ts's menuPrimary are
// filename-style, e.g. "_resume.ts" - part of the code-editor metaphor,
// deliberately NOT translated, same as nobody translates a real file
// name in an IDE). `vi` (the site's original language, 100% of current
// traffic) keeps its existing unprefixed URLs; only `en` gets a
// `/en/*` prefix - see i18n-foundation node in
// agent-hub/haven/diagrams/dev-loop.prime-mermaid.md for why
// `strategy: 'prefix'` (prefixing `vi` too) was deliberately not chosen.
```
After:
```ts
/**
   * UI-chrome-only i18n (nav tab labels in app.config.ts's menuPrimary are
   * filename-style, e.g. "_resume.ts" - part of the code-editor metaphor,
   * deliberately NOT translated, same as nobody translates a real file
   * name in an IDE). `vi` (the site's original language, 100% of current
   * traffic) keeps its existing unprefixed URLs; only `en` gets a
   * `/en/*` prefix - see i18n-foundation node in
   * agent-hub/haven/diagrams/dev-loop.prime-mermaid.md for why
   * `strategy: 'prefix'` (prefixing `vi` too) was deliberately not chosen.
   */
```

### `nuxt.config.ts:109`
Before:
```ts
// @nuxtjs/i18n's default (`detectBrowserLanguage: { redirectOn: 'root' }`)
// auto-redirects `/` to `/en` for visitors with an English browser
// locale - not something asked for here (only a manual switcher was),
// and a surprising behavior change for every real visitor on a live
// site. Disabled to keep this node's diff to exactly what was scoped.
```
After:
```ts
/**
     * @nuxtjs/i18n's default (`detectBrowserLanguage: { redirectOn: 'root' }`)
     * auto-redirects `/` to `/en` for visitors with an English browser
     * locale - not something asked for here (only a manual switcher was),
     * and a surprising behavior change for every real visitor on a live
     * site. Disabled to keep this node's diff to exactly what was scoped.
     */
```

### `nuxt.config.ts:117` (reworded)
Before:
```ts
// The integrated dev/build vue-tsc check runs against the root tsconfig
// only, whose generated `include` pulls in server/**/*.ts but doesn't
// exclude it - so every server/ file fails with false "Cannot find
// name 'defineEventHandler'" etc. errors (Nitro's server-only globals
// aren't in scope there). server/tsconfig.json already type-checks
// that directory correctly via editor tooling; disable the integrated
// check rather than have it report 24 false positives every dev start.
```
After:
```ts
/**
     * The integrated dev/build vue-tsc check runs against the root tsconfig
     * only, whose generated `include` pulls in every server/ .ts file but doesn't
     * exclude it - so every server/ file fails with false "Cannot find
     * name 'defineEventHandler'" etc. errors (Nitro's server-only globals
     * aren't in scope there). server/tsconfig.json already type-checks
     * that directory correctly via editor tooling; disable the integrated
     * check rather than have it report 24 false positives every dev start.
     */
```

### `pages/index.vue:41`
Before:
```ts
// Person structured data - a CV site has no page more relevant to attach
// this to than the resume itself. Every field traces to real, already-shown
// data (app.config.ts's contact + the resume store's positionDesired) - no
// fabricated identifiers.
```
After:
```ts
/**
 * Person structured data - a CV site has no page more relevant to attach
 * this to than the resume itself. Every field traces to real, already-shown
 * data (app.config.ts's contact + the resume store's positionDesired) - no
 * fabricated identifiers.
 */
```

### `server/api/generate-pdf.ts:9`
Before:
```ts
// defineCachedEventHandler's on-disk cache does not round-trip binary
// Buffer bodies correctly in this Nitro version (see #29) - it serializes
// them as plain per-byte-indexed JSON objects instead of raw bytes. Cache
// the generated PDF in memory instead; resume data changes rarely, and
// this still bounds how often a full headless Chrome launch is triggered.
// Keyed per template+lang (issue #206) so a cached classic body is never
// served for an ATS request or vice versa.
```
After:
```ts
/**
 * defineCachedEventHandler's on-disk cache does not round-trip binary
 * Buffer bodies correctly in this Nitro version (see #29) - it serializes
 * them as plain per-byte-indexed JSON objects instead of raw bytes. Cache
 * the generated PDF in memory instead; resume data changes rarely, and
 * this still bounds how often a full headless Chrome launch is triggered.
 * Keyed per template+lang (issue #206) so a cached classic body is never
 * served for an ATS request or vice versa.
 */
```

### `server/api/generate-pdf.ts:19`
Before:
```ts
// Vercel's serverless functions run on Amazon Linux with no system Chrome
// installed at any fixed path - PUPPETEER_EXECUTABLE_PATH alone can't work
// there (there's nothing for it to point to). @sparticuz/chromium ships a
// Linux-x64 Chromium binary built specifically for Lambda-style serverless
// hosts, extracted to /tmp on first use per container. It's Linux-only, so
// local dev (macOS/Windows) still falls back to the OS-detected/explicit
// PUPPETEER_EXECUTABLE_PATH path below.
```
After:
```ts
/**
 * Vercel's serverless functions run on Amazon Linux with no system Chrome
 * installed at any fixed path - PUPPETEER_EXECUTABLE_PATH alone can't work
 * there (there's nothing for it to point to). @sparticuz/chromium ships a
 * Linux-x64 Chromium binary built specifically for Lambda-style serverless
 * hosts, extracted to /tmp on first use per container. It's Linux-only, so
 * local dev (macOS/Windows) still falls back to the OS-detected/explicit
 * PUPPETEER_EXECUTABLE_PATH path below.
 */
```

### `server/api/github.ts:9`
Before:
```ts
// GitHub returns 401/403 for an invalid or expired token; fall back to an
// unauthenticated request rather than failing the whole page in that case.
```
After:
```ts
/**
 * GitHub returns 401/403 for an invalid or expired token; fall back to an
 * unauthenticated request rather than failing the whole page in that case.
 */
```

### `server/utils/blogSchemas.ts:14`
Before:
```ts
// `isPublic` is declared on the `Post` TS type but the real API never
// returns it (confirmed live 2026-09-06: actual posts carry a `status`
// string, e.g. "publish", instead) and nothing in the app reads
// `post.isPublic` (`grep -rn "isPublic"` across themes/stores/pages: 0
// matches) — kept optional here rather than required so real data
// validates instead of 502ing on a field the API was never sending.
```
After:
```ts
/**
 * `isPublic` is declared on the `Post` TS type but the real API never
 * returns it (confirmed live 2026-09-06: actual posts carry a `status`
 * string, e.g. "publish", instead) and nothing in the app reads
 * `post.isPublic` (`grep -rn "isPublic"` across themes/stores/pages: 0
 * matches) — kept optional here rather than required so real data
 * validates instead of 502ing on a field the API was never sending.
 */
```

### `server/utils/blogSchemas.ts:34`
Before:
```ts
// The real shape of the blog API's `data` field for a post list — a page
// of posts plus pagination metadata, NOT a bare `Post[]` (see the trap in
// `agent-hub/doctrine/domains/PROJECT.md`).
```
After:
```ts
/**
 * The real shape of the blog API's `data` field for a post list — a page
 * of posts plus pagination metadata, NOT a bare `Post[]` (see the trap in
 * `agent-hub/doctrine/domains/PROJECT.md`).
 */
```

### `server/utils/blogSchemas.ts:44`
Before:
```ts
// The existing `APIFormatResponse<string[]>` cast on this endpoint
// (`server/api/blogs/categories.ts`, pre-this-change) was already wrong —
// the real API returns full category objects (confirmed live
// 2026-09-06), and the actual consumer (`themes/portfolio-dev/components/
// PostCategories.vue`'s `Category` interface) already expects objects,
// not bare strings. Schema follows the real shape + the real consumer,
// not the stale cast.
```
After:
```ts
/**
 * The existing `APIFormatResponse<string[]>` cast on this endpoint
 * (`server/api/blogs/categories.ts`, pre-this-change) was already wrong —
 * the real API returns full category objects (confirmed live
 * 2026-09-06), and the actual consumer (`themes/portfolio-dev/components/
 * PostCategories.vue`'s `Category` interface) already expects objects,
 * not bare strings. Schema follows the real shape + the real consumer,
 * not the stale cast.
 */
```

### `server/utils/blogSchemas.ts:60`
Before:
```ts
// Mirrors the `{ status = false, data = null, errors = [], message = '' }`
// destructuring defaults already used at every fetch site — same
// tolerance for a missing wrapper field, but now enforces the actual
// shape of whichever field IS present.
```
After:
```ts
/**
 * Mirrors the `{ status = false, data = null, errors = [], message = '' }`
 * destructuring defaults already used at every fetch site — same
 * tolerance for a missing wrapper field, but now enforces the actual
 * shape of whichever field IS present.
 */
```

### `server/utils/cacheGetPost.ts:25`
Before:
```ts
// The blog API (Render free tier) cold-starts in 20-30s after
// inactivity; Vercel's own serverless function timeout kills the whole
// request well before 3 retries against that cold start can matter,
// producing a raw 504 instead of this app's own error handling. A
// bounded 6s timeout with no retry (retrying just repeats the same
// slow wait) lets this throw and get caught by the caller, which can
// still respond within the function's time budget. defineCachedFunction
// does not cache a rejected call, so a timeout here doesn't poison the
// cache for the full maxAge - the next request tries again fresh.
```
After:
```ts
/**
     * The blog API (Render free tier) cold-starts in 20-30s after
     * inactivity; Vercel's own serverless function timeout kills the whole
     * request well before 3 retries against that cold start can matter,
     * producing a raw 504 instead of this app's own error handling. A
     * bounded 6s timeout with no retry (retrying just repeats the same
     * slow wait) lets this throw and get caught by the caller, which can
     * still respond within the function's time budget. defineCachedFunction
     * does not cache a rejected call, so a timeout here doesn't poison the
     * cache for the full maxAge - the next request tries again fresh.
     */
```

### `server/utils/createPDF.ts:14`
Before:
```ts
// Note: `description`/`introduction` are intentionally left unescaped — they are
// rich-text HTML by design elsewhere in the app (rendered via v-html).
```
After:
```ts
/**
 * Note: `description`/`introduction` are intentionally left unescaped — they are
 * rich-text HTML by design elsewhere in the app (rendered via v-html).
 */
```

### `server/utils/createPDFAts.ts:51`
Before:
```ts
// Rich-text descriptions come from the owner's own resume API (same trust
// model as createPDF.ts, which inserts them raw). Here they're reduced to a
// plain allow-list of tags with every attribute dropped, so inline styles/
// classes/spans can't reintroduce columns, colors or letter-spacing that
// trip ATS parsers.
```
After:
```ts
/**
 * Rich-text descriptions come from the owner's own resume API (same trust
 * model as createPDF.ts, which inserts them raw). Here they're reduced to a
 * plain allow-list of tags with every attribute dropped, so inline styles/
 * classes/spans can't reintroduce columns, colors or letter-spacing that
 * trip ATS parsers.
 */
```

### `server/utils/createPDFAts.ts:92`
Before:
```ts
// The raw API returns this as an object or an array of one (see types/resume-api.ts).
```
After:
```ts
/** The raw API returns this as an object or an array of one (see types/resume-api.ts). */
```

### `tailwind.config.js:67`
Before:
```ts
// Semantic tokens for the active UI theme (see themes/<name>/tokens.css).
// Swapping the value of ACTIVE_THEME in nuxt.config.ts is enough to
// re-skin every component that uses `theme-*` classes.
```
After:
```ts
/**
         * Semantic tokens for the active UI theme (see themes/<name>/tokens.css).
         * Swapping the value of ACTIVE_THEME in nuxt.config.ts is enough to
         * re-skin every component that uses `theme-*` classes.
         */
```

### `themes/portfolio-dev/pages/blogs/Index.vue:30`
Before:
```ts
// `status` is already 'success' here (reused from the cached fetch above)
// only when we're displaying stale data from a previous visit - kick off a
// background refresh so it gets replaced with fresh data once it arrives.
// Nuxt's page Suspense/transition setup can call onMounted twice for the
// same mount, so guard with a flag scoped to this component instance
// (not to the in-flight request, which may already have finished by the
// time the second onMounted call happens).
```
After:
```ts
/**
 * `status` is already 'success' here (reused from the cached fetch above)
 * only when we're displaying stale data from a previous visit - kick off a
 * background refresh so it gets replaced with fresh data once it arrives.
 * Nuxt's page Suspense/transition setup can call onMounted twice for the
 * same mount, so guard with a flag scoped to this component instance
 * (not to the in-flight request, which may already have finished by the
 * time the second onMounted call happens).
 */
```

### `themes/portfolio-dev/pages/github/part/Item.vue:31`
Before:
```ts
// toLocaleDateString() with no options resolves the calendar date in the
// RUNTIME's local timezone - the SSR server (Vercel, UTC) and a real
// browser client (e.g. UTC+7) can compute a different date for the same
// instant when it falls near a UTC day boundary, causing a Vue hydration
// mismatch. Pinning timeZone: 'UTC' makes server and client always agree,
// since modelValue.updated_at is already a UTC ISO timestamp.
```
After:
```ts
/**
 * toLocaleDateString() with no options resolves the calendar date in the
 * RUNTIME's local timezone - the SSR server (Vercel, UTC) and a real
 * browser client (e.g. UTC+7) can compute a different date for the same
 * instant when it falls near a UTC day boundary, causing a Vue hydration
 * mismatch. Pinning timeZone: 'UTC' makes server and client always agree,
 * since modelValue.updated_at is already a UTC ISO timestamp.
 */
```

### `themes/portfolio-dev/pages/resumeObject/AboutMe.vue:15`
Before:
```ts
// Splits an HTML string into "sentences" only at points where no tag is
// currently open, so inline markup (e.g. <strong>) never gets broken across lines.
```
After:
```ts
/**
 * Splits an HTML string into "sentences" only at points where no tag is
 * currently open, so inline markup (e.g. <strong>) never gets broken across lines.
 */
```

### `themes/portfolio-dev/pages/resumeObject/AboutMe.vue:51` (reworded)
Before:
```ts
// Renders a sentence as literal Markdown source: <strong>/<b> becomes visible
// **bold** syntax instead of actually-rendered bold HTML. A private-use
// marker keeps the bold boundaries intact through HTML-escaping, then gets
// swapped for a dimmed "**" + bold text (Markdown syntax-highlighting look).
```
After:
```ts
/**
 * Renders a sentence as literal Markdown source: <strong>/<b> becomes visible **bold** syntax instead of
 * actually-rendered bold HTML, with a dimmed "**" around bold text (Markdown syntax-highlighting look).
 */
```

### `themes/portfolio-dev/pages/resumeObject/AboutMe.vue:71`
Before:
```ts
// `[text](url)` Markdown link syntax, still a real <a> (works fine via v-html,
// no Vue binding needed for plain navigation) so it stays clickable.
```
After:
```ts
/**
 * `[text](url)` Markdown link syntax, still a real <a> (works fine via v-html,
 * no Vue binding needed for plain navigation) so it stays clickable.
 */
```

### `themes/portfolio-dev/pages/resumeObject/Hero.vue:16`
Before:
```ts
// Real, computed-from-data summary (not a hardcoded number) so a recruiter
// can see experience length + current role without clicking into the
// Experience tab first (issue #179). `store.experiences` is already sorted
// most-recent-first, so [0] is the current/latest role and the last item
// holds the earliest startDate.
```
After:
```ts
/**
 * Real, computed-from-data summary (not a hardcoded number) so a recruiter
 * can see experience length + current role without clicking into the
 * Experience tab first (issue #179). `store.experiences` is already sorted
 * most-recent-first, so [0] is the current/latest role and the last item
 * holds the earliest startDate.
 */
```

### `types/blog.ts:11`
Before:
```ts
// Declared on the type but the real API never actually returns it
// (confirmed live 2026-09-06 while adding runtime validation, issue
// #141) and nothing in the app reads `post.isPublic` — kept optional
// to match reality instead of a field that was never really there.
```
After:
```ts
/**
   * Declared on the type but the real API never actually returns it
   * (confirmed live 2026-09-06 while adding runtime validation, issue
   * #141) and nothing in the app reads `post.isPublic` — kept optional
   * to match reality instead of a field that was never really there.
   */
```

### `types/resume-api.ts:13`
Before:
```ts
// The raw API can return generalInformation as an object or an array of
// one - callers normalize it to a single GeneralInformation object.
```
After:
```ts
/**
   * The raw API can return generalInformation as an object or an array of
   * one - callers normalize it to a single GeneralInformation object.
   */
```

### `types/resume-document.ts:124`
Before:
```ts
// `link`/`images` intentionally dropped (issue #142): `server/utils/
// createPDF.ts` is the only consumer of this type anywhere in the repo
// (`grep -rn "\bCertificate\b"` confirms) and never reads either field
// (`grep -n "\.link\b\|\.images\b" createPDF.ts`: 0 matches) — dead type
// surface, not a behavior change (interfaces have no runtime footprint).
```
After:
```ts
/**
 * `link`/`images` intentionally dropped (issue #142): `server/utils/
 * createPDF.ts` is the only consumer of this type anywhere in the repo
 * (`grep -rn "\bCertificate\b"` confirms) and never reads either field
 * (`grep -n "\.link\b\|\.images\b" createPDF.ts`: 0 matches) — dead type
 * surface, not a behavior change (interfaces have no runtime footprint).
 */
```

### `types/resume-document.ts:138`
Before:
```ts
// `link`/`images` dropped for the same reason as `Certificate` above
// (issue #142) — `createPDF.ts` never reads either field.
```
After:
```ts
/**
 * `link`/`images` dropped for the same reason as `Certificate` above
 * (issue #142) — `createPDF.ts` never reads either field.
 */
```

## Converted `/** */` → `//` (file headers)

All 49 had the identical before/after shape:

Before:
```ts
/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */
```
After:
```ts
// Author: Đạt Võ - https://github.com/datvt243
```

Files: `components/ListRender.vue`, `composables/debounceRef.ts`, `layouts/blog.vue`, `pages/blogs/[id].vue`, `pages/blogs/index.vue`, `pages/contact.vue`, `pages/github.vue`, `pages/index.vue`, `pages/projects.vue`, `plugins/ErrorHandler.ts`, `server/api/blogs/categories.ts`, `server/api/blogs/detail/[id].ts`, `server/api/blogs/posts.ts`, `server/api/github.ts`, `server/api/resume.ts`, `server/plugins/RenderHTML.ts`, `server/utils/cacheGetPost.ts`, `stores/resume.ts`, `themes/portfolio-dev/components/PageHeading.vue`, `themes/portfolio-dev/components/PostCategories.vue`, `themes/portfolio-dev/pages/blogs/Index.vue`, `themes/portfolio-dev/pages/contact/Index.vue`, `themes/portfolio-dev/pages/github/GitRepos.vue`, `themes/portfolio-dev/pages/github/GitUser.vue`, `themes/portfolio-dev/pages/github/Index.vue`, `themes/portfolio-dev/pages/post/Author.vue`, `themes/portfolio-dev/pages/post/Detail.vue`, `themes/portfolio-dev/pages/post/Item.vue`, `themes/portfolio-dev/pages/post/Loading.vue`, `themes/portfolio-dev/pages/projects/Index.vue`, `themes/portfolio-dev/pages/resumeObject/AboutMe.vue`, `themes/portfolio-dev/pages/resumeObject/Educations.vue`, `themes/portfolio-dev/pages/resumeObject/Hero.vue`, `themes/portfolio-dev/pages/resumeObject/Index.vue`, `themes/portfolio-dev/pages/resumeObject/Languages.vue`, `themes/portfolio-dev/pages/resumeObject/Skills.vue`, `types/blog.ts`, `types/codeLine.ts`, `types/github.ts`, `types/index.ts`, `types/resume-api.ts`, `types/resume-document.ts`, `utils/cloneDeep.ts`, `utils/convertNumberToDate.ts`, `utils/htmlCodeLines.ts`, `utils/index.ts`, `utils/jsonCodeLines.ts`, `utils/removeHtmlTags.ts`, `utils/tsCodeLines.ts`

## Headers trimmed (Description kept, style unchanged)

- `composables/useDownloadResume.ts`: removed `* Date: `--/--``
- `server/routes/robots.txt.ts`: removed `* Date: `--/--``
- `server/routes/rss.xml.ts`: removed `* Date: `--/--``
- `server/routes/sitemap.xml.ts`: removed `* Date: `--/--``
- `server/utils/blogSchemas.ts`: removed `* Date: `--/--``
- `themes/portfolio-dev/pages/post/Comments.vue`: removed `* Date: `--/--``
- `themes/portfolio-dev/pages/resumeObject/Experiences.vue`: removed `* Date: `--/--``
- `utils/themeBadgeUi.ts`: removed `* Date: `--/--``

## Reworded only

### `themes/portfolio-dev/pages/resumeObject/AboutMe.vue:56`
Before:
```ts
// Drop every tag except <strong>/<b>, then split ON those tags — String.split
// with a non-capturing... actually a matching regex naturally alternates
// [plain, bold, plain, bold, ...] since each strong/b pair produces one
// split boundary pair, with no marker characters needed.
```
After:
```ts
// Drop every tag except <strong>/<b>, then split on those tags - the split naturally alternates [plain,
  // bold, plain, bold, ...] since each strong/b pair produces one boundary pair, so no marker characters are
  // needed.
```

