# 2026-11-01 - seo-titles-og-image (plan + diff)

- Worker: implementer · Version: 0.1.0
- Node: `seo-titles-og-image` (last row of `haven/diagrams/dev-loop.prime-mermaid.md`)
- Task: issue #302 "chore(seo): page titles with name and a 1200×630 social image". Branch `feature/302` off `staging` (ac2c0e9).
- Status: `sealed_pending_verifier`

## Hub bytes before
80116 (the `/hub-tokens` "per-session total" sum, measured before the node row was appended)

## Approach
- Title: `titleTemplate: '%s — Võ Tấn Đạt'` in `nuxt.config.ts`'s `app.head` (the existing global head block). The home title today is `Resume ${firstName} ${lastName}` = "Resume Võ Tấn Đạt" (fallback `'Võ Tấn CV'`), so the template would repeat the name. `pages/index.vue` passes `titleTemplate: '%s'` in its existing `useSeoMeta` call (a supported `UseSeoMetaInput` key, `node_modules/unhead/dist/shared/unhead.DC0v7nqS.d.ts:2986`), so the home title stays exactly as it was. Every other page (`/github`, `/projects`, `/contact`, `/blogs`, `/blogs/[id]`) gets the suffix without touching its file.
- og:image: it was set in exactly one place, `pages/index.vue` (`${publicConfig.SITE_URL}/Avatar.png`, `publicConfig.SITE_URL` is the runtime copy of `server/utils/siteUrl.ts`'s `SITE_URL`). Changed only that line to `${publicConfig.SITE_URL}/og-image.png` (no longer a `computed`, it never changes) and added `ogImageWidth: 1200` / `ogImageHeight: 630`. The old JSDoc block above it (it explained Avatar.png as a stopgap until a dedicated banner exists) was dropped because it is no longer true.
- Image: `public/og-image.png`, 1200×630 PNG, 21913 bytes, sha1 `d9ebc455df2a653c19b8675753f8b052a5a48d68`. Rendered once with the installed `puppeteer-core` and local Google Chrome (no new dependency), from a scratchpad HTML file (not committed). Content only: the name "Võ Tấn Đạt" and "> Frontend Developer".

## Brand/visual choices (operator sanction not obtained, noted instead of blocking)
- Role text "Frontend Developer": the resume backend's `positionDesired` (rendered by `Hero.vue` as `> {{ hero?.positionDesired }}`; the same value is recorded from live data in `evidence/implementer/2026-09-20/p1-portfolio-review-fixes-diff.md:55`, `"jobTitle":"Frontend Developer"`). The `>` prefix copies Hero.vue.
- Name "Võ Tấn Đạt": the issue's requested template text (also the backend's `firstName` + `lastName`). Note `app.config.ts`'s `AppHeading` is "Đạt Võ"; I used the issue's form.
- Colors (Dracula, from `themes/portfolio-dev/settings-colors-theme/editor-dracula.css`): background `#282a36`, name `#f8f8f2` Foreground, role `#ff79c6` Pink (`--theme-code-keyword`, the class Hero.vue uses for the role), `>` `#9aa4c1` (`--theme-faint`), 16px left bar `#bd93f9` Purple (`--theme-accent`).
- Font: Barlow Bold / Medium from `public/fonts/Barlow/` (already in the repo, has Vietnamese glyphs). The site's mono font, Fira Code, lacks Vietnamese tone letters (see `tokens.css` comment), so it would break "Đạt".
- Render script (scratchpad `og.mjs`) printed `fonts B:700:loaded,B:500:loaded` before the screenshot, so the image is not using a fallback font. I viewed the PNG: name and role render, diacritics intact.
- To regenerate: the HTML + script are not committed (task said render once, commit the static file).

## Acceptance criteria
1. `titleTemplate` "%s — Võ Tấn Đạt" applies to non-home pages in both vi and en.
2. The home title does not contain the name twice (vi and en).
3. `public/og-image.png` exists and is exactly 1200×630.
4. Home og:image and twitter:image are the absolute `SITE_URL` URL of that file; og:image:width/height = 1200/630; twitter:card stays `summary_large_image`.
5. The image file is actually served by the built server.
6. build + lint + typecheck + `npm test` clean; no console errors after hydration and client navigation.

