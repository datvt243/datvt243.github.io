# 2026-10-27 - mobile-experience-touch-kbd (REOPEN)

- Worker: verifier · Version: 0.1.0
- Node: `mobile-experience-touch-kbd` (issue #298, branch `feature/298`, local commit "wip" on staging d40caec)
- Note graded: `evidence/implementer/2026-10-27/mobile-experience-touch-kbd-diff.md`
- Verdict: **REOPEN**

## Isolation proof
Separate Agent-tool subagent spawned by the coordinator with the task string "You are the agent-hub **verifier** for the datvt243.github.io project, node `mobile-experience-touch-kbd` (GitHub issue #298) ... Independently SEAL or REOPEN". This is not the implementer's context.

## Re-run
partial: build, lint, typecheck, `npm test`, own CDP script. Reason: the coordinator asked for an independent re-check and named the measurement definition as a doubt. The implementer note also gives only `rc=0` for build/lint/typecheck, not the output.

## Commands + output (this pass, worktree, mock resume API :4199 mode=ok, own server :4196)
```
npm run build → rc=0, "◆ ✨ Build complete in 17.5s!"
npm run lint → "> eslint ." rc=0
npx nuxi typecheck → rc=0, no "error TS"
npm test → "Test Files  3 passed (3) / Tests  7 passed (7)" rc=0
compiled CSS: @media (hover:none){.\[\@media\(hover\:none\)\]\:aria-hidden\:hidden[aria-hidden=true]{display:none}}
```

## CDP (:9888 incognito; `scratchpad/v298/v.cjs`; phone 390x844 isMobile+hasTouch, desktop 1280; `/` (vi-VN) and `/en`, dark and light)
Every combination gave the same numbers:
```
phone:   hover=none  inlineKbd 0/12  gutter=none  tagLabelsVisible=0  panelW=366 contentW=316  h2Left=25 liLeft=42  li marker "- "  hScroll=false
desktop: hover=hover inlineKbd 12/12 gutter=block tagLabelsVisible=46 h2Left=423 liLeft=364  marker none  hScroll=false
KeyNav overlay: desktop "?" → dialog 17/17 kbd visible, 0 aria-hidden; phone (opened via the button's click) → 17/17 visible
text column / ThemePanel width at 390:  list items 299/366 = 0.817   headings 316/366 = 0.863
same with the panel content padding at 16px instead of 24px (injected): list items 315/366 = 0.861, headings 0.907
```
Screenshot `scratchpad/v298/v298-light-phone-vi-exp.png`: the bullets, hanging indent and `// next experience` separators render cleanly.

## Criteria
| Criterion | Result |
|---|---|
| 1. ≥ 85% of panel width at 390 | **Not met** for list items (below) |
| 2. Kbd hidden on touch only, overlay keeps its keys | met (0/12 phone, 12/12 desktop, overlay 17/17) |
| 3. Desktop unchanged | met (gutter block, 46 tag labels, `- ` marker absent) |
| 4. No h-scroll, semantics kept | met (hScroll false; CSS only) |
| 5. build/lint/typecheck/test | met (this pass) |
| 6. comments per code-comments.md | met: Kbd.vue doc block and the `/** */` above the media block say WHY; the one-line hanging-indent comment says WHY; no `(#N)` |

## Missing
- Criterion 1. The issue asks that text take ≥ 85% of the panel width ("chữ chiếm ≥ 85% bề rộng panel"). The note's `textWidthRatio=0.934` is `(host.right − leftmost heading text) / host.width`. That counts the panel's 24px right padding as text width, and it measures headings only. Most Experience text is list items. Their real column is 299px of the 366px `ThemePanel` (0.817), or 0.821 of its inner column. Headings reach 0.863. With the panel's `p-6` (24px each side), list items cannot reach 0.85.
- Smallest fix: below `md`, use less padding on the panel content: `p-4 md:p-6` on the content `div` in `themes/portfolio-dev/components/Panel.vue`. Measured with that padding injected: list items 0.861, headings 0.907. This changes every ThemePanel on phones, so check `/github` and `/contact` at 390 too. The other option is for the operator to define "panel" as the panel's content box (then list items are 0.947 and the node passes as it is). That needs the operator's written choice in the note.

## Forbidden states
None hit. No seal gate needed (not deployed).

## Noticed (not blocking)
- The header `?` button is `hidden lg:flex`, so a touch user can't open the overlay anyway. Not a regression.
