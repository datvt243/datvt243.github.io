# analyst — seo-feeds — 2026-11-07

## Task (verbatim)
document seo-feeds

## Doc
`agent-hub/doctrine/features/seo-feeds.md` (existing bulk-backfill draft, re-checked per recipe step 4, not rewritten)

## Sources read
- `agent-hub/haven/workers/analyst/SOUL.md`
- `agent-hub/haven/workers/analyst/recipes/spec_feature.md`
- `agent-hub/doctrine/features/INDEX.md`
- `agent-hub/doctrine/domains/PROJECT.md`
- `agent-hub/doctrine/MEMORY.md`
- `server/routes/rss.xml.ts`
- `server/routes/sitemap.xml.ts`
- `server/routes/robots.txt.ts`
- `server/utils/siteUrl.ts`
- `server/utils/cacheGetPost.ts`
- `nuxt.config.ts` (i18n baseUrl)

## Re-check vs code
Behavior 1–5 match code. `SITE_URL = process.env.SITE_URL || 'https://resume-nuxt-vert.vercel.app'`, used by all 3 routes and `i18n.baseUrl`. robots: `text/plain`, `User-agent: *`, `Allow: /`, `Sitemap: <SITE_URL>/sitemap.xml`. sitemap: `application/xml`, `STATIC_ROUTES` `/`,`/projects`,`/github`,`/blogs`,`/contact` + `cacheGetPosts({page:1, perPage:100})` → `<loc>/blogs/<_id>` + ISO `<lastmod>` (updatedAt||createdAt); no `/en/*`. rss: RSS 2.0, title "Đạt Võ - Blog", link `/blogs`, English description, `<language>vi</language>`, `cacheGetPosts({page:1, perPage:20})`, link = guid, pubDate UTC string (updatedAt||createdAt), `escapeXml` on title/excerpt. Both catch → `[]` (static-only sitemap / empty RSS), never a 5xx. No discrepancy.

## Questions + answers
Operator (2026-11-07): "ok, behavior đúng" (Behavior section confirmed correct).
1. The sitemap has no `/en/*` URLs. Should English pages be listed (or via
   hreflang alternates in the sitemap)? → **Answer (operator 2026-11-07):** Bug — #425
2. `/blogs` is in the sitemap though it is deliberately out of the nav.
   Intended? → **Answer (operator 2026-11-07):** Intended
3. The RSS channel title/description and `language` are fixed (`vi`) while
   the description text is English. Intended? → **Answer (operator 2026-11-07):** Bug: Vietnamese description — #433

## Result
status: verified — every open question answered + operator confirmed Behavior.
`Status: verified — confirmed by operator 2026-11-07, see evidence/analyst/2026-11-07/seo-feeds-spec.md` set in doc + INDEX row; Issues: #425, #433. Behavior unchanged (describes code today; changes tracked by the issues).

## Isolation proof
Separate spawned agent (Agent tool), blank context. Received only the
dispatch prompt (3 tasks, operator's "ok, behavior đúng" confirmation, the
operator's answers + issue numbers). No implementer reasoning, no main
session transcript. All Behavior items re-checked by reading code myself.
