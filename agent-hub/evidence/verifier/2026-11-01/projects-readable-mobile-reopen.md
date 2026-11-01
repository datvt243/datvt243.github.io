# 2026-11-01 - projects-readable-mobile (verifier: REOPEN)

- Worker: verifier · Version: 0.1.0
- Node: `projects-readable-mobile` (#297, UI part only), branch `feature/297` off `staging` 4f4d858, uncommitted
- Note graded: `evidence/implementer/2026-11-01/projects-readable-mobile-diff.md`

## Verdict: REOPEN

## Missing
- **Browser output is elided (step 5).** Three lines of the verbatim
  browser block end in `,...}`: `390px after toggle click`,
  `390px after Enter` and `1440px after toggle click`. Step 5 treats `...`
  as hidden output, and the `script-csp-report-only` SEAL already warned
  that later notes must paste the full line. This node is not outward-facing,
  so the Re-run scope rule says REOPEN, not a verifier re-run.
  Smallest fix: paste those 3 lines in full (`labels` and `descs` included)
  from the saved `check.mjs` output. If it wasn't saved, re-run `check.mjs`
  against the prod build with the :4199 mock (never the real backend) and
  paste the whole block.
- **Criterion 1 names `scrollHeight <= clientHeight`, but the note only
  shows `"clipped":false`.** Quote the expression `check.mjs` uses to
  compute `clipped` (or print the raw `scrollHeight`/`clientHeight`), so
  the evidence matches the criterion as written.

## Cited
| Criterion | Result |
|---|---|
| 1 full description | Partly. `"clamp":"none"` on all 3 descriptions at 390 and 1440, and the SSR grep has no `line-clamp-3`. `clipped` isn't defined (see Missing) |
| 2 no raw slug | PASS. `labels ["Project 1","Project 2","Project 3"]` at both widths. SSR grep shows no `_aihr` |
| 3 mobile collapsed + toggle + a11y + filter | PASS on the fields that are shown. `390px loaded` `ariaExpanded:"false"`, `listDisplay:"none"`, `firstArticleTop:147`. Click gives `"true"`/`block`/611. Enter gives `"false"`/`none`/147. Picking a tech gives `labels:["Project 1"]`. The rest of those lines is elided (see Missing) |
| 4 desktop unchanged | PASS. `1440px loaded` `ariaExpanded:"true"`, `listDisplay:"block"`. The toggle line is elided (see Missing) |
| 5 build + lint + typecheck + test, no console errors | PASS. `lint=0`, `typecheck=0` with `grep -c "error TS"` = 0 (the accepted summary precedent), `Tests  14 passed (14)`, `◆ ✨ Build complete in 13.8s!`, `console errors/warnings: []`. Mock env, `grep -c onrender srv.log` = 0 |
| comments per code-comments.md | PASS. One WHY block in `Folder.vue`, no WHAT comments or issue refs |
| 7b Supersedes/Still open | PASS. `## Supersedes: none`. `## Still open` keeps #297 open (`Refs #297`, not `Closes`). No other #297 row is on the active diagram or in the archive |

## Forbidden states / seal gate / proportionality
- Forbidden states: none hit. The node row exists (IN_PROGRESS), the note
  exists with real output, no code is in `haven/`, and the diagram matches.
- Seal gate: `none`. Nothing was committed or pushed, and the real backend
  wasn't called.
- Proportionality: PASS. 3 theme files and 1 opt-in prop that defaults to
  `false`, so `/github` is unchanged. Showing the full text instead of a
  toggle is the smaller option and fits the operator's scope.
- Not blocking, record on the next pass: `/vi/projects` and light mode were
  not checked (the note says so). The untracked `review/` and
  `.playwright-mcp/` folders aren't in the note's diff table. Keep them
  out of the commit unless they belong to this node.

## Isolation proof
Spawned as a separate verifier subagent. The task string starts "You are
the VERIFIER pass of this repo's agent-hub, run from `/todo` as a separate
subagent with a clean context (NeverVerifyOwnWork)". It names node
`projects-readable-mobile` and issue #297, and gives the operator's scope
(Refs, not Closes). That string differs from the implementer's task. This
context didn't write the diff and didn't open it. It read only the note,
the diagram row and the archive grep.

## Re-run
none. I audited the note only, the default. The REOPEN reason is elided
output on a node that isn't outward-facing, so the Re-run scope rule says
REOPEN, not re-run.

## PM status
Not updated (REOPEN). Row `projects-readable-mobile` stays IN_PROGRESS (RatchetOnly).
