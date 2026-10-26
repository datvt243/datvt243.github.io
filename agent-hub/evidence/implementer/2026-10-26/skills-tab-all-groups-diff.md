# 2026-10-26 - skills-tab-all-groups (diff)

- Worker: implementer · Version: 0.1.0
- Node: `skills-tab-all-groups` (`haven/diagrams/dev-loop.prime-mermaid.md`, last row)
- Task: issue #281 "bug: Skills tab hides every grouped skill (Vue.js, JavaScript, TypeScript, Nuxt, Pinia…)", branch `bug/281` off `staging` 8d41203 (via `/todo "fix P0"`)
- Status: `sealed_pending_verifier`

## Hub bytes before
78000

## Diff
| File | Why |
|---|---|
| `themes/portfolio-dev/pages/resumeObject/Skills.vue` | `groupedSkills` builds its label list from `store.groups` ∪ every skill's own `group` (Set → no duplicates), stable-sorted so `'Other'` is last, then drops empty groups. Before, only `store.groups` (empty `[]` from the API) + `'Other'` were rendered. One `/** */` WHY block. |
| `haven/diagrams/dev-loop.prime-mermaid.md` | Node row appended |

## Data note
The backend resume data changed since the audit (now 43 `professionalSkills` in 10 groups, `professionalSkillsGroup: []` still empty; `yearsOfExperience` now 4). Base and fix servers were captured back-to-back and their `/api/resume` JSON is identical (`cmp` → "api json identical"), so the comparison is fair.

## Commands + output
```
source scratchpad/p0/env.sh   (real public runtime-config values, see resume-pii-whitelist-diff.md)
rm -rf .nuxt .output node_modules/.cache && npm run build → rc=0, "◆ ✨ Build complete in 13.6s!", WARN count 0
npm run lint → rc=0 ("> eslint ." only)
npx nuxi typecheck → rc=0, 0 "error TS", last line "[nuxt:icon] ✔ Nuxt Icon discovered local-installed 3 collections: fe, grommet-icons, heroicons"
```
Base = prod build of `bug/280` (code identical to `staging` 8d41203) on :4130; fix on :4131.

## SSR comparison (`/`, `/en`, visible text, HTML-unescaped)
```
API skills 43 groups list []
h_.html   skills block BEFORE: enum SkillGroup { 2 } 3 4 const skills : Record SkillGroup , string[] > = { 5 } 6 7
h_.html   missing after unescape: [] count rendered 43 / 43
h_en.html missing after unescape: [] count rendered 43 / 43
```
Text outside the skills block: only the code-block line numbers of the following `personalSkills` lines shift (`8→81 … 13→86`), because the same `<ThemeCodeBlock>` now has more lines above them. No other difference (difflib opcodes listed in full in the run; all six are line-number changes).

## Browser verification (CDP :9888, Chrome/155.0.8059.85, incognito context, real click on the `skills.ts` sidebar tab — `scratchpad/p0/skills-ui.cjs`)
```
"base": { "clicked": true, "url": "http://localhost:4130/en?tab=skills", "groupRefs": 0,  "quotedStrings": 5,  "overflowX390": false, "errors": [] }
"fix":  { "clicked": true, "url": "http://localhost:4131/en?tab=skills", "groupRefs": 10, "quotedStrings": 58, "overflowX390": false, "errors": [] }
```
58 = 10 enum labels + 43 skills + 5 personal skills. `errors` excludes the known VisitTracker CORS lines (#285). Screenshots: `scratchpad/p0/skills-{base,fix}-{1440,390}.png` — fix shows all 10 groups (Languages … Familiar with), icons on mapped names, no horizontal overflow at 390px.

## Acceptance
| Criterion | Evidence |
|---|---|
| 1. All 17 (now 43) skills render with `professionalSkillsGroup: []` | "count rendered 43 / 43" (SSR, both locales); CDP "quotedStrings": 58 after real tab click |
| 2. Order: listed groups first, then first-appearance, `Other` last, no duplicates | Code: `new Set([...store.groups, ...skills.map(group)])` + stable sort on `=== 'Other'`; rendered order matches API first-appearance (Languages → … → Familiar with); no `Other` group in current data |
| 3. Nothing else changes | Only `personalSkills` line numbers shift; API JSON identical between runs |
| 4. build / lint / typecheck clean | rc=0 ×3, WARN 0, 0 "error TS" |
| 5. comments per code-comments.md | One `/** */` block, >1 sentence, WHY (API list may be empty/incomplete); no `(#N)` refs |

## Supersedes
none

## Still open
none for #281.

## Noticed, not done
- The PDF (`server/utils/createPDFAts.ts` skills) already handles an empty `professionalSkillsGroup` (falls back to one line) — not changed.
- `SKILL_ICONS` typo aliases (`gitlap`/`githup`/`postmain`) are for #283's data fix; current data no longer uses those names, but removing the aliases is #283's scope.

## Seal gate
none (no commit/push/PR in this pass).
