# 2026-10-04 — comment-style-followup (plan)

**Worker:** implementer
**Version:** 0.1.0
**Node:** `comment-style-followup` (new, appended at the end of the PM status table)
**Task (verbatim operator message):** "1. dùng /** 2. về phần Author, luôn dùng /** cho tôi, và hãy search cách trình bày author chuẩn và áp dụng"
**Issue / branch:** #210 · `210-review-v-refactor` (same branch; it builds on the uncommitted, SEALED `comment-cleanup-standardize` changes)

## Hub bytes before: 136310

## Why a new node
`comment-cleanup-standardize` is SEALED. The operator's clarification changes its rule ("1 dòng" = one *line*, not one *sentence*) and the header format. Under LAI-13 that is a new node, not an edit to the sealed one.

## Research (standard author format)
- https://jsdoc.app/tags-author: syntax `@author <name> [<emailAddress>]`, example `@author Jane Smith <jsmith@example.com>`, and the email "in angle brackets" becomes a `mailto:` link.
- https://jsdoc.app/tags-file: `@file` (synonyms `@fileoverview`, `@overview`), example shows `@file …` followed by `@author …` in the same block.
- Operator decision (AskUserQuestion): name + email + GitHub URL → `@author Đạt Võ <votan.it@gmail.com> (https://github.com/datvt243)`. Text after the email is allowed: JSDoc's `@author` value is free text.

## Inventory (current working tree, AST walker; snapshot `comment-style-followup-inventory-before.json`)
`raw 173 logical 138`: 58 Author headers (49 `// Author: …` one-liners + 9 `/** */` blocks with a Description), 15 multi-line non-header `//` groups, 0 non-JSDoc `/* */` blocks.

## Rules
1. Each of the 15 multi-line `//` groups (≥ 2 physical lines) becomes `/** */` with the same line breaks. Single-line `//` stays.
2. Author header, always a multi-line `/** */`:
   - Without a Description: `/**` / ` * @author Đạt Võ <votan.it@gmail.com> (https://github.com/datvt243)` / ` */`
   - With a Description: `Description: X…` becomes `@file X…` (continuation lines kept, an empty first line merged with the next one), then the `@author` line last (JSDoc example order).
   - `VisitTracker.client.ts`'s real `Date: \`01/09/2026\``: there is no standard JSDoc date tag, so it is kept verbatim as a plain line before the tags.
3. Comments only. Other file-level `/** */` blocks without an Author line are untouched.

## Acceptance criteria
1. Ledger + report computed from the ledger (files, before/after, totals).
2. Zero code change vs `HEAD` (comment-stripped AST + `.vue` remainder).
3. After-inventory: 0 multi-line `//` groups; 58 headers, all `/** */`, all with the exact `@author` line; 0 `Author: Đạt Võ -` lines left; `@file` exactly where a Description existed (9).
4. `npm run build` clean; `npm run lint` 0 errors, ≤ 13 warnings.
