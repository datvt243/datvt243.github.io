# 2026-10-24 - hero-actions-align (diff)

- Worker: implementer · Version: 0.1.0
- Node: `hero-actions-align` (`haven/diagrams/dev-loop.prime-mermaid.md`, last row)
- Task: issue #269 + operator follow-up "opentowork hãy cho màu xanh lá" (folded into the same node — same element, same PR; node acceptance updated in place while IN_PROGRESS)
- Status: `sealed_pending_verifier`

## Hub bytes before
76703

## Diff
| File | Why |
|---|---|
| `themes/portfolio-dev/pages/resumeObject/Hero.vue` | 3 items wrapped in one `flex flex-wrap items-center gap-2 mt-4` row; per-item `mt-4`/`ml-2` removed (fixes baseline offset + wrapped indent). Chip classes `theme-accent` → `theme-success` (border /30, bg /10, text, dot). `data-shortcut`/labels/handlers untouched. |
| `themes/portfolio-dev/settings-colors-theme/dark.css` | `--theme-success: 74 222 128` (green-400) |
| `themes/portfolio-dev/settings-colors-theme/light.css` | `--theme-success: 22 101 52` (green-800; green-700 `21 128 61` measured 4.38:1, below AA) |
| `tailwind.config.js` | `success: themeColor('--theme-success')` next to `kbd` |
| `haven/diagrams/dev-loop.prime-mermaid.md` | node row |

`editor-dracula.css` intentionally not touched: the hero is outside `<ThemePanel>`; R G B triplet format kept (opacity modifiers `/30` `/10` verified working below).

## Command
```
npm run build ; npm run lint ; npx nuxi typecheck
node scratchpad/cdp-hero.cjs <wt> http://localhost:4031 <tag>   # geometry at 1440/768/390, / and /en
node scratchpad/cdp-chip.cjs <wt> http://localhost:4031         # computed colors + WCAG contrast, dark & light
```

## Output
- build rc=0 `└  ✨ Build complete!`; lint rc=0, 0 problems; typecheck rc=0, 0 `error TS`

## Browser verification
Geometry after fix (`nuxi dev`, CDP :9888):
```
1440px /:   chip{top:254 mid:269 h:30 left:0}  contact{top:254 mid:269 h:30 left:159}  cv{top:254 mid:269 h:30 left:299}
1440px /en: chip{top:254 mid:269 h:30 left:0}  contact{top:254 mid:269 h:30 left:151}  cv{top:254 mid:269 h:30 left:317}
768px /:    chip{top:233 mid:248 h:30 left:0}  contact{top:233 mid:248 h:30 left:159}  cv{top:233 mid:248 h:30 left:299}
768px /en:  chip{top:233 mid:248 h:30 left:0}  contact{top:233 mid:248 h:30 left:151}  cv{top:233 mid:248 h:30 left:317}
390px /:    chip{top:213 mid:228 h:30 left:0}  contact{top:213 mid:228 h:30 left:159}  cv{top:251 mid:266 h:30 left:0}
390px /en:  chip{top:213 mid:228 h:30 left:0}  contact{top:213 mid:228 h:30 left:151}  cv{top:251 mid:266 h:30 left:0}
```
Same-row centers Δ = 0 everywhere (was 4px); wrapped CV `left:0` (was 8); row step 38px = 30 + 8 gap (was 50). Re-run after the color change: identical numbers. Screenshots: `scratchpad/shots/after-{1440,768,390}.png`, `final-*.png`.

Colors (`cdp-chip.cjs`, color mode forced via `localStorage['nuxt-color-mode']`, contrast = text vs chip bg blended over page bg):
```
dark  color rgb(74, 222, 128)  bg rgba(74, 222, 128, 0.1)  border rgba(74, 222, 128, 0.3)  dot rgb(74, 222, 128)  page rgb(2, 6, 23)    token "74 222 128"  contrast=10.04
light (green-700 first try)  color rgb(21, 128, 61) ...  contrast=4.38   ← below 4.5, rejected
light color rgb(22, 101, 52) ...  page rgb(255, 255, 255)  token "22 101 52"  contrast=6.14
```
Screenshots `scratchpad/shots/chip-{dark,light}.png`.

## Acceptance
| Criterion | Evidence |
|---|---|
| same vertical center (Δ ≤ 0.5px) on one row, all widths, / and /en | geometry table: Δ = 0 |
| wrapped item starts at left:0 | 390px: `cv ... left:0` |
| equal spacing | gap-2 both axes: row step 38 = 30 + 8 |
| chip = success token, dark & light | computed colors above |
| contrast ≥ 4.5:1 both modes | 10.04 / 6.14 |
| build/lint/typecheck clean | rc=0 ×3 |
| screenshots before/after | `shots/before-*.png`, `after-*.png`, `chip-*.png` |
| Comments per code-comments.md | 2 new CSS comments, same style as neighbouring token comments (shade name); light one states the WHY (4.38:1) — no `(#N)` refs |

## Supersedes: none
## Noticed, not done
- `.claude/rules/theme.md`'s example list of semantic classes doesn't mention `theme-success` (it's an "e.g." list, not exhaustive).

## Seal gate
none.
