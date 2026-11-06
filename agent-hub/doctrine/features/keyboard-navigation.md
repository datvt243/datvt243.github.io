# Keyboard navigation and shortcut help

- Status: draft
- Source: backfill from code
- Issues: -
- Anchors: `themes/portfolio-dev/components/KeyNav.vue`, `themes/portfolio-dev/components/Kbd.vue`, `themes/portfolio-dev/layout/Header.vue`, `app.config.ts`, `themes/portfolio-dev/pages/resumeObject/Index.vue`, `themes/portfolio-dev/pages/resumeObject/Hero.vue`, `themes/portfolio-dev/pages/github/GitRepos.vue`, `app.vue`

## Goal
Keyboard users (and developers who like Vim keys) move around the site
without a mouse.

## Behavior
1. One global `keydown` listener (mounted with the header). Keys with
   Ctrl/Cmd/Alt, or already handled events, are ignored.
2. While typing in an input/textarea/select/contenteditable, shortcuts are
   off; `Esc` blurs the field to give keys back.
3. `?` toggles the help dialog. While it is open, other shortcuts are off.
   On `lg+` screens a `?` button in the header opens it too.
4. `g` then a key within 1s: `gg` scrolls to top; `g<key>` goes to the
   `menuPrimary` route with that key in the current locale — `gr` resume,
   `gp` projects, `gh` github, `gc` contact. Any other second key cancels.
5. `j` / `k` scroll down/up by 80px; `G` scrolls to the bottom.
6. Page shortcuts are declared in markup with `data-shortcut` +
   `data-shortcut-label`; a key matching a visible element focuses and clicks
   it (default prevented). Current ones: `1`–`4` resume tabs and `c` Contact
   me, `D` download CV (home); `/` repo search (github).
7. The help dialog lists the `g` routes, the motions (j, k, gg, G, ?), an
   "On this page" section built from the visible `data-shortcut` elements
   when opened, and a note about Vimium-like extensions.
8. Header tabs show their `g<key>` hint and in-page controls show their key
   in a `<kbd>` style badge (`aria-hidden`).
9. A "skip to content" link (first focusable element) moves focus to
   `#main-content` without changing the URL hash.

## Acceptance criteria
- On `/`, typing `g` then `p` navigates to `/projects`; on `/en`, to
  `/en/projects`.
- Typing `?` opens the "Keyboard shortcuts" dialog; on `/` it lists
  "On this page" entries including the CV download (`D`).
- Typing `j` in the GitHub search box types `j` and does not scroll.
- Pressing `/` on `/github` focuses the search box without typing `/`.

## Edge cases
- `g` then nothing for 1s → prefix cleared, next key acts normally.
- Disabled target (CV button while loading) → focus only, click is a no-op.

## Out of scope
- User-configurable bindings, a `gb` blog shortcut (blog is out of the nav).

## Open questions
1. The `?` header button is hidden below `lg`, so on tablets/phones with a
   keyboard the help is reachable only via `?`. Intended?
2. `c` (Contact me on `/`) and `gc` (global contact) both exist. Keep both?

## Changelog
| Date | Change | Why | Node |
|---|---|---|---|
| 2026-11-06 | Backfilled from code | /spec-backfill | - |
