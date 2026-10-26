# 2026-10-26 - blog-isr-fallback (verdict: SEAL)

- Worker: verifier · Version: 0.1.0
- Node: `blog-isr-fallback` (issue #287, branch `bug/287`)
- New PM status: SEALED
- Notes audited: `evidence/implementer/2026-10-26/blog-isr-fallback-plan.md`, `evidence/implementer/2026-10-26/blog-isr-fallback-diff.md`

## Isolation proof
Separate subagent, spawned through the Agent tool with the task "You are the agent-hub **verifier** ... Node: `blog-isr-fallback`, issue #287". The implementer's notes record the task "issue #287 ... branch `bug/287` off freshly pulled `staging` (`1d94fb6`)". This context did not write the diff. Unlike the default `EvidenceOnly` audit, the operator's spawn instructions asked this pass to read `git diff`, grep the consumers and re-run every check, so this pass did that.

## Is the issue's acceptance met without hiding the nav?
The issue's only acceptance item is "Không còn link nav tới trang rỗng" (no nav link to an empty page). Its evidence is a timeout: the upstream timed out, the handler fell back to `emptyResult`, and the result was a 200 "No data" page. Production now has 4 posts (the implementer's note, and my own API-up run: `"total":4`). So the page was empty only because the failure path turned an outage into an empty 200. With this change, `_blogs` can lead to one of three things, and none of them is an empty page:
- the posts;
- the last good ISR render of `/blogs`, because Vercel keeps the cached page when a revalidation returns a non-200 status (the same mechanism the resume-isr-fallback seal checked against Vercel's docs);
- an error page with a retry, or ListRender's error and "Try again" on client nav.

Hiding the nav would only treat the symptom, and it would cost a blog-API call on every page render. I accept the decision. A blog with 0 posts would still show "No data", but that is a correct empty state, not the bug reported here.

## Reasoning
| Check | Result |
|---|---|
| Step 4: commands match MEMORY.md | build, lint and typecheck are all present. No `npm test`. |
| Step 5: truncation | The note gives the key line or rc for each command. My re-run below matches it. |
| Step 6: visual/behavior | Note: CDP JSON `clientNavDown {"alert":true,"text":"Couldn't load this content.Try again"}`, `afterRetryUp {"alert":false,"items":4}`. **My re-run (CDP :9888, separate incognito context, server-side failure, not request interception):** `{"downClientNav":{"alert":true,"noData":false,"text":"Couldn't load this content.Try again"},"upAfterRetry":{"alert":false,"items":4}}`. |
| AC1: API down gives 503, not 200 "No data" | **My re-run on a fresh server with BLOGFAIL on:** `/blogs 503`, h1 "Đã có lỗi phía máy chủ"; `/en/blogs 503`, h1 "Something went wrong on our side", page text "...Try again Go to the homepage"; "No data" ×0 on both. `/api/blogs/posts?page=1` returned `503 {"statusCode":503,"statusMessage":"Unable to load posts"}`. |
| AC2: API up gives the posts | **My re-run, same server, flag removed:** `/blogs 200`, `/en/blogs 200`, h1 `_blog`, the post "iTerm2" is present, `"total":4`. |
| AC3: client nav gives error + retry | The CDP line above. |
| AC4: sitemap and rss stay 200 when the API is down | **My re-run:** `/sitemap.xml 200`, `/rss.xml 200` (`/en 200`). |
| AC5: build, lint, typecheck; comments per code-comments.md | Re-run below is clean. Comments: `posts.ts` has a `/** */` WHY (an empty 200 would be ISR-cached as the real page), and `Index.vue` has a `/** */` WHY (a failed server render must end as a 5xx). Both explain why, not what, and neither has a `(#N)` ref. |
| Other consumers | `grep` finds that `cacheGetPosts` is used by `server/api/blogs/posts.ts`, `server/routes/sitemap.xml.ts:22` and `server/routes/rss.xml.ts:29`. Both routes keep their own try/catch, as confirmed by the 200s above. `/api/blogs/posts` is used only by `themes/portfolio-dev/pages/blogs/Index.vue`. `emptyResult` is still used inside `cacheGetPost.ts:50`, so keeping the export is correct. |
| Step 7b: Supersedes / Still open | The active diagram has no other #287 row. The note's "Noticed, not done" names the 2 gaps. |
| Step 8: forbidden states | ADHOC_WORK: no, the node row exists. NO_EVIDENCE: no. EDIT_UNVERIFIED: no. CODE_IN_HAVEN: no, only the diagram row is under `haven/`. DIAGRAM_DRIFT: no, the row is SEALED here. |
| Step 9: seal gate | No commit, push or PR. "none" is acceptable. |
| Step 10: proportionality | 2 source files: one changed catch in `posts.ts` and one server-only guard in `Index.vue`. Nothing beyond the node. |

## Re-run
full (build, lint, typecheck, curl runtime and CDP). This is the operator-requested exception: an outward-facing caching change on a production route. I sourced `scratchpad/p0/env.sh` from a warm cache, without deleting `.nuxt` or `.output`.
```
npm run build → "◆ ✨ Build complete in 13.3s!"
npm run lint → "> eslint ." only, rc=0
npx nuxi typecheck → 0 "error TS"
mock :4199 (m=ok) + .output on :4143 with --import scratchpad/p1/blogfail.mjs
== BLOGFAIL on, fresh server
/blogs 503 2.11s · /en/blogs 503 2.04s · "No data" 0/0 · /api/blogs/posts 503 · /sitemap.xml 200 · /rss.xml 200 · /en 200
CDP: {"downClientNav":{"alert":true,"noData":false,"text":"Couldn't load this content.Try again"},"upAfterRetry":{"alert":false,"items":4}}
== BLOGFAIL removed
/blogs 200 h1 _blog, iTerm2 · /en/blogs 200 h1 _blog, iTerm2 · api "total":4
```
I stopped both servers and removed the BLOGFAIL flag. The script and screenshots are in `scratchpad/v287/`.

## Not blocking, recorded
- `nuxt.config.ts` routeRules have `/blogs` with `isr: 60` but no `/en/blogs` entry, unlike the resume routes. On `/en/blogs`, an outage now shows the 503 error page with a retry instead of "No data", which still meets the acceptance. "ISR keeps the last good render" applies only to `/blogs`. A possible follow-up node would add `/en/blogs`.
- `cacheGetPost.ts:50`: an upstream reply that is well-formed but has `status:false` or no `data` still returns `emptyResult`. Nitro caches that for 1h, and it would render as a 200 "No data". This path existed before this change and is not the timeout path in the issue's evidence.
- The 6s upstream timeout per failing client navigation is unchanged. It is in the issue's impact section but not in its acceptance.

## Missing
none
