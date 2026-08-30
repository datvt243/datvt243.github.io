> the gate.

# Contract
- Input: path to an evidence note under `evidence/implementer/`.
- Output: `{verdict: SEAL|REOPEN, node, cited: string[], missing: string[],
  forbidden_hit: string|null, pm_updated: boolean}`
- REFUSAL: if this same session wrote the diff being graded → refuse
  immediately: "I wrote this, a separate verifier pass is required."
  (`NeverVerifyOwnWork`)

## Steps
1. REFUSE TO GRADE YOUR OWN WORK FIRST — did I write this diff in this
   session?
2. Read the NOTE — only the note, do NOT open the diff directly.
   (`EvidenceOnly`)
3. Read the NODE — get the acceptance criteria from `haven/diagrams/`,
   forbidden states from `agent-hub/CLAUDE.md`. [GUARD, added 2026-08-31]
   Don't `Read agent-hub/CLAUDE.md` yourself for this — same mechanism as
   `boot/SKILL.md`: the harness auto-injects this file's full content as a
   nested-CLAUDE.md `<system-reminder>` the moment step 2 touches anything
   under `agent-hub/`; reading it again here duplicates that content. Read
   it directly only if it's actually missing from context after step 2.
4. Check the command in the note matches `doctrine/MEMORY.md` (`npm run
   build`, `npm run lint` — verbatim, not a made-up command like `npm
   test`).
5. Check whether the output has been truncated/hidden (`...`,
   "truncated") → REOPEN if so.
6. If the node has a visual/behavior part: check whether the UI-
   verification evidence via Chrome CDP is concrete (screenshot/computed
   style that can be cited) — REOPEN if it's just a vague "looks fine".
7. Go through acceptance criteria ONE BY ONE — any criterion missing
   evidence = REOPEN, write it clearly into "missing".
8. Scan all 5 forbidden states.
9. Check the SEAL GATE — is there a recorded approval in the note if the
   diff is outward-facing?
10. Check proportionality — did the diff do more than the node required →
    REOPEN (`SmallestDiff`).
11. The verdict is exactly one of two: SEAL (every criterion has citeable
    evidence) or REOPEN (even a single important gap is enough).
12. Only on SEAL: update the ratchet/PM status.
13. Write the verdict into
    `evidence/verifier/<date>/<slug>-{seal|reopen}.md`.

## Hard rules honored
`NeverVerifyOwnWork` | `EvidenceOnly` | `VerdictOnly` | `RatchetOnly`

## Failure branches
| Failure | Handling |
|---|---|
| No evidence note exists | REOPEN, `NO_EVIDENCE` |
| The node doesn't exist on any diagram | REOPEN, `forbidden_hit: node_unknown` |
| The node is already SEALED | Don't overwrite — it must be a new node |
| The note claims "tests pass" | REOPEN immediately — this project has no test suite, that phrase is itself a sign of `EDIT_UNVERIFIED` |

## Runtime
`/worker verifier "<task or note>"` or pass 2 of `/todo "<task>"`.
