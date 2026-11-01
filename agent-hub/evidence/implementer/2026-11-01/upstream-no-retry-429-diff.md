# 2026-11-01 - upstream-no-retry-429 (diff)

- Worker: implementer · Version 0.1.0
- Node: `upstream-no-retry-429` (`haven/diagrams/dev-loop.prime-mermaid.md`, last row)
- Task: see `upstream-no-retry-429-plan.md` (verbatim task + table re-check)
- Status: `sealed_pending_verifier`

## Hub bytes before: 80110

## Summary
Already fixed before this pass, re-checked by code and by simulation: `/api/resume` (#281/#282, 502, `retry: 0`), `/api/github` server side (#330, `retry: 0`, 403 rate-limit vs bad token), `/api/blogs/posts` (#287, 503, `retry: 0`), page crash on `/github` (#330), page error states (#286). Still broken and fixed here: retries that repeat a 429 to the blog upstream (categories handler + `fetchWithRetry` 3× → 12 calls per `/blogs` render; detail handler) and to our own failing APIs from page `useFetch` (`/api/github`, `/api/blogs/posts`, `/api/blogs/detail`), which doubled upstream calls per failed SSR render. Fix: `retry: 0` at each, the same idiom `stores/resume.ts` and `server/api/visit.post.ts` already use. `fetchWithRetry` had one caller, so it is deleted.

## Diff
| File | Why |
|---|---|
| `server/api/blogs/categories.ts` | `retry: 0` on the upstream `$fetch` (ofetch retries a GET 429 once by default) |
| `server/api/blogs/detail/[id].ts` | same |
| `themes/portfolio-dev/components/PostCategories.vue` | `fetchWithRetry` (3 tries, 1s apart) → `$fetch<Category[]>('/api/blogs/categories', { retry: 0 })`. The component already has an error state (`blogs.categoriesLoadError`) |
| `themes/portfolio-dev/pages/github/Index.vue` | `useFetch` `retry: 0`: an SSR render on a 429 otherwise calls `/api/github` twice, so GitHub 4× |
| `themes/portfolio-dev/pages/blogs/Index.vue` | `useFetch` `retry: 0` (503 is in ofetch's retry list) |
| `pages/blogs/[id].vue` | `useFetch` `retry: 0` (the route-param fetch already lives in the loader) |
| `utils/fetchWithRetry.ts` | deleted (`git rm`), no caller left |
| `utils/index.ts` | drop its barrel export |
| `agent-hub/haven/diagrams/dev-loop.prime-mermaid.md` | node row appended at the end |

```diff
diff --git a/pages/blogs/[id].vue b/pages/blogs/[id].vue
index a4c763a..df30bd0 100644
--- a/pages/blogs/[id].vue
+++ b/pages/blogs/[id].vue
@@ -17,7 +17,7 @@ definePageMeta({
   },
 })
 
-const { data, error } = await useFetch<APIFormatResponse<Post>>(`/api/blogs/detail/${id}`)
+const { data, error } = await useFetch<APIFormatResponse<Post>>(`/api/blogs/detail/${id}`, { retry: 0 })
 
 /**
  * Unknown ids (or slugs - links only ever use _id) leave data empty;
diff --git a/server/api/blogs/categories.ts b/server/api/blogs/categories.ts
index 23fcb39..f123860 100644
--- a/server/api/blogs/categories.ts
+++ b/server/api/blogs/categories.ts
@@ -6,7 +6,8 @@ import { categoriesResponseSchema, parseBlogApiResponse } from '~/server/utils/b
 
 export default defineCachedEventHandler(
   async () => {
-    const raw = await $fetch(`https://blog-api-nodejs-express.onrender.com/api/v1/categories`)
+    // No retry: a retried 429 is one more call against the upstream's limit.
+    const raw = await $fetch(`https://blog-api-nodejs-express.onrender.com/api/v1/categories`, { retry: 0 })
 
     const { status, data } = parseBlogApiResponse({ schema: categoriesResponseSchema, raw, context: 'categories' })
 
diff --git a/server/api/blogs/detail/[id].ts b/server/api/blogs/detail/[id].ts
index 31ed338..e7327ee 100644
--- a/server/api/blogs/detail/[id].ts
+++ b/server/api/blogs/detail/[id].ts
@@ -23,7 +23,7 @@ export default defineCachedEventHandler(
      * anything else (unknown id, or a slug) - surface that as our own
      * clean 404 instead of an unhandled FetchError.
      */
-    const raw = await $fetch(`https://blog-api-nodejs-express.onrender.com/api/v1/post/detail/${id}`).catch((e) => {
+    const raw = await $fetch(`https://blog-api-nodejs-express.onrender.com/api/v1/post/detail/${id}`, { retry: 0 }).catch((e) => {
       if (e?.statusCode === 404) throw createError({ statusCode: 404, statusMessage: 'Post not found' })
       throw e
     })
diff --git a/themes/portfolio-dev/components/PostCategories.vue b/themes/portfolio-dev/components/PostCategories.vue
index a77836e..515beef 100644
--- a/themes/portfolio-dev/components/PostCategories.vue
+++ b/themes/portfolio-dev/components/PostCategories.vue
@@ -3,7 +3,6 @@
  * @author Đạt Võ <votan.it@gmail.com>
  * @see https://github.com/datvt243
  */
-import { fetchWithRetry } from '~/utils'
 
 interface Category {
 	_id: string
@@ -14,7 +13,8 @@ interface Category {
 }
 
 const { t } = useI18n()
-const { data, error } = await useAsyncData<Category[]>(async () => (await fetchWithRetry<Category[]>('/api/blogs/categories')) ?? [])
+// No retry: each retry of a failed call is another call to the rate-limited upstream.
+const { data, error } = await useAsyncData<Category[]>(async () => (await $fetch<Category[]>('/api/blogs/categories', { retry: 0 })) ?? [])
 
 const query = inject<{ category: Ref<string>; page: Ref<number>; perPage: Ref<number> }>('query')
 const category = toRef(query?.category || '')
diff --git a/themes/portfolio-dev/pages/blogs/Index.vue b/themes/portfolio-dev/pages/blogs/Index.vue
index 2417482..98f5466 100644
--- a/themes/portfolio-dev/pages/blogs/Index.vue
+++ b/themes/portfolio-dev/pages/blogs/Index.vue
@@ -15,6 +15,7 @@ const perPage = toRef(query?.perPage || 20)
 const fetchKey = `blogs-posts:${category.value}:${page.value}:${perPage.value}`
 const postsFetch = useFetch<APIFormatResponse<PaginatedPosts>>(`/api/blogs/posts`, {
   key: fetchKey,
+  retry: 0,
   query: {
     page: page,
     perPage: perPage,
diff --git a/themes/portfolio-dev/pages/github/Index.vue b/themes/portfolio-dev/pages/github/Index.vue
index 6b99a97..35a0fb1 100644
--- a/themes/portfolio-dev/pages/github/Index.vue
+++ b/themes/portfolio-dev/pages/github/Index.vue
@@ -6,7 +6,7 @@
 
 import type { GitRepos, GitUser } from '~/types/github'
 
-const { data, error } = await useFetch<{ data: { user: GitUser; repos: GitRepos[] } }>('/api/github')
+const { data, error } = await useFetch<{ data: { user: GitUser; repos: GitRepos[] } }>('/api/github', { retry: 0 })
 /**
  * Without data the page can't render. Always a 5xx (even for an upstream
  * 404), so ISR keeps serving the last good page instead of caching an error.
diff --git a/utils/index.ts b/utils/index.ts
index b991032..0233acb 100644
--- a/utils/index.ts
+++ b/utils/index.ts
@@ -7,7 +7,6 @@ export * from './cloneDeep'
 export * from './convertNumberToDate'
 export * from './escapeHtml'
 export * from './formatDate'
-export * from './fetchWithRetry'
 export * from './groupSkills'
 export * from './jsonCodeLines'
 export * from './htmlCodeLines'
diff --git a/utils/fetchWithRetry.ts b/utils/fetchWithRetry.ts
deleted file mode 100644
index 65b2dc2..0000000
--- a/utils/fetchWithRetry.ts
+++ /dev/null
@@ -1,13 +0,0 @@
-export const fetchWithRetry = async <T = unknown>(url: string = '', opts: { retries: number; delay: number } = { retries: 3, delay: 1000 }) => {
-  for (let i = 0; i < opts.retries; i++) {
-    try {
-      const res = await $fetch<T>(url)
-      return res
-    } catch (e) {
-      if (i === opts.retries - 1) {
-        throw e
-      }
-      await new Promise((resolve) => setTimeout(resolve, opts.delay))
-    }
-  }
-}
```

## Decisions
- **Retry-After**: not forwarded. Nothing in the app retries any more, so there is no wait to schedule. Forwarding it to browsers would mean mapping it through 502/503 pages that ISR serves stale anyway. Not cheap enough to be worth a diff. Recorded as Still open.
- **PDF rate limit**: skipped. `/api/generate-pdf` gets its data via `fetchResume` (`retry: 0`) and caches the PDF in memory per instance and `lang`. A per-IP limiter needs shared state across Vercel instances to mean anything, so it is not trivial. No spam has been observed.
- **No new unit test**: the only non-trivial pure logic (403 classification) already has 3 tests in `tests/fetchGithub.test.ts` (#330). This diff adds only `retry: 0` options and deletes code.
- **Last-known-good**: the existing mechanism is "fail as a 5xx so Vercel ISR keeps the last good page" (#282/#287/#330). Re-used, nothing new built.

## Command
Repo root, `node -v` → `v24.19.0`. Each output went to a scratchpad file with the exit code appended:
`npm run lint > lint.txt 2>&1; echo lint=$? >> lint.txt`, `npx nuxi typecheck > tc.txt 2>&1; echo typecheck=$? >> tc.txt`, `npm test > test.txt 2>&1; echo test=$? >> test.txt`, `NODE_API=http://127.0.0.1:4199 NUXT_PUBLIC_NODE_API=http://127.0.0.1:4199 npm run build > build.txt 2>&1; echo build=$? >> build.txt`.

## Output

### npm run lint
```

> nuxt-app@1.8.0 lint
> eslint .

lint=0
```

### npx nuxi typecheck
```
ℹ Nuxt Icon server bundle mode is set to local
[nuxt:icon] ✔ Nuxt Icon discovered local-installed 3 collections: fe, grommet-icons, heroicons
typecheck=0
```

### npm test
```

> nuxt-app@1.8.0 test
> vitest run


 RUN  v5.0.5 /Users/_david/Workspace/Project/resume/datvt243.github.io


 Test Files  6 passed (6)
      Tests  14 passed (14)
   Start at  13:57:45
   Duration  153ms (import 41%, transform 33%, tests 18%, worker 8%)

test=0
```

### npm run build (complete, 147 lines)
```

> nuxt-app@1.8.0 build
> nuxt build

Building Nuxt for production...
● Loading Nuxt config
● Nuxt 4.6.2 (with Nitro 2.13.5, Vite 8.3.5 and Vue 3.5.44)
● Setting up modules
● Preparing app
ℹ Nuxt Icon server bundle mode is set to local
[nuxt:icon] ✔ Nuxt Icon discovered local-installed 3 collections: fe, grommet-icons, heroicons
● Nitro preset: node-server
● Generating types
● Bundling client
ℹ Building client...
ℹ vite v8.3.5 building client environment for production...
transforming...
✓ 1114 modules transformed.
rendering chunks...
computing gzip size...
ℹ node_modules/.cache/nuxt/.nuxt/dist/client/manifest.json               7.89 kB │ gzip:  1.25 kB
node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/pages.CZZ6OGgt.css    1.66 kB │ gzip:  0.56 kB
node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/entry.fcrjL9vE.css  233.76 kB │ gzip: 32.53 kB
node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/DHihWhf5.js           0.04 kB │ gzip:  0.06 kB
node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/CpsnCxmj.js           0.04 kB │ gzip:  0.06 kB
node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/BDNMzG2s.js           0.08 kB │ gzip:  0.09 kB
node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/CZTscLm9.js           0.15 kB │ gzip:  0.14 kB
node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/DK3Fl9T5.js           0.15 kB │ gzip:  0.15 kB
node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/CjPe33Z1.js           0.25 kB │ gzip:  0.21 kB
node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/7xK4Z6Fj.js           0.30 kB │ gzip:  0.24 kB
node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/DQ-HSaZo.js           0.51 kB │ gzip:  0.34 kB
node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/BUM2XRb8.js           0.56 kB │ gzip:  0.37 kB
node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/DcZj9btG.js           0.80 kB │ gzip:  0.45 kB
node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/BqPDhCUM.js           0.97 kB │ gzip:  0.42 kB
node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/C9--a8jy.js           1.14 kB │ gzip:  0.69 kB
node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/BpG0N5pM.js           1.49 kB │ gzip:  0.79 kB
node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/D0tFZPK6.js           2.06 kB │ gzip:  1.07 kB
node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/CHSI2SrY.js           3.71 kB │ gzip:  1.73 kB
node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/7OeY6IuC.js           4.78 kB │ gzip:  2.24 kB
node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/KrJ9hXPz.js           5.11 kB │ gzip:  1.85 kB
node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/DEiWNn2g.js           5.52 kB │ gzip:  1.88 kB
node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/D_4QX4Yd.js           5.80 kB │ gzip:  2.51 kB
node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/CCWsXQgS.js           5.83 kB │ gzip:  1.63 kB
node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/DOTShL7-.js           5.87 kB │ gzip:  2.16 kB
node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/CKXNzUwK.js           7.09 kB │ gzip:  2.86 kB
node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/VfQ0IEqc.js           7.27 kB │ gzip:  2.93 kB
node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/Cn9fnNQd.js           8.25 kB │ gzip:  3.46 kB
node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/BjFSk3_y.js          16.66 kB │ gzip:  5.34 kB
node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/CfdH1PJE.js          19.41 kB │ gzip:  6.69 kB
node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/DKywIxxL.js          26.12 kB │ gzip:  7.74 kB
node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/C7WCdRyv.js          35.84 kB │ gzip: 10.09 kB
node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/tuYs_3HB.js          51.42 kB │ gzip: 17.18 kB
node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/DZo3dYLJ.js          87.35 kB │ gzip: 33.98 kB
node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/CXRtl05j.js          87.58 kB │ gzip: 25.85 kB
node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/C6gKo29d.js         113.07 kB │ gzip: 41.73 kB
node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/CaaAZYj5.js         240.80 kB │ gzip: 81.61 kB

ℹ ✓ built in 1.89s
✔ Client built in 1907ms
● Bundling server
ℹ Building server...
ℹ vite v8.3.5 building ssr environment for production...
transforming...
✓ 948 modules transformed.
rendering chunks...
ℹ ✓ built in 1.69s
✔ Server built in 1696ms
● Building Nitro server
[nitro] ℹ Initializing prerenderer

 WARN  node_modules/.cache/nuxt/.nuxt/dist/server/_nuxt/components-BA7Pw5lr.js (369:0): A comment

"/* @__NO_SIDE_EFFECTS__ */"

in "node_modules/.cache/nuxt/.nuxt/dist/server/_nuxt/components-BA7Pw5lr.js" contains an annotation that Rollup cannot interpret due to the position of the comment. The comment will be removed to avoid issues.

[nitro] ℹ Prerendering 2 routes
[nitro]   ├─ /contact (86ms)
[nitro]   ├─ /en/contact (87ms)
[nitro]   ├─ /contact/_payload.json (2ms)
[nitro]   ├─ /en/contact/_payload.json (1ms)
[nitro]   ├─ /_i18n/8b5d03e6/en/messages.json (4ms)
[nitro]   ├─ /_i18n/8b5d03e6/vi/messages.json (4ms)
[nitro] ℹ Prerendered 6 routes in 2.107 seconds
[nitro] ✔ Generated public .output/public
[nitro] ℹ Building Nuxt Nitro server (preset: node-server, compatibility date: 2024-04-03)
node_modules/.cache/nuxt/.nuxt/dist/server/_nuxt/components-BA7Pw5lr.js (369:0): A comment

"/* @__NO_SIDE_EFFECTS__ */"

in "node_modules/.cache/nuxt/.nuxt/dist/server/_nuxt/components-BA7Pw5lr.js" contains an annotation that Rollup cannot interpret due to the position of the comment. The comment will be removed to avoid issues.
● Bundling Nitro server (5.02s · 10.3s)
[nitro] ✔ Nuxt Nitro server built
  ├─ .output/server/chunks/_/error-template.mjs (4.36 kB) (1.7 kB gzip)
  ├─ .output/server/chunks/_/icons.mjs (72.8 kB) (18.9 kB gzip)
  ├─ .output/server/chunks/_/icons2.mjs (235 kB) (78.4 kB gzip)
  ├─ .output/server/chunks/_/icons3.mjs (616 kB) (129 kB gzip)
  ├─ .output/server/chunks/build/_id_-BVSdiUd2.mjs (11.7 kB) (3.62 kB gzip)
  ├─ .output/server/chunks/build/_plugin-vue_export-helper-DjkACiAr.mjs (313 B) (220 B gzip)
  ├─ .output/server/chunks/build/Badge-D-MzBNeu.mjs (11.8 kB) (2.87 kB gzip)
  ├─ .output/server/chunks/build/blog-F-DwmBuF.mjs (7.94 kB) (2.27 kB gzip)
  ├─ .output/server/chunks/build/blogs-DKf8wcQU.mjs (214 kB) (32.4 kB gzip)
  ├─ .output/server/chunks/build/CodeBlock-styles.DUi7l5cr.mjs (361 B) (220 B gzip)
  ├─ .output/server/chunks/build/contact-BWNTWGen.mjs (21.1 kB) (3.78 kB gzip)
  ├─ .output/server/chunks/build/default-D0Dc3Acl.mjs (992 B) (518 B gzip)
  ├─ .output/server/chunks/build/error-DhXKUbjL.mjs (1 kB) (535 B gzip)
  ├─ .output/server/chunks/build/Experiences-styles.OFUslRej.mjs (371 B) (220 B gzip)
  ├─ .output/server/chunks/build/fetch-CB_ESp_Z.mjs (4.71 kB) (1.9 kB gzip)
  ├─ .output/server/chunks/build/FilterFolder-DnijkVJD.mjs (4.62 kB) (1.58 kB gzip)
  ├─ .output/server/chunks/build/Folder-DWrFyvCL.mjs (2.77 kB) (1.23 kB gzip)
  ├─ .output/server/chunks/build/formatDate-DT9d7As4.mjs (324 B) (230 B gzip)
  ├─ .output/server/chunks/build/github-BQXX61WG.mjs (37.4 kB) (8.35 kB gzip)
  ├─ .output/server/chunks/build/index-2-styles-1.mjs-4Vjuxd5d.mjs (462 B) (293 B gzip)
  ├─ .output/server/chunks/build/index-2-styles-2.mjs-De-VT-cK.mjs (1.92 kB) (709 B gzip)
  ├─ .output/server/chunks/build/index-styles.BPb5NAy9.mjs (572 B) (265 B gzip)
  ├─ .output/server/chunks/build/NavItem-DjxBRbIQ.mjs (1.61 kB) (757 B gzip)
  ├─ .output/server/chunks/build/nullish-Dvpx-avd.mjs (195 B) (169 B gzip)
  ├─ .output/server/chunks/build/pages-De7QeFjj.mjs (52 kB) (12 kB gzip)
  ├─ .output/server/chunks/build/Panel-Bl_yxRVz.mjs (2.35 kB) (1.05 kB gzip)
  ├─ .output/server/chunks/build/projects-BmUSlDpM.mjs (17.4 kB) (3.69 kB gzip)
  ├─ .output/server/chunks/build/Toast-CEufMAqw.mjs (60.9 kB) (11.1 kB gzip)
  ├─ .output/server/chunks/build/useResumeData-PySOWkgc.mjs (12.6 kB) (4.27 kB gzip)
  ├─ .output/server/chunks/nitro/nitro.mjs (274 kB) (72 kB gzip)
  ├─ .output/server/chunks/raw/875acaa9.mjs (3.65 kB) (1.66 kB gzip)
  ├─ .output/server/chunks/raw/8f74fa8a.mjs (4.35 kB) (2.07 kB gzip)
  ├─ .output/server/chunks/routes/api/blogs/categories.mjs (973 B) (477 B gzip)
  ├─ .output/server/chunks/routes/api/blogs/detail/_id_.mjs (1.61 kB) (743 B gzip)
  ├─ .output/server/chunks/routes/api/blogs/posts.mjs (871 B) (427 B gzip)
  ├─ .output/server/chunks/routes/api/generate-pdf.mjs (3.11 kB) (1.22 kB gzip)
  ├─ .output/server/chunks/routes/api/github.mjs (1.32 kB) (621 B gzip)
  ├─ .output/server/chunks/routes/api/resume.mjs (968 B) (479 B gzip)
  ├─ .output/server/chunks/routes/api/visit.post.mjs (1.03 kB) (536 B gzip)
  ├─ .output/server/chunks/routes/renderer.mjs (27.8 kB) (9.1 kB gzip)
  ├─ .output/server/chunks/routes/robots.txt.mjs (742 B) (382 B gzip)
  ├─ .output/server/chunks/routes/rss.xml.mjs (1.75 kB) (859 B gzip)
  ├─ .output/server/chunks/routes/sitemap.xml.mjs (1.43 kB) (723 B gzip)
  ├─ .output/server/chunks/virtual/entry.mjs (601 kB) (128 kB gzip)
  ├─ .output/server/chunks/virtual/precomputed.mjs (18 kB) (2.21 kB gzip)
  ├─ .output/server/chunks/virtual/styles.mjs (702 B) (324 B gzip)
  ├─ .output/server/index.mjs (557 B) (277 B gzip)
  └─ .output/server/package.json (3.15 kB) (1.12 kB gzip)
Σ Total size: 99.4 MB (81 MB gzip)
[@nuxt/image] ℹ sharp binaries have been included in your build for darwin-arm64. Make sure you deploy to the same architecture.
[nitro] ✔ You can preview this build using node .output/server/index.mjs
config 157ms · modules 399ms · app 375ms · types 333ms · client 2.37s · server 1.69s · nitro 8.36s
◆ ✨ Build complete in 13.7s!
build=0
```

Build line 71 (` WARN  node_modules/.cache/nuxt/.nuxt/dist/server/_nuxt/components-BA7Pw5lr.js (369:0): A comment`) is the whole line as printed. It predates this diff: the same line is at line 72 of `build.txt`/`build.log` in this session's scratchpad root from earlier builds on `d1f2004` (`grep -n "WARN" /private/tmp/claude-501/-Users--david-Workspace-Project-resume-datvt243-github-io/adee8ad7-fcb9-458e-8edd-9e7f3e63d2be/scratchpad/build.txt /private/tmp/claude-501/-Users--david-Workspace-Project-resume-datvt243-github-io/adee8ad7-fcb9-458e-8edd-9e7f3e63d2be/scratchpad/build.log`).

## Simulation (local only, no real upstream touched)
Scratchpad `r307/`. `mock429.py` stands in for all three upstreams on `127.0.0.1:4199`. It re-reads `./mode` on every request and logs every hit as `HIT <upstream> <mode> <auth|noauth> <path>`, where `auth` = the request had an `Authorization` header. A 429 carries `Retry-After: 120`. `403rl` = 403 + `x-ratelimit-remaining: 0`; `403bad` = 403 + `x-ratelimit-remaining: 4999` for authenticated calls only, 200 without a token. `redirect.mjs` is a `node --import` preload that rewrites `https://api.github.com/` and `https://blog-api-nodejs-express.onrender.com/` to the mock (Nitro's `$fetch` calls `globalThis.fetch` for absolute URLs). The resume upstream goes there through `NODE_API`/`NUXT_PUBLIC_NODE_API`. Proof nothing left the machine: every upstream call of every run is in the `HIT` lists below, all to the mock.

`scen.sh` starts a fresh mock + prod server (`.output`) per scenario so Nitro's in-memory cache starts empty. It waits until `POST /api/visit` answers, clears the hit log, then curls each path and prints the status line, `Retry-After` (if any), the API body's first 300 bytes or the page's `<title>`/`<h1>`/error-code span, then the hit log. `run()` also greps `srv.log` with `grep -E "H3Error|FetchError|TypeError|statusCode" | head -6`.

First attempt invalid, recorded for honesty: the first `scen.sh` killed the subshell, not `node`, so a server from the baseline run kept port 4188 and answered every later scenario from its cache (all 200). Found with `lsof -nP -iTCP:4188 -sTCP:LISTEN` → `node 27188`, killed it, and switched both launches to `exec` so `kill $SP` hits node. The script now prints `STALE SERVER LEFT` if port 4188 is still listening after a scenario. It never printed.

### mock429.py
```python
# Local stand-in for all three upstreams. Mode is re-read per request from ./mode (one word per upstream: resume=ok|429 gh=ok|429|403rl|403bad blog=ok|429).
import http.server,sys,json
vi=open(sys.argv[1],'rb').read(); en=open(sys.argv[2],'rb').read()
GH_USER=b'{"login":"datvt243","name":"Mock","avatar_url":"","public_repos":1,"followers":0,"following":0,"html_url":"https://github.com/datvt243","bio":"","location":"","created_at":"2020-01-01T00:00:00Z"}'
GH_REPOS=b'[{"id":1,"name":"mock-repo","full_name":"datvt243/mock-repo","html_url":"https://github.com/datvt243/mock-repo","description":"mock","language":"TypeScript","stargazers_count":0,"forks_count":0,"fork":false,"pushed_at":"2026-10-01T00:00:00Z","updated_at":"2026-10-01T00:00:00Z","topics":[]}]'
CATS=b'{"status":true,"data":[{"_id":"c1","name":"Vue","slug":"vue","description":""}]}'
BLOG=b'{"status":true,"data":{"data":[],"total":0,"page":1,"perPage":20}}'
def mode():
    return dict(kv.split('=') for kv in open('mode').read().split())
class H(http.server.BaseHTTPRequestHandler):
    def log_message(self,*a): pass
    def send(self,code,body=b'{}',hdr=()):
        self.send_response(code);self.send_header('Content-Type','application/json')
        for k,v in hdr: self.send_header(k,v)
        self.end_headers();self.wfile.write(body)
    def do_GET(self):
        m=mode(); auth='auth' if self.headers.get('Authorization') else 'noauth'
        if '/api/me/' in self.path: up='resume'
        elif self.path.startswith('/gh/'): up='gh'
        elif self.path.startswith('/blog/'): up='blog'
        else: up='other'
        md=m.get(up,'ok')
        print(f'HIT {up} {md} {auth} {self.path}',flush=True)
        if md=='429': return self.send(429,b'{"message":"Too Many Requests"}',[('Retry-After','120')])
        if md=='403rl': return self.send(403,b'{"message":"API rate limit exceeded"}',[('x-ratelimit-remaining','0'),('x-ratelimit-reset','9999999999')])
        if md=='403bad':
            if auth=='auth': return self.send(403,b'{"message":"Bad credentials"}',[('x-ratelimit-remaining','4999')])
        if up=='resume': return self.send(200,en if 'lang=en' in self.path else vi)
        if up=='gh': return self.send(200,GH_REPOS if '/repos' in self.path else GH_USER)
        if up=='blog': return self.send(200,CATS if '/categories' in self.path else BLOG)
        self.send(200,b'{"success":true}')
    def do_POST(self): self.send(200,b'{"success":true}')
http.server.ThreadingHTTPServer(('127.0.0.1',4199),H).serve_forever()
```

### redirect.mjs
```js
// Preload: send the two hardcoded upstream hosts to the local mock instead of the internet.
const real = globalThis.fetch
globalThis.fetch = (input, init) => {
  let url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url
  url = url.replace('https://api.github.com/', 'http://127.0.0.1:4199/gh/').replace('https://blog-api-nodejs-express.onrender.com/', 'http://127.0.0.1:4199/blog/')
  return real(typeof input === 'string' || input instanceof URL ? url : new Request(url, input), init)
}
```

### scen.sh
```bash
# usage: scen.sh "<mode line>" <path>...   fresh server per scenario, prints status + upstream hits
S=/private/tmp/claude-501/-Users--david-Workspace-Project-resume-datvt243-github-io/adee8ad7-fcb9-458e-8edd-9e7f3e63d2be/scratchpad/r307; REPO=/Users/_david/Workspace/Project/resume/datvt243.github.io
echo "$1" > $S/mode; shift
: > $S/mock.log
(cd $S && exec python3 -I mock429.py me2-vi.json me2-en.json >> mock.log 2>&1) & MP=$!
(cd $REPO && PORT=4188 NODE_API=http://127.0.0.1:4199 NUXT_PUBLIC_NODE_API=http://127.0.0.1:4199 NUXT_GITHUB_TOKEN=fake-token-307 exec node --import $S/redirect.mjs .output/server/index.mjs > $S/srv.log 2>&1) & SP=$!
for i in $(seq 1 50); do curl -s -o /dev/null http://127.0.0.1:4188/api/visit -X POST && break; sleep 0.2; done
: > $S/mock.log
for p in "$@"; do
  echo "--- GET $p"
  curl -s -D $S/h.txt -o $S/b.txt --max-time 30 "http://127.0.0.1:4188$p"
  head -1 $S/h.txt | tr -d '\r'; grep -i '^retry-after' $S/h.txt | tr -d '\r'
  case "$p" in
    /api*) head -c 300 $S/b.txt; echo ;;
    *) grep -oE '<title>[^<]*</title>|<h1[^>]*>[^<]*</h1>|<span>[0-9]{3}</span>' $S/b.txt | head -3 ;;
  esac
done
echo "--- upstream hits (mock.log):"; cat $S/mock.log
kill $SP $MP 2>/dev/null; wait 2>/dev/null; lsof -nP -iTCP:4188 -sTCP:LISTEN && echo "STALE SERVER LEFT"
```

The `/api/blogs/categories` 502 in the BEFORE baseline is my mock's fault: it then returned the posts body for categories (schema mismatch). Fixed in the mock (the `CATS` body) before the browser run. It does not affect the 429 rows.

### BEFORE the fix (code at `d1f2004`), complete output (`scenarios-before.txt`)
```
########## MODE: resume=ok gh=ok blog=ok
--- GET /api/resume
HTTP/1.1 200 OK
{"success":true,"resume":{"socialMedia":{"github":"https://github.com/datvt243","linkedin":"https://www.linkedin.com/in/datvt243/","website":"https://resume-nuxt-vert.vercel.app"},"email":"votan.it@gmail.com","address":"TP. Hồ Chí Minh","phone":"0385262510","introduction":"<p>Frontend Developer v
--- GET /api/github
HTTP/1.1 200 OK
{"data":{"user":{"login":"datvt243","name":"Mock","avatar_url":"","public_repos":1,"followers":0,"following":0,"html_url":"https://github.com/datvt243","bio":"","location":"","created_at":"2020-01-01T00:00:00Z"},"repos":[{"id":1,"name":"mock-repo","full_name":"datvt243/mock-repo","html_url":"https:/
--- GET /api/blogs/posts?page=1&perPage=20
HTTP/1.1 200 OK
{"status":true,"data":{"data":[],"total":0,"page":1,"perPage":20}}
--- GET /api/blogs/categories
HTTP/1.1 502 Blog API response shape mismatch (categories)
{
  "error": true,
  "url": "http://127.0.0.1:4188/api/blogs/categories",
  "statusCode": 502,
  "statusMessage": "Blog API response shape mismatch (categories)",
  "message": "Blog API response shape mismatch (categories)",
  "data": [
    {
      "code": "invalid_type",
      "expected": "array",

--- upstream hits (mock.log):
HIT resume ok noauth /api/me/votan.it@gmail.com?lang=vi
HIT gh ok auth /gh/users/datvt243/repos?sort=pushed&per_page=100
HIT gh ok auth /gh/users/datvt243
HIT blog ok noauth /blog/api/v1/post/?category&page=1&per_page=20
HIT blog ok noauth /blog/api/v1/categories
--- srv.log error lines (grep -E 'H3Error|FetchError|TypeError|statusCode'):
########## MODE: resume=429 gh=ok blog=ok
--- GET /api/resume
HTTP/1.1 502 Unable to load resume data
{
  "error": true,
  "url": "http://127.0.0.1:4188/api/resume",
  "statusCode": 502,
  "statusMessage": "Unable to load resume data",
  "message": "Unable to load resume data"
}
--- GET /
HTTP/1.1 502 Unable to load resume data
--- GET /en/projects
HTTP/1.1 502 Unable to load resume data
--- upstream hits (mock.log):
HIT resume 429 noauth /api/me/votan.it@gmail.com?lang=vi
HIT resume 429 noauth /api/me/votan.it@gmail.com?lang=vi
HIT resume 429 noauth /api/me/votan.it@gmail.com?lang=en
--- srv.log error lines (grep -E 'H3Error|FetchError|TypeError|statusCode'):
  error: H3Error: Unable to load resume data
      statusCode: 502,
    statusCode: 502,
 H3Error: Unable to load resume data
    statusCode: 502,
  statusCode: 502,
  error: H3Error: Unable to load resume data
      statusCode: 502,
########## MODE: resume=ok gh=429 blog=ok
--- GET /api/github
HTTP/1.1 429 Too Many Requests
{
  "error": true,
  "url": "http://127.0.0.1:4188/api/github",
  "statusCode": 429,
  "statusMessage": "Too Many Requests",
  "message": "Server Error"
}
--- GET /en/github
HTTP/1.1 502 Unable to load GitHub data
--- upstream hits (mock.log):
HIT gh 429 auth /gh/users/datvt243/repos?sort=pushed&per_page=100
HIT gh 429 auth /gh/users/datvt243
HIT gh 429 auth /gh/users/datvt243
HIT gh 429 auth /gh/users/datvt243/repos?sort=pushed&per_page=100
HIT gh 429 auth /gh/users/datvt243
HIT gh 429 auth /gh/users/datvt243/repos?sort=pushed&per_page=100
--- srv.log error lines (grep -E 'H3Error|FetchError|TypeError|statusCode'):
 FetchError: [GET] "https://api.github.com/users/datvt243/repos?sort=pushed&per_page=100": 429 Too Many Requests
  cause: FetchError: [GET] "https://api.github.com/users/datvt243/repos?sort=pushed&per_page=100": 429 Too Many Requests
  statusCode: 429,
 FetchError: [GET] "https://api.github.com/users/datvt243": 429 Too Many Requests
  cause: FetchError: [GET] "https://api.github.com/users/datvt243": 429 Too Many Requests
  statusCode: 429,
 FetchError: [GET] "https://api.github.com/users/datvt243/repos?sort=pushed&per_page=100": 429 Too Many Requests
  cause: FetchError: [GET] "https://api.github.com/users/datvt243/repos?sort=pushed&per_page=100": 429 Too Many Requests
########## MODE: resume=ok gh=403rl blog=ok
--- GET /api/github
HTTP/1.1 403 Forbidden
{
  "error": true,
  "url": "http://127.0.0.1:4188/api/github",
  "statusCode": 403,
  "statusMessage": "Forbidden",
  "message": "Server Error"
}
--- GET /en/github
HTTP/1.1 502 Unable to load GitHub data
--- upstream hits (mock.log):
HIT gh 403rl auth /gh/users/datvt243
HIT gh 403rl auth /gh/users/datvt243/repos?sort=pushed&per_page=100
HIT gh 403rl auth /gh/users/datvt243
HIT gh 403rl auth /gh/users/datvt243/repos?sort=pushed&per_page=100
--- srv.log error lines (grep -E 'H3Error|FetchError|TypeError|statusCode'):
 FetchError: [GET] "https://api.github.com/users/datvt243": 403 Forbidden
  cause: FetchError: [GET] "https://api.github.com/users/datvt243": 403 Forbidden
  statusCode: 403,
 FetchError: [GET] "https://api.github.com/users/datvt243": 403 Forbidden
  cause: FetchError: [GET] "https://api.github.com/users/datvt243": 403 Forbidden
  statusCode: 403,
  error: H3Error: Unable to load GitHub data
      statusCode: 502,
########## MODE: resume=ok gh=403bad blog=ok
--- GET /api/github
HTTP/1.1 200 OK
{"data":{"user":{"login":"datvt243","name":"Mock","avatar_url":"","public_repos":1,"followers":0,"following":0,"html_url":"https://github.com/datvt243","bio":"","location":"","created_at":"2020-01-01T00:00:00Z"},"repos":[{"id":1,"name":"mock-repo","full_name":"datvt243/mock-repo","html_url":"https:/
--- GET /en/github
HTTP/1.1 200 OK
<title>Github — Võ Tấn Đạt</title>
<h1 class="sr-only">Github</h1>
--- upstream hits (mock.log):
HIT gh 403bad auth /gh/users/datvt243/repos?sort=pushed&per_page=100
HIT gh 403bad auth /gh/users/datvt243
HIT gh 403bad noauth /gh/users/datvt243/repos?sort=pushed&per_page=100
HIT gh 403bad noauth /gh/users/datvt243
--- srv.log error lines (grep -E 'H3Error|FetchError|TypeError|statusCode'):
########## MODE: resume=ok gh=ok blog=429
--- GET /api/blogs/posts?page=1&perPage=20
HTTP/1.1 503 Unable to load posts
{
  "error": true,
  "url": "http://127.0.0.1:4188/api/blogs/posts?page=1&perPage=20",
  "statusCode": 503,
  "statusMessage": "Unable to load posts",
  "message": "Unable to load posts"
}
--- GET /api/blogs/categories
HTTP/1.1 429 Too Many Requests
{
  "error": true,
  "url": "http://127.0.0.1:4188/api/blogs/categories",
  "statusCode": 429,
  "statusMessage": "Too Many Requests",
  "message": "Server Error"
}
--- GET /blogs
HTTP/1.1 503 Unable to load posts
--- upstream hits (mock.log):
HIT blog 429 noauth /blog/api/v1/post/?category&page=1&per_page=20
HIT blog 429 noauth /blog/api/v1/categories
HIT blog 429 noauth /blog/api/v1/categories
HIT blog 429 noauth /blog/api/v1/categories
HIT blog 429 noauth /blog/api/v1/post/?category&page=1&per_page=20
HIT blog 429 noauth /blog/api/v1/categories
HIT blog 429 noauth /blog/api/v1/post/?category&page=1&per_page=20
HIT blog 429 noauth /blog/api/v1/categories
HIT blog 429 noauth /blog/api/v1/categories
HIT blog 429 noauth /blog/api/v1/categories
HIT blog 429 noauth /blog/api/v1/categories
HIT blog 429 noauth /blog/api/v1/categories
HIT blog 429 noauth /blog/api/v1/categories
HIT blog 429 noauth /blog/api/v1/categories
HIT blog 429 noauth /blog/api/v1/categories
HIT blog 429 noauth /blog/api/v1/categories
HIT blog 429 noauth /blog/api/v1/categories
--- srv.log error lines (grep -E 'H3Error|FetchError|TypeError|statusCode'):
 FetchError: [GET] "https://blog-api-nodejs-express.onrender.com/api/v1/categories": 429 Too Many Requests
  cause: FetchError: [GET] "https://blog-api-nodejs-express.onrender.com/api/v1/categories": 429 Too Many Requests
  statusCode: 429,
 FetchError: [GET] "https://blog-api-nodejs-express.onrender.com/api/v1/categories": 429 Too Many Requests
  cause: FetchError: [GET] "https://blog-api-nodejs-express.onrender.com/api/v1/categories": 429 Too Many Requests
  statusCode: 429,
  error: H3Error: Unable to load posts
      statusCode: 503,
```

Note on BEFORE: several paths per scenario run in one server, so hits add up across paths. Counts come from `awk '/MODE: <mode>/,<next MODE or end>' scenarios-before.txt | grep -c "<HIT prefix>"`:
- `gh=429` scenario: `grep -c "HIT gh"` → `6`. `GET /api/github` alone = 2 (user + repos, `fetchGithub` already `retry: 0`), so the one `/en/github` render = 4: the page `useFetch` retried the 429 from `/api/github` once.
- `blog=429` scenario: categories `grep -c "HIT blog 429 noauth /blog/api/v1/categories"` → `14`, posts `grep -c "HIT blog 429 noauth /blog/api/v1/post/"` → `3`. `GET /api/blogs/categories` alone = 2 (handler ofetch retry), so the one `/blogs` render = 12 categories calls = 3 (`fetchWithRetry`) × 2 (ofetch retry of the internal `$fetch`) × 2 (handler ofetch retry). Posts: API alone = 1, `/blogs` render = 2 (page `useFetch` retried the 503).

### AFTER the fix, complete output (`scenarios-after.txt`), one page per server where the count matters
```
########## MODE: resume=ok gh=ok blog=ok
--- GET /en/github
HTTP/1.1 200 OK
<title>Github — Võ Tấn Đạt</title>
<h1 class="sr-only">Github</h1>
--- GET /blogs
HTTP/1.1 200 OK
<title>Blog — Võ Tấn Đạt</title>
<h1 class="text-3xl leading-normal sm:text-4xl sm:leading-10 md:text-5xl md:leading-none text-theme-text uppercase tracking-wider font-extrabold">_blog</h1>
--- upstream hits (mock.log):
HIT gh ok auth /gh/users/datvt243
HIT gh ok auth /gh/users/datvt243/repos?sort=pushed&per_page=100
HIT blog ok noauth /blog/api/v1/post/?category&page=1&per_page=20
HIT blog ok noauth /blog/api/v1/categories
--- srv.log error lines (grep -E 'H3Error|FetchError|TypeError|statusCode'):
########## MODE: resume=429 gh=ok blog=ok
--- GET /api/resume
HTTP/1.1 502 Unable to load resume data
{
  "error": true,
  "url": "http://127.0.0.1:4188/api/resume",
  "statusCode": 502,
  "statusMessage": "Unable to load resume data",
  "message": "Unable to load resume data"
}
--- upstream hits (mock.log):
HIT resume 429 noauth /api/me/votan.it@gmail.com?lang=vi
--- srv.log error lines (grep -E 'H3Error|FetchError|TypeError|statusCode'):
########## MODE: resume=429 gh=ok blog=ok
--- GET /
HTTP/1.1 502 Unable to load resume data
--- upstream hits (mock.log):
HIT resume 429 noauth /api/me/votan.it@gmail.com?lang=vi
--- srv.log error lines (grep -E 'H3Error|FetchError|TypeError|statusCode'):
  error: H3Error: Unable to load resume data
      statusCode: 502,
    statusCode: 502,
 H3Error: Unable to load resume data
    statusCode: 502,
  statusCode: 502,
########## MODE: resume=ok gh=429 blog=ok
--- GET /api/github
HTTP/1.1 429 Too Many Requests
{
  "error": true,
  "url": "http://127.0.0.1:4188/api/github",
  "statusCode": 429,
  "statusMessage": "Too Many Requests",
  "message": "Server Error"
}
--- upstream hits (mock.log):
HIT gh 429 auth /gh/users/datvt243
HIT gh 429 auth /gh/users/datvt243/repos?sort=pushed&per_page=100
--- srv.log error lines (grep -E 'H3Error|FetchError|TypeError|statusCode'):
 FetchError: [GET] "https://api.github.com/users/datvt243": 429 Too Many Requests
  cause: FetchError: [GET] "https://api.github.com/users/datvt243": 429 Too Many Requests
  statusCode: 429,
########## MODE: resume=ok gh=429 blog=ok
--- GET /en/github
HTTP/1.1 502 Unable to load GitHub data
--- upstream hits (mock.log):
HIT gh 429 auth /gh/users/datvt243
HIT gh 429 auth /gh/users/datvt243/repos?sort=pushed&per_page=100
--- srv.log error lines (grep -E 'H3Error|FetchError|TypeError|statusCode'):
 FetchError: [GET] "https://api.github.com/users/datvt243": 429 Too Many Requests
  cause: FetchError: [GET] "https://api.github.com/users/datvt243": 429 Too Many Requests
  statusCode: 429,
  error: H3Error: Unable to load GitHub data
      statusCode: 502,
    statusCode: 502,
########## MODE: resume=ok gh=403rl blog=ok
--- GET /en/github
HTTP/1.1 502 Unable to load GitHub data
--- upstream hits (mock.log):
HIT gh 403rl auth /gh/users/datvt243
HIT gh 403rl auth /gh/users/datvt243/repos?sort=pushed&per_page=100
--- srv.log error lines (grep -E 'H3Error|FetchError|TypeError|statusCode'):
 FetchError: [GET] "https://api.github.com/users/datvt243": 403 Forbidden
  cause: FetchError: [GET] "https://api.github.com/users/datvt243": 403 Forbidden
  statusCode: 403,
  error: H3Error: Unable to load GitHub data
      statusCode: 502,
    statusCode: 502,
########## MODE: resume=ok gh=403bad blog=ok
--- GET /en/github
HTTP/1.1 200 OK
<title>Github — Võ Tấn Đạt</title>
<h1 class="sr-only">Github</h1>
--- upstream hits (mock.log):
HIT gh 403bad auth /gh/users/datvt243/repos?sort=pushed&per_page=100
HIT gh 403bad auth /gh/users/datvt243
HIT gh 403bad noauth /gh/users/datvt243
HIT gh 403bad noauth /gh/users/datvt243/repos?sort=pushed&per_page=100
--- srv.log error lines (grep -E 'H3Error|FetchError|TypeError|statusCode'):
########## MODE: resume=ok gh=ok blog=429
--- GET /api/blogs/posts?page=1&perPage=20
HTTP/1.1 503 Unable to load posts
{
  "error": true,
  "url": "http://127.0.0.1:4188/api/blogs/posts?page=1&perPage=20",
  "statusCode": 503,
  "statusMessage": "Unable to load posts",
  "message": "Unable to load posts"
}
--- upstream hits (mock.log):
HIT blog 429 noauth /blog/api/v1/post/?category&page=1&per_page=20
--- srv.log error lines (grep -E 'H3Error|FetchError|TypeError|statusCode'):
########## MODE: resume=ok gh=ok blog=429
--- GET /api/blogs/categories
HTTP/1.1 429 Too Many Requests
{
  "error": true,
  "url": "http://127.0.0.1:4188/api/blogs/categories",
  "statusCode": 429,
  "statusMessage": "Too Many Requests",
  "message": "Server Error"
}
--- upstream hits (mock.log):
HIT blog 429 noauth /blog/api/v1/categories
--- srv.log error lines (grep -E 'H3Error|FetchError|TypeError|statusCode'):
 FetchError: [GET] "https://blog-api-nodejs-express.onrender.com/api/v1/categories": 429 Too Many Requests
  cause: FetchError: [GET] "https://blog-api-nodejs-express.onrender.com/api/v1/categories": 429 Too Many Requests
  statusCode: 429,
########## MODE: resume=ok gh=ok blog=429
--- GET /blogs
HTTP/1.1 503 Unable to load posts
--- upstream hits (mock.log):
HIT blog 429 noauth /blog/api/v1/categories
HIT blog 429 noauth /blog/api/v1/post/?category&page=1&per_page=20
--- srv.log error lines (grep -E 'H3Error|FetchError|TypeError|statusCode'):
 FetchError: [GET] "https://blog-api-nodejs-express.onrender.com/api/v1/categories": 429 Too Many Requests
  cause: FetchError: [GET] "https://blog-api-nodejs-express.onrender.com/api/v1/categories": 429 Too Many Requests
  statusCode: 429,
  error: H3Error: Unable to load posts
      statusCode: 503,
    statusCode: 503,
########## MODE: resume=ok gh=ok blog=429
--- GET /blogs/507f1f77bcf86cd799439011
HTTP/1.1 429 Unable to load post
--- upstream hits (mock.log):
HIT blog 429 noauth /blog/api/v1/post/detail/507f1f77bcf86cd799439011
--- srv.log error lines (grep -E 'H3Error|FetchError|TypeError|statusCode'):
 FetchError: [GET] "https://blog-api-nodejs-express.onrender.com/api/v1/post/detail/507f1f77bcf86cd799439011": 429 Too Many Requests
  cause: FetchError: [GET] "https://blog-api-nodejs-express.onrender.com/api/v1/post/detail/507f1f77bcf86cd799439011": 429 Too Many Requests
  statusCode: 429,
  error: H3Error: Unable to load post
      statusCode: 429,
    statusCode: 429,
```

Per failed render AFTER: `/` → 1 resume hit; `/en/github` 429 → 2 hits (user + repos, once each); `/en/github` 403rl → 2 hits, both `auth`, no `noauth` fallback; 403bad → 2 `auth` + 2 `noauth` and a 200 page (fallback kept); `/blogs` → 1 categories + 1 posts; `/blogs/<id>` → 1 detail hit.

## Browser verification
Headless Chrome via `puppeteer-core` `launch` (fresh `prof/` profile, deleted first; no extensions), viewport 1440×900, `bringToFront()`, `document.visibilityState` printed. One long-lived prod server + mock. Mode is flipped between steps (the mock reads it per request). Script `ui.mjs`:
```js
import { writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
const puppeteer = createRequire('/Users/_david/Workspace/Project/resume/datvt243.github.io/package.json')('puppeteer-core')
const S = process.argv[2], B = 'http://127.0.0.1:4188'
const mode = (m) => writeFileSync(`${S}/mode`, m)
const browser = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true, userDataDir: `${S}/prof` })
const page = await browser.newPage(); await page.setViewport({ width: 1440, height: 900 }); await page.bringToFront()
const errs = []; page.on('pageerror', (e) => errs.push(String(e)))
const show = async (label) => console.log(label, JSON.stringify(await page.evaluate(() => ({ vis: document.visibilityState, url: location.pathname, code: document.querySelector('.status-code span')?.textContent ?? null, h1: document.querySelector('h1')?.textContent?.trim() ?? null, retryBtn: [...document.querySelectorAll('button')].some((b) => /try again|thử lại/i.test(b.textContent)), catErr: document.body.innerText.match(/Couldn't load categories\.|Không tải được danh sách chuyên mục\./)?.[0] ?? null, catLinks: document.querySelectorAll('a[href*="/blogs?category="]').length }))))
mode('resume=ok gh=429 blog=ok'); let r = await page.goto(`${B}/en/github`); console.log('status', r.status()); await show('A gh=429 /en/github')
mode('resume=ok gh=ok blog=429'); r = await page.goto(`${B}/blogs`); console.log('status', r.status()); await show('B blog=429 /blogs')
await page.screenshot({ path: `${S}/blogs-429.png` })
// categories fail, posts OK: SSR page must still render with the sidebar's own error text
mode('resume=ok gh=ok blog=ok'); await fetch(`${B}/api/blogs/posts?page=1&perPage=20`)
writeFileSync(`${S}/mode`, 'resume=ok gh=ok blog=429')
r = await page.goto(`${B}/blogs`); console.log('status', r.status()); await show('C posts cached, categories=429 /blogs')
await page.screenshot({ path: `${S}/blogs-cat-429.png` })
mode('resume=ok gh=ok blog=ok'); r = await page.goto(`${B}/blogs`); console.log('status', r.status()); await show('D all ok /blogs')
console.log('pageerrors', JSON.stringify(errs))
await browser.close()
```

How each printed flag is computed (from `show()` above, verbatim):
- `code`: `document.querySelector('.status-code span')?.textContent ?? null` (the number `error.vue` renders)
- `h1`: `document.querySelector('h1')?.textContent?.trim() ?? null`
- `retryBtn`: `[...document.querySelectorAll('button')].some((b) => /try again|thử lại/i.test(b.textContent))` (`error.retry` in `i18n/locales/{en,vi}.json:99`)
- `catErr`: `document.body.innerText.match(/Couldn't load categories\.|Không tải được danh sách chuyên mục\./)?.[0] ?? null` (`blogs.categoriesLoadError`, `:66`)
- `catLinks`: `document.querySelectorAll('a[href*="/blogs?category="]').length`

Step C warms `/api/blogs/posts` with mode ok first (Nitro caches it), then switches to `blog=429`, so only categories fail.

Output (`node ui.mjs $S > ui.txt 2>&1; echo exit=$? >> ui.txt`), complete, then the mock hit log of that run:
```
status 502
A gh=429 /en/github {"vis":"visible","url":"/en/github","code":"502","h1":"Something went wrong on our side","retryBtn":true,"catErr":null,"catLinks":0}
status 503
B blog=429 /blogs {"vis":"visible","url":"/blogs","code":"503","h1":"Đã có lỗi phía máy chủ","retryBtn":true,"catErr":null,"catLinks":0}
status 200
C posts cached, categories=429 /blogs {"vis":"visible","url":"/blogs","code":null,"h1":"_blog","retryBtn":false,"catErr":"Không tải được danh sách chuyên mục.","catLinks":0}
status 200
D all ok /blogs {"vis":"visible","url":"/blogs","code":null,"h1":"_blog","retryBtn":false,"catErr":null,"catLinks":1}
pageerrors []
exit=0
```

```
HIT gh 429 auth /gh/users/datvt243
HIT gh 429 auth /gh/users/datvt243/repos?sort=pushed&per_page=100
HIT blog 429 noauth /blog/api/v1/categories
HIT blog 429 noauth /blog/api/v1/post/?category&page=1&per_page=20
HIT blog ok noauth /blog/api/v1/post/?category&page=1&per_page=20
HIT blog 429 noauth /blog/api/v1/categories
HIT blog 429 noauth /blog/api/v1/categories
HIT resume ok noauth /api/me/votan.it@gmail.com?lang=vi
HIT blog ok noauth /blog/api/v1/categories
HIT gh ok auth /gh/users/datvt243
HIT gh ok auth /gh/users/datvt243/repos?sort=pushed&per_page=100
```

Reading: A `/en/github` on 429 → HTTP 502, error page "Something went wrong on our side" with Try again. B `/blogs` on 429 → 503 error page with Thử lại. C categories limited, posts fine → page 200, `_blog` list renders, sidebar shows "Không tải được danh sách chuyên mục." instead of a crash or a silent empty list. D all ok → 1 category link. `pageerrors []` = no uncaught page errors. In C, categories was hit twice: once in SSR, once by the client because `useAsyncData` re-runs after a server error on hydration. That is one call per side, not a retry. Screenshots: scratchpad `r307/blogs-429.png`, `r307/blogs-cat-429.png`.

## Acceptance
| Criterion | Evidence |
|---|---|
| 1 call per upstream URL per failed SSR render on 429 | AFTER: `GET /` → `HIT resume 429 noauth /api/me/votan.it@gmail.com?lang=vi` (1 line); `/en/github` → 2 lines (user, repos); `/blogs` → `HIT blog 429 noauth /blog/api/v1/categories` + `HIT blog 429 noauth /blog/api/v1/post/?category&page=1&per_page=20`; `/blogs/507f1f77bcf86cd799439011` → 1 line. BEFORE: one `/blogs` render made 12 categories calls + 2 posts calls (see the BEFORE note) |
| 403 rate-limit: no unauthenticated fallback | AFTER `gh=403rl` `/en/github`: `HIT gh 403rl auth /gh/users/datvt243`, `HIT gh 403rl auth /gh/users/datvt243/repos?sort=pushed&per_page=100`, no `noauth` line; page `HTTP/1.1 502 Unable to load GitHub data` |
| 403 bad token still falls back | AFTER `gh=403bad`: 2 `auth` + 2 `noauth` hits, `HTTP/1.1 200 OK`, `<title>Github — Võ Tấn Đạt</title>` |
| Clear error state, not "No data"/crash | `ui.txt` A `"code":"502","h1":"Something went wrong on our side","retryBtn":true`; B `"code":"503","h1":"Đã có lỗi phía máy chủ","retryBtn":true`; C `"catErr":"Không tải được danh sách chuyên mục."`; `pageerrors []` |
| build clean | `◆ ✨ Build complete in 13.7s!`, `build=0` (one pre-existing WARN, see above) |
| lint clean | `lint=0`, no findings printed |
| typecheck clean | `typecheck=0`, no errors printed |
| `npm test` | `Test Files  6 passed (6)`, `Tests  14 passed (14)`, `test=0`. Covers only pure functions, not this behaviour; the simulation and browser run above are the real proof |
| comments per code-comments.md | 2 added, both `//` one-sentence WHY, no issue refs: `categories.ts` "No retry: a retried 429 is one more call against the upstream's limit." and `PostCategories.vue` "No retry: each retry of a failed call is another call to the rate-limited upstream." (wording follows `stores/resume.ts:16`). Other `retry: 0` lines sit under existing comments or are self-evident |

## Supersedes
none. The only other #307 row, `github-no-retry-5xx`, is already SEALED and archived.

## Still open
- `GITHUB_TOKEN` validity on Vercel: can't be checked from here (issue checkbox 4). If it is invalid, every GitHub call takes the unauthenticated path on the shared IP quota.
- `Retry-After` is not forwarded to clients (see Decisions).
- PDF rate limit: not done (see Decisions).

## Noticed, not done
- `/blogs/[id]` on an upstream 429 renders the error page with HTTP **429** (`pages/blogs/[id].vue:29` passes any non-404 status through), unlike `/github` (always 502) and `/blogs` (503). Whether Vercel ISR keeps the last good page for a 4xx the way it does for a 5xx is unverified. A one-line follow-up could map non-404 to 502.
- `/api/github` and `/api/blogs/categories` return the upstream's 429/403 status as their own status (`"message": "Server Error"`). Harmless because the pages map them, but not the controlled 502/503 the other handlers use.
- Categories has no `timeout` (posts has `timeout: 6000` for Render cold starts). Out of scope for 429.

## Seal gate
none. No commit, push, or PR in this pass. `utils/fetchWithRetry.ts` is staged as deleted (`git rm`), nothing committed.

## PR wording
`Closes #307`: every table row and checkbox is handled except the live `GITHUB_TOKEN` check, which only the operator can do (Still open). If the operator wants the issue to track that check, use `Refs #307` instead.
