# 2026-09-20 — blog-post-seo-metadata (implementer plan)

- Worker: implementer
- Node: `blog-post-seo-metadata` (new)
- Task: fix the "no per-post SEO metadata on blog posts" P1 item from the
  `.claude/review.md` audit's roadmap (Phase 2).

## Acceptance criteria
1. `pages/blogs/[id].vue` currently has no `useSeoMeta`/`useHead` call at
   all, unlike every other page in `pages/` — every post shares whatever
   global/fallback title/description Nuxt applies.
2. Add `useSeoMeta` using the fetched post's own `title`/`excerpt`
   (confirmed field names directly on `types/blog.ts`'s `Post` interface),
   mirroring the existing pattern (`pages/projects.vue`'s `useSeoMeta` call
   shape: `title`/`ogTitle`/`description`/`ogDescription`).
3. Must not crash if the post hasn't loaded yet or the fetch failed —
   `postDetail.value` can be `undefined` before/without a successful fetch.
4. Build clean + lint clean + real UI check via CDP (this changes rendered
   `<head>` output, a visible/crawlable difference) — confirm the actual
   post's title/excerpt appear in the raw SSR HTML `<title>`/meta tags, not
   a placeholder.

## Env vars
None needed.
