# 2026-09-07 - cleanup-pdf-only-types

Worker: implementer
Version: 0.1.0
Node: `cleanup-pdf-only-types` (new — no existing node matched, appended per `pick_next.md`'s "No diagram matches yet" failure branch)
Task: `/todo #142` — "Cleanup unused resume-document PDF-only types (Item/Reference/Certificate/Award)"

## Hub bytes before: ~83191
Approximate — `/hub-tokens`'s script was run after the diagram row + type
diff were already written, not strictly before per `pick_next.md` step 7.
Retroactively estimated by subtracting the new row's ~1856-byte length
from the measured current total (85048). Procedural gap in measurement
order only, doesn't affect the actual code change below.

## Prior context (from issue #142)
Flagged during `resume-data-models` (2026-08-16, see `evidence/implementer/
2026-08-16/resume-data-models-diff.md`'s "Noticed, not done") as dead-ish
weight, explicitly deferred: "Needs a dedicated PDF-generation review pass
(not a drive-by deletion) to confirm whether `createPDF.ts` itself still
needs all 4 shapes, or whether some can be trimmed/consolidated."

## Review (this pass)
1. `grep -rn "\bItem\b\|\bReference\b\|\bCertificate\b\|\bAward\b"` across
   the whole repo (excluding `node_modules`/`.nuxt`/`agent-hub`): the ONLY
   references anywhere are the interface declarations themselves
   (`types/resume-document.ts`) and their use in `server/utils/
   createPDF.ts`. Confirms the issue's claim — no client-side code uses
   any of the 4 types.
2. Within `createPDF.ts`, all 4 types ARE still actively used as parameter
   types (`_layoutItem(props: Item)`, `renderReferences(list: Reference[])`,
   `renderCertificates(list: Certificate[])`, `renderAwards(list:
   Award[])`) — none of the 4 interfaces themselves are dead, so this is
   NOT a delete-the-type situation for any of them.
3. Field-by-field check of what `createPDF.ts` actually destructures/reads
   from each type:
   - `Item`: `title, subTitle, startDate, endDate, isCurrent, description,
     skills` — every field used. No trim.
   - `Reference`: `fullName, phone, company, position` — every field used.
     No trim.
   - `Certificate`: `renderCertificates` destructures `organization, name,
     startDate, endDate, description, isNoExpiration` — `link`/`images`
     declared on the type but never destructured/read anywhere.
   - `Award`: `renderAwards` destructures `organization, name, issueDate,
     description` — `link`/`images` declared but never read anywhere
     either.
4. Confirmed via `grep -n "\.link\b\|\.images\b" server/utils/createPDF.ts`:
   0 matches — independently confirms step 3's `link`/`images` findings
   for both types.

## Decision
Trim exactly the 4 dead fields (`Certificate.link`, `Certificate.images`,
`Award.link`, `Award.images`) — not a broader consolidation/refactor of
the render logic (that would exceed `SmallestDiff`, and the issue itself
calls this "low priority... hygiene", not a redesign). `Item`/`Reference`
left untouched since 100% of their fields are used.

## Files
| File | Why |
|---|---|
| `types/resume-document.ts` | removed `link?`/`images?` from `Certificate` and `Award` |
| `agent-hub/haven/diagrams/dev-loop.prime-mermaid.md` | new node appended at end (`AppendOnly`) |

## Command
```
npm run build
npm run lint
```
(from `doctrine/MEMORY.md`, repo root)

## Output
`npm run build`: exit 0, `✨ Build complete!` (cold cache, `rm -rf
node_modules/.cache .nuxt .output` first), same pre-existing darwin-arm64
`sharp` warning (`[@nuxt/image] WARN sharp binaries for darwin-arm64
cannot be found...`), not new.

`npm run lint`:
```
✖ 30 problems (0 errors, 30 warnings)
```
Exact match to the current baseline (set by `blog-api-runtime-validation`
earlier this session, itself 2 fewer than the older 32-warning baseline
for unrelated reasons already documented on that node).

## Browser verification
N/A — pure type-level change. TS interfaces are erased at compile time
(`typescript.typeCheck: false` in `nuxt.config.ts` — `npm run build`
doesn't even type-check, let alone emit runtime code from an interface),
so this cannot have a visual/behavior effect. No CDP check applicable.
A real end-to-end PDF-generation smoke test wasn't possible in this dev
environment either: `PUPPETEER_EXECUTABLE_PATH` is unset in this repo's
local `.env` (required in production per root `CLAUDE.md`'s env var
table) — a pre-existing condition, unrelated to this change.

## Acceptance
| Criterion | Evidence |
|---|---|
| Dedicated review pass done first, not a drive-by deletion | Review steps 1-4 above, each with a citeable `grep` command + result |
| Confirms whether `createPDF.ts` still needs all 4 shapes | Yes — all 4 are still used as parameter types, none deleted |
| Confirms whether some fields can be trimmed | Yes — `Certificate.link`/`.images` and `Award.link`/`.images`, both independently confirmed unused via `grep` |
| Build clean | `npm run build` exit 0, `✨ Build complete!`, cited above verbatim |
| Lint clean | `✖ 30 problems (0 errors, 30 warnings)`, cited above verbatim |

## Noticed, not done
- The issue's "How" section also floats "consolidated" as a possibility
  (e.g. unifying `Certificate`/`Award` into the same shape as `Item` since
  both get converted to `Item` before rendering) — deliberately NOT done
  here. That would touch `renderCertificates`/`renderAwards`'s actual
  logic (a real behavior-adjacent refactor, not a pure type trim) and
  the issue marks this whole cleanup "low priority... hygiene", not
  asking for a render-logic redesign. Left as a possible future issue if
  wanted.
- `GeneralInformation.personalSkills: any[]` and `Project.images: any[]`
  (in the same file) use `any` and would trip `@typescript-eslint/
  no-explicit-any` if lint's `any` rule applied there — already flagged
  separately in the existing lint warnings list (`types/resume-document.ts`
  44:19, 78:11), unrelated to issue #142's scope, not touched.

## Seal gate
None — no outward-facing action taken (no commit/push/PR/delete).
