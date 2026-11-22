# 2026-11-17 - visit-local-count — SEAL
Worker: verifier · Version: 0.1.0 · Node: haven/diagrams/dev-loop.prime-mermaid.md → `visit-local-count` (IN_PROGRESS → SEALED)
Judged: `evidence/implementer/2026-11-17/visit-local-count-diff.md` (+ plan `2026-11-17/visit-local-count-plan.md`, older `2026-11-05/visit-local-count-plan.md`)
Feature doc: `doctrine/features/visit-tracking.md` — Behavior 7 + Acceptance criteria (fix SEAL: doc Status left `draft`, per step 11e)

## Isolation proof
Fresh Agent-tool spawn, prompt opens "You are the `verifier` worker in the datvt243.github.io agent-hub (repo ..., branch bug/389)" and carries the scratch dir `.../039592be-bb1b-4236-b1c8-1b3f64767d2b/scratchpad/verifier/`; no implementer reasoning in context, judged only from the notes + own re-run below.

## Re-run: partial
Reason: outward-facing node (changes whether the live site records visits in production). Re-ran `npm run build` and the built server only; lint/typecheck/test and the browser runs NOT re-run (audited from the note).
Env at build AND runtime: `NODE_API=NUXT_PUBLIC_NODE_API=http://localhost:4799` (verifier mock).
- `npm run build` → `build exit 0`, `◆ ✨ Build complete in 15.7s!`; the only `error` grep hits are file names (`error-template.mjs`, `error-DhXKUbjL.mjs`); `nodejs-resume-api` in build log: `0`.
- Compiled `.output/server/chunks/routes/api/visit.post.mjs`: `29:  if (process.env.VERCEL) {` / `30:    await $fetch(...visit` / `37:  setResponseStatus(event, 204);` → the guard is read at runtime, not inlined at build.
- `node .output/server/index.mjs`, PORT 3410, `env -u VERCEL`: `local status=204`, `local(no xff) status=204`, `mock visit POSTs from local server: 0`.
- Same build, PORT 3411, `VERCEL=1`: `vercel status=204`, `mock visit POSTs from VERCEL=1 server: 1`, mock line `MOCK POST /api/me/votan.it@gmail.com/visit xff=203.0.113.7`.
- `onrender hits: local=0 vercel=0 mock=0`. Mock + both servers stopped (`all stopped`).

## Criteria
| Criterion (feature doc #389 + node) | Evidence | OK |
|---|---|---|
| dev + mock, 5 routes → 0 visit POSTs, no console error | note run 1: `mock visit POSTs (dev): 0`, `DIRECT_BACKEND 0`; console errors only 502 resume / 503 blog / dev CSP, none visit-related (mock's `{}` body; server-only diff) | yes |
| preview + mock → 0 visit POSTs | note run 2 `mock visit POSTs this run: 0`; re-run `mock visit POSTs from local server: 0` | yes |
| one-line WHY comment + root CLAUDE.md line | note ## Diff quotes both; `//`, WHY, no issue ref | yes |
| root cause from real local run | note ## Root cause: runtime `NODE_API` = real backend from `.env` (PID 24185 had no override, 11-05 note), relay forwards `xff=::1` (mock, real runs). Which backend outcome the reporter saw is stated as unconfirmable without the real backend/DB (user rule) and moot under Behavior 7 — accepted as named from real output with the limit declared | yes |
| build/lint/typecheck/test clean | note ## Commands: build `Build complete`, lint exit 0, typecheck `error TS` 0, `Tests  28 passed (28)`; build re-run clean | yes |
| deployed path: 1 same-origin POST per load, none direct | note run 3 (`VERCEL=1`): 5 × `POST .../api/visit 204`, `DIRECT_BACKEND 0`, mock 5 | yes |
| relay contract xff 203.0.113.7 → 204 + 1 forwarded same xff | note run 3 + re-run `MOCK POST /api/me/votan.it@gmail.com/visit xff=203.0.113.7`, status 204 | yes |
| mock 500 / >5s → 204, 1 call, 1 VISIT:TRACK | note run 3: `mode=500 status=204`, `mode=slow status=204 time=5.007292`, each `mock calls: 1 | new VISIT:TRACK: 1` | yes |
| client nav → no further POST | note run 3 `firstLoad=1 afterClientNav=0` | yes |
| comments per code-comments.md | note Acceptance row 3 | yes |

## Gates
- Forbidden states: none hit (node exists; evidence present; outputs real; no code in haven; PM status updated here).
- Review (6b2): `/code-review medium`, 7 findings, correctness ones 1-3/6/7 fixed, 4-5 moot — ok.
- Seal gate: no commit/push in the note — nothing outward-facing done yet.
- Proportionality: `server/api/visit.post.ts` guard + one root `CLAUDE.md` sentence — minimal.
- Doctrine proposal: none.
- Supersedes: none · Still open: `visit-ip-geo-check` (#398) stays PENDING.

## Notes for hand-off (not REOPEN reasons)
- The working tree is on `staging`, not `bug/389` (`git branch --show-current` → `staging`; local `bug/389` at `4a2378e`, behind staging `fd861fd`). Commit this node on `bug/389` brought up to staging, not on staging (protected, PR-only).
- Prod now depends on Vercel exposing `VERCEL` at function runtime (Vercel system env, build + runtime). First real prod check after release: one visit lands — fits with #398.
- Exclude `.claude/skills/issues-ls/SKILL.md` and `.vercel/` from the commit (pre-existing, per note).

## Verdict: SEAL
