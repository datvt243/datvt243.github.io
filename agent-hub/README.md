# agent-hub — datvt243.github.io

Markdown hub for Đạt's Nuxt 3 portfolio/blog project. Fully replaces the old
convention (`.claude/commands/{start-work,finish-work,merge-work,ship}.md` +
`agent-hub/histories/` as the primary audit trail) as of 2026-08-16, moving to
a discipline of **implementer writes / verifier grades independently**,
mandatory evidence, and a single diagram as the sole source of state.

## How to use it
```
/boot                                # 60 seconds, reads doctrine + diagram + latest evidence
/worker implementer "<task>"         # implement → evidence note
/worker verifier "<task>"            # SEAL or REOPEN
# or combine the two commands above:
/todo "<task>"                       # 2 separate passes, run automatically
```

## Why the old system was replaced
See the Decisions table in `doctrine/domains/PROJECT.md`, the 2026-08-16 row.
Summary: wanted stricter independent verification (the implementer can't
self-report done), mandatory evidence instead of a free-form daily work-log.

## What to read first
1. `NORTHSTAR.md` — what "done" means
2. Root `CLAUDE.md` (outside `agent-hub/`) — the real project's stack/architecture
3. `doctrine/MEMORY.md` — exact build/lint commands (no test suite)
4. `doctrine/domains/PROJECT.md` — traps + decisions, including ones distilled
   from the old `histories/`

## Important notes specific to this project
- **No automated test suite.** "Verify" = `npm run build` clean +
  `npm run lint` clean + (if visual changes) real UI check via Chrome CDP
  port 9888. Never trust or write "tests pass".
- **`agent-hub/histories/`** is still kept as-is (2 files, 2026-08-11 and
  2026-08-13) — NOT deleted, just no longer where new audit trail gets
  written. The durable lessons in it have been distilled into
  `doctrine/domains/PROJECT.md`.
- **The real git workflow** (never push directly to `main` or `staging`,
  branch `bug/<n>` / `feature/<n>` off `staging`, PR into `staging`, `main`
  only updated from `staging` via `/release`) still applies — the hub
  doesn't automate the git/PR side, it only governs the implement/verify
  discipline within a task. See the Invariants section of
  `doctrine/domains/PROJECT.md`.
