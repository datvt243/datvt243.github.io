# 2026-09-06 — editor-dracula-github-item-fix (diff)

- Worker: implementer
- Node: `editor-dracula-github-item-fix` (`haven/diagrams/dev-loop.prime-mermaid.md`)
- Plan: `evidence/implementer/2026-09-06/editor-dracula-github-item-fix-plan.md`

## Diff
| File | Why |
|---|---|
| `themes/portfolio-dev/pages/github/part/Item.vue` | #145: `text-blue-400` → `text-theme-code-keyword` (NOT `text-theme-accent` — see Deviation in the plan note) on the `homepage` link (line 9). Added `topicBadgeUi` const + `:ui="topicBadgeUi"` on the topics `<UBadge>` (line 59+68), same shape as the sealed `projects/Index.vue` fix. |
| `agent-hub/haven/diagrams/dev-loop.prime-mermaid.md` | New node row, `IN_PROGRESS`. |

No other file touched — matches `SmallestDiff`.

```diff
--- a/themes/portfolio-dev/pages/github/part/Item.vue
+++ b/themes/portfolio-dev/pages/github/part/Item.vue
@@ -6,10 +6,22 @@ const props = defineProps<{
 }>()

 const links: { field: keyof GitRepos; icon: string; class: string }[] = [
-  { field: 'homepage', icon: 'fe:globe', class: 'text-blue-400' },
+  { field: 'homepage', icon: 'fe:globe', class: 'text-theme-code-keyword' },
   { field: 'html_url', icon: 'fe:github', class: 'text-theme-accent' },
 ]

+// Overrides UBadge's default Nuxt UI `{color}` variant (which never picks
+// up the --theme-* CSS custom properties) with --theme-accent, same
+// pattern proven in projects/Index.vue's techBadgeUi - Nuxt UI's `ui` prop
+// merges via tailwind-merge per class-modifier group, so the `dark:`
+// variant needs its own explicit override too, or the default
+// `dark:text-{color}-400`/`dark:ring-{color}-400` classes survive.
+const topicBadgeUi = {
+  variant: {
+    outline: 'text-theme-accent dark:text-theme-accent ring-1 ring-inset ring-theme-accent/40 dark:ring-theme-accent/40',
+  },
+}
+
 const languageColors: Record<string, string> = {
   ...
@@ -56,7 +68,7 @@
     <p v-if="modelValue.topics?.length" class="flex flex-wrap gap-2 mt-2">
-      <UBadge v-for="topic in modelValue.topics" :key="topic" :label="topic" variant="outline" />
+      <UBadge v-for="topic in modelValue.topics" :key="topic" :label="topic" variant="outline" :ui="topicBadgeUi" />
     </p>
```

## Deviation from #145's literal suggestion (recorded, not silently done)
#145's own "How" section suggested `text-blue-400` → `text-theme-accent`
(copy-pasted from the `projects/Index.vue` precedent when filing the
issue). Used `text-theme-code-keyword` instead: line 10, immediately next
to the edited line, already reads `{ field: 'html_url', ...,
class: 'text-theme-accent' }` — using `text-theme-accent` for BOTH links
would have made the homepage-link and github-link icons render identically,
losing the original two-color visual distinction the literal `blue-400`/
`text-theme-accent` pairing provided (just not in a theme-aware way).
`--theme-code-keyword` is defined as EXACTLY `96 165 250` (`blue-400`) in
`dark.css` and `37 99 235` (`blue-600`) in `light.css` — a byte-for-byte
match of the literal class being replaced in both non-Dracula modes,
confirmed via `grep -n "theme-code-keyword"
themes/portfolio-dev/settings-colors-theme/*.css` before choosing it. In
Dracula it resolves to Pink, still distinct from `--theme-accent`'s Purple.

## Command
```
rm -rf node_modules/.cache .nuxt .output && npm run build
```
Exit code `0`. Same pre-existing `sharp` darwin-arm64 warning as prior
nodes this week (not new, not from this diff).

```
npm run lint
```
Exit code `0`. Verbatim tail: `✖ 32 problems (0 errors, 32 warnings)` —
exact baseline match.

## Real UI check via Chrome CDP
Pure visual/color change (both links + the topics badge) — CDP required
per `doctrine/domains/PROJECT.md`, in both color modes.

