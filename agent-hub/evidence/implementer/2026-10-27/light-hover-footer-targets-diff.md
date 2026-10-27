# 2026-10-27 - light-hover-footer-targets (diff)

- Worker: implementer · Version: 0.1.0
- Node: `light-hover-footer-targets` (last row of `haven/diagrams/dev-loop.prime-mermaid.md`)
- Task: issue #327, branch `bug/327` off `staging` f733577
- Status: `sealed_pending_verifier`

## Hub bytes before
80042

## Diff
| File | Why |
|---|---|
| `themes/portfolio-dev/layout/Footer.vue` | Social links `inline-flex size-6 items-center justify-center`; `@datvt243` link `py-1`; row `py-2.5`→`py-2`, `gap-3`→`gap-1` with `mr-2`/`mx-2` on the label and dot. Doc comment gets the WHY (2.5.8 target size, bar height kept). |
| `themes/portfolio-dev/pages/github/GitUser.vue` | Name link `+ hover:underline` (hover color alone barely differs in light) |
| `themes/portfolio-dev/pages/post/Item.vue` | Read-more link `+ hover:underline` (same) |
| `themes/portfolio-dev/settings-colors-theme/light.css` | `--theme-muted` slate-500 → slate-600 (71 85 105), comment says why |
| `haven/diagrams/dev-loop.prime-mermaid.md` | Node row appended |

## Commands + output (worktree; build and server env = `scratchpad/p0/mockenv.sh`)
```
npm run build → rc=0
npm run lint → rc=0
npx nuxi typecheck → rc=0
npm test → Tests 7 passed (7)
server log grep -c onrender → 0
```

## Browser (CDP :9888 incognito; `scratchpad/p1/m327.cjs`, light mode, /en/github; production v1.6.0 as baseline)
```
prod   390 {"footerH":42,"links":["16x20","16x20","87x16"],"muted":"rgb(100, 116, 139)","gitUserHover":"none -> none"}
prod  1280 {"footerH":42,"links":["16x20","16x20","87x16"],"muted":"rgb(100, 116, 139)","gitUserHover":"none -> none"}
fix    390 {"footerH":42,"links":["24x24","24x24","87x24"],"muted":"rgb(71, 85, 105)","gitUserHover":"none -> none"}   (touch emulation: no hover)
fix   1280 {"footerH":42,"links":["24x24","24x24","87x24"],"muted":"rgb(71, 85, 105)","gitUserHover":"none -> underline"}
```
Footer at 390: last link right edge 363 inside the 375px footer, same as production. Screenshots `scratchpad/p1/e327-footer-{m,d}.png`.
axe-core 4.10.2 (`scratchpad/p1/axepairs.cjs`, target-size on), 7 pages × dark/light × 1280/390 × /en and /: only `heading-order` (moderate, blog post body from the backend) — 0 serious/critical. Full output `scratchpad/p1/axe327.txt`.

## Acceptance
| Criterion | Evidence |
|---|---|
| 1. hover visible, muted ≠ faint | 1280 `gitUserHover: none -> underline`; light muted 71 85 105 vs faint 100 116 139 |
| 2. footer ≥ 24×24, same height | `links 24x24, 24x24, 87x24`, `footerH 42` = production |
| 3. axe | 0 serious/critical |
| 4. checks | above |
| 5. comments per code-comments.md | Footer doc comment and light.css token comment say why; no WHAT comments, no `(#N)` refs |

## Supersedes
none

## Still open
- Contact submit button hover (`bg-theme-accent-soft` vs accent in the light editor) also barely changes; it's a filled button, not in #327's scope.

## Seal gate
none.