## Diff
| File | Why |
|---|---|
| `nuxt.config.ts` | `app.head.titleTemplate: '%s — Võ Tấn Đạt'` |
| `pages/index.vue` | `titleTemplate: '%s'` (no double name), og/twitter image → `/og-image.png`, `ogImageWidth`/`ogImageHeight`, stale comment dropped |
| `public/og-image.png` | new, 1200×630 |
| `agent-hub/haven/diagrams/dev-loop.prime-mermaid.md` | node row appended |

`git diff` of the two code files, verbatim:
```
diff --git a/nuxt.config.ts b/nuxt.config.ts
index 0bcc02c..2068cae 100644
--- a/nuxt.config.ts
+++ b/nuxt.config.ts
@@ -31,6 +31,7 @@ export default defineNuxtConfig({
         lang: 'vi',
       },
       charset: 'utf-8',
+      titleTemplate: '%s — Võ Tấn Đạt',
       viewport: 'width=device-width, initial-scale=1',
     },
     layoutTransition: { name: 'transition-opacity', mode: 'out-in' },
diff --git a/pages/index.vue b/pages/index.vue
index 6681e07..aa0dfed 100644
--- a/pages/index.vue
+++ b/pages/index.vue
@@ -21,19 +21,18 @@ const seoTitle = computed(() => {
   return firstName || lastName ? `Resume ${firstName} ${lastName}`.trim() : 'Võ Tấn CV'
 })
 const seoDescription = computed(() => removeHtmlTags(data.value?.introduction || ''))
-/**
- * No dedicated social-share banner exists yet - reusing the real profile
- * photo (already used as the hero avatar) so shares at least render a real
- * image instead of none, per the `no-og-image` finding (issue #179).
- */
-const ogImageUrl = computed(() => `${publicConfig.SITE_URL}/Avatar.png`)
+const ogImageUrl = `${publicConfig.SITE_URL}/og-image.png`
 
 useSeoMeta({
   title: seoTitle,
+  // The home title already carries the name; the global template would repeat it.
+  titleTemplate: '%s',
   ogTitle: seoTitle,
   description: seoDescription,
   ogDescription: seoDescription,
   ogImage: ogImageUrl,
+  ogImageWidth: 1200,
+  ogImageHeight: 630,
   twitterCard: 'summary_large_image',
   twitterImage: ogImageUrl,
 })
```

## Command
Repo root, Node v24.19.0. Each command's output was redirected to a scratchpad file and its exit code appended as `<name>=$?`, e.g. `npm run lint > lint.txt 2>&1; echo lint=$? >> lint.txt`. Build ran with `NODE_API=http://127.0.0.1:4199 NUXT_PUBLIC_NODE_API=http://127.0.0.1:4199` (mock = `mock2.py` + `me2-{vi,en}.json` copied from the 2026-10-31 session scratchpad, run with `python3 -I mock2.py me2-vi.json me2-en.json`).

