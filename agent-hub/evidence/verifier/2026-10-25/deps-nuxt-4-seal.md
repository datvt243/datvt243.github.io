# 2026-10-25 - deps-nuxt-4 (SEAL)

- Worker: verifier · Version: 0.1.0
- Node: `deps-nuxt-4` (`haven/diagrams/dev-loop.prime-mermaid.md`), verification pass 2
- Notes graded: `evidence/implementer/2026-10-25/deps-nuxt-4-{plan,diff}.md`, mainly `## Rework 1`
- Responding to: `evidence/verifier/2026-10-25/deps-nuxt-4-reopen.md`
- Worktree: repo root, branch `feature/263`, uncommitted vs `staging` @ `5fa6885`
- Verdict: **SEAL**. The condition below still applies: this SEAL does not complete #263.

## Isolation proof
This pass was spawned as a separate verifier subagent. Its Agent-tool task string starts "You are the VERIFIER in this repo's agent-hub, run as an isolated subagent (you did not write the diff)" and says "This is verification pass 2". It names the implementer scratchpad `scratchpad/n4/` as read-only reference. My own output went to `scratchpad/verify-263b/`. The implementer's task was issue #263 "chore(deps): Phase 3.6 — Nuxt 3→4 migration (incl. vue-router 5)". I did not write the diff, and I am also not the pass-1 verifier (that pass used `scratchpad/verify-263/`).

## Re-run
`partial`. Reason: this is an outward-facing framework major headed for production, and the operator asked for at least build, lint and typecheck. What I re-ran:
- cold-cache build, lint and typecheck
- `npm ls --all` and `npm ls vue --all`
- a clean `npm ci --ignore-scripts` of the branch lockfile
- the @nuxt/ui runtime grep
- a prod-server SSR smoke on 7 routes, plus the PDF endpoint
- a CDP hydration and click check on the prod build

I did not re-run the 10-route `head.cjs` parity diff against the baseline, the KeyNav, color-mode or locale-switch flows, or `npm audit`. Those I audited from the note.

## My results (Node v24.19.0)
- `rm -rf .nuxt .output node_modules/.cache && npm run build` → rc=0, `◆ ✨ Build complete in 14.5s!`, `grep -c WARN` = 0, `grep -c nuxt/server` = 0.
- `npm run lint` → rc=0, no output after `eslint .`.
- `npx nuxi typecheck` → rc=0, 0 `error TS`, last line `✔ Nuxt Icon discovered local-installed 3 collections: fe, grommet-icons, heroicons`.
- `npm ls --all` → rc=1. The `npm error invalid` lines match the note's Rework 1 exactly:
  ```
  npm error invalid: vue-router@5.4.0 …/node_modules/vue-router
  npm error invalid: magic-string@0.30.12 …/node_modules/magic-string
  npm error invalid: unplugin@2.3.11 …/node_modules/@nuxt/ui/node_modules/unplugin
  ```
- `npm ls vue --all` → `31 vue@3.5.44`, with no other `vue@` version. `npm view nuxt@4.6.2 dependencies.vue` → `^3.5.44`. All seven `@vue/{compiler-sfc,compiler-dom,runtime-dom,runtime-core,server-renderer,shared,reactivity}` packages are at 3.5.44.
  - The only other compiler copy is the nested build tool `@vue-macros/common/node_modules/@vue/compiler-sfc` at 3.5.42. Staging's lockfile already had nested 3.5.42 compiler copies under `@dxup/nuxt`, so this is not new.
- The vue change only touches the lockfile:
  - `package.json` vue is still `"latest"` at lines 31 and 49. The only vue-related `package.json` change vs staging is `vue-router` going from `latest` to `^5.4.0`.
  - In the lockfile, `node_modules/vue` goes from 3.5.12 to 3.5.44.
