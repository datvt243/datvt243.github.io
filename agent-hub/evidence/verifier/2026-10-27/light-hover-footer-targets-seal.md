# 2026-10-27 - light-hover-footer-targets (SEAL)

- Worker: verifier · Version: 0.1.0
- Node: `light-hover-footer-targets` (issue #327, branch `bug/327` off `staging` f733577, changes uncommitted)
- Note graded: `evidence/implementer/2026-10-27/light-hover-footer-targets-diff.md` (plan: `...-plan.md`)
- Verdict: **SEAL**

## Isolation proof
Separate Agent-tool verifier subagent, task string "You are the agent-hub **verifier** for the datvt243.github.io project, node `light-hover-footer-targets` (GitHub issue #327) ... Independently SEAL or REOPEN". The coordinator resumed it after a usage-limit pause ("pick up the #327 verification ... where you stopped"). This is not the implementer's context, and I did not use the implementer's :4189 server.

## Re-run
full: fresh build, lint, typecheck, `npm test`, and my own CDP/axe script on my own server (:4186). Reason: outward-facing UI change to shared theme tokens (`--theme-muted` is used by about 20 theme files) and to the footer, which is on every page.

## Commands + output (worktree; build and server env = `scratchpad/p0/mockenv.sh`, mock :4199 mode=ok)
```
npm run build → rc=0, "◆ ✨ Build complete in 13.3s!"
npm run lint → rc=0, "> eslint ." with no findings
npx nuxi typecheck → rc=0, no "error TS"
npm test → "Test Files  3 passed (3) / Tests  7 passed (7)" rc=0
server log (scratchpad/p1/v327-srv.log) grep -c onrender → 0
```

## CDP (:9888 incognito; `scratchpad/p1/v327.cjs`, output `scratchpad/p1/v327-out.txt`, screenshots `scratchpad/v327/`)
```
axe-core 4.10.2, target-size on: 7 pages (/, ?tab=about-me, /projects, /github, /blogs, /contact, /blogs/<id>) × light/dark × 1280/390 (390 = touch emulation) × /en and vi
  → only heading-order(moderate)x1 on the blog post body (backend content); SERIOUS/CRITICAL TOTAL 0
light muted text (computed color = --theme-muted, with own text, visible): 3-15 elements per page, worst 7.24:1 on rgb(248,250,252)
footer light 390  {"footerH":42,"docScrollW":390,"innerW":390,"links":["github:24x24@12-36","linkedin:24x24@40-64","@datvt243:87x24@291-378"]}
footer light 1280 {"footerH":42,"links":["github:24x24","linkedin:24x24","@datvt243:87x24"]}
footer dark 390/1280 → same sizes, footerH 42, color rgb(148,163,184) (dark muted, unchanged)
hover light /en/github name link: none/rgb(124,58,204) -> underline/rgb(127,73,189)
hover light /en/blogs read-more:  none/rgb(124,58,204) -> underline/rgb(127,73,189)
hover dark (both): none -> underline
```
Footer height check by arithmetic: before, py-2.5 (20px) + 20px link line + 2px border = 42. After, py-2 (16px) + 24px box + 2px border = 42. Icon spacing is also unchanged: before, a 16px icon plus a 12px gap is 28px; after, a 24px box plus a 4px gap is 28px. The label (`mr-2` + 4px gap) and the dot (`mx-2` + gap) still get 12px. In screenshots `v327-footer-{light,dark}-{390,1280}.png` the row is one line, nothing is clipped and there is no overflow. Full-page light screenshots (`v327-light-*.png`: home, about, projects, github, blogs, contact): muted text (dates, labels, footer) is a little darker and nothing else changed.

## Criteria
| Criterion | Result |
|---|---|
| 1. Light hover visibly different | met: both accent→accent-soft links now underline (grep: they are the only `hover:text-theme-accent-soft` links; other links change text → accent, a different hue) |
| 2. Light muted ≠ faint, both ≥ 4.5:1 | met: muted 71 85 105 (slate-600, worst 7.24:1 measured), faint 100 116 139 (axe 0 contrast hits). editor-dracula light already had distinct values (69 78 109 / 85 99 143), unchanged |
| 3. axe 0 serious/critical light+dark | met: 0 across 56 page loads, target-size on |
| 4. Footer links at 390 ≥ 24×24, icon size kept | met: 24×24, 24×24, 87×24; icons still `w-4 h-4`; bar 42px both widths |
| 5. build/lint/typecheck/test | met (this pass) |
| 6. comments per code-comments.md | met: the Footer doc-block lines give the WHY (WCAG 2.5.8, height kept), and the light.css token comment gives the reason for the value. No `(#N)`, no WHAT comments |

## Forbidden states / gate / proportionality
No forbidden state hit. Seal gate: none needed (no release, no push). The diff covers 4 source files plus the diagram row, all within #327's scope. The contact submit-button hover is correctly left under "Still open". No row for #327 was already open on the active diagram, so `## Supersedes: none` is correct.

## Not checked
Real-device touch (only emulation was used). Hover on the touch viewport (no hover state there). The production baseline height was not measured by me: the implementer's cited 42px matches my arithmetic.
