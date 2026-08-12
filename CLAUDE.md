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
that `@import`s per-mode files from `tokens/` (`dark.css`, `light.css`), each
scoped to a `.dark`/`.light` class. `@nuxt/ui` auto-installs `@nuxtjs/color-mode`
(forced `classSuffix: ''`), which puts that class on `<html>` and exposes the
`useColorMode()` composable (used by `ThemeHeader`'s toggle button); `nuxt.config.ts`'s
`colorMode` key sets `preference`/`fallback` to `'dark'` so existing users see no
change until they opt into light. Adding another mode (e.g. Dracula) = a new
`tokens/<name>.css` scoped to `.<name>` + one `@import` line + wiring it into the
toggle.

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

## Bug Fix / Feature Workflow

For any tracked bug fix or feature (not one-off docs/config tweaks), follow this
process. `/start-work` automates steps 1–3, `/finish-work` automates steps 4–5,
`/merge-work` automates step 6.

1. **Create a GitHub issue** (`gh issue create`) describing the bug/feature before
   writing any code. Get the issue number from the result.
2. **Sync `main`**: `git checkout main && git pull` (check `git status` first —
   don't discard uncommitted work silently).
3. **Branch from `main`**, named `bug/<issue_number>` or `feature/<issue_number>`
   (issue number only, no slug).
4. Do the work. Log it in `agent-hub/histories/` per the section below, then
   commit as usual.
5. **Never push directly to `main`.** Push the branch and open a pull request
   (`gh pr create --base main`) referencing the issue (e.g. `Closes #<n>`).
6. **On merge**: `bug/*` branches may be deleted after merging
   (`gh pr merge --delete-branch`); `feature/*` branches must be kept — never
   delete them, even after merge.

`/ship` remains available for untracked quick changes (docs, config) and also
refuses to push while on `main`.

## Agent Work Log (`agent-hub/histories/`)

Before starting any bug fix or feature work, check `agent-hub/histories/` (sorted by
filename, newest last) for recent entries — they carry context and decisions that
aren't derivable from the code/git history alone (why something was scoped the way it
was, what was deliberately left alone, what the natural next step is).

Write/update the log **when creating a commit**, not after every individual fix or
feature — batch everything the commit covers into one entry rather than logging each
small step separately, to avoid repeated busywork within a single working session.
Target `agent-hub/histories/YYYY-MM-DD.md` for the day of the commit. If a file for
that day already exists, append a new `##`-level section to it rather than
overwriting. (Skip entirely for pure Q&A/research/read-only work, and for anything
never committed.) Write it so a future session with zero memory of this conversation
can pick up the thread. Cover, at minimum:

- **Goal** — what was being fixed/built and why (the actual user ask, not a
  restatement of the diff).
- **What was done** — the concrete steps/decisions, in order, including anything
  deliberately left alone or judgment calls made (and why).
- **Current state** — build/lint/test status, what was verified and how (e.g.
  screenshots, which routes), what's committed vs. still pending.
- **Possible next steps** — open threads, known follow-ups, things worth
  double-checking later.

See `agent-hub/histories/2026-08-11.md` for the format this was modeled on.

## Known Issues

- GitHub API calls fall back to unauthenticated requests if `GITHUB_TOKEN` is unset or rejected (see `server/api/github.ts`).
