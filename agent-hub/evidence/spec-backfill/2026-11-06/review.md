# Spec-backfill review — 2026-11-06

- Isolation proof: this review ran as a separate spawned agent with task description "Verify datvt specs vs code+live". It did not write the docs.
- Branch: `chore/agent-hub-analyst` (no commit, no code change; edits limited to `agent-hub/doctrine/features/*.md` + this note).
- Code state: working tree only touches agent-hub/.claude files, so app code == branch HEAD.
- Live: https://resume-nuxt-vert.vercel.app, read-only GETs (curl) + an isolated headless Chrome (puppeteer-core, own profile). The shared Playwright browser was in use by another agent, so it was dropped after one call. PDF generation: triggered 0 times.
- Side effect: the client plugin `plugins/VisitTracker.client.ts` POSTs `/api/visit` on every browser page load, so about 10 headless visits were recorded in the backend's visit stats. No form was submitted.

## Checks run
- Format: all 13 docs have `Status: draft`, `Source: backfill from code`, and all 7 sections plus Goal. Every doc has an INDEX row. Every `Anchors:` path exists (scripted `[ -e ]` loop, 0 missing).
- Code: read every anchored file for each Behavior item.
- Live: `/`, `/en`, `/projects`, `/en/projects`, `/github`, `/contact`, `/en/contact`, `/blogs`, `/en/blogs`, a post, `/rss.xml`, `/sitemap.xml`, `/robots.txt`, `/does-not-exist`, `/en/does-not-exist`, `/api/resume[?lang=en|xx]`, `/api/github`, `/api/blogs/{posts,categories,detail/does-not-exist}`. UI checks: tabs + `?tab`, `1`/`2` keys, dev/hr, `?` dialog, `gp`, theme toggle + reload, locale switch, `/` search, language filter, project OR filter + clear, the English 404 home button.

## Per doc

