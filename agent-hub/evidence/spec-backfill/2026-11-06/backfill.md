# /spec-backfill — 2026-11-06

- Scope: all (no argument). Branch `chore/agent-hub-analyst`. No code changed, no commit.
- Method: read each feature's code (pages, theme components, server API/routes/utils, config); every anchor path checked to exist on disk.
- Test commands: present in `doctrine/MEMORY.md` (`npm test`, `npm run build`, `npm run lint`, `npx nuxi typecheck`) — no `<<FILL>>` gap.

## Docs written (all `Status: draft`, `Source: backfill from code`)

- `doctrine/features/resume-home.md`
- `doctrine/features/resume-view-toggle.md`
- `doctrine/features/resume-pdf-download.md`
- `doctrine/features/projects.md`
- `doctrine/features/github-profile.md`
- `doctrine/features/contact.md`
- `doctrine/features/blog-list.md`
- `doctrine/features/blog-post.md`
- `doctrine/features/i18n-language-switch.md`
- `doctrine/features/color-mode.md`
- `doctrine/features/keyboard-navigation.md`
- `doctrine/features/seo-feeds.md`
- `doctrine/features/error-page.md`

## Skipped
- Already indexed: none (INDEX.md table was empty).
- Trimmed by operator: header/footer navigation, visit tracking (`plugins/VisitTracker.client.ts`, `server/api/visit.post.ts`).
- Merged by operator: blog comments (Giscus) into `blog-post.md`.
- Not user-facing, not listed: security headers/script CSP, `server/plugins/ApiCacheControl.ts`, `plugins/ErrorHandler.ts`, `components/ListRender.vue` (covered inside `blog-list.md`).

## Open questions per doc

### resume-home.md
1. `pages/index.vue` renders an empty page (no message) when the API returns
   200 with an empty `resume` object (`isValid` false). Intended, or should it
   be an error/empty state?
2. `certificates`, `awards` and `career` are whitelisted and sent to the
   browser but not shown on the page (the PDF uses certificates/awards).
   Intended?
3. `/api/resume` on Vercel ISR allows only the `lang` query (60s); the
   handler itself caches 12 days. Is the 12-day server cache the intended
   max staleness after a backend edit?

### resume-view-toggle.md
1. Should the HR choice survive a reload or be linkable (e.g. `?view=hr`)?
   Today it deliberately does not (ISR comment in `useResumeView.ts`), but a
   recruiter sharing the link gets the Dev view.
2. The toggle is shown on every page, even where it has no local effect;
   intended (it doubles as a shortcut to `/` in HR view)?

### resume-pdf-download.md
1. If Chrome fails during `page.setContent`/`page.pdf`, `browser.close()` is
   never called (no try/finally) — a possible leaked Chrome process per
   failure. Intended to fix?
2. The object URL created for the download is never revoked. Acceptable?
3. `useDownloadResume.ts`'s comment mentions an "About tab's own button", but
   only `Hero.vue` uses the composable now. Is a second button still wanted?
4. The 1-day in-memory cache means a backend resume edit can take up to a day
   (per warm instance) to reach the PDF. Intended?

### projects.md
1. Root `CLAUDE.md` says `/projects` has "none (no routeRule)", but
   `nuxt.config.ts` sets `isr: 60` for `/projects` and `/en/projects`. Which is
   intended (the doc or the config)?
