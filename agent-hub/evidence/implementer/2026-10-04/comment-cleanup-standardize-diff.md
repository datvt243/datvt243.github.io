# 2026-10-04 — comment-cleanup-standardize (diff)

**Worker:** implementer
**Version:** 0.1.0
**Node:** `comment-cleanup-standardize` (`haven/diagrams/dev-loop.prime-mermaid.md`, PM status IN_PROGRESS, appended last)
**Task (verbatim):** `/todo "Hãy review và refactor comment trong source code JavaScript/TypeScript. …"` (= body of issue #210)
**Issue / branch:** #210 · `210-review-v-refactor`
**Status:** `sealed_pending_verifier`

## Hub bytes before: 134641

## Diff
65 code files, **comments only**. Every change is one entry in
`comment-cleanup-standardize-ledger.json` (file, pre-change line, inventory id, action, before, after).
The human-readable version is `comment-cleanup-standardize-report.md` (generated from the ledger): totals,
per-file table, every deleted comment verbatim, every converted comment before/after.

| Action | Count |
|---|---|
| Deleted | **30** |
| `//` → `/** */` | **29** (#121 and #26 also reworded, see below) |
| `/** */` → `//` | **49** (file headers left with only `Author:`) |
| Header trimmed, kept `/** */` (real Description) | 8 |
| Placeholder header lines removed | 106 (= 49×2 + 8×1) |
| Reworded only | 1 (#122) |

Plus `agent-hub/haven/diagrams/dev-loop.prime-mermaid.md` (new node row).

Rewording, all disclosed in the report:
- #121 `AboutMe.vue`: the comment described a "private-use marker" that the code no longer uses (stale). Dropped that sentence.
- #122 `AboutMe.vue`: removed a garbled mid-sentence self-correction ("non-capturing... actually").
- #26 `nuxt.config.ts`: `server/**/*.ts` → `every server/ .ts file`. Inside a `/** */` block, the `*/` in that glob closes the comment early (see "Bugs caught" below).

How it was applied: `scratchpad/apply.py`, which runs per file, bottom-up, and asserts the original text is still at the inventoried line before editing. The decision table (ids → action) is in the script and mirrored in the ledger.

## Bugs caught in my own first pass (fixed before this note)
The zero-code-change check (below) flagged 2 files on the first full run:
1. `themes/portfolio-dev/pages/post/Item.vue`: the header began on the same line as `<script setup lang="ts">/**`, so replacing the header lines also deleted the `<script>` tag. Fix: keep any non-comment prefix on the first line. Line 1 is `<script setup lang="ts">` again.
2. `nuxt.config.ts` #26: the `*/` inside `server/**/*.ts` closed the converted block early, turning the rest of the text into code. Fix: rewording + an assert in `apply.py` that rejects any `*/` inside a converted block body.

Also: an earlier run aborted on an assertion (indented `//` groups) after already writing 6 files. Those 6 files were restored with `git checkout -- <file>` (they only contained this script's own edits; the tree was clean before). All 65 were restored again before the final run.

## Command
From `doctrine/MEMORY.md`, repo root, Node `v24.19.0`:
- `npm run build`
- `npm run lint`
Extra checks (no test suite exists):
- `node scratchpad/codecheck.cjs . HEAD`: for each changed `.ts/.js/.vue`, compares the TypeScript printer output with `removeComments: true` (per `<script>` block) **plus the `.vue` non-script remainder (template/style)** between `HEAD` and the working tree.
- `node scratchpad/inventory.cjs`: before/after AST comment inventory (before snapshot: `comment-cleanup-standardize-inventory-before.json`).

## Output
```
build exit 0
│
└  ✨ Build complete!
```
```
✖ 13 problems (0 errors, 13 warnings)
```
(baseline on clean staging, earlier this session: `✖ 13 problems (0 errors, 13 warnings)`)
```
checked 65 files, 0 with code changes
```
Inventory: before `raw 320 logical 168 line 69 block 99 trailing 2 inFn 27` → after `raw 173 logical 138 line 67 block 71 trailing 0 inFn 9`.
```
placeholder Date / empty Description remaining: 0
multi-sentence // groups remaining: 0
```
Heuristic sanity check against the before-state: it flagged `15` multi-sentence `//` groups, `all converted: True`. It misses sentences that start lowercase. #0 and #26 are both of that kind, and I classified them by hand as multi-sentence. To cover that gap, all 19 remaining `//` comments in the after-state were listed and read by hand: each is a single sentence, inside a function, on a config property, or on a non-exported `const`.

## Browser verification
N/A, no visual or behavior change. Stated with evidence, not assumed: the codecheck compares the `.vue` template/style remainder as well as the stripped script AST, and it reported `0 with code changes`.

## Acceptance
| Criterion | Evidence |
|---|---|
| 1. Every change in the ledger, report computed from it | `comment-cleanup-standardize-ledger.json` (117 entries), `-report.md` generated from it; totals in the table above |
| 2. Zero code change | `checked 65 files, 0 with code changes` |
| 3. No placeholder header / multi-sentence `//` left | `0` / `0` + manual review of all 19 remaining `//` |
| 4. Build + lint | `✨ Build complete!` exit 0; lint `0 errors, 13 warnings` == baseline |
| 5. Report contents | `-report.md`: Totals, Files modified (65 rows), Deleted comments (30, verbatim), Converted `//`→`/** */` (29 before/after), Converted `/** */`→`//` (49, one shared shape + file list), Headers trimmed (8), Reworded only (1) |

## Noticed, not done
- `tailwind.config.js`: with the commented-out `colors:` block deleted, `generateColorScale` is still used in `extend.colors`, so it is not dead. Nothing to do.
- `createPDF.ts` keeps `const _log = console.log.bind(console)`, which may be unused. That's a code question, out of scope (comments only).
- `.vue` `<template>` HTML comments (`<!-- -->`) are out of scope ("JavaScript/TypeScript"), so they were not touched.
- No TODO/FIXME/HACK exist anywhere in scope (`0` in the inventory), so none needed keeping.

## Seal gate
None. No commit, push or PR. `/todo` was run without `--ship`.
