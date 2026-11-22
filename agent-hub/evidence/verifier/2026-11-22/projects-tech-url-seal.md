# 2026-11-22 - projects-tech-url (verdict)

- Worker: verifier · Node: `projects-tech-url` · New PM status: SEALED
- Verdict: SEAL

## Isolation proof
Spawned via the Agent tool as the "agent-hub VERIFIER" subagent, blank context, task "Run /worker verifier by hand ... node projects-tech-url, issue #435"; never saw the implementer's reasoning.

## Reasoning
- Feature doc cited (`projects.md`); `## Feature doc changed` records operator answers (open question 4 2026-11-07; AskUserQuestion "Client-only, no allowQuery" 2026-11-22). Behavior 8 + new acceptance row each covered below.
- Crit 1 (A then B -> `?tech=A,B`, history unchanged): browser lines 2-3 `/projects?tech=vue,react`, names Alpha+Beta, `hist` stays 2.
- Crit 2 (x removes tech): lines 6, 15 `"/projects"`, 3 names.
- Crit 3 (fresh/reload apply after mount; unknown stay, x clears): lines 7, 8, 9, 10, 11, 13, 14 (`names:[]`, noMatch 1), 15.
- Crit 4 (SSR unfiltered): `Alpha:1 Beta:1 Gamma:1` from curl of `?tech=react`.
- Crit 5 (no `nuxt.config.ts` change, operator decision): `git diff --stat` lists only 3 files, cited.
- Crit 6: `build=0`, `lint=0`, `tc=0` (grep -ci error 0), `test=0` with "Test Files 10 passed (10) / Tests 30 passed (30)"; commands match doctrine/MEMORY.md; typecheck row has no baseline.
- Mock safety: `grep -c onrender server.log` -> 0.
- Comments per code-comments.md: row present, 3 one-line `//` WHY comments, no `(#N)`.
- Coverage claim (`selected` used only in this file) cites its grep + ThemeFilterFolder callers.
- Review: present; 2 findings fixed, 1 fixed by another fix, 1 moved to Noticed with reason (issue-specified format). Review not re-run on final diff, but final diff has build/lint/typecheck/test + browser run (not a REOPEN reason).
- Supersedes: none, with grep. Seal gate: none (localhost mock only). Proportionality: one component edit + doc, no extras.
- Doctrine proposal: none.
- PM: row collapsed to archive per step 11; the feature doc stays `verified` (a feat SEAL on an already-verified doc; changelog row already added by the diff).

## Re-run
none (audit-only; node is not outward-facing)