`/browser`: no debuggable Chrome running, launched fresh
(`--remote-debugging-port=9888 --user-data-dir="$HOME/.chrome-debug-profile"`),
confirmed via `curl -s http://localhost:9888/json/version`. Preview server:
`PORT=3998 node .output/server/index.mjs` (this pass's own cold-cache
build). Note: `page.goto` with `waitUntil: 'networkidle2'` timed out at
30s on `/github` (a real, slow live `https://api.github.com` call server-
side, not a regression — `curl` to the preview server itself returned 200
in 0.03s); switched to `waitUntil: 'load'` with a 60s timeout, which
succeeded.

Wrote a fresh `puppeteer-core` script (`.tmp-cdp-check-145.mjs`, deleted
after use) that reads the FIRST `.git-repos-item`'s two link `<a>`s'
computed `color` (confirming they stay visually distinct from each other)
and does a real click on the header's color-mode toggle, re-reading both.
A second script (`.tmp-cdp-check-145b.mjs`, also deleted) scanned all 27
loaded repo items to find one with a real topics badge (the first item
had none — `v-if="modelValue.topics?.length"` guard, a data condition, not
a bug) and inspected its real rendered class/color.

Verbatim result (link colors, both modes):
```json
{
  "mode1": { "htmlClass": "dark",  "homepageColor": "rgb(255, 121, 198)", "githubColor": "rgb(189, 147, 249)", "colorsDistinct": true, "anyLiteralBlue": false },
  "toggled": true,
  "mode2": { "htmlClass": "light", "homepageColor": "rgb(219, 42, 142)",  "githubColor": "rgb(124, 58, 204)",  "colorsDistinct": true, "anyLiteralBlue": false },
  "consoleErrors": []
}
```
`rgb(255, 121, 198)` = `#ff79c6` = Dracula canonical Pink =
`editor-dracula.css`'s `.dark .editor-scope`'s `--theme-code-keyword`
value exactly. `rgb(219, 42, 142)` = the Dracula-light companion's
`--theme-code-keyword` (`editor-dracula.css`'s `.light .editor-scope`
value, byte-for-byte). Both link colors stay distinct from each other and
from `--theme-accent` in both modes; `anyLiteralBlue: false` (regex-scanned
the real rendered `innerHTML`, not just the source).

Verbatim result (topics badge, on a repo item that actually has topics —
"nuxt"):
```json
{
  "totalItems": 27,
  "badgeText": "nuxt",
  "badgeClass": "inline-flex items-center font-medium rounded-md text-xs px-2 py-1 gap-1 text-theme-accent dark:text-theme-accent ring-1 ring-inset ring-theme-accent/40 dark:ring-theme-accent/40",
  "badgeColor": "rgb(124, 58, 204)",
  "badgeHasLiteralPrimary": false
}
```
Both `text-theme-accent` and `dark:text-theme-accent`/
`dark:ring-theme-accent/40` present, 0 `primary-*` remnant — confirms the
proven `dark:`-prefix fix pattern replays correctly in this file too.
`consoleErrors: []` across the whole session.

Cleanup: preview server on port 3998 killed by PID, confirmed no listener
afterward. Both temp CDP scripts deleted. `npm run lint` re-run after
cleanup — still `32 problems (0 errors, 32 warnings)`, confirming no
leftover temp file polluted the baseline. `git status --short` shows only
the real diff (`Item.vue` + diagram row) plus this evidence directory.

## Acceptance
| Criterion | Evidence | Met? |
|---|---|---|
| `text-blue-400` → theme-aware token, visually distinct from the adjacent `html_url` link | `git diff` above + CDP `colorsDistinct: true` in both modes | ✅ |
| `<UBadge>` gets the proven per-instance `:ui` override (incl. `dark:` variants) | `git diff` above + CDP `badgeClass` shows both variants, 0 `primary-*` | ✅ |
| `npm run build` clean | Command/Output above, exit 0 | ✅ |
| `npm run lint` clean, unchanged baseline | `32 problems (0 errors, 32 warnings)` | ✅ |
| Real UI check, both color modes | CDP results above, 0 console errors | ✅ |

## Noticed, not done
None beyond what #145 itself already scoped — this was a direct replay of
an already-proven fix pattern, no further Dracula-consistency gaps found
in this file during the pass.

## Seal gate
No outward-facing action taken — no `commit`/`push`. Diff + evidence ready
for the verifier pass.
