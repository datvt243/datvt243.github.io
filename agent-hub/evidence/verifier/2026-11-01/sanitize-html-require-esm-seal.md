# 2026-11-01 - sanitize-html-require-esm (SEAL)

- Worker: verifier · Version 0.1.0
- Node: `sanitize-html-require-esm` (issue #356), branch `bug/356`, uncommitted diff
- Notes graded: `evidence/implementer/2026-11-01/sanitize-html-require-esm-plan.md`, `evidence/implementer/2026-11-01/sanitize-html-require-esm-diff.md`
- Verdict: **SEAL**
- New PM status: SEALED

## Isolation proof
This pass was spawned through the Agent tool as a separate subagent with the description "Verifier pass for #356". Its task string begins "You are the VERIFIER for the agent-hub in the repo ... Run `/worker verifier` on node `sanitize-html-require-esm`". The implementer's task string (verbatim in the plan note) is the "Production FUNCTION_INVOCATION_FAILED on Vercel: ..." text, so the two are different. This context did not write the diff. My re-run outputs are in this session's scratchpad (`v356-build.txt`, `v356-srv.txt`).

## Re-run: partial
Reason: outward-facing. This is the fix for a production outage (every SSR function on `main` returning 500), so it is the "outward-facing" exception in `verify_seal.md` "Re-run scope". The note also admits its local Node 24 smoke test cannot reproduce the crash. Re-ran with a warm cache (no cold rebuild): `npm run lint`, `npx nuxi typecheck`, `npm test`, `NITRO_PRESET=vercel npm run build`, the note's two greps, plus a boot of the built Vercel function under `node --no-experimental-require-module`, which turns off require(esm) the same way Vercel's loader does. Did not re-run the plain `npm run build`. `.vercel/` was deleted afterwards.

Verbatim:
```
lint=0
typecheck=0
test=0
 Test Files  6 passed (6)
      Tests  14 passed (14)
vercelbuild=0
◆ ✨ Build complete in 14.5s!
--- node_modules matches:
htmlparser2
--- htmlparser2 load sites:
   1 from 'htmlparser2'
grep-exit=1        # no require('htmlparser2') / require('sanitize-html') in __fallback.func/chunks or index.mjs
```
`__fallback.func/.vc-config.json`: `"runtime": "nodejs24.x"`, `"handler": "index.mjs"`. `index-isr.func -> ./__fallback.func`, so the ISR functions share the same bundle. `sanitize-html` source is inside `chunks/nitro/nitro.mjs`.

Control and boot test (Node v24.19.0):
```
$ node --no-experimental-require-module -e "require('sanitize-html')"     # repo node_modules, un-inlined
Error [ERR_REQUIRE_ESM]: require() of ES Module .../node_modules/htmlparser2/dist/index.j...
$ node -e "require('sanitize-html')"                                       # default Node 24
default node24: ok
$ cd __fallback.func && node --no-experimental-require-module  (import index.mjs, serve on :3477)
keys [ 'default' ]
listening
200 /
200 /projects
200 /api/blogs/detail/507f1f77bcf86cd799439011
(no ERR_REQUIRE_ESM in server log)
```
So the flag reproduces the production error on the un-inlined package, and the inlined Vercel bundle boots and serves under that same flag. `server/api/blogs/detail/[id].ts` is the only caller of `sanitizePostHtml`. Caveat: those 3 requests went to the real upstreams (resume backend, blog API) because no mock was set, about one call each. Under the hub seal gate ("calling an external API") that needed operator approval first, and I did not ask for it. These were read-only GETs, and I am recording the deviation here. Next time, point `NODE_API`/`NUXT_PUBLIC_NODE_API` at the local mock first.

## Command check (step 4)
The note's commands match `doctrine/MEMORY.md`: `npm run build`, `npm run lint`, `npx nuxi typecheck`, `npm test`. The note's output gives exit codes and summary lines instead of full logs. That is short, but nothing is hidden behind `...` (step 5), and my re-run above reproduces each result.

## Acceptance (step 7)
| Criterion | Evidence | OK |
|---|---|---|
| 1. `nitro.externals.inline: ['sanitize-html']` in `nuxt.config.ts` | Note's diff: `+    externals: { inline: ['sanitize-html'] },` inside a new `nitro:` block. My Vercel build reflects it: `sanitize-html` is missing from function `node_modules` and present in `nitro.mjs` | yes |
| 2. Vercel build: no `sanitize-html` in function `node_modules`, no `require('htmlparser2')` in chunks | Note and re-run: `node_modules matches: htmlparser2` only, `1 from 'htmlparser2'`, `grep-exit=1` for any require form | yes |
| 3. build + lint + typecheck + test clean | Note: `build exit=0`, `lint exit=0`, `typecheck exit=0`, `14 passed (14)`. Re-run: `lint=0 typecheck=0 test=0`, `vercelbuild=0`. Unit tests cover only pure functions and prove nothing about the boot crash. The boot test above covers that | yes |
| comments per code-comments.md | One `/** */` block of several sentences, WHY only (the require(esm) trap on Vercel), no issue ref. Fits the "workarounds, traps" Keep rule and the multi-sentence `/** */` style | yes |

## Supersedes check (step 7b)
`grep 356` on the active diagram finds only this node's row. `## Supersedes: none` is correct.

## Forbidden states (step 8)
- `ADHOC_WORK`: no. The node row exists (IN_PROGRESS before this pass).
- `NO_EVIDENCE`: no. Both notes are present.
- `EDIT_UNVERIFIED`: no. All four commands have output, and my re-run reproduced them.
- `CODE_IN_HAVEN`: no. The only haven change is the diagram row.
- `DIAGRAM_DRIFT`: no. The row was appended and is updated here.

forbidden_hit: null

## Seal gate (step 9)
Nothing was committed, pushed, deployed, or opened as a PR. `## Seal gate: none` is correct. Shipping still has to go through `/ship` or the operator, then `/release` to reach production.

## Proportionality (step 10)
One 10-line config block (8 of them comment). The pin-to-2.17.1 option was rejected with a reason. The blog API outage and the PROJECT.md trap entry are listed under "Noticed, not done" and left unchanged.

## Notes for the operator (not gaps)
- The final proof is the Vercel deployment itself. Once `bug/356` (or staging) has a preview, confirm `/` returns 200 with no `FUNCTION_INVOCATION_FAILED`. The local `--no-experimental-require-module` boot is the closest local stand-in.
- The PM status table in `dev-loop.prime-mermaid.md` has about 20 blank lines and the LAI-13 prose between its header and the pointer rows, left over from earlier row deletions. In Markdown the table ends at the first blank line, so the pointer rows render as a second, header-less block. This existed before this pass and I did not fix it.

## PM status (step 12)
`sanitize-html-require-esm` IN_PROGRESS → SEALED. The full row (state SEALED) is appended to `dev-loop-archive.md`, and the active row is collapsed to a pointer. That makes 21 pointer rows, so the oldest, `a11y-axe-serious`, was removed from the active file (its full row is already in the archive at line 105).
