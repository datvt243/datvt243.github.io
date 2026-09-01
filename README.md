# datvt243.github.io

Personal portfolio & blog site of **Võ Tấn Đạt**.

Visit: [https://resume-nuxt-vert.vercel.app](https://resume-nuxt-vert.vercel.app)

---

## Tech Stack

- **Nuxt 3** (SSR + ISR)
- **Vue 3** + TypeScript
- **TailwindCSS** v3 + **@nuxt/ui**
- **Pinia** — state management
- **puppeteer-core** — PDF generation
- **@nuxtjs/i18n** — Vietnamese/English localization

---

## Pages

| Route | Description |
|---|---|
| `/` | Resume / CV |
| `/projects` | Projects, filterable by technology |
| `/github` | GitHub profile & repositories |
| `/contact` | Contact information |
| `/blogs` | Blog list with category filter |
| `/blogs/[id]` | Blog post detail, with Giscus (GitHub Discussions) comments |

The site is bilingual (Vietnamese/English) via `@nuxtjs/i18n`. Vietnamese
is the default and keeps unprefixed URLs (e.g. `/blogs`); English is
served under an `/en/*` prefix (e.g. `/en/blogs`).

---

## Feeds

| Route | Description |
|---|---|
| `/rss.xml` | RSS 2.0 feed of the 20 most recent blog posts |
| `/sitemap.xml` | Sitemap covering the static routes plus one `<url>` per blog post |

---

## Environment Variables

Copy `.env.example` to `.env` and fill in the values:

```env
MY_EMAIL=                    # Email used to fetch resume data
NODE_API=                    # Base URL of the resume API
GITHUB_TOKEN=                # GitHub personal access token
GITHUB_USER=                 # GitHub username
PUPPETEER_EXECUTABLE_PATH=   # Chrome/Chromium binary path for PDF generation (required in production)
GISCUS_CATEGORY=             # GitHub Discussions category name for blog comments (e.g. "Comments")
GISCUS_CATEGORY_ID=          # Discussions category ID from https://giscus.app's config generator
GISCUS_REPO_ID=              # Repo ID from https://giscus.app's config generator
```

`GISCUS_*` are optional — the comments widget on `/blogs/[id]` renders a
"not configured" placeholder instead of a broken embed until they're set.

---

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Generate static site
npm run generate

# Preview production build
npm run preview
```

---

## Git Workflow

Two-tier branching, both `main` and `staging` are GitHub branch-protected
(no direct push, PR required — enforced for real, not just convention):

```
bug/<issue>, feature/<issue>  →  staging  →  main
   (branch off staging)         (PR)         (/release only)
```

- **`staging`** is the integration branch. All `bug/<issue_number>` and
  `feature/<issue_number>` branches branch off `staging` (not `main`) and
  PR back into `staging`.
- **`main`** is production. It only ever receives code from `staging`, via
  the `/release` command (or a manual `staging`→`main` PR) — never
  directly from a `bug/*`/`feature/*` branch.
- **Branch protection** on both branches: PR required, `enforce_admins`
  on (no bypassing as an admin), 0 required approving reviews. That last
  part is deliberate, not lax: GitHub doesn't allow a PR author to approve
  their own PR, so requiring ≥1 approval would block this repo's own
  self-merge automation (`/ship --merge`, `/release`) with no second
  reviewer account available. PR-required + `enforce_admins` still blocks
  every direct push either way.
- **Releasing**: `/release` merges `staging` → `main` with a real merge
  commit (not squash), so `main` keeps `staging`'s individual commit
  history instead of collapsing it into one commit. It runs `npm run
  build` + `npm run lint` first and refuses to merge if either fails,
  bumps the version (semver, `vX.Y.Z` tag), calls a deploy webhook if
  `DEPLOY_HOOK_URL` is configured (skips with a clear message if not),
  then syncs the version bump back to `staging`.

Day-to-day code changes on this repo go through **agent-hub**
(`agent-hub/README.md`) — an implementer/verifier discipline with
evidence notes, on top of this same branch model. See the root
`CLAUDE.md`'s "Agent-Hub" section for the full loop.

---

## External APIs

- **Resume API** — `${NODE_API}/api/me/${MY_EMAIL}`
- **Blog API** — `https://blog-api-nodejs-express.onrender.com/api/v1/`
- **GitHub API** — `https://api.github.com/users/${GITHUB_USER}`

---

## Credits

The "code editor" UI theme (tab-bar navigation, sidebar file-tree, status bar) is inspired by
[developer-portfolio-v2](https://github.com/alexdeploy/developer-portfolio-v2), designed by
[@darelova](https://www.behance.net/darelova) and developed by
[@alexdeploy](https://github.com/alexdeploy). This project reimplements the visual concept from
scratch against its own data/API layer — no code was copied from the reference repo.
