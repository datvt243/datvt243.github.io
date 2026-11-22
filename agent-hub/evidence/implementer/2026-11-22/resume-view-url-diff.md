# 2026-11-22 - resume-view-url (diff)

- Worker: implementer · Version: 0.1.0
- Node: `resume-view-url` (`haven/diagrams/dev-loop.prime-mermaid.md`, IN_PROGRESS)
- Task (verbatim, issue #422): "HR view: make it linkable with `?view=hr`" — `?view=hr` selects HR after mount (client only, like `?tab=`, so ISR still renders Dev); the toggle updates the query (`dev` removes it).
- Plan: `evidence/implementer/2026-11-22/resume-view-url-plan.md`
- Status: sealed_pending_verifier

## Hub bytes before: 93656

## Feature doc: agent-hub/doctrine/features/resume-view-toggle.md
## Feature doc changed: Behavior 10 "absent `?view` → Dev on Back/Forward" + edge case "Back/Forward to an entry without `?view` → Dev" → "no `?view` keeps the current view on any navigation, incl. Back/Forward; any value other than `hr` → Dev" (Behavior 10, 11, edge case, new open question 4, Changelog row) — operator: "No ?view keeps state (Recommended)" (AskUserQuestion 2026-11-22, raised by code-review finding 1/7: a link and a history pop with no `?view` can't be told apart without hooking router history).

## Diff
| File | Why |
|---|---|
| `themes/portfolio-dev/pages/resumeObject/Index.vue` | `applyViewQuery()`: `?view` present → state (`hr` → HR, else Dev); absent + state HR → `router.replace` adds `view=hr`. Run on mount (awaited, before the `?tab` deep link) and on `route.query.view` change. Watchers moved before the `await` so they stay bound to the instance. |
| `themes/portfolio-dev/layout/Header.vue` | Toggle now owns the URL: `navigateTo({ path: localePath('/'), query })` — on `/` replace in place keeping other params (`?tab`), elsewhere push `/?view=hr` (or `/` for Dev). |
| `composables/useResumeView.ts` | File doc: state is mirrored to `?view=hr` after mount. |

```diff
--- a/themes/portfolio-dev/layout/Header.vue
-// The HR view only exists on `/`, so switching from another page goes there.
+// The HR view only exists on `/`, so switching from another page goes there; on `/` the URL is replaced in place, keeping `?tab`.
 const toggleResumeView = () => {
   resumeView.value = resumeView.value === 'dev' ? 'hr' : 'dev'
-  if (!isActive('/')) navigateTo(localePath('/'))
+  const view = resumeView.value === 'hr' ? 'hr' : undefined
+  const onHome = isActive('/')
+  navigateTo({ path: localePath('/'), query: onHome ? { ...route.query, view } : { view } }, { replace: onHome })
 }
--- a/themes/portfolio-dev/pages/resumeObject/Index.vue
 const tabFromUrl = () => sections.find((s) => s.key === route.query.tab)?.key
+// No `?view` keeps the current view (an HR choice made elsewhere in this tab wins over a plain link to `/`); any other value than `hr` means Dev.
+const applyViewQuery = async () => {
+  const view = route.query.view
+  if (view !== undefined) resumeView.value = view === 'hr' ? 'hr' : 'dev'
+  else if (resumeView.value === 'hr') await router.replace({ query: { ...route.query, view: 'hr' } })
+}
 // Client-only, not in setup: `/` is ISR-cached, so the server HTML can't depend on the query.
-onMounted(() => {
-  const deepLinked = tabFromUrl()
-  if (deepLinked) select(deepLinked)
+onMounted(async () => {
+  // Registered before the await: a watcher created after it isn't stopped on unmount.
+  watch(() => route.query.view, applyViewQuery)
   // Keeps the tab in sync when the query changes without a remount (Back/Forward, `gr` clearing ?tab).
   watch(() => route.query.tab, () => (active.value = tabFromUrl() ?? sections[0]!.key))
+  // Awaited so the tab deep link below reads the updated query.
+  await applyViewQuery()
+  const deepLinked = tabFromUrl()
+  if (deepLinked) select(deepLinked)
 })
--- a/composables/useResumeView.ts
- * the header switch and `ThemeResumeObject`. Plain state, not a cookie: `/`
- * is ISR-cached, so the server must always render the default Dev view.
+ * the header switch and `ThemeResumeObject`. Plain state mirrored to `?view=hr`
+ * after mount, not a cookie: `/` is ISR-cached, so the server must always
+ * render the default Dev view.
```

## Command
Node v24.19.0 (`nvm use 24`, per the `Object.groupBy` trap), repo root, final diff, real env:
`npm run build` · `npm run lint` · `npx nuxi typecheck` · `npm test`
Browser build: same `npm run build` with `NODE_API`+`NUXT_PUBLIC_NODE_API=http://localhost:4199` (scratchpad mock), server `PORT=4188 node .output/server/index.mjs` with the same env.

## Output
- `npm run build` → exit `0`; `◆ ✨ Build complete in 15.4s!`. One line `WARN  node_modules/.cache/nuxt/.nuxt/dist/server/_nuxt/components-C1i8GQ3a.js (369:0): A comment` + `"/* @__NO_SIDE_EFFECTS__ */"` — generated Nuxt components chunk, not a file in this diff.
- `npm run lint` → exit `0`; output only `> nuxt-app@1.13.2 lint` / `> eslint .` (0 lines matching error|warning).
- `npx nuxi typecheck` → exit `0`; output `ℹ Nuxt Icon server bundle mode is set to local` / `[nuxt:icon] ✔ Nuxt Icon discovered local-installed 3 collections: fe, grommet-icons, heroicons`, no error lines.
- `npm test` → exit `0`; ` Test Files  10 passed (10)` / `      Tests  28 passed (28)`.
- Mock build → `build=0`; `curl -s 'http://localhost:4188/?view=hr' | grep -c "experiences.pug"` → `1`.
- `grep -c onrender server.log` → `0`; mock log: `1 GET /api/me/<email>`, `2 GET /api/me/<email>?lang=en`, `2 GET /api/me/<email>?lang=vi` (real backend never called).

## Browser verification
Headless Chrome via `puppeteer.launch` (fresh `userDataDir`, no extensions — Vimium trap), 1280×900, real clicks on header `dev/hr` button / header nav links / `g`+`r` keys / locale button. Page brought to front, `visibility visible` logged before step 15 (hidden-tab trap). Each line: URL, HR card (`.hr-heading`) present, editor panel (`experiences.pug`) present, `history.length`, skills tab (`skill-group.ts`). Verbatim:
```
1 load /                                     {"url":"/","hr":false,"dev":true,"hist":2,"skillsTab":false}
2 toggle -> hr                               {"url":"/?view=hr","hr":true,"dev":false,"hist":2,"skillsTab":false}
3 toggle -> dev                              {"url":"/","hr":false,"dev":true,"hist":2,"skillsTab":false}
4 nav /projects (dev)                        {"url":"/projects","hr":false,"dev":false,"hist":3,"skillsTab":false}
5 toggle on /projects -> /?view=hr           {"url":"/?view=hr","hr":true,"dev":false,"hist":4,"skillsTab":false}
6 nav /projects (hr state)                   {"url":"/projects","hr":false,"dev":false,"hist":5,"skillsTab":false}
7 header tab back to / (state wins)          {"url":"/?view=hr","hr":true,"dev":false,"hist":6,"skillsTab":false}
8 gr from /projects                          {"url":"/?view=hr","hr":true,"dev":false,"hist":8,"skillsTab":false}
9 language switch in hr                      {"url":"/en?view=hr","hr":true,"dev":false,"hist":9,"skillsTab":false}
10 Back                                      {"url":"/?view=hr","hr":true,"dev":false,"hist":9,"skillsTab":false}
11 fresh /?view=hr                           {"url":"/?view=hr","hr":true,"dev":false}
12 fresh /?view=foo                          {"url":"/?view=foo","hr":false,"dev":true}
13 fresh /projects?view=hr                   {"url":"/projects?view=hr","hr":false,"dev":false}
14 reload /?view=hr                          {"url":"?view=hr","hr":true}
visibility visible
15 fresh /?tab=skills&view=hr                {"url":"/?tab=skills&view=hr","hr":true,"dev":false,"hist":9,"skillsTab":false}
16 toggle -> dev keeps tab                   {"url":"/?tab=skills","hr":false,"dev":true,"hist":9,"skillsTab":true}
17 / toggle -> hr                            {"url":"/?view=hr","hr":true,"dev":false,"hist":10,"skillsTab":false}
18 logo/home link on /?view=hr (stays hr)    {"url":"/?view=hr","hr":true,"dev":false,"hist":11,"skillsTab":false}
19 gr on / (stays hr)                        {"url":"/?view=hr","hr":true,"dev":false,"hist":12,"skillsTab":false}
20 link /?view=dev while hr (dev, URL kept)  {"url":"/?view=dev","hr":false,"dev":true,"hist":14,"skillsTab":false}
21a fresh / (dev)                            {"url":"/","hr":false,"dev":true,"hist":15,"skillsTab":false}
21b nav /projects                            {"url":"/projects","hr":false,"dev":false,"hist":16,"skillsTab":false}
21c toggle hr on /projects                   {"url":"/?view=hr","hr":true,"dev":false,"hist":17,"skillsTab":false}
22 Back to /projects                         {"url":"/projects","hr":false,"dev":false,"hist":17,"skillsTab":false}
23 Back to old / entry (stays hr)            {"url":"/?view=hr","hr":true,"dev":false,"hist":17,"skillsTab":false}
```
Note: an earlier run of steps 21–23 showed `dev:true` on `/projects` with the page hidden behind a 2nd tab (frozen transition, known trap); re-run with `bringToFront` → above. Step 20 is a plain `<a>` (full load), so it exercises the mount path, not the watcher.

## Acceptance
| Criterion | Evidence |
|---|---|
| 1. On `/`, toggle shows HR card / hides editor tabs; again restores | lines 2 (`hr:true,dev:false`), 3 (`hr:false,dev:true`) |
| 2. On `/projects`, toggle lands on `/?view=hr` in HR | lines 5, 21c |
| 3. On `/` toggle → `/?view=hr`, again → `/`; history does not grow | lines 1–3: `hist` 2 → 2 → 2 |
| 4. Fresh `/?view=hr` shows HR; SSR HTML is Dev | line 11; `curl … ?view=hr \| grep -c experiences.pug` → `1` |
| 5. Reload `/?view=hr` → HR; reload `/` → Dev | line 14; `/` fresh load line 1/21a `dev:true` (state is never persisted, so a reload of `/` is a fresh load) |
| 6. HR → `/projects` → header `/` tab or `gr`: HR, URL `/?view=hr` | lines 6–8 |
| 7. HR + language switch: HR stays, other locale URL ends `?view=hr` | line 9 `"/en?view=hr"`, `hr:true` |
| 8. `/?tab=skills&view=hr`: HR; toggle to Dev keeps `tab=skills`, opens skills tab | lines 15–16 (`"/?tab=skills"`, `skillsTab:true`) |
| Edge: `?view=foo` → Dev, URL unchanged; `/projects?view=hr` ignored | lines 12, 13, 20 |
| Behavior 11 (operator Q4): no `?view` keeps state on `/` itself and on Back | lines 18, 19, 23 |
| 9. build/lint/typecheck clean, `npm test` passes | Output section: exits 0, `Tests  28 passed (28)` |
| comments per code-comments.md | 5 comments touched, all WHY, `//` one sentence each, no `(#N)`: Header.vue toggle comment (why it navigates/replaces); Index.vue `applyViewQuery` (state-wins rule); "Registered before the await…" (unmount trap); "Awaited so the tab deep link…" (ordering); `useResumeView.ts` file doc updated in its existing `/** */` block |
| Coverage: only callers | `grep -rn "useResumeView" themes composables pages app.vue stores layouts` → `Header.vue:20`, `resumeObject/Index.vue:14`, `composables/useResumeView.ts:6` only |

## Supersedes: none
`grep -n "#422" agent-hub/haven/diagrams/dev-loop.prime-mermaid.md` before adding the row → no output.

## Review
`/code-review medium` on the first draft (forked skill) → 7 findings:
1. Same-route link to `/` (logo/`gr`) clears `?view` → watcher flips to Dev, contradicting Behavior 11 → **fixed**: absent `?view` now keeps state and re-adds `view=hr` (lines 18, 19).
2. `watch(resumeView, syncViewQuery)` fired a duplicate `router.replace` on mount that could cancel `select()`'s replace → **fixed**: that watcher is gone; the only replace on mount is awaited before `select()`.
3. State HR + `?view=dev|HR|foo` was rewritten to `view=hr` → **fixed**: any present value other than `hr` sets Dev and leaves the URL (lines 12, 20).
4. Header navigated to `/` without the query, URL fixed later by a 2nd replace → **fixed**: Header pushes `/?view=hr` directly (line 5 `hist` +1 only).
5. Toggle never reached the URL when `ThemeResumeObject` isn't mounted (invalid resume) → **fixed**: the Header toggle writes the URL itself.
6. Two-way watcher round trip / duplicate replace on Back/Forward → **fixed**: one-way (URL → state) watcher only.
7. Spec ambiguity Behavior 10 vs 11 → **resolved by operator** (open question 4), doc updated.
Review not re-run on the final diff; final diff re-verified by build/lint/typecheck/test + browser run above.

## Noticed, not done
- Build `WARN … components-*.js (369:0): A comment "/* @__NO_SIDE_EFFECTS__ */"` in a generated Nuxt chunk — not from this diff; not compared against a `staging` build.
- `?view` on `/` keeps a same-tab HR choice even on Back to a Dev-era entry (by operator decision Q4) — intentional, noted for the verifier.

## Seal gate: none (no commit/push/external call; mock on localhost only)
