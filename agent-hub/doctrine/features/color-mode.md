# Light/dark color mode

- Status: draft
- Source: backfill from code
- Issues: -
- Anchors: `nuxt.config.ts`, `themes/portfolio-dev/layout/Header.vue`, `themes/portfolio-dev/tokens.css`, `themes/portfolio-dev/settings-colors-theme/dark.css`, `themes/portfolio-dev/settings-colors-theme/light.css`, `themes/portfolio-dev/settings-colors-theme/editor-dracula.css`, `server/plugins/RenderHTML.ts`, `app.vue`, `themes/portfolio-dev/pages/post/Comments.vue`

## Goal
Visitors read the site in a dark (default) or light palette; the editor panel
keeps a Dracula-like code look in both.

## Behavior
1. Default preference and fallback are `dark` (`nuxt.config.ts` `colorMode`),
   regardless of the visitor's OS setting, until they toggle.
2. The header button shows a sun icon in dark mode and a moon icon in light
   mode; clicking sets the preference to the other mode. Its aria-label says
   "switch to light"/"switch to dark" (localized). @nuxtjs/color-mode keeps
   the choice for later visits.
3. The mode is a `.dark` / `.light` class on `<html>`; `dark.css` (also on
   `:root`) and `light.css` define the `--theme-*` tokens that every
   `*-theme-*` utility reads.
4. Inside `<ThemePanel>` (the only `.editor-scope` element),
   `editor-dracula.css` overrides the code tokens for each mode; it is not a
   third mode.
5. The server adds `class="bg-theme-canvas text-theme-text"` to `<body>`
   (`server/plugins/RenderHTML.ts`). **Invariant:** this must use theme
   tokens, never a literal color class like `bg-slate-950` — a literal color
   breaks light mode invisibly (recorded in `doctrine/domains/PROJECT.md`).
6. `<meta name="theme-color">` is `#ffffff` in light mode and `#020617`
   otherwise, so mobile browser chrome matches the page background.
7. The Giscus comments widget follows the mode (see `blog-post.md`).

## Acceptance criteria
- `grep -nE 'bg-(slate|gray|zinc|neutral|black|white)' server/plugins/RenderHTML.ts`
  prints nothing.
- A first visit (no stored preference) renders `<html class="dark">`.
- Clicking the toggle switches `<html>` to `light`, the page background turns
  white, and a reload keeps light.
- `npm run build` and `npm run lint` are clean.

## Edge cases
- Visitor's OS is in light mode → still dark on first visit.
- No JS → the server-rendered default (dark) stays.

## Out of scope
- A "system" option, more than two palettes, per-page themes.

## Open questions
1. The site ignores the OS color preference on first visit (always dark).
   Intended, or should it follow `prefers-color-scheme`?
2. The toggle has no visible text, only an icon + aria-label. Fine for the
   design?

## Changelog
| Date | Change | Why | Node |
|---|---|---|---|
| 2026-11-06 | Backfilled from code | /spec-backfill | - |
