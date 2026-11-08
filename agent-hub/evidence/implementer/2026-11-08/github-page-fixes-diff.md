# 2026-11-08 - github-page-fixes (diff)
- Worker: implementer · Version: 0.1.0
- Node: `github-page-fixes` in `haven/diagrams/dev-loop.prime-mermaid.md`
- Task: "#436 GitHub page: fix "no data" check, case-insensitive search, locale dates, empty state, new-tab profile link" (issue body: `||` → `&&` in GitUser.vue; case-insensitive search; date by current locale; localized "no repositories match" state; profile link opens in a new tab with `noopener noreferrer`)
- Plan: `evidence/implementer/2026-11-08/github-page-fixes-plan.md`

## Hub bytes before: 94004

## Feature doc: doctrine/features/github-profile.md
## Feature doc changed: Behavior #4 "name linking to the GitHub profile" → "+ (new tab)"; #6 "by substring" → "by case-insensitive substring … No repo left → a localized "no repositories match" message"; #7 date "+ formatted in the current locale (`vi-VN` / `en-US`, UTC calendar date)"; Changelog row 2026-11-08 — operator: Open questions 1-5 answers (2026-11-07): "Bug: `&&`", "Bug: case-insensitive", "Bug: format by locale", "Bug: add one", "Change: new tab" — all #436

## Diff
| File | Why |
|---|---|
| `themes/portfolio-dev/pages/github/GitUser.vue` | `||` → `&&` in the no-data guard; profile link `target="_blank" rel="noopener noreferrer"` |
| `themes/portfolio-dev/pages/github/GitRepos.vue` | search lower-cases both sides; `<p v-if="!getRepos.length">{{ t('github.noMatch') }}</p>` after the list |
| `themes/portfolio-dev/pages/github/part/Item.vue` | date locale `'en-US'` → `localeProperties.value.language` (still `timeZone: 'UTC'`); comment's first line reworded since the call now passes a locale |
| `i18n/locales/vi.json`, `en.json` | `github.noMatch`: "Không có repository nào khớp" / "No repositories match" |
| `agent-hub/doctrine/features/github-profile.md` | Behavior + Changelog (above) |
| `agent-hub/haven/diagrams/dev-loop.prime-mermaid.md` | new PENDING row `github-page-fixes` |

```diff
diff --git a/i18n/locales/en.json b/i18n/locales/en.json
index 969dbfe..6398bfd 100644
--- a/i18n/locales/en.json
+++ b/i18n/locales/en.json
@@ -98,6 +98,7 @@
     "followers": "followers",
     "following": "following",
     "noData": "NO data",
+    "noMatch": "No repositories match",
     "updatedOn": "Updated on",
     "repoWebsite": "{name} website",
     "repoSource": "{name} on GitHub"
diff --git a/i18n/locales/vi.json b/i18n/locales/vi.json
index d9de6fa..49c2cae 100644
--- a/i18n/locales/vi.json
+++ b/i18n/locales/vi.json
@@ -98,6 +98,7 @@
     "followers": "người theo dõi",
     "following": "đang theo dõi",
     "noData": "Không có dữ liệu",
+    "noMatch": "Không có repository nào khớp",
     "updatedOn": "Cập nhật vào",
     "repoWebsite": "Website {name}",
     "repoSource": "{name} trên GitHub"
diff --git a/themes/portfolio-dev/pages/github/GitRepos.vue b/themes/portfolio-dev/pages/github/GitRepos.vue
index 98c798b..b011fce 100644
--- a/themes/portfolio-dev/pages/github/GitRepos.vue
+++ b/themes/portfolio-dev/pages/github/GitRepos.vue
@@ -17,7 +17,8 @@ const getRepos = computed(() => {
   let resule = toValue(props.repos)
 
   if (search.value) {
-    resule = resule.filter((e: GitRepos) => e?.name.includes(search.value))
+    const query = search.value.toLowerCase()
+    resule = resule.filter((e: GitRepos) => e?.name.toLowerCase().includes(query))
   }
 
   return resule
@@ -52,6 +53,7 @@ const getRepos = computed(() => {
           <ThemeGithubPartItem :model-value="res" />
         </li>
       </TransitionGroup>
+      <p v-if="!getRepos.length" class="py-4 text-theme-faint">{{ t('github.noMatch') }}</p>
     </div>
   </div>
 </template>
diff --git a/themes/portfolio-dev/pages/github/GitUser.vue b/themes/portfolio-dev/pages/github/GitUser.vue
index 21f1ef8..805253a 100644
--- a/themes/portfolio-dev/pages/github/GitUser.vue
+++ b/themes/portfolio-dev/pages/github/GitUser.vue
@@ -22,13 +22,15 @@ const bioText = computed(() => props.user.bio?.replace(/\r\n?/g, '\n'))
 </script>
 <template>
   <div class="git-user font-theme-mono">
-    <div v-if="props.user || Object.keys(props.user).length">
+    <div v-if="props.user && Object.keys(props.user).length">
       <template v-if="props.user.avatar_url">
         <NuxtImg :src="props.user.avatar_url" :alt="props.user.login" class="w-24 h-24 rounded-lg mb-4 border border-theme-border-subtle" />
       </template>
       <p class="space-x-1 flex items-center">
         <a
           :href="props.user.html_url"
+          target="_blank"
+          rel="noopener noreferrer"
           class="font-bold text-theme-accent hover:text-theme-accent-soft hover:underline transition-colors"
         >{{ props.user.name }}</a
         >
diff --git a/themes/portfolio-dev/pages/github/part/Item.vue b/themes/portfolio-dev/pages/github/part/Item.vue
index 529976f..f24819f 100644
--- a/themes/portfolio-dev/pages/github/part/Item.vue
+++ b/themes/portfolio-dev/pages/github/part/Item.vue
@@ -2,7 +2,7 @@
 import type { GitRepos } from '@/types/github'
 import { accentBadgeUi } from '~/utils'
 
-const { t } = useI18n()
+const { t, localeProperties } = useI18n()
 const props = defineProps<{
   modelValue: GitRepos
 }>()
@@ -31,7 +31,7 @@ const getFieldValue = (field: LinkField): string | null => {
 }
 
 /**
- * toLocaleDateString() with no options resolves the calendar date in the
+ * toLocaleDateString() without a timeZone resolves the calendar date in the
  * RUNTIME's local timezone - the SSR server (Vercel, UTC) and a real
  * browser client (e.g. UTC+7) can compute a different date for the same
  * instant when it falls near a UTC day boundary, causing a Vue hydration
@@ -43,7 +43,7 @@ const getFieldValue = (field: LinkField): string | null => {
  * would be out of order.
  */
 const updatedOnLabel = computed(() =>
-  new Date(props.modelValue.pushed_at).toLocaleDateString('en-US', { timeZone: 'UTC' }),
+  new Date(props.modelValue.pushed_at).toLocaleDateString(localeProperties.value.language, { timeZone: 'UTC' }),
 )
 </script>
 
```

