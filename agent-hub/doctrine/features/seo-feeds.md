# SEO feeds: RSS, sitemap, robots

- Status: draft
- Source: backfill from code
- Issues: -
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
   updatedAt or createdAt, ISO).
4. `/rss.xml` (`application/xml`): RSS 2.0 channel "Đạt Võ - Blog", link
   `<SITE_URL>/blogs`, language `vi`, with the latest 20 posts (title,
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
   hreflang alternates in the sitemap)?
2. `/blogs` is in the sitemap though it is deliberately out of the nav.
   Intended?
3. The RSS channel title/description and `language` are fixed (`vi`) while
   the description text is English. Intended?

## Changelog
| Date | Change | Why | Node |
|---|---|---|---|
| 2026-11-06 | Backfilled from code | /spec-backfill | - |
