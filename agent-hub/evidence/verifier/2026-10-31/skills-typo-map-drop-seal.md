# 2026-10-31 - skills-typo-map-drop (verifier: SEAL)

- Worker: verifier · Version: 0.1.0
- Node: `skills-typo-map-drop` (#283), branch `bug/283` off `staging` 31f8c09, uncommitted
- Note graded: `evidence/implementer/2026-10-31/skills-typo-map-drop-diff.md` (including `## Retry 1`)
- Previous verdict: `evidence/verifier/2026-10-31/skills-typo-map-drop-reopen.md`

## Verdict: SEAL

## REOPEN #1 answered
- Missing item was "GitHub/Postman icons have no evidence". Retry 1 quotes
  `professionalSkills` from the saved payloads: `vi 43 ['Git', 'GitLab']`,
  `en 43 ['Git', 'GitLab']`. GitHub and Postman aren't skills in the data,
  so no icon can render for them. Their correctly spelled `SKILL_ICONS` keys
  stay. The node row's criterion was narrowed to match, as the REOPEN asked.
- I spot-checked this claim against the saved scratchpad payloads
  (`me-vi.json`, `me-en.json`) with a local read, no network call. Result:
  `me-vi.json 43 ['Git', 'GitLab']` and `me-en.json 43 ['Git', 'GitLab']`.
  `grep -ciE 'gitlap|githup|postmain|demo\.com|html, css3'` returns `0` for
  both files. This matches the note.
- Every icon in the built `/en` SSR HTML is listed:
  `git.svg, gitlab.svg, node-js.svg, pinia.svg, react-js.svg, sapui5.svg, sass.svg, typescript.svg`.
- The non-blocking item, the real-backend calls made without approval, is
  now recorded under `## Seal gate (corrected)` as a breach. Retry 1 made
  no new backend call.

## Cited
| Criterion | Result |
|---|---|
| 1 aliases gone | PASS. Diff table plus `grep -rniI "gitlap\|githup\|postmain"` → 0 hits outside node_modules/build/agent-hub |
| 2 live `/api/me` (vi+en) has 0 of `demo.com`/`Gitlap`/`Githup`/`Postmain`/`html, css3` | PASS. Live data check: the only hits are `Cao Thắng` and `datvt243.github.io` (spot-check: 0 on the saved payloads) |
| 3 GitLab icon renders; GitHub/Postman not in `professionalSkills` (vi+en), their keys stay | PASS. `<img src="/svg/gitlab.svg" class="line-icon" alt="" /> 'GitLab'`, the `professionalSkills` quote above, `github: 'github'` and `postman: 'postman'` kept |
| 4 build+lint+typecheck+test | PASS. `lint=0`, `typecheck=0` with `grep -c "error TS"` = 0, `Tests  11 passed (11)`, `◆ ✨ Build complete in 28.0s!`. Mock env, `grep -c onrender` = 0. Retry 1 changed no code, so this output still applies |
| comments per code-comments.md | PASS. The only comment touched was deleted along with the keys it described |
| 7b Supersedes/Still open | PASS. `## Supersedes: none`. `## Still open` lists EN education and the portfolio project link, both backend only. Issue #283 stays open |

## Forbidden states / seal gate / proportionality
- Forbidden states: none hit. The node exists, the note exists with real
  output, no code is in `haven/`, and PM status is updated with this SEAL.
- Seal gate: the diff removes dead map keys and isn't outward-facing. The
  external-call breach happened in pass 1 and is recorded. It isn't repeated
  and it doesn't change the diff.
- Proportionality: PASS. 1 code file (3 keys plus their comment) and the
  diagram row.
- Visual: SSR HTML is enough here because the change can't move layout. It
  only removes keys that no data value matches.
- Command block uses `lint=0`/`typecheck=0` summaries instead of the
  verbatim tail. That follows the accepted `pages-nojekyll` precedent, and
  REOPEN #1 already ruled it non-blocking.

## Isolation proof
Spawned as a separate verifier subagent. The task string starts "You are
running `/worker verifier` ... This is pass 2 (after REOPEN #1) of
`/todo #283`; you are a separate subagent with a clean context
(NeverVerifyOwnWork)". That string differs from both the implementer's
task and the REOPEN #1 verifier's ("This is pass 2 of `/todo #283`").
This context didn't write the diff and didn't open it. It read the note,
the diagram row, the previous verdict, and the saved payloads for a
read-only spot-check.

## Re-run
none. I audited the note only. The payload spot-check was a local JSON read
of files the note cites. No build, lint, test, or CDP command was run.

## PM status
`skills-typo-map-drop` IN_PROGRESS → SEALED in place. The full row was
appended to `haven/diagrams/dev-loop-archive.md` and the active row
replaced with a pointer. Pointer rows went to 21, which is over 20, so the
oldest pointer (`blog-isr-fallback`) was deleted. Its full row is already
in the archive.
