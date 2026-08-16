# 2026-08-16 — editor-dracula-scope (plan)

- Worker: implementer
- Version: 0.1.0
- Node: `haven/diagrams/dev-loop.prime-mermaid.md` → `editor-dracula-scope`
- Task (verbatim, combining 2 exchanges): "make a separate theme for the
  file-tree + editor. apply the Dracula theme" + confirmed via
  AskUserQuestion: scope = file-tree + editor only (not the whole site);
  + further clarified: "dracula follows the dark theme, implement another
  theme that follows the light theme" — i.e. Dracula is tied to the
  existing dark mode (not a 3rd mode/toggle), and a matching palette is
  needed for light mode too, with NO new toggle — automatically following
  the existing dark/light toggle.

## Current state (read before writing)
`<ThemePanel>` (`themes/portfolio-dev/components/Panel.vue`) is the ONLY
DOM root that wraps the ENTIRE "editor" content: the file-tree sidebar
(`ThemeFolder`/`ThemeNavItem`/`ThemeFilterFolder`/`ThemePostCategories`),
the filetab, and all main content (resume sections via `ThemeCodeBlock` +
`Experiences.vue`, the contact form, project cards, the github repo list).
Confirmed via grep: EVERY usage of `ThemeFolder`/`ThemeNavItem`/
`ThemeFilterFolder`/`ThemePostCategories`/`ThemeCodeBlock` lives inside
`<ThemePanel>` — no usage outside it (header/footer/Hero use different
primitives, `ThemeCornerFrame` is unrelated).

Every child component already uses the CORRECT system tokens
(`bg-theme-panel`, `text-theme-muted`, `border-theme-border`,
`text-theme-code-*`, ...) — 0 literal colors left after the just-SEALED
`light-theme-code-syntax-contrast` node (one known exception, out of
scope: `text-blue-400` in `projects/Index.vue` line 62, a pre-existing
literal, not the bug the user reported this time).

CSS custom properties are standard inherited properties — the value
applied to an element is decided by the rule that matches THAT element
most closely (not by text specificity), not by a rule matching a more
distant ancestor. This means: if a class (`editor-scope`) is placed on
`<ThemePanel>`'s root and `.dark .editor-scope { --theme-panel: X; ... }`
is defined, every descendant using `bg-theme-panel` inside it will
automatically read X — WITHOUT needing to edit any child component
(Folder/NavItem/FilterFolder/CodeBlock/PostCategories/Experiences.vue stay
100% unchanged).

## Plan (smallest diff, leveraging the CSS variable inheritance mechanism)
1. New file `themes/portfolio-dev/settings-colors-theme/editor-dracula.css`:
   - `.dark .editor-scope { ... }` — standard Dracula (11 canonical
     colors: Background #282a36, Current Line #44475a, Foreground
     #f8f8f2, Comment #6272a4, Cyan #8be9fd, Green #50fa7b, Orange
     #ffb86c, Pink #ff79c6, Purple #bd93f9, Red #ff5555, Yellow #f1fa8c —
     per the official draculatheme.com spec), mapped onto all ~25
     existing tokens (`--theme-canvas/panel/panel-subtle/editor/border*/
     text*/muted/faint/accent*` + 10 `--theme-code-*`). A few
     intermediate roles (`text-soft`, `muted`, `code-punct`) have no
     dedicated canonical color → linearly interpolated between Foreground
     and Comment (2 canonical anchor points), not inventing a new hue.
   - `.light .editor-scope { ... }` — a derived "Dracula-light" palette:
     Background ↔ Foreground swapped roles (Foreground #f8f8f2 used as
     the light background, Background #282a36 used as the dark text —
     same 2 canonical colors, roles swapped), keeping each accent hue's
     identity (Pink/Cyan/Green/Yellow/Purple) but darkened for enough
     contrast on a light surface (same technique used at the node
     `light-theme-code-syntax-contrast`).
2. `themes/portfolio-dev/tokens.css`: add
   `@import './settings-colors-theme/editor-dracula.css';` (3rd line,
   after dark/light).
3. `themes/portfolio-dev/components/Panel.vue`: add the class
   `editor-scope` to the root `<div>` (just 1 class, nothing else
   changed).
4. Root `CLAUDE.md` — "UI Theme"/"Color mode" section: add a short
   paragraph documenting the new mechanism (a scoped token override via a
   class on `<ThemePanel>`) so a future agent doesn't have to re-derive it
   from scratch.
5. `agent-hub/doctrine/domains/PROJECT.md` — Decisions table: 1 row
   recording the decision + reasoning (Dracula only applies to the
   editor, not the whole site; rides the existing dark/light toggle, no
   new toggle added).

## Acceptance criteria
| # | Criterion |
|---|---|
| 1 | Header/footer/the page outside `<ThemePanel>` does NOT change color in either mode (compare computed style before/after) |
| 2 | Dark mode: inside `<ThemePanel>`, background/text/accent/syntax-highlight match the 11 canonical Dracula colors exactly (checked via computed style through CDP, cross-referenced hex→rgb) |
| 3 | Light mode: inside `<ThemePanel>`, there's a distinct palette (different from both Dracula dark AND the current light chrome), with enough contrast to read |
| 4 | No new toggle needed — switching dark/light with the existing button flips the editor automatically |
| 5 | `npm run build` clean, `npm run lint` clean |
| 6 | No child component file was edited (Folder/NavItem/FilterFolder/CodeBlock/PostCategories/Experiences.vue/utils/*CodeLines.ts) — only 1 new CSS file + `tokens.css` (1 import line) + `Panel.vue` (1 class) |

## Files
- `themes/portfolio-dev/settings-colors-theme/editor-dracula.css` (new)
- `themes/portfolio-dev/tokens.css`
- `themes/portfolio-dev/components/Panel.vue`
- `CLAUDE.md` (root)
- `agent-hub/doctrine/domains/PROJECT.md`

## Blocked by
None.
