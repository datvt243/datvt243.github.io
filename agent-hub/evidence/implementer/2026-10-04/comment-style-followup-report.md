# Comment style follow-up report — issue #210 (node `comment-style-followup`)

Generated from `comment-style-followup-ledger.json`. Pre-change line numbers.

## Totals (this pass)

| Metric | Count |
|---|---|
| Multi-line `//` → `/** */` | **15** |
| `// Author: …` header → `/** @author … */` | **49** |
| `/** Author/Description */` header → `/** @file … @author … */` | **9** |
| Comments deleted | 0 |
| Files modified | 60 |

## Combined totals for issue #210 (net, original `staging` → now)

| Metric | Count |
|---|---|
| Comments deleted | **30** |
| `//` → `/** */` | **44** (29 first pass + 15 multi-line this pass) |
| `/** */` → `//` | **0** (pass 1 turned 49 Author headers into `//`; this pass turned all 49 back into `/** */`, now in `@author` form, so the net change is a reformat, not a style conversion) |
| Author headers reformatted to JSDoc `@author` (+ `@file` for 9) | 58 |

## Multi-line `//` → `/** */`

### `nuxt.config.ts:51`
Before:
```ts
// Silences the "legacy-js-api" deprecation warning Dart Sass
// prints on every dev/build - opts into sass-embedded's newer API.
```
After:
```ts
/**
           * Silences the "legacy-js-api" deprecation warning Dart Sass
           * prints on every dev/build - opts into sass-embedded's newer API.
           */
```

### `nuxt.config.ts:108`
Before:
```ts
// Same production origin as server/utils/siteUrl.ts's SITE_URL (shared
// constant, not a separate hardcoded copy) - required by useLocaleHead()
// (used in app.vue to set <html lang> per active locale) to generate
// valid hreflang/canonical link values instead of a build warning.
```
After:
```ts
/**
     * Same production origin as server/utils/siteUrl.ts's SITE_URL (shared
     * constant, not a separate hardcoded copy) - required by useLocaleHead()
     * (used in app.vue to set <html lang> per active locale) to generate
     * valid hreflang/canonical link values instead of a build warning.
     */
```

### `pages/index.vue:22`
Before:
```ts
// No dedicated social-share banner exists yet - reusing the real profile
// photo (already used as the hero avatar) so shares at least render a real
// image instead of none, per the `no-og-image` finding (issue #179).
```
After:
```ts
/**
 * No dedicated social-share banner exists yet - reusing the real profile
 * photo (already used as the hero avatar) so shares at least render a real
 * image instead of none, per the `no-og-image` finding (issue #179).
 */
```

### `server/api/blogs/posts.ts:13`
Before:
```ts
// Blog API unreachable/cold-starting - degrade to an empty page instead
// of a 500/504 (see cacheGetPost.ts's timeout comment).
```
After:
```ts
/**
     * Blog API unreachable/cold-starting - degrade to an empty page instead
     * of a 500/504 (see cacheGetPost.ts's timeout comment).
     */
```

### `server/api/generate-pdf.ts:74`
Before:
```ts
// The API returns this as an object or an array of one - the old
// array-only check turned the real object shape into {}, silently
// dropping skills/languages from the PDF.
```
After:
```ts
/**
     * The API returns this as an object or an array of one - the old
     * array-only check turned the real object shape into {}, silently
     * dropping skills/languages from the PDF.
     */
```

### `server/routes/rss.xml.ts:21`
Before:
```ts
// Degrade to an empty feed instead of a 504 if the blog API is cold (see
// cacheGetPost.ts's timeout comment) - an empty RSS response is a far
// better reader experience than a hard server error.
```
After:
```ts
/**
   * Degrade to an empty feed instead of a 504 if the blog API is cold (see
   * cacheGetPost.ts's timeout comment) - an empty RSS response is a far
   * better reader experience than a hard server error.
   */
```

