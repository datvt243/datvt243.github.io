# 2026-11-22 - giscus-one-thread (diff)
- Worker: implementer · Version: 0.1.0
- Node: `giscus-one-thread` in `haven/diagrams/dev-loop.prime-mermaid.md`
- Task: #432 "Giscus: one discussion thread per post across /blogs and /en/blogs" (verbatim body in the plan note)
- Plan: `evidence/implementer/2026-11-22/giscus-one-thread-plan.md`

## Hub bytes before: 93618
## Feature doc: agent-hub/doctrine/features/blog-post.md
## Feature doc changed: Behavior 7 "mapping `pathname`" → "mapping `specific` with term `blogs/<post _id>` (one thread per post shared by `/blogs/<id>` and `/en/blogs/<id>`)" + Changelog row 2026-11-22 — operator: open question 5 answer (2026-11-07) "Change: one thread per post id — #432"

## Diff
| File | Why |
|---|---|
| `themes/portfolio-dev/pages/post/Comments.vue` | new `postId` prop; `data-mapping` `pathname` → `specific`; `data-term` = `blogs/${postId}` |
| `themes/portfolio-dev/pages/post/Detail.vue` | pass `:post-id="modelValue._id"` to its `<ThemePostComments>` |
| `agent-hub/doctrine/features/blog-post.md` | Behavior 7 + Changelog (see above) |
| `agent-hub/haven/diagrams/dev-loop.prime-mermaid.md` | new PENDING row `giscus-one-thread` |

```diff
-  script.setAttribute('data-mapping', 'pathname')
+  /**
+   * One thread per post for every locale: `pathname` would split /blogs/<id>
+   * and /en/blogs/<id>. The term equals the title `pathname` used to give
+   * the VI page, so threads created before this keep matching.
+   */
+  script.setAttribute('data-mapping', 'specific')
+  script.setAttribute('data-term', `blogs/${props.postId}`)
```
```diff
-      <ThemePostComments />
+      <ThemePostComments :post-id="modelValue._id" />
```

## Command
`npm run build` · `npm run lint` · `npx nuxi typecheck` · `npm test` (repo root, per `doctrine/MEMORY.md`)

## Output
```
$ npm run build   (tail)
[nitro] ✔ You can preview this build using node .output/server/index.mjs
◆ ✨ Build complete in 15.3s!
build exit 0

$ npm run lint
> nuxt-app@1.13.2 lint
> eslint .
(no problems printed)

$ npx nuxi typecheck   (tail)
[nuxt:icon] ✔ Nuxt Icon discovered local-installed 3 collections: fe, grommet-icons, heroicons
tc exit 0

$ npm test   (tail)
 Test Files  10 passed (10)
      Tests  30 passed (30)
```

## Browser verification
Built server (`node .output/server/index.mjs`, PORT=3123) with the PUBLIC Giscus IDs read from the live payload (`curl -s https://resume-nuxt-vert.vercel.app/blogs/67123bdf9c6e9bcf4f7bf006 | grep -o 'GISCUS_[A-Z_]*:"[^"]*"'` → `GISCUS_CATEGORY_ID:"DIC_kwDOM3bPGs4DDqo8"`, `GISCUS_CATEGORY:"Announcements"`, `GISCUS_REPO_ID:"R_kgDOM3bPGg"`), passed as `NUXT_PUBLIC_GISCUS_*`. (`.env` not read — operator denied that read.) Chrome CDP :9888 via Playwright MCP, tab `visibilityState: 'visible'`:
- `/blogs/67123bdf9c6e9bcf4f7bf006` → `iframe.giscus-frame` src `term: 'blogs/67123bdf9c6e9bcf4f7bf006'`
- `/en/blogs/67123bdf9c6e9bcf4f7bf006` → `term: 'blogs/67123bdf9c6e9bcf4f7bf006'`, widget path `/en/widget`, iframe height 532
- Existing thread still matched: `curl -s "https://giscus.app/api/discussions?repo=datvt243/datvt243.github.io&term=blogs%2F67123bdf9c6e9bcf4f7bf006&category=Announcements&number=0&strict=false&last=1"` → discussion url `https://github.com/datvt243/datvt243.github.io/discussions/183` (the thread titled `blogs/67123bdf9c6e9bcf4f7bf006`).
- Console (all, both loads): 0 app errors. 1 error from a Chrome extension in the debug profile (`chrome-extension://nhdogjmejiglipccpnnnanhbledajbpd/dist/prepare.js` blocked by the Report-Only CSP), 2 warnings `Permissions-Policy ... 'interest-cohort'` (giscus iframe header).

## Acceptance
| Criterion | Evidence |
|---|---|
| (1) mapping `specific` + term `blogs/<_id>`, same on both locales | Diff above; Browser verification: both locales `term: 'blogs/67123bdf9c6e9bcf4f7bf006'`; giscus API → discussions/183 |
| (2) feature doc Behavior 7 + Changelog | `## Feature doc changed` above |
| (3) build+lint+typecheck+test clean | Output: `Build complete`, build exit 0; lint no problems; tc exit 0; `Tests  30 passed (30)` |
| Only caller updated | `grep -rn "PostComments" themes pages app.vue components` → `themes/portfolio-dev/pages/post/Detail.vue:80:      <ThemePostComments :post-id="modelValue._id" />` (only match) |
| comments per code-comments.md | One `/** */` block added in `Comments.vue` (multi-sentence → `/** */`), states WHY (locale split, keeps old threads), no issue refs |

## Supersedes: none
`grep -n "#432" haven/diagrams/dev-loop.prime-mermaid.md` → only the `giscus-one-thread` row (line 85).

## Review
`/code-review medium` (forked agent af020104140099304), 4 findings:
1. `data-strict='0'` fuzzy title search could match an `en/blogs/<id>` thread → **false positive for this repo's data**: `gh api graphql -f query='{repository(owner:"datvt243",name:"datvt243.github.io"){discussions(first:20){nodes{title category{name}}}}}'` → only `Announcements	blogs/67123bdf9c6e9bcf4f7bf006` and `Welcome to datvt243.github.io Discussions!` — no `en/blogs/*` thread exists, and after this diff none can be created. Switching to `strict=1` would BREAK the existing thread: strict matches a SHA-1 of the term stored in the discussion body, which #183 (created non-strict) lacks. Kept `0`.
2. Existing `en/blogs/<id>` threads orphaned → **false positive**: same query, zero such threads.
3. `postId` read once on mount → **false positive today**: `<NuxtPage>` default key is the param-interpolated route path, so `/blogs/A` → `/blogs/B` remounts `Comments.vue`; behaviour identical to the old `pathname` mapping. Moved to Noticed.
4. Doc doesn't mention strict → follows from #1; no change.

## Noticed, not done
- `Comments.vue` doesn't watch `postId`; relies on page remount per post (review finding 3) — same as before this diff.
- Discussion titles for posts with NO prior thread will now be `blogs/<id>` from either locale (Giscus creates it on first comment) — intended.

## Seal gate: none (no commit/push/delete in this pass)
