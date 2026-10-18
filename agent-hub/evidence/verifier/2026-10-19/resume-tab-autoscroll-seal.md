# 2026-10-19 - resume-tab-autoscroll (verifier SEAL)

- Worker: verifier · Version: 0.1.0
- Node: `resume-tab-autoscroll` (IN_PROGRESS → SEALED)
- Implementer note: `evidence/implementer/2026-10-19/resume-tab-autoscroll-diff.md`
- Task (verbatim): "bổ sung tính năng / page resume, phần personal-info, khi press vào tự động scroll tới nó"
- Verdict: **SEAL** (the interpretation is flagged for the operator below)

## Isolation proof
This pass ran as a separate verifier subagent. Its task string was "You are the **verifier** worker ... Node: `resume-tab-autoscroll` ... You did NOT write this change — judge it independently." It used scratch dir `scratchpad/verifier-scroll` and server port 3458. The implementer used `scratchpad/scroll` and port 3457. This pass wrote its own browser script (`verifier-scroll/v.cjs`) instead of reusing the implementer's `scroll/t.cjs`.

## Re-run
`partial`: I re-ran build, lint and typecheck, and ran an independent CDP script. The reason is that the operator's spawn instruction explicitly asked for an independent re-run. This pass also widened the implementer's coverage, which tested only 1280 and 390, to 1440, 1024, 768 and 390. It also adds per-tab checks for all 5 tabs × click and key, plus the `?`, `c` and `d` keys.

Because this was an explicit re-run, I read `git diff` for `themes/portfolio-dev/pages/resumeObject/Index.vue` to build the checks. Doing so goes beyond the note-only default in the SOUL.

## Command / Output (Node v24.19.0, repo root)
- `npm run build`: exit 0. Output: `[nitro] ✔ You can preview this build using node .output/server/index.mjs` / `└  ✨ Build complete!`
- `npm run lint`: exit 0. Output: `> nuxt-app@1.2.9 lint` / `> eslint .`, with no findings.
- `npx nuxi typecheck`: exit 0, `error TS` count 0

## Browser verification
The script is `scratchpad/verifier-scroll/v.cjs`, with output in `out.txt` alongside it. It runs puppeteer-core with headless Chrome on a fresh `mkdtemp` profile against the prod build on `:3458`. It waits for `#__nuxt.__vue_app__` and covers widths {1440, 1024, 768, 390} × {`/`, `/en`}.

Result: **169 pass / 0 fail**.

For each tab, the expected final scroll is `min(spanAbsTop − 12 (scroll-mt-3), scrollHeight − innerHeight)`. Both values are measured after the scroll settles, so they reflect the new tab's layout and page height.

- **Click and key `1`–`5`, every tab, from the top of the page.** 80 of 80 checks pass. Every label matches the selected tab. Example at 1440/vi: skills and experiences end at scrollY=557 with the row at viewport y=4. About-me ends at 328, and educations and languages end at 177; these are clamped because the page ends. At 390/vi, all of about-me, skills and experiences land at 941 with the row at y=4, so on mobile the scroll lands on the content below the sidebar. Educations and languages land at 545 (clamped). A real mouse click via `page.click` on `2` passes in all 8 combinations.
- **Short → long (about-me → experiences).** At 1440, 1024 and 768 the check is discriminative: the old max scroll was 328 (612 at 768), and the result is 557 (849 at 768), which is above the old max. This confirms the `nextTick` fix. At 390 the target of 941 is below the old max of 992, so that check is non-discriminative but still passes.
- **Smooth scroll by default.** A sample taken 60ms after the click is mid-flight in all 8 combinations, for example 11 or 30 against a final 557.
- **Reduced motion.** With `prefers-reduced-motion: reduce` emulated, the page is already at its final position 30ms after the click (557/557, 849/849, 941/941).
- **File-tab row stays on one line.** The span is `display:flex`, 16px tall, inside a 33px row. The close icon's vertical midpoint is offset 0px from the label's, and the icon sits to the right of the text. Screenshot: `verifier-scroll/tab-390-vi.png` shows `experiences.pug ×` pinned at the top on one line.
- **No SSR or hydration console messages on `/` or `/en`.** There are 3 unrelated console errors on every load. They come from the CORS-blocked `.../api/me/<email>/visit` tracker fetch from the localhost origin, which is outside this diff.
- **`j`/`k`/`G`/`gg` still work.** j=80, k=0, G=max and gg=0 in all 8 combinations.
- **`?` still works.** It opens the help overlay, which lists `about-me.md` … `languages.json` under the page shortcuts, and a second `?` closes it.
- **`c` and `d` still work and do not scroll the page.** `c` fires one click on the `mailto:` link, with scrollY staying at 0→0. `d` fires the `generate-pdf` request (aborted by the script), with scrollY staying at 0.
- **Header position.** The header is `position: static`, so nothing overlaps the row when it is pinned at y=4.

## Acceptance criteria
| Criterion | Evidence |
|---|---|
| Click or `1`–`5` scrolls the file-tab row to the viewport top, clamped | 80/80 per-tab checks plus 8/8 real-mouse checks |
| On mobile the scroll lands on the content | At 390, row at y=4 for about-me, skills and experiences |
| Smooth by default, instant under reduced motion | 8/8 + 8/8 |
| Scroll uses the new tab's height, not the old | Discriminative short→long passes at 1440, 1024 and 768 |
| j/k/gg and other shortcuts unchanged | j/k/G/gg 8/8, `?` 16/16, c/d 16/16 |
| build + lint + typecheck clean | See the Command / Output section above |
| Comments follow code-comments.md | There are two one-line `//` comments, and each states a why: the mobile stacking and the old-height clamp |

Forbidden states: none hit. Seal gate: the change is uncommitted and not outward-facing, so no approval is needed. Proportionality: one file, a `select()` helper of about 7 lines, and a span wrapper, which is the minimum needed.

## Interpretation (flagged for the operator)
The operator wrote "press vào tự động scroll tới nó". This pass reads "press" as a click or the `1`–`5` key, and "nó" as the selected item's content (the editor pane). I judge this **defensible**. Scrolling to the sidebar item itself would be a no-op, since the item is what you just pressed. On mobile the content sits below the sidebar, so landing on the content is the useful reading.

There are two side effects the operator should know about:

1. On desktop, clicking a tab when the panel is already visible still nudges the page so the row is at the top.
2. Short tabs (educations, languages) cannot reach the top on desktop, so the row ends at about y=384. This is the correct clamp, but it may look like "didn't scroll all the way".