### `server/routes/sitemap.xml.ts:14`
Before:
```ts
// Degrade to static-routes-only instead of a 504 if the blog API is cold
// (see cacheGetPost.ts's timeout comment) - a sitemap missing post URLs
// for one crawl is far better than the crawler getting no sitemap at all.
```
After:
```ts
/**
   * Degrade to static-routes-only instead of a 504 if the blog API is cold
   * (see cacheGetPost.ts's timeout comment) - a sitemap missing post URLs
   * for one crawl is far better than the crawler getting no sitemap at all.
   */
```

### `themes/portfolio-dev/pages/blogs/Index.vue:20`
Before:
```ts
// Show whatever we fetched last time for these params instantly (no
// blank/loading flash), then silently refetch below and overwrite it -
// Nuxt's own default getCachedData only reads from the SSR/static payload,
// which isn't populated for plain client-side re-navigation.
```
After:
```ts
/**
   * Show whatever we fetched last time for these params instantly (no
   * blank/loading flash), then silently refetch below and overwrite it -
   * Nuxt's own default getCachedData only reads from the SSR/static payload,
   * which isn't populated for plain client-side re-navigation.
   */
```

### `themes/portfolio-dev/pages/blogs/Index.vue:43`
Before:
```ts
// Keep showing the (possibly stale) list during the background refresh
// instead of flashing back to the ListRender loading state.
```
After:
```ts
/**
 * Keep showing the (possibly stale) list during the background refresh
 * instead of flashing back to the ListRender loading state.
 */
```

### `themes/portfolio-dev/pages/github/GitUser.vue:11`
Before:
```ts
// Plain-text interpolation (unlike the v-html it replaces) doesn't go
// through the browser's HTML parser, which otherwise silently normalizes
// "\r\n" to "\n" - without this, a bio containing CRLF line endings
// hydration-mismatches (SSR HTML gets browser-normalized to "\n" before
// Vue compares it against the client's freshly computed "\r\n" string).
```
After:
```ts
/**
 * Plain-text interpolation (unlike the v-html it replaces) doesn't go
 * through the browser's HTML parser, which otherwise silently normalizes
 * "\r\n" to "\n" - without this, a bio containing CRLF line endings
 * hydration-mismatches (SSR HTML gets browser-normalized to "\n" before
 * Vue compares it against the client's freshly computed "\r\n" string).
 */
```

### `themes/portfolio-dev/pages/post/Comments.vue:8`
Before:
```ts
// Repo name is a fixed, deterministic constant for this site (same
// convention as SITE_URL in server/routes/{rss,sitemap}.xml.ts) - only
// the opaque IDs below need real values from https://giscus.app's config
// generator, which requires GitHub Discussions enabled + the Giscus
// GitHub App installed on the repo first (a manual, one-time operator
// step - see root CLAUDE.md).
```
After:
```ts
/**
 * Repo name is a fixed, deterministic constant for this site (same
 * convention as SITE_URL in server/routes/{rss,sitemap}.xml.ts) - only
 * the opaque IDs below need real values from https://giscus.app's config
 * generator, which requires GitHub Discussions enabled + the Giscus
 * GitHub App installed on the repo first (a manual, one-time operator
 * step - see root CLAUDE.md).
 */
```

### `themes/portfolio-dev/pages/post/Comments.vue:72`
Before:
```ts
// containerRef sits inside <ClientOnly>, which doesn't render its real
// slot content until one tick after this component's own onMounted -
// without this, containerRef.value is still null here and loadGiscus()
// silently no-ops (isConfigured guard passes, container guard doesn't).
```
After:
```ts
/**
   * containerRef sits inside <ClientOnly>, which doesn't render its real
   * slot content until one tick after this component's own onMounted -
   * without this, containerRef.value is still null here and loadGiscus()
   * silently no-ops (isConfigured guard passes, container guard doesn't).
   */
```

### `themes/portfolio-dev/pages/resumeObject/AboutMe.vue:54`
Before:
```ts
// Drop every tag except <strong>/<b>, then split on those tags - the split naturally alternates [plain,
// bold, plain, bold, ...] since each strong/b pair produces one boundary pair, so no marker characters are
// needed.
```
After:
```ts
/**
   * Drop every tag except <strong>/<b>, then split on those tags - the split naturally alternates [plain,
   * bold, plain, bold, ...] since each strong/b pair produces one boundary pair, so no marker characters are
   * needed.
   */
```

