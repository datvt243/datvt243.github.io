# 2026-10-25 - deps-nuxt-4 (REOPEN)

- Worker: verifier · Version: 0.1.0
- Node: `deps-nuxt-4` (`haven/diagrams/dev-loop.prime-mermaid.md`, last row, state `sealed_pending_verifier`, left unchanged)
- Notes graded: `evidence/implementer/2026-10-25/deps-nuxt-4-{plan,diff}.md`
- Worktree: repo root, branch `feature/263`, uncommitted vs `staging` @ `5fa6885`
- Verdict: **REOPEN**

## Isolation proof
Separately spawned verifier subagent. Its Agent-tool task string starts "You are the VERIFIER in this repo's agent-hub, run as an isolated subagent (you did not write the diff)" and names the implementer's scratchpad `scratchpad/n4/` as read-only reference. The implementer's task was issue #263 "chore(deps): Phase 3.6 — Nuxt 3→4 migration". All my output is in `scratchpad/verify-263/`. I started no servers.

## Re-run
`partial`: cold-cache `npm run build` (after `rm -rf .nuxt .output node_modules/.cache`), `npm run lint`, `npx nuxi typecheck`, `npm ls vue-router`, and a clean `npm ci --ignore-scripts` of the branch's `package.json` + lockfile in `scratchpad/verify-263/ci/`. I did not re-run SSR parity, the PDF check, CDP, or npm audit. Reason: outward-facing change (framework major headed for production). The operator asked for at least build, lint and typecheck. Once a gap turned up I stopped there, since the recipe says not to spend more re-runs on a note that is already short.

## My results
- Node v24.19.0.
- `npm run build` → rc=0, `◆ ✨ Build complete in 15.1s!`, `grep -c WARN` = 0, `grep -c nuxt/server` = 0. Matches the note.
- `npm run lint` → rc=0, no output after `eslint .`. Matches.
- `npx nuxi typecheck` → rc=0, 0 `error TS`, last line `✔ Nuxt Icon discovered local-installed 3 collections: fe, grommet-icons, heroicons`. Matches.
- `npm ls vue-router` → **rc=1**:
  ```
  ├─┬ @nuxt/ui@3.3.7
  │ └── vue-router@5.4.0 deduped invalid: "^4.5.0" from node_modules/@nuxt/ui
  ...
  └── vue-router@5.4.0 invalid: "^4.5.0" from node_modules/@nuxt/ui
  npm error code ELSPROBLEMS
  npm error invalid: vue-router@5.4.0 …/node_modules/vue-router
  ```
  `@nuxt/ui@3.3.7` (the last 3.x, per `npm view @nuxt/ui@3 version`) declares the optional peer `vue-router: ^4.5.0`. `@nuxt/ui@latest` (4.12.0) declares `^4.5.0 || ^5`.
- Clean `npm ci --ignore-scripts` with the branch lockfile → rc=0, no ERESOLVE (because the peer is optional), so install on deploy is not blocked.

## Why REOPEN
1. **The `npm ls` output in the note is paraphrased and hides a failure (steps 5 and 7).** The diff note gives `npm ls nuxt vue vue-router → nuxt@4.6.2, vue-router@5.4.0` as the evidence for the node's first acceptance criterion. The real command exits 1 with `ELSPROBLEMS` and marks vue-router as `invalid` against @nuxt/ui 3.3.7's peer range. This is new on this branch: the staging baseline resolved vue-router 4.6.4, so there was no conflict. The note doesn't mention it anywhere, including `## Noticed` and `## Still open`.
   Needed: quote the `npm ls` output verbatim, including rc. Then make the decision explicit, either:
   - (a) accept the out-of-range optional peer, with the reason (optional peer, `npm ci` rc=0) and runtime proof that the router-backed @nuxt/ui parts used by the theme still work. The existing click-nav/SSR evidence may be enough if the note says which @nuxt/ui components route through vue-router. Record the @nuxt/ui 4 bump (`^4.5.0 || ^5`) as a follow-up under `## Still open`/`## Noticed`; or
   - (b) another resolution, with fresh build/lint/typecheck.
2. **The `## Acceptance` table has no "comments per code-comments.md" row (step 7, code-comments.md Enforcement).** The diff adds new source (`composables/useResumeData.ts`) and edits 6 index sites. The row must cite every comment the diff adds or changes, or say "no comments touched". The standard makes a missing row an automatic REOPEN.

## Acceptance criteria (rest audited, no gap found)
| Criterion | Evidence | OK |
|---|---|---|
| nuxt 4.6.x / vue-router 5.x | versions confirmed by my `npm ls`, but rc=1 was not disclosed (reason 1) | no |
| `@nuxt/schema` pin dropped | note + my `npm ls`: every path `@nuxt/schema@4.6.2` | yes |
| build/lint/typecheck clean vs baseline, `nuxt/server` warnings gone, no new | note + my re-run (0 WARN vs baseline 7) | yes |
| duplicate `api-resume` resolved | `useResumeData`; A/B dev warning on staging, absent on branch | yes |
| SSR parity, 10 routes + 1 post | `head.cjs` SAME ×10, post 200; inline-style → stylesheet change explained | yes |
| ISR routeRules emitted | `nitro.mjs` `isr": 60` ×6, `isr": true` ×1 | yes |
| `/api/generate-pdf` binary | 200 `application/pdf`, 160795 B, `%PDF-` | yes |
| real browser: 5-tab click-nav, KeyNav, color mode, vi↔en, 0 new console errors, 0 hydration | `func.cjs` output, with A/B for the one pre-existing reka-ui warning | yes |
| npm audit before/after | 50 → 43 | yes |
| typecheck row (MEMORY.md) | present + my re-run | yes |
| comments per code-comments.md | **missing** (reason 2) | no |
| Supersedes / Still open (7b) | `## Supersedes: none`; only one #263 row on the active diagram | yes |

## Vercel preview / runtime Node (`## Still open`): legitimately deferred, not a REOPEN reason
This follows the #260 precedent (`evidence/verifier/2026-10-24/deps-puppeteer-25-seal.md` (b)). A preview deploy needs a push, which is itself behind the seal gate, so requiring it before SEAL would deadlock the node. That precedent's condition carries forward to the eventual SEAL: the SEAL does not complete issue #263. Its PR must not close #263 until a Vercel preview shows that (1) every route in CLAUDE.md's Pages & Caching table renders SSR with ISR, KeyNav, color mode and the i18n prefix, and (2) the deployment's Node runtime satisfies `^22.22.3 || ^24.15.0 || >=26`. The 403 on the Vercel team scope still needs the operator.

## Forbidden states
`ADHOC_WORK` no (node row exists) · `NO_EVIDENCE` no · `EDIT_UNVERIFIED` **partial hit**: claimed npm ls result does not match the real output (reason 1), and the comments row is missing (reason 2) · `CODE_IN_HAVEN` no · `DIAGRAM_DRIFT` no (row exists; unchanged on REOPEN).

## Seal gate / proportionality
No commit, push or PR. The scope matches the node: deps, one composable, 6 `!` for `noUncheckedIndexedAccess`, and doc version strings.

## Not checked by me
SSR parity, PDF, CDP functional run, npm audit: not re-run (audited from the note). I did not open the diff.
