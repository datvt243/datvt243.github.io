# 2026-08-16 — resume-adapter-class (plan)

- Worker: implementer
- Version: 0.1.0
- Node: `haven/diagrams/dev-loop.prime-mermaid.md` → `resume-adapter-class`
- Issue: #71, branch `feature/71`
- Task (verbatim, paraphrased from Vietnamese): "Can the adapter functions
  be turned into a class in `/utils`? Just asking, no need to implement
  yet." — went through Plan Mode: 2 clarifying questions
  (AskUserQuestion) resolved to (1) ONE consolidated `ResumeAdapter`
  class, not 7 separate adapter classes; (2) placed directly in
  `/utils`, accepting the domain-awareness tradeoff. Plan approved via
  `ExitPlanMode`, user said "tiếp tục" (continue) to execute it.

## Current state (from the just-sealed `resume-data-models` node)
Each `models/<Entity>.ts` file (`Experience`, `Education`, `Skill`,
`Language`, `Project`, `Hero`, `SocialMedia`) currently holds: the model
class, a private `const <entity>Prototype = new <Entity>Model()`, and a
standalone exported `adapt<Entity>(raw)` function that clones the
prototype and fills in real values. `stores/resume.ts` imports all 7
`adapt*` functions directly from `@/models`.

## Plan (per the approved plan file, `/Users/_david/.claude/plans/ph-n-function-adap-c-concurrent-pretzel.md`)
1. New `utils/ResumeAdapter.ts`: a single `ResumeAdapter` class with 7
   `static` methods (`toExperience`, `toEducation`, `toSkill`,
   `toLanguage`, `toProject`, `toHero`, `toSocialMedia` — same signatures
   as the functions they replace) and 7 `private static readonly`
   prototype fields (moved out of the model files).
2. Strip the local prototype const + `adapt*` export from all 7
   `models/*.ts` files — each shrinks to just the class body (fields +
   computed getters, unchanged, since those still use
   `convertNumberToDate`/`extractListItems`/`removeHtmlTags` from
   `@/utils` exactly as before).
3. `stores/resume.ts`: swap the `@/models` adapter-function import for
   `import { ResumeAdapter } from '@/utils/ResumeAdapter'`, update all 7
   getter call sites from `adaptX(...)`/`.map(adaptX)` to
   `ResumeAdapter.toX(...)`/`.map(ResumeAdapter.toX)`.

### Two pitfalls the plan calls out explicitly (not just "move code")
1. **No `this` inside static methods.** Store getters pass adapters as
   bare `.map()` callbacks (e.g. `experiences.map(ResumeAdapter.toExperience)`)
   — with no receiver at the call site, `this` would be `undefined`
   inside the static method, so it must reference the prototype via the
   class name (`ResumeAdapter.experiencePrototype`), never `this`.
2. **No circular import via the `utils/` barrel.** `ResumeAdapter.ts`
   imports `@/models`; models import shared helpers via the `@/utils`
   barrel. Re-exporting `ResumeAdapter` from `utils/index.ts` would create
   `utils/index.ts → ResumeAdapter.ts → models/index.ts → Experience.ts →
   '@/utils' → utils/index.ts`. Fix: do NOT add `ResumeAdapter` to
   `utils/index.ts`'s barrel; import it directly
   (`@/utils/ResumeAdapter`) at its one call site (`stores/resume.ts`).

## Acceptance criteria
| # | Criterion |
|---|---|
| 1 | `utils/ResumeAdapter.ts` exists, one class, 7 static methods, 7 private static readonly prototype fields |
| 2 | No static method references `this` — verified by grep, and by exercising the exact bare-`.map()`-callback call sites live in the browser (the plan's stated reason this matters — a `this`-binding bug would only surface at runtime, not at the type level) |
| 3 | `ResumeAdapter` is NOT re-exported from `utils/index.ts` (avoids the stated circular-import risk) |
| 4 | All 7 `models/*.ts` files no longer have a local prototype const or `adapt*` export — only the class body remains |
| 5 | `stores/resume.ts` calls `ResumeAdapter.toX(...)`, no more `adaptX` imports from `@/models` |
| 6 | `npm run build` clean, `npm run lint` clean |
| 7 | Chrome CDP: `/` (all 5 tabs) + `/projects` render **pixel-identical** to the `resume-data-models` node's already-verified screenshots — this is a pure move, zero new behavior (unlike the prior node, no intentional behavior changes to flag) |

## Files
- `utils/ResumeAdapter.ts` (new)
- `models/Experience.ts`, `Education.ts`, `Skill.ts`, `Language.ts`,
  `Project.ts`, `Hero.ts`, `SocialMedia.ts`
- `stores/resume.ts`

## Blocked by
None.