## Command
From the repo root (verbatim from `doctrine/MEMORY.md`): `npm run build`, `npm run lint`, `npx nuxi typecheck`, `npm test`.

## Output
```
build exit 0 · lint exit 0 · typecheck exit 0 · test exit 0
--- npm run build (tail)
◆ ✨ Build complete in 15.0s!
--- npm run lint

> nuxt-app@1.13.1 lint
> eslint .

--- npx nuxi typecheck (tail)
ℹ Nuxt Icon server bundle mode is set to local
[nuxt:icon] ✔ Nuxt Icon discovered local-installed 3 collections: fe, grommet-icons, heroicons
--- npm test (tail)
 Test Files  10 passed (10)
      Tests  28 passed (28)
   Start at  20:20:51
   Duration  227ms (transform 41%, import 35%, tests 15%, worker 9%)

```

## Runtime check (local prod build)
Resume backend mocked (both `NODE_API` and `NUXT_PUBLIC_NODE_API` = 127.0.0.1:4599 at build and run); `/api/github` hits the real GitHub API (not the rate-limited resume backend). `PORT=3456 node .output/server/index.mjs`. Server log `grep -c onrender` → 0.
```
/github 200
/en/github 200
-- vi
Cập nhật vào 8/11/2026
<a href="https://github.com/datvt243" target="_blank" rel="noopener noreferrer" class="font-bold text-theme-accent ...">
-- en
Updated on 11/8/2026
<a href="https://github.com/datvt243" target="_blank" rel="noopener noreferrer" class="font-bold text-theme-accent ...">
```

## Browser verification
Playwright, a new tab of its own on the operator's Chrome (closed afterwards), `document.visibilityState` = `visible`.
- `/github`: 22 repos; dispatching `/` → `slashFocusesSearch: true`.
- Search `RESUME-NODE` (2.5s wait for the 500ms debounce + leave transition) → only `resume-nodejs-api`, no empty message.
- Search `zzzz-no-such-repo` → `names: []`, `empty: "Không có repository nào khớp"`; cleared → list back, `empty: null`.
- `/en/github`: search `zzzz` → `emptyEn: "No repositories match"`.
- Click sidebar button "Vue" → `{ count: 5, languages: ["Vue"] }`.
- Console (warning level, `/en/github`): `Total messages: 0 (Errors: 0, Warnings: 0)` — no hydration warnings with the locale date.
- Note: a first probe read the list 900ms after input and got the previous query's rows (TransitionGroup leave animation still in the DOM); re-measured with 2.5s waits and excluding `*-leave-*` rows — the results above.

## Acceptance
| Criterion | Evidence |
|---|---|
| (1) `&&` guard | diff: `-    <div v-if="props.user || Object.keys(props.user).length">` / `+    <div v-if="props.user && Object.keys(props.user).length">` |
| (2) case-insensitive search | browser: `RESUME-NODE` → `resume-nodejs-api` |
| (3) date by locale, UTC, no hydration warning | SSR `Cập nhật vào 8/11/2026` vs `Updated on 11/8/2026`; console `Errors: 0, Warnings: 0` |
| (4) localized empty state | browser: "Không có repository nào khớp" / "No repositories match" |
| (5) profile link new tab | SSR `<a href="https://github.com/datvt243" target="_blank" rel="noopener noreferrer"` (vi + en) |
| (6) language filter + `/` still work | `slashFocusesSearch: true`; Vue → `{ count: 5, languages: ["Vue"] }` |
| (7) doc updated | `## Feature doc changed` above |
| (8) build+lint+typecheck+test clean | `build exit 0 · lint exit 0 · typecheck exit 0 · test exit 0`; `Tests  28 passed (28)` |
| comments per code-comments.md | one comment touched: `Item.vue` JSDoc first line "with no options" → "without a timeZone" (still the WHY for pinning UTC); no new comments |

## Supersedes: none
`grep -n "#436" haven/diagrams/dev-loop.prime-mermaid.md` → only `github-page-fixes`.

## Noticed, not done
- `en.json` `github.noData` is "NO data" (odd casing) — out of scope.
- `GitRepos.vue` variable `resule` (typo) left as is (SmallestDiff).
- No unit test: the changes are template/one-line logic inside components; the project's Vitest suite covers pure functions only — verified in the browser instead.

## Seal gate: none (no commit/push/PR in this pass)
