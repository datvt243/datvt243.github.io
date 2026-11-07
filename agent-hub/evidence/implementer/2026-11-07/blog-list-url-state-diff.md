# 2026-11-07 - blog-list-url-state (diff)
- Worker: implementer · Version: 0.1.0
- Node: `blog-list-url-state` (`haven/diagrams/dev-loop.prime-mermaid.md`)
- Task (verbatim): `/todo #415,  #429, #430` — branch `bug/415`.
- Status: `sealed_pending_verifier`

## Hub bytes before
94016

## Feature doc
`agent-hub/doctrine/features/blog-list.md` — fix restores Behavior #2/#3/#7 (OQ1, 2, 4, 6, 8 answered "Bug" by the operator). Not edited.

## Diff
| File | Why |
|---|---|
| `nuxt.config.ts` | `/blogs`, `/en/blogs` → `{ isr: { expiration: 60, allowQuery: ['category', 'page', 'per-page'] } }` + 1 `//` why-comment (#415, this repo's half; #429 needs it so `?page`/`?per-page` reach the function) |
| `themes/portfolio-dev/pages/blogs/Index.vue` | `currentPage` / `currentPerPage` computed get/set: get = provided ref as a number, set = `router.push` of the merged query (`page` omitted when 1; a per-page change drops `page`); `UPagination`/`USelect` bound to them; `useFetch` `key` is now a getter `blogs-posts:<category>:<page>:<perPage>` (#429) |
| `themes/portfolio-dev/components/PostCategories.vue` | "No categories" `v-else` → `v-else-if="!error"` (#430) |
| `components/ListRender.vue` | the 500ms timer now watches "is loading" (`idle`/`pending`): every entry resets `isLoading` and restarts the timer, leaving clears it; cleared on unmount (#430). Only user: `blogs/Index.vue` |

`layouts/blog.vue` unchanged: it already re-reads `?category`/`?page`/`?per-page` on every URL change, so the URL is the single source of truth.

## Command
Repo root, Node v24.19.0. `doctrine/MEMORY.md`: `npm run build`, `npm run lint`, `npx nuxi typecheck`, `npm test` (Typecheck standalone → run). Plus `NITRO_PRESET=vercel npm run build` for criterion 1 (same check as the `resume-isr-allow-lang` node).

## Output
```
NITRO_PRESET=vercel npm run build → vercel build exit 0
.vercel/output/functions/blogs-isr.prerender-config.json:
{ "expiration": 60, "allowQuery": [ "category", "page", "per-page", "__isr_route" ], "passQuery": true }
.vercel/output/functions/en/blogs-isr.prerender-config.json:
{ "expiration": 60, "allowQuery": [ "category", "page", "per-page", "__isr_route" ], "passQuery": true }
blogs/_payload.json-isr: same allowQuery
blogs/[...] (post detail, untouched rule): {"expiration":false}
api/resume (reference): { "expiration": 60, "allowQuery": [ "lang", "__isr_route" ], "passQuery": true }

npm run build → build exit 0
◆ ✨ Build complete in 14.5s!
(grep -iE '\berror\b' minus error-template/error-*.mjs chunk names → no lines)

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
Prod build (`.output`, node preset), `PORT=4188`, `NODE_API` + `NUXT_PUBLIC_NODE_API` = resume mock `:4199`. The real blog API has 4 posts (too few for page 2), so the blog API is faked in-process: `node --import scratchpad/scripts/fake-blog.mjs` — 45 synthetic posts `Post 1..45` (ids `p001..`), posts answer after 1s, `BLOG_CAT_FAIL=1` makes `/categories` throw, posts throw while `scratchpad/fail-posts` exists. Server logs: the only `onrender` lines are the 2 forced `/categories` failures (blog API URL, intercepted); resume calls went to the mock only. Chrome CDP :9888 via Playwright, `visibilityState` `visible`.

### (2) URL state + reactive key — real clicks, both locales
```
/blogs:    click "2" → URL ?page=2, first=Post 21 (old list stays shown until it arrives, skel=0 throughout)
           keys: ["blogs-posts::1:20","blogs-posts::2:20"]
           Show: 10 → "/blogs?per-page=10" (page dropped), items=10, first=Post 1
           click "3" → "/blogs?per-page=10&page=3", first=Post 21
           reload → {"url":"/blogs?per-page=10&page=3","items":10,"first":"Post 21","activePage":"3"}, keys ["blogs-posts::3:10"]
/en/blogs: same: ?page=2 → Post 21; keys ["blogs-posts::1:20","blogs-posts::2:20"]; "/en/blogs?per-page=10"; "/en/blogs?per-page=10&page=3";
           reload → {"url":"/en/blogs?per-page=10&page=3","items":10,"first":"Post 21","activePage":"3"}, keys ["blogs-posts::3:10"]
```

### (3) Categories error vs empty — SSR `curl`
```
BLOG_CAT_FAIL=1:
/blogs catErr: vi=1 en=0 | noCats: vi=0 en=0
/en/blogs catErr: vi=0 en=1 | noCats: vi=0 en=0
categories OK:
/blogs (categories OK): catLinks=1 noCats=0
/en/blogs (categories OK): catLinks=1 noCats=0
```

### (4) 500ms delay on a SECOND loading phase in the same mount
Client nav `/contact` → `/blogs?per-page=30` with posts failing (phase 1), then flag removed + "Try again" (phase 2). Sampled every 40ms, state changes only (`skel` = `.animate-pulse` count; `USkeleton` itself renders `role="alert"`, so `err=true` beside `skel=33` is the skeleton, confirmed in `node_modules/@nuxt/ui/dist/runtime/components/Skeleton.vue`):
```
phase1: ["16ms skel=0 err=false items=0","514ms skel=33 err=true items=0","1057ms skel=0 err=true items=0"]
phase2 (before: {"skel":0,"err":true,"items":0}):
        ["2ms skel=0 err=false items=0 lists=1","525ms skel=33 err=true items=0 lists=1","1027ms skel=0 err=false items=60 lists=1"]
```
Phase 2 shows no skeleton for the first ~500ms, then skeletons, then 30 posts (60 links). Before this diff `isLoading` stayed `true` after the first phase, so phase 2 would show skeletons at ~0ms — not re-run on the old build (reasoned from the old code: one `setTimeout` at mount, never reset).

Console: 503s on `/api/blogs/posts` + `_payload.json` are the forced failures; 502s on `/blogs/p0xx/_payload.json` are link prefetches of fake post ids the fake doesn't serve; the rest are a Chrome extension hook.

## Acceptance
| Criterion | Evidence |
|---|---|
| (1) ISR `allowQuery` category/page/per-page on both rules, emitted in Vercel output | the two `prerender-config.json` blocks above |
| (2) page/per-page in URL, reload keeps it, reactive key | (2) block: `?page=2`, `?per-page=10` (page dropped), `per-page=10&page=3` after reload with `activePage 3`; keys `blogs-posts::2:20`, `blogs-posts::3:10` |
| (3) categories error → error text only | `catErr ... =1`, `noCats: vi=0 en=0` on both locales |
| (4) 500ms on every loading phase | phase2: `2ms skel=0` → `525ms skel=33` |
| (5) build + lint + typecheck + test | build exit 0 (both presets), lint exit 0, tc exit 0, `Tests  27 passed (27)` |
| comments per code-comments.md | 4 added: `nuxt.config.ts` `//` (why allowQuery), `Index.vue` `/** */` (URL = source of truth) + `//` (why page resets), `ListRender.vue` `//` (why restart per phase); one sentence each, no issue refs |

## Supersedes
none (grep `#415|#429|#430` in the active diagram → only this row).

## Still open
- #415 upstream half: the blog API (`blog-api-nodejs-express.onrender.com`) ignores `category`/`categories`/`categoryId` and every post has `categoryIds: null` (probe in the plan note). Needs a change in the blog API service + its data, not in this repo. Deployed service's repo not identified (`nodes-blog-api-ts` or `nodejs-blog-simple`?). So the PR should reference #415, not close it, unless the operator decides otherwise.

## Noticed, not done
- Paging keeps the previous list visible until the new page arrives (Behavior #6 path), so a fast network shows no loading cue on page change — existing behavior, unchanged.
- An empty successful categories list → "No categories" still uses the same `<p>` (now `v-else-if="!error"`); not exercised live (the fake returns 2 categories).
- `layouts/blog.vue` keeps query values as strings (`"2"`); `Index.vue` now coerces with `Number()` for the UI. Typing in the layout left as is.

## Seal gate
none — no commit/push/delete in this pass.

## Re-pass after REOPEN (round 1)
REOPEN note: `evidence/verifier/2026-11-07/blog-list-url-state-reopen.md` (3 missing items). No code change, only measurements. Same build (`.output` from this pass, unchanged since), same setup: resume → mock `:4199`, blog API faked in-process. `fake-blog.mjs` gained 2 env modes: `BLOG_CAT_EMPTY=1` → `/categories` returns `{ status: true, data: [] }`, `BLOG_POSTS_EMPTY=1` → posts `{ status: true, data: { data: [], total: 0, page, perPage } }`. Resume mock log: `GET …?lang=en`, `GET …?lang=vi`, `POST …/visit` ×4 only; `onrender` lines outside the fake's own `[fake-blog]` logging and the forced `/categories` failures → `0`.

### Missing 1 + 3: categories OK / empty / error (SSR `curl`)
`catLinks` now counts category links: `grep -oE 'href="[^"]*category=[^"]*"' | wc -l`. The earlier `catLinks=1` was `grep -o 'category=vue'`, i.e. the `vue` link only.
```
[OK categories]
/blogs catLinks(href with category=)=2 noCats(vi|en)=0 catErr(vi|en)=0
/en/blogs catLinks(href with category=)=2 noCats(vi|en)=0 catErr(vi|en)=0
[BLOG_CAT_EMPTY=1]
/blogs catLinks(href with category=)=0 noCats(vi|en)=1 catErr(vi|en)=0
/en/blogs catLinks(href with category=)=0 noCats(vi|en)=1 catErr(vi|en)=0
/blogs BLOG_CAT_EMPTY: vi-noCats=1 en-noCats=0
/en/blogs BLOG_CAT_EMPTY: vi-noCats=0 en-noCats=1
[BLOG_CAT_FAIL=1]
/blogs catLinks(href with category=)=0 noCats(vi|en)=0 catErr(vi|en)=1
/en/blogs catLinks(href with category=)=0 noCats(vi|en)=0 catErr(vi|en)=1
```
Empty → localized "No categories" only; error → error text only; OK → 2 links (the fake serves 2).

### Missing 2: empty posts (`BLOG_POSTS_EMPTY=1`), browser (Chrome CDP :9888, `visibilityState` `visible`)
`ssr` = full load of the page; `clientNav` = `/contact` → `$router.push('<base>?per-page=50')` (a loading phase), sampled every 40ms, state changes only:
```
/blogs:    ssr {"skel":0,"noData":"Không có dữ liệu","items":0}
           clientNav ["15ms skel=0 noData=null items=0","458ms skel=0 noData=Không có dữ liệu items=0"]
           settled {"skel":0,"noData":"Không có dữ liệu","items":0}
/en/blogs: ssr {"skel":0,"noData":"No data","items":0}
           clientNav ["10ms skel=0 noData=null items=0","454ms skel=0 noData=No data items=0"]
           settled {"skel":0,"noData":"No data","items":0}
```
Settled: "No data" (localized), `skel=0`, no items. The empty answer arrived in under 500ms, so no skeleton showed at all (the 500ms delay held).

### Acceptance after re-pass
| Missing item | Evidence |
|---|---|
| 1. Empty categories → "No categories", no error (Behavior #3) | `[BLOG_CAT_EMPTY=1]` rows: `noCats=1 catErr=0`, vi/en strings per locale |
| 2. Empty posts → "No data", `skel=0` settled (Behavior #7) | `settled` rows, both locales |
| 3. `catLinks` meaning | re-measured as category `href`s: `2` with 2 categories |

Hub size note (verifier's remark 94016 → 95406): the delta is this node's own active-diagram row (~1.3 KB, counted in the per-session total) plus the REOPEN pointer text; evidence/ is not counted.

Status: `sealed_pending_verifier`.
