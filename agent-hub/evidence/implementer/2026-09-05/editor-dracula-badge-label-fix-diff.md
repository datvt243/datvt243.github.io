# 2026-09-05 — editor-dracula-badge-label-fix (diff)

- Worker: implementer
- Node: `editor-dracula-badge-label-fix` (`haven/diagrams/dev-loop.prime-mermaid.md`)
- Plan: `evidence/implementer/2026-09-05/editor-dracula-badge-label-fix-plan.md`

## Diff
| File | Why |
|---|---|
| `themes/portfolio-dev/pages/projects/Index.vue` | #137: `text-blue-400` → `text-theme-accent` on the project-label `<p>` (line 57). #138: added a `techBadgeUi` const and `:ui="techBadgeUi"` on the tech-tag `<UBadge>` (line 66), per-instance override — no `app.config.ts` change. |
| `agent-hub/haven/diagrams/dev-loop.prime-mermaid.md` | New node row, `IN_PROGRESS`. |

No other file touched — `post/Item.vue`'s `UBadge` (outside editor-scope)
and `github/part/Item.vue`'s `text-blue-400`/`UBadge` (same bug class, but
NOT named in #137/#138) both left untouched, matching `SmallestDiff` and
`NodeBeforeCode` (see "Noticed, not done").

```diff
--- a/themes/portfolio-dev/pages/projects/Index.vue
+++ b/themes/portfolio-dev/pages/projects/Index.vue
@@ -24,6 +24,13 @@ const filtered = computed(() => {
   if (!selected.value.length) return projects.value
   return projects.value.filter((p) => p.technology.some((t) => selected.value.includes(t)))
 })
+
+// Overrides UBadge's default Nuxt UI `{color}` variant (which never picks
+// up the --theme-* CSS custom properties) with the same --theme-accent
+// token this component already uses for its other small accent text/icons
+// (see the hash-icon badge below) - so the tag follows the Dracula
+// editor-scope like everything else inside <ThemePanel>. Nuxt UI's `ui`
+// prop merges via tailwind-merge per class-modifier group, so the default
+// `dark:text-{color}-400`/`dark:ring-{color}-400` classes survive unless
+// explicitly overridden too - can't rely on the base (non-dark) override
+// alone to also win in dark mode.
+const techBadgeUi = {
+  variant: {
+    outline: 'text-theme-accent dark:text-theme-accent ring-1 ring-inset ring-theme-accent/40 dark:ring-theme-accent/40',
+  },
+}
 </script>

 <template>
@@ -54,7 +61,7 @@ const filtered = computed(() => {
           </div>

           <div class="flex flex-col grow p-5 min-w-0">
-            <p class="font-theme-mono text-sm text-blue-400 mb-2">
+            <p class="font-theme-mono text-sm text-theme-accent mb-2">
               {{ t('projects.projectLabel') }} {{ i + 1 }} <span class="text-theme-faint">//</span> _{{ p.slug }}
             </p>
             <h2 class="text-lg font-bold text-theme-text mb-1">{{ p.name }}</h2>
@@ -63,7 +70,7 @@ const filtered = computed(() => {
             <p class="text-sm text-theme-text-soft mb-4 line-clamp-3 max-w-2xl">{{ p.descriptionText }}</p>
             <ul v-if="p.technology.length" class="flex flex-wrap gap-2 mb-4">
               <li v-for="tech in p.technology" :key="tech">
-                <UBadge :label="tech" variant="outline" />
+                <UBadge :label="tech" variant="outline" :ui="techBadgeUi" />
               </li>
             </ul>
           </div>
```

