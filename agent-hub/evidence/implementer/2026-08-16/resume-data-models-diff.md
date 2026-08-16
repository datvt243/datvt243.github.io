# 2026-08-16 — resume-data-models (diff)

- Worker: implementer
- Version: 0.1.0
- Node: `haven/diagrams/dev-loop.prime-mermaid.md` → `resume-data-models`
- Issue: #71, branch `feature/71`

## Diff
| File | Why |
|---|---|
| `models/BaseModel.ts` (new) | Prototype-pattern base: `clone()` via `Object.create(Object.getPrototypeOf(this))` + `cloneDeep` (reused existing `utils/cloneDeep.ts`, not reimplemented) |
| `models/Experience.ts`, `Education.ts`, `Skill.ts`, `Language.ts`, `Project.ts`, `Hero.ts`, `SocialMedia.ts` (new) | One model class + one pre-built prototype instance + one `adapt*` function per entity — see the plan note's field table for exact fields/getters and the reasoning behind each |
| `models/index.ts` (new) | Barrel export, matches the existing `utils/index.ts`/`types/index.ts` convention |
| `utils/index.ts` | Added `export * from './removeHtmlTags'` — it existed but wasn't in the barrel (a real pre-existing inconsistency, needed since `EducationModel`/`ProjectModel` now import it via `@/utils`) |
| `pages/index.vue` | 1-line import fix, now uses the barrel (`@/utils`) instead of the deep path `@/utils/removeHtmlTags`, consistent with every other util import in the repo |
| `stores/resume.ts` | `hero`/`social`/`experiences`/`educations`/`projects`/`foreignLanguages`/`skills` getters now map through the adapters, returning model instances instead of raw API objects. Removed the confirmed-dead `contact` getter (only defined, never consumed anywhere — contact page reads `useAppConfig().contact`, a static config, not this store) |
| `themes/portfolio-dev/pages/resumeObject/Experiences.vue` | Reads `el.dateRangeLabel`/`el.descriptionItems` (model getters) instead of a local `dateRange()` function + direct `extractListItems()` call |
| `themes/portfolio-dev/pages/resumeObject/Educations.vue` | Reads `el.startDateLabel`/`el.endDateLabel`/`el.descriptionText` instead of `convertNumberToDate()` + a duplicated inline `stripHtml` |
| `themes/portfolio-dev/pages/resumeObject/Skills.vue` | Uses `s.group === 'Other'` (the model's normalized default) instead of `!Object.hasOwn(s, 'group')` on raw data; `s.yearsOfExperience` instead of raw `s.exp` |
| `themes/portfolio-dev/pages/resumeObject/Languages.vue` | Drops now-redundant `\|\| ''` fallbacks (the model guarantees non-empty-string defaults) |
| `themes/portfolio-dev/pages/resumeObject/Hero.vue` | Uses `hero.fullName` (model getter) instead of a local `getFullName` computed |
| `themes/portfolio-dev/pages/resumeObject/AboutMe.vue` | Uses `social.value.links` (model getter) instead of `Object.entries(social.value \|\| {})`; drops a redundant `\|\| ''` on `hero.value.introduction` |
| `themes/portfolio-dev/pages/projects/Index.vue` | Uses `p.id`/`p.slug`/`p.dateRangeLabel`/`p.descriptionText` (model fields/getters) instead of `p._id`, an inline slug computation, a local `getDate()`, and a duplicated inline `stripHtml` |
| `agent-hub/haven/diagrams/dev-loop.prime-mermaid.md` | Node `resume-data-models`: IN_PROGRESS → (will be SEALED by the verifier) |

**Confirmed out of scope, untouched**: `server/utils/createPDF.ts` +
`server/api/generate-pdf.ts` — fetch resume data independently
server-side (`$fetch(NODE_API...)`), zero dependency on the client Pinia
store models introduced here.

## Two intentional, small behavior changes (not regressions — flagging clearly)
1. **`ProjectModel.dateRangeLabel` is now `isWorking`-aware.** Before:
   `projects/Index.vue`'s local `getDate()` always showed the raw
   formatted end date, even for ongoing projects. After: shows
   `'present'` when `isWorking` is true — verified via CDP screenshot,
   the "SimpleMDG" project (real ongoing project in the data) now
   correctly shows `12/2024 - present` instead of a formatted (likely
   garbage/future) end date. This directly matches the `isWorking` field
   the model exists to represent, not a speculative addition.
2. **`SocialMediaModel.links` filters out empty URLs**, whereas the old
   `Object.entries(social.value || {})` in `AboutMe.vue` would have
   rendered a markdown link with an empty URL if `github`/`linkedin`/
   `website` were ever blank. Not observable in the current real data
   (all 3 are populated), but is the more correct behavior going forward.

## Command
```
npm run build
```
```
npm run lint
```

## Output
`npm run build` — ran in background after `rm -rf node_modules/.cache
.nuxt .output`, verbatim tail:
```
Σ Total size: 27.5 MB (10 MB gzip)
[nitro] ✔ You can preview this build using node .output/server/index.mjs
```
Exit code 0, no error anywhere in the full captured output (checked the
complete background-task log, not just the tail).

`npm run lint` — verbatim tail:
```
✖ 34 problems (0 errors, 34 warnings)
```
Identical count/content to the baseline established across every prior
node this session — none of the new `models/*.ts` files or any edited
file appear in the warning list. No new `@typescript-eslint/no-explicit-any`
introduced (the whole point of part of this task was removing `any` from
the data layer — `Project.images`/`ProfessionalSkill` are no longer `any`
on the model side, though the raw API *type* in `types/resume-document.ts`
still has `personalSkills: any[]`/`images: any[]` since that's the actual
untyped shape the external API can return — the adapter is exactly the
layer that narrows it, which is the point of introducing an adapter).

## Browser verification
Chrome CDP port 9888 (already running), dev server started specifically
for this step. Connected via `puppeteer-core`, exercised every modeled
section on the real `/` page (clicking real tabs, not `Page.navigate`) plus
`/projects`:

```
hero h1: Võ Tấn Đạt {
body has "Frontend Developer": true
skills.ts renders SkillGroup + years: true
experiences: {"title":"h3Frontend Developer (SAPUI5)","hasDateRange":true}
educations.json has "school": true
languages.json has "language": true
projects page: {"hasDate":true,"cards":2}
console errors: []
```
Zero browser console errors/exceptions across every route exercised —
confirms the model/adapter layer didn't throw on real production API data
(missing fields, the `group`-sometimes-absent quirk, etc. all handled by
the adapters' `??`/`Boolean()` fallbacks).

6 screenshots taken (`about-me.md`, `skills.ts`, `experiences.pug`,
`educations.json`, `languages.json` tabs on `/`, plus `/projects`) —
compared against this session's earlier pre-refactor screenshots of the
same page: **pixel-identical** for every field (name, position, skills
with years, experience title/company/dates/description bullets, education
school/major/dates, language/level, about-me bio + social links), except
the intentionally-flagged `projects` date-range fix above (SimpleMDG now
shows `12/2024 - present` instead of a raw formatted end-of-time date).

## Acceptance
| # | Criterion | Evidence |
|---|---|---|
| 1 | All 7 models exist, extend `BaseModel`, `.clone()` preserves the prototype chain | All 7 files created; `BaseModel.clone()` uses `Object.create(Object.getPrototypeOf(this))` — verified live via CDP: `hero.fullName`, `el.dateRangeLabel`, `p.slug`, `el.descriptionItems` etc. (all class getters) render correctly in the browser off cloned instances returned by the adapters through the store |
| 2 | Every model has an adapter with safe fallbacks | All 7 `adapt*` functions use `??`/`Boolean()`/type-guards (e.g. `Project.images` filters to `string` only); 0 console errors on real API data confirms no `undefined` leaked through |
| 3 | Store getters return model instances, `contact` getter removed | `stores/resume.ts` diff; `contact` getter deleted, confirmed dead beforehand (research: only defined, never called anywhere) |
| 4 | Every consumer reads model fields/getters, duplicated logic gone | Diff table above lists each of the 7 consumer files; `grep`-confirmed no remaining `Object.hasOwn(s, 'group')`, no remaining duplicated inline `stripHtml` |
| 5 | Build/lint clean, no new `any` | Cited above |
| 6 | CDP: renders identically except the documented `isWorking` fix | Cited above, both console-error-free execution and pixel comparison against earlier screenshots |

## Noticed, not done
- `types/resume-document.ts`'s `Item`/`Reference`/`Certificate`/`Award`
  interfaces remain unused by any client code (confirmed only
  `server/utils/createPDF.ts` — out of scope — references them). Not
  deleting them here since that file wasn't touched and they're still
  live types for it; a future PDF-generation cleanup task could revisit.
- `Project.technologyUsed` field was dropped from `ProjectModel` (dead,
  never read) but is still present in the raw `types/resume-document.ts`
  `Project` interface (that's the true, unedited external API shape) —
  intentionally left there since the model layer's job is exactly to
  filter out dead API fields, not to edit the raw API type to match.

## Seal gate
None — no outward-facing action (no commit/push/PR) in this implementer
pass.
