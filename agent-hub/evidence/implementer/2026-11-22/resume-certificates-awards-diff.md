# 2026-11-22 - resume-certificates-awards (diff)

- Worker: implementer · Version: 0.1.0
- Node: `resume-certificates-awards` (`haven/diagrams/dev-loop.prime-mermaid.md`, IN_PROGRESS)
- Task (verbatim, issue #420): "Home: show certificates, awards and career (hidden when empty)" — show them on the home page in both Dev and HR views; a section with no data is not rendered.
- Plan: `evidence/implementer/2026-11-22/resume-certificates-awards-plan.md`
- Status: sealed_pending_verifier

## Hub bytes before: 93630

## Feature doc: agent-hub/doctrine/features/resume-home.md + agent-hub/doctrine/features/resume-view-toggle.md (not changed by this diff; analyst-written this run)

## Diff
| File | Why |
|---|---|
| `types/resume-document.ts` | `Resume` gets `certificates?`/`awards?`; the `Certificate`/`Award` doc blocks claimed the PDF was the only consumer (now false) → one-line WHY each. |
| `utils/ResumeAdapter.ts` | `toCertificate` (name, organization, `startDateLabel`, `endDateLabel` = `present` when `isNoExpiration`, `descriptionText` tags stripped), `toAward` (`issueDateLabel`, `descriptionText`); `toHero` adds `career` (trimmed, `''` when blank or equal to the shown position). Model types exported. |
| `stores/resume.ts` | `certificates` / `awards` getters (API order, mapped). |
| `themes/portfolio-dev/pages/resumeObject/Index.vue` | `allSections` + 2 tabs; `sections` = computed filter dropping an empty certificates/awards tab (shortcuts `i + 1` stay consecutive; `tabFromUrl` only finds shown tabs → `?tab=` to an empty one falls back, URL unchanged); watcher resets `active` if its tab disappears after a refetch (review finding 1); renders the 2 new panes. |
| `themes/portfolio-dev/pages/resumeObject/Certificates.vue`, `Awards.vue` (new) | JSON code blocks via `buildJsonArrayLines`, same pattern as `Educations.vue`. |
| `themes/portfolio-dev/pages/resumeObject/Hero.vue` | `<p v-if="hero.career">{{ hero.career }}</p>` under the position (text interpolation, no `v-html`). |
| `themes/portfolio-dev/pages/resumeObject/Hr.vue` | Certificates + Awards sections between Education and Languages (PDF order), same markup as Education, `v-if` on length. |
| `i18n/locales/{en,vi}.json` | `resume.hr.certificates` / `awards` (`Certificates`/`Awards`, `Chứng chỉ`/`Giải thưởng` — same words as the PDF). |
| `tests/resumeAdapter.test.ts` | Cases for `toCertificate` (labels, `<b>x</b>` → `x`, `present`), `toAward`, `toHero().career` (trim, repeat, blank). |

## Command
Node v24.19.0 (`nvm use 24`), repo root, final diff, real env (no `NODE_API` override):
`npm run build` · `npm run lint` · `npx nuxi typecheck` · `npm test`
Browser build: `npm run build` with `NODE_API`+`NUXT_PUBLIC_NODE_API=http://localhost:4199`; server `PORT=4188 node .output/server/index.mjs` same env; mock = scratchpad `mock.cjs` serving `fixtures.cjs` variants per `MODE` (server restarted per mode, since `/api/resume` caches in memory): `base` = `fx[0]` + `career 'Career X'`, `positionDesired 'Dev'`, first certificate description `<b>x</b>`; `empty` = `fx[2]` + `career ''`; `same` = `fx[0]` + `career 'Dev'`; `awardsOnly` = `fx[0]` with `certificates: []` + `career '<i>raw</i>'`.

## Output
- `npm run build` → exit `0`; `◆ ✨ Build complete in 14.8s!`; only `WARN … components-C1i8GQ3a.js (369:0): A comment` (generated chunk, same line as in `resume-view-url-diff.md`).
- `npm run lint` → exit `0`; 0 lines matching error|warning.
- `npx nuxi typecheck` → exit `0`; 0 lines matching error.
- `npm test` → exit `0`; ` Test Files  10 passed (10)` / `      Tests  30 passed (30)` (28 before + 2 new cases).
- Every mock server log: `grep -c onrender` → `0` (`base onrender=0`, `empty onrender=0`, `same onrender=0`, `awardsOnly onrender=0`).

## Browser verification
Headless Chrome `puppeteer.launch` (fresh profile, no extensions), 1280×900, `bringToFront`, `vis:"visible"` on every line. Keys `5`/`6` pressed via the keyboard (KeyNav). Final-diff run (verbatim, lines cut at 260 chars where marked `…`):
```
base load /                     {"url":"/","vis":"visible","tabs":"D:Tải CV 1:experiences.pug 2:skills.ts 3:educations.json 4:languages.json 5:certificates.json 6:awards.json","shortcut5":true,"fileTab":"experiences.pug","boldX":false,"hero":"> Dev | next: Car…
base press 5                    {"url":"/?tab=certificates",…"fileTab":"certificates.json",…
base press 6                    {"url":"/?tab=awards",…"fileTab":"awards.json",…
base fresh /?tab=awards         {"url":"/?tab=awards",…"fileTab":"awards.json",…
base fresh /?view=hr            {"url":"/?view=hr","vis":"visible","tabs":"D:Tải CV","shortcut5":false,"boldX":false,"hero":"> Dev | next: Career X","hrHeadings":"Kinh nghiệm làm việc > Kỹ năng > Học vấn > Chứng chỉ > Giải thưởng > Ngoại ngữ","hrHtmlB":0}
base fresh /en?view=hr          {"url":"/en?view=hr","vis":"visible","tabs":"D:Download CV","shortcut5":false,"boldX":false,"hero":"> Dev | next: Career X","hrHeadings":"Experience > Skills > Education > Certificates > Awards > Languages","hrHtmlB":0}
empty load /                     {"url":"/","vis":"visible","tabs":"D:Tải CV 1:experiences.pug 2:skills.ts 3:educations.json 4:languages.json","shortcut5":false,"fileTab":"experiences.pug","boldX":false,"hero":"> Dev | next: Hi","hrHeadings":"","hrHtmlB":0}
empty press 5                    {"url":"/",…"shortcut5":false,"fileTab":"experiences.pug",…
empty fresh /?tab=certificates   {"url":"/?tab=certificates","vis":"visible","tabs":"D:Tải CV 1:experiences.pug 2:skills.ts 3:educations.json 4:languages.json","shortcut5":false,"fileTab":"experiences.pug",…
empty fresh /?view=hr            {"url":"/?view=hr","vis":"visible","tabs":"D:Tải CV","shortcut5":false,"boldX":false,"hero":"> Dev | next: Hi","hrHeadings":"Kỹ năng > Học vấn > Ngoại ngữ","hrHtmlB":0}
empty fresh /en?view=hr          {"url":"/en?view=hr",…"hrHeadings":"Skills > Education > Languages","hrHtmlB":0}
awardsOnly load /                     {"url":"/","vis":"visible","tabs":"D:Tải CV 1:experiences.pug 2:skills.ts 3:educations.json 4:languages.json 5:awards.json","shortcut5":true,"fileTab":"experiences.pug","boldX":false,"hero":"> Dev | next: <i>raw</i>",…
awardsOnly press 5                    {"url":"/?tab=awards",…"fileTab":"awards.json",…
awardsOnly fresh /?tab=certificates   {"url":"/?tab=certificates",…"tabs":"D:Tải CV 1:experiences.pug 2:skills.ts 3:educations.json 4:languages.json 5:awards.json","shortcut5":true,"fileTab":"experiences.pug",…
awardsOnly fresh /?view=hr            {"url":"/?view=hr",…"hrHeadings":"Kinh nghiệm làm việc > Kỹ năng > Học vấn > Giải thưởng > Ngoại ngữ","hrHtmlB":0}
```
Code-block / HR contents, `base`, final diff (`check2.cjs`; from the same run, pre-fix run identical):
```
press 5 {"vis":"visible","text":"… certificates.json 1 [ 2 { 3 \"name\": \"Cert\", 4 \"organization\": \"Org\", 5 \"startDate\": \"01/2023\", 6 \"endDate\": \"01/2025\", 7 \"description\": \"x\" 8 }, 9 { 10 \"name\": \"Cert2\", 11 \"organization\": \"Org2\", 12 \"startDate\": \"01/2023\", 13 \"endDate\": \"present\", 14 \"description\": \"\" 15 } 16 ]","bInBlock":0}
press 6 {"vis":"visible","text":"… awards.json 1 [ 2 { 3 \"name\": \"Award\", 4 \"organization\": \"Org\", 5 \"issueDate\": \"04/2024\", 6 \"description\": \"aw\" 7 } 8 ]","bInBlock":0}
hr ["CHỨNG CHỈ Cert 01/2023 – 01/2025 Org x Cert2 01/2023 – present Org2","GIẢI THƯỞNG Award 04/2024 Org aw"]
```
`same` mode (pre-review-fix run; the fix touched only `Index.vue` tab logic, not the hero/adapter): `same load /  {… "hero":"> Dev | next: Hi" …}` — the element after the position is the introduction, no career line.
`hero` field = position text, then the next `<p>` text (`Hi` = the introduction).

## Acceptance
| Criterion | Evidence |
|---|---|
| 1. base: tabs `5:certificates.json` `6:awards.json`; `5` → Cert/Org/Cert2; `6` → Award; Cert2 `present`; `/?tab=awards`; hero `Career X` under `Dev` | `base load /` tabs; `press 5` text `"Cert"`, `"Org"`, `"Cert2"`, `"endDate": "present"`; `press 6` `"Award"`; `base fresh /?tab=awards` `fileTab":"awards.json"`; `"hero":"> Dev | next: Career X"` |
| 2. empty: no new tabs, no `data-shortcut="5"`, `/?tab=certificates` → experiences, URL unchanged, no career line | `empty load /` tabs 1–4, `shortcut5:false`; `empty fresh /?tab=certificates` URL `/?tab=certificates`, `fileTab":"experiences.pug"`; hero `next: Hi` |
| 3. career = position → no line | `same load /` `"hero":"> Dev | next: Hi"`; unit test `toHero({}, { positionDesired: 'Dev', career: ' Dev ' }).career` → `''` |
| 4. `<b>x</b>` → `x`, no `<b>` | `press 5` `"description": "x"`, `bInBlock:0`; HR `… Org x …`, `hrHtmlB:0`; unit test `descriptionText: 'x'` |
| 5. HR order + empty hidden | `base fresh /?view=hr` / `/en?view=hr` headings; `empty fresh /?view=hr` has no Chứng chỉ/Giải thưởng |
| 6. only awards → `5`; HTML-looking career literal | `awardsOnly load /` `5:awards.json`, `press 5` → `awards.json`; `"hero":"> Dev | next: <i>raw</i>"` (textContent shows the tags literally → not parsed as HTML) |
| 7. build/lint/typecheck clean; `npm test`; adapter cases | Output section; `Tests  30 passed (30)` |
| comments per code-comments.md | Touched: `types/resume-document.ts` 2 multi-line `/** */` blocks with `(issue #142)` refs + grep narration → replaced by one `//` WHY line each (no `#N`); `ResumeAdapter.ts` `/** Plain text, HTML tags stripped. */` ×2 (same JSDoc style as `toEducation`), `/** Free-text line under the position; ''…*/` on `career`; `Index.vue` `// Tabs with no data are left out…` and `// A refetch (e.g. locale switch) can drop the open tab…` (WHY, one sentence each). New `Certificates.vue`/`Awards.vue` have no file header (opt-in OFF in code-comments.md). |
| Coverage: callers | `grep -rn "store.certificates\|store.awards\|hero.career" themes` → only `Hr.vue:83,85,95,97`, `Hero.vue:75`, `Awards.vue:7`, `Certificates.vue:8` (all new). `Resume` type change is additive (optional fields). |

## Supersedes: none
`grep -n "#420"` on the active diagram before adding the row → no output.

## Review
`/code-review medium` (forked) → 9 findings:
1. `active` not reset when its tab drops out after a refetch → **fixed** (`watch(sections, …)` falls back to the default tab).
2. `?tab=` to an empty tab leaves the query in the URL → **false positive per spec**: `resume-home.md` edge case "`?tab=certificates|awards` while that list is empty → default tab, URL unchanged (same as `?tab=unknown`)".
3. Hero shows placeholder 'A frontend developer' + career instead of the PDF's `positionDesired || career` fallback → **by operator decision**: Q6 answer (a) "Hero line", not (b) "fallback".
4. Repeat check is case-sensitive → **not done**: spec Behavior 16 says "equal (trimmed)"; noted below.
5. Missing dates render `--/--` → **false positive per spec**: Behavior 14 "A missing date shows `--/--` like education".
6. `present` not localized in vi → **pre-existing pattern** (education/experience use the same adapter string), spec Q8 chose the PDF wording; noted below.
7. Filter expression hard to read → **fixed** (`s.key === 'certificates' || s.key === 'awards' ? store[s.key].length > 0 : true`).
8. HR markup duplicated across education/certificates/awards → noted below (refactor out of scope).
9. `<span>` vs `<time>` for dates → kept `<span>` to match the Education block it mirrors; noted below.
Review not re-run after the 2 fixes; final diff re-verified by build/lint/typecheck/test + the browser run above.

## Noticed, not done
- Career-vs-position repeat check is case-sensitive (`Frontend Developer` vs `frontend developer` would show twice) — spec says "equal (trimmed)"; a case-insensitive compare would need a spec change.
- Hard-coded English `present` in date labels in the vi locale (education, experience, projects, now certificates) — separate i18n issue.
- HR education/certificates/awards markup is near-identical (3 copies); HR/Education date uses `<span>`, Experience uses `<time>`.
- Build `WARN … A comment "/* @__NO_SIDE_EFFECTS__ */"` in a generated chunk — not from this diff.
- The analyst pass called production `/api/resume` while specifying (it reported `502 FUNCTION_INVOCATION_FAILED`, 2026-11-22) — this pass made no such call; the live 502 itself is unverified here.

## Seal gate: none (no commit/push/external call; mock on localhost only)
