# 2026-08-25 — i18n-page-content (diff)

- Worker: implementer
- Node: `haven/diagrams/dev-loop.prime-mermaid.md` → `i18n-page-content`
- Issue: #80, branch `feature/80`

## Diff
| File | Why |
|---|---|
| `i18n/locales/en.json`, `i18n/locales/vi.json` | New `resume`/`projects`/`blogs`/`post`/`contact`/`github` key namespaces — real Vietnamese translations in `vi.json`, not English echoed back |
| `themes/portfolio-dev/pages/resumeObject/AboutMe.vue` | `const { t } = useI18n()`; "About me" heading (inside the `bioLines` template-string, now `escapeHtml(t('resume.aboutMeHeading'))`) + "Download CV" button → `t('resume.downloadCv')` |
| `themes/portfolio-dev/pages/resumeObject/Hero.vue` | "Hi there! I am" → `t('resume.greeting')` |
| `themes/portfolio-dev/pages/projects/Index.vue` | "No projects match the selected filters." → `t('projects.noMatch')`; "Project {{i+1}}" → `t('projects.projectLabel')`; renamed the `v-for="t in p.technology"` loop var to `tech` (was shadowing the new `useI18n()` `t`, caught by lint — see below) |
| `themes/portfolio-dev/pages/blogs/Index.vue` | Intro paragraph → `t('blogs.intro')`; "Show:" → `t('blogs.show')` |
| `themes/portfolio-dev/pages/post/Item.vue` | "Read more ..." → `t('blogs.readMore')` |
| `themes/portfolio-dev/pages/post/Detail.vue` | sr-only "Published on" → `t('post.publishedOn')`; "Tags" heading → `t('post.tags')`; "Back to the blog" (both the `aria-label` and visible text) → `t('post.backToBlog')` |
| `themes/portfolio-dev/pages/post/Comments.vue` | "Comments" heading → `t('post.comments')`; "Giscus chưa được cấu hình." → `t('post.giscusNotConfigured')`; Giscus's own `data-lang` (was hardcoded `'vi'`) → `locale.value`, plus a new `watch(locale, ...)` that posts `setConfig({lang})` to the live iframe, mirroring the existing `setConfig({theme})` color-mode watcher |
| `themes/portfolio-dev/pages/contact/Index.vue` | "# fills your mail client..." → `t('contact.formHint')`; "Your name"/"What's on your mind?" placeholders → `t('contact.namePlaceholder')`/`t('contact.messagePlaceholder')` |
| `themes/portfolio-dev/pages/github/GitRepos.vue` | "Search repos name..." placeholder → `t('github.searchPlaceholder')` |
| `themes/portfolio-dev/pages/github/GitUser.vue` | "followers"/"following"/"NO data" → `t('github.followers')`/`t('github.following')`/`t('github.noData')` |
| `themes/portfolio-dev/pages/github/part/Item.vue` | "Updated on" → `t('github.updatedOn')`; renamed the `v-for="t in modelValue.topics"` loop var to `topic` (same shadowing fix as above) |
| `pages/projects.vue`, `pages/contact.vue`, `pages/github.vue`, `pages/blogs/index.vue` | `useSeoMeta`'s hardcoded title/description → `computed(() => t(...))`, matching `pages/index.vue`'s existing pattern so SEO tags react to locale |
| `app.vue` | Added `useLocaleHead()` + `useHead()` so `<html lang>` follows the real active locale instead of `nuxt.config.ts`'s static `'vi'` fallback — the issue's explicitly-flagged remaining gap |
| `nuxt.config.ts` | Added `i18n.baseUrl: 'https://datvt243.github.io'` (same origin already hardcoded as `SITE_URL` in `server/routes/{rss,sitemap}.xml.ts`) — required by `useLocaleHead()`, otherwise the build prints a new `WARN I18n baseUrl is required...` that doesn't exist on `main` (verified: reproduced clean on `main` via `git stash`, confirmed the warning is new, added `baseUrl` to fix it rather than leaving a new warning in the build) |
| `agent-hub/haven/diagrams/dev-loop.prime-mermaid.md` | New node `i18n-page-content`: PENDING → IN_PROGRESS (verifier will SEAL) |

## Real bug caught mid-implementation (disclosed, not just claimed)
First lint pass surfaced 2 NEW warnings not on the session baseline:
`vue/no-template-shadow` in `projects/Index.vue` and `github/part/Item.vue`
— both files already had a `v-for="t in ..."` loop variable named `t`,
which silently shadowed the new `const { t } = useI18n()` in the exact
same template. Fixed by renaming the loop vars (`tech`, `topic`) rather
than renaming the i18n import, since the loop vars are the more local/
narrower-scoped names. Re-ran lint after the fix — back to the exact
baseline (34 problems, 0 errors, 0 new warnings, see Output below).

