# 2026-10-04 — ats-cv-template-local (diff)

**Worker:** implementer
**Version:** 0.1.0
**Node:** `ats-cv-template-local` (`haven/diagrams/dev-loop.prime-mermaid.md`, PM status IN_PROGRESS, appended last)
**Task (verbatim):** `/todo #206` → "Integrate ATS-optimized CV export + self-check (resume-nodejs-api)", scoped down by the operator (see `-plan.md`).
**Issue / branch:** #206 · `206-integrate-ats-optimized`
**Status:** `sealed_pending_verifier`

## Hub bytes before: 132989

## Diff
| File | Why |
|---|---|
| `server/utils/createPDFAts.ts` (new, 225 lines) | ATS template ported from `resume-nodejs-api/src/services/createPDF.ats.ts`: single column, `Arial, Helvetica, "Liberation Sans"` system stack, `letter-spacing: normal`, no web fonts / external CSS, localized vi/en headings (same strings as the backend's `cv.*` locale keys), reverse-chronological experience, rich-text reduced to an attribute-free tag allow-list (`p ul ol li strong em b i br`), summary stripped to plain text. Accepts `generalInformation` as object or array-of-one. |
| `server/api/generate-pdf.ts` | Reads `?template=ats` (anything else → classic) and `?lang=en` (anything else → vi). Module cache: single slot → `Map` keyed `classic` / `ats-vi` / `ats-en`. ATS print: `printBackground: false`, 15mm margins, `tagged: true`. ATS filename suffix `-ats`. **Also fixes a pre-existing bug** (see below) in the `generalInformation` normalizer. |
| `composables/useDownloadResume.ts` | `downloadResume(template = 'classic')`; ATS calls `/api/generate-pdf?template=ats&lang=${locale.value}`, saves as `<email>-ats.pdf`. Default call unchanged. |
| `themes/portfolio-dev/pages/resumeObject/Hero.vue` | Second pill button "CV ATS" / "ATS CV" (`fe:document`) next to "Tải CV", with a `title` hint. Theme tokens only (`border-theme-border-subtle`, `text-theme-muted`, `hover:text-theme-accent`…). |
| `themes/portfolio-dev/pages/resumeObject/AboutMe.vue` | Same second button next to the existing one, wrapped in `flex flex-wrap gap-3`. Theme tokens only. |
| `i18n/locales/{en,vi}.json` | `resume.downloadCvAts`, `resume.downloadCvAtsHint`. |
| `agent-hub/haven/diagrams/dev-loop.prime-mermaid.md` | New node row (appended at the end). |

### Pre-existing bug found and fixed (in scope: ATS acceptance needed it)
`generate-pdf.ts` normalized `generalInformation` with `if (!generalInformation.length) return {}`. The live API returns an **object** (confirmed: `curl /api/resume` → `generalInformation` is `dict`, 17 `professionalSkills`, `positionDesired: 'Frontend Developer'`), so `.length` was `undefined` and every PDF got `{}`: no skills, no languages. First ATS render reproduced it (sections `TÓM TẮT, KINH NGHIỆM LÀM VIỆC, DỰ ÁN, HỌC VẤN`; `Programming` → false). The fix handles both shapes, so **the classic PDF now gets its skills line back too** (a visible change to the existing download, and an improvement). It also clears the one pre-existing `tsc` error in this file (TS2322 at old line 61).

## Command
From `doctrine/MEMORY.md`, repo root, Node `v24.19.0` (`nvm use`, per `.nvmrc`):
- `npm run build`
- `npm run lint`
Extra (not in MEMORY.md, no test suite exists): `node node_modules/typescript/bin/tsc --noEmit -p .nuxt/tsconfig.server.json` before and after (`git stash` baseline).

## Output
Lint baseline on clean `staging` before any edit:
```
✖ 13 problems (0 errors, 13 warnings)
```
Final `npm run build` (after the normalizer fix), exit 0, tail:
```
[@nuxt/image]  WARN  sharp binaries for darwin-arm64 cannot be found. ...
│
└  ✨ Build complete!
```
(Only warnings are the pre-existing i18n `optimizeTranslationDirective` and `sharp` ones, both already recorded in earlier nodes.)
Final `npm run lint`:
```
✖ 13 problems (0 errors, 13 warnings)
```
`tsc` server project: baseline `28` errors on staging (incl. `server/api/generate-pdf.ts(61,5): error TS2322`), after: `tsc total: 27`, with 0 lines matching `createPDFAts|generate-pdf`.

## Browser verification
Production build served with `PORT=3994 node .output/server/index.mjs` (`.env` loaded), Chrome on CDP `:9888` (already running, `Chrome/153.0.8010.53`), `puppeteer-core` connect.

API (curl):
```
200 application/pdf                        (classic, filename="votan.it_gmail.com.pdf")
200 application/pdf ?template=ats&lang=vi  (filename="votan.it_gmail.com-ats.pdf")
200 application/pdf ?template=ats&lang=en
200 application/pdf ?template=bogus        → md5 a1759b11… == classic md5 (falls back to classic, shares its cache entry)
```
Extracted text (`pdf-parse` from `resume-nodejs-api/node_modules`, the same extractor the backend's ATS self-check uses; read-only, nothing installed here), final build:
```
===pdf_.pdf pages 2 spacedLetterRuns 16
 sections: ["JOBTEST","FASTCODING","VIETRY","ZAGO","S I M P L E M D G"]
  Programming: -> true
===pdf_template_ats_lang_vi_.pdf pages 3 spacedLetterRuns 0
 sections: ["TÓM TẮT","KỸ NĂNG","KINH NGHIỆM LÀM VIỆC","DỰ ÁN","HỌC VẤN","NGOẠI NGỮ"]
  Frontend Developer -> true   Programming: -> true   Hiện tại -> true   Present -> false
===pdf_template_ats_lang_en_.pdf pages 3 spacedLetterRuns 0
 sections: ["SUMMARY","SKILLS","EXPERIENCE","PROJECTS","EDUCATION","LANGUAGES"]
  Frontend Developer -> true   Programming: -> true   Hiện tại -> false  Present -> true
```
Real click (CDP, `/` and `/en`): 4 CV buttons per page (Hero + About × classic/ATS), labels `Tải CV`/`CV ATS` (vi) and `Download CV`/`ATS CV` (en), titles localized. Clicking the Hero ATS pill fired exactly one request each:
```
vi: "200 application/pdf ?template=ats&lang=vi"
en: "200 application/pdf ?template=ats&lang=en"
```
Console errors: only the pre-existing VisitTracker CORS failure (`.../visit` from origin `http://localhost:3994`), unrelated to this diff (localhost origin isn't in the backend's CORS list).
Computed color of the About ATS button: dark `rgb(166, 174, 199)`, light `rgb(69, 78, 109)`, so it follows the active theme tokens.
Screenshots: `evidence/implementer/2026-10-04/ats-cv-template-local-assets/{after-click-vi,about-dark,about-light}.png`.

## Acceptance
| Criterion | Evidence |
|---|---|
| 1. No query → unchanged classic | `200 application/pdf`, filename without `-ats`, classic layout (`spacedLetterRuns 16`, same letter-spaced headings as before). Only content change: skills line restored by the normalizer fix (disclosed above). |
| 2. `?template=ats&lang=vi|en` → ATS PDF | `spacedLetterRuns 0`; sections `TÓM TẮT…NGOẠI NGỮ` / `SUMMARY…LANGUAGES`; `Present`/`Hiện tại` localized; system font stack, no `<link>` in template. |
| 3. Cache per template+lang | `Map` keyed `classic`/`ats-vi`/`ats-en`; vi and en ATS md5s differ from classic and from each other; `bogus` md5 == classic md5. |
| 4. Both buttons give a choice, ATS passes locale | CDP: 4 buttons per page; click → `?template=ats&lang=vi` on `/`, `?template=ats&lang=en` on `/en`. |
| 5. i18n both locales, tokens only | `en.json`/`vi.json` each +2 keys; rendered titles in both languages; buttons use `theme-*` classes only; computed colors differ correctly between dark and light. |
| 6. Build + lint clean | `✨ Build complete!` exit 0; lint `0 errors, 13 warnings` == baseline 13. |

## Noticed, not done
- Out of scope by operator decision: ATS self-check view (`POST /api/v1/cv/ats-check`) and any proxy to the backend's `download-pdf`. Both require the owner's JWT, which lives about 1h (`TOKEN_EXP_IN || '1h'`, `resume-nodejs-api/src/auth/auth.service.ts:126`). Issue #206's 2nd and 3rd checkboxes stay unaddressed here; the issue should not be auto-closed without the operator agreeing that this scope is enough.
- The template is now duplicated between backend `createPDF.ats.ts` and this repo's `createPDFAts.ts`, so they can drift. A public unauthenticated `GET /api/me/:email/download-pdf?template=ats` on the backend would remove the copy.
- No PDF metadata (Title/Author/Keywords) is set. The backend uses `pdf-lib` for that, and adding a new dependency here was not justified for this node.
- Classic template still has its own known issues (hardcoded Vietnamese headings, `m < 9` month padding bug at `createPDF.ts` `formatDate`), not touched.
- `git add -N server/utils/createPDFAts.ts` (intent-to-add, index only) was used to show the new file in `git diff --stat`. Nothing committed.

## Seal gate
None. No commit, push, PR or deletion. `/todo` was run without `--ship`.
