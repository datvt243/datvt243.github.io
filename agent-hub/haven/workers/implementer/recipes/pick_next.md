# Contract
- Input: `{task: string}`
- Output: `{node, diagram, current_state, acceptance: string[],
  files: string[], blocked_by: string|null}`

> [GUARD, added 2026-08-31] If `/boot` already ran in THIS SAME session,
> `NORTHSTAR.md` / root `CLAUDE.md` / `doctrine/MEMORY.md` /
> `doctrine/domains/PROJECT.md` / `haven/diagrams/` are already in context
> from that pass — steps 1-2 below REUSE that content, don't `Read` it
> again (a second full read of the same files is pure duplication, same
> class of token waste as the `agent-hub/CLAUDE.md` case fixed in
> `boot/SKILL.md`). Only `Read` for real when: (a) `/worker implementer` is
> invoked without a prior `/boot` this session, or (b) the content might
> have changed since it was last read.

## Steps
1. Get `NORTHSTAR.md` + root `CLAUDE.md` (the real project) +
   `doctrine/MEMORY.md` + `doctrine/domains/PROJECT.md` — reuse from
   `/boot` if available (see GUARD above), else `Read` fresh.
2. Get every diagram in `haven/diagrams/`, list out nodes + PM status —
   reuse from `/boot` if available (see GUARD above), else `Read` fresh.
3. Find the earliest PENDING node on the critical path.
4. No match → don't make something up; clearly report "no PENDING node",
   stop.
   [added 2026-10-24] Before adding a new node, `grep` its slug in
   `dev-loop-archive.md` — sealed pointers get dropped from the active
   file (`verify_seal` step 12c), so a taken slug may only be there;
   taken → pick a new slug.
   [synced 2026-10-24] Also `grep` the active diagram for a not-yet-SEALED
   row of the same task/issue (`#<n>`) — found → resume THAT row in place
   (state + Notes pointer), never add a "recheck" node beside it (LAI-13's
   new-node rule covers SEALED nodes only).
4b. [synced 2026-10-24, analyze-lite / Layer 1.5] Self-check the picked
   node's acceptance criteria before coding — not a verify pass, no state
   change, no separate evidence. Block on exactly 3 error classes:
   - Ambiguity: vague adjective ("fast", "clean") with no measurement/command.
   - Underspecification: no pass/fail condition mapping to a command in
     `doctrine/MEMORY.md`.
   - Coverage gap: criteria point to no file/anchor that will change.
   Found one → rewrite the criteria on the node first; the evidence note
   adds `## Acceptance criteria clarified: <before> → <after>`.
5. Locate code anchors via grep — real paths in the Nuxt repo (`pages/`,
   `themes/<ACTIVE_THEME>/`, `server/api/`, `components/`, `stores/`...),
   don't invent them.
6. Declare blockers if a needed env var (`.env.example` lists:
   `MY_EMAIL`, `NODE_API`, `GITHUB_TOKEN`, `GITHUB_USER`,
   `PUPPETEER_EXECUTABLE_PATH`) isn't already set.
7. [added 2026-09-02] Measure `hub_bytes_before`: run `/hub-tokens`'s
   script, take the "= per-session total" line's byte count. Write it into
   the evidence note at step 8 — the verifier reads this back to compute
   the hub-size delta in `worker-runs.log`, not a side task of `/todo`.
8. Evidence: write `evidence/implementer/<date>/<slug>-plan.md`, including
   a `## Hub bytes before: <N>` line from step 7.

## Hard rules honored
`NodeBeforeCode` | `EvidencePerAction` | `NoSilentFailure` | `AppendOnly`

## Failure branches
| Failure | Handling |
|---|---|
| No diagram matches yet | Create a new node on `haven/diagrams/dev-loop.prime-mermaid.md`, keeping the LAI-13 ratchet format. [added 2026-09-05] Always APPEND the new row at the END of the PM status table, never insert it in the middle — required for `agent-hub/.gitattributes`' `merge=union` to merge cleanly when 2 branches each add a different new node around the same time. |
| Task is ambiguous | Stop and ask, don't guess |
| Task needs an unset env var (e.g. `PUPPETEER_EXECUTABLE_PATH` for PDF) | Report `blocked`, don't fake a value |

## Runtime
`/worker implementer "<task>"` or as pass 1 of `/todo "<task>"`. No API
key, no network call outside the repo — Claude Code IS the runtime.
