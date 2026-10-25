# 2026-10-25 - deps-nuxt-ui-3-tw4 (REOPEN)

- Worker: verifier · Version: 0.1.0
- Node: `deps-nuxt-ui-3-tw4` (`haven/diagrams/dev-loop.prime-mermaid.md`, last row, state `IN_PROGRESS`, left unchanged)
- Notes graded: `evidence/implementer/2026-10-25/deps-nuxt-ui-3-tw4-{plan,diff}.md`
- Worktree: `scratchpad/wt-262` (branch `feature/262`, uncommitted vs `staging` @ `7ec2b12`); baseline `scratchpad/wt-base` (detached at `7ec2b12`)
- Verdict: **REOPEN**

## Isolation proof
This pass is a separately spawned verifier subagent. Its Agent-tool task string starts "You are the agent-hub VERIFIER for this repo … You did NOT write this change — NeverVerifyOwnWork", which differs from the implementer's task "Phase 3.5 — @nuxt/ui 2→3 + Tailwind 3→4". All my scripts and outputs live in `scratchpad/verify-262/` (none in `scratchpad/ui3/`). I served my build from my own server on :4091, not the implementer's :4083.

## Re-run
`full` (build, lint, typecheck, npm audit A/B, the full 34-shot screenshot set plus pixel diff, my own CDP functional scripts). Reason: the change is outward-facing (site-wide dependency and CSS-engine swap headed for production), and the operator asked for an independent re-run.

## Why REOPEN
1. **Plain `<button>`s lost the pointer cursor site-wide. Regression, not explained in the note.** Tailwind v4's preflight dropped v3's `button, [role="button"] { cursor: pointer }`, and no `cursor-pointer` exists anywhere in the repo (grep → 0). Measured on `/` at 1440px with `verify-262/func.cjs`:
   ```
   :4084 staging  Phím tắt:pointer | VI, Chuyển ngô:pointer | Chuyển sang ch:pointer | Tải CV d:pointer | personal-info:pointer | about-me.md1:pointer | skills.ts2:pointer | experiences.pu:pointer
   :4091 branch   Phím tắt:default | VI, Chuyển ngô:default | Chuyển sang ch:default | Tải CV d:default | personal-info:default | about-me.md1:default | skills.ts2:default | experiences.pu:default
   ```
   Affected: header `?`, language toggle, color-mode toggle, "Tải CV", the resume `NavItem` tabs, and every other raw `<button>` (hamburger, contact submit, error page). Screenshots can't show a cursor, so the 34-shot diff could not catch this, and the note's "every diff explained" does not cover it. Fix: add Tailwind's documented v4 compat rule to `assets/css/main.css`, next to the existing border-color compat block: `@layer base { button:not(:disabled), [role="button"]:not(:disabled) { cursor: pointer; } }`. Then re-measure the line above.
2. **The comment row is incomplete** (secondary, fix in the same pass). `## Acceptance` cites "main.css ×2", but `main.css` adds three comment blocks. The uncited one is the upgrader's border-color compat block ("…so we've added these compatibility styles to make sure everything still looks the same as it did with Tailwind CSS v3…"). It is a WHY, but it is boilerplate in narrated first person, so condense it per `code-comments.md` and cite it. The cursor rule from item 1 needs its own one-line WHY.

