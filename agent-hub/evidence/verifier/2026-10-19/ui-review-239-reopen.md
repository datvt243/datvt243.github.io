# 2026-10-19 - ui-review-239 (verifier verdict: REOPEN)

- Worker: verifier · Version: 0.1.0
- Node: `ui-review-239` (`haven/diagrams/dev-loop.prime-mermaid.md`, issue #239)
- Note graded: `evidence/implementer/2026-10-19/ui-review-239-diff.md`, against `gh issue view 239` and `git diff` on `bug/239` (23 files, `76 insertions(+), 39 deletions(-)`)
- New PM status: **REOPEN** (row left at `IN_PROGRESS`; RatchetOnly, PM status is only updated on SEAL)

## Isolation proof
This pass ran as a separate subagent spawned via the Agent tool. Its task string was the verifier prompt: "You are the **verifier** worker … Node: `ui-review-239` … Your OWN browser script (not the implementer's): serve with `PORT=3458` …". That is not the implementer's task string (issue #239's body). This context wrote no part of the diff, so `NeverVerifyOwnWork` holds.

## Re-run
`partial`: `npm run build`, `npm run lint` and `npx nuxi typecheck` were re-run on the working tree. The browser check used a new script I wrote myself, served on `:3458`. Reason: the node is a 23-file, site-wide chrome change (the skip link and theme-color in `app.vue`, plus all 3 layouts), and the caller asked for an independent re-run.

## Commands (Node v24.19.0, repo root)
- `npm run build`: exit 0, `└  ✨ Build complete!` (the only noise is the `[@nuxt/image] WARN sharp binaries for darwin-arm64 cannot be found` line)
- `npm run lint`: exit 0, but the output is **not clean**:
  ```
  /Users/_david/Workspace/Project/resume/datvt243.github.io/app.vue
    8:7  warning  Attribute "class" should go before "@click.prevent"  vue/attributes-order

  ✖ 1 problem (0 errors, 1 warning)
  ```
  Baseline: with the diff stashed, `npx eslint app.vue` prints nothing. The whole-repo lint was 0 problems before this change, so the warning is new and comes from this diff's skip link.
- `npx nuxi typecheck`: exit 0, `error TS` count 0

## Browser (own script)
- Scripts: `/private/tmp/claude-501/-Users--david-Workspace-Project-resume-datvt243-github-io/909a3f24-74c6-4b9c-819a-fc85ca8e1ff7/scratchpad/verifier-239/v.cjs`, with output in `run1.txt`. `v2.cjs`, with output in `run2.txt`, follows up the failures.
- Setup: prod build on `:3458`, headless Chrome with a fresh `userDataDir`. Color mode was seeded through `localStorage['nuxt-color-mode']`, and each page waited for `#__nuxt.__vue_app__`.
- `run1.txt`: `TOTAL 180 pass / 32 fail`. Every fail is triaged below. **0** Vue, hydration or pageerror warnings across all pages, widths and modes.

