# 2026-11-07 - sitemap-rss-locale (diff)
- Worker: implementer · Version: 0.1.0
- Node: `sitemap-rss-locale` (`haven/diagrams/dev-loop.prime-mermaid.md`)
- Task (verbatim): `/todo #425, #433` — branch `bug/425`; the PR closes both issues.
- Status: `sealed_pending_verifier`

## Hub bytes before
94012

## Feature doc
`agent-hub/doctrine/features/seo-feeds.md`

## Feature doc changed: Behavior #3 "one `<url>` for each of `/`, … plus one per blog post" (VI only) → each path twice (vi + `/en`, `/` → `/en`) with `xhtml:link` alternates `vi-VN`/`en-US`; Behavior #4 → adds "Vietnamese description (the `vi` `blogs.intro` text)"; Changelog row added — operator: OQ1 "Bug — #425", OQ3 "Bug: Vietnamese description — #433" (2026-11-07, in the doc's Open questions)

## Diff
| File | Why |
|---|---|
| `server/routes/sitemap.xml.ts` | `LOCALES` (hreflang = `nuxt.config.ts` i18n `language` codes) + `localizedUrls(path, extra)`: one `<url>` per locale, each listing both as `xhtml:link` alternates; `/` maps to `/en` via `(prefix + path).replace(/\/$/, '') \|\| '/'`; `urlset` declares `xmlns:xhtml`; header `@file` line mentions locales (#425) |
| `server/routes/rss.xml.ts` | channel `<description>` → `Bài viết, hướng dẫn, đoạn code hay ho, và vài thứ lăng nhăng khác.` (same text as `vi.json` `blogs.intro`) (#433) |
| `agent-hub/doctrine/features/seo-feeds.md` | Behavior #3, #4 + Changelog row (see above) |

Degrade path (blog API failure → static routes only / empty feed) untouched.

## Command
Repo root, Node v24.19.0. From `doctrine/MEMORY.md`: `npm run build`, `npm run lint`, `npx nuxi typecheck`, `npm test` (Typecheck row is standalone → run).

## Output
```
npm run build → build exit 0
◆ ✨ Build complete in 14.9s!
(grep -iE '\berror\b' build log minus error-template/error-*.mjs chunk names → no lines)

npm run lint
> nuxt-app@1.13.0 lint
> eslint .
lint exit 0

npx nuxi typecheck
[nuxt:icon] ✔ Nuxt Icon discovered local-installed 3 collections: fe, grommet-icons, heroicons
tc exit 0

npm test
 Test Files  10 passed (10)
      Tests  27 passed (27)
test exit 0
```

## Runtime check
Prod build `node .output/server/index.mjs`, `PORT=4188`, `NODE_API` + `NUXT_PUBLIC_NODE_API` = mock `http://127.0.0.1:4199` (`scratchpad/scripts/mock.mjs`). "Before" = the previous `.output` built from `staging` (same sitemap/rss code as base), captured before rebuilding. `grep -c onrender` over both server logs → `0`.
```
url count before/after: 9 / 18
xmllint ok                                   (sitemap-after.xml)
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>https://resume-nuxt-vert.vercel.app/</loc>
    <xhtml:link rel="alternate" hreflang="vi-VN" href="https://resume-nuxt-vert.vercel.app/"/>
    <xhtml:link rel="alternate" hreflang="en-US" href="https://resume-nuxt-vert.vercel.app/en"/>
  </url>
  <url>
    <loc>https://resume-nuxt-vert.vercel.app/en</loc>
    …same two alternates…
locs: / , /en , /projects , /en/projects , /github , /en/github , /blogs , /en/blogs , /contact , /en/contact , /blogs/67123bdf9c6e9bcf4f7bf006 , /en/blogs/67123bdf9c6e9bcf4f7bf006 , …
urls missing an alternate: 0        (xmllint xpath: <url> without exactly one vi-VN and one en-US xhtml:link)
vi locs without /en twin: (empty)   (comm of before-locs vs after-locs minus /en → identical sets)
post url:
    <loc>https://resume-nuxt-vert.vercel.app/en/blogs/67123bdf9c6e9bcf4f7bf006</loc>
    <lastmod>2024-10-18T10:43:43.254Z</lastmod>
    <xhtml:link rel="alternate" hreflang="vi-VN" href="https://resume-nuxt-vert.vercel.app/blogs/67123bdf9c6e9bcf4f7bf006"/>
    <xhtml:link rel="alternate" hreflang="en-US" href="https://resume-nuxt-vert.vercel.app/en/blogs/67123bdf9c6e9bcf4f7bf006"/>
lastmod count doubled
rss xmllint ok
<description>Bài viết, hướng dẫn, đoạn code hay ho, và vài thứ lăng nhăng khác.</description>
<language>vi</language>
```
Blog API forced down (`node --import scratchpad/scripts/block-blog.mjs`, rejects every `blog-api-nodejs-express` fetch):
```
sitemap.xml blocked: 200 urls=10 items=0
rss.xml blocked: 200 urls=0 items=0
```
No UI change → no browser check (server-rendered XML only).

## Acceptance
| Criterion | Evidence |
|---|---|
| (1) every path under vi + `/en`, 2× count, both hreflang alternates, `xmlns:xhtml`, valid XML | `url count before/after: 9 / 18`; locs list; `urls missing an alternate: 0`; `vi locs without /en twin:` empty; `urlset … xmlns:xhtml=…`; `xmllint ok` |
| (2) RSS description Vietnamese, language `vi` | `<description>Bài viết, hướng dẫn, đoạn code hay ho, và vài thứ lăng nhăng khác.</description>`, `<language>vi</language>`, `rss xmllint ok` |
| (3) blog API down → 200 (Behavior #5) | `sitemap.xml blocked: 200 urls=10` (5 static × 2), `rss.xml blocked: 200 … items=0` |
| (4) seo-feeds.md Behavior #3/#4 + Changelog | `## Feature doc changed` above; Changelog row `2026-11-07 … sitemap-rss-locale` |
| (5) build + lint + typecheck + test clean | build exit 0, lint exit 0, tc exit 0, `Tests  27 passed (27)` |
| comments per code-comments.md | 2 JSDoc one-liners on `LOCALES` (why the hreflang values) and `localizedUrls` (the Google hreflang format it follows); `@file` overview extended, no issue refs |

## Supersedes
none (grep `#425|#433` in the active diagram → only this row).

## Still open
none.

## Noticed, not done
- The RSS description is a copy of `vi.json` `blogs.intro` (server routes don't use i18n); if that intro changes, both need editing.
- No `x-default` hreflang in the sitemap — the pages' `useLocaleHead` tags were not compared for one; the issue asked for vi/en pairs only.

## Seal gate
none — no commit/push/delete in this pass.
