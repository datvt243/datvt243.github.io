# 2026-11-05 - pdf-project-sort (verdict: SEAL)
- Worker: verifier · Version 0.1.0
- Node: `pdf-project-sort` (`haven/diagrams/dev-loop.prime-mermaid.md`)
- Task: `/worker verifier` for #394 "feat(pdf): sort project trong PDF theo loại company → personal", branch `feature/394` (uncommitted working tree)
- Notes audited: `evidence/implementer/2026-11-05/pdf-project-sort-plan.md`, `evidence/implementer/2026-11-05/pdf-project-sort-diff.md`

## Isolation proof
Separate subagent spawned via the Agent tool with the task string "You are running `/worker verifier` for the datvt243.github.io agent-hub, as an isolated subagent (a different identity from the implementer that wrote the diff ...)". The implementer's task string is "`/todo #394` — feat(pdf): sort project trong PDF ...". This context did not write the diff (no edit to any code file in this session); it saw neither the implementer's reasoning nor its tool calls.

## Re-run
`full` — the spawning prompt explicitly required judging "from the commands you rerun yourself"; the note's output blocks are summary excerpts (last lines only). Re-ran, from repo root, on the working tree at verify time:

```
> nuxt-app@1.12.0 test
> vitest run

 RUN  v5.0.5 /Users/_david/Workspace/Project/resume/datvt243.github.io

 Test Files  10 passed (10)
      Tests  23 passed (23)
   Start at  23:57:56
   Duration  357ms (transform 46%, import 34%, tests 12%, worker 7%)

test_exit=0
```
```
> nuxt-app@1.12.0 lint
> eslint .

lint_exit=0
```
```
ℹ Nuxt Icon server bundle mode is set to local
[nuxt:icon] ✔ Nuxt Icon discovered local-installed 3 collections: fe, grommet-icons, heroicons
typecheck_exit=0
```
```
[nitro] ✔ You can preview this build using node .output/server/index.mjs
config 118ms · modules 391ms · app 405ms · types 383ms · client 2.80s · server 1.85s · nitro 9.93s
◆ ✨ Build complete in 15.8s!
build_exit=0
```
Mutation check not re-run (the note's one is cited; the test reads `entry-title` order from `pageRenderAts({ projects }).html` — `tests/sortProjects.test.ts:2,7` — so it exercises the real PDF render, not the comparator alone).

## Commands vs doctrine/MEMORY.md
`npm test` · `npm run lint` · `npx nuxi typecheck` · `npm run build` — all four match the table verbatim. Typecheck row has no `baseline:`; exit 0.

## Acceptance (one by one)
| Criterion | Verdict | Evidence |
|---|---|---|
| (1) company before personal, newest first per group | met | `tests/sortProjects.test.ts` within "Tests 23 passed (23)" (rerun above); call site confirmed `server/utils/createPDFAts.ts:192 .sort(compareProjects)` |
| (2) no `type` → personal | met | same test, `untyped-new` placed after both company entries (note's Acceptance row) — passes in rerun |
| (3) PDF cache not stale after deploy | met (code-reading, as the node's criterion specifies) | `server/api/generate-pdf.ts:18 const cache = new Map<string, { buffer: Uint8Array; filename: string; generatedAt: number }>()` — module-level, in-memory, reset on restart/deploy |
| (4) web `/projects` same order | met | `stores/resume.ts:44 return [...(projects \|\| [])].sort(compareProjects).map(toProject)` — same function as the PDF; build + typecheck clean |
| comments per code-comments.md | met | note's row: one `/** */` WHY on `compareProjects`, one JSDoc on `Project.type`; `grep '#[0-9]'` over the 4 touched source files → no issue refs |
| Browser check | n/a, accepted | live data has all 3 projects `type: personal` → new order == old date-desc order on `/projects`; no visible change to verify. The PDF side has no UI component changed |

## Forbidden states
- `ADHOC_WORK`: no — node exists on the active diagram.
- `NO_EVIDENCE`: no — plan + diff notes present.
- `EDIT_UNVERIFIED`: no — all four commands rerun clean here.
- `CODE_IN_HAVEN`: no — only the diagram row touched under `haven/`.
- `DIAGRAM_DRIFT`: no — node row present; updated to SEALED by this pass.

## Seal gate
No outward-facing action in the implementer pass (no commit/push), none in this pass.

## Proportionality
5 code files (1 new util + re-export, 2 call sites, 1 type addition) + 1 test — matches the node's 4 criteria; the issue's optional items (group sub-headings, linked company name) explicitly left out. `SmallestDiff` ok.

## Supersedes / Still open
Note: `## Supersedes: none`, active diagram has one `#394` row (this node). Ok.

## Verdict
SEAL — node `pdf-project-sort`. PM status → SEALED, row archived to `haven/diagrams/dev-loop-archive.md`; oldest pointer row (`hero-main-familiar-api`, full row already in the archive) dropped to keep ≤ 20 pointers.
