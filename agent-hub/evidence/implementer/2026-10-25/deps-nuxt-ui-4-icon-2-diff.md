# 2026-10-25 - deps-nuxt-ui-4-icon-2 (diff)

- Worker: implementer · Version: 0.1.0
- Node: `deps-nuxt-ui-4-icon-2` (`haven/diagrams/dev-loop.prime-mermaid.md`, last row)
- Task: issue #264 "chore(deps): Phase 3.7 — @nuxt/ui 3→4 + @nuxt/icon 1→2 (needs Nuxt 4)", branch `feature/264` off `staging` 9ba2169
- Status: `sealed_pending_verifier`

## Hub bytes before
77992

## Diff
| File | Why |
|---|---|
| `package.json` / `package-lock.json` | `@nuxt/ui` ^3.3.7→^4.12.0, `@nuxt/icon` ^1.15.0→^2.6.1 (`npm install @nuxt/ui@^4.12.0 @nuxt/icon@^2.6.1`); pulls `@nuxtjs/color-mode` 4.0.1, `reka-ui` 2.11.0, `@nuxt/fonts` 0.14.0 |
| `themes/portfolio-dev/pages/blogs/Index.vue` | UPagination `:ui.item` restores v3's focus outline on the active page button (v4: `outline-secondary/25 focus-visible:outline-3`; v3: `focus-visible:outline-2 outline-offset-2 outline-secondary`) + one `<!-- -->` WHY comment; component reformatted to one prop per line (eslint vue/max-attributes-per-line) |
| `themes/portfolio-dev/pages/github/GitRepos.vue` | UInput `:ui.base` += `focus-visible:outline-none` — v4 added a 3px white/25% focus outline on top of the theme's 1px accent ring |
| `CLAUDE.md`, `README.md`, `agent-hub/doctrine/MEMORY.md` | "@nuxt/ui v3" → "v4" |
| `haven/diagrams/dev-loop.prime-mermaid.md` | Node row appended |

