# 2026-10-19 - ui-review-239 (implementer diff)

- Worker: implementer · Version: 0.1.0
- Node: `ui-review-239` (IN_PROGRESS)
- Issue: #239 · Branch: `bug/239` (from freshly pulled `staging` @ 36ece49, linked via `gh issue develop`)
- Task: the issue's checklist, verbatim scope (https://github.com/datvt243/datvt243.github.io/issues/239)
- Status: **sealed_pending_verifier**

## Hub bytes before
155407

## Diff (issue item → change)
| Item | File | Change |
|---|---|---|
| Mobile URL overflow | `themes/portfolio-dev/components/CodeBlock.vue` | `[overflow-wrap:anywhere]` on the line span (already `min-w-0`) |
| Skip link | `app.vue`, `layouts/{default,blog,error}.vue` | `sr-only focus:not-sr-only` link as first focusable, themed. `<main id="main-content" tabindex="-1">` in all 3 layouts. Click is `.prevent` and calls `focus()` on main. `href` is kept for no-JS. **Why not plain hash nav:** see "Bugs found" #1 |
| SVG CLS | `pages/resumeObject/Hero.vue` | `width/height` 24 and 16 on the tech NuxtImgs |
| Label-in-name | `layout/Header.vue` | Lang button `aria-label` = `"VI, Chuyển ngôn ngữ"` (`locale.toUpperCase()` first) |
| Stray `<label>` | `layout/Header.vue` | → `<span translate="no">` |
| NavItem state | `components/NavItem.vue` | `:aria-pressed="active"` |
| Folder state | `components/Folder.vue` | `:aria-expanded="open"` |
| Heading skip | `pages/resumeObject/Experiences.vue` | `h3`→`h2`, plus the decorative pug glyph `h3`→`h2`. Styling is class-based (`.position`), so it is unchanged (verified 16px) |
| Avatar alt | `pages/resumeObject/Hero.vue` | `alt=""` (the name is the adjacent h1) |
| rel noopener | `layout/Footer.vue` (2), `pages/resumeObject/AboutMe.vue` (markdownLink) | `rel="noopener noreferrer"` |
| theme-color | `app.vue` | `useHead` meta, `#020617` / `#ffffff` = `--theme-canvas`, follows `useColorMode` |
| h1 balance | `pages/resumeObject/Hero.vue` | `text-balance` |
| Tab deep link | `pages/resumeObject/Index.vue` | `select()` awaits `router.replace({ query: { tab } })`; the default tab drops the param. `onMounted` applies `route.query.tab`, not setup: `/` is ISR-cached so the SSR HTML can't vary by query, which avoids hydration mismatch. Unknown `tab` → ignored |
| translate=no | `layout/Header.vue`, `pages/resumeObject/Index.vue` | Tab names, file labels, filetab |
| `...`→`…` | `i18n/locales/{vi,en}.json` | downloadingCv, readMore, searchPlaceholder (all occurrences, not just :27); new `a11y.skipToContent` |
| transition: all | `assets/css/styles.scss` | Explicit `opacity, filter` / `filter` / `opacity, transform`; the existing reduced-motion block is untouched |
| Contact focus ring | `pages/contact/Index.vue` (3 fields) | `+ focus-visible:ring-1 focus-visible:ring-theme-accent` |
| transition-all | `post/Item.vue`, `post/Detail.vue`, `github/GitUser.vue`, `github/part/Item.vue` (2) | → `transition-colors` / `transition-opacity` |
| API website link | — | **Not code.** It comes from resume API data; reported to the operator |
| Toast aria-live (unverified item) | — | Checked `node_modules/@nuxt/ui/.../Notification.vue`: `role="status"` (implicit polite live region), so no change. Caveat: the container is `v-if`-mounted with its first toast, which some screen readers don't announce |

## Bugs found during my own verification (fixed before handing over)
1. The skip link used a plain `#main-content` hash. Selecting a tab afterwards then called `router.replace`. Two things went wrong:
   - Without the hash, Nuxt's `scrollBehavior` scrolled to top (y=0).
   - Keeping the hash scrolled to `#main-content` (y=46).

   I also tried `history.replaceState`, but Back then lost `?tab`, because vue-router restores from `state.current`. Final fix: the skip link moves focus in JS without writing a hash.
2. Before that, `router.replace` without `await` raced the custom scroll.

## Command / Output (Node 24, repo root, final tree)
- `npm run build` exit 0, `└  ✨ Build complete!`
- `npm run lint` exit 0
- `npx nuxi typecheck` exit 0, `error TS` = 0

## Browser verification
Clean headless Chrome (fresh temp profile), prod build `:3457`.

