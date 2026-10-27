# 2026-10-27 - resume-content-locale (plan)

- Worker: implementer · Version: 0.1.0
- Node: `resume-content-locale` (last row of `haven/diagrams/dev-loop.prime-mermaid.md`)
- Task: issue #338 "Resume content ignores selected language (EN still shows Vietnamese)" — "thông tin CV ko hiện theo language đang chọn, chọn EN vẫn hiện thông tin tiếng Việt". Branch `bug/338` off `staging` d08755d.

## Hub bytes before
80246

## Root cause
`server/utils/fetchResume.ts` calls `${NODE_API}/api/me/${MY_EMAIL}` with no `lang`. The backend (`resume-nodejs-api/src/candidate_me/index.ts:37`) resolves localized `{vi,en}` fields with `req.query.lang === 'en' ? 'en' : 'vi'`, so the site always gets Vietnamese — on `/en` and in the EN PDF (`generate-pdf.ts` also calls `fetchResume()` bare). `/api/resume`'s cache key and `useAsyncData('api-resume')` are also locale-blind.

## Acceptance criteria
1. `fetchResume(lang)` sends `?lang=<vi|en>` upstream; unknown values → `vi`. Unit test asserts the query.
2. `/api/resume?lang=en` returns EN content; cache key includes lang.
3. The store/useAsyncData fetch passes the active i18n locale and keys per locale, so `/` gets vi and `/en` gets en, including after switching locale client-side.
4. `/api/generate-pdf?lang=en` fetches EN content.
5. `lang` overrides that tagged localized text as `vi` (`resumeContentLang`) are dropped where the text now follows the locale; the owner's name in Hero keeps `vi`.
6. Browser: `/` vi descriptions, `/en` en descriptions (mock backend honoring ?lang), 0 calls to the real backend.
7. build + lint + typecheck + `npm test` clean.

## Files
server/utils/fetchResume.ts, server/api/resume.ts, server/api/generate-pdf.ts, stores/resume.ts, composables/useResumeData.ts, app.config.ts, themes/portfolio-dev/pages/{resumeObject/{AboutMe,Experiences,Index}.vue,projects/Index.vue}, tests/fetchResume.test.ts

## Blockers
none (mock backend for UI check)
