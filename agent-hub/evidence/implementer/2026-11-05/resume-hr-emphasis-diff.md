# 2026-11-05 - resume-hr-emphasis (plan + diff)

- Worker: implementer · Version: 0.1.0
- Node: `resume-hr-emphasis` (last row of `haven/diagrams/dev-loop.prime-mermaid.md`)
- Task: operator follow-up on #397, verbatim: "làm nổi bật section title và job title". Branch `feature/397` (uncommitted, on top of the SEALED `resume-hr-view` work).
- Status: `sealed_pending_verifier`

## Hub bytes before
80606 (measured before the node row was appended)

## Diff
| File | Why |
|---|---|
| `themes/portfolio-dev/pages/resumeObject/Hr.vue` | `.hr-heading`: 0.8125rem/700 + 1px `--theme-border` underline → 1.25rem/800, letter-spacing 0.06em, 2px `--theme-accent` underline. New `.hr-title` (1.125rem/700, line-height 1.4, `--theme-text-strong`) replaces `text-base font-semibold text-theme-text-strong` on the experience title h3 and the education school h3 (same role: entry title). Hr.vue is still untracked as a whole (new file from `resume-hr-view`), so `git diff` shows no separate hunk. |
| `agent-hub/haven/diagrams/dev-loop.prime-mermaid.md` | Node row appended |

## Command
`npm run build` · `npm run lint` · `npx nuxi typecheck` · `npm test` (repo root, from `doctrine/MEMORY.md`), after the final edit.

## Output
```
build=0  ◆ ✨ Build complete in 14.6s!
lint=0
typecheck=0
 Test Files  8 passed (8)
      Tests  20 passed (20)
```

## UI check (prod build, mock backend)
`NODE_API`/`NUXT_PUBLIC_NODE_API` = local mock :4599 at build and run; `grep -c onrender server3.log` → `0`. Playwright tab selected, `visibilityState: "visible"` (dark run).
- Dark, 1280: `h2.hr-heading` computed `20px / 800 / border-bottom 2px rgb(251, 146, 60)`, color `rgb(251, 146, 60)`; `h3.hr-title` `18px / 700`, color `rgb(226, 232, 240)`; body `li` 14px; scrollWidth 1265 = clientWidth. Screenshot `.playwright-mcp/hr-emphasis-dark-1280.png`.
- Light, 1280 (prior build with heading at 18px, same rules otherwise): heading `2px rgb(194, 65, 12)` accent, title `18px / 700`. Screenshot `.playwright-mcp/hr-emphasis-1280.png`. Note: that run's tab reported `visibilityState: "hidden"` — static CSS only, no transition involved.
- Dark, 375: scrollWidth 360 = clientWidth 360; titles wrap cleanly. Screenshot `.playwright-mcp/hr-emphasis-dark-375.png`.

## Acceptance
| Criterion | Evidence |
|---|---|
| (1) Section titles larger/bolder + accent underline | 20px (was 13px), weight 800, `border-bottom 2px` accent in dark and light |
| (2) Job titles ≥ 18px, weight ≥ 700 | `18px / 700` vs body 14px |
| (3) Dark + light, 1280 + 375, no overflow | three screenshots; scrollWidth = clientWidth at 1280 and 375 |
| build+lint+typecheck+test | Output above |
| Comments per code-comments.md | no comments touched |

## Supersedes
none

## Still open
none

## Noticed, not done
- Light mode at 375 not re-screenshotted after the 20px bump (dark 375 was).

## Seal gate
none (no commit/push in this pass)

---

# Pass 2 (after REOPEN `evidence/verifier/2026-11-05/resume-hr-emphasis-reopen.md`)

## Missing addressed
Light mode on the FINAL build at 1280 and 375, tab visible. "Final build" = the one also containing `resume-hr-skills-table` (operator asked for the skills table mid-pass; same file), so the UI run below is on the build that ships. Heading/title CSS is unchanged since pass 1's 20px edit.

## Command / Output (final build)
```
lint=0
typecheck=0
 Test Files  8 passed (8)
      Tests  20 passed (20)
build=0  ◆ ✨ Build complete in 14.6s!
server5.log: grep -c onrender → 0   (NODE_API + NUXT_PUBLIC_NODE_API = mock :4599 at build and run)
```

## UI check (all with `visibilityState: "visible"`, Playwright tab re-selected first)
| Mode | Width | `h2.hr-heading` | `h3.hr-title` | scrollWidth / clientWidth | Screenshot |
|---|---|---|---|---|---|
| light | 1280 | 20px / 800 / `2px rgb(194, 65, 12)`, color `rgb(194, 65, 12)` | 18px / 700, `rgb(30, 41, 59)` | 1265 / 1265 | `.playwright-mcp/final-light-1280.png` |
| light | 375 | 20px / `2px rgb(194, 65, 12)` | 18px | 360 / 360 | `.playwright-mcp/final-light-375.png` |
| dark | 1280 | 20px / 800 / `2px rgb(251, 146, 60)` | 18px / 700, `rgb(226, 232, 240)` | 1265 / 1265 | `.playwright-mcp/final-dark-1280.png` |
| dark | 375 | — | — | 360 / 360 | `.playwright-mcp/final-dark-375.png` |

One earlier light-1280 measurement in this pass returned `visibilityState: "hidden"` (operator's own tab in front); it was discarded and re-run after re-selecting the tab — the row above is the visible run. A dark-mode click via the Playwright locator then timed out for the same reason; the tab was re-selected and dark mode toggled via the header button's `click()` in-page.

## Acceptance (pass 2)
| Criterion | Evidence |
|---|---|
| (1) Section titles larger/bolder + accent underline | 20px / 800 / 2px accent, both modes, table above |
| (2) Job titles ≥ 18px, ≥ 700 | 18px / 700, both modes |
| (3) Dark + light, 1280 + 375, no overflow | four rows above, scrollWidth = clientWidth each |
| build+lint+typecheck+test | Output above |
| Comments per code-comments.md | no comments touched |

## Noticed, not done
none
