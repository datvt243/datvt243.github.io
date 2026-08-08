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

---

## Pages

| Route | Description |
|---|---|
| `/` | Resume / CV |
| `/projects` | Projects, filterable by technology |
| `/github` | GitHub profile & repositories |
| `/contact` | Contact information |
| `/blogs` | Blog list with category filter |
| `/blogs/[id]` | Blog post detail |

---

## Environment Variables

Copy `.env.example` to `.env` and fill in the values:

```env
MY_EMAIL=                    # Email used to fetch resume data
NODE_API=                    # Base URL of the resume API
GITHUB_TOKEN=                # GitHub personal access token
GITHUB_USER=                 # GitHub username
PUPPETEER_EXECUTABLE_PATH=   # Chrome/Chromium binary path for PDF generation (required in production)
```

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
