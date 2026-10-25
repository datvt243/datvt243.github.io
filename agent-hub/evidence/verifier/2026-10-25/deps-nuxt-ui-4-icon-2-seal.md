# 2026-10-25 - deps-nuxt-ui-4-icon-2 (SEAL)

- Worker: verifier · Version: 0.1.0
- Node: `deps-nuxt-ui-4-icon-2` (issue #264), branch `feature/264` (uncommitted)
- Note graded: `evidence/implementer/2026-10-25/deps-nuxt-ui-4-icon-2-{plan,diff}.md`
- Verdict: **SEAL**

## Isolation proof
Separate Agent-tool subagent, blank context, spawned with the task string "You are the VERIFIER in this repo's agent-hub, run as an isolated subagent (you did not write the diff) ... Your scratch: `.../scratchpad/verify-264/`" — differs from the implementer's task; this context wrote no part of the diff. Own scratch dir `scratchpad/verify-264/`, own servers on :4120 (staging copy) / :4121 (branch copy), not the implementer's :4110/:4111.

## Re-run: partial
Reason: outward-facing production dependency bump (UI kit + icon module touching every page) — the "outward-facing" exception. Re-ran: cold `npm run build`, `npm run lint`, `npx nuxi typecheck`, `npm ls`, `npm audit`, and CDP focus/icons/func/computed-style scripts (copies of implementer's with ports swapped). Screenshot-diff suite (34 shots) not re-run — audited from note + crops.

## Re-run output (this pass, Node v24.19.0)
```
npm ls --all → rc=0, "invalid" count 0
npm ls → @nuxt/icon@2.6.1, @nuxt/ui@4.12.0 (@nuxtjs/color-mode@4.0.1, reka-ui@2.11.0)
rm -rf .nuxt .output node_modules/.cache && npm run build → rc=0 "◆ ✨ Build complete in 14.1s!", WARN count 0
npm run lint → rc=0
npx nuxi typecheck → rc=0, "error TS" count 0
npm audit → 17 vulnerabilities (1 low, 1 moderate, 15 high)
```
CDP :9888, prod builds :4120 (staging) vs :4121 (branch):
```
GitHub input focus-visible  4120: outline none, ring 1px inset rgb(189,147,249)
                            4121: outline-style none (3px width inert), same ring      → fix holds
Active page button          4120: solid 2px oklch(0.75 0.183 55.934) off=2px
                            4121: solid 2px oklch(0.75 0.183 55.934) off=2px           → fix holds
USelect                     both: outline none (unchanged)
Icons (Iconify API blocked) identical per route on both: / 18/17/13 · /projects 17/16/8 · /github 64/63/14 · /blogs 18/17/13 · /contact 12/11/9; blocked requests 0
cs.cjs 390px per-page select  4120 fs 14px w 63 → 4121 fs 16px w 65 (matches "accepted v4 mobile 16px" claim)
func.cjs on :4121: 5 header click-navs OK, KeyNav dialog "Phím tắt" open → closed on Esc,
  color class dark -> light -> dark, /github vi-VN -> /en/github en-US -> /github vi-VN,
  hydration msgs: 0 [], other: []
```
Toast: `scratchpad/u4/c-toast.png` viewed — loading ("Đang tải CV...") and success ("Đã tải xong CV!") toasts render; diff is capture timing.

## Acceptance (node row)
| Criterion | Evidence | OK |
|---|---|---|
| @nuxt/ui 4.12.x / icon 2.6.x / color-mode 4.x | `npm ls` above | ✓ |
| `npm ls --all` no new invalid, vue-router one gone | rc=0, 0 invalid | ✓ |
| build/lint/typecheck clean (0 WARN / 0 TS) | re-run above; warm-build WARN shown pre-existing via A/B in note | ✓ |
| every UIcon renders, collections local | icons.cjs identical, 0 API requests; collections in deps (typecheck log "3 collections") | ✓ |
| color toggle + `classSuffix: ''` | `dark -> light -> dark` on `<html>` | ✓ |
| screenshot diff fixed or accepted with reason | note: 24/34 0px; post (Giscus, 0px when hidden), toast (timing), blogs/github 390 (v4 16px mobile, re-measured) | ✓ |
| click-nav, KeyNav `?`, toast, 0 hydration/0 new console | func.cjs above + toast crop | ✓ |
| SSR head parity 10 routes | note: SAME ×10 (audited, not re-run) | ✓ |
| `npm audit` before/after | 17 (2 mod, 15 high) → 17 (1 low, 1 mod, 15 high) | ✓ |
| comments per code-comments.md | One added `<!-- v4's solid-button focus outline is 25% opacity; keep v3's solid one on the active page -->` in `blogs/Index.vue`: WHY of a workaround, one sentence, no issue ref → compliant | ✓ |

## Checks
- Command matches `doctrine/MEMORY.md` (build, lint, typecheck): yes. No "tests pass" claim. Output not truncated.
- Supersedes: note says none; active diagram has no other #264 row → OK.
- Forbidden states: none hit (no commit/push, no self-grading, no unverified edit, no regression of PM status, no out-of-scope rewrite).
- Seal gate: no commit/push/PR in this pass — none required yet.
- Proportionality: diff = 2 dep bumps + lockfile + 2 one-attribute focus fixes (+ eslint reflow) + docs "v3"→"v4" — within node scope.

## Bookkeeping
- Full row (state SEALED) appended to `haven/diagrams/dev-loop-archive.md`; active row replaced in place with pointer.
- Pointer rows were 21 → pruned oldest (`vim-key-nav`, already in archive) → 20.
- hub_bytes_after = 78002 (per-session total, `/hub-tokens` script, measured after PM update).

## Noticed, not done
- USelect per-page has no keyboard focus indicator in v3 or v4 (implementer's note too) — pre-existing a11y gap, separate node.
