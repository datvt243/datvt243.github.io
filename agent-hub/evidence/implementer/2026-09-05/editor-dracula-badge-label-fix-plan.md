# 2026-09-05 — editor-dracula-badge-label-fix (plan)

- Worker: implementer
- Node: `haven/diagrams/dev-loop.prime-mermaid.md` → `editor-dracula-badge-label-fix` (new)
- Task (verbatim, operator): "xử lý #137 và #138 luôn đi" — operator's
  go-ahead answering both issues' own "Decision needed" section (do the
  fix, don't leave it a one-off exception).

## Hub bytes before: 73187

## Node exists? No — created new node `editor-dracula-badge-label-fix`,
IN_PROGRESS. Combined #137+#138 into one node (both are the same root
cause — a component/element inside `<ThemePanel>`'s editor-scope that
doesn't route through `--theme-*`, in the same file — same pattern
`dependency-upgrade-phase1`/`phase2` used to batch closely-related,
uniformly-classified changes into one node instead of a round-trip per
issue).

## Investigation (before touching code)
1. Re-read both issues' bodies in full via `gh issue view 137`/`138`.
2. Read `themes/portfolio-dev/pages/projects/Index.vue` in full — confirmed
   line 57 (`text-blue-400` project-label, #137) and line 66 (`<UBadge
   variant="outline">` tech-tag, #138) both render inside `<ThemePanel>`
   (root `editor-scope`, per `editor-dracula-scope`'s sealed node).
3. Confirmed the file's OWN established convention for "small distinguishing
   text/icon" is already `text-theme-accent` (used at line 50-51's hash-icon
   badge, in the same component) — the project-label fix (#137) has a
   directly citable in-file precedent, not an invented choice.
4. For #138 (`UBadge`), read `node_modules/@nuxt/ui/dist/runtime/
   components/elements/Badge.vue`'s real source: it accepts a per-instance
   `ui` prop (`useUI("badge", toRef(props, "ui"), config)`), and
   `badgeClass` does `variant?.replaceAll("{color}", props.color)` — an
   override string with NO `{color}` placeholder is used verbatim,
   unaffected by the `color` prop. This is the mechanism issue #138 itself
   asked to investigate ("does @nuxt/ui's theming support a scoped
   override... a component-level `ui` prop") — confirmed YES, avoiding the
   global `app.config.ts` change the issue flagged as higher-blast-radius.
5. Checked whether a plain `class="text-theme-accent ..."` prop (relying on
   `tailwind-merge`'s de-dup) would be simpler than the `ui` prop — rejected:
   the outline variant's dark-mode color comes from a separate `dark:
   text-{color}-400`/`dark:ring-{color}-400` class; a bare `text-theme-accent`
   class is a different Tailwind modifier group from `dark:text-orange-400`
   and `tailwind-merge` would NOT reliably resolve that conflict (both would
   ship, letting CSS source order — not the override — decide the winner).
   The `ui` prop replaces the whole `variant.outline` template string before
   Tailwind class generation, so both modes are covered deterministically.
6. Ran `grep -rn "UBadge"` across the repo — 3 usages total:
   - `projects/Index.vue` (in-scope, the one #138 names) — inside
     `<ThemePanel>`.
   - `themes/portfolio-dev/pages/github/part/Item.vue:59` — ALSO inside
     `<ThemePanel>` (via `GitRepos.vue` → `github/Index.vue`'s
     `<ThemePanel>`), same bug class, NOT named in #138.
   - `themes/portfolio-dev/pages/post/Item.vue:52` (via `blogs/Index.vue`)
     — NOT inside any `<ThemePanel>`, so not a Dracula-consistency bug at
     all; correctly left untouched.
7. Ran `grep -rn "text-blue-400"` across the repo — 2 hits total:
   - `projects/Index.vue:57` (in scope, #137).
   - `themes/portfolio-dev/pages/github/part/Item.vue:9` — ALSO inside
     `<ThemePanel>`, same bug class, NOT named in #137.

## Scope decision
Fix exactly what #137/#138 name (`projects/Index.vue`'s label + its
`UBadge`) — do NOT silently expand to the 2 newly-discovered instances in
`github/part/Item.vue` (`NodeBeforeCode`: no node/issue covers that file
yet). Both will be filed as new follow-up issues after this node seals
(same "Noticed, not done" → issue pattern already used earlier this
session for #135-#142).

## Blockers
None.

## Acceptance criteria
1. `projects/Index.vue:57`'s `text-blue-400` → `text-theme-accent`.
2. `projects/Index.vue:66`'s `<UBadge>` gets a per-instance `:ui` override
   (not a global `app.config.ts` change) so its outline variant uses
   `--theme-accent` instead of Nuxt UI's default `{color}` (`primary`)
   alias, in both light and dark mode.
3. `post/Item.vue`'s `UBadge` (outside editor-scope) and every other
   editor-scope color/token untouched — `SmallestDiff`.
4. `npm run build` clean.
5. `npm run lint` clean, unchanged baseline (32 problems, 0 errors).
6. Real UI check via Chrome CDP on `/projects`, BOTH color modes (default
   dark = Dracula per `editor-dracula-scope`, and light = the Dracula-light
   companion) — confirm the label and badge no longer show literal
   Tailwind blue, and nothing else regressed (image guard, tech-tag
   layout).
