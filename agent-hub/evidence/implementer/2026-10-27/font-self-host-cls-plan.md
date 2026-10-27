# 2026-10-27 - font-self-host-cls (plan)

- Worker: implementer · Version: 0.1.0
- Node: `font-self-host-cls` (`haven/diagrams/dev-loop.prime-mermaid.md`, appended last row; slug grepped in both diagram files → 0 hits)
- Task: issue #292 (operator: "Sửa font và xô lệch" — self-host Fira Code instead of the @import, stop the layout shift, Lighthouse before/after), branch `feature/292` off `staging` 0c31299, rebased on fb49db9

## Hub bytes before: 80076

## Plan
1. Drop the Google Fonts CSS `@import` (render-blocking, second origin). `font-face.scss` held only that import plus a `.fira-code` class used nowhere (`grep -rn fira-code` → only its own definition) → delete the file and its `css` entry.
2. Let @nuxt/fonts (already installed by @nuxt/ui, previously disabled with `ui.fonts: false`) self-host Fira Code: `fonts.families: [{ name: 'Fira Code', provider: 'google', global: true }]`. `global` is needed because the family only appears inside the `--theme-font-mono` custom property.
3. CLS: add a metric-matched fallback `@font-face` ('Fira Code Fallback' = local Courier New with fontaine's size/ascent/descent overrides) to `--theme-font-mono`, so the swap doesn't move text.

## Acceptance criteria
1. No request to fonts.googleapis.com / fonts.gstatic.com; Fira Code woff2 served from `/_fonts` (same origin).
2. Lighthouse (median of 3) before vs after on `/en` and `/en/projects`, mobile + desktop: render-blocking Google CSS gone, CLS not worse, and the font-swap shift gone **for a visitor without Fira Code installed**.
3. No visual change once fonts load (H1 with Vietnamese glyphs, editor panel).
4. build/lint/typecheck/`npm test` clean; comments per code-comments.md.
