# 2026-11-01 - remove-unused-deps-helpers — SEAL

- Worker: verifier · Version: 0.1.0
- Node: `remove-unused-deps-helpers` (issue #303, branch `feature/303`)
- Graded note: `evidence/implementer/2026-11-01/remove-unused-deps-helpers-diff.md`
- Verdict: **SEAL**

## Isolation proof
Spawned as a separate Agent-tool subagent from `/todo` pass 2 with the task string "You are the VERIFIER pass of this repo's agent-hub, run from `/todo` as a separate subagent with a clean context (NeverVerifyOwnWork) ... Grade the implementer's note ...". This context loaded the verifier bundle cold and wrote none of the diff; the implementer's task string (note line 5) differs.

## Re-run
none — audit only. Note output is verbatim with exit codes, commands match `doctrine/MEMORY.md`, node is not outward-facing / not a `/release` gate.

## Command check (step 4)
`npm run build` (`build=0`, `◆ ✨ Build complete in 16.7s!`), `npm run lint` (`lint=0`), `npx nuxi typecheck` (`typecheck=0`), `npm test` (`Tests  14 passed (14)`, `test=0`) — all four match `doctrine/MEMORY.md` verbatim. Build was run against the local mock (`NODE_API`/`NUXT_PUBLIC_NODE_API=http://127.0.0.1:4199`). No truncation (step 5): build log stated full, 157 lines; the one WARN is the pre-existing `@__NO_SIDE_EFFECTS__` annotation, cross-referenced to #302's build.

## Acceptance, one by one (step 7)
| Criterion | Cited evidence | OK |
|---|---|---|
| Each removal re-verified by grep before removing | `git grep "Barlow" HEAD` (excl. the folder + evidence/histories) `exit=1`; untracked `review/`, `.playwright-mcp/` also `exit=1`. `git grep "dotenv\|runtime-core\|sass-embedded"` → only `package.json` lines + `tsconfig.json:7` | yes |
| `dotenv` removal safe | Only `package.json`; no source import. Note cites `@nuxt/kit` optional-peer fallback guarded by `nodeUtil.parseEnv` (Node ≥24, `engines.node >=24`); `nitropack`→`c12` keeps nested `dotenv@17.4.2` (`npm ls`) | yes |
| `@vue/runtime-core` removal safe | Not fully unreferenced (`tsconfig.json:7` types) — disclosed, not hidden. Still resolves as `vue@3.5.44 → @vue/runtime-dom → @vue/runtime-core@3.5.44` (`npm ls`); `typecheck=0` proves the `types` entry still resolves. Removing the tsconfig line deferred to "Noticed, not done" — correct scope | yes |
| Only one of sass/sass-embedded | `npm ls`: `sass@1.99.0`, no sass-embedded; 34 lock entries removed listed; compiled nested `styles.scss` rule quoted from served CSS | yes |
| Barlow removed, nothing references it | 19 files staged deleted; `barlow 404`, `og-image 200 21913` (the PNG it once rendered is static) | yes |
| One shared `escapeHtml` in `utils/`, auto-imported, used in 3 places | New `utils/escapeHtml.ts` quoted; diff of 3 local copies removed; `grep` shows only `utils/escapeHtml.ts:6` client-side; `.nuxt/imports.d.ts:44` export; typecheck 0; AboutMe heading markup rendered (`aboutBold:1`, SSR sample `Giới thiệu`). Merged variant adds `String(str)` — identical for AboutMe's string args | yes |
| build + lint + typecheck + test clean | see Command check | yes |
| Pages render, styles/fonts load | 6 routes `200`; entry CSS `200 233762`; Fira woff2 `200 font/woff2`; headless Chrome `firaLoaded:true`, `console errors: []`, `onrender hits: 0` | yes |
| comments per code-comments.md | "No comments added or changed"; new file only has the standard `@author`/`@see` header | yes |

## Supersedes check (step 7b)
Note has `## Supersedes: none` with the grep that backs it. OK.

## Forbidden states (step 8)
ADHOC_WORK: no (node row existed). NO_EVIDENCE: no. EDIT_UNVERIFIED: no (all four outputs verbatim). CODE_IN_HAVEN: no (only diagram rows touched in haven). DIAGRAM_DRIFT: no (updated here). `forbidden_hit: null`.

## Seal gate (step 9)
Not outward-facing beyond a dep/asset cleanup; no commit/push/PR made. None needed.

## Proportionality (step 10)
Diff touches exactly the issue's items; 4th server-side `escapeHtml` and tsconfig `types` line correctly left as "Noticed, not done".

## PM status (step 12)
Full row appended to `haven/diagrams/dev-loop-archive.md` as SEALED; active row replaced in place by pointer; active pointer count went to 21, so the oldest pointer (`github-own-repos-recent`, full row confirmed in archive) was deleted → 20.

## Result
`{verdict: SEAL, node: remove-unused-deps-helpers, missing: [], forbidden_hit: null, pm_updated: true, rerun: none}`
