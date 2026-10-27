# 2026-10-27 - resume-content-locale (verifier)

- Worker: verifier · Version: 0.1.0
- Node: `resume-content-locale` (#338, branch `bug/338`)
- Verdict: **SEAL**
- New PM status: SEALED (row archived to `haven/diagrams/dev-loop-archive.md`; oldest pointer `resume-isr-fallback` dropped from the active file, its full row is already in the archive)

## Isolation proof
Separate Agent spawn, description "Verifier pass resume-content-locale", started with a blank context and the operator's mock-only constraint (no real backend, no :3000). The implementer wrote the diff in another pass. This pass wrote no product code.

## Reasoning
Audited `evidence/implementer/2026-10-27/resume-content-locale-diff.md` against the plan's acceptance criteria (`...-plan.md`). `git diff --stat` lists the same 12 files as the note's Diff table (fetchResume.ts, resume.ts, generate-pdf.ts, stores/resume.ts, useResumeData.ts, app.config.ts, 4 theme files, tests/fetchResume.test.ts, diagram), +33/-23, nothing extra.

| Criterion | Evidence |
|---|---|
| 1. `fetchResume(lang)` sends `?lang`, unknown → vi, unit test | Note: new test asserts `fetchResume('en')` → `{lang:'en'}`, `fetchResume()` → `{lang:'vi'}`; `langOf(event)` maps non-`en` → vi. Re-run `npm test`: `Test Files 4 passed (4)` / `Tests 11 passed (11)` (was 10 before this node) |
| 2. `/api/resume?lang=en` EN, cache key per lang | Note: curl `/api/resume?lang=en` → introduction `"<p>EN intro sentence.</p>"`; key `api-resume-${MY_EMAIL}-${lang}` |
| 3. per-locale store fetch + client switch | Note SSR: `/` → `VI câu giới thiệu…`, `/en` → `EN built things…`; Playwright switch table: vi → en → vi → en, `/en/projects` → `EN project desc`, back to `/projects` → `VI mô tả dự án` (tab visible, rAF running) |
| 4. EN PDF | Note: `/api/generate-pdf?lang=en` → 200 `application/pdf`; mock log `/api/me/…?lang=en` |
| 5. `lang="vi"` overrides dropped, Hero name keeps vi | Note Diff table: dropped in AboutMe/Experiences/Index/projects Index; Hero `h1` keeps `resumeContentLang`; diff stat shows 3/3/3/3 line changes in those 4 files |
| 6. browser, 0 real-backend calls | Note: prod build + server with `NODE_API=NUXT_PUBLIC_NODE_API=http://localhost:4199`, `grep -c onrender` over all server logs → 0 |
| 7. build + lint + typecheck + test | Note: `◆ ✨ Build complete in 14.2s!`. Lint/typecheck given as exit codes only, so re-ran: `npm run lint` → `> eslint .` rc=0, no findings · `npx nuxi typecheck` rc=0, `grep -c "error TS"` → 0 · `npm test` → 11 passed |
| comments per code-comments.md | Note: one-line WHY on the per-locale key; fetchResume and app.config doc comments updated to stay true |

Forbidden states: none hit (node on the diagram, note present, checks run and partly re-run, no code in `haven/`, PM status updated here). Seal gate: none needed (no commit/push). Proportionality: every file serves a criterion; the temporary store `watch` was removed per the note. Supersedes: `none`, and no other #338 row on the active diagram.

Non-blocking (from the note's "Noticed, not done", for the operator):
- Backend returns `''` for an unfilled `en` field, so EN pages show blank text where no English is entered yet. Backend repo.
- Vercel ISR per-`?lang` caching on `/api/resume` not checked on a real deploy.
- The old 12-day cache entry `api-resume-<email>` is orphaned, not purged.

## Re-run
partial: `npm run lint`, `npx nuxi typecheck`, `npm test` (no build, no server, no browser). Reason: the note gives lint and typecheck only as `lint=0`/`typecheck=0` exit codes, not their output (citation-gap exception).
