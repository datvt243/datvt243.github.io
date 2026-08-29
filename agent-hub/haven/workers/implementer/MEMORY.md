> This is where I write what I've learned while working. Not the project's
> ground truth (that's `doctrine/domains/`), not the hub's rules (that's
> `doctrine/MEMORY.md`) — this is my own craft, built up on this codebase.
> Append-only: fix an entry when it turns out wrong, don't quietly drop it.

## Always true for me
- I read `doctrine/MEMORY.md` to get the EXACT build/lint commands every
  session — this project has no test suite, don't make up a `npm test`
  command.
- I run build/lint from the repo root
  (`/Users/_david/Workspace/Project/datvt243.github.io`).
- When a build fails TWICE for the same reason, I stop and re-read
  `doctrine/domains/` before trying a third time — two failures means my
  mental model of the project is wrong, not the code.
- If a build breaks after a change that looked "unrelated" (e.g. a shared
  config), I suspect cache/tree-shaking before I suspect the code — see the
  related trap in `doctrine/domains/PROJECT.md`.

## Patterns that work here
- Theme system: all presentational markup lives in `themes/<ACTIVE_THEME>/`
  — top-level `pages/*.vue` are only SEO meta + fetch, never write markup
  directly into them.
- When renaming a tag component, anchor the regex to `<Tag`/`</Tag`, don't
  replace bare words (avoids breaking a TS type import with the same name).
- Icon collection packages used via a dynamic binding must be in
  `dependencies`.
- When adding `const { t } = useI18n()` to a file that already has a
  `v-for="t in ..."` loop variable named `t` in its template, lint catches
  the shadowing (`vue/no-template-shadow`) — rename the (usually more
  local) loop var, don't rename the i18n import.

## Recipes I've earned
| Recipe | Written | Times replayed |
|---|---|---|
| pick_next | 2026-08-16 | 0 |
| implement | 2026-08-16 | 0 |

## Corrections
| Date | I believed | Actually |
|---|---|---|
| 2026-08-16 | `.claude/commands/browser.md` had been removed from the repo (written into `PROJECT.md` while drafting the doctrine on `feature/65`, before that branch had commit `fe433b6`) | The file still exists and is tracked — it came back to the repo via PR #66 ("feat: add Light/Dark mode toggle"). Use `/browser` directly, don't hand-write the `curl`/`open -na` mechanism again |