### `themes/portfolio-dev/pages/resumeObject/AboutMe.vue:81`
Before:
```ts
// API wraps introduction in <p>...</p> (sometimes multiple paragraphs); strip those
// block wrappers first so the depth-based sentence splitter below isn't gated off
// for the whole string by one never-closing tag.
```
After:
```ts
/**
   * API wraps introduction in <p>...</p> (sometimes multiple paragraphs); strip those
   * block wrappers first so the depth-based sentence splitter below isn't gated off
   * for the whole string by one never-closing tag.
   */
```

### `themes/portfolio-dev/pages/resumeObject/Skills.vue:8`
Before:
```ts
// Only maps to logos actually present under public/svg/ — skill names come
// from the API as free text, so unmatched skills just render without an icon
// rather than guessing/faking one.
```
After:
```ts
/**
 * Only maps to logos actually present under public/svg/ — skill names come
 * from the API as free text, so unmatched skills just render without an icon
 * rather than guessing/faking one.
 */
```

## Author headers (no description) → JSDoc

All 49 identical:

Before:
```ts
// Author: Đạt Võ - https://github.com/datvt243
```
After:
```ts
/**
 * @author Đạt Võ <votan.it@gmail.com> (https://github.com/datvt243)
 */
```

Files: `components/ListRender.vue`, `composables/debounceRef.ts`, `layouts/blog.vue`, `pages/blogs/[id].vue`, `pages/blogs/index.vue`, `pages/contact.vue`, `pages/github.vue`, `pages/index.vue`, `pages/projects.vue`, `plugins/ErrorHandler.ts`, `server/api/blogs/categories.ts`, `server/api/blogs/detail/[id].ts`, `server/api/blogs/posts.ts`, `server/api/github.ts`, `server/api/resume.ts`, `server/plugins/RenderHTML.ts`, `server/utils/cacheGetPost.ts`, `stores/resume.ts`, `themes/portfolio-dev/components/PageHeading.vue`, `themes/portfolio-dev/components/PostCategories.vue`, `themes/portfolio-dev/pages/blogs/Index.vue`, `themes/portfolio-dev/pages/contact/Index.vue`, `themes/portfolio-dev/pages/github/GitRepos.vue`, `themes/portfolio-dev/pages/github/GitUser.vue`, `themes/portfolio-dev/pages/github/Index.vue`, `themes/portfolio-dev/pages/post/Author.vue`, `themes/portfolio-dev/pages/post/Detail.vue`, `themes/portfolio-dev/pages/post/Item.vue`, `themes/portfolio-dev/pages/post/Loading.vue`, `themes/portfolio-dev/pages/projects/Index.vue`, `themes/portfolio-dev/pages/resumeObject/AboutMe.vue`, `themes/portfolio-dev/pages/resumeObject/Educations.vue`, `themes/portfolio-dev/pages/resumeObject/Hero.vue`, `themes/portfolio-dev/pages/resumeObject/Index.vue`, `themes/portfolio-dev/pages/resumeObject/Languages.vue`, `themes/portfolio-dev/pages/resumeObject/Skills.vue`, `types/blog.ts`, `types/codeLine.ts`, `types/github.ts`, `types/index.ts`, `types/resume-api.ts`, `types/resume-document.ts`, `utils/cloneDeep.ts`, `utils/convertNumberToDate.ts`, `utils/htmlCodeLines.ts`, `utils/index.ts`, `utils/jsonCodeLines.ts`, `utils/removeHtmlTags.ts`, `utils/tsCodeLines.ts`

## Author headers with Description → `@file` + `@author`