## Investigation dead-end worth recording
First attempt used ONLY the non-dark override (`text-theme-accent ring-1
ring-inset ring-theme-accent/40`, no `dark:` classes). CDP inspection of the
real rendered `<span>` showed the resulting class list still contained
`dark:text-primary-400 dark:ring-primary-400` from Nuxt UI's default
`variant.outline` template (`text-{color}-500 dark:text-{color}-400
ring-1 ring-inset ring-{color}-500 dark:ring-{color}-400` with `{color}`
resolved to the default `primary`) — the `ui` prop's default merge strategy
is `defuTwMerge` (confirmed by reading `node_modules/@nuxt/ui/dist/runtime/
utils/index.js`'s `mergeConfig`), which merges Tailwind classes by
utility+modifier group. `dark:text-primary-400` and `text-theme-accent`
belong to different modifier groups (`dark:` vs none), so twMerge does NOT
treat them as conflicting and keeps both — meaning in dark mode the badge
was still literally green/primary despite the override.

Fixed by adding explicit `dark:text-theme-accent`/`dark:ring-theme-accent/40`
classes to the override string so every modifier-group Nuxt UI's default
template defines gets a same-group replacement. Re-verified via CDP (see
below) — no `primary`/`blue` class survives in either mode's rendered
`<span>` after the fix.

## Command
```
rm -rf node_modules/.cache .nuxt .output && npm run build
```
Exit code `0` (both before and after the `dark:` fix — this was a visual/
CSS-class-merge bug, not a build error). Full log captured. Same pre-
existing `sharp` darwin-arm64 warning as `dependency-upgrade-phase2` (not
new, not from this diff).

```
npm run lint
```
Exit code `0`. Verbatim tail: `✖ 32 problems (0 errors, 32 warnings)` —
exact match to baseline. (An earlier intermediate run showed `37 problems,
1 error` — traced to 3 leftover `.tmp-cdp-*.mjs` debug scripts in the repo
root that hadn't been deleted yet mid-investigation; all deleted before
this final clean run, confirmed via `git status --short` showing no
untracked `.tmp-*` files remaining.)

## Real UI check via Chrome CDP
Both #137 and #138 are pure visual/color changes — CDP check required per
`doctrine/domains/PROJECT.md`, in BOTH color modes (dark = Dracula, light =
the Dracula-light companion) since the bug is specifically about
Dracula-scope color consistency.

`/browser`: Chrome already running on 9888, reused. Preview server:
`PORT=3996 node .output/server/index.mjs` (this pass's own cold-cache
build).

Wrote a fresh `puppeteer-core` script (`.tmp-cdp-check-137-138.mjs`,
deleted after use, cleaned mid-investigation and rewritten once the
`dark:` bug above was found) that: navigates to `/projects`
(`waitUntil: 'networkidle2'`), reads the FIRST `<article>` (a real project
card)'s label `<p>` and tech-tag `<span class="inline-flex">` (the actual
rendered `UBadge`, not the sidebar's unrelated filter-list items — an
earlier selector mistakenly matched the sidebar's `ThemeFilterFolder` tech
list instead, caught by inspecting `outerHTML` directly rather than
trusting a plausible-looking selector), then does a REAL click on the
header's color-mode toggle button and re-reads both.

Verbatim result (2 modes captured — the persistent Chrome profile's
`localStorage` already had a mode set from earlier sessions, so "dark"/
"light" below are labeled by the actual `htmlClass` returned, not by
click-order):
```json
{
  "dark":  { "htmlClass": "light", "labelColor": "rgb(124, 58, 204)", "labelHasLiteralBlue": false, "badgeText": "Vue3", "badgeClass": "... text-theme-accent dark:text-theme-accent ring-1 ring-inset ring-theme-accent/40 dark:ring-theme-accent/40", "badgeColor": "rgb(124, 58, 204)", "badgeHasLiteralPrimary": false },
  "toggled": true,
  "light": { "htmlClass": "dark",  "labelColor": "rgb(189, 147, 249)", "labelHasLiteralBlue": false, "badgeText": "Vue3", "badgeClass": "... text-theme-accent dark:text-theme-accent ring-1 ring-inset ring-theme-accent/40 dark:ring-theme-accent/40", "badgeColor": "rgb(189, 147, 249)", "badgeHasLiteralPrimary": false },
  "consoleErrors": []
}
```
Key findings:
- `rgb(189, 147, 249)` = `#bd93f9` = Dracula canonical Purple = this
  repo's own documented `--theme-accent` value for `.dark .editor-scope`
  (`editor-dracula.css`) — confirmed the real dark-mode render matches the
  intended token exactly, for BOTH the label and the badge.
