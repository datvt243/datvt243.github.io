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
>
> Archived: 2026-11-17 (2nd pass, PROJECT.md at 16.9KB > 15KB). Scope:
> 1 resolved Trap (`@nuxt/schema` pin, dropped in #263) + 6 Decisions
> from 2026-08-11..16 (theme split, color mode, Dracula scope) — the
> resulting code/rules already live in `themes/` and `.claude/rules/theme.md`.

## Traps (archived)
| Trap | Why | What to do instead |
|---|---|---|
| `@nuxt/schema` devDependency pinned `~3.21.11` (= the installed `nuxt`) looks like dead weight | `@nuxt/ui@3` depends on `@nuxt/schema@4` directly; without the pin npm hoists 4.x to the root, Nuxt 3's generated `.nuxt/tsconfig.json` maps `@nuxt/schema` there, and `nuxi typecheck` fails on `nuxt.config.ts`'s `$development.nitro.storage` (schema 4's nitro type falls back to a minimal shape without a Nuxt-4 server builder) — found in #262 | Resolved in #263: on Nuxt 4 every module dedupes to one `@nuxt/schema@4.x`, pin dropped. If a future module drags in a mismatched schema major again, pin it to the installed `nuxt`. |

## Decisions (archived)
| Date | Decision | Why | Alternative rejected |
|---|---|---|---|
| 2026-08-11 | ALL page-content markup (not just the 8 chrome primitives) counts as "theme", moved entirely into `themes/portfolio-dev/` | User explicitly chose the broad scope: "the entire presentational markup" | Only splitting out the 8 chrome primitives, keeping page-content in the root `components/` |
| 2026-08-11 | Theme splits `pages/` (per-route content) vs `components/` (reusable chrome) | User wanted the two kinds visually distinguishable for easier navigation | Keeping one shared `components/` folder for both kinds |
| 2026-08-13 | Light/Dark mode defaults to **dark** | Matches the current look, doesn't change the experience for existing users until they opt into light | Defaulting to light |
| 2026-08-13 | Theme mode persistence via `localStorage`, not a cookie | Simpler, accepted tradeoff | Cookie-based SSR-safe (no dark flash on reload) — not done, may revisit if reported as annoying |
| 2026-08-13 | `@iconify-json/fe`/`@iconify-json/grommet-icons` moved from `devDependencies` to `dependencies` | The real fix for the prerender error (see Traps) | None — this is the standard fix for this class of `@nuxt/icon` error |
| 2026-08-16 | Dracula only applies to `<ThemePanel>` (file-tree + editor), NOT the whole site; rides on the existing dark/light toggle (Dracula when dark, a derived Dracula-light palette when light) instead of adding a 3rd mode/toggle | User confirmed via AskUserQuestion + clarified further ("dracula follows dark, add another theme that follows light") — narrower scope than the "add a Dracula mode" example already written in root `CLAUDE.md` | Adding Dracula as a 3rd site-wide mode (cycling dark→light→dracula) — user chose the narrower scope, editor only |
| 2026-08-16 | Replaced the `agent-hub/histories/` + `.claude/commands/{start-work,finish-work,merge-work,ship}.md` convention with agent-hub doctrine/haven/evidence + implementer/verifier | User wanted stricter independent verification discipline (the builder can't self-report done), mandatory evidence instead of a free-form work-log | Keeping the old system running in parallel — rejected, chose a full replacement instead |
| 2026-09-01 | Added an archive convention for this file's Traps/Decisions tables (`doctrine/domains/PROJECT-archive.md` scaffold + a `/hub-tokens` 15KB size check), mirroring `haven/diagrams/`'s existing archive convention | A `/hub-tokens` run showed this file (12.9KB) as the single largest recurring-cost file in the hub, with no archive mechanism yet — unlike the diagram, which already needed one after crossing 15KB | Leaving it unbounded until it actually crosses 15KB — rejected, cheaper to set up the convention now while the file is still small than retrofit it later under pressure |