## Output
`npm run lint` (full file):
```
> nuxt-app@1.8.0 lint
> eslint .

lint=0
```
`npx nuxi typecheck` (full file), plus `grep -c "error TS" tc.txt` → `0`:
```
ℹ Nuxt Icon server bundle mode is set to local
[nuxt:icon] ✔ Nuxt Icon discovered local-installed 3 collections: fe, grommet-icons, heroicons
typecheck=0
```
`npm test` (full file):
```
> nuxt-app@1.8.0 test
> vitest run


 RUN  v5.0.5 /Users/_david/Workspace/Project/resume/datvt243.github.io


 Test Files  6 passed (6)
      Tests  14 passed (14)
   Start at  13:40:13
   Duration  152ms (import 43%, transform 28%, tests 17%, worker 12%)

test=0
```
`npm run build` (148-line file). Output of `grep -n -i "WARN\|ERROR\|Build complete\|build=" build.txt`, complete:
```
72: WARN  node_modules/.cache/nuxt/.nuxt/dist/server/_nuxt/components-BA7Pw5lr.js (369:0): A comment
95:  ├─ .output/server/chunks/_/error-template.mjs (4.36 kB) (1.7 kB gzip)
107:  ├─ .output/server/chunks/build/error-DhXKUbjL.mjs (1 kB) (535 B gzip)
147:◆ ✨ Build complete in 14.0s!
148:build=0
```
Lines 95/107 are file names containing "error", not errors. The line-72 warning, lines 72-76 verbatim:
```
 WARN  node_modules/.cache/nuxt/.nuxt/dist/server/_nuxt/components-BA7Pw5lr.js (369:0): A comment

"/* @__NO_SIDE_EFFECTS__ */"

in "node_modules/.cache/nuxt/.nuxt/dist/server/_nuxt/components-BA7Pw5lr.js" contains an annotation that Rollup cannot interpret due to the position of the comment. The comment will be removed to avoid issues.
```
This is the Rollup annotation warning already recorded in earlier notes (e.g. `evidence/implementer/2026-10-26/security-headers-baseline-diff.md`). It comes from a generated components chunk, not from this diff.

Image file: `file public/og-image.png`:
```
public/og-image.png: PNG image data, 1200 x 630, 8-bit/color RGB, non-interlaced
```

## SSR head check
Prod server `PORT=4188 NODE_API=http://127.0.0.1:4199 NUXT_PUBLIC_NODE_API=http://127.0.0.1:4199 node .output/server/index.mjs`. Script (scratchpad `ssr.sh`):
```
for p in / /en /github /en/github /projects /en/projects /contact /en/contact /blogs /en/blogs; do
  echo "== $p"
  curl -s "http://127.0.0.1:4188$p" | grep -o '<title>[^<]*</title>\|<meta [^>]*\(og:title\|og:image\|twitter:image\|twitter:card\)[^>]*>'
done
```
Output, complete:
```
== /
<title>Resume Võ Tấn Đạt</title>
<meta property="og:title" content="Resume Võ Tấn Đạt">
<meta property="og:image" content="https://resume-nuxt-vert.vercel.app/og-image.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="https://resume-nuxt-vert.vercel.app/og-image.png">
== /en
<title>Resume Võ Tấn Đạt</title>
<meta property="og:title" content="Resume Võ Tấn Đạt">
<meta property="og:image" content="https://resume-nuxt-vert.vercel.app/og-image.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="https://resume-nuxt-vert.vercel.app/og-image.png">
== /github
<title>Github — Võ Tấn Đạt</title>
<meta property="og:title" content="Github">
== /en/github
<title>Github — Võ Tấn Đạt</title>
<meta property="og:title" content="Github">
== /projects
<title>Dự án — Võ Tấn Đạt</title>
<meta property="og:title" content="Dự án">
== /en/projects
<title>Projects — Võ Tấn Đạt</title>
<meta property="og:title" content="Projects">
== /contact
<title>Liên hệ — Võ Tấn Đạt</title>
<meta property="og:title" content="Liên hệ">
== /en/contact
<title>Contact me — Võ Tấn Đạt</title>
<meta property="og:title" content="Contact me">
== /blogs
== /en/blogs
<title>Blogs — Võ Tấn Đạt</title>
<meta property="og:title" content="Blogs">
```
`/blogs` (vi) printed nothing because that request failed. `srv.log` shows `H3Error: Unable to load posts`, `statusCode: 503`. The blog list calls the real external blog API, which is not mocked, and this was its first (cold) request. Re-run right after: `curl -s -o /dev/null -w '%{http_code} %{time_total}\n' --max-time 60 http://127.0.0.1:4188/blogs` → `200 0.014914`, and `curl -s --max-time 60 http://127.0.0.1:4188/blogs | grep -o '<title>[^<]*</title>'` → `<title>Blog — Võ Tấn Đạt</title>`.

`curl -sI http://127.0.0.1:4188/og-image.png | head -5`:
```
HTTP/1.1 200 OK
Content-Security-Policy: frame-ancestors 'none'
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
```
`grep -c onrender srv.log` → `0` (after the SSR checks and after the browser run).

