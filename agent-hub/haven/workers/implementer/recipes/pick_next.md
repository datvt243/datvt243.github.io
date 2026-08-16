# Contract
- Input: `{task: string}`
- Output: `{node, diagram, current_state, acceptance: string[],
  files: string[], blocked_by: string|null}`

## Steps
1. Read `NORTHSTAR.md` + root `CLAUDE.md` (the real project) +
   `doctrine/MEMORY.md` + `doctrine/domains/PROJECT.md`.
2. Read EVERY diagram in `haven/diagrams/`, list out nodes + PM status.
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