- The other mode's `rgb(124, 58, 204)` is the Dracula-light companion's
  `--theme-accent` (darkened purple for light-surface contrast, per
  `editor-dracula.css`'s documented derivation) — again identical for
  label and badge.
- `labelHasLiteralBlue: false` and `badgeHasLiteralPrimary: false` in BOTH
  modes — no literal Tailwind `blue-*`/`primary-*` class survives.
- `badgeClass` contains no `dark:text-primary-400`/`dark:ring-primary-400`
  remnants — confirms the `dark:` fix above actually took effect in the
  real DOM, not just in the source override string.
- `consoleErrors: []` across the whole session (load + real click-based
  color-mode toggle).

Cleanup: preview server on port 3996 killed by PID, confirmed no listener
afterward (`lsof -nP -iTCP:3996 -sTCP:LISTEN` → empty). All `.tmp-cdp-*.mjs`
scripts (`-check-137-138.mjs`, `-debug.mjs`, `-debug2.mjs`) deleted.
`git status --short` re-checked after cleanup — only the real changes
listed in "Diff" above remain from this pass (plus unrelated pre-existing
working-tree items from another process, listed below, untouched by this
pass).

## Acceptance
| Criterion | Evidence | Met? |
|---|---|---|
| #137: `text-blue-400` → `text-theme-accent` | `git diff` above | ✅ |
| #138: per-instance `:ui` override, no `app.config.ts` change | `git diff` above — `app.config.ts` untouched | ✅ |
| `post/Item.vue`'s `UBadge` / other editor tokens untouched | `git status --short` shows only `projects/Index.vue` + diagram row changed | ✅ |
| `npm run build` clean | Command/Output above, exit 0 | ✅ |
| `npm run lint` clean, unchanged baseline | `32 problems (0 errors, 32 warnings)` | ✅ |
| Real UI check, both color modes | CDP result above — both label and badge match the documented Dracula/Dracula-light `--theme-accent` value exactly, 0 console errors | ✅ |

## Noticed, not done
- `themes/portfolio-dev/pages/github/part/Item.vue:9` has the exact same
  `text-blue-400` bug (also inside `<ThemePanel>`, via `GitRepos.vue` →
  `github/Index.vue`), NOT named in #137 — not fixed here
  (`NodeBeforeCode`). Recommend filing as a new follow-up issue.
- `themes/portfolio-dev/pages/github/part/Item.vue:59`'s `<UBadge>` has the
  exact same missing-`--theme-*` bug (also inside `<ThemePanel>`), NOT
  named in #138 — not fixed here. Same recommendation.
- `post/Item.vue`'s `UBadge` (used in `blogs/Index.vue`) is correctly left
  on Nuxt UI's default coloring — it's outside any `<ThemePanel>`, so
  there's no Dracula-consistency bug there to begin with.

## Working tree note (not from this pass)
Before this pass started, the working tree already had unrelated modified/
untracked files from another process: `.claude/skills/worker/SKILL.md`,
`agent-hub/haven/workers/implementer/manifest.yaml`,
`agent-hub/haven/workers/implementer/recipes/pick_next.md`,
`agent-hub/haven/workers/verifier/manifest.yaml`,
`agent-hub/haven/workers/verifier/recipes/verify_seal.md`,
`.claude/skills/persona-load/`, `agent-hub/.gitattributes`. None of these
were touched, read for logic, or relied upon by this pass — flagged for
the operator to handle separately, not bundled into this node's diff.

## Seal gate
No outward-facing action taken — no `commit`/`push`. Diff + evidence ready
for the verifier pass.
