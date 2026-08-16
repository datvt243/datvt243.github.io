# doctrine/MEMORY.md ★ (highest authority — Authority: 65537)

> If any other document contradicts this file on a path or a command, THIS
> FILE WINS. One home per fact — a command living in two files means it
> will be wrong in one of them.

## What this is
- Hub path (absolute): `/Users/_david/Workspace/Project/datvt243.github.io/agent-hub`
- Code repo path (absolute): `/Users/_david/Workspace/Project/datvt243.github.io`
- Hub ↔ repo relationship: the hub sits DIRECTLY INSIDE the repo (not two
  separate repos). Still only cross-checks the repo through a worker, with
  a real build/lint run + evidence note — never ad hoc.

## The exact commands
> COPY these — never type them from memory. A memorized command drifts,
> and a drifted command proves the wrong thing.

| Purpose | Command | Run from |
|---|---|---|
| Test | **NONE** — this project has no automated test suite (no `test` script in `package.json`) | — |
| Build (SSR) | `npm run build` | repo root |
| Build (static) | `npm run generate` | repo root |
| Lint (check) | `npm run lint` | repo root |
| Lint (autofix) | `npm run lint:fix` | repo root |
| Run locally | `npm run dev` | repo root |
| Preview build | `npm run preview` | repo root |

**"Verify" replaces the test suite**: `npm run build` must be clean (0
errors) + `npm run lint` must be clean, AND if the change has a visual/
user-facing behavior part, the real UI must be checked via Chrome CDP (see
`domains/PROJECT.md`'s "Browser verification" section). There is no test
to "pass" — never claim "tests pass".

## Stack
| Thing | Value |
|---|---|
| Language/runtime | TypeScript, Node — Nuxt 3 / Vue 3 SSR |
| Package manager | npm (`package-lock.json` present) |
| Test runner | None |
| CSS | TailwindCSS v3 + `@nuxt/ui` v2 + sass |
| State | Pinia (`stores/`) |

## The default way to work
`/boot` → `/worker implementer "<task>"` → `/worker verifier "<task>"` (or
combined as `/todo "<task>"`). Never skip the `/boot` step in a cold
session, never skip the real build+lint step before reporting
`sealed_pending_verifier`.

## Workers
| wid | Role | Actions | Seal actions |
|---|---|---|---|
| implementer | Implementer | pick_next, implement | — |
| verifier | Verifier | verify_seal | SEAL, REOPEN |

## Forbidden states
5 states — see `agent-hub/CLAUDE.md` for details. These states OVERRIDE
every other skill's text.

## Facts that are always true
- No LLM API key anywhere in the hub — Claude Code IS the runtime.
- `haven/` is memory, not code.
- `evidence/` is committed; "bad" notes are kept too.
- Monotonic ratchet: PENDING → IN_PROGRESS → SEALED, never backwards.
- The verifier owns PM status; the implementer never sets it themselves.
- The repo has its own root `CLAUDE.md` (the real project: stack/
  architecture/env vars) — read that file BEFORE
  `doctrine/domains/PROJECT.md`, don't repeat its content here.
- The repo's real git workflow (branch naming, never push to `main`, PR
  flow) lives in `domains/PROJECT.md`, not here — this file is only
  paths/commands.

## Open `<<FILL>>` values
No `<<FILL>>` left — every command above has been confirmed from
`package.json` + the real root `CLAUDE.md`, not guessed.
