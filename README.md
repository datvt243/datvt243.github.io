# datvt243.github.io

Personal portfolio and blog of **Võ Tấn Đạt** — resume, projects, GitHub and a bilingual Vietnamese/English blog, with a "code editor" style UI and Vim-style keyboard navigation.

Live site: https://resume-nuxt-vert.vercel.app

## Contents

- [Quick start](#quick-start)
- [Environment variables](#environment-variables)
- [Pages](#pages)
- [Keyboard shortcuts](#keyboard-shortcuts)
- [Tech stack](#tech-stack)
- [Contributing & git workflow](#contributing--git-workflow)
- [Credits](#credits)
- [License](#license)

## Quick start

```bash
npm install
cp .env.example .env   # then fill in the values, see the section below
npm run dev            # dev server
```

Other commands:

```bash
npm run build      # SSR build
npm run generate   # static build
npm run preview    # preview the build
npm run lint       # eslint (npm run lint:fix to autofix)
```

## Environment variables

```env
MY_EMAIL=                    # Email used to fetch the resume data
NODE_API=                    # Base URL of the resume API
GITHUB_TOKEN=                # GitHub token (unset → unauthenticated API calls)
GITHUB_USER=                 # GitHub username
PUPPETEER_EXECUTABLE_PATH=   # Chrome/Chromium path for PDF export (required in production)
GISCUS_CATEGORY=             # GitHub Discussions category name for blog comments
GISCUS_CATEGORY_ID=          # From https://giscus.app
GISCUS_REPO_ID=              # From https://giscus.app
DEPLOY_HOOK_URL=             # Optional: /release calls this URL after tagging main
SITE_URL=                    # Optional: canonical domain for sitemap/rss/hreflang (default https://resume-nuxt-vert.vercel.app)
```

`GISCUS_*` are optional — when unset, the comment box shows a "not configured" notice instead of breaking.

Data comes from 3 external APIs: the resume API (`${NODE_API}/api/me/${MY_EMAIL}`), the blog API (`https://blog-api-nodejs-express.onrender.com/api/v1/`) and the GitHub API.

## Pages

| Route | Content |
|---|---|
| `/` | Resume |
| `/projects` | Projects, filterable by technology |
| `/github` | GitHub profile & repos |
| `/contact` | Contact info |
| `/blogs` | Post list, filterable by category |
| `/blogs/[id]` | Post detail, comments via Giscus |
| `/rss.xml` | RSS 2.0 — the 20 latest posts |
| `/sitemap.xml` | Sitemap of the static pages + every post |

Bilingual via `@nuxtjs/i18n`: Vietnamese is the default, with unprefixed URLs (`/blogs`); English lives under `/en/*` (`/en/blogs`).

## Keyboard shortcuts

Press `?` (or the `?` button in the header) to see every shortcut for the current page.

| Key | Action |
|---|---|
| `gr` `gp` `gh` `gc` | Go to Resume / Projects / GitHub / Contact |
| `j` / `k` | Scroll down / up |
| `gg` / `G` | Jump to top / bottom of the page |
| `D` | Resume page: download resume |
| `1`–`5` | Resume page: switch personal-info tab |
| `/` / `Esc` | GitHub page: focus / leave the repo search box |
| `?` | Toggle the shortcuts panel |

Shortcuts are paused while typing in an input. If an extension like Vimium grabs the keys, press `i` to pass keys to the page, or exclude this site in the extension's settings.

## Tech stack

Nuxt 4 (SSR + ISR) · Vue 3 + TypeScript · TailwindCSS v4 + @nuxt/ui v4 · Pinia · puppeteer-core (PDF export) · @nuxtjs/i18n

## Contributing & git workflow

- `main` and `staging` are both GitHub-protected: no direct pushes, PRs only.
- Create a `bug/<issue-number>` or `feature/<issue-number>` branch off `staging`, open the PR into `staging`.
- `main` is production and only receives code from `staging` via `/release` (merge commit, tag `vX.Y.Z`, runs build + lint first).
- Code changes go through the agent-hub workflow (implementer → independent verifier → ship) — see [`agent-hub/README.md`](agent-hub/README.md) and [`CLAUDE.md`](CLAUDE.md).
- Bug reports / suggestions: [GitHub Issues](https://github.com/datvt243/datvt243.github.io/issues).

## Credits

The "code editor" UI (tab bar, file tree, status bar) is inspired by [developer-portfolio-v2](https://github.com/alexdeploy/developer-portfolio-v2) — designed by [@darelova](https://www.behance.net/darelova), developed by [@alexdeploy](https://github.com/alexdeploy). This project is a full rewrite on its own data/API layer, with no code copied from the original repo.

## License

No license chosen yet — all rights reserved by the author.