## Environment blocker hit and resolved (disclosed)
`npm run lint` initially failed outright on this session's active Node
(`v20.18.0`, via the shell's default `nvm` alias):
```
TypeError: Object.groupBy is not a function
    at .../node_modules/eslint-flat-config-utils/dist/index.mjs:157:30
```
Confirmed via `git stash` that this reproduces identically on a clean
`main` with zero code changes — **not** caused by this diff, a pre-existing
environment gap (`Object.groupBy` isn't available before Node 21;
`eslint-flat-config-utils@3.2.0`, the exact locked version per
`package-lock.json`, requires it). Resolved for this verification pass by
`nvm install --lts` (installed Node `v24.19.0` alongside the existing
`v20.18.0`, default alias untouched) and running `npm run lint`/`npm run
build` under it via `nvm use 24`. Not a code fix — flagging as a new trap
in `doctrine/domains/PROJECT.md` for future sessions so this isn't
re-discovered from scratch.

## Command
```
npm run build
```
```
npm run lint
```

## Output
`npm run build` — clean (cold cache, `rm -rf node_modules/.cache .nuxt
.output` first), verbatim tail:
```
Σ Total size: 28.5 MB (10.5 MB gzip)
[nitro] ✔ You can preview this build using node .output/server/index.mjs
```
Exit code 0. Only pre-existing warning present (`bundle.optimizeTranslationDirective`,
same as `main`) — the new `I18n baseUrl is required` warning seen before
adding `baseUrl` is gone.

`npm run lint` (under Node `v24.19.0`, see blocker above) — verbatim tail,
exact match to the session baseline recorded in `giscus-live-fix`'s
evidence:
```
✖ 34 problems (0 errors, 34 warnings)
```
None of the files touched in this diff appear in the problem list.

## Browser verification
Chrome CDP port 9888 (already running, reused). Built + ran a real preview
server (`node .output/server/index.mjs`, port 3789). Connected via
`puppeteer-core`, real `page.goto`/click-based navigation (clicked the
actual language-switcher button for the home-page check, not
`page.navigate` directly to `/en`).

**Home page, real click-based locale switch**:
```json
{
  "homeLang": "vi-VN", "homeGreeting": true, "homeAboutMe": true, "homeDownloadCv": true,
  "urlAfterSwitch": "http://localhost:3789/en",
  "enLang": "en-US", "enGreeting": true, "enAboutMe": true, "enDownloadCv": true
}
```
`<html lang>` correctly flips `vi-VN` ⇄ `en-US` on the same click that
changes the URL from `/` to `/en` — confirms the `app.vue` fix works, not
just the translation strings.

**Projects/Blogs/Contact/Github, both locales** (`page.title()` +
`innerText` substring checks) — all `true`/correct title in both `vi` and
`en`:
```json
{
  "projectsEnTitle": "Projects", "projectsViTitle": "Dự án",
  "blogsViTitle": "Blog", "blogsViIntro": true, "blogsViShow": true,
  "blogsEnTitle": "Blogs", "blogsEnIntro": true,
  "contactViTitle": "Liên hệ", "contactViHint": true, "contactViPlaceholder": "Tên của bạn",
  "contactEnTitle": "Contact me", "contactEnHint": true, "contactEnPlaceholder": "Your name",
  "githubViTitle": "Github", "githubViSearch": "Tìm tên repo...", "githubEnTitle": "Github"
}
```

**Real `/blogs/<id>` post detail page** (real post `_id` fetched live from
`/api/blogs/posts`, real Giscus credentials already in `.env` from #81) —
text asserted case-insensitively since the actual DOM applies a CSS
`uppercase` transform (`Thẻ`→`THẺ` visually, confirmed by reading raw
`innerText`, not a bug):
```
VI: "Đăng vào" / "THẺ" / "QUAY LẠI BLOG" / "BÌNH LUẬN" all present
VI giscus iframe src: https://giscus.app/vi/widget?...&repoId=R_kgDOM3bPGg&categoryId=DIC_kwDOM3bPGs4DDqo8...
EN: "TAGS" / "BACK TO THE BLOG" / "COMMENTS" all present
EN giscus iframe src: https://giscus.app/en/widget?...&repoId=R_kgDOM3bPGg&categoryId=DIC_kwDOM3bPGs4DDqo8...
EN html lang: en-US
```
Giscus iframe URL's own locale segment (`/vi/widget` vs `/en/widget`)
confirms the `data-lang`/`setConfig({lang})` fix works against the real
widget, not a mock. Console: only a benign pre-existing giscus info
message (`[giscus] Discussion not found. A new discussion will be created
if a comment/reaction is submitted.` — expected, this post has no
discussion yet), 0 real errors across every page checked.

Preview server + all temp verification scripts (`.tmp-verify-*.mjs`)
cleaned up after verification; `git status --short` confirms only the
intended files remain modified.

## Acceptance
| # | Criterion | Evidence |
|---|---|---|
| 1 | New real-Vietnamese locale keys, `t()` wired into every listed file | Diff table above |
| 2 | SEO title/description reactive to locale | Diff table + CDP titles above (Vi vs En differ correctly) |
| 3 | `<html lang>` follows active locale | CDP: `vi-VN` → `en-US` on switch |
| 4 | Giscus `data-lang` follows active locale | CDP: real iframe `src` shows `/vi/widget` vs `/en/widget` |
| 5 | Build/lint clean, 0 new warnings vs baseline | Output above, exact `34 problems` match |
| 6 | Real click-based switch + both locales verified per page, 0 console errors | CDP results above |

## Seal gate
None — no outward-facing action (no commit/push/PR) in this implementer
pass.
