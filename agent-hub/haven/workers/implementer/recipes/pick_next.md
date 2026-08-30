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
5. Locate code anchors via grep — real paths in the Nuxt repo (`pages/`,
   `themes/<ACTIVE_THEME>/`, `server/api/`, `components/`, `stores/`...),
   don't invent them.
6. Declare blockers if a needed env var (`.env.example` lists:
   `MY_EMAIL`, `NODE_API`, `GITHUB_TOKEN`, `GITHUB_USER`,
   `PUPPETEER_EXECUTABLE_PATH`) isn't already set.
7. Evidence: write `evidence/implementer/<date>/<slug>-plan.md`.

## Hard rules honored
`NodeBeforeCode` | `EvidencePerAction` | `NoSilentFailure`

## Failure branches
| Failure | Handling |
|---|---|
| No diagram matches yet | Create a new node on `haven/diagrams/dev-loop.prime-mermaid.md`, keeping the LAI-13 ratchet format |
| Task is ambiguous | Stop and ask, don't guess |
| Task needs an unset env var (e.g. `PUPPETEER_EXECUTABLE_PATH` for PDF) | Report `blocked`, don't fake a value |

## Runtime
`/worker implementer "<task>"` or as pass 1 of `/todo "<task>"`. No API
key, no network call outside the repo — Claude Code IS the runtime.
