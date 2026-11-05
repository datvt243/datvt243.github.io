# 2026-11-05 - hero-download-shortcut-D (verdict)

- Worker: verifier · Version: 0.1.0
- Node: `hero-download-shortcut-D` (issue #396, branch `feature/396`, uncommitted working tree)
- Note judged: `evidence/implementer/2026-11-05/hero-download-shortcut-D-diff.md`
- Verdict: **SEAL** · New PM status: SEALED (archived)

## Isolation proof
Separate Agent-tool subagent spawned with the task string "You are the VERIFIER in this repo's agent-hub (repo root: ..., branch `feature/396`, already checked out, uncommitted working tree is the diff under review ...) Run the `/worker verifier` procedure exactly ... Task: GitHub issue #396 ...". That string differs from the implementer's `/todo #396` pass. I started with a blank context and did not write this diff.

## Re-run
none. I audited the note and re-ran no build, lint, typecheck, test or browser check. Read-only checks only: `stat` mtimes show Hero.vue and `.claude/rules/theme.md` 22:59:10, `.output/nitro.json` 23:01:59, scratchpad `server.log` 23:02:02, so the build and UI check postdate the last edit. `grep -c onrender server.log` → `0`. `grep data-shortcut="[dD]"` in `themes/` → only `Hero.vue:66 data-shortcut="D"`. No server left listening on :3497 or :4599.

## Reasoning
| Criterion | Verdict | Cited |
|---|---|---|
| (1) Button `data-shortcut="D"`, badge `D` | met | SSR HTML shortcuts `c, D, 1, 2, 3, 4` (no lowercase `d`); badge text `"D"`; grep above |
| (2) `D` downloads, `d` no longer does | met | `press('d')` → clicks `[]`; `press('Shift+D')` → `["download"]`; tab `visibilityState: "visible"`; real PDF call blocked |
| (3) `?` overlay lists `D` | met | Overlay row `Tải CV D`. Overlay opened via dispatched `keydown {key:'?'}`; acceptable since the overlay is built from `data-shortcut` and `?` handling is untouched |
| (4) `.claude/rules/theme.md` updated | met | Note diff row; line now `` `D` (Shift+d) download CV `` |
| build + lint + typecheck + test | met | `build=0 ◆ ✨ Build complete in 1m 14s!`, `lint=0`, `typecheck=0 ts_errors=0`, `Tests  20 passed (20)`. Same exit-code format earlier seals accepted; the `…` sits inside the known pre-existing NO_SIDE_EFFECTS warning, not the result |
| Comments per code-comments.md | met | No comment added or changed |

## Forbidden states
None hit. Note: the active row was `IN_PROGRESS` rather than `sealed_pending_verifier`; moved forward to SEALED, no drift left.

## Seal gate
No outward action. OK.

## Proportionality
OK. 2 code lines in Hero.vue + 1 rules line; KeyNav untouched since it matches `e.key` exactly.

## Supersedes
none