## Browser verification
puppeteer-core, headless local Chrome, fresh profile (`prof/` deleted first), viewport 1440×900, `bringToFront()` + `document.visibilityState` printed. Script: scratchpad `nav.mjs`. It loads `/` and `/en`, clicks the header's `a[href$="/github"]` (real SPA navigation), then `goBack()`. Each line prints `document.title` and the `og:image` meta's `content` (`null` = tag absent). Output (`node nav.mjs > nav.txt 2>&1; echo exit=$? >> nav.txt`), complete:
```
/ hydrated {"vis":"visible","title":"Resume Võ Tấn Đạt","ogImage":"https://resume-nuxt-vert.vercel.app/og-image.png"}
/ -> github (click) {"vis":"visible","title":"Github — Võ Tấn Đạt","ogImage":null}
/ <- back {"vis":"visible","title":"Resume Võ Tấn Đạt","ogImage":"https://resume-nuxt-vert.vercel.app/og-image.png"}
/en hydrated {"vis":"visible","title":"Resume Võ Tấn Đạt","ogImage":"https://resume-nuxt-vert.vercel.app/og-image.png"}
/en -> github (click) {"vis":"visible","title":"Github — Võ Tấn Đạt","ogImage":null}
/en <- back {"vis":"visible","title":"Resume Võ Tấn Đạt","ogImage":"https://resume-nuxt-vert.vercel.app/og-image.png"}
console errors/warnings: []
exit=0
```
The first attempt (default 800×600 viewport) exited 1 with `Error: Node is either not clickable or not an Element` because the header link is hidden at that width. A script setup issue, not an app error; the viewport was set to 1440×900 and the run above is the second one.

## Acceptance
| Criterion | Evidence |
|---|---|
| 1 template on other pages, vi + en | SSR: `Github — Võ Tấn Đạt` (vi/en), `Dự án — Võ Tấn Đạt`/`Projects — Võ Tấn Đạt`, `Liên hệ — Võ Tấn Đạt`/`Contact me — Võ Tấn Đạt`, `Blog — Võ Tấn Đạt`/`Blogs — Võ Tấn Đạt`; browser after click nav: `Github — Võ Tấn Đạt` |
| 2 home has no double name | SSR `/` and `/en`: `<title>Resume Võ Tấn Đạt</title>`; same after hydration and after back-navigation in the browser |
| 3 1200×630 file | `file`: `PNG image data, 1200 x 630` |
| 4 absolute og/twitter image + size | SSR `/` and `/en`: og:image and twitter:image = `https://resume-nuxt-vert.vercel.app/og-image.png`, og:image:width `1200`, og:image:height `630`, twitter:card `summary_large_image` |
| 5 served | `curl -sI /og-image.png` → `HTTP/1.1 200 OK` |
| 6 checks | lint=0, typecheck=0 (0 `error TS`), test=0 (14/14), build=0; `console errors/warnings: []` |
| comments per code-comments.md | one added `//` WHY line in `pages/index.vue` (why the home page opts out of the template); one stale JSDoc block removed (it described the Avatar.png stopgap and carried an `(issue #179)` ref) |

## Supersedes: none
(`grep -n "302" haven/diagrams/dev-loop.prime-mermaid.md` matches only this node's row.)

## Still open
none

## Noticed, not done
- og:title is not templated (`og:title` = "Github", not "Github — Võ Tấn Đạt"). The issue asks only for `<title>`; unhead applies `titleTemplate` to `<title>` only.
- Only the home page sets og:image (true before this change too). Other pages share without an image. Moving og:image to a global head entry would cover them, but the task said to change it in the one place it is set.
- Other title strings were not changed: the vi/en `seoTitle` texts ("Github", "Contact me") and the home fallback `'Võ Tấn CV'`.
- `public/Avatar.png` is still used by Hero.vue and the blog Author block, so it stays.
- Not tested: light mode (no effect on head tags), an actual social-card preview (Facebook/X debuggers need a public URL), and a blog post detail page title.

## Seal gate
none (no commit/push/PR; left to the operator). Untracked `review/` and `.playwright-mcp/` existed before this node and are not part of it.
