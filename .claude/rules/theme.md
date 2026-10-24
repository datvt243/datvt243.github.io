---
paths:
  - "themes/**"
  - "pages/**"
  - "app.vue"
  - "tailwind.config.js"
---

# UI Theme (`themes/`)

The whole visual/presentational layer is a swappable theme — including the
"content" components (resumeObject/github/post listings), since their
JSON/file-tree/code-block metaphor is itself an editor-theme choice.

## Structure
- Each `pages/*.vue` renders exactly one `Theme*` component:
  `index.vue` → `ThemeResumeObject`, `github.vue` → `ThemeGithub`,
  `contact.vue` → `ThemeContact`, `projects.vue` → `ThemeProjects`,
  `blogs/index.vue` → `ThemeBlogs`, `blogs/[id].vue` → `ThemePostDetail`.
- Three auto-imported, `Theme`-prefixed dirs in `themes/portfolio-dev/`:
  - `pages/` — one subfolder per route (`resumeObject/`, `github/`, `post/`,
    `contact/`, `projects/`, `blogs/`), each owning its own data fetching
    (`useFetch`/`useAsyncData`/`useResumeStore`) and markup.
  - `layout/` — site-wide chrome rendered by `app.vue`: `Header.vue`
    (`ThemeHeader`), `Footer.vue` (`ThemeFooter`, status bar).
  - `components/` — reusable chrome: `PostCategories`, `PageHeading`, the
    primitives (`Panel`, `Folder`, `NavItem`, `FilterFolder`, `CodeBlock`,
    `CornerFrame`), `KeyNav`, `Kbd` (the one shortcut-badge style).
- Nuxt's directory-based naming does the prefixing (per `components:` in
  `nuxt.config.ts`): `themes/portfolio-dev/pages/resumeObject/Hero.vue` →
  `<ThemeResumeObjectHero>`.
- Use semantic Tailwind classes (`bg-theme-panel`, `border-theme-border`,
  `text-theme-muted`, `text-theme-accent`, `font-theme-mono`, …), never
  literal colors. Defined in `tailwind.config.js` as
  `rgb(var(--theme-x) / <alpha-value>)`, backed by the theme's `tokens.css`.
- New theme = `themes/<name>/` with a `tokens.css` (same CSS variable names,
  new values) + `pages/`/`layout/`/`components/` providing every tag that
  `pages/*.vue` and `app.vue` render, then flip `ACTIVE_THEME`. No file in
  top-level `pages/` changes.

## Color mode (light/dark)
- Orthogonal to the theme: same components, different `--theme-*` values.
- `tokens.css` only `@import`s `settings-colors-theme/dark.css` and
  `light.css`, scoped to `.dark`/`.light` — the one place to reskin the
  palette.
- Values MUST be `R G B` triplets (e.g. `234 88 12`), not hex — the
  `bg-theme-*/50` opacity modifiers depend on it.
- `@nuxt/ui` auto-installs `@nuxtjs/color-mode` (forced `classSuffix: ''`),
  which puts the class on `<html>`; `ThemeHeader`'s toggle uses
  `useColorMode()`. `nuxt.config.ts`'s `colorMode` defaults to `'dark'`.
- New full-site mode = `settings-colors-theme/<name>.css` scoped to
  `.<name>` + one `@import` + wire into the toggle.

## Editor-scoped palette (Dracula)
- `settings-colors-theme/editor-dracula.css` is NOT a 3rd mode: it overrides
  tokens under `.dark .editor-scope`/`.light .editor-scope`, and only
  `<ThemePanel>`'s root carries `editor-scope`. Descendants inherit via CSS
  custom properties, so no child component needed changes.
- Same technique (class + scoped override block) re-skins any other subtree.
- Gotcha: anything that must look the same inside and outside the panel
  needs a token Dracula doesn't override — shortcut badges use
  `--theme-kbd`, not `--theme-accent` (which turns purple in `<ThemePanel>`).

## Keyboard navigation (Vim-style, `ThemeKeyNav`)
- Mounted once by `ThemeHeader`, which owns its `v-model` (header `?`
  button opens the same help overlay).
- Global keys: `g`+`menuPrimary[].key` (`app.config.ts`: r/p/h/b/c)
  navigates via `localePath`; `j`/`k` scroll; `gg`/`G` top/bottom; `?`
  toggles the overlay. Ignored while typing in a form field or with
  Ctrl/Meta/Alt held; `Esc` in a form field blurs it.
- Page shortcuts are declared in markup, not JS: add
  `data-shortcut="<key>"` + `data-shortcut-label="<text>"` to a visible
  clickable element; KeyNav `focus()`+`click()`s it, `preventDefault`s the
  key, and lists it in the overlay. Existing: resume hero `c` contact /
  `d` download CV, personal-info tabs `1`–`5`, GitHub repo search `/`.
- Never reuse a key taken by a global motion (g/j/k/G/?).
- Vimium-like extensions swallow these keys — test in a clean/incognito
  profile (see `agent-hub/doctrine/domains/PROJECT.md` Traps).
