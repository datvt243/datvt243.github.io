# 2026-09-06 — editor-dracula-github-item-fix (plan)

- Worker: implementer
- Node: `haven/diagrams/dev-loop.prime-mermaid.md` → `editor-dracula-github-item-fix` (new)
- Task (verbatim, operator): "xử lý #145 luôn đi"

## Hub bytes before: 75160

## Node exists? No — created new node `editor-dracula-github-item-fix`, IN_PROGRESS.

## Investigation (before touching code)
1. Re-read #145 in full (`gh issue view 145`) and the sealed precedent node
   `editor-dracula-badge-label-fix`'s evidence.
2. Read `themes/portfolio-dev/pages/github/part/Item.vue` in full. Confirmed
   both bugs: line 9 (`text-blue-400`) and line 59 (`<UBadge variant="outline">`
   with no `:ui` override), both inside `<ThemePanel>`'s editor-scope
   (`Item.vue` → `GitRepos.vue` → `github/Index.vue`'s `<ThemePanel>`).
3. **Deviation from #145's literal suggestion**: the issue body suggested
   `text-blue-400` → `text-theme-accent` (copy-pasted from the
   `projects/Index.vue` precedent). Rejected that exact substitution here
   because line 10, right next to it, is `{ field: 'html_url', ...,
   class: 'text-theme-accent' }` already — using `text-theme-accent` for
   BOTH links would make the homepage-link icon and the github-link icon
   render as the exact same color, losing the original two-color visual
   distinction between the two link types (which the literal `blue-400` vs
   `text-theme-accent` pairing was already providing, just not in a
   theme-aware way).
4. Found a better token: `--theme-code-keyword` is defined as EXACTLY
   `96 165 250` (`blue-400`) in `dark.css` and `37 99 235` (`blue-600`) in
   `light.css` — a byte-for-byte match of the literal class being replaced,
   in both non-Dracula modes. In `editor-dracula.css` it resolves to Pink
   (`#ff79c6` dark-Dracula, a darkened Pink for the light-Dracula
   companion) — still a distinct hue from `--theme-accent`'s Purple,
   preserving the two-link-types visual distinction inside the editor too.
   `grep -n "theme-code-keyword" themes/portfolio-dev/settings-colors-theme/*.css`
   confirms all 4 values (dark/light/dracula-dark/dracula-light).
5. For the `<UBadge>` (#145's 2nd bug), reused the exact `techBadgeUi`
   pattern already proven and sealed in `projects/Index.vue` — no new
   investigation needed, the `dark:`-prefix requirement is already a known
   fact (`defuTwMerge`'s per-modifier-group merge, documented in the sealed
   node's evidence).

## Blockers
None.

## Acceptance criteria
1. `Item.vue:9`'s `text-blue-400` → `text-theme-code-keyword` (not
   `text-theme-accent` — see Deviation above), preserving the visual
   distinction from the adjacent `html_url` link's `text-theme-accent`.
2. `Item.vue:59`'s `<UBadge>` gets the same per-instance `:ui` override
   shape as the sealed `projects/Index.vue` fix (both non-dark and `dark:`
   variants of `text-theme-accent`/`ring-theme-accent/40`).
3. `npm run build` clean.
4. `npm run lint` clean, unchanged baseline (32 problems, 0 errors).
5. Real UI check via Chrome CDP on `/github`, both color modes — confirm
   both links keep visually distinct colors, the topic badges follow
   `--theme-accent`, 0 console errors.
