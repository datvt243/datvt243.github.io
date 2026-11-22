# 2026-11-22 - projects-tech-url (diff)

- Worker: implementer · Version: 0.1.0
- Node: `projects-tech-url` (`haven/diagrams/dev-loop.prime-mermaid.md`, IN_PROGRESS)
- Task (verbatim, issue #435): "Projects: keep the technology filter in the URL" — The technology filter on `/projects` is local state only, so a filtered view can't be shared or survive a reload. Expected: Selected technologies in the query (e.g. `?tech=vue,pinia`), applied after mount; clearing removes it. Needs `allowQuery` on the `/projects` ISR rule (same trap as #415).
- Plan: `evidence/implementer/2026-11-22/projects-tech-url-plan.md`
- Status: sealed_pending_verifier

## Hub bytes before: 93562

## Feature doc: agent-hub/doctrine/features/projects.md
## Feature doc changed: Out of scope "Search by name, AND-filtering, filter in the URL." → "Search by name, AND-filtering."; new Behavior 8 (`?tech=a,b`, `router.replace`, removed when empty, client-only after mount, no `allowQuery`, unknown names stay selected and × clears them); new acceptance row; Changelog row — operator: open question 4 "Change: keep it in the URL — #435" (2026-11-07) + "Client-only, no allowQuery (Recommended)" (AskUserQuestion 2026-11-22, this pass).

## Operator decision: no `allowQuery`
The issue text asks for both "applied after mount" and `allowQuery`. With client-only application the SSR HTML never depends on `tech`, so `allowQuery` would only add identical ISR cache entries per value. Operator picked **"Client-only, no allowQuery (Recommended)"** → `nuxt.config.ts` untouched (`git diff --stat` above lists no `nuxt.config.ts`). Same as home `?view`/`?tab`, which also have no `allowQuery`.

## Diff
| File | Why |
|---|---|
| `themes/portfolio-dev/pages/projects/Index.vue` | `techModel` computed (v-model target): getter = `selected`; setter sets `selected` then `router.replace`s `tech` (comma-joined, `undefined` when empty, other query params kept). `techFromUrl()` parses `route.query.tech`. `onMounted` → `watch(route.query.tech, …, { immediate: true })` (client-only, URL → state; covers fresh load, reload, Back/Forward). |
| `agent-hub/doctrine/features/projects.md` | Behavior 8 + acceptance + Out of scope + Changelog (see Feature doc changed). |
| `agent-hub/haven/diagrams/dev-loop.prime-mermaid.md` | New node row `projects-tech-url` (IN_PROGRESS). |

```diff
--- a/themes/portfolio-dev/pages/projects/Index.vue
+++ b/themes/portfolio-dev/pages/projects/Index.vue
@@ -35,7 +35,23 @@
+const route = useRoute()
+const router = useRouter()
 const selected = ref<string[]>([])
+// Mirrored to ?tech=vue,pinia; `selected` is set first so a 2nd quick click doesn't toggle from the pre-navigation state.
+const techModel = computed({
+  get: () => selected.value,
+  set: (value: string[]) => {
+    selected.value = value
+    router.replace({ query: { ...route.query, tech: value.length ? value.join(',') : undefined } })
+  },
+})
+// String() also joins a repeated ?tech=a&tech=b; unknown names are kept so the × can still clear them from the URL.
+const techFromUrl = () => String(route.query.tech ?? '').split(',').filter(Boolean)
+// Client-only, not in setup: `/projects` is ISR-cached, so the server HTML can't depend on the query.
+onMounted(() => {
+  watch(() => route.query.tech, () => (selected.value = techFromUrl()), { immediate: true })
+})
@@
-        <ThemeFilterFolder v-model="selected" label="projects" :items="allTech" collapse-below-lg />
+        <ThemeFilterFolder v-model="techModel" label="projects" :items="allTech" collapse-below-lg />
```

## Command
Node v24.19.0 (`nvm use 24`), repo root, final diff, real env:
`npm run build` · `npm run lint` · `npx nuxi typecheck` · `npm test`
Browser build: same `npm run build` with `NODE_API`+`NUXT_PUBLIC_NODE_API=http://localhost:4199` (scratchpad mock, 3 projects: Alpha [vue,pinia], Gamma [node], Beta [react]), server `PORT=4188 node .output/server/index.mjs` with the same env.

## Output
Final diff (after the review fixes), exit codes read via `echo $?`:
- `npm run build` → `build=0`; last line `◆ ✨ Build complete in 13.5s!`. Earlier run of the same command printed one `WARN  node_modules/.cache/nuxt/.nuxt/dist/server/_nuxt/components-C1i8GQ3a.js (369:0): A comment` — generated Nuxt chunk, not a file in this diff (same warning recorded in `resume-view-url-diff.md`).
- `npm run lint` → `lint=0`; output `> nuxt-app@1.14.0 lint` / `> eslint .`, nothing else.
- `npx nuxi typecheck` → `tc=0`; output `ℹ Nuxt Icon server bundle mode is set to local` / `[nuxt:icon] ✔ Nuxt Icon discovered local-installed 3 collections: fe, grommet-icons, heroicons`; `grep -ci error` on it → `0` (first run).
- `npm test` → `test=0`; ` Test Files  10 passed (10)` / `      Tests  30 passed (30)`.
- Mock build → `build=0`; SSR `curl -s 'http://localhost:4188/projects?tech=react' | grep -c ">$n<"` → `Alpha:1` `Beta:1` `Gamma:1` (unfiltered).
- `grep -c onrender server.log` → `0` (real backend never called); first run's mock log: `1 GET /api/me/<email>?lang=vi`.

## Browser verification
Headless Chrome via `puppeteer-core` `launch` (fresh `userDataDir`, no extensions), 1280×900, real clicks on the sidebar items and the × button. Script `/private/tmp/claude-501/-Users--david-Workspace-Project-resume-datvt243-github-io/690e5e86-62d8-4e24-a4a5-0e42891b4504/scratchpad/check.mjs`. Final-diff run, verbatim:
```
1 load /projects                   {"url":"/projects","names":["Alpha","Gamma","Beta"],"hist":2}
2 select vue                       {"url":"/projects?tech=vue","names":["Alpha"],"hist":2}
3 select react                     {"url":"/projects?tech=vue,react","names":["Alpha","Beta"],"hist":2}
4 unselect vue                     {"url":"/projects?tech=react","names":["Beta"],"hist":2}
5 reselect vue                     {"url":"/projects?tech=react,vue","names":["Alpha","Beta"],"hist":2}
6 clear (x)                        {"url":"/projects","names":["Alpha","Gamma","Beta"],"hist":2}
7 fresh ?tech=react,node           {"url":"/projects?tech=react,node","names":["Gamma","Beta"],"hist":3}
8 reload                           {"url":"/projects?tech=react,node","names":["Gamma","Beta"],"hist":3}
9 fresh ?tech=zzz,vue              {"url":"/projects?tech=zzz,vue","names":["Alpha"],"hist":4}
10 fresh ?tech=                    {"url":"/projects?tech=","names":["Alpha","Gamma","Beta"],"hist":5}
11 repeated ?tech                  {"url":"/projects?tech=react&tech=node","names":["Gamma","Beta"],"hist":6}
12 add node                        {"url":"/projects?tech=vue,node","names":["Alpha","Gamma"],"hist":7}
13 Back (previous page entry)      {"url":"/projects?tech=react&tech=node","names":["Gamma","Beta"],"hist":7}
14 fresh ?tech=zzz                 {"url":"/projects?tech=zzz","names":[],"hist":7} noMatch: 1
15 clear (x) unknown               {"url":"/projects","names":["Alpha","Gamma","Beta"],"hist":7}
16 rapid vue+react                 {"url":"/projects?tech=vue,react","names":["Alpha","Beta"],"hist":7}
console errors: []
```
`hist` grows only on `page.goto` (steps 7, 9, 10, 11, 12), never on a filter click (steps 2–6, 15, 16) → `replace`, not push.

## Acceptance
| Criterion | Evidence |
|---|---|
| 1. Select A then B → `?tech=A,B`, OR-filtered list, history unchanged | lines 2–3 (`?tech=vue,react`, Alpha+Beta), `hist` 2→2→2 |
| 2. × → no `tech`, all projects | lines 6, 15 (`"/projects"`, 3 names) |
| 3. Fresh load / reload of `?tech=` applies after mount; unknown names stay selected (match nothing), × clears them | lines 7, 8, 9 (`zzz,vue` → Alpha), 14 (`names:[]`, noMatch 1), 15; edge `?tech=` → all (line 10); repeated param (line 11); Back (line 13) |
| 4. SSR HTML for `?tech=react` is unfiltered | Output: `Alpha:1 Beta:1 Gamma:1` |
| 5. `nuxt.config.ts` `/projects` rule unchanged (operator) | `git diff --stat` lists only `projects.md`, `dev-loop.prime-mermaid.md`, `projects/Index.vue` |
| 6. build/lint/typecheck clean, `npm test` passes | Output: `build=0`, `lint=0`, `tc=0`, `test=0`, `Tests  30 passed (30)` |
| Feature doc acceptance (unchanged rows): two techs OR, × all, `link` anchor, `npm test` incl. `sortProjects.test.ts` | lines 3/5, 6; `link` markup untouched by this diff; `Test Files  10 passed (10)` |
| comments per code-comments.md | 3 `//` one-sentence WHY comments, no `(#N)`: setter ordering (fast-click race), `String()`/unknown-names rule, client-only/ISR reason. No restating, no stacked `//`. |
| Coverage: `selected` only used in this file | `grep -rn "selected" themes/portfolio-dev/pages/projects/Index.vue` → lines 40, 43, 54, 55 (+ setter/watch); `ThemeFilterFolder` callers: `github/Index.vue:41` (own `selected`, untouched), `projects/Index.vue:52` |

## Supersedes: none
`grep -n "#435" agent-hub/haven/diagrams/dev-loop.prime-mermaid.md` before adding the row → no output; after → only line 85 (this node).

## Review
`/code-review medium` on the first draft (forked skill) → 4 findings:
1. Unknown `tech` dropped from `selected` but left in the URL, × hidden → **fixed**: unknown names are kept (match nothing, × visible and clears the URL) — lines 14–15.
2. Comma inside a tech name can't round-trip with the comma-joined format → **not fixed**: the issue specifies `?tech=vue,pinia`; moved to Noticed, not done.
3. `selected` not recomputed when `allTech` changes → **fixed by 1**: `techFromUrl()` no longer depends on `allTech`.
4. Setter only navigates, so a quick 2nd click toggles from stale state → **fixed**: setter sets `selected` before `router.replace` — line 16 (`vue,react` both kept).
Review not re-run on the final diff; final diff re-verified by build/lint/typecheck/test + the browser run above.

## Noticed, not done
- Tech names containing `,` would split on read (review finding 2). Changing to repeated `?tech=a&tech=b` contradicts the issue's format; reading already accepts the repeated form (line 11). Not checked against real resume data (real backend is off-limits for tests).
- `techFromUrl` has no unit test — inline one-liner in a `.vue` file; `tests/` covers only pure util functions. Behaviour covered by browser lines 7–14.
- Build `WARN … components-*.js (369:0)` in a generated Nuxt chunk — not from this diff.

## Seal gate: none (no commit/push/external call; mock on localhost only)
