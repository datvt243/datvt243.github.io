# 2026-10-19 - resume-tab-autoscroll (implementer diff)

- Worker: implementer · Version: 0.1.0
- Node: `resume-tab-autoscroll` (IN_PROGRESS)
- Issue: #236 (follow-up) · Branch: `feature/236`
- Task (verbatim): "bổ sung tính năng / page resume, phần personal-info, khi press vào tự động scroll tới nó"
- Interpretation: "press" = click or the `1`–`5` shortcut (the key path ends in `click()`, so one handler covers both). "nó" = the selected item's content.
- Status: **sealed_pending_verifier**

## Hub bytes before
154650

## Diff
| File | Why |
|---|---|
| `themes/portfolio-dev/pages/resumeObject/Index.vue` | The `@click="active = s.key"` call becomes `select(s.key)`. `select` sets `active`, awaits `nextTick()`, then calls `fileTab.scrollIntoView({ block: 'start', behavior })`, where `behavior` is smooth unless `matchMedia('(prefers-reduced-motion: reduce)')` matches. The filetab slot content is wrapped in `<span ref="fileTab" class="flex items-center gap-2 scroll-mt-3">`, which keeps the row's flex layout. `scroll-mt-3` leaves the row's own `py-2` visible. The scroll target is the content's tab row rather than the panel, because the sidebar stacks above the content below `lg` (Panel.vue grid) |
| `agent-hub/haven/diagrams/dev-loop.prime-mermaid.md` | New row appended |

## Bug found during my own verification (fixed before handing over)
The first version had no `nextTick`. Going from about-me (short) to experiences (long) on desktop, the scroll stopped at the **old** page's max scroll: y=328 where y=557 was expected. `v-show` hadn't swapped the panes yet. Adding `await nextTick()` fixed it, and the same check then gave y=557.

## Command / Output (Node 24, repo root, after the fix)
- `npm run build` exit 0, `└  ✨ Build complete!`
- `npm run lint` exit 0
- `npx nuxi typecheck` exit 0, `error TS` count 0

## Browser verification
Setup: clean headless Chrome (fresh temp profile) against the prod build on `:3457`. Script `/private/tmp/claude-501/-Users--david-Workspace-Project-resume-datvt243-github-io/909a3f24-74c6-4b9c-819a-fc85ca8e1ff7/scratchpad/scroll/t.cjs`.

Result: **24 pass / 0 fail**, run on desktop 1280 and mobile 390, in vi and /en.

What the checks covered:
- Clicking `3` and pressing `4` both scroll to `min(tabRowTop - 4, maxScroll)` within 3px, and the right tab is selected.
- Short tabs (educations, languages) on desktop can't reach the top, because the page ends. This is expected clamping, not a miss.
- Smooth scroll is on by default: the row was at 559 mid-flight and 4 at rest.
- With reduced motion, the jump is instant.
- `j` still scrolls 80px and `gg` still returns to the top.

Screenshot: `/private/tmp/claude-501/-Users--david-Workspace-Project-resume-datvt243-github-io/909a3f24-74c6-4b9c-819a-fc85ca8e1ff7/scratchpad/scroll/mobile-after-4.png`.

## Not checked
Mouse users who click while the panel is already in view will still get a short scroll that aligns the row to the top. That is intended per the request, but it's a behaviour change worth the operator's eye.
