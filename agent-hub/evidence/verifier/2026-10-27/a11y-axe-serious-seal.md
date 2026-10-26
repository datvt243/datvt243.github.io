# 2026-10-27 - a11y-axe-serious (verifier: SEAL)

- Worker: verifier · Version: 0.1.0
- Node: `a11y-axe-serious` (issue #288), branch `bug/288` off `staging` d40caec, uncommitted worktree
- Notes graded: `evidence/implementer/2026-10-27/a11y-axe-serious-{plan,diff}.md`
- Verdict: **SEAL**

## Isolation proof
Spawned as a separate Agent-tool subagent with the task string "You are the agent-hub **verifier** ... node `a11y-axe-serious` (GitHub issue #288) ... Verify yourself; don't trust their numbers." The implementer pass had a different context; this pass wrote none of the diff.

## Re-run
`full`: build, lint, typecheck, `npm test` and the CDP/axe sweep re-run by me on a fresh build. Reason: outward-facing change (colour tokens on every page of the production site), and the operator asked for independent numbers. The implementer's note gave `rc=0` for build/lint/typecheck rather than output, so the verbatim output below is mine.

## Commands (worktree; `source scratchpad/p0/mockenv.sh` before build and server: NODE_API=NUXT_PUBLIC_NODE_API=http://localhost:4199)
```
npm run build        → rc=0  "◆ ✨ Build complete in 18.6s!"
npm run lint         → rc=0  "> nuxt-app@1.5.1 lint / > eslint ." (no findings)
npx nuxi typecheck   → rc=0  (no errors; last lines are the Nuxt Icon info messages)
npm test             → rc=0  "Test Files  3 passed (3) / Tests  7 passed (7)"
```
Server: `PORT=4187 node .output/server/index.mjs`. `grep -c onrender scratchpad/p1/v288-srv.log` = **0**. Server stopped afterwards; mock left in `ok` mode.

## Browser: axe-core 4.10.2 via CDP :9888, incognito (my runner `scratchpad/p1/v288-axe.cjs`, default rules + `target-size`; 390 runs with isMobile/hasTouch)
7 pages (`/`, `/?tab=about-me`, `/projects`, `/github`, `/blogs`, `/contact`, `/blogs/67123bdf9c6e9bcf4f7bf006`) × dark/light × 1280/390 × vi/`/en` = 56 runs. Full output: `scratchpad/p1/v288-axe.txt`.
```
combos=56 serious_or_critical_rules=0
```
- The only violation left: `heading-order(moderate)x1` on the blog post, in all 8 of its runs. The post body HTML comes from the blog backend, and the implementer lists this under Still open.
- Colour mode applied: `<html>` class is `dark`/`light` as requested in every run.
- h1, one per page, correct in both locales: vi "Dự án" / "Github" / "Liên hệ", en "Projects" / "Github" / "Contact me". `/` = "Võ Tấn Đạt"; `/blogs` = "_blog".
- /github repo icon links: 38 named links. en labels are "datvt243.github.io website" and "datvt243.github.io on GitHub"; vi labels are "Website datvt243.github.io" and "datvt243.github.io trên GitHub".

Hover states, which axe cannot see on its own (`scratchpad/p1/v288-hover.cjs`, element hovered, then axe `color-contrast` scoped to it; `/en` 1280). All pass, no violations:
| mode | element | hover fg/bg | ratio |
|---|---|---|---|
| light | /contact submit (`hover:bg-theme-accent-soft`) | #ffffff/#7f49bd | 5.84 |
| light | / Download CV (`hover:bg-theme-accent`) | #ffffff/#c2410c | 5.17 |
| light | / Contact me (`hover:text-theme-accent`) | #c2410c/#ffffff | 5.17 |
| light | /github user link (`hover:text-theme-accent-soft`) | #7f49bd/#eeeef0 | 5.04 |
| light | /blogs post link | #7c3acc/#f8f8f2 | 5.9 |
| dark | /contact submit | #282a36/#cfb1f7 | 7.65 |
| dark | / Download CV | #020617/#fb923c | 8.91 |
| dark | /github user link | #cfb1f7/#363848 | 6.21 |

Screenshots: `scratchpad/p1/v288-{dark,light}-{home,about,github,contact,blogs}.png`. I viewed light-about, dark-github and light-contact. The layout is unchanged. About-me links are underlined and readable. The light accent button reads clearly with white text, and the dark /github repo cards look normal.

## Acceptance
| Criterion | Evidence |
|---|---|
| 1. axe 0 serious/critical on `/`, `/projects`, `/github`, `/blogs`, `/contact`, light+dark (issue) | `combos=56 serious_or_critical_rules=0`, which also covers `/?tab=about-me`, a post, both locales and both widths |
| Issue sub-items: #6272a4 contrast, link-in-text-block, 40 unnamed icon links, h1 on /contact and /github | All gone in the sweep. Icon links are named, and h1 is present (shown above) |
| Issue sub-item: footer touch targets | Not resized. axe `target-size` (enabled, touch emulation at 390) reports no violation, so this is within the axe acceptance. The diff note lists it under Still open as a design choice |
| 2. No visual regression | Screenshots and hover table above |
| 3. build/lint/typecheck/`npm test` | Commands above |
| 4. comments per code-comments.md | Each changed token comment gives a WHY: the ratio it failed or now reaches. The AboutMe doc comment says why links are underlined. There are no `(#N)` refs or narrated history. `/* = faint */` on code-comment/line-number follows the existing `= accent` convention for linked tokens |

- 7b: no other open row for #288 on the active diagram, so `Supersedes: none` is correct.
- Forbidden states: none hit. All work stayed in the worktree, there was no commit or push, and no call went to the real resume backend from my server.
- Seal gate: not outward-facing in the gate sense (no deploy or publish), and none is required.
- Proportionality: the header `nav` aria-label (moderate `landmark-unique`) and the tag-badge `accentBadgeUi` (serious contrast) both came out of the axe sweep. Each is one line, in scope.

## Noticed, not blocking
- In light mode inside the editor panel, `--theme-accent-soft` (127 73 189) is now almost the same as `--theme-accent` (124 58 204). Hover feedback on links like the /github user name is barely visible: measured 124,58,204 → 127,73,189. It is legible but subtle. A follow-up could use an underline or a darker shade on hover if wanted.
- Light `--theme-faint` now equals `--theme-muted` (both slate-500), so those two text levels are no longer distinguishable in light mode.
- The implementer's note gave `rc=0` for build/lint/typecheck instead of output lines. The verbatim output is covered by this note.
