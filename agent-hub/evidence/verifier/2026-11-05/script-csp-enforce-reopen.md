# 2026-11-05 - script-csp-enforce (verifier: REOPEN)

- Worker: verifier · Version: 0.1.0
- Node: `script-csp-enforce` (#319), branch `feature/319`, uncommitted
- Note graded: `evidence/implementer/2026-11-05/script-csp-enforce-diff.md`
- New PM status: IN_PROGRESS (unchanged; REOPEN does not move the ratchet)

## Verdict: REOPEN

## Reasoning
| Criterion | Evidence | Result |
|---|---|---|
| 1. One enforced CSP on SSR HTML (with frame-ancestors), no Report-Only; non-HTML and `/contact` frame-ancestors only | Headers block: `/ /en /projects /github /blogs /blogs/p1` → `content-security-policy: frame-ancestors 'none'; script-src 'self' 'sha256-…'`; `/contact` and `/api/resume` → `frame-ancestors 'none'`; `grep -ic content-security` on `/` and `/nope` → `1 and 1`. The `…` only shortens hash values | cited |
| 2. 0 violations on listed pages, client nav, **light mode**, all hydrated, 0 real-upstream hits | Local `violations 0 []`, control `violations before injection 0` plus the negative control (`script-src-elem`, `enforce`), `grep -c onrender srv.log → 0`. But the local probe result is paraphrased (`all 13 → 200 hydrated=true (404 for /does-not-exist, hydrated=true)`), not the script's verbatim per-path lines as quoted for production. **Light mode is in the criterion but no output line from either run shows the light-mode reload**. It is only described in the probe's prose | **missing** |
| 3. Unit test still pins the policy string | `tests/scriptCsp.test.ts` unchanged, `Tests  18 passed (18)` | cited |
| 4. build + lint + typecheck + test clean | `◆ ✨ Build complete in 14.3s!` (1 pre-existing WARN, cross-referenced), `lint=0`, `typecheck=0 ts_errors=0`, `Test Files  8 passed (8)` / `Tests  18 passed (18)` | cited |
| comments per code-comments.md | **Row absent from `## Acceptance`.** The Diff table says "Comment updated" for `server/plugins/RenderHTML.ts` but doesn't cite the comment or check it against the standard. The standard's Enforcement says: "that row missing ... → REOPEN" | **missing** |
| Step 4 commands | Match `doctrine/MEMORY.md`; Typecheck row has no `baseline:` | ok |
| Step 5 truncation | Header `…` = hash abbreviations, OK. The local browser block is a summary, see criterion 2 | partial |
| 7b Supersedes/Still open | `## Supersedes: none`; only one #319 row on the active diagram (line 98) | ok |

## Missing (what the implementer must add)
1. `## Acceptance` row "comments per code-comments.md" citing the changed comment in `server/plugins/RenderHTML.ts` (WHY not WHAT, comment style, no `(#N)` refs).
2. Criterion 2: paste the local `probe.mjs` output verbatim (per-path lines plus click lines), including the line(s) that show the `prefers-color-scheme: light` reload of `/` and its violation count. If the probe doesn't print one, add a print and re-run.

## Forbidden states / seal gate / proportionality
- Forbidden states: none of the 5 hit. The node exists, the note exists, there is no code in `haven/`, and PM status is unchanged on REOPEN. `EDIT_UNVERIFIED` doesn't apply: checks were run and quoted, but two citations are missing.
- Seal gate: `none`. Nothing committed or pushed.
- Proportionality: `git status` / `git diff --stat` show only `server/plugins/RenderHTML.ts` (4 +-) and the diagram row (+1), plus the untracked implementer evidence dir. This matches the Diff table, and no file is unclaimed.

## Isolation proof
Spawned as a separate verifier subagent via the Agent tool. The task string starts "You are the VERIFIER worker of the agent-hub in the repo ... Run exactly `/worker verifier` for one node ... The evidence note to judge: `agent-hub/evidence/implementer/2026-11-05/script-csp-enforce-diff.md`". That differs from the implementer's task (issue #319 "feat(security): add a hash-based script-src CSP"). This context didn't write the diff and didn't open its contents. It read only the note, the diagram row, hub docs and `git status`/`git diff --stat`.

## Re-run
none. Audit only. Per "Re-run scope", a note missing citations is REOPENed without re-running. The node is outward-facing (an enforced CSP on the live site), so the next verifier pass should do a partial re-run (local prod build + probe/control against the :4199 mock) before SEAL.

## PM status
- `script-csp-enforce`: stays IN_PROGRESS. Not collapsed or archived.
