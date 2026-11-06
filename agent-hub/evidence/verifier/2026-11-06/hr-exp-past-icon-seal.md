# 2026-11-06 - hr-exp-past-icon (verdict)

- Worker: verifier · Version: 0.1.0
- Node: `hr-exp-past-icon` (follow-up of issue #390, branch `feature/390`, uncommitted working tree)
- Note judged: `evidence/implementer/2026-11-06/hr-exp-past-icon-diff.md`
- Verdict: **SEAL** · New PM status: SEALED (archived)

## Isolation proof
This is a separate Agent-tool subagent with a fresh context. Its task string began "You are running `/worker verifier` for the agent-hub in the repo /Users/_david/Workspace/Project/resume/datvt243.github.io (branch `feature/390`, already checked out — do not switch branches, do not commit/push)" and named the note `agent-hub/evidence/implementer/2026-11-06/hr-exp-past-icon-diff.md` and the node `hr-exp-past-icon`. The pass was paused by a usage limit and resumed by a coordinator message ("The usage limit has reset — continue the verifier pass for `hr-exp-past-icon`"). The implementer ran in the parent session. I did not write this diff.

## Re-run
none. Audit only, per "Re-run scope": the node is not outward-facing and not a release gate. I did not re-run build, lint, typecheck, test or the browser script. Read-only checks:
- `stat` mtimes: `Hr.vue` 00:28:34, `.output/nitro.json` 00:35:01, `hr-dark.png` 00:35:12, `hr-light.png` 00:35:13. The build and screenshots are newer than the code edit.
- `git diff --numstat -- themes/` → `1 0 themes/portfolio-dev/pages/resumeObject/Hr.vue`. That matches the "+1 line" claim. Counts only; I did not read the diff.
- I viewed both screenshots myself (Read on the PNGs).

## Command check (step 4)
`npm test` · `npm run lint` · `npx nuxi typecheck` · `npm run build`. All four match the `doctrine/MEMORY.md` table. The Typecheck row has no `baseline:`.

## Output check (step 5)
`Tests  27 passed (27)`. Lint printed `> eslint .` with no findings. `typecheck exit=0`. `◆ ✨ Build complete in 16.2s!` (18.7s for the mock-env build). This uses the same excerpt-plus-exit format as earlier seals (`skill-icons-390-seal.md`, `pdf-filename-lang-seal.md`). Nothing is marked as cut.

## Acceptance
| Criterion (from the node) | Status | Evidence |
|---|---|---|
| Every non-career-break experience in the HR view shows a `heroicons:briefcase` title icon | met | The note's per-`h3.hr-title` readout lists briefcase on all 3 job rows: SAPUI5 (current), Vue.js and Earlier Experience (past, "was none"). In `hr-dark.png` and `hr-light.png`, all 3 job titles show a briefcase glyph left of the title |
| Current = `text-theme-accent`, past = `text-theme-muted` | met | Readout: `briefcase text-theme-accent (current)`, and `briefcase text-theme-muted` on both past rows. In the screenshots, the SAPUI5 briefcase is orange (accent) and the two past ones are gray, in both themes |
| Career breaks unchanged | met | Readout: both breaks show `pause-circle text-theme-muted`. Screenshots show the gray pause icon on both "Nghỉ việc tạm thời" rows |
| `.hr-title-icon` count = number of experiences | met | 5/5 experience rows have the icon (3 jobs + 2 breaks); Education is out of scope and listed separately |
| Checked in browser, dark + light | met | Headless puppeteer-core run against a production build on :3390 with `NODE_API`/`NUXT_PUBLIC_NODE_API` set to the mock :4390 at build and run time; `onrender` count 0 in the server log. Screenshot paths are concrete and I viewed both |
| build + lint + typecheck + `npm test` clean | met | Output check above |
| Comments per code-comments.md | met | "no comment added" |
| `## Supersedes` / `## Still open` for same-issue open rows | met | Both `none`. The only other #390 row, `skill-icons-390`, is already SEALED |

## Forbidden states (step 7)
- `ADHOC_WORK`: no. The node existed on the diagram before the work.
- `NO_EVIDENCE`: no. There is an implementer note.
- `EDIT_UNVERIFIED`: no. Every claim has output or a screenshot behind it.
- `CODE_IN_HAVEN`: no. Only diagram rows were changed.
- `DIAGRAM_DRIFT`: no. The row was `sealed_pending_verifier` and is now SEALED.

## Seal gate (step 8)
Nothing was committed or pushed, and there was no outward-facing action, so no approval was needed.

## Proportionality (step 9)
The diff is 1 added line in 1 file, as the node asks. Education icons and the dev-view skill logos are only logged under "Noticed, not done" and were not changed.

## PM update (step 11)
- The full row is appended to `haven/diagrams/dev-loop-archive.md` as SEALED.
- The active row is replaced with a pointer to this note.
- The active list then had 21 pointer rows. I removed the oldest one, `script-csp-enforce` (sealed 2026-11-04T17:58:00Z in `worker-runs.log`, the earliest of the rows). Its full row is already in the archive.
- Supersedes: none.
