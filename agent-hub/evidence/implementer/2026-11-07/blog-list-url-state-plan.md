# 2026-11-07 - blog-list-url-state (plan)
- Worker: implementer · Version: 0.1.0
- Node: `blog-list-url-state` (`haven/diagrams/dev-loop.prime-mermaid.md`, new row — no existing row for #415/#429/#430; slug not in the archive)
- Task: `/todo #415, #429, #430` — #415 /blogs category filter broken live (ISR drops query + upstream ignores category); #429 keep ?page/?per-page in the URL + reactive fetch key; #430 categories error also shows "No categories" + skeleton delay only on first load.

## Hub bytes before
94016

## Feature doc
`agent-hub/doctrine/features/blog-list.md` (verified). The fix restores Behavior #2 (layout reads `?category`/`?page`/`?per-page` — now also written back), #3 (error vs empty text), #7 (500ms per loading phase); OQ1/2 → #429, OQ4/6 → #430, OQ8 → #415. No Behavior item contradicts the fix → no doc edit.

## Upstream probe (#415 part 1)
`https://blog-api-nodejs-express.onrender.com/api/v1/post/?<q>&per_page=50`, 2026-11-07:
```
[category=vue] 4 [('f006', None), ('f00d', None), ('3f3f', None), ('a5e1', None)]
[categories=vue] 4 [...same...]
[categoryId=x] 4 [...same...]
[] 4 [...same...]
```
`/categories` returns real categories (javascript, vue, …) but no post has `categoryIds` set, and no query name filters. Not fixable in this repo (the service's repo is not identified: `gh repo list datvt243` shows `nodes-blog-api-ts`, `nodejs-blog-simple`).

## Code anchors
- `nuxt.config.ts:164-165` — `/blogs`, `/en/blogs` `{ isr: 60 }`
- `themes/portfolio-dev/pages/blogs/Index.vue` — static `fetchKey`, `v-model` on local page/perPage refs
- `layouts/blog.vue` — reads query → provided refs (unchanged)
- `themes/portfolio-dev/components/PostCategories.vue` — `v-else` "No categories" after the error `<p>`
- `components/ListRender.vue` — 500ms `isLoading` timer set once (only user: blogs/Index.vue)

## Acceptance
See the node row (5 criteria).
