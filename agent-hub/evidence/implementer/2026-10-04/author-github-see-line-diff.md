# 2026-10-04 — author-github-see-line (plan + diff)

**Worker:** implementer
**Version:** 0.1.0
**Node:** `author-github-see-line` (new, appended at the end of the PM status table)
**Task (verbatim operator message):** "tách link github ra 1 dòng riêng"
**Issue / branch:** #210 · `210-review-v-refactor` (on top of the SEALED `comment-cleanup-standardize` + `comment-style-followup`, all uncommitted)
**Status:** `sealed_pending_verifier`

## Hub bytes before: 138445
Measured just after appending this node's diagram row (≈ 600 B). The first measurement in this pass was mis-parsed by `awk` and printed `B`, so this is the closest real figure.

## Decision
A continuation line under `@author` would still be parsed by JSDoc as part of the `@author` value, so the link gets its own tag: `@see` (JSDoc's tag for referring to related docs/URLs). Side effect: the `@author` line is now exactly JSDoc's documented `@author <name> [<email>]` form (https://jsdoc.app/tags-author).

## Diff
58 files, one line each → two lines (`author-github-see-line-ledger.json`, 58 entries):
```
- * @author Đạt Võ <votan.it@gmail.com> (https://github.com/datvt243)
+ * @author Đạt Võ <votan.it@gmail.com>
+ * @see https://github.com/datvt243
```
Applied by a script with an exact-line regex and `assert n == 1` per file. Indentation is preserved.

## Command / Output
`npm run build`, `npm run lint` (Node v24.19.0), `node scratchpad/codecheck.cjs . HEAD`
```
checked 66 files, 0 with code changes
  58  * @author Đạt Võ <votan.it@gmail.com>
@see https://github.com/datvt243 lines: 58
files still containing "(https://github.com/datvt243)": 0
build exit 0
└  ✨ Build complete!
✖ 13 problems (0 errors, 13 warnings)
```

## Browser verification
N/A, comments only (codecheck covers the `.vue` template/style too).

## Acceptance
| Criterion | Evidence |
|---|---|
| Link on its own line in all 58 headers | 58 × `@author … <email>` + 58 × `@see https://github.com/datvt243`, 0 old-format lines |
| Still `/** */` (operator rule) | change is inside the existing blocks only; `utils/index.ts` lines 1-4 shown as `/**` / `@author` / `@see` / `*/` |
| Zero code change | `checked 66 files, 0 with code changes` |
| Build + lint | `✨ Build complete!`; `0 errors, 13 warnings` == baseline |

## Noticed, not done
None.

## Seal gate
None. Nothing committed.
