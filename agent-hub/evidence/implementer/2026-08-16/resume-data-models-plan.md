# 2026-08-16 — resume-data-models (plan)

- Worker: implementer
- Version: 0.1.0
- Node: `haven/diagrams/dev-loop.prime-mermaid.md` → `resume-data-models`
- Issue: #71, branch `feature/71` (off `main`)
- Task (verbatim, paraphrased from Vietnamese): "Currently exp/edu/... data
  comes from the API and gets displayed directly, there's no model in the
  code at all. I want a model for each one. The model should apply the
  Prototype design pattern — pre-build one object instance with standard
  fields (researched and created by you), plus an adapter that converts
  API data into data matching the model." Follow-up clarifications via
  AskUserQuestion: (1) fully wire into store + UI, not just build an
  unused model layer; (2) cover all 7 entities: Experience, Education,
  Skill, Language, Project, GeneralInformation/Hero, SocialMedia.

## Current state (read before writing)
Full research already done via a read-only Explore agent + direct reads of
`types/resume-document.ts`, `types/resume-api.ts`, `stores/resume.ts`,
`utils/{cloneDeep,convertNumberToDate,removeHtmlTags,htmlCodeLines}.ts`,
and every consuming component
(`Hero.vue`/`AboutMe.vue`/`Experiences.vue`/`Educations.vue`/`Skills.vue`/
`Languages.vue`/`projects/Index.vue`). Confirmed real, pre-existing
inconsistencies this task fixes as a side effect of modeling:

- `Project.technologyUsed` (typed, in the raw API shape) is never read —
  only `Project.technology` is used. Dropping `technologyUsed` from the
  model.
- HTML `description` stripping is implemented 3 different ways:
  `extractListItems` (Experiences.vue, already a shared util),
  `removeHtmlTags` (only used in `pages/index.vue` for SEO, not resume
  components), and a **locally duplicated** inline `stripHtml` arrow
  function copy-pasted in both `Educations.vue` and `projects/Index.vue`.
- Dates are raw epoch-ms `number`, requiring `isCurrent`/`isWorking`
  special-casing at each call site via `convertNumberToDate`.
- `skills.group` is sometimes **absent from the object entirely** (not
  `undefined`) — `Skills.vue` checks via `!Object.hasOwn(s, 'group')`.
- `personalSkills: any[]`, `images: any[]` are untyped `any`.
- Dead code confirmed unused anywhere: `stores/resume.ts`'s `contact`
  getter (contact page reads `useAppConfig().contact` instead, a static
  config, not the API store), and the `Item`/`Reference`/`Certificate`/
  `Award` interfaces in `types/resume-document.ts` (used only by
  server-side `server/utils/createPDF.ts`, which is out of scope — see
  below).
- `utils/cloneDeep.ts` **already exists** — a recursive plain deep-clone
  helper. Reused as the mechanism behind the Prototype pattern's
  `.clone()` (see Design below), not reimplemented.

**Confirmed out of scope**: `server/utils/createPDF.ts` +
`server/api/generate-pdf.ts` fetch resume data **independently** via
their own `$fetch(NODE_API...)` call, server-side, with zero dependency on
the client Pinia store (`stores/resume.ts`) — Nitro server routes can't
use a client Pinia store anyway. Introducing client-side models doesn't
touch this file; leaving it untouched per the issue's stated scope.

## Design

### Prototype mechanism
```ts
// models/BaseModel.ts
export abstract class BaseModel {
  clone(): this {
    const copy = Object.create(Object.getPrototypeOf(this))
    return Object.assign(copy, cloneDeep(this))
  }
}
```
`Object.create(Object.getPrototypeOf(this))` re-attaches the SAME
prototype (so class methods/getters like `dateRangeLabel` survive the
clone) — this is the actual Prototype-pattern mechanism, not just a
plain-object copy. `cloneDeep(this)` only touches the instance's own
**enumerable** data fields (ES6 class methods/getters live on the
prototype and are non-enumerable by default, so `cloneDeep`'s `for...in`
loop never touches them — verified this is safe by design, not by
accident). Each entity file exports one pre-built prototype instance
(`export const experiencePrototype = new ExperienceModel()`) and an
adapter function that clones it and fills in real values:
```ts
export function adaptExperience(raw: Partial<Experience>): ExperienceModel {
  return Object.assign(experiencePrototype.clone(), {
    id: raw._id ?? '',
    company: raw.company ?? '',
    // ...
  })
}
```

