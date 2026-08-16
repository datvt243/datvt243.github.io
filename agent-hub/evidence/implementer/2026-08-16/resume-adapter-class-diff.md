# 2026-08-16 — resume-adapter-class (diff)

- Worker: implementer
- Version: 0.1.0
- Node: `haven/diagrams/dev-loop.prime-mermaid.md` → `resume-adapter-class`
- Issue: #71, branch `feature/71`

## Diff
| File | Why |
|---|---|
| `utils/ResumeAdapter.ts` (new) | Single `ResumeAdapter` class, one method per entity (`toExperience`/`toEducation`/`toSkill`/`toLanguage`/`toProject`/`toHero`/`toSocialMedia`), each cloning its own private prototype field. Deliberately **not** re-exported from `utils/index.ts` (would create a `utils/index.ts` ⇄ `models/index.ts` circular import — documented in the file's own header comment) |
| `models/Experience.ts`, `Education.ts`, `Skill.ts`, `Language.ts`, `Project.ts`, `Hero.ts`, `SocialMedia.ts` | Removed the local prototype const + standalone `adapt*` function from each — now just the class body (fields + computed getters), unchanged otherwise |
| `stores/resume.ts` | Swapped the `@/models` adapter-function import for `import { resumeAdapter } from '@/utils/ResumeAdapter'`; all 7 getter call sites changed from `adaptX(...)`/`.map(adaptX)` to `resumeAdapter.toX(...)`/`.map(resumeAdapter.toX)` |
| `agent-hub/haven/diagrams/dev-loop.prime-mermaid.md` | Node `resume-adapter-class`: IN_PROGRESS → (will be SEALED by the verifier) |

## Deviation from the approved plan (disclosed, not hidden)
The plan called for `static` methods with `private static readonly`
prototype fields. First `npm run lint` after implementing that literally
caught a REAL error, not a warning:
```
utils/ResumeAdapter.ts
  21:14  error  Unexpected class with only static properties  @typescript-eslint/no-extraneous-class
```
This repo's ESLint config explicitly forbids a class made of nothing but
static members. Fixed by switching to **instance** arrow-function fields
(`toExperience = (raw) => {...}`) + private instance prototype fields,
with a single exported singleton (`export const resumeAdapter = new
ResumeAdapter()`) that every caller shares. This still satisfies the
user's "one class" request (the class itself is unchanged in shape/intent,
just not `static`) and has a bonus over the original plan: arrow-function
fields bind `this` at construction time, so pitfall #1 from the plan
("static methods must never use `this`, since store getters pass them as
bare `.map()` callbacks") is now structurally impossible to get wrong,
rather than a discipline to remember. `stores/resume.ts` imports the
`resumeAdapter` singleton instead of the `ResumeAdapter` class.

## Command
```
npm run build
```
```
npm run lint
```

## Output
`npm run build` — ran twice (once before the lint-error fix above, once
after switching to instance fields); both ran clean after
`rm -rf node_modules/.cache .nuxt .output`, final verbatim tail:
```
Σ Total size: 26.3 MB (9.76 MB gzip)
[nitro] ✔ You can preview this build using node .output/server/index.mjs
```
Exit code 0 both times, full captured log checked, no error string
anywhere.

`npm run lint` — first run (before the fix) caught the real error above
(`1 error, 34 warnings`); after switching to instance arrow fields,
verbatim tail:
```
✖ 34 problems (0 errors, 34 warnings)
```
Back to the exact session baseline — `utils/ResumeAdapter.ts` no longer
appears in the problem list at all.

## Browser verification
Chrome CDP port 9888 (already running), dev server restarted for this
step. Connected via `puppeteer-core`, specifically re-exercised the
bare-`.map()`-callback call sites in `stores/resume.ts`
(`resumeAdapter.toExperience`/`toEducation`/`toSkill`/`toLanguage`/
`toProject` passed directly as `.map()` callbacks) live in the real
browser, per the plan's stated reason this needed a runtime check, not
just a type-level one:

```
hero h1: Võ Tấn Đạt {
skills.ts renders SkillGroup + years: true
experiences: {"title":"h3Frontend Developer (SAPUI5)","hasDateRange":true}
educations.json has "school": true
languages.json has "language": true
projects page: {"hasDate":true,"hasPresent":true,"cards":2}
console errors: []
```
`console errors: []` is the load-bearing line here — a `this`-binding
mistake in a bare-callback static method would have thrown a real
`TypeError` at exactly these call sites (every one of them runs on every
render of these sections), and it didn't.

2 screenshots taken (`about-me.md` tab, `/projects`) — compared pixel-by-
pixel against the already-sealed `resume-data-models` node's screenshots
of the identical page/tab: **identical**, including `projects` still
showing `12/2024 - present` for the ongoing project (the `isWorking` fix
from the prior node — correctly preserved, not reverted, since this node
only moved code, changed no values).

## Acceptance
| # | Criterion | Evidence |
|---|---|---|
| 1 | `utils/ResumeAdapter.ts` exists, one class, one method per entity, prototype fields | File created; note the deviation above — instance fields, not `static`, per real lint enforcement |
| 2 | No static method references `this` (or: the equivalent safety for the actual instance-field design) | N/A in the literal "static" sense after the deviation — the arrow-field design makes the original failure mode structurally impossible; verified live via 0 console errors on every bare-callback call site |
| 3 | `ResumeAdapter` not re-exported from `utils/index.ts` | `utils/index.ts` diff — untouched, still the same 8 `export *` lines as the `resume-data-models` node left it |
| 4 | All 7 `models/*.ts` files have no local prototype/adapt export left | Diff table; each file now only exports its class |
| 5 | `stores/resume.ts` calls `resumeAdapter.toX(...)` | File diff cited |
| 6 | Build/lint clean | Cited above, including the real error caught and fixed |
| 7 | CDP renders pixel-identical to `resume-data-models` | 2 screenshots compared, 0 console errors, all text assertions match |

## Noticed, not done
- The plan file (`/Users/_david/.claude/plans/ph-n-function-adap-c-concurrent-pretzel.md`)
  still describes the original `static`-method design — not updated,
  since plan files are the operator's own record of what was approved,
  not something this worker should silently rewrite after the fact
  (this evidence note is the correct place to record the deviation and
  why).

## Seal gate
None — no outward-facing action (no commit/push/PR) in this implementer
pass.