- Clean `npm ci --ignore-scripts` of the branch `package.json` + lockfile in `scratchpad/verify-263b/ci/` → rc=0, and resolves vue to 3.5.44.
- `grep -rl vue-router node_modules/@nuxt/ui/dist/runtime --include='*.js' --include='*.vue' --include='*.mjs' | grep -v /runtime/vue/ | wc -l` → `0`. This matches the note.
- Prod server (`.env` loaded, `PORT=4211 node .output/server/index.mjs`):

  | Route | Status | Bytes | Title |
  |---|---|---|---|
  | `/` | 200 | 84387 | Resume Võ Tấn Đạt |
  | `/en` | 200 | 84231 | |
  | `/projects` | 200 | 41543 | Dự án |
  | `/github` | 200 | 89500 | |
  | `/contact` | 200 | 29304 | |
  | `/blogs` | 200 | 38097 | |
  | `/blogs/67123bdf9c6e9bcf4f7bf006` | 200 | | Cài đặt iTerm2, Oh My Zsh, … |

  `/api/generate-pdf?lang=vi` → `200 application/pdf 160795`, and the file starts `%PDF-`. The server log had no error or warn lines. I killed the server afterwards.
- CDP :9888 against the prod build (`scratchpad/verify-263b/hyd.cjs`; I closed the tab afterwards):
  - Pages visited: `/`, `/projects`, `/github`, `/blogs`, `/en/contact`. Text lengths were 1198/1141/3100/747, matching the note's figures for the first four. `<html lang>` was vi-VN for the vi routes and en-US for `/en/contact`.
  - Real header-link click → `/en/projects`, textLen=1137.
  - `hydration: 0`, `msgs: []`. The only messages I filtered out were the documented pre-existing `VISIT:TRACK ----- FetchError: [POST] "https://nodejs-resume-api-ts.onrender.com/api/me/…/visit"` lines.