### `composables/useDownloadResume.ts`
Before:
```ts
/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Description: Shared CV-download logic, extracted so both the Hero (top
 * of the page) and the About tab's own button can trigger the same fetch/
 * blob/download flow without duplicating it (issue #179). Also drives a
 * toast (issue #198) so a slow/cold Puppeteer launch on the server doesn't
 * look like a silently broken button. `template: 'ats'` (issue #206) asks
 * for the single-column ATS-parser-friendly variant, in the current locale.
 */
```
After:
```ts
/**
 * @file Shared CV-download logic, extracted so both the Hero (top
 * of the page) and the About tab's own button can trigger the same fetch/
 * blob/download flow without duplicating it (issue #179). Also drives a
 * toast (issue #198) so a slow/cold Puppeteer launch on the server doesn't
 * look like a silently broken button. `template: 'ats'` (issue #206) asks
 * for the single-column ATS-parser-friendly variant, in the current locale.
 * @author Đạt Võ <votan.it@gmail.com> (https://github.com/datvt243)
 */
```

### `plugins/VisitTracker.client.ts`
Before:
```ts
/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `01/09/2026`
 * Description: Records a resume visit (count/timestamp/geo/IP, per
 * candidate) via the backend's dedicated `POST /api/me/:email/visit`
 * endpoint (see resume-nodejs-api's `add-visit-tracking` node).
 *
 * Client-only (`.client.ts` suffix, never runs during SSR/ISR render):
 * the backend resolves the visitor's IP/location from the request that
 * reaches it, so this must fire from the real visitor's browser, not from
 * this app's own Nitro server (which would report the server's own IP,
 * and would only fire once per ISR cache window instead of once per real
 * visit). Fire-and-forget: a failed/unreachable call must never block
 * rendering or throw - only logged.
 */
```
After:
```ts
/**
 * Date: `01/09/2026`
 * @file Records a resume visit (count/timestamp/geo/IP, per
 * candidate) via the backend's dedicated `POST /api/me/:email/visit`
 * endpoint (see resume-nodejs-api's `add-visit-tracking` node).
 *
 * Client-only (`.client.ts` suffix, never runs during SSR/ISR render):
 * the backend resolves the visitor's IP/location from the request that
 * reaches it, so this must fire from the real visitor's browser, not from
 * this app's own Nitro server (which would report the server's own IP,
 * and would only fire once per ISR cache window instead of once per real
 * visit). Fire-and-forget: a failed/unreachable call must never block
 * rendering or throw - only logged.
 * @author Đạt Võ <votan.it@gmail.com> (https://github.com/datvt243)
 */
```

### `server/routes/robots.txt.ts`
Before:
```ts
/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Description: robots.txt - previously an empty static file in public/;
 * moved to a server route so it can point crawlers at /sitemap.xml using
 * the same SITE_URL constant as sitemap.xml.ts/rss.xml.ts instead of a
 * 4th hardcoded copy of the production domain.
 */
```
After:
```ts
/**
 * @file robots.txt - previously an empty static file in public/;
 * moved to a server route so it can point crawlers at /sitemap.xml using
 * the same SITE_URL constant as sitemap.xml.ts/rss.xml.ts instead of a
 * 4th hardcoded copy of the production domain.
 * @author Đạt Võ <votan.it@gmail.com> (https://github.com/datvt243)
 */
```

### `server/routes/rss.xml.ts`
Before:
```ts
/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Description: RSS 2.0 feed for /blogs, sourced from the same cached
 * post fetch as /api/blogs/posts.
 */
```
After:
```ts
/**
 * @file RSS 2.0 feed for /blogs, sourced from the same cached
 * post fetch as /api/blogs/posts.
 * @author Đạt Võ <votan.it@gmail.com> (https://github.com/datvt243)
 */
```

### `server/routes/sitemap.xml.ts`
Before:
```ts
/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Description: sitemap.xml covering the static routes plus one <url> per
 * blog post, sourced from the same cached post fetch as /api/blogs/posts.
 */
```
After:
```ts
/**
 * @file sitemap.xml covering the static routes plus one <url> per
 * blog post, sourced from the same cached post fetch as /api/blogs/posts.
 * @author Đạt Võ <votan.it@gmail.com> (https://github.com/datvt243)
 */
```

