# 2026-09-19 — cv-button-project-link-visibility (implementer diff)

- Worker: implementer
- Node: `cv-button-project-link-visibility`

## Diff
| File | Why |
|---|---|
| `themes/portfolio-dev/pages/resumeObject/AboutMe.vue` | CV download button restyled: `border-theme-accent border rounded-md p-4 text-theme-accent hover:bg-theme-accent hover:text-theme-accent-contrast transition-all` (same classes as `Detail.vue`'s back-to-blog button) + a `fe:download` icon, replacing the plain inline-text markdown-bracket styling. Kept as a `<button>` (not `NuxtLink`) since `downloadResume()` is a JS click handler, not a route navigation. |
| `themes/portfolio-dev/pages/projects/Index.vue` | Added a conditional `<a v-if="p.link">` "View project" link per card, styled as a small `text-theme-accent` link with a `fe:link-external` icon (same icon already used for external links in `GitUser.vue`), pinned to the bottom of the card via `mt-auto` on its flex-col container. |
| `i18n/locales/en.json` / `vi.json` | Added `projects.viewProject` ("View project" / "Xem dự án"). |

```diff
--- AboutMe.vue
     <button
       type="button"
-      class="font-theme-mono text-sm mt-2 disabled:opacity-40 disabled:cursor-not-allowed"
+      class="btn border-theme-accent border rounded-md p-4 text-theme-accent hover:bg-theme-accent hover:text-theme-accent-contrast transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-theme-accent"
       :disabled="isDisabled"
       @click="downloadResume()"
     >
-      <span class="text-theme-faint">[</span><span class="text-blue-400 hover:underline">{{ t('resume.downloadCv') }}</span
-      ><span class="text-theme-faint">](</span><span class="text-theme-accent-soft">./resume.pdf</span><span class="text-theme-faint">)</span>
+      <span class="flex items-center space-x-2">
+        <UIcon name="fe:download" class="w-5 h-5" />
+        <span class="uppercase font-theme-mono text-sm">{{ t('resume.downloadCv') }}</span>
+      </span>
     </button>

--- projects/Index.vue
             <ul v-if="p.technology.length" class="flex flex-wrap gap-2 mb-4">
               <li v-for="tech in p.technology" :key="tech">
                 <UBadge :label="tech" variant="outline" :ui="techBadgeUi" />
               </li>
             </ul>
+            <a
+              v-if="p.link"
+              :href="p.link"
+              target="_blank"
+              rel="noopener noreferrer"
+              class="mt-auto inline-flex items-center gap-2 text-sm text-theme-accent hover:underline w-fit"
+            >
+              <UIcon name="fe:link-external" class="w-4 h-4" />
+              {{ t('projects.viewProject') }}
+            </a>
```

Icon existence confirmed before use (not guessed): `node -e "... require('@iconify-json/fe/icons.json') ... .filter(k=>k.includes('download'))"` → `['download']`. `fe:link-external` confirmed already in use elsewhere (`GitUser.vue:27`).

## Command
`npm run build` then `npm run lint` (verbatim from `doctrine/MEMORY.md`).

## Output
`npm run build`: exit 0, `✨ Build complete!`, same pre-existing darwin-arm64
`sharp` warning. `npm run lint`: `✖ 30 problems (0 errors, 30 warnings)`,
exact baseline match — the new `projects.viewProject` i18n key required no
lint-relevant code change (pure JSON).

## Browser verification
Real UI check via Chrome CDP (port 9888, already running), against a real
`npm run dev` instance (port 4011, fresh `rm -rf .nuxt`).

**CV button** (`/`, About Me tab, default-active):
```json
{
  "text": "Tải CV",
  "width": 123.7,
  "height": 38,
  "border": "1px solid",
  "bg": "rgba(0, 0, 0, 0)",
  "hasIcon": true
}
```
Real border + icon confirmed present (previously: plain text, no border, no
icon). Transparent background at rest matches the reused `Detail.vue`
pattern (background only appears on `:hover`, not captured by a static
`getComputedStyle` read).

**Project links** (`/projects`, 2 real cards from the live resume API):
```json
[
  { "hasLink": false, "href": null, "text": null },
  { "hasLink": true, "href": "http://demo.com", "text": "Xem dự án" }
]
```
Card 1 (no `link` value) correctly renders nothing extra (`v-if="p.link"`
holds); card 2 (has a `link` value) renders a real, working `<a
target="_blank">` with the icon + translated label. 0 console/page errors
on either page.

## Acceptance
| # | Criterion | Evidence | Met? |
|---|---|---|---|
| 1 | CV button has real visible chrome | `border: "1px solid"`, `hasIcon: true` | ✅ |
| 2 | Reused existing button pattern, not invented | Diff matches `Detail.vue`'s exact class set | ✅ |
| 3 | Project link renders conditionally, correctly | Card-by-card CDP check above | ✅ |
| 4 | i18n label added both locales | `vi.json`/`en.json` diff | ✅ |
| 5 | Build clean | `✨ Build complete!` | ✅ |
| 6 | Lint clean | `30 problems (0 errors, 30 warnings)`, baseline match | ✅ |

## Noticed, not done
Nothing new beyond what the audit already scoped for this pair of items.

## Seal gate
No outward-facing action taken (no commit/push/PR) — working tree left
dirty on the `staging` branch for the operator to review.
