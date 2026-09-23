# 2026-09-20 — cv-download-toast

**Worker:** implementer
**Version:** 1.0.0 (dev-loop diagram)
**Node:** `cv-download-toast` (new — no prior node matched, created per `pick_next.md`'s "No diagram matches yet" branch)
**Task:** Fix issue #198 — add loading/success/error toast feedback to the "Download CV" button (`Hero.vue` + `AboutMe.vue`, sharing `composables/useDownloadResume.ts`), requested by the operator while testing the `generate-pdf-vercel-chromium` fix. PDF generation can legitimately take several seconds (cold Puppeteer launch), and the button currently gives zero visible feedback while that happens.

## Hub bytes before: 126821

## Acceptance criteria
1. A toast appears immediately on click, saying the CV is downloading.
2. On success, that same toast updates to a "download complete" message.
3. On failure (non-200 response or a thrown error), the toast updates to an error message instead, and the existing `isDisabled` fallback still applies.
4. The button itself is disabled and its label changes while the download is in flight (`isLoading`), to prevent double-clicks.
5. `npm run build` clean, `npm run lint` clean, baseline unchanged.
6. Real UI check via Chrome CDP — this is a visual/behavior feature by definition.

## Files to touch
- `composables/useDownloadResume.ts`
- `app.vue` (mount `<UNotifications />` — `@nuxt/ui` is already a dependency, but no toast has ever rendered anywhere in this codebase before this, since nothing mounted the notifications host component)
- `themes/portfolio-dev/pages/resumeObject/Hero.vue`
- `themes/portfolio-dev/pages/resumeObject/AboutMe.vue`
- `i18n/locales/{vi,en}.json` (new keys: `resume.downloadingCv`, `resume.downloadCvSuccess`, `resume.downloadCvError`)

No env var needed, no new dependency (Nuxt UI's `useToast()`/`<UNotifications>` are already part of the existing `@nuxt/ui` package).
