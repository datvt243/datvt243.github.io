# 2026-10-27 - font-self-host-cls (verifier)

- Worker: verifier · Version: 0.1.0
- Node: `font-self-host-cls` (#292, branch `feature/292`)
- New PM status: SEALED (row archived to `haven/diagrams/dev-loop-archive.md`; oldest pointer `deps-nuxt-4` dropped from the active file, its full row is already in the archive)

## Isolation proof
Separate Agent spawn as "verifier" for issue #292 with the operator's hard constraints (mock env, no prod, :4176/:4177/:4178 servers); the implementer wrote the diff in another pass. This pass wrote no product code.

## Reasoning
All commands re-run in the worktree with `scratchpad/p0/mockenv.sh` sourced (`NODE_API=http://localhost:4199 NUXT_PUBLIC_NODE_API=http://localhost:4199`).

| Criterion | Evidence (this pass) |
|---|---|
| 4. build/lint/typecheck/test | `npm run build` rc=0 `◆ ✨ Build complete in 14.1s!` (log: no `onrender`, only "error" hits are the `error-template.mjs`/`error-*.mjs` chunk names) · `npm run lint` → `> eslint .` rc=0, no output · `npx nuxi typecheck` rc=0, `grep -c 'error TS'` → 0 · `npm test` → `Test Files  4 passed (4)` / `Tests  10 passed (10)` |
| 1. no Google request, same-origin woff2 | Built `.output/public` + server chunks: 0 `googleapis`/`gstatic` hits; `.output/public/_fonts/` holds 6 woff2. CDP :9888, fresh contexts, `/en`: :4176 → 2 woff2 from `localhost:4176/_fonts/`, google reqs 0; :4177 → 0 woff2 (local Fira Code), google reqs 0; :4178 baseline → 2 woff2 from `fonts.gstatic.com` + css2 (3 google reqs). :4176 entry CSS has 0 `local(Fira Code…)` (vs 30 on :4177), so its run is a real swap |
| 2. Lighthouse (spot-check, median of 3, `scratchpad/vlh.sh`) | :4178 `/en` mobile: score 46, LCP 9.55s, CLS 0.183 (runs 0.183/0.209/0.183), render-blocking `entry.css` + `fonts.googleapis.com/css2` · :4176 `/en` mobile: 60, LCP 6.84s, CLS 0.000 ×3, render-blocking `entry.css` only · :4178 `/en/projects` desktop: 85, CLS 0.091 ×3, googleapis render-blocking · :4176 `/en/projects` desktop: 92, CLS 0.000 ×3, `entry.css` only. Matches the note's table. Server logs `grep -c onrender`: `/private/tmp/s292a.log` (4178) 0, `p1/srv4177.log` 0, `p1/srv4176.log` 0; all three processes run with the mock env |
| 3. fallback face valid + no visual change | `fontaine.getMetricsForFamily` (installed) recomputed: Fira Code ascent 1980/descent −644/upm 2000, Courier New xWidthAvg 1229/2048 → `generateFontFace` emits exactly `size-adjust: 99.9837%; ascent-override: 99.0161%; descent-override: 32.2052%; line-gap-override: 0%`. `CSS.getPlatformFontsForNode(h1)` "Võ Tấn Đạt": :4176 dark and light → Fira Code (custom) ×8 + `.SF NS` ×2; baseline :4178 identical; never Courier New. Screenshots `scratchpad/v292-{4176-dark,4176-light,4177-dark,4178-dark}.png`: same layout and glyphs (baseline still shows `_blogs`, pre-#331) |
| deleted file | `grep -rn -E 'font-face\.scss\|fira-code'` outside node_modules/.output/.nuxt/evidence/.git → only the diagram row |
| 5. comments per code-comments.md | `nuxt.config.ts` and `tokens.css` add one `/** */` block each, multi-sentence, WHY only (render-blocking second origin, why `global`, why hand-written fallback, why the unicode-range), no `(#N)` |

Forbidden states: none hit. Proportionality: 3 product files, all required by the task. Seal gate: none (no outward-facing action). Supersedes: no other #292 row on the active diagram.

Non-blocking: the diff note merges `## Command`/`## Output` into `## Commands + output` and has no `## Noticed, not done` (it uses `## Still open`). The last SEALed notes (`blog-off-nav`, `github-no-retry-5xx`) use the same layout, so this isn't treated as a gap.

## Re-run
full: the operator required it for this node (font loading change on every page, Lighthouse claims). Re-ran build, lint, typecheck, test, CDP and a Lighthouse subset (2 of the 4 page/form-factor pairs).