## Cited (checked myself, all pass)
| Criterion | My evidence |
|---|---|
| `@nuxt/ui` 3.3.x + `tailwindcss` 4.x | `package.json` `^3.3.7` / `^4.3.3`; my typecheck run reports the Nuxt Icon collections `fe, grommet-icons, heroicons` |
| build clean | `npm run build` rc=0, `└  ✨ Build complete!`; 8 WARN lines = the i18n `optimizeTranslationDirective` warning + 12× `nuxt/server` resolve warning from @nuxt/image (both also in the staging build log) + 1 new `Some chunks are larger than 500 kB` (entry `504.09 kB │ gzip: 169.21 kB` vs staging `439.15 kB │ gzip: 153.75 kB`) |
| lint clean | `npm run lint` → `eslint .` no output, rc=0 |
| typecheck clean | `npx nuxi typecheck` rc=0, `grep -c 'error TS'` = 0 |
| `@nuxt/schema ~3.21.11` pin is needed | **Reproduced.** In an APFS clone of the worktree I dropped both lockfile entries for `@nuxt/schema` and reinstalled without the pin. npm then puts `node_modules/@nuxt/schema` at 4.6.2 (3.21.11 nested under `nuxt/`), and `npx nuxi typecheck` → rc=2, `nuxt.config.ts(135,7): error TS2353: … 'storage' does not exist in type 'ResolveNuxtNitroConfig<NitroConfigFallback>'`. The PROJECT.md Traps row is accurate. Clone deleted. |
| npm audit before/after | My own `npm audit --json` A/B: staging `{low:1,moderate:2,high:46,critical:3,total:52}`, branch `{low:1,moderate:1,high:48,critical:3,total:53}`. Added: `@tanstack/vue-table`, `embla-carousel-vue`, `reka-ui`, `unplugin-vue-components`, `vaul-vue`, `vue-demi`, all `high via vue` (fix = `@nuxt/ui@4.12.0` semver-major or `true`). Removed: `@headlessui/vue`, `@tailwindcss/typography`, `@vueuse/math`, `glob`, `minimatch`. Matches the note. |
| screenshots diffed | My own 34 shots (`shoot.cjs` → `verify-262/{before,after}`, :4084 vs :4091) + `diff.cjs` (`verify-262/diff.txt`). The figures match the note within noise: 0% on contact/notfound ×8, projects-390 ×2, menu ×2. projects-1440 0.051%, help 0.026–0.027%, home 0.67–0.95%, github 0.74–2.81% (−1px), blogs-1440 0.09%, blogs-390 8.7–9.2% (−8px), toast 0.4–0.97%. Post pages: dark-1440 935→1317 but light-1440 1317→935, opposite directions in the same run, which confirms Giscus async height noise. Crops checked by eye: blogs-390 select now shows `20`, and the intro wraps one more line (`c-blogs390.png`). Pagination gains `«`/`»` first/last (`c-pag.png`). Toast is wider, with a 16px inset (`c-toast.png`). |
| modal, slideover, toast, select, pagination, search (real interaction) | `func.cjs`/`func2.cjs` on :4091 (A/B :4084). Help modal opens on click, accessible name `Phím tắt`, closes on Esc. Slideover opens with 5 links, name `Mở menu`, Esc closes, nav link → `/blogs` and it closes. Select pick 10 → shows `10`. Pagination with mocked `total: 25`: `First Page,Previous Page,1*,2,3,Next Page,Last Page`, click 2 → `2*` + request `?page=2&perPage=10`, same flow as staging. Search: focused + typed `vue-todo` → `26 -> 2`, same on staging. Dispatched `/` keydown → `INPUT:/` on both. Forced 500 on generate-pdf → toast `Không thể tải CV. Vui lòng thử lại.`, gone after 5s (reka `startTimer` returns at `duration <= 0`: `node_modules/reka-ui/dist/Toast/ToastRootImpl.js:70`). Console issues: none (staging: the `<FocusTrap />` warning). |
| Dracula only in panel; `--theme-kbd` orange both sides; light/dark | dark: kbd outside/inside `rgb(251, 146, 60)`, panel `rgb(40, 42, 54)` (Dracula), header `rgb(15, 23, 42)`. light: kbd both `rgb(234, 88, 12)`, panel `rgb(248, 248, 242)`. Identical on :4084. Project badges inside panel: color `rgb(189, 147, 249)`, ring = Dracula purple at 40% (`oklab(0.742 0.078 -0.126 / 0.4)`, staging `rgba(189,147,249,0.4)`). Active page bg `oklch(0.75 0.183 55.934)` (v4 orange-400), staging `rgb(251,146,60)`. That is the claimed OKLCH drift. |
| v2 leftovers | Repo grep (excluding node_modules/.nuxt/.output/agent-hub) for `v-model=` on UModal/USlideover, `:options=`, `UNotifications`, `page-count`, `color="gray"`, `constrained`, `UMeter`, `UDropdown/UFormGroup/UToggle/UDivider`, `*-opacity`, `outline-none`, `max-w-screen`, `@tailwind`, `theme(` → 0 hits (`timeout` only in server fetch code). Remaining U*: UApp, UModal, USlideover, USelect, UPagination, UInput, UBadge, UAvatar, UContainer, USkeleton, UIcon, all on the v3 API. |
| removed things were dead | grep → 0 refs for `tinycolor`, `autoprefixer`, `container-block`, `btn`, `PartLanguage`/`part/Language`, `pink`/`dark`/`darkness` scales, `--color-green/pink`. The only `container` class user is `layouts/error.vue`, now `container mx-auto`. `prose` has 0 remaining users. |
| docs | `CLAUDE.md`, `README.md`, `doctrine/MEMORY.md`, `.claude/rules/theme.md`, `dark.css` comment updated. No stale `tailwind.config`/`tailwindcss.css`/v3/v2 references outside archive/history files. |

## Missing
- An explanation or fix for the site-wide `cursor: pointer` → `default` regression on plain `<button>`s (item 1). This blocks "every diff explained" and "nothing renders broken".
- The comment row needs to cover all three `main.css` comment blocks (item 2).

## Forbidden states
None hit. Ratchet untouched: the row stays `IN_PROGRESS`, no archive or prune on REOPEN. Seal gate: no commit/push/PR in the implementer's pass. Proportionality: OK. The upgrader's class renames are mechanical and required, and every extra file traces to a measured diff.

## Not checked by me
- Dev-mode hydration (`nuxi dev`): I did not re-run it, to avoid another server refetching the rate-limited resume API. My prod runs logged no hydration or console messages.
- A real PDF generation on the success-toast path. Only the error path was forced.
