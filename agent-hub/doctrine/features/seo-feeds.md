# SEO feeds: RSS, sitemap, robots

- Status: verified — confirmed by operator 2026-11-07, see `evidence/analyst/2026-11-07/seo-feeds-spec.md`
- Source: backfill from code
- Issues: #425, #433
- Anchors: `server/routes/rss.xml.ts`, `server/routes/sitemap.xml.ts`, `server/routes/robots.txt.ts`, `server/utils/siteUrl.ts`, `server/utils/cacheGetPost.ts`, `nuxt.config.ts`

## Goal
Search engines and feed readers discover the site's pages and blog posts.

## Behavior
1. `SITE_URL` = env `SITE_URL` or `https://resume-nuxt-vert.vercel.app`; it is
   the origin in all three files and in i18n `baseUrl` (hreflang/canonical).
2. `/robots.txt` (`text/plain`): `User-agent: *`, `Allow: /`, and
   `Sitemap: <SITE_URL>/sitemap.xml`.
3. `/sitemap.xml` (`application/xml`): one `<url>` for each of `/`,
   `/projects`, `/github`, `/blogs`, `/contact`, plus one per blog post from
   page 1 of up to 100 posts (`<loc>${SITE_URL}/blogs/<_id>`, `<lastmod>` =
   updatedAt or createdAt, ISO) — each path twice, Vietnamese and `/en`
   (`/` → `/en`), every `<url>` listing both as `xhtml:link` alternates
   (`hreflang` `vi-VN` / `en-US`).
4. `/rss.xml` (`application/xml`): RSS 2.0 channel "Đạt Võ - Blog", link
   `<SITE_URL>/blogs`, language `vi`, Vietnamese description (the `vi`
   `blogs.intro` text), with the latest 20 posts (title,
   link = guid, pubDate = updatedAt or createdAt, description = excerpt),
   XML-escaped.
5. Both feeds reuse the 1h posts cache (see `blog-list.md`). If the blog API
   fails, the sitemap has only the static routes and the RSS has no items —
   never a server error.

## Acceptance criteria
- `curl -s <host>/robots.txt` contains `Sitemap: https://` and ends with
  `/sitemap.xml`.
- `curl -s <host>/sitemap.xml | grep -c '<url>'` ≥ 5.
- `curl -s <host>/rss.xml | head -2` shows `<rss version="2.0">`.
- With the blog API unreachable, `curl -s -o /dev/null -w '%{http_code}'
  <host>/rss.xml` prints `200`.

## Edge cases
- More than 100 posts → only the first 100 in the sitemap.
- `SITE_URL` unset → the Vercel domain, not `datvt243.github.io`.

## Out of scope
- An English RSS feed, image/news sitemaps.

## Open questions
1. The sitemap has no `/en/*` URLs. Should English pages be listed (or via
   hreflang alternates in the sitemap)? → **Answer (operator 2026-11-07):** Bug — #425
2. `/blogs` is in the sitemap though it is deliberately out of the nav.
   Intended? → **Answer (operator 2026-11-07):** Intended
3. The RSS channel title/description and `language` are fixed (`vi`) while
   the description text is English. Intended? → **Answer (operator 2026-11-07):** Bug: Vietnamese description — #433

## Changelog
| Date | Change | Why | Node |
|---|---|---|---|
| 2026-11-06 | Backfilled from code | /spec-backfill | - |
| 2026-11-07 | Operator confirmed Behavior + answered all open questions; Status → verified | analyst backfill re-check, see `evidence/analyst/2026-11-07/seo-feeds-spec.md` | - |
| 2026-11-07 | Behavior #3: sitemap lists every path in vi + `/en` with hreflang alternates; Behavior #4: RSS description in Vietnamese | Operator answers OQ1 (Bug — #425) and OQ3 (Bug — #433) | `sitemap-rss-locale` |
