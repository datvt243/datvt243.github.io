# 2026-11-05 - hero-greeting-whoami (verdict: SEAL)

- Worker: verifier · Version: 0.1.0
- Node: `hero-greeting-whoami` (#383, `feature/383`)
- Input: `evidence/implementer/2026-11-05/hero-greeting-whoami-diff.md`

## Isolation proof
Separate Agent-tool subagent, spawned with the task string "You are the VERIFIER worker for the agent-hub of the repo ... Target: the evidence note `agent-hub/evidence/implementer/2026-11-05/hero-greeting-whoami-diff.md` ... You are a separate subagent spawn, independent of the implementer." Its own scratchpad dir is `scratchpad/v383/`. The implementer's server ran on :4188; this pass used :4189. I did not write this diff.

## Re-run
partial. The node is outward-facing: it changes the homepage hero text on the live site. Re-ran `npm run build`, `npm run lint`, `npx nuxi typecheck` and `npm test`, then started a prod server on :4189 (`node --import m/redirect.mjs`, with `NODE_API`/`NUXT_PUBLIC_NODE_API`/`NUXT_NODE_API` pointed at the mock on :4199) and curled `/` and `/en`. The Playwright browser check was not re-run; I audited the note's version instead.

## Cited
| Criterion | Evidence |
|---|---|
| 1 `resume.greeting` = `$ whoami` in en + vi | Note's diff rows 1–2. Re-run SSR: `/` (`lang="vi-VN"`) and `/en` (`lang="en-US"`) both render `$ whoami`; old strings "Hi there" / "Xin chào! Tôi là" counted 0 on both pages |
| 2 `$ whoami_` on `/` and `/en`, real browser | Re-run SSR on both routes: `<p class="text-theme-accent-soft mb-4">$ whoami<span class="text-theme-text">_</span></p>`. Note's Playwright output: `"before":"$ whoami_","afterSwitch":"$ whoami_","lang":"vi-VN"`, console `Errors: 0, Warnings: 0` |
| 3 build + lint + typecheck + test clean | Re-run: `build=0` `◆ ✨ Build complete in 14.8s!` · `lint=0` · `tc=0` with 0 `error TS` · `test=0` `Test Files  8 passed (8)` / `Tests  20 passed (20)`. These match the note |
| comments per code-comments.md | Note: no comments added or changed |
| Mock only | `grep -c onrender server.log` = 0 and the same in `mock.log`. The mock got `GET /api/me/...?lang=vi` and `?lang=en` |

## Missing
none

## Checks
- Commands match `doctrine/MEMORY.md`, including the Typecheck row. Output is not cut.
- Forbidden states: none hit. The node is on the diagram, the evidence note exists, the claims were re-run, there is no code in `haven/`, and the PM status is updated below.
- Seal gate: no outward action in the diff. Commit and push are left to `/ship`.
- Proportionality: 2 locale values plus 1 whitespace change in `Hero.vue`. That is the minimum the node needs.
- `## Supersedes: none` and `## Still open: none` are present. No other open row exists for #383.

## Verdict
SEAL. The PM row was collapsed into `dev-loop-archive.md`. The oldest pointer row (`experience-skills-after-desc`, already in the archive) was dropped to keep 20.
