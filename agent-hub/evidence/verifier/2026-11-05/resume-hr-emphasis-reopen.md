# 2026-11-05 - resume-hr-emphasis (verdict)

- Worker: verifier · Version: 0.1.0
- Node: `resume-hr-emphasis` (#397 follow-up, branch `feature/397`, uncommitted working tree)
- Note judged: `evidence/implementer/2026-11-05/resume-hr-emphasis-diff.md`
- Verdict: **REOPEN**

## Isolation proof
Separate Agent-tool subagent, spawned with the task string "You are the VERIFIER worker of the agent-hub in /Users/_david/Workspace/Project/resume/datvt243.github.io (`/worker verifier` semantics; fresh context, separate from the implementer) ... Node `resume-hr-emphasis` ... Implementer evidence: `agent-hub/evidence/implementer/2026-11-05/resume-hr-emphasis-diff.md`". Blank context; I did not write this diff and did not open it.

## Re-run
none. Audit-only. The gap below is evidence the note does not have, and the recipe says to REOPEN instead of re-running to fill a note's holes. The user-facing exception covers confirming evidence that already exists, not producing evidence the implementer skipped. Same reasoning as `hero-about-me-intro-reopen.md`.

## Criteria
| Criterion (node row) | Verdict | Cited / missing |
|---|---|---|
| (1) Section titles larger/bolder than before, accent underline (font-size > 13px, border-bottom ≥ 2px accent) | met | Dark 1280 on the final build: `h2.hr-heading` `20px / 800 / border-bottom 2px rgb(251, 146, 60)`. Light accent `2px rgb(194, 65, 12)` from the earlier build. Diff row says the underline rule did not change between builds, only the size did. |
| (2) Job titles font-size ≥ 18px, weight ≥ 700 | met | `h3.hr-title` `18px / 700`, color `rgb(226, 232, 240)`, body `li` 14px (dark 1280, final build). |
| (3) Dark + light, 1280 + 375, no horizontal overflow | **missing** | Dark 1280 (1265 = 1265) and dark 375 (360 = 360) are cited on the final build. Light is not proven on the final code. Light 1280 ran on an earlier build ("heading at 18px") with `visibilityState: "hidden"`. Light 375 was never run: the note says under Noticed, not done: "Light mode at 375 not re-screenshotted after the 20px bump". The final build has the larger 20px/800 heading, so the light 375 overflow and wrapping result can't be carried over from dark. |
| build + lint + typecheck + test | met | `build=0  ◆ ✨ Build complete in 14.6s!`, `lint=0`, `typecheck=0`, `Test Files  8 passed (8)` / `Tests  20 passed (20)`. Commands match `doctrine/MEMORY.md`. The exit-code format matches previously sealed notes. |
| Comments per code-comments.md | met (per note) | "no comments touched". |

## Missing (fix these, then re-submit)
1. Light mode on the FINAL build, with the Playwright tab selected and `visibilityState: "visible"` asserted:
   - At 1280: computed `h2.hr-heading` (font-size, weight, border-bottom, color), computed `h3.hr-title`, `scrollWidth`/`clientWidth`, and a screenshot path.
   - At 375: `scrollWidth`/`clientWidth`, and a screenshot path showing the headings and titles wrapping.
   Use the same mock-backend setup (`grep -c onrender` → 0).

## Forbidden states
none hit. The node row exists, the note is present, outputs are verbatim, there is no code in `haven/`, and the PM row is updated here.

## Seal gate
No outward action (no commit/push). OK.

## Proportionality
OK. One file, CSS-only emphasis on the heading and the entry-title `h3`s, which is what the operator asked for. Swapping the education school h3 onto `.hr-title` is the same role, so it's in scope.

## Supersedes
none. The note says `none`/`none`. `resume-hr-view` is already SEALED, and no other open row for #397 is on the active diagram.

## PM status
`resume-hr-emphasis`: stays IN_PROGRESS with a REOPEN pointer appended to the row. Not collapsed or archived.
