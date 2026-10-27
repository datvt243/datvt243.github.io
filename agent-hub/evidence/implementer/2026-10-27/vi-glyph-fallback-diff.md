# 2026-10-27 - vi-glyph-fallback (diff)

- Worker: implementer · Version: 0.1.0
- Node: `vi-glyph-fallback` (last row of `haven/diagrams/dev-loop.prime-mermaid.md`)
- Task: issue #340, branch `bug/340` off `staging` b6870b1. Root cause + acceptance: `vi-glyph-fallback-plan.md`.
- Status: `sealed_pending_verifier`

## Hub bytes before
80254

## Diff
| File | Why |
|---|---|
| `themes/portfolio-dev/tokens.css` | `'Fira Code Fallback'` (`local('Courier New')`) `unicode-range: U+0-1E9F, U+1EFA-10FFFF` → `U+0-FF, U+2000-206F`; doc comment rewritten to the real reason (the old one claimed excluding U+1EA0-1EF9 was enough) |
| `haven/diagrams/dev-loop.prime-mermaid.md` | Node row appended |

## Output
```
npm run lint → lint=0
npx nuxi typecheck → typecheck=0, `grep -c "error TS"` = 0
npm test →       Tests  11 passed (11)
npm run build → ◆ ✨ Build complete in 13.9s!
built CSS: @font-face{font-family:Fira Code Fallback;src:local(Courier New);…;unicode-range:U+??,U+2000-206F}
```
(build/server env NODE_API=NUXT_PUBLIC_NODE_API=http://localhost:4199 mock; `grep -c onrender srv8.log` → 0)

## Browser verification
Prod build :4187, Playwright tab brought to front (`visibilityState: visible`), `document.fonts.ready`, Chrome CDP `CSS.getPlatformFontsForNode` per character inside `.font-theme-mono`:
- Set: 13 bases `aăâeêioôơuưy` × (bare + 5 tones, NFC) + `đ`, lower + upper = 146 chars.
- Result: `{"total":146,"bad":[],"fonts":{"Fira Code":55,".SF NS":92,"ascii":"Fira Code:5"}}` — `bad` = chars drawn with ≠1 glyph or by Courier New → none. ASCII "Hello" still Fira Code.
- Before (measured on operator's :3000 with the old range): `ư=Courier New:1 ơ=Courier New:1 ừ=Courier New:2 ữ=Courier New:2 … ạ=Courier New:2`.
- Screenshots of the same Vietnamese paragraph: `.playwright-mcp/vi-glyph-before.png` (old range injected: "mơí", "dư˜lieụ", "hô`sơ" detached) vs `.playwright-mcp/vi-glyph-after.png` (shipped CSS: all marks attached).

## Acceptance
| Criterion | Evidence |
|---|---|
| 1 range excludes VN code points + marks | `U+0-FF, U+2000-206F` contains none of U+0102-01B0, U+0300-036F, U+1EA0-1EF9 |
| 2 146-char set: 1 glyph, no Courier | `bad: []` |
| 3 ASCII still Fira | `ascii: Fira Code:5` |
| 4 screenshot | before/after PNGs |
| 5 checks | Output block |
| comments per code-comments.md | WHY comment corrected in place, no new comment |

## Supersedes: none

## Noticed, not done
- This machine has Fira Code installed locally (CDP `isCustomFont:false`, served via the `local(Fira Code)` src). The web woff2 subsets have the same unicode-ranges, so visitors without it should match, but that path wasn't measured here.
- Tested in Chrome on macOS only. Safari/Firefox and Windows/Linux system fallbacks not checked.
- During the Fira swap, Vietnamese letters use the system font before and after, so they never moved anyway; the CLS fallback still covers Latin-1 text. CLS wasn't re-measured.

## Seal gate
none
