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
| Resume home page | resume-home.md | verified — confirmed by operator 2026-11-07, see `evidence/analyst/2026-11-07/resume-home-spec.md` | home `/`: `pages/index.vue`, `server/api/resume.ts`, `server/utils/fetchResume.ts`, `stores/resume.ts`, `themes/portfolio-dev/pages/resumeObject/` | #417, #419, #420, #421 |
| Dev / HR resume view toggle | resume-view-toggle.md | verified — confirmed by operator 2026-11-07, see `evidence/analyst/2026-11-07/resume-view-toggle-spec.md` | home: `composables/useResumeView.ts`, `themes/portfolio-dev/pages/resumeObject/Hr.vue`, `themes/portfolio-dev/layout/Header.vue` | #422 |
| Resume PDF download | resume-pdf-download.md | verified — confirmed by operator 2026-11-07, see `evidence/analyst/2026-11-07/resume-pdf-download-spec.md` | home: `composables/useDownloadResume.ts`, `server/api/generate-pdf.ts`, `server/utils/createPDFAts.ts` | #29, #179, #198, #206, #423 |
| Projects page with technology filter | projects.md | verified — confirmed by operator 2026-11-07, see `evidence/analyst/2026-11-07/projects-spec.md` | `/projects`: `themes/portfolio-dev/pages/projects/Index.vue`, `themes/portfolio-dev/components/FilterFolder.vue`, `utils/sortProjects.ts` | #426, #434, #435 |
| GitHub profile and repositories | github-profile.md | verified — confirmed by operator 2026-11-07, see `evidence/analyst/2026-11-07/github-profile-spec.md` | `/github`: `server/api/github.ts`, `server/utils/fetchGithub.ts`, `themes/portfolio-dev/pages/github/` | #436 |
| Contact page | contact.md | verified — confirmed by operator 2026-11-07, see `evidence/analyst/2026-11-07/contact-spec.md` | `/contact`: `themes/portfolio-dev/pages/contact/Index.vue`, `app.config.ts` | #426, #437 |
| Blog list with categories and pagination | blog-list.md | verified — confirmed by operator 2026-11-07, see `evidence/analyst/2026-11-07/blog-list-spec.md` | `/blogs`: `layouts/blog.vue`, `themes/portfolio-dev/pages/blogs/Index.vue`, `server/api/blogs/posts.ts`, `server/api/blogs/categories.ts`, `server/utils/cacheGetPost.ts` | #415, #416, #424, #426, #429, #430 |
| Blog post detail with comments | blog-post.md | verified — confirmed by operator 2026-11-07, see `evidence/analyst/2026-11-07/blog-post-spec.md` | `/blogs/[id]`: `server/api/blogs/detail/[id].ts`, `server/utils/sanitizePostHtml.ts`, `themes/portfolio-dev/pages/post/` | #416, #421, #424, #431, #432 |
| Language switch (vi / en) | i18n-language-switch.md | verified — confirmed by operator 2026-11-07, see `evidence/analyst/2026-11-07/i18n-language-switch-spec.md` | site-wide: `nuxt.config.ts` i18n, `i18n/locales/`, `themes/portfolio-dev/layout/Header.vue`, `app.vue` | #417, #424, #425, #426 |
| Light/dark color mode | color-mode.md | verified — confirmed by operator 2026-11-07, see `evidence/analyst/2026-11-07/color-mode-spec.md` | site-wide: `themes/portfolio-dev/settings-colors-theme/`, `server/plugins/RenderHTML.ts`, `themes/portfolio-dev/layout/Header.vue` | - |
| Keyboard navigation and shortcut help | keyboard-navigation.md | verified — confirmed by operator 2026-11-07, see `evidence/analyst/2026-11-07/keyboard-navigation-spec.md` | site-wide: `themes/portfolio-dev/components/KeyNav.vue`, `app.config.ts` menuPrimary | #438 |
| SEO feeds: RSS, sitemap, robots | seo-feeds.md | verified — confirmed by operator 2026-11-07, see `evidence/analyst/2026-11-07/seo-feeds-spec.md` | `server/routes/rss.xml.ts`, `server/routes/sitemap.xml.ts`, `server/routes/robots.txt.ts`, `server/utils/siteUrl.ts` | #425, #433 |
| Error and 404 page | error-page.md | verified — confirmed by operator 2026-11-07, see `evidence/analyst/2026-11-07/error-page-spec.md` | `error.vue`, `layouts/error.vue` | #418, #427, #428 |

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
