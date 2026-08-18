# 2026-08-19 — rss-sitemap-feed (plan)

- Worker: implementer
- Node: `haven/diagrams/dev-loop.prime-mermaid.md` → `rss-sitemap-feed` (NEW — no existing node matches, created per `pick_next`'s failure branch)
- Issue: #73 (`RSS feed + sitemap.xml cho /blogs`)

## Task
Thêm RSS feed và `sitemap.xml`, dùng lại data có sẵn từ posts fetching, không
thêm dependency mới.

## Current state
- No `server/routes/` directory exists yet (only `server/api/`,
  `server/plugins/`, `server/utils/`).
- Post data source: `server/utils/cacheGetPost.ts`'s `cacheGetPosts(query)`
  — already cached (`maxAge: 3600`), hits
  `https://blog-api-nodejs-express.onrender.com/api/v1/post/` and returns
  `Post[]` (fields: `_id`, `title`, `slug`, `content`, `excerpt`,
  `createdAt`, `updatedAt`, `tags`).
- Post detail route: `/blogs/${post._id}` (confirmed in
  `themes/portfolio-dev/pages/post/Item.vue`'s `getURL` computed —
  `blogs/${props.modelValue._id}`).
- Static routes to include in sitemap: `/`, `/projects`, `/github`,
  `/blogs`, `/contact` (from `app.config.ts`'s `menuPrimary` + root
  `CLAUDE.md`'s route table).
- Site base URL: `https://datvt243.github.io` (only existing reference:
  `app.config.ts`'s `contact.social.website`) — no `NUXT_PUBLIC_SITE_URL`
  or similar env var exists; the codebase's convention for external URLs is
  to hardcode them directly in the handler (see `detail/[id].ts` and
  `cacheGetPost.ts` both hardcoding the blog API base URL) — following the
  same convention rather than introducing a new env var for a single
  constant.

## Acceptance criteria
1. `server/routes/rss.xml.ts` — new Nitro route (not under `/api`, so the
   feed lives at the conventional `/rss.xml` path), returns RSS 2.0 XML
   (`Content-Type: application/xml`) with the N most recent posts
   (title/link/pubDate/description), sourced from `cacheGetPosts`, no new
   npm dependency (hand-built XML string, matching this repo's existing
   style of no XML/RSS library anywhere in `package.json`).
2. `server/routes/sitemap.xml.ts` — new Nitro route returning a
   `<urlset>` XML sitemap: 5 static routes + one `<url>` per post at
   `/blogs/<_id>`.
3. Both routes actually reachable — verified by starting the dev server
   and curling `/rss.xml` and `/sitemap.xml` for real (not inferred from
   code reading).
4. `npm run build` + `npm run lint` clean (exact commands from
   `doctrine/MEMORY.md`).
5. No visual/UI part (these are non-visual XML endpoints, not rendered by
   any `Theme*` component) → Chrome CDP check not required per the
   `implement.md` recipe's step 7 ("if the change has a visual/behavior
   part").

## Files
- `server/routes/rss.xml.ts` (new)
- `server/routes/sitemap.xml.ts` (new)
- `agent-hub/haven/diagrams/dev-loop.prime-mermaid.md` (new node row,
  state PENDING → IN_PROGRESS during `implement`)

## Blockers
None — no env var needed beyond what's already set; the blog API base URL
and site base URL are both hardcoded constants following existing
convention, not new env vars.
