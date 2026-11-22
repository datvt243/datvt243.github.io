# 2026-11-22 - error-legacy-block (diff)
- Worker: implementer · Version: 0.1.0
- Node: `error-legacy-block` in `haven/diagrams/dev-loop.prime-mermaid.md`
- Task: "#427 error.vue: remove the commented-out legacy block — Problem: error.vue keeps a large commented-out legacy block. Expected: Delete it (git history keeps it). Feature doc: agent-hub/doctrine/features/error-page.md. Branch feature/427 already checked out off staging."
- Plan: `evidence/implementer/2026-11-22/error-legacy-block-plan.md`

## Hub bytes before: 93694
## Feature doc: doctrine/features/error-page.md (not changed — Behavior unaffected; OQ1 already records the "remove — #427" answer)

## Diff
| File | Why |
|---|---|
| `error.vue` | Delete the 10-line commented-out `<div class="error-page …">` legacy block (old lines 63-72). Nothing else. |
| `agent-hub/haven/diagrams/dev-loop.prime-mermaid.md` | New node row `error-legacy-block` (IN_PROGRESS). |

```
diff --git a/error.vue b/error.vue
index 0346a7b..b2986c9 100644
--- a/error.vue
+++ b/error.vue
@@ -60,15 +60,5 @@ function retry() {
         <NuxtImg src="error.png" alt="" />
       </div>
     </div>
-    <!-- <div class="error-page w-[400px] mx-auto">
-            <h2 class="text-8xl">{{ props.error.statusCode }}</h2>
-            <p>Something wrong here</p>
-            <button
-                class="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded-sm"
-                @click="handleError"
-            >
-                Clear errors
-            </button>
-        </div> -->
   </NuxtLayout>
 </template>
```

## Command
`npm run build` · `npm run lint` · `npx nuxi typecheck` · `npm test` (verbatim from `doctrine/MEMORY.md`, repo root)
Runtime: `PORT=3427 node .output/server/index.mjs`, then `curl -s -o /dev/null -w '%{http_code}\n' localhost:3427/does-not-exist` and `curl -s -H 'Accept: text/html' localhost:3427/does-not-exist | grep -o 'Trang này không tồn tại\|Về trang chủ\|Clear errors' | sort | uniq -c`

## Output
Exit codes: `build exit 0` · `lint exit 0` · `tc exit 0` · `test exit 0`

build (tail):
```
[nitro] ✔ You can preview this build using node .output/server/index.mjs
config 228ms · modules 685ms · app 631ms · types 388ms · client 2.70s · server 1.76s · nitro 9.34s
◆ ✨ Build complete in 15.7s!
```

lint (full):
```

> nuxt-app@1.13.2 lint
> eslint .

```

typecheck (full):
```
ℹ Nuxt Icon server bundle mode is set to local
[nuxt:icon] ✔ Nuxt Icon discovered local-installed 3 collections: fe, grommet-icons, heroicons
```
`grep -ci "error TS"` on typecheck output → `0`

test (tail):
```

 Test Files  10 passed (10)
      Tests  28 passed (28)
   Start at  18:55:15
   Duration  288ms (transform 43%, import 36%, tests 14%, worker 7%)

```

grep checks:
```
$ grep -n "error-page\|Clear errors" error.vue; echo "grep hits: $?"
grep hits: 1          # exit 1 = no match
$ grep -c "<!--" error.vue                 → 1   (the unrelated `<!-- component -->`, line 29)
$ git show staging:error.vue | grep -c "<!--"  → 2
```

runtime:
```
404
   1 Trang này không tồn tại
   1 Về trang chủ
```
("Clear errors" — the legacy block's text — absent, as before: it was never rendered.)

## Acceptance
| Criterion | Evidence |
|---|---|
| 1. Legacy block gone, `error-page`/`Clear errors` → 0 hits | `grep hits: 1` (no match); `<!--` count 2 → 1; diff shows only those 10 lines removed |
| 2. No rendered change (Behavior #1-#2) | built server: `404` + "Trang này không tồn tại" + "Về trang chủ" |
| 3. build + lint + typecheck + test clean | `Build complete`, eslint no output, typecheck 0 `error TS`, `Tests 28 passed (28)`, all exit 0 |
| comments per code-comments.md | Diff adds no comment; it removes commented-out code (a "Delete" class in the standard) |

No browser check: the removed lines were an HTML comment, never rendered; the SSR curl above covers the page.

## Supersedes: none
`grep -n "#427" haven/diagrams/dev-loop.prime-mermaid.md` → only line 85 (this node).
## Still open: none

## Review
`/code-review medium` on the uncommitted diff: no correctness findings. 3 cleanup findings:
- `<!-- component -->` at error.vue:29 is a leftover obvious comment → `## Noticed, not done` (not the "commented-out legacy block" the issue names; SmallestDiff).
- Feature doc has no changelog row for #427 → false positive for this pass: Behavior is unchanged, OQ1 already records the decision; the implementer edits the doc only on a Behavior contradiction (pick_next 5b).
- `handleError` would read better as `goHome` → `## Noticed, not done` (rename, out of scope).

## Noticed, not done
- `error.vue:29` `<!-- component -->` — restates nothing useful; delete in a later cleanup.
- `error.vue:15` `handleError` → `goHome` rename.
- #428 edits the same `isNotFound` button block; it runs next on its own branch `feature/428`.

## Seal gate: none (no outward-facing action)
