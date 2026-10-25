# 2026-10-25 - deps-nuxt-ui-3-tw4 (diff)

- Worker: implementer · Version: 0.1.0
- Node: `deps-nuxt-ui-3-tw4` (`haven/diagrams/dev-loop.prime-mermaid.md`, last row)
- Task: issue #262 "Phase 3.5 — @nuxt/ui 2→3 + Tailwind 3→4 (on Nuxt 3)", part of #266. Branch `feature/262`, worktree `scratchpad/wt-262` (off `staging` @ `7ec2b12`)
- Status: `sealed_pending_verifier`

## Hub bytes before / after
78833 → 79372 (+539: one Traps row in `doctrine/domains/PROJECT.md`, one stack line in `doctrine/MEMORY.md`)

## Versions
`npm ls`: `@nuxt/ui@3.3.7`, `tailwindcss@4.3.3`, root `@nuxt/schema@3.21.11` (nested `@nuxt/ui/node_modules/@nuxt/schema@4.6.2`), `@iconify-json/heroicons@1.2.3`. Removed: `tinycolor2`, `autoprefixer` (only user was the deleted `tailwind.config.js` / `postcss.plugins`).

## Diff
| File | Why |
|---|---|
| `package.json` / lockfile | `@nuxt/ui` ^2.22.3→^3.3.7, `tailwindcss` ^3→^4.3.3; −`tinycolor2`, −`autoprefixer`; +`@iconify-json/heroicons` (was transitive via ui v2, used by `resumeObject/Index.vue`); +`@nuxt/schema ~3.21.11` (see Typecheck) |
| `tailwind.config.js` → deleted; `assets/css/tailwindcss.css` → `assets/css/main.css` | Official `npx @tailwindcss/upgrade@4 --force` (run from a v3 install — run from v4 it skips the config migration) moved the config to CSS. Renamed because `@import 'tailwindcss'` inside a file named `tailwindcss.css` resolves to itself ("Exceeded maximum recursion depth"). Hand changes: `@theme` → `@theme inline` (keeps `.dark`/`.light`/`.editor-scope` re-skinning — plain `@theme` resolves `--color-theme-*` once at `:root`), `@import '@nuxt/ui'`, body `subpixel-antialiased` (v3's base adds `antialiased`) |
| `nuxt.config.ts` | `postcss.plugins` removed (ui v3 uses `@tailwindcss/vite`); `ui: { fonts: false }` (ui v3's bundled `@nuxt/fonts` emitted a Fira Code `@font-face` ahead of `font-face.scss`'s Google Fonts `@import` → new esbuild "All @import rules must come first" warning, and the import would be dropped) |
| `app.config.ts` | `ui.colors { secondary: 'orange', neutral: 'gray' }` (v2 `gray: 'cool'` = Tailwind gray; secondary carries the pagination's literal orange); container override ported to v3's single `base` slot with the v2 *effective* classes (`px-3 sm:px-6 lg:px-8` — measured: content x=240–1200 at 1440 = 1024−2×32) |
| `app.vue` | `<UApp>` wrapper replaces `<div>` + `<UNotifications />` |
| `composables/useDownloadResume.ts` | toast `timeout`→`duration` (0 = persistent, reka skips timer at ≤0), `red`/`green`→`error`/`success` |
| `KeyNav.vue`, `Header.vue` | `UModal`/`USlideover`: `v-model:open`, `#content` slot, `:title` (a11y name), `ui.content`; `UContainer :ui` → `class` |
| `Footer.vue` | `UContainer :ui` → `class` |
| `blogs/Index.vue` | `USelect :items`; `UPagination v-model:page :items-per-page active-color="secondary"` |
| `github/GitRepos.vue` | `UInput color="neutral" size="md"` (v2 `sm` = v3 `md`: text-sm, 20px icon), `class="w-full"` (v3 root is inline-flex), override flattened to the `base` slot |
| `utils/themeBadgeUi.ts` | v3 slot shape `{ base }`; doc comment updated |
| `post/Author.vue` | `UAvatar size="3xl"` (v2 `lg` = 48px = v3 `3xl`) |
| `github/part/Language.vue` | Deleted: the only `UMeter*` user (removed in v3), referenced nowhere (grep `PartLanguage\|part/Language` → 0), printed raw debug data |
| `post/Detail.vue` | `.container-block`/`.btn` (the CSS file's only live custom classes) inlined; `md:leading-14` → `md:leading-none` (v3 never generated `leading-14`, so 48px was the real value; v4 does → 56px) |
| `PageHeading.vue` | `leading-normal` → `leading-normal sm:leading-10 md:leading-none`: v3 emitted responsive `text-*` after `leading-*`, so their built-in line-height won; v4 lets explicit leading win (72px vs 48px) |
| `post/Item.vue` | `prose max-w-none` → `leading-7`: `@tailwindcss/typography` was silently registered by ui v2; only effect here was line-height 1.75 |
| `layouts/error.vue` | `container` → `container mx-auto` (v3's `container.center:true` was NOT dead — I first removed it as such; caught by the 404 pixel diff) |
| `error.vue`, `contact/Index.vue` | `focus:ring-opacity-50` (removed in v4) → `focus:ring-theme-accent/50` |
| upgrader class renames | `rounded`→`rounded-sm`, `outline-none`→`outline-hidden`, `end-5`→`inset-e-5`, `[overflow-wrap:anywhere]`→`wrap-anywhere` in ListRender/CodeBlock/Kbd/NavItem/PostCategories/Header/blogs/contact/resumeObject/app.vue/error.vue. Reverted one upgrader edit to an old evidence note (history) and one bogus `ring:`→`ring-3:` object key in KeyNav (rewritten anyway) |
| Docs | `CLAUDE.md`, `README.md`, `doctrine/MEMORY.md`, `.claude/rules/theme.md` (paths + `@theme inline` note), `dark.css` comment: `tailwind.config.js`/v3/v2 refs; `doctrine/domains/PROJECT.md` +1 Traps row (`@nuxt/schema` pin) |
| `haven/diagrams/dev-loop.prime-mermaid.md` | Node row appended (before any code change) |

## Command / Output
```
npm run build        → rc=0 "✨ Build complete!"; WARN lines: 12× "nuxt/server" (same 12 as staging baseline, from @nuxt/image 2, see #259 correction) + 1 new ">500 kB chunk" note
npm run lint         → rc=0, 0 problems
npx nuxi typecheck   → rc=0, 0 "error TS"; last line "✔ Nuxt Icon discovered local-installed 3 collections: fe, grommet-icons, heroicons"
npm audit            → 53 (1 low, 1 moderate, 48 high, 3 critical); staging 52
```
- Entry chunk 439.15 kB (153.75 gz) → 504.09 kB (169.21 gz): reka-ui + tailwind-variants. Not tuned here.
- Audit delta (`npm audit --json` A/B vs `scratchpad/wt-base`): added `@tanstack/vue-table`, `embla-carousel-vue`, `reka-ui`, `unplugin-vue-components`, `vaul-vue`, `vue-demi` — every one is `via: vue` (new dependents of the existing `vue` advisory, not new advisories; fix offered = `@nuxt/ui@4`, #264). Removed: `@headlessui/vue`, `@tailwindcss/typography`, `@vueuse/math`, `glob`, `minimatch`.

## Typecheck trap (why `@nuxt/schema` is pinned)
First typecheck: `nuxt.config.ts(135,7): error TS2353: ... 'storage' does not exist in type 'ResolveNuxtNitroConfig<NitroConfigFallback>'`. Cause: ui v3 depends on `@nuxt/schema@4` directly → npm hoisted 4.6.2 to the root (staging had none at root) → `.nuxt/tsconfig.json` maps `@nuxt/schema` to `../node_modules/@nuxt/schema` → schema 4's nitro type needs a Nuxt-4 server builder registry, falls back to a shape without `storage`. `npm install -D @nuxt/schema@~3.21.11` restores 3.21.11 at root (4.6.2 nests under @nuxt/ui) → 0 errors. Recorded as a PROJECT.md Trap; drop with Nuxt 4 (#263). (`npm ls` "invalid: ^4.4.6 from nuxt/node_modules/@nuxt/cli" pre-exists on staging — checked in wt-base.)

## Browser verification
Prod builds via Chrome CDP :9888: branch on :4083, staging baseline (`scratchpad/wt-base`, same `.env`) on :4084. Scripts in `scratchpad/ui3/`.

### Pixel diff — `shoot.cjs` + `diff.cjs` (34 shots, per-channel threshold 24)
0% on: contact ×4, notfound ×4, projects-390 ×2, state-menu ×2. Remaining, each traced:
| Shots | Diff | Explained by |
|---|---|---|
| projects-1440 | 0.05% | raster `NuxtImg` thumbnail edges (resampling) |
| state-help | 0.03% | modal text sub-pixel |
| home-1440 / -390 | 0.7% / 0.9% | 1px row offsets (v4 `28.0001px` line-heights), chip `/10` tint now `color-mix(in oklab)` |
| github-1440 / -390 | 0.8% / 2.8% (−1px tall) | sub-pixel offsets; DOM tree A/B (`tree.cjs`): only change = one dot y 3494→3493; input ring identical `rgb(98,114,164) 0 0 0 1px inset` |
| blogs-1440 | 0.09% | pagination: v3 adds first/last buttons + gaps (accepted library default) |
| blogs-390 | 8.7–9.2% (−8px) | select now SHOWS its value (`20`; v2's `variant="none"` select rendered it clipped/blank — pre-existing bug) → wider → intro wraps 1 more line; pagination as above |
| state-toast | 0.4–1.0% | v3 toaster default 384px wide / 16px inset (v2 352px / 24px) — accepted library default |
| post ×4 | 1.4–29% (height varies run to run) | Giscus iframe async (`Đang tải thêm bình luận…` in one run); above it the DOM tree A/B shows identical geometry incl. title 144px, avatar 48px |
Fixed along the way (each found by this diff): subpixel smoothing (every glyph), 404 off-center, PageHeading/post title line-height, prose excerpt line-height, avatar 36→48, search input text-xs→text-sm.

### Real-click checks (`func*.cjs`, `icons.cjs`)
```
help: open after ? click true | accessible name true | closed after Esc true
kbd: outside panel rgb(251,146,60), inside .editor-scope rgb(251,146,60)
badge inside panel rgb(189,147,249) (Dracula purple) — same on :4084
color toggle dark -> light
slideover: open true | closed via X true | nav link → /github, dialog closed
search: dispatched '/' focuses INPUT:/ (A/B same); click+type "vue-todo" → 26 → 2 repos (A/B same)
select: pick 10 → shows 10 | pagination: First Page,Previous Page,1,Next Page,Last Page
error toast (generate-pdf forced 500): "Không thể tải CV. Vui lòng thử lại.", ring-error, icon oklch(0.704 0.191 22.216)
success toast: "Đã tải xong CV!" green (state-toast shots)
heroicons resume tabs: 9 icons rendered, Iconify API requests 0 (blocked)
console issues: none (baseline had 'There are no focusable elements inside the <FocusTrap />' — gone)
```
- A real `/` keypress is swallowed by Vimium in the debug profile on BOTH builds (PROJECT.md Trap) → keydown dispatched in-page.
- Hydration: `nuxi dev --port 4085`, `/`, `/github`, `/blogs`, a post, `/contact`, `/en`, then header click → `/en/projects`: `hydration msgs: 0`; only other message = pre-existing `api-resume` "different handler" (documented in #265's evidence).
- Upstream resume API returned 429 mid-run (my server restarts each refetch it); waited for `x-ratelimit-remaining: 99`, reshot. Not a code issue.

## Acceptance
| Criterion | Evidence |
|---|---|
| @nuxt/ui 3.3.x + tailwindcss 4.x | Versions above |
| build + lint + typecheck clean | rc=0 ×3, 0 problems, 0 `error TS`; only new build note = chunk size |
| screenshots diffed, every diff explained | table above |
| modal, slideover, toast, select, pagination, search by real click | Real-click checks |
| Dracula only inside panel; `--theme-kbd` orange both sides; light/dark | colors lines + toggle; 0% diffs on contact/notfound in both modes |
| npm audit before/after | 52 → 53, delta traced to `vue` dependents |
| Comments per code-comments.md | 5 added/changed (main.css ×2, nuxt.config `ui.fonts`, app.config `secondary`, themeBadgeUi doc) — WHY-only, no `(#N)` |

## Supersedes: none
(grep `#262` in active diagram → only this row)

## Noticed, not done
- Visible design changes accepted as v3 defaults (pagination first/last, toast spacing) — easy to revert via `app.config` `ui.toaster`/`#first`/`#last` slots if the operator prefers v2's look.
- Two literal palette colors drift slightly with v4's OKLCH palette: `GitUser.vue` bio `border-blue-400`, `post/Loading.vue` `bg-gray-400`.
- The intended `md:leading-14` on the post title and `leading-normal` on PageHeading never applied under v3; I kept v3's actual look. Honoring the written intent is a 2-class follow-up.
- Entry chunk +15.5 kB gzip.

## Seal gate
none — no commit/push/PR in this pass. `Language.vue` deletion is in the working tree only (reversible).

---

## Rework 1 (after REOPEN `evidence/verifier/2026-10-25/deps-nuxt-ui-3-tw4-reopen.md`)
REOPEN reasons: (1) v4 preflight dropped `cursor: pointer` on `<button>` — every plain button lost its pointer (a screenshot can't show it, so "every diff explained" missed it); (2) comments row incomplete — the upgrader's border-color comment block in `main.css` was uncited and not per code-comments.md.

### Diff
| File | Why |
|---|---|
| `assets/css/main.css` | + `@layer base { button:not(:disabled), [role='button']:not(:disabled) { cursor: pointer } }` (Tailwind's documented v3-compat rule) with a one-line WHY comment; the upgrader's 8-line border-color comment shortened to one WHY line |

### Command / Output
```
npm run build        → rc=0, "✨ Build complete!", WARN: same 12× nuxt/server + chunk-size note only
npm run lint         → rc=0, 0 problems
npx nuxi typecheck   → rc=0, 0 "error TS"
```

### Browser verification
- `:4083` restarted on this build (it was stale after the verifier's rebuild). The first run hit upstream 429 → `/api/resume` 502, so home/projects rendered the error state; waited until upstream returned 200 (18×15s polls) and re-ran — only the post-wait numbers are cited.
- `scratchpad/ui3/cursor.cjs`: computed `cursor` of every `button`, `[role=button]`, `a[href]` on `/`, `/projects`, `/github`, `/blogs`, a post, `/contact`, `/nope-404` at 1440 and 390, :4084 (staging) vs :4083, matched by tag+label → `compared 412 matching controls, cursor mismatches: 0`. Home spot check: header buttons + `[data-shortcut]` + resume tabs = 13 controls, `pointer` on both builds.
- Re-shot all 34 into `ui3/after-r1`, diffed against the previous `ui3/after`: 0% on 31; `dark-1440-post` / `light-390-post` differ only below row 652/816 (Giscus async, same as before), `light-1440-state-toast` 20px (progress-bar timing). Rework is visually neutral. Console issues: none.

### Acceptance row update
| Criterion | Evidence |
|---|---|
| Comments per code-comments.md | 6 added/changed: `main.css` ×4 (`@theme inline` WHY, border-color compat, subpixel smoothing, button cursor), `nuxt.config.ts` `ui.fonts`, `app.config.ts` `secondary`, `themeBadgeUi.ts` doc — WHY-only, no `(#N)` |
| Non-visual v4 preflight changes | button cursor restored (above). Other v4 preflight changes checked against the code: placeholder color (no bare placeholders — all set `placeholder:text-theme-faint` or ui v3 `placeholder:text-dimmed`), `hidden` attr precedence (no `hidden` attribute + display utility combos: `grep -rn ' hidden ' --include=*.vue` only class-level `hidden lg:flex` patterns) |

---

## Rework 2 (after REOPEN `evidence/verifier/2026-10-25/deps-nuxt-ui-3-tw4-reopen-2.md`)
REOPEN reasons: (1) dark mode lost `color-scheme: dark` on `<html>` (root `normal` vs staging `dark`) → light page scrollbar/canvas on non-overlay-scrollbar OSes; (2) two keyboard-focus changes unexplained (link focus ring color; v4 focus-ring fade-in).

Root cause, read from source: `wt-base/node_modules/@nuxt/ui/dist/runtime/ui.css` (v2) is exactly `.dark{color-scheme:dark} a:focus-visible{@apply outline-primary} ::selection{@apply bg-primary/40}`. v3 dropped all three — so text-selection color had regressed too (not flagged by either pass).

### Diff
| File | Why |
|---|---|
| `assets/css/main.css` | + `@layer base { .dark { color-scheme: dark } a:focus-visible { @apply outline-primary } ::selection { @apply bg-primary/40 } }` — v2's ui.css ported verbatim, one WHY comment |

### Command / Output
```
npm run build        → rc=0, WARN: same 12× nuxt/server + chunk-size note only
npm run lint         → rc=0, 0 problems
npx nuxi typecheck   → rc=0, 0 "error TS"
```

### Browser verification (:4083 restarted on this build; `/api/resume` 200)
`ui3/scheme.cjs` (= verifier's `verify-262b/scheme.cjs` pointed at :4083):
```
4084 dark  root=dark   body=dark      | 4083 dark  root=dark   body=dark
4084 light root=normal body=normal    | 4083 light root=normal body=light
```
Light `body=light` is v3's base `scheme-light` on `<body>`; on a light page it renders identically to `normal` (light form controls/scrollbar either way).
`ui3/focussel.cjs` (Tab ×2 on /contact → header `_resume` link, `:focus-visible` true, settled 400ms):
```
dark  4084 outline auto rgb(74,222,128)   selection rgba(74,222,128,.4)
dark  4083 outline auto oklch(0.792 0.209 151.711)  selection oklab(0.792 … / .4)   ← green-400, v4 OKLCH
light 4084 outline auto rgb(34,197,94)    selection rgba(34,197,94,.4)
light 4083 outline auto oklch(0.723 0.219 149.579)  selection oklab(0.723 … / .4)   ← green-500, v4 OKLCH
```
Reshoot `ui3/after-r2` vs `ui3/after-r1`: 33/34 pixel-identical; `dark-1440-post` differs only below row 587 (Giscus async). Console issues: none.

### Accepted default (reason 2b)
v4's `transition-colors`/`transition` include outline/ring color, so a focus ring fades in over 150ms starting from `currentColor`; on "Tải CV" (orange ring on orange border) the first frames are low-contrast. Settled state is identical to staging (verifier's `ringsettled.txt`). Accepted: a 150ms fade on keyboard focus is v4's intended default, and the settled ring is unchanged. Undo would mean per-element `transition-property` overrides — not worth it inside a dependency bump.

### Acceptance row update
| Criterion | Evidence |
|---|---|
| Comments per code-comments.md | 7: `main.css` ×5 (+ ui.css port), `nuxt.config.ts`, `app.config.ts`, `themeBadgeUi.ts` — WHY-only |
| Non-visual parity | cursor (Rework 1), `<html>` color-scheme, link focus outline, `::selection` restored; focus-ring fade accepted above; verifier pass 2 measured hover / `hidden` / placeholder / border / `space-*` / dialog focus as non-regressions |
