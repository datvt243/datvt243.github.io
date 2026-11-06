# analyst — resume-pdf-download — 2026-11-07

## Task (verbatim)
document resume-pdf-download

## Doc
`agent-hub/doctrine/features/resume-pdf-download.md` (existing bulk-backfill draft, re-checked per recipe step 4, not rewritten)

## Sources read
- `agent-hub/haven/workers/analyst/SOUL.md`
- `agent-hub/haven/workers/analyst/recipes/spec_feature.md`
- `agent-hub/doctrine/features/INDEX.md`
- `agent-hub/doctrine/domains/PROJECT.md`
- `agent-hub/doctrine/MEMORY.md`
- `composables/useDownloadResume.ts`
- `server/api/generate-pdf.ts`
- `server/utils/createPDFAts.ts`
- `themes/portfolio-dev/pages/resumeObject/Hero.vue`

## Re-check vs code
Behavior 1–8 match code. Hero button `data-shortcut="D"`, `:disabled="isLoading"`, label `resume.downloadingCv`; toast `duration: 0`, success 4000, error 5000 on non-200 or throw; filename from `content-disposition` else `resume.pdf`; `URL.createObjectURL` never revoked. Server: lang en|vi, in-memory `Map` 1 day, skipped in dev; `fetchResume`; launch sparticuz on `VERCEL` / `PUPPETEER_EXECUTABLE_PATH` / OS path; A4, 12mm, `printBackground: false`, `tagged: true`; `browser.close()` outside try/finally. Template section order + `ALLOWED_TAGS` + script/style strip + `→`→`->`; filename `cvFileName` sanitized or `<Full Name> CV`, `-${lang.toUpperCase()}`, `.pdf`. Comment still mentions "About tab's own button". No discrepancy.

## Questions + answers
Operator (2026-11-07): "ok, behavior đúng" (Behavior section confirmed correct).
1. If Chrome fails during `page.setContent`/`page.pdf`, `browser.close()` is
   never called (no try/finally) — a possible leaked Chrome process per
   failure. Intended to fix? → **Answer (operator 2026-11-07):** Bug — #423
2. The object URL created for the download is never revoked. Acceptable? → **Answer (operator 2026-11-07):** Bug — #423
3. `useDownloadResume.ts`'s comment mentions an "About tab's own button", but
   only `Hero.vue` uses the composable now. Is a second button still wanted? → **Answer (operator 2026-11-07):** Intended: only one button; fix the comment — #423
4. The 1-day in-memory cache means a backend resume edit can take up to a day
   (per warm instance) to reach the PDF. Intended? → **Answer (operator 2026-11-07):** Intended

## Result
status: verified — every open question answered + operator confirmed Behavior.
`Status: verified — confirmed by operator 2026-11-07, see evidence/analyst/2026-11-07/resume-pdf-download-spec.md` set in doc + INDEX row; Issues: #29, #179, #198, #206, #423. Behavior unchanged (describes code today; changes tracked by the issues).

## Isolation proof
Separate spawned agent (Agent tool), blank context. Received only the
dispatch prompt (5 tasks, operator's "ok, behavior đúng" confirmation, the
operator's answers + issue numbers). No implementer reasoning, no main
session transcript. All Behavior items re-checked by reading code myself.
