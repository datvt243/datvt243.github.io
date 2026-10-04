# 2026-10-04 — comment-cleanup-standardize (plan)

**Worker:** implementer
**Version:** 0.1.0
**Node:** `comment-cleanup-standardize` on `haven/diagrams/dev-loop.prime-mermaid.md` (new, appended at the end)
**Task (verbatim):** `/todo "Hãy review và refactor comment trong source code JavaScript/TypeScript. …"` (full text = body of issue #210)
**Issue / branch:** #210 (https://github.com/datvt243/datvt243.github.io/issues/210) · `210-review-v-refactor` (off freshly-pulled `staging`)

## Hub bytes before: 134641

## Scope
`git ls-files` → `.ts/.js/.mjs/.cjs/.vue` excluding `agent-hub/` and `.claude/` = **92 files**. For `.vue`, only `<script>` blocks (template `<!-- -->` is HTML, not JS/TS).

Inventory: an AST-based walker (TypeScript compiler API, `getLeading/TrailingCommentRanges` over every node *and* token via `getChildren()`), not regex. A raw `ts.createScanner` pass was tried first and rejected because it mis-tokenizes template literals and regexes (it reported `//api.github.com` inside a template string and `//.test(tag)` inside a regex as comments). Result: **320 comment tokens → 168 logical comments** (adjacent `//` lines grouped). Snapshot: `comment-cleanup-standardize-inventory-before.json` (ids below index into it).

## Operator decisions (AskUserQuestion, this session)
1. Rule conflict "in-function → `//`" vs "> 1 sentence → `/** */`": **multi-sentence wins, even inside a function**.
2. Placeholder header `Author / Date: \`--/--\` / Description:` (~50 files): **"Chỉ bỏ dòng rỗng"**. Keep `Author:`, drop the placeholder `Date` line and an empty `Description:` line. A real date (`VisitTracker.client.ts`, `01/09/2026`) and any non-empty Description are kept.

## Rules applied
- Delete: commented-out code; comments that restate the code ("what", not "why"); JSDoc that only repeats the TS signature with no meaning added.
- Keep: why-comments, JSDoc for functions/APIs, TODO/FIXME/HACK (none exist), links, `// @ts-check` / `/** @type */` pragmas.
- `//` → `/** */`: any comment > 1 sentence; any single-sentence comment sitting directly on a function or on an exported declaration / type member (API).
- `/** */` → `//`: a single-line comment that isn't function/API docs. In practice: headers left with only the `Author:` line.
- Reword (not counted as delete/convert): 2 AboutMe.vue comments. #121 described a "private-use marker" the code no longer uses (stale). #122 contained a garbled mid-sentence self-correction ("non-capturing... actually").

## Acceptance criteria
1. Every change is in the ledger (file, line, action, before, after), and the report totals are computed from that ledger.
2. **Zero code change**: the token stream with comments stripped is identical before and after, for every touched file (TS `createScanner` with `skipTrivia`, per `<script>` block for `.vue`).
3. After-inventory: no remaining empty `Description:` / placeholder `Date: --/--` lines, and no remaining multi-sentence `//` group.
4. `npm run build` clean, `npm run lint` 0 errors and warnings ≤ baseline 13.
5. Report lists modified files, the deleted comments, the converted comments, and the 3 totals.

## Blockers
None.
