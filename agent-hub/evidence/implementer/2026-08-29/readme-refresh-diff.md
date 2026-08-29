# 2026-08-29 — readme-refresh (diff)

- Worker: implementer
- Version: 0.1.0
- Node: `haven/diagrams/dev-loop.prime-mermaid.md` → `readme-refresh`
- Status: `sealed_pending_verifier`

## Diff
| File | Why |
|---|---|
| `README.md` | Added missing `GISCUS_*` env vars + optional note; new "Feeds" section (`/rss.xml`, `/sitemap.xml`); `/blogs/[id]` row now mentions Giscus comments; new i18n bilingual-routing note under Pages; new `@nuxtjs/i18n` Tech Stack bullet |

```diff
--- a/README.md
+++ b/README.md
@@ -13,6 +13,7 @@ Visit: [https://resume-nuxt-vert.vercel.app](https://resume-nuxt-vert.vercel.app)
 - **TailwindCSS** v3 + **@nuxt/ui**
 - **Pinia** — state management
 - **puppeteer-core** — PDF generation
+- **@nuxtjs/i18n** — Vietnamese/English localization

 ---

@@ -25,7 +26,20 @@ Visit: [https://resume-nuxt-vert.vercel.app](https://resume-nuxt-vert.vercel.app)
 | `/github` | GitHub profile & repositories |
 | `/contact` | Contact information |
 | `/blogs` | Blog list with category filter |
-| `/blogs/[id]` | Blog post detail |
+| `/blogs/[id]` | Blog post detail, with Giscus (GitHub Discussions) comments |
+
+The site is bilingual (Vietnamese/English) via `@nuxtjs/i18n`. Vietnamese
+is the default and keeps unprefixed URLs (e.g. `/blogs`); English is
+served under an `/en/*` prefix (e.g. `/en/blogs`).
+
+---
+
+## Feeds
+
+| Route | Description |
+|---|---|
+| `/rss.xml` | RSS 2.0 feed of the 20 most recent blog posts |
+| `/sitemap.xml` | Sitemap covering the static routes plus one `<url>` per blog post |

 ---

@@ -39,8 +53,14 @@ NODE_API=                    # Base URL of the resume API
 GITHUB_TOKEN=                # GitHub personal access token
 GITHUB_USER=                 # GitHub username
 PUPPETEER_EXECUTABLE_PATH=   # Chrome/Chromium binary path for PDF generation (required in production)
+GISCUS_CATEGORY=             # GitHub Discussions category name for blog comments (e.g. "Comments")
+GISCUS_CATEGORY_ID=          # Discussions category ID from https://giscus.app's config generator
+GISCUS_REPO_ID=              # Repo ID from https://giscus.app's config generator
 ```

+`GISCUS_*` are optional — the comments widget on `/blogs/[id]` renders a
+"not configured" placeholder instead of a broken embed until they're set.
+
 ---

 ## Development
```

## Command
```
rm -rf node_modules/.cache .nuxt .output && npm run build
```
Exit code `0`. Tail:
```
Σ Total size: 28.5 MB (10.5 MB gzip)
[nitro] ✔ You can preview this build using node .output/server/index.mjs
```

```
nvm use 24 && npm run lint
```
Verbatim tail:
```
✖ 32 problems (0 errors, 32 warnings)
```
Unchanged from the current baseline (established by the just-merged
`blog-posts-shape-fix` node) — expected, since `README.md` isn't part of
any lint/build target.

## Browser verification
N/A — no runtime/visual behavior changed, docs-only diff. No CDP pass
needed per doctrine (`domains/PROJECT.md`'s Browser verification section
only applies when a change has a visual/behavior part the user would see
in the running app).

## Acceptance
| Criterion | Evidence | Met? |
|---|---|---|
| `GISCUS_*` env vars documented | `git diff` above | ✅ |
| i18n + Giscus comments mentioned in Pages | `git diff` above | ✅ |
| `/rss.xml`/`/sitemap.xml` documented | `git diff` above, new "Feeds" section | ✅ |
| Build/lint still clean | Tail above, exit 0 / `32 problems (0 errors, 32 warnings)` | ✅ |

## Noticed, not done
- Root `CLAUDE.md` already documents `GISCUS_*` correctly (used as the
  reference for README's wording) — no drift found there, nothing to fix.
- The README's `## Credits` section and the "Visit" URL at the top are
  unrelated to issue #90's scope, left untouched.

## Seal gate
None — no commit/push/PR/delete in this pass. `git status` shows only
working-tree changes on `feature/90`.
