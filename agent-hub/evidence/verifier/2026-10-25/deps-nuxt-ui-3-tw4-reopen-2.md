# 2026-10-25 - deps-nuxt-ui-3-tw4 (REOPEN 2)

- Worker: verifier · Version: 0.1.0
- Node: `deps-nuxt-ui-3-tw4` (`haven/diagrams/dev-loop.prime-mermaid.md`, last row, state `IN_PROGRESS`, left unchanged)
- Notes graded: `evidence/implementer/2026-10-25/deps-nuxt-ui-3-tw4-{plan,diff}.md`, including `## Rework 1`. Previous verdict: `evidence/verifier/2026-10-25/deps-nuxt-ui-3-tw4-reopen.md`
- Worktree: `scratchpad/wt-262` (branch `feature/262`, uncommitted vs `staging` @ `7ec2b12`). Baseline: `scratchpad/wt-base` served on :4084
- Verdict: **REOPEN**

## Isolation proof
This is a separately spawned verifier subagent for the second pass. Its Agent-tool task string starts "You are the agent-hub VERIFIER for this repo … this is the SECOND verifier pass, after a REOPEN". The implementer's task was "Phase 3.5 — @nuxt/ui 2→3 + Tailwind 3→4". The first verifier's string had no "SECOND verifier pass". All my scripts and outputs are in `scratchpad/verify-262b/`. I measured against my own server on :4091 (started from my own rebuild, then stopped), not the implementer's :4083.

## Re-run
`partial`: build, lint and typecheck, plus new CDP A/B scripts for non-visual behavior. I did not redo the 34-shot pixel diff, npm audit, or the `@nuxt/schema` pin repro. Reason: the change is outward-facing (a site-wide CSS-engine swap headed for production), and the operator asked me to re-check Rework 1 and the non-visual behavior myself.

## REOPEN reasons from pass 1: both fixed
| Reason | My evidence |
|---|---|
| (1) `cursor: pointer` lost on `<button>` | The rule is in my build's SSR styles (`.output/server/chunks/build/entry-styles.*.mjs` matches `[role=button]:not(:disabled)`). `nonvis.cjs` compared the computed `cursor` of 438 controls (`button, [role=button], a[href], input, select, textarea, label, summary`) on 7 routes at 1440 and 390, :4084 vs :4091. The only mismatches come from /blogs structure changes: the select is now a `BUTTON\|20` with `pointer` (was a native `SELECT` with `default`), and pagination gained First/Last buttons (disabled ones show `not-allowed` on both builds). Every other button and link: `pointer` on both. |
| (2) border-color comment | `main.css` now reads `/* v4 defaults borders to currentColor; keep v3's gray-200 for bare \`border\` utilities. */`, a one-line WHY. The cursor rule has its own one-line WHY. The Rework 1 comment row cites `main.css` ×4, which matches the four comment blocks in the file. |

## Rework 1 regression check (my run)
- `npm run build` → rc=0, `└  ✨ Build complete!`. The 8 WARN lines are the i18n `optimizeTranslationDirective` warning and the `nuxt/server` resolve warnings from @nuxt/image, both in the staging log too. The chunk-size note is the one already accepted.
- `npm run lint` → `eslint .`, no output, rc=0.
- `npx nuxi typecheck` → rc=0, `grep -c 'error TS'` = 0, last line `✔ Nuxt Icon discovered local-installed 3 collections: fe, grommet-icons, heroicons`.