### Field lists per model (standard fields, researched)
Cross-referenced against JSON Resume (jsonresume.org/schema — the most
widely used open resume-data standard) for field-naming conventions, then
adjusted to (a) only include fields the current UI actually consumes (no
speculative fields for hypothetical future use, matching this repo's own
CLAUDE.md anti-overengineering guidance) and (b) fix the inconsistencies
above:

| Model | Fields | Computed getters (unify duplicated logic) |
|---|---|---|
| `ExperienceModel` | `id, company, position, startDate: Date\|null, endDate: Date\|null, isCurrent, description, skills: string[]` | `descriptionItems` (→ `extractListItems`), `dateRangeLabel` (→ `convertNumberToDate` + `isCurrent`, lowercase `'present'` — matches current exact wording) |
| `EducationModel` | `id, school, major, startDate, endDate, isCurrent, description` | `descriptionText` (→ `removeHtmlTags`, replacing the duplicated inline `stripHtml`), `startDateLabel`, `endDateLabel` (separate, since Educations renders them as 2 JSON fields, not 1 combined range) |
| `SkillModel` | `name, yearsOfExperience` (renamed from ambiguous raw `exp`), `group` (adapter always sets `raw.group ?? 'Other'` — **removes** the `Object.hasOwn` quirk at the source) | — |
| `LanguageModel` | `language, level` | — |
| `ProjectModel` | `id, name, description, position, technology: string[]` (drops dead `technologyUsed`), `images: string[]` (fixes `any[]`), `link, isWorking, startDate, endDate` | `slug` (→ replaces the inline `p.name?.toLowerCase().replace(/\s+/g,'-')` in `projects/Index.vue`), `descriptionText`, `dateRangeLabel` (now **isWorking-aware**, shows `'present'` — small behavior improvement flagged below, current code shows raw end date even for ongoing projects) |
| `HeroModel` | `firstName, lastName, positionDesired, introduction, email` — only fields actually read by `Hero.vue`/`AboutMe.vue` today; deliberately NOT adding `phone/address/birthday/gender/marital` from the raw `Information` type since nothing renders them (no dead, untested model fields) | `fullName` (→ replaces `Hero.vue`'s local `getFullName` computed) |
| `SocialMediaModel` | `github, linkedin, website` | `links: {name, url}[]` (→ replaces `AboutMe.vue`'s inline `Object.entries(social.value \|\| {})`) |

### Files
- `models/BaseModel.ts` (new)
- `models/Experience.ts`, `Education.ts`, `Skill.ts`, `Language.ts`,
  `Project.ts`, `Hero.ts`, `SocialMedia.ts` (new)
- `models/index.ts` (new, barrel export — matches `utils/index.ts`/
  `types/index.ts` convention already in this repo)
- `stores/resume.ts`: `experiences`, `educations`, `projects`,
  `foreignLanguages`, `skills`, `hero`, `social` getters now map through
  the adapters; **removed** the confirmed-dead `contact` getter
- `themes/portfolio-dev/pages/resumeObject/{Experiences,Educations,Skills,
  Languages,Hero,AboutMe}.vue`, `themes/portfolio-dev/pages/projects/Index.vue`
  — read from model fields/getters instead of raw API fields + local
  duplicated formatting logic

## Acceptance criteria
| # | Criterion |
|---|---|
| 1 | All 7 models exist, extend `BaseModel`, `.clone()` preserves the prototype chain (a getter still works on the clone) |
| 2 | Each model has an adapter function mapping the raw API type → model instance, with safe fallbacks (no `undefined` leaking for missing fields) |
| 3 | `stores/resume.ts` getters return model instances, not raw API objects; `contact` getter removed |
| 4 | Every consuming component reads model fields/getters; the 3x-duplicated HTML-strip logic and the `Object.hasOwn` skills-group check are gone |
| 5 | `npm run build` clean, `npm run lint` clean, no new `any` |
| 6 | Chrome CDP: `/` (resume page) renders identically to before for Skills/Experiences/Educations/Languages/Hero/AboutMe content (values unchanged, since this is a data-layer refactor not a visual change) — except `projects/Index.vue`'s ongoing-project date range, which now shows `'present'` (documented behavior improvement, not a regression) |

## Blocked by
None.