### `server/utils/blogSchemas.ts`
Before:
```ts
/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Description: Runtime schema validation (zod) for the external blog
 * API's responses. The TS types in `types/blog.ts`/`types/index.ts` are
 * compile-time only and don't catch the external API changing shape
 * silently at runtime (issue #141) — a shape mismatch here now fails
 * loudly with a clear 502 instead of propagating an undefined/wrong-
 * shaped value into the theme layer.
 */
```
After:
```ts
/**
 * @file Runtime schema validation (zod) for the external blog
 * API's responses. The TS types in `types/blog.ts`/`types/index.ts` are
 * compile-time only and don't catch the external API changing shape
 * silently at runtime (issue #141) — a shape mismatch here now fails
 * loudly with a clear 502 instead of propagating an undefined/wrong-
 * shaped value into the theme layer.
 * @author Đạt Võ <votan.it@gmail.com> (https://github.com/datvt243)
 */
```

### `themes/portfolio-dev/pages/post/Comments.vue`
Before:
```ts
/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Description: Giscus (GitHub Discussions) comment widget, synced with
 * the site's dark/light color mode.
 */
```
After:
```ts
/**
 * @file Giscus (GitHub Discussions) comment widget, synced with
 * the site's dark/light color mode.
 * @author Đạt Võ <votan.it@gmail.com> (https://github.com/datvt243)
 */
```

### `themes/portfolio-dev/pages/resumeObject/Experiences.vue`
Before:
```ts
/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Description:
 *
 * Renders each job as real semantic HTML (article/h3/p/time/ul/li) styled
 * to look like a Pug source listing (indentation only, tag.class
 * shorthand, no closing tags). The visible "tag"/".class" glyphs are
 * decorative aria-hidden spans before the real text, and line numbers
 * come from a CSS counter (not literal text) — so a screen reader still
 * hears "heading: Frontend Developer", "list, 6 items", etc. instead of
 * literal punctuation.
 */
```
After:
```ts
/**
 * @file Renders each job as real semantic HTML (article/h3/p/time/ul/li) styled
 * to look like a Pug source listing (indentation only, tag.class
 * shorthand, no closing tags). The visible "tag"/".class" glyphs are
 * decorative aria-hidden spans before the real text, and line numbers
 * come from a CSS counter (not literal text) — so a screen reader still
 * hears "heading: Frontend Developer", "list, 6 items", etc. instead of
 * literal punctuation.
 * @author Đạt Võ <votan.it@gmail.com> (https://github.com/datvt243)
 */
```

### `utils/themeBadgeUi.ts`
Before:
```ts
/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Description: Overrides Nuxt UI's `<UBadge>` default `{color}` variant
 * (which never picks up the `--theme-*` CSS custom properties) with
 * `--theme-accent`, so a badge follows the active theme/Dracula editor-
 * scope like everything else inside `<ThemePanel>`. Nuxt UI's `ui` prop
 * merges via tailwind-merge per class-modifier group, so the `dark:`
 * variant needs its own explicit override too, or the default
 * `dark:text-{color}-400`/`dark:ring-{color}-400` classes survive.
 * Shared by `projects/Index.vue`'s tech badges and `github/part/Item.vue`'s
 * topic badges - previously two identical copies of this same object.
 */
```
After:
```ts
/**
 * @file Overrides Nuxt UI's `<UBadge>` default `{color}` variant
 * (which never picks up the `--theme-*` CSS custom properties) with
 * `--theme-accent`, so a badge follows the active theme/Dracula editor-
 * scope like everything else inside `<ThemePanel>`. Nuxt UI's `ui` prop
 * merges via tailwind-merge per class-modifier group, so the `dark:`
 * variant needs its own explicit override too, or the default
 * `dark:text-{color}-400`/`dark:ring-{color}-400` classes survive.
 * Shared by `projects/Index.vue`'s tech badges and `github/part/Item.vue`'s
 * topic badges - previously two identical copies of this same object.
 * @author Đạt Võ <votan.it@gmail.com> (https://github.com/datvt243)
 */
```

