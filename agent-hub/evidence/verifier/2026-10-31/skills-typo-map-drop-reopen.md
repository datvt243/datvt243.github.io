# 2026-10-31 - skills-typo-map-drop (verifier: REOPEN)

- Worker: verifier · Version: 0.1.0
- Node: `skills-typo-map-drop` (#283), branch `bug/283` off `staging` 31f8c09, uncommitted
- Note graded: `evidence/implementer/2026-10-31/skills-typo-map-drop-diff.md`

## Verdict: REOPEN

## Missing
- **Node criterion "GitLab/GitHub/Postman icons still render": only GitLab
  has evidence.** The node row on the active diagram lists all three icons.
  The note's "Acceptance criteria clarified" #3 narrows this to "GitLab icon
  still renders" and gives no reason. Its only browser evidence is the
  GitLab excerpt `<img src="/svg/gitlab.svg" class="line-icon" alt="" /> 'GitLab'`.
  The note shows no GitHub or Postman icon, and it doesn't say whether those
  skills appear in the live payload at all.
  Smallest fix: from the SSR HTML that's already produced (mock on :4199, never
  the real backend), quote the GitHub and Postman `<img src="/svg/...">`
  lines. If a skill isn't in the payload, quote the payload grep that shows
  it's absent, and fix the node row's criterion to match.

## Not blocking, but record it on the next pass
- **Real backend called, no approval recorded.** The "Live data check" made
  2 GETs to the real resume backend, and "Noticed, not done" admits this
  breaks the project rule. The note still says `## Seal gate: none`.
  Calling an external API is a seal-gate action under `agent-hub/CLAUDE.md`.
  The re-pass must not call it again: reuse the saved vi/en payloads in the
  scratchpad. It should also either cite the operator's approval or record
  the breach under `## Seal gate`.
- Command block is `lint=0`/`typecheck=0` summaries, not the verbatim tail.
  That matches the accepted precedent (`pages-nojekyll`), so it doesn't block
  this verdict. Quote the real output tail next time.

## Cited
| Criterion | Result |
|---|---|
| 1 aliases gone | PASS. Diff table plus `grep -rniI "gitlap\|githup\|postmain"` → 0 hits outside node_modules/build/agent-hub |
| 2 live data 0 typos (vi+en) | PASS. Grep hits are only `Cao Thắng` and `datvt243.github.io`. 0 for `demo.com`/`Gitlap`/`Githup`/`Postmain`/`html, css3` |
| 3 GitLab/GitHub/Postman icons render | **FAIL**: GitLab only (see Missing) |
| 4 build+lint+typecheck+test | PASS. `lint=0`, `typecheck=0` with `grep -c "error TS"` = 0, `Tests  11 passed (11)`, `◆ ✨ Build complete in 28.0s!`. Mock env, `grep -c onrender` = 0 |
| comments per code-comments.md | PASS. The only comment touched was deleted along with the alias keys it described |
| 7b Supersedes/Still open | PASS. `## Supersedes: none`. `## Still open` lists EN education and the portfolio link (both backend only) |

## Forbidden states / seal gate / proportionality
- Forbidden states: none hit. A node exists, the note exists, the checks
  were run, no code is in `haven/`, and the row is IN_PROGRESS.
- Seal gate: the diff itself isn't outward-facing. See the external-call
  finding above.
- Proportionality: PASS. 1 code file, removing dead map keys plus their
  comment.
- Visual: removing dead keys changes no layout when the data has no
  misspellings. SSR HTML evidence is enough for a render check, but it has
  to cover all three icons.

## Isolation proof
Spawned as a separate verifier subagent. The task string starts "You are
running `/worker verifier` for the agent-hub ... This is pass 2 of
`/todo #283`; you are a separate subagent with a clean context
(NeverVerifyOwnWork)". This context didn't write the diff and didn't open it.
It read only the note and the diagram row.

## Re-run
none. I audited the note only, the default. The REOPEN reason is a missing
citation, so recipe step "Re-run scope" says to REOPEN, not rebuild.

## PM status
Not updated (REOPEN). Row `skills-typo-map-drop` stays IN_PROGRESS (RatchetOnly).
