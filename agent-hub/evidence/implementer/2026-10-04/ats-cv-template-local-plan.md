# 2026-10-04 — ats-cv-template-local (plan)

**Worker:** implementer
**Version:** 0.1.0
**Node:** `ats-cv-template-local` on `haven/diagrams/dev-loop.prime-mermaid.md` (new, appended at the end of the PM status table)
**Task (verbatim):** `/todo #206` → "Integrate ATS-optimized CV export + self-check (resume-nodejs-api)"
**Issue / branch:** #206 (https://github.com/datvt243/datvt243.github.io/issues/206) · `206-integrate-ats-optimized` (off freshly-pulled `staging`)

## Hub bytes before: 132989

## Findings that changed the scope
- `resume-nodejs-api` (`release/v1.10.0`, contains `ca61614`):
  - `src/routers/api/v1/index.ts:94` — `router.get('/download-pdf', verifyTokenByQuery, fnExportPDF)`; `verifyTokenByQuery` just calls `verifyToken` (`src/middlewares/verifyToken.middleware.ts:79-82`).
  - `src/candidate_me/ats-check.ts` — reads `req.user._id`, i.e. the owner's own JWT.
  - Access tokens: `jwtSign({ _id }, TOKEN_SECRET, { expiresIn: TOKEN_EXP_IN || '1h' })` (`src/auth/auth.service.ts:126`). No long-lived service token exists.
- This repo never called the backend's `download-pdf`: `composables/useDownloadResume.ts:27` → `/api/generate-pdf`, which renders its own classic PDF (`server/utils/createPDF.ts`) from the public `/api/me/${MY_EMAIL}` data.

## Operator decisions (AskUserQuestion, this session)
1. "Template only, public" — no ATS self-check view on the public portfolio.
2. After the JWT-expiry finding: "Render ATS locally" — port the ATS template into this repo's `/api/generate-pdf` rather than proxying with a token.

## Acceptance criteria
1. `GET /api/generate-pdf` with no query → unchanged classic PDF (backward compatible).
2. `GET /api/generate-pdf?template=ats&lang=vi|en` → single-column ATS PDF: system font stack, no letter-spacing, standard localized section headings, no web fonts/external CSS.
3. In-memory cache keyed per template+lang (a classic hit must never serve an ATS body or vice versa).
4. Both Download CV buttons (Hero + About) give a Classic/ATS choice; the ATS request passes the current i18n locale.
5. New UI strings exist in both `i18n/locales/en.json` and `vi.json`; theme tokens only, no literal colors.
6. `npm run build` clean + `npm run lint` clean (0 errors; warning count no worse than baseline) + UI verified via CDP (both downloads return `application/pdf`, 200).

## Files
- `server/utils/createPDFAts.ts` (new) · `server/api/generate-pdf.ts` · `composables/useDownloadResume.ts` · `themes/portfolio-dev/pages/resumeObject/Hero.vue` · `themes/portfolio-dev/pages/resumeObject/AboutMe.vue` · `i18n/locales/{en,vi}.json`

## Blockers
None for this scope. `PUPPETEER_EXECUTABLE_PATH` is unset locally but `generate-pdf.ts` falls back to the macOS Chrome path.