## Non-visual v4 / ui-v3 behavior, measured A/B (:4084 staging vs :4091 branch)
| Behavior | Result |
|---|---|
| `hidden` attribute | 0 `[hidden]` elements on all 14 route×width pages, so nothing is affected. |
| Placeholder color | Only the /github search input has one: `rgb(107,114,128)` → `oklch(0.551 0.027 264.364)`, which is gray-500 in v4's OKLCH palette. Same color family. |
| `space-*` / `divide-*` | 43 diffs, all v4's documented move from `margin-top` on later children to `margin-bottom` on earlier children. Gaps are the same sizes. The 34-shot diffs from pass 1 already showed layout unchanged. |
| Default border color | Same colors, now written in OKLCH/oklab. The 404 page's bare `border` resolves to `oklch(0.928 0.006 264.531)` (v4 gray-200) through the compat block. /github's `border-blue-400` drifts (already noted). |
| Hover | 176 hover states compared, every one equivalent: same text color, and backgrounds now written as `oklab(… / α)` instead of `rgba(… , α)` for the same token. |
| Dialog focus trap | Help modal: staging does NOT trap focus (12 Tabs, all 12 outside the dialog). The branch traps it (0/12 outside, focus starts in the dialog). This is an improvement. Slideover: trapped on both builds, initial focus `Đóng menu` on both. |
| Return focus after Esc | `BODY` on BOTH builds for the modal and the slideover. This is not a regression; it was already like this on staging. |
| `prefers-reduced-motion: reduce` | Not honored on EITHER build. Modal: staging opacity/transform 300ms, branch `fade-in`/`scale-in` 200ms. Slideover: staging 500/300ms, branch 200ms. Not a regression. |
| Keyboard focus ring, buttons | The ring renders the same once settled (`focus-4084-5.png` vs `focus-4091-5.png`, `about-me` 11). NEW: v4's `transition`/`transition-colors` include `outline-color`, so the ring fades in over 0.15s, starting from the text color. In the first frames it can be invisible on "Tải CV", whose orange ring matches its orange border (`focus-4091-9.png`). `ringsettled.cjs` shows `t0` = currentColor and settled `rgb(153,200,255)` on every transitioning control. |
| Keyboard focus ring, links | **Changed and not explained in the note.** Staging links ring green `rgb(74,222,128)` from ui v2's global `a:focus-visible{outline-color:rgb(var(--color-primary-DEFAULT))}`. The branch uses Chrome's default `rgb(153,200,255)`, the same as buttons. |
| Root `color-scheme` in dark mode | **Regression, not explained in the note.** See reason 1. |

## Why REOPEN
1. **Dark mode lost `color-scheme: dark` on `<html>`.** `scheme.cjs` measured this on /contact:
   ```
   4084 dark  {"htmlClass":"dark","root":"dark","body":"dark"}
   4091 dark  {"htmlClass":"dark","root":"normal","body":"dark"}
   ```
   ui v2 shipped `.dark{color-scheme:dark}`, which matches `<html class="dark">`. ui v3 sets the scheme only on `body` (`body{…color-scheme:light}` / `body:where(.dark,.dark *){color-scheme:dark}`). The browser renders the viewport itself (canvas and viewport scrollbars) from the ROOT element's scheme. `canvas.cjs` shows this: with the html/body backgrounds cleared in dark mode, the viewport paints `18,18,18` on staging but `255,255,255` on the branch. The user-facing effect: in dark mode the page scrollbar becomes light on Windows and Linux, and on macOS with "always show scroll bars". I could not screenshot the scrollbar itself because this Mac uses overlay scrollbars (gutter = 0). Screenshots and pixel diffs can't catch this, and the note's "every diff explained" doesn't cover it.
   **Fix:** add one rule to `assets/css/main.css` with a one-line WHY, e.g. `@layer base { .dark { color-scheme: dark; } }`. I injected `.dark{color-scheme:dark}` on :4091 and the root scheme went back to `dark` (`ringfix.txt`). Then re-measure with `scheme.cjs` and `canvas.cjs`, and check that light mode still gives `normal`/`light`.
2. **Two keyboard-focus diffs are unexplained** (secondary, same pass). Each needs either an "accepted v4/ui-v3 default" line under "every diff explained", or a fix:
   (a) the link focus ring changed from ui v2's green to the browser default;
   (b) the 0.15s `outline-color` fade-in from v4's transition properties, which can briefly hide the ring on same-colored bordered controls ("Tải CV").
   I don't require either to be reverted, only stated.

## Missing
- Explanation or fix for the root `color-scheme` regression in dark mode (reason 1). This blocks "every diff explained / nothing renders broken".
- An "every diff explained" entry for the link focus-ring color and the outline-color transition (reason 2).

## Forbidden states
None hit. Ratchet untouched: the row stays `IN_PROGRESS`, with no archive or prune on REOPEN. Seal gate: no commit, push or PR in Rework 1. Proportionality: Rework 1 touched only `assets/css/main.css`, as scoped.

## Not checked by me
- The 34-shot pixel diff after Rework 1. The implementer reports 0% on 31 of 34 vs the pre-rework shots, and the rework only adds a cursor rule and changes a comment.
- A real visual of the light scrollbar on a non-overlay platform (explained above).
- Dev-mode hydration and real PDF success-toast generation, same as pass 1.
