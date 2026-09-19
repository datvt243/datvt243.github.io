# 2026-09-20 — blog-post-seo-metadata (implementer diff)

## Diff

```diff
--- a/pages/blogs/[id].vue
+++ b/pages/blogs/[id].vue
@@ -21,6 +21,13 @@
 const postDetail = computed<Post>(() => {
   return data.value?.data as Post
 })
+
+useSeoMeta({
+  title: () => postDetail.value?.title,
+  ogTitle: () => postDetail.value?.title,
+  description: () => postDetail.value?.excerpt,
+  ogDescription: () => postDetail.value?.excerpt,
+})
 </script>
```

Getter-form values (`() => postDetail.value?.title`) rather than plain
values: `useSeoMeta` accepts reactive getters, and `?.` means an
undefined/not-yet-loaded post simply omits the tag instead of throwing or
rendering a literal `"undefined"` string.

## Verification

- `npm run build`: clean (`✨ Build complete!`, same pre-existing
  darwin-arm64 `sharp` warning, not new).
- `npm run lint` (Node 24, per the `Object.groupBy` trap in
  `doctrine/domains/PROJECT.md`): `✖ 30 problems (0 errors, 30 warnings)` —
  exact baseline match, no new warnings.
- Real dev server (`PORT=4011 npm run dev`) against a real, warm post id
  (`67123bdf9c6e9bcf4f7bf006` — the upstream blog API was mid-cold-start at
  first; confirmed warm via a direct 22s `curl` against
  `blog-api-nodejs-express.onrender.com` before re-testing):
  - `curl http://localhost:4011/blogs/67123bdf9c6e9bcf4f7bf006` raw HTML
    contains `<title>Cài đặt iTerm2, Oh My Zsh, ...</title>`,
    `<meta property="og:title" content="Cài đặt iTerm2, ...">`,
    `<meta name="description" content="iTerm2 là một ứng dụng ...">`, and
    matching `og:description` — all pulled from the real post's own
    `title`/`excerpt`, not a global fallback.
  - Chrome CDP (`puppeteer-core` via the existing `/browser` debugger on
    port 9888): real navigation to the same URL, `page.title()` and the
    `description`/`og:title` meta both match the real post content, `0`
    console errors.
