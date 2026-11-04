# 2026-11-05 - script-csp-enforce (verifier: SEAL)

- Worker: verifier · Version: 0.1.0
- Node: `script-csp-enforce` (#319), branch `feature/319`, uncommitted
- Note graded: `evidence/implementer/2026-11-05/script-csp-enforce-diff.md` (pass 2)
- Previous verdict: `evidence/verifier/2026-11-05/script-csp-enforce-reopen.md` (REOPEN)
- New PM status: SEALED. Row archived to `haven/diagrams/dev-loop-archive.md` and replaced by a pointer.

## Verdict: SEAL

## REOPEN items closed
| REOPEN missing item | Pass-2 evidence |
|---|---|
| 1. `## Acceptance` row "comments per code-comments.md" | Present. It quotes the one changed `//` line in `server/plugins/RenderHTML.ts`: `// Replaces the routeRules CSP on HTML pages, so it repeats its frame-ancestors.` It gives the WHY (the duplicated `frame-ancestors`), is one sentence so `//` is the right form, and has no `(#N)` ref. That meets the standard. |
| 2. Verbatim local probe output including the light-mode reload | Present, per path (`probe2.out`), including `light reload / true html class=light violations so far 0`. The implementer also found and disclosed that the pass-1 light step never left dark mode (`colorMode.preference: 'dark'` ignores `prefers-color-scheme`). The fixed probe sets `localStorage['nuxt-color-mode']='light'`. My re-run confirms `html class=light`. |

## Reasoning
| Criterion | Evidence (note + my own re-run) | Result |
|---|---|---|
| 1. One enforced CSP on SSR HTML (with frame-ancestors), no Report-Only; non-HTML and `/contact` keep frame-ancestors only | Note's Headers block. Re-run: `/ /en /projects /github /blogs /blogs/p1` → `content-security-policy: frame-ancestors 'none'; script-src 'self' 'sha256-Hs0TnoUue/S63m28FqCHc42QuFCcszAJH3N…` with `count=1` each; `/contact` → `Content-Security-Policy: frame-ancestors 'none' count=1`; `/api/resume` → `Content-Security-Policy: frame-ancestors 'none' count=1`; `/nope` (accept html) → enforced script-src policy; `grep -ic report-only` on `/` → `0` | cited + reproduced |
| 2. 0 violations on the listed pages, client nav, light mode, all hydrated, 0 real-upstream hits | Note: verbatim probe2 + control output. Re-run (`probe3.out`, `control3.out`): all 13 paths `200 hydrated=true` (`/does-not-exist 404 hydrated=true`), `light reload / true html class=light violations so far 0`, `violations 0 []`; control `client nav to post true …/blogs/p1 has Hello: true script in post html: false`, `violations before injection 0`, negative control `injected inline script ran: false violations after: [{"dir":"script-src-elem","disp":"enforce","url":"/blogs/p1"}]`; `onrender=0` in `srv3.log`; the mock logged 24 hits (resume vi+en, categories, posts ×2, detail p1, GitHub user+repos, 16 visit POSTs) | cited + reproduced |
| 3. Unit test still pins the policy string | `tests/scriptCsp.test.ts` unchanged, `Tests  18 passed (18)` | cited |
| 4. build + lint + typecheck + test clean | Note: `◆ ✨ Build complete in 14.3s!` (one pre-existing `@__NO_SIDE_EFFECTS__` WARN, cross-referenced), `lint=0`, `typecheck=0 ts_errors=0`, `Test Files  8 passed (8)` / `Tests  18 passed (18)`. Re-run build against the mock: `build=0`, `◆ ✨ Build complete in 21.4s!`, same pre-existing WARN only | cited (build reproduced) |
| comments per code-comments.md | Row present, see above | cited |
| Step 4: commands match `doctrine/MEMORY.md` | Yes. The Typecheck row has no `baseline:` | ok |
| Step 5: truncation | `…` only shortens hash values and URLs in single header lines. Probe and control output are verbatim per line | ok |
| 7b: Supersedes / Still open | `## Supersedes: none`. The only #319 row on the active diagram was this node. `script-csp-report-only` is already archived SEALED. Still open lists `/contact` (no runtime hook), Giscus not configured, and live blog pages unverifiable because of the upstream 504 | ok |

## Forbidden states / seal gate / proportionality
- Forbidden states: none of the 5 hit. The node exists, both notes exist, there is no code in `haven/`, the outputs were run and reproduced, and PM status is updated with this SEAL.
- Seal gate: `none`. Nothing committed or pushed. Commit and push are left to `/ship`, which is the outward-facing step.
- Proportionality: `git diff --stat` shows `server/plugins/RenderHTML.ts | 4 ++--`, the diagram row `+1`, and the worker-runs.log `+1`. That matches the Diff table, and no file is unclaimed.

## Isolation proof
Spawned as a separate verifier subagent via the Agent tool, pass 2 after a REOPEN. The task string starts "You are the VERIFIER worker of the agent-hub ... Run exactly `/worker verifier` for one node, pass 2 after a REOPEN. ... Judge the updated implementer note ... against the previous REOPEN". That differs from the implementer's task (issue #319 "feat(security): add a hash-based script-src CSP") and from the pass-1 verifier's string ("The evidence note to judge: ..."). This context didn't write the diff and didn't open its contents. It read the notes, hub docs, the scratchpad scripts and `git status`/`git diff --stat`.

## Re-run
partial. The reason is the "outward-facing" exception: this enforces a CSP on the live site, and the pass-1 verifier asked for this re-run. I re-ran `npm run build` with `NODE_API`/`NUXT_PUBLIC_NODE_API=http://127.0.0.1:4199`, `MY_EMAIL`/`NUXT_PUBLIC_MY_EMAIL=mock@example.com` and empty `GITHUB_TOKEN`/`NUXT_PUBLIC_GITHUB_TOKEN`. I served it with `node --import <scratchpad>/csp/redirect.mjs .output/server/index.mjs` on PORT=4188, then ran the `curl -D -` header checks, `probe.mjs` and `control.mjs` (headless Chrome via puppeteer-core with a fresh userDataDir). I did not re-run lint, typecheck or `npm test`: their verbatim outputs are in the note and nothing in source changed. The mock and server were killed afterwards, and ports 4188/4199 are free.

## PM status
- `script-csp-enforce`: IN_PROGRESS → SEALED. Full row appended to `dev-loop-archive.md` (main archived table) and the active row replaced with a pointer.
- That made 21 pointer rows, so the oldest pointer (`font-self-host-cls`, whose full row is already in the archive) was deleted from the active file. 20 remain.
