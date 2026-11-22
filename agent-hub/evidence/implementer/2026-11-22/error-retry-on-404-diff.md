# 2026-11-22 - error-retry-on-404 (diff)
- Worker: implementer · Version: 0.1.0
- Node: `error-retry-on-404` in `haven/diagrams/dev-loop.prime-mermaid.md`
- Task: "#428 Error page: add \"Try again\" on 404 too — Problem: The 404 page only has \"Go to the homepage\"; \"Try again\" (full reload) is shown for other codes only. Expected: 404 also shows \"Try again\" (full page reload), next to the homepage button. Decided by the operator while confirming agent-hub/doctrine/features/error-page.md (2026-11-07)."
- Plan: `evidence/implementer/2026-11-22/error-retry-on-404-plan.md`

## Hub bytes before: 93594
## Feature doc: doctrine/features/error-page.md
## Feature doc changed: Behavior #2 "…text, and a "Go to the homepage" button." → "…text, a "Try again" button (full page reload, as in #3) and a "Go to the homepage" button."; Acceptance criteria #1 + "It also contains "Thử lại" (Try again) and "Về trang chủ" (#428)."; Changelog row added — operator: Open question 2 answer (2026-11-07) "Change: add it on 404 too — #428"

## Diff
| File | Why |
|---|---|
| `error.vue` | Delete `v-if="!isNotFound"` on the retry button (1 line). `retry()` and the `error.retry` key (`i18n/locales/{vi,en}.json:114`) already exist. |
| `agent-hub/doctrine/features/error-page.md` | Behavior #2, Acceptance criteria #1, Changelog (see above). |
| `agent-hub/haven/diagrams/dev-loop.prime-mermaid.md` | New node row `error-retry-on-404` (IN_PROGRESS). |

```
diff --git a/error.vue b/error.vue
index b2986c9..72f2a8a 100644
--- a/error.vue
+++ b/error.vue
@@ -40,7 +40,6 @@ function retry() {
               <h1 class="my-2 font-bold text-2xl">{{ isNotFound ? t('error.notFoundTitle') : t('error.serverTitle') }}</h1>
               <p class="my-3">{{ isNotFound ? t('error.notFoundText') : t('error.serverText') }}</p>
               <button
-                v-if="!isNotFound"
                 class="sm:w-full lg:w-auto my-2 mr-2 border rounded-sm md py-3 px-8 text-center bg-theme-accent text-theme-accent-contrast hover:bg-theme-accent-soft focus:outline-hidden focus:ring-2 focus:ring-theme-accent/50"
                 @click="retry"
               >
```

## Command
`npm run build` · `npm run lint` · `npx nuxi typecheck` · `npm test` (verbatim from `doctrine/MEMORY.md`, repo root)
Runtime: `PORT=3428 node .output/server/index.mjs`, then:
- `curl -s -o /dev/null -w '%{http_code}\n' localhost:3428/does-not-exist` and `…/en/does-not-exist`
- `curl -s -H 'Accept: text/html' localhost:3428/does-not-exist | grep -o 'Trang này không tồn tại\|Thử lại\|Về trang chủ' | sort | uniq -c` (+ EN strings for `/en/does-not-exist`)
- Browser: fresh headless Chrome via `puppeteer.launch` (no-extensions temp profile, per PROJECT.md trap), script at scratchpad `reload.mjs`: goto each 404 URL, set `window.__marker = 1`, click the first button, wait for navigation, read button labels, navigation responses, URL and marker.

## Output
Exit codes: `build exit 0` · `lint exit 0` · `tc exit 0` · `test exit 0`

build (tail):
```
[nitro] ✔ You can preview this build using node .output/server/index.mjs
config 196ms · modules 607ms · app 550ms · types 345ms · client 2.51s · server 1.64s · nitro 8.51s
◆ ✨ Build complete in 14.3s!
```

lint (full):
```

> nuxt-app@1.14.0 lint
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
      Tests  30 passed (30)
   Start at  20:27:36
   Duration  213ms (import 38%, transform 34%, tests 18%, worker 7%)
```

runtime curl:
```
404
   1 Thử lại
   1 Trang này không tồn tại
   1 Về trang chủ
404
   1 Go to the homepage
   1 This page doesn&#39;t exist
   1 Try again
```

browser:
```
/does-not-exist ["Thử lại","Về trang chủ"] | navs: ["404 http://localhost:3428/does-not-exist","404 http://localhost:3428/does-not-exist"] | after click url: http://localhost:3428/does-not-exist | window marker: gone
/en/does-not-exist ["Try again","Go to the homepage"] | navs: ["404 http://localhost:3428/en/does-not-exist","404 http://localhost:3428/en/does-not-exist"] | after click url: http://localhost:3428/en/does-not-exist | window marker: gone
pageerrors: 0
```
(First 2 script runs failed with `ERR_MODULE_NOT_FOUND` for `puppeteer-core` — script lived outside the repo; fixed by `createRequire(<repo>/package.json)`. Not an app issue.)

## Acceptance
| Criterion | Evidence |
|---|---|
| 1. 404 HTML has "Thử lại" + "Về trang chủ"; EN has "Try again" + "Go to the homepage" | runtime curl: both `404`, each string count `1` |
| 2. "Try again" on 404 fully reloads the same URL | browser: 2nd navigation response to the same URL, URL unchanged, `window marker: gone` (JS context replaced = full reload, not client re-render), 0 page errors, both locales |
| 3. Feature doc Behavior #2 + Changelog updated | `## Feature doc changed` above; `git diff agent-hub/doctrine/features/error-page.md` |
| 4. build + lint + typecheck + test clean | `Build complete`, eslint no output, typecheck 0 `error TS`, `Tests 30 passed (30)`, all exit 0 |
| comments per code-comments.md | Diff adds/changes no code comment |

## Supersedes: none
`grep -n "#428" haven/diagrams/dev-loop.prime-mermaid.md` → only line 85 (this node).
## Still open: none

## Review
`/code-review medium` (background fork) on the uncommitted diff: no correctness findings. 3 findings:
- Button order/weight on 404 ("Try again" first, same style as homepage) → `## Noticed, not done`: the issue asks for the button "next to the homepage button", same as other codes; reordering/restyling is a UX decision for the operator.
- `retry()` reloads `window.location`, which may be the previous URL if a fatal 404 fires before the router commits during client navigation → `## Noticed, not done`: pre-existing behavior of `retry()` (already shown for 5xx), not introduced here; the doc's Edge case records "reloads the URL".
- Feature doc Acceptance criteria didn't check "Try again" on 404 → fixed (Acceptance criteria #1 extended). OQ2's question text left as-is — it's the historical question with its answer.

## Noticed, not done
- 404: consider making "Go to the homepage" primary (first / filled) and "Try again" secondary — operator's call.
- `retry()` on a client-navigation fatal error may reload the previous URL (pre-existing, all codes).
- Carried from `error-legacy-block`: `error.vue` `<!-- component -->` comment; `handleError` → `goHome` rename.

## Seal gate: none (no outward-facing action)
