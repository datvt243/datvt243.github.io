# 2026-10-27 - vi-glyph-fallback (SEAL)

- Worker: verifier · Version: 0.1.0
- Node: `vi-glyph-fallback` (#340, branch `bug/340`)
- Notes graded: `evidence/implementer/2026-10-27/vi-glyph-fallback-plan.md`, `evidence/implementer/2026-10-27/vi-glyph-fallback-diff.md`
- Verdict: **SEAL**

## Isolation proof
Separate subagent spawned via the Agent tool with description "Verifier pass vi-glyph-fallback" (task string differs from the implementer's issue-#340 task); this context did not write the diff.

## Re-run
none — note's output is verbatim, commands match `doctrine/MEMORY.md`, CDP evidence concrete. Read-only cross-checks only (no command re-run): built `.output/public/_nuxt/entry.CU8tzTA9.css` contains `@font-face{font-family:Fira Code Fallback;src:local(Courier New);…;unicode-range:U+??,U+2000-206F}` (`U+??` = U+00-FF, matches the note); both screenshots opened.

## Criteria
| # | Criterion | Evidence cited | OK |
|---|---|---|---|
| 1 | Range excludes VN code points + combining marks | Note: `U+0-FF, U+2000-206F`; built CSS above. Neither range touches U+0102-01B0 (ă đ ĩ ũ ơ ư), U+0300-036F, U+1EA0-1EF9 | yes |
| 2 | 146-char VN set: 1 glyph each, never Courier New | Note: CDP `CSS.getPlatformFontsForNode` → `{"total":146,"bad":[],…}` | yes |
| 3 | ASCII still Fira Code | Note: `"ascii":"Fira Code:5"` | yes |
| 4 | Screenshot shows attached diacritics | `.playwright-mcp/vi-glyph-before.png` shows "mơí", "hô`sơ", "dư˜lieụ" detached; `.playwright-mcp/vi-glyph-after.png` same paragraph + ư ơ ừ ữ ở ợ ứ ự ờ ớ ổ ạ ấ Ư Ơ Ừ Ữ Ở all attached | yes |
| 5 | build + lint + typecheck + `npm test` | Note: `lint=0`, `typecheck=0` / `error TS`=0, `Tests 11 passed (11)`, `Build complete in 13.9s!` (mock backend :4199, `onrender` hits 0) | yes |
| — | comments per code-comments.md | Note row present; `tokens.css` doc comment is `/** */`, WHY-only, no `(#N)` ref | yes |

## Checks
- 7b: no other open row for #340 on the active diagram; `## Supersedes: none`.
- Forbidden states: none hit (node on diagram, evidence written, outputs cited, no code in `haven/`, PM row updated by this SEAL).
- Seal gate: no outward-facing action in the diff (`## Seal gate: none`).
- Proportionality: one CSS value + its comment in `themes/portfolio-dev/tokens.css`; smallest fix at the root cause.

## Residual risk (from the note's "Noticed, not done", not blocking)
Measured only in Chrome/macOS with Fira Code installed locally; web-woff2 path, Safari/Firefox, Windows/Linux fallbacks and CLS not re-measured. Vietnamese tone letters now render in the system sans next to Fira Code Latin (pre-existing: Fira Code has no Vietnamese subset).
