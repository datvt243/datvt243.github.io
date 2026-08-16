# CLAUDE.md

## Project

Personal portfolio & blog of Võ Tấn Đạt (datvt243). Nuxt 3 SSR app with ISR caching.

## Stack

- Nuxt 3 · Vue 3 · TypeScript
- TailwindCSS v3 + @nuxt/ui v2 + @nuxt/icon
- Pinia (stores in `stores/`)
- puppeteer-core (PDF resume download)
- sass (global styles in `assets/css/`)

## Commands

```bash
npm run dev       # dev server
npm run build     # SSR build
npm run generate  # static site
npm run preview   # preview build
```

## Architecture

### Pages & Caching

| Route | Cache | Data source |
|---|---|---|
| `/` | ISR 60s | `/api/resume` |
| `/github` | ISR 60s | `/api/github` |
| `/contact` | prerender | `app.config.ts` |
| `/blogs` | ISR 60s | `/api/blogs/posts` |
| `/blogs/[id]` | ISR true | `/api/blogs/detail/[id]` |

### Server API (`server/api/`)

All handlers use `defineCachedEventHandler` (maxAge 12 days) except `/api/blogs/posts` (1h, keyed by page/perPage/category) and `/api/generate-pdf` (plain handler with a module-level in-memory cache, 1 day - `defineCachedEventHandler` doesn't correctly cache its binary PDF body).

External APIs:
- Resume: `${NODE_API}/api/me/${MY_EMAIL}`
- Blog: `https://blog-api-nodejs-express.onrender.com/api/v1/`
- GitHub: `https://api.github.com/users/${GITHUB_USER}`

### Components

- `components/ListRender.vue` — the only component left outside the theme: a generic
  status-driven slot dispatcher (500ms-delay loading state), reusable by any theme.
- Everything else presentational lives under `themes/portfolio-dev/` (`pages/`,
  `layout/`, `components/` — see below) — `pages/*.vue` are thin loaders with no
  theme-specific markup.

### UI Theme (`themes/`)

The site's entire visual/presentational layer is a swappable theme, not hardcoded into
`pages/` — including what used to be "content" components (resumeObject/github/post
listings), since their JSON/file-tree/code-block metaphor is itself an editor-theme
choice, not neutral markup. Every `pages/*.vue` file is just `definePageMeta` +
`useSeoMeta` (+ route-param-driven fetches, e.g. `blogs/[id].vue`'s
`useFetch('/api/blogs/detail/${id}')`) rendering exactly one `Theme*`-prefixed component:

- `pages/index.vue` → `ThemeResumeObject`, `pages/github.vue` → `ThemeGithub`,
  `pages/contact.vue` → `ThemeContact`, `pages/projects.vue` → `ThemeProjects`,
  `pages/blogs/index.vue` → `ThemeBlogs`, `pages/blogs/[id].vue` → `ThemePostDetail`.

A theme has three auto-imported dirs (all `Theme`-prefixed, split for discoverability):

- `themes/portfolio-dev/pages/` — one subfolder per route content
  (`resumeObject/`, `github/`, `post/`, `contact/`, `projects/`, `blogs/`), each
  owning its own data fetching (`useFetch`/`useAsyncData`/`useResumeStore`) and
  markup — these are exactly what the `pages/*.vue → Theme*` list above renders.
- `themes/portfolio-dev/layout/` — site-wide chrome outside page content,
  rendered directly by `app.vue`: `Header.vue` (top nav, tag `ThemeHeader`),
  `Footer.vue` (status bar, tag `ThemeFooter`).
- `themes/portfolio-dev/components/` — reusable chrome shared across the `pages/`
  content: `PostCategories.vue`, `PageHeading.vue`, and the 6 primitives
  (`Panel`, `Folder`, `NavItem`, `FilterFolder`, `CodeBlock`, `CornerFrame`).
- Semantic Tailwind classes (`bg-theme-panel`, `border-theme-border`,
  `text-theme-muted`, `text-theme-accent`, `font-theme-mono`, …) — defined in
  `tailwind.config.js` as `rgb(var(--theme-x) / <alpha-value>)`, backed by CSS
  custom properties from the active theme's `tokens.css`.

Nuxt's directory-based component naming does the prefixing automatically regardless
of which of the three dirs a file lives in (e.g.
`themes/portfolio-dev/pages/resumeObject/Hero.vue` → `<ThemeResumeObjectHero>`,
`themes/portfolio-dev/layout/Header.vue` → `<ThemeHeader>`), per the `components:`
entry in `nuxt.config.ts`.

The active theme is the `ACTIVE_THEME` constant in `nuxt.config.ts`, currently
`'portfolio-dev'` (`themes/portfolio-dev/`). Adding a new theme = create
`themes/<name>/` with a `tokens.css` (same CSS variable names as
`themes/portfolio-dev/tokens.css`, new values) and `pages/`+`layout/`+`components/`
trees providing a component for every tag each `pages/*.vue` file (and `app.vue`)
renders, then flip `ACTIVE_THEME`. No file under the top-level `pages/` needs to
change.

**Color mode (light/dark)** is an orthogonal axis to the theme itself — same
component tree, different `--theme-*` values. `tokens.css` is a thin aggregator
that `@import`s per-mode files from `settings-colors-theme/` (`dark.css`,
`light.css`), each scoped to a `.dark`/`.light` class — this is the one place
to look to reskin the palette (all values are `R G B` triplets, e.g.
`234 88 12`, required by Tailwind's `rgb(var(--theme-x) / <alpha-value>)`
opacity-modifier pattern in `tailwind.config.js` — don't switch to hex without
also reworking every `bg-theme-*/50`-style opacity usage). `@nuxt/ui`
auto-installs `@nuxtjs/color-mode` (forced `classSuffix: ''`), which puts that
class on `<html>` and exposes the `useColorMode()` composable (used by
`ThemeHeader`'s toggle button); `nuxt.config.ts`'s `colorMode` key sets
`preference`/`fallback` to `'dark'` so existing users see no change until they
opt into light. Adding another full-site mode = a new
`settings-colors-theme/<name>.css` scoped to `.<name>` + one `@import` line +
wiring it into the toggle.

**Editor-scoped palette**: `settings-colors-theme/editor-dracula.css` is a
different kind of file — not a 3rd full-site mode, but a Dracula override
scoped to `.dark .editor-scope`/`.light .editor-scope` that re-skins only
`<ThemePanel>`'s subtree (Panel.vue's root carries `editor-scope`), riding on
top of whichever mode above is active. Because every descendant inside
`<ThemePanel>` already reads `--theme-*`/`--theme-code-*` via CSS custom
property inheritance, this needed zero changes to Folder/NavItem/
FilterFolder/CodeBlock/PostCategories/Experiences.vue. The same technique —
a class + a scoped override block — is the way to re-skin any other subtree
independently of the site-wide mode, without touching that subtree's markup.

### State (Pinia)

- `useResumeStore` — fetches `/api/resume`, exposes getters: `hero`, `contact`, `social`, `experiences`, `educations`, `projects`, `foreignLanguages`, `skills`, `groups`.

### Layouts

- `default` — plain wrapper for most pages.
- `blog` — provides `{ category, page, perPage }` via `provide/inject` + desktop category sidebar.
- `error` — minimal container used by `error.vue`.

## Environment Variables

```env
MY_EMAIL=                    # Owner email, used as resume API key
NODE_API=                    # Resume backend base URL
GITHUB_TOKEN=                # GitHub token; falls back to unauthenticated requests if unset/rejected
GITHUB_USER=                 # GitHub username
PUPPETEER_EXECUTABLE_PATH=   # Chrome/Chromium binary path for PDF generation (required in production)
```

## Agent-Hub (`agent-hub/`)

Bug fix / feature work in this repo goes through **agent-hub**
(`agent-hub/README.md`) — a doctrine/haven/evidence hub with two separated
roles, **implementer** (writes the diff) and **verifier** (independently
checks it before anything is marked done). This replaced
`start-work`/`finish-work`/`merge-work` and the `agent-hub/histories/`
work-log convention on 2026-08-16 (see `agent-hub/doctrine/domains/PROJECT.md`'s
Decisions table for why). `/ship` was recreated afterward for quick,
untracked changes only (docs/config, not node-tracked code work) — updated
to match agent-hub's seal gate: it commits but always stops for approval
before `git push`, it no longer pushes automatically.

```
/boot                              # 60s orientation, reads doctrine + diagram + evidence, no edits
/worker implementer "<task>"       # pick a node, smallest diff, build+lint, evidence note
/worker verifier "<task>"          # independent check → SEAL or REOPEN
/todo "<task>"                     # both of the above in one command, still 2 separate passes
```

Git mechanics are unchanged and still enforced (not automated by agent-hub):
never push directly to `main`; branch `bug/<issue_number>` or
`feature/<issue_number>` off `main`; open a PR referencing the issue
(`Closes #<n>`); `bug/*` branches may be deleted after merge, `feature/*`
branches are kept. For UI checks, run `/browser` first (see
`agent-hub/doctrine/domains/PROJECT.md`'s "Browser verification" section)
instead of driving Chrome/CDP by hand.

`agent-hub/histories/` (the old dated work-log files) is kept as-is for
historical reference — not deleted, no longer the active audit trail. New
audit trail lives in `agent-hub/evidence/`.

## Known Issues

- GitHub API calls fall back to unauthenticated requests if `GITHUB_TOKEN` is unset or rejected (see `server/api/github.ts`).
