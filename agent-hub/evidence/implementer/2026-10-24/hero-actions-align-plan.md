# 2026-10-24 - hero-actions-align (plan)

- Worker: implementer · Version: 0.1.0
- Node: `hero-actions-align` (new row appended BEFORE any code edit; slug grepped in archive → 0)
- Task (verbatim): "tôi thấy 3 button Đang tìm việc, Liên hệ và Tải CV đang lệch, hãy điều chỉnh luôn" — plus mid-task follow-up "opentowork hãy cho màu xanh lá". Issue #269 (https://github.com/datvt243/datvt243.github.io/issues/269), branch `bug/269` off `staging` @ `603f1e1`, git worktree `scratchpad/wt-269`.

## Hub bytes before: 76703
(measured on `staging` state at worktree creation, same file set as the other 2026-10-24 nodes; the worktree's own diagram row adds ~800 B)

## Root cause (measured on unmodified `staging`, `nuxi dev`, CDP, `scratchpad/cdp-hero.cjs`)
```
1440px /: chip{top:26 mid:41 h:30 left:0}  contact{top:22 mid:37 h:30 left:159}  cv{top:22 mid:37 h:30 left:299}
768px /:  chip{top:237 mid:252 h:30 left:0}  contact{top:233 mid:248 ...}  cv{top:233 mid:248 ...}
390px /:  chip{top:217 mid:232 h:30 left:0}  contact{top:213 mid:228 ...}  cv{top:263 mid:278 h:30 left:8}
```
- Chip sits 4px lower at every width: the three are sibling `inline-flex` boxes in normal inline flow → aligned on text baseline; the chip (dot + text, no icon/kbd) has a different baseline than the icon+kbd buttons, though all are 30px tall.
- 390px: wrapped "Tải CV" keeps its `ml-2` → starts 8px right of the chip; rows 50px apart (per-item `mt-4`).
- Screenshot: `scratchpad/shots/before-390.png`.

## Plan
`Hero.vue`: wrap the 3 items in `<div class="flex flex-wrap items-center gap-2 mt-4">`, remove `mt-4`/`ml-2` from each. Follow-up: green chip via a new semantic token (no literal colors — theme rule), not `--theme-code-key` (green only inside Dracula `.editor-scope`).

## Blockers
none
