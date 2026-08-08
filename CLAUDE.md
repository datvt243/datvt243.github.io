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

- `components/resumeObject/` — active CV UI (JSON object-notation style). This is what renders on `/`.
- `components/github/` — GitUser, GitRepos (debounced search + language filter), part/Item.
- `components/post/` — Author, Detail, Item, Loading, RelatedArticles.
- `components/template/` — Header (mobile slideover), Footer.
- `components/PostCategories.vue` — blog sidebar, fetches via `fetchWithRetry`.

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

## Known Issues

- GitHub API calls fall back to unauthenticated requests if `GITHUB_TOKEN` is unset or rejected (see `server/api/github.ts`).
