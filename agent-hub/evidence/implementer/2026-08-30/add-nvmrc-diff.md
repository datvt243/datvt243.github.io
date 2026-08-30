# 2026-08-30 — add-nvmrc (diff)

- Worker: implementer
- Version: 0.1.0
- Node: `haven/diagrams/dev-loop.prime-mermaid.md` → `add-nvmrc`
- Status: `sealed_pending_verifier`

## Diff
| File | Why |
|---|---|
| `.nvmrc` (new) | Declares `24` — a bare `nvm use` now resolves the right Node version for `npm run lint`, instead of relying on memory |

```
$ git status --short
?? .nvmrc
$ cat .nvmrc
24
```
Single new file, nothing else touched.

## `nvm use` resolution check
```
$ nvm use
Found '/Users/_david/Workspace/Project/datvt243.github.io/.nvmrc' with version <24>
Now using node v24.19.0 (npm v11.17.0)
```
Confirms the `.nvmrc` is actually picked up by a bare `nvm use` (no
argument) — this is the exact behavior issue #89 asked for.

## Command
```
npm run build
```
Exit code `0`. Verbatim tail:
```
Σ Total size: 28.5 MB (10.5 MB gzip)
[nitro] ✔ You can preview this build using node .output/server/index.mjs
```
Run under the default shell Node (`v20.18.0`) — confirms `.nvmrc` doesn't
regress the build path, which was already known to work on that version
per the existing trap in `doctrine/domains/PROJECT.md`.

```
nvm use && npm run lint
```
Verbatim tail (run under the resolved `v24.19.0`, i.e. exactly what a
bare `nvm use` now picks up thanks to this `.nvmrc`):
```
✖ 32 problems (0 errors, 32 warnings)
```
Unchanged from the current baseline (`blog-posts-shape-fix`/
`remove-dead-related-articles`'s `32 problems (0 errors, 32 warnings)`) —
expected, this change touches no source file, only adds a version-pin
file.

## Browser verification
N/A — no visual/behavior change. `.nvmrc` is a local dev-tooling file, not
shipped/served to any real user, doesn't affect any runtime code path.

## Acceptance
| Criterion | Evidence | Met? |
|---|---|---|
| `.nvmrc` created, content `24` | `cat .nvmrc` above | ✅ |
| Build clean | Tail above, exit 0 | ✅ |
| Lint clean, unchanged warning count, run under the `.nvmrc`-resolved version | `nvm use` resolution above + `✖ 32 problems (0 errors, 32 warnings)` | ✅ |
| No visual/behavior change | N/A noted above | ✅ |

## Noticed, not done
`package.json` has no `engines` field either — issue #89 only asked for
`.nvmrc`, not `engines`. Left untouched (`SmallestDiff`); a separate task
if the operator wants npm itself to also warn/block on the wrong Node
version.

## Seal gate
None — no commit/push/PR in this pass. `git status --short` shows only
the new untracked `.nvmrc` file on branch `feature/89`.