## REOPEN items, each closed
1. **`npm ls` had been paraphrased and hid rc=1.**
   - Rework 1 now quotes `npm ls vue-router` verbatim, with `npm error code ELSPROBLEMS` and `rc=1`.
   - It also quotes `npm ls --all` with an A/B against staging. Staging had 4 invalid entries; this branch has 3. vue-router is the only new one. `@nuxt/schema` and `cac` are fixed; `magic-string` and `unplugin` are pre-existing. My own `npm ls --all` reproduces this exactly.
   - The decision is explicit, option (a): accept the out-of-range *optional* peer. The note gives the reason (nuxt 4.6.2 requires `vue-router ^5.4.0`, a single router copy is needed, and 3.3.7 is the last @nuxt/ui 3.x). It names which @nuxt/ui code would route through vue-router: in Nuxt mode none does, and `Link.vue` uses `#imports`. That is backed by the grep (0 files, reproduced), by typecheck, and by a runtime run with 0 errors (the note's dev run plus my prod CDP run).
   - The @nuxt/ui 4 follow-up is recorded as #264. **Closed.**
2. **The "comments per code-comments.md" row was missing.** It is now present in Rework 1's acceptance rows. My own check against `doctrine/standards/code-comments.md`:
   - The only comment the diff adds is the `composables/useResumeData.ts` `@file` block. It explains WHY ("Nuxt 4 shares a key's data across callers and expects one handler per key", a non-obvious framework constraint). It contains no issue ref (the `(#263)` was removed). It uses `/** */` for more than one sentence, with no `*/` in the prose.
   - Its `@author`/`@see` tags are not required, because the file-header opt-in is OFF. They match the sibling `useDownloadResume.ts` and come after the prose, so they are not a violation.
   - `git diff -U0 staging -- '*.vue' '*.ts' | grep -E '^[+-].*(//|/\*|\* )'` → empty, so no other comment was added or removed. **Closed.**

## The rework's new change: vue 3.5.12 → 3.5.44 (`npm update vue`, lockfile only)
- **Justified.** `nuxt@4.6.2` declares `vue: ^3.5.44`, and vue-router 5 has the peer `vue: ^3.5.34 || ^4`. The lockfile's 3.5.12 violated both. The `"overrides": { "vue": "latest" }` hid this from `npm ls`, so the earlier SEAL candidate was running vue below Nuxt's floor.
- **Inside the node's scope.** It is the minimum needed to make "nuxt 4.6.x" a valid install. `package.json` is untouched, and it is a patch-line bump within 3.5.x.
- **Re-verified.** The note re-ran everything on 3.5.44:
  - build, lint and typecheck rc=0
  - `head.cjs` SAME ×10, the post returns 200, the PDF works
  - the dev browser run gives the same click-nav, KeyNav, color-mode and vi↔en results, 0 hydration, and only the A/B'd pre-existing reka-ui warning
  - audit 50 → 17

  It explains the two failed dev runs (a one-time Vite re-optimize of `@vue/devtools-core`, and stale CDP tabs) before showing two clean ones. My own re-runs above confirm the build side and the prod runtime on 3.5.44.

## Acceptance criteria
| Criterion | Evidence | OK |
|---|---|---|
| `npm ls nuxt vue-router` 4.6.x/5.x | Rework 1 verbatim, rc=1 disclosed and decided (a), follow-up #264. My `npm ls --all` matches | yes |
| `@nuxt/schema` pin dropped | note + pass-1 `npm ls` (all 4.6.2). `@nuxt/schema` is gone from the invalid list (my `npm ls --all`) | yes |
| build/lint/typecheck clean vs baseline, the 5 `nuxt/server` warnings gone, no new ones | note + my cold re-run: rc=0 ×3, 0 WARN (baseline 7), 0 TS errors | yes |
| duplicate `api-resume` resolved | `useResumeData`. A/B: the dev warning appears on staging and not on the branch (note) | yes |
| SSR parity: 10 routes + 1 post | note `head.cjs` SAME ×10 on 3.5.44, post 200. My smoke: 7 routes 200 with real titles | yes |
| ISR routeRules emitted | note `nitro.mjs` `isr": 60` ×6 / `isr": true` ×1 | yes |
| `/api/generate-pdf` → `application/pdf` | note (164689 B) + mine (160795 B, `%PDF-`) | yes |
| real browser: 5-tab click-nav, KeyNav, color mode, vi↔en, 0 console errors (new), 0 hydration | note `func.cjs` output on 3.5.44 + A/B. My prod CDP: 0 hydration, 0 unexplained messages | yes |
| `npm audit` before/after | 50 → 17 (note, not re-run) | yes |
| Typecheck row (MEMORY.md) | present + my re-run | yes |
| comments per code-comments.md | Rework 1 row + my check above | yes |
| Supersedes / Still open (7b) | `## Supersedes: none`. #263 has one row only | yes |

## Condition carried forward: Vercel preview / runtime Node, deferred past SEAL
This follows the #260 precedent (`evidence/verifier/2026-10-24/deps-puppeteer-25-seal.md`), which the pass-1 verifier also ruled on. **This SEAL does not complete issue #263.** Its PR must not close #263 until a Vercel preview shows two things:
1. Every route in CLAUDE.md's Pages & Caching table renders with SSR + ISR, KeyNav, color mode and the i18n prefix.
2. The deployment's Node runtime satisfies `^22.22.3 || ^24.15.0 || >=26`.

The Vercel MCP 403 on team scope `david-vos-projects-7b8f3576` still needs operator action.

## Forbidden states
None hit:
- `ADHOC_WORK`: no
- `NO_EVIDENCE`: no
- `EDIT_UNVERIFIED`: no. Both pass-1 gaps are closed, and my re-runs match the note.
- `CODE_IN_HAVEN`: no
- `DIAGRAM_DRIFT`: no

## Seal gate / proportionality
- No commit, push or PR.
- The scope still matches the node: deps, one composable, 6 `!` for `noUncheckedIndexedAccess`, and doc version strings. The rework added only the lockfile-only vue bump that Nuxt 4.6.2's own dependency range requires.

## PM status
Collapsed on SEAL:
- The full row (state SEALED) was appended to `haven/diagrams/dev-loop-archive.md`.
- The active row was replaced in place with a pointer to this note.
- That made 21 pointers, so the oldest one (`object-parameter-rule`, whose full row is already in the archive) was deleted. 20 remain.

## Not checked by me
- `head.cjs` 10-route baseline diff, KeyNav, color-mode and locale-switch flows, and `npm audit`: audited from the note, not re-run.
- I did not open the diff, apart from the grep-level spot checks quoted above.