| Doc | Verdict | Notes |
|---|---|---|
| resume-home.md | FIXED | B7: `_contact.ts` is `to="/contact"` (`resumeObject/Index.vue`, no `localePath`). Live `/en` renders `href="/contact"`. Behavior reworded and Open Q4 added. Live confirms: `?tab=skills` selects skills.ts, clicking tab 1 clears `?tab`, key `2` sets `?tab=skills`, a single Person JSON-LD, title "Resume Võ Tấn Đạt", OG image, and no private keys in `/api/resume` (python walk: 0 leaks; keys = whitelist). |
| resume-view-toggle.md | PASS | Live: HR shows 4 headings and hides the editor tabs, toggling restores them; dev/hr on `/projects` lands on `/` in HR (4 headings); a reload goes back to Dev (0 HR headings). |
| resume-pdf-download.md | FIXED | B7 said "All values are HTML-escaped". Wrong: `createPDFAts.ts` `simplifyRichText` allow-lists tags for descriptions and does not escape them. Corrected. The Issues line was normalized to the format. Live PDF was not triggered, so the live check is pending. Note: the `curl -sI` criterion is a HEAD request that still generates a PDF. |
| projects.md | PASS | Live: SAPUI5+Pinia gives 2 of 3 projects (OR), × gives 3 again; `/en/projects` shows "Project 1..3"; ISR `x-vercel-cache: STALE`; 4 `target="_blank" rel="noopener noreferrer"` links. |
| github-profile.md | PASS | Live: 22 repos, `any(fork)` = false; `/` focuses the search; `j` typed in search stays in the field (scrollY 0); filter Python gives only Python; search is case-sensitive ("Vue" matches 0, Open Q2 confirmed); dates `en-US` (Open Q3 confirmed). |
| contact.md | PASS | Live: `/contact` "Tân Bình, Hồ Chí Minh", `/en/contact` "Tan Binh, Ho Chi Minh"; 3 required inputs, email `type="email"`; grommet github/linkedin/globe; `x-vercel-cache: HIT` (prerender). The form was not submitted. |
| blog-list.md | FIXED | Open Q3 said post links drop `/en`. Wrong: relative `blogs/<id>` resolves to `href="/en/blogs/<id>"` on live `/en/blogs`. Corrected. Added Open Q8 (category filter broken live, see bugs), Open Q9 (no timeout on categories, raw 504 live), the exactly-50-words edge case, and a note that the category criterion fails live. |
| blog-post.md | FIXED | Criterion said Giscus is unset "(current state)". Wrong: the live payload has `GISCUS_CATEGORY:"Announcements"`, `GISCUS_CATEGORY_ID`, `GISCUS_REPO_ID`. Reworded. Added Open Q7 (detail fetch has no timeout, raw 504 live while the blog API was cold). Live confirms the hardcoded `<time datetime="2023-08-05…">` (Q1), `href="/blogs"` back link on `/en` (Q2), `rel="author noopener"`, and 404 for an unknown id once warm. |
| i18n-language-switch.md | FIXED | The criterion `grep -c 'hreflang'` printed 1 live because the HTML is one line. Replaced with `grep -o … \| wc -l` (5 live). Open Q1 corrected: post links do keep `/en`, and `_contact.ts` was added to the list. Live: `lang="vi-VN"` / `lang="en-US"`, canonical per locale, `/github` locale button goes to `/en/github`, aria "VI, Chuyển ngôn ngữ". |
| color-mode.md | PASS | Live: first visit `<html class="dark">`, theme-color `#020617`, body `bg-theme-canvas text-theme-text`; the toggle gives `light`, body `rgb(255,255,255)`, theme-color `#ffffff`, localStorage `nuxt-color-mode: light`, and light survives a reload. |
| keyboard-navigation.md | PASS | Live: `gp` goes to `/projects` (from `/en`: `/en/projects`). `?` dialog lists g-routes, motions, "On this page" (c, D, 1-4) and the Vimium note; `?` closes it. `/` on `/github` focuses the search with an empty value. |
| seo-feeds.md | PASS | Live: robots ends `Sitemap: https://resume-nuxt-vert.vercel.app/sitemap.xml`; the RSS line 2 is `<rss version="2.0">`. With the blog API cold, RSS was 200 with 0 items and the sitemap had 5 static URLs; once warm, 4 items and 9 URLs. |
| error-page.md | FIXED | The criterion "HTML contains 404" needs `Accept: text/html`: plain curl gets a JSON error body. Criterion rewritten. Added Open Q4: `error.vue` bypasses `app.vue`, so live `/en/does-not-exist` has English text but `<html lang="vi">`. Live confirms: no header, only "Go to the homepage" on 404, and that button goes to `/en`. |

## Real bugs found, not in the original Open questions (now added)
1. `/blogs` category filter is dead on production. The upstream ignores `category`: `?category=vue|javascript|zzz` all give the same 4 posts, and every post has `categoryIds: null`. Also, the `/blogs` routeRule is `isr: 60` with no `allowQuery`, so Vercel serves the cached `/blogs` for `?category=vue` (`STALE`, nothing highlighted). `?page` is affected the same way. This is the same trap already fixed for `/api/resume`.
2. There is no `timeout` on the blog categories/detail `$fetch`. Cold blog API meant live `/blogs`, `/en/blogs`, `/api/blogs/categories`, `/api/blogs/detail/x` and `/blogs/x` were raw `504 FUNCTION_INVOCATION_TIMEOUT`, not the controlled 5xx that blog-list B5 relies on. Only `/api/blogs/posts` gave its 503.
3. Home sidebar `_contact.ts` has no `localePath`, so `/en` sends readers to `/contact`.
4. The error page on `/en/*` has `<html lang="vi">`.

## Live vs code
- No stale-deploy mismatch found: every live observable matched this branch's code.
- Transient: the very first `GET /` and `/en` returned `502 FUNCTION_INVOCATION_FAILED` (Vercel raw, `x-vercel-cache: MISS`), while `/api/resume` was 200. Every retry was 200 (`HIT`). The cause is unknown and it was not reproduced. It is not the controlled "Unable to load resume data" 502.
- Giscus is configured in production (see blog-post.md).
