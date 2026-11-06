# doctrine/features/INDEX.md — feature docs

> One row per feature. Look a feature up here by area/files, then open
> only that one doc. `status`: `draft` = not yet confirmed (intent, not
> truth) · `verified` = a SEALED node implemented it, or the operator
> confirmed a backfilled doc (every open question answered).
> Every `<slug>.md` here uses the format below exactly — whoever writes
> it (analyst, or another agent doing a bulk backfill: always `Status:
> draft`, `Source: backfill from code`).

| Feature | Doc | Status | Area / anchors | Issues |
|---|---|---|---|---|
| Resume home page | resume-home.md | draft | home `/`: `pages/index.vue`, `server/api/resume.ts`, `server/utils/fetchResume.ts`, `stores/resume.ts`, `themes/portfolio-dev/pages/resumeObject/` | - |
| Dev / HR resume view toggle | resume-view-toggle.md | draft | home: `composables/useResumeView.ts`, `themes/portfolio-dev/pages/resumeObject/Hr.vue`, `themes/portfolio-dev/layout/Header.vue` | - |
| Resume PDF download | resume-pdf-download.md | draft | home: `composables/useDownloadResume.ts`, `server/api/generate-pdf.ts`, `server/utils/createPDFAts.ts` | #29, #179, #198, #206 |
| Projects page with technology filter | projects.md | draft | `/projects`: `themes/portfolio-dev/pages/projects/Index.vue`, `themes/portfolio-dev/components/FilterFolder.vue`, `utils/sortProjects.ts` | - |
| GitHub profile and repositories | github-profile.md | draft | `/github`: `server/api/github.ts`, `server/utils/fetchGithub.ts`, `themes/portfolio-dev/pages/github/` | - |
| Contact page | contact.md | draft | `/contact`: `themes/portfolio-dev/pages/contact/Index.vue`, `app.config.ts` | - |
| Blog list with categories and pagination | blog-list.md | draft | `/blogs`: `layouts/blog.vue`, `themes/portfolio-dev/pages/blogs/Index.vue`, `server/api/blogs/posts.ts`, `server/api/blogs/categories.ts`, `server/utils/cacheGetPost.ts` | - |
| Blog post detail with comments | blog-post.md | draft | `/blogs/[id]`: `server/api/blogs/detail/[id].ts`, `server/utils/sanitizePostHtml.ts`, `themes/portfolio-dev/pages/post/` | - |
| Language switch (vi / en) | i18n-language-switch.md | draft | site-wide: `nuxt.config.ts` i18n, `i18n/locales/`, `themes/portfolio-dev/layout/Header.vue`, `app.vue` | - |
| Light/dark color mode | color-mode.md | draft | site-wide: `themes/portfolio-dev/settings-colors-theme/`, `server/plugins/RenderHTML.ts`, `themes/portfolio-dev/layout/Header.vue` | - |
| Keyboard navigation and shortcut help | keyboard-navigation.md | draft | site-wide: `themes/portfolio-dev/components/KeyNav.vue`, `app.config.ts` menuPrimary | - |
| SEO feeds: RSS, sitemap, robots | seo-feeds.md | draft | `server/routes/rss.xml.ts`, `server/routes/sitemap.xml.ts`, `server/routes/robots.txt.ts`, `server/utils/siteUrl.ts` | - |
| Error and 404 page | error-page.md | draft | `error.vue`, `layouts/error.vue` | - |

## Doc format — `doctrine/features/<slug>.md`
~~~markdown
# <Feature name>

- Status: draft | verified — verified by `<verdict note path>` | verified —
  confirmed by operator <date>, see `<analyst note path>`
- Source: feature request | backfill from code
- Issues: #<n>[, #<n>...]
- Anchors: `<path>`, `<path>` (real paths, grep-confirmed)

## Goal
<1-3 lines: who needs this and why>

## Behavior
<numbered, observable rules: "when X, the system does Y". This is the
spec a fix is checked against.>

## Acceptance criteria
<each one measurable: a test command from doctrine/MEMORY.md, or an exact
observable result. Copied onto the diagram node by pick_next.>

## Edge cases
<input/state → expected result>

## Out of scope
<what this feature deliberately does NOT do>

## Open questions
<none, or each question + the operator's answer once given>

## Changelog
| Date | Change | Why | Node |
|---|---|---|---|
~~~
