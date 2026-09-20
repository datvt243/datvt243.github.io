# 2026-09-20 — fix-blog-author-tag

**Worker:** implementer
**Version:** 1.0.0 (dev-loop diagram)
**Node:** `fix-blog-author-tag` (new — no prior node matched, created per `pick_next.md`'s "No diagram matches yet" branch)
**Task:** Fix 2 P0/critical findings from portfolio review (fake blog author byline, broken tag link) — issue #178: (1) `themes/portfolio-dev/pages/post/Author.vue` is 100% hardcoded placeholder content ("Author Name", "Author Job", flowbite.com stock photo) rendered on every blog post — wire to real data or remove the byline block. (2) Broken route binding + fake tag in `themes/portfolio-dev/pages/post/Detail.vue:60` — `NuxtLink to="'/blogs'"` missing the `:` binding, plus a hardcoded `#tag` instead of the real `Post.tags` array from `types/blog.ts`.

## Hub bytes before: 105848

## Acceptance criteria
1. `Author.vue` no longer renders any hardcoded fake name/job/photo — every field traces to a real, existing data source (no new fetch added).
2. `Detail.vue`'s tag `NuxtLink` binding bug is fixed (`:to`, not a literal-string `to`), and the fake single `#tag` is replaced by the real `Post.tags` array — with no dead/misleading link (the app has no real tag-filtering route, so tags must not link anywhere that doesn't actually work).
3. `npm run build` clean, `npm run lint` clean (0 errors, warning count not increased from the current baseline).
4. Real UI check via Chrome CDP on an actual blog post with tags AND one without, since this is a visible/behavior change.

## Files to touch
- `themes/portfolio-dev/pages/post/Author.vue`
- `themes/portfolio-dev/pages/post/Detail.vue`

No env var needed, no new dependency.
