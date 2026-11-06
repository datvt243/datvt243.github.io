# 2026-11-06 - pdf-filename-lang (verdict: SEAL)
- Worker: verifier · Version 0.1.0
- Node: `pdf-filename-lang` (`haven/diagrams/dev-loop.prime-mermaid.md`)
- Task: `/worker verifier` for #409 (follow-up #393) "feat(pdf): thêm hậu tố ngôn ngữ VI/EN vào tên file PDF download", branch `feature/409` (uncommitted working tree)
- Notes audited: `evidence/implementer/2026-11-06/pdf-filename-lang-plan.md`, `evidence/implementer/2026-11-06/pdf-filename-lang-diff.md`

## Isolation proof
Separate subagent spawned via the Agent tool with the task string "You are running `/worker verifier` for the datvt243.github.io agent-hub, as an isolated subagent (a different identity from the implementer that wrote the diff ...)". The implementer's task string is "`/todo \"kiểm tra lại #393, filename đã có lang VI/EN ở cuối chưa? chưa có thì tự thêm vào\"`". This context did not write the diff (no edit to any code file in this session); it saw neither the implementer's reasoning nor its tool calls.

## Re-run
`full` — the spawning prompt explicitly required judging "from the commands you rerun yourself", and the note's build output had no captured exit code. Re-ran, from repo root, on the working tree at verify time:

```
 Test Files  10 passed (10)
      Tests  24 passed (24)
   Start at  00:03:18
   Duration  415ms (transform 52%, import 34%, tests 9%, worker 5%)

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
build_exit=0
[nitro] ✔ You can preview this build using node .output/server/index.mjs
config 181ms · modules 602ms · app 759ms · types 423ms · client 2.90s · server 2.03s · nitro 9.99s
◆ ✨ Build complete in 16.8s!
```
(build exit captured as `npm run build > log; echo build_exit=$?` — fixes the gap the implementer note flagged.)

## Commands vs doctrine/MEMORY.md
`npm test` · `npm run lint` · `npx nuxi typecheck` · `npm run build` — all four match the table verbatim. Typecheck row has no `baseline:`; exit 0.

## Acceptance (one by one)
| Criterion | Verdict | Evidence |
|---|---|---|
| (1) `-VI` for `vi`, `-EN` for `en`, both for `cvFileName` and `<Full-Name>-CV` fallback | met | `tests/createPDFAts.test.ts:8` `'Võ_Tấn_Đạt CV 2026'`→`Vo_Tan_Dat-CV-2026-VI`, `:13` fallback→`Vo-Tan-Dat-CV-VI`, `:19` `('Vo_Tan_Dat CV','en')`→`Vo_Tan_Dat-CV-EN`, `:20` `(undefined,'en')`→`Vo-Tan-Dat-CV-EN` — inside "Tests 24 passed (24)" (rerun above). Sole consumer `server/api/generate-pdf.ts:78,99` uses this `fileName` for `Content-Disposition` |
| (2) only `[A-Za-z0-9_-]` | met | `tests/createPDFAts.test.ts:9` `'a"b\r\nc/../d'`→`a-b-c-d-VI`; suffix comes from `lang`, normalized at `server/api/generate-pdf.ts:54` `query.lang === 'en' ? 'en' : 'vi'` → only `VI`/`EN` |
| (3) tests for both langs, build+lint+typecheck clean | met | both-lang cases above; all four commands exit 0 in the rerun |
| comments per code-comments.md | met | one WHY line added in the existing `/** */` block (`server/utils/createPDFAts.ts:279`), no issue ref; the only `#206` ref in the file (line 2) is pre-existing |
| Browser check | n/a, accepted | server-only header-value change, no UI component touched |

## Forbidden states
- `ADHOC_WORK`: no — node exists on the active diagram.
- `NO_EVIDENCE`: no — plan + diff notes present.
- `EDIT_UNVERIFIED`: no — all four commands rerun clean here, exit codes captured.
- `CODE_IN_HAVEN`: no — only the diagram row touched under `haven/`.
- `DIAGRAM_DRIFT`: no — node row present; updated to SEALED by this pass.

## Seal gate
No outward-facing action in the implementer pass (no commit/push), none in this pass.

## Proportionality
`git diff --stat`: 3 files, +15/−8 — one expression in `createPDFAts.ts` + one comment line, test expectations updated + one new `en` case, the diagram row. `SmallestDiff` ok.

## Supersedes / Still open
Note: `## Supersedes: none`; active diagram had one `#409` row (this node); `pdf-cv-filename` (#393) already SEALED. Ok.

## Verdict
SEAL — node `pdf-filename-lang`. PM status → SEALED, full row archived to `haven/diagrams/dev-loop-archive.md`; oldest pointer row (`skills-file-tabs`, 2026-11-02, full row already in the archive) dropped to keep ≤ 20 pointers.
