# 2026-10-27 - vi-glyph-fallback (plan)

- Worker: implementer · Version: 0.1.0
- Node: `vi-glyph-fallback` (last row of `haven/diagrams/dev-loop.prime-mermaid.md`)
- Task: issue #340 "Vietnamese glyphs ư/ơ render broken (detached diacritics)" — "lỗi font \"ư\" và \"ơ\", hãy check lại toàn bộ". Branch `bug/340` off `staging` b6870b1.

## Hub bytes before
80254 (measured right after the node row was appended)

## Root cause (measured, operator's :3000 page, Chrome CSS.getPlatformFontsForNode)
#332 (`font-self-host-cls`) added `'Fira Code Fallback'` = `local('Courier New')` with `unicode-range: U+0-1E9F, U+1EFA-10FFFF`. That range still covers ư/ơ (U+01A0-01B0) and the combining marks (U+0300-036F), so Chrome draws ư/ơ in Courier New and **decomposes** every precomposed tone letter (ừ ữ ở ổ ạ ấ…, U+1EA0-1EF9) into base + combining mark in Courier New (2 glyphs each), whose mark placement detaches the accents. Page text is NFC (0 combining marks, 215 precomposed) — data is not the cause.
Probe (current range): `ư=Courier New:1 ơ=Courier New:1 ừ=Courier New:2 ữ=Courier New:2 … ạ=Courier New:2`.
Probe (`U+0-FF, U+2000-206F`): every Vietnamese letter = `.SF NS:1` (one whole system glyph); ă/đ/é/a stay Fira Code.

## "Check toàn bộ" scope
`grep` for font-family/@font-face across assets/themes/server/config: the only custom face is this fallback; mono text uses `--theme-font-mono`, other text the system sans, the PDF `Arial, Helvetica, "Liberation Sans"` (all Vietnamese-capable). Fira Code's own subsets (cyrillic, cyrillic-ext, greek, greek-ext, latin, latin-ext) have no Vietnamese subset.

## Acceptance criteria
1. The fallback's `unicode-range` excludes every Vietnamese-specific code point and combining mark: no Vietnamese letter is drawn by Courier New, and none is drawn as 2 glyphs.
2. Measured on the real build for the full Vietnamese lowercase+uppercase set (each vowel × 6 tones + ă â ê ô ơ ư đ): each char = 1 glyph, never Courier New.
3. Plain ASCII text still uses Fira Code (CLS fallback still applies to Latin text).
4. Screenshot of a Vietnamese description shows attached diacritics.
5. build + lint + typecheck + `npm test` clean.

## Files
themes/portfolio-dev/tokens.css

## Blockers
none
