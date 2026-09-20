# 2026-09-20 — p1-portfolio-review-fixes

**Worker:** implementer
**Version:** 1.0.0 (dev-loop diagram)
**Node:** `p1-portfolio-review-fixes` (new — no prior node matched, created per `pick_next.md`'s "No diagram matches yet" branch)
**Task:** Fix 6 P1/high-impact findings from portfolio review — issue #179: (1) Project cards read "used tech X" not "solved problem Y" (`projects/Index.vue`). (2) Years-of-experience/current role not visible without a tab click (`Hero.vue`). (3) CV download nested inside the About tab, not on the Hero. (4) No Open Graph image / structured data. (5) Unnecessary `v-html` on GitHub's plain-text `bio` (`GitUser.vue`). (6) Dead `javascript:void()` repo-name link (`github/part/Item.vue`).

## Hub bytes before: 107955

## Acceptance criteria
1. Project cards clearly label role (`p.position`) without inventing challenge/contribution/impact content that has no real data source — confirmed via `ResumeAdapter.ts`/`types/resume-document.ts` that no company/challenge/result field exists in the real API shape.
2. Hero shows a real, computed (not fabricated) years-of-experience + current-company summary line, sourced from `store.experiences`.
3. CV download button also appears on the Hero (not only nested in the About tab), without duplicating the fetch/blob logic.
4. `pages/index.vue` sets a real `ogImage`/`twitterImage` (an existing asset, not a new fabricated one) and a `Person` JSON-LD block built only from real, already-displayed data (`AppHeading`, `contact.social.*`, `resumeStore.hero.positionDesired`, `SITE_URL`).
5. `GitUser.vue`'s bio no longer uses `v-html` — plain interpolation, GitHub bios being confirmed plain text.
6. `github/part/Item.vue`'s repo-name link uses the real `html_url` instead of `javascript:void()`.
7. `npm run build` clean, `npm run lint` clean (0 errors, warning count not increased from baseline).
8. Real UI check via Chrome CDP across homepage, `/projects`, `/github` — this touches multiple visual/behavior surfaces.

## Files to touch
- `themes/portfolio-dev/pages/projects/Index.vue`
- `themes/portfolio-dev/pages/resumeObject/Hero.vue`
- `themes/portfolio-dev/pages/resumeObject/AboutMe.vue`
- `composables/useDownloadResume.ts` (new)
- `pages/index.vue`
- `nuxt.config.ts` (expose `SITE_URL` under `runtimeConfig.public`, reusing the existing import)
- `themes/portfolio-dev/pages/github/GitUser.vue`
- `themes/portfolio-dev/pages/github/part/Item.vue`
- `i18n/locales/{vi,en}.json` (new keys: `resume.experienceSummary`, `projects.role`)

No env var needed, no new dependency.
