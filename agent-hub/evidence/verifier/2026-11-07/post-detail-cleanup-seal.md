# 2026-11-07 - post-detail-cleanup (SEAL)
- Worker: verifier · Version: 0.1.0
- Node: `post-detail-cleanup` (#431, branch `bug/431`, uncommitted)
- Note audited: `evidence/implementer/2026-11-07/post-detail-cleanup-diff.md`
- Verdict: **SEAL**

## Isolation proof
Fresh subagent spawned as "pass 2 of `/todo #431`", task string `verifier "#431 Blog post: real <time datetime>, rename the detail cache, drop the dead Missing ID branch"`. I saw only the implementer's note on disk, not its reasoning.

## Re-run
full. Reason: the operator's `/todo` spawn asked me to re-run build, lint, typecheck, test and the runtime check. The node is also outward-facing (production blog page SSR + API cache).

## Commands (doctrine/MEMORY.md, repo root)
`npm run build` — exit 0:
```
Σ Total size: 99.4 MB (81 MB gzip)
[@nuxt/image] ℹ sharp binaries have been included in your build for darwin-arm64. Make sure you deploy to the same architecture.
[nitro] ✔ You can preview this build using node .output/server/index.mjs
config 162ms · modules 710ms · app 596ms · types 351ms · client 2.48s · server 1.64s · nitro 8.62s
◆ ✨ Build complete in 14.5s!
exit 0
```
`npm run lint` — exit 0:
```
> nuxt-app@1.13.0 lint
> eslint .
```
`npx nuxi typecheck` — exit 0:
```
ℹ Nuxt Icon server bundle mode is set to local
[nuxt:icon] ✔ Nuxt Icon discovered local-installed 3 collections: fe, grommet-icons, heroicons
```
`npm test`:
```
 Test Files  10 passed (10)
      Tests  27 passed (27)
   Start at  16:59:55
   Duration  220ms (import 42%, transform 30%, tests 18%, worker 9%)
```
Runtime: `PORT=3941 node .output/server/index.mjs` against the real blog API. Upstream list gave `67123bdf9c6e9bcf4f7bf006 2024-10-18T10:43:43.254Z` and `671240459c6e9bcf4f7bf00d 2024-10-18T11:02:29.040Z`.
```
/blogs/67123bdf9c6e9bcf4f7bf006: <time datetime="2024-10-18T10:43:43.254Z">18/10/2024</time>
/blogs/671240459c6e9bcf4f7bf00d: <time datetime="2024-10-18T11:02:29.040Z">18/10/2024</time>
/en/blogs/671240459c6e9bcf4f7bf00d: <time datetime="2024-10-18T11:02:29.040Z">18/10/2024</time>
detail-404 404
{"status":true,"data":{"_id":"671240459c6e9bcf4f7bf00d","title":"Post in the sky
```
There are 0 occurrences of `2023-08-05` in the second post's HTML. A different post gives a different `datetime`, so the value is not hard-coded.

## Acceptance
| Criterion | Evidence | OK |
|---|---|---|
| (1) `<time datetime>` = post `createdAt` (ISO) | The runtime output above matches the upstream `createdAt` for 2 posts, on both `/blogs` and `/en/blogs`. `Detail.vue:27` `<time :datetime="modelValue.createdAt">`. The node text says "mocked post page"; a real upstream post is stronger proof. | yes |
| (2) cache `name: 'api-post-detail'` | `server/api/blogs/detail/[id].ts:34`. `api-resume` is now only in `server/api/resume.ts`. | yes |
| (3) "Missing ID" branch removed | grep finds no `Missing ID` in the handler. Unknown id still gives 404, which keeps Behavior #3. | yes |
| (4) build + lint + typecheck + test clean | outputs above | yes |
| #416 timeout intact | `[id].ts:18` `{ timeout: 6000, retry: 0 }` | yes |
| comments per code-comments.md | the note says "no comment added or changed". The diff stat has 3 insertions, none of them comments. | yes |

## Feature doc
`doctrine/features/blog-post.md`: this fix covers OQ1/OQ3/OQ4 (operator answers recorded). Behavior #1–#3 and #6 are still consistent. Status is unchanged because it is a fix SEAL. No `## Feature doc changed`. No doctrine proposal.

## Forbidden states
none hit. Node is on the diagram (no ADHOC_WORK). Evidence is present. Every claim was re-run. No code in haven. The diagram is updated on SEAL.

## Proportionality
The diff stat is 3 files, +3/−10, all in scope. Seal gate is not applicable (no commit/push).

## PM
`post-detail-cleanup` is set to SEALED. Its full row is archived and the active row is now a pointer. The oldest pointer row (`hero-greeting-whoami`) was dropped to keep 20 pointers.

## Noticed (from the implementer note, not graded)
`Item.vue:34` puts `dd/mm/yyyy` in `datetime`. This is a follow-up issue candidate.
