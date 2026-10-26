# 2026-10-26 - pdf-ats-polish (diff)

- Worker: implementer · Version: 0.1.0
- Node: `pdf-ats-polish` (last row of `haven/diagrams/dev-loop.prime-mermaid.md`)
- Task: issue #284, branch `bug/284` (git worktree `scratchpad/wt284`, rebased onto `staging` cb60738)
- Status: `sealed_pending_verifier`

## Hub bytes before
77905

## Diff
| File | Why |
|---|---|
| `utils/groupSkills.ts` (new) + `utils/index.ts` export | The grouping rule from #281 (listed groups first, then first appearance, `other` last, empty groups dropped; a skill without `group` → `other`), now shared. `/** */` WHY block moved here from Skills.vue. |
| `themes/portfolio-dev/pages/resumeObject/Skills.vue` | `groupedSkills` = `groupSkills(store.groups, store.skills)` mapped to the existing `{ name, exp, icon }` shape. |
| `server/utils/createPDFAts.ts` | Skills: one `<li>` per group via `groupSkills` ('Other' → localized `h.other`), replacing the "one flat line when `professionalSkillsGroup` is empty" path. `.heading` gets `break-after: avoid`; `.entry` loses `break-inside: avoid`. Returns `fileName` (`removeVietnameseTones("<full name> CV")`, non-alphanumerics → `-`) instead of `email`; `→` → `->` in the HTML (`/** */` WHY: Vercel's Chromium has no arrow glyph). |
| `server/api/generate-pdf.ts` | Uses `fileName` for the cache entry and `Content-Disposition`. |
| `composables/useDownloadResume.ts` | `link.download` from the response's `Content-Disposition` filename (fallback `resume.pdf`), `//` WHY; unused `useResumeStore()` removed. |
| `haven/diagrams/dev-loop.prime-mermaid.md` | Node row appended |

## Commands + output (worktree, own `node_modules/.cache` — a shared cache with a concurrent build in the main checkout first broke one build with a /contact prerender error; isolated, it builds clean)
```
npm run build → rc=0, "◆ ✨ Build complete in 14.2s!", 1 pre-existing WARN (components-*.js (369:0): A comment)
npm run lint → rc=0
npx nuxi typecheck → 0 "error TS"
```
(Measured before the rebase onto cb60738; the rebase only brought #295's `Index.vue` tab reorder + agent-hub files.)

## PDF (prod build :4150 → mock :4199 with the captured API data, local Chrome; `scratchpad/p1/pdfinfo.py` with pypdf)
```
en: Content-Disposition: attachment; filename="Vo-Tan-Dat-CV.pdf"
    pages 3 — page 1: 38 lines, last 'module legacy liên quan và viết unit test bằng Jest cho busi'
              page 2: 38 lines, first 'Hướng dẫn thành viên mới…', last 'Stack: HTML5, Pug, SCSS, Grunt'
              page 3: 21 lines, first 'PROJECTS', last 'english (basic)'
    arrows 0 | "->" 2 | replacement-char 0
vi: same file name; pages 3 (38 / 38 / 21), page 3 starts 'DỰ ÁN'; arrows 0, "->" 2
SKILLS (en, page 1): Languages / Vue ecosystem / SAP / Testing & Code Quality / Performance / Architecture & Practices / Backend / Tools & Workflow / AI-assisted Development / Familiar with — 10 group lines
```
Intermediate run with heading `break-after: avoid` but `.entry` still `break-inside: avoid`: page 1 = 24 lines (EXPERIENCE heading + the long first job jumped to page 2) → dropped `break-inside: avoid`.
Tried a denser layout (10pt / line-height 1.3 / 12mm margins): still 3 pages (43 / 45 / 7) → reverted; going below 10pt is against ATS guidance.

## Skills tab regression (SSR `/en` visible text, main-checkout build of staging vs this branch, same mock data)
`words 1450 1450, diff ops 3` — all three are the sidebar tab order (#295 was on the base build, not yet on this branch before the rebase); the skills block is word-for-word identical.

## Browser (CDP :9888, incognito, real click on hero "Download CV", anchor click intercepted)
`{"download":"Vo-Tan-Dat-CV.pdf","errs":[]}`

## Acceptance
| Criterion | Evidence |
|---|---|
| 1. No missing glyphs | arrows 0, "->" 2, replacement-char 0 (both langs) |
| 2. No orphan heading | page last lines are entry text; page 3 starts with the PROJECTS/DỰ ÁN heading |
| 3. File name | header + browser download name `Vo-Tan-Dat-CV.pdf` |
| 4. Skills grouped; tab unchanged | 10 group lines; SSR diff only tab order |
| 5. ≤ 2 pages | **Not met: 3 pages** (38/38/21). Baseline today is also 3 (40/37/15) — the backend data grew since the audit (43 skills, more projects). Fitting 2 pages needs shorter content (backend data, operator updates it by hand) |
| 6. checks; comments per code-comments.md | rc=0 / 0 TS errors; one `/** */` moved (Skills.vue → groupSkills.ts), one new `/** */` (arrow), two `//` one-liners (why name-based file name; why the client reuses the server's name); WHY only, no `(#N)`. REOPEN 1 fix: the file-name `//` said WHAT ("the person's name in ASCII") — rewritten as WHY |

## Still open
- Issue #284 criterion "PDF ≤ 2 pages" is **not met** (3 pages, 38/38/21 lines, both langs) and stays open: it needs shorter backend content, which the operator edits by hand. The PR therefore uses `Refs #284`, not `Closes #284`. Content hints from the verifier: each job's description ends with its own "Stack:" paragraph, duplicating the generated Stack line (−3 lines); 2 of the 3 projects repeat jobs already listed.

## Supersedes
none (REOPEN 1 by verifier: WHAT-comment on file name + missing Still open — both fixed; one comment line changed, no logic change)

## Noticed, not done
- Arrow fix is a text substitution for `→` only; other symbols missing from Vercel's Chromium fonts (if any appear in data) would still render as boxes. Bundling a font via `chromium.font()` would be the general fix.
- `SKILL_ICONS` typo aliases still in Skills.vue (#283 data scope).

## Seal gate
none.
