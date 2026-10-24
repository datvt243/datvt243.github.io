# PROJECT.md archive — datvt243.github.io

> Archived Traps/Decisions rows moved out of `doctrine/domains/PROJECT.md`
> to keep the active file small (every worker session re-reads the active
> file in full). **Nothing deleted, nothing reworded** — every row below
> is copied verbatim from the active file. Only reason to open this file:
> looking up the full story behind an old trap/decision. `pick_next`/
> `verify_seal` never need to read this file.
>
> Archived: 2026-10-24 (1st pass, PROJECT.md at 15.6KB > 15KB). Scope:
> 2 historical Decisions (2026-08-16 hub migration, 2026-09-01 archive
> convention setup) — no longer a rule any worker acts on.

## Traps (archived)
| Trap | Why | What to do instead |
|---|---|---|

## Decisions (archived)
| Date | Decision | Why | Alternative rejected |
|---|---|---|---|
| 2026-08-16 | Replaced the `agent-hub/histories/` + `.claude/commands/{start-work,finish-work,merge-work,ship}.md` convention with agent-hub doctrine/haven/evidence + implementer/verifier | User wanted stricter independent verification discipline (the builder can't self-report done), mandatory evidence instead of a free-form work-log | Keeping the old system running in parallel — rejected, chose a full replacement instead |
| 2026-09-01 | Added an archive convention for this file's Traps/Decisions tables (`doctrine/domains/PROJECT-archive.md` scaffold + a `/hub-tokens` 15KB size check), mirroring `haven/diagrams/`'s existing archive convention | A `/hub-tokens` run showed this file (12.9KB) as the single largest recurring-cost file in the hub, with no archive mechanism yet — unlike the diagram, which already needed one after crossing 15KB | Leaving it unbounded until it actually crosses 15KB — rejected, cheaper to set up the convention now while the file is still small than retrofit it later under pressure |
