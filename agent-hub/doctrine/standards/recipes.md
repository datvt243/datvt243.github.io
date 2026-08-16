> A recipe is SAVED REASONING — good steps recorded once, meant to replace
> re-deriving from scratch. Next time, just replay it.

## Why they matter (Accumulated Intelligence)
"Recipes are capital. Models are fuel." Accumulated intelligence doesn't
live in the model — it lives in the recipes that got written down. A real
example that happened in this repo (before the hub existed, see
`agent-hub/histories/2026-08-13.md`): bisecting a broken build with `git
worktree` — that process should have been a recipe instead of having to be
re-derived from scratch next time.

## When to write one
Write a recipe when: (1) this task repeats ≥ 2 times, (2) there's a step
that's easy to get wrong/forget, (3) there's a step that took real debugging
effort to figure out, (4) the process is long enough to be worth saving.

## What they are NOT
Not the same as a fixed action/command in `manifest.yaml` — that's a
different authority. Recipes live at `haven/workers/<wid>/recipes/*.md`.

## Format (5 required sections)
1. **Contract** — Input, Output, when to use it.
2. **Steps** — numbered, deterministic.
3. **Hard rules honored** — list the related hard rule names.
4. **Failure branches** — a table of | Failure | Handling |.
5. **Runtime** — how to invoke it (`/worker <wid> "<task>"` or
   `/todo "<task>"`).

## Maintaining them
When a recipe turns out wrong, fix it, and write it into the Corrections
table in that worker's `MEMORY.md` when you discover it's wrong. Don't
delete and walk away — fix it and keep the lesson.
