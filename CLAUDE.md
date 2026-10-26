# CLAUDE.md

## Project

Personal portfolio & blog of Võ Tấn Đạt (datvt243). Nuxt 4 SSR app with ISR caching.

## Stack

- Nuxt 4 · Vue 3 · TypeScript
- TailwindCSS v4 + @nuxt/ui v4 + @nuxt/icon
- Pinia (stores in `stores/`)
- puppeteer-core (PDF resume download)
- sass (global styles in `assets/css/`)

## Commands

```bash
npm run dev         # dev server
npm run build       # SSR build
npm run generate    # static site
npm run preview     # preview build
npm run lint        # eslint (npm run lint:fix to autofix)
npx nuxi typecheck  # build strips types without checking them
npm test            # Vitest unit tests (tests/), pure functions only
```

Unit tests cover only a few pure functions (skill grouping, the resume
field whitelist, the adapter); they don't replace the rest. "Verified" =
clean build + lint + typecheck + `npm test`, plus a real browser check for
UI changes (run `/browser` first).

## Architecture

### Pages & Caching

| Route | Cache | Data source |
|---|---|---|
| `/` | ISR 60s | `/api/resume` |
| `/github` | ISR 60s | `/api/github` |
| `/contact` | prerender | `app.config.ts` |
| `/projects` | none (no routeRule) | `useResumeStore` |
| `/blogs` | ISR 60s | `/api/blogs/posts` |
| `/blogs/[id]` | ISR true | `/api/blogs/detail/[id]` |

### Server API (`server/api/`)

- All handlers use `defineCachedEventHandler` (maxAge 12 days), except:
  - `/api/blogs/posts` — 1h, keyed by page/perPage/category.
  - `/api/generate-pdf` — plain handler + module-level in-memory cache (1 day);
    `defineCachedEventHandler` doesn't correctly cache its binary PDF body.
  - `/api/visit` (POST) — uncached relay for `VisitTracker.client.ts`; the
    backend has no CORS for a direct browser call.
- External APIs:
  - Resume: `${NODE_API}/api/me/${MY_EMAIL}`
  - Blog: `https://blog-api-nodejs-express.onrender.com/api/v1/`
  - GitHub: `https://api.github.com/users/${GITHUB_USER}`

### UI layer

- `pages/*.vue` are thin loaders: only `definePageMeta` + `useSeoMeta` (+
  route-param fetches) rendering exactly one `Theme*` component. Never put
  markup there.
- All presentational code lives in `themes/<ACTIVE_THEME>/` (`ACTIVE_THEME`
  in `nuxt.config.ts`, currently `portfolio-dev`). Theme structure, color
  mode, Dracula palette and keyboard navigation: `.claude/rules/theme.md`
  (auto-loads when touching `themes/**`, `pages/**`, `app.vue`,
  `assets/css/main.css`).
- `components/ListRender.vue` — the only component outside the theme: a
  generic status-driven slot dispatcher (500ms-delay loading state).

### State (Pinia)

- `useResumeStore` — fetches `/api/resume`, exposes getters: `hero`, `contact`, `social`, `experiences`, `educations`, `projects`, `foreignLanguages`, `skills`, `personalSkills`, `groups`.

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
GISCUS_CATEGORY=             # GitHub Discussions category name for blog comments (e.g. "Comments")
GISCUS_CATEGORY_ID=          # Discussions category ID from https://giscus.app's config generator
GISCUS_REPO_ID=              # Repo ID from https://giscus.app's config generator
DEPLOY_HOOK_URL=             # Optional: POSTed by `/release` after tagging main; unset → deploy step skipped, not failed
SITE_URL=                    # Optional: canonical origin for sitemap.xml/rss.xml/hreflang (server/utils/siteUrl.ts); defaults to https://resume-nuxt-vert.vercel.app — NOT datvt243.github.io (that serves an unrelated static page)
```

- `GISCUS_*` unset (current state) → `ThemePostComments`
  (`themes/portfolio-dev/pages/post/Comments.vue`) renders a "not
  configured" placeholder instead of a broken embed. The repo name
  `datvt243/datvt243.github.io` is a hardcoded constant there, not an env var.

<!--
Giscus one-time operator setup, in order:
1. Enable GitHub Discussions on this repo.
2. Install the Giscus GitHub App: github.com/apps/giscus/installations/new
3. Run https://giscus.app's config generator against this repo to get the
   real GISCUS_CATEGORY_ID / GISCUS_REPO_ID values.
-->

## Agent-Hub (`agent-hub/`) & git workflow

- Tracked bug/feature code work goes through **agent-hub**
  (`agent-hub/README.md`): an **implementer** writes the diff, a separate
  **verifier** independently SEALs or REOPENs it.
  ```
  /boot                          # orientation, read-only
  /worker implementer "<task>"   # smallest diff, build+lint+typecheck+test, evidence note
  /worker verifier "<task>"      # independent check → SEAL or REOPEN
  /todo "<task>"                 # both passes in one command
  /release [patch|minor|major]   # staging → main: merge, tag vX.Y.Z, deploy if configured
  ```
- `/ship` is only for quick, untracked changes (docs/config).
- Never push directly to `main` or `staging` — both are GitHub-protected, PR-only.
- Branch `bug/<issue_number>` or `feature/<issue_number>` off `staging`
  (not `main`); open the PR into `staging` with `Closes #<n>`. Both branch
  kinds may be deleted after merge.
- `main` is production and only receives code from `staging`, via
  `/release` or a manual `staging`→`main` PR.
- Audit trail lives in `agent-hub/evidence/`. `agent-hub/histories/` is the
  legacy work log — keep, don't write to it.
- Why each convention exists: Decisions table in
  `agent-hub/doctrine/domains/PROJECT.md`.

## Known Issues

- GitHub API calls fall back to unauthenticated requests if `GITHUB_TOKEN` is unset or rejected (see `server/api/github.ts`).