Migration guide (https://ui.nuxt.com/docs/getting-started/migration/v4) breaking items checked against usage (`grep -rhoE '<U[A-Z][A-Za-z]+'` → UApp, UAvatar, UBadge×3, UContainer×7, UIcon×32, UInput, UModal, UPagination, USelect, USkeleton×10, USlideover; plus `useToast`): no `UButtonGroup`/`UPageMarquee`/`UPageAccordion`/`UForm`/`nullify`/`@nuxt/ui-pro`/AI components → none apply. No codemod needed.

## Commands + output
```
npm ls --all → rc=0 (no "invalid" at all; staging had vue-router@5.4.0 "^4.5.0" from @nuxt/ui, magic-string@0.30.12, unplugin@2.3.11 invalid)
npm ls → @nuxt/icon@2.6.1, @nuxt/ui@4.12.0 (@nuxt/fonts@0.14.0, @nuxtjs/color-mode@4.0.1, reka-ui@2.11.0)
rm -rf .nuxt .output node_modules/.cache && npm run build → rc=0 "◆ ✨ Build complete in 13.9s!", WARN 0
npm run lint → rc=0
npx nuxi typecheck → rc=0, 0 "error TS", last line "[nuxt:icon] ✔ Nuxt Icon discovered local-installed 3 collections: fe, grommet-icons, heroicons"
npm audit → 17 vulnerabilities (1 low, 1 moderate, 15 high)   (baseline 17: 2 moderate, 15 high)
```
- Warm rebuild (no cache wipe) prints 1 WARN: Rollup `"/* @__NO_SIDE_EFFECTS__ */" … cannot interpret due to the position of the comment` in `node_modules/.cache/nuxt/.nuxt/dist/server/_nuxt/components-*.js`. A/B: `origin/staging` worktree after `npm ci` → first build WARN 1, second build WARN 1, same `NO_SIDE_EFFECTS` text → pre-existing, not from this diff.

## Visual diff (prod builds: staging copy `scratchpad/u4/output-base` :4110 vs branch :4111; `scratchpad/ui3/shoot.cjs` + `diff.cjs`, 34 shots: dark/light × 1440/390 × home/projects/github/blogs/post/contact/404 + help overlay + toast + mobile menu)
Final run, non-zero lines only (all other 24 shots `diffpx 0`):
```
dark-1440-post.png           1440x935 diffpx 1740 0.129% rows 584-663
dark-1440-state-toast.png    1440x900 diffpx 54 0.004% rows 852-863
dark-390-blogs.png           390x1780 diffpx 695 0.1% rows 383-416
dark-390-github.png          390x5223 diffpx 487 0.024% rows 797-812
dark-390-post.png            390x1383 diffpx 29497 5.469% rows 882-1369
light-1440-post.png          1440x1317 -> 1440x935 diffpx 563772 29.727% rows 584-1316
light-1440-state-toast.png   1440x900 diffpx 5963 0.46% rows 254-883
light-390-blogs.png          390x1780 diffpx 707 0.102% rows 383-416
light-390-github.png         390x5223 diffpx 574 0.028% rows 797-813
light-390-post.png           390x1383 -> 390x1001 diffpx 160143 29.691% rows 650-1382
```
- **post**: Giscus loads async — heights flip both ways between runs (first run had dark-1440 935→1317, final run light-1440 1317→935); the dark-1440 band (`scratchpad/u4/c-post.png`) is the Giscus "Đang tải thêm bình luận…" placeholder present in one shot only. Re-shot with `.giscus,giscus-widget,iframe{display:none}` on both servers (`scratchpad/u4/post.cjs`) → 4/4 `diffpx 0`.
- **toast**: captured at different moments of the download (`scratchpad/u4/c-toast.png`: before "Đã tải xong CV!" success, after "Đang tải CV..." loading) — timing, not style.
- **blogs 390 / github 390** (accepted v4 default): `scratchpad/u4/c-blogs.png`, `c-gh.png` — per-page USelect 63→65 px wide, search placeholder text slightly larger. Computed styles (`scratchpad/u4/cs.cjs`, 390 px): v3 `text-sm` 14px → v4 `text-base/5 … md:text-sm` 16px below `md` (padding identical: pl 36px / 10px). v4 deliberately uses 16px on mobile so iOS Safari doesn't zoom on focus; ≥md (all 1440 shots) unchanged.

### Focus states (keyboard `:focus-visible`, `scratchpad/u4/focus.cjs`, `focus2.cjs`)
Before fix → after fix:
```
GitHub search input  4110(v3): outline none, accent ring 1px inset rgb(189,147,249)
                     4111(v4): outline solid 3px oklab(1 0 0 / 0.25) + same ring   → after fix: outline none + same ring
Active page button   4110(v3): solid 2px oklch(0.75 0.183 55.934) off=2px
                     4111(v4): solid 3px oklab(0.75 0.103 0.152 / 0.25) off=0px      → after fix: solid 2px oklch(0.75 0.183 55.934) off=2px
USelect              both: outline none (unchanged; `focus:outline-none` in v3 and v4)
```
Inactive pagination buttons (neutral outline variant) keep a full-contrast `focus-visible:ring-inverted` in v4 (dist theme line: `outline-inverted/25 focus-visible:outline-3 focus-visible:ring-inverted`) — not touched. Only UPagination renders UButton here (UModal/USlideover use custom `#content` slots, no close button).

## Icons (`scratchpad/u4/icons.cjs`, Iconify public API blocked via request interception)
Per route `{total, painted, distinct}`, identical on 4110 and 4111:
```
/ 18/17/13 · /?tab=skills 18/17/13 · /?tab=experience 18/17/13 · /projects 17/16/8 · /github 64/63/14 · /blogs 18/17/13 · /contact 12/11/9
blocked iconify API requests: 0
```

## SSR head parity (10 routes, `scratchpad/n4/head.cjs`, 4110 vs 4111)
All 200; `_ _en _github _en_github _contact _en_contact _projects _en_projects _blogs _en_blogs` → SAME ×10. `/api/generate-pdf?lang=vi` → `200 application/pdf 160795`, `%PDF-`.

## Browser (dev :4102, `scratchpad/n4/func.cjs`, CDP :9888 Chrome/155), two runs, both rc=0:
```
click _resumegr -> / textLen=1198
click _projectsgp -> /projects textLen=1141
click _githubgh -> /github textLen=3100
click _blogsgb -> /blogs textLen=747
click _contactgc -> /contact textLen=434
keyNav dialog open: Phím tắt   · dialog after Esc: false
color class: dark -> light -> dark     (classSuffix '' still: <html class="dark|light">)
/github vi-VN -> /en/github en-US -> /github vi-VN
hydration msgs: 0 []
other: []
```
The reka-ui `Missing Description … DialogContent` warning present since #262 is gone (reka-ui 2.6.0 → 2.11.0). CV-download toast: rendered in `state-toast` shots (loading + success states seen).

## Acceptance
| Criterion | Evidence |
|---|---|
| @nuxt/ui 4.12.x / @nuxt/icon 2.6.x / color-mode 4.x | `npm ls` |
| no new `invalid`; vue-router one gone | `npm ls --all` rc=0 |
| build/lint/typecheck clean | rc=0 ×3, 0 WARN clean build (warm-build WARN pre-exists, A/B) |
| icons render locally | icons.cjs identical, 0 API requests |
| color toggle + classSuffix '' | func.cjs `dark -> light -> dark` |
| screenshot diff: fixed or accepted | 24/34 identical; post/toast = timing (Giscus-hidden re-shot 0 px); blogs/github 390 = v4 mobile 16px (accepted, reason above); focus regressions fixed |
| real browser, 0 hydration / 0 new console errors | func.cjs ×2 |
| SSR head parity 10 routes | SAME ×10 |
| npm audit before/after | 17 → 17 (1 low, 1 moderate, 15 high) |
| comments per code-comments.md | One added: `blogs/Index.vue` `<!-- v4's solid-button focus outline is 25% opacity; keep v3's solid one on the active page -->` — WHY, one sentence, no issue ref. `GitRepos.vue` change adds no comment. |

## Supersedes: none
(grep `#264` in active diagram → only this row)

## Noticed, not done
- USelect (per-page) has no visible keyboard focus indicator in v3 or v4 (`focus:outline-none`, no ring for `variant="none"`) — pre-existing a11y gap, out of scope.
- The 1 non-painted icon per page is identical on both versions (not investigated).

## Seal gate
none — no commit/push/PR in this pass.
