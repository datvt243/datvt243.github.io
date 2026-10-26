# 2026-10-27 - mobile-experience-touch-kbd (SEAL)

- Worker: verifier · Version: 0.1.0
- Node: `mobile-experience-touch-kbd` (issue #298, branch `feature/298`: local commit "wip" plus uncommitted `Panel.vue`)
- Note graded: `evidence/implementer/2026-10-27/mobile-experience-touch-kbd-diff.md` (pass 2, after `mobile-experience-touch-kbd-reopen.md`)
- Verdict: **SEAL**

## Isolation proof
Same separate Agent-tool verifier subagent as REOPEN 1 (task string "You are the agent-hub **verifier** ... node `mobile-experience-touch-kbd` (GitHub issue #298) ... Independently SEAL or REOPEN"), continued by the coordinator's message "REOPEN 1 is fixed ... please re-verify independently (pass 2)". This is not the implementer's context.

## Re-run
partial: fresh build, lint, typecheck, `npm test`, and my own CDP scripts on my own server (:4196). I did not use the implementer's :4198 server. Reason: this is a re-check of a REOPEN, and the fix changes a shared component (`ThemePanel`).

## Commands + output (this pass, mock resume API :4199 mode=ok)
```
npm run build → rc=0, "◆ ✨ Build complete in 18.1s!"
npm run lint → rc=0
npx nuxi typecheck → rc=0, 0 "error TS"
npm test → "Test Files  3 passed (3) / Tests  7 passed (7)" rc=0
```

## CDP (:9888 incognito; `scratchpad/v298/v.cjs` and `scratchpad/v298/pages.cjs`; the output is in `scratchpad/v298/fix2.txt`)
```
phone 390 touch, / (vi-VN) and /en, dark and light: panelW=366 contentW=332 liTextRatio=0.861 h2TextRatio=0.907 inlineKbd 0/12 gutter=none tagLabels 0 marker "- " hScroll=false
desktop 1280, the same 4 combinations: inlineKbd 12/12 gutter=block tagLabels 46 h2Left=423 liLeft=364 (same as pass 1) hScroll=false
KeyNav overlay: desktop "?" → 17/17 kbd visible, 0 aria-hidden; phone → 17/17
other ThemePanel pages, phone: /en/github /en/contact /en/projects /en/blogs /github → padding 16px, hScroll=false
                        desktop: same routes → padding 24px (unchanged), hScroll=false
```
Screenshot `scratchpad/v298/v298-_en_github.png`: the panel content has a 16px inset at 390 and nothing is clipped.

## Criteria
| Criterion | Result |
|---|---|
| 1. ≥ 85% of panel width at 390 | met: list items 0.861, headings 0.907 (text span / `.editor-scope` width) |
| 2. Kbd hidden on touch only, overlay keeps its keys | met: 0/12 on phone, 12/12 on desktop, overlay 17/17 |
| 3. Desktop unchanged | met: gutter, 46 tag labels, the same offsets, 24px padding |
| 4. No h-scroll, semantics kept | met on every route checked; the change is CSS and classes only |
| 5. build/lint/typecheck/test | met (this pass) |
| 6. comments per code-comments.md | met: the Kbd.vue doc block, the `/** */` above the media block and the one-line hanging-indent comment all say WHY; no `(#N)`; `Panel.vue` adds no comment |

## Supersedes
The note's Supersedes names REOPEN 1 (an evidence note, not a diagram row), so no row needs moving.

## Forbidden states
None hit. No seal gate needed (no deploy). Proportionality: the `Panel.vue` change is one class, and pass 1 named it as the smallest fix.

## Not checked
Real iOS or Android devices, hybrid touch laptops, and widths other than 390 and 1280.
