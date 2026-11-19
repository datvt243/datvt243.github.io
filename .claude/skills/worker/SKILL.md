---
name: worker
description: Become the analyst, implementer or verifier in the datvt243.github.io agent-hub, follow that role's recipe, stop at the SEAL gate. Trigger: /worker [analyst|implementer|verifier] "[task] Use when running one loop role by hand instead of /todo."
---

# /worker <wid> "<task>"

`<wid>` is `implementer` or `verifier`. [added 2026-09-05] For `verifier`
only, the argument after `<wid>` can be 1 evidence note path, SEVERAL paths
at once (batch), or the keyword `all-pending` (every node in the
`sealed_pending_verifier` state on the active diagram) — see "Batch
verify" in `verify_seal.md`. Batch only pools the SPAWN COST (load the
bundle once for the whole batch), the verdict is still computed SEPARATELY,
INDEPENDENTLY for each node — never infer one node's verdict from another.

> [MANDATORY] If `<wid>` is `verifier`: this pass MUST run as a
> **separate subagent** (spawned via the Agent tool), blank context — it
> must not be the same session/pass that just wrote the diff being judged,
> even when called from `/todo`. If `/worker verifier` is called in the
> same context as an implementer that just finished → refuse to run
> inline, spawn a subagent instead. [Fixed 2026-09-02: the previous version
> said this was "infrastructure, not a promise to refuse judging oneself" —
> wrong, no technical hook/gate actually blocks this yet, it's still a
> mandatory rule that must be self-enforced. The only infrastructure part
> is leaving a **verifiable trace** — see `verify_seal.md`'s
> `## Isolation proof` field: the verifier must record the identity of this pass's own
> subagent (different from the implementer's), so a later audit can detect
> if the context-separation step was skipped, instead of having to trust
> Spawn it with `model: "sonnet"` (it checks cited evidence against
> criteria, doesn't design). The spawn prompt names the absolute hub
> path, the note path(s) and node slug(s) — never make the subagent `ls`
> around to find its inputs, and never add re-run instructions ("re-run
> the checks yourself") — `verify_seal.md`'s "Re-run scope" alone
> decides. (kit 2026-11-18)
> a self-report.] Only exception to a fresh spawn: `/todo`'s REOPEN
> rounds resume the same verifier subagent (`todo` step 4) — still never
> the implementer's context.

> **`analyst`** (BA, kit 2026-11-06): MUST run as a **separate subagent**
> (Agent tool, blank context). The subagent loads
> `agent-hub/haven/workers/analyst/` (`manifest.yaml`, `SOUL.md`,
> `recipes/spec_feature.md` — no MEMORY.md) and gets the task (issue title
> + body) plus any operator answers from a previous round. Returns
> `spec_ready` | `needs_input` (relay its questions to the operator
> verbatim, never answer them yourself; re-run with the answers) |
> `no_feature` | `blocked`. Backfill an existing feature by hand:
> `/worker analyst "document <feature>"`.

## 1. Load the bundle — all of it
Read ALL of `agent-hub/haven/workers/<wid>/`: `manifest.yaml`, `SOUL.md`,
`MEMORY.md` (if present), and EVERY file in `recipes/` — not only the file
related to the current task. Keep the `hard_rules` in `manifest.yaml` in
mind — they are CHECKS, not aspirations.

## 2. Become it
From here on you ARE `<wid>`, not "reading about" `<wid>`. The invariants in
`SOUL.md` OVERRIDE every default behavior, including Claude Code's everyday
habits (e.g. automatically claiming "tests pass" — this project's unit tests
cover only a few pure functions, never use that phrase in place of a
build/lint/typecheck/UI check).

## 3. Follow the recipe = order
The recipe fixes the order of steps — per `agent-hub/doctrine/standards/recipes.md`'s
5-section format (Contract/Steps/Hard rules/Failure branches/Runtime). No
recipe matches the task → don't invent steps, stop and say so clearly.

## 4. Cache miss
If no recipe matches the task (a completely new task, no similar
node/pattern before) → fall back on the invariants in `SOUL.md` + the hard
rules in `manifest.yaml` as the guide, and consider whether this is worth
writing up as a new recipe (see the criteria in
`doctrine/standards/recipes.md`).

## 5. Read before you claim
No inferring without real output. The `implementer` must run `npm run
build` + `npm run lint` + `npx nuxi typecheck` + `npm test` (from
`doctrine/MEMORY.md`) and read the output back verbatim.
The `verifier` only reads the evidence note, it does NOT open the diff itself.

## 6. Stop at the SEAL/exit
The `implementer` stops at `status: sealed_pending_verifier` after writing
evidence — no extra work on its own (out-of-scope refactor/rename/reformat →
record under "Noticed, not done", don't fix it yourself).
The `verifier` stops at `SEAL` or `REOPEN` — there is no third state.

## 7. Verdict — then
`verifier`: SEAL only when every acceptance criterion has citeable evidence
(never make up any output). REOPEN comes with a specific reason, recorded
under "missing" — no vague REOPEN like "doesn't feel right yet".

## 8. Exit + evidence + hand off
End of pass: the evidence note is written at `agent-hub/evidence/<wid>/<date>/`,
report the result briefly to the operator (verdict/status + node + evidence
note path), and stop — never switch to the other role automatically. To
automate both passes, use `/todo` instead of calling `/worker` 2 times by
hand.
