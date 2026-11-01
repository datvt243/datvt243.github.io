# 2026-11-01 - projects-readable-mobile (verifier: SEAL, pass 2)

- Worker: verifier · Version: 0.1.0
- Node: `projects-readable-mobile` (#297, UI part only), branch `feature/297` off `staging` 4f4d858, uncommitted
- Note graded: `evidence/implementer/2026-11-01/projects-readable-mobile-diff.md`, including `## Correction (REOPEN round 1, 2026-11-01)`
- Previous verdict: `evidence/verifier/2026-11-01/projects-readable-mobile-reopen.md` (kept as written)

## Verdict: SEAL

## REOPEN items
| Item | Result |
|---|---|
| Elided browser lines (step 5) | FIXED. The correction pastes the full `check.mjs` output (`exit=0`). All 6 state lines are complete, `labels` and `descs` included, with no `...` left. The re-run used the same mock-env `.output` build, a fresh profile (`prof/` deleted), and the server on :4188 with the :4199 mock. `onrender=0` after the run |
| Criterion 1 `scrollHeight <= clientHeight` | FIXED. The note quotes the `check.mjs` expression verbatim: `clipped: p.scrollHeight > p.clientHeight`. Raw values now print, and `sh == ch` everywhere, e.g. SimpleMDG at 390px `"sh":120,"ch":120`, 6 lines |

## Cited
| Criterion | Result |
|---|---|
| 1 full description | PASS. `"clamp":"none"` and `sh == ch` for every description at 390px (120/120, 60/60, 80/80) and 1440px (80/80, 40/40, 60/60), in every state. The SSR grep has no `line-clamp-3` |
| 2 no raw slug | PASS. `labels ["Project 1","Project 2","Project 3"]` at both widths. The SSR grep has no `_aihr` |
| 3 mobile collapsed + toggle + a11y + filter | PASS. `390px loaded` shows `ariaExpanded:"false"`, `listDisplay:"none"`, `firstArticleTop:147`. A click gives `"true"`/`block`/611, Enter gives `"false"`/`none`/147, and picking a tech gives `labels:["Project 1"]` |
| 4 desktop unchanged | PASS. `1440px loaded` shows `"true"`/`block`/111. A toggle click gives `"false"`/`none`, so the toggle still works on desktop |
| 5 build + lint + typecheck + test, no console errors | PASS (unchanged, no code changed since). `lint=0`, `typecheck=0` with `grep -c "error TS"` = 0, `Tests  14 passed (14)`, `◆ ✨ Build complete in 13.8s!`, `console errors/warnings: []` on both runs |
| comments per code-comments.md | PASS. One WHY block in `Folder.vue`, with no WHAT comments or issue refs |
| 7b Supersedes/Still open | PASS. `## Supersedes: none`. `## Still open` keeps #297 open with `Refs #297`, not `Closes` |

## Forbidden states / seal gate / proportionality
- Forbidden states: none hit. The node row existed, the note has real output, no code is in `haven/`, and the diagram now matches (SEALED, below).
- Seal gate: `none`. Nothing was committed or pushed, and the real backend was not called (`onrender=0`).
- Proportionality: PASS. It touches 3 theme files and adds 1 opt-in prop that defaults to `false`. The correction changed no code.
- Not blocking: `/vi/projects` and light mode are still unchecked (listed in Noticed, not done). Leave the untracked `review/` and `.playwright-mcp/` folders out of the commit. They existed before this node.

## Isolation proof
Spawned as a separate verifier subagent for the re-verify after REOPEN round 1. The task string starts "You are the VERIFIER pass of this repo's agent-hub, run from `/todo` as a separate subagent with a clean context (NeverVerifyOwnWork)". It says "This is a re-verify after REOPEN round 1" and names the reopen note path. That string differs from the implementer's task. This context didn't write the diff and didn't open it. It read only the two notes and the diagram/archive rows.

## Re-run
none. I audited the note only, the default. The corrected output is verbatim and complete, the commands match `doctrine/MEMORY.md`, and the node isn't outward-facing.

## PM status
Updated. The row `projects-readable-mobile` went from IN_PROGRESS to SEALED in place as an archive pointer. The full row was appended to `haven/diagrams/dev-loop-archive.md`. The oldest pointer (`ci-typecheck-vitest`, whose full row is already archived) was removed to keep 20 pointer rows.