2. "Project <n>" renumbers when filtering (a project's number changes).
   Intended?
3. The clear button's aria-label "Clear filters" in `FilterFolder.vue` is
   hardcoded English, not i18n. Intended?
4. The filter selection is not kept in the URL, so a filtered view can't be
   shared. Wanted?

### github-profile.md
1. `GitUser.vue` uses `v-if="props.user || Object.keys(props.user).length"` —
   the `||` makes the "no data" branch effectively unreachable (and would
   throw on `null`). Was `&&` intended?
2. Name search is case-sensitive (`name.includes(search)`). Intended?
3. "Updated on" date is always formatted `en-US` (UTC), even in Vietnamese.
   Intended?
4. No empty state when search/filter matches nothing (blank list). Wanted?
5. The profile-name link opens in the same tab while repo links open a new
   tab. Intended?

### contact.md
1. The mail subject is always English ("Portfolio contact from …") even on
   the Vietnamese page. Intended?
2. `contact.google_map` exists in `app.config.ts` but nothing renders it.
   Remove, or should the page show a map?
3. Labels `_name:`/`_email:`/`_message:` and the button `submit-message` are
   untranslated (code-metaphor). Confirm that is deliberate like the nav tab
   names.

### blog-list.md
1. Pagination and the "Show:" selector change local state only — the URL
   (`?page`, `?per-page`) is not updated, so a page can't be linked and a
   reload returns to page 1. Intended?
2. `fetchKey` in `themes/portfolio-dev/pages/blogs/Index.vue` is computed
   once from the initial values; after paging, the cache key no longer
   matches the shown page. Intended, or should the key be reactive?
3. Category links (`/blogs?category=`) and post links (relative
   `blogs/<id>`) don't use `localePath`, so on `/en/blogs` a category click
   drops back to the Vietnamese URL. Bug?
4. On a categories fetch error, both "couldn't load categories" and "No
   categories" show (the `v-else` belongs to the list, not the error). Bug?
5. Category link aria-label "View posts tagged <name>" and ListRender's
   "No data" / "loading ..." are hardcoded English. Intended?
6. ListRender's 500ms delay is set once at mount, not per loading phase, so
   later loads show skeletons immediately. Intended?
7. The layout reads `per-page` but the API uses `perPage` / upstream
   `per_page`. Confirm `?per-page` is the public URL name.

### blog-post.md
1. `Detail.vue` hardcodes `<time datetime="2023-08-05T00:00:00.000Z">` for
   every post instead of the post's `createdAt`. Bug?
2. "Back to the blog" links to `/blogs` without `localePath`, so `/en` readers
   go back to the Vietnamese list. Bug?
3. The detail cache uses `name: 'api-resume'` (same name as the resume
   handler; keys differ: `api-post-<id>`). Copy-paste leftover — rename?
4. The "Missing ID" branch in the detail API returns a 200 with
   `status: false`; route validation makes it unreachable from the page.
   Keep or remove?
5. Giscus `mapping: pathname` means `/blogs/<id>` and `/en/blogs/<id>` get
   two separate discussion threads. Intended?
6. A post content edit can take up to 12 days to show (detail cache maxAge).
   Intended?

### i18n-language-switch.md
1. Several links bypass `localePath` (blog category links, blog post links,
   "Back to the blog"), dropping `/en` readers to Vietnamese URLs. Should every
   internal link keep the locale?
2. `sitemap.xml` lists only the Vietnamese URLs (no `/en/*`). Intended (see
   `seo-feeds.md`)?
3. Some strings are hardcoded English outside i18n (FilterFolder "Clear
   filters", ListRender "No data"/"loading ...", category aria-label,
   contact mail subject). Translate them, or intentional?

### color-mode.md
1. The site ignores the OS color preference on first visit (always dark).
   Intended, or should it follow `prefers-color-scheme`?
2. The toggle has no visible text, only an icon + aria-label. Fine for the
   design?

### keyboard-navigation.md
1. The `?` header button is hidden below `lg`, so on tablets/phones with a
   keyboard the help is reachable only via `?`. Intended?
2. `c` (Contact me on `/`) and `gc` (global contact) both exist. Keep both?

### seo-feeds.md
1. The sitemap has no `/en/*` URLs. Should English pages be listed (or via
   hreflang alternates in the sitemap)?
2. `/blogs` is in the sitemap though it is deliberately out of the nav.
   Intended?
3. The RSS channel title/description and `language` are fixed (`vi`) while
   the description text is English. Intended?

### error-page.md
1. `error.vue` keeps a large commented-out legacy block. Remove?
2. The 404 page has no "Try again" button by design; confirm.
3. The error page has no site header/footer, so the language, theme and
   dev/hr toggles and the keyboard shortcuts are unavailable there. Intended?
