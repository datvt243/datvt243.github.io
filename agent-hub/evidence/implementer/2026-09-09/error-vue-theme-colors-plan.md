# 2026-09-09 — error-vue-theme-colors (implementer plan)

- Worker: implementer
- Version: 0.1.0
- Node: `error-vue-theme-colors` (new, `haven/diagrams/dev-loop.prime-mermaid.md`)
- Task: `/todo "#152"`

## Hub bytes before: 85834

## Diagram check
Reused this session's earlier `/boot` + `/release` reads of
`NORTHSTAR.md`/root `CLAUDE.md`/`doctrine/MEMORY.md`/`doctrine/domains/
PROJECT.md`/`haven/diagrams/dev-loop.prime-mermaid.md` (unchanged since,
`git status --short` clean before this pass started, no drift). No
PENDING node matches issue #152 — created a new node per
`pick_next.md`'s "no diagram match yet" failure branch, appended at the
END of the PM status table (`AppendOnly`).

## Acceptance criteria (from issue #152)
1. Replace the literal Tailwind colors on root `error.vue`'s "Take me
   there!" button (line 31: `bg-pink-500`, `hover:bg-orange-700`,
   `focus:ring-indigo-700`) with `--theme-*` tokens, matching the
   convention documented in root `CLAUDE.md`'s "UI Theme" section.
2. Both color modes verified via Chrome CDP on a real error page (this
   page isn't reachable through everyday navigation — must be forced).
3. Build clean + lint clean.
4. Out of scope, explicitly: the commented-out dead markup at lines
   ~41-51 — issue #152 flagged it for awareness only, not part of this
   fix (`SmallestDiff`).

## Env vars
None needed — no external API/build config involved, plain Tailwind
class swap.
