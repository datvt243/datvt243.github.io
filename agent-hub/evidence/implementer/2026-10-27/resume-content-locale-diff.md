# 2026-10-27 - resume-content-locale (diff)

- Worker: implementer · Version: 0.1.0
- Node: `resume-content-locale` (last row of `haven/diagrams/dev-loop.prime-mermaid.md`)
- Task: issue #338 "Resume content ignores selected language (EN still shows Vietnamese)", branch `bug/338` off `staging` d08755d. Plan + acceptance: `resume-content-locale-plan.md`.
- Status: `sealed_pending_verifier`

## Hub bytes before
80246

## Diff
| File | Why |
|---|---|
| `server/utils/fetchResume.ts` | `fetchResume(lang: AtsLang = 'vi')`, sends `query: { lang }` upstream (backend `resume-nodejs-api/src/candidate_me/index.ts:37` reads `req.query.lang`, default `vi`) |
| `server/api/resume.ts` | `langOf(event)` (`en` → en, anything else → vi) passed to `fetchResume`; cache key `api-resume-${MY_EMAIL}-${lang}` |
| `server/api/generate-pdf.ts` | `fetchResume(lang)` — EN PDF had EN headings over VI text |
| `stores/resume.ts` | `fetchData(lang)` → `$fetch('/api/resume', { query: { lang }, retry: 0 })` |
| `composables/useResumeData.ts` | `useAsyncData` key `() => api-resume-${locale}` + `fetchData(locale.value)`; locale from `useNuxtApp().$i18n` |
| `app.config.ts` | `resumeContentLang` doc: now only the non-localized owner's name (Hero) |
| `themes/.../resumeObject/{AboutMe,Experiences,Index}.vue`, `themes/.../projects/Index.vue` | Dropped `lang="vi"` overrides on localized text (intro sentences, experience descriptions, education block, project description) — it now follows the page locale; Hero `h1` name keeps `vi` |
| `tests/fetchResume.test.ts` | New case: `fetchResume('en')` / `fetchResume()` send `{lang:'en'}` / `{lang:'vi'}` |
| `haven/diagrams/dev-loop.prime-mermaid.md` | Node row appended |

## Output
```
npm run build → ◆ ✨ Build complete in 14.2s!   (final code; mock env)
npm run lint → lint=0
npx nuxi typecheck → typecheck=0, `grep -c "error TS"` = 0
npm test →  Test Files  4 passed (4) /  Tests  11 passed (11)
```

## Browser verification
Prod build, `NODE_API=NUXT_PUBLIC_NODE_API=http://localhost:4199` (mock that returns `EN …`/`VI …` text per `?lang`), `PORT=4187 node .output/server/index.mjs`. `grep -c onrender` over all server logs → **0**.

SSR (curl):
```
/: VI câu giới thiệu|VI mô tả dự án|VI xây dựng|
/en: EN built things|EN intro sentence|EN project desc|
/projects: VI …   /en/projects: EN …
/api/resume?lang=en → introduction "<p>EN intro sentence.</p>"
mock log: /api/me/votan.it@gmail.com?lang=vi, ...?lang=en
/api/generate-pdf?lang=en → 200 application/pdf; mock log: /api/me/votan.it@gmail.com?lang=en
```
Client-side switching (Playwright, header language button, tab visible + rAF running):
```
start / vi-VN: VI xây dựng
->en /en en-US: EN built things
->vi / vi-VN: VI xây dựng
->en /en en-US: EN built things
nav /en/projects: EN project desc
->vi /projects vi-VN: VI mô tả dự án
```
Test-env trap hit on the way: the Playwright tab was `visibilityState: hidden` (operator's :3000 tab in front) → `requestAnimationFrame` blocked → every page transition stuck at `transition-opacity-leave-from leave-active`, old page left on screen. Reproduced identically on a clean `staging` build (:4188), so not this diff; fixed by `browser_tabs select` before testing. A store-sync `watch` added while chasing it was removed — not needed once rAF runs (Nuxt 4 refetches on client nav).

## Acceptance
| Criterion | Evidence |
|---|---|
| 1 fetchResume lang | unit test `{lang:'en'}`/`{lang:'vi'}`; Tests 11 passed |
| 2 /api/resume?lang | curl → EN intro; key includes lang |
| 3 per-locale fetch + client switch | SSR + switching table above |
| 4 EN PDF | mock log `?lang=en` on generate-pdf |
| 5 lang overrides | diff; Hero keeps `resumeContentLang` |
| 6 browser, 0 real calls | onrender=0 |
| 7 checks | Output block |
| comments per code-comments.md | one-line WHY on the per-locale key; fetchResume + app.config docs updated to stay true |

## Supersedes: none

## Noticed, not done
- Backend `resolveLocalizedText` returns `''` for an unfilled `en` field (`'' ?? vi` doesn't fall back), so EN pages show blank text wherever the English version isn't entered yet. Backend repo, not this diff.
- Vercel ISR on `/api/resume`: Nitro leaves `allowQuery` undefined (`node_modules/nitropack/dist/presets/vercel/utils.mjs:369`), so each `?lang` is cached separately — not verified on a real Vercel deploy.
- Page-level ISR caches already differ per route (`/` vs `/en`). The 12-day `defineCachedEventHandler` entry for the old key `api-resume-<email>` becomes unused, not purged.

## Seal gate
none (no commit/push)
