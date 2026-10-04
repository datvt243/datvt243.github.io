# 2026-10-04 — comment-cleanup-standardize (verifier verdict)

**Worker:** verifier
**Version:** 0.1.0
**Node:** `comment-cleanup-standardize` (`haven/diagrams/dev-loop.prime-mermaid.md`, last row)
**Verdict:** SEAL
**New PM status:** SEALED (row updated in place, not moved)

## Isolation proof
Spawned via the Agent tool as a separate subagent, task string beginning
"You are being spawned as the `verifier` worker for the datvt243.github.io
agent-hub (pass 2 of `/todo` for issue #210, comment cleanup — re-spawned
because an earlier verifier attempt was stopped before writing anything;
this is a fresh first real verdict". This context wrote no part of the
diff. Disclosure: the session scratchpad is shared with the parent
session (it holds the implementer's `codecheck.cjs`/`inventory.cjs`); this
pass wrote its own checker under `scratchpad/verifier/` and did not reuse
the implementer's outputs.

## Reasoning
Command check: the note's commands are `npm run build` + `npm run lint`,
verbatim from `doctrine/MEMORY.md`. Extra checks are labelled as extra. No
"tests pass" claim. Output not truncated.

| # | Criterion (from `-plan.md` / node row) | Implementer evidence | Independent check (this pass) |
|---|---|---|---|
| 1 | Every change in the ledger, report computed from it | ledger 117 entries, report generated from it | Ledger tally: `line_to_block 27`, `line_to_block+reword 2`, `header_block_to_line 49`, `header_trim 8`, `delete 30`, `reword 1` = 117 entries, 65 files, 106 `removed_lines`. These match the report's totals (30 / 29 / 49 / 8 / 106 / 1 / 65). Cross-checked against `git diff -U0 HEAD` (65 code files, 457 lines removed, 254 added). Every removed or added non-blank line matches a ledger `before`/`after` line, with 5 exceptions, all explained: 2 trailing `//` comments in `tailwind.config.js` (the ledger stores only the comment part), and `Item.vue`'s `<script setup lang="ts">/**` → `<script setup lang="ts">`, which is the disclosed fix. Every ledger file appears in the diff. |
| 2 | Zero code change | `checked 65 files, 0 with code changes` | **My own method, not theirs:** `@babel/parser` (typescript plugin) AST per script. It drops comments and locations but keeps `extra.raw`, so a literal's quoting or formatting would still show up. For `.vue` files, `@vue/compiler-sfc` blocks plus a byte-exact comparison of the non-script remainder (template, style, tags) and of the script `attrs`. Result: `verifier check: 65 files, 0 with code changes/errors`. Negative control on mutated copies: deleted `<script>` tag → `sfc parse: Invalid end tag`, injected token → `AST differs`, template edit → `non-script remainder differs`, so 3/3 caught. Also re-ran the implementer's `codecheck.cjs` (read it first): `checked 65 files, 0 with code changes`. |
| 3 | No placeholder header / multi-sentence `//` left | `0` / `0` + manual review | Re-ran `inventory.cjs` on the after-state: `raw 173 logical 138 line 67 block 71 trailing 0 inFn 9`, identical to the note. The only remaining `Date:` is the real `01/09/2026`. The only `Description:` at end of line is `Experiences.vue`, which is followed by real text. I read all 19 non-`Author` `//` groups myself: each is one sentence, either inside a function or on a config property or a non-exported `const` (checked the line after each). I also read every remaining single-line `/** */`: each one documents a getter, a type/interface member, a function, a component file, or is a `@type` pragma, so none should have become `//`. |
| 4 | Build + lint | `✨ Build complete!` exit 0, lint `0 errors, 13 warnings` | Re-ran on Node v24.19.0. `npm run build` → `build exit 0`, `└  ✨ Build complete!`, and the only "error" matches in the log are `error-500.mjs`/`error-*.mjs` chunk filenames. `npm run lint` → `✖ 13 problems (0 errors, 13 warnings)`, equal to the baseline. |
| 5 | Report contents | report sections listed | `-report.md` has Totals, Files modified (65 rows), all 30 deleted comments verbatim, and the converted comments before/after. This satisfies issue #210's Output list. |

Deletions, spot-checked against all 30 entries. Each one is a section
label (`// Vue`, `// Filter`), restates the code
(`// Tạo PDF`, the `cloneDeep` step narration), is commented-out code
(`/* import ... */`, the `tailwind.config.js` `colors:` block,
`// padding`, `/* res.send(html); */`), or is a signature-only JSDoc.
The two JSDoc deletions are `removeHtmlTags`'s
`@param input - string / @returns string` and the non-exported
`getDataCandidate`'s `format data / @param {*}`. Neither adds meaning
beyond the TS signature. `cloneDeep`'s JSDoc, which does add meaning, was
kept. No why-comment was lost. No link was removed: the only `http` text
in removed lines is the `Author:` lines, which were re-added (`Author:`
count is 58 at `HEAD` and 58 now). There were 0 `TODO|FIXME|HACK|XXX` in
the 92 in-scope files at `HEAD`, so none could be lost. The scope list
`files.txt` equals `git ls-files` `.ts/.js/.mjs/.cjs/.vue` minus
`agent-hub/`/`.claude/` (exact diff match).

Operator decisions:
- Decision 1 (multi-sentence wins inside functions) is applied, e.g.
  `app.vue`, `nuxt.config.ts` #109/#117, and the in-function blocks in
  `createPDF.ts` and `AboutMe.vue`.
- Decision 2 (keep `Author:`, drop placeholder `Date` and empty
  `Description:`) is applied in all 57 headers: 49 became `//`, 8 were
  trimmed and kept as `/** */`.

Rewords:
- #26 (`server/**/*.ts` → `every server/ .ts file`, to avoid an early
  `*/`) keeps the meaning.
- #121: the dropped "private-use marker" sentence is stale. A `grep`
  shows no marker/PUA usage left in `AboutMe.vue`.
- #122 only removes a garbled self-correction.

Forbidden states: none hit.
- `ADHOC_WORK`: no. The node exists and traces to #210.
- `NO_EVIDENCE`: no. The plan, diff, report and ledger notes are present.
- `EDIT_UNVERIFIED`: no. Build and lint were re-run clean.
- `CODE_IN_HAVEN`: no. The only change under `haven/` is the diagram row.
- `DIAGRAM_DRIFT`: no. The row matches the diff.

Seal gate: none needed (no commit, push or PR). Proportionality: the
diff is limited to comments in the 65 files plus the one diagram row,
and the out-of-scope items (`_log`, template `<!-- -->` comments) were
correctly left in "Noticed, not done".

Observation, not a blocker: some remaining `//` groups span 3-6 lines
while being one sentence (e.g. `Comments.vue:8`, `GitUser.vue:11`). The
node row explicitly defines the rule by sentence count
("`//` for single-sentence notes, `/** */` for ... any multi-sentence
comment"), so this is compliant as scoped. If the operator reads
issue #210's "`/** */` cho comment nhiều dòng" literally as line count,
that would be a new node, not a regression of this one. Also, the #122
reworded lines run to ~110 characters, wider than the surrounding wrap.
That is cosmetic, and lint is clean.

## Re-run
`partial`: I re-ran `npm run build` and `npm run lint`, plus my own
independent AST/SFC zero-code-change check and the implementer's
`codecheck.cjs`/`inventory.cjs`. No cold-cache wipe and no CDP (there is
no visual change, and the template remainder was proven byte-identical).
Reason: the spawning instruction explicitly asked for an independent
check of the highest-risk property plus build and lint, on a 65-file
sweep where the implementer's own first pass broke code twice.
