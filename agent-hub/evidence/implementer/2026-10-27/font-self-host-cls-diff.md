# 2026-10-27 - font-self-host-cls (diff)

- Worker: implementer · Version: 0.1.0
- Node: `font-self-host-cls` (last row of `haven/diagrams/dev-loop.prime-mermaid.md`)
- Task: issue #292, branch `feature/292` off `staging` 0c31299, rebased on fb49db9
- Status: `sealed_pending_verifier`

## Hub bytes before
80076

## Diff
| File | Why |
|---|---|
| `assets/css/font-face.scss` | Deleted: only the render-blocking Google Fonts `@import` plus an unused `.fira-code` class (no reference anywhere) |
| `nuxt.config.ts` | `font-face.scss` dropped from `css`; `ui: { fonts: false }` → `fonts.families: [{ name: 'Fira Code', provider: 'google', global: true }]` (@nuxt/fonts self-hosts woff2 under `/_fonts`; `global` because the family only lives in a custom property) |
| `themes/portfolio-dev/tokens.css` | `'Fira Code Fallback'` `@font-face` (local Courier New + fontaine metric overrides, `unicode-range` skipping U+1EA0-1EF9) inserted second in `--theme-font-mono` |
| `haven/diagrams/dev-loop.prime-mermaid.md` | Node row appended |

## Commands + output (worktree; build/server env = `scratchpad/p0/mockenv.sh`)
```
npm run build → ◆ ✨ Build complete in 13.8s!
npx eslint . → (no output) rc=0
npx nuxi typecheck → rc=0, grep -c 'error TS' → 0
npm test → Test Files  4 passed (4) · Tests  10 passed (10)
npx prettier --write tokens.css nuxt.config.ts → tokens.css reflowed (var wrapped), nuxt.config.ts unchanged
```
Built CSS: 24 `@font-face` for Fira Code (400/500/600/700 × 6 subsets, `src:local(Fira Code …),url(../_fonts/*.woff2)`, `font-display:swap`), plus
`@font-face{font-family:Fira Code Fallback;src:local(Courier New);size-adjust:99.9837%;ascent-override:99.0161%;descent-override:32.2052%;line-gap-override:0%;unicode-range:U+0-1E9F,U+1EFA-10FFFF}`.
`grep -c googleapis` on built CSS → 0. `curl /_fonts/<3 files>` → 200 `font/woff2` 11-14 KB.

## Lighthouse 12.8.2 (median of 3, own headless Chrome, local `node .output/server`, no text compression → absolute mobile numbers are pessimistic; server logs `grep -c onrender` → 0)
This machine has Fira Code installed, and @nuxt/fonts lists `local(Fira Code …)` first, so a plain run of the new build never swaps fonts (CLS trivially 0, zero woff2 requests). The "after" rows are therefore measured on a copy of the build with the `local(Fira Code …)` sources stripped (CSS padded back to its original byte length, since Nitro serves the manifest's Content-Length) = a visitor without the font. CDP check on that copy: 2 woff2 requests to `/_fonts`, faces loaded.

| Build | Page | Score | FCP | LCP | TBT | CLS | Render-blocking | Font hosts |
|---|---|---|---|---|---|---|---|---|
| before (staging, :4178) | /en mobile | 46 | 7.29s | 9.55s | 204ms | 0.183 | googleapis css2 + entry.css | googleapis, gstatic |
| before | /en desktop | 85 | 1.60s | 1.84s | 10ms | 0.004 | same | same |
| before | /en/projects mobile | 60 | 6.92s | 7.30s | 0ms | 0.000 | same | same |
| before | /en/projects desktop | 86 | 1.52s | 1.60s | 0ms | 0.091 | same | same |
| self-host only, no fallback face | /en mobile | 49 | 6.92s | 7.36s | 106ms | 0.209 | entry.css | localhost |
| self-host only, no fallback face | /en/projects desktop | 91 | 1.25s | 1.35s | 0ms | 0.091 | entry.css | localhost |
| **after** (:4176) | /en mobile | 60 | 6.61s | 6.84s | 107ms | 0.000 | entry.css | localhost |
| **after** | /en desktop | 90 | 1.30s | 1.64s | 2ms | 0.000 | entry.css | localhost |
| **after** | /en/projects mobile | 62 | 6.16s | 6.68s | 25ms | 0.003 | entry.css | localhost |
| **after** | /en/projects desktop | 93 | 1.21s | 1.36s | 0ms | 0.000 | entry.css | localhost |

The middle rows show self-hosting alone doesn't fix CLS (the swap still shifts); the fallback face does.

## Browser (CDP :9888, fresh incognito contexts, 1280×800 @2x)
```
H1 platform fonts  before: Fira Code Bold ×8 glyphs + .SF NS ×2 (Ấ, Ạ)
                   after (first try, no unicode-range): Fira Code ×8 + Courier New ×2  ← regression, fixed
                   after (final): Fira Code ×8 + .SF NS ×2  — crops scratchpad/p1/h1-{base,fixnl}.png identical
--theme-font-mono computed: "Fira Code", "Fira Code Fallback", ui-sans-serif, …
```
Full-page screenshots `scratchpad/p1/e292-{base,fix,fix-nolocal}.png`: same layout (base still has the `_blogs` tab — built before #331).

## Acceptance
| Criterion | Evidence |
|---|---|
| 1. no Google request, same-origin woff2 | Font hosts column; built CSS grep; curl 200 |
| 2. Lighthouse before/after | Table above: Google CSS no longer render-blocking; CLS 0.183→0.000 (/en mobile), 0.091→0.000 (/en/projects desktop); scores up on all 4 |
| 3. no visual change | H1 platform-font check + crops |
| 4. checks | above |
| 5. comments per code-comments.md | `nuxt.config.ts` `/** */` (why self-host, why `global`) replaces the obsolete `ui.fonts:false` comment; `tokens.css` `/** */` (why a hand-written fallback, why the unicode-range); WHY only, no `(#N)` refs |

## Supersedes
none.

## Still open
- Android has no Courier New: the fallback face doesn't match there, so the swap can still shift on Android (same as before this change, not worse).
- The fallback metrics were derived by @nuxt/fonts' own library (fontaine `getMetricsForFamily`) and hard-coded; @nuxt/fonts can't generate them here because the google provider's category fallback ("monospace") overrides `families[].fallbacks`.
- Production numbers (compression, CDN) not re-measured; that needs a deploy.

## Seal gate
none.