- **`/private/tmp/claude-501/-Users--david-Workspace-Project-resume-datvt243-github-io/909a3f24-74c6-4b9c-819a-fc85ca8e1ff7/scratchpad/fix239/t.cjs`: 37 pass / 0 fail, ×3 runs.** Output is in `/private/tmp/claude-501/-Users--david-Workspace-Project-resume-datvt243-github-io/909a3f24-74c6-4b9c-819a-fc85ca8e1ff7/scratchpad/fix239/run-final.txt`.
  - Layout and markup:
    - 360px, all 5 tabs: no overflow.
    - The skip link is first on Tab and visible, hidden otherwise. Enter moves focus to `<main>`, leaves no hash, and the next Tab skips the header.
    - theme-color is dark and follows light mode.
    - Every SVG has width and height; the avatar has `alt=""`; the h1 has `text-wrap: balance`.
    - The language button's name contains the visible text; the header has no `<label>`.
    - `aria-pressed` is correct; `aria-expanded` toggles true and false.
    - Every `target=_blank` has noopener; `translate=no` appears 12 times.
  - Tabs and URL:
    - Selecting a tab sets `?tab=experience` and the scroll still lands on the row (top=4).
    - Headings go H1>H2, and the h2 is still 16px.
    - After `gp`, Back restores `?tab=experience` with the right tab active. The default tab clears the query.
    - Deep links `/?tab=skills` and `/en?tab=education` work; an unknown tab falls back.
    - 0 hydration warnings.
  - Other pages and keys:
    - `j` and `gh` still work.
    - The contact input shows a 1px ring on keyboard focus.
    - The placeholder ends with `…`.
- **Regressions** (earlier nodes' scripts): autoscroll `/private/tmp/claude-501/-Users--david-Workspace-Project-resume-datvt243-github-io/909a3f24-74c6-4b9c-819a-fc85ca8e1ff7/scratchpad/scroll/t.cjs` 24/0, github `/` `/private/tmp/claude-501/-Users--david-Workspace-Project-resume-datvt243-github-io/909a3f24-74c6-4b9c-819a-fc85ca8e1ff7/scratchpad/slash/t.cjs` 27/0, header `/private/tmp/claude-501/-Users--david-Workspace-Project-resume-datvt243-github-io/909a3f24-74c6-4b9c-819a-fc85ca8e1ff7/scratchpad/hdr/t.cjs` 13/0. The header script's brand selector was updated from `label` to `label,span` because of this change.

## Not checked
Real screen readers; Safari/Firefox; the post/github `transition-*` swaps were checked visually only by class, with no per-page browser run; the blog/error layouts' `<main id>` was not opened in a browser.

---

## Rework after REOPEN #1 (`evidence/verifier/2026-10-19/ui-review-239-reopen.md`)
Status: **sealed_pending_verifier** (iteration 2 of max 3). Hub bytes before rework: 156292.

| REOPEN reason | Fix |
|---|---|
| 1. Lint warning `app.vue:8 vue/attributes-order` (my earlier note said only "exit 0", without reading the output) | `npx eslint --fix app.vue` moved `class` before `@click.prevent`. `npm run lint` output is now only `> eslint .`, with no problems line |
| 2. Missing comments row; stale `h3` in `Experiences.vue` comments | Lines 3 and 122 now say `h2`. Comments row added below |
| 3. Tab/URL desync: `?tab` was read only on mount, so `gr` or header `_resume` cleared the query but kept the tab | `Index.vue` `onMounted` now (a) applies a valid deep-linked tab via `select`, which also scrolls, and (b) installs `watch(route.query.tab)` → `active = tabFromUrl() ?? default`. The watch only syncs state and never scrolls, so `gr` doesn't jump down. It stays client-only for ISR |
| Non-blocking: `target=_blank` without rel at `contact/Index.vue:47` and `github/part/Item.vue:60` | `rel="noopener noreferrer"` added to both |
| Non-blocking: `Skills.vue` `.line-icon` imgs, and the 404 page lacking a skip link and theme-color | Not in the issue; left as-is (scope) |

### Acceptance
| Check | Result |
|---|---|
| comments per code-comments.md | Added: `app.vue` `<!-- -->` on the skip link (WHY: a hash makes scrollBehavior fight later scrolls; href kept for no-JS) and `//` on theme-color (WHY: matches `--theme-canvas`). In `Index.vue`: `//` on router.replace (WHY the URL holds the tab; the default keeps a clean URL), `//` on onMounted (WHY client-only: ISR), `//` on the watch (WHY: query changes without a remount). Changed: `Experiences.vue` overview + `.position` comment, h3→h2 so they stay accurate. All are single-sentence `//` or one block, none restate the code, no issue refs |
| build / lint / typecheck | exit 0 / exit 0 with no problems line / exit 0 with 0 `error TS` |
| Browser `/private/tmp/claude-501/-Users--david-Workspace-Project-resume-datvt243-github-io/909a3f24-74c6-4b9c-819a-fc85ca8e1ff7/scratchpad/fix239/t.cjs` | 37 pass / 0 fail |
| Browser `/private/tmp/claude-501/-Users--david-Workspace-Project-resume-datvt243-github-io/909a3f24-74c6-4b9c-819a-fc85ca8e1ff7/scratchpad/fix239/t2.cjs` (new: tab↔URL sync) | `/?tab=skills` then `gr` → about-me with no query; header `_resume` → about-me; active tab always matches the URL; unknown tab → about-me; 0 Vue/hydration warnings. One FAIL is a test expectation error: after the header click pushed `/`, Back correctly returned to `/?tab=education` with tab 4, consistent with the URL |
| Regressions | autoscroll 24/0, github `/` 27/0, header 13/0 |
