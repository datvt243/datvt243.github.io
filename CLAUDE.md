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
| `/github` | ISR 60s | GitHub API (direct in component) |
| `/contact` | prerender | `app.config.ts` |
| `/blogs` | ISR 60s | `/api/blogs/posts` |
| `/blogs/[id]` | ISR true | `/api/blogs/detail/[id]` |

### Server API (`server/api/`)

All handlers use `defineCachedEventHandler` (maxAge 12 days) except `/api/blogs/posts` (1h, keyed by page/perPage/category).

External APIs:
- Resume: `${NODE_API}/api/me/${MY_EMAIL}`
- Blog: `https://blog-api-nodejs-express.onrender.com/api/v1/`
- GitHub: `https://api.github.com/users/datvt243`

### Components

- `components/resumeObject/` — active CV UI (JSON object-notation style). This is what renders on `/`.
- `components/resume/` — old unused CV components, kept but fully commented out.
- `components/github/` — GitUser, GitRepos (debounced search + language filter), part/Item.
- `components/post/` — Detail, Item, Loading. Comment & CommentForm are placeholder UI only (no backend).
- `components/template/` — Header (mobile slideover), Footer.
- `components/PostCategories.vue` — blog sidebar, fetches via `fetchWithRetry`.

### State (Pinia)

- `useResumeStore` — fetches `/api/resume`, exposes getters: `hero`, `contact`, `social`, `experiences`, `educations`, `projects`, `foreignLanguages`, `skills`, `groups`.
- `useGithub` — exists but unused; `github/Index.vue` calls GitHub API directly.

### Layouts

- `default` — plain wrapper for most pages.
- `blog` — provides `{ category, page, perPage }` via `provide/inject` + desktop category sidebar.
- `error` — minimal container used by `error.vue`.

## Environment Variables

```env
MY_EMAIL=       # Owner email, used as resume API key
NODE_API=       # Resume backend base URL
GITHUB_TOKEN=   # GitHub token (currently commented out in code)
GITHUB_USER=    # GitHub username (currently hardcoded as 'datvt243')
```

## Known Issues

- `post/Item.vue` has an unused `import { ar } from 'cronstrue/...'` — dead import.
- `server/utils/createPDF.ts` has a malformed HTML tag: `<link rel="icon" href="/>`.
- `useRouterQuery.ts` composable is unused; blog layout uses `provide/inject` instead.
- Comment system is UI-only (no API wired up).
- GitHub token is commented out everywhere — API calls are unauthenticated (rate-limit risk).