| Check | Result |
|---|---|
| Skip link on `/`, `/en`, `/contact`, `/github`, `/blogs` (blog layout) at 1280/360, dark/light | ok (20/20 page-mode-width combos). Hidden before focus, first Tab focuses it and it is visible (`w=235 h=38`). Enter → `activeElement.id=main-content`, `hash=""`. `main#main-content.layout-blog` on `/blogs` |
| 404 (error layout) | `<main id="main-content">` is present (`mains:1`). `error.vue` bypasses `app.vue`, so the 404 page has no skip link and no theme-color. It also has no header chrome to skip, so it is acceptable and not part of the issue |
| theme-color | ok: `#020617` dark / `#ffffff` light on every `app.vue` page |
| No h-overflow | ok: 24/24 page combos, plus `/` and `/en` at 360 on all 5 tabs (`0`) |
| CodeBlock wrap | ok: `overflow-wrap: anywhere` |
| aria-pressed | ok: exactly one `true` per tab, 1–5, on `/` and `/en` |
| aria-expanded | ok: toggles `true→false→true` |
| Headings | ok: `H1,H2,H2,…` (no H1→H3). `h2.position` is 14px, as the `.position { font-size: inherit }` rule gives; `.tag-text` is 1rem |
| Hero SVG dims / avatar alt / text-balance | ok: Hero tech imgs carry width/height. Avatar has `alt=""`. h1 `text-wrap: balance`. (The 17 `img[src*=svg/]` without dims are `.line-icon` imgs in other tabs, e.g. `Skills.vue`, which the issue does not list) |
| Label-in-name | ok: `["vi","VI, Chuyển ngôn ngữ"]`. No `<label>` in the header. `translate=no` ×12 |
| rel=noopener | ok for the issue's items (Footer, AboutMe). `/contact` (`contact/Index.vue:47`, 3 social links) and `/github` (`github/part/Item.vue:60`, 43 links) still lack it. Neither is listed in the issue, but `:60` is a line this diff edited |
| `?tab` deep link | ok: `/?tab=skills` → tab 2, `/en?tab=education` → tab 4, `?tab=bogus` → tab 1. The default tab clears the query |
| Back/Forward | ok: tab 5 → `gp` → Back restores `?tab=languages` with tab 5 active. Forward → `/projects` |
| Autoscroll | ok: skip link, then key `3` → file-tab `top=12` with `?tab=experience` and no hash. Tab 5 `top=392` is the scroll clamp (`scrollY 177 = max 177`), not a bug |
| **Tab/URL desync** | **bug**: on `/?tab=skills`, `gr` (and the header `_resume` link) gives `{"a":"2","q":""}`. The URL drops `?tab`, but the skills tab stays active, so the address bar no longer matches the view |
| Shortcuts | ok: `j`/`k` (80→0), `?` opens help, `d` requests `/api/generate-pdf`, `gp`, `gh`, `/` on github focuses search (placeholder `Tìm tên repo…`) and Esc blurs it. `c` is the `mailto:` link as before (my `/contact` expectation was wrong) |
| Contact focus ring | ok (`run2.txt`): keyboard focus on the input → `box-shadow … rgb(189, 147, 249) 0px 0px 0px 1px` (Dracula accent inside `editor-scope`) |
| i18n | ok: both JSON files parse. No `...` left in `i18n/locales` |
| transition-all | ok: grep finds no `transition-all` or `transition: all` in `themes/`, `assets/`, `components/`, `layouts/` or `app.vue` |
| API website link | Out of code scope, and correctly reported rather than faked |

## Missing (why REOPEN)
1. **Lint is not clean (`EDIT_UNVERIFIED`).** The diff adds `vue/attributes-order` at `app.vue:8:7` (`✖ 1 problem (0 errors, 1 warning)`, baseline 0). The note says only "`npm run lint` exit 0" and hides the warning, and MEMORY.md requires lint to be clean. Precedent: `verifier/2026-10-04/object-parameter-rule-reopen.md`. Fix: move `class` before `@click.prevent` on the skip link (`npm run lint:fix`).
2. **No "comments per code-comments.md" row, and stale comments remain.** The note has no `## Acceptance` row for this, and `code-comments.md` Enforcement says that alone is a REOPEN. The diff also leaves two comments in `themes/portfolio-dev/pages/resumeObject/Experiences.vue` that now misdescribe the code: the `@file` block (line 3, `article/h3/p/time/ul/li`) and the `.position` style comment (line 122, "push the `h3` glyph"). Both should say `h2`.
3. **The `?tab` deep link desyncs.** `Index.vue` reads `route.query.tab` only in `onMounted`. A same-route navigation that changes the query (`gr`, header `_resume`, or any `NuxtLink` to `/`) clears the URL but keeps the old tab. The address bar then stops describing the view, which is the point of the issue's deep-link item. Smallest fix: drive `active` from `route.query.tab` through a `watch`, instead of the one-shot `onMounted` read. Keep the client-only apply so the ISR HTML stays query-independent.

## Non-blocking (note for the operator, no change required for this node)
- `target=_blank` without `rel` remains at `contact/Index.vue:47` and `github/part/Item.vue:60`. The issue does not list them, and modern browsers imply `noopener` anyway. If the implementer is back in `Item.vue:60` regardless, adding `rel` there costs one attribute.
- Forbidden states: `ADHOC_WORK` no, `NO_EVIDENCE` no, `CODE_IN_HAVEN` no, `DIAGRAM_DRIFT` no. `EDIT_UNVERIFIED` yes (item 1).
- Seal gate: nothing outward-facing. Proportionality: the diff matches the issue's checklist item for item, with no extras. No "tests pass" claim.
- Not checked: real screen readers; Safari and Firefox; the toast's `aria-live` (I did not re-check the implementer's `role="status"` reading of `@nuxt/ui`).
