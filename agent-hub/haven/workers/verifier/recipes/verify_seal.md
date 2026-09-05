> the gate.

# Contract
- Input: path to an evidence note under `evidence/implementer/`, OR
  multiple paths (batch), OR `all-pending` (every node currently
  `sealed_pending_verifier` on `dev-loop.prime-mermaid.md` — see "Batch
  verify" below). [batch added 2026-09-05]
- Output: AN ARRAY, 1 element per node: `{verdict: SEAL|REOPEN, node,
  cited: string[], missing: string[], forbidden_hit: string|null,
  pm_updated: boolean, rerun: none|partial|full, isolation_proof: string}`
  — `rerun` is a real self-declaration (step 13b), `isolation_proof` is a
  real self-declaration (step 1b), neither inferred from outside.
- REFUSAL: if this same session wrote the diff being graded → refuse
  immediately: "I wrote this, a separate verifier pass is required."
  (`NeverVerifyOwnWork`) — in a batch, this applies PER NODE: refuse just
  the self-written node, don't cancel the rest of the batch.

## Batch verify [added 2026-09-05]
The heaviest cost of a verify pass isn't the act of verifying — it's
reloading the whole bundle + doctrine on every subagent spawn. Batch
verify pays that cost EXACTLY ONCE for N nodes instead of N times,
without changing anything about the substance of verifying:
- Step 1 (self-refusal check) + the blank-context spawn run ONCE for the
  whole batch — this is the part that gets amortized.
- Steps 2-13b (read note, check criteria, scan forbidden states, verdict,
  write the verdict note, `## Isolation proof`, `## Re-run` declaration)
  run REPEATEDLY, INDEPENDENTLY, for EACH node — using node A's
  evidence/reasoning to infer node B's verdict is forbidden, even if the
  two notes look similar. Each node still gets its own evidence, own
  verdict, own verdict note.
- Being in a batch is NEVER an excuse to loosen any criterion in steps
  2-13b — batching only folds the SPAWN COST, never the VERDICT.
- `all-pending`: first list every `sealed_pending_verifier` node on
  `dev-loop.prime-mermaid.md`, then run the full procedure below on each.

## Re-run scope [cost-driven, added 2026-09-02]
Default: AUDIT the note, don't independently re-run `npm run build`/
`npm run lint`/the CDP script from scratch (including cold-cache rebuilds —
deleting `.nuxt`/`.output`/cache before rebuilding). `EvidenceOnly` means
"don't substitute reasoning for real evidence" — it does NOT mean "always
regenerate the evidence yourself." If the note's output is verbatim, not
truncated (step 5), the command matches `doctrine/MEMORY.md` (step 4), the
CDP evidence is concrete and citable (step 6), and it covers every
acceptance criterion (step 7) → verdict straight off the note, no re-run.

Only re-run (build, lint, or CDP — partial or full) when:
- The note is missing a citation, output looks truncated/hidden, or the CDP
  evidence is vague ("looks fine") rather than a concrete
  screenshot/computed-style quote → REOPEN per steps 4-6 instead — don't
  spend a cold-cache rebuild confirming a note that's already broken.
- The node is outward-facing or a `/release` gate — higher risk than an
  ordinary diff, worth the independent-confirmation cost.
- `doctrine/domains/PROJECT.md` names this class of change as needing
  independent re-run (a per-project call, not the kit default).

Observed in practice (usage audit 2026-09-02, this hub included): the
verifier re-running the full build+lint+CDP cycle from cold cache for
EVERY node — including a 1-line README change — made nearly every task cost
2x (build, lint, and CDP script all duplicated) with no change to the
verdict versus just auditing the note. Not a bug, but not what
`EvidenceOnly` actually asks for — this section pins the boundary.

## Steps
1. REFUSE TO GRADE YOUR OWN WORK FIRST — did I write this diff in this
   session? [batch added 2026-09-05] In a batch, this check and the
   blank-context spawn itself run ONCE for the whole batch; if one
   specific node turns out self-written, refuse just that node and
   continue verifying the rest.
1b. [added 2026-09-02] Record proof this pass is really a separate
    subagent context, not a self-report: cite whatever this invocation
    was actually spawned with that the implementer pass didn't have
    (e.g. the `description`/task string passed to the Agent tool for
    this spawn, or an equivalent fresh identifier this context can see
    for itself) — write it into the note's `## Isolation proof` line.
    This does NOT technically block a skipped isolation (no hook
    enforces it) — it only leaves a citeable trail: a missing line, or
    one that's identical to the implementer's own task string, is itself
    evidence for a later audit that the subagent-spawn rule in
    `worker/SKILL.md` was skipped this round.
2. [LOOP STARTS HERE FOR EACH NODE if batch] Read the NOTE — only the
   note, do NOT open the diff directly. (`EvidenceOnly`)
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
12. Only on SEAL: update the ratchet/PM status. [added 2026-09-05]
    Update the node's own row IN PLACE (state column PENDING/IN_PROGRESS
    → SEALED) — never reorder, move, or re-sort rows in the table
    (`AppendOnly`); this keeps `agent-hub/.gitattributes`' `merge=union`
    able to merge cleanly across branches.
13. Write the verdict into
    `evidence/verifier/<date>/<slug>-{seal|reopen}.md`.
13a. [added 2026-09-02] In that note, include the `## Isolation proof`
    line from step 1b.
13b. [added 2026-09-02] In that note, declare the real `## Re-run` line:
    `none` (audit only, the default per "Re-run scope" above), `partial`
    (name which command), or `full` (re-ran build/lint/CDP from cold
    cache) — always with a reason matching one of the 3 exceptions in
    "Re-run scope" if not `none`. Misdeclaring this (e.g. writing `none`
    after actually re-running) breaks the duplicate-cost signal step 14
    depends on.
14. [added 2026-09-02] Append one line to `evidence/worker-runs.log`
    (create if missing): take `hub_bytes_before` from the
    `## Hub bytes before` line in the implementer's note (already read in
    step 2, reuse it — don't read it again); measure `hub_bytes_after` the
    same way (this hub's `/hub-tokens` per-session total), taken AFTER
    updating PM status in step 12 if SEALED. Format:
    ```
    <ISO timestamp> role=verifier outcome=SEAL|REOPEN node=<slug>
    rerun=none|partial|full hub_bytes_before=<N> hub_bytes_after=<N>
    ```
    Same logging whether called via `/todo` or a standalone
    `/worker verifier`. NEVER edit/delete an old line here — append-only,
    same rule as the rest of `evidence/`.

## Hard rules honored
`NeverVerifyOwnWork` | `EvidenceOnly` | `VerdictOnly` | `RatchetOnly` |
`AppendOnly`

## Failure branches
| Failure | Handling |
|---|---|
| No evidence note exists | REOPEN, `NO_EVIDENCE` |
| The node doesn't exist on any diagram | REOPEN, `forbidden_hit: node_unknown` |
| The node is already SEALED | Don't overwrite — it must be a new node |
| The note claims "tests pass" | REOPEN immediately — this project has no test suite, that phrase is itself a sign of `EDIT_UNVERIFIED` |

## Runtime
`/worker verifier "<task or note>"` or pass 2 of `/todo "<task>"`.
[added 2026-09-05] `/worker verifier "<path1> <path2> ..."` (multiple
evidence note paths) or `/worker verifier all-pending` spawns ONE
subagent that verifies every queued node independently — use this after
several small implementer passes have piled up, instead of one
`/worker verifier` call per node.
